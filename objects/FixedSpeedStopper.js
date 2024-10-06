class FixedSpeedStopper extends InteractiveLevelObject {

    constructor(x, y, tileSize, type) {
        super(x, y, tileSize, type, 0);
    }

    collisionEvent() {
        player.fixedSpeedRight = false;
        player.fixedSpeedLeft = false;
    }
}