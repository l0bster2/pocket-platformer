class Sword extends MeleeWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.attackType = 'slicing';
        this.reachTiles = 2.0;
        this.attackDuration = 25;
        this.interval = 0.6;
    }
    getColor() { return 'c0c0c0'; }
    getDisplayName() { return 'Sword'; }
}
