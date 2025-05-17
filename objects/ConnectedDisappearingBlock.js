class ConnectedDisappearingBlock extends InteractiveLevelObject {

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
        this.setSelfAndNeightboursToCollided();
    }

    setSelfAndNeightboursToCollided() {
        this.collidedWithPlayer = true;
        this.tileMapHandler.levelObjects.forEach(levelObject => {
            const sameVertical = levelObject.initialX === this.initialX &&
                (levelObject.initialY === this.initialY + 1 || levelObject.initialY === this.initialY - 1);
            const sameHorizontal = levelObject.initialY === this.initialY &&
                (levelObject.initialX === this.initialX + 1 || levelObject.initialX === this.initialX - 1);
            if (levelObject.type === ObjectTypes.CONNECTED_DISAPPEARING_BLOCK && !levelObject.collidedWithPlayer &&
                (sameVertical || sameHorizontal)) {
                levelObject.setSelfAndNeightboursToCollided();
            }
        });
    }

    setSelfAndNeightboursToCheckReset() {
        this.collissionAlreadyChecked = true;
        if (Collision.objectsColliding(this.player, this)) {
            this.currentlyCollidingWithInteractiveObject = true;
        }
        this.checkedCollisionWithplayer = true;
        this.tileMapHandler.levelObjects.forEach(levelObject => {
            const sameVertical = levelObject.initialX === this.initialX &&
                (levelObject.initialY === this.initialY + 1 || levelObject.initialY === this.initialY - 1);
            const sameHorizontal = levelObject.initialY === this.initialY &&
                (levelObject.initialX === this.initialX + 1 || levelObject.initialX === this.initialX - 1);
            if (levelObject.type === ObjectTypes.CONNECTED_DISAPPEARING_BLOCK && !levelObject.collissionAlreadyChecked &&
                (sameVertical || sameHorizontal)) {
                levelObject.setSelfAndNeightboursToCheckReset();
            }
        });
    }

    resetObject() {
        this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = ObjectTypes.SPECIAL_BLOCK_VALUES.disappearingBlock;
        this.currentDisappearingFrame = 0;
        this.collidedWithPlayer = false;
        this.currentlyCollidingWithInteractiveObject = false;
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

            if(this.currentDisappearingFrame % this.disappearingFrameSteps === 0 && this.currentDisappearingFrame < this.blockNotSolidAt) {
                SFXHandler.createSFX(this.x, this.y + currentHeight - 6, 14, AnimationHelper.facingDirections.bottom, 
                    0, 0, true, 8, 0, "backgroundSFX");
            }

            Display.drawImage(spriteCanvas, 0, this.canvasYSpritePos,
                this.tileSize, currentHeight,
                this.x, this.y, this.tileSize, currentHeight);

            if (this.currentDisappearingFrame === this.blockNotSolidAt) {
                this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = 0;
            }

            if (this.currentDisappearingFrame >= this.disappearingFrameAmount) {
                this.setSelfAndNeightboursToCheckReset();
                const playerSomewhereInTheWay = this.tileMapHandler.levelObjects.some(levelObject => {
                    if (levelObject?.type === ObjectTypes.CONNECTED_DISAPPEARING_BLOCK &&
                        levelObject.currentlyCollidingWithInteractiveObject) {
                        return true;
                    }
                });

                !playerSomewhereInTheWay && this.resetObject();
            }
        }
        else {
            super.draw(spriteCanvas);
        }
        this.collissionAlreadyChecked = false;
        this.currentlyCollidingWithInteractiveObject = false;
    }
}