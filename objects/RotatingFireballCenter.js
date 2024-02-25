class RotatingFireballCenter extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.hitBoxOffset = hitBoxOffset;
        this.tilemapHandler = tilemapHandler;
        this.key = this.makeid(5);
        this.resetObject();
    }

    resetObject() {
        this.angle = 270;
    }

    collisionEvent() {
        PlayMode.playerDeath();
    }

    getAdditionalFireballPos(index) {
        var radius = index * this.tileSize;
        const radians = MathHelpers.getRadians(this.angle);
        const x = this.x + radius * Math.cos(radians);
        const y = this.y + radius * Math.sin(radians);
        return { dx: x, dy: y };
    }

    checkAdditionalFireballCollision(objectX, objectY) {
        return Collision.objectsColliding(this.tilemapHandler.player,
            {
                x: objectX,
                y: objectY,
                width: this.width,
                height: this.height,
                hitBoxOffset: this.hitBoxOffset,
            });
    }

    handleAdditionalFireball(index, spriteCanvas) {
        const { dx, dy } = this.getAdditionalFireballPos(index);

        if (Game.playMode === Game.PLAY_MODE) {

            const collidingWithPlayer = this.checkAdditionalFireballCollision(dx, dy);
            if (collidingWithPlayer && !this.tilemapHandler.player.death) {
                PlayMode.playerDeath();
            }

            if (this?.spriteObject?.[0].animation.length > 1) {
                if (this.checkFrame()) {
                    Display.drawImage(spriteCanvas, 0, this.canvasYSpritePos, this.tileSize, this.tileSize, dx, dy,
                        this.tileSize, this.tileSize);
                }
                else {
                    Display.drawImage(spriteCanvas, this.tileSize, this.canvasYSpritePos, this.tileSize, this.tileSize, dx, dy,
                        this.tileSize, this.tileSize);
                }
            }
            else {
                Display.drawImage(spriteCanvas, 0, this.canvasYSpritePos, this.tileSize, this.tileSize, dx, dy,
                    this.tileSize, this.tileSize);
            }
        }
        else {
            Display.drawImageWithAlpha(spriteCanvas, 0, this.canvasYSpritePos, this.tileSize, this.tileSize, dx, dy,
                this.tileSize, this.tileSize, 0.2);
        }
    }

    draw(spriteCanvas) {    
        if (Game.playMode === Game.BUILD_MODE) {
            this.angle = 270;
        }
        else {
            // Reset the angle after 360 degree turn
            this.angle = MathHelpers.normalizeAngle(this.angle);
            this.angle += this.movementDirection === AnimationHelper.possibleDirections.forwards ? this.speed : this.speed * -1;
        }
        for (var i = 1; i < this.fireBallsAmount; i++) {
            this.handleAdditionalFireball(i, spriteCanvas);
        }
        super.draw(spriteCanvas);
    }
}