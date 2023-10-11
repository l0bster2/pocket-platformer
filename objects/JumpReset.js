class JumpReset extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, -2, extraAttributes);
        this.tileMapHandler = tilemapHandler;
        this.touched = false;
        this.currentResetTimer = 0;
        this.resetAfterFrames = 120;
    }

    resetObject() {
        this.touched = false;
    }

    collisionEvent() {
        if (!this.touched) {
            player.doubleJumpUsed = false;
            player.temporaryDoubleJump = true;
            SoundHandler.jumpReset.stopAndPlay();
            this.touched = true;
        }
    }

    draw(spriteCanvas) {
        if(this.touched) {
            super.drawWithAlpha(spriteCanvas, 0.1)
            this.currentResetTimer++;
            if(this.currentResetTimer === this.resetAfterFrames) {
                this.currentResetTimer = 0; 
                this.touched = false;
            }
        }
        else {
            super.draw(spriteCanvas);
        }
    }
}