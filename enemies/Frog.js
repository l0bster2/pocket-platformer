/**
 * Frog: stays put and hops straight up every couple of seconds. Always active by default.
 */
class Frog extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        this.walkDirection = this.walkDirections.none;
        this.movementBehaviour = this.movementBehaviours.standStill;
        // Hops in place from time to time.
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
