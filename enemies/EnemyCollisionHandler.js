/**
 * Handles collision detection for enemies against hazards and the player.
 */
class EnemyCollisionHandler {
    /**
     * Check collisions with interactive hazard objects (water, spikes, trampolines, portals, etc.)
     * @param {Enemy} enemy - The enemy to check
     */
    static checkHazardCollisions(enemy) {
        let touchingWater = false;
        tileMapHandler.levelObjects.forEach(levelObject => {
            if (enemy.interativeObjects.includes(levelObject.type)) {
                if (levelObject.colissionFunction(enemy, levelObject)) {
                    if (levelObject.type === ObjectTypes.WATER) {
                        touchingWater = true;
                    }
                    levelObject.collisionEvent(enemy);
                }
            }
        });

        if (enemy.swimming && !touchingWater) {
            enemy.swimming = false;
            enemy.currentGravity = enemy.gravity;
            enemy.currentMaxFallSpeed = enemy.maxFallSpeed;
        }
    }

    /**
     * Check collision with the player: stomping (player lands on top) or damaging the player.
     * @param {Enemy} enemy - The enemy to check
     */
    static checkPlayerCollision(enemy) {
        if (Game.playMode !== Game.PLAY_MODE) {
            return;
        }
        const player = tileMapHandler.player;
        if (!player || player.death) {
            return;
        }
        if (!Collision.objectsColliding(player, enemy)) {
            return;
        }

        const playerFalling = player.yspeed > 0 || player.bonusSpeedY > 0;
        const playerAboveEnemy = player.bottom_left_pos.y < enemy.y + tileMapHandler.halfTileSize;

        if (enemy.canBeStomped && playerFalling && playerAboveEnemy) {
            this.getStomped(enemy, player);
        } else if (enemy.killsPlayer) {
            PlayMode.playerDeath();
        }
    }

    /**
     * Player jumped on top of the enemy: lose a life (die at 0) and bounce the player.
     * @param {Enemy} enemy - The enemy that got stomped
     * @param {Player} player - The player that stomped the enemy
     */
    static getStomped(enemy, player) {
        // small forced jump for the player, similar to a normal jump
        player.setStretchAnimation();
        player.forcedJumpSpeed = player.jumpSpeed;
        player.jumpframes = 0;
        player.fixedSpeed = false;
        player.temporaryDoubleJump = false;
        player.doubleJumpUsed = false;
        player.currentDashFrame = 0;

        enemy.lives -= 1;
        if (enemy.lives <= 0) {
            enemy.death();
        } else {
            AnimationHelper.setSquishValues(enemy, (enemy.width + enemy.widthOffset) * 1.2, (enemy.height + enemy.heightOffset) * 0.6);
            SFXHandler.createSFX(enemy.x, enemy.y, 1);
        }
    }
}
