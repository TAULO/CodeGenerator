/* @flow */

// get flow to recognize the existing "_" as lodash
import typeof * as Lodash from "lodash";
declare var _ : Lodash;

import type { Tick, FooMemory, PlannerMemory,
              PlanningRoomData, PlanningEnergyDistribution, PlanningRoomDistribution,
              PlanningSourceDistribution, PlanningSourceData,
              PathMap, PathData,
              Task, TaskType, TaskId, TaskHolder, TaskState, TaskPrio,
              SourceTarget, EnergyTarget,
              ProvisionTask,
              EnergyTargetSpawn, EnergyTargetTower, EnergyTargetRepairable,
              EnergyTargetController, EnergyTargetConstruction } from "../types/FooTypes.js";

import { error, warn, info, debug } from "./monitoring";

import { TaskTypes, TaskPriorities, SourceTargets, EnergyTargetTypes, TaskStates } from "./consts";

// Utils
import * as Tasks from "./tasks";

// Game
import * as _unused from "./kernel";
type KernelType = typeof _unused;
import * as Rooms from "./rooms";
import * as BodyShop from "./bodyshop";
import * as Architect from "./architect";

type PathForSource = {
    id: SourceId,
    length: number
};

export let memory: PlannerMemory;

const DEFENCE_SCORES : {[type: string]: number} = {
    attack: 100,
    ranged_attack: 100,
    claim: 70,
    work: 50,
    heal: 10,
    move: 0,
    carry: 0,
    tough: 0
};

export function init(game: GameI, mem: FooMemory): void {
    memory = mem.planner;
};

export function convertSourceDataToDistribution(s: PlanningSourceData): PlanningSourceDistribution {
    return {
        id: s.id,
        totalCapacity: s.capacity,
        totalUse: 0,
        minerAssigned: null
    };
};

export function initializeDistributionFromData(data: PlanningRoomData): PlanningRoomDistribution {
    const sources : {[sourceId: SourceId]: PlanningSourceDistribution} =
        _.mapValues(data.sources, convertSourceDataToDistribution);

    const initialDistribution : PlanningRoomDistribution = {
        id: data.name,
        sources,
        any: 0
    };
    return initialDistribution;
}

export function getDistributionForRoom(roomName: RoomName, distribution: PlanningEnergyDistribution, data: PlanningRoomData): PlanningRoomDistribution {
    let roomDistribution : ?PlanningRoomDistribution = distribution.rooms[roomName];

    if (roomDistribution) {
        return roomDistribution;
    }

    const initialDistribution : PlanningRoomDistribution = initializeDistributionFromData(data);
    distribution.rooms[roomName] = initialDistribution; //FIXME write to memory? => should be mutable for now

    return initialDistribution;
}

export function determineSource(room: Room,
                                data: PlanningRoomData,
                                distribution: PlanningEnergyDistribution,
                                amount: EnergyUnit,
                                prio: TaskPrio,
                                taskType: TaskType): SourceTarget {

    const roomDistribution : PlanningRoomDistribution = getDistributionForRoom(room.name, distribution, data);

    const maxCarry : ?number = BodyShop.calculateMaximumCarry(taskType, room.energyCapacityAvailable);
    const maxNeed : number = maxCarry ? Math.min(maxCarry, amount) :  amount;
    const sources : PlanningSourceDistribution[] = _.values(roomDistribution.sources);

    const possibleSources : PlanningSourceDistribution[] =
        _.filter(sources, (s: PlanningSourceDistribution): boolean => {
        const availableEnergy : EnergyUnit = s.totalCapacity - s.totalUse;
            return availableEnergy >= maxNeed;
    });
    const sortedSources : PlanningSourceDistribution[] =
        _.sortBy(possibleSources, (s: PlanningSourceDistribution): EnergyUnit => {
            const pathToSource : ?PathData = data.paths.base[s.id];
            const pathLength : number = pathToSource ? pathToSource.length : 1000; //(1 - 1000)
            const capacityLeft : number = s.totalCapacity - s.totalUse; //(0 - 3000)
            const sourceValue : number = capacityLeft / pathLength;
            return sourceValue;
        });

    if (_.isEmpty(sortedSources)) {
        //FIXME make this saner
        warn(`[planner] [${room.name}] no underutilized source found for task`);
        return {
            type: SourceTargets.ANY,
            room: room.name,
            energyNeed: maxNeed
        };
    }

    let sourceId : SourceId;
    if (prio >= TaskPriorities.UPKEEP) {
        sourceId = _.last(sortedSources).id;
        debug("picking near for: " + prio + " " + taskType);
    } else if (prio <= TaskPriorities.IDLE) {
        sourceId = _.head(sortedSources).id;
        debug("picking far for: " + prio + " " + taskType);
    } else {
        sourceId = _.sample(sortedSources).id;
        debug("random source: " + sourceId);
    }

    //FIXME write to memory? => should be mutable for now
    const sourceDistribution : ?PlanningSourceDistribution = roomDistribution.sources[sourceId];
    if (!sourceDistribution) {
        error(`[planner] [${room.name}] source plan not found for ${sourceId}`);
    } else {
        sourceDistribution.totalUse += maxNeed;
    }
    distribution.rooms[room.name] = roomDistribution;

    return {
        type: SourceTargets.FIXED,
        room: room.name,
        id: sourceId,
        energyNeed: maxNeed
    };
};

