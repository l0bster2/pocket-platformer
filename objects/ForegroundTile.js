class ForegroundTile extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tileMapHandler = tileMapHandler;
    }

    collisionEvent() {

    }

    draw(spriteCanvas) {
        Game.playMode === Game.PLAY_MODE ? super.draw(spriteCanvas) : super.drawWithAlpha(spriteCanvas, 0.4);
    }
}