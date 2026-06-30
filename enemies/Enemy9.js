/**
 * Ghost-type flyer: phases through walls and homes in on the player. It only wakes up while the
 * player is looking away and freezes again the moment the player looks at it.
 */
class Enemy9 extends Enemy6 {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        this.flyingBehaviour = this.flyingBehaviours.followPlayer;
        this.collidesWithWalls = false; // phases through walls
        this.activationConfig = { type: "playerLookingOppositeDirection" };
        this.inactivationConfig = { type: "playerLookingSameDirection" };
        EnemyFlyingHandler.resetFlyingState(this);
    }
}
