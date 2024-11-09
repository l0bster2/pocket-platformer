class Door extends FinishFlag {
    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        
        // overrides
        this.lockedSpriteIndex = SpritePixelArrays.getIndexOfSprite(ObjectTypes.LOCKED_DOOR);
        this.lockedSpriteYPos = this.lockedSpriteIndex * this.tileSize;
        this.sound = SoundHandler.door;

        // new
        if(!extraAttributes?.activationTrigger) {
            this.addChangeableAttribute("activationTrigger", PlayerInteractionHandler.TRIGGERS.UP_BUTTON);
        }
        if(!extraAttributes?.flagIndex) {
            this.flagIndex = this.makeid(3);
            this.addChangeableAttribute("flagIndex", this.flagIndex, this.tilemapHandler.currentLevel);
        }
    }

    collisionEvent() { // overrides super.collisionEvent
        if (this.locked) {
            return;
        }
        PlayerInteractionHandler.registerInteractionTarget(this);
    }

    changeExit(customExit, reciprocatingLevelIndex) {
        super.changeExit(customExit, reciprocatingLevelIndex);
        
        // Door-specific effect: if exit target is a door, connect it back to this
        // (make the connection mutual)
        let targetLevelIndex = customExit.levelIndex;
        let targetObjectType = customExit.type;
        let targetFlagIndex = customExit.flagIndex;

        if (targetObjectType !== ObjectTypes.DOOR || reciprocatingLevelIndex === null || reciprocatingLevelIndex === undefined) {
            // note: if there is no reciprocatingLevelIndex, this object is probably the one who is reciprocating
            return;
        }

        let otherDoor = WorldDataHandler.levels[targetLevelIndex]?.levelObjects.find((obj, index) => {
            return obj.type === ObjectTypes.DOOR && obj.extraAttributes?.flagIndex === targetFlagIndex;
        });
        let customExitToHere = {
            levelIndex: reciprocatingLevelIndex,
            type: ObjectTypes.DOOR,
            flagIndex: this.flagIndex
        };
        if (!otherDoor.extraAttributes) {
            otherDoor.extraAttributes = {
                customExit : customExitToHere
            };
        }
        else {
            otherDoor.extraAttributes.customExit = customExitToHere;
        }
        
        // handle the instance of the other door too (only if the editor is showing that level currently)
        if (PlayMode.tilemapHandler.currentLevel === targetLevelIndex) {
            let otherDoorInstance = PlayMode.tilemapHandler.levelObjects.find((obj)=>{
                return obj.type === ObjectTypes.DOOR && obj.flagIndex === targetFlagIndex;
            })
            otherDoorInstance?.changeExit(customExitToHere, null);
        }
    }
}
