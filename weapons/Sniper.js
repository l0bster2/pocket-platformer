class Sniper extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.bulletLifeSpan = 200;
        this.bulletsAtOnce = 1;
        this.interval = 2.0;
        this.ammo = false;
        this.reloadTime = 3.0;
        this.affectedByGravity = false;
        this.gravity = 0;
        this.randomOffset = 0;
        this.directionAmount = 8;
        this.bulletSprite = 'Bullet 2';
        this.speed = 14;
    }
    getDisplayName() { return 'Sniper'; }
}
