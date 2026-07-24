class DeadEnemy {
    constructor(x, y, tileSize, spriteObject, facingDirection, speedX, speedY, rotationSpeed) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.spriteObject = spriteObject;
        this.facingDirection = facingDirection;
        this.currentSpriteIndex = 0;
        this.speedX = speedX;
        this.speedY = speedY;
        this.angle = 0;
        this.rotationSpeed = rotationSpeed;
        this.ended = false;
    }

    update(spriteCanvas) {
        this.speedY += 0.35;
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.rotationSpeed;

        const margin = this.tileSize * 3;
        if (this.y > Camera.viewport.top + Camera.viewport.height + margin
            || this.y < Camera.viewport.top - margin
            || this.x > Camera.viewport.left + Camera.viewport.width + margin
            || this.x < Camera.viewport.left - margin) {
            this.ended = true;
            return;
        }

        EnemyAnimationHelper.renderWithRotation(this, spriteCanvas, this.angle);
    }
}
