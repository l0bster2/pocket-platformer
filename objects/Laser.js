class Laser extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, facingDirection, lifeTime, pauseTime, laserId) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, { currentFacingDirection: facingDirection });
        this.tileMapHandler = tileMapHandler;
        this.currentLifeTime = lifeTime;
        this.totalLifeTime = lifeTime;
        this.pauseTime = pauseTime;
        this.laserId = laserId;
        this.blinkingAllowed = this.totalLifeTime > 10 && this.pauseTime > 0;
        this.key = TilemapHelpers.makeid(5);
    }

    collisionEvent() {
        PlayMode.playerDeath();
    }

    draw() {
        this.currentLifeTime--;
        const blinking = this.blinkingAllowed && this.currentLifeTime < 20 && this.currentLifeTime % 10 > 7;
        !blinking && super.draw(spriteCanvas);

        if(this.currentLifeTime === 0) {
            this.deleteObjectFromLevel(this.tileMapHandler, false);
        }
    }
}