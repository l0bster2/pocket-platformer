class EnemyJumpHandler {

    /**
     * Handles jump logic for enemies - simpler than player jumping
     * No complex mechanics like double jump, wall jump, or coyote frames
     */
    static performJump(enemy, jumpSpeed, maxFrames) {
        enemy.jumpframes++;
        
        // Clear bonus speed when jumping
        if (enemy.bonusSpeedY > 0 || enemy.jumpframes > 2) {
            enemy.bonusSpeedY = 0;
        }

        // Calculate jump speed based on frame progress
        const currentJumpSpeed = -(maxFrames - enemy.jumpframes) * jumpSpeed;
        if (currentJumpSpeed !== 0) {
            enemy.yspeed = currentJumpSpeed;
        }

        // End jump when max frames reached
        if (enemy.jumpframes >= maxFrames) {
            enemy.jumping = false;
            enemy.jumpframes = 0;
            // Clear trampoline launch so the enemy doesn't get re-launched on the next frame.
            // (Matches the player's JumpHandler behaviour.)
            enemy.forcedJumpSpeed = 0;
        }
    }

    /**
     * Perform a trampoline jump with boost
     * Called when enemy lands on a trampoline
     */
    static performTrampolineJump(enemy) {
        if (!enemy.jumping && !enemy.falling) {
            enemy.jumping = true;
            enemy.jumpframes = 0;
            enemy.falling = true;
            // Add extra frames for trampoline boost (similar to player)
            const extraTrampolineFrames = Math.round(enemy.maxJumpFrames / 6);
            enemy.forcedJumpSpeed = enemy.jumpSpeed + (enemy.jumpSpeed / 3.75);
            this.performJump(enemy, enemy.forcedJumpSpeed, enemy.maxJumpFrames + extraTrampolineFrames);
        }
    }

    /**
     * Initiate a normal jump for an enemy
     */
    static initiateJump(enemy) {
        if (!enemy.jumping && !enemy.falling && enemy.forcedJumpSpeed === 0) {
            enemy.jumping = true;
            enemy.jumpframes = 0;
            enemy.falling = true;
        }
    }

    /**
     * Update enemy jump state - call this in the enemy's update loop
     * @param {Enemy} enemy - The enemy object
     * @param {number} jumpIntervalFrames - How many frames between jumps
     */
    static updateJump(enemy, jumpIntervalFrames = 60) {
        if (enemy.flying) return;
        if (enemy.jumpTimer === undefined) {
            enemy.jumpTimer = 0;
        }

        // Continue an in-progress forced (trampoline) jump, never start an interval jump during it
        if (enemy.forcedJumpSpeed !== 0) {
            this.performJump(enemy, enemy.forcedJumpSpeed, enemy.maxJumpFrames + Math.round(enemy.maxJumpFrames / 6));
            return;
        }
        // Continue an in-progress normal jump
        if (enemy.jumping) {
            this.performJump(enemy, enemy.jumpSpeed, enemy.maxJumpFrames);
            return;
        }
        // Don't start a new jump while airborne (falling) or while launched by a trampoline
        if (enemy.falling || enemy.forcedJumpSpeed !== 0) {
            return;
        }

        // Interval jumping is opt-in per enemy type.
        if (!enemy.jumpIntervalEnabled) {
            return;
        }

        // Only tick the interval timer when grounded and able to jump
        enemy.jumpTimer++;
        if (enemy.jumpTimer >= jumpIntervalFrames) {
            this.initiateJump(enemy);
            enemy.jumpTimer = 0;
        }
    }

    /**
     * Apply a 1–10 jump-level to an enemy using the same jumpSpeedMapValues table
     * that the player and the enemy-attributes UI use. Prevents constructors from
     * accidentally storing a raw slider index instead of the real physics values.
     * @param {Enemy} enemy
     * @param {number} level - integer 1–10
     */
    static applyJumpLevel(enemy, level) {
        const mapped = jumpSpeedMapValues.find(v => v.sliderValue === level) || jumpSpeedMapValues[2];
        enemy.jumpSpeed = mapped.jumpSpeed;
        enemy.maxJumpFrames = mapped.maxJumpFrames;
    }
}
