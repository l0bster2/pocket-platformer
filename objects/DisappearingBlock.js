class DisappearingBlock extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tileMapHandler = tileMapHandler;
        this.player = tileMapHandler.player;
        this.disappearingFrameAmount = 200;
        this.blockNotSolidAt = 40;
        this.disappearingStepsAmount = 4;
        this.disappearingFrameSteps = this.blockNotSolidAt / this.disappearingStepsAmount;
        this.disappearingBoxHeight = this.tileSize / this.disappearingStepsAmount;
        this.resetObject();
    }

    collisionEvent() {
        this.collidedWithPlayer = true;
    }

    resetObject() {
        this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = ObjectTypes.SPECIAL_BLOCK_VALUES.disappearingBlock;
        this.currentDisappearingFrame = 0;
        this.collidedWithPlayer = false;
    }

    draw(spriteCanvas) {
        if (this.collidedWithPlayer) {
            this.currentDisappearingFrame++;
            let currentDisappearingDrawFrame = Math.floor((this.blockNotSolidAt - this.currentDisappearingFrame)
                / this.disappearingFrameSteps);

            if (currentDisappearingDrawFrame <= 0) {
                currentDisappearingDrawFrame = 0;
            }

            const currentHeight = currentDisappearingDrawFrame * this.disappearingBoxHeight;
            
            Display.drawImage(spriteCanvas, 0, this.canvasYSpritePos,
                this.tileSize, currentHeight,
                this.x, this.y, this.tileSize, currentHeight);

            if (this.currentDisappearingFrame === this.blockNotSolidAt) {
                this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = 0;
            }
            if (this.currentDisappearingFrame >= this.disappearingFrameAmount) {
                let currentlyCollidingWithInteractiveObject = false;
                if (Collision.objectsColliding(this.player, this)) {
                    currentlyCollidingWithInteractiveObject = true;
                }
                this.tileMapHandler.levelObjects.forEach(levelObject => {
                    if (levelObject?.type === ObjectTypes.STOMPER && (levelObject.active || levelObject.goingBack)) {
                        if (Collision.objectsColliding(levelObject, this)) {
                            currentlyCollidingWithInteractiveObject = true;
                        }
                    }
                });
                !currentlyCollidingWithInteractiveObject && this.resetObject();
            }
        }
        else {
            super.draw(spriteCanvas);
        }
    }
}