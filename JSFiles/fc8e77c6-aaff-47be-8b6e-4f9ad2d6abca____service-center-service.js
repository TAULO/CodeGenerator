define(['../services/services.js'], function(services){
  'use strict';
  services.factory("serviceCenterService", serviceCenterService);
  serviceCenterService.$inject = ['$q', '$timeout', 'userLoginUIService','resourceUIService', 'dictionaryService', 'kpiDataService', 'viewFlexService', '$window', '$location', 'SwSocket', 'unitService', 'solutionUIService', 'Info'];
  function serviceCenterService(q, timeout, userLoginUIService, resourceUIService, dictionaryService, kpiDataService, viewFlexService, window, location, SwSocket, unitService, solutionUIService, Info){
    var factory = {};
    factory.devices = Object.create({
      status : 'WAIT',
      fun : 'resourceUIService.getDevices',
      getAll : getAll
    });
    factory.resources = Object.create({
      status : 'WAIT',
      fun : 'resourceUIService.getResources',
      getAll : getAll,
      getBymodelId : function(modelId){
        var cur = this, deferred = q.defer();
        if(cur.status == "COMPLETE") {
          var result = cur.valueCached.filter(function(element){
            return modelId ==  element.modelId;
          });
          deferred.resolve(result);
        }
        else if(cur.status == "INPROGRESS")
        {
          cur.promise.then(function(data){
            var result = data.filter(function(element){
              return modelId ==  element.modelId;
            });
            deferred.resolve(result);
          })
        }
        else if(cur.status == "WAIT")
        {
          cur.getAll().then(function(data){
            var result = data.filter(function(element){
              return modelId ==  element.modelId;
            });
            deferred.resolve(result);
          })
        }
        return deferred.promise;
      }
    });
    factory.rootDomain = Object.create({
      status : 'WAIT',
      fun : 'resourceUIService.getRootDomain',
      get : getAll
    });
    factory.models = Object.create({
      status : 'WAIT',
      fun : 'resourceUIService.getModels',
      getAll : getAll
    });
    factory.groupModels = Object.create({
      status : 'WAIT',
      fun : 'solutionUIService.getGroupModels',
      getAll : getAll
    });
    factory.units = Object.create({
      status : 'WAIT',
      fun : 'unitService.getAllUnits',
      getAll : getAll
    });
    factory.deviceGroups = Object.create({
      status : 'WAIT',
      fun : 'resourceUIService.getDeviceGroups',
      getAll: getAll
    });
    factory.views = Object.create({
      status : 'WAIT',
      fun : 'viewFlexService.getAllMyViews',
      getAll : getAll
    });
    factory.deviceGroupModels = Object.create({
      status : 'WAIT',
      fun : 'resourceUIService.getDeviceGroupModels',
      getAll: getAll
    });
    factory.attrs = Object.create({
      models: [],
      valueCached: [],
      fun : 'resourceUIService.getAttrsByModelId',
      getBymodelId: getBymodelId
    });
    factory.directives = Object.create({
      models: [],
      valueCached: [],
      fun : 'resourceUIService.getDirectivesByModelId',
      getBymodelId: getBymodelId
    });
    factory.getValues = function(nodes, kpis, extension) {
      var deferred = q.defer();
      var kpiQueryModel = {
        category: 'ci',
        isRealTimeData: false,
        timePeriod: 0,
        nodeIds: nodes,
        kpiCodes: kpis,
        startTime: null,
        endTime: null,
        timeRange: "",
        statisticType: "psiot",
        condList: []
      };
      for(var i in extension){
        kpiQueryModel[i] = extension[i];
      }
      var param = ["kpi", kpiQueryModel];
      kpiDataService.getValueList(param, function(event) {
        callback(event);
      });
      function callback(event)
      {
        if(event.code == "0")
        {
          deferred.resolve(event.data);
        }
        else
        {
          deferred.reject("通过设备[" + nodes.toString() + "], 指标[" + kpis.toString() + "]获取数据列表失败。");
        }
      }
      return deferred.promise;
    };
    factory.getValuesByCi = function(nodesDes, kpisDes, orderType, topN, modelGroupIds) {
      var deferred = q.defer(); var kpis;
      var nodes
      if(nodesDes) {
        nodes = nodesDes.map(function(element){
          if(element)
          {
            return element.id
          }
          else
          {
            return false;
          }
        });
      }
      if(kpisDes == 'alert')
      {
        kpisDes = [{
          id : 999999,
          label : '节点告警状态'
        }];
      }
      kpis = kpisDes.map(function(element){
        return element.id
      });
      var kpiQueryModel = {
        category: 'ci',
        isRealTimeData: true,
        nodeIds: nodes,
        kpiCodes: kpis,
        startTime: null,
        endTime: null,
        timeRange: "",
        statisticType: "psiot",
        condList: []
      };
      if(modelGroupIds) {
        kpiQueryModel.orderCond = modelGroupIds;
      }
      if(orderType) {
        kpiQueryModel.orderType = orderType;
      }
      if(topN)
      {
        kpiQueryModel.topN = topN;
      }
      var param = ["kpi", kpiQueryModel];
      kpiDataService.getValueList(param, function(event) {
        if(modelGroupIds)
        {
          callback_group(event)
        }
        else
        {
          callback(event);
        }
      });
      function callback_group(event)
      {
        if(event.code == "0")
        {
          var legends = [];
          var series = [];
          for(var i in event.data)
          {
            if(event.data[i].instance != null)
            {
              series.push({
                name : {
                  ci : event.data[i].instance,
                  kpi : ''
                },
                value : event.data[i] ? event.data[i].value : 0
              });
              legends.push({
                ci : event.data[i].instance,
                kpi : ''
              });
            }
          }
          deferred.resolve({
            series : [{
              name : {
                ci : '设备',
                kpi : '指标'
              },
              data : series
            }],
            legends : legends
          });
        }
        else
        {
          deferred.reject("通过设备[" + nodes.toString() + "], 指标[" + kpis.toString() + "]获取数据列表失败。");
        }
      }
      function callback(event)
      {
        if(event.code == "0")
        {
          var legends = [];
          var series = [];
          for(var i in nodesDes)
          {
            for(var j in kpisDes)
            {
              var find = event.data.find(function(elem){
                return elem.nodeId == nodesDes[i].id && elem.kpiCode == kpisDes[j].id;
              });
              series.push({
                name : {
                  ci : nodesDes[i].label,
                  kpi : kpisDes[j].label
                },
                value : find ? find.value : 0
              });
              legends.push({
                ci : nodesDes[i].label,
                kpi : kpisDes[j].label
              });
            }
          }
          deferred.resolve({
            series : [{
              name : {
                ci : '设备',
                kpi : '指标'
              },
              data : series
            }],
            legends : legends
          });
        }
        else
        {
          deferred.reject("通过设备[" + nodes.toString() + "], 指标[" + kpis.toString() + "]获取数据列表失败。");
        }
      }
      return deferred.promise;
    };
    factory.getValuesByTimealert = function() {
      var deferred = q.defer();
      var kpiQueryModel = {
        category: 'ci',
        isRealTimeData: true,
        timePeriod: 0,
        kpiCodes: ["alert_code_count"]
      };
      var param = ["alert", kpiQueryModel];
      kpiDataService.getKpiHierarchyValueList(param, function(event) {
        callback(event);
      });
      function callback(event)
      {
        if(event.code == "0")
        {
          var legends = [];
          var series = [];
          for(var i in event.data.recordList)
          {
            series.push({
              name : event.data.recordList[i].category,
              value : event.data.recordList[i].alert_code_count
            });
            legends.push(event.data.recordList[i].category)
          }
          deferred.resolve({
            series : [{
              name : '设备，指标',
              data : series
            }],
            legends : legends
          });
        }
        else
        {
          deferred.reject("通过设备[alert_code_count]方法，获取数据列表失败。");
        }
      }
      return deferred.promise;
    };
    factory.getValuesList = function(nodes, kpis) {
      var deferred = q.defer();
      var kpiQueryModel = {
        category: 'time',
        isRealTimeData: true,
        timePeriod: 24 * 3600 * 1000,
        nodeIds: nodes,
        kpiCodes: kpis,
        startTime: null,
        endTime: null,
        timeRange: "",
        statisticType: "psiot",
        condList: []
      };
      var param = ["kpi", kpiQueryModel];
      kpiDataService.getValueList(param, function(event) {
        callback(event);
      });
      function callback(event)
      {
        var minTimespan;
        if(event.code == "0")
        {
          //factory.kpis.getMinTimeSpan(kpis).then(success, error);
          success();
        }
        function success(data)
        {
          minTimespan = 0;
          var result = event.data
          /*
           var result = event.data.reduce(reduceByTime,[]);
           var result = result.map(function(element){
           var regExp = /\d{2}\:\d{2}\:\d{2}/;
           var time = element.arisingTime.match(regExp);
           return {
           kpiCode : element.kpiCode,
           nodeId : element.nodeId,
           time : time[0],
           value : element.value
           }
           });
           */
          var result = result.reduce(reduceByCiKpi,{});
          for(var i in result){
            result[i] = result[i].reduce(reduceByTime, []);
          }
          deferred.resolve(result);
        }
        function error(err)
        {
          deferred.reject("通过设备[" + nodes.toString() + "], 指标[" + kpis.toString() + "]获取数据列表失败。");
        }
        var startTime;
        function reduceByTime(prev, next)
        {
          var nextTime = new Date(next.arisingTime).getTime();
          if(prev.length == 0)
          {
            startTime = nextTime;
            return [next];
          }
          else
          {
            if(nextTime - startTime < minTimespan)
            {
              return prev;
            }
            else
            {
              startTime = nextTime;
              prev.push(next);
              return prev;
            }
          }
        }
        function reduceByCiKpi(prev, next)
        {
          var key = next.nodeId + "?" + next.kpiCode;
          if(prev.hasOwnProperty(key))
          {
            prev[key].push(next);
          }
          else
          {
            prev[key] = [next];
          }
          return prev;
        }
      }
      return deferred.promise;
    };
    factory.getValueListBytime = function(nodesDescription, kpisDescription, timespan, frequency, format, category, type, method, cod, extension, kpiQueryModel) {
      var deferred = q.defer();
      var nodeDefers = [];
      var instance;
      var nodes = [], kpis = [];
      var nodesDes  = [];
      var kpisDes = [];
      var aggregate_type = [];
      var modelId;
      var customCategory;
      var simulate;
      var aggregate_rule;
      var autoFillBlank;
      var condition = cod.$clone();
      var getTime = function(time) {
        if(time){
          switch(time.unit) {
            case "second" :
              return time.value * 1000;
              break;
            case "minute" :
              return time.value * 60 * 1000;
              break;
            case "hour" :
              return time.value * 60 * 60 * 1000;
              break;
            case "day" :
              return time.value * 24 * 60 * 60 * 1000;
              break;
            case "month" :
              return time.value * 30 * 24 * 60 * 60 * 1000;
              break;
            default :
              return time.value;
              break;
          }
        } else {
          return 0;
        }

      };
      var merge = function(category, callback) {
        var path = customCategory ? customCategory : category
        require(["../../toolkit/component/explainer/" + path], function(fun){
          callback(fun);
        });
      };
      var defers = [], rs = {};
      var getValueList = function(type, category, method, condition) {
        // 
        var cond;
        if(condition instanceof Array){
          cond = condition;
          if(typeof condition[1] == "object"){
            cond[1].startTime = condition[1].startTime;
          };
          if(typeof condition[1] == "object"){
            cond[1].endTime = condition[1].endTime;
          };
        } else {
          cond = condition;
        };
        var object = {
          kpiQueryModel : kpiQueryModel ? kpiQueryModel : {
            category: category,
            isRealTimeData: true,
            nodeIds: nodes,
            kpiCodes: kpis,
            startTime: null,
            endTime: null,
            timeRange: "",
            statisticType: "psiot",
            includeInstance : true,
            condList: []
          }
        };
        if(extension){
          object.kpiQueryModel.aggregateType = aggregate_type = extension.aggregate_type;
          object.kpiQueryModel.granularityUnit = extension.granularityUnit;
          if(extension.aggregate_instance instanceof Array){
            if(extension.aggregate_instance.length > 0){
              object.kpiQueryModel.instances = extension.aggregate_instance;
            };
          }
          aggregate_rule = extension.aggregate_rule;
          autoFillBlank = extension.autoFillBlank;
        }
        if(category == "time") {
          var tspan = getTime(timespan);
          object["kpiQueryModel"]["timePeriod"] = tspan ? tspan : 24 * 3600 * 1000;
        }
        var traverse = function(condition){
          var translate = function(str){
            var objLike = /^\{object\:(\w+)\}$/;
            var result = objLike.exec(str);
            if(result != null){
              var param = result[1];
              return object[param];
            } else {
              return str;
            };
          };
          var loop = function(attr, item){
            if(typeof item == 'object'){
              traverse(item);
            } else if(typeof item == "string"){
              condition[attr] = translate(item);
            }
          };
          for(var i in condition){
            loop(i, condition[i]);
          }
        };
        var params = [];
        var callback = function(event){
          merge(category, function(mergeRule){
            if(nodesDes.length == 0 || kpisDes.length == 0){
              //throw new Error("nodesDes is empty");
            }
            var obj = {
              Info : Info,
              format : format,
              frequency : getTime(frequency),
              timespan : getTime(timespan),
              freqObj : frequency,
              nodesDes : nodesDes,
              kpisDes : kpisDes,
              instance : instance,
              aggregate_type : aggregate_type,
              aggregate_rule : aggregate_rule,
              autoFillBlank : autoFillBlank,
              dictionaryService : dictionaryService,
              kpiDataService : kpiDataService,
              resourceUIService : resourceUIService,
              q : q
            };
            if(simulate){
              obj.simulate = simulate;
            }
            var callback = function(data){
              rs[category] = data;
              deferred.resolve(rs);
            };
            mergeRule((event.code == 0) ? event.data : [], obj, callback);
          });
        };
        if(cond != ""){
          if(typeof cond == "object"){
            traverse(cond);
          }
          params.push(cond)
        }
        params.push(callback);
        eval(method).apply(null, params);
      };
      var loopNode = function(nodeDes){
        var defer = q.defer();
        if(typeof nodeDes == "object"){
          timeout(function(){
            nodes.push(nodeDes.id);
            modelId = nodeDes.modelId;
            nodesDes.push(nodeDes);
            defer.resolve("success")
          },100);
        }	else {
          var success = function(data){
            var find = data.find(function(element){
              return element.id == nodeDes;
            });
            if(find){
              nodesDes.push(find);
              modelId = find.modelId;
            }
            defer.resolve("success")
          };
          nodes.push(parseInt(nodeDes));
          factory.resources.getAll().then(success);
        }
        return defer.promise;
      };
      var nodeLoaded = function(data){
        var kpiDefers = [];
        var kpiLoaded = function(data){
          getValueList(type, category, method, condition);
        };
        var loopKpi = function(kpiDes){
          var defer = q.defer();
          if(typeof kpiDes == "object"){
            kpis.push(kpiDes.id);
            kpisDes.push(kpiDes);
            defer.resolve("success")
          }	else {
            var success = function(data){
              var find = data.find(function(element){
                return element.id == kpiDes;
              });
              kpisDes.push(find);
              defer.resolve("success")
            };
            kpis.push(parseInt(kpiDes));
            if(modelId){
              factory.kpis.getBymodelId(modelId).then(success);
            } else {
               
            }

          }
        };
        for(var i in kpisDescription){
          loopKpi(kpisDescription[i])
        };
        q.all(kpiDefers).then(kpiLoaded);
      };
      var init = function(){
        for(var i in nodesDescription){
          nodeDefers.push(loopNode(nodesDescription[i]))
        }
        q.all(nodeDefers).then(nodeLoaded);
      };
      var simuData = function(sData){
        aggregate_rule = extension.aggregate_rule;
        autoFillBlank = extension.autoFillBlank;
        merge(category, function(mergeRule){
          if(nodesDes.length == 0 || kpisDes.length == 0){
            //throw new Error("nodesDes is empty");
          }
          var obj = {
            Info : Info,
            format : format,
            frequency : getTime(frequency),
            nodesDes : nodesDescription,
            kpisDes : kpisDescription,
            instance : instance,
            aggregateType : aggregate_type,
            aggregate_rule : aggregate_rule,
            autoFillBlank : autoFillBlank,
            dictionaryService : dictionaryService,
            kpiDataService : kpiDataService,
            resourceUIService : resourceUIService,
            q : q
          };
          if(simulate){
            obj.simulate = simulate;
          }
          var callback = function(data){
            rs[category] = data;
            deferred.resolve(rs);
          };
          mergeRule(sData, obj, callback);
        });
      };
      if(extension){
        if(extension.simuData){
          simuData(extension.simuData)
        } else {
          simulate = extension.simulate;
          customCategory = extension.customCategory;
          var instanceId = extension.aggregate_instance;
          var insCode;
          if(instanceId == 0){
          } else if(instanceId == 1){
            insCode = "industryType";
          } else if(instanceId == 2){
            insCode = "energyType";
          } else if(instanceId == 3){
            insCode = "energyType";
          } else if(instanceId == 4){
            insCode = "industryShortType";
          } else {
            insCode = "industryType";
          }
          if(insCode){
            dictionaryService.getDictValues(insCode, function(event){
              if(event.code == 0){
                instance = event.data;
                init();
              }
            })
          } else {
            init();
          };
        }
      } else {
        init();
      }
      return deferred.promise;
    };
    factory.getValuesListAndMergeByTime = function(nodesDes, kpisDes, timespan, mtspan, mode) {
      var minspan = mtspan;
      var deferred = q.defer();
      var nodes = nodesDes.map(function(element){
        return element.id
      });
      var kpis = kpisDes.map(function(element){
        return element.id
      });
      var kpiQueryModel = {
        category: 'time',
        isRealTimeData: true,
        timePeriod: timespan ? timespan : 24 * 3600 * 1000,
        nodeIds: nodes,
        kpiCodes: kpis,
        startTime: null,
        endTime: null,
        timeRange: "",
        statisticType: "psiot",
        condList: []
      };
      var param = ["kpi", kpiQueryModel];
      kpiDataService.getValueList(param, function(event) {
        callback(event);
      });
      function callback(event) {
        var minTimespan, pack;
        if(event.code == "0") {
          if(minspan) {
            minTimespan = minspan;
          }
          else {
            minTimespan = 0;
          }
          var result = event.data;
          var series = [], xAxis = [], legend=[];
          var result = result.map(function(element){
            var timeStamp = new Date(element.arisingTime).getTime();
            return {
              kpiCode : element.kpiCode,
              nodeId : element.nodeId,
              time : element.arisingTime,
              timeStamp : timeStamp,
              value : element.value
            }
          });
          var allTimes = result.map(function(elem){
            return elem.timeStamp;
          });
          var startTime = Math.min.apply(null,allTimes);
          var endTime = Math.max.apply(null,allTimes);
          var time = startTime;
          if(minTimespan > 0) {
            while(time <= endTime) {
              xAxis.push(time);
              time += minTimespan;
            }
          }
          else {
            xAxis = allTimes;
          }
          if(xAxis[xAxis.length - 1] != endTime) {
            xAxis.push(endTime);
          }
          //xAxis = xAxis;
          if(mode == 'scatter') {
            var mergeByCi = result.reduce(reduceByCi, []);
            for(var i in mergeByCi)
            {
              (function(index, element){
                series[i] = {};
                series[i].name = {
                  ci : element.resource.label,
                }
                if(xAxis.length > 0){
                  series[index].data = []
                  for(var j = 0; j < xAxis.length - 1; j++)
                  {
                    var st = xAxis[j];
                    var et = xAxis[j + 1];
                    var list = []
                    for(var k in element.valueGroup){
                      (function(inx, elem){
                        var find = elem.data.find(function(el){
                          return (st <= el.timeStamp && el.timeStamp < et);
                        });
                        list.push(find ? find.value : undefined);
                      })(k, element.valueGroup[k]);
                    }
                    series[index].data.push(list);
                  }
                }
                else
                {
                  series[i].data = [];
                }
              })(i, mergeByCi[i])
            }
          }
          else
          {
            var mergeByCiKpi = result.reduce(reduceByCiKpi,[]);
            for(var i in mergeByCiKpi)
            {
              (function(index, element){
                series[i] = {};
                series[i].name = {
                  ci : element.resource.label,
                  kpi : element.kpi.label
                }
                legend.push({
                  ci : element.resource.label,
                  kpi : element.kpi.label
                })
                if(xAxis.length > 0){
                  series[index].data = []
                  for(var j = 0; j < xAxis.length - 1; j++)
                  {
                    var st = xAxis[j];
                    var et = xAxis[j + 1]
                    var find = element.valueList.find(function(el){
                      return (st <= el.timeStamp && el.timeStamp < et);
                    });
                    series[index].data.push(find ? find.value : undefined);
                  }
                }
                else
                {
                  series[i].data = [];
                }
              })(i, mergeByCiKpi[i])
            }
          }
          pack = {
            xAxis : xAxis,
            series : series,
            legend : legend
          }
          deferred.resolve(pack);
        } else {
          deferred.reject("通过设备[" + nodes.toString() + "], 指标[" + kpis.toString() + "]获取数据列表失败。");
        }
        function error(err) {
          deferred.reject("通过设备[" + nodes.toString() + "], 指标[" + kpis.toString() + "]获取数据列表失败。");
        }
        var startTime;
        function reduceByCiKpi(prev, next) {
          var nodeId = next.nodeId;
          var kpiCode = next.kpiCode;
          var resource = nodesDes.find(function(elem){
            return elem.id == nodeId;
          });
          var kpi = kpisDes.find(function(elem){
            return elem.id == kpiCode;
          });
          var find = prev.find(function(element){
            return element.resource.id == nodeId && element.kpi.id == kpiCode;
          });
          if(find) {
            find.valueList.push({
              time : next.time,
              timeStamp : next.timeStamp,
              value : next.value
            })
          } else {
            prev.push({
              resource : resource,
              kpi : kpi,
              valueList : [{
                time : next.time,
                timeStamp : next.timeStamp,
                value : next.value
              }]
            })
          }
          return prev;
        }
        function reduceByCi(prev, next) {
          var nodeId = next.nodeId;
          var kpiCode = next.kpiCode;
          var resource = nodesDes.find(function(elem){
            return elem.id == nodeId;
          });
          var kpi = kpisDes.find(function(elem){
            return elem.id == kpiCode;
          });
          var find = prev.find(function(element){
            return element.resource.id == nodeId;
          })
          if(find)
          {
            var valueGroup = find.valueGroup;
            var fd = find.valueGroup.find(function(element){
              return element.kpi.id == kpiCode;
            })
            if(fd)
            {
              fd.data.push({
                time : next.time,
                timeStamp : next.timeStamp,
                value : next.value
              })
            }
            else
            {
              find.valueGroup.push({
                kpi : kpi,
                data : [{
                  time : next.time,
                  timeStamp : next.timeStamp,
                  value : next.value
                }]
              })
            }
          }
          else
          {
            prev.push({
              resource : resource,
              valueGroup : [{
                kpi : kpi,
                data : [{
                  time : next.time,
                  timeStamp : next.timeStamp,
                  value : next.value
                }]
              }]
            })
          }
          return prev;
        }
      }
      return deferred.promise;
    };
    factory.kpis = Object.create({
      models: [],
      valueCached: [],
      fun : 'resourceUIService.getKpisByModelId',
      getMinTimeSpan : function(kpis) {
        var deferred = q.defer()
        resourceUIService.getKpisByKpiIds(kpis, success, error);
        function success(data){
          if(data.minTimespan) {
            deferred.resolve(data.minTimespan)
          }
        }
        function error(err) {
           
        }
        return deferred.promise;
      },
      getByKpiIds: function(kpis) {
        var deferred = q.defer(), inside, outside, cur = this;
        inside = [];
        outside = [];
        insideValueCached.apply(null, kpis);
        function insideValueCached() {
          for (var i in arguments) {
            (function(kpiId) {
              var find = cur.valueCached.filter(function(kpi) {
                return kpiId == kpi.id;
              });
              if (find.length > 0) {
                inside.push(find[0]);
              } else {
                outside.push(kpiId);
              }
            })(arguments[i]);
          }
        }
        resourceUIService.getKpisByKpiIds(outside, success, error);
        function success(data){
          try {
            if (data) {
              var result = [];
              delete data.minTimespan;
              for (var i in data) {
                result.push(data[i]);
                cur.valueCached.push(data[i]);
              }
              deferred.resolve(inside.concat(result));
            } else {
              throw "data is undefined !!"
            }
          } catch (err) {
            deferred.reject(err)
          }
        }
        function error(err) {
          throw err;
        }
        return deferred.promise;
      },
      getBymodelId: getBymodelId
    });
    function getAll(cache) {
      var cached;
      cached = (cache == undefined) ? true : cache;
      var cur = this, deferred = q.defer();
      if (cur.status == 'COMPLETE' && cached )
      {
        deferred.resolve(cur.valueCached);
      }
      else if(cur.status == 'INPROGRESS' && cached)
      {
        if(cur.promise)
        {
          cur.promise.then(success, error);
        }
      }
      else if(cur.status == 'WAIT' || cached == false)
      {
        cur.status = 'INPROGRESS';
        cur.promise = deferred.promise;
        eval(cur.fun)(function(event){
          try {
            if (event.data) {
              success(event.data);
            } else {
              cur.errObj = {
                caller : cur.fun,
                message : "databack is undefined !!"
              };
              throw cur.errObj;
            }
          } catch (err) {
            deferred.reject(err);
          }
        }, error);
      }
      else if(cur.status == 'ERROR' && cached)
      {
        deferred.reject(cur.errObj);
      }
      function success(data) {
        delete cur.defer;
        cur.status = 'COMPLETE';
        cur.valueCached = data;
        deferred.resolve(data);
      }
      function error(err) {
        cur.status = 'ERROR';
        cur.valueCached = [];
        cur.errObj = err;
        deferred.reject(cur.errObj);
      }
      return deferred.promise;
    };
    function getBymodelId(modelId){
      var cur = this, deferred = q.defer();
      var findModel = cur.models.find(function(element){
        return element.id == modelId;
      });
      if (findModel) {
        if(findModel.status == 'COMPLETE') {
          var findValue = cur.valueCached.filter(function(kpi) {
            return kpi.modelId == modelId;
          });
          deferred.resolve(findValue);
        } else if(findModel.status == 'INPROGRESS') {
          var promise = findModel.promise;
          promise.then(success, error);
        }
      } else {
        cur.models.push({
          id : modelId,
          promise : deferred.promise,
          status : 'INPROGRESS',
        });
        if(modelId){
          eval(cur.fun)(modelId, function(event){
            try {
              if (event.data) {
                success(event.data)
              } else {
                throw "API-getBymodelId[" + modelId + "]" + "databack is undefined !!";
              }
            } catch (err) {
              deferred.reject(err)
            }
          }, error);
        } else {
          deferred.reject("modelId为空")
        }

      }
      function success(data) {
        for (var i in data) {
          data[i].modelId = modelId;
        }
        var find = cur.models.find(function(element){
          return element.id == modelId;
        });
        delete find.promise;
        find.status = 'COMPLETE';
        cur.valueCached = cur.valueCached.filter(function(elem) {
          return elem.modelId != modelId;
        });
        cur.valueCached = cur.valueCached.concat(data);
        deferred.resolve(data);
      }
      function error(err) {
         
      }
      return deferred.promise;
    };
    return factory;
  }
});