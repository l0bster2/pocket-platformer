class CanonBall extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, facingDirection, speed = 3, collidesWithWalls = true) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, { currentFacingDirection: facingDirection });
        this.tileMapHandler = tileMapHandler;
        this.facingDirection = facingDirection;
        this.movingSpeed = speed;
        this.yCenter = tileMapHandler.halfTileSize;
        this.key = this.makeid(5);
        this.collidesWithWalls = collidesWithWalls;
        this.currentTrailFrame = 0;
    }

    collisionEvent() {
        PlayMode.playerDeath();
    }

    draw() {
        this.currentTrailFrame++;
        if(this.currentTrailFrame % 10 === 0) {
            SFXHandler.createSFX(this.x, this.y, 9, this.facingDirection, 0, 0, true, 14, 1, "backgroundSFX")
        }
        if(this.currentTrailFrame === 101) {
            this.currentTrailFrame = 0;
        }
        super.draw(spriteCanvas);
        if (Game.playMode === Game.PLAY_MODE) {

            var { left, top, right } = AnimationHelper.facingDirections;
            if (this.facingDirection === left) {
                this.x -= this.movingSpeed;
                this.checkWallCollission(this.x, this.y + this.yCenter);
            }
            else if (this.facingDirection === top) {
                this.y -= this.movingSpeed;
                this.checkWallCollission(this.x + this.yCenter, this.y);
            }
            else if (this.facingDirection === right) {
                this.x += this.movingSpeed;
                this.checkWallCollission(this.x + this.tileSize, this.y + this.yCenter);
            }
            else {
                this.y += this.movingSpeed;
                this.checkWallCollission(this.x + this.yCenter, this.y + this.tileSize, [0]);
            }
        }
    }

    getTilePositions(x, y) {
        return { xPos: this.tileMapHandler.getTileValueForPosition(x), yPos: this.tileMapHandler.getTileValueForPosition(y) };
    }

    checkWallCollission(x, y, tileArray = [0, 5]) {
        const { xPos, yPos } = this.getTilePositions(x, y);
        var currentTileValue = this.tileMapHandler.getTileLayerValueByIndex(yPos, xPos);

        if ((!tileArray.includes(currentTileValue) && this.collidesWithWalls) || typeof currentTileValue === 'undefined') {
            if(currentTileValue === ObjectTypes.SPECIAL_BLOCK_VALUES.redBlueSwitch) {
                const switchBlock = this.tileMapHandler.levelObjects.find(levelObject => levelObject.initialX === xPos && 
                    levelObject.initialY === yPos && 
                    levelObject.type === ObjectTypes.RED_BLUE_BLOCK_SWITCH);
                switchBlock && switchBlock.switchWasHit(this.facingDirection);
            }
            this.deleteObjectFromLevel(this.tileMapHandler);
        }
    }
}