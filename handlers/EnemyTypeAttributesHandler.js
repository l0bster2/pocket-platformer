/**
 * Stores and manages editable enemy attributes per enemy TYPE (e.g. ENEMY_1, ENEMY_2)
 * instead of per instance.
 *
 * - Defaults are seeded from the enemy class itself (via getEditableAttributes()), so each
 *   enemy type keeps its own distinct default attributes.
 * - Changes are stored persistently on WorldDataHandler.enemyTypeAttributes and applied live
 *   to every enemy of that type currently in the level.
 * - The store is exported/imported together with the rest of the game data.
 */
class EnemyTypeAttributesHandler {

    /**
     * Get all enemy types that exist in the game (independent of the current level),
     * derived from the class registry. Any class extending Enemy counts as an enemy type.
     */
    static getAllEnemyTypes() {
        return Object.keys(ObjectTypes.objectToClass).filter(type => {
            const EnemyClass = ObjectTypes.objectToClass[type];
            return EnemyClass && EnemyClass.prototype instanceof Enemy;
        });
    }

    /**
     * Create a throwaway enemy instance of a type (used for default seeding and sprite preview).
     */
    static createTempInstance(type) {
        const EnemyClass = ObjectTypes.objectToClass[type];
        if (!EnemyClass) return null;
        return new EnemyClass(0, 0, WorldDataHandler.tileSize, type, tileMapHandler, {});
    }

    /**
     * Build the default attributes for a type by instantiating a throwaway enemy and reading
     * its editable attributes. This keeps a single source of truth (the class constructor).
     */
    static getDefaultsForType(type) {
        const tempEnemy = this.createTempInstance(type);
        return tempEnemy ? tempEnemy.getEditableAttributes() : {};
    }

    /**
     * Get the (lazily seeded) attribute object for a type.
     */
    static getAttributes(type) {
        if (!WorldDataHandler.enemyTypeAttributes) {
            WorldDataHandler.enemyTypeAttributes = {};
        }
        if (!WorldDataHandler.enemyTypeAttributes[type]) {
            WorldDataHandler.enemyTypeAttributes[type] = this.getDefaultsForType(type);
        }
        return WorldDataHandler.enemyTypeAttributes[type];
    }

    /**
     * Set a single attribute for a type and apply it live to all matching enemies.
     */
    static setAttribute(type, name, value) {
        const attributes = this.getAttributes(type);
        attributes[name] = value;
        this.applyToLevel(type);
    }

    /**
     * Apply the stored attributes of a type to every enemy of that type in the current level.
     */
    static applyToLevel(type) {
        if (!tileMapHandler || !tileMapHandler.enemies) return;
        const attributes = this.getAttributes(type);
        tileMapHandler.enemies
            .filter(enemy => enemy.type === type)
            .forEach(enemy => enemy.setEditableAttributes(attributes));
    }

    /**
     * Apply the stored attributes for the enemy's type to a single (e.g. freshly spawned) enemy.
     */
    static applyToInstance(enemy) {
        if (!enemy) return;
        enemy.setEditableAttributes(this.getAttributes(enemy.type));
    }
}
