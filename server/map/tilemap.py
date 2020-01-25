import tile

class TileMap:

    def __init__(self, rows, cols):
        self._rows = rows
        self._cols = cols
        self._map = [[tile.Tile() for i in range(cols)] for j in range(rows)]
    
    def get_tile(self, row, col):
        return self._map[row][col]

    def set_tile(self, row, col, value):
        self._map[row][col] = value
    
    def rows(self):
        return self._rows
    
    def columns(self):
        return self._cols