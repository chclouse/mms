class Tile {
    constructor(entity=null, covered=true, adjacent=0, owner=null, flagged=false) {
        this.entity = entity;
        this.covered = covered;
        this.adjacent = adjacent;
        this.owner = owner;
        this.flagged = flagged;
    }
}

module.exports = {Tile};