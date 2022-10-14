
function toExtension(creep, extension){
    creep.say("transfer")
    var extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_EXTENSION && s.store.getFreeCapacity('energy') > 0
    })

    if(creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
        creep.say("Go to ext.")
        creep.moveTo(extension)
    }
}


function toController(creep){
    creep.say("upgrade")
    var controller = creep.room.controller

    if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
        creep.say("Go upgrade")
        creep.moveTo(controller)
    }
}

module.exports = {
    transfer: function(creep){
        creep.say("transfer")
        var extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_EXTENSION && s.store.getFreeCapacity('energy') > 0
        })

        if(extension){
            toExtension(creep, extension)
        }else{
            toController(creep)
        }
    },
    
}