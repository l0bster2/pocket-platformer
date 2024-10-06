class SFX {
    constructor(x, y, tileSize, sfxIndex, direction, xspeed = 0, yspeed = 0, reduceAlpha = false, animationLength = 8, growByTimes = 0) {
        this.x = x;
        this.y = y;
        this.width = tileSize;
        this.height = tileSize;
        this.type = ObjectTypes.SFX;
        this.tileSize = tileSize;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
        this.spriteIndex = SpritePixelArrays.getIndexOfSprite(this.type, sfxIndex);
        const sprite = SpritePixelArrays.getSpritesByIndex(this.spriteIndex);
        this.animationFrames = sprite.animation.length;
        this.xCanvasOffset = 0;
        if (direction && sprite.directions) {
            this.xCanvasOffset = sprite.directions.indexOf(direction) * this.animationFrames * this.tileSize;
        }
        this.canvasYSpritePos = this.spriteIndex * this.tileSize;
        this.animationLength = animationLength;
        this.totalAnimationFrames = this.animationLength * this.animationFrames;
        this.currentFrame = 0;
        this.ended = false;
        this.alpha = 1;
        this.alphaReductionStep = 1 / (this.animationFrames * this.animationLength);
        this.reduceAlpha = reduceAlpha;
        this.growByTimes = growByTimes;
        this.growStep = 0;
        this.growAmountByStep = 0;
        if (this.growByTimes > 0) {
            const widthToGrow = this.width * this.growByTimes - this.width;
            this.growAmountByStep = widthToGrow / (this.animationFrames * this.animationLength);
        }
    }

    draw(spriteCanvas) {
        if (this.currentFrame < this.totalAnimationFrames) {
            this.x += this.xspeed;
            this.y += this.yspeed;
            this.alpha -= this.alphaReductionStep;
            if (this.growAmountByStep > 0) {
                this.width += this.growAmountByStep;
                this.height += this.growAmountByStep;
                this.x -= this.growAmountByStep / 2
                this.y -= this.growAmountByStep / 2
            }
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            this.reduceAlpha ?
                Display.drawImageWithAlpha(spriteCanvas, Math.floor(this.currentFrame / this.animationLength) * this.tileSize + this.xCanvasOffset,
                    this.canvasYSpritePos, this.tileSize, this.tileSize, this.x, this.y, this.width,
                    this.height, this.alpha > 0 ? this.alpha : 0) :
                Display.drawImage(spriteCanvas, Math.floor(this.currentFrame / this.animationLength) * this.tileSize + this.xCanvasOffset,
                    this.canvasYSpritePos, this.tileSize, this.tileSize, this.x, this.y, this.width,
                    this.height);
            this.currentFrame++;
        }
        else {
            this.ended = true;
        }
    }
}