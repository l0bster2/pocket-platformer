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
 * - collidesWithWalls:    boolean, whether solid tiles stop/destroy the bullet. When false the
 *                         bullet phases through walls and is removed once it leaves the level.
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
        this.collidesWithWalls = extraAttributes.collidesWithWalls ?? true;
        this.affectedByGravity = extraAttributes.affectedByGravity ?? false;
        this.gravity = extraAttributes.gravity ?? 0.2;

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
        this.xspeed = Math.cos(radians) * this.speed;
        this.yspeed = Math.sin(radians) * this.speed;
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
            if (this.handleWallCollision()) {
                return;
            }
            if (this.isOutOfBounds()) {
                this.deleteObjectFromLevel(this.tileMapHandler, false);
                return;
            }
            this.checkCharacterCollisions();
        }
        // Rotate the sprite so it points along its current travel direction (gravity arcs included).
        super.drawWithRotation(spriteCanvas, Math.atan2(this.yspeed, this.xspeed));
    }

    updatePosition() {
        if (this.affectedByGravity) {
            this.yspeed += this.gravity;
        }
        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    /**
     * Destroy the bullet when it hits a solid tile (only while collidesWithWalls is enabled).
     * Returns true when the bullet was removed.
     */
    handleWallCollision() {
        if (!this.collidesWithWalls) {
            return false;
        }
        const cornerHitBox = 2;
        const left = this.x + cornerHitBox;
        const top = this.y + cornerHitBox;
        const right = this.x + this.tileSize - cornerHitBox;
        const bottom = this.y + this.tileSize - cornerHitBox;
        const corners = [
            { x: left, y: top },
            { x: right, y: top },
            { x: right, y: bottom },
            { x: left, y: bottom },
        ];
        const hitSolidTile = corners.some(corner => {
            const xPos = this.tileMapHandler.getTileValueForPosition(corner.x);
            const yPos = this.tileMapHandler.getTileValueForPosition(corner.y);
            const tileValue = this.tileMapHandler.getTileLayerValueByIndex(yPos, xPos);
            return typeof tileValue === 'undefined' || !this.passableTiles.includes(tileValue);
        });
        if (hitSolidTile) {
            this.deleteObjectFromLevel(this.tileMapHandler);
            return true;
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
                if (enemy.killedByBullets && Collision.objectsColliding(this, enemy)) {
                    enemy.lives -= 1;
                    enemy.phaseHitsTaken = (enemy.phaseHitsTaken || 0) + 1;
                    if (enemy.lives <= 0) {
                        enemy.death();
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
