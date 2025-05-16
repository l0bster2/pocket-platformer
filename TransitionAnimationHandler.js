class TransitionAnimationHandler {
    static staticConstructor() {
        this.animationFrames = 48;
        this.animationType = "tiles";
        this.animationTypes = {
            none: "none",
            tiles: "tiles",
            cutOutCircle: "cutOutCircle",
            wholeScreen: "wholeScreen"
        }
        this.currentAnimationType = null;
        this.currentAnimationFrames = null;
    }

    static changeAnimationType(event) {
        this.animationType = event.target.value;
    }

    static changeAnimationDuration(event) {
        const value = parseInt(event.target.value);
        this.animationFrames = value;
        document.getElementById("transitionDurationValue").innerHTML = value;
    }

    static displayTransition() {
        const halfAnimationFrames = this.currentAnimationFrames / 2;
        const totalBlackFrames = this.currentAnimationFrames > 24 ? 4 : 0;

        if (tileMapHandler.checkIfStartOrEndingLevel()) {
            PlayMode.currentPauseFrames = 0;
        }
        const fadeInFrames = halfAnimationFrames + totalBlackFrames;
        const fadeOutFrames = halfAnimationFrames - totalBlackFrames;

        //fade in
        if (PlayMode.currentPauseFrames > fadeInFrames) {
            const currentFrame = fadeInFrames - (PlayMode.currentPauseFrames - fadeInFrames);
            switch (this.currentAnimationType) {
                case this.animationTypes.tiles:
                    this.animateFade(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.wholeScreen:
                    this.animateFadeWholeScreen(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.cutOutCircle:
                    this.animateFadeCircle(PlayMode.currentPauseFrames - fadeInFrames, fadeInFrames);
                    break;
            }
            //Camera.zoomToObject(0.01, player);
        }
        //fade out
        else if (PlayMode.currentPauseFrames < fadeOutFrames) {
            switch (this.currentAnimationType) {
                case this.animationTypes.tiles:
                    this.animateFade(PlayMode.currentPauseFrames, fadeOutFrames);
                    break;
                case this.animationTypes.wholeScreen:
                    this.animateFadeWholeScreen(PlayMode.currentPauseFrames, fadeInFrames);
                    break;
                case this.animationTypes.cutOutCircle:
                    this.animateFadeCircle(fadeInFrames - PlayMode.currentPauseFrames, fadeInFrames);
                    break;
            }
        }
        //stay black for some frames
        else {
            if (this.currentAnimationType !== this.animationTypes.none) {
                Display.drawRectangle(Camera.viewport.left,
                    Camera.viewport.top,
                    Camera.viewport.width,
                    Camera.viewport.height, "000000");
            }
        }
        if (PlayMode.currentPauseFrames === halfAnimationFrames) {
            tileMapHandler.switchToNextLevel();
        }
    }

    static animateFadeCircle(currenFrame, totalFrames) {
        const biggestRadius = Camera.viewport.width;
        const radiusStep = biggestRadius / totalFrames;
        const radius = radiusStep * currenFrame;
        Display.ctx.fillStyle = `rgb(0,0,0)`;
        Display.ctx.beginPath();
        Display.ctx.rect(Camera.viewport.left, Camera.viewport.top, Camera.viewport.width, Camera.viewport.height);
        Display.ctx.arc(player.x + tileMapHandler.halfTileSize, player.y + tileMapHandler.halfTileSize, 
            radius, 0, 2 * Math.PI, true);
        Display.ctx.fill();
        Display.ctx.closePath();
    }

    static animateFadeWholeScreen(currentFrame, totalFrames) {
        const percent = currentFrame / totalFrames;
        Display.drawRectangleWithAlpha(Camera.viewport.left,
            Camera.viewport.top,
            Camera.viewport.width,
            Camera.viewport.height, "000000", Display.ctx, percent);
    }

    static setTypeElementValue(type) {
        this.animationType = type;
        document.getElementById("transitionType").value = type;
    }

    static setDurationElementValue(value) {
        this.animationFrames = value;
        document.getElementById("transitionDuration").value = value;
        document.getElementById("transitionDurationValue").innerHTML = value;
    }

    static animateFade(currentFrame, totalFrames) {
        const percent = currentFrame / totalFrames * 100;
        const parcelAmount = 10;
        const parcelHeight = Display.canvasHeight / parcelAmount;
        const widthParcelAmount = Math.ceil(Display.canvasWidth / parcelHeight);

        for (var i = 0; i <= widthParcelAmount; i++) {
            for (var j = 0; j <= parcelAmount; j++) {
                const relativeWidth = parcelHeight / 100 * percent + 1;
                Display.drawRectangle(i * parcelHeight + ((parcelHeight - relativeWidth) / 2) + Camera.viewport.left,
                    j * parcelHeight + ((parcelHeight - relativeWidth) / 2) + Camera.viewport.top,
                    relativeWidth,
                    relativeWidth);
            }
        }
    }
}