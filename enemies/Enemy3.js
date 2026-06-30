class Enemy3 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        // Flying enemy: hovers, moves horizontally and turns around when it hits a wall.
        this.flying = true;
        this.falling = false;
        this.walkDirection = this.walkDirections.left;
        this.movementBehaviour = this.movementBehaviours.startMovingLeft;
        this.wallBehaviour = this.wallBehaviours.changeDirection;
        this.canBeStomped = true;
    }

    draw(spriteCanvas) {
        super.draw(spriteCanvas);
        if (Game.playMode === Game.PLAY_MODE) {
            this.isActive && super.walkHandler();
            super.fallHandler();
            super.correctMaxYSpeed();
            CharacterCollision.checkFloorAndTileCollision(this, false);
        }
    }
}
