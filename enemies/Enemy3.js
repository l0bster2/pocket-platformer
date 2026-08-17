/**
 * Stays put and hops straight up every couple of seconds. Always active by default.
 */
class Enemy3 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        this.walkDirection = this.walkDirections.none;
        this.movementBehaviour = this.movementBehaviours.standStill;
        // Hops in place from time to time.
        this.jumpIntervalEnabled = true;
        this.jumpInterval = 2;
        this.shootSound = 'gun4';
    }

}
