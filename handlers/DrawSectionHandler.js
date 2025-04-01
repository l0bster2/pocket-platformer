const tools = {
    pencil: "pencil",
    eyeDropper: "eyeDropper"
}

class DrawSectionHandler {

    static staticConstructor(tileMapHandler) {
        this.hueb;
        this.currentColor;
        const redrawSpriteCanvas = document.getElementById("redrawSpriteCanvas");
        const elementsToQuery = ["spriteSelectEl", "spriteAnimationEl", "spriteAnimationWrapper",
            "spriteDescriptionWrapper", "pencilButton", "eyeDropperButton"];
        elementsToQuery.forEach(elementToQuery => {
            this[elementToQuery] = document.getElementById(elementToQuery);
        });
        this.initializeColorPicker();
        this.redrawSpriteCanvas = redrawSpriteCanvas;
        this.redrawSpriteCanvasCtx = redrawSpriteCanvas.getContext('2d');
        this.redrawSpriteCanvasCtx.translate(0, 0);
        redrawSpriteCanvas.addEventListener("mouseenter", (e) => { Controller.mouseEnterDrawCanvas(e) });
        redrawSpriteCanvas.addEventListener("mouseleave", (e) => { Controller.mouseLeaveDrawCanvas(e) });
        redrawSpriteCanvas.addEventListener("mousemove", (e) => { Controller.mouseMoveDrawInCanvas(e) });
        this.padding = 16;
        this.currentSprite = { sprite: null, animationFrame: 0, spriteIndexInArray: 0 };
        //array for each frame in the animation
        this.animationCanvases = [];
        this.tileMapHandler = tileMapHandler;
        this.redrawSpriteCanvas = redrawSpriteCanvas;
        this.canvasWidth = redrawSpriteCanvas.width;
        this.getBoundingRectPosition();
        this.getBoundingRectPosition(5000);
        this.canvasHeight = redrawSpriteCanvas.height;
        this.canvasWidth = redrawSpriteCanvas.width
        this.pixelSize = Math.floor(redrawSpriteCanvas.width / tileMapHandler.pixelArrayUnitAmount);
        redrawSpriteCanvas.style.padding = this.padding;
        this.mousePressed = false;
        this.currentSelectedTool = tools.pencil;
        this.fillSelectBox();
    }

    static getBoundingRectPosition(timeoutValue = 200) {
        setTimeout(() => { this.boundingRect = this.redrawSpriteCanvas.getBoundingClientRect(); }, timeoutValue);
    }

    static initializeColorPicker() {
        const huebeeProperties = Helpers.getHuebeeDefaultProperties();
        this.hueb = new Huebee('.color-button', {
            ...huebeeProperties,
            setText: false
        });
        this.hueb.on('change', (color) => {
            this.pencilButton.style.color === "white" ?
                document.getElementById("pencilIcon").classList.add("whiteFilter") :
                document.getElementById("pencilIcon").classList.remove("whiteFilter");
            this.hueb.close();
            this.currentColor = color.replace("#", "");
        })
    }

    static removeOptions() {
        var i, L = this.spriteSelectEl.options.length - 1;
        for (i = L; i >= 0; i--) {
            this.spriteSelectEl.remove(i);
        }
    }

    static fillSelectBox() {
        SpritePixelArrays.allSprites.forEach((sprite, index) => {
            var optionEl = document.createElement("option");
            optionEl.text = sprite.descriptiveName;
            !sprite.hiddenEverywhere && this.spriteSelectEl.add(optionEl);
            if (index === 0) {
                this.changeSelectedSprite({ target: { value: sprite.descriptiveName } });
            }
        });
    }

    static showDrawHelpersToolTip() {
        const template = ObjectsTooltipElementsRenderer.createDrawHelpersToolsTop();
        TooltipHandler.showTooltip("transformTooltip", "Transform", template);
    }

