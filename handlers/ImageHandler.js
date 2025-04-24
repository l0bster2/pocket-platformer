class ImageHandler {

    static staticConstructor() {
        this.imageCanvas = document.getElementById("imagePreviewCanvas");
        this.imageCanvasCtx = this.imageCanvas.getContext("2d");
        this.currentHorizontalScrollingPos = 0;
        this.horizontalScrollingSpeed = -0.2;

        this.currentVerticalScrollingPos = 0;
        this.verticalScrollingSpeed = -0.2;
        this.images = [
            { name: "Castle.png", value: Base64BackgroundImages.backgroundExample1, width: 1280, height: 720 },
            { name: "Nightsky.png", value: Base64BackgroundImages.backgroundExample2, width: 1280, height: 720 },
            { name: "Swamp.png", value: Base64BackgroundImages.backgroundExample3, width: 1280, height: 720 },
            { name: "Spooky.png", value: Base64BackgroundImages.backgroundExample4, width: 1280, height: 720 },
        ];
        if (this.images.length) {
            this.initializeImageOnImageCanvas(this.images[0])
        }
        this.currentLevelImage = null;
        this.imageToDelete = null;

        this.scrollMapper = {
            1: 0.2,
            2: 0.5,
            3: 1,
            4: 2,
            5: 4,
            6: 6,
            7: 8,
            8: 12
        }
    }

    static showDeleteLevelModal(name) {
        this.imageToDelete = name;
        ModalHandler.showModal('deleteImageModal');
    }

    static deleteImage() {
        const index = this.images.findIndex(image => image.name === this.imageToDelete);
        if (this.currentLevelImage && this.currentLevelImage.name === this.imageToDelete) {
            this.currentLevelImage = null;
            this.imageCanvasCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
        }
        if (index !== -1) {
            this.images.splice(index, 1);
            ImageHandlerRenderer.createImageOverview();
            ModalHandler.closeModal('deleteImageModal');
        }
        WorldDataHandler.levels.forEach(level => {
            if (level.backgroundImage === this.imageToDelete) {
                level.backgroundImage = null;
            }
        })
        if (WorldDataHandler.backgroundImage === this.imageToDelete) {
            WorldDataHandler.backgroundImage = null;
        }
        this.images.length ? this.showPreviewImage(this.images[0].name) :
            this.imageCanvasCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
    }

    static switchTouploadView() {
        ModalHandler.closeModal('worldColorModal');
        changeView("images");
    }

    static uploadNewImage() {
        var file = document.getElementById("uploadImage").files[0];
        if (file) {
            const reader = new FileReader();
            try {
                reader.onload = (e) => {
                    const base64String = e.target.result;
                    const img = new Image();

                    img.onload = () => {
                        // Display preview
                        const newImage = {
                            name: file.name, value: base64String, width: img.width, height: img.height
                        };
                        this.images.push(newImage);
                        ImageHandlerRenderer.createImageOverview();
                        this.showPreviewImage(newImage.name)
                    };
                    img.src = base64String;
                };

                reader.readAsDataURL(file);
            }
            catch (e) {
                console.log("could not upload image")
            }

        }
    }

    static showPreviewImage(name) {
        const previewImage = this.images.find(image => image.name === name);
        this.initializeImageOnImageCanvas(previewImage);
    }

    static setBackgroundImage() {
        this.currentVerticalScrollingPos = 0;
        this.currentHorizontalScrollingPos = 0;
        let imageName = WorldDataHandler.backgroundImage;
        this.currentLevelImageSize = WorldDataHandler.backgroundImageSize;
        const levelImage = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImage;
        if (levelImage && levelImage !== "none") {
            imageName = levelImage;
            this.currentLevelImageSize = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImageSize;
        }
        const newImage = this.images.find((image) =>
            image.name === imageName);
        if (newImage) {
            this.currentLevelImage = newImage;
            this.initializeImageOnImageCanvas(newImage);
        }
        else {
            this.imageCanvasCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
            this.currentLevelImage = null;
        }
    }

    static initializeImageOnImageCanvas(image) {
        this.imageCanvasCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
        const img = new Image();
        img.onload = () => {
            this.imageCanvas.width = image.width;
            this.imageCanvas.height = image.height;
            this.imageCanvasCtx.drawImage(img, 0, 0);
        };

        img.src = image.value;
    }

    static changeScrollSpeed(event) {
        const value = event.target.value;
        const realValue = this.scrollMapper[value];
        this.horizontalScrollingSpeed = realValue * -1;
        document.getElementById("scrollSpeedWorldValue").innerHTML = realValue;
    }

    static displayBackgroundImage() {
        if (this.currentLevelImage) {
            switch (this.currentLevelImageSize) {
                case "stretch":
                    Display.drawImage(this.imageCanvas, 0, 0,
                        this.currentLevelImage.width, this.currentLevelImage.height,
                        0, 0,
                        tileMapHandler.levelWidthInPx, tileMapHandler.levelHeightInPx);
                    break;
                case "original":
                    Display.drawImage(this.imageCanvas, 0, 0,
                        this.currentLevelImage.width, this.currentLevelImage.height,
                        0, 0,
                        this.currentLevelImage.width, this.currentLevelImage.height);
                    break;
                case "fixed":
                    Display.drawImage(this.imageCanvas, 0, 0,
                        this.currentLevelImage.width, this.currentLevelImage.height,
                        Camera.viewport.left, Camera.viewport.top,
                        Camera.viewport.width, Camera.viewport.height);
                    break;
                case "horizontalScroll":
                    if (Game.playMode === Game.PLAY_MODE) {
                        this.currentHorizontalScrollingPos += this.horizontalScrollingSpeed;
                        if (this.currentHorizontalScrollingPos <= Camera.viewport.width * -1) {
                            this.currentHorizontalScrollingPos = 0;
                        }
                    }
                    else {
                        this.currentHorizontalScrollingPos = 0;
                    }
                    const backgroundImageAmount = Math.round(tileMapHandler.levelWidthInPx / Camera.viewport.width) + 1;
                    for (var i = 0; i < backgroundImageAmount; i++) {
                        Display.drawImage(this.imageCanvas, 0, 0,
                            this.currentLevelImage.width, this.currentLevelImage.height,
                            Camera.viewport.width * i + this.currentHorizontalScrollingPos, Camera.viewport.top,
                            Camera.viewport.width, Camera.viewport.height);
                    }
                    break;
                case "verticalScroll":
                    if (Game.playMode === Game.PLAY_MODE) {
                        this.currentVerticalScrollingPos += this.verticalScrollingSpeed;
                        if (this.currentVerticalScrollingPos <= Camera.viewport.height * -1) {
                            this.currentVerticalScrollingPos = 0;
                        }
                    }
                    else {
                        this.currentVerticalScrollingPos = 0;
                    }
                    const verticalBackgroundImageAmount = Math.round(tileMapHandler.levelHeightInPx / Camera.viewport.height) + 1;
                    for (var i = 0; i < verticalBackgroundImageAmount; i++) {
                        Display.drawImage(this.imageCanvas, 0, 0,
                            this.currentLevelImage.width, this.currentLevelImage.height,
                            Camera.viewport.left, Camera.viewport.height * i + this.currentVerticalScrollingPos,
                            Camera.viewport.width, Camera.viewport.height);
                    }
                    break;
                default:
                    break;
            }

        }
    }
}