export function removeEnergyNeed(source: SourceTarget): void {
    const distribution : PlanningEnergyDistribution = getCurrentEnergyDistribution();
    let roomDistribution : ?PlanningRoomDistribution = distribution.rooms[source.room];
    if (!roomDistribution || source.type === SourceTargets.ANY) {
        return;
    }

    const sourceDistribution : ?PlanningSourceDistribution = roomDistribution.sources[source.id];
    if (!sourceDistribution) {
        return;
    }

    sourceDistribution.totalUse = sourceDistribution.totalUse - source.energyNeed;
}

export function  constructTargetSpawn(roomName: RoomName, spawn: Spawn): EnergyTargetSpawn {
    return {
        room: roomName,
        type: EnergyTargetTypes.SPAWN,
        name: spawn.name,
        targetId: spawn.id,
        energyNeed: spawn.energyCapacity - spawn.energy
    };
};

export function findRefillSpawnTarget(room: Room, extensions: Extension[]): ?EnergyTarget {
    const spawns : Spawn[] = Rooms.getSpawns(room);
    if (!spawns) {
        warn("[planner] [" + room.name + "] has no spawn");
        return null;
    }

    // use first non-full spawn
    const emptySpawns : Spawn[] = _.filter(spawns, (spawn: Spawn) => {
        return spawn.energy < spawn.energyCapacity * 0.5;
    });
    const spawn : ?Spawn = emptySpawns[0];

    let target : ?EnergyTarget;
    if (spawn) {
        target = constructTargetSpawn(room.name, spawn);
    } else {
        const extensionsSorted : Extension[] = _.sortBy(extensions, (e: Extension) => e.energy);
        const extension : ?Extension = _.head(extensionsSorted);
        if (extension && extension.energy < extension.energyCapacity) {
            const capacity : number = EXTENSION_ENERGY_CAPACITY[room.controller.level];
            const extensionTarget : EnergyTargetSpawn = {
                room: room.name,
                type: EnergyTargetTypes.SPAWN,
                name: extension.id,
                targetId: extension.id,
                energyNeed: capacity
            }
            target = extensionTarget;
        }
    }
    if (!target) {
        const anySpawn : Spawn = spawns[0];
        if (anySpawn && anySpawn.energy < anySpawn.energyCapacity) {
            target = constructTargetSpawn(room.name, anySpawn);
        }
    }
    return target;
}

export function bootup(Kernel: KernelType, room: Room, Game: GameI, bootup: boolean): void {
    if (!bootup) {
        debug("[planner] [" + room.name + "] normal mode - skip bootup");
        return;
    }
    warn("[planner] [" + room.name + "] bootup mode active");

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.PROVISION &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING);
    });

    const extensions : Extension[] = Rooms.getExtensions(room);
    if (openTaskCount > (_.size(extensions) / 2) ) {
        debug("[planner] [" + room.name + "] [bootup] has too many pending jobs");
        return;
    }

    const target : ?EnergyTarget = findRefillSpawnTarget(room, extensions);
    if (!target) {
        debug(`[planner] [bootup] all spawns and extensions full`);
        return;
    }

    let prio : TaskPrio = TaskPriorities.UPKEEP;
    const topup : boolean = target.energyNeed < SPAWN_ENERGY_CAPACITY /2;
    if (target.type === EnergyTargetTypes.SPAWN && topup) {
            prio = TaskPriorities.UPGRADE;
    }

    // construct a task to harvest some energy from anywhere and fill a spawn

    const source : SourceTarget = {
        type: SourceTargets.ANY,
        room: room.name,
        energyNeed: target.energyNeed
    }

    const runningTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.PROVISION &&
               state === TaskStates.RUNNING;
    });

    prio = runningTaskCount === 0 ? TaskPriorities.URGENT : prio;
    const harvest: Task = Tasks.constructProvisioning(Game.time, prio, source, target);

    Kernel.addTask(harvest);
}

