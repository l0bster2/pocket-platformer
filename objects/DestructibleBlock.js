class DestructibleBlock extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 2, extraAttributes);
        this.tileMapHandler = tileMapHandler;
        this.destroyAnimationFrames = 20;
        this.bottomLineHitBox = { x: this.x, y: this.y + this.height, width: this.width, height: 2 };
        this.resetObject();
    }

    /**
     * Destroys the block found at the given tile position, if there is one.
     * Used by projectiles and melee weapons that hit the tile directly.
     */
    static destroyBlockAtTile(tileMapHandler, xPos, yPos) {
        const block = tileMapHandler?.levelObjects?.find(levelObject =>
            levelObject.type === ObjectTypes.DESTRUCTIBLE_BLOCK
            && levelObject.initialX === xPos && levelObject.initialY === yPos);
        block && block.destroy();
        return !!block;
    }

    collisionEvent() {
        if (!this.destroyed) {
            if (player.yspeed <= 0 &&
                (player?.top_right_pos && Collision.pointAndObjectColliding({ x: player.top_right_pos.x - 2, y: player.top_right_pos.y }, this.bottomLineHitBox) ||
                    player?.top_left_pos && Collision.pointAndObjectColliding({ x: player.top_left_pos.x + 2, y: player.top_left_pos.y }, this.bottomLineHitBox))) {
                this.destroy();
            }
        }
    }

    resetObject() {
        this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = ObjectTypes.SPECIAL_BLOCK_VALUES.destructibleBlock;
        this.destroyed = false;
        this.currentDestroyFrame = 0;
        this.radians = 0;
    }

    destroy() {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.currentDestroyFrame = 0;
        this.radians = 0;
        //SoundHandler.blockDestroy.stopAndPlay();
        // tile cleared on first draw so this frame's collisions still treat the block as solid
        SFXHandler.createSFX(this.x, this.y, 14, AnimationHelper.facingDirections.bottom,
            0, 0, true, 8, 0, "backgroundSFX");
    }

    draw(spriteCanvas) {
        if (!this.destroyed) {
            super.draw(spriteCanvas);
            return;
        }
        if (this.currentDestroyFrame === 0) {
            this.tileMapHandler.tileMap[this.y / this.tileSize][this.x / this.tileSize] = 0;
        }
        if (this.currentDestroyFrame < this.destroyAnimationFrames) {
            this.radians += 0.15;
            Display.explodeSprite(spriteCanvas, this.canvasXSpritePos, this.canvasYSpritePos,
                this.tileSize, this.x, this.y, this.currentDestroyFrame, this.radians);
            this.currentDestroyFrame++;
        }
    }
}
