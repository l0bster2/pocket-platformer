class Spear extends MeleeWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.shootSound = 'sword1';
        this.attackType = 'piercing';
        this.reachTiles = 2.0;
        this.attackDuration = 14;
        this.interval = 0.35;
    }
    getDisplayName() { return 'Spear'; }
}
