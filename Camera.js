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

        newFollowX = this.outOfBoundsXCorrection(x);
        newFollowY = this.outOfBoundsYCorrection(y);

        if (newFollowX && newFollowX !== this.follow.x) {
            this.follow.x = newFollowX;
            positionChanged = true;
        }
        if (newFollowY && newFollowY !== this.follow.y) {
            this.follow.y = newFollowY;
            positionChanged = true;
        }
        if (this.screenShake.currentFrame > 0) {
            this.doScreenShake();
            positionChanged = true;
        }
        if (positionChanged) {
            this.updateViewport();
        }
    }

    static doScreenShake() {
        this.screenShake.currentFrame--;
        this.follow.x += MathHelpers.getSometimesNegativeRandomNumber(1, this.screenShake.intensity, false);
        this.follow.y += MathHelpers.getSometimesNegativeRandomNumber(1, this.screenShake.intensity, false);

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

    static zoomToObject(scaleSpeed = 0.0025, obj) {
        Display.ctx.imageSmoothingEnabled = true;
        if (Camera.viewport.scale < 2) {
            Camera.updateViewportRelatedToScale(Camera.viewport.scale + scaleSpeed);
            const cameraMovementSpeed = Math.floor(Camera.viewport.width / 100 * (scaleSpeed * 100));
            const cameraXCenter = Camera.viewport.left + Camera.viewport.halfWidth;
            const cameraYCenter = Camera.viewport.top + Camera.viewport.halfHeight;
            const newAngle = MathHelpers.getAngle(obj.x, obj.y, cameraXCenter, cameraYCenter);
            const angle = MathHelpers.normalizeAngle(newAngle);
            const radians = MathHelpers.getRadians(angle);
            if (MathHelpers.getDistanceBetween2Objects({ x: cameraXCenter, y: cameraYCenter }, obj) < cameraMovementSpeed) {
                Camera.viewport.left = obj.x;
                Camera.viewport.top = obj.y;
            }
            else {
                Camera.viewport.left -= Math.cos(radians) * cameraMovementSpeed;
                Camera.viewport.top -= Math.sin(radians) * cameraMovementSpeed;
            }
        }
    }
}