class Camera {

    static staticConstructor(context, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        this.follow = { x: 0, y: 0 };
        this.context = context;
        this.originalHeight = canvasHeight;
        this.originalWidth = canvasWidth;
        this.viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: canvasWidth,
            halfWidth: canvasWidth / 2,
            height: canvasHeight,
            halfHeight: canvasHeight / 2,
            scale: 1,
            worldWidth: worldWidth,
            worldHeight: worldHeight
        };
        this.moveTo(this.viewport.halfWidth, this.viewport.halfHeight);
        this.updateViewport();
        this.screenShake = {
            currentFrame: 0,
            intensity: 0,
        };
        this.objectToZoomTo = null;
        this.currentScreenshakeOffsetX = 0;
        this.currentScreenshakeOffsetY = 0;
    }

    static begin() {
        this.context.save();
        this.applyZoom();
        this.applyTranslation();
    }

    static end() {
        this.context.restore();
    }

    static updateViewportRelatedToScale(scale) {
        this.viewport.scale = scale;
        this.viewport.height = this.originalHeight / this.viewport.scale;
        this.viewport.width = this.originalWidth / this.viewport.scale;
        this.viewport.halfHeight = this.originalHeight / 2 / this.viewport.scale;
        this.viewport.halfWidth = this.originalWidth / 2 / this.viewport.scale;
        player.x && player.y && this.followObject(player.x, player.y);
        //Could be removed if there was a transition after pressing start on first screen
        window.setTimeout(() => {
            Display.ctx.imageSmoothingEnabled = this.viewport.scale === 1;
        }, 10);
    }

    static applyTranslation() {
        this.context.translate(-this.viewport.left, -this.viewport.top);
    }

    static applyZoom() {
        if (this.viewport.scale !== 1) {
            this.context.scale(this.viewport.scale, this.viewport.scale)
        }
    }

    static updateViewport() {
        this.viewport.left = this.follow.x - this.viewport.halfWidth;
        this.viewport.top = this.follow.y - this.viewport.halfHeight;
    }

    static setScreenShake(frames, intensity) {
        this.screenShake.currentFrame = frames;
        this.screenShake.intensity = intensity;
    }

    static followObject(x, y) {
        let newFollowX;
        let newFollowY;
        let positionChanged = false;

        /*
            Those fixes are needed for zoom factor.
            If Zoom factor doesn't fit the game screen perfectly (F.e 18x10 size), the difference can be really small, like 5px
            In that case, it's annoying if the camera jumps up and down just a little bit
        */
        let changingXNecessary = false;
        let changingYNecessary = false;

        if (this.objectToZoomTo) {
            this.zoomToObject(this.objectToZoomTo.zoomSpeed, this.objectToZoomTo.desiredZoomFactor);
            positionChanged = true;
        }

        newFollowX = this.outOfBoundsXCorrection(x);
        newFollowY = this.outOfBoundsYCorrection(y);

        if (tileMapHandler.levelHeightInPx - this.viewport.height > tileMapHandler.tileSize - 1) {
            changingYNecessary = true
        }
        if (tileMapHandler.levelWidthInPx - this.viewport.width > tileMapHandler.tileSize - 1) {
            changingXNecessary = true
        }

        if (changingXNecessary && newFollowX && newFollowX !== this.follow.x) {
            this.follow.x = newFollowX;
            positionChanged = true;
        }
        if (changingYNecessary && newFollowY && newFollowY !== this.follow.y) {
            this.follow.y = newFollowY;
            positionChanged = true;
        }
        if (this.screenShake.currentFrame > 0) {
            this.doScreenShake();
            positionChanged = true;
            if (this.screenShake.currentFrame === 0) {
                this.follow.x = this.outOfBoundsXCorrection(x);
                this.follow.y = this.outOfBoundsYCorrection(y);
            }
        }
        if (positionChanged) {
            this.updateViewport();
        }
    }

    static doScreenShake() {
        this.screenShake.currentFrame--;
        let direction = -1;
        const evenFrame = this.screenShake.currentFrame % 2 === 0;
        if(evenFrame) {
            this.currentScreenshakeOffsetX = MathHelpers.getRandomNumberBetweenTwoNumbers(this.screenShake.intensity / 2, this.screenShake.intensity, false);
            this.currentScreenshakeOffsetY = MathHelpers.getRandomNumberBetweenTwoNumbers(this.screenShake.intensity / 2, this.screenShake.intensity, false);
            direction = 1;
        }
        this.follow.x += this.currentScreenshakeOffsetX * direction;
        this.follow.y += this.currentScreenshakeOffsetY * direction;
    }

    static outOfBoundsXCorrection(x) {
        if (x <= this.viewport.halfWidth) {
            return Math.round(this.viewport.halfWidth);
        }
        else if (x >= this.viewport.worldWidth - this.viewport.halfWidth) {
            return Math.round(this.viewport.worldWidth - this.viewport.halfWidth);
        }
        else {
            return Math.round(x);
        }
    }

    static outOfBoundsYCorrection(y) {
        if (y <= this.viewport.halfHeight) {
            return Math.round(this.viewport.halfHeight);
        }
        else if (y >= this.viewport.worldHeight - this.viewport.halfHeight) {
            return Math.round(this.viewport.worldHeight - this.viewport.halfHeight);
        }
        else {
            return Math.round(y);
        }
    }

    static moveTo(x, y) {
        this.follow.x = this.outOfBoundsXCorrection(x);
        this.follow.y = this.outOfBoundsYCorrection(y);
        this.updateViewport();
    }

    static screenToWorld(x, y) {
        return { x: x - this.viewport.left, y: y - this.viewport.top };
    }

    static worldToScreen(x, y) {
        return {
            x: x / this.viewport.scale + this.viewport.left,
            y: y / this.viewport.scale + this.viewport.top
        };
    }

    static zoomToObject(scaleSpeed = 0.0025, desiredZoomFactor) {
        Display.ctx.imageSmoothingEnabled = true;
        if (Camera.viewport.scale < desiredZoomFactor) {
            const scale = Camera.viewport.scale + scaleSpeed;
            this.viewport.scale = scale;
            this.viewport.height = this.originalHeight / this.viewport.scale;
            this.viewport.width = this.originalWidth / this.viewport.scale;
            this.viewport.halfHeight = this.originalHeight / 2 / this.viewport.scale;
            this.viewport.halfWidth = this.originalWidth / 2 / this.viewport.scale;
        }
        else {
            this.objectToZoomTo = null;
        }
    }
}