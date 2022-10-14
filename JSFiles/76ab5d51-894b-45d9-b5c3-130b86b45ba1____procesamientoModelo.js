var _ = require("underscore");
var pd = require('pretty-data').pd;
var parser = require("./parser.js");
var x2js = require('x2js');
var subproceso = require('./subproceso');
var env = require('./env');
var fs = require('fs');

var proceso = {
  collaboration : {
    participant : [],
    messageFlow : []
  },
  process : {
    laneSet : {
      lane : []
    },
    startEvent : [],
    userTask : [],
    manualTask : [],
    serviceTask : [],
    exclusiveGateway : [],
    parallelGateway : [],
    intermediateCatchEvent : [],
    intermediateThrowEvent : [],
    boundaryEvent : [],
    endEvent : [],
    subProcess : [],
    sequenceFlow : []
  }
};

var conv = new x2js({
  arrayAccessFormPaths : [
    "definitions.process.startEvent" ,
    "definitions.process.userTask" ,
    "definitions.process.manualTask" ,
    "definitions.process.serviceTask" ,
    "definitions.process.exclusiveGateway" ,
    "definitions.process.parallelGateway" ,
    "definitions.process.intermediateCatchEvent" ,
    "definitions.process.intermediateThrowEvent" ,
    "definitions.process.boundaryEvent" ,
    "definitions.process.endEvent" ,
    "definitions.process.subProcess" ,
    "definitions.process.sequenceFlow"
  ]
});

var SequenceFlow_GlobalID = 1;
var path = __dirname;
var SUBPROCESSREP = 2;

var options = {
  keysColor: 'blue',
  dashColor: 'white',
  stringColor: 'green'
};

//Inicializo estructuras
var start = function(model) {
  proceso = {
    collaboration : {
      participant : [],
      messageFlow : []
    },
    process : {
      laneSet : {
        lane : []
      },
      startEvent : [],
      userTask : [],
      manualTask : [],
      serviceTask : [],
      exclusiveGateway : [],
      parallelGateway : [],
      intermediateCatchEvent : [],
      intermediateThrowEvent : [],
      boundaryEvent : [],
      endEvent : [],
      subProcess : [],
      sequenceFlow : []
    }
  };
  proceso.process.startEvent.push({
    "_id":"StartEvent_1"
  });
  proceso.process.endEvent.push({
    "_id":"EndEvent"
  });
}

//Primera iteracion de procesamieno del modelo
//Genero los elementos XML para los lanes a partir de
//los actores de las tareas y los eventos
var obtenerLanes = function(elem) {
  if (elem.tipo == "task") {
    if (_.find(proceso.process.laneSet.lane, function(val){ return val._name == elem.sentencia.actor}) == null) {
      proceso.process.laneSet.lane.push(
        {"flowNodeRef": [],"_id" : "Lane_"+elem.sentencia.actor.replace(/\s/g,'_'),
         "_name": elem.sentencia.actor});
    }
  } else if (elem.tipo == "evento") {
    if (_.find(proceso.process.laneSet.lane, function(val){ return val._name == elem.sentencia.actor}) == null) {
      proceso.process.laneSet.lane.push(
        {"flowNodeRef": [],"_id" : "Lane_"+elem.sentencia.actor.replace(/\s/g,'_'),
         "_name": elem.sentencia.actor});
    }
  } else if (elem.tipo == "xor") {
    for (var i=0; i < elem.sentencia.length; i++) {
      obj = elem.sentencia[i];
      obtenerLanes(obj);
    }
  } else if (elem.tipo == "and") {
    for (var i=0; i < elem.sentencia.length; i++) {
      obj = elem.sentencia[i];
      obtenerLanes(obj);
    }
  } else if (elem.tipo == "loop") {
    for (var i=0; i < elem.sentencia.length; i++) {
      obj = elem.sentencia[i];
      obtenerLanes(obj);
    }
  } else if (elem.tipo == "secuencia") {
    for (var i=0; i < elem.sentencia.length; i++) {
      obj = elem.sentencia[i];
      obtenerLanes(obj);
    }
  } else if (elem.tipo == "adjunto") {
    for (var i=0; i < elem.sentencia.length; i++) {
      obj = elem.sentencia[i];
      obtenerLanes(obj);
    }
  }
}

var generarPool = function(evento, idEvento) {
  var prefix = "pool_id_"
  evento.pool = evento.pool.replace(/\s/g, "_");
  var idPool = prefix + evento.pool;
  if (!_.find(proceso.collaboration.participant, function(val){return val._id == idPool})) {
    proceso.collaboration.participant.push({"_id": idPool, "_name":"pool_"+evento.pool});
  }
  var idMensaje = "mensaje_" + idEvento;
  if (evento.throw) {
    proceso.collaboration.messageFlow.push({"_id":idMensaje, "_sourceRef":"_"+idEvento , "_targetRef":idPool})
  } else {
    proceso.collaboration.messageFlow.push({"_id":idMensaje, "_sourceRef":idPool , "_targetRef":"_"+idEvento})
  }
}

