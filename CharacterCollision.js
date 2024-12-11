class CharacterCollision {

    static staticConstructor(tileMapHandler) {
        this.tileMapHandler = tileMapHandler;
        this.passableTiles = [0, 5];
    }

    static checkHazardsCollision(obj) {
        this.tileMapHandler.levelObjects.forEach(levelObject => {
            if (levelObject.colissionFunction(obj, levelObject)) {
                levelObject.collisionEvent();
            }
        });
    }

    static checkCollisionsWithWorld(obj, cornerCorrection = false) {
        this.checkHazardsCollision(obj);
        this.groundUnderFeet(obj);
        obj.xspeed += obj.bonusSpeedX;
        obj.yspeed += obj.bonusSpeedY;
        this.checkTileCollisions(obj, cornerCorrection);
        obj.xspeed -= obj.bonusSpeedX;
        obj.yspeed -= obj.bonusSpeedY;
    }

    static checkPointCollissionsWithAllObjects(positions, obj) {
        return this.tileMapHandler.levelObjects.find(levelObject => {
            if (obj.unpassableObjects.includes(levelObject.type) && levelObject.key !== obj.key) {
                return positions.find(position => {
                    return Collision.pointAndObjectColliding(position, levelObject);
                });
            }
        });
    }

    static checkMovementBasedObjectCollission(obj) {
        if (obj?.unpassableObjects) {
            if (obj.yspeed > 0) {
                const collidedWithObject = this.checkPointCollissionsWithAllObjects([obj.bottom_left_pos, obj.bottom_right_pos],
                    obj);
                if (collidedWithObject) {
                    obj.y = collidedWithObject.y - (obj.height);
                    obj.hitUnpassableObject(AnimationHelper.facingDirections.bottom, collidedWithObject);
                }
            }
            else if (obj.yspeed < 0) {
                const collidedWithObject = this.checkPointCollissionsWithAllObjects([obj.top_left_pos, obj.top_right_pos],
                    obj);
                if (collidedWithObject) {
                    obj.y = collidedWithObject.y + (obj.height);
                    obj.hitUnpassableObject(AnimationHelper.facingDirections.top, collidedWithObject);
                }
            }
            if (obj.xspeed < 0) {
                const collidedWithObject = this.checkPointCollissionsWithAllObjects([obj.bottom_left_pos, obj.top_left_pos],
                    obj);
                if (collidedWithObject) {
                    obj.x = collidedWithObject.x + (obj.width);
                    obj.hitUnpassableObject(AnimationHelper.facingDirections.left, collidedWithObject);
                }
            }
            else if (obj.xspeed > 0) {
                const collidedWithObject = this.checkPointCollissionsWithAllObjects([obj.top_right_pos, obj.bottom_right_pos],
                    obj);
                if (collidedWithObject) {
                    obj.x = collidedWithObject.x - (obj.width);
                    obj.hitUnpassableObject(AnimationHelper.facingDirections.right, collidedWithObject);
                }
            }
        }
    }

    static checkTileCollisions(obj, cornerCorrection = false) {
        obj.y += obj.yspeed;
        this.getEdges(obj);
        // collision to the bottom
        if (obj.yspeed > 0) {
            if ((obj.bottom_right !== 0)
                || (obj.bottom_left !== 0)) {
                // not a cloud...
                if (obj.bottom_right !== 5 &&
                    obj.bottom_left !== 5
                ) {
                    obj.y = obj.bottom * tileMapHandler.tileSize - (obj.height + 1);
                    obj.hitWall(AnimationHelper.facingDirections.bottom);

                } else {
                    //cloud
                    if (obj.prev_bottom < obj.bottom) {
                        obj.y = obj.bottom * tileMapHandler.tileSize - (obj.height + 1);
                        obj.hitWall(AnimationHelper.facingDirections.bottom);
                    }
                }
            }
            //if player has not touched trampoline previously (is falling down from top of the trampoline), correct his position
            if (!obj.previouslyTouchedTrampolines) {
                tileMapHandler.layers[2].forEach(objectWithCollision => {
                    if (Collision.objectsColliding(obj, objectWithCollision) && obj.type === ObjectTypes.TRAMPOLINE
                        && obj.bottom_right_pos.y > objectWithCollision.y + (this.tileMapHandler.tileSize / 2.1)) {
                        obj.y = objectWithCollision.y - obj.height / 2;
                    }
                })
            }
        }
        // collision to the top
        else if (obj.yspeed < 0) {
            if (!this.passableTiles.includes(obj.top_right)
                || !this.passableTiles.includes(obj.top_left)) {
                cornerCorrection ? this.checkTopCornerCorrection(obj) : this.correctTopPosition(obj);
            }
        }

        obj.x += obj.xspeed;
        this.getEdges(obj);

        // collision to the left
        if (obj.xspeed < 0) {
            if (!this.passableTiles.includes(obj.top_left)
                || !this.passableTiles.includes(obj.bottom_left)) {
                obj.x = (obj.left + 1) * tileMapHandler.tileSize;
                obj.hitWall(AnimationHelper.facingDirections.left);
            }
        }

        // collision to the right
        else if (obj.xspeed > 0) {
            if (!this.passableTiles.includes(obj.top_right)
                || !this.passableTiles.includes(obj.bottom_right)) {
                //this fix is needed to prevednt "stuttering". 
                const extra = obj.groundAcceleration < 1 ? obj.speed - 0.01 : 1;
                obj.x = obj.right * tileMapHandler.tileSize - (obj.width + extra);
                obj.hitWall(AnimationHelper.facingDirections.right);
            }
        }

        if (!obj.previouslyTouchedByMovingPlatform) {
            tileMapHandler.layers[3].forEach(movingPlatform => {
                if (obj.prev_bottom_y < movingPlatform.y) {
                    this.checkMovingPlatformColission(obj, movingPlatform);
                }
            })
        }

        obj.prev_bottom_y = obj.bottom_right_pos.y;
        obj.prev_bottom = obj.bottom;
    }

    static correctTopPosition(obj) {
        obj.y = (obj.top + 1) * tileMapHandler.tileSize + 1;
        obj.hitWall(AnimationHelper.facingDirections.top)
    }

    static checkMovingPlatformColission(obj, movingPlatform) {
        const extraY = movingPlatform.yspeed <= 0 ? Math.abs(movingPlatform.yspeed) : 0;
        const extraHeight = extraY + obj.heightOffset;

        const hitBox = {
            ...movingPlatform.fakeHitBox,
            y: movingPlatform.fakeHitBox.y - extraY,
            height: movingPlatform.fakeHitBox.height + extraHeight,
        }

        if (obj.movingPlatformKey !== movingPlatform.key &&
            (Collision.pointAndObjectColliding(obj.bottom_right_pos, hitBox) ||
                Collision.pointAndObjectColliding(obj.bottom_left_pos, hitBox))
        ) {
            obj.hitWall(AnimationHelper.facingDirections.bottom);
            obj.y = movingPlatform.y - obj.height - 1;
            obj.movingPlatformKey = movingPlatform.key;
            obj.onMovingPlatform = true;
        }
    }

    static checkTopCornerCorrection(obj) {
        const offset = Math.floor(this.tileMapHandler.tileSize / 4)
        const topY = obj.top_right_pos.y - Math.floor(this.tileMapHandler.tileSize / 2);
        const rightX = obj.top_right_pos.x - offset;
        const leftX = obj.top_left_pos.x + offset;
        const rightTileVaue = tileMapHandler.getTileValueForPosition(rightX);
        const leftTileVaue = tileMapHandler.getTileValueForPosition(leftX);
        const topValue = tileMapHandler.getTileValueForPosition(topY);
        const topRightTileValue = tileMapHandler.getTileLayerValueByIndex(topValue, rightTileVaue);
        const topLeftTileValue = tileMapHandler.getTileLayerValueByIndex(topValue, leftTileVaue);
        const touchingSwitch = [obj.top_left, obj.top_right].includes(ObjectTypes.SPECIAL_BLOCK_VALUES.redBlueSwitch);
        if (!touchingSwitch && this.passableTiles.includes(topRightTileValue) && this.passableTiles.includes(obj.top_left)) {
            obj.x = rightTileVaue * this.tileMapHandler.tileSize;
        }
        else if (!touchingSwitch && this.passableTiles.includes(topLeftTileValue) && this.passableTiles.includes(obj.top_right)) {
            obj.x = leftTileVaue * this.tileMapHandler.tileSize + 1;
        }
        else {
            this.correctTopPosition(obj);
        }
    }

    static groundUnderFeet(obj) {
        const left_foot_x = this.tileMapHandler.getTileValueForPosition(obj.x);
        const right_foot_x = this.tileMapHandler.getTileValueForPosition(obj.x + obj.width);
        const foot_y = this.tileMapHandler.getTileValueForPosition(obj.y + (obj.height + 1));

        let current_tile = 1;

        if (foot_y < this.tileMapHandler.levelHeight) {
            const left_foot = this.tileMapHandler.tileMap[foot_y][left_foot_x];
            const right_foot = this.tileMapHandler.tileMap[foot_y][right_foot_x];
            current_tile = left_foot !== 0 ? left_foot : right_foot;
        }

        obj.bonusSpeedX && !obj.onMovingPlatform && obj.slowDownBonusSpeedX();
        obj.bonusSpeedY && !obj.onMovingPlatform && obj.slowDownBonusSpeedY();

        switch (current_tile) {
            case 0:
                if (obj.swimming) {
                    obj.speed = obj.air_acceleration / 2;
                    obj.currentMaxSpeed = obj.maxSpeed;
                    obj.friction = obj.air_friction;
                }
                else if (!obj.onIce) {
                    obj.speed = obj.air_acceleration;
                    obj.currentMaxSpeed = obj.maxSpeed;
                    obj.friction = obj.air_friction;
                }
                if (!Controller.jump || obj.jumpframes >= obj.maxJumpFrames || obj.jumpPressedToTheMax || PauseHandler.justClosedPauseScreen) {
                    obj.falling = true;
                }
                if (obj.onMovingPlatform) {
                    obj.falling = false;
                    this.setSolidGroundPhysics(obj);
                }
                break;
            case 5:
                if (obj.yspeed < 0 &&
                    (!Controller.jump || !obj.onMovingPlatform || obj.jumpframes >= obj.maxJumpFrames || obj.jumpPressedToTheMax)) {
                    obj.falling = true;
                }
                //if speed is 0, but player is somewhere in the middle of the 5 tile, not exactly on top
                if (obj.yspeed === 0 && !obj.onMovingPlatform && (obj.y + obj.height + 1) % this.tileMapHandler.tileSize !== 0) {
                    obj.falling = true;
                }
                this.setSolidGroundPhysics(obj);
                break;
            case ObjectTypes.SPECIAL_BLOCK_VALUES.treadmillRight:
                this.setSolidGroundPhysics(obj);
                obj.bonusSpeedX = obj.maxSpeed / 1.90;
                break;
            case ObjectTypes.SPECIAL_BLOCK_VALUES.treadmillLeft:
                this.setSolidGroundPhysics(obj);
                obj.bonusSpeedX = obj.maxSpeed / 1.90 * -1;
                break;
            case ObjectTypes.SPECIAL_BLOCK_VALUES.iceBlock:
                this.setSolidGroundPhysics(obj);
                obj.friction = 0.97;
                obj.speed = 0.3;
                obj.onIce = true;
                break;
            default:
                this.setSolidGroundPhysics(obj);
                break;
        }
    }

    static setSolidGroundPhysics(obj) {
        obj.speed = obj.swimming ? obj.groundAcceleration / 2 : obj.groundAcceleration;
        obj.currentMaxSpeed = obj.swimming ? obj.maxSpeed / 2 : obj.maxSpeed;
        obj.friction = obj.groundFriction;
    }

    static getEdges(obj) {
        const hitBoxOffset = obj?.hitBoxOffset || 0;
        //Pixel values
        const rightX = obj.x + obj.width + hitBoxOffset;
        const leftX = obj.x - hitBoxOffset;
        const bottomY = obj.y + obj.height + hitBoxOffset;
        const topY = obj.y - hitBoxOffset;
        obj.top_right_pos = { x: rightX, y: topY };
        obj.top_left_pos = { x: leftX, y: topY };
        obj.bottom_right_pos = { x: rightX, y: bottomY };
        obj.bottom_left_pos = { x: leftX, y: bottomY };
        //Tile values
        obj.right = tileMapHandler.getTileValueForPosition(rightX);
        obj.left = tileMapHandler.getTileValueForPosition(leftX);
        obj.bottom = tileMapHandler.getTileValueForPosition(bottomY);
        obj.top = tileMapHandler.getTileValueForPosition(topY);
        obj.top_right = tileMapHandler.getTileLayerValueByIndex(obj.top, obj.right);
        obj.top_left = tileMapHandler.getTileLayerValueByIndex(obj.top, obj.left);
        obj.bottom_right = tileMapHandler.getTileLayerValueByIndex(obj.bottom, obj.right);
        obj.bottom_left = tileMapHandler.getTileLayerValueByIndex(obj.bottom, obj.left);
        if (obj?.wallJumpChecked || obj?.powerUpWallJumpChecked) {
            obj.checkWallJumpReady();
        }
    }
}