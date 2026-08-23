class Enemy18 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        this.stunDuration = 1;
        this.lives = 2;
        this.maxSpeed = 1.3;
        this.shootSound = 'gun4';
        this.movementBehaviour = this.movementBehaviours.startMovingLeft;
        this.gapBehaviour = this.gapBehaviours.changeDirection;
        this.wallBehaviour = this.wallBehaviours.changeDirection;
        // Shoot diagonally upward in the current walking direction with gravity and bouncing.
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
                    angle: 225,
                    randomAngleOffset: 0,
                    affectedByGravity: true,
                    gravity: 0.25,
                    speed: 9,
                    wallCollision: 'bounce',
                    lifeSpan: 120,
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
