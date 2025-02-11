class TriggeredPlatform extends DefaultMovingPlatform {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, tilemapHandler, extraAttributes);
        this.outOfBoundsTimer = 0;
        this.outOfBounds = false;
        this.maxOutOfBoundsTime = 100;
    }

    setMovementSpeed() {
        if(this.currentFacingDirection === AnimationHelper.facingDirections.bottom) {
            this.yspeed = this.speed;
        }
        else if(this.currentFacingDirection === AnimationHelper.facingDirections.left) {
            this.xspeed = this.speed * -1;
        }
        else if(this.currentFacingDirection === AnimationHelper.facingDirections.top) {
            this.yspeed = this.speed * -1;
        }
        else if(this.currentFacingDirection === AnimationHelper.facingDirections.right) {
            this.xspeed = this.speed;
        }
    }

    resetObject() {
        this.x = this.initialX * this.tileSize;
        this.y = this.initialY * this.tileSize;
        this.xspeed = 0;
        this.yspeed = 0;
        this.outOfBoundsTimer = 0;
        this.outOfBounds = false;
    }

    checkOutOfBounds() {
        if(this.xspeed === 0 && this.yspeed === 0) {
            return;
        }
        if(this.fakeHitBox.x + this.fakeHitBox.width < 0 ||
            this.fakeHitBox.x > this.tilemapHandler.getLevelWidth() * this.tileSize ||
            this.fakeHitBox.y < 0 ||
            this.fakeHitBox.y > this.tilemapHandler.getLevelHeight() * this.tileSize
        ) {
            this.outOfBounds = true;
        }
        if(this.outOfBounds && this.outOfBoundsTimer < this.maxOutOfBoundsTime) {
            this.outOfBoundsTimer++;
            if(this.outOfBoundsTimer == this.maxOutOfBoundsTime) {
                this.resetObject();
            }
        }
    }

    draw() {
        this.checkOutOfBounds();

        if (this.yspeed < 0 || this.xspeed !== 0) {
            this.fakeHitBox.y = this.y - 1;
            this.fakeHitBox.x = this.getHitBoxXOffset();
        }

        if (this.player.movingPlatformKey === this.key) {
            this.setMovementSpeed();
            if(this.activationOnce === "moving when player on it") {
                this.x += this.xspeed;
                this.y += this.yspeed;
            }
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

        if(this.activationOnce === "moving endlessly when touched") {
            this.x += this.xspeed;
            this.y += this.yspeed;
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