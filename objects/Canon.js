class Canon extends ShootingObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = ObjectTypes.SPECIAL_BLOCK_VALUES.canon;
        this.getShootFrames();
    }

    draw(spriteCanvas) {
        super.drawWithSquishing(spriteCanvas);
        if (this.shootFrames.includes(this.tileMapHandler.currentGeneralFrameCounter)) {
            var canonBallX = this.initialX - 1;
            var canonBallY = this.initialY;
            var { top, right, bottom } = AnimationHelper.facingDirections;
            if (this.currentFacingDirection === top) {
                canonBallX = this.initialX;
                canonBallY = this.initialY - 1;
            }
            else if (this.currentFacingDirection === right) {
                canonBallX = this.initialX + 1;
                canonBallY = this.initialY;
            }
            else if (this.currentFacingDirection === bottom) {
                canonBallX = this.initialX;
                canonBallY = this.initialY + 1;
            }
            var canonBallStartingTile = this.tileMapHandler.getTileLayerValueByIndex(canonBallY, canonBallX);
            if (canonBallStartingTile === 0 || canonBallStartingTile === 5) {
                const canonBall = new CanonBall(canonBallX, canonBallY, this.tileSize, ObjectTypes.CANON_BALL,
                    this.tileMapHandler, this.currentFacingDirection, this[SpritePixelArrays.changeableAttributeTypes.speed]);
                this.tileMapHandler.levelObjects.push(canonBall);
                AnimationHelper.setSquishValues(this, this.tileSize * 1.2,
                    this.tileSize * 0.8, 5, this.currentFacingDirection);
            }
        }
    }
}