export function fire(room: Room): void {
    const hostiles : Creep[] = Rooms.getHostiles(room);
    const towers : Tower[] = Rooms.getTowers(room);

    if (_.isEmpty(hostiles) || _.isEmpty(towers)) {
        debug(`[planner] [fire] [${room.name}] no towers or no hostiles`);
        return;
    }

    const sortedTargets : Creep[] = _.sortBy(hostiles, (c: Creep): number => {
        const targetScore : number = _.reduce(c.body, (r: number, b: BodyPartDefinition): number => {
            const partType : BODYPART_TYPE = b.type;
            return r + DEFENCE_SCORES[partType];
        }, 0);
        console.log(targetScore);
        return targetScore;
    });

    for (let tower of towers) {
        const target : Creep = _.head(sortedTargets);
        if (tower.energy === 0) {
            console.log("NO ENERGY");
        }
        tower.attack(target);
    }
}

export function calculateSpawnTime(s: PlanningSourceDistribution, paths: {[id: SourceId]: PathForSource}): Tick {
    const respawnTime : Tick = s.minerAssigned ? (s.minerAssigned + CREEP_LIFE_TIME) : 0;
    const path : ?PathForSource = paths[s.id];
    const pathLength : number = path ? path.length : 100;
    const spawnTime : Tick = respawnTime - 2 * pathLength;
    return spawnTime;
}

export function mineSources(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution): void {

    const miniscule : boolean = room.energyCapacityAvailable < 300;
    const creeps : CreepMap = Game.creeps; // FIXME make this room specific
    const empty : boolean = _.size(creeps) < 4;
    if ( miniscule || empty ) {
        debug(`[planner][${room.name}] too small for miners`);
        return;
    }
    /* const deprived : boolean = room.energyAvailable < 450;*/
    /* const hasHaulers : boolean;*/

    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.MINE &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING);
    });

    const roomDistribution : PlanningRoomDistribution = getDistributionForRoom(room.name, distribution, data);

    const paths : {[id: SourceId]: PathForSource} = _.indexBy(_.map(roomDistribution.sources, (s: PlanningSourceDistribution): PathForSource  => {
        const path : ?PathData = data.paths.base[s.id];
        return {id: s.id, length: (path && path.length) || 100};
    }), (p: PathForSource) => p.id);

    const unmined : PlanningSourceDistribution[] =
        _.filter(roomDistribution.sources, (s: PlanningSourceDistribution): boolean => {
            const spawnTime : Tick = calculateSpawnTime(s, paths);
            return Game.time > spawnTime;
        });

    if (_.isEmpty(unmined)) {
        debug(`[planner] [${room.name}] all sources have a miner assigned`);
        return;
    }

    const sourcesByDistance : PlanningSourceDistribution[] = _.sortBy(unmined, );

    const sourceDistribution : ?PlanningSourceDistribution = _.head(sourcesByDistance);
    if (!sourceDistribution) {
        error(`[planner] [${room.name}] no source distribution found`);
        return;
    }
    const sourceId : SourceId = sourceDistribution.id;
    const source : SourceTarget = {
        type: SourceTargets.FIXED,
        id: sourceId,
        room: room.name,
        energyNeed: 0
    }
    const path : ?PathForSource = paths[sourceId];
    const pathLength : number = path ? path.length : 100;

    const prio : TaskPrio = TaskPriorities.UPKEEP + 500 - pathLength; // bump mining above other upkeep
    const spawnTime : Tick = calculateSpawnTime(sourceDistribution, paths);

    info(`[planner] [mine] adding ${sourceId}`);

    //FIXME container/link mine (1C) if enough energy
    const mine : Task = Tasks.constructMine(Game.time, prio, spawnTime, source, room.name);

    Kernel.addTask(mine);
    sourceDistribution.minerAssigned = Game.time;
}

