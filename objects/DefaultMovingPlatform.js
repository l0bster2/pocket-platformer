class DefaultMovingPlatform extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, hitBoxOffset, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.tilemapHandler = tilemapHandler;
        this.player = tilemapHandler.player;
        this.tileSize = tilemapHandler.tileSize;
        this.key = this.makeid(5);
        this.adaptWidthToSize();
        this.colissionFunction = this.fakeColission;
    }
    
    fakeColission(obj, levelObject) {
        return Collision.objectsColliding(obj, levelObject.fakeHitBox);
    }

    collisionEvent() {
        this.player.previouslyTouchedByMovingPlatform = true;
    }

    
    adaptWidthToSize() {
        this.width = this.size * this.tilemapHandler.tileSize;
        this.fakeHitBox = {
            y: this.y - 1,
            x: this.getHitBoxXOffset(),
            width: this.width,
            height: this.height,
            hitBoxOffset: 0,
        };
        this.centerIndex = 0;

        if (this.size > 1) {
            this.centerIndex = (this.size - 1) / 2;
        }
    }

    getHitBoxXOffset() {
        return this.x - ((this.size - 1) / 2 * this.tileSize);
    }

    addChangeableAttribute(attribute, value, levelToChange = null) {
        super.addChangeableAttribute(attribute, value, levelToChange);
        if (attribute === SpritePixelArrays.changeableAttributeTypes.size) {
            this.adaptWidthToSize();
        }
    }

    setPlayerMomentumCoyoteFrames() {
        if (this.player.movingPlatformKey === this.key &&
            (this.xspeed !== 0 || this.yspeed < 0)) {
            this.player.currentMomentumCoyoteFrame = 0;
            this.player.momentumBonusSpeedX = this.xspeed;
            this.player.momentumBonusSpeedY = this.yspeed;
        }
    }

    drawPlatformsInGame(index) {
        if (this?.spriteObject?.[0].animation.length > 1) {
            if (this.checkFrame()) {
                Display.drawImage(spriteCanvas, 0, this.canvasYSpritePos, this.tileSize, this.tileSize,
                    this.fakeHitBox.x + index * this.tileSize, this.y,
                    this.tileSize, this.tileSize);
            }
            else {
                Display.drawImage(spriteCanvas, this.tileSize, this.canvasYSpritePos, this.tileSize,
                    this.tileSize, this.fakeHitBox.x + index * this.tileSize, this.y,
                    this.tileSize, this.tileSize);
            }
        }
        else {
            Display.drawImage(spriteCanvas, 0, this.canvasYSpritePos, this.tileSize, this.tileSize,
                this.fakeHitBox.x + index * this.tileSize, this.y,
                this.tileSize, this.tileSize);
        }
    }

    drawAdditionalPlatform(index) {
        if (Game.playMode === Game.PLAY_MODE) {
            this.drawPlatformsInGame(index);
        }
        else {
            Display.drawImageWithAlpha(spriteCanvas, 0, this.canvasYSpritePos, this.tileSize, this.tileSize,
                this.fakeHitBox.x + index * this.tileSize, this.y,
                this.tileSize, this.tileSize, index === this.centerIndex ? 1 : 0.6);
        }
    }

    updateMovement() {
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
                this.player.bonusSpeedX = 0;
                this.player.bonusSpeedY = 0;
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