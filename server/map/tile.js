class Tile {
    constructor(entity=null, covered=true, adjacent=0, owner=null, flaggedBy=new Set()) {
        this.entity = entity;
        this.covered = covered;
        this.adjacent = adjacent;
        this.owner = owner;
        this.flaggedBy = flaggedBy;
    }
}

module.exports = {Tile};