class Enemy2 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.walkDirection = this.walkDirections.right;
        this.speed = 1;

        // Distinct default attributes for Enemy 2 (per-type defaults)
        this.maxSpeed = 3;
        this.currentMaxSpeed = 3;
        // Only activates once the player gets close, and deactivates again when far away,
        // so the activation system has a visible effect compared to Enemy 1.
        this.activationConfig = { type: "playerInDistance", value: 5 };
        this.inactivationConfig = { type: "playerFurtherThanDistance", value: 7 };
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
            this.forcedJumpSpeed !== 0 && EnemyJumpHandler.performJump(this, this.forcedJumpSpeed, this.maxJumpFrames + this.extraTrampolineJumpFrames);
            super.fallHandler();
            super.correctMaxYSpeed();
            CharacterCollision.checkFloorAndTileCollision(this, false);
        }
    }
}
