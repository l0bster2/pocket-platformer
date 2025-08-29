class WorldDataHandler {

    static staticConstructor() {
        this.initialPlayerPosition = { x: 2, y: 10 };
        this.levels = [this.createEmptyLevel(), this.createDemoLevel(), this.createEmptyLevel()];
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
    }

    static createNewGame() {
        this.levels.length = 0; // empty the array completely
        this.levels.push(
            structuredClone(this.createEmptyLevel()),
            structuredClone(this.exampleLevel(true)),
            structuredClone(this.createEmptyLevel())
        );
        tileMapHandler.currentLevel = 1;
        tileMapHandler.resetLevel(1);
        ModalHandler.closeModal('newGameModal');
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