class DisappearingForegroundTile extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tileMapHandler = tileMapHandler;
        this.resetObject();
    }

    resetObject() {
        this.setToInvisible = false;
        this.currentAlpha = 1;
        this.currentInvisibleTimerFrame = 0;
    }

    collisionEvent() {
        this.setSelfAndNeightboursToCollided();
        this.collidedWithPlayer = true;
        this.currentInvisibleTimerFrame = 10;
    }

    setSelfAndNeightboursToCollided() {
        this.setToInvisible = true;

        this.tileMapHandler.levelObjects.forEach(levelObject => {
            if (levelObject.type === ObjectTypes.DISAPPEARING_FOREGROUND_TILE) {
                levelObject.collidedWithPlayer = false;
                levelObject.currentInvisibleTimerFrame = 0;

                const sameVertical = levelObject.initialX === this.initialX &&
                    (levelObject.initialY === this.initialY + 1 || levelObject.initialY === this.initialY - 1);
                const sameHorizontal = levelObject.initialY === this.initialY &&
                    (levelObject.initialX === this.initialX + 1 || levelObject.initialX === this.initialX - 1);
                if (!levelObject.setToInvisible &&
                    (sameVertical || sameHorizontal)) {
                    levelObject.setSelfAndNeightboursToCollided();
                }
            }
        });
    }

    resetAllDisappearingForegroundTiles() {
        this.tileMapHandler.levelObjects.forEach(levelObject => {
            if (levelObject.type === ObjectTypes.DISAPPEARING_FOREGROUND_TILE) {
                levelObject.resetObject();
            }
        });
    }

    draw(spriteCanvas) {
        if (this.setToInvisible) {
            this.currentAlpha = this.currentAlpha - 0.04 > 0 ? this.currentAlpha - 0.04 : 0;
        }
        if(this.currentInvisibleTimerFrame > 0) {
            this.currentInvisibleTimerFrame--;
            if(this.currentInvisibleTimerFrame === 1) {
                this.resetAllDisappearingForegroundTiles();
            }
        }
        Game.playMode === Game.PLAY_MODE ? super.drawWithAlpha(spriteCanvas, this.currentAlpha)
            : super.drawWithAlpha(spriteCanvas, 0.7);
    }
}