//Segunda iteracion de procesamiento del modelo
//Generlo los elementos XML correspondientes a
//las tareas, eventos y compuertas
var obtenerElementos = function(elem) {
  if (elem.tipo == "task") {
    if (elem.sentencia.task == "service") {
      var tarea = {"_id":elem.id, "_name":elem.sentencia.accion};
      proceso.process.serviceTask.push(tarea);
    } else if (elem.sentencia.task == "human") {
      var tarea = {"_id":elem.id, "_name":elem.sentencia.accion};
      proceso.process.userTask.push(tarea);
    } else if (elem.sentencia.task == "manual") {
      var tarea = {"_id":elem.id, "_name":elem.sentencia.accion};
      proceso.process.manualTask.push(tarea);
    } else if (elem.sentencia.task == "subproceso") {
      var subproceso = {"_id":elem.id, "_name":elem.sentencia.accion};
      proceso.process.subProcess.push(subproceso);
    }
  } else if (elem.tipo == "evento") {
    if (elem.sentencia.evento.tipo == "timer") {
      var intermediateCatchEvent = {"_id":elem.id};
      extensionEvento(intermediateCatchEvent, elem.sentencia.evento);
      proceso.process.intermediateCatchEvent.push(intermediateCatchEvent);
    } else if (elem.sentencia.evento.tipo == "mensaje") {
      if (elem.sentencia.evento.throw) {
        var intermediateThrowEvent = {"_id":elem.id};
        extensionEvento(intermediateThrowEvent, elem.sentencia.evento);
        proceso.process.intermediateThrowEvent.push(intermediateThrowEvent);
        generarPool(elem.sentencia.evento, elem.id)
      } else {
        var intermediateCatchEvent = {"_id":elem.id};
        extensionEvento(intermediateCatchEvent, elem.sentencia.evento);
        proceso.process.intermediateCatchEvent.push(intermediateCatchEvent);
        generarPool(elem.sentencia.evento, elem.id)
      }
    }
  } else if (elem.tipo == "xor") {
    var id = elem.id;
    var abre = {"_id":id, "_default":""};
    proceso.process.exclusiveGateway.push(abre);
    for (var i=0; i < elem.sentencia.length; i++) {
      obtenerElementos(elem.sentencia[i]);
    }
  } else if (elem.tipo == "and") {
    var id = elem.id;
    var abre = {"_id":id};
    proceso.process.parallelGateway.push(abre);
    for (var i=0; i < elem.sentencia.length; i++) {
      obtenerElementos(elem.sentencia[i]);
    }
  } else if (elem.tipo == "loop") {
    var id = elem.id;
    var abre = {"_id":id};
    proceso.process.exclusiveGateway.push(abre);
    for (var i = 0; i < elem.sentencia.length; i++) {
      obtenerElementos(elem.sentencia[i])
    }
  } else if (elem.tipo == "secuencia") {
    for (var i=0; i < elem.sentencia.length; i++) {
      obtenerElementos(elem.sentencia[i]);
    }
  } else if (elem.tipo == "cierro") {
    var cierra;
    if (elem.sentencia == "and") {
      var cierra = {"_id":elem.id};
      proceso.process.parallelGateway.push(cierra);
    } else if (elem.sentencia == "xor") {
      var cierra = {"_id":elem.id};
      proceso.process.exclusiveGateway.push(cierra);
    } else if (elem.sentencia == "loop") {
      var cierra = {"_id":elem.id, "_default":""};
      proceso.process.exclusiveGateway.push(cierra);
    } else if (elem.sentencia == "adjunto") {
      var cierra = {"_id":elem.id};
      proceso.process.exclusiveGateway.push(cierra);
    }
  } else if (elem.tipo == "adjunto") {
    var adjunto = {"_id":elem.id, "_attachedToRef":elem.adjunto_a_id, "_cancelActivity":elem.interrumpible};
    extensionEvento(adjunto, elem.evento);
    proceso.process.boundaryEvent.push(adjunto);
    for (var i=0; i < elem.sentencia.length; i++) {
      obj = elem.sentencia[i];
      obtenerElementos(obj);
    }
  }
}

