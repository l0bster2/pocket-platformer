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
        
        // enemy attributes
        this.lives = 1;
        this.canBeStomped = false;
        this.killsPlayer = true;
        
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
        this.currentSpriteIndex = 0; // Index within spriteObject array
        this.animationLengths = EnemyAnimationHelper.initializeAnimationLengths(this);
        this.facingDirection = AnimationHelper.facingDirections.left;
        
        // activation system
        this.isActive = false; // Enemy starts inactive, activation config decides when it turns on
        this.activationConfig = { type: "alwaysActive" }; // activates immediately by default
        this.inactivationConfig = { type: "neverInactive" }; // never deactivates by default
        this.activationTimer = 0;
        this.inactivationTimer = 0;
        
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
                break;
            case AnimationHelper.facingDirections.right:
                this.horizontalHit();
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
            // Still render idle sprite even when inactive
            EnemyAnimationHelper.updateAnimation(this, spriteCanvas);
            return;
        }

        this.checkHazardCollisions();
        this.checkPlayerCollision();
        EnemyJumpHandler.updateJump(this, this.jumpIntervalFrames);
        
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
        if (this.isActive) {
            // Check if should deactivate
            if (EnemyActivationHandler.shouldDeactivate(this, this.inactivationConfig)) {
                this.isActive = false;
                EnemyActivationHandler.resetTimers(this);
            }
        } else {
            // Check if should activate
            if (EnemyActivationHandler.shouldActivate(this, this.activationConfig)) {
                this.isActive = true;
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
            maxSpeed: this.maxSpeed,
            groundAcceleration: this.groundAcceleration,
            air_acceleration: this.air_acceleration,
            groundFriction: this.groundFriction,
            air_friction: this.air_friction,
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
        if (attributes.maxSpeed !== undefined) this.maxSpeed = attributes.maxSpeed;
        if (attributes.groundAcceleration !== undefined) this.groundAcceleration = attributes.groundAcceleration;
        if (attributes.air_acceleration !== undefined) this.air_acceleration = attributes.air_acceleration;
        if (attributes.groundFriction !== undefined) this.groundFriction = attributes.groundFriction;
        if (attributes.air_friction !== undefined) this.air_friction = attributes.air_friction;
        if (attributes.activationConfig !== undefined) this.activationConfig = attributes.activationConfig;
        if (attributes.inactivationConfig !== undefined) this.inactivationConfig = attributes.inactivationConfig;
    }

}