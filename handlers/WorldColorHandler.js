class WorldColorHandler {
    static staticConstructor() {
        const huebeeProperties = Helpers.getHuebeeDefaultProperties();
        this.backgroundHuebee = new Huebee('.color-input-background', {
            ...huebeeProperties
        });
        this.backgroundHuebee.on('change', (color) => {
            WorldDataHandler.backgroundColor = color.replace("#", "");
            WorldColorChanger.setBackgroundColor(color);
            this.backgroundHuebee.close();
        })
        this.backgroundHuebee.setColor("#" + WorldDataHandler.backgroundColor);

        this.textHuebee = new Huebee('.color-input-text', {
            ...huebeeProperties
        });
        this.textHuebee.on('change', (color) => {
            WorldColorChanger.setTextColor(color);
            this.textHuebee.close();
        })
        this.textHuebee.setColor("#" + WorldDataHandler.textColor);

        this.backgroundLevelHuebee = new Huebee('.color-input-level-background', {
            ...huebeeProperties
        });
        this.backgroundLevelHuebee.on('change', (color) => {
            WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundColor = color.replace("#", "");;
            WorldColorChanger.setBackgroundColor(color);
            this.setLevelColorInUi();
            this.backgroundLevelHuebee.close();
        })
    }

    static setLevelColorInUi() {
        const levelColorButton = document.getElementById("levelColorButton");
        levelColorButton.classList.add("buttonWithIconAndText");
        document.getElementById("deleteLevelColorButton").style.display = "block";
    }

    static resetLevelColorUI() {
        document.getElementById("deleteLevelColorButton").style.display = "none";
        const levelColorButton = document.getElementById("levelColorButton");
        levelColorButton.classList.remove("buttonWithIconAndText");
        levelColorButton.innerHTML = `<img alt="plus" width="80" height="40" src="images/icons/transparentIcon.svg" class="iconInButtonWithText"> `;
        levelColorButton.value = "transp";
    }

    static fillImageBackgroundSelectWithValues(element) {
        var i, L = element.options.length - 1;
        for (i = L; i >= 0; i--) {
            element.remove(i);
        }

        var emptyEl = document.createElement("option");
        emptyEl.textContent = "None";
        emptyEl.value = "none";
        element.appendChild(emptyEl);

        ImageHandler.images.forEach(image => {
            var el = document.createElement("option");
            el.textContent = image.name;
            el.value = image.name;
            element.appendChild(el);
        })
    }

    static changeLevelBackgroundImage(event) {
        const value = event.target.value;
        WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImage = value || null;
        if(WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImageSize == null) {
            WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImageSize = 'stretch';
        }
        ImageHandler.setBackgroundImage();
        document.getElementById("imageSizeLevelSelectorWrapper").style.display = value === "none" || value === null ? "none" : "block";
    }

    static changeWorldBackgroundImage(event) {
        const value = event.target.value;
        WorldDataHandler.backgroundImage = value || null;
        if(WorldDataHandler.backgroundImageSize == null) {
            WorldDataHandler.backgroundImageSize = 'stretch';
        }
        ImageHandler.setBackgroundImage();
        //document.getElementById("imageSizeWorldSelectorWrapper").style.display = backgroundImageWorldSelector.value === "none" || backgroundImageWorldSelector.value === null ? "none" : "block";
    }

    static changeLevelImageSize(event) {
        const value = event.target.value;
        WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImageSize = value || null;
        if(value === 'verticalScroll' || value === 'horizontalScroll') {
            document.getElementById("levelScrollSpeed").style.display = "block";
        }
        else {
            document.getElementById("levelScrollSpeed").style.display = "none";
        }
        ImageHandler.setBackgroundImage();
    }

    static changeWorldImageSize(event) {
        const value = event.target.value;
        WorldDataHandler.backgroundImageSize = value || null;
        ImageHandler.setBackgroundImage();
        if(value === 'verticalScroll' || value === 'horizontalScroll') {
            document.getElementById("worldScrollSpeed").style.display = "block";
        }
        else {
            document.getElementById("worldScrollSpeed").style.display = "none";
        }
    }

    static initializeBackgroundImageSelects() {
        const backgroundImageWorldSelector = document.getElementById("backgroundImageWorldSelector");
        const backgroundImageLevelSelector = document.getElementById("backgroundImageLevelSelector");
        const backgroundImageSizeLevelSelector = document.getElementById("imageSizeLevelSelectorWrapper");
        //const backgroundImageSizeWorldSelector = document.getElementById("imageSizeWorldSelectorWrapper");
        //this.fillImageBackgroundSelectWithValues(backgroundImageWorldSelector, backgroundImageSizeWorldSelector);
        this.fillImageBackgroundSelectWithValues(backgroundImageLevelSelector, backgroundImageSizeLevelSelector);
        const levelImage = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundImage || "none";
        const worldImage = WorldDataHandler.backgroundImage || "none";
        backgroundImageLevelSelector.value = levelImage;
        backgroundImageWorldSelector.value = worldImage;

        backgroundImageSizeLevelSelector.style.display = levelImage === "none" || levelImage === null ? "none" : "block";
        //backgroundImageSizeWorldSelector.style.display = worldImage === "none" || worldImage === null ? "none" : "block";
    }

    static initializeModal() {
        const levelColor = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundColor;
        if (levelColor && levelColor !== "transp") {
            this.setLevelColorInUi();
            this.backgroundLevelHuebee.setColor("#" + levelColor);
        }
        else {
            this.resetLevelColorUI();
        }
        this.initializeBackgroundImageSelects();
        this.backgroundHuebee.setColor("#" + WorldDataHandler.backgroundColor)
        this.textHuebee.setColor("#" + WorldDataHandler.textColor)
        EffectsHandler.updateExistingSFXSection();
        ModalHandler.showModal('worldColorModal');
    }

    static deleteLevelColor() {
        WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundColor = "transp";
        WorldColorChanger.changeLevelColor(tileMapHandler.currentLevel);
        this.resetLevelColorUI();
    }
}