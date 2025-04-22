class ObjectsTooltipElementsRenderer {
    static createSliderForChangeableAttribute(attribute, currentObject) {
        const sliderWrapper = document.createElement("div");
        sliderWrapper.className = "changeableAttributesWrapper marginTop8";
        const sliderLabel = document.createElement("label");
        Helpers.addAttributesToHTMLElement(sliderLabel, { "for": attribute.name });
        sliderLabel.innerHTML = attribute.descriptiveName || attribute.name;
        const slider = document.createElement("input");
        const currentValue = currentObject.type === ObjectTypes.PATH_POINT ? currentObject.getPathValue(attribute.name) : currentObject[attribute.name];
        const sliderValueText = attribute.mapper ? this.mapValueToKey(currentValue, attribute.mapper) : currentValue;
        Helpers.addAttributesToHTMLElement(slider, {
            "type": "range", "min": attribute.minValue, "max": attribute.maxValue, "value": sliderValueText, "name": attribute.name, "step": attribute.step || 1,
            "id": "attributeSlider",
        });
        sliderWrapper.appendChild(sliderLabel);
        sliderWrapper.appendChild(slider);
        const sliderValue = document.createElement("span");
        sliderValue.className = "sliderValue";
        sliderValue.innerHTML = currentValue;
        sliderValue.id = attribute.name + "sliderValue";
        slider.onchange = (event) => {
            const value = attribute.mapper ? this.mapKeyToValue(event.target.value, attribute.mapper) : parseInt(event.target.value);
            currentObject.addChangeableAttribute(attribute.name, value);
            document.getElementById(attribute.name + "sliderValue").innerHTML = value;
            if (attribute.name === 'frequency') {
                currentObject.getShootFrames();
            }
        };
        sliderWrapper.appendChild(sliderValue);
        return sliderWrapper;
    }

    static showDialogueAvatarTooltip(currentObject, index, attribute) {
        DialogueHandler.currentSelectedAvatar = null;
        const heading = "Avatar";
        let spriteContent = document.createElement('div');
        spriteContent.style.width = "240px";
        const description = document.createElement('div');
        description.innerHTML = 'Select a sprite from deco or a custom new deco as an avatar.'
        spriteContent.appendChild(description)
        const decoSpritesEl = document.createElement('div');
        decoSpritesEl.className = 'marginTop8';

        if (currentObject.avatars[index]) {
            const deleteButton = document.createElement('button');
            deleteButton.className = "color-button levelNavigationButton buttonWithIconAndText";
            deleteButton.style.verticalAlign = "top";
            deleteButton.style.margin = "2px 2px 0";
            deleteButton.style.padding = "9px";
            deleteButton.style.height = "36px";
            const deleteImg = document.createElement("img");
            Helpers.addAttributesToHTMLElement(deleteImg, {
                "width": 16,
                "height": 16,
                "alt": "avatar",
                "src": "images/icons/delete.svg",
            });
            deleteImg.className = "iconInButtonWithText";
            deleteButton.onclick = (event) => {
                event.stopPropagation();
                const allAvatars = [...currentObject.avatars];
                allAvatars.splice(index, 1);
                const dialogueWrapper = document.getElementById("dialogueWrapper")
                this.resetDialogueContent(event, attribute, currentObject, dialogueWrapper, currentObject.dialogue, allAvatars);
                TooltipHandler.closeTooltip(event, "dialogueAvatarTooltip");
            };
            deleteButton.appendChild(deleteImg);
            decoSpritesEl.appendChild(deleteButton);
        }

        const currentAvatar = currentObject.avatars[index];

        const decoSprites = SpritePixelArrays.allSprites.filter(sprite => sprite.type === SpritePixelArrays.SPRITE_TYPES.deko);
        decoSprites.forEach(decoSprite => {
            const animationFrame = decoSprite.animation[0];
            var canvas = document.createElement('canvas');

            if (decoSprite.descriptiveName === currentAvatar?.descriptiveName) {
                DialogueHandler.currentSelectedAvatar = decoSprite.descriptiveName;
                canvas.className = "canvasInSpriteSelector canvasInSpriteSelectorSelected";
            }
            else {
                canvas.className = "canvasInSpriteSelector";
            }

            Helpers.addAttributesToHTMLElement(canvas, {
                "width": tileMapHandler.tileSize,
                "height": tileMapHandler.tileSize, "id": 1
            });
            canvas.onclick = (event) => {
                Array.from(document.querySelectorAll('.canvasInSpriteSelectorSelected')).forEach(
                    (el) => el.classList.remove('canvasInSpriteSelectorSelected')
                );
                event.target.className = "canvasInSpriteSelector canvasInSpriteSelectorSelected";
                DialogueHandler.currentSelectedAvatar = decoSprite.descriptiveName;
            };
            canvas.style.background = "#" + WorldDataHandler.backgroundColor;
            const ctx = canvas.getContext('2d');
            Display.drawPixelArray(animationFrame.sprite, 0, 0, tileMapHandler.pixelArrayUnitSize, animationFrame.sprite[0].length, animationFrame.sprite.length, ctx);
            decoSpritesEl.appendChild(canvas);
        });
        spriteContent.appendChild(decoSpritesEl);

        const positionToggleAttributes = {
            name: "avatarPosition", defaultValue: currentAvatar?.position === "left" ? "Position left" : "Position right",
            options: [{ "true": "Position right" }, { "false": "Position left" }]
        };

        const positionWrapper = document.createElement("div");
        positionWrapper.className = "subSection";
        const position = this.createToggleSwitch(positionToggleAttributes);
        positionWrapper.appendChild(position);
        spriteContent.appendChild(positionWrapper);

        const checkboxAttributes = {
            name: "avatarBorder", defaultValue: true,
            checkboxDescription: "Border"
        };

        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.className = "marginTop8";
        const fakeCurrentObject = {
            "avatarBorder": currentAvatar?.border === false ? false : true,
            extraAttributes: {},
            addChangeableAttribute: () => { }
        };
        const checkbox = this.createCheckbox(checkboxAttributes, "Border", fakeCurrentObject);
        checkbox.className = "";
        checkboxWrapper.appendChild(checkbox);
        spriteContent.appendChild(checkboxWrapper);

        const submitButtonWrapper = document.createElement('div');
        submitButtonWrapper.className = "subSection";
        const submitButton = document.createElement('button');
        submitButton.className = "levelNavigationButton fullWidth";
        submitButton.innerHTML = "Ok";

        submitButton.onclick = (event) => {
            if (DialogueHandler.currentSelectedAvatar) {
                const allAvatars = currentObject.avatars;
                const borderValue = document.getElementById("avatarBorder").checked;
                const positionValue = document.getElementById("avatarPosition").checked ? AnimationHelper.facingDirections.right
                    : AnimationHelper.facingDirections.left;
                allAvatars[index] = {
                    descriptiveName: DialogueHandler.currentSelectedAvatar,
                    position: positionValue,
                    border: borderValue
                };
                currentObject.addChangeableAttribute("avatars", allAvatars);
                const dialogueWrapper = document.getElementById("dialogueWrapper")
                this.resetDialogueContent(event, attribute, currentObject, dialogueWrapper, currentObject.dialogue, allAvatars);
                TooltipHandler.closeTooltip(event, "dialogueAvatarTooltip");
            }
        }

        submitButtonWrapper.appendChild(submitButton);
        spriteContent.appendChild(submitButtonWrapper);

        TooltipHandler.showTooltip("dialogueAvatarTooltip", heading, spriteContent);
    }


    static createSmallHeading(text) {
        const heading = document.createElement("div");
        heading.style.fontWeight = 'bold';
        heading.innerHTML = text;
        return heading;
    }

    static startFlagToolTip(currentObject) {
        const startFlagWrapper = document.createElement("div");
        startFlagWrapper.className = "marginTop8";
        const idWrapper = document.createElement("div");
        idWrapper.innerHTML = "Flag-Id: <b>" + currentObject?.flagIndex + "</b>";
        const checkBoxWrapper = document.createElement("div");
        checkBoxWrapper.style.width = "fit-content";
        checkBoxWrapper.className = "marginTop8";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = currentObject?.levelStartFlag ? true : false;
        checkbox.id = "levelStartFlag"
        checkbox.onclick = (event) => {
            const checkboxValue = event.target.checked;
            currentObject.updateLevelStartValue(checkboxValue);
        };
        const labelForCheckBox = document.createElement("label");
        Helpers.addAttributesToHTMLElement(labelForCheckBox, {
            for: "levelStartFlag"
        });
        labelForCheckBox.style.marginRight = "8px";
        labelForCheckBox.className = "radioButtonLabel marginTop8";
        labelForCheckBox.innerHTML = "Starting flag";
        const info = document.createElement("span");
        Helpers.addAttributesToHTMLElement(info, {
            role: "tooltip", 'data-microtip-size': 'large', 'aria-label': 'If no custom exit is specified, the player will start at this flag. Useful for the first level, and testing inside the tool.',
            'data-microtip-position': 'top-left'
        });
        info.style.float = "right";
        const infoImage = document.createElement("img");
        Helpers.addAttributesToHTMLElement(infoImage, {
            src: "images/icons/info.svg", width: "16", height: "16"
        });
        info.appendChild(infoImage);
        labelForCheckBox.appendChild(info);
        checkBoxWrapper.append(checkbox, labelForCheckBox);
        startFlagWrapper.append(idWrapper, checkBoxWrapper);
        return startFlagWrapper;
    }

    static createCheckbox(changeableAttribute, description, currentObject) {
        const name = changeableAttribute.name;
        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.className = "subSection";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = name;
        checkbox.onclick = (event) => {
            const checkboxValue = event.target.checked;
            currentObject && currentObject.addChangeableAttribute(name, checkboxValue);
        };
        checkbox.checked = currentObject?.[name] || currentObject?.extraAttributes[name] || false;
        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "checkBoxText";
        checkboxLabel.style.marginLeft = "8px";
        Helpers.addAttributesToHTMLElement(checkboxLabel, { "for": changeableAttribute.name });
        checkboxLabel.innerHTML = description;
        checkboxWrapper.append(checkbox, checkboxLabel);
        return checkboxWrapper;
    }

    static finishFlagToolTip(currentObject) {
        const finishFlagWrapper = document.createElement("div");
        finishFlagWrapper.className = "marginTop8";

        const firstButtonWrapper = document.createElement("div");
        const firstRadioButton = document.createElement("input");
        Helpers.addAttributesToHTMLElement(firstRadioButton, {
            type: "radio", id: "nextLevel", value: "nextLevel", name: "levelSelector"
        });
        firstRadioButton.onchange = () => {
            currentObject.changeExit(null);
            selectWithStartFlags.disabled = true;
        };
        const labelForFirstButton = document.createElement("label");
        Helpers.addAttributesToHTMLElement(labelForFirstButton, {
            for: "nextLevel"
        });
        labelForFirstButton.className = "radioButtonLabel";
        labelForFirstButton.innerHTML = "Next Level";
        firstButtonWrapper.append(firstRadioButton, labelForFirstButton);
        const secondButtonWrapper = document.createElement("div");
        secondButtonWrapper.className = "marginTop8";

        const secondRadioButton = document.createElement("input");
        Helpers.addAttributesToHTMLElement(secondRadioButton, {
            type: "radio", id: "customLevel", value: "customLevel", name: "levelSelector"
        });
        const labelForSecondButton = document.createElement("label");
        Helpers.addAttributesToHTMLElement(labelForSecondButton, {
            for: "customLevel"
        });
        labelForSecondButton.className = "radioButtonLabel";
        labelForSecondButton.innerHTML = "Custom";
        const selectWithStartFlags = document.createElement("select");
        if (!currentObject.customExit) {
            selectWithStartFlags.disabled = true;
        }
        labelForSecondButton.appendChild(selectWithStartFlags);
        secondButtonWrapper.append(secondRadioButton, labelForSecondButton);
        WorldDataHandler.levels.forEach((level, levelIndex) => {
            if (levelIndex !== 0 && levelIndex !== WorldDataHandler.levels.length - 1) {
                level.levelObjects.forEach(levelObject => {
                    if (levelObject.type === ObjectTypes.START_FLAG) {
                        const option = document.createElement("option");
                        option.value = levelIndex + "," + levelObject?.extraAttributes?.flagIndex;
                        option.innerHTML = `Level: ${levelIndex}. Flag-Id: ${levelObject?.extraAttributes?.flagIndex}`
                        selectWithStartFlags.appendChild(option);
                    }
                });
            }
        });
        const option = document.createElement("option");
        option.value = "finishLevel";
        option.innerHTML = `Ending screen`
        selectWithStartFlags.appendChild(option);

        if (currentObject.customExit) {
            secondRadioButton.checked = true;
            const customExitTextValue = `${currentObject.customExit.levelIndex},${currentObject.customExit.flagIndex}`
            var options = selectWithStartFlags.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value === customExitTextValue) {
                    options[i].selected = true;
                    break;
                }
            }
            if (WorldDataHandler.levels.length - 1 === currentObject.customExit.levelIndex) {
                options[options.length - 1].selected = true;
            }
        }
        else {
            firstRadioButton.checked = true;
        }
        secondRadioButton.onchange = () => {
            selectWithStartFlags.disabled = false;
            const selectedIndex = selectWithStartFlags.selectedIndex;
            currentObject.changeExit(selectWithStartFlags.options[selectedIndex].value);
        };
        selectWithStartFlags.onchange = (event) => {
            currentObject.changeExit(event.target.value);
        }

        const changeableAttribute = currentObject.spriteObject[0].changeableAttributes[0];

        const checkboxWrapper = this.createCheckbox(changeableAttribute,
            "Collectibles needed for opening",
            currentObject);

        finishFlagWrapper.append(firstButtonWrapper, secondButtonWrapper, checkboxWrapper);

        return finishFlagWrapper;
    }

    static mapValueToKey(searchValue, mapper) {
        let resultValue = Object.entries(mapper).find(entry => {
            const [_, value] = entry;
            return value === searchValue;
        });
        return resultValue ? parseInt(resultValue?.[0]) : null;
    }

    static mapKeyToValue(searchKey, mapper) {
        let resultValue = Object.entries(mapper).find(entry => {
            const [key] = entry;
            return key === searchKey;
        });
        return resultValue ? parseInt(resultValue?.[1]) : null;
    }

    static createRotationHandlerForObjects(currentObject, directions) {
        const rotationWrapper = document.createElement("div");
        rotationWrapper.className = "changeableAttributesWrapper marginTop8";
        const rotationButton = document.createElement("button");
        rotationButton.className = "levelNavigationButton buttonWithIconAndText";
        rotationButton.onclick = (e) => {
            currentObject.turnObject();
            document.getElementById("directionValue").innerHTML = currentObject.currentFacingDirection;
        };
        const rotationImg = document.createElement("img");
        Helpers.addAttributesToHTMLElement(rotationImg, {
            "src": directions.length === 2 ? "images/icons/mirror.svg" : "images/icons/rotate.svg", width: 16, height: 16,
            class: "iconInButtonWithText"
        });
        rotationButton.appendChild(rotationImg);
        rotationWrapper.appendChild(rotationButton);
        const rotationValue = document.createElement("span");
        rotationValue.id = "directionValue";
        rotationValue.innerHTML = currentObject.currentFacingDirection;
        rotationWrapper.appendChild(rotationValue);
        const info = document.createElement("span");
        Helpers.addAttributesToHTMLElement(info, {
            role: "tooltip", 'data-microtip-size': 'large', 'aria-label': 'You can also press shift before placing an object to change it`s default direction.',
            'data-microtip-position': 'top-left'
        });
        info.style.margin = "12px 0 0 8px";
        const infoImage = document.createElement("img");
        Helpers.addAttributesToHTMLElement(infoImage, {
            src: "images/icons/info.svg", width: "16", height: "16"
        });
        info.appendChild(infoImage);
        rotationWrapper.appendChild(info);
        return rotationWrapper;
    }

    static createToggleSwitch(attribute, currentObject) {
        const wrapper = document.createElement("div");
        wrapper.className = "changeableAttributesWrapper marginTop8";
        const switchEl = document.createElement("label");
        switchEl.className = "switch";

        let currentValue = attribute.defaultValue;
        if (currentObject) {
            currentValue = currentObject.type === ObjectTypes.PATH_POINT ? currentObject.getPathValue(attribute.name) : currentObject[attribute.name];
        }

        const checkbox = document.createElement("input");
        checkbox.id = attribute.name;
        checkbox.type = "checkbox";
        attribute.options.forEach(option => {
            if (option.true === currentValue) {
                checkbox.checked = true;
            }
        });
        checkbox.onclick = (event) => {
            const checkboxValue = event.target.checked;
            const currentOption = attribute.options.find(option =>
                option[checkboxValue]
            );
            const currentValue = currentOption[checkboxValue];
            currentObject && currentObject.addChangeableAttribute(attribute.name, currentValue);
            document.getElementById("switchValue").innerHTML = currentValue;
        };

        const spanEl = document.createElement("span");
        spanEl.className = "switchSlider";

        switchEl.appendChild(checkbox);
        switchEl.appendChild(spanEl);
        wrapper.appendChild(switchEl);

        const switchValue = document.createElement("span");
        switchValue.id = "switchValue";

        switchValue.innerHTML = currentValue;
        wrapper.appendChild(switchValue);
        return wrapper;
    }

    static createDialogueWindow(attribute, currentObject) {
        const dialogueWrapper = document.createElement("div");
        dialogueWrapper.id = "dialogueWrapper";
        this.createDialogueContent(attribute, currentObject, dialogueWrapper);
        return dialogueWrapper;
    }

    static resetDialogueContent(event, attribute, currentObject, dialogueWrapper, allDialogues, allAvatars) {
        event.stopPropagation();
        currentObject.addChangeableAttribute(attribute.name, allDialogues);
        currentObject.addChangeableAttribute("avatars", allAvatars);
        dialogueWrapper.innerHTML = ""
        this.createDialogueContent(attribute, currentObject, dialogueWrapper);
    }

    static changePlayButtonStyles(firstClass, secondClass) {
        const playPauseButton = document.getElementById("playPauseText");
        playPauseButton.classList.remove(firstClass);
        playPauseButton.classList.add(secondClass);
    }

    static renderPlayButton(firstTime) {
        document.getElementById("changeGameMode").innerHTML = `<div class="playbutton_top"> 
            <img src="images/icons/right.svg" class="iconInButtonWithText" alt="play" width="14" height="14">
            <span id="playPauseText"style="display: inline-block;">Play</span>
        </div>`;
        !firstTime && this.changePlayButtonStyles("move", "back");
    }

    static renderPauseButton(firstTime) {
        document.getElementById("changeGameMode").innerHTML = `<div class="playbutton_top"> 
            <img src="images/icons/pause.svg" class="iconInButtonWithText" alt="pause" width="14" height="14">
            <span id="playPauseText" style="display: inline-block;">Stop</span>
        </div>`;
        !firstTime && this.changePlayButtonStyles("back", "move");
    }

    static populateSvg(svgElement, alt, width, height, src) {
        Helpers.addAttributesToHTMLElement(svgElement, {
            "alt": alt,
            "width": width,
            "height": height,
            "src": src,
        });
    }

    static createLevelHelpersTooltip(disabledPasteButton) {
        const template = Object.assign(
            document.createElement(`div`),
            {
                innerHTML: `
                    <div class="flexRows">
                        <button id="copyLevelButton" title="copy level" class="levelNavigationButton buttonWithIconAndText"
                            onClick="LevelNavigationHandler.copyLevel(event)">
                            <img src="images/icons/copy.svg" class="iconInButtonWithText" alt="copyLevel"
                            width="16" height="16">
                        </button>
                        <button id="pasteLevelButton" title="paste level" class="levelNavigationButton buttonWithIconAndText"
                            onClick="LevelNavigationHandler.showPasteLevelModal()">
                            <img id="pasteIcon" src="images/icons/paste.svg" class="iconInButtonWithText ${disabledPasteButton ? "greyFilter" : ""}" alt="pasteLevel"
                            width="16" height="16">
                        </button>
                        <button id="deleteHelper" title="delete level" class="levelNavigationButton buttonWithIconAndText"
                            onClick="ModalHandler.showModal('deleteLevelModal');">
                            <img src="images/icons/delete.svg" class="iconInButtonWithText" alt="deleteHelper"
                            width="16" height="16">
                        </button>
                    </div>
                `
            });
        template.style.whiteSpace = "initial";
        return template
    }

    static createDrawHelpersToolsTop() {
        const { currentSpriteHeight, currentSpriteWidth } = DrawSectionHandler;
        const sameHeightAndWidth = currentSpriteHeight === currentSpriteWidth;
        const disabledOption = sameHeightAndWidth ? "" : "disabled";
        const rotateButtonClasses = sameHeightAndWidth ? "iconInButtonWithText" : "iconInButtonWithText greyFilter";

        const template = Object.assign(
            document.createElement(`div`),
            {
                innerHTML: `
                    <div>
                        <div class="flexRows">
                            <button id="rotateLeftHelper" ${disabledOption} title="rotate left" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.rotateRight()">
                                <img src="images/icons/rotateLeft.svg" class="${rotateButtonClasses}" alt="rotateLeftHelper"
                                width="16" height="16">
                            </button>
                            <button id="longArrowUpHelper" title="move up" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.moveUp()">
                                <img src="images/icons/longArrowUp.svg" class="iconInButtonWithText" alt="longArrowUpHelper"
                                width="16" height="16">
                            </button>
                            <button id="rotateRightHelper" ${disabledOption} title="rotate right" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.rotateLeft()">
                                <img src="images/icons/rotateRight.svg" class="${rotateButtonClasses}" alt="rotateRightHelper"
                                width="16" height="16">
                            </button>
                        </div>
                        <div class="flexRows marginTop8">
                            <button id="longArrowLeftHelper" title="move left" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.moveLeft()">
                                <img src="images/icons/longArrowLeft.svg" class="iconInButtonWithText" alt="longArrowLeftHelper"
                                width="16" height="16">
                            </button>
                            <button id="longArrowDownHelper" title="move down" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.moveDown()">
                                <img src="images/icons/longArrowDown.svg" class="iconInButtonWithText" alt="longArrowDownHelper"
                                width="16" height="16">
                            </button>
                            <button id="longArrowRightHelper" title="move right" class="levelNavigationButton buttonWithIconAndText"
                                onClick="DrawHelpers.moveRight()">
                                <img src="images/icons/longArrowRight.svg" class="iconInButtonWithText" alt="longArrowRightHelper"
                                width="16" height="16">
                            </button>
                        </div>
                    </div>
                    <div class="flexRows subSection">
                        <button id="mirrorHelper" title="mirror horizontally" class="levelNavigationButton buttonWithIconAndText"
                            onClick="DrawHelpers.flipHorzontally()">
                            <img src="images/icons/mirror.svg" class="iconInButtonWithText" alt="mirrorHelper"
                            width="16" height="16">
                        </button>
                        <button id="mirrorVerticalHelper" title="mirror vertically" class="levelNavigationButton buttonWithIconAndText"
                            onClick="DrawHelpers.flipVertically()">
                            <img src="images/icons/mirrorVertical.svg" class="iconInButtonWithText" alt="mirrorVerticalHelper"
                            width="16" height="16">
                        </button>
                        <button id="deleteHelper" title="delete drawing" class="levelNavigationButton buttonWithIconAndText"
                            onClick="DrawHelpers.deleteSprite()">
                            <img src="images/icons/delete.svg" class="iconInButtonWithText" alt="deleteHelper"
                            width="16" height="16">
                        </button>
                    </div>
                `
            });
        template.style.whiteSpace = "initial";
        return template
    }

    static getRightEyeIcon(layerVisibility) {
        return layerVisibility ? "images/icons/eye.svg" : "images/icons/closedEye.svg";
    }

    static createLayersTooltip() {
        const template = Object.assign(
            document.createElement(`div`),
            {
                innerHTML:
                    `
                                <table class="fullWidth">
                                    <tr>
                                        <td style="width: 24px">
                                            <button id="waterLayer" class="layerButton levelNavigationButton"
                                                onClick="LayerHandler.layerVisibilityButtonClicked(event)">
                                                <img src=${this.getRightEyeIcon(LayerHandler.waterLayer)} width="16" height="16">
                                            </button>
                                        </td>
                                        <td>Water</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button id="decoLayer" class="layerButton levelNavigationButton"
                                                onClick="LayerHandler.layerVisibilityButtonClicked(event)">
                                                <img src=${this.getRightEyeIcon(LayerHandler.decoLayer)} width="16" height="16">
                                            </button>
                                        </td>
                                        <td>Deco</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button id="objectLayer" class="layerButton levelNavigationButton"
                                                onClick="LayerHandler.layerVisibilityButtonClicked(event)">
                                                <img src=${this.getRightEyeIcon(LayerHandler.objectLayer)} width="16" height="16">
                                            </button>
                                        </td>
                                        <td>Objects</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button id="tileLayer" class="layerButton levelNavigationButton"
                                                onClick="LayerHandler.layerVisibilityButtonClicked(event)">
                                                <img src=${this.getRightEyeIcon(LayerHandler.tileLayer)} width="16" height="16">
                                            </button>
                                        </td>
                                        <td>Tiles</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button id="foregroundLayer" class="layerButton levelNavigationButton"
                                                onClick="LayerHandler.layerVisibilityButtonClicked(event)">
                                                <img src=${this.getRightEyeIcon(LayerHandler.foregroundLayer)} width="16" height="16">
                                            </button>
                                        </td>
                                        <td>Foreground</td>
                                    </tr>
                                </table>
                            `
            });
        template.style.whiteSpace = "normal";
        return template;
    }

    static createDialogueContent(attribute, currentObject, dialogueWrapper) {
        const maxDialogues = 5;
        currentObject.dialogue.forEach((dialogueBit, index) => {
            const dialogueBitWrapper = document.createElement("div");
            dialogueBitWrapper.className = "marginTop8"
            dialogueBitWrapper.style.display = "flex"
            const textValue = document.createElement("textarea");
            Helpers.addAttributesToHTMLElement(textValue, {
                "maxlength": 239,
                "rows": "4",
                "placeholder": "Add text here..."
            });
            textValue.value = dialogueBit;
            //TODO: might have bad performance
            textValue.onkeyup = (event) => {
                Helpers.debounce(() => {
                    const allDialogues = [...currentObject.dialogue];
                    allDialogues[index] = event.target.value;
                    currentObject.addChangeableAttribute(attribute.name, allDialogues);
                }, 300);
            }
            textValue.className = "dialogueText";
            dialogueBitWrapper.appendChild(textValue);

            const buttonsWrapper = document.createElement("div");


            //Create empty avatar button
            if (!currentObject.avatars[index]) {
                const avatarButton = document.createElement('button');
                avatarButton.className = "color-button levelNavigationButton buttonWithIconAndText";
                const avatarImg = document.createElement("img");
                Helpers.addAttributesToHTMLElement(avatarImg, {
                    "width": 16,
                    "height": 16,
                    "alt": "avatar",
                    "src": "images/icons/smile.svg",
                });
                avatarImg.className = "iconInButtonWithText";
                avatarButton.style.padding = "8px";
                avatarButton.onclick = (event) => {
                    event.stopPropagation();
                    const clickPos = event.target.getBoundingClientRect();
                    document.getElementById("dialogueAvatarTooltip").style.top = clickPos.top - 130 + "px";
                    document.getElementById("dialogueAvatarTooltip").style.left = clickPos.left + "px";
                    this.showDialogueAvatarTooltip(currentObject, index, attribute)
                };
                avatarButton.appendChild(avatarImg);
                buttonsWrapper.appendChild(avatarButton);
            }
            else {
                //Create avatar button with value
                const sSprite = SpritePixelArrays.getSpritesByDescrpitiveName(currentObject.avatars[index].descriptiveName);
                var sSCanvas = document.createElement('canvas');
                Helpers.addAttributesToHTMLElement(sSCanvas, {
                    "width": tileMapHandler.tileSize,
                    "height": tileMapHandler.tileSize, "id": "selectedSprite" + index
                });
                sSCanvas.className = "cursorPointer";
                sSCanvas.style.padding = "5px";
                sSCanvas.style.display = "block";
                sSCanvas.onclick = (event) => {
                    event.stopPropagation();
                    const clickPos = event.target.getBoundingClientRect();
                    document.getElementById("dialogueAvatarTooltip").style.top = clickPos.top - 130 + "px";
                    document.getElementById("dialogueAvatarTooltip").style.left = clickPos.left + "px";
                    this.showDialogueAvatarTooltip(currentObject, index, attribute)
                };
                sSCanvas.style.background = "#" + WorldDataHandler.backgroundColor;
                const ctx = sSCanvas.getContext('2d');
                //null check  if custom sprite was deleted
                if (sSprite[0]) {
                    const animationFrame = sSprite[0].animation[0];
                    Display.drawPixelArray(animationFrame.sprite, 0, 0, tileMapHandler.pixelArrayUnitSize, animationFrame.sprite[0].length, animationFrame.sprite.length, ctx);
                }
                buttonsWrapper.appendChild(sSCanvas);
            }

            if (currentObject.dialogue.length > 1) {
                const button = document.createElement("img");
                this.populateSvg(button, "delete", "16", "16", `images/icons/delete.svg`);
                button.className = "marginTop8 hovereableRedSvg deleteDialogue";
                button.onclick = (event) => {
                    const allDialogues = [...currentObject.dialogue];
                    allDialogues.splice(index, 1);
                    const allAvatars = [...currentObject.avatars];
                    allAvatars.splice(index, 1);
                    this.resetDialogueContent(event, attribute, currentObject, dialogueWrapper, allDialogues, allAvatars);
                };
                buttonsWrapper.appendChild(button);
            }

            dialogueBitWrapper.appendChild(buttonsWrapper);
            dialogueWrapper.appendChild(dialogueBitWrapper);
        });
        if (currentObject.dialogue.length < maxDialogues) {
            const addMoreButtonWrapper = document.createElement("div");
            addMoreButtonWrapper.id = "addMoreButtonWrapper";
            const addMoreButton = document.createElement("button");
            addMoreButton.className = "levelNavigationButton fullWidth marginTop8";
            const plusIcon = document.createElement("img");
            this.populateSvg(plusIcon, "plus", "14", "14", "images/icons/plus.svg");
            addMoreButton.onclick = (event) => {
                const allDialogues = [...currentObject.dialogue];
                allDialogues.push("");
                const allAvatars = [...currentObject.avatars];
                allAvatars.push(null);
                this.resetDialogueContent(event, attribute, currentObject, dialogueWrapper, allDialogues, allAvatars);
            };
            addMoreButton.appendChild(plusIcon);
            addMoreButtonWrapper.appendChild(addMoreButton);
            dialogueWrapper.appendChild(addMoreButtonWrapper);
        }
        const checkBoxWrapper = document.createElement("div");
        checkBoxWrapper.className = "subSection";
        const input = document.createElement('input');
        input.id = "playAutomatically";
        input.checked = currentObject.playAutomatically;
        input.type = "checkbox";
        input.name = "playAutomatically";
        input.onchange = (event) => {
            const value = event.currentTarget.checked;
            currentObject.addChangeableAttribute("playAutomatically", value);
        };
        checkBoxWrapper.appendChild(input);
        const label = document.createElement('label');
        Helpers.addAttributesToHTMLElement(label, { "for": "playAutomatically" });
        label.innerHTML = ' Play automatically once upon touching';
        label.style = "vertical-align: top";
        checkBoxWrapper.appendChild(label);
        dialogueWrapper.appendChild(checkBoxWrapper);
    }

    static createSelect(attribute, currentObject) {
        const template = document.createElement("div");
        const label = document.createElement("label");
        label.for = "elementSelect";
        label.className = "leftLabel";
        label.innerHTML = attribute.name;
        template.appendChild(label);
        const selectEl = document.createElement("select");
        selectEl.name = "elementSelect";
        selectEl.id = "elementSelect";
        selectEl.onchange = (event) => {
            const value = event.currentTarget.value;
            currentObject.addChangeableAttribute(attribute.name, value);
        }

        template.appendChild(selectEl);
        attribute.values.map(value => {
            const optionEl = document.createElement("option");
            optionEl.value = value;
            optionEl.innerHTML = value;
            selectEl.appendChild(optionEl);
            if (value == currentObject[attribute.name]) {
                optionEl.selected = true;
            }
        })
        return template;
    }

    static createPlayerPowerUpTooltip(player) {
        const wrapper = document.createElement("div");

        player.powerUpTypes.forEach(powerUpType => {
            const checkBoxWrapper = document.createElement("div");
            checkBoxWrapper.style.width = "fit-content";
            checkBoxWrapper.className = "marginTop8";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = player[powerUpType];
            checkbox.id = powerUpType
            checkbox.onclick = (event) => {
                const checkboxValue = event.target.checked;
                player[powerUpType] = checkboxValue;
            };
            const labelForCheckBox = document.createElement("label");
            Helpers.addAttributesToHTMLElement(labelForCheckBox, {
                for: powerUpType
            });
            labelForCheckBox.style.marginRight = "8px";
            labelForCheckBox.className = "radioButtonLabel marginTop8";
            labelForCheckBox.innerHTML = SpritePixelArrays.playerPowerUpMapper[powerUpType];
            checkBoxWrapper.appendChild(checkbox);
            checkBoxWrapper.appendChild(labelForCheckBox);
            wrapper.appendChild(checkBoxWrapper);
        })
        return wrapper;
    }
}