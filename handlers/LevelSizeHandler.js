

class LevelSizeHandler {
    static staticConstructor(tileMapHandler) {
        this.tileMapHandler = tileMapHandler;
        this.xSliderWrapperEl = document.getElementById("cameraXSliderWrapper");
        this.ySliderWrapperEl = document.getElementById("cameraYSliderWrapper");
        this.xSliderEl = document.getElementById("cameraXSlider");
        this.ySliderEl = document.getElementById("cameraYSlider");
        this.xSliderEl.min = Camera.viewport.halfWidth;
        this.xSliderEl.value = Camera.viewport.halfWidth;
        this.ySliderEl.min = Camera.viewport.halfHeight;
        this.ySliderEl.value = Camera.viewport.halfHeight;
        this.ySliderStepAmount = 30;
        this.xSliderStepAmount = 40;
    }

    static changeLevelSize(newWidth, newHeight, zoomFactor) {
        const { currentLevel } = this.tileMapHandler;
        const currentWidth = this.tileMapHandler.getLevelWidth();
        const currentHeight = this.tileMapHandler.getLevelHeight();

        if (newWidth !== currentWidth) {
            this.changeWidth(currentWidth, currentHeight, newWidth, newHeight);
        }
        if (newHeight !== currentHeight) {
            this.changeHeight(newWidth, currentHeight, newHeight);
        }
        const calculatedZoom = this.adaptZoomForSmallerThanDefaultLevels(newWidth, newHeight, zoomFactor);
        WorldDataHandler.levels[currentLevel].tileData = this.tileMapHandler.tileMap;
        WorldDataHandler.levels[currentLevel].zoomFactor = calculatedZoom;
        this.tileMapHandler.updateLevelDimensions();
        Camera.updateViewportRelatedToScale(calculatedZoom)

        //Run it again, to correct values, is camera is out of bounds, due to shrinked level size
        Camera.moveTo(Camera.follow.x, Camera.follow.y);
        this.updateCameraSliders(this.tileMapHandler.levelWidth * this.tileMapHandler.tileSize,
            this.tileMapHandler.levelHeight * this.tileMapHandler.tileSize,
            { x: this.tileMapHandler.player.x, y: this.tileMapHandler.player.y });

        this.tileMapHandler.changeTileCanvasSize();
    }

    static adaptZoomForSmallerThanDefaultLevels(width, height, zoom) {
        const defaultWidthTiles = Camera.originalWidth / this.tileMapHandler.tileSize;
        const defaultHeightTiles = Camera.originalHeight / this.tileMapHandler.tileSize;

        if (width < defaultWidthTiles || height < defaultHeightTiles) {
            const widthZoom = defaultWidthTiles / width;
            const heightZoom = defaultHeightTiles / height;
            const sortedZooms = MathHelpers.sortNumbers([widthZoom, heightZoom]);
            if(sortedZooms[1] >= zoom) {
                const shortenedZoom = sortedZooms[1].toFixed(4);
                document.getElementById("zoomFactor").min = shortenedZoom;
                return shortenedZoom;
            }
        }
        document.getElementById("zoomFactor").min = 1;
        return zoom;
    }

    static changeUIElementsBasedOnZoom(zoomFactorValue) {
        const width = document.getElementById("widthSize").value;
        const height = document.getElementById("heightSize").value;
        const adaptedZoom = this.adaptZoomForSmallerThanDefaultLevels(width, height, parseFloat(zoomFactorValue).toFixed(4));
        const displayedZoom = adaptedZoom > 1.91 ? 2 : adaptedZoom;
        document.getElementById('zoomFactorValue').innerHTML = parseFloat(displayedZoom).toFixed(2);
        document.getElementById("zoomFactor").value = parseFloat(adaptedZoom);
    }

    static sizeChangedInUI() {
        const zoomFactorValue = WorldDataHandler.levels[tileMapHandler.currentLevel].zoomFactor || 1;
        this.changeUIElementsBasedOnZoom(zoomFactorValue);
    }

    static changeZoomHtmlValue(event) {
        const zoomFactorValue = event.target.value;
        this.changeUIElementsBasedOnZoom(zoomFactorValue);
    }

