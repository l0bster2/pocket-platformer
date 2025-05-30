class ImageInGame {

    constructor(imageName, maxDuration, fadeAnimation, fadeInAnimationDuration, size) {
        this.colissionFunction = () => { };
        this.img = new Image();
        const currentImage = ImageHandler.images.find(image => image.name === imageName);
        this.img.src = currentImage.value;
        this.imageWidth = currentImage.width;
        this.imageHeight = currentImage.height;
        this.currentFrame = 0;
        this.maxFrames = maxDuration * 60; // seconds * fps
        this.type = ObjectTypes.IMAGE_IN_GAME;
        this.fadeInAnimation = fadeAnimation;
        this.loaded = false;
        this.img.onload = () => {
            this.loaded = true;
            PlayMode.currentPauseFrames = this.maxFrames;
        }
        this.size = size;
        this.fadeInAnimationDuration = fadeInAnimationDuration * 60;
        this.key = TilemapHelpers.makeid(4);
        this.displayWidth = Camera.viewport.width / 100 * this.size;
        this.displayHeight = Camera.viewport.height / 100 * this.size;

        this.currentX = Camera.viewport.left + ((Camera.viewport.width - this.displayWidth) / 2);
        this.currentY = Camera.viewport.top + ((Camera.viewport.height - this.displayHeight) / 2);
        this.currentAlpha = 1;

        if (this.fadeInAnimation === "swipe-left") {
            this.currentX = this.currentX - Camera.viewport.width;
        }
        else if (this.fadeInAnimation === "swipe-top") {
            this.currentY = this.currentY - Camera.viewport.height;
        }
        else if (this.fadeInAnimation === "swipe-right") {
            this.currentX = this.currentX + Camera.viewport.width;
        }
        else if (this.fadeInAnimation === "swipe-bottom") {
            this.currentY = this.currentY + Camera.viewport.height;
        }
        if (this.fadeInAnimation === "fadeIn") {
            this.currentAlpha = 0;
        }
        this.xStep = Camera.viewport.width / this.fadeInAnimationDuration;
        this.yStep = Camera.viewport.height / this.fadeInAnimationDuration;
        this.alphaStep = 1 / this.fadeInAnimationDuration;
    }

    collisionEvent() {
    }

    deleteSelf() {
        for (var i = tileMapHandler.levelObjects.length - 1; i >= 0; i--) {
            var levelObject = tileMapHandler.levelObjects[i];
            if (this.key === levelObject.key && levelObject.type === this.type) {
                tileMapHandler.levelObjects.splice(i, 1);
                break;
            }
        }
    }

    checkSwipeAnimation() {
        if (this.fadeInAnimation === "swipe-left") {
            if (this.currentFrame <= this.fadeInAnimationDuration) {
                this.currentX += this.xStep;
            }
            else if (this.currentFrame >= this.maxFrames - this.fadeInAnimationDuration) {
                this.currentX -= this.xStep;
            }
        }
        else if (this.fadeInAnimation === "swipe-top") {
            if (this.currentFrame <= this.fadeInAnimationDuration) {
                this.currentY += this.yStep;
            }
            else if (this.currentFrame >= this.maxFrames - this.fadeInAnimationDuration) {
                this.currentY -= this.yStep;
            }
        }
        else if (this.fadeInAnimation === "swipe-right") {
            if (this.currentFrame <= this.fadeInAnimationDuration) {
                this.currentX -= this.xStep;
            }
            else if (this.currentFrame >= this.maxFrames - this.fadeInAnimationDuration) {
                this.currentX += this.xStep;
            }
        }
        else if (this.fadeInAnimation === "swipe-bottom") {
            if (this.currentFrame <= this.fadeInAnimationDuration) {
                this.currentY -= this.yStep;
            }
            else if (this.currentFrame >= this.maxFrames - this.fadeInAnimationDuration) {
                this.currentY += this.yStep;
            }
        }
    }

    checkFadeInAnimation() {
        if (this.fadeInAnimation === "fadeIn") {
            if (this.currentFrame <= this.fadeInAnimationDuration && this.currentAlpha < 1) {
                this.currentAlpha += this.alphaStep;
                if (this.currentAlpha > 1) {
                    this.currentAlpha = 1;
                }
            }
            else if (this.currentFrame >= this.maxFrames - this.fadeInAnimationDuration && this.currentAlpha > 0) {
                this.currentAlpha -= this.alphaStep;
                if (this.currentAlpha < 0) {
                    this.currentAlpha = 0;
                }
            }
        }
    }

    draw(spriteCanvas) {
        if (this.loaded) {
            this.currentFrame++;
            const { width, height } = Camera.viewport;
            this.checkSwipeAnimation();
            this.checkFadeInAnimation();

            Display.drawImageWithAlpha(this.img, 0, 0, this.imageWidth, this.imageHeight, this.currentX, this.currentY, this.displayWidth, this.displayHeight, this.currentAlpha);

            if (this.currentFrame >= this.maxFrames) {
                this.deleteSelf();
            }
        }
    }
}