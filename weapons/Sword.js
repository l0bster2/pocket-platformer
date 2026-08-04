class Sword extends MeleeWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.attackType = 'slicing';
        this.reachTiles = 1.5;
        this.attackDuration = 15;
        this.interval = 0.6;
    }
    getColor() { return 'c0c0c0'; }
    getDisplayName() { return 'Sword'; }
}
