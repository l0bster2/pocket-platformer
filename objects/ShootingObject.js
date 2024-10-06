class ShootingObject extends InteractiveLevelObject{

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.tileMapHandler = tilemapHandler;
    }

    getShootFrames() {
        const frequency = this[SpritePixelArrays.changeableAttributeTypes.frequency];
        const step = this.tileMapHandler.generalFrameCounterMax / frequency;
        const shootFrames = [];
        for (var i = 1; i <= frequency; i++) {
            shootFrames.push(Math.round(step * i));
        }
        this.shootFrames = shootFrames;
    }
}