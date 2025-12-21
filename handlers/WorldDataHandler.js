class WorldDataHandler {

    static staticConstructor() {
        this.initialPlayerPosition = { x: 2, y: 10 };
        if (WorldDataHandler.insideTool) {
            this.levels = [this.createEmptyLevel(), this.createDemoLevel(), this.createEmptyLevel()];
        }
        else {
            this.levels = [this.createEmptyLevel(), this.createEmptyLevel(), this.createEmptyLevel()];
        }
        this.tileSize = 24;
        this.pixelArrayUnitAmount = 8;
        this.pixelArrayUnitSize = this.tileSize / this.pixelArrayUnitAmount;
        this.resetGameData();
    }

    static resetGameData() {
        this.gamesName = "Example name";
        this.endingMessage = "Thx for playing!";
        this.backgroundColor = '000000';
        this.backgroundImage = null;
        this.backgroundImageSize = null;
        this.backgroundImageScrollSpeed = 0.2;
        this.textColor = 'ffffff';
        this.effects = [];
        this.resetFontParameters();
    }

    static resetFontParameters() {
        this.fontSize = 17;
        this.selectedFont = "DotGothic16";
        this.customFont = null;
        this.textAnimation = "static";
    }

    static createNewGame() {
        this.levels.length = 0; // empty the array completely
        resetPlayerMechanics();
        const gameData = { ...emptyGameData };
        ExportedGameInitializer.initializeExportedGame(gameData);
        SoundHandlerRenderer.createSoundOverview();
        setTimeout(() => {
            tileMapHandler.currentLevel = 1;
            tileMapHandler.resetLevel(1);
            ModalHandler.closeModal('newGameModal');
            resetUIValuesInTool();

            if (Game.playMode === Game.PLAY_MODE) {
                Game.changeGameMode();
            }
        }, "500");
    }

    static createEmptyLevel() {
        const tileData = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        return {
            tileData: tileData,
            levelObjects: [],
            deko: [],
            paths: [],
            backgroundColor: "transp",
            zoomFactor: 1,
            song: null,
            backgroundImage: null,
            backgroundImageSize: null,
        };
    }

    static createDemoLevel() {
        return MathHelpers.getRandomItemFromArray(allDemoLevels);
    }

    static exampleLevel(withDefaultImage = false) {
        let exampleLevelTileData = this.createEmptyLevel().tileData;
        for (var i = 1; i < 6; i++) {
            exampleLevelTileData[11][i] = 2;
        }
        for (var i = exampleLevelTileData[0].length - 2; i > exampleLevelTileData[0].length - 7; i--) {
            exampleLevelTileData[6][i] = 2;
        }

        const levelObjects = [
            { ...this.initialPlayerPosition, type: ObjectTypes.START_FLAG },
            { x: exampleLevelTileData[0].length - 3, y: 5, type: ObjectTypes.FINISH_FLAG }
        ];

        return {
            tileData: exampleLevelTileData,
            levelObjects: levelObjects,
            deko: [],
            paths: [],
            backgroundColor: "transp",
            zoomFactor: 1,
            song: null,
            backgroundImage: withDefaultImage ? "Castle.png" : null,
            backgroundImageSize: withDefaultImage ? "stretch" : null,
            backgroundImageScrollSpeed: 0.2,
        };
    }

    static calucalteCanvasSize() {
        return {
            width: this.levels[0].tileData[0].length * this.tileSize,
            height: this.levels[0].tileData.length * this.tileSize,
        }
    }
}