export function isBootupMode(room: Room, Game: GameI): boolean {
    const creeps: CreepMap = Game.creeps; // FIXME make this room specific
    // min workers for a starting room
    const BOOTUP_THRESHOLD : number = 3;
    const roomDied : boolean = _.size(creeps) <= BOOTUP_THRESHOLD;
    const miniscule : boolean = room.energyCapacityAvailable < 550;

    const bootup: boolean = roomDied || miniscule;

    if ( bootup ) {
        warn(`[planner] [${room.name}] still in bootup - died: ${(roomDied: any)} miniscule: ${(miniscule: any)}`);
    } else {
        warn(`[planner] [${room.name}] normal operation`);
    }

    return bootup;
}

export function refillSpawn(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution, bootup: boolean): void {

    if (bootup) {
        return;
    }

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.PROVISION &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING);
    });

    const extensions : Extension[] = Rooms.getExtensions(room);
    if (openTaskCount > Math.ceil(1 + _.size(extensions) / 5)) {
        debug("[planner] [" + room.name + "] [refill] has enough pending refill jobs");
        return;
    }

    const target : ?EnergyTarget = findRefillSpawnTarget(room, extensions);
    if (!target) {
        debug(`[planner] [refill] all spawns and extensions full`);
        return;
    }

    let prio : TaskPrio = TaskPriorities.UPKEEP;

    const source : SourceTarget = determineSource(room, data, distribution, target.energyNeed, prio, TaskTypes.UPGRADE);

    const runningTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.PROVISION &&
               state === TaskStates.RUNNING;
    });

    prio = runningTaskCount === 0 ? TaskPriorities.URGENT : prio;
    if (runningTaskCount === 0) {
        warn(`[planner] [${room.name}] [refill] no provisioning found, adding URGENT task`);
    }
    const harvest: Task = Tasks.constructProvisioning(Game.time, prio, source, target);

    Kernel.addTask(harvest);
}

export function refillTower(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution, bootup: boolean): void {

    if (bootup) {
        return;
    }

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        const task : Task = holder.task;
        const isProvision : boolean = task.type === TaskTypes.PROVISION;
        if (!isProvision) {
            return false;
        }
        const provisionTask : ProvisionTask = (task: any);
        return provisionTask.target.type === EnergyTargetTypes.TOWER &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING);
    });

    const towers : Tower[] = Rooms.getTowers(room);
    if (openTaskCount >= _.size(towers)) {
        debug("[planner] [" + room.name + "] [refill] has enough pending refill jobs");
        return;
    }

    const sortedTowers : Tower[] = _.sortBy(towers, (t: Tower): number => t.energy);
    const tower : ?Tower = _.head(sortedTowers);
    if (!tower) {
        debug(`[planner] [tower] no tower found`);
        return;
    }
    const energyNeed = tower.energyCapacity - tower.energy;

    if (energyNeed === 0) {
        debug(`[planner] [tower] all towers full`);
        return;
    }

    const target : EnergyTargetTower = {
        room: room.name,
        type: EnergyTargetTypes.TOWER,
        targetId: tower.id,
        energyNeed
    }

    let prio : TaskPrio = TaskPriorities.UPKEEP;

    const source : SourceTarget = determineSource(room, data, distribution, target.energyNeed, prio, TaskTypes.UPGRADE);

    const runningTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.PROVISION &&
               state === TaskStates.RUNNING;
    });

    prio = (runningTaskCount === 0 || energyNeed > tower.energyCapacity / 2) ? TaskPriorities.URGENT : prio;
    if (runningTaskCount === 0) {
        warn(`[planner] [${room.name}] [refill] no provisioning found, adding URGENT task`);
    }
    const provision : Task = Tasks.constructProvisioning(Game.time, prio, source, target);

    Kernel.addTask(provision);
}