//Tercera iteracion de procesamiento del modelo
//Asocio los elementos generados en la segunda iteracion
//a los lanes correspondientes
var asociarElementosLanes = function(elem) {
  var lane = _.find(proceso.process.laneSet.lane, function(val){return val._name == elem.lane});
  if (elem.tipo == "task") {
    var task;
    if (elem.sentencia.task == "service") {
      task = _.find(proceso.process.serviceTask, function(val){ return val._id == elem.id});
    } else if (elem.sentencia.task == "human") {
      task = _.find(proceso.process.userTask, function(val){ return val._id == elem.id});
    } else if (elem.sentencia.task == "manual") {
      task = _.find(proceso.process.manualTask, function(val){ return val._id == elem.id});
    } else if (elem.sentencia.task == "subproceso") {
      task = _.find(proceso.process.subProcess, function(val){ return val._id == elem.id});
    }
    var nodeRef = {"__text":task._id}
    lane.flowNodeRef.push(nodeRef);
  } else if (elem.tipo == "evento") {
    var evento;
    if (elem.sentencia.evento.tipo == "mensaje" && elem.sentencia.evento.throw == true) {
      evento = _.find(proceso.process.intermediateThrowEvent, function(val){ return val._id == elem.id});
    } else {
      evento = _.find(proceso.process.intermediateCatchEvent, function(val){ return val._id == elem.id});
    }
    var nodeRef = {"__text":evento._id}
    lane.flowNodeRef.push(nodeRef);
  } else if (elem.tipo == "xor") {
    var gwAbre = _.find(proceso.process.exclusiveGateway, function(val) {return val._id == elem.id});
    var nodeRef = {"__text":gwAbre._id}
    lane.flowNodeRef.push(nodeRef);
    for (var i=0; i < elem.sentencia.length; i++) {
      asociarElementosLanes(elem.sentencia[i]);
    }
  } else if (elem.tipo == "and") {
    var gwAbre = _.find(proceso.process.parallelGateway, function(val) {return val._id == elem.id});
    var nodeRef = {"__text":gwAbre._id}
    lane.flowNodeRef.push(nodeRef);
    for (var i=0; i < elem.sentencia.length; i++) {
      asociarElementosLanes(elem.sentencia[i]);
    }
  } else if (elem.tipo == "loop") {
    var gwAbre = _.find(proceso.process.exclusiveGateway, function(val) {return val._id == elem.id});
    var nodeRef = {"__text":gwAbre._id}
    lane.flowNodeRef.push(nodeRef);
    for (var i=0; i < elem.sentencia.length; i++) {
      asociarElementosLanes(elem.sentencia[i]);
    }
  } else if (elem.tipo == "secuencia") {
    for (var i=0; i < elem.sentencia.length; i++) {
      asociarElementosLanes(elem.sentencia[i]);
    }
  } else if (elem.tipo == "cierro") {
    var cierra;
    if (elem.sentencia == "and") {
      cierra = _.find(proceso.process.parallelGateway, function(val) {return val._id == elem.id});
      var nodeRef = {"__text":cierra._id}
      lane.flowNodeRef.push(nodeRef);
    } else if (elem.sentencia == "xor") {
      cierra = _.find(proceso.process.exclusiveGateway, function(val) {return val._id == elem.id});
      var nodeRef = {"__text":cierra._id}
      lane.flowNodeRef.push(nodeRef);
    } else if (elem.sentencia == "loop") {
      cierra = _.find(proceso.process.exclusiveGateway, function(val) {return val._id == elem.id});
      var nodeRef = {"__text":cierra._id}
      lane.flowNodeRef.push(nodeRef);
    } else if (elem.sentencia == "adjunto") {

    }
  } else if (elem.tipo == "adjunto") {
    for (var i=0; i < elem.sentencia.length; i++) {
      obj = elem.sentencia[i];
      asociarElementosLanes(obj);
    }
  }
}

//Cuarta iteracion de procesamiento del modelo
//Genero los elementos XML necesarios para los flujos
var procesarFlujos = function(elem) {
  for (var i = 0; i < elem.sig.length; i++) {
      var idFlujo = elem.id + "_" + elem.sig[i];
      var flujo = {"_id":idFlujo, "_sourceRef":elem.id, "_targetRef": elem.sig[i]};
      if (elem.tipo == "xor") {
        if (elem.sentencia[i].condicion == "defecto") {
          var gw = _.find(proceso.process.exclusiveGateway, function(val) {return val._id == elem.id});
          gw._default = idFlujo;
        } else {
          flujo._name = elem.sentencia[i].condicion;
        }
      } else if (elem.tipo == "cierro" && elem.tag == "loop") {
        if (elem.sig[i] != elem.ref) {
          var gw = _.find(proceso.process.exclusiveGateway, function(val) {return val._id == elem.id});
          gw._default = idFlujo;
        } else {
          flujo._name = elem.expresion;
        }
      }
      proceso.process.sequenceFlow.push(flujo);
  }
}

function esSerializable(nodo){
  return nodo.tipo in {
    "task" : true, "evento" : true, "and" : true, "xor" : true, "loop" : true, "adjunto" : true, "cierro" : true,
  }
}

