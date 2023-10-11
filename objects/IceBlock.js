class IceBlock extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tileMapHandler = tileMapHandler;
        this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = 
        ObjectTypes.SPECIAL_BLOCK_VALUES.iceBlock;
    }   

    collisionEvent() {
    }

    draw(spriteCanvas) {
        super.draw(spriteCanvas);
    }
}