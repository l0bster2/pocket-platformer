class EnemySpawner extends InteractiveLevelObject {

    static INITIAL_PAUSE_FRAMES = 40;

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.tileMapHandler = tilemapHandler;
        this.key = this.makeid(5);
        this.resetObject();
    }

    resetObject() {
        this.spawnTimer = 0;
        this.spawnedCount = 0;
        this.spawnedEnemies = [];
        this.finished = false;
        this.removing = false;
        this.removeScale = 1;
        this.hidden = false;
    }

    // Enabled enemy types fall back to the first available type if none are stored.
    getEnabledEnemyTypes() {
        const allTypes = EnemyTypeAttributesHandler.getAllEnemyTypes();
        const enabled = Array.isArray(this.enabledEnemyTypes)
            ? this.enabledEnemyTypes.filter(type => allTypes.includes(type))
            : [];
        return enabled.length ? enabled : [allTypes[0]];
    }

    getIntervalFrames() {
        const seconds = this.spawnInterval || 2;
        return Math.round(seconds * 60);
    }

    getEnemyAmount() {
        return Math.max(1, parseInt(this.enemyAmount) || 1);
    }

    spawnEnemy() {
        const enabledTypes = this.getEnabledEnemyTypes();
        const type = enabledTypes[Math.floor(Math.random() * enabledTypes.length)];
        const EnemyClass = ObjectTypes.objectToClass[type];
        if (!EnemyClass) return;
        const enemy = new EnemyClass(this.initialX, this.initialY, this.tileSize, type, this.tileMapHandler, {});
        EnemyTypeAttributesHandler.applyToInstance(enemy);
        this.tileMapHandler.enemies.push(enemy);
        this.spawnedEnemies.push(enemy);
        this.spawnedCount++;
        AnimationHelper.setSquishValues(this, this.tileSize * 1.3, this.tileSize * 0.7, 6);
    }

    countAliveSpawned() {
        this.spawnedEnemies = this.spawnedEnemies.filter(enemy => !enemy.dead);
        return this.spawnedEnemies.length;
    }

    updateSpawning() {
        if (this.removing) {
            this.removeScale -= 0.06;
            // Stay in the level (just hidden) so resetObject can fully restore it on respawn.
            if (this.removeScale <= 0) {
                this.removing = false;
                this.hidden = true;
            }
            return;
        }
        if (this.finished) return;

        this.spawnTimer++;
        // The very first spawn uses a short fixed pause; later spawns use the configured interval.
        const threshold = this.spawnedCount === 0 ? EnemySpawner.INITIAL_PAUSE_FRAMES : this.getIntervalFrames();
        if (this.spawnTimer < threshold) return;

        const amount = this.getEnemyAmount();

        if (this.spawnMode === 'infinite') {
            // Keep the population topped up to the target amount, one spawn per interval.
            if (this.countAliveSpawned() < amount) {
                this.spawnEnemy();
                this.spawnTimer = 0;
            }
        } else {
            this.spawnEnemy();
            this.spawnTimer = 0;
            if (this.spawnedCount >= amount) {
                this.finished = true;
                this.removing = true;
            }
        }
    }

    draw(spriteCanvas) {
        if (Game.playMode === Game.PLAY_MODE) {
            if (this.hidden) return;
            this.updateSpawning();
            // updateSpawning may hide the object on the last shrink frame; skip the full-size draw then.
            if (this.hidden) return;
            if (this.removing) {
                this.drawShrinking(spriteCanvas);
                return;
            }
        }
        super.drawWithSquishing(spriteCanvas);
    }

    drawShrinking(spriteCanvas) {
        const size = this.tileSize * Math.max(0, this.removeScale);
        const offset = (this.tileSize - size) / 2;
        Display.drawImage(spriteCanvas, this.canvasXSpritePos, this.canvasYSpritePos,
            this.tileSize, this.tileSize, this.x + offset, this.y + offset, size, size);
    }
}
