class MovingPlatform extends DefaultMovingPlatform {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, tilemapHandler, extraAttributes);
    }

    draw() {
        super.updateMovement();
    }
}