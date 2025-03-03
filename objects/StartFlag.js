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
    }

    //startRemoval
    /**
     * Updates the levelStartFlag property for this flag and adjusts the other flags to keep just one such flag in the level
     * @param {*} levelStartValue 
     */
    updateLevelStartValue(levelStartValue) {
        const startFlagsInTileMapHandler = this.tilemapHandler.filterObjectsByTypes(ObjectTypes.START_FLAG);

        // TODO move this logic to tilemapHandler
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
    //endRemoval

    collisionEvent() {
    }
}