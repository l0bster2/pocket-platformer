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
        // Flying enemies ignore gravity, gaps and jumping; they hover and move horizontally.
        this.flying = false;
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
        this.deleteEnemyFromLevel(tileMapHandler, true);
    }

    draw(spriteCanvas) {
        // Update activation state
        this.updateActivationState();

        // Only execute enemy logic if active
        if (!this.isActive) {
            // Render the idle sprite while inactive (speed was already cleared on deactivation).
            EnemyAnimationHelper.updateAnimation(this, spriteCanvas);
            return;
        }

        this.checkHazardCollisions();
        this.checkPlayerCollision();
        // updateJump still runs every frame so in-progress jumps (including gap jumps and
        // trampoline launches) finish; the interval jump itself only starts when enabled.
        EnemyJumpHandler.updateJump(this, Math.round(this.jumpInterval * 60));
        
        // Update animation
        EnemyAnimationHelper.updateAnimation(this, spriteCanvas);
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
                // Drop any leftover walking momentum so the enemy stops in place.
                this.xspeed = 0;
                this.bonusSpeedX = 0;
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
            maxSpeed: this.maxSpeed,
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
            jumpIntervalEnabled: this.jumpIntervalEnabled,
            jumpInterval: this.jumpInterval,
            activationConfig: this.activationConfig,
            inactivationConfig: this.inactivationConfig,
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
        if (attributes.maxSpeed !== undefined) this.maxSpeed = attributes.maxSpeed;
        if (attributes.groundAcceleration !== undefined) this.groundAcceleration = attributes.groundAcceleration;
        if (attributes.air_acceleration !== undefined) this.air_acceleration = attributes.air_acceleration;
        if (attributes.groundFriction !== undefined) this.groundFriction = attributes.groundFriction;
        if (attributes.air_friction !== undefined) this.air_friction = attributes.air_friction;
        if (attributes.patrolDuration !== undefined) this.patrolDuration = attributes.patrolDuration;
        if (attributes.randomDuration !== undefined) this.randomDuration = attributes.randomDuration;
        if (attributes.gapBehaviour !== undefined) this.gapBehaviour = attributes.gapBehaviour;
        if (attributes.wallBehaviour !== undefined) this.wallBehaviour = attributes.wallBehaviour;
        if (attributes.flying !== undefined) this.flying = attributes.flying;
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
    }

}