class Treadmill extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tileMapHandler = tileMapHandler;
        this.changeDirection();
    }   

    changeDirection() {
        this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = 
        this?.currentFacingDirection === AnimationHelper.facingDirections.left ?
        ObjectTypes.SPECIAL_BLOCK_VALUES.treadmillLeft :
        ObjectTypes.SPECIAL_BLOCK_VALUES.treadmillRight;  
    }

    collisionEvent() {
    }

    addChangeableAttribute(attribute, value, levelToChange = null) {
        super.addChangeableAttribute(attribute, value, levelToChange);
        this.changeDirection();
    }

    draw(spriteCanvas) {
        super.draw(spriteCanvas);
    }
}