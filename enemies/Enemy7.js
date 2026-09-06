/**
 * Flying bat that chases the player using pathfinding. When it has a clear line of sight it
 * flies straight at the player; otherwise it navigates around walls along a computed path.
 */
class Enemy7 extends Enemy6 {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        this.flyingBehaviour = this.flyingBehaviours.followPlayer;
        EnemyFlyingHandler.resetFlyingState(this);
        this.shootSound = 'gun4';
    }
}
