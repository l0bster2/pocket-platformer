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
        this.groundAcceleration = 0.12;
        this.maxSpeed = 3.3;
        this.currentMaxSpeed = 3.3;
        // High slipperiness: keeps its momentum and slides around.
        this.groundFriction = 0.97;
        this.activationConfig = { type: "playerApproxSameY", value: 2 };
        this.inactivationConfig = { type: "playerFurtherThanDistance", value: 10 };
        this.deathAnimation = 'upwardsAndRotate';
        this.shootSound = 'gun4';
    }

}
