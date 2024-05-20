class EffectsRenderer {
    static staticConstructor(tileMapHandler) {
        this.tileMapHandler = tileMapHandler;
        this.noiseCanvas = document.getElementById("noiseCanvas");
        this.createNoiseCanvas();
        this.noisePositions = {
            left: 0,
            top: 0,
        };
        this.rayCastingTriangles = [];
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

    static displayRaycasting(effect) {
        if (this.tileMapHandler.currentLevel !== 0 && this.tileMapHandler.currentLevel !== WorldDataHandler.levels.length - 1) {
            const { radius } = effect;
            const maxTileWidth = Math.floor(radius / this.tileMapHandler.tileSize);
            const rayCastAmounth = 64;
            const playerCenter = {
                x: this.tileMapHandler.player.x + this.tileMapHandler.player.width / 2,
                y: this.tileMapHandler.player.y + this.tileMapHandler.player.height / 2
            };
            const degreeStep = 360 / rayCastAmounth;
            let previousX = null;
            let previousY = null;
            const checkStep = this.tileMapHandler.tileSize;

            if (this.tileMapHandler.currentGeneralFrameCounter % 5 == 0) {
                this.rayCastingTriangles = [];
                for (var i = 0; i <= rayCastAmounth; i++) {
                    const currentAngle = i * degreeStep;

                    loop2:
                    for (var j = 0; j <= maxTileWidth; j++) {
                        const radians = MathHelpers.getRadians(currentAngle);
                        const left = Math.floor(playerCenter.x - Math.cos(radians) * (checkStep * j));
                        const top = Math.floor(playerCenter.y - Math.sin(radians) * (checkStep * j));
                        const leftTilePos = this.tileMapHandler.getTileValueForPosition(left);
                        const topTilePos = this.tileMapHandler.getTileValueForPosition(top);

                        const currentTileValue = this.tileMapHandler.getTileLayerValueByIndex(topTilePos, leftTilePos);
                        if ((currentTileValue !== 0 && currentTileValue !== 5) || j === maxTileWidth) {
                            let newX = leftTilePos * this.tileMapHandler.tileSize;
                            let newY = topTilePos * this.tileMapHandler.tileSize;

                            newX += this.tileMapHandler.player.x < newX ? 24 : 0;
                            newY += this.tileMapHandler.player.y > newY ? 24 : 0;

                            if (previousX !== null && previousY !== null) {
                                this.rayCastingTriangles.push({
                                    center: playerCenter,
                                    old: { x: previousX, y: previousY },
                                    new: { x: newX, y: newY },
                                });
                            }
                            previousX = newX;
                            previousY = newY;

                            break loop2;
                        }
                    }

                }
            }

            Display.ctx.beginPath();
            var radialGradient = Display.ctx.createRadialGradient(playerCenter.x, playerCenter.y, 1, playerCenter.x, playerCenter.y, radius * 1.7);
            const { rgb } = effect.color;
            radialGradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${effect.alpha})`);
            radialGradient.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},0.01)`);
            radialGradient.addColorStop(0.51, `rgba(0,0,0,0)`);
            Display.ctx.fillStyle = radialGradient;

            this.rayCastingTriangles.forEach(trialge => {
                Display.ctx.moveTo(playerCenter.x, playerCenter.y);
                Display.ctx.lineTo(trialge.old.x, trialge.old.y);
                Display.ctx.lineTo(trialge.new.x, trialge.new.y);
            });
            //Display.ctx.arc(playerCenter.x, playerCenter.y, 75, 0, 2 * Math.PI, true);
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

    static displayVignette(effect) {
        const { left, top, width, height } = Camera.viewport;
        const vignetteAlpha = 0.7;
        const percentage = 40;
        const coveringPercenatgeOfScreen = 1 - percentage / 100;

        Display.ctx.rect(left, top, width, height);

        // create radial gradient
        var outerRadius = width * coveringPercenatgeOfScreen;
        var innerRadius = width * .2;
        var grd = Display.ctx.createRadialGradient(left + width / 2, top + height / 2,
            innerRadius, left + width / 2, top + height / 2, outerRadius);
        // light blue
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        // dark blue
        grd.addColorStop(1, 'rgba(0,0,0,' + vignetteAlpha + ')');

        Display.ctx.fillStyle = grd;
        Display.ctx.fill();
    }

    static flipCameraVertically() {
        Camera.context.translate(0, Camera.viewport.height);
        Camera.context.scale(1, -1);
    }

    static displayScanlines(effect) {
        const maxSpeed = 4;
        const speed = maxSpeed - effect.movementSpeed;
        const spaceBetweenLines = 5;
        const yOffset = effect.movementSpeed ? tileMapHandler.currentGeneralFrameCounter % (spaceBetweenLines * speed) / speed : 0;
        const lineHeight = 3;
        // +3 just to make sure offset lines don't disappear when they move out of bounds
        const linesNeeded = Math.round(Camera.viewport.height / spaceBetweenLines) + 3;

        for (var i = 0; i <= linesNeeded; i++) {
            Display.drawRectangleWithAlpha(Camera.viewport.left, Camera.viewport.top + ((i - 2) * spaceBetweenLines) + yOffset,
                Camera.viewport.width, lineHeight, "000000", Display.ctx, effect.alpha)
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
                else if (effect.type === EffectsHandler.effectTypes.FieldOfView) {
                    EffectsRenderer.displayRaycasting(effect);
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
                else if (effect.type === EffectsHandler.effectTypes.Scanlines) {
                    EffectsRenderer.displayScanlines(effect);
                }
            }
        });
    }
} 