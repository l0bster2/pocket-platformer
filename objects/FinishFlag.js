class FinishFlag extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.used = false;
        this.tilemapHandler = tilemapHandler;
        this.changeableInBuildMode = true;
        this.lockedSpriteIndex = SpritePixelArrays.getIndexOfSprite(ObjectTypes.FINISH_FLAG_CLOSED);
        this.lockedSpriteYPos = this.lockedSpriteIndex * this.tileSize;
        this.locked = false;
        if (!WorldDataHandler.insideTool) {
            this.persistentCollectibles = WorldDataHandler.levels[this.tilemapHandler.currentLevel].levelObjects.filter(
                levelObject => levelObject.type === ObjectTypes.COLLECTIBLE
            );
        }
    }

    collisionEvent() {
        if (this.used || this.locked) {
            return;
        }
        
        this.sendPlayerThroughExit();
    }

    sendPlayerThroughExit() {
        this.used = true;
        SoundHandler.win.stopAndPlay();
        PlayMode.playerExitLevel(this.customExit);
    }

    changeExit(customExit, reciprocatingLevelIndex) {
        this.addChangeableAttribute("customExit", customExit);
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
            this.locked = false;
        }
        else {
            const collectibles = this.tilemapHandler.filterObjectsByTypes(ObjectTypes.COLLECTIBLE);
            if (!collectibles || this.checkIfAllCollectiblesCollected(collectibles)) {
                super.draw(spriteCanvas);
                this.locked = false;
            }
            else {
                super.draw(spriteCanvas, this.lockedSpriteYPos)
                this.locked = true;
            }
        }
    }
}