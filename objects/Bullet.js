/**
 * A projectile that travels in a straight line (optionally arcing when affected by gravity).
 *
 * A bullet is either "bad" (isGood = false) — shot by enemies, kills the player on contact — or
 * "good" (isGood = true) — shot by the player, damages enemies that are flagged `killedByBullets`.
 * (Player shooting doesn't exist yet, but the good-bullet path is already wired up.)
 *
 * Configurable through extraAttributes:
 * - isGood:               boolean, whether the bullet hurts enemies (true) or the player (false).
 * - speed:                number, travel speed in pixels per frame.
 * - angle:                number, travel direction in degrees (0 = right, 90 = down, 180 = left, 270 = up).
 * - wallCollision:        'destroy'|'bounce'|'none'. 'destroy' stops the bullet on wall contact,
 *                         'bounce' reflects it off walls, 'none' phases through walls.
 * - affectedByGravity:    boolean, whether gravity is applied to the vertical velocity each frame.
 * - gravity:              number, gravity strength applied while affectedByGravity is true.
 * - spriteDescriptiveName:string, optional descriptiveName of a sprite (from SpritePixelArrays)
 *                         used to override the default bullet sprite.
 */
class Bullet extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.tileMapHandler = tileMapHandler;
        this.key = this.makeid(5);
        this.passableTiles = [0, 5];

        this.isGood = extraAttributes.isGood ?? false;
        this.speed = extraAttributes.speed ?? 3;
        this.angle = extraAttributes.angle ?? 0;
        // legacy boolean support
        const legacyCollides = extraAttributes.collidesWithWalls !== false ? 'destroy' : 'none';
        this.wallCollision = extraAttributes.wallCollision ?? legacyCollides;
        this.affectedByGravity = extraAttributes.affectedByGravity ?? false;
        this.gravity = extraAttributes.gravity ?? 0.2;
        this.deceleration = extraAttributes.deceleration ?? 0;
        this.interactsWithSwitches = extraAttributes.interactsWithSwitches ?? false;

        // Allow overriding the default bullet sprite with any sprite by its descriptiveName.
        const spriteDescriptiveName = extraAttributes.spriteDescriptiveName;
        if (spriteDescriptiveName) {
            const overrideSprite = SpritePixelArrays.getSpritesByDescrpitiveName(spriteDescriptiveName);
            if (overrideSprite?.length) {
                this.spriteObject = overrideSprite;
                this.canvasYSpritePos = overrideSprite[0].canvasYPos;
            }
        }

        // Seed the live velocity from the initial angle + speed. Gravity later bends this vector.
        const radians = MathHelpers.getRadians(this.angle);
        this.firedX = Math.cos(radians) * this.speed;
        this.firedY = Math.sin(radians) * this.speed;
        this.gravityY = 0; // gravity accumulates separately so deceleration never fights it
        this.xspeed = this.firedX;
        this.yspeed = this.firedY;
    }

    /**
     * Called by CharacterCollision when the bullet overlaps the player. Only bad bullets hurt him.
     */
    collisionEvent() {
        if (!this.isGood) {
            PlayMode.playerDeath();
        }
    }

    draw(spriteCanvas) {
        if (Game.playMode === Game.PLAY_MODE) {
            this.updatePosition();
            if (this.deceleration && Math.hypot(this.firedX, this.firedY) < 0.05) {
                this.deleteObjectFromLevel(this.tileMapHandler, false);
                return;
            }
            if (this.lifeSpan !== undefined && --this.lifeSpan <= 0) {
                this.deleteObjectFromLevel(this.tileMapHandler, false);
                return;
            }
            if (this.handleWallCollision()) {
                return;
            }
            if (this.isOutOfBounds()) {
                this.deleteObjectFromLevel(this.tileMapHandler, false);
                return;
            }
            this.checkCharacterCollisions();
        }
        // Rotate the sprite so it points along its current travel direction.
        // The bullet sprites face left by default, so offset by π to flip them to face right.
        super.drawWithRotation(spriteCanvas, Math.atan2(this.yspeed, this.xspeed) + Math.PI);
    }

    updatePosition() {
        if (this.affectedByGravity) {
            this.gravityY += this.gravity;
        }
        if (this.deceleration) {
            this.firedX *= (1 - this.deceleration);
            this.firedY *= (1 - this.deceleration);
        }
        this.xspeed = this.firedX;
        this.yspeed = this.firedY + this.gravityY;
        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    /**
     * Handle bullet-wall interactions based on wallCollision mode.
     * Returns true when the bullet was removed.
     */
    handleWallCollision() {
        if (this.wallCollision === 'none' && !this.interactsWithSwitches) return false;
        const cornerHitBox = 2;
        const left = this.x + cornerHitBox;
        const top = this.y + cornerHitBox;
        const right = this.x + this.tileSize - cornerHitBox;
        const bottom = this.y + this.tileSize - cornerHitBox;
        const centerX = this.x + this.tileSize / 2;
        const centerY = this.y + this.tileSize / 2;

        const getTile = (x, y) => {
            const xPos = this.tileMapHandler.getTileValueForPosition(x);
            const yPos = this.tileMapHandler.getTileValueForPosition(y);
            return this.tileMapHandler.getTileLayerValueByIndex(yPos, xPos);
        };
        const isSolid = (x, y) => {
            const v = getTile(x, y);
            if (typeof v === 'undefined') return true;
            if (v === 0) return false;
            if (v === 5) return this.yspeed > 0; // one-way platform: solid only when entering from above
            return !this.passableTiles.includes(v);
        };

        if (this.interactsWithSwitches) {
            for (const corner of [{ x: left, y: top }, { x: right, y: top }, { x: right, y: bottom }, { x: left, y: bottom }]) {
                const v = getTile(corner.x, corner.y);
                if (v === ObjectTypes.SPECIAL_BLOCK_VALUES.redBlueSwitch) {
                    const xPos = this.tileMapHandler.getTileValueForPosition(corner.x);
                    const yPos = this.tileMapHandler.getTileValueForPosition(corner.y);
                    const switchBlock = this.tileMapHandler.levelObjects.find(
                        obj => obj.initialX === xPos && obj.initialY === yPos
                    );
                    if (switchBlock) switchBlock.switchWasHit();
                    if (this.wallCollision === 'destroy') {
                        this.deleteObjectFromLevel(this.tileMapHandler);
                        return true;
                    }
                }
            }
        }

        if (this.wallCollision === 'none') return false;

        if (this.wallCollision === 'destroy') {
            if (isSolid(left, top) || isSolid(right, top) || isSolid(right, bottom) || isSolid(left, bottom)) {
                this.deleteObjectFromLevel(this.tileMapHandler);
                return true;
            }
            return false;
        }

        if (this.wallCollision === 'bounce') {
            const hitX = isSolid(left, centerY) || isSolid(right, centerY);
            const hitY = isSolid(centerX, top) || isSolid(centerX, bottom);
            if (hitX) {
                this.firedX *= -1;
                this.xspeed = this.firedX;
                this.x += this.xspeed;
            }
            if (hitY) {
                // reflect total Y velocity and restart gravity from zero so it accumulates correctly after the bounce
                this.firedY = -(this.firedY + this.gravityY);
                this.gravityY = 0;
                this.yspeed = this.firedY;
                this.y += this.yspeed;
            }
            return false;
        }

        return false;
    }

    /**
     * A wall-phasing bullet would otherwise fly forever, so remove it once it leaves the level.
     */
    isOutOfBounds() {
        const margin = this.tileSize;
        return this.x < -margin
            || this.y < -margin
            || this.x > this.tileMapHandler.levelWidthInPx + margin
            || this.y > this.tileMapHandler.levelHeightInPx + margin;
    }

    checkCharacterCollisions() {
        if (this.isGood) {
            // Player bullets damage enemies that can be killed by bullets.
            const enemies = this.tileMapHandler.enemies || [];
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
                if (Collision.objectsColliding(this, enemy)) {
                    if (enemy.killedByBullets) {
                        enemy.lives -= 1;
                        enemy.phaseHitsTaken = (enemy.phaseHitsTaken || 0) + 1;
                        if (enemy.lives <= 0) {
                            enemy.death();
                        } else {
                            enemy.hurtFrames = 30;
                            if (enemy.hitSound) SoundHandler[enemy.hitSound].stopAndPlay();
                            AnimationHelper.setSquishValues(enemy, (enemy.width + enemy.widthOffset) * 1.2, (enemy.height + enemy.heightOffset) * 0.6);
                        }
                    }
                    this.deleteObjectFromLevel(this.tileMapHandler);
                    return;
                }
            }
        } else {
            // Enemy bullets kill the player on contact.
            const player = this.tileMapHandler.player;
            if (player && !player.death && Collision.objectsColliding(this, player)) {
                PlayMode.playerDeath();
                this.deleteObjectFromLevel(this.tileMapHandler);
            }
        }
    }
}
