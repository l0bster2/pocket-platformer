class Display {

    static staticConstructor(canvas, canvasWidth, canvasHeight, tileCtx) {
        this.ctx = canvas;
        this.tileCtx = tileCtx
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    static drawLine(x, y, endX, endY, color = "000000", strokeWidth = 1, ctx = this.ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = '#' + color;
        ctx.stroke();
    }

    static drawRectangle(x, y, width, height, color = "000000", ctx = this.ctx) {
        ctx.beginPath();
        ctx.rect(Math.round(x), Math.round(y), width, height);
        ctx.fillStyle = "#" + color;
        ctx.fill();
        ctx.closePath();
    }

    static drawRectangleWithAlpha(x, y, width, height, color = "000000", ctx = this.ctx, alpha = 0) {
        this.ctx.globalAlpha = alpha;
        this.drawRectangle(x, y, width, height, color, ctx);
        this.ctx.globalAlpha = 1;
    }

    static drawRectangleBorder(x, y, width, height, color = "000000", lineWidth = 1, ctx = this.ctx) {
        ctx.beginPath();
        ctx.rect(Math.round(x), Math.round(y), width, height);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "#" + color;
        ctx.stroke();
        ctx.closePath();
    }

    static drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh, destinationCanvas = this.ctx) {
        destinationCanvas.drawImage(
            img,
            Math.round(sx),
            Math.round(sy),
            sw,
            sh,
            dx,
            dy,
            dw,
            dh);
    }

    static drawImageWithRotation(img, sx, sy, sw, sh, dx, dy, dw, dh, radians = 0) {
        if (radians === 0) {
            this.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        }
        else {
            const halfImageWidth = dw / 2;
            const halfImageHeight = dh / 2;
            this.ctx.translate(dx + halfImageWidth, dy + halfImageHeight);
            this.ctx.rotate(radians);
            this.ctx.drawImage(
                img,
                Math.round(sx),
                Math.round(sy),
                sw,
                sh,
                -halfImageWidth,
                -halfImageHeight,
                dw,
                dh);
            this.ctx.rotate(-radians);
            this.ctx.translate(-dx - halfImageWidth, -dy - halfImageHeight);
        }
    }

    static drawImageWithAlpha(img, sx, sy, sw, sh, dx, dy, dw, dh, alpha) {
        this.ctx.globalAlpha = alpha;
        this.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        this.ctx.globalAlpha = 1;
    }

    //same function as drawPixelArray, but with an 0.5 offset, to fix subpixels while zooming (mostly for avatars)
    static drawPixelArrayWithOffset(pixelArray, x, y, pixelArrayUnitSize, pixelArrayUnitAmountHeight, pixelArrayUnitAmountWidth, ctx = this.ctx) {
        if (!pixelArray) return;

        for (let pixelArrayPosY = 0; pixelArrayPosY < pixelArrayUnitAmountWidth; pixelArrayPosY++) {
            for (let pixelArrayPosX = 0; pixelArrayPosX < pixelArrayUnitAmountHeight; pixelArrayPosX++) {
                const color = pixelArray[pixelArrayPosY][pixelArrayPosX];
                if (color === 0 || color === "transp") continue;
                const px = x + pixelArrayPosX * pixelArrayUnitSize;
                const py = y + pixelArrayPosY * pixelArrayUnitSize;

                // Slightly increase size to overlap blocks (fixes gaps)
                const size = pixelArrayUnitSize + 0.5;

                this.drawRectangle(px, py, size, size, color, ctx);
            }
        }
    }

    static drawPixelArray(pixelArray, x, y, pixelArrayUnitSize, pixelArrayUnitAmountHeight, pixelArrayUnitAmountWidth, ctx = this.ctx) {
        if (pixelArray) {
            for (var pixelArrayPosY = 0; pixelArrayPosY < pixelArrayUnitAmountWidth; pixelArrayPosY++) {
                for (var pixelArrayPosX = 0; pixelArrayPosX < pixelArrayUnitAmountHeight; pixelArrayPosX++) {
                    const color = pixelArray[pixelArrayPosY][pixelArrayPosX];
                    color !== 0 && color !== "transp" &&
                        this.drawRectangle(x + pixelArrayPosX * pixelArrayUnitSize, y + pixelArrayPosY * pixelArrayUnitSize,
                            Math.round(pixelArrayUnitSize), Math.round(pixelArrayUnitSize), color, ctx);
                }
            }
        }
    }

    static drawGrid(width, height, distance, color = '383838', strokeWidth = 1, ctx = this.ctx) {
        for (var i = 0; i < width; i++) {
            this.drawLine(i * distance, 0, i * distance, height * distance, color, strokeWidth, ctx);
        }
        for (var j = 0; j < height; j++) {
            this.drawLine(0, j * distance, width * distance, j * distance, color, strokeWidth, ctx);
        }
    }

    static displayLoadingScreen(loadedAssets, soundsLength) {
        const loadingBarWidth = this.canvasWidth / 3;
        const loadingBarHeight = 20;
        const leftPos = this.canvasWidth / 2 - loadingBarWidth / 2;
        const topPos = this.canvasHeight / 2 - loadingBarHeight / 2;
        const progressPadding = 5;
        this.drawRectangleBorder(leftPos, topPos,
            loadingBarWidth, loadingBarHeight, WorldDataHandler.textColor);
        const progressWidth = (loadingBarWidth - progressPadding * 2) / soundsLength * loadedAssets;
        this.drawRectangle(leftPos + progressPadding, topPos + progressPadding,
            progressWidth, loadingBarHeight - progressPadding * 2, WorldDataHandler.textColor);
    }

    static getTotalTextWidth(text) {
        let width = 0;
        for (let i = 0; i < text.length; i++) {
            width += ctx.measureText(text[i]).width;
        }
        return width;
    }

    static displayStartScreen(currentGeneralFrame, maxFrames) {
        PlayMode.updateGeneralFrameCounter();
        const textColor = "#" + WorldDataHandler.textColor;
        if (WorldDataHandler.gamesName.includes("wobbly:")) {
            this.displayWobblyText(WorldDataHandler.gamesName.replace('wobbly:', ''), this.canvasWidth / 2, this.canvasHeight / 2, 30, currentGeneralFrame, 95, textColor);
        }
        else {
            this.displayText(WorldDataHandler.gamesName, this.canvasWidth / 2, this.canvasHeight / 2, WorldDataHandler.fontSize + 13, textColor);
        }
        var moduloDivider = maxFrames / 3;
        if (currentGeneralFrame % moduloDivider < moduloDivider / 2) {
            this.displayText("Press enter to continue", this.canvasWidth / 2, this.canvasHeight / 2 + 40, WorldDataHandler.fontSize + 1, textColor);
        }
    }

    static displayWobblyText(text = "", xPos, yPos, size = 30, currentGeneralFrame, maxFrames, color = "white") {
        this.ctx.font = size + "px DotGothic16";
        this.ctx.fillStyle = color;
        this.ctx.textAlign = "center";

        const totalWidth = this.getTotalTextWidth(text);
        const startX = xPos - (totalWidth / 2);

        let x = startX;

        const time = (currentGeneralFrame) % maxFrames;
        const waveAmplitude = 3;   // how high the wave is (adjust to wobble less)
        const waveLength = 15;      // distance between wave peaks (in pixels)
        const waveSpeed = (2 * Math.PI / 480) * 5; // full loop in 480 frames

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charWidth = ctx.measureText(char).width;

            // Each character offset by its X position along the wave
            const phase = x / waveLength;  // characters further right are phase-shifted
            const yOffset = Math.sin(time * waveSpeed + phase) * waveAmplitude;

            this.ctx.fillText(char, x, yPos + yOffset);

            x += charWidth;
        }
    }

    static measureText(text) {
        const measurements = this.ctx.measureText(text);
        return { width: measurements.width, height: measurements.height };
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
            this.displayWobblyText(WorldDataHandler.endingMessage.replace('wobbly:', ''), this.canvasWidth / 2, this.canvasHeight / 2 - 36 - extraPadding, 30, currentGeneralFrame, 95, textColor);
        }
        else {
            this.displayText(WorldDataHandler.endingMessage, this.canvasWidth / 2, this.canvasHeight / 2 - 36 - extraPadding, WorldDataHandler.fontSize + 17, textColor);
        }


        let endTime = GameStatistics.getFinalTime() || "XX:XX:XX";
        let deathCounter = GameStatistics.deathCounter;
        let collectibleCollectedText = `- ${collectedCollectibles}/${totalCollectibles}`;
        //startRemoval 
        endTime = "XX:XX:XX";
        deathCounter = "XX";
        collectibleCollectedText = "- X/XX";
        //endRemoval
        this.displayText(`Time: ${endTime}`, this.canvasWidth / 2, this.canvasHeight / 2 + 4 - extraPadding, WorldDataHandler.fontSize + 1, textColor);
        this.displayText(`Deaths: ${deathCounter}`, this.canvasWidth / 2, this.canvasHeight / 2 + 34 - extraPadding, WorldDataHandler.fontSize + 1, textColor);
        if (collectiblesExist) {
            const spriteIndex = SpritePixelArrays.getIndexOfSprite(ObjectTypes.COLLECTIBLE);
            const { tileSize } = WorldDataHandler;
            const canvasYSpritePos = spriteIndex * tileSize;
            const collectibleCollectedTextLength = this.ctx.measureText(collectibleCollectedText).width;
            Display.drawImage(spriteCanvas, 0, canvasYSpritePos, tileSize, tileSize,
                this.canvasWidth / 2 - (collectibleCollectedTextLength / 2) - 15, this.canvasHeight / 2 + 54 - tileSize, tileSize, tileSize);
            this.displayText(collectibleCollectedText, this.canvasWidth / 2 + 15, this.canvasHeight / 2 + 48, WorldDataHandler.fontSize, textColor);
        }
        var moduloDivider = maxFrames / 3;

        if (currentGeneralFrame % moduloDivider < moduloDivider / 2) {
            this.displayText("Press enter to restart", this.canvasWidth / 2, this.canvasHeight / 2 + 64 + extraPadding, WorldDataHandler.fontSize - 5, textColor);
        }
        if (Controller.enter && !PauseHandler.restartedGame) {
            PauseHandler.restartedGame = true;
            PauseHandler.currentRestartGameFrameCounter = PauseHandler.restartGameMaxFrames;
            SoundHandler.guiSelect.stopAndPlay();
            SoundHandler.currentSong && SoundHandler.setVolume(SoundHandler.currentSong, 0.3);
        }
        PauseHandler.handleRestart();
    }

    static displayText(text = "", xPos, yPos, size = 30, color = "white", alignPos = "center") {
        this.ctx.font = size + "px " + WorldDataHandler.selectedFont;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = alignPos;
        this.ctx.fillText(text, xPos, yPos);
    }

    static explodeSprite(img, sx, sy, objectSize, x, y, offSet, radians) {
        const halfTileSize = objectSize / 2;
        Display.drawImageWithRotation(img, sx,
            sy, halfTileSize,

            halfTileSize, x + offSet * -1, y + offSet * -1,
            halfTileSize, halfTileSize, radians);
        Display.drawImageWithRotation(img, sx + halfTileSize,
            sy, halfTileSize,
            halfTileSize, x + offSet, y + offSet * -1,
            halfTileSize, halfTileSize, radians);
        Display.drawImageWithRotation(img, sx,
            sy + halfTileSize, halfTileSize,
            halfTileSize, x + offSet, y + offSet,
            halfTileSize, halfTileSize, radians);
        Display.drawImageWithRotation(img, sx + halfTileSize,
            sy + halfTileSize, halfTileSize,
            halfTileSize, x + offSet * -1, y + offSet,
            halfTileSize, halfTileSize, radians);
    }
}