export function repair(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution, bootup: boolean): void {

    if (bootup) {
        return;
    }

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        const task : Task = holder.task;
        const isRepair : boolean = task.type === TaskTypes.REPAIR;
        if (!isRepair) {
            return false;
        }
        return (state === TaskStates.WAITING || state === TaskStates.RUNNING);
    });

    const repairables : Structure[] = Rooms.getRepairables(room);
    if (openTaskCount >= _.size(repairables)) {
        debug(`[planner] [${room.name}] [repair] has enough pending repair jobs`);
        return;
    }

    const sortedRepairables : Structure[] = _.sortBy(repairables, (t: Structure): number => (t.hitsMax - t.hits) / t.hitsMax);
    const repairable : ?Structure = _.head(sortedRepairables);
    if (!repairable) {
        debug(`[planner] [${room.name}] [repair] no repairables found`);
        return;
    }
    const energyNeed = repairable.hitsMax - repairable.hits;

    if (energyNeed === 0) {
        warn(`[planner] [${room.name}] [repair] repairable already fixed?`);
        return;
    }

    const target : EnergyTargetRepairable = {
        room: room.name,
        type: EnergyTargetTypes.REPAIRABLE,
        targetId: repairable.id,
        energyNeed
    }

    let prio : TaskPrio = TaskPriorities.UPKEEP;

    const source : SourceTarget = determineSource(room, data, distribution, target.energyNeed, prio, TaskTypes.UPGRADE);
    const repair : Task = Tasks.constructRepair(Game.time, prio, source, target);

    Kernel.addTask(repair);
}

export function generateLocalPriorityTasks(Kernel: KernelType, room: Room, Game: GameI): void {

    if (!room.controller.my) {
        return;
    }

    warn(`[planner] generating priority tasks for ${room.name}`)

    const data : PlanningRoomData = getRoomData(room);
    const distribution : PlanningEnergyDistribution = getCurrentEnergyDistribution();

    const bootupMode : boolean = isBootupMode(room, Game);

    // === SURVIVAL ===
    // -> no spawn -> rebuild or abandon
    // -> low energy -> organize some energy
    bootup(Kernel, room, Game, bootupMode);
    // -> defence -> fill turret, repair, build defender, all repair
    // -> turret action
    fire(room);

    // === UPKEEP ===
    // construct tasks
    // - mine source
    mineSources(Kernel, room, data, distribution);
    // - refill spawn
    // - refill extension
    refillSpawn(Kernel, room, data, distribution, bootupMode);
    // - refill tower
    refillTower(Kernel, room, data, distribution, bootupMode);
    // - refill storage
    // - refill container
    repair(Kernel, room, data, distribution, bootupMode);
}

export function upgradeController(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution): void {

    // FIXME check better if we have too many updates waiting
    const openTaskCount : number = Kernel.getLocalCountForState(room.name, TaskStates.WAITING);
    if (openTaskCount > 3) {
        debug(`[planner] [${room.name}] is busy, not adding upgrade`);
        return;
    }

    const controller : Controller = room.controller;
    const controllerDowngrading : boolean = controller.ticksToDowngrade < 1000;
    const controllerHigh : boolean = controller.progressTotal - controller.progress < 1000;
    const prio : TaskPrio = (controllerDowngrading || controllerHigh) ? TaskPriorities.URGENT : TaskPriorities.IDLE;
    const energy: EnergyUnit = controller.progressTotal - controller.progress; //FIXME
    const source : SourceTarget = determineSource(room, data, distribution, energy, prio, TaskTypes.UPGRADE);

    const target : EnergyTargetController = {
        type: EnergyTargetTypes.CONTROLLER,
        room: room.name,
        targetId: controller.id,
        energyNeed: energy
    }
    const upgradeController: Task = Tasks.constructUpgrade(Game.time, prio, source, target);

    Kernel.addTask(upgradeController);
}

export function buildExtension(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution): void {

    const constructionSites : ConstructionSite[] = Rooms.getConstructionSites(room);
    const extensions : ConstructionSite[] = _.filter(constructionSites, (s: ConstructionSite) => s.structureType === STRUCTURE_EXTENSION);
    if (_.isEmpty(extensions)) {
        debug("[planner] [building] no extensions found")
        return;
    }
    const sortedExtensions = _.sortBy(extensions, (c: ConstructionSite) => c.progressTotal - c.progress);
    const extension : ConstructionSite = _.head(sortedExtensions);

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.BUILD &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING) ;
    });

    if (openTaskCount > 10 || openTaskCount > _.size(constructionSites) * 3) {
        debug("[planner] [" + room.name + "] [improve] too many pending jobs " + openTaskCount);
        return;
    }

    const prioTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.BUILD &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING) &&
               holder.task.prio === TaskPriorities.UPGRADE;
    });

    const prio : TaskPrio = prioTaskCount > 5 ? TaskPriorities.IDLE : TaskPriorities.UPGRADE;
    const energyNeed : EnergyUnit = extension.progressTotal - extension.progress;
    const source : SourceTarget = determineSource(room, data, distribution, energyNeed, prio, TaskTypes.BUILD);

    const site : EnergyTargetConstruction = {
        room: room.name,
        type: EnergyTargetTypes.CONSTRUCTION,
        targetId: extension.id,
        energyNeed
    }

    const buildTask : Task = Tasks.constructBuild(Game.time, prio, source, site);
    Kernel.addTask(buildTask)
}

