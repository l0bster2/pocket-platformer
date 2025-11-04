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
            switch (this.currentAnimationType) {
                case this.animationTypes.tiles:
                    TransitionAnimations.animateFade(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.wholeScreen:
                    TransitionAnimations.animateFadeWholeScreen(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.cutOutCircle:
                    TransitionAnimations.animateFadeCircle(PlayMode.currentPauseFrames - fadeInFrames, fadeInFrames);
                    break;
                case this.animationTypes.collide:
                    TransitionAnimations.drawCollide(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.radialWipe:
                    TransitionAnimations.drawRadialWipe(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.explode:
                    TransitionAnimations.drawDiamondExplosion(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.dissolve:
                    TransitionAnimations.drawDissolve(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.rotatingCube:
                    TransitionAnimations.drawRotatingHole(currentFrame, fadeInFrames);
                    break;
                case this.animationTypes.diamondSwipe:
                    TransitionAnimations.drawDiamondSwipe(currentFrame, fadeInFrames);
                    break;
            }
            //Camera.zoomToObject(0.01, player);
        }
        //fade out
        else if (PlayMode.currentPauseFrames < fadeOutFrames) {
            switch (this.currentAnimationType) {
                case this.animationTypes.tiles:
                    TransitionAnimations.animateFade(PlayMode.currentPauseFrames, fadeOutFrames);
                    break;
                case this.animationTypes.wholeScreen:
                    TransitionAnimations.animateFadeWholeScreen(PlayMode.currentPauseFrames, fadeInFrames);
                    break;
                case this.animationTypes.cutOutCircle:
                    TransitionAnimations.animateFadeCircle(fadeInFrames - PlayMode.currentPauseFrames, fadeInFrames);
                    break;
                case this.animationTypes.collide:
                    TransitionAnimations.drawCollide(PlayMode.currentPauseFrames, fadeOutFrames);
                    break;
                case this.animationTypes.radialWipe:
                    TransitionAnimations.drawRadialWipe(PlayMode.currentPauseFrames, fadeOutFrames);
                    break;
                case this.animationTypes.explode:
                    TransitionAnimations.drawDiamondExplosion(PlayMode.currentPauseFrames, fadeOutFrames);
                    break;
                case this.animationTypes.dissolve:
                    TransitionAnimations.drawDissolve(PlayMode.currentPauseFrames, fadeOutFrames);
                    break;
                case this.animationTypes.rotatingCube:
                    TransitionAnimations.drawRotatingHole(PlayMode.currentPauseFrames, fadeOutFrames);
                    break;
                case this.animationTypes.diamondSwipe:
                    TransitionAnimations.drawDiamondSwipe(PlayMode.currentPauseFrames, fadeOutFrames);
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