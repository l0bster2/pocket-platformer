class StartFlag extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.tilemapHandler = tilemapHandler;
        this.changeableInBuildMode = true;

        const startFlagsInLevel = WorldDataHandler.levels[this.tilemapHandler.currentLevel].levelObjects.filter(levelObject => levelObject.type === ObjectTypes.START_FLAG);
        
        if(!extraAttributes?.levelStartFlag && startFlagsInLevel.length === 1) {
            this.levelStartFlag = true;
            this.addChangeableAttribute("levelStartFlag", true, this.tilemapHandler.currentLevel);
        }
        if(!extraAttributes?.flagIndex) {
            this.flagIndex = this.makeid(3);
            this.addChangeableAttribute("flagIndex", this.flagIndex, this.tilemapHandler.currentLevel);
        }

        const customEntryFlag = startFlagsInLevel.find(startFlag =>
            PlayMode?.customExit?.flagIndex && startFlag?.extraAttributes?.flagIndex === PlayMode.customExit.flagIndex
        );
        const levelStartFlag = startFlagsInLevel.find(startFlag =>
            startFlag?.extraAttributes?.levelStartFlag
        );

        if (customEntryFlag?.extraAttributes?.flagIndex === this.flagIndex || levelStartFlag?.extraAttributes?.flagIndex === this.flagIndex) {
            this.setPlayerInitialPosition();
        }
        else if (!levelStartFlag && !customEntryFlag) {
            const lastFlag = startFlagsInLevel[startFlagsInLevel.length - 1];
            if (lastFlag.x === this.initialX && lastFlag.y === this.initialY) {
                this.setPlayerInitialPosition();
            }
        }
    }

    setPlayerInitialPosition() {
        if (this.tilemapHandler?.player) {
            this.tilemapHandler.player.initialX = this.x;
            this.tilemapHandler.player.initialY = this.y;
        }
    }

    updateLevelStartValue(levelStartValue) {
        const startFlagsInTileMapHandler = this.tilemapHandler.filterObjectsByTypes(ObjectTypes.START_FLAG);

        if (levelStartValue) {
            //reset all other start flags, because there can only be 1 level starting flag
            startFlagsInTileMapHandler.forEach(startFlagInTileMapHandler => {
                startFlagInTileMapHandler.addChangeableAttribute("levelStartFlag", false);
            });
            this.addChangeableAttribute("levelStartFlag", true);
        }
        else {
            this.addChangeableAttribute("levelStartFlag", false);
        }
    }

    collisionEvent() {
    }
}