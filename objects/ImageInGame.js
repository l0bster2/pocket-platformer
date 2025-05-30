class ImageInGame extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);

        this.img = new Image();
        this.img.src = ImageHandler.images[0].value;
        this.currentFrame = 0;
        this.maxFrames = 300;
        this.loaded = false;
        img.onload = () => {
            this.loaded = true;
        }
    }

    collisionEvent() {
    }

    draw(spriteCanvas) {
        if(this.loaded) {
            const {width, height, top, left} = Camera.viewport;
            Display.drawImage(this.img, left, top, width, height, left, top, width, height);
        }
    }
}