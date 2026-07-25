/**
 * Sentinel: stands still and watches. Fires a single bullet toward the player
 * when it has line of sight, and freezes again the moment vision is lost.
 */
class Enemy13 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        this.deathAnimation = 'upwardsAndRotate';
        this.movementBehaviour = this.movementBehaviours.standStill;
        this.activationConfig   = { type: 'canSeePlayer' };
        this.inactivationConfig = { type: 'notSeeingPlayer' };
        this.attackPhases = [{
            id: this.makeid(5),
            interval: 2,
            startDelay: 0.5,
            infiniteAmmo: true,
            ammo: 1,
            reloadTime: 0,
            bullets: [{
                id: this.makeid(5),
                angle: 0,
                randomAngleOffset: 0,
                affectedByGravity: false,
                gravity: 0,
                speed: 5,
                collidesWithWalls: true,
                shootInPlayerDirection: true,
                shootDirectlyAtPlayer: true,
                spriteDescriptiveName: "Bullet 3",
            }],
        }];
    }

}
