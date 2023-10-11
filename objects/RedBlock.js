class RedBlock extends SwitchableBlock {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, AnimationHelper.switchableBlockColors.red, extraAttributes);
        this.setBlockState(this.activeTileIndex, true);
        this.checkCurrentlyActiveBlock();
    }

    resetObject() {
        if(this.tilemapHandler && !PlayMode.checkActiveCheckPoints()) {
            this.setBlockState(this.activeTileIndex, true);
        }
    }

    checkCurrentlyActiveBlock(){
        const result = this?.tilemapHandler?.levelObjects && this.tilemapHandler.levelObjects.find(levelObject => levelObject.type === ObjectTypes.RED_BLUE_BLOCK_SWITCH);
        if(!result) {
            this.setBlockState(this.activeTileIndex, true);
        }
        else if(result.currentlyActiveColor === this.color) {
            this.setBlockState(this.activeTileIndex, true);
        }
        else {
            this.setBlockState(0, false);
        }
    }

    collisionEvent() {
    }
}