class EventTrigger extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = 0;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.resetObject();
        this.adaptWidthToSize();
        this.tilemapHandler = tilemapHandler;
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

    setNewBackgroundImage(imageName, backgroundImageSize) {
        const newImage = ImageHandler.images.find((image) =>
            image.name === imageName);
        if (newImage) {
            ImageHandler.currentLevelImage = newImage;
            ImageHandler.currentLevelImageSize = backgroundImageSize;
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
                        break;
                    case "background-image":
                        this.setNewBackgroundImage(event.backgroundImage, event.backgroundImageSize);
                        break;
                    case "background-color":
                        WorldColorChanger.setColorInGameCanvas(event.backgroundColor, event.animationDuration);
                        break;
                    case "play-sound":
                        SoundHandler[event.sound] && SoundHandler[event.sound].stopAndPlay();
                        break;
                    case "change-music":
                        SoundHandler[event.music] && SoundHandler.changeSong(event.music);
                        break;
                    case "show-static-image":
                        const imgObj = new ImageInGame(event.imageName, event.imageAnimationDuration, event.fadeInAnimation, event.fadeInAnimationDuration, event.staticImageSize);
                        this.tilemapHandler.levelObjects.push(imgObj);
                        break;
                    case "open-url":
                        const a = document.createElement("a");
                        a.href = event.url;
                        const evt = document.createEvent("MouseEvents");
                        evt.initMouseEvent(
                            "click",
                            true,
                            true,
                            window,
                            0,
                            0,
                            0,
                            0,
                            0,
                            true,
                            false,
                            false,
                            false,
                            0,
                            null
                        );
                        a.dispatchEvent(evt);
                        break;
                }
            })
        }
    }

    draw(spriteCanvas) {
        if (Game.playMode === Game.BUILD_MODE || this.spriteObject?.[0].showInGame) {
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
