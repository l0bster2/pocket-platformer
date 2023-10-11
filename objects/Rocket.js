class Rocket extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, speed = 3, angle = 0, rotationSpeed) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset);
        this.tileMapHandler = tileMapHandler;
        this.movingSpeed = speed;
        this.key = this.makeid(5);
        this.angle = angle;
        this.rotationSpeed = rotationSpeed;
        this.rotationCounter = 0;
        this.maxRotationCounter = 3;
        this.setInitialPosition();
    }

    setInitialPosition() {
        const radians = MathHelpers.getRadians(this.angle);
        this.x -= Math.cos(radians) * (this.tileSize / 2);
        this.y -= Math.sin(radians) * (this.tileSize / 2);
    }

    collisionEvent() {
        PlayMode.playerDeath();
    }

    checkIfRotationClockWiseFaster(currentAngle, targetAngle) {
        let aroundTheClockFaster = false;
        if (currentAngle > targetAngle) {
            const counterClockWiseDistance = currentAngle - targetAngle;
            const clockWiseDistance = 360 - counterClockWiseDistance;
            if (clockWiseDistance < counterClockWiseDistance) {
                aroundTheClockFaster = true;
            }
        }
        return (currentAngle < targetAngle && targetAngle - currentAngle < 180) || aroundTheClockFaster;
    }
    
    checkCornerCollission(corners, tiles) {
        const foundSolidTileInCollission = corners.find(corner => {
            const xPos = this.tileMapHandler.getTileValueForPosition(corner.x);
            const yPos = this.tileMapHandler.getTileValueForPosition(corner.y);

            const cornerTile = this.tileMapHandler.getTileLayerValueByIndex(yPos, xPos)
            if(cornerTile === ObjectTypes.SPECIAL_BLOCK_VALUES.redBlueSwitch) {
                const switchBlock = this.tileMapHandler.levelObjects.find(levelObject => levelObject.initialX === xPos && levelObject.initialY === yPos);
                switchBlock && switchBlock.switchWasHit();
            }
            return !tiles.includes(cornerTile);
        });
        if (foundSolidTileInCollission) {
            this.deleteObjectFromLevel(this.tileMapHandler);
            return true;
        }
        return false;
    }

    draw(spriteCanvas) {
        this.rotationCounter++;
        const newAngle = this.tileMapHandler?.player ?
            MathHelpers.getAngle(this.tileMapHandler.player.x, this.tileMapHandler.player.y, this.x, this.y) : 0;

        if (this.rotationCounter > this.maxRotationCounter) {
            this.rotationCounter = 0;
            if (Math.abs(newAngle - this.angle) < this.rotationSpeed) {
                this.angle = newAngle;
            }
            else {
                this.angle = MathHelpers.normalizeAngle(this.checkIfRotationClockWiseFaster(this.angle, newAngle) ?
                    this.angle + this.rotationSpeed : this.angle - this.rotationSpeed);
            }
        }

        const radians = MathHelpers.getRadians(this.angle);
        const left = this.x - Math.cos(radians) * this.movingSpeed;
        const top = this.y - Math.sin(radians) * this.movingSpeed;
        const right = left + this.tileSize;
        const bottom = top + this.tileSize;
        const cornerHitBox = 2;

        const corners = [
            { x: left + cornerHitBox, y: top + cornerHitBox },
            { x: right - cornerHitBox, y: top + cornerHitBox },
            { x: right - cornerHitBox, y: bottom - cornerHitBox },
            { x: left + cornerHitBox, y: bottom - cornerHitBox }
        ];
        if (!this.checkCornerCollission(corners, this.angle <= 200 || this.angle >= 340 ? [0, 5] : [0])) {
            super.drawWithRotation(spriteCanvas, radians);
            this.x = left;
            this.y = top;
        }
    }
}