/**
 * Flying bat that chases the player using pathfinding. When it has a clear line of sight it
 * flies straight at the player; otherwise it navigates around walls along a computed path.
 */
class Enemy4 extends Enemy3 {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        this.flyingBehaviour = this.flyingBehaviours.followPlayerPathfinding;
        EnemyFlyingHandler.resetFlyingState(this);
    }
}
