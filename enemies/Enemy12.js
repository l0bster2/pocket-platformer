/**
 * Turret: floats at constant height, tracks the player on the X axis and fires
 * gravity-affected bullets straight up with a wide random spread.
 */
class Enemy12 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        this.deathAnimation = 'upwardsAndRotate';
        // Flying — hovers freely and is never deactivated.
        this.flying = true;
        this.falling = false;
        this.flyingBehaviour = this.flyingBehaviours.alignPlayerHorizontally;
        this.collidesWithWalls = true;
        EnemyFlyingHandler.resetFlyingState(this);
        this.activationConfig   = { type: 'playerApproxSameX', value: 1 };
        this.inactivationConfig = { type: 'neverInactive', value: 2 };
        // Speed and acceleration: fast top speed, very slow build-up.
        this.maxSpeed = 3.2;
        this.currentMaxSpeed = 3.2;
        this.air_acceleration = 0.17;
        this.air_friction = 0.97;
        // Fires three bullets straight up with heavy random spread, then reloads.
        this.attackPhases = [{
            id: this.makeid(5),
            interval: 0.3,
            startDelay: 0,
            infiniteAmmo: false,
            ammo: 3,
            reloadTime: 2,
            bullets: [{
                id: this.makeid(5),
                angle: 270,
                randomAngleOffset: 50,
                affectedByGravity: true,
                gravity: 0.2,
                speed: 5,
                collidesWithWalls: false,
                shootInPlayerDirection: false,
                shootDirectlyAtPlayer: false,
                spriteDescriptiveName: "Bullet 2",
            }],
        }];
    }

}
