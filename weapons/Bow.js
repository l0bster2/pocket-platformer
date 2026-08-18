class Bow extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.shootSound = 'gun3';
        this.bulletLifeSpan = 150;
        this.bulletsAtOnce = 1;
        this.interval = 1.0;
        this.ammo = false;
        this.reloadTime = 2.0;
        this.affectedByGravity = true;
        this.gravity = 0.1;
        this.randomOffset = 0;
        this.directionAmount = 8;
        this.bulletSprite = 'Bullet 3';
        this.deceleration = 0.02;
        this.speed = 10;
        this.interactsWithSwitches = true;
    }
    getDisplayName() { return 'Bow'; }
}
