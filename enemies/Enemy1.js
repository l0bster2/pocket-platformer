class Enemy1 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.walkDirection = this.walkDirections.left;
    }

    hitWall(direction) {
        super.hitWall(direction);

        switch (direction) {
            case AnimationHelper.facingDirections.left:
                this.walkDirection = this.walkDirections.right;
                break;
            case AnimationHelper.facingDirections.right:
                this.walkDirection = this.walkDirections.left;
                break;
        }
    }

    draw(spriteCanvas) {
        super.draw(spriteCanvas);
        if (Game.playMode === Game.PLAY_MODE) {
            this.isActive && super.walkHandler();
            this.forcedJumpSpeed !== 0 && JumpHandler.performJump(this, this.forcedJumpSpeed, this.maxJumpFrames + this.extraTrampolineJumpFrames);
            super.fallHandler();
            super.correctMaxYSpeed();
            CharacterCollision.checkFloorAndTileCollision(this, false);
        }

    }
}