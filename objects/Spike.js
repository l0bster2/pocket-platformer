class Spike extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
    }

    collisionEvent(obj) {
        if(obj.type === "player") {
            PlayMode.playerDeath();
        }
        else {
            obj.death();
        }
    }
}