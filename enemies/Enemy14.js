/**
 * Flying phantom that stands still and teleports around the level.
 * Fires three rapid bullets directly at the player between teleports.
 */
class Enemy14 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);

        // Flying, stationary
        this.flying = true;
        EnemyFlyingHandler.resetFlyingState(this);
        this.flyingBehaviour = 'standStill';
        this.canBeStomped = true;
        this.deathAnimation = 'upwardsAndRotate';

        // Teleport every 4 seconds, up to 8 tiles away
        this.teleportEnabled     = true;
        this.teleportInterval    = 4;
        this.teleportMaxDistance = 8;

        // Fire 3 rapid bullets aimed directly at the player, then reload for 3 seconds
        this.attackPhases = [{
            id: this.makeid(5),
            interval: 0.25,
            startDelay: 1,
            infiniteAmmo: false,
            ammo: 3,
            reloadTime: 3,
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