var generarFlujos = function(modelo) {
  //inicializo variables locales
  var stack =[];
  var nodo;
  stack.push(modelo);
  while (stack.length > 0) {
    nodo = stack.pop();
    if(esSerializable(nodo)){
      procesarFlujos(nodo);
    }
    if(nodo.sentencia instanceof Array){
      for (var i = nodo.sentencia.length-1; i >= 0; i--) {
        stack.push(nodo.sentencia[i]);
      }
    }
  }
  for (var i = 0; i < proceso.process.sequenceFlow.length; i++) {
    if (proceso.process.sequenceFlow[i]._targetRef == 'F') {
      proceso.process.sequenceFlow[i]._targetRef = "EndEvent";
    }
  }
}

var conectarStartEvent = function(modelo) {
  var primero = modelo[0];
  var flujoStartEvent = {"_id":"", "_sourceRef":proceso.process.startEvent[0]._id, "_targetRef": ""};
  if (primero.tipo == "task") {
    var task;
    if (primero.sentencia.task == "service") {
      task = _.find(proceso.process.serviceTask, function(val){ return val._id == primero.id});
    } else if (primero.sentencia.task == "human") {
      task = _.find(proceso.process.userTask, function(val){ return val._id == primero.id});
    } else if (primero.sentencia.task == "manual") {
      task = _.find(proceso.process.manualTask, function(val){ return val._id == primero.id});
    } else if (primero.sentencia.task == "subproceso") {
      task = _.find(proceso.process.subProcess, function(val){ return val._id == primero.id});
    }
    flujoStartEvent._id = proceso.process.startEvent[0]._id + "_" + task._id;
    flujoStartEvent._targetRef = task._id;
    var lane = _.find(proceso.process.laneSet.lane, function(val){return val._name == primero.sentencia.actor});
    lane.flowNodeRef.push({"__text":"StartEvent_1"});
  } else if (primero.tipo == "and") {
    var andGW = _.find(proceso.process.parallelGateway, function(val) {return val._id == primero.id});
    flujoStartEvent._id = proceso.process.startEvent[0]._id + "_" + andGW._id;
    flujoStartEvent._targetRef = andGW._id;
    var lane = _.find(proceso.process.laneSet.lane, function(val){return val._name == primero.lane});
    lane.flowNodeRef.push({"__text":"StartEvent_1"});
  } else if (primero.tipo == "xor") {
    var xorGW = _.find(proceso.process.exclusiveGateway, function(val) {return val._id == primero.id});
    flujoStartEvent._id = proceso.process.startEvent[0]._id + "_" + xorGW._id;
    flujoStartEvent._targetRef = xorGW._id;
    var lane = _.find(proceso.process.laneSet.lane, function(val){return val._name == primero.lane});
    lane.flowNodeRef.push({"__text":"StartEvent_1"});
  } else if (primero.tipo == "loop") {
    var loopGW = _.find(proceso.process.exclusiveGateway, function(val) {return val._id == primero.id});
    var lane = _.find(proceso.process.laneSet.lane, function(val){return val._name == primero.lane});
    lane.flowNodeRef.push({"__text":"StartEvent_1"});
    flujoStartEvent._id = proceso.process.startEvent[0]._id + "_" + loopGW._id;
    flujoStartEvent._targetRef = loopGW._id;
  } else if (primero.tipo == "evento") {
    var evento;
    if (primero.sentencia.evento.tipo == "mensaje" && primero.sentencia.evento.throw) {
      evento = _.find(proceso.process.intermediateThrowEvent, function(val){ return val._id == primero.id});
    } else {
      evento = _.find(proceso.process.intermediateCatchEvent, function(val){ return val._id == primero.id});
    }
    var lane = _.find(proceso.process.laneSet.lane, function(val){return val._name == primero.sentencia.actor});
    flujoStartEvent._id = proceso.process.startEvent[0]._id + "_" + evento._id;
    flujoStartEvent._targetRef = evento._id;
    lane.flowNodeRef.push({"__text":"StartEvent_1"});
  }
  proceso.process.sequenceFlow.push(flujoStartEvent);
}

var agregarSubprocesos = function(modelo, proceso) {
  for (var i=0; i<modelo.sentencia.length; i++) {
    var elem = modelo.sentencia[i];
    if (elem.tipo == "task" && elem.sentencia.task == "subproceso" && env.conSubproceso) {
      var subProcessPos = 0;
      for (var j=0; j< proceso.process.subProcess.length; j++) {
        if (proceso.process.subProcess[j]._id == elem.id) {
          subProcessPos = j;
        }
      }
      templateSubproceso(elem, subProcessPos, false, false);
    } else if (elem.tipo == "adjunto") {
      for (var j=0; j<elem.sentencia.length; j++) {
        agregarSubprocesos(elem.sentencia[j], proceso);
      }
    } else if (elem.tipo == "and") {
      for (var j=0; j<elem.sentencia.length; j++) {
        agregarSubprocesos(elem.sentencia[j], proceso);
      }
    } else if (elem.tipo == "xor") {
      for (var j=0; j<elem.sentencia.length; j++) {
        agregarSubprocesos(elem.sentencia[j], proceso);
      }
    } else if (elem.tipo == "loop") {
      for (var j=0; j<elem.sentencia.length; j++) {
        agregarSubprocesos(elem.sentencia[j], proceso);
      }
    }
  }
}

