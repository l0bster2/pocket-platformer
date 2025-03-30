class Player {

    constructor(initialX, initialY, tileSize) {
        this.tileSize = tileSize;
        this.widthOffset = 2;
        this.width = this.tileSize - this.widthOffset;
        /*
            height minus some pixels, because chracter is 1 pixel above ground,
            and so that he can squeeze between tile exactly above head
        */
        this.heightOffset = 3;
        this.height = this.tileSize - this.heightOffset;
        this.initialX = initialX * this.tileSize;
        this.initialY = initialY * this.tileSize;
        this.wallJumpDirection = 1;
        this.dashDirection = AnimationHelper.facingDirections.left;
        this.maxJumpFrames = 18;
        this.dashCooldown = 3;
        this.maxDashFrames = 10 + this.dashCooldown;
        this.coyoteDashFrames = 6;
        this.currentCoyoteDashFrame = this.coyoteDashFrames;
        this.maxFallSpeed = this.tileSize / 1.5;
        this.coyoteJumpFrames = 6;
        this.extraTrampolineJumpFrames = Math.round(this.maxJumpFrames / 6);
        this.pushToSideWhileWallJumpingFrames = this.maxJumpFrames / 2 - 4;
        this.jumpSpeed = 0.44;
        this.maxSpeed = 3.2;
        this.groundFriction = 0.65;
        this.air_friction = 0.75;
        this.groundAcceleration = 0.8;
        this.air_acceleration = this.groundAcceleration;
        this.gravity = 0.5;
        this.jumpReleased = true;
        this.wallJumpGravity = this.gravity * 2;
        this.adjustSwimAttributes(this.maxJumpFrames, this.jumpSpeed);
        this.maxWaterFallSpeed = 2.25;
        this.spriteCanvas = spriteCanvas;
        this.type = "player";
        this.radians = 0;
        this.deathTypes = {
            none: "none",
            upwardsAndRotate: "upwardsAndRotate",
            explode: "explode",
        };
        this.powerUpTypes = [
            "powerUpJumpChecked",
            "powerUpWallJumpChecked",
            "powerUpDoubleJumpChecked",
            "powerUpDashChecked",
        ];
        this.deathType = this.deathTypes.upwardsAndRotate;
        this.setBorderPositions();
        this.setAnimationProperties();
        this.setAbilities();
        this.resetAll();
        this.resetTemporaryAttributes();
        this.updateExtraColissionPoints();
    }

    adjustSwimAttributes(maxJumpFrames, jumpSpeed) {
        const onePerfectOfMaxJumpHeight = -(maxJumpFrames - 1) * jumpSpeed / 100;
        this.maxSwimHeight = onePerfectOfMaxJumpHeight * 90;
        this.flapHeight = onePerfectOfMaxJumpHeight * 60 * -1;
    }

    setBorderPositions() {
        this.right;
        this.left;
        this.bottom;
        this.top;
        this.top_right_pos;
        this.top_left_pos;
        this.bottom_right_pos;
        this.bottom_left_pos;
        this.top_right;
        this.top_left;
        this.bottom_left;
        this.bottom_right;
        this.prev_bottom;
        this.wallJumpLeft;
        this.wallJumpRight;
        this.extraLeftPoints = [];
        this.extraSidePointsY = [];
        this.extraRightPoints = [];
        this.extraBottomPoints = [];
        this.extraBottomPointsX = [];
        this.extraTopPoints = [];
    }

    updateExtraColissionPoints() {
        this.extraHeightPoints = Math.floor((this.height + 3) / this.tileSize);
        this.heightForExtraColissionPoints = this.extraHeightPoints ? Math.round(this.height / (this.extraHeightPoints + 1)) : 0;

        this.extraWidthPoints = Math.floor((this.width + 2) / this.tileSize);
        this.widthForExtraColissionPoints = this.extraWidthPoints ? Math.round(this.width / (this.extraWidthPoints + 1)) : 0;
    }

    resetPosition(checkCheckpoints = false) {
        if (checkCheckpoints) {
            const activeCheckPointPos = PlayMode.checkActiveCheckPoints();
            this.checkIfPlayerInitialPositionExists();
            this.x = activeCheckPointPos ? activeCheckPointPos.x : this.initialX;
            this.y = activeCheckPointPos ? activeCheckPointPos.y : this.initialY;
        } else {
            this.checkIfPlayerInitialPositionExists();
            this.x = this.initialX;
            this.y = this.initialY;
        }
        //Correction in case player is higher than 1 tile-size
        this.y = this.y + this.tileSize - this.height - 2;
    }

    checkIfPlayerInitialPositionExists() {
        try {
            if (!!tileMapHandler) {
                const tileValue = tileMapHandler.getTileTypeByPosition(this.initialX, this.initialY);
                /* 
                    players initial values could not exist anymore (f.e. because flag was removed by changing level width/height)
                    or it was moved to a place, that is occupied by a solid tile
                */
                if (typeof tileValue === 'undefined' || (tileValue && tileValue !== 0)) {
                    const { x, y } = TilemapHelpers.findFirstFreePosition(tileMapHandler);
                    this.initialX = x * tileMapHandler.tileSize;
                    this.initialY = y * tileMapHandler.tileSize;
                }
            }
        } catch {
            //tilemapHandler not defined yet (on tool initialization)
        }
    }

    resetAttributes(resetAutoRun = true) {
        this.speed = 0;
        this.xspeed = 0;
        this.yspeed = 0;
        this.bonusSpeedX = 0;
        this.bonusSpeedY = 0;
        this.wallJumpFrames = this.maxJumpFrames;
        this.falling = false;
        this.jumping = false;
        this.jumpPressedToTheMax = false;
        this.wallJumping = false;
        this.dashing = false;
        this.forcedJumpSpeed = 0;
        this.currentDashFrame = 0;
        this.currentWallJumpCoyoteFrame = 0;
        this.currentMomentumCoyoteFrame = this.coyoteJumpFrames;
        this.momentumBonusSpeedX = 0;
        this.momentumBonusSpeedY = 0;
        this.walljumpReady = false;
        this.swimming = false;
        this.friction = this.air_friction;
        this.collidingWithNpcId = false;
        this.previousFrameSwimming = false;
        this.invisible = false;
        this.fixedSpeed = false;
        this.onIce = false;
        this.temporaryDoubleJump = false;
        this.currentTrailFrame = 0;
        this.movingPlatformKey = null;
        this.onMovingPlatform = false;

        if (resetAutoRun) {
            this.fixedSpeedLeft = false;
            this.fixedSpeedRight = false;
        }
        this.resetJump();
        this.resetDoubleJump();
    }

    resetTemporaryAttributes() {
        this.currentGravity = this.gravity;
        this.currentMaxFallSpeed = this.maxFallSpeed;
        this.previouslyTouchedTrampolines = false;
        this.previouslyTouchedByMovingPlatform = false;

        if (this.swimming) {
            //if only the side of player is in water, we set this attribute. so next frame, we can reset coyote jump
            if (!this.bottom_left_pos_in_water && !this.top_left_pos_in_water &&
                this.top_right_pos_in_water && this.bottom_right_pos_in_water ||
                !this.top_right_pos_in_water && !this.bottom_right_pos_in_water &&
                this.top_left_pos_in_water && this.bottom_left_pos_in_water) {
                this.previousFrameSwimming = true;
            }
            this.swimming = false;
        }
        else if (this.previousFrameSwimming) {
            this.previousFrameSwimming = false;

            if (this.falling && this.forcedJumpSpeed === 0) {
                this.hitBottom();
            }
        }

        this.top_right_pos_in_water = false;
        this.top_left_pos_in_water = false;
        this.bottom_right_pos_in_water = false;
        this.bottom_left_pos_in_water = false;
    }

    resetAll() {
        this.resetAttributes();
        this.resetPosition();
        this.resetAnimationAttributes();
        this.resetTemporaryAttributes();
    }

    setAbilities() {
        this.jumpChecked = true;
        this.wallJumpChecked = true;
        this.doubleJumpChecked = false;
        this.dashChecked = false;
        this.runChecked = false;
        this.setInitialPowerUps();
    }

    setInitialPowerUps() {
        this.powerUpTypes.forEach(powerUpType => {
            this[powerUpType] = false;
        })
    }

    setAnimationProperties() {
        this.facingDirection = AnimationHelper.facingDirections.right;
        this.spriteIndexIdle = SpritePixelArrays.getIndexOfSprite(ObjectTypes.PLAYER_IDLE);
        const idleSprite = SpritePixelArrays.getSpritesByIndex(this.spriteIndexIdle);
        this.spriteIndexIdleCanvasYPos = idleSprite.canvasYPos;
        this.spriteIndexJump = SpritePixelArrays.getIndexOfSprite(ObjectTypes.PLAYER_JUMP);
        this.spriteIndexJumpCanvasYPos = SpritePixelArrays.getSpritesByIndex(this.spriteIndexJump).canvasYPos;
        this.spriteIndexWalk = SpritePixelArrays.getIndexOfSprite(ObjectTypes.PLAYER_WALK);
        this.spriteIndexWalkCanvasYPos = SpritePixelArrays.getSpritesByIndex(this.spriteIndexWalk).canvasYPos;
        this.animationLengths = {
            [this.spriteIndexIdle]: SpritePixelArrays.PLAYER_IDLE_SPRITE.animation.length,
            [this.spriteIndexJump]: SpritePixelArrays.PLAYER_JUMP_SPRITE.animation.length,
            [this.spriteIndexWalk]: SpritePixelArrays.PLAYER_WALK_SPRITE.animation.length,
        };
        this.spriteObject = SpritePixelArrays.PLAYER_JUMP_SPRITE;
        this.currentSpriteIndex = this.spriteIndexIdle;
        this.currentAnimationIndex = 0;
        this.originalHeight = idleSprite.animation[0].sprite.length * WorldDataHandler.pixelArrayUnitSize;
        this.originalWidth = idleSprite.animation[0].sprite[0].length * WorldDataHandler.pixelArrayUnitSize;
        this.height = this.originalHeight - this.heightOffset;
        this.width = this.originalWidth - this.widthOffset;
    }

    resetAnimationAttributes() {
        AnimationHelper.setInitialSquishValues(this, this.width + this.widthOffset, this.height + this.heightOffset);
    }

    setAnimationState(newAnimationState, animationCanvasYPos) {
        if (this.currentSpriteIndex !== newAnimationState) {
            this.currentAnimationIndex = 0;
        }
        this.currentSpriteIndex = newAnimationState;
        this.currentAnimationCanvasYPos = animationCanvasYPos;
    }

    checkTrailType() {
        if (this.fixedSpeed || this.fixedSpeedLeft || this.fixedSpeedRight) {
            return { finalFrame: 12, sfxIndex: 8 };
        }
        return { finalFrame: 16, sfxIndex: 10 };
    }

    checkTrailAnimation() {
        const { finalFrame, sfxIndex } = this.checkTrailType();

        if (this.xspeed !== 0 || this.fixedSpeed) {
            this.currentTrailFrame++;
        }
        if (this.swimming || (this.yspeed !== 0 && !this.fixedSpeed && !this.fixedSpeedLeft && !this.fixedSpeedRight)) {
            this.currentTrailFrame = 0;
        }

        if (this.currentTrailFrame === finalFrame) {
            SFXHandler.createSFX(this.bottom_left_pos.x, this.bottom_left_pos.y - this.tileSize + 1,
                sfxIndex, this.facingDirection, 0, 0, true)
            this.currentTrailFrame = 0;
        }
    }

    displayDeathAnimation(animationIndex) {
        let offSet = (PlayMode.deathPauseFrames - PlayMode.currentPauseFrames);
        this.invisible = true;

        switch (this.deathType) {
            case this.deathTypes.explode:
                this.radians += 0.15;
                Display.explodeSprite(this.spriteCanvas, animationIndex * this.originalWidth, this.currentAnimationCanvasYPos,
                    this.originalHeight, this.x, this.y, offSet, this.radians);
                break;
            case this.deathTypes.upwardsAndRotate:
                this.y -= 2;
                this.radians += 0.25;
                Display.drawImageWithRotation(this.spriteCanvas, animationIndex * this.originalWidth,
                    this.currentAnimationCanvasYPos, this.originalWidth,
                    this.originalHeight - 1, this.x, this.y - 2,
                    this.drawWidth, this.drawHeight, this.radians);
                break;
            default:
                this.invisible = false;
                break;
        }
    }

    draw() {
        if (this.xspeed > 0) {
            this.facingDirection = AnimationHelper.facingDirections.right;
        }
        else if (this.xspeed < 0) {
            this.facingDirection = AnimationHelper.facingDirections.left;
        }

        if (this.xspeed === 0 && this.yspeed === 0) {
            this.setAnimationState(this.spriteIndexIdle, this.spriteIndexIdleCanvasYPos);
        }
        else if (this.xspeed !== 0 && this.yspeed === 0) {
            this.setAnimationState(this.spriteIndexWalk, this.spriteIndexWalkCanvasYPos);
        }
        if (this.yspeed !== 0 || this.falling) {
            this.setAnimationState(this.spriteIndexJump, this.spriteIndexJumpCanvasYPos);
        }

        if ((this.wallJumpRight || this.wallJumpLeft) && this.yspeed > 0) {
            //this.activateAnimationInterval("walljumpAnimationInterval", 0, -12);
        }
        else {
            //this.clearAnimationInterval("walljumpAnimationInterval");
        }

        this.checkTrailAnimation();

        const animationLength = this.animationLengths[this.currentSpriteIndex];

        const frameDuration = this.currentSpriteIndex === this.spriteIndexIdle
            ? AnimationHelper.defaultFrameDuration
            : AnimationHelper.walkingFrameDuration;

        this.currentAnimationIndex++;
        if (this.currentAnimationIndex >= frameDuration * animationLength || Game.playMode === Game.BUILD_MODE) {
            this.currentAnimationIndex = 0;
        }

        /*
            First, normal facing sprites are rendered, then mirrored sprites
            If we want to display mirrored sprites, we need to start at the end of the normal animation index
        */
        const loop = this.facingDirection === AnimationHelper.facingDirections.left ? animationLength : 0;

        //Animation index in regards to "FPS" (animation frame duration)
        const animationIndex = (Math.floor(this.currentAnimationIndex / frameDuration) + loop) || 0;

        AnimationHelper.checkSquishUpdate(this);

        if (this.death && Game.playMode === Game.PLAY_MODE) {
            this.displayDeathAnimation(animationIndex);
        }

        if (this.fixedSpeed) {
            this.radians += 0.25;
            Display.drawImageWithRotation(this.spriteCanvas, animationIndex * this.originalWidth,
                this.currentAnimationCanvasYPos, this.originalWidth,
                this.originalHeight - 1, this.x - this.squishXOffset, this.y - 2 - this.squishYOffset,
                this.drawWidth, this.drawHeight, this.radians);
        }
        else {
            !this.invisible && Display.drawImage(this.spriteCanvas, animationIndex * this.originalWidth,
                this.currentAnimationCanvasYPos, this.originalWidth,
                this.originalHeight - 1, this.x - this.squishXOffset, this.y - 2 - this.squishYOffset,
                this.drawWidth, this.drawHeight);
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

    checkWallJumpReady() {
        const wallJumpRightPos = tileMapHandler.getTileValueForPosition(this.x + this.width + 1);
        const wallJumpLeftPos = tileMapHandler.getTileValueForPosition(this.x - 1);
        const wallJumpTopRightTile = tileMapHandler.getTileLayerValueByIndex(this.top, wallJumpRightPos);
        const wallJumpBottomRightTile = tileMapHandler.getTileLayerValueByIndex(this.bottom, wallJumpRightPos);
        const extraRightTiles = this.extraSidePointsY.map(extraPointRight => {
            const tileValueTop = tileMapHandler.getTileValueForPosition(extraPointRight);
            return tileMapHandler.getTileLayerValueByIndex(tileValueTop, wallJumpRightPos)
        });
        const wallJumpTopLeftTile = tileMapHandler.getTileLayerValueByIndex(this.top, wallJumpLeftPos);
        const wallJumpBottomLeftTile = tileMapHandler.getTileLayerValueByIndex(this.bottom, wallJumpLeftPos);
        const extraLeftTiles = this.extraSidePointsY.map(extraPointLeft => {
            const tileValueTop = tileMapHandler.getTileValueForPosition(extraPointLeft);
            return tileMapHandler.getTileLayerValueByIndex(tileValueTop, wallJumpLeftPos)
        });
        const tilesWithNoWallJump = [0, 5];

        this.wallJumpRight = (!MathHelpers.arraysHaveSameValues([wallJumpTopRightTile, wallJumpBottomRightTile, ...extraRightTiles], tilesWithNoWallJump))
            && this.x < (tileMapHandler.levelWidth - 1) * tileMapHandler.tileSize - 5;
        this.wallJumpLeft = !MathHelpers.arraysHaveSameValues([wallJumpTopLeftTile, wallJumpBottomLeftTile, ...extraLeftTiles], tilesWithNoWallJump)
            && this.x > tileMapHandler.tileSize - 5;
        this.iceOnSide = false;
        if (this.wallJumpLeft || this.wallJumpRight) {
            this.iceOnSide = wallJumpTopRightTile === ObjectTypes.SPECIAL_BLOCK_VALUES.iceBlock || wallJumpBottomRightTile === ObjectTypes.SPECIAL_BLOCK_VALUES.iceBlock
                || wallJumpTopLeftTile === ObjectTypes.SPECIAL_BLOCK_VALUES.iceBlock || wallJumpBottomLeftTile === ObjectTypes.SPECIAL_BLOCK_VALUES.iceBlock;
        }
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

    resetDoubleJump() {
        this.doubleJumpActive = false;
        this.doubleJumpUsed = false;
        this.temporaryDoubleJump = false;
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
        this.resetDoubleJump();
        this.setSquishAnimation();
    }

    hitTop() {
        this.verticalHit();
        this.forcedJumpSpeed = 0;
        this.jumpframes = this.maxJumpFrames;
        this.jumpPressedToTheMax = true;

        if (this.onMovingPlatform) {
            PlayMode.playerDeath();
        }
    }

    setSquishAnimation() {
        AnimationHelper.setSquishValues(this, (this.width + this.widthOffset) * 1.2, (this.height + this.heightOffset) * 0.8);
    }

    setStretchAnimation() {
        AnimationHelper.setSquishValues(this, (this.width + this.widthOffset) * 0.8, (this.height + this.heightOffset) * 1.2);
    }
}