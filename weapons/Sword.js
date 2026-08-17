class Sword extends MeleeWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.shootSound = 'sword2';
        this.attackType = 'slicing';
        this.reachTiles = 2.0;
        this.attackDuration = 18;
        this.interval = 0.4;
    }
    getColor() { return 'c0c0c0'; }
    getDisplayName() { return 'Sword'; }
}
