/**
 * Runtime attack logic for enemies. Reads the `attackPhases` configuration (built in the enemy
 * editor by EnemyAttackRenderer) and actually spawns bullets while the enemy is active.
 *
 * Each phase runs independently and concurrently. A phase:
 *   1. waits `startDelay` seconds before its interval loop begins,
 *   2. fires a volley (all of its bullets) every `interval` seconds,
 *   3. when ammo is finite, reloads for `reloadTime` seconds after `ammo` volleys.
 *
 * Per-enemy runtime state lives on `enemy.attackState` (keyed by phase id) and is reset whenever
 * the enemy is inactive, so the start delay is honoured again on the next activation.
 */
class EnemyAttackHandler {

    static FPS = 60;

    static resetState(enemy) {
        enemy.attackState = null;
    }

    static getPhaseState(enemy, phase) {
        if (!enemy.attackState) enemy.attackState = {};
        if (!enemy.attackState[phase.id]) {
            enemy.attackState[phase.id] = {
                delayElapsed: false,
                delayTimer: 0,
                intervalTimer: 0,
                shotsFired: 0,
                reloading: false,
                reloadTimer: 0,
            };
        }
        return enemy.attackState[phase.id];
    }

    /**
     * Called every frame from Enemy.draw while the enemy is active (play mode only).
     */
    static updateAttack(enemy) {
        const phases = enemy.attackPhases;
        if (!Array.isArray(phases) || phases.length === 0) return;
        phases.forEach(phase => this.updatePhase(enemy, phase));
    }

    static updatePhase(enemy, phase) {
        if (!phase.bullets || phase.bullets.length === 0) return;
        const state = this.getPhaseState(enemy, phase);

        // Initial start delay before the phase's interval loop starts.
        if (!state.delayElapsed) {
            state.delayTimer++;
            if (state.delayTimer >= (phase.startDelay || 0) * this.FPS) {
                state.delayElapsed = true;
                state.intervalTimer = 0;
            }
            return;
        }

        // Reloading pause after the ammo is spent (only when ammo is finite).
        if (state.reloading) {
            state.reloadTimer++;
            if (state.reloadTimer >= (phase.reloadTime || 0) * this.FPS) {
                state.reloading = false;
                state.reloadTimer = 0;
                state.shotsFired = 0;
                state.intervalTimer = 0;
            }
            return;
        }

        // Interval countdown between volleys.
        state.intervalTimer++;
        const intervalFrames = Math.max(1, Math.round((phase.interval || 1) * this.FPS));
        if (state.intervalTimer >= intervalFrames) {
            state.intervalTimer = 0;
            this.fireVolley(enemy, phase);
            if (!phase.infiniteAmmo) {
                state.shotsFired++;
                if (state.shotsFired >= (phase.ammo || 1)) {
                    state.reloading = true;
                    state.reloadTimer = 0;
                }
            }
        }
    }

    static fireVolley(enemy, phase) {
        phase.bullets.forEach(bulletConfig => this.spawnBullet(enemy, bulletConfig));
    }

    static spawnBullet(enemy, bulletConfig) {
        if (typeof tileMapHandler === 'undefined' || !tileMapHandler) return;
        const tileSize = enemy.tileSize;

        // Determine the base direction.
        let baseAngle = bulletConfig.angle ?? 0;
        if (PlayMode.player) {
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const playerCenterX = PlayMode.player.x + PlayMode.player.width / 2;
            const playerCenterY = PlayMode.player.y + PlayMode.player.height / 2;

            if (bulletConfig.shootDirectlyAtPlayer) {
                // Aim the bullet straight at the player.
                baseAngle = Math.atan2(playerCenterY - enemyCenterY, playerCenterX - enemyCenterX) * 180 / Math.PI;
            } else if (bulletConfig.shootInPlayerDirection && playerCenterX > enemyCenterX) {
                // The configured angle assumes the player is to the left; mirror it
                // horizontally when the player is on the enemy's right side.
                baseAngle = ((180 - baseAngle) % 360 + 360) % 360;
            }
        }

        // Apply a random spread centered on the base angle (offset = total spread width in degrees).
        const offset = bulletConfig.randomAngleOffset || 0;
        const finalAngle = baseAngle + (Math.random() - 0.5) * offset;

        // Bullet expects tile coordinates (it multiplies by tileSize internally).
        const spawnTileX = enemy.x / tileSize;
        const spawnTileY = enemy.y / tileSize;

        const bullet = new Bullet(spawnTileX, spawnTileY, tileSize, ObjectTypes.BULLET, tileMapHandler, {
            isGood: false,
            speed: bulletConfig.speed ?? 3,
            angle: finalAngle,
            collidesWithWalls: bulletConfig.collidesWithWalls ?? true,
            affectedByGravity: bulletConfig.affectedByGravity ?? false,
            gravity: bulletConfig.gravity ?? 0.2,
            spriteDescriptiveName: bulletConfig.spriteDescriptiveName,
        });
        tileMapHandler.levelObjects.push(bullet);
    }
}
