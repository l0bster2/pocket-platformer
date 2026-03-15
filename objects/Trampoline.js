class Trampoline extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.player = tilemapHandler.player;
        this.tilemapHandler = tilemapHandler;
        this.unfoldedAnimationDuration = 5 * AnimationHelper.walkingFrameDuration;
        this.currentAnimationFrame = this.unfoldedAnimationDuration;
    }

    collisionEvent(object) {
        object.previouslyTouchedTrampolines = true;
        if ((object.yspeed > 0 || object.bonusSpeedY > 0) && object.bottom_left_pos.y < this.y + this.tilemapHandler.halfTileSize) {
            this.tilemapHandler.levelObjects.forEach(levelObject => {
                if (levelObject.type === ObjectTypes.TRAMPOLINE) {
                    levelObject.currentAnimationFrame = this.unfoldedAnimationDuration;
                }
            });
            AnimationHelper.setSquishValues(this, this.tileSize * 0.8,
                this.tileSize * 1.2, 7);
            object.setStretchAnimation();
            object.forcedJumpSpeed = object.jumpSpeed + (object.jumpSpeed / 3.75);
            object.jumpframes = 0;
            object.fixedSpeed = false;
            object.temporaryDoubleJump = false;
            object.doubleJumpUsed = false;
            object.currentDashFrame = 0;
            this.currentAnimationFrame = 0;
            SoundHandler.longJump.stopAndPlay();
        }
    }

    draw(spriteCanvas) {
        this.currentAnimationFrame++;
        if (this.currentAnimationFrame < this.unfoldedAnimationDuration) {
            /*if (this.currentAnimationFrame === this.player.maxJumpFrames + this.player.extraTrampolineJumpFrames || this.currentAnimationFrame === this.unfoldedAnimationDuration - 1) {
                this.player.forcedJumpSpeed = 0;
            }*/
            super.drawSingleSquishingFrame(spriteCanvas, this.tileSize);
        }
        else {
            super.drawSingleSquishingFrame(spriteCanvas, 0);
            this.currentAnimationFrame = this.unfoldedAnimationDuration;
        }
    }
}