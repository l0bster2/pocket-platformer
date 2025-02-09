class MovingPlatform extends DefaultMovingPlatform {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, tilemapHandler, extraAttributes);
    }

    draw() {
        if (this.yspeed < 0 || this.xspeed !== 0) {
            this.fakeHitBox.y = this.y - 1;
            this.fakeHitBox.x = this.getHitBoxXOffset();
        }

        if (this.player.movingPlatformKey === this.key) {
            const playerAndPlatformMovingUp = this.yspeed <= 0 && this.player.yspeed < 0;
            const playerJumpingSlowerThanMovingPlatform = playerAndPlatformMovingUp && this.player.yspeed > this.yspeed;

            this.player.bonusSpeedX = this.xspeed;
            this.player.bonusSpeedY = this.yspeed;

            if(playerJumpingSlowerThanMovingPlatform) {
                this.player.hitWall(AnimationHelper.facingDirections.bottom);
                this.player.jumping = false;
                this.player.y = this.y - this.player.height;
                this.player.movingPlatformKey = this.key;
                this.player.onMovingPlatform = true;
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