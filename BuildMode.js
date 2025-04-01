class BuildMode {

    static staticConstructor(tileMapHandler, player) {
        this.delete = "delete";
        this.currentSelectedObject = { name: SpritePixelArrays.TILE_1.name, type: SpritePixelArrays.SPRITE_TYPES.tile };
        this.player = player;
        this.tileMapHandler = tileMapHandler;
        this.mousePressed = false;
        this.rightMouseHolding = false;
        this.draggingPlayer = false;
        this.showingToolTip = false;
        this.currentObjectDirection = null;
        this.mouseCursorStyles = {
            default: "default",
            grab: "grab",
            grabbing: "grabbing",
            help: "help",
        }
        this.drawStyles = {
            pencil: "pencil",
            rectangle: "rectangle"
        }
        this.drawStyle = this.drawStyles.pencil;
        this.rectangleStyleDrawing = false;
        this.rectangleDrawingStartingPoint = { x: 0, y: 0 };
        this.rectangleDrawingEndingPoint = { x: 0, y: 0 };
        //objects that are deleted while right mouse is pressed without releasing
        this.objectsDeletedInOneGo = [];
        this.currentMouseCursor = this.mouseCursorStyles.default;
        this.currentAnimationFrame = 0;
        this.objectsCompatibleWithPaths = [
            ObjectTypes.SPIKE,
            ObjectTypes.FINISH_FLAG,
            ObjectTypes.TRAMPOLINE,
            ObjectTypes.TOGGLE_MINE,
            ObjectTypes.ROCKET_LAUNCHER,
            ObjectTypes.PORTAL,
            ObjectTypes.COLLECTIBLE,
            ObjectTypes.BARREL_CANNON,
            ObjectTypes.JUMP_RESET,
            ObjectTypes.ROTATING_FIREBALL_CENTER,
            ObjectTypes.MOVING_PLATFORM,
        ];
        this.currentPreviewOffset = 0;
        this.currentPreviewOffsetChanger = -0.025;
        this.objectsWithoutSFXAfterPlacing = [ObjectTypes.DISAPPEARING_BLOCK, ObjectTypes.BLUE_BLOCK, ObjectTypes.RED_BLOCK];
    }

    static setCurrentSelectedObject(object) {
        this.currentSelectedObject = object;
        if (this.currentSelectedObject.sprite?.directions) {
            this.currentObjectDirection = this.currentSelectedObject.sprite.directions[0];
        }
        else {
            this.currentObjectDirection = null;
        }
    }

    static turnCurrentObject() {
        if (this.currentObjectDirection) {
            const { directions } = this.currentSelectedObject.sprite;
            const currentIndex = directions.indexOf(this.currentObjectDirection);
            const directionsLength = directions.length - 1;
            if (currentIndex === directionsLength) {
                this.currentObjectDirection = directions[0];
            }
            else {
                this.currentObjectDirection = directions[currentIndex + 1];
            }
        }
    }

    static updatePermissionsSquareOffset() {
        this.currentPreviewOffset += this.currentPreviewOffsetChanger;
        if(this.currentPreviewOffset < -0.5) {
            this.currentPreviewOffsetChanger = this.currentPreviewOffsetChanger * -1;
        }
        else if(this.currentPreviewOffset > 0) {
            this.currentPreviewOffsetChanger = this.currentPreviewOffsetChanger * -1;
        }
    }

    static runBuildLogic() {
        if (Game.playMode === Game.PLAY_MODE) {
            return null;
        }
        if (!Controller.mousePressed) {
            if (this.rectangleStyleDrawing) {
                this.drawingAreaReleased();
                this.rectangleStyleDrawing = false;
            }
            this.mousePressed = false;
            this.draggingPlayer = false;
        }
        if (!Controller.rightMousePressed) {
            if (this.rectangleStyleDeletion) {
                this.drawingAreaReleased("deleteObjects");
                this.rectangleStyleDeletion = false;
            }
            if (this.rightMouseHolding) {
                this.checkIfPlayerToolboxNeedsToBeShown();
                this.rightMouseHolding = false;
            }
        }
        if (Controller.shiftReleased && Controller.shiftPressed) {
            this.turnCurrentObject();
        }
        Controller.shiftReleased = !Controller.shiftPressed;
        if (Controller.mouseInsideMainCanvas) {
            const tilePosY = this.tileMapHandler.getTileValueForPosition(Controller.mouseY);
            const tilePosX = this.tileMapHandler.getTileValueForPosition(Controller.mouseX);
            if (tilePosY >= 0 && tilePosX >= 0) {
                const currentTile = this.tileMapHandler.getTileLayerValueByIndex(tilePosY, tilePosX);
                this.buildHandler(currentTile, tilePosX, tilePosY);
            }
        }
    }

    static buildHandler(currentTile, tilePosX, tilePosY) {
        this.updateAnimationFrame();
        let allObjectsAtCurrentTile = this.getObjectsCurrentlyHoveringOver(tilePosX, tilePosY);
        let hoveredOverPlayer = this.checkIfHoveringOverPlayer();
        const placementAllowed = this.checkIfPlacementAllowedHere(allObjectsAtCurrentTile, currentTile, tilePosX, tilePosY);
        this.dragPlayerHandler(allObjectsAtCurrentTile, currentTile, tilePosX, tilePosY);

        //If tile is free -> logic for setting new objects
        if (placementAllowed && !this.draggingPlayer && !hoveredOverPlayer) {
            this.changeMouseCursor(this.mouseCursorStyles.default);

            if (this.rectangleStyleDrawing) {
                this.drawAreaPermissionSquare(this.rectangleDrawingStartingPoint.x, this.rectangleDrawingStartingPoint.y,
                    tilePosX, tilePosY, '90ee90')
            }
            else if (!this.rectangleStyleDeletion) {
                const extraWidth = this.currentSelectedObject.size > 1 ? (this.currentSelectedObject.size - 1) / 2 : 0;
                const offsetToCenter = extraWidth * this.tileMapHandler.tileSize;

                this.drawPermissionSquare(tilePosX - extraWidth, tilePosY, tilePosX + 1 + extraWidth, tilePosY + 1,
                    '90ee90', offsetToCenter);
            }
            //Setting object
            if (Controller.mousePressed) {
                if ((Controller.ctrlPressed || this.drawStyle === this.drawStyles.rectangle) && !this.mousePressed) {
                    this.rectangleDrawingStartingPoint = { x: tilePosX, y: tilePosY };
                    this.rectangleStyleDrawing = true;
                }
                this.mousePressed = true;
                !this.rectangleStyleDrawing && this.setSingleObject(tilePosX, tilePosY);
            }
        }
        //If tile is occupied -> logic for changing and dragging set objects
        else {
            if (hoveredOverPlayer) {
                this.changeMouseCursor(this.mouseCursorStyles.grab);
                if (Controller.mousePressed) {
                    this.changeMouseCursor(this.mouseCursorStyles.grabbing);
                    if (!this.draggingPlayer) {
                        this.draggingPlayer = true;
                        this.player.resetAttributes();
                    }
                }
            }
            else {
                const changeableObjectsHoveringOver = allObjectsAtCurrentTile.filter(objectAtCurrentTile =>
                    (objectAtCurrentTile.spriteObject[0].type === SpritePixelArrays.SPRITE_TYPES.object
                        || objectAtCurrentTile?.type === ObjectTypes.TREADMILL)
                    && objectAtCurrentTile?.type !== ObjectTypes.CANON_BALL && objectAtCurrentTile?.type !== ObjectTypes.ROCKET && objectAtCurrentTile?.type !== ObjectTypes.LASER &&
                    objectAtCurrentTile?.changeableInBuildMode);

                this.changeMouseCursor(this.mouseCursorStyles.default);

                if (!this.rectangleStyleDeletion) {
                    const readyForToolTip = (changeableObjectsHoveringOver.length && !this.mousePressed) || this.showingToolTip;
                    readyForToolTip && this.changeMouseCursor(this.mouseCursorStyles.help);
                    this.drawPermissionSquare(tilePosX, tilePosY, tilePosX + 1, tilePosY + 1, readyForToolTip ? 'FFA500' : '8b0000');
                }

                //Tooltip if click on occupied tile again
                if (Controller.mousePressed && !this.mousePressed) {
                    this.mousePressed = true;

                    if (changeableObjectsHoveringOver.length) {
                        //pass all objects hovering over (should be only paths and objects on top). reverse, so that path attributes are at the bottom
                        this.showTooltipWithExtraAttributes(tilePosX, tilePosY, changeableObjectsHoveringOver.reverse());
                    }
                }
            }
        }
        //Deleting object
        this.deleteHandler(allObjectsAtCurrentTile, currentTile, tilePosX, tilePosY);
    }

    static drawingAreaReleased(option = "setObjects") {
        const sortedXValues = MathHelpers.sortNumbers([this.rectangleDrawingStartingPoint.x, this.rectangleDrawingEndingPoint.x]);
        const sortedYValues = MathHelpers.sortNumbers([this.rectangleDrawingStartingPoint.y, this.rectangleDrawingEndingPoint.y]);

        for (var x = sortedXValues[0]; x <= sortedXValues[1]; x++) {
            for (var y = sortedYValues[0]; y <= sortedYValues[1]; y++) {
                const currentTile = this.tileMapHandler.getTileLayerValueByIndex(y, x);
                let allObjectsAtCurrentTile = this.getObjectsCurrentlyHoveringOver(x, y);

                if (option === "setObjects") {
                    this.checkIfPlacementAllowedHere(allObjectsAtCurrentTile, currentTile, x, y) &&
                        this.setSingleObject(x, y);
                }
                else {
                    this.deleteObject(currentTile, allObjectsAtCurrentTile, x, y);
                }
            }
        }
    }

    static setSingleObject(tilePosX, tilePosY) {
        let { levelObjects, deko } = this.tileMapHandler;

        //Tiles are numbers, other objects are no
        if (isNaN(this.currentSelectedObject?.name)) {
            //deko
            if (this.currentSelectedObject.name === ObjectTypes.DEKO) {
                WorldDataHandler.levels[this.tileMapHandler.currentLevel].deko.push({ x: tilePosX, y: tilePosY, index: this.currentSelectedObject.index ? this.currentSelectedObject.index : 0 });
                deko.push(new Deko(tilePosX, tilePosY, tileMapHandler.tileSize, this.currentSelectedObject.index));
            }
            //objects
            else {
                if (this.currentSelectedObject.name === ObjectTypes.PATH_POINT) {
                    PathBuildHandler.rearrangePaths({ x: tilePosX, y: tilePosY });
                }
                else {
                    //levelObjects = this.checkForSingleAvailableObjects(levelObjects);
                    const extraAttributes = this.currentObjectDirection ?
                        { ...this.currentSelectedObject.extraAttributes, currentFacingDirection: this.currentObjectDirection } :
                        { ...this.currentSelectedObject.extraAttributes };
                    WorldDataHandler.levels[this.tileMapHandler.currentLevel].levelObjects.push({ x: tilePosX, y: tilePosY, type: this.currentSelectedObject.name, extraAttributes });
                    levelObjects.push(new ObjectTypes.objectToClass[this.currentSelectedObject.name]
                        (tilePosX, tilePosY, tileMapHandler.tileSize, this.currentSelectedObject.name, this.tileMapHandler, extraAttributes));
                    if (this.currentSelectedObject.name === ObjectTypes.STOMPER) {
                        this.rearrangeLevelObjectsByXAndYPos();
                    }

                    if (!this.objectsWithoutSFXAfterPlacing.includes(this.currentSelectedObject.name)) {
                        SFXHandler.createSFX(tilePosX * tileMapHandler.tileSize, tilePosY * tileMapHandler.tileSize, 3, AnimationHelper.facingDirections.bottom, 0, 0, true, 8, 1.5);
                    }
                    if (this.objectsCompatibleWithPaths.includes(this.currentSelectedObject.name)) {
                        this.tileMapHandler.paths.forEach(path => {
                            path.checkObjectsOnPath();
                        })
                    }
                }
            }
            //SoundHandler.build.stopAndPlay();
        }
        //tiles
        else {
            const { name } = this.currentSelectedObject;
            //if setting tile at edge and not a special block, set a 1 tile, otherwise the selected tile
            tileMapHandler.tileMap[tilePosY][tilePosX] = tileMapHandler.checkIfPositionAtTheEdge(tilePosX, tilePosY)
                && name !== 5 && !Helpers.objectHasValue(ObjectTypes.SPECIAL_BLOCK_VALUES, name) ? 1 : name;
            tileMapHandler.createStaticTiles();
        }
    }

    static deleteHandler(allObjectsAtCurrentTile, currentTile, tilePosX, tilePosY) {
        if (Controller.rightMousePressed) {
            if ((Controller.ctrlPressed || this.drawStyle === this.drawStyles.rectangle) && !this.rightMouseHolding) {
                this.rectangleDrawingStartingPoint = { x: tilePosX, y: tilePosY };
                this.rectangleStyleDeletion = true;
            }
            this.rightMouseHolding = true;
            if (this.rectangleStyleDeletion) {
                this.drawAreaPermissionSquare(this.rectangleDrawingStartingPoint.x, this.rectangleDrawingStartingPoint.y,
                    tilePosX, tilePosY, '8b0000')
            }
            if ((allObjectsAtCurrentTile.length || currentTile !== 0) && !this.rectangleStyleDeletion) {
                this.deleteObject(currentTile, allObjectsAtCurrentTile, tilePosX, tilePosY);
            }
        }
        else {
            this.objectsDeletedInOneGo = [];
        }
    }

    static updateAnimationFrame() {
        this.currentAnimationFrame++;
        if (this.currentAnimationFrame === 100) {
            this.currentAnimationFrame = 0;
        }
    }

    static checkIfPlacementAllowedHere(allObjectsAtCurrentTile, currentTile, tilePosX, tilePosY) {
        // Objects can be objects, or tiles that don't have value 0 (like blue blocks in the beginning)
        const objectsHoveringOver = allObjectsAtCurrentTile.filter(o =>
            (o.spriteObject[0].type === SpritePixelArrays.SPRITE_TYPES.object ||
                SpritePixelArrays.sometimesPassableBlocks.includes(o.type)) &&
            o.type !== ObjectTypes.PATH_POINT && !SpritePixelArrays.backgroundSprites.includes(o.type) && !SpritePixelArrays.foregroundSprites.includes(o.type));
        const pathsHoveringOver = allObjectsAtCurrentTile.filter(o => o.type === ObjectTypes.PATH_POINT);
        const backgroundObjectsHoveringOver = allObjectsAtCurrentTile.filter(o => SpritePixelArrays.backgroundSprites.includes(o.type));
        const foregroundObjectsHoveringOver = allObjectsAtCurrentTile.filter(o => SpritePixelArrays.foregroundSprites.includes(o.type));
        const decoHoveringOver = allObjectsAtCurrentTile.filter(o => o.type === SpritePixelArrays.SPRITE_TYPES.deko);

        //Objects
        if (this.currentSelectedObject?.type === SpritePixelArrays.SPRITE_TYPES.object) {
            //Moving platform
            if (SpritePixelArrays.movingPlatformSprites.includes(this.currentSelectedObject?.name)) {
                const touchingOtherMovingPlatForm = this.tileMapHandler.layers[3].some(movingPlatform =>
                    Collision.pointAndObjectColliding(
                        this.tileMapHandler.getValuePositionsForTile(tilePosX, tilePosY),
                        movingPlatform.fakeHitBox
                    ))
                if (touchingOtherMovingPlatForm) {
                    return false;
                }
            }
            //Path
            if (this.currentSelectedObject?.name === ObjectTypes.PATH_POINT) {
                return currentTile === 0 && PathBuildHandler.checkIfPathPlacementFree(tilePosX, tilePosY) && pathsHoveringOver.length === 0 &&
                    (objectsHoveringOver.length === 0 || (objectsHoveringOver.length === 1 && this.objectsCompatibleWithPaths.includes(objectsHoveringOver[0]?.type)));
            }
            //Compatible with path
            else if (this.objectsCompatibleWithPaths.includes(this.currentSelectedObject?.name)) {
                return currentTile === 0 && objectsHoveringOver.length === 0;
            }
            //Rest of objects
            else {
                return currentTile === 0 && objectsHoveringOver.length === 0 && pathsHoveringOver.length === 0;
            }
        }
        //Background objects
        else if (SpritePixelArrays.backgroundSprites.includes(this.currentSelectedObject?.name)) {
            return backgroundObjectsHoveringOver.length === 0;
        }
        //Foreground objects
        else if (SpritePixelArrays.foregroundSprites.includes(this.currentSelectedObject?.name)) {
            return foregroundObjectsHoveringOver.length === 0;
        }
        //Deko - not allowed to put on top of other deko
        else if (this.currentSelectedObject?.type === SpritePixelArrays.SPRITE_TYPES.deko) {
            return decoHoveringOver.length === 0;
        }
        //Tiles
        return objectsHoveringOver.length === 0 && pathsHoveringOver.length === 0 && currentTile === 0;
    }

    static rearrangeLevelObjectsByXAndYPos() {
        /*
            If stomper is added, it's important which stomper is activated first, because of collission detection.
            If 2 stompers are on top of each other, it's important that the bottom one starts moving first
        */
        this.tileMapHandler.levelObjects.sort((firstEl, secondEl) => {
            return TilemapHelpers.sortArrayByXandY(firstEl, secondEl, firstEl?.currentFacingDirection, secondEl?.currentFacingDirection,
                { x: firstEl.initialX, y: firstEl.initialY }, { x: secondEl.initialX, y: secondEl.initialY });
        });
        WorldDataHandler.levels[this.tileMapHandler.currentLevel].levelObjects.sort((firstEl, secondEl) => {
            return TilemapHelpers.sortArrayByXandY(firstEl, secondEl, firstEl?.extraAttributes?.currentFacingDirection || null, secondEl?.extraAttributes?.currentFacingDirection || null,
                { x: firstEl.x, y: firstEl.y }, { x: secondEl.x, y: secondEl.y });
        });
    }

    static showTooltipWithExtraAttributes(tilePosX, tilePosY, currentObjects) {
        const heading = "Object properties";
        const content = document.createElement("div");
        this.showingToolTip = true;

        const objectsInlcudePath = currentObjects.some(o => o.type === ObjectTypes.PATH_POINT);

        currentObjects.forEach((currentObject, index) => {
            const spriteObject = SpritePixelArrays.getSpritesByName(currentObject.type)[0];

            // If mutliple objects or only path, clarify which properties belong wo which object
            if (objectsInlcudePath) {
                const heading = ObjectsTooltipElementsRenderer.createSmallHeading(`${spriteObject.descriptiveName} properties:`);
                content.appendChild(heading);
            }

            if (currentObject?.type === ObjectTypes.START_FLAG) {
                const startFlagToolTip = ObjectsTooltipElementsRenderer.startFlagToolTip(currentObject);
                content.appendChild(startFlagToolTip);
            }
            else if (currentObject?.type === ObjectTypes.FINISH_FLAG) {
                const finishFlagToolTip = ObjectsTooltipElementsRenderer.finishFlagToolTip(currentObject, this.tileMapHandler);
                content.appendChild(finishFlagToolTip);
            }
            if (spriteObject.directions && currentObject?.type !== ObjectTypes.PATH_POINT) {
                const rotationWrapper = ObjectsTooltipElementsRenderer.createRotationHandlerForObjects(currentObject, spriteObject.directions);
                content.appendChild(rotationWrapper);
            }
            if (spriteObject.changeableAttributes && currentObject?.type !== ObjectTypes.FINISH_FLAG) {
                spriteObject.changeableAttributes.forEach(attribute => {
                    if (attribute.name === SpritePixelArrays.changeableAttributeTypes.dialogue) {
                        const dialogueWindow = ObjectsTooltipElementsRenderer.createDialogueWindow(attribute, currentObject);
                        content.appendChild(dialogueWindow);
                    }
                    else if (attribute.formElement === SpritePixelArrays.changeableAttributeFormElements.toggle) {
                        const toggleSwitch = ObjectsTooltipElementsRenderer.createToggleSwitch(attribute, currentObject);
                        content.appendChild(toggleSwitch);
                    }
                    else if (attribute.formElement === SpritePixelArrays.changeableAttributeFormElements.checkbox) {
                        const checkboxWrapper = ObjectsTooltipElementsRenderer.createCheckbox(attribute, attribute.checkboxDescription, currentObject);
                        content.appendChild(checkboxWrapper);
                    }
                    else if (attribute.formElement === SpritePixelArrays.changeableAttributeFormElements.select) {
                        const selectWrapper = ObjectsTooltipElementsRenderer.createSelect(attribute, currentObject);
                        content.appendChild(selectWrapper);
                    }
                    else {
                        const sliderWrapper = ObjectsTooltipElementsRenderer.createSliderForChangeableAttribute(attribute, currentObject);
                        content.appendChild(sliderWrapper);
                    }
                })
            }
            if (index != currentObjects.length - 1) {
                const lineBreakDiv = document.createElement("div");
                lineBreakDiv.className = 'subSection';
                content.appendChild(lineBreakDiv);
            }
        })

        const submitButtonWrapper = document.createElement("div");
        submitButtonWrapper.className = "subSection";
        const submitButton = document.createElement("button");
        submitButton.innerHTML = "ok";
        submitButton.onclick = (e) => { TooltipHandler.closeTooltip(e, "canvasObjectToolTip"); };
        submitButton.className = "levelNavigationButton fullWidth";
        submitButtonWrapper.append(submitButton);
        content.appendChild(submitButtonWrapper);

        const posInTool = this.tileMapHandler.getValuePositionsForTile(tilePosX, tilePosY + 1);
        const xPos = canvasOffsetLeft + posInTool.x - 120 - this.tileMapHandler.halfTileSize - Camera.viewport.left;
        const yPos = canvasOffsetTop + posInTool.y - Camera.viewport.top;
        TooltipHandler.repositionAndShowTooltip("canvasObjectToolTip", yPos, xPos, heading, content)
    }

    static getObjectsCurrentlyHoveringOver(tilePosX, tilePosY) {
        let allObjectsAtCurrentTile = [];

        this.tileMapHandler.paths.forEach(path => {
            path.pathPoints.forEach(pathPoint => {
                if (pathPoint.initialX === tilePosX && pathPoint.initialY === tilePosY) {
                    allObjectsAtCurrentTile.push(pathPoint);
                }
            });
        });
        ["levelObjects", "deko"].forEach(levelObjectsArr => {
            loop1:
            for (var i = 0; i < this.tileMapHandler[levelObjectsArr].length; i++) {
                const levelObject = this.tileMapHandler[levelObjectsArr][i];
                if (levelObject.initialX === tilePosX && levelObject.initialY === tilePosY) {
                    allObjectsAtCurrentTile.push(levelObject);
                    //we can break the loop, because there can only be one of objects or deko at one tile position
                    //break loop1;
                }
            }
        });

        return allObjectsAtCurrentTile;
    }

    static checkIfHoveringOverPlayer() {
        return Collision.pointAndObjectColliding({ x: Controller.mouseX, y: Controller.mouseY }, this.player);
    }

    static dragPlayerHandler(allObjectsAtCurrentTile, currentTile, tilePosX, tilePosY) {
        if (currentTile != null && Controller.pause) {
            this.player.x = tilePosX * this.tileMapHandler.tileSize;
            this.player.y = (tilePosY + 1) * this.tileMapHandler.tileSize - this.player.drawHeight;
        }
        if (this.draggingPlayer && currentTile === 0 &&
            (allObjectsAtCurrentTile.length === 0 ||
                allObjectsAtCurrentTile.every(objectAtCurrentTile =>
                    objectAtCurrentTile.spriteObject[0].type === SpritePixelArrays.SPRITE_TYPES.deko ||
                    SpritePixelArrays.backgroundSprites.includes(objectAtCurrentTile.spriteObject[0]?.name) ||
                    SpritePixelArrays.foregroundSprites.includes(objectAtCurrentTile.spriteObject[0]?.name)
                ))) {
            this.player.x = tilePosX * this.tileMapHandler.tileSize;
            this.player.y = (tilePosY + 1) * this.tileMapHandler.tileSize - this.player.drawHeight;
        }
    }

    static changeMouseCursor(type) {
        if (this.currentMouseCursor !== type) {
            this.currentMouseCursor = type;
            document.body.style.cursor = type;
        }
    }

    static checkForSingleAvailableObjects(levelObjects) {
        let newLevelObjects = levelObjects;

        if (this.currentSelectedObject?.name === ObjectTypes.FINISH_FLAG
            || this.currentSelectedObject?.name === ObjectTypes.START_FLAG) {
            let singleObjectIndex = -1;
            newLevelObjects.forEach((levelObject, index) => {
                if (levelObject.type === this.currentSelectedObject?.name) {
                    singleObjectIndex = index;
                }
            });
            if (singleObjectIndex > -1) {
                newLevelObjects.splice(singleObjectIndex, 1);
                WorldDataHandler.levels[this.tileMapHandler.currentLevel].levelObjects.splice(singleObjectIndex, 1);
            }
        }
        return newLevelObjects;
    }

    static deleteObject(currentTile, allObjectsAtCurrentTile, tilePosX, tilePosY) {
        if (currentTile !== 0) {
            tileMapHandler.tileMap[tilePosY][tilePosX] = 0;
        }
        if (allObjectsAtCurrentTile.length) {
            if (allObjectsAtCurrentTile[0].initialX === tilePosX && allObjectsAtCurrentTile[0].initialY === tilePosY) {
                TooltipHandler.closeTooltip(null, "canvasObjectToolTip");
            }

            SFXHandler.createSFX(tilePosX * tileMapHandler.tileSize, tilePosY * tileMapHandler.tileSize, 2,
                AnimationHelper.facingDirections.bottom, 0,
                0, true, 16, 2);
            let positionsToRemove = [{ tilePosX, tilePosY }];
            this.findAdditionalObjectsToRemove(allObjectsAtCurrentTile, positionsToRemove)
            positionsToRemove.forEach(positionToRemove => {
                const { tilePosX, tilePosY } = positionToRemove;
                this.removeFromData("levelObjects", tilePosX, tilePosY);
                this.removeFromData("deko", tilePosX, tilePosY);
                PathBuildHandler.removePathFromData(tilePosX, tilePosY, this.objectsDeletedInOneGo);
            })
        }
        tileMapHandler.createStaticTiles();
    }

    static findAdditionalObjectsToRemove(allObjectsAtCurrentTile, positionsToRemove) {
        const portalInObjects = allObjectsAtCurrentTile.find(objectAtCurrentTile => objectAtCurrentTile.type === ObjectTypes.PORTAL);
        if (portalInObjects) {
            const otherPortal = portalInObjects.findOtherExit();
            if (otherPortal) {
                positionsToRemove.push({ tilePosX: otherPortal.initialX, tilePosY: otherPortal.initialY });
            }
        }
        return positionsToRemove;
    }

    static removeFromData(arrayName, tilePosX, tilePosY) {
        const arr = this.tileMapHandler[arrayName];
        const arrLength = arr.length - 1;
        for (var i = arrLength; i >= 0; i--) {
            if (arr[i].initialX === tilePosX && arr[i].initialY === tilePosY) {
                this.objectsDeletedInOneGo.push({ x: tilePosX, y: tilePosY });
                arr[i]?.type === ObjectTypes.START_FLAG && this.resetInitialPlayerPosition(tilePosX, tilePosY);
                arr.splice(i, 1);
                WorldDataHandler.levels[this.tileMapHandler.currentLevel][arrayName].splice(i, 1);
            }
        }
    }

    static resetInitialPlayerPosition(x, y) {
        const startFlags = this.tileMapHandler.levelObjects.filter(levelObject => levelObject.type === ObjectTypes.START_FLAG);
        //if startflag with players initial position was deleted, find next best flag to be his initial position
        if (startFlags.length > 1 &&
            this.player.initialX / this.tileMapHandler.tileSize === x &&
            this.player.initialY / this.tileMapHandler.tileSize === y) {
            const nextStartFlag = startFlags.find(startFlag => startFlag.initialX !== x && startFlag.initialY !== y);
            if (nextStartFlag) {
                this.player.initialX = nextStartFlag.initialX * this.tileMapHandler.tileSize;
                this.player.initialY = nextStartFlag.initialY * this.tileMapHandler.tileSize;
            }
        }
    }

    static changeDrawStyle(style) {
        this.drawStyle = style;
    }

    static drawAreaPermissionSquare(x, y, endPosX, endPosY, color) {
        this.rectangleDrawingEndingPoint = { x: endPosX, y: endPosY };
        const yValues = MathHelpers.sortNumbers([y, endPosY]);
        const xValues = MathHelpers.sortNumbers([x, endPosX]);
        this.drawPermissionSquare(xValues[0], yValues[0], 
            xValues[1] + 1, yValues[1] + 1, color);
    }

    static drawObjectPreviewOnScreen(actualXPos, actualYPos) {
        const { tileSize } = tileMapHandler;
        const animationLength = this.currentSelectedObject.sprite.animation.length;

        let xPosInSpriteCanvas = 0;
        if (this.currentObjectDirection) {
            const index = this.currentSelectedObject.sprite.directions.indexOf(this.currentObjectDirection);
            xPosInSpriteCanvas = index * animationLength * tileSize;
        }

        Display.drawImageWithAlpha(tileMapHandler.spriteCanvas,
            xPosInSpriteCanvas, this.currentSelectedObject.canvasYSpritePos,
            tileSize, tileSize, 
            actualXPos, actualYPos, 
            tileSize, tileSize, 0.6);
    }

    static drawPermissionSquare(x, y, endPosX, endPosY, color, centerOffset = 0) {
        this.updatePermissionsSquareOffset();
        const { tileSize } = tileMapHandler;
        const previewX = x * tileSize;
        const previewY = y * tileSize;

        if (color === '90ee90') {
            this.drawObjectPreviewOnScreen(previewX + centerOffset, previewY);
        }
        const actualXPos = previewX + this.currentPreviewOffset;
        const actualYPos = previewY + this.currentPreviewOffset;

        const actualXEndPos = endPosX * tileSize - 1 - this.currentPreviewOffset;
        const actualYEndPos = endPosY * tileSize - 1 - this.currentPreviewOffset;
        Display.drawLine(actualXPos, actualYPos, actualXEndPos, actualYPos, color, 3);
        Display.drawLine(actualXPos, actualYEndPos, actualXEndPos, actualYEndPos, color, 3);
        Display.drawLine(actualXPos, actualYPos, actualXPos, actualYEndPos, color, 3);
        Display.drawLine(actualXEndPos, actualYPos, actualXEndPos, actualYEndPos, color, 3);
    }

    static checkIfPlayerToolboxNeedsToBeShown() {
        const mousePos = {
            x: Controller.mouseX,
            y: Controller.mouseY,
        }
        if (Collision.pointAndObjectColliding(mousePos, this.player)
            //&& this.player.powerUpTypes.some(powerUpType => this.player[powerUpType] === true)
        ) {
            this.showingToolTip = false;
            const content = document.createElement("div");
            const playerAttributesToolTip = ObjectsTooltipElementsRenderer.createPlayerPowerUpTooltip(this.player);
            content.appendChild(playerAttributesToolTip);
            const tilePosY = this.tileMapHandler.getTileValueForPosition(Controller.mouseY);
            const tilePosX = this.tileMapHandler.getTileValueForPosition(Controller.mouseX);
            const xPos = canvasOffsetLeft + (tilePosX * this.tileMapHandler.tileSize) - 120 - Camera.viewport.left;
            const yPos = canvasOffsetTop + (tilePosY * this.tileMapHandler.tileSize) + this.tileMapHandler.tileSize + 6 - Camera.viewport.top;
            TooltipHandler.repositionAndShowTooltip("canvasObjectToolTip", yPos, xPos, "Players power-ups", content)
        }
    }
}