class FallHandler extends PlayMode {

    static jumpButtonReleasedHandler() {
        const { player } = this;
        player.jumpReleased = true;

        if (player.wallJumping) {
            player.wallJumpFrames = player.maxJumpFrames;
            player.wallJumping = false;
        }

        if (player.falling && player.currentCoyoteJumpFrame >= player.coyoteJumpFrames || player.fixedSpeed || player.temporaryDoubleJump) {
            player.doubleJumpActive = true;
        }
        if (player.jumping) {
            player.jumping = false;
            //If player jumping normally, not on a trampoline
            if (player.yspeed !== 0 && player.forcedJumpSpeed === 0) {
                player.jumpframes = player.maxJumpFrames;
            }
        }
        Controller.jumpReleased = true;
        player.jumpPressedToTheMax = false;
        player.flapped = false;
    }

    static fallHandler() {
        const { player } = this;

        if (player.falling && !player.fixedSpeed) {
            // x only for moving platforms
            //If player is falling and pressing against the wall, he will stick to the wall
            if (!player.swimming && !player.iceOnSide && 
                (player.wallJumpChecked || player.powerUpWallJumpChecked) && 
                player.yspeed > 0 &&
                (player.wallJumpLeft && (Controller.left || player.fixedSpeedLeft) ||
                    player.wallJumpRight && (Controller.right || player.fixedSpeedRight))) {
                player.yspeed = player.wallJumpGravity;
            }
            else {
                !player.wallJumping && player.currentWallJumpCoyoteFrame++;

                //If jump is not enforced by trampoline
                if (player.forcedJumpSpeed === 0) {
                    player.yspeed += player.iceOnSide ?
                        player.currentGravity / 2 :
                        player.currentGravity;
                }
            }
        }
    }

    static coyoteFrameHandler() {
        const { player } = this;
        //if player releases jump button while in the air (doesn't matter if jumping or falling)
        if (!Controller.jump && player.falling) {
            //if he is falling, give player some extra frames where he is able to jump
            if (player.yspeed >= 0) {
                player.currentCoyoteJumpFrame++;
            }
            //if he went up once, jumping, or on trampoline, set those frames to max immediatly
            else {
                player.currentCoyoteJumpFrame = player.coyoteJumpFrames;
            }
        }
    }

    static correctMaxYSpeed() {
        const { player } = this;

        if (!player.falling && player.jumpframes === 0 && !player.swimming && !player.fixedSpeed) {
            player.yspeed = 0;
        }
        if (player.yspeed > player.currentMaxFallSpeed) {
            player.yspeed = player.currentMaxFallSpeed;
        }
    }
}