
const roleHarvester = require('role.harvesterV2');
const roleHarvesterTarget = require('role.harvesterTarget');
const roleHarvesterTower = require('role.harvesterTower');
const roleHarvesterDeposit = require('role.harvesterDeposit');
const roleHarvesterLongDistance = require('role.harvesterLongDistance');
const roleHarvesterLongDistanceBoost = require('role.harvesterLongDistanceBoost');
const roleUpgrader = require('role.upgrader');
const roleUpgraderUsingContainer = require('role.upgraderUsingContainer');
const roleUpgraderUsingLink = require('role.upgraderUsingLink');
const roleUpgraderLongDistance = require('role.upgraderLongDistance');
const roleUpgraderLongDistanceBoost = require('role.upgraderLongDistanceBoost')
const roleBuilder = require('role.builderV2');
const roleAttacker = require('role.attacker');
const roleWithdrawer = require('role.withdrawer');
const roleRepairer = require('role.repairerV2');
const roleUrgentShifter = require('role.urgentShifter');
const roleProcessor = require('role.processorV2');
const roleProcessor2 = require('role.processor2');
const roleClaimer = require('role.claimer');
const roleBuilderLongDistance = require('role.builderLongDistance');
const roleInvader = require('role.invader');
const roleHealer = require('role.healer');
const roleCarrier = require('role.carrier');
const roleProcessor3 = require('role.processor3');
const roleTransferer = require('role.transferer');

const autoMarket = require('auto.market');
const invadeAttacker = require('invade.attacker');
const roleReserver = require('role.reserver');
const roleBuilderLongDistanceFlag = require('./role.builderLongDistanceFlag');
const roleClaimerFlag = require('./role.claimerFlag');

const roomDeposit = 'E30N51';

