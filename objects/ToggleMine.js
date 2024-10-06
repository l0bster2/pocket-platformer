class ToggleMine extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.resetObject();
        this.player = tileMapHandler.player;
        this.totalPauseFrames = 12;
    }

    collisionEvent() {
        if (!this.collidedFirstTime) {
            this.collidedFirstTime = true;
        }
        else if (this.deadly) {
            PlayMode.playerDeath();
        }
    }

    resetObject() {
        this.hitBoxOffset = Math.floor(-this.tileSize / 3);
        this.currentPauseFrame = 0;
        this.collidedFirstTime = false;
        this.deadly = false;
    }

    draw() {
        if (this.collidedFirstTime && !Collision.objectsColliding(this.player, this) && !this.currentPauseFrame < this.totalPauseFrames) {
            this.currentPauseFrame++;
        }
        if(this.currentPauseFrame >= this.totalPauseFrames && !this.deadly) {
            this.deadly = true;
            this.hitBoxOffset = Math.floor(-this.tileSize / 6);
        }
        super.drawSingleFrame(spriteCanvas, this.deadly ? this.canvasXSpritePos + this.tileSize : this.canvasXSpritePos);
    }
}