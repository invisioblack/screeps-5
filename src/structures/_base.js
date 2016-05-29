// Because structures have an inheritance chain (Gparent > parent > child),
// it is difficult to due proper class extensions.

/* @flow */
import { Structure } from 'screeps-globals';

const TEN_MILLION = 10000000;

Object.assign(Structure.prototype, {
  work() {
    if (this.performRole) {
      this.performRole();
    }
    if (Game.time % 100 === 0) {
      this.buildAccessRoads();
    }
  },

  isControllerLink() {
    return this.structureType === STRUCTURE_LINK && this.pos.getRangeTo(this.room.controller) < 5;
  },

  isFull() {
    if (this.energyCapacity) {
      return this.energy === this.energyCapacity;
    } else if (this.storeCapacity) {
      return this.store === this.storeCapacity;
    }
    return true;
  },

  needsRepaired() {
    return this.hits / this.hitsMax < 0.9 && this.hits < TEN_MILLION;
  },

  isEmpty() {
    if (this.energyCapacity) {
      return this.energy === 0;
    } else if (this.storeCapacity) {
      return this.store === 0;
    }

    return true;
  },

  isSourceTower() {
    const sourcesNearby = this.room.getSources().filter(source => {
      return source.pos.getRangeTo(this) <= 2;
    });

    return this.structureType === STRUCTURE_TOWER && sourcesNearby.length > 0;
  },

  buildAccessRoads() {
    const top = new RoomPosition(this.pos.x, this.pos.y - 1, this.room.name);
    const left = new RoomPosition(this.pos.x - 1, this.pos.y, this.room.name);
    const right = new RoomPosition(this.pos.x + 1, this.pos.y, this.room.name);
    const bottom = new RoomPosition(this.pos.x, this.pos.y + 1, this.room.name);
    const positions = [top, left, right, bottom];
    positions.forEach(position => {
      const terrain = position.lookFor('terrain');
      if (terrain === 'swamp' && position.isOpen() && !position.hasRoad()) {
        this.room.createConstructionSite(position.x, position.y, STRUCTURE_ROAD);
      }
    });
  },
});