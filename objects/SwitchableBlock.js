class SwitchableBlock extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, color, extraAttributes = {}) {
        super(x, y, tileSize, type, -4, extraAttributes);
        this.tilemapHandler = tilemapHandler;
        this.color = color;
        this.activeTileIndex = ObjectTypes.SPECIAL_BLOCK_VALUES.switchableBlock;
    }

    setBlockState(tileIndex, activeState) {
        this.tilemapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = tileIndex;
        this.active = activeState;
        this.checkIfPlayerIsInTheWay(activeState);
    }

    checkIfPlayerIsInTheWay(activeState) {
        if (activeState) {
            const { top, right, bottom, left } = this.tilemapHandler.player;
            const positions = [{ y: top, x: right }, { y: top, x: left }, { y: bottom, x: right }, { y: bottom, x: left }];
            const playerAtPosition = positions.find(position => position.x === this.initialX && position.y === this.initialY);
            if (playerAtPosition && Collision.objectsColliding(this.tilemapHandler.player, this)) {
                PlayMode.playerDeath();
            }
        }
    }

    switchActiveState(tileIndex, activeState) {
        this.setBlockState(tileIndex, activeState);
        //Check if colliding with canons at the moment where block became solid.
        //That's more performant than checking if canon collides with it all the time
        this.tilemapHandler.levelObjects.forEach(levelObject => {
            if ((levelObject.type === ObjectTypes.CANON_BALL || levelObject.type === ObjectTypes.ROCKET || levelObject.type === ObjectTypes.LASER) && Collision.objectsColliding(levelObject, this)) {
                levelObject.deleteObjectFromLevel(this.tilemapHandler);
            }
        });
    }

    switchChanged(color) {
        color === this.color ? this.switchActiveState(this.activeTileIndex, true) : this.switchActiveState(0, false);
    }

    collisionEvent() {
    }

    draw(spriteCanvas) {
        super.drawSingleFrame(spriteCanvas, this.active ? this.canvasXSpritePos : this.canvasXSpritePos + this.tileSize);
    }
}