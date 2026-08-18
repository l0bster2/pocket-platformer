class MachineGun extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.bulletLifeSpan = 200;
        this.bulletsAtOnce = 1;
        this.interval = 0.08;
        this.ammo = false;
        this.reloadTime = 2.0;
        this.affectedByGravity = false;
        this.gravity = 0;
        this.randomOffset = 5;
        this.directionAmount = 4;
        this.bulletSprite = 'Bullet';
        this.speed = 8;
    }
    getDisplayName() { return 'Machine Gun'; }
}
