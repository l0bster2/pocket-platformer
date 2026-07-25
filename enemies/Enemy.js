class Enemy extends InteractiveLevelObject {
    constructor(x, y, tileSize, type, hitBoxOffset, extraAttributes) {
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.key = this.makeid(5);

        // size
        this.width = tileSize - 2
        this.height = tileSize - 1
        this.heightOffset = 3
        this.hitBoxOffset = 0

        // physics
        this.speed = 0
        this.forcedJumpSpeed = 0;
        this.fixedSpeed = false;
        this.jumpSpeed = 0.44;

        // gravity
        this.gravity = 0.5
        this.currentGravity = this.gravity

        this.maxFallSpeed = tileSize / 1.5
        this.currentMaxFallSpeed = this.maxFallSpeed

        // jump system
        this.jumpframes = 0
        this.maxJumpFrames = 18
        this.jumpPressedToTheMax = true
        this.extraTrampolineJumpFrames = 3;

        // states
        this.falling = true
        this.swimming = false
        this.onIce = false

        // moving platform
        this.movingPlatformKey = null
        this.onMovingPlatform = false

        // previous frame
        this.prev_bottom = 0
        this.prev_bottom_y = 0

        // collision edges
        this.left = 0
        this.right = 0
        this.top = 0
        this.bottom = 0

        // tile values
        this.top_left = 0
        this.top_right = 0
        this.bottom_left = 0
        this.bottom_right = 0

        // pixel corners
        this.top_left_pos = {}
        this.top_right_pos = {}
        this.bottom_left_pos = {}
        this.bottom_right_pos = {}

        // extra collision
        this.extraHeightPoints = 0
        this.extraWidthPoints = 0
        this.heightForExtraColissionPoints = 0
        this.widthForExtraColissionPoints = 0

        this.extraLeftPoints = []
        this.extraRightPoints = []
        this.extraTopPoints = []
        this.extraBottomPoints = []

        this.extraSidePointsY = []
        this.extraBottomPointsX = []

        // trampoline
        this.previouslyTouchedTrampolines = false;
        this.walkDirections = {
            left: "left",
            right: "right",
            none: "none",
        }
        // Start facing left so timed behaviours (patrol/random) move on the very first frame
        // instead of waiting until the first direction change.
        this.walkDirection = this.walkDirections.left;
        // Movement behaviour decides how walkDirection is chosen each frame (see
        // EnemyMovementHandler.updateWalkDirection).
        this.movementBehaviours = {
            startMovingLeft: "startMovingLeft",
            startMovingRight: "startMovingRight",
            towardsPlayer: "towardsPlayer",
            patrol: "patrol",
            random: "random",
            awayFromPlayer: "awayFromPlayer",
            standStill: "standStill",
        }
        this.movementBehaviour = this.movementBehaviours.startMovingLeft;
        this.patrolDuration = 2.5; // seconds before a patrolling enemy reverses direction
        this.randomDuration = 3;   // seconds before a random-moving enemy picks a new direction
        this.movementTimer = 0;    // frame counter for patrol/random behaviours
        // What the enemy does when one foot is over a gap (an empty tile) and the other isn't.
        this.gapBehaviours = {
            changeDirection: "changeDirection",
            jump: "jump",
            continueWalking: "continueWalking",
        }
        this.gapBehaviour = this.gapBehaviours.changeDirection;
        // What the enemy does when it walks into a wall.
        this.wallBehaviours = {
            changeDirection: "changeDirection",
            continueWalking: "continueWalking",
        }
        this.wallBehaviour = this.wallBehaviours.changeDirection;
        // Flying enemies ignore gravity, gaps and jumping; they hover and move freely.
        this.flying = false;
        // Flying movement behaviour decides how a flying enemy steers each frame
        // (see EnemyFlyingHandler.updateFlying).
        this.flyingBehaviours = {
            moveHorizontally: "moveHorizontally",
            moveVertically: "moveVertically",
            followPlayer: "followPlayer",
            followPlayerPathfinding: "followPlayerPathfinding",
            alignPlayerHorizontally: "alignPlayerHorizontally",
            alignPlayerVertically: "alignPlayerVertically",
            horizontalPatrol: "horizontalPatrol",
            verticalPatrol: "verticalPatrol",
            diagonal: "diagonal",
            standStill: "standStill",
            random: "random",
        }
        this.flyingBehaviour = this.flyingBehaviours.moveHorizontally;
        this.flyingHorizontalDuration = 2; // seconds before a left/right flyer reverses
        this.flyingVerticalDuration = 2;   // seconds before an up/down flyer reverses
        this.flyingRandomDuration = 2;     // seconds before a random flyer picks a new heading
        // Whether the flying enemy collides with tiles/walls. Ghost-type flyers set this false
        // to phase through walls (they are still clamped to the level bounds).
        this.collidesWithWalls = true;
        // Runtime flying state (not persisted): current heading in degrees and frame timers.
        this.flyAngle = 180;        // 0 = right, 90 = down, 180 = left, 270 = up
        this.flyTimer = 0;          // frame counter for timed reversal / random behaviours
        this.flyRecomputeTimer = 0; // throttles player-tracking / pathfinding recomputation
        this.flyHasLineOfSight = false; // cached line-of-sight result for pathfinding behaviour
        this.flyPath = null;        // cached pathfinding waypoints
        this.flyPathIndex = 0;
        this.interativeObjects = [
            ObjectTypes.SPIKE,
            ObjectTypes.TRAMPOLINE,
            ObjectTypes.PORTAL,
            ObjectTypes.MOVING_PLATFORM,
            ObjectTypes.WATER
        ];
        
        // jumping
        this.jumping = false;
        this.jumpTimer = 0;
        this.jumpIntervalFrames = 120; // Jump every 2 seconds at 60 FPS
        this.jumpIntervalEnabled = false; // when true, the enemy jumps every jumpInterval seconds
        this.jumpInterval = 2; // seconds between interval jumps
        
        // enemy attributes
        this.lives = 1;
        this.canBeStomped = false;
        this.killsPlayer = true;
        this.stunDuration = 0; // seconds an enemy stays inactive after surviving a stomp (0 = no stun)
        // Whether the enemy is destroyed when it touches a spike / a player's bullet. Both default
        // to true; specific enemy types (e.g. the ghost) opt out in their own constructor.
        this.killedBySpikes = true;
        this.killedByBullets = true;
        // How the enemy looks when it dies (gameplay logic applied separately when value is used).
        this.deathAnimation = 'none';
        // Attack configuration: shooting is split into "phases", each with its own bullets, timing
        // and ammo. There is always at least one phase. Edited via the enemy editor's Attack tab.
        this.attackPhases = [{
            id: this.makeid(5),
            bullets: [],
            interval: 1,
            startDelay: 0,
            infiniteAmmo: true,
            ammo: 3,
            reloadTime: 2,
        }];
        // How the enemy advances from one attack phase to the next (only relevant with 2+ phases):
        // 'intervals' = after firing N volleys, 'seconds' = after N seconds, 'hits' = after being
        // hit N times. phaseHitsTaken counts hits at runtime (used by the 'hits' mode).
        this.phaseChangeMode = 'intervals';
        this.phaseChangeValue = 1;
        this.phaseHitsTaken = 0;
        
        // movement attributes (editable)
        this.maxSpeed = 2;
        this.currentMaxSpeed = 2;
        this.groundAcceleration = 0.6;
        this.air_acceleration = 0.6;
        this.groundFriction = 0.65;
        this.air_friction = 0.75;
        this.friction = this.air_friction;
        
        // animation
        this.currentAnimationIndex = 0;
        this.animationLengths = EnemyAnimationHelper.initializeAnimationLengths(this);
        // Default to the idle pose so the very first rendered frame of a level is idle.
        const idleSpriteIndex = EnemyAnimationHelper.findSpriteIndexByName(this, 'idle');
        this.currentSpriteIndex = idleSpriteIndex >= 0 ? idleSpriteIndex : 0; // Index within spriteObject array
        this.facingDirection = AnimationHelper.facingDirections.left;
        
        // activation system
        this.isActive = false; // Enemy starts inactive, activation config decides when it turns on
        this.activationConfig = { type: "alwaysActive" }; // activates immediately by default
        this.inactivationConfig = { type: "neverInactive" }; // never deactivates by default
        this.activationTimer = 0;
        this.inactivationTimer = 0;
        // Temporary, gameplay-only activation override used when the enemy is stunned after a
        // survived stomp. Reuses the "after seconds" reactivation logic without touching the
        // saved activation config.
        this.stunReactivationConfig = null;
        // Runtime hurt-flash counter. Counts down from a set value each frame; alpha is reduced
        // while > 0 to give visual feedback that the enemy was damaged.
        this.hurtFrames = 0;
        
        this.resetObject();
    }

    resetObject() {
        this.x = this.initialX * this.tileSize;
        this.y = this.initialY * this.tileSize;
        this.resetSpeed();
    }

    resetSpeed() {
        // velocity
        this.xspeed = 0
        this.yspeed = 0
        this.bonusSpeedX = 0
        this.bonusSpeedY = 0
    }

    hitWall(direction) {
        if (this.flying) {
            // Flying enemies bounce off walls by reversing their heading instead of landing.
            EnemyFlyingHandler.handleWallCollision(this, direction);
            return;
        }
        switch (direction) {
            case AnimationHelper.facingDirections.bottom:
                this.hitBottom();
                break;
            case AnimationHelper.facingDirections.top:
                this.hitTop();
                break;
            case AnimationHelper.facingDirections.left:
                this.horizontalHit();
                if (this.wallBehaviour === this.wallBehaviours.changeDirection) {
                    this.walkDirection = this.walkDirections.right;
                }
                break;
            case AnimationHelper.facingDirections.right:
                this.horizontalHit();
                if (this.wallBehaviour === this.wallBehaviours.changeDirection) {
                    this.walkDirection = this.walkDirections.left;
                }
        }
    }

    resetJump() {
        this.jumpframes = 0;
        this.currentCoyoteJumpFrame = 0;
    }

    horizontalHit() {
        EnemyMovementHandler.handleHorizontalCollision(this);
    }

    verticalHit() {
        EnemyMovementHandler.handleVerticalCollision(this);
    }

    hitBottom(onPlatform) {
        EnemyMovementHandler.handleBottomCollision(this, onPlatform);
    }

    hitTop() {
        EnemyMovementHandler.handleTopCollision(this);
        if (this.onMovingPlatform) {
            //PlayMode.thisDeath();
        }
    }

    walkHandler() {
        EnemyMovementHandler.updateWalking(this);
    }

    slowDownBonusSpeedX() {
        EnemyMovementHandler.slowDownBonusSpeedX(this);
    }

    slowDownBonusSpeedY() {
        EnemyMovementHandler.slowDownBonusSpeedY(this);
    }

    fallHandler() {
        EnemyMovementHandler.updateFalling(this);
    }

    correctMaxYSpeed() {
        EnemyMovementHandler.correctMaxFallSpeed(this);
    }

    setStretchAnimation() {
        AnimationHelper.setSquishValues(this, (this.width + this.widthOffset) * 1.2, (this.height + this.heightOffset) * 0.8);
    }

    checkHazardCollisions() {
        EnemyCollisionHandler.checkHazardCollisions(this);
    }

    //for now it's used for bullets (canonballs and rockets), which can be deleted during game-time
    deleteEnemyFromLevel(tilemapHandler, showSfx = true) {
        showSfx && SFXHandler.createSFX(this.x, this.y, 1)
        for (var i = tilemapHandler.enemies.length - 1; i >= 0; i--) {
            var levelObject = tilemapHandler.enemies[i];
            if (this.key === levelObject.key && levelObject.initialX === this.initialX && levelObject.initialY === this.initialY && levelObject.type === this.type) {
                tilemapHandler.enemies.splice(i, 1);
                break;
            }
        }
    }

    death() {
        if (this.deathAnimation === 'upwardsAndRotate') {
            SFXHandler.createSFX(this.x, this.y, 1);
            DeadEnemyHandler.add(this);
        } else {
            SFXHandler.createSFX(this.x, this.y, 1);
        }
        this.deleteEnemyFromLevel(tileMapHandler, false);
    }

    draw(spriteCanvas) {
        // Update activation state
        this.updateActivationState();

        // Hurt flash: tick down once per frame and reduce alpha while active.
        if (this.hurtFrames > 0) {
            this.hurtFrames--;
            Display.ctx.globalAlpha = this.hurtFrames % 6 < 3 ? 0.3 : 1;
        }

        // Only execute enemy logic if active
        if (!this.isActive) {
            // Bleed off momentum with friction so the enemy glides to a halt instead of
            // stopping abruptly. Flying enemies apply air_friction to both axes; walking enemies
            // use ground friction on xspeed and bonusSpeedX.
            if (!this.fixedSpeed) {
                const f = this.flying ? this.air_friction : this.friction;
                this.xspeed *= f;
                if (Math.abs(this.xspeed) < 0.5) this.xspeed = 0;
                if (this.flying) {
                    this.yspeed *= f;
                    if (Math.abs(this.yspeed) < 0.5) this.yspeed = 0;
                }
                this.bonusSpeedX *= f;
                if (Math.abs(this.bonusSpeedX) < 0.3) this.bonusSpeedX = 0;
            }
            // Reset attack timers so the start delay is honoured again on the next activation.
            EnemyAttackHandler.resetState(this);
            this.checkPlayerCollision();
            EnemyAnimationHelper.updateAnimation(this, spriteCanvas);
            Display.ctx.globalAlpha = 1;
            return;
        }

        this.checkHazardCollisions();
        this.checkPlayerCollision();
        // Spawn bullets according to this enemy type's configured attack phases.
        EnemyAttackHandler.updateAttack(this);
        // updateJump still runs every frame so in-progress jumps (including gap jumps and
        // trampoline launches) finish; the interval jump itself only starts when enabled.
        EnemyJumpHandler.updateJump(this, Math.round(this.jumpInterval * 60));
        
        // Update animation
        EnemyAnimationHelper.updateAnimation(this, spriteCanvas);
        Display.ctx.globalAlpha = 1;
    }

    /**
     * Check collision with the player: stomping (player lands on top) or damaging the player.
     */
    checkPlayerCollision() {
        EnemyCollisionHandler.checkPlayerCollision(this);
    }

    /**
     * Player jumped on top of this enemy: lose a life (die at 0) and bounce the player.
     */
    getStomped(player) {
        EnemyCollisionHandler.getStomped(this, player);
    }

    /**
     * Update activation state based on conditions
     */
    updateActivationState() {
        // Activation/deactivation is a play-time behavior. Skipping it in build mode keeps the
        // timers from ticking while editing, so e.g. "active after 1 second" is measured from
        // the moment play starts.
        if (Game.playMode !== Game.PLAY_MODE) {
            return;
        }

        if (this.isActive) {
            // Check if should deactivate
            if (EnemyActivationHandler.shouldDeactivate(this, this.inactivationConfig)) {
                this.isActive = false;
                // Leftover momentum is bled off with friction each frame in draw(), so
                // the enemy glides to a halt instead of stopping abruptly.
                EnemyActivationHandler.resetTimers(this);
            }
        } else {
            // While stunned (from a survived stomp) the enemy reactivates via the temporary stun
            // timer instead of its configured activation condition; otherwise the saved config is
            // used. The stun override is gameplay-only and never persisted.
            const activationCondition = this.stunReactivationConfig || this.activationConfig;
            if (EnemyActivationHandler.shouldActivate(this, activationCondition)) {
                this.isActive = true;
                this.stunReactivationConfig = null;
                EnemyActivationHandler.resetTimers(this);
            }
        }
    }

    /**
     * Set activation conditions for this enemy
     * @param {Object} activationConfig - Activation configuration {type, value}
     * @param {Object} inactivationConfig - Inactivation configuration {type, value}
     */
    setActivationConditions(activationConfig, inactivationConfig) {
        this.activationConfig = activationConfig;
        this.inactivationConfig = inactivationConfig;
    }

    /**
     * Get all editable attributes as an object for export
     */
    getEditableAttributes() {
        return {
            lives: this.lives,
            canBeStomped: this.canBeStomped,
            killsPlayer: this.killsPlayer,
            stunDuration: this.stunDuration,
            killedBySpikes: this.killedBySpikes,
            killedByBullets: this.killedByBullets,
            attackPhases: this.attackPhases,
            phaseChangeMode: this.phaseChangeMode,
            phaseChangeValue: this.phaseChangeValue,
            maxSpeed: this.maxSpeed,
            jumpSpeed: this.jumpSpeed,
            maxJumpFrames: this.maxJumpFrames,
            groundAcceleration: this.groundAcceleration,
            air_acceleration: this.air_acceleration,
            groundFriction: this.groundFriction,
            air_friction: this.air_friction,
            movementBehaviour: this.movementBehaviour,
            patrolDuration: this.patrolDuration,
            randomDuration: this.randomDuration,
            gapBehaviour: this.gapBehaviour,
            wallBehaviour: this.wallBehaviour,
            flying: this.flying,
            flyingBehaviour: this.flyingBehaviour,
            flyingHorizontalDuration: this.flyingHorizontalDuration,
            flyingVerticalDuration: this.flyingVerticalDuration,
            flyingRandomDuration: this.flyingRandomDuration,
            collidesWithWalls: this.collidesWithWalls,
            jumpIntervalEnabled: this.jumpIntervalEnabled,
            jumpInterval: this.jumpInterval,
            activationConfig: this.activationConfig,
            inactivationConfig: this.inactivationConfig,
            deathAnimation: this.deathAnimation,
        };
    }

    /**
     * Set editable attributes from imported data
     */
    setEditableAttributes(attributes) {
        if (attributes.lives !== undefined) this.lives = attributes.lives;
        if (attributes.canBeStomped !== undefined) this.canBeStomped = attributes.canBeStomped;
        if (attributes.killsPlayer !== undefined) this.killsPlayer = attributes.killsPlayer;
        if (attributes.stunDuration !== undefined) this.stunDuration = attributes.stunDuration;
        if (attributes.killedBySpikes !== undefined) this.killedBySpikes = attributes.killedBySpikes;
        if (attributes.killedByBullets !== undefined) this.killedByBullets = attributes.killedByBullets;
        if (attributes.attackPhases !== undefined) this.attackPhases = attributes.attackPhases;
        if (attributes.phaseChangeMode !== undefined) this.phaseChangeMode = attributes.phaseChangeMode;
        if (attributes.phaseChangeValue !== undefined) this.phaseChangeValue = attributes.phaseChangeValue;
        if (attributes.maxSpeed !== undefined) this.maxSpeed = attributes.maxSpeed;
        if (attributes.jumpSpeed !== undefined) this.jumpSpeed = attributes.jumpSpeed;
        if (attributes.maxJumpFrames !== undefined) this.maxJumpFrames = attributes.maxJumpFrames;
        if (attributes.groundAcceleration !== undefined) this.groundAcceleration = attributes.groundAcceleration;
        if (attributes.air_acceleration !== undefined) this.air_acceleration = attributes.air_acceleration;
        if (attributes.groundFriction !== undefined) this.groundFriction = attributes.groundFriction;
        if (attributes.air_friction !== undefined) this.air_friction = attributes.air_friction;
        if (attributes.patrolDuration !== undefined) this.patrolDuration = attributes.patrolDuration;
        if (attributes.randomDuration !== undefined) this.randomDuration = attributes.randomDuration;
        if (attributes.gapBehaviour !== undefined) this.gapBehaviour = attributes.gapBehaviour;
        if (attributes.wallBehaviour !== undefined) this.wallBehaviour = attributes.wallBehaviour;
        if (attributes.flying !== undefined) {
            this.flying = attributes.flying;
            if (this.flying) EnemyFlyingHandler.resetFlyingState(this);
        }
        if (attributes.flyingHorizontalDuration !== undefined) this.flyingHorizontalDuration = attributes.flyingHorizontalDuration;
        if (attributes.flyingVerticalDuration !== undefined) this.flyingVerticalDuration = attributes.flyingVerticalDuration;
        if (attributes.flyingRandomDuration !== undefined) this.flyingRandomDuration = attributes.flyingRandomDuration;
        if (attributes.collidesWithWalls !== undefined) this.collidesWithWalls = attributes.collidesWithWalls;
        if (attributes.flyingBehaviour !== undefined) {
            this.flyingBehaviour = attributes.flyingBehaviour;
            if (this.flying) EnemyFlyingHandler.resetFlyingState(this);
        }
        if (attributes.jumpIntervalEnabled !== undefined) this.jumpIntervalEnabled = attributes.jumpIntervalEnabled;
        if (attributes.jumpInterval !== undefined) this.jumpInterval = attributes.jumpInterval;
        if (attributes.movementBehaviour !== undefined) {
            this.movementBehaviour = attributes.movementBehaviour;
            // "Starts moving" modes define the initial direction; set it now so editing the
            // attribute (or spawning the enemy) immediately reflects the chosen start direction.
            if (this.movementBehaviour === this.movementBehaviours.startMovingLeft) {
                this.walkDirection = this.walkDirections.left;
            } else if (this.movementBehaviour === this.movementBehaviours.startMovingRight) {
                this.walkDirection = this.walkDirections.right;
            }
            this.movementTimer = 0;
        }
        if (attributes.activationConfig !== undefined) this.activationConfig = attributes.activationConfig;
        if (attributes.inactivationConfig !== undefined) this.inactivationConfig = attributes.inactivationConfig;
        if (attributes.deathAnimation !== undefined) this.deathAnimation = attributes.deathAnimation;
    }

}