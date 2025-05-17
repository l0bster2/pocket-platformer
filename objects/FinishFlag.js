class FinishFlag extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.collidedWithPlayer = false;
        this.tilemapHandler = tilemapHandler;
        this.changeableInBuildMode = true;
        this.closedFinishedFlagSpriteIndex = SpritePixelArrays.getIndexOfSprite(ObjectTypes.FINISH_FLAG_CLOSED);
        this.closedFinishedFlagYSpritePos = this.closedFinishedFlagSpriteIndex * this.tileSize;
        this.closed = false;
        if (!WorldDataHandler.insideTool) {
            this.persistentCollectibles = WorldDataHandler.levels[this.tilemapHandler.currentLevel].levelObjects.filter(
                levelObject => levelObject.type === ObjectTypes.COLLECTIBLE
            );
        }
        this.transition = extraAttributes?.transition || "Default transition";
    }

    getSound() {
        // if no sound set
        if(!this.sound) {
            return "win";
        }
        // if sound set, but not found in soundhandler
        if(!SoundHandler[this.sound]) {
            return "win";
        }
        return this.sound;
    }

    collisionEvent() {
        if (!this.collidedWithPlayer && !this.closed) {
            this.collidedWithPlayer = true;
            SoundHandler[this.getSound()].stopAndPlay();

            if(this.transition === "Default transition" || !this.transitionType || !this.transitionLength) {

                TransitionAnimationHandler.currentAnimationType = TransitionAnimationHandler.animationType;
                TransitionAnimationHandler.currentAnimationFrames = TransitionAnimationHandler.animationFrames;
            }
            else {
                TransitionAnimationHandler.currentAnimationType = this.transitionType;
                TransitionAnimationHandler.currentAnimationFrames = this.transitionLength;
            }

            PlayMode.animateToNextLevel = true;
            PlayMode.currentPauseFrames = TransitionAnimationHandler.currentAnimationFrames;
            PlayMode.customExit = this.customExit;


            if (this.tilemapHandler.currentLevel === WorldDataHandler.levels.length - 2 && !this.customExit
                && !WorldDataHandler.insideTool && SoundHandler.currentSong) {
                SoundHandler.fadeAudio(SoundHandler.currentSong);
            }
        }
    }

    changeExit(text) {
        if (text) {
            if (text === 'finishLevel') {
                this.addChangeableAttribute("customExit", { levelIndex: WorldDataHandler.levels.length - 1 });
            }
            else {
                const valueArray = text.split(",");
                valueArray.length === 2 && this.addChangeableAttribute("customExit", { levelIndex: parseInt(valueArray[0]), flagIndex: valueArray[1] });
            }
        }
        else {
            this.addChangeableAttribute("customExit", null);
        }
    }

    checkIfAllCollectiblesCollected(collectibles) {
        if (WorldDataHandler.insideTool) {
            return collectibles.every(collectible => collectible.touched);
        }
        else {
            return this.persistentCollectibles.every(persistentCollectible => persistentCollectible.extraAttributes.collected);
        }
    }

    draw(spriteCanvas) {
        if (!this.collectiblesNeeded) {
            super.draw(spriteCanvas);
            this.closed = false;
        }
        else {
            const collectibles = this.tilemapHandler.filterObjectsByTypes(ObjectTypes.COLLECTIBLE);
            if (!collectibles || this.checkIfAllCollectiblesCollected(collectibles)) {
                super.draw(spriteCanvas);
                this.closed = false;
            }
            else {
                super.draw(spriteCanvas, this.closedFinishedFlagYSpritePos)
                this.closed = true;
            }
        }
    }
}