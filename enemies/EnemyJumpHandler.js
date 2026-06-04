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
        if (!enemy.jumping && !enemy.falling) {
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
        // Increment jump timer
        if (enemy.jumpTimer === undefined) {
            enemy.jumpTimer = 0;
        }
        enemy.jumpTimer++;

        // Initiate jump at interval
        if (enemy.jumpTimer >= jumpIntervalFrames) {
            this.initiateJump(enemy);
            enemy.jumpTimer = 0;
        }

        // Perform forced jump if on trampoline
        if (enemy.forcedJumpSpeed !== 0 && enemy.jumping) {
            this.performJump(enemy, enemy.forcedJumpSpeed, enemy.maxJumpFrames + Math.round(enemy.maxJumpFrames / 6));
        }
        // Perform normal jump if currently jumping
        else if (enemy.jumping) {
            this.performJump(enemy, enemy.jumpSpeed, enemy.maxJumpFrames);
        }
    }
}
