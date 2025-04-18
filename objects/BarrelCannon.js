class BarrelCannon extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, -4, extraAttributes);
        this.tilemapHandler = tilemapHandler;
        this.player = this.tilemapHandler.player;
        this.upButtonReleased = false;
        this.speed = 6;
    }

    setPlayerFlyingAttributes() {
        this.player.invisible = false;
        this.player.fixedSpeed = true;
        SFXHandler.createSFX(this.player.x, this.player.y, 1);
        SoundHandler.barrel.stopAndPlay();
    }

    setPlayerFlying() {
        const widthDIfference = this.player.width > this.tilemapHandler.tileSize ? this.player.width - this.width : 0;
        const heightDifference = this.player.height > this.tilemapHandler.tileSize ? this.player.height - this.height : 0;
        if (this.currentFacingDirection === AnimationHelper.facingDirections.left) {
            this.player.x = this.x - this.tilemapHandler.tileSize - widthDIfference;
            this.player.y = this.y - (heightDifference / 2);
            this.player.xspeed = this.speed * -1;
            this.setPlayerFlyingAttributes();
        }
        else if (this.currentFacingDirection === AnimationHelper.facingDirections.top) {
            this.player.y = this.y - this.tilemapHandler.tileSize - heightDifference;
            this.player.yspeed = this.speed * -1;
            this.setPlayerFlyingAttributes();
        }
        else if (this.currentFacingDirection === AnimationHelper.facingDirections.right) {
            this.player.x = this.x + this.tilemapHandler.tileSize;
            this.player.y = this.y - (heightDifference / 2);
            this.player.xspeed = this.speed;
            this.setPlayerFlyingAttributes();
        }
        else {
            this.player.y = this.y + this.tilemapHandler.tileSize;
            this.player.yspeed = this.speed;
            this.setPlayerFlyingAttributes();
        }
    }

    collisionEvent() {
        const widthDIfference = this.player.width > this.tilemapHandler.tileSize ? (this.player.width - this.width) / 2 : 0;
        const heightDIfference = this.player.height > this.tilemapHandler.tileSize ? (this.player.height - this.height) / 2 : 0;

        this.player.x = this.x - widthDIfference;
        this.player.y = this.y - heightDIfference;
        this.player.resetAttributes(false);
        this.player.jumpPressedToTheMax = true;
        this.player.invisible = Game.playMode === Game.PLAY_MODE;

        if (this.upButtonReleased && Controller.jump) {
            AnimationHelper.setSquishValues(this, this.tileSize * 1.2,
                this.tileSize * 0.8, 5, this.currentFacingDirection);
            this.setPlayerFlying();
            this.upButtonReleased = false;
        }
        if (!Controller.jump) {
            this.upButtonReleased = true;
        }
    }

    draw(spriteCanvas) {
        super.drawWithSquishing(spriteCanvas);
    }
}