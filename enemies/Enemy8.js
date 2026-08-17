/**
 * Flying bat that drifts diagonally, bouncing off walls like a classic screen-saver.
 */
class Enemy8 extends Enemy6 {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        this.flyingBehaviour = this.flyingBehaviours.diagonal;
        EnemyFlyingHandler.resetFlyingState(this);
        this.shootSound = 'gun4';
    }
}
