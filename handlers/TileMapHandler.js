class TileMapHandler {

    constructor(tileSize, startingLevel, spriteCanvas, player) {
        this.setTileTypes();
        this.tileSize = tileSize;
        this.pixelArrayUnitAmount = 8;
        this.pixelArrayUnitSize = tileSize / this.pixelArrayUnitAmount;
        this.player = player;
        this.effects = [];
        this.currentLevel = startingLevel;
        this.spriteCanvas = spriteCanvas;
        this.currentGeneralFrameCounter = 0;
        this.generalFrameCounterMax = 480;
        this.jumpSwitchBlockTypes = {
            violet: "VIOLET",
            pink: "PINK",
        }
    }

    setTileTypes() {
        this.TILE_TYPES = {};
        SpritePixelArrays.allTileSprites().forEach(sprite => {
            this.TILE_TYPES[sprite.name] = SpritePixelArrays.getIndexOfSprite(sprite.name);
        });
    }

    resetLevel(levelIndex) {
        SFXHandler.resetSfx();
        this.tileMap = WorldDataHandler.levels[levelIndex].tileData;
        Camera.updateViewportRelatedToScale(WorldDataHandler.levels[levelIndex].zoomFactor || 1)
        this.updateLevelDimensions();
        this.setInitialPlayerAndCameraPos(levelIndex);
        this.levelObjects = [];
        this.levelObjects = this.createInitialObjects(WorldDataHandler.levels[levelIndex].levelObjects);
        this.deko = this.createInitialDeko(WorldDataHandler.levels[levelIndex].deko);
        this.paths = this.createInitialPaths(WorldDataHandler.levels[levelIndex].paths);
        this.effects = EffectsHandler.getCurrentLevelEffects(this.currentLevel);
        this.currentGeneralFrameCounter = 0;
        this.player.resetAll();
        WorldColorChanger.changeLevelColor(levelIndex);
        this.changeTileCanvasSize();
        this.createStaticTiles();
        SoundHandler.checkSongOnLevelReset(levelIndex);
        this.currentJumpSwitchBlockType = this.jumpSwitchBlockTypes.violet;
    }

    changeJumpSwitchBlockType() {
        if(this.currentJumpSwitchBlockType === this.jumpSwitchBlockTypes.violet) {
            this.currentJumpSwitchBlockType = this.jumpSwitchBlockTypes.pink
        }
        else {
            this.currentJumpSwitchBlockType = this.jumpSwitchBlockTypes.violet;
        }
    }

    setInitialPlayerAndCameraPos(levelIndex) {
        //This is a fallback, in case no flag was set in a level (start, ending, or if user forgot to set it)
        let initialPlayerValue = { x: 0, y: 0 };
        WorldDataHandler.levels[levelIndex].levelObjects.forEach(levelObject => {
            if (levelObject.type === ObjectTypes.START_FLAG) {
                initialPlayerValue.x = levelObject.x * this.tileSize;
                initialPlayerValue.y = levelObject.y * this.tileSize;
            }
        })
        this.player.initialY = initialPlayerValue.x;
        this.player.initialX = initialPlayerValue.y;
        Camera.moveTo(initialPlayerValue.x, initialPlayerValue.y);

        //startRemoval 
        if (typeof LevelSizeHandler === 'function') {
            LevelSizeHandler.updateCameraSliders(this.levelWidth * this.tileSize, this.levelHeight * this.tileSize, initialPlayerValue);
        }
        //endRemoval
    }

    updateLevelDimensions() {
        this.levelWidth = this.getLevelWidth();
        this.levelHeight = this.getLevelHeight();
        this.levelHeightInPx = this.levelHeight * this.tileSize;
        this.levelWidthInPx = this.levelWidth * this.tileSize;
        if (Camera.viewport) {
            Camera.viewport.worldWidth = this.levelWidth * this.tileSize;
            Camera.viewport.worldHeight = this.levelHeight * this.tileSize;
        }
    }

    createInitialPaths(initialPaths) {
        var paths = [];
        initialPaths && initialPaths.forEach(initialPath => {
            const { speed, stopFrames, movementDirection, pathVariant } = initialPath;
            let newPath = new Path(this, speed, stopFrames, movementDirection);
            newPath.pathVariant = pathVariant;
            newPath.pathPoints = initialPath.pathPoints.map(pathPoint =>
                new PathPoint(pathPoint.initialX, pathPoint.initialY, this.tileSize, pathPoint.alignment));
            newPath.checkObjectsOnPath();
            newPath.rearrangePathPoints();
            paths.push(newPath);
        });
        return paths;
    }

    createInitialObjects(initialObjects) {
        var levelObjects = [];
        initialObjects && initialObjects.forEach(initialObject => {
            const { type, x, y } = initialObject;

            const extraAttributes = initialObject.extraAttributes ? initialObject.extraAttributes : {};
            levelObjects.push(new ObjectTypes.objectToClass[type](x,
                y, this.tileSize, type, this, extraAttributes));
        });
        return levelObjects;
    }

    createInitialDeko(initialDekos) {
        var dekos = [];
        initialDekos && initialDekos.forEach(initialDeko => {
            const { x, y, index } = initialDeko;
            dekos.push(new Deko(x, y, this.tileSize, index));
        });
        return dekos;
    }

    drawGrid() {
        Display.drawGrid(this.levelWidth, this.levelHeight, this.tileSize);
    }

    changeTileCanvasSize() {
        tileCanvas.width = this.levelWidth * this.tileSize;
        tileCanvas.height = this.levelHeight * this.tileSize;
        this.createStaticTiles();
    }

    createStaticTiles() {
        Display.tileCtx.clearRect(0, 0, this.levelWidth * this.tileSize, this.levelHeight * this.tileSize);
        for (var tilePosY = 0; tilePosY < this.levelHeight; tilePosY++) {
            for (var tilePosX = 0; tilePosX < this.levelWidth; tilePosX++) {

                var tileType = this.tileMap[tilePosY][tilePosX];
                //if we want to make edge tiles deleteable, some exceptions need to be made, like still show tile 5, 14 (cannons), and red/blue blocks
                if (this.checkIfPositionAtTheEdge(tilePosX, tilePosY) && (tileType === 1 || tileType === 2)) {
                    tileType = "edge";
                    if (this.checkIfStartOrEndingLevel()) {
                        tileType = 0;
                    }
                }

                if (tileType !== 0) {
                    Display.drawImage(this.spriteCanvas, 0, this.TILE_TYPES[tileType] * this.tileSize,
                        this.tileSize, this.tileSize, tilePosX * this.tileSize, tilePosY * this.tileSize, this.tileSize, this.tileSize, Display.tileCtx);
                }
            }
        }
    }

    displayStaticTiles() {
        const width = this.levelWidth * this.tileSize;
        const height = this.levelHeight * this.tileSize;
        Display.drawImage(tileCanvas, 0, 0, width, height,
            0, 0, width, height);
    }

    displayObjects(arr) {
        if (arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
                arr[i]?.draw(this.spriteCanvas);
            }
        }
    }

    displayObjectsOrDeko(arr) {
        if (arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
                arr[i].draw(this.spriteCanvas);
            }
        }
    }

    displayLevel() {
        const isPlayMode = Game.playMode === Game.PLAY_MODE;
        if (isPlayMode) {
            if (PauseHandler.paused) {
                return;
            }
        }
        this.layers = this.splitLevelObjectsInLayers();
        this.displayObjects(this.layers[0]);
        this.displayObjectsOrDeko(this.deko);
        SFXHandler.updateSfxAnimations("backgroundSFX");
        isPlayMode && this.effects.length && EffectsRenderer.displayEffects();
        //background objects, like water
        this.displayObjectsOrDeko(this.paths);
        //normal objects
        this.displayObjects(this.layers[1]);
        this.displayObjects(this.layers[2]);
        //moving platforms
        this.displayObjects(this.layers[3]);
        this.displayStaticTiles();
        //projectiles
        this.displayObjects(this.layers[4]);
    }

    splitLevelObjectsInLayers() {
        const layers = [
            [], [], [], [], []
        ];
        this.levelObjects.forEach(levelObject => {
            if(SpritePixelArrays.backgroundSprites.includes(levelObject.type)) {
                layers[0].push(levelObject);
            }
            else if(SpritePixelArrays.projectileSprites.includes(levelObject.type)) {
                layers[4].push(levelObject);
            }
            else if(SpritePixelArrays.movingPlatformSprites.includes(levelObject.type)) {
                layers[3].push(levelObject);
            }
            else if(SpritePixelArrays.foregroundSprites.includes(levelObject.type)) {
                layers[5].push(levelObject);
            }
            else if(levelObject.type === ObjectTypes.TRAMPOLINE) {
                layers[2].push(levelObject);
            }
            else {
                layers[1].push(levelObject);
            }
        });
        return layers;
    }

    switchToNextLevel() {
        const nextLevel = PlayMode.customExit?.levelIndex || this.currentLevel + 1;
        const levelAmounth = WorldDataHandler.levels.length;
        if (this.currentLevel < levelAmounth - 1) {
            this.currentLevel = nextLevel;

            if (this.currentLevel === levelAmounth - 1) {
                GameStatistics.stopTimer();
            }
            this.resetLevel(this.currentLevel);
            if (typeof LevelNavigationHandler === 'function') {
                LevelNavigationHandler.updateLevel();
                LevelNavigationHandler.adaptLevelList();
            }
        }
        else {
            console.log("error")
        }
    }

    resetDynamicObjects() {
        for (var i = this.levelObjects.length; i >= 0; i--) {
            const laserObject = this.levelObjects[i]?.type === ObjectTypes.LASER;
            if (this.levelObjects[i]?.type === ObjectTypes.CANON_BALL || this.levelObjects[i]?.type === ObjectTypes.ROCKET
                || laserObject) {
                !laserObject && SFXHandler.createSFX(this.levelObjects[i].x, this.levelObjects[i].y, 1)
                this.levelObjects.splice(i, 1);
            }
            if (this.levelObjects[i]?.resetObject) {
                this.levelObjects[i].resetObject();
            }
        }
        this.paths.forEach(path => path.resetObjectsToInitialPosition());
        //Check here if tilemaphandler is missing objects from WorldDataHandler (if somethign was deleted)
    }

    filterObjectsByTypes(types) {
        return this.levelObjects.filter(levelObject => types.includes(levelObject.type));
    }

    getLevelHeight() {
        return this.tileMap.length;
    }

    getLevelWidth() {
        return this.tileMap[0].length;
    }

    getTileValueForPosition(pos) {
        return Math.floor(pos / this.tileSize);
    }

    getValuePositionsForTile(tileX, tileY) {
        return {
            x: tileX * this.tileSize + this.tileSize / 2,
            y: tileY * this.tileSize + this.tileSize / 2,
        }
    }

    getTileLayerValueByIndex(y, x) {
        return this.tileMap[y]?.[x];
    }

    getTileTypeByPosition(x, y) {
        const xVal = this.getTileValueForPosition(x);
        const yVal = this.getTileValueForPosition(y);
        return this.getTileLayerValueByIndex(yVal, xVal);
    }

    checkIfPositionAtTheEdge(tilePosX, tilePosY) {
        return tilePosX === 0 || tilePosY === 0 || tilePosX === this.levelWidth - 1 || tilePosY === this.levelHeight - 1;
    }

    checkIfStartOrEndingLevel() {
        return this.currentLevel === 0 || this.currentLevel === WorldDataHandler.levels.length - 1;
    }
}