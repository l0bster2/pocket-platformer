class Enemy16 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.walkDirection = this.walkDirections.left;
        this.canBeStomped = false;
        this.killsPlayer = false;
        this.killedBySpikes = false;

        // Flying, stationary
        this.flying = true;
        EnemyFlyingHandler.resetFlyingState(this);
        this.flyingBehaviour = 'standStill';
        this.deathAnimation = 'upwardsAndRotate';
        this.shootSound = 'gun4';
    }

}