    static changeWidth(currentWidth, currentHeight, newWidth, newHeight) {
        if (newWidth > currentWidth) {
            const tileAmountToAdd = newWidth - currentWidth;
            this.tileMapHandler.tileMap.forEach((widthArray, index) => {
                if (index === 0 || index === currentHeight - 1) {
                    const onesArray = Array(tileAmountToAdd).fill(1);
                    onesArray.forEach(value => widthArray.push(value));
                }
                else {
                    widthArray[this.tileMapHandler.levelWidth - 1] = 0;
                    let zerosArray = Array(tileAmountToAdd).fill(0);
                    zerosArray[zerosArray.length - 1] = 1;
                    zerosArray.forEach(value => widthArray.push(value));
                }
            });
        }
        else {
            const tileAmountToRemove = currentWidth - newWidth;
            this.tileMapHandler.tileMap.forEach(widthArray => {
                for (var i = 0; i < tileAmountToRemove; i++) {
                    widthArray.pop();
                }
                widthArray[widthArray.length - 1] = 1;
            });
            const outOfBoundsHeight = this.tileMapHandler.levelHeight - newHeight;
            this.removeObjectsOutOfBounds(newWidth, outOfBoundsHeight, "levelObjects");
            this.removeObjectsOutOfBounds(newWidth, outOfBoundsHeight, "deko");
            this.removePlayerOutOfBounds(newWidth, outOfBoundsHeight);

        }
    }

    static removePlayerOutOfBounds(newWidth, newHeight) {
        if (this.tileMapHandler.player.x > newWidth * this.tileMapHandler.tileSize - this.tileMapHandler.tileSize
            || this.tileMapHandler.player.y < newHeight * this.tileMapHandler.tileSize - this.tileMapHandler.tileSize) {
            this.tileMapHandler.player.resetAll();
        }
    }

    static changeHeight(newWidth, currentHeight, newHeight) {
        if (newHeight > currentHeight) {
            const tileAmountToAdd = newHeight - currentHeight;
            //Add 1,0,0,0,0,1 starting from position 1, because potion 0 can stay 1,1,1,1,1,1
            for (var i = 0; i < tileAmountToAdd; i++) {
                let zerosArray = Array(newWidth).fill(0);
                zerosArray[zerosArray.length - 1] = 1;
                zerosArray[0] = 1;
                this.tileMapHandler.tileMap.splice(1, 0, zerosArray);
            }
            this.repositionAllItems(tileAmountToAdd);
        }
        else {
            const tileAmountToAdd = currentHeight - newHeight;
            this.tileMapHandler.tileMap.splice(1, tileAmountToAdd);
            this.removeObjectsOutOfBounds(newWidth, this.tileMapHandler.levelHeight - newHeight, "levelObjects");
            this.removeObjectsOutOfBounds(newWidth, this.tileMapHandler.levelHeight - newHeight, "deko");
            this.repositionAllItems(tileAmountToAdd * -1);
            this.removePlayerOutOfBounds(newWidth, this.tileMapHandler.levelHeight - newHeight);
        }
    }

    static repositionAllItems(tileAmountToAdd) {
        const { tileSize } = this.tileMapHandler;
        this.repositionLevelObjects("levelObjects", tileAmountToAdd);
        this.repositionLevelObjects("deko", tileAmountToAdd);
        this.repositionPaths(tileAmountToAdd);
        this.tileMapHandler.player.initialY += tileAmountToAdd * tileSize;
        this.tileMapHandler.player.y += tileAmountToAdd * tileSize;
        Camera.viewport.top += tileAmountToAdd * tileSize;
    }

    static removeObjectsOutOfBounds(newWidth, newHeight, arrayName) {
        const arr = this.tileMapHandler[arrayName];
        const arrLength = arr.length - 1;
        for (var i = arrLength; i >= 0; i--) {
            if (arr[i].initialX >= newWidth || arr[i].initialY <= newHeight) {
                BuildMode.removeFromData(arrayName, arr[i].initialX, arr[i].initialY);
            }
        }
    }

