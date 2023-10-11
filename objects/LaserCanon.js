class LaserCanon extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.tileMapHandler = tilemapHandler;
        this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = ObjectTypes.SPECIAL_BLOCK_VALUES.canon;
        this.possilbeTimers = {
            laserTimer: "laserTimer",
            pauseTimer: "pauseTimer",
        }
        this.resetObject();
        this.key = this.makeid(5);
    }

    resetObject() {
        this.currentTimer = this.possilbeTimers.pauseTimer;
        this.createdLasers = [];
        this.currentLaserFrame = 0;
        this.currentPauseFrame = 0;
    }

    checkIfLasersExistsAndSet(y, x, allowedTileValues) {
        if (allowedTileValues.includes(this.tileMapHandler.tileMap[y][x])) {
            if (!this.createdLasers.find(createdLaser => createdLaser.x === x && createdLaser.y === y)) {
                const laser = new Laser(x, y, this.tileSize, ObjectTypes.LASER, this.tileMapHandler,
                    this.currentFacingDirection, 
                    this[SpritePixelArrays.changeableAttributeTypes.laserDuration] - this.currentLaserFrame, 
                    this[SpritePixelArrays.changeableAttributeTypes.pauseDuration],
                    this.key);
                this.tileMapHandler.levelObjects.push(laser);
                this.createdLasers.push({ x, y });
            }
            return false;
        }
        else {
            this.removeFromCurrentCreatedLasers(x, y); 
            return true;
        }
    }

    removeFromCurrentCreatedLasers(x, y) {
        const index = this.createdLasers.findIndex(laser => laser.x === x && laser.y === y);
        if (index > -1) { 
            this.createdLasers.splice(index, 1); 
        }
    }

    findAndDeleteLasersAfterSolidTile(x, y) {
        const laserAtPosition = this.tileMapHandler.levelObjects.find(levelObject =>
            levelObject.type === ObjectTypes.LASER && levelObject.initialX === x && levelObject.initialY === y
            && levelObject.laserId === this.key);
        this.removeFromCurrentCreatedLasers(x, y);
        laserAtPosition && laserAtPosition.deleteObjectFromLevel(this.tileMapHandler, false);
    }

    handleSingleLaserPos(x, y, allowedTileValues) {
        if (!this.solidTileInbetween) {
            this.solidTileInbetween = this.checkIfLasersExistsAndSet(y, x, allowedTileValues)
        }
        else {
            this.findAndDeleteLasersAfterSolidTile(x, y);
        }
    }

    handleLasers() {
        var { top, right, bottom } = AnimationHelper.facingDirections;
        let allowedTileValues = [0, 5];
        this.solidTileInbetween = false;

        if (this.currentFacingDirection === top) {
            for (var y = this.initialY - 1; y > 0; y--) {
                this.handleSingleLaserPos(this.initialX, y, allowedTileValues);
            }
        }
        else if (this.currentFacingDirection === right) {
            const levelWidth = this.tileMapHandler.levelWidth;
            for (var x = this.initialX + 1; x < levelWidth - 1; x++) {
                this.handleSingleLaserPos(x, this.initialY, allowedTileValues);
            }
        }
        else if (this.currentFacingDirection === bottom) {
            const levelHeight = this.tileMapHandler.levelHeight;
            allowedTileValues = [0];
            for (var y = this.initialY + 1; y < levelHeight - 1; y++) {
                this.handleSingleLaserPos(this.initialX, y, allowedTileValues);
            }
        }
        else {
            for (var x = this.initialX - 1; x > 0; x--) {
                this.handleSingleLaserPos(x, this.initialY, allowedTileValues);
            }
        }
    }

    draw(spriteCanvas) {
        super.drawWithSquishing(spriteCanvas);

        if (Game.playMode === Game.BUILD_MODE) {
            return null;
        }
        if (this.currentTimer === this.possilbeTimers.laserTimer) {
            if (this.currentLaserFrame === 0) {
                AnimationHelper.setSquishValues(this, this.tileSize * 1.2,
                    this.tileSize * 0.8, 5, this.currentFacingDirection);
            }
            this.handleLasers();
            this.currentLaserFrame++;

            if (this.currentLaserFrame === this[SpritePixelArrays.changeableAttributeTypes.laserDuration]) {
                if (this[SpritePixelArrays.changeableAttributeTypes.pauseDuration] > 0) {
                    this.currentTimer = this.possilbeTimers.pauseTimer;
                    this.currentPauseFrame = 0;
                    this.createdLasers = [];
                }
                else {
                    this.resetObject();
                }
            }
        }
        else if (this.currentTimer === this.possilbeTimers.pauseTimer) {
            this.currentPauseFrame++;

            if (this.currentPauseFrame === this[SpritePixelArrays.changeableAttributeTypes.pauseDuration]
                || this[SpritePixelArrays.changeableAttributeTypes.pauseDuration] === 0) {
                this.currentTimer = this.possilbeTimers.laserTimer;
                this.currentLaserFrame = 0;
            }
        }
    }
}