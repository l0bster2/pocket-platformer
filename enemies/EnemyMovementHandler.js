/**
 * Handles movement logic for enemies
 */
class EnemyMovementHandler {
    /**
     * Execute walk handler logic
     * @param {Enemy} enemy - The enemy to update
     */
    static updateWalking(enemy) {
        enemy.walking = false;
        const newMaxSpeed = enemy.currentMaxSpeed;

        if (enemy.walkDirection === "left") {
            if (enemy.xspeed - enemy.speed > newMaxSpeed * -1) {
                enemy.xspeed -= enemy.speed;
            }
            else {
                if (enemy.swimming) {
                    enemy.xspeed = newMaxSpeed * -1;
                }
                else {
                    const restSpeed = enemy.currentMaxSpeed + enemy.xspeed;
                    if (restSpeed > 0) {
                        enemy.xspeed -= restSpeed;
                    }
                }
            }
            enemy.walking = true;
        }
        if (enemy.walkDirection === "right") {
            if (enemy.xspeed + enemy.speed < newMaxSpeed) {
                enemy.xspeed += enemy.speed;
            }
            else {
                if (enemy.swimming) {
                    enemy.xspeed = newMaxSpeed;
                }
                else {
                    const restSpeed = enemy.currentMaxSpeed - enemy.xspeed;
                    if (restSpeed > 0) {
                        enemy.xspeed += restSpeed;
                    }
                }
            }
            enemy.walking = true;
        }
    }

    /**
     * Apply gravity/fall logic
     * @param {Enemy} enemy - The enemy to update
     */
    static updateFalling(enemy) {
        if (enemy.falling && !enemy.fixedSpeed) {
            // If jump is not enforced by trampoline
            if (enemy.forcedJumpSpeed === 0) {
                enemy.yspeed += enemy.currentGravity;
            }
        }
    }

    /**
     * Correct max fall speed
     * @param {Enemy} enemy - The enemy to update
     */
    static correctMaxFallSpeed(enemy) {
        if (!enemy.falling && enemy.jumpframes === 0 && !enemy.swimming && !enemy.fixedSpeed) {
            enemy.yspeed = 0;
        }
        if (enemy.yspeed > enemy.currentMaxFallSpeed) {
            enemy.yspeed = enemy.currentMaxFallSpeed;
        }
    }

    /**
     * Slow down bonus speed X
     * @param {Enemy} enemy - The enemy to update
     */
    static slowDownBonusSpeedX(enemy) {
        enemy.bonusSpeedX *= 0.95;
        if (Math.abs(enemy.bonusSpeedX) < 0.3) {
            enemy.bonusSpeedX = 0;
        }
    }

    /**
     * Slow down bonus speed Y
     * @param {Enemy} enemy - The enemy to update
     */
    static slowDownBonusSpeedY(enemy) {
        enemy.bonusSpeedY *= 0.95;
        if (Math.abs(enemy.bonusSpeedY) < 0.3) {
            enemy.bonusSpeedY = 0;
        }
    }

    /**
     * Execute horizontal collision handling
     * @param {Enemy} enemy - The enemy that hit a wall
     */
    static handleHorizontalCollision(enemy) {
        enemy.fixedSpeed = false;
        enemy.xspeed = 0;
        if (enemy.yspeed !== 0) {
            enemy.bonusSpeedX = 0;
            enemy.bonusSpeedY = 0;
        }
        enemy.onIce = false;
    }

    /**
     * Execute vertical collision handling
     * @param {Enemy} enemy - The enemy that hit a wall
     */
    static handleVerticalCollision(enemy) {
        enemy.yspeed = 0;
        enemy.falling = false;
        enemy.wallJumpFrames = enemy.maxJumpFrames;
        enemy.fixedSpeed = false;
        enemy.bonusSpeedY = 0;
        enemy.jumpframes = 0;
        enemy.currentCoyoteJumpFrame = 0;
    }

    /**
     * Handle bottom collision (landing)
     * @param {Enemy} enemy - The enemy that landed
     * @param {boolean} onPlatform - Whether on a platform
     */
    static handleBottomCollision(enemy, onPlatform) {
        this.handleVerticalCollision(enemy);
        enemy.bonusSpeedX = 0;
        enemy.jumpframes = 0;
        if (onPlatform) {
            enemy.jumpPressedToTheMax = true;
        }
    }

    /**
     * Handle top collision
     * @param {Enemy} enemy - The enemy that hit ceiling
     */
    static handleTopCollision(enemy) {
        this.handleVerticalCollision(enemy);
        enemy.forcedJumpSpeed = 0;
        enemy.jumpframes = enemy.maxJumpFrames;
        enemy.jumpPressedToTheMax = true;
    }
}
