class Tile {
    constructor(entity=null, covered=true, adjacent=0, owner=null) {
        this.entity = entity;
        this.covered = covered;
        this.adjacent = adjacent;
        this.owner = owner;
    }
}

module.exports = {Tile};