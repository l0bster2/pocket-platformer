class DisappearingForegroundTile extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tileMapHandler = tileMapHandler;
        this.resetObject();
    }

    resetObject() {
        this.setToInvisible = false;
        this.setToVisible = false;
        this.currentAlpha = 1;
        this.currentInvisibleTimerFrame = 0;
    }

    collisionEvent() {
        this.setSelfAndNeightboursToCollided();
        this.collidedWithPlayer = true;
        this.currentInvisibleTimerFrame = 20;
    }

    setSelfAndNeightboursToCollided() {
        this.setToInvisible = true;

        this.tileMapHandler.levelObjects.forEach(levelObject => {
            if (levelObject.type === ObjectTypes.DISAPPEARING_FOREGROUND_TILE) {
                levelObject.collidedWithPlayer = false;
                levelObject.currentInvisibleTimerFrame = 0;
                levelObject.setToVisible = false;

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
            if (levelObject.type === ObjectTypes.DISAPPEARING_FOREGROUND_TILE && levelObject.setToInvisible) {
                levelObject.setToInvisible = false;
                levelObject.setToVisible = true;
                levelObject.currentInvisibleTimerFrame = 0;
            }
        });
    }

    draw(spriteCanvas) {
        if (Game.playMode === Game.PLAY_MODE) {
            if (this.setToInvisible) {
                this.currentAlpha = this.currentAlpha - 0.04 > 0 ? this.currentAlpha - 0.04 : 0;
            }
            if (this.setToVisible) {
                if (this.currentAlpha + 0.04 < 1) {
                    this.currentAlpha += 0.04;
                }
                else {
                    this.currentAlpha = 1;
                    this.setToVisible = false;
                }
            }
            if (this.currentInvisibleTimerFrame > 0 && !DialogueHandler.active) {
                this.currentInvisibleTimerFrame--;
                if (this.currentInvisibleTimerFrame === 1) {
                    this.resetAllDisappearingForegroundTiles();
                    this.setToInvisible = false;
                    this.setToVisible = true;
                    this.currentInvisibleTimerFrame = 0;
                }
            }
            super.drawWithAlpha(spriteCanvas, this.currentAlpha)
        }
        else {
            super.drawWithAlpha(spriteCanvas, 0.1);
        }
    }
}