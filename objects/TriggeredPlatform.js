class TriggeredPlatform extends DefaultMovingPlatform {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, tilemapHandler, extraAttributes);
    }

    draw() {
        if (this.yspeed < 0 || this.xspeed !== 0) {
            this.fakeHitBox.y = this.y - 1;
            this.fakeHitBox.x = this.getHitBoxXOffset();
        }

        if (this.player.movingPlatformKey === this.key) {
            if (this.player.jumpframes !== 1) {
                const playerAndPlatformMovingUp = this.yspeed <= 0 && this.player.yspeed < 0;
                const playerJumpingFasterThanMovingPlatform = playerAndPlatformMovingUp && this.player.yspeed < this.yspeed;
                this.player.bonusSpeedX = this.xspeed;

                if(!playerAndPlatformMovingUp) {
                    this.player.bonusSpeedY = this.yspeed;
                }
                else if(!playerJumpingFasterThanMovingPlatform){
                    this.player.bonusSpeedY = this.yspeed - this.player.yspeed - 1;
                }
            }

            if (!Collision.objectsColliding(this.player, this.fakeHitBox)) {
                this.player.movingPlatformKey = null;
                this.player.onMovingPlatform = false;
            }
        }

        if (this.yspeed >= 0) {
            this.fakeHitBox.y = this.y - 1;
            this.fakeHitBox.x = this.getHitBoxXOffset();
        }

        for (var i = 0; i < this.size; i++) {
            this.drawAdditionalPlatform(i);
        }
    }
}