class Ladder extends InteractiveLevelObject {
	
	constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
		super(x, y, tileSize, type, 0, extraAttributes);
        this.tilemapHandler = tilemapHandler;
	}
	
	collisionEvent() {
        const { player } = this.tilemapHandler;
        player.currentGravity = 0;
        if (Controller.up) player.yspeed = -2
		else if (Controller.down) player.yspeed = 2
		else player.yspeed = 0;
    }
	
}