class LevelNavigationHandler {

    static staticConstructor() {
        this.createNewLevelButton = document.getElementById("createNewLevelButton");
        this.currentLevelTitle = document.getElementById("currentLevel");
        this.levelSizeButton = document.getElementById("levelSizeButton");
        this.levelHelpersButton = document.getElementById("levelHelpersButton")
        this.copyNotification = document.getElementById("copyNotification");
        this.adaptVisibilityOfButtons();
        this.copiedLevel = {};
    }

    static createNewEmptyLevel() {
        const nextLevel = tileMapHandler.currentLevel + 1;
        WorldDataHandler.levels.splice(nextLevel, 0, WorldDataHandler.exampleLevel());
        tileMapHandler.currentLevel = nextLevel;
        this.adjustObjectsToAddedLevel(nextLevel);
        this.adjustEffectsAfterLevelAmountChange(nextLevel);
        this.updateLevel();
        this.adaptVisibilityOfButtons();
    }

    static adjustObjectsToAddedLevel(nextLevel) {
        WorldDataHandler.levels.forEach(level => {
            level.levelObjects.forEach(object => {
                if (object.type === ObjectTypes.FINISH_FLAG && object?.extraAttributes?.customExit?.levelIndex >= nextLevel) {
                    object.extraAttributes.customExit.levelIndex += 1;
                }
            });
        })
    }

    static adjustEffectsAfterLevelAmountChange(changedLevel, type = "added") {
        WorldDataHandler.effects.forEach(effect => {
            let updateLevels = [];
            for (var i = effect.activeLevels.length; i >= 0; i--) {
                if (effect.activeLevels[i] >= changedLevel && type === "added") {
                    updateLevels.push(effect.activeLevels[i] + 1);
                    effect.activeLevels.splice(i, 1);
                }
                else if (effect.activeLevels[i] > changedLevel && type === "deleted") {
                    updateLevels.push(effect.activeLevels[i] - 1);
                    effect.activeLevels.splice(i, 1);
                }
                else if (effect.activeLevels[i] === changedLevel && type === "deleted") {
                    effect.activeLevels.splice(i, 1);
                }
            }
            if (updateLevels.length > 0) {
                effect.activeLevels = effect.activeLevels.concat(updateLevels);
            }
        })
    }

    static switchToLevel(changeBy) {
        //If level was switched via GUI, not by player winning a level
        PlayMode.currentPauseFrames = 0;

        let currentLevel = tileMapHandler.currentLevel + changeBy;
        if (currentLevel < 0) {
            currentLevel = 0;
        }
        if (currentLevel > WorldDataHandler.levels.length - 1) {
            currentLevel = WorldDataHandler.levels.length - 1;
        }
        if (currentLevel != tileMapHandler.currentLevel) {
            tileMapHandler.currentLevel = currentLevel;
            this.updateLevel();
        }

        this.adaptVisibilityOfButtons();
    }

    static adaptVisibilityOfButtons() {
        const { currentLevel } = tileMapHandler;

        if (currentLevel === 0) {
            this.levelSizeButton.style.display = 'none';
            this.levelHelpersButton.style.display = 'none';
        }
        else if (currentLevel === WorldDataHandler.levels.length - 1) {
            this.createNewLevelButton.style.display = 'none';
            this.levelSizeButton.style.display = 'none';
            this.levelHelpersButton.style.display = 'none';
        }
        else if (currentLevel === 1 && WorldDataHandler.levels.length === 3) {
            this.createNewLevelButton.style.display = 'inline-block';
            this.levelSizeButton.style.display = 'inline-block';
            this.levelHelpersButton.style.display = 'none';
        }
        else {
            this.createNewLevelButton.style.display = 'inline-block';
            this.levelSizeButton.style.display = 'inline-block';
            this.levelHelpersButton.style.display = 'inline-block';
        }
    }

    static updateLevel() {
        let levelTitle = "Level " + (tileMapHandler.currentLevel);
        if (tileMapHandler.currentLevel === 0) {
            levelTitle = "Start screen";
        }
        else if (tileMapHandler.currentLevel === WorldDataHandler.levels.length - 1) {
            levelTitle = "Ending screen";
        }
        this.adaptVisibilityOfButtons();
        this.currentLevelTitle.innerHTML = levelTitle;
        tileMapHandler.resetLevel(tileMapHandler.currentLevel);
    }

    static copyLevel(e) {
        this.copyNotification.style.display = "block";
        document.getElementById("copiedLevelIndex").innerHTML = tileMapHandler.currentLevel;
        TooltipHandler.closeTooltip(e, "levelHelpersTooltip");
        this.copyNotification.classList.remove("back");
        this.copyNotification.classList.add("move");
        this.copiedLevel = JSON.parse(JSON.stringify(WorldDataHandler.levels[tileMapHandler.currentLevel]));
        window.setTimeout(() => {
            this.copyNotification.style.display = "none";
            this.copyNotification.classList.remove("move");
            this.copyNotification.classList.add("back");
        }, 2000);
    }

    static showPasteLevelModal() {
        if(!Helpers.isObjEmpty(this.copiedLevel)) {
            document.getElementById("pasteLevelIndex").innerHTML = document.getElementById("copiedLevelIndex").innerHTML;
            ModalHandler.showModal('pasteLevelModal');
        }
    }

    static pasteLevel(e) {
        TooltipHandler.closeTooltip(e, "levelHelpersTooltip");
        ModalHandler.closeModal('pasteLevelModal');
        WorldDataHandler.levels[tileMapHandler.currentLevel] = JSON.parse(JSON.stringify(this.copiedLevel));
        tileMapHandler.resetLevel(tileMapHandler.currentLevel);
    }

    static deleteLevel() {
        const { currentLevel } = tileMapHandler;
        if (WorldDataHandler.levels.length > 3) {
            if (currentLevel === WorldDataHandler.levels.length - 1) {
                tileMapHandler.currentLevel = tileMapHandler.currentLevel - 1;
            }
            WorldDataHandler.levels.splice(currentLevel, 1);
            this.adjustEffectsAfterLevelAmountChange(currentLevel, "deleted")
            this.updateLevel();
            this.adaptVisibilityOfButtons();
            ModalHandler.closeModal('deleteLevelModal');
        }
        else {
            if (currentLevel === 1) {
                alert("Can't delete only level")
            }
        }
    }

    static showLevelHelpersTooltip() {
        const template = ObjectsTooltipElementsRenderer.createLevelHelpersTooltip(Helpers.isObjEmpty(this.copiedLevel));
        TooltipHandler.showTooltip("levelHelpersTooltip", "Edit", template);
    }

    static changeLevelSize(evt) {
        evt.preventDefault();
        const width = evt.target?.elements?.widthSize?.value;
        const height = evt.target?.elements?.heightSize?.value;

        if (width && height) {
            const newWidth = parseInt(width);
            const newHeight = parseInt(height);
            if (newWidth !== tileMapHandler.getLevelWidth() || newHeight !== tileMapHandler.getLevelHeight()) {
                LevelSizeHandler.changeLevelSize(newWidth, newHeight);
            }
            ModalHandler.closeModal('levelSizeModal');
        }
    }

    static initializeLevelSizeSection() {
        ModalHandler.showModal('levelSizeModal');
        document.getElementById("widthSize").value = tileMapHandler.getLevelWidth();
        document.getElementById("heightSize").value = tileMapHandler.getLevelHeight();
    }
}