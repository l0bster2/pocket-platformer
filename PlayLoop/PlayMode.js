class PlayMode {

    static staticConstructor(player, tilemapHandler) {
        this.player = player;
        this.tilemapHandler = tilemapHandler;
        this.deathPauseFrames = 24;
        this.currentPauseFrames = 0;
        this.animateToNextLevel = false;
        this.customExit;
    }

    static runStartScreenLogic() {
        this.player.x = 0;
        this.player.y = 0;
        //we need this check, because on mobile, the music will only start playing after a user interaction. A user interaction is a touch start and touch end
        if ((Controller.enter && !Controller.mobileEnter) || Controller.mobileEnterReleased) {
            Controller.enterReleased = false;
            this.startGame();
            SoundHandler.guiSelect.stopAndPlay();
        }
    }

    static startGame() {
        GameStatistics.resetPermanentObjects();
        tileMapHandler.currentLevel = 1;
        if (typeof LevelNavigationHandler === 'function') {
            LevelNavigationHandler.updateLevel();
        }
        else {
            tileMapHandler.resetLevel(tileMapHandler.currentLevel);
        }
        GameStatistics.resetPlayerStatistics();
        GameStatistics.startTimer();
    }

    static runPlayLogic() {
        const { player } = this;

        PauseHandler.checkPause();

        if (!player.death && this.currentPauseFrames === 0 && !DialogueHandler.active && !PauseHandler.paused) {
            this.updateGeneralFrameCounter();
            PlayerInteractionHandler.clearInteractionTargets();
            var walking = WalkHandler.walkHandler();
            FallHandler.coyoteFrameHandler();
            JumpHandler.wallJumpAllowedHandler();
            player.forcedJumpSpeed !== 0 && JumpHandler.performJump(player.forcedJumpSpeed, player.maxJumpFrames + player.extraTrampolineJumpFrames);
            AlternativeActionHandler.dashHandler();
            Controller.alternativeActionButtonReleased = Controller.alternativeActionButton ? false : true;
            JumpHandler.jumpHandler();
            if (!player.dashing) {
                //const runButtonReleased = WalkHandler.isRunButtonReleased();
                !walking && WalkHandler.slowDownWalkSpeed();
                FallHandler.fallHandler();
            }
            FallHandler.correctMaxYSpeed();
            player.resetTemporaryAttributes();
            CharacterCollision.checkCollisionsWithWorld(player, true);
            PlayerInteractionHandler.updatePlayerTarget(player);
            PlayerInteractionHandler.updateOverlay();
        }
        PlayerInteractionHandler.handleInput(); // still need to handle pause and transitions and death and reset
    }

    static updateGeneralFrameCounter() {
        tileMapHandler.currentGeneralFrameCounter++;
        if (tileMapHandler.currentGeneralFrameCounter > tileMapHandler.generalFrameCounterMax) {
            tileMapHandler.currentGeneralFrameCounter = 0;
        }
    }

    static pauseFramesHandler() {
        if (PauseHandler.paused) {
            PauseHandler.handlePause();
        }
        else if (this.currentPauseFrames > 0) {
            this.currentPauseFrames--;
            if (player.death) {
                if (this.currentPauseFrames === this.deathPauseFrames / 2) {
                    this.player.resetPosition(true);
                    this.player.invisible = false;
                    this.player.death = false;
                    tileMapHandler.resetDynamicObjects();
                    PlayerInteractionHandler.reset(false);
                }
            }
            if (this.animateToNextLevel) {
                TransitionAnimationHandler.displayTransition();
            }
        }
        else {
            if (this.animateToNextLevel) {
                this.animateToNextLevel = false;
                PlayerInteractionHandler.reset(false);
            }
            this.currentPauseFrames = 0;
        }
    }

    static playerExitLevel(customExit) {
        this.animateToNextLevel = true;
        this.currentPauseFrames = TransitionAnimationHandler.animationFrames;
        this.customExit = customExit;
        PlayerInteractionHandler.blockInteractionsFor('level-exit');

        if (this.tilemapHandler.currentLevel === WorldDataHandler.levels.length - 2 && !customExit
            && !WorldDataHandler.insideTool && SoundHandler.currentSong) {
            SoundHandler.fadeAudio(SoundHandler.currentSong);
        }
    }

    static playerDeath() {
        if (this.animateToNextLevel) {
            return null;
        }
        PlayerInteractionHandler.blockInteractionsFor('player-death');
        SoundHandler.hit.stopAndPlay();
        //Camera.setScreenShake(10, 2);
        this.currentPauseFrames = this.deathPauseFrames;
        this.player.death = true;
        const direction = AnimationHelper.facingDirections.bottom;
        for (var i = 0; i < 7; i++) {
            SFXHandler.createSFX(player.x, player.y, 2, direction, MathHelpers.getSometimesNegativeRandomNumber(0, 2, false), MathHelpers.getSometimesNegativeRandomNumber(0, 2, false), true, 22);
        }
        this.player.resetAttributes();
        GameStatistics.deathCounter++;
        tileMapHandler.currentGeneralFrameCounter = 0;
    }

    static checkActiveCheckPoints() {
        let checkPointPos = null;
        this.tilemapHandler && this.tilemapHandler.levelObjects.forEach(levelObject => {
            if (levelObject.type === ObjectTypes.CHECKPOINT && levelObject?.active) {
                checkPointPos = {
                    x: levelObject.initialX * this.tilemapHandler.tileSize,
                    y: levelObject.initialY * this.tilemapHandler.tileSize
                }
            }
        });
        return checkPointPos;
    }
}