/**
 * Runtime attack logic for enemies. Reads the `attackPhases` configuration (built in the enemy
 * editor by EnemyAttackRenderer) and actually spawns bullets while the enemy is active.
 *
 * Phases run SEQUENTIALLY: only the current phase shoots. A phase:
 *   1. waits `startDelay` seconds before its interval loop begins,
 *   2. fires a volley (all of its bullets) every `interval` seconds,
 *   3. when ammo is finite, reloads for `reloadTime` seconds after `ammo` volleys.
 *
 * With 2+ phases the enemy advances to the next phase (wrapping back to the first) according to
 * its `phaseChangeMode` / `phaseChangeValue`:
 *   'intervals' — after firing that many volleys in the current phase,
 *   'seconds'   — after that many seconds in the current phase,
 *   'hits'      — after being hit that many times while in the current phase.
 *
 * Per-enemy runtime state lives on `enemy.attackState` and is reset whenever the enemy is
 * inactive, so the start delay is honoured again on the next activation.
 */
class EnemyAttackHandler {

    static FPS = 60;

    static resetState(enemy) {
        enemy.attackState = null;
    }

    static ensureState(enemy) {
        if (!enemy.attackState) {
            enemy.attackState = {
                currentPhaseIndex: 0,
                phaseElapsedFrames: 0,
                phaseVolleys: 0,
                hitsBaseline: enemy.phaseHitsTaken || 0,
                phases: {},
            };
        }
        return enemy.attackState;
    }

    static getPhaseState(state, phase) {
        if (!state.phases[phase.id]) {
            state.phases[phase.id] = {
                delayElapsed: false,
                delayTimer: 0,
                intervalTimer: 0,
                shotsFired: 0,
                reloading: false,
                reloadTimer: 0,
            };
        }
        return state.phases[phase.id];
    }

    /**
     * Called every frame from Enemy.draw while the enemy is active (play mode only).
     */
    static updateAttack(enemy) {
        const phases = enemy.attackPhases;
        if (!Array.isArray(phases) || phases.length === 0) return;
        const state = this.ensureState(enemy);

        if (state.currentPhaseIndex >= phases.length) state.currentPhaseIndex = 0;
        const phase = phases[state.currentPhaseIndex];

        const firedVolley = this.updatePhase(enemy, phase, this.getPhaseState(state, phase));
        if (firedVolley) state.phaseVolleys++;
        state.phaseElapsedFrames++;

        // Only ever switch phases when there is more than one to switch between.
        if (phases.length > 1 && this.shouldAdvancePhase(enemy, state)) {
            this.advancePhase(enemy, state, phases);
        }
    }

    /**
     * Decide whether the current phase's switch condition has been met.
     */
    static shouldAdvancePhase(enemy, state) {
        const mode = enemy.phaseChangeMode || 'intervals';
        const value = enemy.phaseChangeValue ?? 1;
        switch (mode) {
            case 'seconds':
                return state.phaseElapsedFrames >= value * this.FPS;
            case 'hits':
                return (enemy.phaseHitsTaken || 0) - state.hitsBaseline >= value;
            case 'intervals':
            default:
                return state.phaseVolleys >= value;
        }
    }

    /**
     * Move to the next phase (wrapping around) and reset the per-phase / progress counters so the
     * new phase starts fresh (honouring its own start delay again).
     */
    static advancePhase(enemy, state, phases) {
        const leavingPhase = phases[state.currentPhaseIndex];
        delete state.phases[leavingPhase.id];
        state.currentPhaseIndex = (state.currentPhaseIndex + 1) % phases.length;
        state.phaseElapsedFrames = 0;
        state.phaseVolleys = 0;
        state.hitsBaseline = enemy.phaseHitsTaken || 0;
    }

    /**
     * Advance a single phase by one frame. Returns true on the frame it fires a volley.
     */
    static updatePhase(enemy, phase, state) {
        if (!phase.bullets || phase.bullets.length === 0) return false;

        // Initial start delay before the phase's interval loop starts.
        if (!state.delayElapsed) {
            state.delayTimer++;
            if (state.delayTimer >= (phase.startDelay || 0) * this.FPS) {
                state.delayElapsed = true;
                state.intervalTimer = 0;
            }
            return false;
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
            return false;
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
            return true;
        }
        return false;
    }

    static fireVolley(enemy, phase) {
        SoundHandler[enemy.shootSound || 'gun2'].stopAndPlay();
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
            } else if (bulletConfig.shootInWalkDirection && enemy.walkDirections &&
                       enemy.walkDirection === enemy.walkDirections.right) {
                // The stored angle uses the left-walking direction as its base (matching the UI's
                // left-hemisphere constraint); mirror it when the enemy is walking right.
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
            deceleration: bulletConfig.deceleration ?? 0,
        });
        tileMapHandler.levelObjects.push(bullet);
    }
}