export function buildTower(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution): void {
    const constructionSites : ConstructionSite[] = Rooms.getConstructionSites(room);
    const towers : ConstructionSite[] = _.filter(constructionSites, (s: ConstructionSite) => s.structureType === STRUCTURE_TOWER);
    if (_.isEmpty(towers)) {
        debug("[planner] [building] no towers found")
        return;
    }
    const tower : ConstructionSite = _.head(towers);

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.BUILD &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING) ;
    });

    if (openTaskCount > 10 || openTaskCount > _.size(constructionSites) * 3) {
        debug("[planner] [" + room.name + "] [improve] too many pending jobs " + openTaskCount);
        return;
    }

    const prio : TaskPrio = TaskPriorities.UPGRADE;
    const energyNeed : EnergyUnit = tower.progressTotal - tower.progress;
    const source : SourceTarget = determineSource(room, data, distribution, energyNeed, prio, TaskTypes.BUILD);

    const site : EnergyTargetConstruction = {
        room: room.name,
        type: EnergyTargetTypes.CONSTRUCTION,
        targetId: tower.id,
        energyNeed
    }

    const buildTask : Task = Tasks.constructBuild(Game.time, prio, source, site);
    Kernel.addTask(buildTask)
}

export function buildStorage(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution): void {
    const constructionSites : ConstructionSite[] = Rooms.getConstructionSites(room);
    const storages : ConstructionSite[] = _.filter(constructionSites, (s: ConstructionSite) => s.structureType === STRUCTURE_STORAGE);
    if (_.isEmpty(storages)) {
        debug("[planner] [building] no storages found")
        return;
    }
    const storage : ConstructionSite = _.head(storages);

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.BUILD &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING) ;
    });

    if (openTaskCount > 10 || openTaskCount > _.size(constructionSites) * 3) {
        debug("[planner] [" + room.name + "] [improve] too many pending jobs " + openTaskCount);
        return;
    }

    const prio : TaskPrio = TaskPriorities.UPKEEP;
    const energyNeed : EnergyUnit = storage.progressTotal - storage.progress;
    const source : SourceTarget = determineSource(room, data, distribution, energyNeed, prio, TaskTypes.BUILD);

    const site : EnergyTargetConstruction = {
        room: room.name,
        type: EnergyTargetTypes.CONSTRUCTION,
        targetId: storage.id,
        energyNeed
    }

    const buildTask : Task = Tasks.constructBuild(Game.time, prio, source, site);
    Kernel.addTask(buildTask)
}

export function buildContainer(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution): void {
    const constructionSites : ConstructionSite[] = Rooms.getConstructionSites(room);
    const containers : ConstructionSite[] = _.filter(constructionSites, (s: ConstructionSite) => s.structureType === STRUCTURE_CONTAINER);
    if (_.isEmpty(containers)) {
        debug("[planner] [building] no containers found")
        return;
    }
    const container : ConstructionSite = _.head(containers);

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.BUILD &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING) ;
    });

    if (openTaskCount > 10 || openTaskCount > _.size(constructionSites) * 3) {
        debug("[planner] [" + room.name + "] [improve] too many pending jobs " + openTaskCount);
        return;
    }

    const prio : TaskPrio = TaskPriorities.UPGRADE;
    const energyNeed : EnergyUnit = container.progressTotal - container.progress;
    const source : SourceTarget = determineSource(room, data, distribution, energyNeed, prio, TaskTypes.BUILD);

    const site : EnergyTargetConstruction = {
        room: room.name,
        type: EnergyTargetTypes.CONSTRUCTION,
        targetId: container.id,
        energyNeed
    }

    const buildTask : Task = Tasks.constructBuild(Game.time, prio, source, site);
    Kernel.addTask(buildTask)
}

