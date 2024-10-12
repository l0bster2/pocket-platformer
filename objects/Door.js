const DOOR_TRIGGERS = {
    AUTOMATIC: 'auto',
    UP: 'up',
    DOWN: 'down'
}
class Door extends FinishFlag {
    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        
        // overrides
        this.lockedSpriteIndex = SpritePixelArrays.getIndexOfSprite(ObjectTypes.LOCKED_DOOR);
        this.lockedSpriteYPos = this.lockedSpriteIndex * this.tileSize;

        // new
        this.enterTrigger = DOOR_TRIGGERS.UP;
        if(!extraAttributes?.flagIndex) {
            this.flagIndex = this.makeid(3);
            this.addChangeableAttribute("flagIndex", this.flagIndex, this.tilemapHandler.currentLevel);
        }
    }

    collisionEvent() { // overrides super.collisionEvent
        if (this.used || this.locked) {
            return;
        }
        this.handleInputPrompt();
        this.handleEntranceTriggers();
    }

    handleInputPrompt() {
        if (this.enterTrigger === DOOR_TRIGGERS.UP && !this.used) {
            if (this.arrowUpFrameIndex === undefined) {
                this.arrowUpFrameIndex = 0;
            }
            else {
                this.arrowUpFrameIndex++;
            }
            const frameModulo = this.arrowUpFrameIndex % 60;
            if (frameModulo < 30) {
                DialogueHandler.showDialogueUpArrow(this.x, this.y - this.tileSize);
            }
        }
    }

    handleEntranceTriggers() {
        let cueEntrance = false;

        if (this.enterTrigger === DOOR_TRIGGERS.AUTOMATIC) {
            cueEntrance = true;
        }
        else if (this.enterTrigger === DOOR_TRIGGERS.UP) {
            cueEntrance = Controller.up;
        }
        else if (this.enterTrigger === DOOR_TRIGGERS.DOWN) {
            cueEntrance = Controller.down;
        }
        
        if (cueEntrance) {
            this.sendPlayerThroughExit();
        }
    }

    changeExit(customExit, reciprocatingLevelIndex) {
        super.changeExit(customExit, reciprocatingLevelIndex);
        
        // Door-specific effect: if exit target is a door, connect it back to this
        // (make the connection mutual)
        let targetLevelIndex = customExit.levelIndex;
        let targetObjectType = customExit.type;
        let targetFlagIndex = customExit.flagIndex;

        if (targetObjectType !== ObjectTypes.DOOR) {
            return;
        }
        if (!reciprocatingLevelIndex) {
            // (in this case, this door is probably the one who is reciprocating)
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
