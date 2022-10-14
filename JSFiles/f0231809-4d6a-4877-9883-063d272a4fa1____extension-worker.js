/* eslint-env worker */

const ArgumentType = require('../extension-support/argument-type');
const BlockType = require('../extension-support/block-type');
const dispatch = require('../dispatch/worker-dispatch');
const log = require('../util/log');
const TargetType = require('../extension-support/target-type');
const {isWorker} = require('./tw-extension-worker-context');

const loadScripts = url => {
    let u=['coreExample', 'lazyAudio', 'canvas', 'yun', 'js', 'jsonfetch', 'astar', 'three', 'box2d', 'ws', 'community', 'community2', 'yx', 'set', 'pen', 'wedo2', 'music', 'microbit', 'text2speech', 'translate', 'videoSensing', 'ev3', 'makeymakey', 'boost', 'gdxfor', 'tc', 'touch', 'tw'];
    if(typeof url!=='object' && u.indexOf(url)===-1 && !url.startsWith('blob:') && !url.startsWith('http')){
        url='https://newsccode-1302921490.cos.ap-shanghai.myqcloud.com/ext/'+url+'.js'
    }
    if (isWorker) {
        importScripts(url);
    } else {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Error when loading custom extension script: ${url}`));
            if(typeof url==='object')
            script.innerText=url.data
            else
            script.src = url;
            document.body.appendChild(script);
        });
    }
};

class ExtensionWorker {
    constructor () {
        this.nextExtensionId = 0;

        this.initialRegistrations = [];

        this.firstRegistrationPromise = new Promise(resolve => {
            this.firstRegistrationCallback = resolve;
        });

        dispatch.waitForConnection.then(() => {
            dispatch.call('extensions', 'allocateWorker').then(async x => {
                const [id, extension] = x;
                this.workerId = id;

                try {
                    await loadScripts(extension);
                    await this.firstRegistrationPromise;

                    const initialRegistrations = this.initialRegistrations;
                    this.initialRegistrations = null;

                    Promise.all(initialRegistrations).then(() => dispatch.call('extensions', 'onWorkerInit', id));
                } catch (e) {
                    log.error(e);
                    dispatch.call('extensions', 'onWorkerInit', id, `${e}`);
                }
            });
        });

        this.extensions = [];
    }

    register (extensionObject) {
        const extensionId = this.nextExtensionId++;
        this.extensions.push(extensionObject);
        const serviceName = `extension.${this.workerId}.${extensionId}`;
        const promise = dispatch.setService(serviceName, extensionObject)
            .then(() => dispatch.call('extensions', 'registerExtensionService', serviceName));
        if (this.initialRegistrations) {
            this.firstRegistrationCallback();
            this.initialRegistrations.push(promise);
        }
        return promise;
    }
}

global.Scratch = global.Scratch || {};
global.Scratch.ArgumentType = ArgumentType;
global.Scratch.BlockType = BlockType;
global.Scratch.TargetType = TargetType;

/**
 * Expose only specific parts of the worker to extensions.
 */
const extensionWorker = new ExtensionWorker();
global.Scratch.extensions = {
    register: extensionWorker.register.bind(extensionWorker)
};
