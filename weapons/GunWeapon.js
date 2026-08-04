class GunWeapon extends Weapon {

    getCategory() { return 'gun'; }

    _ensureRuntimeState() {
        if (this.intervalTimer === undefined) {
            this.intervalTimer = 0;
            this.shotsRemaining = this.ammo || 0;
            this.reloadTimer = 0;
        }
    }

    tick(player) {
        this._ensureRuntimeState();
        if (this.intervalTimer > 0) this.intervalTimer--;
        if (this.reloadTimer > 0) {
            this.reloadTimer--;
            if (this.reloadTimer === 0) this.shotsRemaining = this.ammo;
        }
    }

    attack(player) {
        this._ensureRuntimeState();
        if (this.intervalTimer > 0) return;
        if (this.reloadTimer > 0) return;

        const baseAngle = this._getFireAngle(player);
        const ts = player.tileSize;
        const { dx, dy } = this._getAimDirection(player);
        const spawnTileX = (player.x + dx * ts) / ts;
        const spawnTileY = (player.y + dy * ts) / ts;
        for (let i = 0; i < this.bulletsAtOnce; i++) {
            const spread = this.bulletsAtOnce > 1
                ? (i / (this.bulletsAtOnce - 1) - 0.5) * this.randomOffset
                : (Math.random() - 0.5) * this.randomOffset;
            const angle = ((baseAngle + spread) % 360 + 360) % 360;
            const bullet = new Bullet(
                spawnTileX,
                spawnTileY,
                player.tileSize,
                ObjectTypes.BULLET,
                this.tileMapHandler,
                {
                    isGood: true,
                    speed: this.speed,
                    angle,
                    affectedByGravity: this.affectedByGravity,
                    gravity: this.gravity,
                    collidesWithWalls: true,
                    spriteDescriptiveName: this.bulletSprite,
                    lifeSpan: this.bulletLifeSpan,
                }
            );
            this.tileMapHandler.levelObjects.push(bullet);
        }

        this.intervalTimer = Math.round(this.interval * 60);
        if (this.ammo) {
            this.shotsRemaining--;
            if (this.shotsRemaining <= 0) {
                this.reloadTimer = Math.round((this.reloadTime || 1.5) * 60);
            }
        }
    }

    _getFireAngle(player) {
        const { dx, dy } = this._getAimDirection(player);
        return (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
    }

    getEditableAttributes() {
        return {
            bulletLifeSpan: this.bulletLifeSpan,
            bulletsAtOnce: this.bulletsAtOnce,
            interval: this.interval,
            ammo: this.ammo,
            reloadTime: this.reloadTime,
            affectedByGravity: this.affectedByGravity,
            gravity: this.gravity,
            randomOffset: this.randomOffset,
            directionAmount: this.directionAmount,
            bulletSprite: this.bulletSprite,
            speed: this.speed,
            pickupSound: this.pickupSound,
        };
    }

    setEditableAttributes(attrs) {
        if (attrs.bulletLifeSpan !== undefined) this.bulletLifeSpan = attrs.bulletLifeSpan;
        if (attrs.bulletsAtOnce !== undefined) this.bulletsAtOnce = attrs.bulletsAtOnce;
        if (attrs.interval !== undefined) this.interval = attrs.interval;
        if ('ammo' in attrs) this.ammo = attrs.ammo;
        if (attrs.reloadTime !== undefined) this.reloadTime = attrs.reloadTime;
        if (attrs.affectedByGravity !== undefined) this.affectedByGravity = attrs.affectedByGravity;
        if (attrs.gravity !== undefined) this.gravity = attrs.gravity;
        if (attrs.randomOffset !== undefined) this.randomOffset = attrs.randomOffset;
        if (attrs.directionAmount !== undefined) this.directionAmount = attrs.directionAmount;
        if (attrs.bulletSprite !== undefined) this.bulletSprite = attrs.bulletSprite;
        if (attrs.speed !== undefined) this.speed = attrs.speed;
        if (attrs.pickupSound !== undefined) this.pickupSound = attrs.pickupSound;
        // Reset runtime state so new ammo settings take effect
        this.intervalTimer = undefined;
    }
}
