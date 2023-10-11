class Water extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.tilemapHandler = tilemapHandler;
    }

    collisionEvent() {
        const { player } = this.tilemapHandler;
        player.currentGravity = player.gravity / 10;
        player.currentMaxFallSpeed = player.maxWaterFallSpeed;
        player.swimming = true;
        player.fixedSpeed = false;
        player.temporaryDoubleJump = false;
        player.resetDoubleJump();
        this.checkExactCornerCollision();
    }

    checkExactCornerCollision() {
        const { player } = this.tilemapHandler;
        //we need this initial check, because when the game starts, there are no edges yet. we check if one of the edges exists
        if(player.top_right_pos) {
            ["top_right_pos", "top_left_pos", "bottom_right_pos", "bottom_left_pos"].forEach(corner => {
                if(!player[corner + "_in_water"]) {
                    player[corner + "_in_water"] = Collision.pointAndObjectColliding(player[corner], this);
                }
            });
        }
    }
}