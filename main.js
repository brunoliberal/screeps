let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');

const MAX_BUILDERS = 3;
const MAX_HARVESTERS = 9;
const MAX_UPGRADERS = 3;

const SOURCE_ARRAY = [0,8,0,1];


module.exports.loop = function () {
    
    let spawn = Game.spawns['Spawn1'];
    
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Harvesters: ' + harvesters.length);
    console.log('Builders: ' + builders.length);
    console.log('Upgraders: ' + upgraders.length);

    freeMemory();
    
    spawnCreeps(harvesters, upgraders, builders);
    


    // var tower = Game.getObjectById('bc0fe1b68b1bdd35a17a2762');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

function freeMemory() {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function spawnCreeps(harvesters, upgraders, builders) {
    let spawn = Game.spawns['Spawn1'];
    
    if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        if(harvesters.length < MAX_HARVESTERS) {
            for(var i=0;i<SOURCE_ARRAY.length;i++) {
                let num_creeps = _.filter(harvesters, (creep) => creep.memory.source == i+1).length;
                console.log('num creeps' + num_creeps);
                if (num_creeps < SOURCE_ARRAY[i]) {
                    var newName = 'Harvester' + Game.time;
                    console.log('Spawning new harvester: ' + newName + ' on source: ' + i+1);
                    spawn.spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'harvester', source: i+1}});
                    break;
                }
            }
        } else if(upgraders.length < MAX_UPGRADERS) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            spawn.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
        } else if(builders.length < MAX_BUILDERS) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            spawn.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'builder'}});
        }
        
        visualSpawning(spawn);
    }
}

function visualSpawning(spawn) {
    if(spawn.spawning) { 
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text('🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1, 
            spawn.pos.y, 
            {align: 'left', opacity: 0.8});
    }
}