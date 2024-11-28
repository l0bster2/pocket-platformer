class MovingPlatform extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.player = tilemapHandler.player;
        this.key = this.makeid(5);
    }

    collisionEvent() {
        this.player.previouslyTouchedByMovingPlatform = true;
    }

    setPlayerMomentumCoyoteFrames() {
        if (this.player.movingPlatformKey === this.key &&
            (this.xspeed !== 0 || this.yspeed < 0)) {
            this.player.currentMomentumCoyoteFrame = 0;
        }
    }

    draw() {
        if (this.player.movingPlatformKey === this.key) {
            this.player.bonusSpeedX = this.xspeed;
            this.player.bonusSpeedY = this.yspeed;

            if (!Collision.objectsColliding(this.player, this)) {
                this.player.movingPlatformKey = null;
                this.player.onMovingPlatform = false;
            }
        }
        super.draw(spriteCanvas);
    }
}