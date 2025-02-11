class AlternativeActionHandler extends PlayMode {
    
    static dashHandler() {
        const { player } = this;

        //If dashing possible and player is not flying outside cannon, or is flying upwards
        if ((player.dashChecked || player.powerUpDashChecked) 
            && (!player.fixedSpeed || player.fixedSpeed && player.yspeed !== 0)) {
            player.currentCoyoteDashFrame++;
            //initialize dash
            if (Controller.alternativeActionButtonReleased && Controller.alternativeActionButton) {
                player.currentCoyoteDashFrame = 0;
            }
            if (!player.jumping && !player.falling && player.currentDashFrame >= player.maxDashFrames) {
                player.currentDashFrame = 0;
            }

            if (player.currentCoyoteDashFrame < player.coyoteDashFrames && !player.dashing && player.currentDashFrame === 0) {
                player.currentCoyoteDashFrame = player.coyoteDashFrames;
                player.dashing = true;
                player.fixedSpeed = false;
                player.forcedJumpSpeed = 0;
                SoundHandler.dash.stopAndPlay();

                this.getDashDirection();

                //If player dashes of wall, change auto-run direction
                if (player.wallJumpLeft && player.dashDirection === AnimationHelper.facingDirections.right ||
                    player.wallJumpRight && player.dashDirection === AnimationHelper.facingDirections.left) {
                    WalkHandler.reverseForcedRunSpeed();
                }
            }

            if (player.dashing) {
                this.performDash();
                this.checkDashEnd();
                player.currentDashFrame++;
            }
        }
    }

    static getDashDirection() {
        const { player } = this;

        player.dashDirection = AnimationHelper.facingDirections.left;

        //if player faces right, or he is stuck to the left wall and wants to push away by pressing x immediatly
        if (player.xspeed === 0 && player.facingDirection === AnimationHelper.facingDirections.right && !player.wallJumpRight
            || Controller.right && !player.wallJumpRight
            || player.wallJumpLeft && player.yspeed !== 0
            || player.wallJumpRight && player.yspeed === 0
            || player.dashing && player.xspeed > 0 && !player.wallJumpRight) {
            player.dashDirection = AnimationHelper.facingDirections.right;
        }
    }

    static performDash() {
        const { player } = this;

        if (player.currentDashFrame < player.maxDashFrames) {
            player.yspeed = 0;
            if(!player.onMovingPlatform) {
                player.bonusSpeedY = 0;
            }

            if (player.currentDashFrame < player.dashCooldown) {
                player.xspeed = 0;
            }
            else {
                const dashMultiplicator = 3.7;
                if (player.dashDirection === AnimationHelper.facingDirections.left) {
                    player.xspeed = player.maxSpeed * dashMultiplicator * -1;
                }
                else if (player.dashDirection === AnimationHelper.facingDirections.right) {
                    player.xspeed = player.maxSpeed * dashMultiplicator;
                }
                if (player.currentDashFrame % 3 === 0) {
                    SFXHandler.createSFX(player.x, player.y, 13);
                }
            }
        }
    }

    static checkDashEnd() {
        const { player } = this;
        
        if (player.currentDashFrame === player.maxDashFrames - 1) {
            player.dashing = false;
            player.xspeed = 0;
            //deactivate the variables, in case they were activated shortly before dash
            player.wallJumpFrames = player.maxJumpFrames;
            player.jumpFrames = player.maxJumpFrames;
        }
    }
}