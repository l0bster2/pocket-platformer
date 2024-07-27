class Collectible extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tileMapHandler = tilemapHandler;
        this.touched = false;
        this.hide = false;
    }

    resetObject() {
        this.hide = false;
        this.touched = false;
    }

    collisionEvent() {
        if (!this.touched && !this.collected) {
            this.tileMapHandler.player.reverseGravity();
            this.playCorrectSound();
            this.touched = true;
            SFXHandler.createSFX(this.x, this.y, 4);

            AnimationHelper.setSquishValues(this, this.tileSize * 1.2,
                this.tileSize * 0.8, 8, AnimationHelper.facingDirections.left);
            if (WorldDataHandler.insideTool) {
                this.hide = true;
            }
            else {
                this.setPersistentAttribute();
            }
        }
    }

    playCorrectSound() {
        const finishFlags = this.tileMapHandler.filterObjectsByTypes(ObjectTypes.FINISH_FLAG);
        const finishFlagsNeedingCoins = finishFlags.some(finishFlag => finishFlag.collectiblesNeeded);

        if (finishFlagsNeedingCoins) {
            const collectibles = WorldDataHandler.insideTool ? this.tileMapHandler.filterObjectsByTypes(ObjectTypes.COLLECTIBLE) :
                WorldDataHandler.levels[this.tileMapHandler.currentLevel].levelObjects.filter(levelObject => levelObject.type === ObjectTypes.COLLECTIBLE);
            const untouchedCollectibles = WorldDataHandler.insideTool ? collectibles.filter(collectible => !collectible.touched || collectible.collected) :
                collectibles.filter(collectible => !collectible.extraAttributes.collected);
            untouchedCollectibles.length === 1 ? SoundHandler.allCoinsCollected.stopAndPlay() : SoundHandler.pickup.play();
        }
        else {
            SoundHandler.pickup.stopAndPlay();
        }
    }

    setPersistentAttribute() {
        WorldDataHandler.levels[this.tileMapHandler.currentLevel].levelObjects.forEach(levelObject => {
            if (levelObject.x === this.initialX && levelObject.y === this.initialY && levelObject.type === this.type) {
                levelObject.extraAttributes = { collected: true };
            }
        });
        this.collected = true;
    }

    draw(spriteCanvas) {
        if (this.hide || this.collected) {
            super.drawWithAlpha(spriteCanvas, 0.1);
        }
        else {
            super.draw(spriteCanvas);
        }
    }
}