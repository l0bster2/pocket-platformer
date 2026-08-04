class Uzi extends GunWeapon {
    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.bulletLifeSpan = 45;
        this.bulletsAtOnce = 1;
        this.interval = 0.12;
        this.ammo = false;
        this.reloadTime = 1.5;
        this.affectedByGravity = false;
        this.gravity = 0;
        this.randomOffset = 40;
        this.directionAmount = 2;
        this.bulletSprite = 'Bullet';
        this.speed = 6;
    }
    getColor() { return '666666'; }
    getDisplayName() { return 'Uzi'; }
}