    static showOtherSpritesTooltip() {
        const heading = "Paste another sprite here";
        let spriteContent = document.createElement('div');
        let description = document.createElement("div");
        description.innerHTML = "Select another sprite to start with, if you want to draw something similar";
        let sprites = document.createElement("div");
        sprites.className = "marginTop8";
        spriteContent.appendChild(description);
        SpritePixelArrays.allSprites.forEach(sprite => {
            if (this.currentSprite.sprite.commonType === sprite.commonType && sprite.descriptiveName != "Player wall jump") {
                sprite.animation.forEach(animationFrame => {
                    var canvas = document.createElement('canvas');
                    Helpers.addAttributesToHTMLElement(canvas, {
                        "width": this.currentSpriteWidth * this.tileMapHandler.pixelArrayUnitSize,
                        "height": this.currentSpriteHeight * this.tileMapHandler.pixelArrayUnitSize,
                        "id": 1, "class": "canvasInSpriteSelector"
                    });
                    canvas.onclick = (e) => {
                        const clonedSprite = JSON.parse(JSON.stringify(animationFrame.sprite));
                        this.currentSprite.sprite.animation[this.currentSprite.animationFrame].sprite = clonedSprite;
                        this.drawCurrentSprite();
                        this.redrawOutsideCanvases();
                        if (this.currentSprite?.sprite?.type) {
                            TabNavigation.changeTab(null, TabNavigation.currentSelectedTab === SpritePixelArrays.customType ?
                                SpritePixelArrays.customType : this.currentSprite.sprite.type);
                        }
                        TooltipHandler.closeTooltip(e, "otherSpriteTooltip");
                    };
                    canvas.style.background = "#" + WorldDataHandler.backgroundColor;
                    sprites.appendChild(canvas);
                    const ctx = canvas.getContext('2d');
                    Display.drawPixelArray(animationFrame.sprite, 0, 0, this.tileMapHandler.pixelArrayUnitSize, animationFrame.sprite[0].length, animationFrame.sprite.length, ctx);
                })
            }
        });
        spriteContent.appendChild(sprites);
        TooltipHandler.showTooltip("otherSpriteTooltip", heading, spriteContent);
    }

    static selectEyeDropperTool() {
        this.pencilButton.classList.remove("activeButton");
        this.eyeDropperButton.classList.add("activeButton");
        this.currentSelectedTool = tools.eyeDropper;
    }

    static selectPencilTool() {
        this.pencilButton.classList.add("activeButton");
        this.eyeDropperButton.classList.remove("activeButton");
        this.currentSelectedTool = tools.pencil;
    }

    static colorPickerClicked() {
        this.pencilButton.classList.remove("activeButton");
        this.eyeDropperButton.classList.add("activeButton");
        this.currentSelectedTool = tools.eyeDropper;
    }

    static changeAnimationFramesSize() {
        const animationCanvases = document.getElementsByClassName("animationFrameCanvas");
        for (var i = 0; i < animationCanvases.length; i++) {
            animationCanvases[i].height = this.currenteSpritePixelHeight;
            animationCanvases[i].width = this.currentSpritePixelWidth;
        }
    }

    static changeDrawCanvasSize(manuallyChangedSpriteSize = false) {
        this.redrawSpriteCanvas.height = this.currentSpriteHeight * tileMapHandler.tileSize;
        this.redrawSpriteCanvas.width = this.currentSpriteWidth * tileMapHandler.tileSize;
        this.canvasHeight = this.redrawSpriteCanvas.height;
        this.canvasWidth = this.redrawSpriteCanvas.width
        this.changeAnimationFramesSize();
        this.drawCurrentSprite();
        this.redrawOutsideCanvases();
        if (manuallyChangedSpriteSize) {
            TabNavigation.drawSpritesByType();
            if (TabNavigation.currentSelectedTab === SpritePixelArrays.customType) {
                TabNavigation.redrawAfterAddedOrDeletedSprite();
            }
            this.tileMapHandler.updateYCanvasAttributeForSetObjects();
        }
    }

    static updateAfterSpriteSizeChange(objectToChange) {
        this.changeCurrentSelectedSpriteDimensions();
        SpritePixelArrays.indexAllSprites();
        objectToChange.setAnimationProperties();
        objectToChange.updateExtraColissionPoints();
        this.changeDrawCanvasSize(true);
        this.changeDrawCanvasSize(true);
    }

