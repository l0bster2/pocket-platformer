class Pistol extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.bulletLifeSpan = 60;
        this.bulletsAtOnce = 1;
        this.interval = 0.8;
        this.ammo = false;
        this.reloadTime = 1.5;
        this.affectedByGravity = false;
        this.gravity = 0;
        this.randomOffset = 0;
        this.directionAmount = 2;
        this.bulletSprite = 'Bullet';
        this.speed = 5;
        this.interactsWithSwitches = true;
    }
    getDisplayName() { return 'Pistol'; }
}
