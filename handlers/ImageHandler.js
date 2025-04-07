class ImageHandler {

    static staticConstructor() {
        this.imageCanvas = document.getElementById("imagePreviewCanvas");
        this.imageCanvasCtx = this.imageCanvas.getContext("2d");

        this.images = [
            { name: "Background example 1", value: Base64BackgroundImages.backgroundExample1, width: 736, height: 621 },
            { name: "Background example 2", value: Base64BackgroundImages.backgroundExample2, width: 1920, height: 1080 },
        ];
        if (this.images.length) {
            this.initializeImageOnImageCanvas(this.images[0])
        }
        this.currentLevelImage = null;
        this.imageToDelete = null;
    }

    static showDeleteLevelModal(name) {
        this.imageToDelete = name;
        ModalHandler.showModal('deleteImageModal');
    }

    static deleteImage() {
        const index = this.images.findIndex(image => image.name === this.imageToDelete);
        if (this.currentLevelImage.name === this.imageToDelete) {
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
        }
        )
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
        let imageName = WorldDataHandler.backgroundImage;
        const levelImage = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImage;
        if (levelImage) {
            imageName = levelImage;
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

    static displayBackgroundImage() {
        if (this.currentLevelImage) {
            Display.drawImage(this.imageCanvas, 0, 0,
                this.currentLevelImage.width, this.currentLevelImage.height,
                0, 0,
                Camera.originalWidth, Camera.originalHeight);
        }
    }
}