    static getSpriteSizeValueChanges(oldValue, newValue) {
        const newSpriteBigger = newValue > oldValue;
        const difference = Math.abs(newValue - oldValue);
        return { newSpriteBigger, difference };
    }

    static changeSpriteWidth(event) {
        const currentSpriteObject = SpritePixelArrays.getSpritesByDescrpitiveName(this.currentSprite.sprite.descriptiveName)?.[0];
        let objectToChange = currentSpriteObject.commonType === "player" ? player : this.getObjectByCommonType(currentSpriteObject.type);
        const newValue = event.target.value;
        const { newSpriteBigger, difference } = this.getSpriteSizeValueChanges(this.currentSpriteWidth, newValue);

        objectToChange.width = tileMapHandler.pixelArrayUnitSize * newValue;
        document.getElementById("widthsliderValue").innerHTML = newValue;
        objectToChange.resetAnimationAttributes();

        SpritePixelArrays.allSprites.filter(sprite => sprite.commonType === currentSpriteObject.commonType).forEach(sprite => {
            sprite.animation.forEach(animationSprite => {
                if (newSpriteBigger) {
                    for (var i = 0; i < difference; i++) {
                        for (var j = 0; j < this.currentSpriteHeight; j++) {
                            animationSprite.sprite[j].push("transp")
                        }
                    }
                }
                else {
                    for (var i = 0; i < difference; i++) {
                        for (var j = 0; j < this.currentSpriteHeight; j++) {
                            animationSprite.sprite[j].pop();
                        }
                    }
                }
            })
            spriteSheetCreator.redrawSprite(sprite, SpritePixelArrays.getIndexOfSprite(sprite.descriptiveName, 0, "descriptiveName"))
        });
        this.updateAfterSpriteSizeChange(objectToChange);
    }

    static changeSpriteHeight(event) {
        const currentSpriteObject = SpritePixelArrays.getSpritesByDescrpitiveName(this.currentSprite.sprite.descriptiveName)?.[0];
        let objectToChange = currentSpriteObject.commonType === "player" ? player : this.getObjectByCommonType(currentSpriteObject.type);
        const oldHeight = objectToChange.height;
        const newValue = event.target.value;
        const { newSpriteBigger, difference } = this.getSpriteSizeValueChanges(this.currentSpriteHeight, newValue);

        objectToChange.height = tileMapHandler.pixelArrayUnitSize * newValue - objectToChange.heightOffset;
        objectToChange.y += oldHeight - objectToChange.height;
        document.getElementById("heightsliderValue").innerHTML = newValue;
        objectToChange.resetAnimationAttributes();

        SpritePixelArrays.allSprites.filter(sprite => sprite.commonType === currentSpriteObject.commonType).forEach(sprite => {
            sprite.animation.forEach(animationSprite => {
                if (newSpriteBigger) {
                    for (var i = 0; i < difference; i++) {
                        const widthArray = Array(this.currentSpriteWidth).fill("transp")
                        animationSprite.sprite.unshift(widthArray)
                    }
                }
                else {
                    for (var i = 0; i < difference; i++) {
                        animationSprite.sprite.shift()
                    }
                }
            })
            spriteSheetCreator.redrawSprite(sprite, SpritePixelArrays.getIndexOfSprite(sprite.descriptiveName, 0, "descriptiveName"))
        });
        this.updateAfterSpriteSizeChange(objectToChange);
    }

    static checkHeightWidthSlidersVisibility(sprite) {
        const heightChanger = document.getElementById("heightAnimationChanger");
        const widthChanger = document.getElementById("widthAnimationChanger");
        if (sprite.name.toString().toLowerCase().includes("player")) {
            heightChanger.style.display = "flex";
            document.getElementById("spriteHeightSlider").value = this.currentSpriteHeight;
            document.getElementById("heightsliderValue").innerHTML = this.currentSpriteHeight;
            widthChanger.style.display = "flex";
            document.getElementById("spriteWidthSlider").value = this.currentSpriteWidth;
            document.getElementById("widthsliderValue").innerHTML = this.currentSpriteWidth;
        }
        else {
            heightChanger.style.display = "none";
            widthChanger.style.display = "none";
        }
    }

