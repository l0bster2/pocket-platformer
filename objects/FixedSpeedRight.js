class FixedSpeedRight extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
    }

    collisionEvent() {
        if(this.currentFacingDirection === AnimationHelper.facingDirections.right) {
            player.fixedSpeedLeft = false;
            player.fixedSpeedRight = true;
        }
        else {
            player.fixedSpeedLeft = true;
            player.fixedSpeedRight = false;
        }
    }
}