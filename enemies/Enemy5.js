/**
 * Patrols left and right (reversing every 2 seconds) and jumps from time to time.
 * Always active by default.
 */
class Enemy5 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        // Walks back and forth, switching direction every 2 seconds.
        this.movementBehaviour = this.movementBehaviours.patrol;
        this.patrolDuration = 2;
        // Jumps every couple of seconds while patrolling.
        this.jumpIntervalEnabled = true;
        this.jumpInterval = 2;
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
