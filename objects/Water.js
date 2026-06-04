class Water extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.tilemapHandler = tilemapHandler;
    }

    collisionEvent(obj) {
        obj.currentGravity = obj.gravity / 10;
        obj.currentMaxFallSpeed = obj.maxWaterFallSpeed;
        obj.swimming = true;
        obj.fixedSpeed = false;
        obj.temporaryDoubleJump = false;
        if(obj.type === "player") {
            obj.resetDoubleJump();
        }
        this.checkExactCornerCollision(obj);
    }

    checkExactCornerCollision(obj) {
        //we need this initial check, because when the game starts, there are no edges yet. we check if one of the edges exists
        if(obj.top_right_pos) {
            ["top_right_pos", "top_left_pos", "bottom_right_pos", "bottom_left_pos"].forEach(corner => {
                if(!obj[corner + "_in_water"]) {
                    obj[corner + "_in_water"] = Collision.pointAndObjectColliding(obj[corner], this);
                }
            });
        }
    }
}