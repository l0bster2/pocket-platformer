class JumpHandler extends PlayMode {

    static jumpHandler() {
        const { player } = this;
        this.checkMomentumCoyoteFrames(player);

        if (Controller.jump && !player.collidingWithNpcId && !PauseHandler.justClosedPauseScreen) {
            if (player.swimming) {
                this.swimHandler();
            }
            else {
                if ((player.jumpChecked || player.powerUpJumpChecked)) {
                    this.normalJumpHandler();
                }
                !player.fixedSpeed && this.wallJumpHandler();
                this.checkDoubleJumpInitialization();
            }
            Controller.jumpReleased = false;
        }
        else {
            FallHandler.jumpButtonReleasedHandler();
        }
        //If player released jump button, slowly de-accelarate the jump
        if (player.yspeed < 0 && !player.jumping && !player.wallJumping && !player.fixedSpeed) {
            if (player.swimming) {
                player.yspeed *= 0.90;
                if (player.yspeed < player.maxSwimHeight) {
                    player.yspeed = player.maxSwimHeight;
                }
            }
            else if (player.forcedJumpSpeed === 0) {
                if (Math.abs(player.yspeed) < 0.5) {
                    player.yspeed = 0;
                }
                else {
                    player.yspeed *= 0.75;
                }
            }
        }
    }

    static performJump(jumpSpeed, maxFrames) {
        player.jumpframes++;
        var currentJumpSpeed = -(maxFrames - player.jumpframes) * jumpSpeed;
        if (currentJumpSpeed !== 0) {
            //easing: currentJumpSpeed * currentJumpSpeed * -1 (and jumpspeed much smaller)
            player.yspeed = currentJumpSpeed;
        }
        if (this.player.forcedJumpSpeed !== 0 && this.player.jumpframes >= maxFrames) {
            this.player.forcedJumpSpeed = 0;
        }
    }

    static wallJumpAllowedHandler() {
        const { player } = this;
        //if player touched a wall, allow him to walljump
        if ((player.wallJumpChecked || player.powerUpWallJumpChecked) &&
            !player.swimming && !player.jumping && !player.wallJumping && player.falling) {
            if (player.wallJumpLeft) {
                this.resetWallJump(1);
            }
            else if (player.wallJumpRight) {
                this.resetWallJump(-1);
            }
        }
    }

    static resetWallJump(wallJumpDirection) {
        this.player.wallJumpFrames = 0;
        this.player.currentWallJumpCoyoteFrame = 0;
        this.player.temporaryDoubleJump = false;
        //if not in dashing cooldown
        if (this.player.currentDashFrame > this.player.dashCooldown) {
            this.player.dashing = false;
            this.player.currentDashFrame = 0;
        }
        this.player.wallJumpDirection = wallJumpDirection;
    }

    static normalJumpHandler() {
        const { player } = this;
        if (!player.jumpPressedToTheMax && !(player.jumpframes === 0 && !player.jumpReleased) && !player.dashing && player.forcedJumpSpeed === 0 && !player.flapped &&
            player.currentCoyoteJumpFrame < player.coyoteJumpFrames && player.jumpframes < player.maxJumpFrames && !player.invisible) {

            if (!player.jumping && player.jumpframes === 0 && player.jumpReleased) {
                player.jumpReleased = false;
                this.jumpInitialized();
                this.checkMomentumBasedBonusSpeed(player);
                tileMapHandler.changeJumpSwitchBlockType();
            }
            this.performJump(player.jumpSpeed, player.maxJumpFrames);
            player.jumping = true;
        }
        if (player.jumpframes === player.maxJumpFrames && player.yspeed <= 0) {
            player.jumpPressedToTheMax = true;
        }
    }

    static wallJumpHandler() {
        const { player } = this;
        if ((player.wallJumpChecked || player.powerUpWallJumpChecked)
            && !player.dashing && !player.flapped &&
            player.wallJumpFrames < player.maxJumpFrames &&
            player.currentWallJumpCoyoteFrame < player.coyoteJumpFrames) {

            if (!player.wallJumping && player.wallJumpFrames === 0) {
                player.doubleJumpUsed = false;
                WalkHandler.reverseForcedRunSpeed();
                tileMapHandler.changeJumpSwitchBlockType();
                this.jumpInitialized(player.wallJumpLeft ? AnimationHelper.facingDirections.left : AnimationHelper.facingDirections.right);
            }

            player.wallJumpFrames++;

            var currentJumpSpeed = -(player.maxJumpFrames - player.wallJumpFrames) * player.jumpSpeed;
            if (currentJumpSpeed !== 0) {
                player.yspeed = currentJumpSpeed;
            }

            //push player to side while walljumping
            if (player.wallJumpFrames < player.pushToSideWhileWallJumpingFrames) {
                player.xspeed -= currentJumpSpeed * player.wallJumpDirection;

                if (player.wallJumpDirection === 1 && player.xspeed > player.maxSpeed) {
                    player.xspeed = player.maxSpeed;
                }
                else if (player.wallJumpDirection === -1 && player.xspeed < player.maxSpeed * -1) {
                    player.xspeed = player.maxSpeed * -1;
                }
            }
            player.wallJumping = true;
        }
    }

    static checkDoubleJumpInitialization() {
        const { player } = this;
        if ((player.doubleJumpChecked || player.temporaryDoubleJump || player.powerUpDoubleJumpChecked)
            && player.doubleJumpActive && !player.doubleJumpUsed && !player.wallJumping) {
            player.jumpPressedToTheMax = false;
            player.resetJump();
            player.fixedSpeed = false;
            player.forcedJumpSpeed = 0;
            player.doubleJumpActive = false;
            player.doubleJumpUsed = true;
            player.jumping = false;

            if (player.dashing) {
                player.dashing = false;
                player.xspeed = 0;
                player.currentDashFrame = player.maxDashFrames;
            }
        }
    }

    static fullySubmergedInWater() {
        return this.player.top_right_pos_in_water && this.player.top_left_pos_in_water
            && this.player.bottom_right_pos_in_water && this.player.bottom_left_pos_in_water;
    }

    static swimHandler() {
        player.wallJumping = false;
        player.jumping = false;
        player.jumpPressedToTheMax = true;

        //if player is swimming, but the top corners don't touch water, he is floating on the surface
        const waterAtTopOnly = !this.player.top_right_pos_in_water && !this.player.top_left_pos_in_water
            && (this.player.bottom_right_pos_in_water || this.player.bottom_left_pos_in_water);

        if (player.yspeed < 0 && waterAtTopOnly && player.forcedJumpSpeed === 0) {
            player.y = (player.top + 1) * tileMapHandler.tileSize - 4;
            SFXHandler.createSFX(player.x, player.top * tileMapHandler.tileSize, 0, AnimationHelper.facingDirections.bottom);
            player.forcedJumpSpeed = player.jumpSpeed / 1.23;
            player.jumpframes = 0;
            player.doubleJumpUsed = false;
            player.currentDashFrame = 0;
        }
        else if (!this.player.flapped && Controller.jumpReleased) {
            SoundHandler.bubble.stopAndPlay();
            this.fullySubmergedInWater() && SFXHandler.createSFX(player.x, player.y, 11, AnimationHelper.facingDirections.bottom, 0, 0, true, 14);

            if (this.player.yspeed - this.player.flapHeight > this.player.maxSwimHeight) {
                this.player.yspeed -= this.player.flapHeight;
            }
            else {
                this.player.yspeed = this.player.maxSwimHeight;
            }
            this.player.flapped = true;
        }
    }

    static checkMomentumCoyoteFrames(player) {
        if (player.currentMomentumCoyoteFrame < player.coyoteJumpFrames) {
            if (player.currentMomentumCoyoteFrame === player.coyoteJumpFrames - 1) {
                player.momentumBonusSpeedX = 0;
                player.momentumBonusSpeedY = 0;
            }
            player.currentMomentumCoyoteFrame++;
        }
    }

    static checkMomentumBasedBonusSpeed(player) {
        if (player.onMovingPlatform) {
            player.onMovingPlatform = false;
            player.bonusSpeedX = 0;
            player.bonusSpeedY = 0;
        }

        /*
        player.onMovingPlatform = false;
        
        if(player.momentumBonusSpeedX) {
            //player.bonusSpeedX = player.momentumBonusSpeedX;
        }
        else if(player.momentumBonusSpeedY) {
            //player.bonusSpeedY = player.momentumBonusSpeedY;
        }
        if(!player.momentumBonusSpeedX && !player.momentumBonusSpeedY && player.onMovingPlatform) {
            player.bonusSpeedX = 0;
            player.bonusSpeedY = 0;
        }*/
    }

    static jumpInitialized(direction = AnimationHelper.facingDirections.bottom) {
        SoundHandler.shortJump.stopAndPlay();
        SFXHandler.createSFX(player.x, player.y - 2, 0, direction);
        this.player.setStretchAnimation();
        this.player.fixedSpeed = false;
    }
}