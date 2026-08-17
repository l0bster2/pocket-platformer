/**
 * Flying "spread shooter". Hovers in place and alternates between two attack phases:
 *   Phase 1: fires four bullets in the cardinal directions (up / right / down / left).
 *   Phase 2: fires four bullets in the diagonal directions.
 * It switches phase after every interval, producing a rotating 8-way barrage.
 */
class Enemy10 extends Enemy6 {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, tilemapHandler, extraAttributes);
        // Hover in place instead of drifting so the spread pattern stays centred.
        this.flyingBehaviour = this.flyingBehaviours.standStill;
        this.shootSound = 'gun4';
        EnemyFlyingHandler.resetFlyingState(this);

        // Advance to the next phase after each single interval (volley).
        this.phaseChangeMode = 'intervals';
        this.phaseChangeValue = 1;

        this.attackPhases = [
            {
                id: this.makeid(5),
                interval: 2,
                startDelay: 0,
                infiniteAmmo: true,
                ammo: 3,
                reloadTime: 2,
                // Cardinal directions: right (0), down (90), left (180), up (270).
                bullets: [0, 90, 180, 270].map(angle => this.makeSpreadBullet(angle)),
            },
            {
                id: this.makeid(5),
                interval: 2,
                startDelay: 0,
                infiniteAmmo: true,
                ammo: 3,
                reloadTime: 2,
                // Diagonal directions: down-right (45), down-left (135), up-left (225), up-right (315).
                bullets: [45, 135, 225, 315].map(angle => this.makeSpreadBullet(angle)),
            },
        ];
    }

    makeSpreadBullet(angle) {
        return {
            id: this.makeid(5),
            angle,
            randomAngleOffset: 0,
            affectedByGravity: false,
            gravity: 0.2,
            speed: 3,
            collidesWithWalls: true,
            shootInPlayerDirection: false,
            shootDirectlyAtPlayer: false,
            spriteDescriptiveName: "Bullet",
        };
    }
}
