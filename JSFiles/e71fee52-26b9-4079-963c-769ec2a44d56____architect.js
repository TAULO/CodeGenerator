module.exports = {
    // a function to run the logic for this role
    createBuildingSites: function () {

        if (!Memory.rooms) {
            Memory.rooms = {};
        }

        if (Game.cpu.bucket < 100) {
            return;
        }


        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];

            if (!Memory.rooms[roomName]) {
                Memory.rooms[roomName] = {}
            }
            if (Memory.rooms[roomName].center == undefined) {
                let center = null;

                if (!Memory.rooms[roomName].center || !Memory.rooms[roomName].center[0] == undefined || Memory.rooms[roomName].center[1] == undefined) {
                    let mySpawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);
                    if (!mySpawns[0]) {
                        center = findBaseCenter(roomName);
                    }
                    else {
                        let possibleSpawns = getPossibleSpawns(roomName, false);

                        for (let spawnName in mySpawns) {
                            for (let possibleSpawnName in possibleSpawns) {
                                if (mySpawns[spawnName].pos.x == possibleSpawns[possibleSpawnName][0] &&
                                    mySpawns[spawnName].pos.y == possibleSpawns[possibleSpawnName][1]) {
                                    center = possibleSpawns[possibleSpawnName];
                                    center[1]++;
                                    break;
                                }
                            }
                            if (center) {
                                break;
                            }

                        }
                    }
                }

                Memory.rooms[roomName].center = center;
            }


            if (room.controller && room.controller.my) {
                if (Game.time % 10 == 0 && (
                    !Memory.rooms[roomName].builds || !Memory.rooms[roomName].builds.length)) {
                    planStructures(roomName);
                    for (let exit of Memory.rooms[roomName].exits) {
                        if (Memory.rooms[exit] && !Memory.rooms[exit].builds || !Memory.rooms[exit].builds.length) {
                            planStructures(exit);
                        }
                    }

                }
                else if (Memory.rooms[roomName].exits){
                    
                    let rooms = [];
                    if (Memory.rooms[roomName].exits.length) {
                        rooms = [...Memory.rooms[roomName].exits];
                    }

                    rooms.push(roomName)

                    for (let thisRoom of rooms) {

                        if (Game.rooms[thisRoom] && !Memory.rooms[thisRoom].enemies && !Memory.rooms[thisRoom].enemyStructures && Game.rooms[thisRoom].controller)

                            for (let i = 0; i < Math.min(Memory.rooms[thisRoom].builds.length, 3); i++) {

                                if (Game.rooms[thisRoom].controller.level >= Memory.rooms[thisRoom].builds[i].minimalRCL) {
                                    if (Game.rooms[thisRoom].createConstructionSite(Memory.rooms[thisRoom].builds[i].x,
                                        Memory.rooms[thisRoom].builds[i].y,
                                        Memory.rooms[thisRoom].builds[i].structureType) == 0) {

                                        // break;
                                    }
                                    else {
                                        Memory.rooms[thisRoom].builds.splice(i, 1);
                                    }
                                }
                                else {
                                    Memory.rooms[thisRoom].builds.splice(i, 1);
                                }

                            }

                    }

                }


            }

        }



    },
    getPossibleSpawns: function (roomName, visualize = true) {
        getPossibleSpawns(roomName, visualize);

    }

};


function findBaseCenter(roomName) {

    let possibleSpawns = getPossibleSpawns(roomName, false);

    let energySources = Game.rooms[roomName].find(FIND_SOURCES);

    let distances = [];

    for (let spawnIndex in possibleSpawns) {
        let distance = 0;
        for (let energyName in energySources) {
            distance += Game.rooms[roomName].getPositionAt(possibleSpawns[spawnIndex][0],
                possibleSpawns[spawnIndex][1] + 1).findPathTo(energySources[energyName], { swampCost: 1, ignoreCreeps: true, ignoreDestructibleStructures: true }).length;
        }
        distances.push(distance);
    }

    target = possibleSpawns[distances.indexOf(Math.min(...distances))];

    if (target) {
        target[1] = target[1] + 1;

        return target;
    }
    else return null;


}



