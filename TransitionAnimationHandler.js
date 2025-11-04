class TransitionAnimationHandler {
    static staticConstructor() {
        this.animationFrames = 48;
        this.animationType = "tiles";
        this.animationTypes = {
            none: "none",
            tiles: "tiles",
            cutOutCircle: "cutOutCircle",
            wholeScreen: "wholeScreen",
            collide: "collide",
            radialWipe: "radialWipe",
            explode: "explode",
            dissolve: "dissolve",
            rotatingCube: "rotatingCube",
            diamondSwipe: "diamondSwipe",
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
            this.drawFadeInAnimation(currentFrame, fadeInFrames)
            //Camera.zoomToObject(0.01, player);
        }
        //fade out
        else if (PlayMode.currentPauseFrames < fadeOutFrames) {
            this.drawFadeOutAnimation(PlayMode.currentPauseFrames, fadeOutFrames)
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

    static drawFadeInAnimation(currentFrame, fadeInFrames, viewport = Camera.viewport, ctx = Display.ctx, preview = false) {
        switch (this.currentAnimationType) {
            case this.animationTypes.tiles:
                TransitionAnimations.animateFade(currentFrame, fadeInFrames, viewport, ctx, preview);
                break;
            case this.animationTypes.wholeScreen:
                TransitionAnimations.animateFadeWholeScreen(currentFrame, fadeInFrames, viewport, ctx);
                break;
            case this.animationTypes.cutOutCircle:
                TransitionAnimations.animateFadeCircle(currentFrame, fadeInFrames, viewport, ctx, preview);
                break;
            case this.animationTypes.collide:
                TransitionAnimations.drawCollide(currentFrame, fadeInFrames, viewport, ctx);
                break;
            case this.animationTypes.radialWipe:
                TransitionAnimations.drawRadialWipe(currentFrame, fadeInFrames, viewport, ctx);
                break;
            case this.animationTypes.explode:
                TransitionAnimations.drawDiamondExplosion(currentFrame, fadeInFrames, viewport, ctx);
                break;
            case this.animationTypes.dissolve:
                TransitionAnimations.drawDissolve(currentFrame, fadeInFrames, viewport, ctx);
                break;
            case this.animationTypes.rotatingCube:
                TransitionAnimations.drawRotatingHole(currentFrame, fadeInFrames, viewport, ctx);
                break;
            case this.animationTypes.diamondSwipe:
                TransitionAnimations.drawDiamondSwipe(currentFrame, fadeInFrames, viewport, ctx);
                break;
        }
    }

    static drawFadeOutAnimation(currentFrame, fadeOutFrames, viewport = Camera.viewport, ctx = Display.ctx, preview = false) {
        switch (this.currentAnimationType) {
            case this.animationTypes.tiles:
                TransitionAnimations.animateFade(currentFrame, fadeOutFrames, viewport, ctx, preview);
                break;
            case this.animationTypes.wholeScreen:
                TransitionAnimations.animateFadeWholeScreen(currentFrame, fadeOutFrames, viewport, ctx);
                break;
            case this.animationTypes.cutOutCircle:
                TransitionAnimations.animateFadeCircle(currentFrame, fadeOutFrames, viewport, ctx, preview);
                break;
            case this.animationTypes.collide:
                TransitionAnimations.drawCollide(currentFrame, fadeOutFrames, viewport, ctx);
                break;
            case this.animationTypes.radialWipe:
                TransitionAnimations.drawRadialWipe(currentFrame, fadeOutFrames, viewport, ctx);
                break;
            case this.animationTypes.explode:
                TransitionAnimations.drawDiamondExplosion(currentFrame, fadeOutFrames, viewport, ctx);
                break;
            case this.animationTypes.dissolve:
                TransitionAnimations.drawDissolve(currentFrame, fadeOutFrames, viewport, ctx);
                break;
            case this.animationTypes.rotatingCube:
                TransitionAnimations.drawRotatingHole(currentFrame, fadeOutFrames, viewport, ctx);
                break;
            case this.animationTypes.diamondSwipe:
                TransitionAnimations.drawDiamondSwipe(currentFrame, fadeOutFrames, viewport, ctx);
                break;
        }
    }

    static showPreview() {
        const half = Math.ceil(this.animationFrames / 2);
        const totalFrames = half;
        let count = 0;
        const previewCanvas = document.getElementById("transitionCanvas");
        const previewCanvasCtx = previewCanvas.getContext("2d");
        const fakeViewport = {
            left: 0,
            top: 0,
            width: 158,
            height: 86.
        }
        this.currentAnimationType = this.animationType;
        this.currentAnimationFrames = this.animationFrames;

        const timer = setInterval(() => {
            previewCanvasCtx.clearRect(0, 0, fakeViewport.width, fakeViewport.height);
            let currentFrame;

            if (count < half) {
                currentFrame = count + 1;
                this.drawFadeInAnimation(currentFrame, totalFrames, fakeViewport, previewCanvasCtx, true)
            } else {
                currentFrame = totalFrames - (count - half);
                this.drawFadeOutAnimation(currentFrame, totalFrames, fakeViewport, previewCanvasCtx, true)
            }
            count++;
            if (count >= this.animationFrames) {
                clearInterval(timer);
                previewCanvasCtx.clearRect(0, 0, fakeViewport.width, fakeViewport.height);
                console.log("Done!");
            }
        }, 40);
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
}