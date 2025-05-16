class EventTrigger extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = 0;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.resetObject();
        this.adaptWidthToSize();
        this.colissionFunction = this.fakeColission;
    }

    fakeColission(obj, levelObject) {
        return Collision.objectsColliding(obj, levelObject.fakeHitBox);
    }

    resetObject() {
        this.touched = false;
    }

    adaptWidthToSize() {
        this.displayedWidth = this.width * this.tileSize;
        this.displayedHeight = this.height * this.tileSize;
        this.fakeHitBox = {
            y: this.getHitBoxYOffset(),
            x: this.getHitBoxXOffset(),
            width: this.displayedWidth,
            height: this.displayedHeight,
            hitBoxOffset: 0,
        };
    }

    getHitBoxXOffset() {
        return this.x - ((this.width - 1) / 2 * this.tileSize);
    }

    getHitBoxYOffset() {
        return this.y - ((this.height - 1) / 2 * this.tileSize);
    }

    addChangeableAttribute(attribute, value, levelToChange = null) {
        super.addChangeableAttribute(attribute, value, levelToChange);
        if (attribute === SpritePixelArrays.changeableAttributeTypes.height || attribute === SpritePixelArrays.changeableAttributeTypes.width) {
            this.adaptWidthToSize();
        }
    }

    setNewBackgroundImage(imageName) {
        const newImage = ImageHandler.images.find((image) =>
            image.name === imageName);
        if (newImage) {
            ImageHandler.currentLevelImage = newImage;
            ImageHandler.initializeImageOnImageCanvas(newImage);
        }
    }

    collisionEvent() {
        if (!this.touched) {
            this.touched = true;

            this.events.forEach(event => {
                switch (event.type) {
                    case "screenshake":
                        Camera.setScreenShake(event.screenshakeDuration, event.screenshakeIntensity);
                    case "background-image":
                        this.setNewBackgroundImage(event.backgroundImage)
                }
            })
        }
    }

    draw(spriteCanvas) {
        if (Game.playMode === Game.BUILD_MODE) {
            super.draw(spriteCanvas);

            if (this.width > 1 || this.height > 1) {
                const xDifference = Math.ceil(this.width / 2) - 1;
                const xStartingPoint = this.initialX - xDifference;
                const xEndingPoint = this.initialX + xDifference;

                const yDifference = Math.ceil(this.height / 2) - 1;
                const yStartingPoint = this.initialY - yDifference;
                const yEndingPoint = this.initialY + yDifference;

                for (var i = xStartingPoint; i <= xEndingPoint; i++) {
                    for (var j = yStartingPoint; j <= yEndingPoint; j++) {
                        Display.drawImageWithAlpha(spriteCanvas, 0, this.canvasYSpritePos, this.tileSize, this.tileSize,
                            i * this.tileSize, j * this.tileSize,
                            this.tileSize, this.tileSize, 0.5);
                    }
                }
            }
        }
    }
}