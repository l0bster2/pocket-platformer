class Enemy2 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.walkDirection = this.walkDirections.right;
        this.movementBehaviour = this.movementBehaviours.startMovingRight;
        this.speed = 1;

        // Distinct default attributes for Enemy 2 (per-type defaults)
        this.maxSpeed = 2.6;
        this.currentMaxSpeed = 2.6;
        this.canBeStomped = false;
        // Always active (base defaults: alwaysActive / neverInactive).
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
