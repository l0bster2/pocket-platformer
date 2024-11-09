class LevelEntrancePicker {
    
    static generateCustomExitStringForObject(levelIndex, levelObject) {
        // accepts both WorldData levelObjects (data dicts) and TileMapHandler levelObjects (object instances)
        let objectIdentifier = levelObject.extraAttributes?.flagIndex || levelObject.flagIndex;
        return `${levelIndex},${levelObject.type},${objectIdentifier}`;
    }

    static convertCustomExitToString(customExit) {
        if (!customExit) {
            // null is used to target the next level
            return null;
        }
        if (!customExit.flagIndex) {
            // targeting default start for level (or finish game, most likely)
            if (customExit.levelIndex === WorldDataHandler.levels.length - 1) {
                return 'finishGame';
            } else {
                // this might not be used currently? could be worth putting into the UI though
                return `${customExit.levelIndex}`;
            }
        }

        if (!customExit.objectType) {
            // Older data format, before doors. Only StartFlags were entrances then.
            customExit = {...customExit, objectType: ObjectTypes.START_FLAG};
        }

        return `${customExit.levelIndex},${customExit.type},${customExit.flagIndex}`
    }

    static parseCustomExitString(customExitString) {
        if (!customExitString) {
            return null;
        }

        if (customExitString === 'finishGame') {
            return { 
                levelIndex: WorldDataHandler.levels.length - 1 
            };
        }

        const valueArray = customExitString.split(",");
        if (valueArray.length !== 3) {
            console.warn(`unexpected custom exit string: "${customExitString}" -- things may break!`);
            return;
        }
        
        return { 
            levelIndex:  parseInt(valueArray[0]),
            type:valueArray[1], // ObjectType of destination object
            flagIndex: valueArray[2] // (effectively the id of the destination object, where the player will appear)
        };
    }

    static create(entranceTypesAllowed, currentObject, selectHandler) {
        if (!entranceTypesAllowed) {
            entranceTypeOptions = {};
            entranceTypeOptions[ObjectTypes.START_FLAG] = true;
            entranceTypeOptions[ObjectTypes.DOOR] = true;
        }

        const wrapper = document.createElement("div");

        const firstButtonWrapper = document.createElement("div");
        const nextLevelButton = document.createElement("input");
        Helpers.addAttributesToHTMLElement(nextLevelButton, {
            type: "radio", id: "nextLevel", value: "nextLevel", name: "levelSelector"
        });
        const nextLevelButtonLabel = document.createElement("label");
        Helpers.addAttributesToHTMLElement(nextLevelButtonLabel, {
            for: "nextLevel"
        });
        nextLevelButtonLabel.className = "radioButtonLabel";
        nextLevelButtonLabel.innerHTML = "Next Level";
        firstButtonWrapper.append(nextLevelButton, nextLevelButtonLabel);

        const secondButtonWrapper = document.createElement("div");
        secondButtonWrapper.className = "marginTop8";

        const customExitButton = document.createElement("input");
        Helpers.addAttributesToHTMLElement(customExitButton, {
            type: "radio", id: "customLevel", value: "customLevel", name: "levelSelector"
        });
        const customExitButtonLabel = document.createElement("label");
        Helpers.addAttributesToHTMLElement(customExitButtonLabel, {
            for: "customLevel"
        });
        customExitButtonLabel.className = "radioButtonLabel";
        customExitButtonLabel.innerHTML = "Custom";
        const entranceSelector = document.createElement("select");
        if (!currentObject.customExit) {
            entranceSelector.disabled = true;
        }
        customExitButtonLabel.appendChild(entranceSelector);
        secondButtonWrapper.append(customExitButton, customExitButtonLabel);
        const currentObjectFlagIndex = currentObject.flagIndex || currentObject.extraAttributes?.flagIndex;
        WorldDataHandler.levels.forEach((level, levelIndex) => {
            if (levelIndex === 0) {
                return;
            }
            if (levelIndex === WorldDataHandler.levels.length - 1) {
                return;
            }

            let viableEntrances = {};
            level.levelObjects.forEach(levelObject => {
                let objTyp = levelObject.type;
                if (entranceTypesAllowed[objTyp] && levelObject.extraAttributes?.flagIndex !== currentObjectFlagIndex) {
                    if (objTyp in viableEntrances) {
                        viableEntrances[objTyp].push(levelObject);
                    }
                    else {
                        viableEntrances[objTyp] = [levelObject];
                    }
                }
            });
            
            for (let type in viableEntrances) {
                let objectTypeName = "Other";
                if (type === ObjectTypes.START_FLAG) {
                    objectTypeName = "Flag";
                }
                else if (type === ObjectTypes.DOOR) {
                    objectTypeName = "Door"
                }
                viableEntrances[type].forEach((levelObject) => {
                    const option = document.createElement("option");
                    option.value = this.generateCustomExitStringForObject(levelIndex, levelObject);
                    option.innerHTML = `Level ${levelIndex}: ${objectTypeName} "${levelObject.extraAttributes?.flagIndex}"`;
                    entranceSelector.appendChild(option);    
                })
            }
        });
        const endOption = document.createElement("option");
        endOption.value = "finishGame";
        endOption.innerHTML = `Ending screen`
        entranceSelector.appendChild(endOption);

        if (currentObject.customExit) {
            customExitButton.checked = true;
            const customExitTextValue = this.convertCustomExitToString(currentObject.customExit);
            var options = entranceSelector.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value === customExitTextValue) {
                    options[i].selected = true;
                    break;
                }
            }
        }
        else {
            nextLevelButton.checked = true;
        }

        nextLevelButton.onchange = () => {
            selectHandler(null);
            entranceSelector.disabled = true;
        };
        customExitButton.onchange = () => {
            entranceSelector.disabled = false;
            const selectedIndex = entranceSelector.selectedIndex;
            selectHandler(this.parseCustomExitString(entranceSelector.options[selectedIndex].value));
        };
        entranceSelector.onchange = (event) => {
            selectHandler(this.parseCustomExitString(event.target.value));
        }
        wrapper.append(firstButtonWrapper, secondButtonWrapper);
        return wrapper;
    }
}