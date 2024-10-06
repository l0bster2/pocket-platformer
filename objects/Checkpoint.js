class Checkpoint extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.active = false;
        this.tilemapHandler = tilemapHandler;
    }

    collisionEvent() {
        if (!this.active) {
            this.tilemapHandler.levelObjects.forEach(levelObject => {
                if (levelObject.type === ObjectTypes.CHECKPOINT) {
                    levelObject.active = false;
                }
            });
            this.active = true;
            SoundHandler.checkpoint.play();
        }
    }

    draw(spriteCanvas) {
        const showSecond = this.active && this?.spriteObject?.[0].animation.length > 1;
        super.drawSingleFrame(spriteCanvas, showSecond ? this.canvasXSpritePos + this.tileSize : this.canvasXSpritePos);
    }
}