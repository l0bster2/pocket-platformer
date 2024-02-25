class CustomSpriteHandler {

    static staticConstructor() {
        this.customSpriteSelector = document.getElementById('customSpriteSelector');
        this.indexToDelete = 0;
    }

    static addOptionToSelect(value, text) {
        let opt = document.createElement("option");
        opt.value = value;
        opt.innerHTML = text;
        this.customSpriteSelector.append(opt);
    }

    static populateSpriteSelectBox() {
        var i, L = this.customSpriteSelector?.options?.length - 1;
        for (i = L; i >= 0; i--) {
            this.customSpriteSelector.remove(i);
        }
        this.addOptionToSelect("tile", "Tile");
        this.addOptionToSelect(SpritePixelArrays.DISAPPEARING_BLOCK_SPRITE.name, SpritePixelArrays.DISAPPEARING_BLOCK_SPRITE.descriptiveName);
        this.addOptionToSelect(SpritePixelArrays.RED_BLOCK.name, SpritePixelArrays.RED_BLOCK.descriptiveName);
        this.addOptionToSelect(SpritePixelArrays.BLUE_BLOCK.name, SpritePixelArrays.BLUE_BLOCK.descriptiveName);
        this.addOptionToSelect(SpritePixelArrays.TREADMILL.name, SpritePixelArrays.TREADMILL.descriptiveName);
        this.addOptionToSelect(SpritePixelArrays.ICE_BLOCK.name, SpritePixelArrays.ICE_BLOCK.descriptiveName);
        this.addOptionToSelect(SpritePixelArrays.DISAPPEARING_FOREGROUND_TILE.name, SpritePixelArrays.DISAPPEARING_FOREGROUND_TILE.descriptiveName);
        this.addOptionToSelect(SpritePixelArrays.FOREGROUND_TILE.name, SpritePixelArrays.FOREGROUND_TILE.descriptiveName);
        const notCopyableSprites = [ObjectTypes.FINISH_FLAG_CLOSED, ObjectTypes.PORTAL2, ObjectTypes.PORTAL, ObjectTypes.PATH_POINT, ObjectTypes.COLLECTIBLE];
        const copyableObjects = SpritePixelArrays.allSprites.filter(sprite =>
            sprite.type === SpritePixelArrays.SPRITE_TYPES.object && !notCopyableSprites.includes(sprite.name)
            && !sprite.custom)
        copyableObjects.forEach(copyableObject => {
            this.addOptionToSelect(copyableObject.name, copyableObject.descriptiveName);
        })
        this.addOptionToSelect("deco", "Deco");
    }

    static initializeModal() {
        ModalHandler.showModal('customSpriteModal');
        this.populateSpriteSelectBox();
    }

    static getClonedObjectSprite(customSpriteName) {
        const spriteObject = SpritePixelArrays.getSpritesByName(customSpriteName)[0];
        const countExistingCustomSpritesOfThisType = SpritePixelArrays.getCustomSprites()?.filter(customSprite =>
            customSprite.name === customSpriteName)?.length;
        const clonedSprite = JSON.parse(JSON.stringify(spriteObject));
        clonedSprite.custom = true;
        clonedSprite.descriptiveName = `${spriteObject.descriptiveName} ${countExistingCustomSpritesOfThisType + 2}`;
        return clonedSprite;
    }

    static showDeleteModal(index) {
        this.indexToDelete = index;
        ModalHandler.showModal('deleteCustomSpriteConfirmation')
    }

    static deleteSpriteConfirmed() {
        this.removeCustomSprite(this.indexToDelete);
        ModalHandler.closeModal('deleteCustomSpriteConfirmation')
    }

    static getClonedDecoSprite() {
        const allDecoNumbers = SpritePixelArrays.getSpritesByType(SpritePixelArrays.SPRITE_TYPES.deko).map(deco => {
            var r = /\d+/;
            return deco.descriptiveName.match(r);
        })
        const clonedSprite = JSON.parse(JSON.stringify(SpritePixelArrays.DEKO_SPRITE));
        clonedSprite.custom = true;
        clonedSprite.descriptiveName = `Deco ${Math.max(...allDecoNumbers) + 1}`;
        return clonedSprite;
    }

    static getClonedTileSprite() {
        const clonedSprite = JSON.parse(JSON.stringify(SpritePixelArrays.TILE_1));
        clonedSprite.custom = true;
        const customTiles = SpritePixelArrays.getSpritesByType(SpritePixelArrays.SPRITE_TYPES.tile).filter(tile =>
            tile.custom && tile.descriptiveName.includes("Custom tile"));
        const allCustomTileNumbers = customTiles.map(customTile => {
            var r = /\d+/;
            return customTile.descriptiveName.match(r);
        })
        const newTileValue = customTiles.length + 1;
        const highestGenericTileValue = 17;
        const newName = highestGenericTileValue + newTileValue;
        clonedSprite.name = newName;
        const highestNumber = allCustomTileNumbers.length ? 
            Math.max(...allCustomTileNumbers) + 1 
            : 1;
        clonedSprite.descriptiveName = `Custom tile ${highestNumber}`;
        return clonedSprite;
    }

    static spriteAddedOrDeleted() {
        tileMapHandler.setTileTypes();
        TabNavigation.redrawAfterAddedOrDeletedSprite();
        TabNavigation.drawSpritesByType();
        DrawSectionHandler.removeOptions();
        DrawSectionHandler.fillSelectBox();
        TabPagination.changePaginationVisibility(SpritePixelArrays.customType);
        spriteSheetCreator.setCanvasSize();
        spriteSheetCreator.createSpriteSheet();
    }

    static removeTile(levelHeight, levelWidth, tileMap, spriteName) {
        for (var tilePosY = 0; tilePosY < levelHeight; tilePosY++) {
            for (var tilePosX = 0; tilePosX < levelWidth; tilePosX++) {
                if (tileMap[tilePosY][tilePosX] === spriteName) {
                    tileMap[tilePosY][tilePosX] = 0;
                }
            }
        }
    }

    static removeByDescriptiveName(dataArray, spriteName) {
        for (var i = dataArray.length - 1; i >= 0; i--) {
            if (dataArray[i].spriteObject[0].descriptiveName === spriteName) {
                dataArray.splice(i, 1);
            }
        }
    }

    static resetYIndexOfLevelObjects() {
        tileMapHandler.levelObjects.forEach(levelObject => {
            if (levelObject?.customName) {
                levelObject.canvasYSpritePos = SpritePixelArrays.getIndexOfSprite(levelObject.customName, 0, "descriptiveName") *
                    WorldDataHandler.tileSize;
            }
        })
    }

    static resetYIndexOfDekoSprites(decoIndex) {
        WorldDataHandler.levels.forEach(level => {
            for (var i = level.deko.length - 1; i >= 0; i--) {
                if (level.deko[i].index > decoIndex) {
                    level.deko[i].index -= 1;
                }
            }
        });
        tileMapHandler.deko = tileMapHandler.createInitialDeko(WorldDataHandler.levels[tileMapHandler.currentLevel].deko);
    }

    static removeSpritesFromWorldData(sprite) {
        if (isNaN(sprite?.name)) {
            if (sprite.name === ObjectTypes.DEKO) {
                //deko
                this.removeByDescriptiveName(tileMapHandler.deko, sprite.descriptiveName);
                var r = /\d+/;
                const decoIndex = sprite.descriptiveName.match(r) - 1;
                WorldDataHandler.levels.forEach(level => {
                    for (var i = level.deko.length - 1; i >= 0; i--) {
                        if (level.deko[i].index === decoIndex) {
                            level.deko.splice(i, 1);
                        }
                    }
                })
                this.resetYIndexOfDekoSprites(decoIndex)
            }
            else {
                //objects
                for (var i = tileMapHandler.levelObjects.length - 1; i >= 0; i--) {
                    if (tileMapHandler.levelObjects[i]?.customName === sprite.descriptiveName) {
                        tileMapHandler.levelObjects.splice(i, 1);
                    }
                }
                WorldDataHandler.levels.forEach(level => {
                    for (var i = level.levelObjects.length - 1; i >= 0; i--) {
                        if (level.levelObjects[i]?.extraAttributes?.customName === sprite.descriptiveName) {
                            level.levelObjects.splice(i, 1);
                        }
                    }
                })
                this.resetYIndexOfLevelObjects();
            }
        }
        else {
            //tile
            this.removeTile(tileMapHandler.levelHeight, tileMapHandler.levelWidth, tileMapHandler.tileMap, sprite.name);
            WorldDataHandler.levels.forEach(level => {
                const levelHeight = level.tileData.length;
                const levelWidth = level.tileData[0].length;
                this.removeTile(levelHeight, levelWidth, level.tileData, sprite.name);
            })
        }
    }

    static removeCustomSprite(index) {
        const spriteToRemove = TabNavigation.selectableSprites[index];
        SpritePixelArrays.allSprites = SpritePixelArrays.allSprites.filter(obj =>
            obj.descriptiveName !== spriteToRemove.descriptiveName
        );
        this.removeSpritesFromWorldData(spriteToRemove);
        TabNavigation.removeOldDeleteIcons();
        TabNavigation.selectableSprites.splice(index, 1);
        this.spriteAddedOrDeleted();
        if (DrawSectionHandler?.currentSprite?.sprite.descriptiveName === spriteToRemove.descriptiveName) {
            DrawSectionHandler.changeSelectedSprite({ target: { value: SpritePixelArrays.TILE_1.descriptiveName } });
        }
    }

    static addSprite(event) {
        event.preventDefault();
        const customSpriteName = event.target?.elements?.customSpriteSelector?.value;

        let clonedSprite;
        if (customSpriteName === SpritePixelArrays.SPRITE_TYPES.deko) {
            clonedSprite = this.getClonedDecoSprite();
        }
        else if (customSpriteName === "tile") {
            clonedSprite = this.getClonedTileSprite();
        }
        else {
            clonedSprite = this.getClonedObjectSprite(customSpriteName);
        }

        SpritePixelArrays.allSprites.push(clonedSprite);
        this.spriteAddedOrDeleted();
        const customSpritesAmount = TabNavigation.selectableSprites.length;
        const spriteIndex = customSpritesAmount - TabPagination.getPageOffset() - 1;
        TabNavigation.handleSelectedSprite(spriteIndex, Math.floor((spriteIndex) / 3));
        ModalHandler.closeModal('customSpriteModal');
    }
}