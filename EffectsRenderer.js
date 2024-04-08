class EffectsRenderer {
    static staticConstructor(tileMapHandler) {
        this.tileMapHandler = tileMapHandler;
        this.noiseCanvas = document.getElementById("noiseCanvas");
        this.createNoiseCanvas();
        this.noisePositions = {
            left: 0,
            top: 0,
        }
    }

    static displayBackgroundSFX(effect, currentFrame, tileSize = 24) {
        const { intensity, sfxIndex, growByStep, duration, xSpeed, ySpeed } = effect;
        if (currentFrame % intensity === 0) {
            let parsedXSpeed = this.getSFXSpeedFromEffect(xSpeed);
            let parsedYSpeed = this.getSFXSpeedFromEffect(ySpeed);
            const { left, top, width, height } = Camera.viewport;
            const leftPos = this.getSFXLeftPositionFromEffect(effect, tileSize, left, left + width, "widthDimensions");
            const topPos = this.getSFXLeftPositionFromEffect(effect, tileSize, top, top + height, "heightDimensions");
            SFXHandler.createSFX(leftPos, topPos,
                sfxIndex, AnimationHelper.facingDirections.bottom, parsedXSpeed,
                parsedYSpeed, true, duration, growByStep, "backgroundSFX");
        }
    }

    static getSFXLeftPositionFromEffect(effect, tileSize, standardStart, standardEnd, dimensionName) {
        return MathHelpers.getRandomNumberBetweenTwoNumbers(standardStart, standardEnd);
    }

    static getSFXSpeedFromEffect(speedObject) {
        return speedObject.speedFrom === speedObject.speedTo ? speedObject.speedFrom
            : MathHelpers.getRandomNumberBetweenTwoNumbers(speedObject.speedFrom, speedObject.speedTo, false);
    }

    static displayGreyScale() {
        if (!PauseHandler.paused) {
            Display.ctx.globalCompositeOperation = "saturation";
            Display.ctx.fillStyle = "#000000";
            Display.ctx.fillRect(Camera.viewport.left, Camera.viewport.top, Camera.viewport.width, Camera.viewport.height);
        }
    }

    static displayNoise(effect) {
        if (tileMapHandler.currentGeneralFrameCounter % effect.flicker === 0) {
            this.noisePositions.left = MathHelpers.getRandomNumberBetweenTwoNumbers(0, 100);
            this.noisePositions.top = MathHelpers.getRandomNumberBetweenTwoNumbers(0, 100);
        }
        Display.drawImageWithAlpha(this.noiseCanvas, this.noisePositions.left, this.noisePositions.top,
            Camera.viewport.width, Camera.viewport.height,
            Camera.viewport.left, Camera.viewport.top,
            Camera.viewport.width, Camera.viewport.height, effect.alpha);
    }

    static displayFleshlight(currentLevel, playerx, playery, radius = 200, flickerIntensity = 0,
        orgColor = { r: 0, g: 0, b: 0 }, lighterColor = { r: 70, g: 70, b: 70 }) {
        if (currentLevel !== 0 && currentLevel !== WorldDataHandler.levels.length - 1) {
            var radius = flickerIntensity ? MathHelpers.getRandomNumberBetweenTwoNumbers(radius, radius + flickerIntensity) : radius;
            Display.ctx.fillStyle = `rgb(${orgColor.r},${orgColor.g},${orgColor.b})`;
            Display.ctx.beginPath();
            Display.ctx.rect(Camera.viewport.left, Camera.viewport.top, Camera.viewport.width, Camera.viewport.height);
            Display.ctx.arc(playerx, playery, radius, 0, 2 * Math.PI, true);
            Display.ctx.fill();
            Display.ctx.beginPath();
            var radialGradient = Display.ctx.createRadialGradient(playerx, playery, 1, playerx, playery, radius);
            radialGradient.addColorStop(0, `rgba(${lighterColor.r},${lighterColor.g},${lighterColor.b},0.1)`);
            radialGradient.addColorStop(1, `rgba(${orgColor.r},${orgColor.g},${orgColor.b},0.9)`);
            Display.ctx.fillStyle = radialGradient;
            Display.ctx.arc(playerx, playery, radius, 0, Math.PI * 2, false);
            Display.ctx.fill();
            Display.ctx.closePath();
        }
    }

    static createNoiseCanvas() {
        const ctx = this.noiseCanvas.getContext("2d");
        const noiseCanvasWidth = this.noiseCanvas.width;
        const noiseCanvasHeight = this.noiseCanvas.height;
        const pixelSize = 3;

        const horizontalSteps = Math.round(noiseCanvasWidth / pixelSize);
        const verticalSteps = Math.round(noiseCanvasHeight / pixelSize);

        for (var i = 0; i < horizontalSteps; i++) {
            for (var j = 0; j < verticalSteps; j++) {
                const xPos = i * pixelSize;
                const yPos = j * pixelSize;
                const randomBoolean = Math.random() < 0.5;
                ctx.fillStyle = randomBoolean ? '#000000' : '#FFFFFF'
                ctx.fillRect(xPos, yPos, pixelSize, pixelSize);
            }
        }
    }


    static displayEffects(layer = 0) {
        this.tileMapHandler.effects.forEach(effect => {
            if (layer === 0) {
                if (effect.type === EffectsHandler.effectTypes.SFXLayer) {
                    EffectsRenderer.displayBackgroundSFX(effect, this.tileMapHandler.currentGeneralFrameCounter, this.tileMapHandler.tileSize);
                }
                else if (effect.type === EffectsHandler.effectTypes.Flashlight && effect.position === "background") {
                    EffectsRenderer.displayFleshlight(this.tileMapHandler.currentLevel, this.tileMapHandler.player.x + (this.tileMapHandler.player.width / 2),
                        this.tileMapHandler.player.y + (this.tileMapHandler.player.height / 2), effect.radius, effect.flickerRadius, effect.color, effect.lighterColor);
                }
            }
            else if (layer === 1) {
                if (effect.type === EffectsHandler.effectTypes.Flashlight && effect.position === "foreground") {
                    EffectsRenderer.displayFleshlight(this.tileMapHandler.currentLevel, this.tileMapHandler.player.x + (this.tileMapHandler.player.width / 2),
                        this.tileMapHandler.player.y + (this.tileMapHandler.player.height / 2), effect.radius, effect.flickerRadius, effect.color, effect.lighterColor);
                }
                if (effect.type === EffectsHandler.effectTypes.Noise) {
                    EffectsRenderer.displayNoise(effect);
                }
            }
            else {
                if (effect.type === EffectsHandler.effectTypes.BlackAndWhite) {
                    EffectsRenderer.displayGreyScale();
                }
            }
        });
    }
} 