class DeadEnemyHandler {

    static staticConstructor() {
        this.deadEnemies = [];
    }

    static add(enemy) {
        const dir = enemy.walkDirections && enemy.walkDirection === enemy.walkDirections.left ? -1 : 1;
        const speedY = -8;
        const speedX = dir * (1.5 + Math.random() * 1.5);
        const rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3) * Math.PI / 180;
        this.deadEnemies.push(new DeadEnemy(
            enemy.x, enemy.y, enemy.tileSize,
            enemy.spriteObject, enemy.facingDirection,
            speedX, speedY, rotationSpeed,
            enemy.drawWidth, enemy.drawHeight
        ));
    }

    static update(spriteCanvas) {
        for (let i = this.deadEnemies.length - 1; i >= 0; i--) {
            this.deadEnemies[i].update(spriteCanvas);
            if (this.deadEnemies[i].ended) {
                this.deadEnemies.splice(i, 1);
            }
        }
    }

    static reset() {
        this.deadEnemies = [];
    }
}
