class BlueBlock extends SwitchableBlock{

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, AnimationHelper.switchableBlockColors.blue, extraAttributes);
        this.setBlockState(0, false);
        this.checkCurrentlyActiveBlock();
    }

    resetObject() {
        if(this.tilemapHandler && !PlayMode.checkActiveCheckPoints()) {
            this.setBlockState(0, false);
        }
    }

    checkCurrentlyActiveBlock(){
        const result = this?.tilemapHandler?.levelObjects && this.tilemapHandler.levelObjects.find(levelObject => levelObject.type === ObjectTypes.RED_BLUE_BLOCK_SWITCH);
        if(result?.currentlyActiveColor === this.color) {
            this.setBlockState(this.activeTileIndex, true);
        }
    }

    collisionEvent() {
    }
}