function getPossibleSpawns(roomName, visualize = true) {
    const terrain = new Room.Terrain(roomName);

    let terrainBuffer = terrain.getRawBuffer();

    let possibleSpawns = [];


    for (let i = 7; i < 43; i++) {
        for (let j = 6; j < 42; j++) {

            for (let k = -6; k < 7; k++) {
                for (let l = -5; l < 8; l++) {
                    if (terrainBuffer[(l + j) * 50 + (k + i)] == 0 || terrainBuffer[(l + j) * 50 + (k + i)] == 2 ||
                        (k == -6 && (l <= -2 || l >= 4)) ||
                        (k == -5 && (l <= -3 || l >= 5)) ||
                        (k == -4 && (l <= -4 || l >= 6)) ||
                        (k == -3 && (l <= -5 || l >= 7)) ||
                        (k == 3 && (l <= -5 || l >= 7)) ||
                        (k == 4 && (l <= -4 || l >= 6)) ||
                        (k == 5 && (l <= -3 || l >= 5)) ||
                        (k == 6 && (l <= -2 || l >= 4))) {
                        valid = true;
                    }
                    else {
                        valid = false;
                        break
                    }

                }
                if (!valid) {
                    break;
                }

            }

            if (valid) {
                possibleSpawns.push([i, j]);
                if (visualize) {
                    new RoomVisual(roomName).text("💥", i, j);
                }
            }


        }
    }



    return possibleSpawns;
}

