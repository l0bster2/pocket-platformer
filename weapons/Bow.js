class Bow extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.bulletLifeSpan = 80;
        this.bulletsAtOnce = 1;
        this.interval = 1.0;
        this.ammo = false;
        this.reloadTime = 2.0;
        this.affectedByGravity = true;
        this.gravity = 0.15;
        this.randomOffset = 0;
        this.directionAmount = 8;
        this.bulletSprite = 'Bullet 3';
        this.speed = 7;
    }
    getColor() { return 'd2b48c'; }
    getDisplayName() { return 'Bow'; }
}
