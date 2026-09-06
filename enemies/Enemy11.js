/**
 * Snake: patrols left and right, always changes direction at gaps and walls.
 * Shoots horizontally in both directions at intervals (not tracking the player).
 * Has 2 lives and is briefly stunned after surviving a stomp.
 */
class Enemy11 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        this.stunDuration = 1;
        this.lives = 2;
        // Simple left/right patrol; always turns at gaps and walls.
        this.shootSound = 'gun4';
        this.movementBehaviour = this.movementBehaviours.startMovingLeft;
        this.gapBehaviour = this.gapBehaviours.changeDirection;
        this.wallBehaviour = this.wallBehaviours.changeDirection;
        // Shoot horizontally in the current walking direction.
        this.attackPhases = [{
            id: this.makeid(5),
            interval: 2.5,
            startDelay: 1,
            infiniteAmmo: true,
            ammo: 3,
            reloadTime: 2,
            bullets: [
                {
                    id: this.makeid(5),
                    angle: 180,
                    randomAngleOffset: 0,
                    affectedByGravity: false,
                    gravity: 0,
                    speed: 4,
                    wallCollision: 'destroy',
                    lifeSpan: 300,
                    shootInPlayerDirection: false,
                    shootDirectlyAtPlayer: false,
                    shootInWalkDirection: true,
                    spriteDescriptiveName: "Bullet",
                },
            ],
        }];
        this.deathAnimation = 'upwardsAndRotate';
    }

}