    static repositionPaths(yChanged) {
        this.tileMapHandler.paths && this.tileMapHandler.paths.forEach(path => {
            path.pathPoints.forEach(pathPoint => {
                pathPoint.initialY += yChanged;
                pathPoint.y += yChanged * this.tileMapHandler.tileSize;
            })
        })
        WorldDataHandler.levels[this.tileMapHandler.currentLevel].paths &&
            WorldDataHandler.levels[this.tileMapHandler.currentLevel].paths.forEach(path => {
                path.pathPoints.forEach(pathPoint => {
                    pathPoint.initialY += yChanged;
                });
            });
    }

    static repositionLevelObjects(arrayName, yChanged) {
        this.tileMapHandler[arrayName].forEach(inst => {
            inst.initialY += yChanged;
            inst.y += yChanged * this.tileMapHandler.tileSize;
        })
        WorldDataHandler.levels[this.tileMapHandler.currentLevel][arrayName].forEach(worldObject => {
            worldObject.y += yChanged;
        });
    }

    static updateCameraSliders(width, height, initialPlayerPosition) {
        let sizeChanged = false;
        if (width > Camera.viewport.width) {
            this.xSliderWrapperEl.style.display = "block";
            this.xSliderEl.min = Camera.viewport.halfWidth;
            this.xSliderEl.max = width - Camera.viewport.halfWidth;
            this.calculateSliderValues(this.xSliderEl, initialPlayerPosition.x, this.xSliderStepAmount, this.xSliderStepAmount);
            sizeChanged = true;
        }
        else {
            if (this.xSliderWrapperEl) {
                this.xSliderWrapperEl.style.display = "none";
            }
        }
        if (height > Camera.viewport.height) {
            this.ySliderWrapperEl.style.display = "inline-block";
            this.ySliderEl.min = Camera.viewport.halfHeight;
            this.ySliderEl.max = height - Camera.viewport.halfHeight;
            this.calculateSliderValues(this.ySliderEl, initialPlayerPosition.y, this.ySliderStepAmount, this.ySliderStepAmount);
            sizeChanged = true;
            DrawSectionHandler.getBoundingRectPosition();
        }
        else {
            if (this.ySliderWrapperEl) {
                this.ySliderWrapperEl.style.display = "none";
                DrawSectionHandler.getBoundingRectPosition();
            }
        }
        sizeChanged && Camera.moveTo(this.xSliderEl.value, this.ySliderEl.value);
    }

    static calculateSliderValues(sliderEl, playerPos, sliderSteps) {
        const difference = sliderEl.max - sliderEl.min;
        const stepValue = difference / sliderSteps;
        sliderEl.step = difference / sliderSteps;
        this.setSliderValue(sliderEl, stepValue, playerPos, sliderSteps);
    }

    static setSliderValue(sliderEl, stepValue, playerPos, sliderSteps) {
        var sliderValues = [];
        for (var i = 0; i <= sliderSteps; i++) {
            sliderValues.push(parseInt(sliderEl.min) + stepValue * i);
        }
        const closestSliderValueToPlayer = Helpers.findClosestValueInArray(sliderValues, playerPos);
        if (closestSliderValueToPlayer) {
            sliderEl.value = closestSliderValueToPlayer;
        }
    }

    static moveCamera(event) {
        event.target.id === "cameraXSlider"
            ? Camera.moveTo(event.target.value, this.ySliderEl.value)
            : Camera.moveTo(this.xSliderEl.value, event.target.value)
    }

    static toggleSliderDisableAttr(value) {
        if (this.xSliderEl && this.ySliderEl) {
            this.xSliderEl.disabled = value;
            this.ySliderEl.disabled = value;

            if (!value) {
                this.setSliderValue(this.xSliderEl, this.xSliderEl.step, this.tileMapHandler.player.x, this.xSliderStepAmount);
                this.setSliderValue(this.ySliderEl, this.ySliderEl.step, this.tileMapHandler.player.y, this.ySliderStepAmount);
            }
        }
    }

    static mouseWheelSizeChange(event) {
        if (this.ySliderWrapperEl.style.display !== "none" && !this.ySliderEl.disabled) {
            const currentValue = parseInt(this.ySliderEl.value);
            const stepValue = parseInt(this.ySliderEl.step);
            event.deltaY > 0 ?
                this.ySliderEl.value = currentValue + stepValue * 2
                :
                this.ySliderEl.value = currentValue - stepValue * 2

            Camera.moveTo(this.xSliderEl.value, this.ySliderEl.value);
        }
    }
}