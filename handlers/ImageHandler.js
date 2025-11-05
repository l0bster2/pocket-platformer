class ImageHandler {

    static staticConstructor() {
        this.imageCanvas = document.getElementById("imagePreviewCanvas");
        this.imageCanvasCtx = this.imageCanvas.getContext("2d");
        this.currentHorizontalScrollingPos = 0;
        this.scrollSpeed = -0.2;
        this.currentScrollingPos = 0;
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
        this.showFirstPreviewImage();
    }

    static showFirstPreviewImage() {
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
        this.initializeImageOnImageCanvas(previewImage, true);
    }

    static setBackgroundImage() {
        this.currentScrollingPos = 0;
        this.scrollSpeed = WorldDataHandler.backgroundImageScrollSpeed;
        let imageName = WorldDataHandler.backgroundImage;
        this.currentLevelImageSize = WorldDataHandler.backgroundImageSize;
        const levelImage = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImage;
        if (levelImage && levelImage !== "none") {
            imageName = levelImage;
            this.currentLevelImageSize = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImageSize;
            if (this.currentLevelImageSize === 'horizontalScroll' || this.currentLevelImageSize === 'verticalScroll') {
                this.scrollSpeed = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImageScrollSpeed;
            }
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
            const smallPreviewCanvas = document.getElementById("backgroundSmallPreview");
            const smallPreviewCanvasWrapper = document.getElementById("backgroundSmallPreviewWrapper");
            const smallPreviewCanvasCtx = smallPreviewCanvas.getContext("2d");
            smallPreviewCanvasCtx.clearRect(0, 0, smallPreviewCanvas.width, smallPreviewCanvas.height);
            smallPreviewCanvasWrapper.style.display = "none";

        }
    }

    static initializeImageOnImageCanvas(image, defaultPreview = false) {
        this.imageCanvasCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
        const img = new Image();
        img.onload = () => {
            if (this.currentLevelImageSize === "horizontalScroll" && !defaultPreview) {
                const backgroundImageAmount = Math.round(tileMapHandler.levelWidthInPx / Camera.viewport.width) + 1;
                this.imageCanvas.width = img.width * backgroundImageAmount;
                this.imageCanvas.height = img.height;

                for (let i = 0; i < backgroundImageAmount; i++) {
                    this.imageCanvasCtx.drawImage(img, i * img.width, 0);
                }
            }
            else if (this.currentLevelImageSize === "verticalScroll" && !defaultPreview) {
                const backgroundImageAmount = Math.round(tileMapHandler.levelHeightInPx / Camera.viewport.height) + 1;
                this.imageCanvas.width = img.width;
                this.imageCanvas.height = img.height * backgroundImageAmount;

                for (let i = 0; i < backgroundImageAmount; i++) {
                    this.imageCanvasCtx.drawImage(img, 0, i * img.height);
                }
            }
            else {
                this.imageCanvas.width = image.width;
                this.imageCanvas.height = image.height;
                this.imageCanvasCtx.drawImage(img, 0, 0);
            }
            const smallPreviewCanvas = document.getElementById("backgroundSmallPreview");
            const smallPreviewCanvasWrapper = document.getElementById("backgroundSmallPreviewWrapper");
            const smallPreviewCanvasCtx = smallPreviewCanvas.getContext("2d");
            smallPreviewCanvasWrapper.style.display = "flex";
            smallPreviewCanvasCtx.drawImage(img, 0, 0, image.width, image.height, 0, 0, smallPreviewCanvas.width, smallPreviewCanvas.height);
        };

        img.src = image.value;
    }

    static changeWorldScrollSpeed(event) {
        const value = event.target.value;
        const realValue = this.scrollMapper[value];
        WorldDataHandler.backgroundImageScrollSpeed = realValue;
        document.getElementById("scrollSpeedWorldValue").innerHTML = realValue;
        ImageHandler.setBackgroundImage();
    }

    static changeLevelScrollSpeed(event) {
        const value = event.target.value;
        const realValue = this.scrollMapper[value];
        WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImageScrollSpeed = realValue;
        document.getElementById("scrollSpeedLevelValue").innerHTML = realValue;
        ImageHandler.setBackgroundImage();
    }

    static updateScrollPos(maxPos) {
        if (Game.playMode === Game.PLAY_MODE) {
            this.currentScrollingPos += this.scrollSpeed * -1;
            if (this.currentScrollingPos <= maxPos) {
                this.currentScrollingPos = 0;
            }
        }
        else {
            this.currentScrollingPos = 0;
        }
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
                    this.updateScrollPos(Camera.viewport.width * -1);
                    const backgroundImageAmount = Math.round(tileMapHandler.levelWidthInPx / Camera.viewport.width) + 1;

                    Display.drawImage(this.imageCanvas, 0, 0,
                        this.currentLevelImage.width * backgroundImageAmount, this.currentLevelImage.height,
                        this.currentScrollingPos, Camera.viewport.top,
                        Camera.viewport.width * backgroundImageAmount, Camera.viewport.height);
                    break;
                case "verticalScroll":
                    this.updateScrollPos(Camera.viewport.height * -1);
                    const verticalBackgroundImageAmount = Math.round(tileMapHandler.levelWidthInPx / Camera.viewport.width) + 1;

                    Display.drawImage(this.imageCanvas, 0, 0,
                        this.currentLevelImage.width, this.currentLevelImage.height * verticalBackgroundImageAmount,
                        Camera.viewport.left, this.currentScrollingPos,
                        Camera.viewport.width, Camera.viewport.height * verticalBackgroundImageAmount);
                    break;
                default:
                    break;
            }

        }
    }
}