class Tile:
    
    def __init__(self, adjacent=0, entity=None, is_covered=True):
        self.adjacent = adjacent
        self.entity = entity
        self.is_covered = is_covered