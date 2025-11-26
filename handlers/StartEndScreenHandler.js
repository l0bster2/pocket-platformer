class StartEndScreenHandler {

    static displayLoadingScreen(loadedAssets, soundsLength) {
        const loadingBarWidth = Display.canvasWidth / 3;
        const loadingBarHeight = 20;
        const leftPos = Display.canvasWidth / 2 - loadingBarWidth / 2;
        const topPos = Display.canvasHeight / 2 - loadingBarHeight / 2;
        const progressPadding = 5;
        Display.drawRectangleBorder(leftPos, topPos,
            loadingBarWidth, loadingBarHeight, WorldDataHandler.textColor);
        const progressWidth = (loadingBarWidth - progressPadding * 2) / soundsLength * loadedAssets;
        Display.drawRectangle(leftPos + progressPadding, topPos + progressPadding,
            progressWidth, loadingBarHeight - progressPadding * 2, WorldDataHandler.textColor);
    }

    static displayStartScreen(currentGeneralFrame, maxFrames) {
        PlayMode.updateGeneralFrameCounter();
        const textColor = "#" + WorldDataHandler.textColor;
        if (WorldDataHandler.gamesName.includes("wobbly:")) {
            Display.displayWobblyText(WorldDataHandler.gamesName.replace('wobbly:', ''), Display.canvasWidth / 2, Display.canvasHeight / 2, 30, currentGeneralFrame, 95, textColor);
        }
        else {
            TextAnimationHandler.drawAnimatedText("wavy", ctx, "HELLO!", 400, 200, currentGeneralFrame, {
                size: 42,
                color: "white",
                outlineColor: "black",
                outlineWidth: 4,
                shadowColor: "grey",
                shadowSize: 4,
                shadowDirection: "se",
                lineHeight: 48
            });
            Display.displayText(WorldDataHandler.gamesName, Display.canvasWidth / 2, Display.canvasHeight / 2, WorldDataHandler.fontSize + 13, textColor);
        }
        var moduloDivider = maxFrames / 3;
        if (currentGeneralFrame % moduloDivider < moduloDivider / 2) {
            Display.displayText("Press enter to continue", Display.canvasWidth / 2, Display.canvasHeight / 2 + 40, WorldDataHandler.fontSize + 1, textColor);
        }
    }

    static displayEndingScreen(spriteCanvas, currentGeneralFrame, maxFrames) {
        PlayMode.updateGeneralFrameCounter();
        let totalCollectibles = 0;
        let collectedCollectibles = 0;

        WorldDataHandler.levels.forEach(level => {
            level.levelObjects.forEach(levelObject => {
                if (levelObject.type === ObjectTypes.COLLECTIBLE) {
                    totalCollectibles++;
                    if (levelObject.extraAttributes.collected) {
                        collectedCollectibles++;
                    }
                }
            })
        });
        const collectiblesExist = totalCollectibles > 0;
        const extraPadding = collectiblesExist ? 16 : 0;

        const textColor = "#" + WorldDataHandler.textColor;

        if (WorldDataHandler.endingMessage.includes("wobbly:")) {
            Display.displayWobblyText(WorldDataHandler.endingMessage.replace('wobbly:', ''), Display.canvasWidth / 2, Display.canvasHeight / 2 - 36 - extraPadding, 30, currentGeneralFrame, 95, textColor);
        }
        else {
            Display.displayText(WorldDataHandler.endingMessage, Display.canvasWidth / 2, Display.canvasHeight / 2 - 36 - extraPadding, WorldDataHandler.fontSize + 17, textColor);
        }


        let endTime = GameStatistics.getFinalTime() || "XX:XX:XX";
        let deathCounter = GameStatistics.deathCounter;
        let collectibleCollectedText = `- ${collectedCollectibles}/${totalCollectibles}`;
        //startRemoval 
        endTime = "XX:XX:XX";
        deathCounter = "XX";
        collectibleCollectedText = "- X/XX";
        //endRemoval
        Display.displayText(`Time: ${endTime}`, Display.canvasWidth / 2, Display.canvasHeight / 2 + 4 - extraPadding, WorldDataHandler.fontSize + 1, textColor);
        Display.displayText(`Deaths: ${deathCounter}`, Display.canvasWidth / 2, Display.canvasHeight / 2 + 34 - extraPadding, WorldDataHandler.fontSize + 1, textColor);
        if (collectiblesExist) {
            const spriteIndex = SpritePixelArrays.getIndexOfSprite(ObjectTypes.COLLECTIBLE);
            const { tileSize } = WorldDataHandler;
            const canvasYSpritePos = spriteIndex * tileSize;
            const collectibleCollectedTextLength = Display.ctx.measureText(collectibleCollectedText).width;
            Display.drawImage(spriteCanvas, 0, canvasYSpritePos, tileSize, tileSize,
                Display.canvasWidth / 2 - (collectibleCollectedTextLength / 2) - 15, Display.canvasHeight / 2 + 54 - tileSize, tileSize, tileSize);
            Display.displayText(collectibleCollectedText, Display.canvasWidth / 2 + 15, Display.canvasHeight / 2 + 48, WorldDataHandler.fontSize, textColor);
        }
        var moduloDivider = maxFrames / 3;

        if (currentGeneralFrame % moduloDivider < moduloDivider / 2) {
            Display.displayText("Press enter to restart", Display.canvasWidth / 2, Display.canvasHeight / 2 + 64 + extraPadding, WorldDataHandler.fontSize - 5, textColor);
        }
        if (Controller.enter && !PauseHandler.restartedGame) {
            PauseHandler.restartedGame = true;
            PauseHandler.currentRestartGameFrameCounter = PauseHandler.restartGameMaxFrames;
            SoundHandler.guiSelect.stopAndPlay();
            SoundHandler.currentSong && SoundHandler.setVolume(SoundHandler.currentSong, 0.3);
        }
        PauseHandler.handleRestart();
    }
}