class ImageInGame {

    constructor(imageName, maxDuration) {
        this.img = new Image();
        const currentImage = ImageHandler.images.find(image => image.name === imageName);
        this.img.src = currentImage.value;
        this.imageWidth = currentImage.width;
        this.imageHeight = currentImage.height;
        this.currentFrame = 0;
        this.maxFrames = maxDuration * 60; // seconds * fps
        this.type = ObjectTypes.IMAGE_IN_GAME;
        this.loaded = false;
        this.img.onload = () => {
            this.loaded = true;
        }
        this.key = TilemapHelpers.makeid(4);
        this.colissionFunction = () => {};
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

    draw(spriteCanvas) {
        if (this.loaded) {
            this.currentFrame++;
            const { width, height, top, left } = Camera.viewport;
            Display.drawImage(this.img, left, top, this.imageWidth, this.imageHeight, left, top, width, height);

            if (this.currentFrame >= this.maxFrames) {
                this.deleteSelf();
            }
        }
    }
}