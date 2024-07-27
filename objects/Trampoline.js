class Trampoline extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.player = tilemapHandler.player;
        this.tilemapHandler = tilemapHandler;
        this.unfoldedAnimationDuration = 5 * AnimationHelper.walkingFrameDuration;
        this.currentAnimationFrame = this.unfoldedAnimationDuration;
    }

    collisionEvent() {
        this.player.previouslyTouchedTrampolines = true;
        if (this.player.yspeed > 0 
            && this.player.bottom_left_pos.y < this.y + (this.tileSize / 2)) {
            this.tilemapHandler.levelObjects.forEach(levelObject => {
                if (levelObject.type === ObjectTypes.TRAMPOLINE) {
                    levelObject.currentAnimationFrame = this.unfoldedAnimationDuration;
                }
            });
            AnimationHelper.setSquishValues(this, this.tileSize * 0.8,
                this.tileSize * 1.2, 7);
            this.player.setStretchAnimation();
            this.player.forcedJumpSpeed = Math.abs(this.player.jumpSpeed + (this.player.jumpSpeed / 3.75));
            this.player.jumpframes = 0;
            this.player.fixedSpeed = false;
            this.player.temporaryDoubleJump = false;
            this.player.doubleJumpUsed = false;
            this.player.currentDashFrame = 0;
            this.currentAnimationFrame = 0;
            SoundHandler.longJump.stopAndPlay();
        }
    }

    draw(spriteCanvas) {
        this.currentAnimationFrame++;
        if (this.currentAnimationFrame < this.unfoldedAnimationDuration) {
            if (this.currentAnimationFrame === this.player.maxJumpFrames + this.player.extraTrampolineJumpFrames || this.currentAnimationFrame === this.unfoldedAnimationDuration - 1) {
                this.player.forcedJumpSpeed = 0;
            }
            super.drawSingleSquishingFrame(spriteCanvas, this.tileSize);
        }
        else {
            super.drawSingleSquishingFrame(spriteCanvas, 0);
            this.currentAnimationFrame = this.unfoldedAnimationDuration;
        }
    }
}