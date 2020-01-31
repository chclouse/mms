import { Tile } from "./tile";
import { Mine } from "../ent/mine";
import { int as randomInt } from "random";
import { Entity } from "../ent/entity";

type HintedPosition = [number, number, number];

export class TileMap {

    private _map: Tile[][];

    public rows: number;
    public cols: number;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;

        this._map = [];
    }

    getTile(row: number, col: number) {
        return this._map[row][col];
    }

    setTile(row: number, col: number, tile: Tile) {
        this._map[row][col] = tile;
    }

    generateBoard(nMines: number, nPowerups: number) {
        this.createEmptyBoard();
        this.plantMines(nMines);
    }

    createEmptyBoard() {
        for (var i = 0; i < this.rows; i++) {
            this._map.push([]);
            for (var j = 0; j < this.cols; j++) {
                this._map[i].push(new Tile())
            }
        }
    }

    plantMines(nMines: number) {
        var minesLeft = nMines;
        while (minesLeft > 0) {
            var row = randomInt(0, this.rows - 1);
            var col = randomInt(0, this.cols - 1);
            var tile = this.getTile(row, col);
            if (tile.entity instanceof Mine || !tile.covered) {
                continue;
            }
            tile.entity = new Mine();
            this.setTile(row, col, tile);
            this.updateAdjacentCounts(row, col);
            minesLeft--;
        }
    }

    updateAdjacentCounts(row: number, col: number, incBy=1) {
        for (var rowOff = -1; rowOff <= 1; rowOff++) {
            for (var colOff = -1; colOff <= 1; colOff++) {
                if (this.inBounds(row + rowOff, col + colOff)) {
                    var tile = this.getTile(row + rowOff, col + colOff);
                    tile.adjacent += incBy;
                    this.setTile(row + rowOff, col + colOff, tile);
                }
            }
        }
    }

    inBounds(row: number, col: number) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    revealOneTile(playerId: string, row: number, col: number): [number, Entity?] {
        var tile = this.getTile(row, col);
        if (!tile.covered || tile.flaggedBy.has(playerId)) {
            return [-1, undefined];
        }
        tile.owner = playerId;
        tile.covered = false;
        tile.flaggedBy = new Set();
        this.setTile(row, col, tile);
        return [tile.adjacent, tile.entity];
    }

    revealTiles(playerId: string, row: number, col: number, hasGrace: boolean=false):
        [Entity[], HintedPosition[]]
    {
        var entities: Entity[] = [];
        var positions: HintedPosition[] = [];
        var adjacent: number;
        var entity: Entity|null;
        [adjacent, entity] = this.revealOneTile(playerId, row, col);
        if (adjacent < 0) {
            return [[], []];
        }
        if ((entity instanceof Mine || adjacent > 0) && hasGrace) {
            this.removeMinesNear(row, col);
            return this.revealTiles(playerId, row, col);
        }
        if (entity !== undefined) {
            entities.push(entity);
        }
        positions.push([row, col, adjacent]);
        if (adjacent > 0) {
            return [entities, positions];
        }
        for (var rowOff = -1; rowOff <= 1; rowOff++) {
            for (var colOff = -1; colOff <= 1; colOff++) {
                if ((rowOff != 0 || colOff != 0) &&
                    this.inBounds(row + rowOff, col + colOff)) {
                        var newEnt; var newPos;
                        [newEnt, newPos] = this.revealTiles(playerId, row + rowOff, col + colOff);
                        entities = entities.concat(newEnt);
                        positions = positions.concat(newPos);
                }
            }
        }
        return [entities, positions];
    }

    clickTile(playerId: string, row: number, col: number, hasGrace=false) {
        let tile = this.getTile(row, col);
        if (tile.covered) {
            return this.revealTiles(playerId, row, col, hasGrace);
        } else {
            return this.chordTiles(playerId, row, col);
        }
    }

    chordTiles(playerId: string, row: number, col: number): [Entity[], HintedPosition[]] {
        let tile = this.getTile(row, col);
        let adjacentMines = tile.adjacent;
        let adjacentFlags = 0;
        let adjacentUnflagged = [];
        let mine = null;
        let minePosition: HintedPosition;
        for (let rowOff = -1; rowOff <= 1; rowOff++) {
            for (let colOff = -1; colOff <= 1; colOff++) {
                if (this.inBounds(row + rowOff, col + colOff)) {
                    let tile = this.getTile(row + rowOff, col + colOff);
                    if (tile.entity instanceof Mine && !tile.flaggedBy.has(playerId)) {
                        mine = tile.entity;
                        minePosition = [row + rowOff, col + colOff, tile.adjacent];
                    }
                    if (tile.flaggedBy.has(playerId)) {
                        adjacentFlags++;
                    } else {
                        adjacentUnflagged.push([row + rowOff, col + colOff]);
                    }
                }
            }
        }

        let entities: Entity[] = [];
        let positions: HintedPosition[] = [];
        if (adjacentFlags == adjacentMines) {
            if (mine != null) {
                return [[mine], [minePosition]];
            }
            for (let [chordRow, chordCol] of adjacentUnflagged) {
                let [newEnt, newPos] = this.revealTiles(playerId, chordRow, chordCol);
                entities = entities.concat(newEnt);
                positions = positions.concat(newPos);
            }
        }

        return [entities, positions];
    }

    removeMinesNear(row: number, col: number) {
        let tile = this.getTile(row, col);
        tile.covered = true;
        tile.owner = null;
        this.setTile(row, col, tile);
        for (let rowOff = -1; rowOff <= 1; rowOff++) {
            for (let colOff = -1; colOff <= 1; colOff++) {
                if (this.inBounds(row + rowOff, col + colOff)) {
                    this.removeMine(row + rowOff, col + colOff);
                }
            }
        }
    }

    removeMine(row: number, col: number) {
        let mustBeMine = false;
        for (let rowOff = -1; rowOff <= 1; rowOff++) {
            for (let colOff = -1; colOff <= 1; colOff++) {
                if (this.inBounds(row + rowOff, col + colOff)) {
                    let tile = this.getTile(row + rowOff, col + colOff);
                    if (!tile.covered) {
                        mustBeMine = true;
                    }
                }
            }
        }

        let tile = this.getTile(row, col);
        if (!mustBeMine && tile.entity instanceof Mine) {
            tile.entity = null;
            this.setTile(row, col, tile);
            this.updateAdjacentCounts(row, col, -1);
        }
    }

    resetTerritory(playerId: string) {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                var tile = this.getTile(row, col);
                if (tile.owner == playerId) {
                    tile.owner = null;
                    tile.covered = true;
                    tile.flagged = false;
                }
                this.setTile(row, col, tile);
            }
        }
    }

    flagTile(playerId: string, row: number, col: number) {
        var tile = this.getTile(row, col);
        tile.flaggedBy.add(playerId);
        this.setTile(row, col, tile);
    }

    unflagTile(playerId: string, row: number, col: number) {
        var tile = this.getTile(row, col);
        tile.flaggedBy.delete(playerId);
        this.setTile(row, col, tile);
    }
}
