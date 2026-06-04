/**
 * Handles activation/deactivation logic for enemies
 */
class EnemyActivationHandler {
    /**
     * Check if enemy should be activated
     * @param {Enemy} enemy - The enemy to check
     * @param {Object} activationConfig - Configuration for activation conditions
     * @returns {boolean} - Whether the enemy should be active
     */
    static shouldActivate(enemy, activationConfig) {
        if (!activationConfig) return true;

        const { type, value } = activationConfig;

        switch (type) {
            case 'alwaysActive':
                return true;

            case 'afterSeconds':
                if (!enemy.activationTimer) enemy.activationTimer = 0;
                enemy.activationTimer++;
                return enemy.activationTimer >= value * 60; // Convert seconds to frames

            case 'playerInDistance':
                return this.isPlayerInDistance(enemy, value);

            case 'canSeePlayer':
                return this.canEnemySeePlayer(enemy);

            case 'playerApproxSameX':
                return this.isPlayerApproximatelySameX(enemy, value);

            case 'playerApproxSameY':
                return this.isPlayerApproximatelySameY(enemy, value);

            default:
                return true;
        }
    }

    /**
     * Check if enemy should become inactive
     * @param {Enemy} enemy - The enemy to check
     * @param {Object} inactivationConfig - Configuration for inactivation conditions
     * @returns {boolean} - Whether the enemy should become inactive
     */
    static shouldDeactivate(enemy, inactivationConfig) {
        if (!inactivationConfig) return false;

        const { type, value } = inactivationConfig;

        switch (type) {
            case 'becomesInactive':
                return true;

            case 'neverInactive':
                return false;

            case 'afterSeconds':
                if (!enemy.inactivationTimer) enemy.inactivationTimer = 0;
                enemy.inactivationTimer++;
                return enemy.inactivationTimer >= value * 60; // Convert seconds to frames

            case 'playerFurtherThanDistance':
                return !this.isPlayerInDistance(enemy, value);

            case 'notSeeingPlayer':
                return !this.canEnemySeePlayer(enemy);

            case 'playerNotApproxSameX':
                return !this.isPlayerApproximatelySameX(enemy, value);

            case 'playerNotApproxSameY':
                return !this.isPlayerApproximatelySameY(enemy, value);

            default:
                return false;
        }
    }

    /**
     * Check if player is within distance
     * @private
     */
    static isPlayerInDistance(enemy, distance) {
        if (!PlayMode.player) return false;

        const dx = PlayMode.player.x - enemy.x;
        const dy = PlayMode.player.y - enemy.y;
        const distanceSquared = dx * dx + dy * dy;
        const maxDistance = distance * enemy.tileSize;

        return distanceSquared <= maxDistance * maxDistance;
    }

    /**
     * Check if enemy can see player (line of sight)
     * @private
     */
    static canEnemySeePlayer(enemy) {
        if (!PlayMode.player || !tileMapHandler) return false;

        return TilemapHelpers.doTwoObjectsSeeEachOther(enemy, PlayMode.player, tileMapHandler);
    }

    /**
     * Check if player is approximately on same X axis as enemy (within buffer)
     * @private
     */
    static isPlayerApproximatelySameX(enemy, bufferTiles = 1) {
        if (!PlayMode.player) return false;

        const buffer = bufferTiles * enemy.tileSize;
        const dx = Math.abs(PlayMode.player.x - enemy.x);

        return dx <= buffer;
    }

    /**
     * Check if player is approximately on same Y axis as enemy (within buffer)
     * @private
     */
    static isPlayerApproximatelySameY(enemy, bufferTiles = 1) {
        if (!PlayMode.player) return false;

        const buffer = bufferTiles * enemy.tileSize;
        const dy = Math.abs(PlayMode.player.y - enemy.y);

        return dy <= buffer;
    }

    /**
     * Reset activation timers when state changes
     */
    static resetTimers(enemy) {
        enemy.activationTimer = 0;
        enemy.inactivationTimer = 0;
    }
}