function templatesProceso(proceso, nombreProceso){
  //FIXME revisar los campos que son asignados estaticamente
  var bpmn = {};
  var idProceso = "id_" + nombreProceso;
  bpmn.definitions = {
    "_xmlns" : "http://www.omg.org/spec/BPMN/20100524/MODEL",
    "_xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
    "_xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
    "_xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
    "_xmlns:activiti": "http://activiti.org/bpmn",
    "_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
    "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "_expressionLanguage":"http://www.w3.org/1999/XPath",
    "_targetNamespace":"http://sourceforge.net/bpmn/definitions/_1459655886338",
  }

  var idPool = "pool_" + idProceso;
  proceso.collaboration.participant.push({"_id":idPool, "_name":"pool_"+nombreProceso, "_processRef":idProceso});

  proceso.process.laneSet._id = "laneSet_"+idProceso;
  bpmn.definitions.collaboration = proceso.collaboration;
  bpmn.definitions.collaboration._id = "Collaboration_id";

  bpmn.definitions.process = proceso.process;
  bpmn.definitions.process._id = idProceso;
  bpmn.definitions.process._isExecutable = true;
  bpmn.definitions.process._name = nombreProceso;
  return bpmn;
}

var templateElementos = function(elem) {

  if (elem.tipo == "task" && elem.sentencia.task == "human") {
    var taskPos = 0;
    for (var i=0; i< proceso.process.userTask.length; i++) {
      if (proceso.process.userTask[i]._id == "_"+elem.id) {
        taskPos = i;
      }
    }
    templateCampos(elem, taskPos);
  } else if (elem.tipo == "task" && elem.sentencia.task == "service") {
      var taskPos = 0;
      for (var i=0; i< proceso.process.serviceTask.length; i++) {
        if (proceso.process.serviceTask[i]._id == "_"+elem.id) {
          taskPos = i;
        }
      }
      templateServiceTask(elem, taskPos);
  } else if (elem.tipo == "task" && elem.sentencia.task == "manual") {
      var taskPos = 0;
      for (var i=0; i< proceso.process.manualTask.length; i++) {
        if (proceso.process.manualTask[i]._id == "_"+elem.id) {
          taskPos = i;
        }
      }
  } else if (elem.tipo == "task" && elem.sentencia.task == "subproceso" && env.conSubproceso) {
    var subProcessPos = 0;
    for (var i=0; i< proceso.process.subProcess.length; i++) {
      if (proceso.process.subProcess[i]._id == "_"+elem.id) {
        subProcessPos = i;
      }
    }
    templateSubproceso(elem, subProcessPos, true, false);
  } else if (elem.tipo == "evento") {
    if (elem.sentencia.evento.tipo == "mensaje") {
      if (elem.sentencia.evento.throw) {
        for (var i=0; i< proceso.process.intermediateThrowEvent.length; i++) {
          if (proceso.process.intermediateThrowEvent[i]._id == "_"+elem.id ) {
            eventPos = i;
            break;
          }
        }
        templatesEventoMensajeThrow(elem, eventPos);
      } else {
        for (var i=0; i< proceso.process.intermediateCatchEvent.length; i++) {
          if (proceso.process.intermediateCatchEvent[i]._id == "_"+elem.id ) {
            eventPos = i;
            break;
          }
        }
        templatesEventoMensajeCatch(elem, eventPos);
      }
    }
  } else if (elem.tipo == "xor") {
    templateExpresionesXOR(elem);
    for (var i=0; i < elem.sentencia.length; i++) {
      templateElementos(elem.sentencia[i]);
    }
  } else if (elem.tipo == "and") {
    for (var i=0; i < elem.sentencia.length; i++) {
      templateElementos(elem.sentencia[i]);
    }
  } else if (elem.tipo == "loop") {
    for (var i = 0; i < elem.sentencia.length; i++) {
      templateElementos(elem.sentencia[i])
    }
  } else if (elem.tipo == "secuencia") {
    for (var i=0; i < elem.sentencia.length; i++) {
      templateElementos(elem.sentencia[i]);
    }
  } else if (elem.tipo == "cierro" && elem.tag == "loop") {
    templateExpresionesLOOP(elem);
  } else if (elem.tipo == "adjunto") {
    for (var i=0; i < elem.sentencia.length; i++) {
      templateElementos(elem.sentencia[i]);
    }
  }
}

