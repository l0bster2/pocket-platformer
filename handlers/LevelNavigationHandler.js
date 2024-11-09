class LevelNavigationHandler {

    static staticConstructor() {
        this.createNewLevelButton = document.getElementById("createNewLevelButton");
        this.levelListDropdown = document.getElementById("levelListDropdown");
        this.levelSizeButton = document.getElementById("levelSizeButton");
        this.levelHelpersButton = document.getElementById("levelHelpersButton")
        this.copyNotification = document.getElementById("copyNotification");
        this.adaptVisibilityOfButtons();
        this.adaptLevelList();
        this.copiedLevel = {};
        this.copiedLevelIndex = -1;
    }

    static createNewEmptyLevel() {
        const nextLevel = tileMapHandler.currentLevel + 1;
        WorldDataHandler.levels.splice(nextLevel, 0, WorldDataHandler.exampleLevel());
        tileMapHandler.currentLevel = nextLevel;
        this.adjustObjectsToAddedLevel(nextLevel);
        this.adjustEffectsAfterLevelAmountChange(nextLevel);
        this.updateLevel();
        this.handleChangeLevelList();
    }

    static handleChangeLevelList() {
        this.adaptLevelList();
        this.adaptVisibilityOfButtons();
    }

    static objectIsExit(levelObject) {
        return (levelObject.type === ObjectTypes.FINISH_FLAG || levelObject.type === ObjectTypes.DOOR);
    }

    static adjustObjectsToAddedLevel(nextLevel) {
        WorldDataHandler.levels.forEach(level => {
            level.levelObjects.forEach(object => {
                if (this.objectIsExit(object) && object.extraAttributes?.customExit?.levelIndex >= nextLevel) {
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

    static incrementLevel(changeBy) {
        let nextLevel = tileMapHandler.currentLevel + changeBy;
        if (nextLevel < 0) {
            nextLevel = 0;
        }
        if (nextLevel > WorldDataHandler.levels.length - 1) {
            nextLevel = WorldDataHandler.levels.length - 1;
        }

        this.selectLevel(nextLevel);
    }

    static selectLevel(levelIndex) {
        if (levelIndex == tileMapHandler.currentLevel) {
            return;
        }
        PlayMode.currentPauseFrames = 0;

        this.levelListDropdown.value = levelIndex;
        tileMapHandler.currentLevel = levelIndex;
        this.updateLevel();
        
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

    static adaptLevelList() {
        while (this.levelListDropdown.firstChild) {
            this.levelListDropdown.removeChild(this.levelListDropdown.lastChild);
        }
        WorldDataHandler.levels.forEach((level, levelIndex) => {
            let optElem = document.createElement("option");
            let title = "Level " + levelIndex;
            if (levelIndex == 0) {
                title = "Start Screen";
            }
            else if (levelIndex == WorldDataHandler.levels.length - 1) {
                title = "Ending Screen";
            }
            optElem.textContent = title;
            optElem.value = levelIndex;
            this.levelListDropdown.appendChild(optElem);
        });

        this.levelListDropdown.value = tileMapHandler.currentLevel;
    }

    static updateLevel() {
        this.adaptVisibilityOfButtons();
        tileMapHandler.resetLevel(tileMapHandler.currentLevel);
    }

    static copyLevel(e) {
        this.copyNotification.style.display = "block";
        document.getElementById("copiedLevelIndex").innerHTML = tileMapHandler.currentLevel;
        TooltipHandler.closeTooltip(e, "levelHelpersTooltip");
        this.copyNotification.classList.remove("back");
        this.copyNotification.classList.add("move");
        this.copiedLevelIndex = tileMapHandler.currentLevel;
        this.copiedLevel = JSON.parse(JSON.stringify(WorldDataHandler.levels[tileMapHandler.currentLevel]));
        window.setTimeout(() => {
            this.copyNotification.style.display = "none";
            this.copyNotification.classList.remove("move");
            this.copyNotification.classList.add("back");
        }, 2000);
    }

    static showPasteLevelModal() {
        if (!Helpers.isObjEmpty(this.copiedLevel)) {
            document.getElementById("pasteLevelIndex").innerHTML = document.getElementById("copiedLevelIndex").innerHTML;
            ModalHandler.showModal('pasteLevelModal');
        }
    }

    static pasteLevel(e) {
        TooltipHandler.closeTooltip(e, "levelHelpersTooltip");
        ModalHandler.closeModal('pasteLevelModal');
        const newLevel = JSON.parse(JSON.stringify(this.copiedLevel));
        // fix same-level custom exits (doors/flags that lead to other doors/flags within the same level)
        newLevel.levelObjects.forEach((levelObj) => {
            if (levelObj.extraAttributes?.customExit?.levelIndex === this.copiedLevelIndex) {
                levelObj.extraAttributes.customExit.levelIndex = tileMapHandler.currentLevel;
            }
        });
        WorldDataHandler.levels[tileMapHandler.currentLevel] = newLevel
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
            this.handleChangeLevelList();
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
        const zoomFactor = evt.target?.elements?.zoomFactor?.value;

        if (width && height) {
            const newWidth = parseInt(width);
            const newHeight = parseInt(height);
            if (newWidth !== tileMapHandler.getLevelWidth()
                || newHeight !== tileMapHandler.getLevelHeight()
                || zoomFactor !== WorldDataHandler.levels[tileMapHandler.currentLevel].zoomFactor) {
                LevelSizeHandler.changeLevelSize(newWidth, newHeight, zoomFactor);
            }
            ModalHandler.closeModal('levelSizeModal');
        }
    }

    static initializeLevelSizeSection() {
        ModalHandler.showModal('levelSizeModal');
        document.getElementById("widthSize").value = tileMapHandler.getLevelWidth();
        document.getElementById("heightSize").value = tileMapHandler.getLevelHeight();
        const zoomFactorValue = WorldDataHandler.levels[tileMapHandler.currentLevel].zoomFactor || 1;
        LevelSizeHandler.changeUIElementsBasedOnZoom(zoomFactorValue);
    }
}