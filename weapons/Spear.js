class Spear extends MeleeWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.attackType = 'piercing';
        this.reachTiles = 1.5;
        this.attackDuration = 10;
        this.interval = 0.5;
    }
    getColor() { return '3d6b9f'; }
    getDisplayName() { return 'Spear'; }
}
