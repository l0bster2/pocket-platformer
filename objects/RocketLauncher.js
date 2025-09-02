class RocketLauncher extends ShootingObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        this.getShootFrames();
        this.resetObject();
        const angle = this.tileMapHandlerplayer ? MathHelpers.getAngle(this.tileMapHandlerplayer.x, this.tileMapHandler.player.y, this.x, this.y) : 0;
        this.seeingPlayer = TilemapHelpers.doTwoObjectsSeeEachOther(this, player, this.tileMapHandler, angle);
        if(typeof this[SpritePixelArrays.changeableAttributeTypes.collidesWithWalls] === 'undefined') {
            this.collidesWithWalls = true;
        }
    }

    resetObject() {
        this.currentShootCounter = 0;
        this.currentShootCounterWhileInactive = this.shootFrames[0];
        this.active = false;
    }

    collisionEvent() {
    }

    draw(spriteCanvas) {
        if (Game.playMode === Game.PLAY_MODE) {
            const angle = this.tileMapHandler.player ? MathHelpers.getAngle(this.tileMapHandler.player.x, this.tileMapHandler.player.y, this.x, this.y) : 0;
            //Check if rocket launcher sees player only every x frames because it's cost-intensive
            if(this.tileMapHandler?.currentGeneralFrameCounter % 6 === 0) {
                this.seeingPlayer = !this[SpritePixelArrays.changeableAttributeTypes.collidesWithWalls] ? true :
                    TilemapHelpers.doTwoObjectsSeeEachOther(this, player, this.tileMapHandler, angle);
            }

            if (this.active) {
                this.currentShootCounter++;
                if(!this.seeingPlayer) {
                    this.active = false;
                    if (this.currentShootCounterWhileInactive === this.shootFrames[0]) {
                        this.currentShootCounterWhileInactive = 0;
                    }
                }
                if (this.currentShootCounter === this.shootFrames[0]) {
                    this.currentShootCounter = 0;
                    this.shoot(angle);
                }
            }
            else {
                if (this.seeingPlayer) {
                    this.active = true;
                    this.currentShootCounter = 0;
                    if (this.currentShootCounterWhileInactive === this.shootFrames[0]) {
                        this.shoot(angle);
                    }
                }
                if (this.currentShootCounterWhileInactive < this.shootFrames[0]) {
                    this.currentShootCounterWhileInactive++;
                }
            }
            this.spriteObject?.[0].rotateable ? super.drawWithRotation(spriteCanvas, MathHelpers.getRadians(angle)) : super.drawWithSquishing(spriteCanvas);
        }
        else {
            super.draw(spriteCanvas);
        }
    }

    shoot(angle) {
        this.currentShootCounter = 0;
        const rocket = new Rocket(this.x / this.tileSize, this.y / this.tileSize, this.tileSize, ObjectTypes.ROCKET,
            this.tileMapHandler, this[SpritePixelArrays.changeableAttributeTypes.speed], angle, 
            this[SpritePixelArrays.changeableAttributeTypes.rotationSpeed], 
            this[SpritePixelArrays.changeableAttributeTypes.collidesWithWalls]);
        this.tileMapHandler.levelObjects.push(rocket);
        AnimationHelper.setSquishValues(this, this.tileSize * 1.2,
            this.tileSize * 0.8, 5, AnimationHelper.facingDirections.left);
    }
}