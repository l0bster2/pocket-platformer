class Enemy6 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        // Flying enemy: hovers and moves freely according to its flying behaviour.
        this.flying = true;
        this.falling = false;
        this.canBeStomped = true;
        this.flyingBehaviour = this.flyingBehaviours.moveHorizontally;
        EnemyFlyingHandler.resetFlyingState(this);
        this.shootSound = 'gun4';
    }

}
