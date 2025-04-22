class Deko extends LevelObject {

    constructor(x, y, tileSize, index) {
        super(x,y,tileSize,ObjectTypes.DEKO);
        this.dekoIndex = index;
        this.spriteIndex = SpritePixelArrays.getIndexOfSprite(this.type, index);
        this.spriteObject = [SpritePixelArrays.getSpritesByIndex(this.spriteIndex)];
        this.canvasYSpritePos = this.spriteObject?.[0].canvasYPos;
    }
}