    static changeCurrentSelectedSpriteDimensions() {
        this.currentSpriteHeight = this.currentSprite.sprite.animation[0].sprite.length;
        this.currentSpriteWidth = this.currentSprite.sprite.animation[0].sprite[0].length;
        this.currenteSpritePixelHeight = this.currentSpriteHeight * this.tileMapHandler.pixelArrayUnitSize;
        this.currentSpritePixelWidth = this.currentSpriteWidth * this.tileMapHandler.pixelArrayUnitSize;
    }

    static changeSelectedSprite(event, changeSelectOption = false) {
        const spriteName = event.target.value;
        const sprite = SpritePixelArrays.getSpritesByDescrpitiveName(spriteName)[0];
        this.currentSprite.spriteIndexInArray = SpritePixelArrays.getIndexOfSprite(sprite.descriptiveName, 0, "descriptiveName")
        this.currentSprite.sprite = sprite;
        this.currentSprite.animationFrame = 0;
        this.changeCurrentSelectedSpriteDimensions();
        this.changeAnimationFrame(0);
        this.animationCanvases = [];
        this.checkHeightWidthSlidersVisibility(sprite);
        this.displaySpriteDescription(sprite);
        this.createAnimationWrapper(sprite);

        //When selected sprite is changed from outside, in the left sprite selection section, set option manually
        if (changeSelectOption) {
            const indexInSelect = this.findIndexOfOption(spriteName);

            if (indexInSelect !== undefined) {
                this.spriteSelectEl.selectedIndex = indexInSelect
            }
        }
        this.changeDrawCanvasSize();
    }

    static displaySpriteDescription(sprite) {
        if (sprite.description) {
            this.spriteDescriptionWrapper.innerHTML = sprite.description;
        }
        else if (sprite.type === SpritePixelArrays.SPRITE_TYPES.deko) {
            this.spriteDescriptionWrapper.innerHTML = "Just a decorational Element";
        }
        else {
            this.spriteDescriptionWrapper.innerHTML = "";
        }
    }

    static createAnimationWrapper(sprite, htmlElement = this.spriteAnimationEl) {
        if ((sprite.type === SpritePixelArrays.SPRITE_TYPES.tile || sprite.name === "edge") &&
            !SpritePixelArrays.tilesWithAnimation.includes(sprite.name) &&
            !SpritePixelArrays.backgroundSprites.includes(sprite.name)) {
            this.spriteAnimationWrapper.style.display = "none";
        }
        else {
            this.spriteAnimationWrapper.style.display = "block";
            htmlElement.innerHTML = "";
            sprite.animation.forEach((animationFrame, index) => {
                this.createAnimationFrameCanvas(animationFrame.sprite, index, sprite);
            });
            if (!sprite.animNotEditale) {
                if (sprite.animation.length === 1) {
                    this.createButtonForAdditionalFrame(sprite);
                }
            }
            [{ attributeName: "squishAble", description: "Squish animation" },
            { attributeName: "rotateable", description: "Rotateable" }].forEach(attribute => {
                if (sprite[attribute.attributeName] !== undefined) {
                    this.createCheckboxForSquishAnimation(sprite, attribute.attributeName, attribute.description);
                }
            })
        }
    }

    static createCheckboxForSquishAnimation(sprite, attributeName, description) {
        var checkboxWrapper = document.createElement("div");
        checkboxWrapper.className = "marginTop8";
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = sprite[attributeName];
        checkbox.id = attributeName;
        checkbox.onclick = (event) => {
            sprite[attributeName] = event.target.checked;
        };
        checkboxWrapper.appendChild(checkbox);
        var checkboxDesc = document.createElement("label");
        checkboxDesc.innerHTML = description;
        checkboxDesc.setAttribute("for", attributeName);
        checkboxDesc.className = "checkBoxText";
        checkboxDesc.id = "checkboxDesc";
        checkboxWrapper.appendChild(checkboxDesc);
        this.spriteAnimationEl.appendChild(checkboxWrapper);
    }