function templateEventoTiempoExpresion(eventoTiempo){
  switch (eventoTiempo.unidad) {
    case "segundos":
    case "segundo":
    return "PT"+eventoTiempo.tiempo + "S"
    break;
    case "minutos":
    case "minuto":
    return "PT"+eventoTiempo.tiempo + "M"
    break;
    case "horas":
    case "hora":
    return "PT"+eventoTiempo.tiempo + "H"
    break;
    case "dias":
    case "dia":
    return "P"+eventoTiempo.tiempo + "D"
    break;
    case "semanas":
    case "semana":
    return "P"+eventoTiempo.tiempo + "W"
    break;
    case "meses":
    case "mes":
    return "P"+eventoTiempo.tiempo + "M"
    break;
    case "años":
    case "año":
    return "P"+eventoTiempo.tiempo + "Y"
    break;
    default:
  }
}

var extensionEvento = function(elem, evento) {
  var extensionEvento;
  if (evento.tipo == "timer") {
    extensionEvento = {"timerEventDefinition":{"timeDuration":templateEventoTiempoExpresion(evento)}}
  } else if (evento.tipo == "mensaje") {
    evento.pool = evento.pool.replace(/\s/g, "_");
    extensionEvento = {"messageEventDefinition":{ "_messageRef":evento.pool}}
  }
  _.extend(elem, extensionEvento);
}

var templatesEventoMensajeThrow = function(elem, eventPos) {
  var mailTask = {"serviceTask":{"_id":"_"+elem.id, "_name":"mensaje para "+ elem.sentencia.evento.pool, "_activiti:type":"mail"}};
  mailTask.serviceTask['extensionElements'] = {
    'activiti:field':[
      {"_name": "to","activiti:string": "proyectotbpm@gmail.com"},
      {"_name": "subject","activiti:string": mailTask.serviceTask._name},
      {"_name": "html","activiti:string": "Se ejecuto el evento."}
    ]
  }
  if (!proceso.process.serviceTask) {
    proceso.process.serviceTask = [];
  }
  proceso.process.serviceTask.push(mailTask.serviceTask);
  proceso.process.intermediateThrowEvent.splice(eventPos,1);
  if (proceso.process.intermediateThrowEvent.length == 0) {
    delete(proceso.process.intermediateThrowEvent);
  }
}

var templatesEventoMensajeCatch = function(elem, eventPos) {
  var task = {"userTask":{"_id":"_"+elem.id, "_name":"espero mensaje de "+ elem.sentencia.evento.pool, "_activiti:candidateGroups":elem.sentencia.actor}};
  if (!proceso.process.userTask) {
    proceso.process.userTask = [];
  }
  proceso.process.userTask.push(task.userTask);
  proceso.process.intermediateCatchEvent.splice(eventPos,1);
  if (proceso.process.intermediateCatchEvent.length == 0) {
    delete proceso.process.intermediateCatchEvent;
  }
}

var templateCampos = function(nodo, taskPos) {
  aux = {"userTask":{"_id":"_"+nodo.id , "_name":nodo.sentencia.accion, "_activiti:candidateGroups":nodo.sentencia.actor}}
  if(nodo.sentencia.campos){
    aux.userTask['extensionElements'] = {
      'formProperty' : []
    }
    for (var i = 0; i < nodo.sentencia.campos.length; i++) {
      var campo = nodo.sentencia.campos[i];
      var formProperty = {"__prefix":"activiti", "_id":campo.nombre, "_name":campo.nombre, "_type":"string", "_required":campo.obligatorio};
      aux.userTask.extensionElements.formProperty.push(formProperty);
    }
  }
  proceso.process.userTask[taskPos] = aux.userTask;
}

var templateServiceTask = function(elem, taskPos) {
  var classpath = "org.proyecto.";
  var nombreClase = "Servicetask";
  aux = {"serviceTask":{"_id":"_"+elem.id , "_name":elem.sentencia.accion, "_activiti:class":classpath + nombreClase}}
  proceso.process.serviceTask[taskPos] = aux.serviceTask;
}

function buscarVariables(condicion){
  var variable = condicion.replace(/(\w+).*/,'$1')
  return variable;
}

var yaAgregueVariable = function(variable) {
  var result = false;
  for (var i=0; i<proceso.process.startEvent[0].extensionElements.formProperty.length;i++) {
    var elem = proceso.process.startEvent[0].extensionElements.formProperty[i];
    if (elem._id == variable) {
      return true;
    }
  }
  return result;
}

