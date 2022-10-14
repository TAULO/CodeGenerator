/**
 * Created by dinusha on 7/28/2016.
 */
var redis = require("ioredis");
var config = require('config');
var Redlock = require('redlock');
var logger = require('../LogHandler/CommonLogHandler').logger;
var dbmodel = require('dvp-dbmodels');

var redisip = config.Redis.ip;
var redisport = config.Redis.port;
var redispass = config.Redis.password;
var redismode = config.Redis.mode;
var redisdb = config.Redis.db;



var redisSetting =  {
    port:redisport,
    host:redisip,
    family: 4,
    password: redispass,
    db: redisdb,
    retryStrategy: function (times) {
        var delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError: function (err) {

        return true;
    }
};

if(redismode == 'sentinel'){

    if(config.Redis.sentinels && config.Redis.sentinels.hosts && config.Redis.sentinels.port && config.Redis.sentinels.name){
        var sentinelHosts = config.Redis.sentinels.hosts.split(',');
        if(Array.isArray(sentinelHosts) && sentinelHosts.length > 2){
            var sentinelConnections = [];

            sentinelHosts.forEach(function(item){

                sentinelConnections.push({host: item, port:config.Redis.sentinels.port})

            })

            redisSetting = {
                sentinels:sentinelConnections,
                name: config.Redis.sentinels.name,
                password: redispass
            }

        }else{

            console.log("No enough sentinel servers found .........");
        }

    }
}

var client = undefined;

if(redismode != "cluster") {
    client = new redis(redisSetting);
}else{

    var redisHosts = redisip.split(",");
    if(Array.isArray(redisHosts)){


        redisSetting = [];
        redisHosts.forEach(function(item){
            redisSetting.push({
                host: item,
                port: redisport,
                family: 4,
                password: redispass});
        });

        var client = new redis.Cluster([redisSetting]);

    }else{

        client = new redis(redisSetting);
    }


}

client.on("error", function (err) {
    console.log("Error " + err);

});

var redlock = new Redlock(
    [client],
    {
        driftFactor: 0.01,

        retryCount:  10000,

        retryDelay:  200

    }
);

redlock.on('clientError', function(err)
{
    logger.error('[DVP-Common.AcquireLock] - [%s] - REDIS LOCK FAILED', err);

});

var addDataToCache = function(companyId, tenantId)
{
    //--------------- ADD CLOUDS ----------------//
    dbmodel.Cloud.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (cloudList)
        {
            if(cloudList)
            {
                cloudList.forEach(function(cloud)
                {
                    addClusterToCache(cloud.id);
                });
            }


        }).catch(function(err)
        {

        });

    //--------------- ADD TRUNKS ----------------//

    dbmodel.Trunk.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (trunkList)
        {
            if(trunkList)
            {
                trunkList.forEach(function(trunk)
                {
                    addTrunkToCache(trunk.id);
                });
            }


        }).catch(function(err)
        {

        });


    //--------------- ADD SIP PROFILES ----------------//

    dbmodel.SipNetworkProfile.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (profList)
        {
            if(profList)
            {
                profList.forEach(function(profile)
                {
                    addSipProfileToCompanyObj(profile, tenantId, companyId);
                });
            }


        }).catch(function(err)
        {

        });


    //--------------- ADD CLOUD END USERS ----------------//

    dbmodel.CloudEndUser.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (euList)
        {
            if(euList)
            {
                euList.forEach(function(eu)
                {
                    addCloudEndUserToCompanyObj(eu, tenantId, companyId);
                });
            }


        }).catch(function(err)
        {

        });


    //--------------- ADD CALL RULES ----------------//

    dbmodel.CallRule.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (crList)
        {
            if(crList)
            {
                crList.forEach(function(cr)
                {
                    addCallRuleToCompanyObj(cr, tenantId, companyId);
                });
            }


        }).catch(function(err)
        {

        });


    //--------------- ADD APPLICATIONS ----------------//

    dbmodel.Application.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (appList)
        {
            if(appList)
            {
                appList.forEach(function(app)
                {
                    addApplicationToCompanyObj(app, tenantId, companyId);
                });
            }


        }).catch(function(err)
        {

        });


    //--------------- ADD TRANSLATIONS ----------------//

    dbmodel.Translation.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (transList)
        {
            if(transList)
            {
                transList.forEach(function(trans)
                {
                    addTranslationToCompanyObj(trans, tenantId, companyId);
                });
            }


        }).catch(function(err)
        {

        });


    //--------------- ADD TRANSFER CODES ----------------//

    dbmodel.TransferCode.find({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (transCode)
        {
            if(transCode)
            {
                addTransferCodeToCompanyObj(transCode, tenantId, companyId);
            }


        }).catch(function(err)
        {

        });

    //--------------- ADD CALLSERVERS ----------------//

    dbmodel.CallServer.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (csList)
        {
            if(csList)
            {
                csList.forEach(function(cs)
                {
                    addCallServerToCompanyObj(cs, tenantId, companyId);
                    addCallServerByIdToCache(cs.id, cs);
                });
            }


        }).catch(function(err)
        {

        });

    //------------ADD CONTEXTS --------------//

    dbmodel.Context.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (ctxtList)
        {
            if(ctxtList)
            {
                ctxtList.forEach(function(ctxt)
                {
                    addContextToCache(ctxt.Context, ctxt);
                });
            }


        }).catch(function(err)
        {

        });

    //-------------- ADD TRUNK NUMBERS ----------------//

    dbmodel.TrunkPhoneNumber.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (trNumList)
        {
            if(trNumList)
            {
                trNumList.forEach(function(trNum)
                {
                    addTrunkNumberByIdToCache(trNum.id, companyId, tenantId, trNum);
                    addTrunkNumberToCache(trNum.PhoneNumber, trNum);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD DIDNUMBERS --------------//

    dbmodel.DidNumber.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (didList)
        {
            if(didList)
            {
                didList.forEach(function(did)
                {
                    addDidNumberToCache(did.DidNumber, companyId, tenantId, did);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD LIMITS --------------//

    dbmodel.LimitInfo.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (limitList)
        {
            if(limitList)
            {
                limitList.forEach(function(lim)
                {
                    addLimitToCache(lim.LimitId, companyId, tenantId, lim);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD NUMBER BLACK LIST --------------//

    dbmodel.NumberBlacklist.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (blNumList)
        {
            if(blNumList)
            {
                blNumList.forEach(function(blNum)
                {
                    addNumberBLToCache(blNum.PhoneNumber, companyId, tenantId, blNum);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD EXTENSION LIST --------------//

    dbmodel.Extension.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (extList)
        {
            if(extList)
            {
                extList.forEach(function(ext)
                {
                    addExtensionToCache(ext, companyId, tenantId);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD SIP USER LIST --------------//

    dbmodel.SipUACEndpoint.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (sipUserList)
        {
            if(sipUserList)
            {
                sipUserList.forEach(function(sipUser)
                {
                    addSipUserToCache(sipUser, companyId, tenantId);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD GROUP LIST --------------//

    dbmodel.UserGroup.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (grpList)
        {
            if(grpList)
            {
                grpList.forEach(function(grp)
                {
                    addGroupToCache(grp, companyId, tenantId);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD CONFERENCE LIST --------------//

    dbmodel.Conference.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (confList)
        {
            if(confList)
            {
                confList.forEach(function(conf)
                {
                    addConferenceToCache(conf, companyId, tenantId);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD PBX USER LIST --------------//

    dbmodel.PBXUser.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (pbxList)
        {
            if(pbxList)
            {
                pbxList.forEach(function(pbx)
                {
                    addPABXUserToCache(pbx.UserUuid, companyId, tenantId);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD FC LIST --------------//

    dbmodel.FeatureCode.find({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (fc)
        {
            if(fc)
            {
                addFeatureCodeToCache(fc, companyId, tenantId);
            }


        }).catch(function(err)
        {

        });


    //------------ADD PBX COMPANY INFO --------------//

    dbmodel.PBXMasterData.find({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (pbxMaster)
        {
            if(pbxMaster)
            {
                addPBXCompDataToCache(pbxMaster, companyId, tenantId);
            }


        }).catch(function(err)
        {

        });


    //------------ADD SCHEDULE LIST --------------//

    dbmodel.Schedule.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (scheduleList)
        {
            if(scheduleList)
            {
                scheduleList.forEach(function(schedule)
                {
                    addScheduleToCache(schedule.id, companyId, tenantId);
                });
            }


        }).catch(function(err)
        {

        });


    //------------ADD EMERGENCY NUMBERS LIST --------------//

    dbmodel.EmergencyNumber.findAll({where:[{CompanyId: companyId},{TenantId: tenantId}]})
        .then(function (eNumList)
        {
            if(eNumList)
            {
                eNumList.forEach(function(eNum)
                {
                    addEmergencyNumberToCache(eNum, companyId, tenantId);
                });
            }


        }).catch(function(err)
        {

        });


};








var addClusterToCache = function(clusterId)
{
    var ttl = 2000;
    var lockKey = 'CLOUDLOCK:' + clusterId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {

        dbmodel.Cloud.find({where: [{id: clusterId}], include: [{model: dbmodel.LoadBalancer, as: "LoadBalancer"}]})
            .then(function (cloudRec)
            {
                if (cloudRec)
                {
                    client.set('CLOUD:' + clusterId, JSON.stringify(cloudRec), function(err, setResp)
                    {
                        if(err)
                        {
                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                        }

                        lock.unlock()
                            .catch(function(err) {
                                logger.error('[DVP-Common.addClusterToCache] - [%s] - REDIS LOCK RELEASE FAILED', err);
                            });
                    });
                }
                else
                {
                    lock.unlock()
                        .catch(function(err) {
                            logger.error('[DVP-Common.addClusterToCache] - [%s] - REDIS LOCK RELEASE FAILED', err);
                        });
                }

            }).catch(function(err)
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addClusterToCache] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });
            });
    }).catch(function(err)
    {
        logger.error('[DVP-Common.addClusterToCache] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });

};

var addTrunkToCache = function(trunkId)
{
    var ttl = 2000;
    var lockKey = 'TRUNKLOCK:' + trunkId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        dbmodel.Trunk.find({ where:[{id: trunkId}], include : [{model: dbmodel.TrunkIpAddress, as: "TrunkIpAddress"}]})
            .then(function (trunk)
            {
                if (trunk)
                {
                    client.set('TRUNK:' + trunkId, JSON.stringify(trunk), function(err, setResp)
                    {
                        if(err)
                        {
                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                        }
                        lock.unlock()
                            .catch(function(err) {
                                logger.error('[DVP-Common.addTrunkToCache] - [%s] - REDIS LOCK RELEASE FAILED', err);
                            });
                    });
                }
                else
                {
                    lock.unlock()
                        .catch(function(err) {
                            logger.error('[DVP-Common.addTrunkToCache] - [%s] - REDIS LOCK RELEASE FAILED', err);
                        });
                }

            }).catch(function(err)
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addTrunkToCache] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });
            });
    }).catch(function(err)
    {
        logger.error('[DVP-Common.addTrunkToCache] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });

};

var addSipProfileToCompanyObj = function(profileObj, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            if(err)
            {
                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
            }
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(!compObj.SipNetworkProfile)
            {
                compObj.SipNetworkProfile = {};
            }

            compObj.SipNetworkProfile[profileObj.id] = profileObj;

            client.set(key, JSON.stringify(compObj), function(err, compObj)
            {
                if(err)
                {
                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                }
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addSipProfileToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });

            });
        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.addSipProfileToCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var addCloudEndUserToCompanyObj = function(euObj, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            if(err)
            {
                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
            }

            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(!compObj.CloudEndUser)
            {
                compObj.CloudEndUser = {};
            }

            compObj.CloudEndUser[euObj.id] = euObj;

            client.set(key, JSON.stringify(compObj), function(err, compObj)
            {
                if(err)
                {
                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                }
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addCloudEndUserToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });

            });
        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.addCloudEndUserToCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var removeCloudEndUserFromCompanyObj = function(euId, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            if(err)
            {
                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
            }
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(compObj.CloudEndUser && compObj.CloudEndUser[euId])
            {
                delete compObj.CloudEndUser[euId];
                client.set(key, JSON.stringify(compObj), function(err, compObj)
                {
                    if(err)
                    {
                        logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                    }
                    lock.unlock()
                        .catch(function(err) {
                            logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                        });

                });
            }
            else
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });
            }


        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};


var addCallRuleToCompanyObj = function(ruleObj, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            if(err)
            {
                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
            }
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(!compObj.CallRule)
            {
                compObj.CallRule = {};
            }

            compObj.CallRule[ruleObj.id] = ruleObj;

            client.set(key, JSON.stringify(compObj), function(err, compObj)
            {
                if(err)
                {
                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                }
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addCallRuleToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });

            });
        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.addCallRuleToCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var removeCallRuleFromCompanyObj = function(ruleId, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            if(err)
            {
                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
            }
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(compObj.CallRule && compObj.CallRule[ruleId])
            {
                delete compObj.CallRule[ruleId];
                client.set(key, JSON.stringify(compObj), function(err, compObj)
                {
                    if(err)
                    {
                        logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                    }
                    lock.unlock()
                        .catch(function(err) {
                            logger.error('[DVP-Common.removeCallRuleFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                        });

                });
            }
            else
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.removeCallRuleFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });
            }


        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var addApplicationToCompanyObj = function(appObj, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            if(err)
            {
                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
            }
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(!compObj.Application)
            {
                compObj.Application = {};
            }

            compObj.Application[appObj.id] = appObj;

            client.set(key, JSON.stringify(compObj), function(err, compObj)
            {
                if(err)
                {
                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                }
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addApplicationToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });

            });
        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.addApplicationToCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var removeApplicationFromCompanyObj = function(appId, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            if(err)
            {
                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
            }
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(compObj.Application && compObj.Application[appId])
            {
                delete compObj.Application[appId];
                client.set(key, JSON.stringify(compObj), function(err, compObj)
                {
                    if(err)
                    {
                        logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                    }
                    lock.unlock()
                        .catch(function(err) {
                            logger.error('[DVP-Common.removeApplicationFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                        });

                });
            }
            else
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.removeApplicationFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });
            }


        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var addTranslationToCompanyObj = function(transObj, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(!compObj.Translation)
            {
                compObj.Translation = {};
            }

            compObj.Translation[transObj.id] = transObj;

            client.set(key, JSON.stringify(compObj), function(err, compObj)
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addTranslationToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });

            });
        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.addTranslationToCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var removeTranslationFromCompanyObj = function(transId, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(compObj.Translation && compObj.Translation[transId])
            {
                delete compObj.Translation[transId];
                client.set(key, JSON.stringify(compObj), function(err, compObj)
                {
                    lock.unlock()
                        .catch(function(err) {
                            logger.error('[DVP-Common.removeApplicationFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                        });

                });
            }
            else
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.removeApplicationFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });
            }


        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};


var addTransferCodeToCompanyObj = function(tcObj, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(!compObj.TransferCode)
            {
                compObj.TransferCode = {};
            }

            compObj.TransferCode = tcObj;

            client.set(key, JSON.stringify(compObj), function(err, compObjResp)
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addTransferCodeToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });

            });
        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.addTransferCodeToCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var removeTransferCodeFromCompanyObj = function(tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(compObj.TransferCode)
            {
                delete compObj.TransferCode;
                client.set(key, JSON.stringify(compObj), function(err, compObjResp)
                {
                    lock.unlock()
                        .catch(function(err) {
                            logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                        });

                });
            }
            else
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });
            }


        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.removeCloudEndUserFromCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var removeSipProfileFromCompanyObj = function(profileId, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(compObj.SipNetworkProfile && compObj.SipNetworkProfile[profileId])
            {
                delete compObj.SipNetworkProfile[profileId];
                client.set(key, JSON.stringify(compObj), function(err, compObj)
                {
                    lock.unlock()
                        .catch(function(err) {
                            logger.error('[DVP-Common.addSipProfileToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                        });

                });
            }
            else
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.addSipProfileToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });
            }


        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.addSipProfileToCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var addCallServerToCompanyObj = function(newCsObj, tenantId, companyId)
{
    var ttl = 2000;

    var lockKey = 'DVPCACHELOCK:' + tenantId + ':' + companyId;

    var key = 'DVPCACHE:' + tenantId + ':' + companyId;

    redlock.lock(lockKey, ttl).then(function(lock)
    {
        client.get(key, function(err, compStr)
        {
            var compObj = {};
            if(compStr)
            {
                try
                {
                    compObj = JSON.parse(compStr);
                }
                catch(ex)
                {
                    compObj = {};

                }

            }

            if(!compObj.CallServer)
            {
                compObj.CallServer = {};
            }

            compObj.CallServer[newCsObj.id] = newCsObj;

            client.set(key, JSON.stringify(compObj), function(err, compObj)
            {
                lock.unlock()
                    .catch(function(err) {
                        logger.error('[DVP-Common.checkAndSetCallServerToCompanyObj] - [%s] - REDIS LOCK RELEASE FAILED', err);
                    });

            });
        });

    }).catch(function(err)
    {
        logger.error('[DVP-Common.checkAndSetCallServerToCompanyObj] - [%s] - REDIS LOCK ACQUIRE FAILED', err);
    });
};

var addContextToCache = function(context, contextObj)
{
    try
    {
        var key = 'CONTEXT:' + context;

        client.set(key, JSON.stringify(contextObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removeContextFromCache = function(context)
{
    try
    {
        var key = 'CONTEXT:' + context;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addTrunkNumberByIdToCache = function(trNumId, companyId, tenantId, trunkNumObj)
{
    try
    {
        var key = 'TRUNKNUMBERBYID:' + tenantId + ':' + companyId + ':' + trNumId;

        client.set(key, JSON.stringify(trunkNumObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addTrunkNumberToCache = function(trNumber, trunkNumObj)
{
    try
    {
        var key = 'TRUNKNUMBER:' + trNumber;

        client.set(key, JSON.stringify(trunkNumObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addDidNumberToCache = function(didNumber, companyId, tenantId, didNumObj)
{
    try
    {
        var key = 'DIDNUMBER:' + tenantId + ':' + companyId + ':' + didNumber;

        client.set(key, JSON.stringify(didNumObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removeDidNumberFromCache = function(didNumber, companyId, tenantId)
{
    try
    {
        var key = 'DIDNUMBER:' + tenantId + ':' + companyId + ':' + didNumber;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removePBXUserFromCache = function(pabxUserUuid, companyId, tenantId)
{
    try
    {
        var key = 'PBXUSER:' + tenantId + ':' + companyId + ':' + pabxUserUuid;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addLimitToCache = function(limitId, companyId, tenantId, limObj)
{
    try
    {
        var key = 'LIMIT:' + tenantId + ':' + companyId + ':' + limitId;

        client.set(key, JSON.stringify(limObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removeLimitFromCache = function(limitId, companyId, tenantId)
{
    try
    {
        var key = 'LIMIT:' + tenantId + ':' + companyId + ':' + limitId;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addNumberBLToCache = function(blNumber, companyId, tenantId, blObj)
{
    try
    {
        var key = 'NUMBERBLACKLIST:' + tenantId + ':' + companyId + ':' + blNumber;

        client.set(key, JSON.stringify(blObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removeNumberBLFromCache = function(blNumber, companyId, tenantId)
{
    try
    {
        var key = 'NUMBERBLACKLIST:' + tenantId + ':' + companyId + ':' + blNumber;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removeTrunkNumberByIdFromCache = function(trNumId, companyId, tenantId)
{
    try
    {
        var key = 'TRUNKNUMBERBYID:' + tenantId + ':' + companyId + ':' + trNumId;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removeTrunkNumberFromCache = function(trNumber)
{
    try
    {
        var key = 'TRUNKNUMBER:' + trNumber;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addCallServerByIdToCache = function(csId, csObj)
{
    try
    {
        var key = 'CALLSERVER:' + csId;

        client.set(key, JSON.stringify(csObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addExtensionToCache = function(extensionObj, companyId, tenantId)
{
    //Add Extension By ID Single Object

    try
    {
        if(extensionObj.id)
        {
            var keyExtById = 'EXTENSIONBYID:' + tenantId + ':' + companyId + ':' + extensionObj.id;

            client.set(keyExtById, JSON.stringify(extensionObj), function(err, response)
            {
                if(err)
                {
                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                }

            });
        }


    }
    catch(ex)
    {
        if(ex)
        {
            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', ex);
        }

    }

    //Check Extension Type if group load Group -> Ext Object
    //if group user add SipUser -> Ext Obj

    try
    {
        if(extensionObj.ObjCategory && extensionObj.Extension)
        {
            var keyExt = 'EXTENSION:' + tenantId + ':' + companyId + ':' + extensionObj.Extension;
            if(extensionObj.ObjCategory === 'USER')
            {
                dbmodel.Extension.find({where: [{Extension: extensionObj.Extension},{TenantId: tenantId},{CompanyId:companyId}], include: [{model: dbmodel.SipUACEndpoint, as:'SipUACEndpoint'}]})
                    .then(function (resExt)
                    {
                        if(resExt)
                        {
                            client.set(keyExt, JSON.stringify(resExt), function(err, response)
                            {
                                if(err)
                                {
                                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                }

                            });

                            if(resExt.SipUACEndpoint && resExt.SipUACEndpoint.id)
                            {
                                //add sip user by id object
                                var keySipUserById = 'SIPUSERBYID:' + tenantId + ':' + companyId + ':' + resExt.SipUACEndpoint.id;
                                var keySipUserByName = 'SIPUSER:' + resExt.SipUACEndpoint.SipUsername;


                                dbmodel.SipUACEndpoint.find({where: [{id: resExt.SipUACEndpoint.id}], include: [{model: dbmodel.Extension, as:'Extension'}]})
                                    .then(function (resUser)
                                    {
                                        client.set(keySipUserById, JSON.stringify(resUser), function(err, response)
                                        {
                                            if(err)
                                            {
                                                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                            }

                                        });

                                        if(resExt.SipUACEndpoint.SipUsername)
                                        {
                                            client.set(keySipUserByName, JSON.stringify(resUser), function(err, response)
                                            {
                                                if(err)
                                                {
                                                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                                }

                                            });
                                        }


                                    }).catch(function(err)
                                    {
                                        if(err)
                                        {
                                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                        }

                                    });




                            }
                        }


                    }).catch(function(err)
                    {
                        if(err)
                        {
                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                        }
                    });

            }
            else if(extensionObj.ObjCategory === 'GROUP')
            {
                dbmodel.Extension.find({where: [{Extension: extensionObj.Extension},{TenantId: tenantId},{CompanyId:companyId}], include: [{model: dbmodel.UserGroup, as:'UserGroup'}]})
                    .then(function (resExt)
                    {
                        if(resExt)
                        {
                            client.set(keyExt, JSON.stringify(resExt), function(err, response)
                            {
                                if(err)
                                {
                                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                }

                            });

                            if(resExt.UserGroup && resExt.UserGroup.id)
                            {
                                //add sip user by id object
                                var keyGroupById = 'USERGROUP:' + tenantId + ':' + companyId + ':' + resExt.UserGroup.id;

                                dbmodel.UserGroup.find({where: [{id: resExt.UserGroup.id}], include: [{model: dbmodel.Extension, as:'Extension'},{model: dbmodel.SipUACEndpoint, as:'SipUACEndpoint'}]})
                                    .then(function (resGrp)
                                    {
                                        client.set(keyGroupById, JSON.stringify(resGrp), function(err, response)
                                        {
                                            if(err)
                                            {
                                                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                            }

                                        });
                                    }).catch(function(err)
                                    {
                                        if(err)
                                        {
                                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                        }

                                    });

                            }
                        }


                    }).catch(function(err)
                    {
                        if(err)
                        {
                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                        }
                    });

            }
            else if(extensionObj.ObjCategory === 'CONFERENCE')
            {
                dbmodel.Extension.find({where: [{Extension: extensionObj.Extension},{TenantId: tenantId},{CompanyId:companyId}], include: [{model: dbmodel.Conference, as:'Conference'}]})
                    .then(function (resExt)
                    {
                        if(resExt)
                        {
                            client.set(keyExt, JSON.stringify(resExt), function(err, response)
                            {
                                if(err)
                                {
                                    logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                }

                            });
                        }


                    }).catch(function(err)
                    {
                        if(err)
                        {
                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                        }
                    });

            }
            else
            {

                client.set(keyExt, JSON.stringify(extensionObj), function(err, response)
                {
                    if(err)
                    {
                        logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                    }

                });
            }




        }


    }
    catch(ex)
    {
        if(ex)
        {
            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', ex);
        }

    }
};

var addSipUserToCache = function(sipUserObj, companyId, tenantId)
{
    try
    {
        if(sipUserObj.id)
        {
            var keySipUserById = 'SIPUSERBYID:' + tenantId + ':' + companyId + ':' + sipUserObj.id;

            dbmodel.SipUACEndpoint.find({where: [{id: sipUserObj.id, TenantId: tenantId, CompanyId: companyId}], include: [{model: dbmodel.Extension, as:'Extension'}]})
                .then(function (resUser)
                {
                    client.set(keySipUserById, JSON.stringify(resUser), function(err, response)
                    {
                        if(err)
                        {
                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                        }

                    });

                    if(resUser.SipUsername)
                    {
                        var keySipUserByName = 'SIPUSER:' + resUser.SipUsername;
                        client.set(keySipUserByName, JSON.stringify(resUser), function(err, response)
                        {
                            if(err)
                            {
                                logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                            }

                        });
                    }

                    if(resUser.Extension && resUser.Extension.id)
                    {
                        dbmodel.Extension.find({where: [{id: resUser.Extension.id},{TenantId: tenantId},{CompanyId:companyId}], include: [{model: dbmodel.SipUACEndpoint, as:'SipUACEndpoint'}]})
                            .then(function (resExt)
                            {
                                if(resExt)
                                {
                                    var keyExt = 'EXTENSION:' + tenantId + ':' + companyId + ':' + resExt.Extension;

                                    client.set(keyExt, JSON.stringify(resExt), function(err, response)
                                    {
                                        if(err)
                                        {
                                            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                                        }

                                    });
                                }


                            });
                    }
                }).catch(function(err)
                {
                    if(err)
                    {
                        logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', err);
                    }

                });
        }


    }
    catch(ex)
    {
        if(ex)
        {
            logger.error('[DVP-Common-RedisCaching] - [%s] - REDIS ERROR', ex);
        }

    }
};

var addGroupToCache = function(groupObj, companyId, tenantId)
{

    try
    {
        if(groupObj.id)
        {
            var keyGroupById = 'USERGROUP:' + tenantId + ':' + companyId + ':' + groupObj.id;

            dbmodel.UserGroup.find({where: [{id: groupObj.id, CompanyId: companyId, TenantId: tenantId}], include: [{model: dbmodel.Extension, as:'Extension'},{model: dbmodel.SipUACEndpoint, as:'SipUACEndpoint'}]})
                .then(function (resGrp)
                {
                    client.set(keyGroupById, JSON.stringify(resGrp), function(err, response)
                    {

                    });

                    if(resGrp.Extension && resGrp.Extension.id)
                    {
                        dbmodel.Extension.find({where: [{id: resGrp.Extension.id},{TenantId: tenantId},{CompanyId:companyId}], include: [{model: dbmodel.UserGroup, as:'UserGroup'}]})
                            .then(function (resExt)
                            {
                                var keyExt = 'EXTENSION:' + tenantId + ':' + companyId + ':' + resExt.Extension;
                                client.set(keyExt, JSON.stringify(resExt), function(err, response)
                                {

                                });

                            }).catch(function(err)
                            {

                            });
                    }

                }).catch(function(err)
                {

                });
        }


    }
    catch(ex)
    {

    }

};

var removeGroupFromCache = function(groupId, companyId, tenantId)
{

    try
    {
        if(groupId)
        {
            var keyGroupById = 'USERGROUP:' + tenantId + ':' + companyId + ':' + groupId;

            client.get(keyGroupById, function(err, grpCacheStr)
            {
                var grpCache = null;

                grpCache = JSON.parse(grpCacheStr);

                client.del(keyGroupById, function(err, response)
                {

                });

                if(grpCache && grpCache.Extension && grpCache.Extension.Extension)
                {
                    var keyExt = 'EXTENSION:' + tenantId + ':' + companyId + ':' + grpCache.Extension.Extension;
                    client.get(keyExt, function(err, extCacheStr)
                    {
                        var extCache = null;

                        extCache = JSON.parse(extCacheStr);

                        if(extCache)
                        {
                            extCache.UserGroup = null;
                        }

                        client.set(keyExt, JSON.stringify(extCache), function(err, response)
                        {

                        });
                    });
                }

            });

        }


    }
    catch(ex)
    {

    }

};

var removeExtensionFromCache = function(extension, companyId, tenantId)
{

    try
    {
        if(extension)
        {
            var keyExt = 'EXTENSION:' + tenantId + ':' + companyId + ':' + extension;

            client.get(keyExt, function(err, extCacheStr)
            {
                var extCache = null;

                extCache = JSON.parse(extCacheStr);

                client.del(keyExt, function(err, response)
                {

                });

                if(extCache && extCache.id)
                {
                    var keyExtById = 'EXTENSIONBYID:' + tenantId + ':' + companyId + ':' + extCache.id;

                    client.del(keyExtById, function(err, response)
                    {

                    });

                    if(extCache.ObjCategory === 'USER' && extCache.SipUACEndpoint)
                    {
                        if(extCache.SipUACEndpoint.id)
                        {
                            var keySipUserById = 'SIPUSERBYID:' + tenantId + ':' + companyId + ':' + extCache.SipUACEndpoint.id;

                            client.get(keySipUserById, function(err, usrCacheByIdStr)
                            {
                                var usrCacheById = null;

                                usrCacheById = JSON.parse(usrCacheByIdStr);

                                if(usrCacheById)
                                {
                                    usrCacheById.Extension = null;

                                    client.set(keySipUserById, JSON.stringify(usrCacheById), function(err, response)
                                    {

                                    });
                                }


                            });
                        }

                        if(extCache.SipUACEndpoint.SipUsername)
                        {
                            var keySipUser = 'SIPUSER:' + extCache.SipUACEndpoint.SipUsername;

                            client.get(keySipUser, function(err, usrCacheStr)
                            {
                                var usrCache = null;

                                usrCache = JSON.parse(usrCacheStr);

                                if(usrCache)
                                {
                                    usrCache.Extension = null;

                                    client.set(keySipUser, JSON.stringify(usrCache), function(err, response)
                                    {

                                    });
                                }


                            });
                        }



                    }
                    else if(extCache.ObjCategory === 'GROUP' && extCache.UserGroup && extCache.UserGroup.id)
                    {
                        var keyGroupById = 'USERGROUP:' + tenantId + ':' + companyId + ':' + extCache.UserGroup.id;

                        client.get(keyGroupById, function(err, grpCacheByIdStr)
                        {
                            var grpCacheById = null;

                            grpCacheById = JSON.parse(grpCacheByIdStr);

                            if(grpCacheById)
                            {
                                grpCacheById.Extension = null;

                                client.set(keyGroupById, JSON.stringify(grpCacheById), function(err, response)
                                {

                                });
                            }


                        });


                    }


                }

            });

        }


    }
    catch(ex)
    {

    }

};

var addConferenceToCache = function(conferenceObj, companyId, tenantId)
{
    try
    {
        if(conferenceObj.ConferenceName)
        {
            var keyConference = 'CONFERENCE:' + tenantId + ':' + companyId + ':' + conferenceObj.ConferenceName;

            dbmodel.Conference.find({where: [{ConferenceName: conferenceObj.ConferenceName, CompanyId: companyId, TenantId: tenantId}], include: [{model: dbmodel.ConferenceUser, as:'ConferenceUser'}]})
                .then(function (resConf)
                {
                    client.set(keyConference, JSON.stringify(resConf), function(err, response)
                    {

                    });

                }).catch(function(err)
                {

                });


            dbmodel.Extension.find({where: [{CompanyId: companyId, TenantId: tenantId}], include: [{model: dbmodel.Conference, as:'Conference', where:[{ConferenceName: conferenceObj.ConferenceName}]}]})
                .then(function (resExt)
                {
                    if(resExt && resExt.Extension && resExt.Conference)
                    {
                        var keyExt = 'EXTENSION:' + tenantId + ':' + companyId + ':' + resExt.Extension;

                        client.set(keyExt, JSON.stringify(resExt), function(err, response)
                        {

                        });


                    }


                }).catch(function(err)
                {

                });
        }


    }
    catch(ex)
    {

    }

};


var addPABXUserToCache = function(pabxUserUuid, companyId, tenantId)
{
    try
    {
        if(pabxUserUuid)
        {
            var keyPbxUser = 'PBXUSER:' + tenantId + ':' + companyId + ':' + pabxUserUuid;

            dbmodel.PBXUser.find({where :[{CompanyId: companyId},{TenantId: tenantId},{UserUuid: pabxUserUuid}], include : [{model: dbmodel.PBXUserTemplate, as: "PBXUserTemplateActive"}, {model: dbmodel.FollowMe, as: "FollowMe", include: [{model: dbmodel.PBXUser, as: "DestinationUser"}]}, {model: dbmodel.Forwarding, as: "Forwarding"}]})
                .then(function (usrObj)
                {
                    if(usrObj)
                    {
                        client.set(keyPbxUser, JSON.stringify(usrObj), function(err, response)
                        {

                        });
                    }


                }).catch(function(err)
                {

                });
        }


    }
    catch(ex)
    {

    }

};

var addFeatureCodeToCache = function(fcObj, companyId, tenantId)
{
    try
    {
        var key = 'FEATURECODE:' + tenantId + ':' + companyId;

        client.set(key, JSON.stringify(fcObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removeFeatureCodeFromCache = function(companyId, tenantId)
{
    try
    {
        var key = 'FEATURECODE:' + tenantId + ':' + companyId;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addPBXCompDataToCache = function(compObj, companyId, tenantId)
{
    try
    {
        var key = 'PBXCOMPANYINFO:' + tenantId + ':' + companyId;

        client.set(key, JSON.stringify(compObj), function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removePBXCompDataFromCache = function(companyId, tenantId)
{
    try
    {
        var key = 'PBXCOMPANYINFO:' + tenantId + ':' + companyId;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var removeScheduleFromCache = function(scheduleId, companyId, tenantId)
{
    try
    {
        var key = 'SCHEDULE:' + tenantId + ':' + companyId + ':' + scheduleId;

        client.del(key, function(err, response)
        {

        });

    }
    catch(ex)
    {

    }

};

var addScheduleToCache = function(scheduleId, companyId, tenantId)
{
    try
    {
        if(scheduleId)
        {
            var keyPbxUser = 'SCHEDULE:' + tenantId + ':' + companyId + ':' + scheduleId;

            dbmodel.Schedule.find({where :[{CompanyId: companyId},{TenantId: tenantId},{id: scheduleId}], include : [{model: dbmodel.Appointment, as: "Appointment"}]})
                .then(function (schedule)
                {
                    if(schedule)
                    {
                        client.set(keyPbxUser, JSON.stringify(schedule), function(err, response)
                        {

                        });
                    }


                }).catch(function(err)
                {

                });
        }


    }
    catch(ex)
    {

    }

};

var addEmergencyNumberToCache = function(eNumObj, companyId, tenantId)
{
    try
    {
        if(eNumObj && eNumObj.EmergencyNum)
        {
            var keyENum = 'EMERGENCYNUMBER:' + tenantId + ':' + companyId + ':' + eNumObj.EmergencyNum;

            client.set(keyENum, JSON.stringify(eNumObj), function(err, response)
            {

            });

        }

    }
    catch(ex)
    {

    }

};

var removeEmergencyNumberFromCache = function(eNum, companyId, tenantId)
{
    try
    {
        if(eNum)
        {
            var keyENum = 'EMERGENCYNUMBER:' + tenantId + ':' + companyId + ':' + eNum;

            client.del(keyENum, function(err, response)
            {

            });

        }



    }
    catch(ex)
    {

    }

};


module.exports.addContextToCache = addContextToCache;
module.exports.removeContextFromCache = removeContextFromCache;
module.exports.addCallServerToCompanyObj = addCallServerToCompanyObj;
module.exports.addSipProfileToCompanyObj = addSipProfileToCompanyObj;
module.exports.addClusterToCache = addClusterToCache;
module.exports.removeSipProfileFromCompanyObj = removeSipProfileFromCompanyObj;
module.exports.addCallServerByIdToCache = addCallServerByIdToCache;
module.exports.addTrunkNumberByIdToCache = addTrunkNumberByIdToCache;
module.exports.removeTrunkNumberByIdFromCache = removeTrunkNumberByIdFromCache;
module.exports.addTrunkNumberToCache = addTrunkNumberToCache;
module.exports.removeTrunkNumberFromCache = removeTrunkNumberFromCache;
module.exports.addTrunkToCache = addTrunkToCache;
module.exports.addExtensionToCache = addExtensionToCache;
module.exports.addSipUserToCache = addSipUserToCache;
module.exports.addGroupToCache = addGroupToCache;
module.exports.addConferenceToCache = addConferenceToCache;
module.exports.removeGroupFromCache = removeGroupFromCache;
module.exports.removeExtensionFromCache = removeExtensionFromCache;
module.exports.addCloudEndUserToCompanyObj = addCloudEndUserToCompanyObj;
module.exports.removeCloudEndUserFromCompanyObj = removeCloudEndUserFromCompanyObj;
module.exports.addDidNumberToCache = addDidNumberToCache;
module.exports.removeDidNumberFromCache = removeDidNumberFromCache;
module.exports.addTransferCodeToCompanyObj = addTransferCodeToCompanyObj;
module.exports.removeTransferCodeFromCompanyObj = removeTransferCodeFromCompanyObj;
module.exports.addNumberBLToCache = addNumberBLToCache;
module.exports.removeNumberBLFromCache = removeNumberBLFromCache;
module.exports.addCallRuleToCompanyObj = addCallRuleToCompanyObj;
module.exports.removeCallRuleFromCompanyObj = removeCallRuleFromCompanyObj;
module.exports.addApplicationToCompanyObj = addApplicationToCompanyObj;
module.exports.removeApplicationFromCompanyObj = removeApplicationFromCompanyObj;
module.exports.addTranslationToCompanyObj = addTranslationToCompanyObj;
module.exports.removeTranslationFromCompanyObj = removeTranslationFromCompanyObj;
module.exports.addLimitToCache = addLimitToCache;
module.exports.removeLimitFromCache = removeLimitFromCache;
module.exports.removePBXUserFromCache = removePBXUserFromCache;
module.exports.addPABXUserToCache = addPABXUserToCache;
module.exports.addFeatureCodeToCache = addFeatureCodeToCache;
module.exports.removeFeatureCodeFromCache = removeFeatureCodeFromCache;
module.exports.addPBXCompDataToCache = addPBXCompDataToCache;
module.exports.removePBXCompDataFromCache = removePBXCompDataFromCache;
module.exports.removeScheduleFromCache = removeScheduleFromCache;
module.exports.addScheduleToCache = addScheduleToCache;
module.exports.addEmergencyNumberToCache = addEmergencyNumberToCache;
module.exports.removeEmergencyNumberFromCache = removeEmergencyNumberFromCache;


module.exports.addDataToCache = addDataToCache;

