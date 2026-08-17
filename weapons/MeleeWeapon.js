class MeleeWeapon extends Weapon {

    getCategory() { return 'melee'; }

    _ensureRuntimeState() {
        if (this.attackTimer === undefined) {
            this.attackTimer = 0;
            this.cooldownTimer = 0;
            this.attackDir = null;
            this.attackFacingRight = true;
            this.hitEnemies = new Set();
        }
    }

    // 4-directional aim: up/down keys override, otherwise use facing direction
    _getMeleeAimDirection(player) {
        const facingRight = player.facingDirection === AnimationHelper.facingDirections.right;
        if (Controller.up && !Controller.down) return { dx: 0, dy: -1 };
        if (Controller.down && !Controller.up) return { dx: 0, dy: 1 };
        return { dx: facingRight ? 1 : -1, dy: 0 };
    }

    // Returns the start angle and total sweep for a 180° slicing arc
    _getSliceAngles(dx, dy, facingRight) {
        if (dy === -1) return facingRight
            ? { startAngle: Math.PI, sweepAngle:  Math.PI }   // up + right: left → top → right
            : { startAngle: 0,       sweepAngle: -Math.PI };   // up + left:  right → top → left
        if (dy ===  1) return facingRight
            ? { startAngle: Math.PI, sweepAngle: -Math.PI }    // down + right: left → bottom → right
            : { startAngle: 0,       sweepAngle:  Math.PI };   // down + left:  right → bottom → left
        if (dx ===  1) return { startAngle: -Math.PI / 2, sweepAngle:  Math.PI };  // right: top → right → bottom
        return             { startAngle: -Math.PI / 2, sweepAngle: -Math.PI };     // left:  top → left → bottom
    }

    // Draw idle weapon behind player (before player sprite); only when not attacking
    drawBehindPlayer(player) {
        this._ensureRuntimeState();
        if (this.attackTimer > 0 && this.attackDir) return;
        this._drawIdle(player);
    }

    // Only render active attack in front of player
    drawOnPlayer(player) {
        this._ensureRuntimeState();
        if (this.attackTimer <= 0 || !this.attackDir) return;
        if (this.attackType === 'piercing') {
            this._drawPiercing(player);
        } else {
            this._drawSlicing(player);
        }
    }

    _drawIdle(player) {
        const facingRight = player.facingDirection === AnimationHelper.facingDirections.right;
        const ts = player.tileSize;
        const x = Math.round(player.x + player.width / 2 - ts / 2);
        const y = Math.round(player.y + player.height / 2 - ts * 0.85);
        this.checkFrameAndDraw((canvasXSpritePos) => {
            if (facingRight) {
                Display.drawImageWithRotation(
                    player.spriteCanvas,
                    canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                    x, y, ts, ts, Math.PI / 2
                );
            } else {
                Display.drawImageFlippedX(
                    player.spriteCanvas,
                    canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                    x, y, ts, ts, Math.PI / 2
                );
            }
        });
    }

    _drawPiercing(player) {
        const progress = (this.attackDuration - this.attackTimer) / this.attackDuration;
        // Extend out then retract
        const extend = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
        const ts = player.tileSize;
        const reach = this.reachTiles * ts;
        const { dx, dy } = this.attackDir;
        const cx = player.x + player.width / 2;
        const cy = player.y + player.height / 2;
        const wx = Math.round(cx + dx * reach * extend - ts / 2);
        const wy = Math.round(cy + dy * reach * extend - ts / 2);
        this.checkFrameAndDraw((canvasXSpritePos) => {
            if (dx < 0) {
                Display.drawImageFlippedX(
                    player.spriteCanvas,
                    canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                    wx, wy, ts, ts, Math.atan2(dy, -dx)
                );
            } else {
                Display.drawImageWithRotation(
                    player.spriteCanvas,
                    canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                    wx, wy, ts, ts, Math.atan2(dy, dx)
                );
            }
        });
    }

    _drawSlicing(player) {
        const progress = (this.attackDuration - this.attackTimer) / this.attackDuration;
        const { startAngle, sweepAngle } = this._getSliceAngles(this.attackDir.dx, this.attackDir.dy, this.attackFacingRight);
        const currentAngle = startAngle + progress * sweepAngle;
        const ts = player.tileSize;
        const reach = this.reachTiles * ts;
        const cx = player.x + player.width / 2;
        const cy = player.y + player.height / 2;
        this._drawSliceArc(cx, cy, reach, startAngle, currentAngle);
        const wx = Math.round(cx + Math.cos(currentAngle) * reach);
        const wy = Math.round(cy + Math.sin(currentAngle) * reach);
        this.checkFrameAndDraw((canvasXSpritePos) => {
            Display.drawImageWithRotation(
                player.spriteCanvas,
                canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                wx - ts / 2, wy - ts / 2, ts, ts,
                currentAngle
            );
        });
    }

    // White pixel trail along the swept arc, brightest at the tip
    _drawSliceArc(cx, cy, reach, startAngle, currentAngle) {
        const steps = 8;
        const tipSize = Math.max(3, reach / 5);
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = startAngle + t * (currentAngle - startAngle);
            const px = cx + Math.cos(angle) * reach;
            const py = cy + Math.sin(angle) * reach;
            const size = tipSize * (0.2 + 0.8 * t);
            Display.drawRectangleWithAlpha(px - size / 2, py - size / 2, size, size, 'ffffff', Display.ctx, 0.1 + 0.9 * t);
        }
    }

    tick(player) {
        this._ensureRuntimeState();
        if (this.attackTimer > 0) {
            this.attackTimer--;
            this._checkHits(player);
        }
        if (this.cooldownTimer > 0) this.cooldownTimer--;
    }

    attack(player) {
        this._ensureRuntimeState();
        if (this.cooldownTimer > 0 || this.attackTimer > 0) return;
        this.attackDir = this._getMeleeAimDirection(player);
        this.attackFacingRight = player.facingDirection === AnimationHelper.facingDirections.right;
        this.hitEnemies = new Set();
        this.attackTimer = this.attackDuration;
        if (this.shootSound) SoundHandler[this.shootSound].stopAndPlay();
        // Cooldown covers both the animation and the recovery pause
        this.cooldownTimer = this.attackDuration + Math.round(this.interval * 60);
    }

    _checkHits(player) {
        if (!this.attackDir) return;
        const enemies = this.tileMapHandler.enemies || [];
        const ts = player.tileSize;
        const reach = this.reachTiles * ts;
        const cx = player.x + player.width / 2;
        const cy = player.y + player.height / 2;
        let weaponX, weaponY;

        if (this.attackType === 'piercing') {
            const progress = (this.attackDuration - this.attackTimer) / this.attackDuration;
            const extend = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
            weaponX = cx + this.attackDir.dx * reach * extend;
            weaponY = cy + this.attackDir.dy * reach * extend;
        } else {
            const progress = (this.attackDuration - this.attackTimer) / this.attackDuration;
            const { startAngle, sweepAngle } = this._getSliceAngles(this.attackDir.dx, this.attackDir.dy, this.attackFacingRight);
            const currentAngle = startAngle + progress * sweepAngle;
            weaponX = cx + Math.cos(currentAngle) * reach;
            weaponY = cy + Math.sin(currentAngle) * reach;
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (!enemy.killedByBullets || this.hitEnemies.has(enemy)) continue;
            const ex = enemy.x + (enemy.width || ts) / 2;
            const ey = enemy.y + (enemy.height || ts) / 2;
            const dist = Math.sqrt((ex - weaponX) ** 2 + (ey - weaponY) ** 2);
            if (dist > ts) continue;
            this.hitEnemies.add(enemy);
            enemy.lives -= 1;
            enemy.phaseHitsTaken = (enemy.phaseHitsTaken || 0) + 1;
            if (enemy.lives <= 0) enemy.death();
        }

        if (this.canSliceBullets) this._sliceProjectiles(weaponX, weaponY, ts);
    }

    // Destroy nearby enemy projectiles (not the player's own good bullets) within the blade's reach.
    _sliceProjectiles(weaponX, weaponY, ts) {
        const projectiles = this.tileMapHandler.layers?.[4] || [];
        // Piercing only travels straight, so a box overlap is accurate; slicing sweeps an arc, so use radial distance.
        const weaponRect = { x: weaponX - ts / 2, y: weaponY - ts / 2, width: ts, height: ts, hitBoxOffset: 0 };
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
            if (projectile.isGood || projectile.type === ObjectTypes.ROTATING_FIREBALL_CENTER) continue;
            if (this.attackType === 'piercing') {
                if (!Collision.objectsColliding(weaponRect, projectile)) continue;
            } else {
                const px = projectile.x + (projectile.width || ts) / 2;
                const py = projectile.y + (projectile.height || ts) / 2;
                const dist = Math.sqrt((px - weaponX) ** 2 + (py - weaponY) ** 2);
                if (dist > ts) continue;
            }
            projectile.deleteObjectFromLevel(this.tileMapHandler);
        }
    }

    getEditableAttributes() {
        return {
            attackType: this.attackType,
            reachTiles: this.reachTiles,
            attackDuration: this.attackDuration,
            interval: this.interval,
            canSliceBullets: this.canSliceBullets ?? true,
            pickupSound: this.pickupSound,
        };
    }

    setEditableAttributes(attrs) {
        if (attrs.attackType !== undefined) this.attackType = attrs.attackType;
        if (attrs.reachTiles !== undefined) this.reachTiles = attrs.reachTiles;
        if (attrs.attackDuration !== undefined) this.attackDuration = attrs.attackDuration;
        if (attrs.interval !== undefined) this.interval = attrs.interval;
        if (attrs.canSliceBullets !== undefined) this.canSliceBullets = attrs.canSliceBullets;
        if (attrs.pickupSound !== undefined) this.pickupSound = attrs.pickupSound;
    }
}
