class PathPoint extends LevelObject {

    constructor(x, y, tileSize, alignment = AnimationHelper.alignments.horizontal) {
        super(x, y, tileSize, ObjectTypes.PATH_POINT);
        this.alignment = alignment;
        this.changeableInBuildMode = true;
        this.key = this.makeid(5);
    }

    getPath() {
        return tileMapHandler?.paths.find(path => {
            return path?.pathPoints.find(pathPoint =>
                pathPoint.key === this.key
            )
        });
    }

    getPathValue(attributeName) {
        return this.getPath()?.[attributeName];
    }

    addChangeableAttribute(attributeName, value) {
        const currentPath = this.getPath();
        currentPath[attributeName] = value;
        currentPath.recalculateSteps();
        WorldDataHandler?.levels[tileMapHandler.currentLevel]?.paths.forEach(path => {
            path.pathPoints.forEach(pathPoint => {
                if (pathPoint.initialX === this.initialX && pathPoint.initialY === this.initialY) {
                    path[attributeName] = value;
                }
            })
        });
    }

    draw(spriteCanvas) {
        const animationLength = this?.spriteObject?.[0].animation.length || 0;
        const cornerAlignment = this.alignment === AnimationHelper.alignments.corner;
        const extraCanvasX = this.alignment === AnimationHelper.alignments.vertical || cornerAlignment
            ? animationLength * this.tileSize : 0;

        if (animationLength > 1 && Game.playMode === Game.PLAY_MODE) {
            const frameModulo = tileMapHandler.currentGeneralFrameCounter % 40;
            this.displaySprite(spriteCanvas, frameModulo < AnimationHelper.defaultFrameDuration ? this.canvasXSpritePos : this.canvasXSpritePos + this.tileSize, extraCanvasX, cornerAlignment);
        }
        else {
            this.displaySprite(spriteCanvas, this.canvasXSpritePos, extraCanvasX, cornerAlignment);
        }
    }

    displaySprite(spriteCanvas, canvasXSpritePos, extraCanvasX, showBothAlignedSpritesOnTop) {
        super.drawSingleFrame(spriteCanvas, canvasXSpritePos + extraCanvasX);
        if (showBothAlignedSpritesOnTop) {
            super.drawSingleFrame(spriteCanvas, canvasXSpritePos);
        }
    }
}