var templateExpresionesXOR = function(nodo) {
  for (var i=0; i < nodo.sentencia.length; i++) {
    if (nodo.sentencia[i].condicion != "defecto") {
      var condicion = nodo.sentencia[i];
      var flujo;
      for (var j=0; j< proceso.process.sequenceFlow.length; j++) {
        flujo = proceso.process.sequenceFlow[j];
        if (flujo._name && flujo._name == condicion.condicion) {
          var variable = buscarVariables(condicion.expresion)
          if (!proceso.process.startEvent[0].extensionElements) {
            proceso.process.startEvent[0].extensionElements = {}
            proceso.process.startEvent[0].extensionElements.formProperty = []
          }
          if (!yaAgregueVariable(variable)) {
            proceso.process.startEvent[0].extensionElements.formProperty.push({"__prefix":"activiti","_id":variable})
          }
          var condicion = "${"+condicion.expresion+"}"
          var conditionExpression = {"_xsi:type":"tFormalExpression","__cdata":condicion};
          flujo.conditionExpression = conditionExpression;
          proceso.process.sequenceFlow[j] = flujo;
        }
      }
    }
  }
}

var templateExpresionesLOOP = function(elem) {
  var flujo;
  for (var j=0; j< proceso.process.sequenceFlow.length; j++) {
    flujo = proceso.process.sequenceFlow[j];
    if (flujo._name && flujo._name == elem.expresion) {
      var variable = buscarVariables(elem.expresion)
      if (!proceso.process.startEvent[0].extensionElements) {
        proceso.process.startEvent[0].extensionElements = {}
        proceso.process.startEvent[0].extensionElements.formProperty = []
      }
      if (!yaAgregueVariable(variable)) {
        proceso.process.startEvent[0].extensionElements.formProperty.push({"__prefix":"activiti","_id":variable})
      }
      var condicion = "${"+elem.expresion+"}"
      var conditionExpression = {"_xsi:type":"tFormalExpression","__cdata":condicion};
      flujo.conditionExpression = conditionExpression;
      proceso.process.sequenceFlow[j] = flujo;
    }
  }
}

var templateSubproceso = function(elem, subProcessPos, ejecutable, estandar) {
  var prefix = ""
  if (ejecutable || estandar) {
    prefix = prefix + "_";
  }
  var xmlSubProceso = obtenerxmlSubProceso(elem.sentencia.accion, ejecutable, estandar);
  var jsonSubProceso = conv.xml_str2json(xmlSubProceso);
  jsonSubProceso.definitions.process = ajustarIDs(jsonSubProceso.definitions.process, elem.sentencia.accion);
  var auxSubProceso = {"subprocess":{"_id":"","_name":elem.sentencia.accion}};
  if (elem.sentencia.loop != null) {
    //TODO para los estandares lo manejamos igual que para activiti, ya que la forma tambien es estandar.
    if (ejecutable || estandar) {
      auxSubProceso.subprocess['multiInstanceLoopCharacteristics'] = {};
      auxSubProceso.subprocess.multiInstanceLoopCharacteristics._isSequential = true;
      auxSubProceso.subprocess.multiInstanceLoopCharacteristics.loopCardinality = SUBPROCESSREP;
    } else {
      auxSubProceso.subprocess['standardLoopCharacteristics'] = {};
    }
  }
  for (var variable in jsonSubProceso.definitions.process) {
    if (jsonSubProceso.definitions.process.hasOwnProperty(variable)) {
      auxSubProceso.subprocess[variable] = jsonSubProceso.definitions.process[variable];
      if ((ejecutable || estandar) && variable == "startEvent") {
        var startEventAux = jsonSubProceso.definitions.process[variable];
        if (startEventAux[0].extensionElements) {
          for (var extElem in startEventAux[0].extensionElements.formProperty) {
            var variable = startEventAux[0].extensionElements.formProperty[extElem]
            if (!yaAgregueVariable(variable._id)) {
              proceso.process.startEvent[0].extensionElements.formProperty.push({"__prefix":"activiti","_id":variable._id})
            }
          }
        }
      }
    }
  }
  auxSubProceso.subprocess._id = prefix+elem.id;
  delete auxSubProceso.subprocess.laneSet;
  delete auxSubProceso.subprocess["_isExecutable"];
  proceso.process.subProcess[subProcessPos] = auxSubProceso.subprocess;
}

var obtenerxmlSubProceso = function(nombreArchivo, ejecutable, estandar) {
  var archivo = path;
  if (estandar) {
    archivo = archivo + "/XMLestandares/" + nombreArchivo + ".bpmn";
  } else if (ejecutable) {
    archivo = archivo + "/XMLejecutables/" + nombreArchivo + ".bpmn";
  } else {
    archivo = archivo + "/XMLbasicos/" + nombreArchivo + ".bpmn";
  }
  try {
    var subproceso = fs.readFileSync(archivo).toString();
  } catch (e) {
    throw `Error al cargar el subproceso ${nombreArchivo}`;
  }
  return subproceso;
}