    static createButtonForAdditionalFrame(sprite) {
        var button = document.createElement("button");
        button.id = "additionalFrameButton";
        button.className = "levelNavigationButton frameWrapper";
        var plusImg = document.createElement("img");
        Helpers.addAttributesToHTMLElement(plusImg, {
            "src": "images/icons/plus.svg",
            "alt": "plus",
            "width": "14",
            "height": "14",
        });
        button.onclick = () => {
            const plusButton = document.getElementById("additionalFrameButton");
            this.spriteAnimationEl.removeChild(plusButton);
            sprite.animation.push(JSON.parse(JSON.stringify(SpritePixelArrays.createDynamicEmptySprite(this.currentSpriteWidth, this.currentSpriteHeight))));
            this.newFrameAddedOrDeleted(sprite, 1);
        };
        button.appendChild(plusImg);
        this.spriteAnimationEl.appendChild(button);
    }

    static createAnimationFrameCanvas(animationFrame, index, sprite) {
        var canvasFrameWrapper = document.createElement("div");
        canvasFrameWrapper.className = "frameWrapper";
        var canvas = document.createElement('canvas');
        Helpers.addAttributesToHTMLElement(canvas, {
            "width": this.tileMapHandler.tileSize, "height": this.tileMapHandler.tileSize
        });
        canvas.className = "animationFrameCanvas";
        canvas.style.background = "#" + WorldDataHandler.backgroundColor;
        canvas.onclick = () => { this.changeAnimationFrame(index) };
        if (index === 1 && !sprite.animNotEditale) {
            const deleteImg = document.createElement("img");
            Helpers.addAttributesToHTMLElement(deleteImg, {
                "id": "deleteImg",
                "width": 14, "height": 14,
                "src": "images/icons/minus-delete.svg"
            });
            deleteImg.onclick = () => {
                sprite.animation.pop();
                this.newFrameAddedOrDeleted(sprite, 0);
            };
            canvasFrameWrapper.appendChild(deleteImg);
        }
        canvas.height = this.currenteSpritePixelHeight;
        canvas.width = this.currentSpritePixelWidth;
        canvasFrameWrapper.appendChild(canvas);
        this.spriteAnimationEl.appendChild(canvasFrameWrapper);
        const ctx = canvas.getContext('2d');
        this.animationCanvases.push(ctx);
        Display.drawPixelArray(animationFrame, 0, 0, this.tileMapHandler.pixelArrayUnitSize, animationFrame[0].length, animationFrame.length,
            ctx);
    }

    static newFrameAddedOrDeleted(sprite, jumpToFrame) {
        this.animationCanvases = [];
        this.createAnimationWrapper(sprite);
        this.changeAnimationFrame(jumpToFrame);
        Helpers.debounce(() => {
            this.redrawOutsideCanvases();
        }, 300);
        player.setAnimationProperties();
        this.updateCurrentLevelObjectsSpriteSheet(sprite);
    }

    static updateCurrentLevelObjectsSpriteSheet(sprite) {
        this.tileMapHandler.levelObjects.forEach(levelObject => {
            if (levelObject.currentFacingDirection && levelObject.facingDirections && levelObject.type === sprite.name) {
                var currentIndex = levelObject.facingDirections.indexOf(levelObject.currentFacingDirection);
                levelObject.canvasXSpritePos = currentIndex * levelObject.spriteObject[0].animation.length * levelObject.tileSize;
            }
        });
    }

    static changeAnimationFrame(index = 0) {
        this.currentSprite.animationFrame = index;
        this.drawCurrentSprite();
    }

    static drawCurrentSprite() {
        this.redrawSpriteCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        const currentSprite = this.currentSprite.sprite.animation[this.currentSprite.animationFrame];
        Display.drawPixelArray(currentSprite.sprite, 0, 0, this.pixelSize, currentSprite.sprite[0].length, currentSprite.sprite.length,
            this.redrawSpriteCanvasCtx)
        const { tileSize } = this.tileMapHandler;
        Display.drawGrid(this.currentSpriteWidth, this.currentSpriteHeight, tileSize, '383838', 1, this.redrawSpriteCanvasCtx);
    }

