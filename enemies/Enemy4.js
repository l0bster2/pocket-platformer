/**
 * Relentlessly shuffles towards the player, slightly faster than the player and very
 * slippery so it slides around. Jumps over pits. Only wakes up when the player gets close
 * (within 7 tiles) and gives up once the player is far enough away (10 tiles).
 */
class Enemy4 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        // Chases the player and hops across gaps instead of turning back.
        this.movementBehaviour = this.movementBehaviours.towardsPlayer;
        this.gapBehaviour = this.gapBehaviours.jump;
        // Slightly faster than the player (player maxSpeed is 3.2).
        this.maxSpeed = 3.5;
        this.currentMaxSpeed = 3.5;
        // High slipperiness: keeps its momentum and slides around.
        this.groundFriction = 0.92;
        this.activationConfig = { type: "playerInDistance", value: 7 };
        this.inactivationConfig = { type: "playerFurtherThanDistance", value: 10 };
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
