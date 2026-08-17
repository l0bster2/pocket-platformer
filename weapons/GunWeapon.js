class GunWeapon extends Weapon {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tileMapHandler, extraAttributes);
        this.shootSound = 'gun1';
    }

    getCategory() { return 'gun'; }

    _ensureRuntimeState() {
        if (this.intervalTimer === undefined) {
            this.intervalTimer = 0;
            this.shotsRemaining = this.ammo || 0;
            this.reloadTimer = 0;
            this.recoilTimer = 0;
        }
    }

    tick(player) {
        this._ensureRuntimeState();
        if (this.intervalTimer > 0) this.intervalTimer--;
        if (this.recoilTimer > 0) this.recoilTimer--;
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
        const spawnTileY = (player.y + player.height / 2 - ts / 2 + dy * ts) / ts;
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
                    collidesWithWalls: this.collidesWithWalls !== false,
                    spriteDescriptiveName: this.bulletSprite,
                    lifeSpan: this.bulletLifeSpan,
                    deceleration: this.deceleration ?? 0,
                    interactsWithSwitches: this.interactsWithSwitches ?? false,
                }
            );
            this.tileMapHandler.levelObjects.push(bullet);
        }

        this.intervalTimer = Math.round(this.interval * 60);
        this.recoilTimer = 8;
        if (this.shootSound) SoundHandler[this.shootSound].stopAndPlay();
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

    drawOnPlayer(player) {
        this._ensureRuntimeState();
        const { dx, dy } = this._getAimDirection(player);
        const ts = player.tileSize;
        const recoilDuration = 8;
        const maxRecoil = ts * 0.35;
        const recoilOffset = this.recoilTimer > 0 ? (this.recoilTimer / recoilDuration) * maxRecoil : 0;
        const x = Math.round(player.x + dx * ts - dx * recoilOffset);
        const y = Math.round(player.y + player.height / 2 - ts / 2 + dy * ts - dy * recoilOffset);
        const facingLeft = player.facingDirection === AnimationHelper.facingDirections.left;
        const mirror = dx < 0 || (dx === 0 && facingLeft);
        this.checkFrameAndDraw((canvasXSpritePos) => {
            if (mirror) {
                Display.drawImageFlippedX(
                    player.spriteCanvas,
                    canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                    x, y, ts, ts, Math.atan2(dy, -dx)
                );
            } else {
                Display.drawImageWithRotation(
                    player.spriteCanvas,
                    canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                    x, y, ts, ts, Math.atan2(dy, dx)
                );
            }
        });
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
            deceleration: this.deceleration ?? 0,
            interactsWithSwitches: this.interactsWithSwitches ?? false,
            shootSound: this.shootSound ?? null,
            collidesWithWalls: this.collidesWithWalls !== false,
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
        if (attrs.deceleration !== undefined) this.deceleration = attrs.deceleration;
        if ('interactsWithSwitches' in attrs) this.interactsWithSwitches = attrs.interactsWithSwitches;
        if ('shootSound' in attrs) this.shootSound = attrs.shootSound;
        if ('collidesWithWalls' in attrs) this.collidesWithWalls = attrs.collidesWithWalls;
        if (attrs.pickupSound !== undefined) this.pickupSound = attrs.pickupSound;
        // Reset runtime state so new ammo settings take effect
        this.intervalTimer = undefined;
    }
}
