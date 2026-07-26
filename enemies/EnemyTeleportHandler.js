/**
 * Handles the teleport behaviour for enemies.
 *
 * When enabled, the enemy teleports every `teleportInterval` seconds. The
 * teleport plays through three phases:
 *   1. 'disappearing' — enemy shrinks to nothing while rotating.
 *   2. position swap  — enemy is invisible; a new tile position is chosen.
 *   3. 'reappearing'  — enemy grows back to full size while rotating.
 *
 * All runtime state lives on the enemy object so it is reset automatically
 * when the enemy is re-initialised.
 */
class EnemyTeleportHandler {

    static DISAPPEAR_FRAMES = 30;
    static REAPPEAR_FRAMES  = 30;
    static MAX_FIND_ATTEMPTS = 50;

    /**
     * Call this every active frame from Enemy.draw.
     * Manages the teleport timer and the three animation phases.
     */
    static updateTeleport(enemy) {
        if (!enemy.teleportEnabled) return;

        // ── idle: count down to next teleport ──────────────────────────────
        if (!enemy.teleportPhase) {
            enemy.teleportTimer++;
            if (enemy.teleportTimer >= Math.round(enemy.teleportInterval * 60)) {
                enemy.teleportTimer   = 0;
                enemy.teleportPhase   = 'disappearing';
                enemy.teleportAnimFrame = 0;
            }
            return;
        }

        // ── disappearing: shrink + spin ────────────────────────────────────
        if (enemy.teleportPhase === 'disappearing') {
            enemy.teleportAnimFrame++;
            const t = enemy.teleportAnimFrame / this.DISAPPEAR_FRAMES;
            enemy.teleportScale    = Math.max(0, 1 - t);
            enemy.teleportRotation = t * Math.PI * 2;

            if (enemy.teleportAnimFrame >= this.DISAPPEAR_FRAMES) {
                enemy.teleportScale = 0;
                // Move to the new position while invisible
                const newPos = this.findNewPosition(enemy);
                if (newPos) {
                    enemy.x = newPos.x * enemy.tileSize;
                    enemy.y = newPos.y * enemy.tileSize;
                    // Reset velocity so the enemy doesn't drift after teleporting
                    enemy.xspeed = 0;
                    enemy.yspeed = 0;
                }
                enemy.teleportPhase    = 'reappearing';
                enemy.teleportAnimFrame = 0;
            }
            return;
        }

        // ── reappearing: grow + spin ───────────────────────────────────────
        if (enemy.teleportPhase === 'reappearing') {
            enemy.teleportAnimFrame++;
            const t = enemy.teleportAnimFrame / this.REAPPEAR_FRAMES;
            enemy.teleportScale    = Math.min(1, t);
            enemy.teleportRotation = (1 - t) * Math.PI * 2;

            if (enemy.teleportAnimFrame >= this.REAPPEAR_FRAMES) {
                enemy.teleportScale    = 1;
                enemy.teleportRotation = 0;
                enemy.teleportPhase    = null;
                enemy.teleportAnimFrame = 0;
            }
        }
    }

    /**
     * Pick a random tile-aligned position within [minDist, maxDist] tiles of the
     * enemy's current tile position that is not occupied by a solid tile or a
     * level object.
     *
     * Returns { x, y } (tile indices) or null when no free position is found.
     */
    static findNewPosition(enemy) {
        const maxDist    = enemy.teleportMaxDistance ?? 5;
        const minDist    = Math.max(1, Math.ceil(maxDist * 0.5));
        const currentTileX = Math.floor(enemy.x / enemy.tileSize);
        const currentTileY = Math.floor(enemy.y / enemy.tileSize);

        for (let attempt = 0; attempt < this.MAX_FIND_ATTEMPTS; attempt++) {
            const angle    = Math.random() * Math.PI * 2;
            const dist     = minDist + Math.random() * (maxDist - minDist);
            const newTileX = Math.round(currentTileX + Math.cos(angle) * dist);
            const newTileY = Math.round(currentTileY + Math.sin(angle) * dist);

            if (this.isPositionFree(newTileX, newTileY)) {
                return { x: newTileX, y: newTileY };
            }
        }
        return null; // stay in place this time
    }

    /**
     * Return true when the given tile grid position is within the level bounds,
     * free of solid tiles and not occupied by any level object.
     */
    static isPositionFree(tileX, tileY) {
        if (tileX < 0 || tileY < 0 ||
            tileX >= tileMapHandler.levelWidth ||
            tileY >= tileMapHandler.levelHeight) {
            return false;
        }
        if (tileMapHandler.tileMap[tileY][tileX] !== 0) return false;
        return !tileMapHandler.levelObjects.some(obj =>
            obj.initialX === tileX && obj.initialY === tileY
        );
    }
}
