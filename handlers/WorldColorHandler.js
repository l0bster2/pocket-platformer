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

    static initializeModal() {
        const levelColor = WorldDataHandler.levels[tileMapHandler.currentLevel].backgroundColor;
        if (levelColor && levelColor !== "transp") {
            this.setLevelColorInUi();
            this.backgroundLevelHuebee.setColor("#" + levelColor);
        }
        else {
            this.resetLevelColorUI();
        }
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