export function getRoomData(room: Room): PlanningRoomData {
    // reduce by creep cost (measure?)
    const sources : Source[] = Rooms.getSources(room);
    const energyPotential : number = _.sum(sources, (s: Source) => s.energyCapacity);
    const base : RoomPosition = Rooms.getBase(room);
    const sourcesById : {[id: SourceId]: Source} = _.indexBy(sources, (s: Source) => s.id);
    const paths : PathMap = _.mapValues(sourcesById, (s: Source): PathData => {
        return {length: Rooms.calculatePathLength(room, base, s.pos)};
    });
    const sourceEntriesById: {[id: SourceId]: PlanningSourceData} =
        _.mapValues(sourcesById, (s: Source): PlanningSourceData => {
        return {id: s.id, capacity: s.energyCapacity};
    })

    return {
        name: room.name,
        energyPotential,
        paths: {
            base: paths
        },
        sources: sourceEntriesById
    };
}

export function getCurrentEnergyDistribution(): PlanningEnergyDistribution {
    //FIXME recalculate/recover from memory wipe?
    return memory.energyDistribution;
}

export function buildRoads(Kernel: KernelType, room: Room, data: PlanningRoomData, distribution: PlanningEnergyDistribution): void {

    const constructionSites : ConstructionSite[] = Rooms.getConstructionSites(room);
    const roads : ConstructionSite[] = _.filter(constructionSites, (s: ConstructionSite) => s.structureType === STRUCTURE_ROAD);
    if (_.isEmpty(roads)) {
        debug("[planner] [building] no roads found")
        return;
    }

    const base : RoomPosition = Rooms.getBase(room);
    const sortedRoads = _.sortBy(roads, (c: ConstructionSite) => {
        const p : number = 100 - (c.progress / c.progressTotal * 100);
        const r : number = c.pos.getRangeTo(base.x, base.y);
        return p + r;
    });
    const road : ConstructionSite = _.head(sortedRoads);

    // FIXME check better
    const openTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.BUILD &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING) ;
    });

    if (openTaskCount > 10 || openTaskCount > _.size(constructionSites) / 10) {
        debug("[planner] [" + room.name + "] [improve] too many pending jobs " + openTaskCount);
        return;
    }

    const prioTaskCount : number = Kernel.getLocalCount(room.name, (holder: TaskHolder) => {
        const state : TaskState = holder.meta.state;
        return holder.task.type === TaskTypes.BUILD &&
               (state === TaskStates.WAITING || state === TaskStates.RUNNING) &&
               holder.task.prio === TaskPriorities.UPGRADE;
    });

    const prio : TaskPrio = prioTaskCount > 5 ? TaskPriorities.IDLE : TaskPriorities.UPGRADE;
    const energyNeed : EnergyUnit = road.progressTotal - road.progress;
    const source : SourceTarget = determineSource(room, data, distribution, energyNeed, prio, TaskTypes.BUILD);

    const site : EnergyTargetConstruction = {
        room: room.name,
        type: EnergyTargetTypes.CONSTRUCTION,
        targetId: road.id,
        energyNeed
    }

    const buildTask : Task = Tasks.constructBuild(Game.time, prio, source, site);
    Kernel.addTask(buildTask)
}


export function generateLocalImprovementTasks(Kernel: KernelType, room: Room, Game: GameI): void {

    if (!room.controller.my) {
        return;
    }

    warn(`[planner] [${room.name}] generating improvement tasks`)

    // refactor into checking expenditure first, then constructing jobs

    const data : PlanningRoomData = getRoomData(room);
    const distribution : PlanningEnergyDistribution = getCurrentEnergyDistribution();

    const bootupMode : boolean = isBootupMode(room, Game);

    // - construction sites
    Architect.constructBase(room, data, bootupMode);

    // - build extension
    buildExtension(Kernel, room, data, distribution);
    // - build container
    buildContainer(Kernel, room, data, distribution);
    // - build tower
    buildTower(Kernel, room, data, distribution);
    // - build storage
    buildStorage(Kernel, room, data, distribution);
    // - build some road
    buildRoads(Kernel, room, data, distribution);
    // - build some wall
    // - upgrade controller
    upgradeController(Kernel, room, data, distribution);
    // - mine long distance
    // - claim room
    // - assist room
    // - ???
}

export function taskEnded(Kernel: KernelType, taskId: TaskId): void {
    const task : ?Task = Kernel.getTaskById(taskId);
    if (!task) {
        return;
    }
    switch (task.type) {
        case TaskTypes.BUILD:
        case TaskTypes.PROVISION:
        case TaskTypes.UPGRADE:
            removeEnergyNeed(task.source);
    }
}
