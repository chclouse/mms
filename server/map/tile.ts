import { Entity } from "../ent/entity";

export class Tile {

    public entity  ?: Entity;
    public covered  : boolean;
    public adjacent : number;
    public owner   ?: string;
    public flaggedBy: Set<string>;

    constructor(entity?: Entity, covered: boolean=true, adjacent: number=0, owner?: string,
        flaggedBy=new Set<string>())
    {
        this.entity = entity;
        this.covered = covered;
        this.adjacent = adjacent;
        this.owner = owner;
        this.flaggedBy = flaggedBy;
    }
}
