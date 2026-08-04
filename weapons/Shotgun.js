class Shotgun extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.bulletLifeSpan = 40;
        this.bulletsAtOnce = 3;
        this.interval = 1.2;
        this.ammo = false;
        this.reloadTime = 2.5;
        this.affectedByGravity = false;
        this.gravity = 0;
        this.randomOffset = 25;
        this.directionAmount = 4;
        this.bulletSprite = 'Bullet';
        this.speed = 6;
    }
    getColor() { return 'a0522d'; }
    getDisplayName() { return 'Shotgun'; }
}
