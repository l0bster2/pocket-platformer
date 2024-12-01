class Path {

    constructor(tileMapHandler, speed = 3, stopFrames = 10, movementDirection = AnimationHelper.possibleDirections.forwards) {
        this.tileMapHandler = tileMapHandler;
        this.tileSize = tileMapHandler.tileSize;
        this.pathPoints = [];
        this.objectsOnPath = [];
        this.movingPlatformsOnPath = [];
        this.speed = speed;
        this.recalculateSteps();
        this.startPointKey;
        this.endPointKey;
        this.movementDirection = movementDirection;
        this.stopFrames = stopFrames;
        this.pathVariant = AnimationHelper.pathVariants.singlePoint;
        this.key = TilemapHelpers.makeid(5);
        this.resetAttributes();
    }

    recalculateSteps() {
        this.movementSteps = this.tileSize / this.speed;
        this.currentDirection = this.movementDirection;
    }

    resetAttributes() {
        this.currentMovementStep = 0;
        this.currentDirection = this.movementDirection;
        this.currentStopFrame = this.stopFrames;
    }

    resetObjectsToInitialPosition() {
        this.objectsOnPath.forEach(objectOnPath => {
            objectOnPath.xspeed = 0;
            objectOnPath.yspeed = 0;
            objectOnPath.x = objectOnPath.initialX * this.tileSize;
            objectOnPath.y = objectOnPath.initialY * this.tileSize;
        });
        this.resetAttributes();
    }

    rearrangePathPoints() {
        const endPoints = this.rearrangePathPointsAlignment();

        //line
        if (endPoints.length === 2) {
            const { startPoint, endPoint } = TilemapHelpers.findStartAndEndPointForLine(endPoints);
            this.startPointKey = startPoint.key;
            this.endPointKey = endPoint.key;
            this.pathVariant = AnimationHelper.pathVariants.line;
            this.pathPoints = TilemapHelpers.resortPath(this.pathPoints, startPoint, endPoint);
        }
        //enclosed
        else if (endPoints.length === 0 && this.pathPoints.length !== 1) {
            const { startPoint, endPoint } = TilemapHelpers.findStartAndEndPointForEnclosedPath(this.pathPoints);
            this.pathVariant = AnimationHelper.pathVariants.enclosed;
            this.pathPoints = TilemapHelpers.resortPath(this.pathPoints, startPoint, endPoint);
        }
        //singlepoint
        else {
            this.pathVariant = AnimationHelper.pathVariants.singlePoint;
        }
    }

    checkObjectsOnPath() {
        this.objectsOnPath = [];
        this.movingPlatformsOnPath = [];
        this.pathPoints.forEach(pathPoint => {
            const objectOnPath = this.tileMapHandler?.levelObjects && this.tileMapHandler.levelObjects.find(levelObject =>
                levelObject.initialX === pathPoint.initialX && levelObject.initialY === pathPoint.initialY &&
                !SpritePixelArrays.backgroundSprites.includes(levelObject.type)
            );
            if(objectOnPath) {
                this.objectsOnPath.push(objectOnPath);
                if(SpritePixelArrays.movingPlatformSprites.includes(objectOnPath.type)) {
                    this.movingPlatformsOnPath.push(objectOnPath);
                }
            }
        })
    }

    rearrangePathPointsAlignment() {
        let endPoints = [];
        this.pathPoints.forEach(pathPoint => {
            let rightTouched;
            let leftTouched;
            let topTouched;
            let bottomTouched;
            let neighboursAmount = 0;

            this.pathPoints.forEach(comparingPathPoint => {
                if (pathPoint.key !== comparingPathPoint.key) {
                    if (!rightTouched && (pathPoint.initialY === comparingPathPoint.initialY && pathPoint.initialX + 1 === comparingPathPoint.initialX)) {
                        neighboursAmount++;
                        rightTouched = true;
                    }
                    if (!leftTouched && (pathPoint.initialY === comparingPathPoint.initialY && pathPoint.initialX - 1 === comparingPathPoint.initialX)) {
                        neighboursAmount++;
                        leftTouched = true;
                    }
                    if (!topTouched && (pathPoint.initialX === comparingPathPoint.initialX && pathPoint.initialY - 1 === comparingPathPoint.initialY)) {
                        neighboursAmount++;
                        topTouched = true;
                    }
                    if (!bottomTouched && (pathPoint.initialX === comparingPathPoint.initialX && pathPoint.initialY + 1 === comparingPathPoint.initialY)) {
                        bottomTouched = true;
                        neighboursAmount++;
                    }

                    if (topTouched && bottomTouched) {
                        pathPoint.alignment = AnimationHelper.alignments.vertical;
                    }
                    else if (rightTouched && leftTouched) {
                        pathPoint.alignment = AnimationHelper.alignments.horizontal;
                    }
                    else {
                        pathPoint.alignment = AnimationHelper.alignments.corner;
                    }
                }
            })

            if (this.pathPoints.length !== 1 && neighboursAmount === 1) {
                endPoints.push(pathPoint);
            }
        });
        return endPoints;
    }

    draw(spriteCanvas) {
        this.pathPoints.forEach(pathPoint => {
            pathPoint.draw(spriteCanvas);
        });

        if (Game.playMode === Game.PLAY_MODE) {
            if (this.pathVariant !== AnimationHelper.pathVariants.singlePoint && this.currentStopFrame >= this.stopFrames) {
                if (this.currentMovementStep === 0 && this.pathVariant === AnimationHelper.pathVariants.line) {
                    this.checkIfReversalOfDirectionNeeded();
                }
                if (this.currentStopFrame >= this.stopFrames) {
                    this.getSpeedForObjectsOnPath();
                    this.currentMovementStep++;
                    if (this.currentMovementStep >= this.movementSteps) {
                        this.currentMovementStep = 0;
                    }
                }
            }
            if (this.currentStopFrame < this.stopFrames) {
                this.currentStopFrame++;
            }
        }
    }

    getSpeedForObjectsOnPath() {
        this.objectsOnPath.forEach(objectOnPath => {
            if (this.currentMovementStep === 0) {
                const { currentPathPoint, nextPathPoint } = this.getCurrentAndNextPathPointForObject(objectOnPath);
                this.getNeededSpeedForNextPathPoint(objectOnPath, currentPathPoint, nextPathPoint);
            }
            if(objectOnPath.type === ObjectTypes.MOVING_PLATFORM) {
                objectOnPath.previouslyLowerThanPlayer = objectOnPath.fakeHitBox.y > this.tileMapHandler.player.prev_bottom_y;
            }
            objectOnPath.x += objectOnPath.xspeed;
            objectOnPath.y += objectOnPath.yspeed;

            if(objectOnPath.previouslyLowerThanPlayer) {
                const secondHitBox = {
                    ...objectOnPath,
                    fakeHitBox: {
                        ...objectOnPath.fakeHitBox,
                        y: objectOnPath.y,
                    }
                }
                CharacterCollision.checkMovingPlatformColission(this.tileMapHandler.player, secondHitBox);
            }
        });
        // We need this extra check, because if platform is going up, and player goes down, the colission could missed
        this.movingPlatformsOnPath.forEach(movingPlatform => {
            if(movingPlatform.yspeed < 0 && 
                movingPlatform.yspeed < this.tileMapHandler.player.yspeed) {
                //CharacterCollision.checkMovingPlatformColission(this.tileMapHandler.player, movingPlatform);
            }
        });
    }

    getCurrentPathPointIndexForObject(objectOnPath) {
        const tilePosY = this.tileMapHandler.getTileValueForPosition(objectOnPath.y);
        const tilePosX = this.tileMapHandler.getTileValueForPosition(objectOnPath.x);
        return this.pathPoints.findIndex(pathPoint =>
            pathPoint.initialX === tilePosX && pathPoint.initialY === tilePosY
        );
    }

    checkIfReversalOfDirectionNeeded() {
        const { forwards, backwards } = AnimationHelper.possibleDirections;
        loop1:
        for (var i = 0; i < this.objectsOnPath.length; i++) {
            const currentPathIndex = this.getCurrentPathPointIndexForObject(this.objectsOnPath[i]);
            if (currentPathIndex === this.pathPoints.length - 1 && this.currentDirection === forwards
                || currentPathIndex === 0 && this.currentDirection === backwards) {
                this.currentDirection = this.currentDirection === forwards ? backwards : forwards;
                this.currentStopFrame = 0;

                this.objectsOnPath.forEach(objectOnPath => {
                    if(objectOnPath.type === ObjectTypes.MOVING_PLATFORM) {
                        objectOnPath.setPlayerMomentumCoyoteFrames();
                    }

                    objectOnPath.xspeed = 0;
                    objectOnPath.yspeed = 0;
                });

                break loop1;
            }
        }
    }

    getCurrentAndNextPathPointForObject(objectOnPath) {
        const { forwards, backwards } = AnimationHelper.possibleDirections;
        const currentPathIndex = this.getCurrentPathPointIndexForObject(objectOnPath);
        let nextPathIndex = this.currentDirection === forwards ?
            currentPathIndex + 1 : currentPathIndex - 1;
        //loop path if at the end
        if (this.pathVariant === AnimationHelper.pathVariants.enclosed) {
            if (currentPathIndex === this.pathPoints.length - 1 && this.currentDirection === forwards) {
                nextPathIndex = 0;
            }
            else if (currentPathIndex === 0 && this.currentDirection === backwards) {
                nextPathIndex = this.pathPoints.length - 1;
            }
        }
        return { currentPathPoint: this.pathPoints[currentPathIndex], nextPathPoint: this.pathPoints[nextPathIndex] };
    }

    getNeededSpeedForNextPathPoint(objectOnPath, currentPathPoint, nextPathPoint) {
        objectOnPath.xspeed = 0;
        objectOnPath.yspeed = 0;

        if (currentPathPoint && nextPathPoint) {
            if (currentPathPoint.initialX < nextPathPoint.initialX) {
                objectOnPath.xspeed = this.speed;
            }
            else if (currentPathPoint.initialX > nextPathPoint.initialX) {
                objectOnPath.xspeed = this.speed * -1;
            }
            else if (currentPathPoint.initialY < nextPathPoint.initialY) {
                objectOnPath.yspeed = this.speed;
            }
            else if (currentPathPoint.initialY > nextPathPoint.initialY) {
                objectOnPath.yspeed = this.speed * -1;
            }
        }
    }
}