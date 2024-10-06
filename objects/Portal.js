class Portal extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes) {
        const hitBoxOffset = -tileSize / 3;
        super(x, y, tileSize, type, hitBoxOffset);
        this.tilemapHandler = tilemapHandler;
        this.portalTypes = { blue: "blue", orange: "orange" };
        this.portalType = this.portalTypes.blue;
        this.active = true;
        this.maxInactiveFrames = 60;
        this.currentInactiveFrame = this.maxInactiveFrames;
        this.key = this.makeid(5);
        this.touchingPlayer = false;

        const portalsInLevel = this.tilemapHandler.filterObjectsByTypes([ObjectTypes.PORTAL, ObjectTypes.PORTAL2]);

        if (portalsInLevel.length % 2 !== 0 || (extraAttributes && extraAttributes?.portalType === this.portalTypes.orange)) {
            this.setSpriteAttributes(ObjectTypes.PORTAL2)
            this.portalType = this.portalTypes.orange;
        }
        this.updatePortalInWorldDataHandler();
    }

    updatePortalInWorldDataHandler() {
        const currentLevelObjects = WorldDataHandler.levels[this.tilemapHandler.currentLevel].levelObjects;
        for (var i = 0; i < currentLevelObjects.length; i++) {
            if (currentLevelObjects[i].x === this.initialX && currentLevelObjects[i].y === this.initialY) {
                currentLevelObjects[i].extraAttributes = { portalType: this.portalType };
            }
        }
    }

    findOtherExit() {
        const portalsInLevel = this.tilemapHandler.filterObjectsByTypes([ObjectTypes.PORTAL, ObjectTypes.PORTAL2]);
        let indexOfCurrentPortal = portalsInLevel.findIndex(portalInArray => portalInArray.key === this.key);
        let otherExit;

        if (this.portalType === this.portalTypes.blue && portalsInLevel[indexOfCurrentPortal + 1]) {
            otherExit = portalsInLevel[indexOfCurrentPortal + 1];
        }
        else if (this.portalType === this.portalTypes.orange && portalsInLevel[indexOfCurrentPortal - 1]) {
            otherExit = portalsInLevel[indexOfCurrentPortal - 1];
        }
        return otherExit;
    }

    collisionEvent() {
        this.touchingPlayer = true;
        if (this.active && !this.touchingOtherPortals()) {
            AnimationHelper.setSquishValues(this, this.tileSize * 1.2,
                this.tileSize * 0.8, 5, this.currentFacingDirection);
            this.setToInactive();
            const otherExit = this.findOtherExit();
            if (otherExit) {
                otherExit.setToInactive();
                this.tilemapHandler.player.x = otherExit.x + 1;
                this.tilemapHandler.player.y = otherExit.y + 1;
                otherExit.touchingPlayer = true;
                AnimationHelper.setSquishValues(otherExit, this.tileSize * 1.2,
                    this.tileSize * 0.8, 5, this.currentFacingDirection);
            }
        }
    }

    touchingOtherPortals() {
        return this.tilemapHandler.levelObjects.find(levelObject =>
            levelObject.type === ObjectTypes.PORTAL && levelObject.key !== this.key && levelObject.touchingPlayer);
    }

    setToInactive() {
        this.currentInactiveFrame = 0;
        this.active = false;
    }

    draw(spriteCanvas) {
        if (this.touchingPlayer && !Collision.objectsColliding(this.tilemapHandler.player, this)) {
            this.touchingPlayer = false;
        }
        if (this.currentInactiveFrame < this.maxInactiveFrames) {
            AnimationHelper.checkSquishUpdate(this);
            Display.drawImageWithAlpha(spriteCanvas, this.canvasXSpritePos, this.canvasYSpritePos,
                this.tileSize, this.tileSize, this.x - this.squishXOffset, this.y - this.squishYOffset, this.drawWidth, this.drawHeight, 0.5);
            if (this.currentInactiveFrame === this.maxInactiveFrames - 1) {
                this.active = true;
            }
            this.currentInactiveFrame++;
        }
        else {
            super.draw(spriteCanvas);
        }
    }
}