function planStructures(roomName) {
    const terrain = new Room.Terrain(roomName);
    Memory.rooms[roomName].builds = [];

    center = Memory.rooms[roomName].center;

    if (!center) {

        if (Game.rooms[roomName] && Game.rooms[roomName].controller) {
            sources = Game.rooms[roomName].find(FIND_SOURCES);

            for (let sourceName in sources) {
        
                possiblePositions = [];
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (terrain.get(sources[sourceName].pos.x + i, sources[sourceName].pos.y + j) != TERRAIN_MASK_WALL &&
                            !Game.rooms[roomName].find(FIND_STRUCTURES, {
                                filter: s => s.pos &&
                                    s.pos.x == sources[sourceName].pos.x + i &&
                                    s.pos.y == sources[sourceName].pos.y + j &&
                                    s.structureType != STRUCTURE_CONTAINER && s.structureType != STRUCTURE_ROAD
                            })[0] &&
                            (i != 0 || j != 0)) {
                            possiblePositions.push([sources[sourceName].pos.x + i, sources[sourceName].pos.y + j]);
                        }
                    }
                }
        
                distances = [];
        
                for (let posIndex in possiblePositions) {
                    distances.push(Game.rooms[roomName].getPositionAt(possiblePositions[posIndex][0],
                        possiblePositions[posIndex][1]).getRangeTo(
                            Game.rooms[roomName].getPositionAt(Game.rooms[roomName].x,
                                Game.rooms[roomName].y)));
                }
                containerPos = possiblePositions[distances.indexOf(Math.min(...distances))];
                Memory.rooms[roomName].builds.push({
                    'x': containerPos[0],
                    'y': containerPos[1],
                    'structureType': STRUCTURE_CONTAINER,
                    'minimalRCL': 0
                });
            }

        }
        return false;
    }

    let externalRing = [[center[0] - 6, center[1] - 2],
    [center[0] - 6, center[1] - 1],
    [center[0] - 6, center[1]],
    [center[0] - 6, center[1] + 1],
    [center[0] - 6, center[1] + 2],
    [center[0] - 5, center[1] - 3],
    [center[0] - 5, center[1] + 3],
    [center[0] - 4, center[1] - 4],
    [center[0] - 4, center[1] + 4],
    [center[0] - 3, center[1] - 5],
    [center[0] - 3, center[1] + 5],
    [center[0] - 2, center[1] - 6],
    [center[0] - 2, center[1] + 6],
    [center[0] - 1, center[1] - 6],
    [center[0] - 1, center[1] + 6],
    [center[0], center[1] - 6],
    [center[0], center[1] + 6],
    [center[0] + 1, center[1] - 6],
    [center[0] + 1, center[1] + 6],
    [center[0] + 2, center[1] - 6],
    [center[0] + 2, center[1] + 6],
    [center[0] + 3, center[1] - 5],
    [center[0] + 3, center[1] + 5],
    [center[0] + 4, center[1] - 4],
    [center[0] + 4, center[1] + 4],
    [center[0] + 5, center[1] - 3],
    [center[0] + 5, center[1] + 3],
    [center[0] + 6, center[1] - 2],
    [center[0] + 6, center[1] + 2],
    [center[0] + 6, center[1] + 1],
    [center[0] + 6, center[1] + 1],
    [center[0] + 6, center[1]]]

    Memory.rooms[roomName].externalRing = externalRing;

    // RCL 1

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 1,
        'structureType': STRUCTURE_SPAWN,
        'minimalRCL': 1

    });


    // 2 Containers

    sources = Game.rooms[roomName].find(FIND_SOURCES);
    sources = _.sortBy(sources, s => s.pos.findPathTo(center[0], center[1]).length);

    for (let sourceName in sources) {

        possiblePositions = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (terrain.get(sources[sourceName].pos.x + i, sources[sourceName].pos.y + j) != TERRAIN_MASK_WALL &&
                    !Game.rooms[roomName].find(FIND_STRUCTURES, {
                        filter: s => s.pos &&
                            s.pos.x == sources[sourceName].pos.x + i &&
                            s.pos.y == sources[sourceName].pos.y + j &&
                            s.structureType != STRUCTURE_CONTAINER && s.structureType != STRUCTURE_ROAD
                    })[0] &&
                    (i != 0 || j != 0)) {
                    possiblePositions.push([sources[sourceName].pos.x + i, sources[sourceName].pos.y + j]);
                }
            }
        }

        distances = [];

        for (let posIndex in possiblePositions) {
            distances.push(Game.rooms[roomName].getPositionAt(possiblePositions[posIndex][0],
                possiblePositions[posIndex][1]).getRangeTo(
                    Game.rooms[roomName].getPositionAt(center[0],
                        center[1])));
        }
        containerPos = possiblePositions[distances.indexOf(Math.min(...distances))];
        Memory.rooms[roomName].builds.push({
            'x': containerPos[0],
            'y': containerPos[1],
            'structureType': STRUCTURE_CONTAINER,
            'minimalRCL': 0
        });

        // road to container

        distances = []
        for (let ref of externalRing) {
            distances.push(Game.rooms[roomName].getPositionAt(ref[0], ref[1]).getRangeTo(
                Game.rooms[roomName].getPositionAt(containerPos[0], containerPos[1])));
        }
        let roadStart = externalRing[distances.indexOf(Math.min(...distances))];

        let path = Game.rooms[roomName].getPositionAt(roadStart[0], roadStart[1]).findPathTo(Game.rooms[roomName].getPositionAt(containerPos[0], containerPos[1]), { swampCost: 2, ignoreCreeps: true, ignoreDestructibleStructures: true });

        for (var i = 0; i < path.length; i++) {
            Memory.rooms[roomName].builds.push({
                'x': path[i].x,
                'y': path[i].y,
                'structureType': STRUCTURE_ROAD,
                'minimalRCL': 1
            });
        }

    }

    // RCL 2

    // Extensions

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 2,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 2
    });

    // Roads

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 3,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 2,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 2,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 1,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 1,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1],
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1],
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 1,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 1,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 2,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 2,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 3,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 4,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 4,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1],
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1],
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 5,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 5,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1],
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1],
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1],
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1],
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 5,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] - 4,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] - 3,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1] - 2,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1] - 1,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1] + 1,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1] + 2,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] + 3,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 4,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 5,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 5,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] + 4,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] + 3,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1] + 2,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1] + 1,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1] - 1,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1] - 2,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] - 3,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] - 4,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 5,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 6,
        'structureType': STRUCTURE_ROAD,
        'minimalRCL': 2
    });

    // RCL 3

    // 5 Extensions

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 2,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 3
    });

    // 1 Tower

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 1,
        'structureType': STRUCTURE_TOWER,
        'minimalRCL': 3
    });


    // Outer ramparts

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 6,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 6,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 6,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 3
    });
    // RCL 4


    // 10 Extensions

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 2,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 5,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 5,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 4
    });

    // 1 Storage

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1],
        'structureType': STRUCTURE_STORAGE,
        'minimalRCL': 4
    });

    //  RCL 5

    // 2 Links

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 1,
        'structureType': STRUCTURE_LINK,
        'minimalRCL': 5
    });

    // Link collector
    containers = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_CONTAINER
    });

    sources = _.sortBy(sources, s => s.pos.findPathTo(center[0], center[1]).length);

    for (let containerNumber in containers) {

        if (containers[containerNumber].pos.findInRange(FIND_SOURCES, 1)[0]) {
            possiblePositions = [];
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (terrain.get(containers[containerNumber].pos.x + i, containers[containerNumber].pos.y + j) != TERRAIN_MASK_WALL &&
                        !Game.rooms[roomName].find(FIND_STRUCTURES, {
                            filter: s => s.pos &&
                                s.pos.x == containers[containerNumber].pos.x + i &&
                                s.pos.y == containers[containerNumber].pos.y + j &&
                                s.structureType != STRUCTURE_LINK && s.structureType != STRUCTURE_ROAD
                        })[0] &&
                        (i != 0 || j != 0)) {
                        possiblePositions.push([containers[containerNumber].pos.x + i, containers[containerNumber].pos.y + j]);
                    }
                }
            }


            distances = [];

            for (let posIndex in possiblePositions) {
                distances.push(Game.rooms[roomName].getPositionAt(possiblePositions[posIndex][0],
                    possiblePositions[posIndex][1]).getRangeTo(
                        Game.rooms[roomName].getPositionAt(center[0],
                            center[1])));
            }
            linkPos = possiblePositions[distances.indexOf(Math.max(...distances))];
            if (linkPos) {
                Memory.rooms[roomName].builds.push({
                    'x': linkPos[0],
                    'y': linkPos[1],
                    'structureType': STRUCTURE_LINK,
                    'minimalRCL': 5 + parseInt(containerNumber)
                });
            }
            else {
                console.log('[WARNING]: Unable to find a location for link')
            }

        }

    }

    // 1 Tower

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 1,
        'structureType': STRUCTURE_TOWER,
        'minimalRCL': 5
    });

    // 10 Extensions

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] + 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 5,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 5,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] - 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] + 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] - 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] + 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 5
    });


    // RCL 6

    // 10 Extensions

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] - 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] - 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 5,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] - 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] - 2,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] - 2,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] + 2,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 6
    });

    // 1 Extractor

    // minerals = Game.rooms[roomName].find(FIND_MINERALS);

    // for (let mineralName in minerals) {

    //     Memory.rooms[roomName].builds.push({
    //         'x': minerals[mineralName].pos.x,
    //         'y': minerals[mineralName].pos.y,
    //         'structureType': STRUCTURE_EXTRACTOR,
    //         'minimalRCL': 6
    //     });


    //     possiblePositions = [];
    //     for (let i = -1; i < 2; i++) {
    //         for (let j = -1; j < 2; j++) {
    //             if (terrain.get(minerals[mineralName].pos.x + i, minerals[mineralName].pos.y + j) != TERRAIN_MASK_WALL &&
    //                 !Game.rooms[roomName].find(FIND_STRUCTURES, {
    //                     filter: s => s.pos.x == minerals[mineralName].pos.x + i &&
    //                         s.pos.y == minerals[mineralName].pos.y + j &&
    //                         s.structureType != STRUCTURE_CONTAINER && s.structureType != STRUCTURE_ROAD
    //                 })[0] &&
    //                 (i != 0 || j != 0)) {
    //                 possiblePositions.push([minerals[mineralName].pos.x + i, minerals[mineralName].pos.y + j]);
    //             }
    //         }
    //     }

    //     distances = [];

    //     for (let posIndex in possiblePositions) {
    //         distances.push(Game.rooms[roomName].getPositionAt(possiblePositions[posIndex][0],
    //             possiblePositions[posIndex][1]).getRangeTo(
    //                 Game.rooms[roomName].getPositionAt(center[0],
    //                     center[1])));
    //     }
    //     containerPos = possiblePositions[distances.indexOf(Math.min(...distances))];
    //     Memory.rooms[roomName].builds.push({
    //         'x': containerPos[0],
    //         'y': containerPos[1],
    //         'structureType': STRUCTURE_CONTAINER,
    //         'minimalRCL': 6
    //     });


    //     // road to link
    //     distances = []
    //     for (let ref of externalRing) {
    //         distances.push(Game.rooms[roomName].getPositionAt(ref[0], ref[1]).getRangeTo(
    //             Game.rooms[roomName].getPositionAt(containerPos[0], containerPos[1])));
    //     }
    //     let roadStart = externalRing[distances.indexOf(Math.min(...distances))];

    //     let path = Game.rooms[roomName].getPositionAt(roadStart[0], roadStart[1]).findPathTo(Game.rooms[roomName].getPositionAt(containerPos[0], containerPos[1]), { swampCost: 2, ignoreCreeps: true, ignoreDestructibleStructures: true });

    //     for (var i = 0; i < path.length; i++) {
    //         Memory.rooms[roomName].builds.push({
    //             'x': path[i].x,
    //             'y': path[i].y,
    //             'structureType': STRUCTURE_ROAD,
    //             'minimalRCL': 6
    //         });
    //     }

    // }

    // 3 Lab
    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 2,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 2,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 3,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 6
    });

    // 1 Terminal

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 1,
        'structureType': STRUCTURE_TERMINAL,
        'minimalRCL': 6
    });

    // Inner Ramparts

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 5,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 5,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 4,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 3,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 2,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 1,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 1,
        'y': center[1],
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 0,
        'y': center[1] + 0,
        'structureType': STRUCTURE_RAMPART,
        'minimalRCL': 6
    });


    // RCL 7

    // 1 Link
    controller = Game.rooms[roomName].controller;

    possiblePositions = [];
    for (let i = -2; i < 3; i++) {
        for (let j = -2; j < 3; j++) {
            if ((i == -2 || i == 2 || j == -2 || j == 2) && terrain.get(controller.pos.x + i, controller.pos.y + j) != TERRAIN_MASK_WALL &&
                !Game.rooms[roomName].find(FIND_STRUCTURES, {
                    filter: s => s.pos &&
                        s.pos.x == controller.pos.x + i &&
                        s.pos.y == controller.pos.y + j &&
                        s.structureType != STRUCTURE_LINK && s.structureType != STRUCTURE_ROAD
                })[0]) {
                possiblePositions.push([controller.pos.x + i, controller.pos.y + j]);
            }
        }
    }


    distances = [];

    for (let posIndex in possiblePositions) {
        distances.push(Game.rooms[roomName].getPositionAt(possiblePositions[posIndex][0],
            possiblePositions[posIndex][1]).getRangeTo(
                Game.rooms[roomName].getPositionAt(center[0],
                    center[1])));
    }
    linkPos = possiblePositions[distances.indexOf(Math.min(...distances))];
    Memory.rooms[roomName].builds.push({
        'x': linkPos[0],
        'y': linkPos[1],
        'structureType': STRUCTURE_LINK,
        'minimalRCL': 7
    });

    // road to link
    distances = []
    for (let ref of externalRing) {
        distances.push(Game.rooms[roomName].getPositionAt(ref[0], ref[1]).getRangeTo(
            Game.rooms[roomName].getPositionAt(linkPos[0], linkPos[1])));
    }
    let roadStart = externalRing[distances.indexOf(Math.min(...distances))];

    let path = Game.rooms[roomName].getPositionAt(roadStart[0], roadStart[1]).findPathTo(Game.rooms[roomName].getPositionAt(linkPos[0], linkPos[1]), { swampCost: 2, ignoreCreeps: true, ignoreDestructibleStructures: true });

    for (var i = 0; i < path.length; i++) {
        Memory.rooms[roomName].builds.push({
            'x': path[i].x,
            'y': path[i].y,
            'structureType': STRUCTURE_ROAD,
            'minimalRCL': 1
        });
    }




    // 1 Spawn

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 2,
        'structureType': STRUCTURE_SPAWN,
        'minimalRCL': 7
    });


    // 10 Extensions

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] + 2,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 4,
        'y': center[1] + 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 3,
        'y': center[1] + 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] + 5,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 5,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] + 4,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 3,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 2,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 7
    });

    // 1 Tower

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1],
        'structureType': STRUCTURE_TOWER,
        'minimalRCL': 7
    });

    // 3 Labs

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 4,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 3,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 7
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] - 2,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 7
    });

    // 1 Factory

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 1,
        'y': center[1],
        'structureType': STRUCTURE_FACTORY,
        'minimalRCL': 7
    });


    // RCL 8

    // 1 Oberser

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1] - 2,
        'structureType': STRUCTURE_OBSERVER,
        'minimalRCL': 8
    });

    // 1 Spawn

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] + 2,
        'structureType': STRUCTURE_SPAWN,
        'minimalRCL': 8
    });

    // 10 Extensions

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] + 1,
        'structureType': STRUCTURE_EXTENSION,
        'minimalRCL': 8
    });

    // 3 towers

    Memory.rooms[roomName].builds.push({
        'x': center[0] - 2,
        'y': center[1],
        'structureType': STRUCTURE_TOWER,
        'minimalRCL': 8
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] - 2,
        'structureType': STRUCTURE_TOWER,
        'minimalRCL': 8
    });
    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 2,
        'structureType': STRUCTURE_TOWER,
        'minimalRCL': 8
    });

    // 4 labs

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 4,
        'y': center[1] - 3,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 8
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 3,
        'y': center[1] - 4,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 8
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 5,
        'y': center[1] - 2,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 8
    });

    Memory.rooms[roomName].builds.push({
        'x': center[0] + 2,
        'y': center[1] - 5,
        'structureType': STRUCTURE_LAB,
        'minimalRCL': 8
    });

    // 1 power spawn

    Memory.rooms[roomName].builds.push({
        'x': center[0],
        'y': center[1] + 1,
        'structureType': STRUCTURE_POWER_SPAWN,
        'minimalRCL': 8
    });

    // 1 nuker
    // TODO



    // road to other maps

    // for (let exit of Memory.rooms[roomName].exits) {
    //     if (Memory.rooms[exit] && !Memory.rooms[exit].enemies && Game.rooms[exit]) {

    //         if (Memory.rooms[exit].my) {

    //         }
    //         else {
    //             let containers = Game.rooms[exit].find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});

    //             for (let container of containers) {
    //                 distances = []
    //                 for (let ref of externalRing) {
    //                     distances.push(Game.rooms[roomName].getPositionAt(ref[0], ref[1]).getRangeTo(
    //                         Game.rooms[roomName].getPositionAt(container.pos.x, container.pos.y)));
    //                 }
    //                 let roadStart = externalRing[distances.indexOf(Math.min(...distances))];

    //                 let path = Game.rooms[roomName].getPositionAt(roadStart[0], roadStart[1]).findPathTo(Game.rooms[roomName].getPositionAt(container.pos.x, container.pos.y), {swampCost: 2, ignoreCreeps: true, ignoreDestructibleStructures: true});

    //                 for (var i = 0; i < path.length; i++) {
    //                     Memory.rooms[roomName].builds.push({
    //                         'x': path[i].x,
    //                         'y': path[i].y,
    //                         'structureType': STRUCTURE_ROAD,
    //                         'minimalRCL': 1
    //                     });
    //                 }
    //             }
    //         }
    //     }
    // }
}