/**
 * Handles movement logic for enemies
 */
class EnemyMovementHandler {
    /**
     * Decide the enemy's walkDirection for this frame based on its configured movement
     * behaviour. "Starts moving" modes are left untouched (their direction is set on spawn and
     * flipped by wall collisions); the other modes actively steer the enemy each frame.
     * @param {Enemy} enemy - The enemy to update
     */
    static updateWalkDirection(enemy) {
        const behaviours = enemy.movementBehaviours;
        const directions = enemy.walkDirections;

        switch (enemy.movementBehaviour) {
            case behaviours.towardsPlayer: {
                // Only steer while grounded so mid-air direction is preserved during jumps.
                if (!enemy.jumping && !enemy.falling) {
                    const towards = this.getDirectionTowardsPlayer(enemy);
                    if (towards) enemy.walkDirection = towards;
                }
                break;
            }
            case behaviours.awayFromPlayer: {
                // Only steer while grounded so mid-air direction is preserved during jumps.
                if (!enemy.jumping && !enemy.falling) {
                    const towards = this.getDirectionTowardsPlayer(enemy);
                    if (towards) {
                        enemy.walkDirection = towards === directions.left ? directions.right : directions.left;
                    }
                }
                break;
            }
            case behaviours.patrol:
                this.updateTimedReversal(enemy, enemy.patrolDuration);
                break;
            case behaviours.random:
                this.updateRandomDirection(enemy, enemy.randomDuration);
                break;
            case behaviours.standStill:
                enemy.walkDirection = directions.none;
                break;
            // startMovingLeft / startMovingRight: direction is set on spawn and reversed by
            // wall collisions, so nothing to do here.
            default:
                break;
        }
    }

    /**
     * Horizontal direction from the enemy towards the player, or null if no player exists.
     * @private
     */
    static getDirectionTowardsPlayer(enemy) {
        if (!PlayMode.player) return null;
        return PlayMode.player.x < enemy.x ? enemy.walkDirections.left : enemy.walkDirections.right;
    }

    /**
     * Patrol: walk in one direction for `durationSeconds`, then flip and repeat.
     * @private
     */
    static updateTimedReversal(enemy, durationSeconds) {
        if (enemy.walkDirection === enemy.walkDirections.none) {
            enemy.walkDirection = enemy.walkDirections.left;
        }
        enemy.movementTimer++;
        if (enemy.movementTimer >= durationSeconds * 60) {
            enemy.movementTimer = 0;
            enemy.walkDirection = enemy.walkDirection === enemy.walkDirections.left
                ? enemy.walkDirections.right
                : enemy.walkDirections.left;
        }
    }

    /**
     * Random: every `durationSeconds` pick a new random left/right direction.
     * @private
     */
    static updateRandomDirection(enemy, durationSeconds) {
        if (enemy.walkDirection === enemy.walkDirections.none) {
            enemy.walkDirection = Math.random() < 0.5 ? enemy.walkDirections.left : enemy.walkDirections.right;
        }
        enemy.movementTimer++;
        if (enemy.movementTimer >= durationSeconds * 60) {
            enemy.movementTimer = 0;
            enemy.walkDirection = Math.random() < 0.5 ? enemy.walkDirections.left : enemy.walkDirections.right;
        }
    }

    /**
     * React to a gap ahead (one foot over an empty tile, the other on ground) according to the
     * enemy's configured gapBehaviour: turn around, jump across, or keep walking (fall off).
     * Only acts on the leading foot so the enemy doesn't jitter while straddling the edge.
     * @param {Enemy} enemy - The enemy to update
     */
    static handleGap(enemy) {
        if (enemy.flying) return;
        if (enemy.gapBehaviour === enemy.gapBehaviours.continueWalking) return;
        if (enemy.falling || enemy.jumping) return;
        if (enemy.walkDirection === enemy.walkDirections.none) return;

        const tmh = tileMapHandler;
        const footRow = tmh.getTileValueForPosition(enemy.y + enemy.height + 1);
        if (footRow < 0 || footRow >= tmh.levelHeight) return;

        const leftCol = tmh.getTileValueForPosition(enemy.x);
        const rightCol = tmh.getTileValueForPosition(enemy.x + enemy.width);
        const leftEmpty = tmh.tileMap[footRow][leftCol] === 0;
        const rightEmpty = tmh.tileMap[footRow][rightCol] === 0;

        // Only a gap when exactly one foot is over an empty tile.
        if (leftEmpty === rightEmpty) return;

        const movingRightIntoGap = enemy.walkDirection === enemy.walkDirections.right && rightEmpty;
        const movingLeftIntoGap = enemy.walkDirection === enemy.walkDirections.left && leftEmpty;
        if (!movingRightIntoGap && !movingLeftIntoGap) return;

        if (enemy.gapBehaviour === enemy.gapBehaviours.changeDirection) {
            enemy.walkDirection = movingRightIntoGap ? enemy.walkDirections.left : enemy.walkDirections.right;
        } else if (enemy.gapBehaviour === enemy.gapBehaviours.jump) {
            EnemyJumpHandler.initiateJump(enemy);
        }
    }

    /**
     * Execute walk handler logic
     * @param {Enemy} enemy - The enemy to update
     */
    static updateWalking(enemy) {
        this.updateWalkDirection(enemy);
        this.handleGap(enemy);
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
        if (enemy.flying) {
            // Flying enemies hover: no gravity is applied.
            enemy.yspeed = 0;
            enemy.falling = false;
            return;
        }
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
