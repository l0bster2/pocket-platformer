class CanonBall extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, facingDirection, speed = 3) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, { currentFacingDirection: facingDirection });
        this.tileMapHandler = tileMapHandler;
        this.facingDirection = facingDirection;
        this.movingSpeed = speed;
        this.yCenter = tileSize / 2;
        this.key = this.makeid(5);
    }

    collisionEvent() {
        PlayMode.playerDeath();
    }

    draw() {
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
        if (!!typeof currentTileValue === 'undefined' || !tileArray.includes(currentTileValue)) {
            if(currentTileValue === ObjectTypes.SPECIAL_BLOCK_VALUES.redBlueSwitch) {
                const switchBlock = this.tileMapHandler.levelObjects.find(levelObject => levelObject.initialX === xPos && levelObject.initialY === yPos);
                switchBlock && switchBlock.switchWasHit(this.facingDirection);
            }
            this.deleteObjectFromLevel(this.tileMapHandler);
        }
    }
}