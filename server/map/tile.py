class Tile:
    
    def __init__(self, entity=None, adjacent=0, is_covered=True):
        self.entity = entity
        self.adjacent = adjacent
        self.is_covered = is_covered