import { Tile } from "./tile";

class TileMap {
    constructor(rows, cols) {
        this._rows = rows;
        this._cols = cols;

        this._map = [];
        for (var i = 0; i < rows; i++) {
            this._map.push([]);
            for (var j = 0; j < cols; j++) {
                this._map[i].push(new Tile())
            }
        }
    }
}