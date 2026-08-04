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

    // Only render while actively attacking
    drawOnPlayer(player) {
        this._ensureRuntimeState();
        if (this.attackTimer <= 0 || !this.attackDir) return;
        if (this.attackType === 'piercing') {
            this._drawPiercing(player);
        } else {
            this._drawSlicing(player);
        }
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
        if (dx < 0) {
            Display.drawImageFlippedX(
                player.spriteCanvas,
                this.canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                wx, wy, ts, ts, Math.atan2(dy, -dx)
            );
        } else {
            Display.drawImageWithRotation(
                player.spriteCanvas,
                this.canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                wx, wy, ts, ts, Math.atan2(dy, dx)
            );
        }
    }

    _drawSlicing(player) {
        const progress = (this.attackDuration - this.attackTimer) / this.attackDuration;
        const { startAngle, sweepAngle } = this._getSliceAngles(this.attackDir.dx, this.attackDir.dy, this.attackFacingRight);
        const currentAngle = startAngle + progress * sweepAngle;
        const ts = player.tileSize;
        const reach = this.reachTiles * ts;
        const cx = player.x + player.width / 2;
        const cy = player.y + player.height / 2;
        const wx = Math.round(cx + Math.cos(currentAngle) * reach);
        const wy = Math.round(cy + Math.sin(currentAngle) * reach);
        Display.drawImageWithRotation(
            player.spriteCanvas,
            this.canvasXSpritePos, this.canvasYSpritePos, ts, ts,
            wx - ts / 2, wy - ts / 2, ts, ts,
            currentAngle
        );
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
    }

    getEditableAttributes() {
        return {
            attackType: this.attackType,
            reachTiles: this.reachTiles,
            attackDuration: this.attackDuration,
            interval: this.interval,
            pickupSound: this.pickupSound,
        };
    }

    setEditableAttributes(attrs) {
        if (attrs.attackType !== undefined) this.attackType = attrs.attackType;
        if (attrs.reachTiles !== undefined) this.reachTiles = attrs.reachTiles;
        if (attrs.attackDuration !== undefined) this.attackDuration = attrs.attackDuration;
        if (attrs.interval !== undefined) this.interval = attrs.interval;
        if (attrs.pickupSound !== undefined) this.pickupSound = attrs.pickupSound;
    }
}
