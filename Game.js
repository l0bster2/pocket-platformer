class Game {

    static get PLAY_MODE() {
        return 'play';
    }

    static get BUILD_MODE() {
        return 'build';
    }

    static staticConstructor() {
        this.playMode = this.PLAY_MODE;
        this.refreshRateCounter = [];
        this.refreshRateHigher60 = false;
        this.refreshRate = null;
        this.refreshRates = [];
        this.currentRetryToGetFps = 0;
        this.maxRetriesToGetFps = 10;
        this.averageFps = null;
        this.percentOfFpsHigher70 = null;
    }

    static executeGameMode() {
        if (this.playMode === this.PLAY_MODE) {
            window.requestAnimationFrame(play);
        }
        else if (this.playMode === this.BUILD_MODE) {
            window.requestAnimationFrame(build);
        }
    }

    static startAnimating(fps) {
        this.fpsInterval = 1000 / fps;
        this.then = 0;
        this.startTime = this.then;
    }

    static updateFPSInterval(timestamp) {
        this.now = timestamp;
        this.elapsed = this.now - this.then;

        if (!this.refreshRate) {
            this.refreshRateCounter.unshift(this.now);
            const waitFrames = 15;
            if (this.refreshRateCounter.length === waitFrames) {
                var t0 = this.refreshRateCounter.pop();
                this.refreshRate = Math.floor(1000 * waitFrames / (this.now - t0));
                if (this.refreshRate > 70) {
                    this.refreshRateHigher60 = true;
                }
                this.refreshRateCounter = [];
                this.currentRetryToGetFps++;
                this.refreshRates.push(this.refreshRate);
                if(this.currentRetryToGetFps < this.maxRetriesToGetFps) {
                    this.refreshRate = null;
                }
                else {
                    this.averageFps = this.refreshRates.reduce((partialSum, a) => partialSum + a, 0) / this.refreshRates.length;
                    const refreshRateHigher70 = this.refreshRates.filter(refreshRate => refreshRate > 70);
                    if(refreshRateHigher70.length > 0) {
                        this.percentOfFpsHigher70 = refreshRateHigher70.length / this.refreshRates.length * 100;
                        this.percentOfFpsHigher70 > 80 ? this.refreshRateHigher60 = true : this.refreshRateHigher60 = false;
                    }
                    else {
                        this.percentOfFpsHigher70 = 0;
                    }
                }
            }
        }
    }

    static resetFpsInterval() {
        this.then = this.now - (this.elapsed % this.fpsInterval);
    }

    static changeGameMode(firstTime = false) {
        const canvas = document.getElementById("myCanvas");

        if (this.playMode === this.PLAY_MODE) {
            this.playMode = this.BUILD_MODE;
            this.executeGameMode();
            canvas.addEventListener("mousemove", (e) => { Controller.mouseMove(e) });
            ObjectsTooltipElementsRenderer.renderPlayButton(firstTime);
            LevelSizeHandler.toggleSliderDisableAttr(false);
            tileMapHandler?.resetDynamicObjects();
            return null;
        }
        if (this.playMode === this.BUILD_MODE) {
            /*Camera.viewport.width = Camera.viewport.width / 2;
            Camera.viewport.height = Camera.viewport.height / 2;
            Camera.viewport.halfWidth = Camera.viewport.halfWidth / 2;
            Camera.viewport.halfHeight = Camera.viewport.halfHeight / 2;*/
            this.playMode = this.PLAY_MODE;
            this.executeGameMode();
            canvas.removeEventListener("mousemove", (e) => { Controller.mouseMove(e) });
            ObjectsTooltipElementsRenderer.renderPauseButton(firstTime);
            LevelSizeHandler.toggleSliderDisableAttr(true);
            return null;
        }
    }
}