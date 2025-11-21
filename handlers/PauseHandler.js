class PauseHandler {

    static staticConstructor() {
        this.options = ["Continue", "Restart game"];
        this.resetAttributes();
        this.downArrowReleased = true;
        this.restartedGame = false;
        this.upArrowReleased = true;
        this.restartGameMaxFrames = 50;
        this.justClosedPauseScreen = false;
        this.cameraScaleBeforePause = 1;
    }

    static resetAttributes() {
        this.paused = false;
        this.currentRestartGameFrameCounter = 0;
        this.currentOptionIndex = 0;
        this.restartedGame = false;
        this.justClosedPauseScreen = true;
    }

    static resetPauseHandler() {
        this.resetAttributes();
    }

    static checkPause() {
        if(!this.paused) {
            // pause mid-game activated
            if (Controller.enterReleased && Controller.enter && Controller.gamepadIndex !== null || 
                Controller.gamepadIndex === null && Controller.pause && Controller.pauseReleased) {
                this.paused = true;
                GameStatistics.stopTimer();
                GameStatistics.updateTimeBetweenPauses();
                //stop timer
                this.cameraScaleBeforePause = Camera.viewport.scale;
                Camera.updateViewportRelatedToScale(1);
            }
            Controller.pauseReleased = Controller.pause ? false : true;
            Controller.enterReleased = Controller.enter ? false : true;

            if(this.justClosedPauseScreen && !Controller.confirm) {
                this.justClosedPauseScreen = false;
            }
        }
    }

    static handlePause() {
        if(this.paused) {
            const { left, top, width, height } = Camera.viewport;
            Display.drawRectangle(left, top, width, height, WorldDataHandler.backgroundColor);
            Display.displayText("Paused",left + width / 2, top + height / 2 - 30, WorldDataHandler.fontSize + 17, '#' + WorldDataHandler.textColor);
            this.options.forEach((option, index) => {
                Display.displayText(option, left + width / 2, top + height / 2 + 20 + index * 30, WorldDataHandler.fontSize - 2, '#' + WorldDataHandler.textColor);
                if(this.currentOptionIndex === index) {
                    const optionTextLength = Display.measureText(option).width;
                    Display.displayText("►", left + width / 2 - optionTextLength / 2 - 20, top + height / 2 + 20 + index * 30, WorldDataHandler.fontSize - 2, '#' + WorldDataHandler.textColor);
                }
            });

            this.handleRestart();

            //if escape key (or similar key) was just pressed again to close pause menu
            if (Controller.enterReleased && Controller.enter && Controller.gamepadIndex !== null || 
                Controller.gamepadIndex === null && Controller.pause && Controller.pauseReleased) {
                GameStatistics.startTimer();
                this.resetPauseHandler();
                Camera.updateViewportRelatedToScale(this.cameraScaleBeforePause)
                //continue timer
            }
            Controller.pauseReleased = Controller.pause ? false : true;
            Controller.enterReleased = Controller.enter ? false : true;

            if(this.upArrowReleased && Controller.up) {
                this.currentOptionIndex--;
            }
            else if(this.downArrowReleased && Controller.down) {
                this.currentOptionIndex++;
            }

            if(this.currentOptionIndex > this.options.length - 1) {
                this.currentOptionIndex = 0;
            }
            else if(this.currentOptionIndex < 0) {
                this.currentOptionIndex = this.options.length - 1;
            }

            this.downArrowReleased = Controller.down ? false : true;
            this.upArrowReleased = Controller.up ? false : true;
            
            if((Controller.confirm || (Controller.gamepadIndex === null && Controller.enter)) && !this.restartedGame) {
                //restart game
                if(this.currentOptionIndex === 1) {
                    this.restartedGame = true;
                    this.currentRestartGameFrameCounter = this.restartGameMaxFrames;
                    SoundHandler.currentSong && SoundHandler.setVolume(SoundHandler.currentSong, 0.3);
                    SoundHandler.guiSelect.stopAndPlay();
                }
                //continue
                else {
                    GameStatistics.startTimer();
                    this.resetPauseHandler();
                    Camera.updateViewportRelatedToScale(this.cameraScaleBeforePause)
                }
            }
        }
    }

    static handleRestart() {
        const { left, top, width, height, context } = Camera.viewport;

        if(this.currentRestartGameFrameCounter > 0) {
            Display.drawRectangleWithAlpha(left, top, width, height, WorldDataHandler.backgroundColor, context, 1 - this.currentRestartGameFrameCounter / 100 * 2);
            this.currentRestartGameFrameCounter--;
            if(this.currentRestartGameFrameCounter === 0) {
                if(SoundHandler.currentSong) {
                    SoundHandler[SoundHandler.currentSong].sound.currentTime = 0;
                    SoundHandler.sounds.forEach(sound => {
                        if(sound.type === "music") {
                            SoundHandler.setVolume(sound.key, 1);
                        }
                    })
                }
                DialogueHandler.setDialogueWindowToInactive();
                PlayMode.startGame();
                this.resetPauseHandler();
            }
        }
    }
}