class Stomper extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, -1, extraAttributes);
        this.tilemapHandler = tilemapHandler;
        this.distanceToCheckCollission = tileSize / 2;
        this.speed = 6;
        this.pauseFrames = 20;
        this.currentPauseFrame = 0;
        this.yCheckDistance = this.distanceToCheckCollission;
        this.xCheckDistance = 0;
        this.yspeed = this.speed;
        this.xspeed = 0;
        //can't pass through other stompers
        this.unpassableObjects = [ObjectTypes.STOMPER];
        this.key = this.makeid(5);
        this.resetObject();
        this.handleFacingDirection();
    }

    collisionEvent() {
        PlayMode.playerDeath();
    }

    turnObject() {
        super.turnObject();
        this.handleFacingDirection();
        BuildMode.rearrangeLevelObjectsByXAndYPos();
    }

    updateMovingValues(yCheckDistance, yspeed, xCheckDistance, xspeed) {
        this.yCheckDistance = yCheckDistance;
        this.yspeed = yspeed;
        this.xCheckDistance = xCheckDistance;
        this.xspeed = xspeed;
    }

    handleFacingDirection() {
        if (this.currentFacingDirection === AnimationHelper.facingDirections.bottom) {
            this.updateMovingValues(Math.abs(this.distanceToCheckCollission),
                Math.abs(this.speed), 0, 0);
        }
        else if (this.currentFacingDirection === AnimationHelper.facingDirections.left) {
            this.updateMovingValues(0, 0, -Math.abs(this.distanceToCheckCollission),
                -Math.abs(this.speed));
        }
        else if (this.currentFacingDirection === AnimationHelper.facingDirections.top) {
            this.updateMovingValues(-Math.abs(this.distanceToCheckCollission), -Math.abs(this.speed), 0,
                0);
        }
        else if (this.currentFacingDirection === AnimationHelper.facingDirections.right) {
            this.updateMovingValues(0, 0, Math.abs(this.distanceToCheckCollission),
                Math.abs(this.speed));
        }
    }

    getCenterPosition() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }

    checkIfSwitchWasHit() {
        let positionToCheck = this.getCenterPosition();
        if (this.currentFacingDirection === AnimationHelper.facingDirections.bottom) {
            positionToCheck.y = positionToCheck.y + this.tileSize;
        }
        else if (this.currentFacingDirection === AnimationHelper.facingDirections.left) {
            positionToCheck.x = positionToCheck.x - this.tileSize;
        }
        else if (this.currentFacingDirection === AnimationHelper.facingDirections.top) {
            positionToCheck.y = positionToCheck.y - this.tileSize;
        }
        else if (this.currentFacingDirection === AnimationHelper.facingDirections.right) {
            positionToCheck.x = positionToCheck.x + this.tileSize;
        }
        this.tilemapHandler.levelObjects.forEach(levelObject => {
            if (levelObject.type === ObjectTypes.RED_BLUE_BLOCK_SWITCH
                && Collision.pointAndObjectColliding(positionToCheck, levelObject)) {
                levelObject.switchWasHit(this.currentFacingDirection);
            }
        });
    }

    resetObject() {
        this.resetAttributes();
        this.x = this.initialX * this.tileSize;
        this.y = this.initialY * this.tileSize;
        this.resetSpeed();
    }

    resetAttributes() {
        this.goingBack = false;
        this.active = false;
        this.currentPauseFrame = 0;
    }

    checkIfTileFree(x, y) {
        const currentTile = tileMapHandler.getTileLayerValueByIndex(tileMapHandler.getTileValueForPosition(y),
            tileMapHandler.getTileValueForPosition(x));
        if (this.currentFacingDirection === AnimationHelper.facingDirections.top && !this.goingBack) {
            return currentTile === 0 || currentTile === 5;
        }
        return currentTile === 0;
    }

    checkIfPlayerInTheWay() {
        const startX = this.x + this.distanceToCheckCollission;
        const startY = this.y + this.distanceToCheckCollission;
        //check 200 times if player or a solid tile is in the way. 200 because max level width and height are 99. checkdistance is half a tile
        for (let i = 0; i < 200; i++) {
            const xPosToCheck = startX + i * this.xCheckDistance;
            const yPosToCheck = startY + i * this.yCheckDistance;
            if (Collision.pointAndObjectColliding({ x: xPosToCheck, y: yPosToCheck }, player)) {
                this.active = true;
                break;
            }
            if (!this.checkIfTileFree(xPosToCheck, yPosToCheck)) {
                break;
            }
        }
    }

    resetSpeed() {
        if (this.xspeed !== 0 && Math.abs(this.xspeed) !== this.speed
            || this.yspeed !== 0 && Math.abs(this.yspeed) !== this.speed) {
            this.handleFacingDirection();
        }
    }

    reduceSpeed() {
        this.xspeed = this.xspeed * -1 / 3;
        this.yspeed = this.yspeed * -1 / 3;
    }

    hitWall() {
        if (this.active && !this.goingBack && this.currentPauseFrame === 0) {
            AnimationHelper.setSquishValues(this, this.tileSize * 1.2,
                this.tileSize * 0.8, 7 , this.currentFacingDirection);
            SFXHandler.createSFX(this.x + this.xspeed, this.y + this.yspeed, 1);
            this.currentPauseFrame = this.pauseFrames;
            this.checkIfSwitchWasHit();
            this.reduceSpeed();
        }
        else if (this.goingBack) {
            this.resetAttributes();
            this.resetSpeed();
        }
    }

    hitUnpassableObject(direction, objectCollidedWith) {
        const attacking = this.isAttacking(this);
        const otherObjectStill = this.isStill(objectCollidedWith);
        /*  !(attacking && objectCollidedWith.currentPauseFrame === 0 &&
            this.currentFacingDirection === objectCollidedWith.currentFacingDirection)*/
        if (attacking || (this.goingBack && otherObjectStill)) {
            this.hitWall();
        }
    }

    pauseAfterWallHit() {
        this.currentPauseFrame--;
        if (this.currentPauseFrame === 0) {
            this.goingBack = true;
        }
    }

    goBack() {
        CharacterCollision.checkTileCollisions(this);
        CharacterCollision.checkMovementBasedObjectCollission(this);

        if (this.goingBack) {
            switch (this.currentFacingDirection) {
                case AnimationHelper.facingDirections.bottom:
                    this.y + this.yspeed < this.initialY * this.tileSize && this.resetObject();
                    break;
                case AnimationHelper.facingDirections.top:
                    this.y + this.yspeed > this.initialY * this.tileSize && this.resetObject();
                    break;
                case AnimationHelper.facingDirections.left:
                    this.x + this.xspeed > this.initialX * this.tileSize && this.resetObject();
                    break;
                case AnimationHelper.facingDirections.right:
                    this.x + this.xspeed < this.initialX * this.tileSize && this.resetObject();
            }
        }
    }

    drawSprite(spriteCanvas, secondSprite = false) {
        const showSecond = secondSprite && this?.spriteObject?.[0].animation.length > 1;
        super.drawSingleSquishingFrame(spriteCanvas, showSecond ? this.canvasXSpritePos + this.tileSize : this.canvasXSpritePos);
    }

    stomperActive() {
        CharacterCollision.checkTileCollisions(this);
        CharacterCollision.checkMovementBasedObjectCollission(this);
    }

    isStill(obj) {
        return !obj.active && !obj.goingBack;
    }

    isAttacking(obj) {
        return obj.active && !obj.goingBack && obj.currentPauseFrame === 0;
    }

    draw(spriteCanvas) {
        if (this.isStill(this)) {
            Game.playMode === Game.PLAY_MODE && this.checkIfPlayerInTheWay();
            this.drawSprite(spriteCanvas);
        }
        else if (this.isAttacking(this)) {
            Game.playMode === Game.PLAY_MODE && this.stomperActive();
            this.drawSprite(spriteCanvas, true);
        }
        else if (this.currentPauseFrame > 0) {
            Game.playMode === Game.PLAY_MODE && this.pauseAfterWallHit();
            this.drawSprite(spriteCanvas);
        }
        else if (this.goingBack) {
            Game.playMode === Game.PLAY_MODE && this.goBack();
            this.drawSprite(spriteCanvas);
        }
    }
}