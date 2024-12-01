class LevelObject {

    constructor(x, y, tileSize, type) {
        this.initialX = x;
        this.initialY = y;
        this.x = x * tileSize;
        this.y = y * tileSize;
        this.width = tileSize;
        this.height = tileSize;
        this.type = type;
        this.tileSize = tileSize;
        this.xspeed = 0;
        this.yspeed = 0;
        this.setSpriteAttributes(this.type);
        AnimationHelper.setInitialSquishValues(this, this.tileSize);
        this.colissionFunction = Collision.objectsColliding;
    }

    setSpriteAttributes(type) {
        this.spriteIndex = SpritePixelArrays.getIndexOfSprite(type);
        this.spriteObject = SpritePixelArrays.getSpritesByName(type);
        this.canvasYSpritePos = this.spriteIndex * this.tileSize;
        this.canvasXSpritePos = 0;
    }

    makeid(length) {
        return TilemapHelpers.makeid(length);
    }

    drawSingleFrame(spriteCanvas, canvasXSpritePos, canvasYSpritePos = this.canvasYSpritePos) {
        Display.drawImage(spriteCanvas, canvasXSpritePos, canvasYSpritePos,
            this.tileSize, this.tileSize, this.x, this.y, this.tileSize, this.tileSize);
    }

    draw(spriteCanvas, canvasYSpritePos) {
        const drawFunction = (canvasXSpritePos) => this.drawSingleFrame(spriteCanvas, canvasXSpritePos, canvasYSpritePos);
        this.checkFrameAndDraw(drawFunction);
    }

    drawSingleSquishingFrame(spriteCanvas, canvasXSpritePos) {
        AnimationHelper.checkSquishUpdate(this);
        Display.drawImage(spriteCanvas, canvasXSpritePos, this.canvasYSpritePos,
            this.tileSize, this.tileSize, this.x - this.squishXOffset, this.y - this.squishYOffset, this.drawWidth, this.drawHeight);
    }

    drawWithSquishing(spriteCanvas) {
        const drawFunction = (canvasXSpritePos) => this.drawSingleSquishingFrame(spriteCanvas, canvasXSpritePos);
        this.checkFrameAndDraw(drawFunction);
    }

    drawSingleAlphaFrame(spriteCanvas, alpha, canvasXSpritePos) {
        AnimationHelper.checkSquishUpdate(this);
        Display.drawImageWithAlpha(spriteCanvas, canvasXSpritePos, this.canvasYSpritePos,
            this.tileSize, this.tileSize, this.x, this.y, this.tileSize, this.tileSize, alpha);
    }

    drawWithAlpha(spriteCanvas, alpha) {
        const drawFunction = (canvasXSpritePos) => this.drawSingleAlphaFrame(spriteCanvas, alpha, canvasXSpritePos);
        this.checkFrameAndDraw(drawFunction);
    }

    drawWithRotation(spriteCanvas, angle = 0) {
        let drawFunction = (canvasXSpritePos) => Display.drawImageWithRotation(spriteCanvas, canvasXSpritePos, this.canvasYSpritePos,
            this.tileSize, this.tileSize, this.x, this.y, this.tileSize, this.tileSize, angle);
        //Included squishing function right here, because rotating enemies are so rare
        if (this.spriteObject?.[0].squishAble) {
            AnimationHelper.checkSquishUpdate(this);
            drawFunction = (canvasXSpritePos) => Display.drawImageWithRotation(spriteCanvas, canvasXSpritePos, this.canvasYSpritePos,
                this.tileSize, this.tileSize, this.x - this.squishXOffset, this.y - this.squishYOffset, this.drawWidth, this.drawHeight, angle);
        }
        this.checkFrameAndDraw(drawFunction);
    }

    checkFrame() {
        const frameModulo = tileMapHandler.currentGeneralFrameCounter % 40;
        return frameModulo < AnimationHelper.defaultFrameDuration;
    }

    checkFrameAndDraw(drawFunction) {
        if (this?.spriteObject?.[0].animation.length > 1 && Game.playMode === Game.PLAY_MODE) {
            if (this.checkFrame()) {
                drawFunction(this.canvasXSpritePos);
            }
            else {
                drawFunction(this.canvasXSpritePos + this.tileSize);
            }
        }
        else {
            drawFunction(this.canvasXSpritePos);
        }
    }
}