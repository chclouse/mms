import { Tile } from "./tile";

class TileMap {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this._map = [];
        for (var i = 0; i < rows; i++) {
            this._map.push([]);
            for (var j = 0; j < cols; j++) {
                this._map[i].push(new Tile())
            }
        }
    }

    getTile(row, col) {
        return this._map[row][col];
    }

    setTile(row, col, tile) {
        this._map[row][col] = tile;
    }
}