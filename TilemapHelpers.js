class TilemapHelpers {

    static check8DirectionsNeighbours(oX, oY, nX, nY) {
        if (nX === oX && nY === oY - 1) {
            return { x: oX, y: oY - 1, alignment: AnimationHelper.alignments.vertical };
        }
        else if (nX === oX && nY === oY + 1) {
            return { x: oX, y: oY + 1, alignment: AnimationHelper.alignments.vertical };
        }
        else if (nX === oX - 1 && nY === oY) {
            return { x: oX - 1, y: oY + 1, alignment: AnimationHelper.alignments.horizontal };
        }
        else if (nX === oX + 1 && nY === oY) {
            return { x: oX + 1, y: oY + 1, alignment: AnimationHelper.alignments.horizontal };
        }
        else if (nX === oX - 1 && nY === oY - 1) {
            return { x: oX - 1, y: oY - 1, alignment: AnimationHelper.alignments.corner };
        }
        else if (nX === oX + 1 && nY === oY - 1) {
            return { x: oX + 1, y: oY - 1, alignment: AnimationHelper.alignments.corner };
        }
        else if (nX === oX + 1 && nY === oY + 1) {
            return { x: oX + 1, y: oY + 1, alignment: AnimationHelper.alignments.corner };
        }
        else if (nX === oX - 1 && nY === oY + 1) {
            return { x: oX - 1, y: oY + 1, alignment: AnimationHelper.alignments.corner };
        }
        return null;
    }

    static sortArrayByXandY(firstEl, secondEl, firstElDir, secondElDir, firstElPos, secondElPos) {
        const bothStompers = firstEl.type === ObjectTypes.STOMPER && secondEl.type === ObjectTypes.STOMPER;

        if (bothStompers) {
            const { left, top, right, bottom } = AnimationHelper.facingDirections;
            const bottomSame = firstElDir === bottom && secondElDir === bottom || !firstElDir && !secondElDir;
            const topSame = firstElDir === top && secondElDir === top;
            const rightSame = firstElDir === right && secondElDir === right;
            const leftSame = firstElDir === left && secondElDir === left;
            const { x: firstX, y: firstY } = firstElPos;
            const { x: secondX, y: secondY } = secondElPos;

            if (firstY < secondY && bottomSame ||
                firstY > secondY && topSame ||
                firstX < secondX && rightSame ||
                firstX > secondX && leftSame) {
                return -1;
            }
            else {
                return 1;
            }
        }
        return 0;
    }

    static splitArrayIn2(array, filter) {
        let pass = [], fail = [];
        array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
        return [pass, fail];
    }

    static resortPath(pathPoints, startPoint, endPoint) {
        let arr = [...pathPoints];
        arr = arr.filter(item => item.key !== startPoint.key);
        arr.unshift(startPoint);

        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = 0; j < arr.length; j++) {
                const neightbourAtDirection = TilemapHelpers.check8DirectionsNeighbours(arr[i].initialX, arr[i].initialY, arr[j].initialX, arr[j].initialY);
                if (!(arr[i].key === startPoint.key && arr[j].key === endPoint.key) &&
                    arr[i + 1].key !== arr[j].key && i + 1 !== j && j > i && neightbourAtDirection &&
                    (neightbourAtDirection.alignment === AnimationHelper.alignments.horizontal || neightbourAtDirection.alignment === AnimationHelper.alignments.vertical)) {
                    var temp = arr[j]
                    arr[j] = arr[i + 1]
                    arr[i + 1] = temp
                }
            }
        }
        return arr;
    }

    static findStartAndEndPointForLine(endpoints) {
        let startPoint = endpoints[0];
        let endPoint = endpoints[1];

        if (startPoint.initialX > endPoint.initialX || (startPoint.initialX === endPoint.initialX && startPoint.initialY > endPoint.initialY)) {
            startPoint = endpoints[1];
            endPoint = endpoints[0];
        }
        return { startPoint, endPoint };
    }

    static findFirstFreePosition(tileMapHandler) {
        const { tileMap, levelHeight, levelWidth } = tileMapHandler;
        let posX = 0;
        let posY = 0;

        loop1:
        for (var tilePosY = 0; tilePosY < levelHeight; tilePosY++) {
            for (var tilePosX = 0; tilePosX < levelWidth; tilePosX++) {
                var tileType = tileMap[tilePosY][tilePosX];
                if (tileType === 0) {
                    posX = tilePosX;
                    posY = tilePosY;
                    break loop1;
                }
            }
        }
        return { x: posX, y: posY };
    }

    static findStartAndEndPointForEnclosedPath(pathPoints) {
        //find the highest lane in a path
        const sortedByY = pathPoints.sort((a, b) => a.initialY - b.initialY);
        const highestLane = sortedByY.filter(pathPoint => pathPoint.initialY === sortedByY[0].initialY);

        //sort hightest lane by x
        const sortHightestLaneByX = highestLane.sort((a, b) => b.initialX - a.initialX);

        //idea behind that is, that the pathpoints going from left to right on the highest lane, go clockwise (forwards)
        return { startPoint: sortHightestLaneByX[0], endPoint: sortHightestLaneByX[1] };
    }

    static doTwoObjectsSeeEachOther(obj1, obj2, tilemapHandler, angle) {
        let objectsSeeEachOther = true;
        const halfTile = tilemapHandler.halfTileSize;
        const ob1XCenter = obj1.x + halfTile;
        const ob1YCenter = obj1.y + halfTile;
        const dx = (obj2.x + halfTile) - ob1XCenter;
        const dy = (obj2.y + halfTile) - ob1YCenter;
        const xFrames = Math.abs(Math.round(dx / halfTile));
        const yFrames = Math.abs(Math.round(dy / halfTile));
        const biggerFrames = Math.max(xFrames, yFrames);
        const incrementX = dx / biggerFrames;
        const incrementY = dy / biggerFrames;
        for (var frame = 0; frame < biggerFrames - 1; frame++) {
            const xStep = ob1XCenter + (incrementX * frame);
            const yStep = ob1YCenter + (incrementY * frame);
            const currentTile = tilemapHandler.getTileLayerValueByIndex(
                tilemapHandler.getTileValueForPosition(yStep),
                tilemapHandler.getTileValueForPosition(xStep));

            const zeroTo360 = (angle + 360) % 360;
            //if going up, can see through one-way platforms
            if (currentTile !== 0 && !(zeroTo360 > 0 && zeroTo360 < 180 && currentTile === 5)) {
                objectsSeeEachOther = false;
                break;
            }
        }
        return objectsSeeEachOther;
    }

    static makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}