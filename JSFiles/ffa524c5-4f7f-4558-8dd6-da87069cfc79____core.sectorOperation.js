    const minCut = require('lib.minCut');
    const Pioneer = require('archetype.pioneer');
    const Drill = require('archetype.drill');
    const Upgrader = require('archetype.upgrader');
    //const Worker = require('archetype.worker');
    //const Carrier = require('archetype.carrier');
    const autobahn = require('lib.autobahn');

    require('module.spawning');
    require('prototypes.archetypes');

    const lookForStructure = (pos, structureType) => {
        return _.find(pos.lookFor(LOOK_STRUCTURES), s => s.structureType === structureType);
    };  

    function updateConstructionSites(roomId){ 
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        let newSites = sector.find(FIND_CONSTRUCTION_SITES);
        for (let i = 0; i < newSites.length; i++) {
            sectorMemory.constructionSites.push(newSites[i].id);
        }
        return newSites.length;
    }

    function buildTurrets(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        let basecoords = sectorMemory.basePosition;
        
        if (sector.controller.level >= 3) {
            sector.createConstructionSite(basecoords.x+2, basecoords.y, STRUCTURE_TOWER);
        }
        
        if (sector.controller.level >= 5) {
            sector.createConstructionSite(basecoords.x, basecoords.y-1, STRUCTURE_TOWER);
        }
        
        if (sector.controller.level >= 7) {
            sector.createConstructionSite(basecoords.x, basecoords.y+1, STRUCTURE_TOWER);
        }
        
        if (sector.controller.level >= 8) {
            sector.createConstructionSite(basecoords.x-2, basecoords.y, STRUCTURE_TOWER);
            sector.createConstructionSite(basecoords.x, basecoords.y+2, STRUCTURE_TOWER);
            sector.createConstructionSite(basecoords.x, basecoords.y-2, STRUCTURE_TOWER);
        }
    }

    function buildLabs(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        let basecoords = sectorMemory.basePosition;
        
        if (sector.controller.level >= 6) {
            sector.createConstructionSite(basecoords.x+2, basecoords.y-2, STRUCTURE_LAB);
            sector.createConstructionSite(basecoords.x+2, basecoords.y-3, STRUCTURE_LAB);
            sector.createConstructionSite(basecoords.x+3, basecoords.y-2, STRUCTURE_LAB);
        }
        
        if (sector.controller.level >= 7) {
            sector.createConstructionSite(basecoords.x+3, basecoords.y-3, STRUCTURE_LAB);
            sector.createConstructionSite(basecoords.x+3, basecoords.y-4, STRUCTURE_LAB);
            sector.createConstructionSite(basecoords.x+4, basecoords.y-3, STRUCTURE_LAB);
        }
        
        if (sector.controller.level == 8) {
            
            sector.createConstructionSite(basecoords.x+3, basecoords.y-1, STRUCTURE_LAB);    
            sector.createConstructionSite(basecoords.x+1, basecoords.y-3, STRUCTURE_LAB);
            sector.createConstructionSite(basecoords.x+4, basecoords.y-2, STRUCTURE_LAB);
            sector.createConstructionSite(basecoords.x+2, basecoords.y-4, STRUCTURE_LAB);
        }
    }

    function checkLabs(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        if (sectorMemory.checkData['Labs'].phase == 'Analysis') {
            console.log('[Labs] In Analysis Mode:', Game.time);
            if (updateConstructionSites(roomId) == 0) { // No further road construction sites have been scheduled

                //Populate Memory with lab types: Suppliers and Processors;

                sectorMemory.checkData.currentCheck = 'Walls';  //Start Checking Walls
                sectorMemory.checkData['Labs'].phase = 'Construction'; //Reset Energy Checker
                sectorMemory.checkData['Labs'].rcl = sector.controller.level;
                sectorMemory.checkData['Labs'].lastCheck = Game.time;
            } else {
                sectorMemory.checkData.holdCheck = true; //Delay analysis until construction is done;
                sectorMemory.checkData['Labs'].phase = 'Construction'; // Check if more sites can be built;
            }
        } else if (sectorMemory.checkData['Labs'].phase == 'Construction' && sectorMemory.checkData.currentCheck == 'Labs') { //If we're checking energy and are expected to try to build expansions and spawns
            console.log('[Labs] In Construction Mode:', Game.time);
            buildLabs(roomId);
            sectorMemory.checkData['Labs'].phase = 'Analysis';
        }
    }

    global.testNetwork = function (roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        let baseCoords = sectorMemory.basePosition;        
        let start = new RoomPosition(baseCoords.x+3, baseCoords.y, roomId); // Start near first spawn in room
            
        // Add sources to destinations
        let destinations = sector.find(FIND_SOURCES); 
        destinations.push(sector.controller); // Add controller as destination
        let minerals = sector.find(FIND_MINERALS);
        if (minerals.length > 0) {
            destinations.push(minerals);
        }
        let network = autobahn(start, destinations);
        for (let i = 0; i < network.length; i++) {
            sector.visual.structure(network[i].x, network[i].y, STRUCTURE_ROAD);
        }
        sector.visual.connectRoads();
    }

    function checkRoadNetwork(roomId) {
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        let baseCoords = sectorMemory.basePosition;
        if (sectorMemory.checkData['Road Network'].phase == 'Analysis') {
            console.log('[Road Network] In Analysis Mode:', Game.time);
            if (updateConstructionSites(roomId) == 0) { // No further road construction sites have been scheduled
                sectorMemory.checkData.currentCheck = 'Links';  //Start Checking Turrets
                sectorMemory.checkData['Road Network'].phase = 'Construction'; //Reset Energy Checker
                sectorMemory.checkData['Road Network'].rcl = sector.controller.level;
                sectorMemory.checkData['Road Network'].lastCheck = Game.time;
            } else {
                sectorMemory.checkData.holdCheck = true; //Delay analysis until construction is done;
            }
        } else if (sectorMemory.checkData['Road Network'].phase == 'Construction' && sectorMemory.checkData.currentCheck == 'Road Network') { //If we're checking energy and are expected to try to build expansions and spawns
            console.log('[Road Network] In Construction Mode:', Game.time);
            
            let start = new RoomPosition(baseCoords.x+3, baseCoords.y, roomId); // Start near first spawn in room
            
            // Add sources to destinations
            let destinations = sector.find(FIND_SOURCES); 
            destinations.push(sector.controller); // Add controller as destination
            let minerals = sector.find(FIND_MINERALS);
            if (minerals.length > 0) {
                destinations.push(minerals[0].pos);
            }
            let network = autobahn(start, destinations);
            sectorMemory.network = network;
            for (let i = 0; i < network.length; i++) {
                // Add checks for Sources, Minerals and other positions
                let sources = network[i].findInRange(FIND_SOURCES);
                if (sources.length == 1) {
                    for (let s = 0; s < sources.length; s++) {
                        if (sources[0].id == sectorMemory.sources[s].sourceId && sectorMemory.sources.sourceId.miningPos == undefined) {
                            console.log('adding container');
                            console.log(sector.createConstructionSite(network, STRUCTURE_ROAD));
                            
                            sectorMemory.sources[s].miningPos = network[i];
                        }
                    }
                } else {
                    sector.createConstructionSite(network[i], STRUCTURE_ROAD);
                }
            }

            sectorMemory.checkData['Road Network'].phase = 'Analysis';
        }
    }

    function buildSpawns(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        let basecoords = sectorMemory.basePosition;
        if (sector.controller.level >= 1) {
            sector.createConstructionSite(basecoords.x+4, basecoords.y, STRUCTURE_SPAWN);
        }
        if (sector.controller.level >= 7) {
            sector.createConstructionSite(basecoords.x+1, basecoords.y-1, STRUCTURE_SPAWN);
        }
        if (sector.controller.level == 8) {
            sector.createConstructionSite(basecoords.x, basecoords.y-4, STRUCTURE_SPAWN);
        }
    }

    function getDesiredWallHealth(level){
        switch(level){
            case 2: return 10000;
            case 3: return 25000;
            case 4: return 500000;
            case 5: return 1000000;
            case 6: return 1500000;
            case 7: return 3000000;
            case 8: return 6000000;
        }
    }

    function buildBunkerUtility(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        let basecoords = sectorMemory.basePosition;
        if (sector.controller.level >= 3) {
            sector.createConstructionSite(basecoords.x+1, basecoords.y+4, STRUCTURE_CONTAINER);
            sector.createConstructionSite(basecoords.x-1, basecoords.y-4, STRUCTURE_CONTAINER);
        }
        
        if (sector.controller.level >= 4) {
            sector.createConstructionSite(basecoords.x-1, basecoords.y, STRUCTURE_STORAGE);
        }
        
        if (sector.controller.level >= 5) {
            sector.createConstructionSite(basecoords.x+1, basecoords.y+1, STRUCTURE_LINK);
        }
        
        if (sector.controller.level >= 6) {
            sector.createConstructionSite(basecoords.x+1, basecoords.y, STRUCTURE_TERMINAL);
        }
        
        if (sector.controller.level >= 7) {
            sector.createConstructionSite(basecoords.x-1, basecoords.y-1, STRUCTURE_FACTORY);
        }
        
        if (sector.controller.level == 8) {
            sector.createConstructionSite(basecoords.x-1, basecoords.y+1, STRUCTURE_POWER_SPAWN);
            sector.createConstructionSite(basecoords.x-6, basecoords.y+2, STRUCTURE_OBSERVER);
            sector.createConstructionSite(basecoords.x+6, basecoords.y-2, STRUCTURE_NUKER);
        }
    }

    function buildExpansions(roomID){
        let sectorMemory = Memory.rooms[roomID];
        let sector = Game.rooms[roomID];
        let basecoords = sectorMemory.basePosition;
        
        if (sector.controller.level >= 2) {
            sector.createConstructionSite(basecoords.x+4, basecoords.y+1, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+3, basecoords.y+1, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+3, basecoords.y+2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+2, basecoords.y+2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+2, basecoords.y+3, STRUCTURE_EXTENSION);
        }
        
        if (sector.controller.level >= 3) {
            sector.createConstructionSite(basecoords.x+4, basecoords.y+2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+4, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+3, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+3, basecoords.y+4, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+2, basecoords.y+4, STRUCTURE_EXTENSION);
        }
        
        if (sector.controller.level >= 4) {
            sector.createConstructionSite(basecoords.x+1, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+5, basecoords.y-1, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+5, basecoords.y, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+5, basecoords.y+1, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+5, basecoords.y+2, STRUCTURE_EXTENSION);

            sector.createConstructionSite(basecoords.x+1, basecoords.y+5, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x, basecoords.y+4, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x, basecoords.y+5, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-1, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-1, basecoords.y+4, STRUCTURE_EXTENSION);
        }
        
        if (sector.controller.level >= 5) {
            sector.createConstructionSite(basecoords.x-1, basecoords.y+5, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y+2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y+4, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y+5, STRUCTURE_EXTENSION);

            sector.createConstructionSite(basecoords.x-3, basecoords.y+1, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y+2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y+4, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-3, basecoords.y+2, STRUCTURE_EXTENSION);
        }

        if (sector.controller.level >= 6) {
            sector.createConstructionSite(basecoords.x-3, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-1, basecoords.y-3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-1, basecoords.y-5, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x, basecoords.y-5, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+1, basecoords.y-5, STRUCTURE_EXTENSION);

            sector.createConstructionSite(basecoords.x+2, basecoords.y-5, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+1, basecoords.y-4, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y-4, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y-3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-3, basecoords.y-4, STRUCTURE_EXTENSION);
        }

        if (sector.controller.level >= 7) {
            sector.createConstructionSite(basecoords.x-2, basecoords.y-2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-3, basecoords.y-3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-3, basecoords.y-2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-3, basecoords.y-1, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-4, basecoords.y-3, STRUCTURE_EXTENSION);

            sector.createConstructionSite(basecoords.x-4, basecoords.y-2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-4, basecoords.y-1, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-4, basecoords.y, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-5, basecoords.y-2, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-5, basecoords.y-1, STRUCTURE_EXTENSION);
        }

        if (sector.controller.level == 8) {
            sector.createConstructionSite(basecoords.x-5, basecoords.y, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-5, basecoords.y+1, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-2, basecoords.y-6, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+2, basecoords.y+6, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-4, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-3, basecoords.y+4, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-4, basecoords.y+2, STRUCTURE_EXTENSION);
            
            //Try to spawn non-standard extensions:
            sector.createConstructionSite(basecoords.x+3, basecoords.y+6, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-3, basecoords.y-6, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-6, basecoords.y+3, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x+6, basecoords.y-3, STRUCTURE_EXTENSION);

            // try to spawn edge extensions
            sector.createConstructionSite(basecoords.x-5, basecoords.y-4, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-4, basecoords.y-5, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-3, basecoords.y-6, STRUCTURE_EXTENSION);

            sector.createConstructionSite(basecoords.x-3, basecoords.y+6, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-4, basecoords.y+5, STRUCTURE_EXTENSION);
            sector.createConstructionSite(basecoords.x-5, basecoords.y+4, STRUCTURE_EXTENSION);
        }

    }

    function buildBunkerCoreRoads(roomID){
        let sectorMemory = Memory.rooms[roomID];
        let sector = Game.rooms[roomID];
        let basecoords = sectorMemory.basePosition;

        sector.createConstructionSite(basecoords.x-3, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-2, basecoords.y-1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-1, basecoords.y-2, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y-3, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+1, basecoords.y-2, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+2, basecoords.y-1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+3, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+2, basecoords.y+1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+1, basecoords.y+2, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y+3, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-1, basecoords.y+2, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-2, basecoords.y+1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+1, basecoords.y+4, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-4, basecoords.y+1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-1, basecoords.y-4, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+4, basecoords.y-1, STRUCTURE_ROAD);
    }

    function buildBunkerRimRoads(roomID){
        let sectorMemory = Memory.rooms[roomID];
        let sector = Game.rooms[roomID];
        let basecoords = sectorMemory.basePosition;
        sector.createConstructionSite(basecoords.x-2, basecoords.y-5, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-1, basecoords.y-6, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y-6, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+1, basecoords.y-6, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+2, basecoords.y-6, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+3, basecoords.y-5, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+4, basecoords.y-4, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+5, basecoords.y-3, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+5, basecoords.y-2, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+6, basecoords.y-1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+6, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+6, basecoords.y+1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+6, basecoords.y+2, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+5, basecoords.y+3, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+4, basecoords.y+4, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+3, basecoords.y+5, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+2, basecoords.y+5, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x+1, basecoords.y+6, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y+6, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-1, basecoords.y+6, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-2, basecoords.y+6, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-3, basecoords.y+5, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-4, basecoords.y+4, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-5, basecoords.y+3, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-5, basecoords.y+2, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-6, basecoords.y+1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-6, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-6, basecoords.y-1, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-6, basecoords.y-2, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-5, basecoords.y-3, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-4, basecoords.y-4, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x-3, basecoords.y-5, STRUCTURE_ROAD);

    }

    /*
    function buildBunkerTempRoads(roomID){
        let sectorMemory = Memory.rooms[roomID];
        let sector = Game.rooms[roomID];
        let basecoords = sectorMemory.basePosition;

        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);
        sector.createConstructionSite(basecoords.x, basecoords.y, STRUCTURE_ROAD);

    }
    */

    function runTurrets(roomId) { // Extremely kitbashed turret code
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        for (i = 0; i < sectorMemory.turrets.length; i++) {
            var tower = Game.getObjectById(sectorMemory.turrets[i]);
            if(tower) {
                var closestWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => 
                    ((structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && (structure.hits < (Math.min(structure.hitsMax, getDesiredWallHealth(sector.controller.level))-100))
                )});
                
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => 
                    (((structure.hits < structure.hitsMax) && !(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)) || (structure.hits < Math.min(structure.hitsMax, getDesiredWallHealth(sector.controller.level))) && (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART))
                });
                
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                } 
        
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    tower.attack(closestHostile);
                } else {
                    if (closestWall) {
                        tower.repair(closestWall);
                    }
                }
            }
        }
    }

    function checkUtility(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        let baseCoords = sectorMemory.basePosition;
        if (sectorMemory.checkData['Utility'].phase == 'Analysis') {
            console.log('[Utility] In Analysis Mode:', Game.time);
            if (updateConstructionSites(roomId) == 0) { // No further road construction sites have been scheduled
                if (sector.storage != undefined && sector.storage.id != sectorMemory.storageId){
                    delete sectorMemory.storage;
                    sectorMemory.storage = {};
                    sectorMemory.storage.storageId = sector.storage.id;
                    sectorMemory.storage.reservedEnergy = 0;
                }
                
                let pos = new RoomPosition(baseCoords.x+1, baseCoords.y+4, roomId); // Lower Refilling Container
                let structure = lookForStructure(pos, STRUCTURE_CONTAINER);
                if (structure != undefined && structure.id != sectorMemory.lowerRefillContainer) {
                    sectorMemory.lowerRefillContainer = structure.id;
                }

                pos = new RoomPosition(baseCoords.x-1, baseCoords.y-4, roomId); //Upper Refilling Container
                structure = lookForStructure(pos, STRUCTURE_CONTAINER);
                if (structure != undefined && structure.id != sectorMemory.upperRefillContainer) {
                    sectorMemory.upperRefillContainer = structure.id;
                }
                
                pos = new RoomPosition(baseCoords.x+1, baseCoords.y+1, roomId); //Base Link
                structure = lookForStructure(pos, STRUCTURE_LINK);
                if (structure != undefined && structure.id != sectorMemory.baseLink) {
                    sectorMemory.baseLink = structure.id;
                }
                
                pos = new RoomPosition(baseCoords.x-1, baseCoords.y+1, roomId); //Power Spawn
                structure = lookForStructure(pos, STRUCTURE_POWER_SPAWN);
                if (structure != undefined && structure.id != sectorMemory.powerSpawn) {
                    sectorMemory.powerSpawn = structure.id;
                }
                
                pos = new RoomPosition(baseCoords.x-1, baseCoords.y-4, roomId); //Factory
                structure = lookForStructure(pos, STRUCTURE_FACTORY);
                if (structure != undefined && structure != null && structure.id != sectorMemory.factory) {
                    sectorMemory.factory = structure.id;
                }
                
                pos = new RoomPosition(baseCoords.x+6, baseCoords.y-2, roomId); //Nuker Id
                structure = lookForStructure(pos, STRUCTURE_NUKER);
                if (structure != undefined && structure.id != sectorMemory.nuker) {
                    sectorMemory.nuker = structure.id;
                }
                
                pos = new RoomPosition(baseCoords.x-6, baseCoords.y+2, roomId); //Observer Id
                structure = lookForStructure(pos, STRUCTURE_OBSERVER);
                if (structure != undefined && structure.id != sectorMemory.observer) {
                    sectorMemory.observer = structure.id;
                }
                        
                sectorMemory.checkData.currentCheck = 'Bunker Roads';  //Start Checking Turrets
                sectorMemory.checkData['Utility'].phase = 'Construction'; //Reset Energy Checker
                sectorMemory.checkData['Utility'].rcl = sector.controller.level;
                sectorMemory.checkData['Utility'].lastCheck = Game.time;
            } else {
                sectorMemory.checkData.holdCheck = true; //Delay analysis until construction is done;
                sectorMemory.checkData['Utility'].phase = 'Construction'; // Check if more sites can be built;
            }
        } else if (sectorMemory.checkData['Utility'].phase == 'Construction' && sectorMemory.checkData.currentCheck == 'Utility') { //If we're checking energy and are expected to try to build expansions and spawns
            console.log('[Utility] In Construction Mode:', Game.time);
            buildBunkerUtility(roomId);
            sectorMemory.checkData['Utility'].phase = 'Analysis';
        }
    }

    function checkBunkerRoads(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        if (sectorMemory.checkData['Bunker Roads'].phase == 'Analysis') {
            console.log('[Bunker Roads] In Analysis Mode:', Game.time);
            if (updateConstructionSites(roomId) == 0) { // No further road construction sites have been scheduled
                sectorMemory.checkData.currentCheck = 'Road Network';  //Start Checking Road Network // TEMP
                sectorMemory.checkData['Bunker Roads'].phase = 'Construction'; //Reset Energy Checker
                sectorMemory.checkData['Bunker Roads'].rcl = sector.controller.level;
                sectorMemory.checkData['Bunker Roads'].lastCheck = Game.time;
            } else {
                sectorMemory.checkData.holdCheck = true; //Delay analysis until construction is done;
                sectorMemory.checkData['Bunker Roads'].phase = 'Construction'; // Check if more sites can be built;
            }
        } else if (sectorMemory.checkData['Bunker Roads'].phase == 'Construction' && sectorMemory.checkData.currentCheck == 'Bunker Roads') { //If we're checking energy and are expected to try to build expansions and spawns
            console.log('[Bunker Roads] In Construction Mode:', Game.time);
            buildBunkerCoreRoads(roomId);
            buildBunkerRimRoads(roomId);
            sectorMemory.checkData['Bunker Roads'].phase = 'Analysis';
        }
    }

    function checkWalls(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        if (sectorMemory.checkData['Walls'].phase == 'Analysis') {
            console.log('[Walls] In Analysis Mode:', Game.time);
            if (updateConstructionSites(roomId) == 0) { // No further road construction sites have been scheduled
                sectorMemory.checkData.currentCheck = 'Energy';  //Start Checking Road Network // TEMP
                sectorMemory.checkData['Walls'].phase = 'Construction'; //Reset Energy Checker
                sectorMemory.checkData['Walls'].rcl = sector.controller.level;
                sectorMemory.checkData['Walls'].lastCheck = Game.time;
            } else {
                sectorMemory.checkData.holdCheck = true; //Delay analysis until construction is done;
                sectorMemory.checkData['Walls'].phase = 'Construction'; // Check if more sites can be built;
            }
        } else if (sectorMemory.checkData['Walls'].phase == 'Construction' && sectorMemory.checkData.currentCheck == 'Walls') { //If we're checking energy and are expected to try to build expansions and spawns
            console.log('[Walls] In Construction Mode:', Game.time);
            let positions = minCut.test(roomId);
            for (i = 0; i < positions.length; i++){
                let position = new RoomPosition (positions[i].x, positions[i].y, roomId);
                let roads = position.findInRange(FIND_STRUCTURES, 1, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_ROAD)
                }});
                
                if (roads.length > 0) {
                    sector.createConstructionSite(position, STRUCTURE_RAMPART);
                } else {
                    sector.createConstructionSite(position, STRUCTURE_WALL);
                }
            }
            sectorMemory.checkData['Walls'].phase = 'Analysis';
        }
    }

    function checkTurrets(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        if (sectorMemory.checkData['Turrets'].phase == 'Analysis') {
            console.log('[Turrets] In Analysis Mode:', Game.time);
            if (updateConstructionSites(roomId) == 0) { // No further road construction sites have been scheduled
                delete sectorMemory.turrets;
                sectorMemory.turrets = [];
                
                let turret = sector.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER)
                    }
                });
                
                for (i = 0; i < turret.length; i++) {
                    sectorMemory.turrets[i] = turret[i].id;
                }

                sectorMemory.checkData.currentCheck = 'Utility';  //Start Checking Turrets
                sectorMemory.checkData['Turrets'].phase = 'Construction'; //Reset Energy Checker
                sectorMemory.checkData['Turrets'].rcl = sector.controller.level;
                sectorMemory.checkData['Turrets'].lastCheck = Game.time;
            } else {
                sectorMemory.checkData.holdCheck = true; //Delay analysis until construction is done;
                sectorMemory.checkData['Turrets'].phase = 'Construction'; // Check if more sites can be built;
            }
        }
        if (sectorMemory.checkData['Turrets'].phase == 'Construction' && sectorMemory.checkData.currentCheck == 'Turrets') { //If we're checking energy and are expected to try to build expansions and spawns
            console.log('[Turrets] In Construction Mode:', Game.time);
            buildTurrets(roomId);
            sectorMemory.checkData['Turrets'].phase = 'Analysis';
        }
                
        
    }

    function expansionAndSpawnCheck(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];
        

        if (sectorMemory.checkData['Energy'].phase == 'Analysis') {
            console.log('[Energy] In Analysis Mode:', Game.time);
            if (updateConstructionSites(roomId) == 0) {
                
                let spawns = sector.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }
                });


                if (sectorMemory.constructionSites.length == 0 && (sectorMemory.spawns.length < spawns.length)) { // not all spawns are active in memory
                    for (i = 0; i < spawns.length; i++) {
                        let newSpawn = true;
                        for (let j = 0; j < sectorMemory.spawns.length; j++){
                            if (spawns.id == sectorMemory.spawns[j].spawnId) {
                                newSpawn = false;
                                break;
                            }
                        }
                        if (newSpawn == true) {
                            let newSpawnId = sectorMemory.spawns.length;
                            sectorMemory.spawns[newSpawnId] = {};
                            sectorMemory.spawns[newSpawnId].spawnId = spawns[i].id;
                            sectorMemory.spawns[newSpawnId].initializeCreep = false;
                        }
                    }
                } else {
                    sectorMemory.checkData.currentCheck = 'Turrets';  //Start Checking Turrets
                    sectorMemory.checkData['Energy'].phase = 'Construction'; //Reset Energy Checker
                    sectorMemory.checkData['Energy'].rcl = sector.controller.level;
                    sectorMemory.checkData['Energy'].lastCheck = Game.time;
                } 
            } else {
                sectorMemory.checkData.holdCheck = true; //Delay analysis until construction is done;
                sectorMemory.checkData['Energy'].phase = 'Construction'; // Check if more sites can be built;
            }
        } else if (sectorMemory.checkData['Energy'].phase == 'Construction' && sectorMemory.checkData.currentCheck == 'Energy') { //If we're checking energy and are expected to try to build expansions and spawns
            console.log('[Energy] In Construction Mode:', Game.time);
            buildSpawns(roomId);
            buildExpansions(roomId);
            sectorMemory.checkData['Energy'].phase = 'Analysis';
        }

        
    }

    function baseCheck(roomId){
        let sectorMemory = Memory.rooms[roomId];
        let sector = Game.rooms[roomId];

        if (sectorMemory.checkData.holdCheck == undefined) {
            sectorMemory.checkData.holdCheck = false;
        }

        if (sectorMemory.checkData.holdCheck == true && sectorMemory.constructionSites.length == 0) { // All Construction completed
            sectorMemory.checkData.holdCheck = false;
        } 

        if (sectorMemory.checkData.holdCheck == false) { // No pending construction sites
            if (sectorMemory.checkData.currentCheck == 'Energy' && (sectorMemory.checkData['Energy'].rcl != sector.controller.level || (Game.time - sectorMemory.checkData['Energy'].lastCheck) > 1000)) { //If spawn checker was done in different RCL OR time from last check was at least 1000 ticks
                expansionAndSpawnCheck(roomId);
            }

            if (sectorMemory.checkData.currentCheck == 'Turrets' && (sectorMemory.checkData['Turrets'].rcl != sector.controller.level || (Game.time - sectorMemory.checkData['Turrets'].lastCheck) > 1000)) {
                if (sector.controller.level >= 3) {
                    checkTurrets(roomId);
                } else {
                    sectorMemory.checkData.currentCheck = 'Utility'; // Skip check
                }
            }

            if (sectorMemory.checkData.currentCheck == 'Utility' && (sectorMemory.checkData['Utility'].rcl != sector.controller.level || (Game.time - sectorMemory.checkData['Utility'].lastCheck) > 1000)) {
                if (sector.controller.level >= 3) {
                    checkUtility(roomId);
                } else {
                    sectorMemory.checkData.currentCheck = 'Bunker Roads'; // RCL is 1-3; Skip this check;
                }
            }
            
            if (sectorMemory.checkData.currentCheck == 'Bunker Roads' && (sectorMemory.checkData['Bunker Roads'].rcl != sector.controller.level || (Game.time - sectorMemory.checkData['Bunker Roads'].lastCheck) > 1000)) {
                if (sector.controller.level >= 2) {
                    checkBunkerRoads(roomId);
                } else {
                    sectorMemory.checkData.currentCheck = 'Road Network'; // RCL is 1 or 2; Skip other checks that cannot be done on RCL 2
                }
            }

            if (sectorMemory.checkData.currentCheck == 'Road Network' && (sectorMemory.checkData['Road Network'].rcl != sector.controller.level || (Game.time - sectorMemory.checkData['Road Network'].lastCheck) > 1000)) { //Road Network AND Containers
                if (sector.controller.level >= 2) {
                    checkRoadNetwork(roomId); // Temp
                } else {
                    sectorMemory.checkData.currentCheck = 'Links'; // RCL is 1 or 2; Skip other checks that cannot be done on RCL 2
                }
            }
            
            if (sectorMemory.checkData.currentCheck == 'Links' && (sectorMemory.checkData['Turrets'].rcl != sector.controller.level || (Game.time - sectorMemory.checkData['Turrets'].lastCheck) > 1000)) {
                if (sector.controller.level >= 5) {
                    sectorMemory.checkData.currentCheck = 'Labs'; // Temp
                } else {
                    sectorMemory.checkData.currentCheck = 'Labs'; // RCL is 1-4; Skip other checks that cannot be done until RCL 5
                }
            }

            if (sectorMemory.checkData.currentCheck == 'Labs' && (sectorMemory.checkData['Labs'].rcl != sector.controller.level || (Game.time - sectorMemory.checkData['Labs'].lastCheck) > 1000)) {
                if (sector.controller.level >= 6) {
                    checkLabs(roomId);
                } else {
                    sectorMemory.checkData.currentCheck = 'Walls'; // Skip check
                }
            }

            if (sectorMemory.checkData.currentCheck == 'Walls' && (sectorMemory.checkData['Walls'].rcl != sector.controller.level || (Game.time - sectorMemory.checkData['Walls'].lastCheck) > 1000)) {
                if (sector.controller.level >= 3) {
                    checkWalls(roomId); // Temp
                } else {
                    sectorMemory.checkData.currentCheck = 'Energy'; // RCL is 1-6; Skip check
                }
            }

        }


    }

    function run(roomID) {
        let sectorMemory = Memory.rooms[roomID];
        let sector = Game.rooms[roomID];
        sectorMemory.lastIntel = Game.time;
     
        /*
        RECOVERY & STARTUP MODES
        */
        if (sectorMemory.startup == true) {
            delete sectorMemory.startup;
            sectorMemory.spawnQueue.push('Pioneer');
            //sectorMemory.spawnQueue.push('Scout');
            //sectorMemory.spawnQueue.push('Scout');
            sectorMemory.spawnQueue.push('Pioneer');
            sectorMemory.spawnQueue.push('Pioneer');
            sectorMemory.spawnQueueByType['Pioneer'] += 3;
            //sectorMemory.spawnQueueByType['Scout'] += 2;
        }

        if (sectorMemory.transporters.length == 0 && sectorMemory.pioneers.length == 0) { //no Carrying creeps available
            sectorMemory.recoveryMode = true;
        }
        

        /*
        SPAWNING SYSTEM OPERATION
        */
        operateSpawns(roomID); 
        
        /*
        CONSTRUCTION AND PHASE ANALYSIS
        */
        baseCheck(roomID);
    

        /* 
        TURRET OPERATION
        */
        runTurrets(roomID);
        
        /* 
        DROPPED RESOURCES ANALYSIS
        */
        
        // Get dropped energy
        let droppedEnergy = sector.find(FIND_DROPPED_RESOURCES, {
            filter: { resourceType: RESOURCE_ENERGY }
        });
        
        if (droppedEnergy.length > 0) {
            for (i = 0; i < droppedEnergy.length; i++) {
                if(droppedEnergy[i].amount > 0) {
                    let packedId = droppedEnergy[i].id;
                    let found = false;
                    for (let j = 0; j < sectorMemory.droppedEnergy.length; j++) {
                        if (sectorMemory.droppedEnergy[j].id == packedId) {
                            found = true;
                            break;
                        }
                    }
                    if (found == false) {
                        let newId = sectorMemory.droppedEnergy.length
                        sectorMemory.droppedEnergy[newId] = {};
                        sectorMemory.droppedEnergy[newId].id = packedId;
                        sectorMemory.droppedEnergy[newId].reservedAmount = 0;
                    }

                }    
            }
        }
        
        // Filter out wrongly listed dropped energy:
        for (i = 0; i < sectorMemory.droppedEnergy.length; i++) {
            if (Game.getObjectById(sectorMemory.droppedEnergy[i].id) == null){
                sectorMemory.droppedEnergy.splice(i,1);
                i--;
            }
        }
        
        
        
        // Get dropped resources
        let droppedResources = sector.find(FIND_DROPPED_RESOURCES, {
            filter: (drop) => {return (drop.resourceType !== RESOURCE_ENERGY)}
        });
        if (droppedResources.length > 0) {
            for (i = 0; i < droppedResources.length ; i++) {
                sectorMemory.droppedResources[0].id = droppedResources[0].id;
                sectorMemory.droppedResources[0].reservedAmount = 0;
            }
        }

        for (i = 0; i < sectorMemory.droppedResources.length; i++) {
            if (Game.getObjectById(sectorMemory.droppedResources[i].id) == null){
                sectorMemory.droppedResources.splice(i,1);
                i--;
            }
        }
        
        
        /*
        CREEP OPERATION
        */
       
        if (Memory.Gestalt.foundDead == true){ // There are dead creeps in sector
            // Lift scouting reservations
            for (i = 0; i < sectorMemory.scoutingReservations.length; i++){
                let sr = sectorMemory.scoutingReservations;
                if (Game.getObjectById(sr[i].actor) == null) {//This reseration's creep is dead;
                    sectorMemory.scoutingQueue.unshift(sr.target); // Returned target to queue
                    sr.splice(i, 1);
                    i--;
                }
            }
        }

        if (sectorMemory.pioneers.length > 0) {
            for (let i = 0; i < sectorMemory.pioneers.length; i++) { // let all pioneers do their work
                if(Game.getObjectById(sectorMemory.pioneers[i]) == undefined){
                    Memory.Gestalt.foundDead = true;
                    sectorMemory.pioneers.splice(i,1);
                } else {
                    Pioneer.run(sectorMemory.pioneers[i]);    
                }
            }    
        }
        
        if (sectorMemory.drills.length > 0) {
            for (let i = 0; i < sectorMemory.drills.length; i++) { // let all pioneers do their work
                if(Game.getObjectById(sectorMemory.drills[i]) == undefined){
                    Memory.Gestalt.foundDead = true;
                    sectorMemory.drills.splice(i,1);
                } else {
                    Drill.run(sectorMemory.drills[i]);    
                }
            }    
        }

        if (sectorMemory.scouts.length > 0) {
            for (let i = 0; i < sectorMemory.scouts.length; i++) { // let all scouts do their work
                let creep = Game.getObjectById(sectorMemory.scouts[i]);
                if(creep == null){
                    Memory.Gestalt.foundDead = true;
                    sectorMemory.scouts.splice(i,1);
                } else {
                    creep.scout(roomID);    
                }
            }    
        }
        
        

        
        /*
            SPAWNING OPERATION AND QUEUEING CODE // REPLACE SPAWNING CODE
        */
        
        let freeSourceSlots = 0;
        for (i = 0; i < sectorMemory.sources.length; i++) {
            if (sectorMemory.sources[i].reserved == false) {
                freeSourceSlots += (sectorMemory.sources[i].slots - sectorMemory.sources[i].reservedSlots);
            }
        } // Add outpost slots
        
        
        if (sectorMemory.recoveryMode == false && sector.energyCapacityAvailable == 550 && sectorMemory.drills.length < sectorMemory.sources.length && sectorMemory.spawnQueueByType['Drill'] == 0 && sectorMemory.spawnQueueByType['Basic Drill'] == 0) {
            sectorMemory.spawnQueue.push('Basic Drill');
            sectorMemory.spawnQueueByType['Basic Drill'] += 1;
        }
        
        if (sectorMemory.recoveryMode == false && sector.energyCapacityAvailable > 550 && sectorMemory.drills.length < sectorMemory.sources.length && sectorMemory.spawnQueueByType['Drill'] == 0 && sectorMemory.spawnQueueByType['Basic Drill'] == 0) {
            sectorMemory.spawnQueue.push('Drill');
            sectorMemory.spawnQueueByType['Drill'] += 1;
        }
        
        
        // WORKERS
        
        // TRANSPORTERS
        
        // SCOUTING SYSTEM IN VER 0.2
        
        if (sectorMemory.spawnQueueByType['Pioneer'] < 0){
            sectorMemory.spawnQueueByType['Pioneer'] = 0;
        }
        
        if (((freeSourceSlots > 1 && sectorMemory.spawnQueue.length == 0)) || (sectorMemory.pioneers.length < 7 && sectorMemory.spawnQueueByType['Pioneer'] == 0 && sector.controller.level <= 3) && sectorMemory.pioneerColony == true) {
            sectorMemory.spawnQueue.push('Pioneer');
            sectorMemory.spawnQueueByType['Pioneer'] += 1;
        }
        
        if (((freeSourceSlots > 1 && sectorMemory.spawnQueue.length == 0)) || (sectorMemory.pioneers.length < 4 && sectorMemory.spawnQueueByType['Pioneer'] == 0) && sectorMemory.pioneerColony == true) {
            sectorMemory.spawnQueue.push('Pioneer');
            sectorMemory.spawnQueueByType['Pioneer'] += 1;
        }

        if (sectorMemory.spawnQueueByType['Upgrader'] == 0 && sectorMemory.upgraders.length == 0 && sectorMemory.upgradeContainer != undefined) {
            sectorMemory.spawnQueue.push('Upgrader');
            sectorMemory.spawnQueueByType['Upgrader'] += 1;
        }
        /*
        if (sectorMemory.spawnQueueByType['Scout'] == 0 && sectorMemory.scouts.length == 0 && sectorMemory.scoutingQueue.length > 0) {
            sectorMemory.spawnQueue.push('Scout');
            sectorMemory.spawnQueueByType['Scout'] += 1;
        }
        */
        
    }


    exports.run = run;
