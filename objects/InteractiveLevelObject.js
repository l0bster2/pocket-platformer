class InteractiveLevelObject extends LevelObject {

    constructor(x, y, tileSize, type, hitBoxOffset = 0, extraAttributes = {}) {
        super(x, y, tileSize, type);
        this.hitBoxOffset = hitBoxOffset;
        this.changeableInBuildMode = false;
        if (this.spriteObject?.[0]?.directions) {
            this.facingDirections = this.spriteObject?.[0]?.directions;
            this.changeableInBuildMode = true;
            this.currentFacingDirection = this.facingDirections[0];
        }
        if (this.spriteObject?.[0]?.changeableAttributes) {
            this.changeableInBuildMode = true;
            this.spriteObject?.[0]?.changeableAttributes.forEach(attribute => {
                this[attribute.name] = attribute.defaultValue;
            });
        }
        this.extraAttributes = extraAttributes;
        if (extraAttributes) {
            for (const [key, value] of Object.entries(extraAttributes)) {
                this[key] = value;
                if (key === "currentFacingDirection" && this.facingDirections) {
                    this.canvasXSpritePos = this.facingDirections.indexOf(value) * this.spriteObject[0].animation.length * this.tileSize;
                }
                if (key === "customName") {
                    this.spriteObject = SpritePixelArrays.getSpritesByDescrpitiveName(value);
                    this.canvasYSpritePos = this.spriteObject?.[0].canvasYPos;
                }
            }

        }
    }

    turnObject() {
        var currentIndex = this.facingDirections.indexOf(this.currentFacingDirection);
        currentIndex++;
        if (currentIndex > this.facingDirections.length - 1) {
            currentIndex = 0;
        }
        this.canvasXSpritePos = currentIndex * this.spriteObject[0].animation.length * this.tileSize;
        this.addChangeableAttribute("currentFacingDirection", this.facingDirections[currentIndex]);
    }

    addChangeableAttribute(attribute, value, levelToChange = null) {
        const levelIndex = levelToChange || tileMapHandler.currentLevel;
        this[attribute] = value;
        if (WorldDataHandler.levels[levelIndex].levelObjects) {
            WorldDataHandler.levels[levelIndex].levelObjects.forEach(levelObject => {
                if (levelObject.x === this.initialX && levelObject.y === this.initialY && levelObject.type === this.type) {
                    if (!levelObject.extraAttributes) {
                        levelObject.extraAttributes = {};
                    }
                    levelObject.extraAttributes = { ...levelObject.extraAttributes, [attribute]: value }
                }
            });
        }
    }

    //for now it's used for bullets (canonballs and rockets), which can be deleted during game-time
    deleteObjectFromLevel(tilemapHandler, showSfx = true) {
        showSfx && SFXHandler.createSFX(this.x, this.y, 1)
        for (var i = tilemapHandler.levelObjects.length - 1; i >= 0; i--) {
            var levelObject = tilemapHandler.levelObjects[i];
            if (this.key === levelObject.key && levelObject.initialX === this.initialX && levelObject.initialY === this.initialY && levelObject.type === this.type) {
                tilemapHandler.levelObjects.splice(i, 1);
                break;
            }
        }
    }
}