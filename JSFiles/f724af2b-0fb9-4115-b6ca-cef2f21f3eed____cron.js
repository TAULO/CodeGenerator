'use strict';
const periodic = require('periodicjs');
const logger = periodic.logger;
const Promisie = require('promisie');
const path = require('path');
const https = require('https');
const fs = require('fs-extra');
const os = require('os');
const luxon = require('luxon');
const CoreControllerModule = require('periodicjs.core.controller');
const cronMap = new Map();
const CronJob = require('cron').CronJob;
const appEnvironment = periodic.settings.application.environment;

function getCronFilePath(assetFilename) {
  const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
  const cronPath = extensionSettings.filePaths.cronPath;
  return  path.join(cronPath, assetFilename);
}

function downloadRemoteFiles(options) {
  const { crons=[], } = options;
  const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
  const cronPath = extensionSettings.filePaths.cronPath;
  return new Promise((resolve, reject) => { 
    try {
      fs.ensureDir(cronPath)
        .then(() => { 
          const remoteFiles = crons.filter(cron => cron.asset && cron.asset.locationtype !== 'local');
          if (remoteFiles.length) {
            Promisie.map(remoteFiles.map(cron => cron.asset), 5, asset => {
              const writeStream = fs.createWriteStream(path.join(cronPath, asset.attributes.periodicFilename));
              writeStream.on('finish', () => {
                return true;
              });
              https.get(`/extension/crons/secure-asset/${asset._id}/${asset.attributes.periodicFilename}`, res => { 
                res
                  .pipe(writeStream)
                  .on('end', () => {
                    logger.debug('File Stream downloaded end event', asset.attributes.periodicFilename);
                  })
                  .on('close', () => {
                    logger.debug('File Stream downloaded end close', asset.attributes.periodicFilename);
                  })
                  .on('finish', () => {
                    logger.debug('File Stream downloaded end finish', asset.attributes.periodicFilename);
                  })
                  .on('error', e => {
                    reject(e);
                  });
              });
            })
              .then(resolve)
              .catch(reject);
          } else {
            resolve(crons);
          }
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

function runRemoteFiles(options) {
  return new Promise((resolve, reject) => { 
    try {
      const { crons, } = options;
      const cron = crons[ 0 ];
      const CACHE = require.cache;
      const cronFnPath = getCronFilePath(cron.asset.attributes.periodicFilename);
      delete CACHE[ cronFnPath ];
      const cronModule = require(cronFnPath);
      resolve(cronModule.script(Object.assign({}, cron.runtime_options)));
    } catch(e){
      reject(e);
    }
  });
}

function cleanupCronFiles(options) {
  return new Promise((resolve, reject) => {
    try {
      const { crons, } = options;
      const cron = crons[ 0 ];
      const cronFnPath = getCronFilePath(cron.asset.attributes.periodicFilename);
      resolve(fs.remove(cronFnPath));
    } catch (e) {
      reject(e);
    }
  });
}

const cronStatuses = {
  idle:'0 idle',
  running:'1 running',
  complete:'2 complete',
};

function cronCompleteFunction(options) {
  const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
  const { cron, } = options;
  const CronHostDatas = periodic.datas.get('standard_cronhoststatus');
  const hostname = os.hostname();
  const cron_id = cron._id;
  const pid = process.pid.toString();
  
  return function onComplete() {
    const cronMapObject = cronMap.get(cron_id.toString());
    // console.log('RUNNING ON COMPLETE FUNCTION', {
    //   cron_id,
    //   pid,
    //   hostname,
    // });
    let cronHostUpdateDoc = {};
    if (extensionSettings.use_cron_host_status && cronMapObject) {
      CronHostDatas.load({
        query: {
          cron_id,
          pid,
          hostname,
        },
      })
        .then(cronHostStatus => {
          cronHostUpdateDoc = cronHostStatus.toJSON();
          const complete_time = new Date();
          const end = luxon.DateTime.fromJSDate(complete_time);
          const start = luxon.DateTime.fromJSDate(new Date(cronHostUpdateDoc.start_time));
          const duration = end.diff(start).toObject();
          // console.log({ duration });
          return CronHostDatas.update({
            id: cronHostUpdateDoc._id,
            updatedoc: {
              cron_name:null,
              cron_id:null,
              cron_interval:null,
              cron_interval_pretty:null,
              status:cronStatuses.idle,
              complete_time,
              duration,
            },
            isPatch:true,
          });
        })
        .then(() => { 
          periodic.logger.debug(`Completed cron ${cron.name} on ${hostname}(pid:${pid})`);
          this.start();//restart job
        })
        .catch(periodic.logger.error);
    } else if(cronMapObject) {
      periodic.logger.debug(`Completed cron ${cron.name} on ${hostname}(pid:${pid})`);
      this.start();//restart job

    } else {
      periodic.logger.warn('missing cronMapObject');
    }
  };
}

function randomDelayPromise() {
  return new Promise((resolve, reject) => {
    const randomDelay = Math.random() * 1000;
    const t = setTimeout(() => {
      resolve(true);
    }, randomDelay);
  });
}

function availableHostsReducer(result, val) { 
  const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
  if (extensionSettings.available_hostnames.indexOf(val.hostname)>-1) {
    result[ val.hostname ] = (typeof result[ val.hostname ] === 'undefined')
      ? 0 + ((val.status === cronStatuses.idle) ? 1 : 0)
      : (val.status === cronStatuses.idle)
        ? result[ val.hostname ] + 1
        : result[ val.hostname ];
  }
  return result;
}

function cronTickFunction(options) {
  const { fn, cron, runtimeArgs, } = options;
  const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
  const CronHostDatas = periodic.datas.get('standard_cronhoststatus');
  const hostname = options.hostname || os.hostname();
  const pid = process.pid.toString();
  // let masterProcessId = periodic.config.process.masterProcessId;
  const cron_id = cron._id;
  const cron_name = cron.name;
  const cron_interval = cron.cron_interval;
  const numWorkers = options.numWorkers || periodic.settings.application.number_of_clusters || os.cpus().length;
  let cronHostUpdateDoc = {};
  let selectedHost;
  
  return function onTick() {
    // console.log('RUNNING ON TICK FUNCTION', { pid, hostname, masterProcessId });
    const cronThisContext = this;

    if (extensionSettings.use_cron_host_status) {
      //pull all host datas
      randomDelayPromise()
        .then(() => {
          return CronHostDatas.search({
            query: {
              environment: appEnvironment,
            },
            sort: {
              hostname: 1,
              status: 1,
              start_time: 1,
              complete_time: 1,
              pid:1,
              master_pid:1,
            },
          });
        })
        .then(cronHosts => {
          const allHosts = cronHosts;
          const hostnamePidCounts = allHosts
            .reduce(availableHostsReducer, {});          
          if (extensionSettings.run_on_last_process===false && hostnamePidCounts[ hostname ] !== numWorkers) {
            delete hostnamePidCounts[ hostname ];
          }
          const sortedPreferredHosts = Object.keys(hostnamePidCounts)
            .sort() // sort alphabetically  
            .sort((a, b) => hostnamePidCounts[ b ] - hostnamePidCounts[ a ])
            .filter(hCount => hostnamePidCounts[ hCount ] > 0);
          if (sortedPreferredHosts.length) {
            selectedHost = allHosts.filter(host => host.hostname === sortedPreferredHosts[ 0 ])[ 0 ];
          }
          // console.log({hostnamePidCounts,sortedPreferredHosts,selectedHost})
          if (selectedHost && selectedHost.hostname !== hostname) {
            logger.verbose(`Cron(${cron_name}) not available on hostname:${hostname} has ${numWorkers} processes but only ${hostnamePidCounts[ hostname ]} available`, {
              hostnamePidCounts,
              selectedHost,
            });
          }
          cronMap.set('lastSelectedHost', {
            lastRunCron: cron,
            date: new Date(),
            selectedHost: (selectedHost) ? {
              hostname: selectedHost.hostname,
              pid: selectedHost.pid,
            } : undefined,
          });
          return selectedHost;
        })
        .then(cronHostStatus => {
          // console.log({ cronHostStatus });
          if(!cronHostStatus) throw new Error('No available hosts to run cron', cron);
          cronHostUpdateDoc = (typeof cronHostStatus.toJSON === 'function')
            ? cronHostStatus.toJSON()
            : cronHostStatus;
          
          if (cronHostUpdateDoc.hostname === hostname && cronHostUpdateDoc.pid === pid && useCronHosts()) {
            CronHostDatas.update({
              id: cronHostUpdateDoc._id,
              updatedoc: {
                status:cronStatuses.running,
                cron_id,
                cron_name,
                cron_interval,
                start_time: new Date(),
                // complete_time,
                // duration,
              },
              isPatch:true,
            });
            // console.log(`Running cron ${cron.name} on ${hostname}(pid:${pid})`);
            periodic.logger.debug(`Running cron ${cron.name} on ${hostname}(pid:${pid})`);
            return fn.call(cronThisContext, runtimeArgs);
          } else {
            return function passableCronFunction(){
              // console.log(`Not running cron ${cron.name} on ${hostname}(pid:${pid}) | selected (${cronHostUpdateDoc.hostname} + ${cronHostUpdateDoc.pid})`);
              periodic.logger.debug(`Not running cron ${cron.name} on ${hostname}(pid:${pid}) | selected (${cronHostUpdateDoc.hostname} + ${cronHostUpdateDoc.pid})`);
            }();
          }
        })
        .catch(periodic.logger.error);
    } else {
      periodic.logger.debug(`Running cron ${cron.name} on ${hostname}(pid:${pid})`);
      return fn.call(cronThisContext, runtimeArgs);
    }
  };
}

function createCronJob(cron) {
  const containerName = periodic.settings.container.name;
  const modulePath = (cron.asset)
    ? getCronFilePath(cron.asset.attributes.periodicFilename)
    : undefined;
  let cronFunction;
  if (cron.internal_function) {
    cronFunction = periodic.locals.extensions.get('periodicjs.ext.cron_service').automation[ cron.internal_function ]
      ? periodic.locals.extensions.get('periodicjs.ext.cron_service').automation[ cron.internal_function ]
      : periodic.locals.container.get(containerName).crons[ cron.internal_function ];
  }
  const runtimeArgs = Object.assign({},
    cron.runtime_options);
  const fn = (cron.internal_function)
    ? cronFunction //.bind(null, runtimeArgs)
    : require(modulePath).script(periodic);//.bind(null, runtimeArgs);
  // console.log({ fn, });
  const task = new CronJob({
    cronTime: cron.cron_interval,
    onTick: cronTickFunction({ fn, cron, runtimeArgs, }),
    onComplete: cronCompleteFunction({ cron, }),
    timeZone: cron.time_zone,
    start: false,
  });
  // task.addCallback(cronCompleteFunction({ cron, }));
  return task;
}

const check_cluster_safe_check = function(periodic) {
  let cluster_safe = true;
  let config_file_path = path.resolve(__dirname, `../../../content/config/environment/${appenvironment}.json`);
  let config_settings;
  let original_config_settings;
  let cron_service_hostname_settings = periodic.app.controller.extension.cron_service.settings.disable_cluster_hostnames;
  let hostname_matched_filter = false;
  let hostname = os.hostname();

  if (cron_service_hostname_settings && Array.isArray(cron_service_hostname_settings) && cron_service_hostname_settings.length > 0) {
    cron_service_hostname_settings.forEach(hostname_filter => {
      if (hostname.search(new RegExp(hostname_filter, 'gi')) !== -1) {
        hostname_matched_filter = true;
      }
    });
  }

  fs.readJsonAsync(config_file_path)
    .then(config_file_path_json => {
      original_config_settings = Object.assign({}, config_file_path_json);
      config_settings = Object.assign({}, config_file_path_json);
      if (hostname_matched_filter && config_file_path_json.cluster_process) {
        config_settings.cluster_process = false;
        return fs.outputJsonAsync(config_file_path, config_settings, { spaces: 2, });
      }
    })
    .then((outputJsonResult) => {
      if (hostname_matched_filter && original_config_settings.cluster_process) {
        periodic.logger.warn(`Cron Service cannot run in a clustered environemt, fixing content/config/environment/${appenvironment}.json and restarting Periodicjs`);
        periodic.core.utilities.restart_app({ callback: function() {}, });
      }
      // else {
      // 	console.log('hostname',hostname,'hostname_matched_filter', hostname_matched_filter, 'config_settings.cluster_process', config_settings.cluster_process, 'do not restart app');
      // }
    })
    .catch(e => periodic.logger.error(e));
};

function encryptCronFile(cron) {
  return new Promise((resolve, reject) => {
    resolve(cron);
  });
}

function decryptCronFile(cron) {
  return new Promise((resolve, reject) => {
    resolve(cron);
    // const cronFnPath = getCronFilePath(cron.asset.attributes.periodicFilename);
    // fs.stat(cronFnPath).then(() => {
    //   let signData = new Buffer(file.trim()).toString('base64');
    //   let sign = crypto.createSign('RSA-SHA256');
    //   sign.update(signData);
    //   let signature = sign.sign(pemfile, 'hex');
    //   if (signature === cron.asset_signature) {
    //     result.push(cron);
    //     eachcb(null, 'success');
    //   } else {
    //     logger.warn(`Asset ${cron.name} is unsigned and will not be loaded`);
    //     result.push(false);
    //     eachcb(null, 'failed');
    //   }
    // });
  });
}

function digestCronDocument(options) {
  return new Promise((resolve, reject) => {
    try {
      const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
      const { req, cron, } = options;
      const cronObj = cronMap.get(cron._id.toString()) || {};
      if (!cronObj.task) {
        const task = createCronJob(cron);
        cronObj.cron = cron;
        cronObj.task = task;
        cronObj.active = cron.active;
      }
      // console.log({ cronObj, cron, extensionSettings});
      if (cron.active && extensionSettings.cronCheckFileEnabled) {
        logger.silly('STARTING CRON');
        cronObj.task.start();
      } else if (cron.active === false) {
        logger.silly('STOPPING CRON');
        cronObj.task.stop();
      }
      const updatedCronObj = {
        cron,
        task: cronObj.task,
        active: cron.active,
      };
      cronMap.set(cron._id.toString(), updatedCronObj);
      resolve(cron);
    } catch (e) {
      reject(e);
    }
  });
}

function findCronsForInitialization(options) {
  return new Promise((resolve, reject) => {
    try {
      const isForked = typeof process.send === 'function' || process.env.FORKED_CRON_PROCESS;
      if (isForked) { 
        periodic.logger.debug('Skipping crons because of cron on forked process');
        return resolve([]);
      } else if (periodic.settings.extensions[ 'periodicjs.ext.cron_service' ].cronCheckFileEnabled && fs.existsSync(periodic.settings.extensions[ 'periodicjs.ext.cron_service' ].filePaths.useCronCheckFile) === false) {
        periodic.logger.debug('Skipping crons because of cron file check');
        return resolve([]);
      }
      const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
      const validate_container = extensionSettings.validate_container;
      const CronDatas = periodic.datas.get('standard_cron');
      CronDatas.query({
        query: (typeof validate_container === 'string') ? {
          $and: [{
            active: true,
          }, {
            container: validate_container,
          }, ],
        } : {
          active: true,
        },
        limit: 10000,
        population: 'asset',
      })
        .then(resolve)
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

function useCronHosts(options) {
  const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
  const hostname = os.hostname();
  return extensionSettings.use_cron_host_status && extensionSettings.available_hostnames.indexOf(hostname) > -1;
}

function configureCronHostStatus(options) {
  return new Promise((resolve, reject) => {
    try {
      // console.log('periodic.settings',periodic.settings)
      const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
      const CronHostDatas = periodic.datas.get('standard_cronhoststatus');
      // const numWorkers = periodic.settings.application.number_of_clusters || os.cpus().length;
      const hostname = os.hostname();
      const pid = process.pid;
      let masterProcessId =             periodic.config.process.masterProcessId;

      if (extensionSettings.use_cron_host_status) {
        new Promise((resolveInner, rejectInner) => {
          if (periodic.config.process.isClustered !== true) {
            masterProcessId = process.pid;
            resolveInner(process.pid);
          } else if(masterProcessId){
            return resolveInner(masterProcessId);
          } else{
            periodic.status.on('clustered-process-master-process-id', masterProcessIdFromMasterMsg=>{
              // console.log('waiting on masterpid',masterProcessIdFromMasterMsg)
              masterProcessId = masterProcessIdFromMasterMsg;
              return resolveInner(masterProcessIdFromMasterMsg);
            });
          }
        })
          .then(() => {
            const query = {
              hostname,
              master_pid: {
                $ne: masterProcessId.toString(),
              },
            };
            return CronHostDatas.search({
              query,
              sort: { createdat: -1, },
            });
          })
          .then(existingHostCrons => {
            if (Array.isArray(existingHostCrons) && existingHostCrons.length) {
              // console.log({existingHostCrons})
              const cronHostIds = existingHostCrons.map(cronhost => cronhost._id.toString());
              // console.log({ cronHostIds,  });
              return Promisie.map(cronHostIds, 5, cronhostId => {
                return CronHostDatas.delete({ deleteid: cronhostId, });
              });
            } else return true;
          })
          .then(() => {
            resolve(CronHostDatas.create({
              newdoc: {
                hostname,
                pid,
                environment: appEnvironment,
                master_pid:masterProcessId.toString(),
                status:cronStatuses.idle,
              },
            }));
          })
          .catch(reject);
      } else {
        resolve(true);
      }
    } catch (e) {
      reject(e);
    }
  });
}

function initializeCrons(options = {}) {
  return new Promise((resolve, reject) => { 
    try {
      const extensionSettings = periodic.settings.extensions[ 'periodicjs.ext.cron_service' ];
      if (cronMap instanceof Map) { //$p.locals.extensions.get('periodicjs.ext.cron_service').cron.initializeCrons({ skipHosts:true,  })
        // periodic.logger.silly('checking cronMap');
        cronMap.forEach((cronObj, cron_id) => { 
          // periodic.logger.silly('Stopping task in ' + cron_id);
          cronObj.task.running = false;
          clearTimeout(cronObj.task._timeout);
        });
      }
      Promise.resolve()
        .then(() => {
          if (options.skipHosts) {
            return true;
          } else {
            return configureCronHostStatus();
          }
        })
        .then(status => {
          return findCronsForInitialization();
        })
        .then(crons => downloadRemoteFiles({ crons, }))
        .then(crons => {
          if (Array.isArray(crons) && crons.length) {
            return Promisie.map(crons, 10, cron => {
              return decryptCronFile(cron);
            });
          } else {
            return [];
          }
        })
        .then(crons => {
          const intializedCrons = crons.map(cronDoc => {
            const cron = cronDoc.toJSON();
            const task = createCronJob(cron);
            const cronObj = {
              cron,
              task,
              active: cron.active,
            };
            cronMap.set(cron._id.toString(), cronObj);
            if (cron.active && extensionSettings.cronCheckFileEnabled) {
              task.start();
            }
            return cronObj;
          });
          resolve(intializedCrons.map(cronOb => ({
            _id: cronOb.cron._id.toString(),
            name: cronOb.cron.name,
            cron_interval: cronOb.cron.cron_interval,
          })));
        })
        .catch(e => {
          logger.warn('Error starting crons', e);
          reject(e);
        });
    }	catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  getCronFilePath,
  downloadRemoteFiles,
  runRemoteFiles,
  digestCronDocument,
  initializeCrons,
  configureCronHostStatus,
  findCronsForInitialization,
  decryptCronFile,
  encryptCronFile,
  check_cluster_safe_check,
  createCronJob,
  cronTickFunction,
  randomDelayPromise,
  cronCompleteFunction,
  cronStatuses,
  cleanupCronFiles,
  useCronHosts,
  cronMap,
};