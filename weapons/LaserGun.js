class LaserGun extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.bulletLifeSpan = 200;
        this.bulletsAtOnce = 1;
        this.interval = 0.6;
        this.ammo = false;
        this.reloadTime = 1.5;
        this.affectedByGravity = false;
        this.gravity = 0;
        this.randomOffset = 0;
        this.directionAmount = 4;
        this.bulletSprite = 'Bullet 4';
        this.speed = 10.5;
        this.collidesWithWalls = false;
        this.interactsWithSwitches = true;
    }
    getColor() { return '00e5ff'; }
    getDisplayName() { return 'Laser Gun'; }
}
