class VioletBlock extends SwitchableBlock{

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, AnimationHelper.switchableBlockColors.blue, extraAttributes);
        this.setBlockState(0, false);
    }

    resetObject() {
        if(this.tilemapHandler && !PlayMode.checkActiveCheckPoints()) {
            this.setBlockState(0, false);
        }
    }

    collisionEvent() {
    }

    draw(spriteCanvas) {
        if(this.tilemapHandler.currentJumpSwitchBlockType === this.tilemapHandler.jumpSwitchBlockTypes.violet
            && !this.active
        ) {
            this.setBlockState(this.activeTileIndex, true);
        }
        else if(this.tilemapHandler.currentJumpSwitchBlockType === this.tilemapHandler.jumpSwitchBlockTypes.pink
            && this.active
        ) {
            this.setBlockState(0, false);
        }
        super.draw(spriteCanvas);
    }
}