var generarEventosFinExtras = function(proceso) {
  var i = 1;
  var primero = true;
  var eventoFinViejo = proceso.process.endEvent[0];
  for (var flujo in proceso.process.sequenceFlow) {
    if (proceso.process.sequenceFlow[flujo]._targetRef == eventoFinViejo._id) {
      var idEventoFinNuevo = "EndEvent_" +i;
      var eventoFinNuevo = {"_id":idEventoFinNuevo}
      proceso.process.sequenceFlow[flujo]._targetRef = idEventoFinNuevo;
      i++;
      if (primero) {
        proceso.process.endEvent[0] = eventoFinNuevo;
        primero = false;
      } else {
        proceso.process.endEvent.push(eventoFinNuevo);
      }
    }
  }
}

var ajustarIDs = function(procesoJson, subproceso) {
  var prefix;
  if (subproceso == "") {
    prefix = "_";
  } else {
    prefix = subproceso;
  }
  // LANES
  if (subproceso == "") {
    for (var i=0; i< procesoJson.laneSet.lane.length; i++) {
      for (var j=0; j< procesoJson.laneSet.lane[i].flowNodeRef.length; j++) {
        procesoJson.laneSet.lane[i].flowNodeRef[j].__text = prefix + procesoJson.laneSet.lane[i].flowNodeRef[j].__text
      }
    }
  }
  for (var prop in procesoJson) {
    if (procesoJson.hasOwnProperty(prop) && prop != "laneSet") {
      for (var i=0; i<procesoJson[prop].length; i++) {
        procesoJson[prop][i]._id = prefix + procesoJson[prop][i]._id;
        if (prop == "exclusiveGateway") {
          if (procesoJson[prop][i]._default) {
            procesoJson[prop][i]._default = prefix + procesoJson[prop][i]._default;
          }
        } else if (prop == "boundaryEvent") {
          procesoJson[prop][i]._attachedToRef = prefix + procesoJson[prop][i]._attachedToRef;
        } else if (prop == "sequenceFlow") {
          procesoJson[prop][i]._sourceRef = prefix + procesoJson[prop][i]._sourceRef;
          procesoJson[prop][i]._targetRef = prefix + procesoJson[prop][i]._targetRef;
        }
      }
    }
  }
  return procesoJson;
}

var limpiarProceso = function(proceso, ejecutable) {
  if (ejecutable) {
    delete(proceso.collaboration.messageFlow)
    proceso.collaboration.participant = [];
  } else {
    for (var propiedad in proceso.process) {
      if (proceso.process.hasOwnProperty(propiedad) && proceso.process[propiedad].length == 0) {
        delete proceso.process[propiedad];
      }
    }
    if (proceso.collaboration.messageFlow && proceso.collaboration.messageFlow.length == 0) {
      delete proceso.collaboration.messageFlow;
    }
  }
  return proceso;
}

//var textToModel = function(texto) {
//  parser.init(__dirname + '/gramatica2.pegjs');
//  var modelo = parser.parse(texto);
//  return modelo;
//}

var modelToXML = function (modelo, nombreProceso) {
  start();
  for (var i=0; i<modelo.sentencia.length; i++) {
    obtenerLanes(modelo.sentencia[i]);
  }
  for (var i=0; i<modelo.sentencia.length; i++) {
    obtenerElementos(modelo.sentencia[i]);
  }
  for (var i=0; i < modelo.sentencia.length; i++) {
    asociarElementosLanes(modelo.sentencia[i]);
  }
  generarFlujos(modelo);
  conectarStartEvent(modelo.sentencia);
  agregarSubprocesos(modelo, proceso);
  proceso = limpiarProceso(proceso, false);

  generarEventosFinExtras(proceso);

  proceso.process = ajustarIDs(proceso.process, "");
  var bpmn = templatesProceso(proceso, nombreProceso);
  bpmn = conv.json2xml_str(bpmn);
  var result = {"xml":pd.xml(bpmn), "modelo":modelo, "proceso":proceso, "nombreProceso":nombreProceso}
  return result;
}

var modelToXMLactiviti = function(modelo, proceso, nombreProceso){
  for (var i=0; i<modelo.sentencia.length; i++) {
    templateElementos(modelo.sentencia[i]);
  }
  proceso = limpiarProceso(proceso, true);
  var bpmn = templatesProceso(proceso, nombreProceso);
  bpmn = conv.json2xml_str(bpmn);

  var result = {"xml":pd.xml(bpmn), "modelo":modelo, "proceso":proceso, "nombreProceso":nombreProceso}
  return result;
}

var xml2json = function(bpmn){
  var procesoJSON = conv.xml_str2json(bpmn);
  return pd.json(procesoJSON);
}

module.exports = {
  //textToModel : textToModel,
  modelToXML : modelToXML,
  modelToXMLactiviti : modelToXMLactiviti,
  xml2json : xml2json,
}
