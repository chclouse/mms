Tile = require('./tile.js').Tile;
Mine = require('../ent/mine.js').Mine;
random = require('random');

class TileMap {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this._map = [];
    }

    getTile(row, col) {
        return this._map[row][col];
    }

    setTile(row, col, tile) {
        this._map[row][col] = tile;
    }

    generateBoard(nMines, nPowerups) {
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

    plantMines(nMines) {
        var minesLeft = nMines;
        while (minesLeft > 0) {
            var row = random.int(0, this.rows - 1);
            var col = random.int(0, this.cols - 1);
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

    updateAdjacentCounts(row, col, incBy=1) {
        for (var rowOff = -1; rowOff <= 1; rowOff++) {
            for (var colOff = -1; colOff <= 1; colOff++) {
                if (!(rowOff === 0 && colOff === 0) &&
                        this.inBounds(row + rowOff, col + colOff)) {
                    var tile = this.getTile(row + rowOff, col + colOff);
                    tile.adjacent += incBy;
                    this.setTile(row + rowOff, col + colOff, tile);
                }
            }
        }
    }

    inBounds(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    revealOneTile(playerId, row, col) {
        var tile = this.getTile(row, col);
        if (!tile.covered) {
            return [-1, null];
        }
        tile.owner = playerId;
        tile.covered = false;
        this.setTile(row, col, tile);
        return [tile.adjacent, tile.entity];
    }

    revealTiles(playerId, row, col) {
        var entities = [];
        var positions = [];
        var adjacent; var entity;
        [adjacent, entity] = this.revealOneTile(playerId, row, col);
        if (adjacent < 0) {
            return [[], []];
        }
        if (entity !== null) {
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

    resetTerritory(playerId) {
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
}

module.exports = { TileMap }