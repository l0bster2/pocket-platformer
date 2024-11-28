class MovingPlatform extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.player = tilemapHandler.player;
        this.key = this.makeid(5);
    }

    collisionEvent() {
        this.player.previouslyTouchedByMovingPlatform = true;
    }

    draw() {
        if(this.player.movingPlatformKey === this.key) {
            this.player.bonusSpeedX = this.xspeed;
            this.player.bonusSpeedY = this.yspeed;

            if(!Collision.objectsColliding(this.player, this)) {
                this.player.movingPlatformKey = null;
                this.player.onMovingPlatform = false;
            }
        }
        super.draw(spriteCanvas);
    }
}