//local at room1
var numForEachType1 = {

    'claimer01': 1,
    'claimer11': 0,
    'builderLD1': 0,
    'invader1': 1,
    'defender01': 1,
    'healer1': 0,//too expensive

    'carrierL01': 1,
    'harvesterM1': 1,
    'harvesterLD01': 0,
    'harvesterLD11': 2,
    'upgraderLD11': 2,
    'repairer01': 1,
    'repairer11': 1,
    'upgraderUL1': 1,
    'builder01': 0,
    'builder11': 1,
    'urgentShifter1': 0,
    'upgrader01': 0,
    'upgrader11': 1,
    'upgraderUC1': 0,
    'processor1': 1,
    'withdrawer1': 1,
    'harvesterT01': 1,
    'harvesterT11': 1,
    'harvester01': 2,
    'harvester11': 1
}
const warTypes1 = ['upgrader01', 'upgrader11', 'upgraderUL1', 'urgentShifter1', 'processor1', 'withdrawer1', 'harvesterT01', 'harvesterT11', 'harvester01', 'harvester11']
const roleForEachType1 = {

    'carrierL01': [MOVE, CARRY, MOVE, CARRY],
    'harvesterM1': [WORK, MOVE, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'harvesterLD01': [WORK, MOVE, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'harvesterLD11': [WORK, MOVE, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'upgraderLD11': [WORK, MOVE, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'repairer01': [MOVE, WORK, CARRY, MOVE],
    'repairer11': [WORK, CARRY, MOVE],
    'upgraderUL1': [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    'builder01': [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    'builder11': [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    'upgrader01': [MOVE, WORK, CARRY, MOVE],
    'upgrader11': [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    'upgraderUC1': [WORK, WORK, WORK, CARRY, MOVE, MOVE],
    'processor1': [MOVE, CARRY],
    'withdrawer1': [MOVE, CARRY, MOVE, CARRY],
    'harvesterT01': [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    'harvesterT11': [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    'harvester01': [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    'harvester11': [MOVE, WORK, CARRY, MOVE],

    'attacker1': [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK],
    'urgentShifter1': [MOVE, CARRY],
    'claimer01': [CLAIM, MOVE, CLAIM, MOVE],
    'claimer11': [CLAIM, MOVE, CLAIM, MOVE],
    'builderLD1': [MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, MOVE],
    'invader1': [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, MOVE, MOVE],
    'defender01': [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, MOVE, MOVE],
    //'healer1': [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE],
    'healer1': [CLAIM, CLAIM, MOVE, MOVE]

}

const source01 = Game.rooms['E28N54'].find(FIND_SOURCES)[0];
const source11 = Game.rooms['E28N54'].find(FIND_SOURCES)[1];
const repairTargetIDs1 = [
    ['605e7b225734153db6bfe52e', '605e7b1f0db288c02a7fd218', '605eb934c5078bec4245e690', '605eb9376389e1d3fd4a4837', '605ec701b1432e75d6f16fe8'],
    ['6083ddfb8227a42563b6cc1d', '6060a36897b43ed29344c271', '6060a35ab20e44375d43b5f3', '6060a351573415256ec0b51f', '6060a357670d4bb48490c321', '6060a3651f5d1e0632d2c36d', '6060a5221ee4c10063d59524', '609e959ce33166772adfff3a', '609e968624bf64fc56115afb']
];
const extensions1 = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION }
});
const myEnergyStructures1 = [].concat(extensions1, Game.spawns['Spawn1']);
const towers1 = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
    filter: (object) => object.structureType == STRUCTURE_TOWER
});
const towerIDs1 = ['605de601c2c8a559d4ee74a1', '605ff7eb7ed7b9da231972ef', '609c1fd1e0fde32f16898f42', '60f2d4411355bb1d42f95e55'];
const linkIDs1 = ['60607d7dcea495400d10beea', '606086e10db288023180a0cf', '6068687e2bb56182b9b8e056'];
const mineral1 = Game.spawns['Spawn1'].room.find(FIND_MINERALS)[0];
const labs1 = ['606be696d5ec7212ad842ceb', '606d65ef43efe504028fad9a', '606ca60b225c833fc17119c4'];
const factory1 = ['60833d87f52e0f79452a22fa'];


//local at room2
var numForEachType2 = {
    'invade_attacker': 0,
    'invade_attacker_heal': 0,

    'harvesterM2': 1,
    'processor2': 1,
    'builder02': 0,
    'builder12': 1,
    'urgentShifter2': 0,
    'upgrader02': 0,
    'upgrader12': 0,
    'harvesterT12': 0,
    'harvesterT02': 1,
    'upgraderUC2': 1,
    'harvester12': 0,
    'harvester02': 2,
    'harvester012': 0

}
const warTypes2 = ['urgentShifter2', 'attacker2', 'processor2', 'upgrader02', 'upgrader12', 'harvesterT12', 'harvesterT02', 'upgraderUC2', 'harvester12', 'harvester02', 'harvester012']
const roleForEachType2 = {

    'harvesterM2': [WORK, MOVE, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'processor2': [MOVE, CARRY],
    'builder02': [MOVE, WORK, CARRY, MOVE],
    'builder12': [MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY],
    'upgrader02': [MOVE, WORK, CARRY, MOVE],
    'upgrader12': [MOVE, WORK, CARRY, MOVE],
    'harvesterT12': [MOVE, WORK, CARRY, MOVE],
    'harvesterT02': [MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY],
    'upgraderUC2': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    'harvester12': [MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY],
    'harvester02': [MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY],
    'harvester012': [MOVE, WORK, CARRY],

    'urgentShifter2': [MOVE, CARRY],
    'attacker2': [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK],

    'invade_attacker': [TOUGH, MOVE, TOUGH, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE],
    //'invade_attacker': [TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE],
    'invade_attacker_heal': [HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE]
}

const source02 = Game.rooms['E29N55'].find(FIND_SOURCES)[0];
const source12 = Game.rooms['E29N55'].find(FIND_SOURCES)[1];
const extensions2 = Game.spawns['Spawn2'].room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION }
});
const myEnergyStructures2 = [].concat(extensions2, Game.spawns['Spawn2'], Game.spawns['Spawn31']);
const towers2 = Game.spawns['Spawn2'].room.find(FIND_STRUCTURES, {
    filter: (object) => object.structureType == STRUCTURE_TOWER
});
const towerIDs2 = ['6066b5e65abcd7285285abea', '606c30f908f9f2d043cf7a1a', '609ff02e12997146108eecd2'];
const containerIDs2 = ['6065c2d43bc5866af992aebd', '60a4c534aa08a583a8a7cceb', '60f3089dec7414e6cbff8e1e'];
const linkIDs2 = ['606edbbdf965dd7db39966a2', '606ec5e64d24f02c2325f0ef'];
const mineral2 = Game.spawns['Spawn2'].room.find(FIND_MINERALS)[0];

var numForEachType31 = {
    'claimer2': 0,
    'builderLD2': 0,
    'harvesterUC12': 1,
    'transferer2': 1
}
const warTypes31 = ['harvesterUC12'];
var roleForEachType31 = {
    'claimer2': [CLAIM, MOVE],
    'builderLD2': [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE],
    'harvesterUC12': [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
    'transferer2': [CARRY, CARRY, MOVE, CARRY, MOVE, CARRY]
}

//local at room3
var numForEachType3 = {

    'claimer13': 0,
    'claimer03': 0,
    'claimer3': 0,
    'builderLD03': 0,
    'builderLD13': 0,
    'invader3': 0,

    'harvesterM3': 1,
    'harvesterT03': 0,
    'builder13': 1,
    'urgentShifter3': 0,
    'upgrader03': 0,
    'upgraderUL3': 1,
    'upgrader13': 0,
    'harvester03': 1,
    'processor3': 1,
    'transferer3': 1,
    'harvester13': 1,
    'harvester013': 0

}
const warTypes3 = ['urgentShifter3', 'attacker3', 'harvesterT03', 'upgrader03', 'upgraderUL3', 'upgrader13', 'harvester03', 'processor3', 'harvester13', 'harvester013'];
const roleForEachType3 = {

    'harvesterM3': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'urgentShifter3': [MOVE, CARRY],
    'attacker3': [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK],
    'harvesterT03': [MOVE, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'builder13': [MOVE, WORK, CARRY],
    'upgrader03': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'upgraderUL3': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY],
    'upgrader13': [MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY],
    'harvester03': [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    'processor3': [CARRY, MOVE],
    'transferer3': [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
    'harvester13': [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    'harvester013': [MOVE, WORK, CARRY],

    'claimer13': [CLAIM, MOVE, CLAIM],
    'claimer03': [CLAIM, MOVE, CLAIM],
    'claimer3': [CLAIM, MOVE],
    'builderLD03': [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE],
    'builderLD13': [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE],
    'invader3': [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, MOVE, MOVE]
}

const source03 = Game.rooms['E28N53'].find(FIND_SOURCES)[0];
const source13 = Game.rooms['E28N53'].find(FIND_SOURCES)[1];
const extensions3 = Game.spawns['Spawn3'].room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION }
});
const myEnergyStructures3 = [].concat(extensions3, Game.spawns['Spawn3']);
const towers3 = Game.spawns['Spawn3'].room.find(FIND_STRUCTURES, {
    filter: (object) => object.structureType == STRUCTURE_TOWER
});
const towerIDs3 = ['607dca013769c567314492a3', '608ae401790582676446c35f'];
const containerIDs3 = ['60f29c993f1b2a185e7868dd', '60f27f9b54e7e728845e35a9'];
const linkIDs3 = ['608a694e86dff32107b37620', '608aa6bba7fccab9a243aa44', '609357221d1f9b5da6049e61'];
const mineral3 = Game.spawns['Spawn3'].room.find(FIND_MINERALS)[0];


//local at room4
var numForEachType4 = {

    'harvesterM4': 1,
    'harvesterT14': 1,
    'upgrader14': 0,
    'upgrader04': 0,
    'upgraderUL4': 1,
    'harvester014': 1,
    'builder14': 1,
    'harvester14': 2,
    'harvester04': 2,
    'urgentShifter4': 0
}
var roleForEachType4 = {

    'harvesterM4': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'harvesterT14': [MOVE, WORK, CARRY, MOVE],
    'upgrader14': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'upgrader04': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'upgraderUL4': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY],
    'harvester014': [MOVE, WORK, CARRY, MOVE],
    'harvester14': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'builder14': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'harvester04': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'urgentShifter4': [MOVE, CARRY]
}

const source04 = Game.rooms['E31N53'].find(FIND_SOURCES)[0];
const source14 = Game.rooms['E31N53'].find(FIND_SOURCES)[1];
const towers4 = Game.spawns['Spawn4'].room.find(FIND_STRUCTURES, {
    filter: (object) => object.structureType == STRUCTURE_TOWER
});
const towerIDs4 = ['60a62c6f8df61da5474133f2', '60ad3c7c073ab4369fc4e3ca'];
const linkIDs4 = ['60ad6b7e3abdaf329f9c9c97', '60ad56b828d7a66137a88d38'];
const mineral4 = Game.spawns['Spawn4'].room.find(FIND_MINERALS)[0];

//local at room5
var numForEachType5 = {

    'harvesterT15': 1,
    'upgrader15': 0,
    'upgrader05': 1,
    'harvester015': 1,
    'builder05': 1,
    'harvester15': 2,
    'harvester05': 0,
    'urgentShifter5': 0
}
var roleForEachType5 = {

    'harvesterT15': [MOVE, WORK, CARRY, MOVE],
    'upgrader15': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'upgrader05': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'harvester015': [MOVE, WORK, CARRY, MOVE],
    'builder05': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'harvester15': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'harvester05': [MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
    'urgentShifter5': [MOVE, CARRY]
}
const source05 = Game.rooms['E22N49'].find(FIND_SOURCES)[0];
const source15 = Game.rooms['E22N49'].find(FIND_SOURCES)[1];
const towers5 = Game.spawns['Spawn5'].room.find(FIND_STRUCTURES, {
    filter: (object) => object.structureType == STRUCTURE_TOWER
});
const towerIDs5 = ['60bc18cec779dcd5ba2b8dc4'];


//record
var attacksSinceLastChanged = 0;
var recordCounter = 0;
//war
var isWar1 = false;
var isWar2 = false;
var isWar3 = false;
var isWar4 = false;

module.exports.loop = function () {
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel()
    }

    //auto change env
    /*if (Game.rooms['E28N54'].storage) {
        numForEachType1['withdrawer'] = 1;
    }*/
    if (Object.keys(Game.creeps).length < 14) {
        Game.rooms['E28N54'].controller.activateSafeMode();
        numForEachType1['urgentShifter1'] = 1;
    }

    if (recordCounter == 10) {
        if (Game.rooms['E29N54'] && Game.rooms['E29N54'].find(FIND_HOSTILE_CREEPS).length > 0) {
            numForEachType1['harvesterLD11'] = 0;
            numForEachType1['upgraderLD11'] = 0;
        } else {
            numForEachType1['harvesterLD11'] = 2;
            numForEachType1['upgraderLD11'] = 2;
        }
    }/* else if (recordCounter == 20) {
        if (Game.rooms['E22N49'] && Game.rooms['E22N49'].find(FIND_HOSTILE_CREEPS).length > 0) {
            numForEachType3['builderLD03'] = 0;
            numForEachType3['builderLD13'] = 0;
        } else {
            numForEachType3['builderLD03'] = 1;
            numForEachType3['builderLD13'] = 2;
        }
    }*/

    //record
    if (++recordCounter == 30 && (
        console.log('** Attaks since last changed: ' + attacksSinceLastChanged + ' **') ^
        console.log('** Energy in storage:',
            Game.rooms['E28N54'].storage.store[RESOURCE_ENERGY],
            Game.rooms['E29N55'].storage.store[RESOURCE_ENERGY],
            Game.rooms['E28N53'].storage.store[RESOURCE_ENERGY],
            '**') ^
        (recordCounter = 0)
    ));

    //cleanse the old
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }
    }


    //room1
    {
        //tower01
        if (towers1.length) {
            var tower01 = towers1[0];
        }
        if (tower01) {//ifnot tower01 then surrender
            //attack the hostile
            var closestHostile = tower01.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (target) => target.getActiveBodyparts(ATTACK) &&
                    target.pos.x != 0 &&
                    target.pos.x != 49 &&
                    target.pos.y != 0 &&
                    target.pos.y != 49
            });
            if (!closestHostile) {
                closestHostile = tower01.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                    filter: (target) =>
                        target.pos.x != 0 &&
                        target.pos.x != 49 &&
                        target.pos.y != 0 &&
                        target.pos.y != 49
                });
            }
            if (closestHostile) {
                console.log('IT IS WAR !!');
                if (!isWar1) attacksSinceLastChanged++;
                isWar1 = true;
                //spawn the attacker creep
                var type = 'attacker1';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 2/*numForEachType1[type]*/) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(roleForEachType1[type], newName,
                        {
                            memory: { role: type, boost: false },
                            energyStructures: myEnergyStructures1
                        });
                }
                type = 'urgentShifter1';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 1/*numForEachType1[type]*/) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(roleForEachType1[type], newName,
                        {
                            memory: { role: type, boost: false },
                            energyStructures: myEnergyStructures1
                        });
                }

                //tower01 attack
                for (var i in towers1) {
                    towers1[i].attack(closestHostile);
                }
            } else {
                isWar1 = false;
                //repair the damaged
                //sort by range
                /*var closestDamagedStructure = tower01.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if (closestDamagedStructure) {
                    tower01.repair(closestDamagedStructure);
                }*/
                //sort by urgency (better)
                var damagedStructure = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax// && (
                    //object.hits < 1000000 ||
                    //object.structureType == STRUCTURE_ROAD
                    //)// && !(object.pos.x < 10 && object.structureType == STRUCTURE_WALL) //&& 
                    //  object.structureType != STRUCTURE_WALL //&&
                    //  object.structureType != STRUCTURE_RAMPART
                });
                damagedStructure.sort((a, b) => a.hits - b.hits);
                if (damagedStructure) {
                    //console.log('tower01 is repairing' + damagedStructure[0]);
                    towers1[1].repair(damagedStructure[0]);
                    towers1[2].repair(damagedStructure[0]);
                }
            }
        }

        //respawn
        for (var type in numForEachType1) {
            if ((!isWar1 || warTypes1.includes(type)) &&
                _.filter(Game.creeps, (creep) => creep.memory.role == type).length < numForEachType1[type]) {
                var newName = type + '_' + Game.time;
                //console.log('Spawning new ' + type + ': ' + newName);
                Game.spawns['Spawn1'].spawnCreep(roleForEachType1[type], newName,
                    {
                        memory: { role: type, boost: false },
                        energyStructures: myEnergyStructures1
                    });
            }
        }
        if (Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x,
                Game.spawns['Spawn1'].pos.y + 2,
                { align: 'center', opacity: 0.8 });
        }
        /*
            //It is strange that codes below must be put in the module.exports.loop or it'll go wrong (cooldown for links will not decrease automatically)
            const links = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_LINK }
            });
        */

        //lab
        Game.getObjectById(labs1[2]).runReaction(Game.getObjectById(labs1[0]), Game.getObjectById(labs1[1]));

        //factory
        if (Game.getObjectById(factory1[0]).produce(RESOURCE_CONDENSATE) == ERR_NOT_ENOUGH_RESOURCES) {
            if (Game.getObjectById(factory1[0]).store[RESOURCE_KEANIUM_BAR] < 1000) {
                Game.getObjectById(factory1[0]).produce(RESOURCE_KEANIUM_BAR);
            }
        }
        Game.getObjectById(factory1[0]).produce(RESOURCE_PURIFIER);
        Game.getObjectById(factory1[0]).produce(RESOURCE_REDUCTANT);
        Game.getObjectById(factory1[0]).produce(RESOURCE_OXIDANT);
    }


    //room2
    if (Game.spawns['Spawn2']) {
        /*
                const extensions2 = Game.spawns['Spawn2'].room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_EXTENSION }
                });
                const myEnergyStructures2 = [].concat(extensions2, Game.spawns['Spawn2']);
        */

        //tower02
        if (towers2.length) {
            var tower02 = towers2[0];
        }
        if (tower02) {//ifnot tower02 then surrender
            //attack the hostile
            var closestHostile = tower02.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (target) => target.getActiveBodyparts(ATTACK) &&
                    target.pos.x != 0 &&
                    target.pos.x != 49 &&
                    target.pos.y != 0 &&
                    target.pos.y != 49
            });
            if (!closestHostile) {
                closestHostile = tower02.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                    filter: (target) =>
                        target.pos.x != 0 &&
                        target.pos.x != 49 &&
                        target.pos.y != 0 &&
                        target.pos.y != 49
                });
            }
            if (closestHostile) {
                console.log('IT IS WAR !!');
                if (!isWar2) attacksSinceLastChanged++;
                isWar2 = true;

                //spawn the attacker creep
                var type = 'attacker2';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 2) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn2'].spawnCreep(roleForEachType2[type], newName,
                        {
                            memory: { role: type },
                            energyStructures: myEnergyStructures2
                        });
                }
                type = 'urgentShifter2';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 1) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn2'].spawnCreep(roleForEachType2[type], newName,
                        {
                            memory: { role: type },
                            energyStructures: myEnergyStructures2
                        });
                }


                //tower02 attack
                for (var i in towers2) {
                    towers2[i].attack(closestHostile);
                }
            } else {
                isWar2 = false;
                //repair the damaged
                var damagedStructure = Game.spawns['Spawn2'].room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax && !(
                        object.pos.x >= 41 &&
                        object.pos.x <= 44 &&
                        object.pos.y >= 21 &&
                        object.pos.y <= 40
                    )

                    // && (
                    //object.hits < 1000000 ||
                    //object.structureType == STRUCTURE_ROAD
                    //)// && !(object.pos.x < 10 && object.structureType == STRUCTURE_WALL) //&& 
                    //  object.structureType != STRUCTURE_WALL //&&
                    //  object.structureType != STRUCTURE_RAMPART
                });
                damagedStructure.sort((a, b) => a.hits - b.hits);
                if (damagedStructure) {
                    //console.log('tower01 is repairing' + damagedStructure[0]);
                    towers2[0].repair(damagedStructure[0]);
                }
            }
        }

        for (var type in numForEachType31) {
            if ((!isWar2 || warTypes31.includes(type)) &&
                _.filter(Game.creeps, (creep) => creep.memory.role == type).length < numForEachType31[type]) {
                var newName = type + '_' + Game.time;
                //console.log('Spawning new ' + type + ': ' + newName);
                Game.spawns['Spawn31'].spawnCreep(roleForEachType31[type], newName,
                    {
                        memory: { role: type, boost: false },
                        energyStructures: myEnergyStructures2
                    });
            }
        }
        if (Game.spawns['Spawn31'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn31'].spawning.name];
            Game.spawns['Spawn31'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn31'].pos.x,
                Game.spawns['Spawn31'].pos.y + 2,
                { align: 'center', opacity: 0.8 });
        }

        //respawn
        for (var type in numForEachType2) {
            if ((!isWar2 || warTypes2.includes(type)) &&
                _.filter(Game.creeps, (creep) => creep.memory.role == type).length < numForEachType2[type]) {
                var newName = type + '_' + Game.time;
                //console.log('Spawning new ' + type + ': ' + newName);
                Game.spawns['Spawn2'].spawnCreep(roleForEachType2[type], newName,
                    {
                        memory: { role: type, boost: false },
                        energyStructures: myEnergyStructures2,
                        directions: [TOP,
                            TOP_RIGHT,
                            BOTTOM_LEFT,
                            LEFT,
                            BOTTOM,
                            TOP_LEFT,
                            BOTTOM_RIGHT,
                            RIGHT]
                    });
            }
        }
        if (Game.spawns['Spawn2'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn2'].spawning.name];
            Game.spawns['Spawn2'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn2'].pos.x,
                Game.spawns['Spawn2'].pos.y + 2,
                { align: 'center', opacity: 0.8 });
        }
    }


    //room3
    if (Game.spawns['Spawn3']) {

        //tower03
        if (towers3.length) {
            var tower03 = towers3[0];
        }
        if (tower03) {//ifnot tower03 then surrender
            //attack the hostile
            var closestHostile = tower03.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (target) => target.getActiveBodyparts(ATTACK) &&
                    target.pos.x != 0 &&
                    target.pos.x != 49 &&
                    target.pos.y != 0 &&
                    target.pos.y != 49
            });
            if (!closestHostile) {
                closestHostile = tower03.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                    filter: (target) =>
                        target.pos.x != 0 &&
                        target.pos.x != 49 &&
                        target.pos.y != 0 &&
                        target.pos.y != 49
                });
            }
            if (closestHostile) {
                console.log('IT IS WAR !!');
                if (!isWar3) attacksSinceLastChanged++;
                isWar3 = true;
                //spawn the attacker creep
                var type = 'attacker3';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 2) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn3'].spawnCreep(roleForEachType3[type], newName,
                        {
                            memory: { role: type },
                            energyStructures: myEnergyStructures3
                        });
                }
                type = 'urgentShifter3';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 1) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn3'].spawnCreep(roleForEachType3[type], newName,
                        {
                            memory: { role: type },
                            energyStructures: myEnergyStructures3
                        });
                }


                //tower03 attack
                for (var i in towers3) {
                    towers3[i].attack(closestHostile);
                }
            } else if (Game.time % 2) {
                isWar3 = false;
                //repair the damaged
                var damagedStructure = Game.spawns['Spawn3'].room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax// && (
                    //object.hits < 1000000 ||
                    //object.structureType == STRUCTURE_ROAD
                    //)// && !(object.pos.x < 10 && object.structureType == STRUCTURE_WALL) //&& 
                    //  object.structureType != STRUCTURE_WALL //&&
                    //  object.structureType != STRUCTURE_RAMPART
                });
                damagedStructure.sort((a, b) => a.hits - b.hits);
                if (damagedStructure) {
                    //console.log('tower01 is repairing' + damagedStructure[0]);
                    towers3[0].repair(damagedStructure[0]);
                }
            }
        }

        //respawn
        for (var type in numForEachType3) {
            if ((!isWar3 || warTypes3.includes(type)) &&
                _.filter(Game.creeps, (creep) => creep.memory.role == type).length < numForEachType3[type]) {
                var newName = type + '_' + Game.time;
                //console.log('Spawning new ' + type + ': ' + newName);
                Game.spawns['Spawn3'].spawnCreep(roleForEachType3[type], newName,
                    {
                        memory: { role: type, boost: false },
                        energyStructures: myEnergyStructures3
                    });
            }
        }
        if (Game.spawns['Spawn3'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn3'].spawning.name];
            Game.spawns['Spawn3'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn3'].pos.x,
                Game.spawns['Spawn3'].pos.y + 2,
                { align: 'center', opacity: 0.8 });
        }
    }


    //room4
    if (Game.spawns['Spawn4']) {

        //tower04
        if (towers4.length) {
            var tower04 = towers4[0];
        }
        if (tower04) {//ifnot tower04 then surrender
            //attack the hostile
            var closestHostile = tower04.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (target) => target.getActiveBodyparts(ATTACK) &&
                    target.pos.x != 0 &&
                    target.pos.x != 49 &&
                    target.pos.y != 0 &&
                    target.pos.y != 49
            });
            if (!closestHostile) {
                closestHostile = tower04.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                    filter: (target) =>
                        target.pos.x != 0 &&
                        target.pos.x != 49 &&
                        target.pos.y != 0 &&
                        target.pos.y != 49
                });
            }
            if (closestHostile) {
                console.log('IT IS WAR !!');
                if (!isWar4) attacksSinceLastChanged++;
                isWar4 = true;
                //spawn the attacker creep
                /*
                var type = 'attacker4';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 2) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn4'].spawnCreep(roleForEachType4[type], newName,
                        {
                            memory: { role: type },
                            energyStructures: myEnergyStructures4
                        });
                }*/
                var type = 'urgentShifter4';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 1) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn4'].spawnCreep(roleForEachType4[type], newName,
                        {
                            memory: { role: type }//,
                            //energyStructures: myEnergyStructures4
                        });
                }

                //tower04 attack
                for (var i in towers4) {
                    towers4[i].attack(closestHostile);
                }
            } else /*if (Game.time % 2)*/ {
                isWar4 = false;
                //repair the damaged
                var damagedStructure = Game.spawns['Spawn4'].room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax// && (
                    //object.hits < 1000000 ||
                    //object.structureType == STRUCTURE_ROAD
                    //)// && !(object.pos.x < 10 && object.structureType == STRUCTURE_WALL) //&& 
                    //  object.structureType != STRUCTURE_WALL //&&
                    //  object.structureType != STRUCTURE_RAMPART
                });
                damagedStructure.sort((a, b) => a.hits - b.hits);
                if (damagedStructure) {
                    towers4[1].repair(damagedStructure[0]);
                }
            }
        }

        //respawn
        for (var type in numForEachType4) {
            if (/*(!isWar4 || warTypes4.includes(type)) &&*/
                _.filter(Game.creeps, (creep) => creep.memory.role == type).length < numForEachType4[type]) {
                var newName = type + '_' + Game.time;
                //console.log('Spawning new ' + type + ': ' + newName);
                Game.spawns['Spawn4'].spawnCreep(roleForEachType4[type], newName,
                    {
                        memory: { role: type, boost: false }//,
                        //energyStructures: myEnergyStructures4
                    });
            }
        }
        if (Game.spawns['Spawn4'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn4'].spawning.name];
            Game.spawns['Spawn4'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn4'].pos.x,
                Game.spawns['Spawn4'].pos.y + 2,
                { align: 'center', opacity: 0.8 });
        }

        //link
        Game.getObjectById(linkIDs4[0]).transferEnergy(Game.getObjectById(linkIDs4[1]));
    }


    //room5
    if (Game.spawns['Spawn5']) {

        //tower05
        if (towers5.length) {
            var tower05 = towers5[0];
        }
        if (tower05) {//ifnot tower05 then surrender
            //attack the hostile
            var closestHostile = tower05.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (target) => target.getActiveBodyparts(ATTACK) &&
                    target.pos.x != 0 &&
                    target.pos.x != 49 &&
                    target.pos.y != 0 &&
                    target.pos.y != 49
            });
            if (!closestHostile) {
                closestHostile = tower05.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                    filter: (target) =>
                        target.pos.x != 0 &&
                        target.pos.x != 49 &&
                        target.pos.y != 0 &&
                        target.pos.y != 49
                });
            }
            if (closestHostile) {
                console.log('IT IS WAR !!');
                if (!isWar5) attacksSinceLastChanged++;
                isWar5 = true;
                //spawn the attacker creep
                /*
                var type = 'attacker5';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 2) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn5'].spawnCreep(roleForEachType5[type], newName,
                        {
                            memory: { role: type },
                            energyStructures: myEnergyStructures5
                        });
                }*/
                var type = 'urgentShifter5';
                if (_.filter(Game.creeps, (creep) => creep.memory.role == type).length < 1) {
                    var newName = type + '_' + Game.time;
                    //console.log('Spawning new ' + type + ': ' + newName);
                    Game.spawns['Spawn5'].spawnCreep(roleForEachType5[type], newName,
                        {
                            memory: { role: type }//,
                            //energyStructures: myEnergyStructures5
                        });
                }

                //tower05 attack
                for (var i in towers5) {
                    towers5[i].attack(closestHostile);
                }
            } else /*if (Game.time % 2)*/ {
                isWar5 = false;
                //repair the damaged
                var damagedStructure = Game.spawns['Spawn5'].room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax// && (
                    //object.hits < 1000000 ||
                    //object.structureType == STRUCTURE_ROAD
                    //)// && !(object.pos.x < 10 && object.structureType == STRUCTURE_WALL) //&& 
                    //  object.structureType != STRUCTURE_WALL //&&
                    //  object.structureType != STRUCTURE_RAMPART
                });
                damagedStructure.sort((a, b) => a.hits - b.hits);
                if (damagedStructure) {
                    towers5[0].repair(damagedStructure[0]);
                }
            }
        }

        //respawn
        for (var type in numForEachType5) {
            if (/*(!isWar5 || warTypes5.includes(type)) &&*/
                _.filter(Game.creeps, (creep) => creep.memory.role == type).length < numForEachType5[type]) {
                var newName = type + '_' + Game.time;
                //console.log('Spawning new ' + type + ': ' + newName);
                Game.spawns['Spawn5'].spawnCreep(roleForEachType5[type], newName,
                    {
                        memory: { role: type, boost: false }//,
                        //energyStructures: myEnergyStructures5
                    });
            }
        }
        if (Game.spawns['Spawn5'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn5'].spawning.name];
            Game.spawns['Spawn5'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn5'].pos.x,
                Game.spawns['Spawn5'].pos.y + 2,
                { align: 'center', opacity: 0.8 });
        }

    }

    //creeps
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.role) {
            //room1
            case 'harvester01': {
                roleHarvester.run(creep, source01,
                    Game.spawns['Spawn1'].room.energyAvailable ==
                        Game.spawns['Spawn1'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv1); break;
            } case 'harvester11': {
                roleHarvester.run(creep, source11,
                    Game.spawns['Spawn1'].room.energyAvailable ==
                        Game.spawns['Spawn1'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv1); break;
            } case 'upgrader01': {
                roleUpgrader.run(creep, source01); break;
            } case 'upgrader11': {
                roleUpgrader.run(creep, source11); break;
            } case 'upgraderUC1': {
                roleUpgraderUsingContainer.run(creep); break;
            } case 'upgraderUL1': {
                roleUpgraderUsingLink.run(creep, Game.getObjectById(linkIDs1[0])); break;
            } case 'builder01': {
                roleBuilder.run(creep, source01,
                    Game.spawns['Spawn1'].room.energyAvailable ==
                        Game.spawns['Spawn1'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv1); break;
            } case 'builder11': {
                roleBuilder.run(creep, source11,
                    Game.spawns['Spawn1'].room.energyAvailable ==
                        Game.spawns['Spawn1'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv1); break;
            } case 'harvesterT01': {
                if (towers1[1]) {
                    if (creep.memory.tower && Game.getObjectById(towerIDs1[1]).store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                        creep.memory.tower = false;
                        creep.say('🔄 harvestT_end');
                    }
                    if (!creep.memory.tower && Game.getObjectById(towerIDs1[1]).store.getFreeCapacity([RESOURCE_ENERGY]) > 100) {
                        creep.memory.tower = true;
                        creep.say('⚡ harvestT_begin');
                    }
                    if (creep.memory.tower) {
                        roleHarvesterTower.run(creep, source01, Game.getObjectById(towerIDs1[1])); break;
                    }
                }
                roleHarvester.run(creep, source01,
                    Game.spawns['Spawn1'].room.energyAvailable ==
                        Game.spawns['Spawn1'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv1); break;
            } case 'harvesterT11': {
                /*
                if (towers1[0]) {
                    if (creep.memory.tower && Game.getObjectById(towerIDs1[0]).store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                        creep.memory.tower = false;
                        creep.say('🔄 harvestT_end');
                    }
                    if (!creep.memory.tower && Game.getObjectById(towerIDs1[0]).store.getFreeCapacity([RESOURCE_ENERGY]) > 100) {
                        creep.memory.tower = true;
                        creep.say('⚡ harvestT_begin');
                    }
                    if (creep.memory.tower) {
                        roleHarvesterTower.run(creep, source11, Game.getObjectById(towerIDs1[0])); break;
                    }
                }
                roleHarvester.run(creep, source11,
                    Game.spawns['Spawn1'].room.energyAvailable ==
                        Game.spawns['Spawn1'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv1); break;*/
                
                roleHarvester.run(creep, source11,
                    Game.spawns['Spawn1'].room.energyAvailable ==
                        Game.spawns['Spawn1'].room.energyCapacityAvailable ?
                        [STRUCTURE_NUKER] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv1); break;
            } case 'attacker1': {
                roleAttacker.run(creep, Game.flags.Atk1); break;
            } case 'withdrawer1': {
                roleWithdrawer.run(creep, Game.flags.Pick1); break;
            } case 'repairer01': {
                roleRepairer.run(creep, repairTargetIDs1[0]); break;
            } case 'repairer11': {
                roleRepairer.run(creep, repairTargetIDs1[1]); break;
            } case 'urgentShifter1': {
                if (Game.getObjectById(towerIDs1[3])) {

                    let x0 = Game.getObjectById(towerIDs1[0]).store.getUsedCapacity(RESOURCE_ENERGY);
                    let x1 = Game.getObjectById(towerIDs1[3]).store.getUsedCapacity(RESOURCE_ENERGY);
                    let x2 = Game.getObjectById(towerIDs1[2]).store.getUsedCapacity(RESOURCE_ENERGY);
                    roleUrgentShifter.run(creep, [STRUCTURE_TOWER],
                        x0 > x1 ?
                            x1 > x2 ? Game.getObjectById(towerIDs1[2]) : Game.getObjectById(towerIDs1[3]) :
                            x0 > x2 ? Game.getObjectById(towerIDs1[2]) : Game.getObjectById(towerIDs1[0])
                    ); break;
                } else {
                    roleUrgentShifter.run(creep, [STRUCTURE_TOWER],
                        Game.getObjectById(towerIDs1[0]).store.getUsedCapacity(RESOURCE_ENERGY) >
                            Game.getObjectById(towerIDs1[2]).store.getUsedCapacity(RESOURCE_ENERGY) ?
                            Game.getObjectById(towerIDs1[2]) : Game.getObjectById(towerIDs1[0])); break;
                }
                //roleUrgentShifter.run(creep, [STRUCTURE_TOWER], towers1[0]); break;
            } case 'processor1': {
                roleProcessor.run(creep, Game.getObjectById(linkIDs1[1]), Game.getObjectById(linkIDs1[0]), Game.getObjectById(linkIDs1[2]), Game.getObjectById(factory1[0])); break;
            } case 'claimer01': {
                roleReserver.run(creep, 'E28N54', 'E29N54'); break;
            } case 'claimer11': {
                roleReserver.run(creep, 'E28N54', 'E28N55'); break;
            } case 'builderLD1': {
                roleBuilderLongDistance.run(creep, 'E28N54', 'E28N53', creep.room.find(FIND_SOURCES)[1],
                    Game.spawns['Spawn3'].room.energyAvailable ==
                        Game.spawns['Spawn3'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv3); break;
            } case 'invader1': {
                roleInvader.run(creep, 'E28N54', 'E29N54'); break;
            } case 'defender01': {
                roleInvader.run(creep, 'E28N54', 'E28N55'); break;
            } case 'healer1': {
                roleHealer.run(creep, 'E28N54', 'E28N53'); break;
            } case 'harvesterLD01': {
                roleHarvesterDeposit.run(creep, Game.getObjectById(labs1[2]), 'E28N54', 'E30N55', roomDeposit, Game.rooms['E28N54'].terminal); break;
            } case 'harvesterM1': {
                roleHarvester.run(creep, mineral1, [STRUCTURE_STORAGE], Game.flags.Rest1); break;
            } case 'harvesterLD11': {
                //roleHarvesterLongDistance.run(creep, 'E28N54', 'E29N54', Game.rooms['E28N54'].storage); break;
                roleHarvesterLongDistanceBoost.run(creep, Game.getObjectById(labs1[2]), 'E28N54', 'E29N54', Game.rooms['E28N54'].storage); break;
            } case 'carrierL01': {
                if (Game.getObjectById(labs1[0]).store[RESOURCE_HYDROGEN] < 2950 &&
                    (Game.rooms['E28N54'].terminal.store[RESOURCE_HYDROGEN] > 100 || creep.store[RESOURCE_HYDROGEN]) ||
                    Game.getObjectById(labs1[0]).store[RESOURCE_ENERGY] < 2000) {
                    creep.say('0');
                    if (creep.store[RESOURCE_ENERGY] + creep.store[RESOURCE_HYDROGEN] < creep.store.getUsedCapacity()) {
                        if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.terminal);
                        } else {
                            for (const resourceType in creep.store) {
                                creep.transfer(creep.room.terminal, resourceType);
                            }
                        }
                        break;
                    }
                    roleCarrier.run(creep, Game.rooms['E28N54'].terminal, Game.getObjectById(labs1[0]), [RESOURCE_ENERGY, RESOURCE_HYDROGEN]); break;
                } else if (Game.getObjectById(labs1[1]).store[RESOURCE_KEANIUM] < 2950 &&
                    (Game.rooms['E28N54'].terminal.store[RESOURCE_KEANIUM] > 100 || creep.store[RESOURCE_KEANIUM]) ||
                    Game.getObjectById(labs1[1]).store[RESOURCE_ENERGY] < 2000) {
                    creep.say('1');
                    if (creep.store[RESOURCE_ENERGY] + creep.store[RESOURCE_KEANIUM] < creep.store.getUsedCapacity()) {
                        if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.terminal);
                        } else {
                            for (const resourceType in creep.store) {
                                creep.transfer(creep.room.terminal, resourceType);
                            }
                        }
                        break;
                    }
                    roleCarrier.run(creep, Game.rooms['E28N54'].terminal, Game.getObjectById(labs1[1]), [RESOURCE_KEANIUM, RESOURCE_ENERGY]); break;
                }
                /*else if (Game.getObjectById(labs1[1]).store[RESOURCE_KEANIUM] < 2950 &&
                    (Game.getObjectById(factory1[0]).store[RESOURCE_KEANIUM] > 500 || creep.store[RESOURCE_KEANIUM]) ||
                    Game.getObjectById(labs1[1]).store[RESOURCE_ENERGY] < 2000) {
                    creep.say('1');
                    if (creep.store[RESOURCE_ENERGY] + creep.store[RESOURCE_KEANIUM] < creep.store.getUsedCapacity()) {
                        if (creep.transfer(Game.getObjectById(factory1[0]), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(factory1[0]));
                        } else {
                            for (const resourceType in creep.store) {
                                creep.transfer(Game.getObjectById(factory1[0]), resourceType);
                            }
                        }
                        break;
                    }
                    roleCarrier.run(creep, Game.getObjectById(factory1[0]), Game.getObjectById(labs1[1]), [RESOURCE_KEANIUM, RESOURCE_ENERGY]); break;
                } */
                else if (Game.getObjectById(labs1[2]).store[RESOURCE_ENERGY] < 2000) {
                    creep.say('2');
                    if (creep.store[RESOURCE_ENERGY] < creep.store.getUsedCapacity()) {
                        if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.terminal);
                        } else {
                            for (const resourceType in creep.store) {
                                creep.transfer(creep.room.terminal, resourceType);
                            }
                        }
                        break;
                    }
                    roleCarrier.run(creep, Game.rooms['E28N54'].terminal, Game.getObjectById(labs1[2]), [RESOURCE_ENERGY]); break;
                }
                break;
                //roleCarrier.run(creep, Game.rooms['E28N54'].terminal, Game.getObjectById(labs1[1]), [RESOURCE_KEANIUM]); break;
                //roleCarrier.run(creep, Game.getObjectById(labs1[2]), Game.rooms['E28N54'].terminal, [RESOURCE_HYDROXIDE]); break;
            } case 'upgraderLD11': {
                roleUpgraderLongDistanceBoost.run(creep, Game.getObjectById(labs1[2]), 'E28N54', 'E29N54', Game.rooms['E28N54'].controller); break;
            }


            //room2
            case 'harvester02': {
                roleHarvester.run(creep, source02,
                    Game.getObjectById(containerIDs2[0]).store.getFreeCapacity([RESOURCE_ENERGY]) == 0 ?
                        [STRUCTURE_SPAWN, STRUCTURE_STORAGE] :
                        [STRUCTURE_SPAWN, STRUCTURE_CONTAINER], Game.flags.Harv2); break;
            } case 'harvester12': {
                roleHarvester.run(creep, source12,
                    Game.spawns['Spawn2'].room.energyAvailable ==
                        Game.spawns['Spawn2'].room.energyCapacityAvailable ?
                        (Game.getObjectById(towerIDs2[2]).store.getFreeCapacity([RESOURCE_ENERGY]) == 0 ?
                            [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                            [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_TOWER]) :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv21); break;
            } case 'harvester012': {
                roleHarvester.run(creep, source12,
                    Game.spawns['Spawn2'].room.energyAvailable ==
                        Game.spawns['Spawn2'].room.energyCapacityAvailable ?
                        (Game.getObjectById(towerIDs2[2]).store.getFreeCapacity([RESOURCE_ENERGY]) == 0 ?
                            [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                            [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_TOWER]) :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv21); break;
            } case 'harvesterT02': {
                if (Game.getObjectById(towerIDs2[1]).store.getFreeCapacity([RESOURCE_ENERGY]) > 0) {
                    roleHarvesterTower.run(creep, source02, Game.getObjectById(towerIDs2[1]));
                } else {
                    roleHarvesterTower.run(creep, source02, Game.getObjectById(towerIDs2[0]));
                } break;
                /*
                if (creep.memory.tower && towers2[0].store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                    creep.memory.tower = false;
                    creep.say('🔄 harvestT_end'); break;
                }
                if ((!creep.memory.tower) && towers2[0].store.getFreeCapacity([RESOURCE_ENERGY]) > 100) {
                    creep.memory.tower = true;
                    creep.say('⚡ harvestT_begin');
                }
                if (creep.memory.tower) {
                    roleHarvesterTower.run(creep, source02, towers2[0]); break;
                }
                break;*/
                //roleHarvester.run(creep, source02, [STRUCTURE_SPAWN, STRUCTURE_CONTAINER], Game.flags.Harv2); break;
            } case 'harvesterT12': {
                if (creep.memory.tower && towers2[0].store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                    creep.memory.tower = false;
                    creep.say('🔄 harvestT_end'); break;
                }
                if ((!creep.memory.tower) && towers2[0].store.getFreeCapacity([RESOURCE_ENERGY]) > 100) {
                    creep.memory.tower = true;
                    creep.say('⚡ harvestT_begin');
                }
                if (creep.memory.tower) {
                    roleHarvesterTower.run(creep, source12, towers2[0]); break;
                }
                break;
                /*roleHarvester.run(creep, source12,
                    Game.spawns['Spawn2'].room.energyAvailable ==
                        Game.spawns['Spawn2'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_CONTAINER] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv21); break;*/
            } case 'upgrader02': {
                roleUpgrader.run(creep, source02, Game.spawns['Spawn2'].room.controller, Game.spawns['Spawn2'].room.controller/*, Game.flags.Upgrade2*/); break;
            } case 'upgrader12': {
                roleUpgrader.run(creep, source12, Game.spawns['Spawn2'].room.controller, Game.spawns['Spawn2'].room.controller/*, Game.flags.Upgrade2*/); break;
            } case 'upgraderUC2': {
                roleUpgraderUsingContainer.run(creep, Game.getObjectById(containerIDs2[0]), Game.flags.Upgrade2); break;
            } case 'builder02': {
                roleBuilder.run(creep, source02,
                    [STRUCTURE_SPAWN, STRUCTURE_CONTAINER], Game.flags.Harv2); break;
            } case 'builder12': {
                roleBuilder.run(creep, source12,
                    Game.spawns['Spawn2'].room.energyAvailable ==
                        Game.spawns['Spawn2'].room.energyCapacityAvailable ?
                        (Game.getObjectById(towerIDs2[2]).store.getFreeCapacity([RESOURCE_ENERGY]) == 0 ?
                            [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                            [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_TOWER]) :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv21); break;
            } case 'processor2': {
                if (isWar2) {
                    roleUrgentShifter.run(creep, [STRUCTURE_TOWER]);
                } else {
                    roleProcessor2.run(creep, Game.getObjectById(linkIDs2[1]), Game.getObjectById(linkIDs2[0])); break;
                }
                break;
            } case 'urgentShifter2': {
                roleUrgentShifter.run(creep, [STRUCTURE_TOWER],
                    Game.getObjectById(towerIDs2[0]).store.getUsedCapacity(RESOURCE_ENERGY) >
                        Game.getObjectById(towerIDs2[1]).store.getUsedCapacity(RESOURCE_ENERGY) ?
                        Game.getObjectById(towerIDs2[1]) : Game.getObjectById(towerIDs2[0])); break;
            } case 'harvesterM2': {
                roleHarvester.run(creep, mineral2, [STRUCTURE_TERMINAL], Game.flags.Harv2); break;
            } case 'attacker2': {
                roleAttacker.run(creep, Game.flags.Atk2); break;
            } case 'invade_attacker_heal': {
                //Memory.invade_attacker_heal = creep; break;
                break;
            } case 'invade_attacker': {
                invadeAttacker.run(creep, 'E29N55', 'E32N53'); break;
            }

            case 'claimer2': {
                roleClaimer.run(creep, 'E29N55', 'E31N53'); break;
            } case 'harvesterUC12': {
                if (!creep.pos.isEqualTo(Game.flags.Harv231)) {
                    creep.moveTo(Game.flags.Harv231, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else {
                    if (Game.getObjectById(containerIDs2[2]) && Game.getObjectById(containerIDs2[2]).store.getFreeCapacity(RESOURCE_ENERGY) > 200) {
                        roleHarvesterTarget.run(creep, source12, Game.getObjectById(containerIDs2[2]));
                    } else if (Game.getObjectById(containerIDs2[1]).store.getFreeCapacity(RESOURCE_ENERGY) > 200) {
                        roleHarvesterTarget.run(creep, source12, Game.getObjectById(containerIDs2[1]));
                    } else {
                        roleHarvesterTarget.run(creep, source12, Game.getObjectById(linkIDs2[0]));
                    }

                    //roleHarvester.run(creep, source12, [STRUCTURE_CONTAINER], Game.flags.Harv231);
                }
                break;
            } case 'builderLD2': {
                roleBuilderLongDistance.run(creep, 'E29N55', 'E31N53', source14, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]); break;
            } case 'transferer2': {
                if (Game.getObjectById(towerIDs2[2]).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    roleTransferer.run(creep, Game.getObjectById(containerIDs2[1]), Game.getObjectById(towerIDs2[2]), [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Tsf21);
                } else {
                    roleTransferer.run(creep, Game.getObjectById(containerIDs2[1]), Game.getObjectById(linkIDs2[0]), [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Tsf21);
                }
                break;
            }


            //room3
            case 'upgrader03': {
                roleUpgrader.run(creep, source03, Game.spawns['Spawn3'].room.controller, Game.spawns['Spawn3'].room.controller); break;
            } case 'upgrader13': {
                roleUpgrader.run(creep, source13, Game.spawns['Spawn3'].room.controller, Game.spawns['Spawn3'].room.controller); break;
            } case 'harvester03': {
                roleHarvester.run(creep, source03, [STRUCTURE_LINK], Game.flags.Harv30); break;
            } case 'harvester013': {
                roleHarvester.run(creep, source13,
                    Game.spawns['Spawn3'].room.energyAvailable ==
                        Game.spawns['Spawn3'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv3); break;
            } case 'harvester13': {
                if (!creep.pos.isEqualTo(Game.flags.Harv31)) {
                    creep.moveTo(Game.flags.Harv31, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else {
                    if (Game.getObjectById(containerIDs3[0]).store.getFreeCapacity(RESOURCE_ENERGY) > 200) {
                        roleHarvesterTarget.run(creep, source13, Game.getObjectById(containerIDs3[0]));
                    } else {
                        roleHarvesterTarget.run(creep, source13, Game.getObjectById(containerIDs3[1]));
                    }
                    //roleHarvester.run(creep, source13, [STRUCTURE_CONTAINER], Game.flags.Harv31);
                }
                break;
                /*
                roleHarvester.run(creep, source13,
                    Game.spawns['Spawn3'].room.energyAvailable ==
                        Game.spawns['Spawn3'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_CONTAINER], Game.flags.Harv3); break;*/
            } case 'builder13': {
                roleBuilder.run(creep, source13,
                    Game.spawns['Spawn3'].room.energyAvailable ==
                        Game.spawns['Spawn3'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv3); break;
            } case 'harvesterT03': {
                if (Game.getObjectById(towerIDs3[1]).store.getFreeCapacity([RESOURCE_ENERGY]) > 0) {
                    roleHarvesterTower.run(creep, source13, Game.getObjectById(towerIDs3[1]));
                } else {
                    roleHarvesterTower.run(creep, source13, Game.getObjectById(towerIDs3[0]));
                } break;
            } case 'urgentShifter3': {
                roleUrgentShifter.run(creep, [STRUCTURE_TOWER],
                    Game.getObjectById(towerIDs3[0]).store.getUsedCapacity(RESOURCE_ENERGY) >
                        Game.getObjectById(towerIDs3[1]).store.getUsedCapacity(RESOURCE_ENERGY) ?
                        Game.getObjectById(towerIDs3[1]) : Game.getObjectById(towerIDs3[0])); break;
            } case 'claimer03': {
                roleClaimer.run(creep, 'E28N53', 'E29N53'); break;
            } case 'claimer13': {
                roleClaimer.run(creep, 'E28N53', 'E28N52'); break;
            } case 'claimer3': {
                roleClaimerFlag.run(creep, 'E28N53', Game.flags.Flag1, 'E22N49'); break;
            } case 'upgraderUL3': {
                roleUpgraderUsingContainer.run(creep, Game.getObjectById(linkIDs3[1]), Game.flags.Upgrade3); break;
            } case 'processor3': {
                roleProcessor3.run(creep, Game.getObjectById(linkIDs3[1]), Game.getObjectById(linkIDs3[0]), Game.getObjectById(linkIDs3[2])); break;
            } case 'attacker3': {
                roleAttacker.run(creep, Game.flags.Atk3); break;
            } case 'harvesterM3': {
                roleHarvester.run(creep, mineral3, [STRUCTURE_TERMINAL], Game.flags.Harv3); break;
            } case 'invader3': {
                roleInvader.run(creep, 'E28N53', 'E26N52'); break;
            } case 'transferer3': {
                //roleTransferer.run(creep, Game.getObjectById(containerIDs3[1]), Game.getObjectById(linkIDs3[2])); break;
                roleTransferer.run(creep, Game.getObjectById(containerIDs3[0]), Game.getObjectById(linkIDs3[2])); break;
            } case 'builderLD03': {
                roleBuilderLongDistanceFlag.run(creep, 'E28N53', Game.flags.Flag1, 'E22N49', source05, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], true); break;
            } case 'builderLD13': {
                roleBuilderLongDistanceFlag.run(creep, 'E28N53', Game.flags.Flag1, 'E22N49', source15, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], false); break;
            }


            //room4
            case 'upgrader14': {
                roleUpgrader.run(creep, source14, Game.spawns['Spawn4'].room.controller, Game.spawns['Spawn4'].room.controller); break;
            } case 'upgrader04': {
                roleUpgrader.run(creep, source04, Game.spawns['Spawn4'].room.controller, Game.spawns['Spawn4'].room.controller); break;
            } case 'harvester14': {
                roleHarvester.run(creep, source14,
                    Game.spawns['Spawn4'].room.energyAvailable ==
                        Game.spawns['Spawn4'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Harv40); break;
            } case 'harvester014': {
                roleHarvester.run(creep, source14,
                    Game.spawns['Spawn4'].room.energyAvailable ==
                        Game.spawns['Spawn4'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Harv40); break;
            } case 'harvester04': {
                roleHarvester.run(creep, source04, [STRUCTURE_LINK], Game.flags.Harv40); break;
                //roleHarvester.run(creep, source04,
                //    Game.spawns['Spawn4'].room.energyAvailable ==
                //        Game.spawns['Spawn4'].room.energyCapacityAvailable ?
                //        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                //        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Harv40); break;
            } case 'builder14': {
                roleBuilder.run(creep, source14,
                    Game.spawns['Spawn4'].room.energyAvailable ==
                        Game.spawns['Spawn4'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Harv40); break;
            } case 'harvesterT14': {
                if (Game.getObjectById(towerIDs4[0]).store.getFreeCapacity(RESOURCE_ENERGY) > 100) {
                    roleHarvesterTower.run(creep, source14, Game.getObjectById(towerIDs4[0]));
                } else {
                    roleHarvesterTower.run(creep, source14, Game.getObjectById(towerIDs4[1]));
                }
                break;
            } case 'urgentShifter4': {
                roleUrgentShifter.run(creep, [STRUCTURE_TOWER],
                    Game.getObjectById(towerIDs4[0]).store.getUsedCapacity(RESOURCE_ENERGY) >
                        Game.getObjectById(towerIDs4[1]).store.getUsedCapacity(RESOURCE_ENERGY) ?
                        Game.getObjectById(towerIDs4[1]) : Game.getObjectById(towerIDs4[0])); break;
            } case 'upgraderUL4': {
                roleUpgraderUsingContainer.run(creep, Game.getObjectById(linkIDs4[1]), Game.flags.Upgrade4); break;
            } case 'harvesterM4': {
                roleHarvester.run(creep, mineral4, [STRUCTURE_TERMINAL], Game.flags.Harv40); break;
            }


            //room5
            case 'upgrader15': {
                roleUpgrader.run(creep, source15, Game.spawns['Spawn5'].room.controller, Game.spawns['Spawn5'].room.controller); break;
            } case 'upgrader05': {
                roleUpgrader.run(creep, source05, Game.spawns['Spawn5'].room.controller, Game.spawns['Spawn5'].room.controller); break;
            } case 'harvester15': {
                roleHarvester.run(creep, source15,
                    Game.spawns['Spawn5'].room.energyAvailable ==
                        Game.spawns['Spawn5'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Harv50); break;
            } case 'harvester015': {
                roleHarvester.run(creep, source15,
                    Game.spawns['Spawn5'].room.energyAvailable ==
                        Game.spawns['Spawn5'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Harv50); break;
            } case 'harvester05': {
                roleHarvester.run(creep, source05,
                    Game.spawns['Spawn5'].room.energyAvailable ==
                        Game.spawns['Spawn5'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Harv50); break;
            } case 'builder05': {
                roleBuilder.run(creep, source05,
                    Game.spawns['Spawn5'].room.energyAvailable ==
                        Game.spawns['Spawn5'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK] :
                        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION], Game.flags.Harv50); break;
            } case 'harvesterT15': {
                if (Game.getObjectById(towerIDs5[0]).store.getFreeCapacity(RESOURCE_ENERGY) > 100) {
                    roleHarvesterTower.run(creep, source15, Game.getObjectById(towerIDs5[0]));
                }
                break;
            } case 'urgentShifter5': {
                roleUrgentShifter.run(creep, [STRUCTURE_TOWER],
                    Game.getObjectById(Game.getObjectById(towerIDs5[0]))); break;
            }

            default: {
                roleHarvester.run(creep, source01,
                    Game.spawns['Spawn1'].room.energyAvailable ==
                        Game.spawns['Spawn1'].room.energyCapacityAvailable ?
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE] :
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN], Game.flags.Harv1); break;
            }
        }
    }

    autoMarket.deal();
}