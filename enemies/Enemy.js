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
        this.maxSpeed = 2
        this.currentMaxSpeed = 2

        this.groundAcceleration = 0.6
        this.air_acceleration = 0.6

        this.groundFriction = 0.65
        this.air_friction = 0.75
        this.friction = this.air_friction
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
        this.fixedSpeed = false;
        this.xspeed = 0;
        if (this.yspeed !== 0) {
            this.bonusSpeedX = 0;
            this.bonusSpeedY = 0;
        }
        this.onIce = false;
    }

    verticalHit() {
        this.yspeed = 0;
        this.falling = false;
        this.wallJumpFrames = this.maxJumpFrames;
        this.fixedSpeed = false;
        this.bonusSpeedY = 0;
        this.resetJump();
    }

    hitBottom(onPlatform) {
        this.verticalHit();
        this.bonusSpeedX = 0;
        this.jumpframes = 0;
        if (onPlatform) {
            this.jumpPressedToTheMax = true;
        }
    }

    hitTop() {
        this.verticalHit();
        this.forcedJumpSpeed = 0;
        this.jumpframes = this.maxJumpFrames;
        this.jumpPressedToTheMax = true;

        if (this.onMovingPlatform) {
            //PlayMode.thisDeath();
        }
    }

    walkHandler() {
        this.walking = false;
        const newMaxSpeed = this.currentMaxSpeed;

        if (this.walkDirection === "left") {
            if (this.xspeed - this.speed > newMaxSpeed * -1) {
                this.xspeed -= this.speed;
            }
            else {
                if (this.swimming) {
                    this.xspeed = newMaxSpeed * -1;
                }
                else {
                    const restSpeed = this.currentMaxSpeed + this.xspeed;
                    if (restSpeed > 0) {
                        this.xspeed -= restSpeed;
                    }
                }
            }
            this.walking = true;
        }
        if (this.walkDirection === "right") {
            if (this.xspeed + this.speed < newMaxSpeed) {
                this.xspeed += this.speed;
            }
            else {
                if (this.swimming) {
                    this.xspeed = newMaxSpeed;
                }
                else {
                    const restSpeed = this.currentMaxSpeed - this.xspeed;
                    if (restSpeed > 0) {
                        this.xspeed += restSpeed;
                    }
                }
            }
            this.walking = true;
        }
    }

    slowDownBonusSpeedX() {
        this.bonusSpeedX *= 0.95;
        if (Math.abs(this.bonusSpeedX) < 0.3) {
            this.bonusSpeedX = 0;
        }
    }

    slowDownBonusSpeedY() {
        this.bonusSpeedY *= 0.95;
        if (Math.abs(this.bonusSpeedY) < 0.3) {
            this.bonusSpeedY = 0;
        }
    }

    fallHandler() {
        if (this.falling && !this.fixedSpeed) {
            //If jump is not enforced by trampoline
            if (this.forcedJumpSpeed === 0) {
                this.yspeed += this.currentGravity;
            }
        }
    }

    correctMaxYSpeed() {
        if (!this.falling && this.jumpframes === 0 && !this.swimming && !this.fixedSpeed) {
            this.yspeed = 0;
        }
        if (this.yspeed > this.currentMaxFallSpeed) {
            this.yspeed = this.currentMaxFallSpeed;
        }
    }

    setStretchAnimation() {

    }

    checkHazardCollisions() {
        let touchingWater = false;
        tileMapHandler.levelObjects.forEach(levelObject => {
            if (this.interativeObjects.includes(levelObject.type)) {
                if (levelObject.colissionFunction(this, levelObject)) {
                    if (levelObject.type === ObjectTypes.WATER) {
                        touchingWater = true;
                    }
                    levelObject.collisionEvent(this);
                }
            }
        });

        if (this.swimming && !touchingWater) {
            this.swimming = false;
            this.currentGravity = this.gravity;
            this.currentMaxFallSpeed = this.maxFallSpeed;
        }
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
        this.checkHazardCollisions();
        EnemyJumpHandler.updateJump(this, this.jumpIntervalFrames);
        super.draw(spriteCanvas);
    }
}