class Uzi extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.bulletLifeSpan = 150;
        this.bulletsAtOnce = 1;
        this.interval = 0.12;
        this.ammo = 6;
        this.reloadTime = 0.5;
        this.affectedByGravity = false;
        this.gravity = 0;
        this.randomOffset = 20;
        this.directionAmount = 2;
        this.bulletSprite = 'Bullet';
        this.speed = 6;
    }
    getDisplayName() { return 'Uzi'; }
}
