/**
 * Patrols left and right (reversing every 2 seconds) and jumps from time to time.
 * Always active by default.
 */
class Enemy5 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = true;
        // Walks back and forth, switching direction every 2 seconds.
        this.movementBehaviour = this.movementBehaviours.patrol;
        this.patrolDuration = 2;
        // Jumps every couple of seconds while patrolling.
        this.jumpIntervalEnabled = true;
        this.jumpInterval = 2;
        this.jumpSpeed = 1;
        // Default attack: lob a gravity-affected bullet down-left (244°) with a slight random
        // spread, three shots then a short reload.
        this.attackPhases = [{
            id: this.makeid(5),
            interval: 0.3,
            startDelay: 0,
            infiniteAmmo: false,
            ammo: 3,
            reloadTime: 2,
            bullets: [{
                id: this.makeid(5),
                angle: 244,
                randomAngleOffset: 10,
                affectedByGravity: true,
                gravity: 0.2,
                speed: 5,
                collidesWithWalls: false,
                shootInPlayerDirection: true,
                shootDirectlyAtPlayer: false,
                spriteDescriptiveName: "Bullet",
            }],
        }];
        this.deathAnimation = 'upwardsAndRotate';
    }

    draw(spriteCanvas) {
        super.draw(spriteCanvas);
        if (Game.playMode === Game.PLAY_MODE) {
            this.isActive && super.walkHandler();
            this.forcedJumpSpeed !== 0 && EnemyJumpHandler.performJump(this, this.forcedJumpSpeed, this.maxJumpFrames + this.extraTrampolineJumpFrames);
            super.fallHandler();
            super.correctMaxYSpeed();
            CharacterCollision.checkFloorAndTileCollision(this, false);
        }
    }
}