    static findIndexOfOption(text) {
        for (var i = 0; i < this.spriteSelectEl.length; i++) {
            if (this.spriteSelectEl[i].childNodes[0].nodeValue === text) {
                return i;
            }
        }
        return undefined;
    }

    static draw() {
        if (Controller.mouseInsideDrawCanvas) {
            this.drawCurrentSprite();

            var canvasClickPosition = {
                x: Controller.mouseXInDrawCanvas - this.boundingRect.left,
                y: Controller.mouseYInDrawCanvas - this.boundingRect.top,
            };
            const posInArray = {
                x: Math.floor(canvasClickPosition.x / this.pixelSize),
                y: Math.floor(canvasClickPosition.y / this.pixelSize),
            }
            Display.drawRectangleBorder(posInArray.x * this.pixelSize, posInArray.y * this.pixelSize,
                this.pixelSize, this.pixelSize, "#FFFFF", 2, this.redrawSpriteCanvasCtx)

            if (Controller.mousePressed || Controller.rightMousePressed) {
                const { animationFrame, sprite } = this.currentSprite;
                if (posInArray.x >= 0 && posInArray.y >= 0 && posInArray.x < this.currentSpriteWidth && posInArray.y < this.currentSpriteHeight &&
                    sprite?.animation[animationFrame]?.sprite?.[posInArray.y]?.[posInArray.x]) {
                    if (this.currentSelectedTool === tools.pencil && this.currentColor || Controller.rightMousePressed) {
                        this.clickedWithPencil(posInArray);
                    }
                    if (this.currentSelectedTool === tools.eyeDropper) {
                        this.mousePressed = true;
                        this.clickedWithEyeDropper(posInArray);
                    }
                }
            }
        }
        if (!Controller.mousePressed) {
            if (this.currentSelectedTool === tools.eyeDropper && this.mousePressed) {
                this.selectPencilTool();
            }
            this.mousePressed = false;
        }
    }

    static clickedWithPencil(posInArray) {
        const { animationFrame, sprite } = this.currentSprite;
        const color = Controller.mousePressed ? this.currentColor : "transp";
        const colorChanged = sprite.animation[animationFrame].sprite[posInArray.y][posInArray.x] != color;
        sprite.animation[animationFrame].sprite[posInArray.y][posInArray.x] = color;
        if (colorChanged) {
            Helpers.debounce(() => {
                this.redrawOutsideCanvases();
            }, 300);
        }
    }

    static clickedWithEyeDropper(posInArray) {
        const { animationFrame, sprite } = this.currentSprite;

        const pickedColor = sprite.animation[animationFrame].sprite[posInArray.y][posInArray.x];
        if (this.currentColor !== pickedColor) {
            this.currentColor = sprite.animation[animationFrame].sprite[posInArray.y][posInArray.x];
            this.hueb.setColor("#" + this.currentColor);
        }
    }

    static redrawOutsideCanvases(forceRedraw = false) {
        //animation underneath sprite redraw
        if (this.animationCanvases.length > 0) {
            for (var i = 0; i < this.animationCanvases.length; i++) {
                const { pixelArrayUnitSize } = this.tileMapHandler;
                this.animationCanvases[i].clearRect(0, 0, this.currentSpritePixelWidth, this.currentSpriteHeight);
                const currentSprite = this.currentSprite.sprite.animation[i];
                Display.drawPixelArray(currentSprite.sprite, 0, 0, pixelArrayUnitSize, currentSprite.sprite[0].length, currentSprite.sprite.length,
                    this.animationCanvases[i]);
            }
        }
        //if current tab contains current redrawable sprite, update it, otherwise it will update on next tab click
        if (TabNavigation.currentSelectedTab === this.currentSprite.sprite.type ||
            TabNavigation.currentSelectedTab === SpritePixelArrays.customType || forceRedraw) {
            TabNavigation.drawSpritesByType();
        }
        //redraw in big sprite sheet
        spriteSheetCreator.redrawSprite(this.currentSprite, this.currentSprite.spriteIndexInArray);
        this.tileMapHandler.createStaticTiles();
    }
}