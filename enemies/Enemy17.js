class Enemy17 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.walkDirection = this.walkDirections.left;
        this.canBeStomped = true;
        this.gapBehaviour = this.gapBehaviours.continueWalking;
        this.deathAnimation = 'upwardsAndRotate';
    }

}
