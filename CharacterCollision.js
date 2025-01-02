class CharacterCollision {

    static staticConstructor(tileMapHandler) {
        this.tileMapHandler = tileMapHandler;
        this.passableTiles = [0, 5];
    }

    static checkHazardsCollision(obj) {
        this.tileMapHandler.levelObjects.forEach(levelObject => {
            if (Collision.objectsColliding(obj, levelObject)) {
                levelObject.collisionEvent();
            }
        });
    }

    static checkCollisionsWithWorld(obj, cornerCorrection = false) {
        this.checkHazardsCollision(obj);
        this.groundUnderFeet(obj);
        obj.xspeed += obj.bonusSpeed;
        this.checkTileCollisions(obj, cornerCorrection);
        obj.xspeed -= obj.bonusSpeed;
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
            if (!MathHelpers.arraysHaveSameValues([obj.bottom_right, obj.bottom_left, ...obj.extraBottomPoints], [0])) {
                // not a cloud...
                if (!MathHelpers.arraysHaveSameValues([obj.bottom_right, obj.bottom_left, ...obj.extraBottomPoints], [5])) {
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
                    if (Collision.objectsColliding(obj, objectWithCollision) && obj.type !== ObjectTypes.STOMPER
                        && obj.bottom_right_pos.y > objectWithCollision.y + (this.tileMapHandler.tileSize / 2.1)) {
                        obj.y = objectWithCollision.y - obj.height / 2;
                    }
                })
            }
        }
        // collision to the top
        else if (obj.yspeed < 0) {
            if (!MathHelpers.arraysHaveSameValues([obj.top_right, obj.top_left, ...obj.extraTopPoints], this.passableTiles)) {
                cornerCorrection  && obj.width < tileMapHandler.tileSize ? this.checkTopCornerCorrection(obj) : this.correctTopPosition(obj);
            }
        }

        obj.x += obj.xspeed;
        this.getEdges(obj);

        // collision to the left
        if (obj.xspeed < 0) {
            if (!MathHelpers.arraysHaveSameValues([obj.top_left, obj.bottom_left, ...obj.extraLeftPoints], this.passableTiles)) {
                obj.x = (obj.left + 1) * tileMapHandler.tileSize;
                obj.hitWall(AnimationHelper.facingDirections.left);
            }
        }

        // collision to the right
        else if (obj.xspeed > 0) {
            if (!MathHelpers.arraysHaveSameValues([obj.top_right, obj.bottom_right, ...obj.extraRightPoints], this.passableTiles)) {
                //this fix is needed to prevednt "stuttering". 
                const extra = obj.groundAcceleration < 1 ? obj.speed - 0.01 : 1;
                obj.x = obj.right * tileMapHandler.tileSize - (obj.width + extra);
                obj.hitWall(AnimationHelper.facingDirections.right);
            }
        }

        obj.prev_bottom = obj.bottom;
    }

    static correctTopPosition(obj) {
        obj.y = (obj.top + 1) * tileMapHandler.tileSize + 1;
        obj.hitWall(AnimationHelper.facingDirections.top)
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
        const extra_bottom_foot_pos_x = obj.extraBottomPointsX.map(extraPos => 
            this.tileMapHandler.getTileValueForPosition(extraPos)
        );
        const right_foot_x = this.tileMapHandler.getTileValueForPosition(obj.x + obj.width);
        const foot_y = this.tileMapHandler.getTileValueForPosition(obj.y + (obj.height + 1));

        let current_tile = 1;

        if (foot_y < this.tileMapHandler.levelHeight) {
            const left_foot = this.tileMapHandler.tileMap[foot_y][left_foot_x];
            const extra_foot = extra_bottom_foot_pos_x.map(extraTile => this.tileMapHandler.tileMap[foot_y][extraTile])
            const right_foot = this.tileMapHandler.tileMap[foot_y][right_foot_x];
            const allBottomFootPos = [left_foot, ...extra_foot, right_foot];
            current_tile = allBottomFootPos.find((element) => element !== 0) || right_foot;
        }

        obj.bonusSpeed && obj.slowDownBonusSpeed();

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
                break;
            case 5:
                if (obj.yspeed < 0 &&
                    (!Controller.jump || obj.jumpframes >= obj.maxJumpFrames || obj.jumpPressedToTheMax)) {
                    obj.falling = true;
                }
                //if speed is 0, but player is somewhere in the middle of the 5 tile, not exactly on top
                if (obj.yspeed === 0 && (obj.y + obj.height + 1) % this.tileMapHandler.tileSize !== 0) {
                    obj.falling = true;
                }
                this.setSolidGroundPhysics(obj);
                break;
            case ObjectTypes.SPECIAL_BLOCK_VALUES.treadmillRight:
                this.setSolidGroundPhysics(obj);
                obj.bonusSpeed = obj.maxSpeed / 1.90;
                break;
            case ObjectTypes.SPECIAL_BLOCK_VALUES.treadmillLeft:
                this.setSolidGroundPhysics(obj);
                obj.bonusSpeed = obj.maxSpeed / 1.90 * -1;
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
        this.checkForExtraEdges(obj);
    }

    static checkForExtraEdges(obj) {
        obj.extraLeftPoints = [];
        obj.extraSidePointsY = []; 
        obj.extraRightPoints = [];

        if(obj.extraHeightPoints) {
            for(var i = 1; i < obj.extraHeightPoints + 1; i++) {
                const extraTop = obj.top_left_pos.y + obj.heightForExtraColissionPoints * i;
                obj.extraSidePointsY.push(extraTop);
                const extraLeftTilePosY = tileMapHandler.getTileValueForPosition(extraTop);
                const extraTileValueLeft = tileMapHandler.getTileLayerValueByIndex(extraLeftTilePosY, obj.left);
                const extraTileValueRight = tileMapHandler.getTileLayerValueByIndex(extraLeftTilePosY, obj.right);
                obj.extraLeftPoints.push(extraTileValueLeft);
                obj.extraRightPoints.push(extraTileValueRight);
            }
        }

        obj.extraBottomPoints = [];
        obj.extraBottomPointsX = [];
        obj.extraTopPoints = [];

        if(obj.extraWidthPoints) {
            for(var i = 1; i < obj.extraWidthPoints + 1; i++) {
                const extraLeft = obj.top_left_pos.x + obj.widthForExtraColissionPoints * i;
                obj.extraBottomPointsX.push(extraLeft);
                const extraTopTilePosX = tileMapHandler.getTileValueForPosition(extraLeft);
                const extraTileValueTop = tileMapHandler.getTileLayerValueByIndex(obj.top, extraTopTilePosX);
                const extraTileValueBottom = tileMapHandler.getTileLayerValueByIndex(obj.bottom, extraTopTilePosX);
                obj.extraBottomPoints.push(extraTileValueBottom);
                obj.extraTopPoints.push(extraTileValueTop);
            }
        }
    }
}