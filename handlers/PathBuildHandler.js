class PathBuildHandler {

    static staticConstructor(tileMapHandler) {
        this.tileMapHandler = tileMapHandler;
    }

    static checkIfPathPlacementFree(tilePosX, tilePosY) {
        let pathPlacementAllowed = true;
        const { paths } = this.tileMapHandler;

        loop1:
        for (var i = 0; i < paths.length; i++) {
            for (var j = 0; j < paths[i].pathPoints.length; j++) {
                const pathPoint = paths[i].pathPoints[j];
                const { initialX, initialY } = pathPoint;
                const { vertical, horizontal, corner } = AnimationHelper.alignments;

                if (initialX === tilePosX && initialY === tilePosY) {
                    pathPlacementAllowed = false;
                    break loop1;
                }

                const neightbourAtDirection = TilemapHelpers.check8DirectionsNeighbours(tilePosX, tilePosY, initialX, initialY);

                if (neightbourAtDirection) {
                    if (paths[i].pathVariant === AnimationHelper.pathVariants.enclosed) {
                        pathPlacementAllowed = false;
                        break loop1;
                    }
                    else if (paths[i].pathVariant === AnimationHelper.pathVariants.line) {
                        const straightNeighbour = (neightbourAtDirection.alignment === vertical || neightbourAtDirection.alignment === horizontal);
                        if (straightNeighbour && pathPoint.alignment !== corner) {
                            pathPlacementAllowed = false;
                            break loop1;
                        }
                        else if (straightNeighbour && pathPoint.alignment === corner &&
                            (pathPoint.key !== paths[i].startPointKey && pathPoint.key !== paths[i].endPointKey)) {
                            pathPlacementAllowed = false;
                            break loop1;
                        }
                    }
                }
            }
        }
        return pathPlacementAllowed;
    }

    static rearrangePaths(position) {
        let { paths, tileSize } = this.tileMapHandler;
        const { vertical, horizontal } = AnimationHelper.alignments;
        let verticalOrHorizontalNeighbours = [];

        //count how many endpoints are touched
        loop1:
        for (var pathIndex = 0; pathIndex < paths.length; pathIndex++) {
            for (var j = 0; j < paths[pathIndex].pathPoints.length; j++) {
                const { initialX, initialY } = paths[pathIndex].pathPoints[j];
                const neightbourAtDirection = TilemapHelpers.check8DirectionsNeighbours(position.x, position.y, initialX, initialY);
                if (neightbourAtDirection && (neightbourAtDirection.alignment === vertical || neightbourAtDirection.alignment === horizontal)) {
                    verticalOrHorizontalNeighbours.push(pathIndex);
                    if (verticalOrHorizontalNeighbours.length === 2) {
                        break loop1;
                    }
                }
            }
        }

        //new pathpoint added, that doesn't touch other pathpoints - new path
        if (verticalOrHorizontalNeighbours.length === 0) {
            const newPath = new Path(this.tileMapHandler);
            newPath.pathPoints = [new PathPoint(position.x, position.y, tileSize)];
            paths.push(newPath);
        }
        //added one pathpoint to an endpoint of a path
        else if (verticalOrHorizontalNeighbours.length === 1) {
            paths[verticalOrHorizontalNeighbours[0]].pathPoints.push(new PathPoint(position.x, position.y, tileSize))
        }
        //touching 2 pathpoints
        else if (verticalOrHorizontalNeighbours.length === 2) {
            //same path, just "close" it by putting one more pathpoint
            if (verticalOrHorizontalNeighbours[0] === verticalOrHorizontalNeighbours[1]) {
                paths[verticalOrHorizontalNeighbours[0]].pathPoints.push(new PathPoint(position.x, position.y, tileSize))
            }
            else {
                //merge 2 different paths
                const { winningPath, losingPath } = this.checkWinningPath(verticalOrHorizontalNeighbours);

                if (paths[losingPath]?.pathPoints) {
                    paths[winningPath].pathPoints = paths[winningPath].pathPoints.concat(paths[losingPath].pathPoints);
                    paths[winningPath].objectsOnPath = paths[winningPath].pathPoints.concat(paths[losingPath].objectsOnPath);
                    paths[winningPath].pathPoints.push(new PathPoint(position.x, position.y, tileSize))
                    paths.splice(losingPath, 1);
                }
            }
        }
        this.updateAllPathData();
    }

    //If 2 paths are merged, the attributes (speed, direction etc.) will be kept from the one, that was changed by the user
    static checkWinningPath(verticalOrHorizontalNeighbours) {
        const firstPath = this.tileMapHandler?.paths[verticalOrHorizontalNeighbours[0]];
        const secondPath = this.tileMapHandler?.paths[verticalOrHorizontalNeighbours[1]];
        const standardResult = {
            winningPath: verticalOrHorizontalNeighbours[0],
            losingPath: verticalOrHorizontalNeighbours[1]
        }
        const reverseResult = {
            winningPath: verticalOrHorizontalNeighbours[1],
            losingPath: verticalOrHorizontalNeighbours[0]
        }
        if (firstPath.key === secondPath.key) {
            return standardResult;
        }
        const differentFromDefault = SpritePixelArrays.PATH_SPRITE.changeableAttributes.find(changeableAttribute =>
            secondPath[changeableAttribute.name] !== changeableAttribute.defaultValue
        );
        return differentFromDefault ? reverseResult : standardResult;
    }

    static removePathFromData(tilePosX, tilePosY, objectsDeletedInOneGo) {
        let pathIndex;
        let pathPointIndex;
        const { paths } = this.tileMapHandler;
        //find pathPoint in paths
        loop1:
        for (var i = 0; i < paths.length; i++) {
            for (var j = 0; j < paths[i].pathPoints.length; j++) {
                const pathPoint = paths[i].pathPoints[j];
                if (pathPoint.initialX === tilePosX && pathPoint.initialY === tilePosY) {
                    const found = objectsDeletedInOneGo.find(objectAlreadyDeleted =>
                        objectAlreadyDeleted.x === tilePosX && objectAlreadyDeleted.y === tilePosY);
                    //if objects on top of path was deleted, only delete object on top (otherwise mouse right needs to be released first)
                    if (!found) {
                        pathIndex = i;
                        pathPointIndex = j;
                        break loop1;
                    }
                    else {
                        paths[i].checkObjectsOnPath();
                    }
                }
            }
        }
        //remove in a specific way depending on path-type
        if (typeof (pathIndex) != "undefined" && typeof (pathPointIndex) != "undefined") {
            const path = paths[pathIndex];
            if (path.pathVariant === AnimationHelper.pathVariants.enclosed) {
                path.pathPoints.splice(pathPointIndex, 1);
            }
            else if (path.pathVariant === AnimationHelper.pathVariants.singlePoint) {
                path.pathPoints.splice(pathPointIndex, 1);
                paths.splice(pathIndex, 1);
            }
            //line
            else {
                const pathPoint = path.pathPoints[pathPointIndex];
                //if endpoint, just delete it
                if (pathPoint.key === path.startPointKey || pathPoint.key === path.endPointKey) {
                    path.pathPoints.splice(pathPointIndex, 1);
                }
                //if line cut in the middle, but path in 2 paths
                else {
                    const firstHalf = path.pathPoints.slice(0, pathPointIndex);
                    const secondHalf = path.pathPoints.slice(pathPointIndex + 1, path.pathPoints.length);
                    path.pathPoints.splice(pathPointIndex, 1);

                    path.pathPoints = firstHalf;
                    const newPath = new Path(this.tileMapHandler);
                    newPath.pathPoints = secondHalf;
                    paths.push(newPath);
                }
            }
        }
        this.updateAllPathData();
    }

    //after adding or deleting a pathpoint, we need to rearrange pathpoint alignment, recheck the objects on them and update worlddata
    static updateAllPathData() {
        const { paths } = this.tileMapHandler;
        paths.forEach(path => {
            path.rearrangePathPoints();
            path.checkObjectsOnPath();
        })
        this.updatePathsInWorldDatahandler();
    }

    static updatePathsInWorldDatahandler() {
        WorldDataHandler.levels[this.tileMapHandler.currentLevel].paths = [];
        this.tileMapHandler.paths.forEach((path) => {
            const { speed, stopFrames, direction, pathVariant, movementDirection } = path;
            const pathPoints = path.pathPoints.map(pathPoint => {
                const { initialX, initialY, alignment } = pathPoint;
                return { initialX, initialY, alignment };
            });
            WorldDataHandler.levels[this.tileMapHandler.currentLevel].paths.push({
                speed, stopFrames, direction, movementDirection, pathVariant, pathPoints
            })
        });
    }
}