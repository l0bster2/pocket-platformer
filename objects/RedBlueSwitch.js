class RedBlueSwitch extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tilemapHandler = tilemapHandler;
        this.collided = false;
        this.bottomLineHitBox = { x: this.x, y: this.y + this.height, width: this.width, height: 2 };
        this.checkOtherSwitchesCurrentColor();
        this.tilemapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = ObjectTypes.SPECIAL_BLOCK_VALUES.redBlueSwitch;
        this.key = this.makeid(5);
    }

    checkOtherSwitchesCurrentColor() {
        const result = this?.tilemapHandler?.levelObjects && this.tilemapHandler.levelObjects.find(levelObject => levelObject.type === ObjectTypes.RED_BLUE_BLOCK_SWITCH);
        this.currentlyActiveColor = result?.currentlyActiveColor ? result.currentlyActiveColor : AnimationHelper.switchableBlockColors.red;
    }

    collisionEvent() {
        if (!this.collided) {
            if (player.yspeed <= 0 && 
                (player?.top_right_pos && Collision.pointAndObjectColliding(player.top_right_pos, this.bottomLineHitBox) ||
                player?.top_left_pos && Collision.pointAndObjectColliding(player.top_left_pos, this.bottomLineHitBox))) {
                this.switchWasHit()
            }
        }
    }

    resetObject() {
        if (this.tilemapHandler && !PlayMode.checkActiveCheckPoints()) {
            this.currentlyActiveColor = AnimationHelper.switchableBlockColors.red;
        }
    }

    switchWasHit(direction = AnimationHelper.facingDirections.top) {
        let squishWidth = this.tileSize * 1.2;
        let squishHeight = this.tileSize * 0.8;
        AnimationHelper.setSquishValues(this, squishWidth, squishHeight, 5, direction);

        const { red, blue } = AnimationHelper.switchableBlockColors;
        this.currentlyActiveColor = this.currentlyActiveColor === red ? blue : red;
        this.collided = true;
        this?.tilemapHandler?.levelObjects && this.tilemapHandler.levelObjects.forEach(levelObject => {
            if (levelObject.type === ObjectTypes.RED_BLUE_BLOCK_SWITCH && levelObject.key !== this.key) {
                levelObject.collided = true;
                levelObject.currentlyActiveColor = this.currentlyActiveColor;
                AnimationHelper.setSquishValues(levelObject, squishWidth, squishHeight, 5, direction);
            }
            else if (levelObject.type === ObjectTypes.RED_BLOCK || levelObject.type === ObjectTypes.BLUE_BLOCK) {
                levelObject.switchChanged(this.currentlyActiveColor);
            }
        });
    }

    draw(spriteCanvas) {
        if (this.collided && !Collision.objectsColliding(player, this)) {
            this.collided = false;
        }
        const showSecond = this.currentlyActiveColor === AnimationHelper.switchableBlockColors.blue;
        super.drawSingleSquishingFrame(spriteCanvas, showSecond ? this.canvasXSpritePos + this.tileSize : this.canvasXSpritePos);
    }
}