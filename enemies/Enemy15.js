class Enemy15 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.flying = true;
        this.falling = false;
        this.canBeStomped = true;
        this.flyingBehaviour = this.flyingBehaviours.followPlayerPathfinding;
        this.canBeStomped = false;
        EnemyFlyingHandler.resetFlyingState(this);
        this.shootSound = 'gun4';
    }

}
