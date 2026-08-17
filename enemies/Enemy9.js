/**
 * Ghost-type flyer: phases through walls and homes in on the player. It only wakes up while the
 * player is looking away and freezes again the moment the player looks at it.
 */
class Enemy9 extends Enemy6 {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        this.flyingBehaviour = this.flyingBehaviours.followPlayer;
        this.collidesWithWalls = false; // phases through walls
        this.canBeStomped = false;
        // The ghost is indestructible: neither spikes nor the player's bullets can kill it.
        this.killedBySpikes = false;
        this.killedByBullets = false;
        this.activationConfig = { type: "playerLookingOppositeDirection" };
        this.inactivationConfig = { type: "playerLookingSameDirection" };
        // High air friction so the deceleration-on-inactivation slide-out is clearly visible.
        this.air_friction = 0.97;
        EnemyFlyingHandler.resetFlyingState(this);
        this.shootSound = 'gun4';
    }
}
