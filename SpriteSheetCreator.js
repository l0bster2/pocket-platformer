class SpriteSheetCreator {

    constructor(tileMapHandler, spriteCanvas) {
        this.tileMapHandler = tileMapHandler;
        this.spriteCanvas = spriteCanvas;
        this.spriteCanvasWidth = this.spriteCanvas.width;
        this.spriteCanvasHeight = this.spriteCanvas.height;
        this.flipDirection = { horizontally: "horizontally", vertically: "vertically" };
        this.spriteCtx = this.spriteCanvas.getContext("2d");
        this.setCanvasSize();
        this.createSpriteSheet();
    }

    setCanvasSize() {
        const { tileSize } = WorldDataHandler;
        //4 directions, 2 max frames, 12 just a buffer to make sure
        this.spriteCanvas.width = 4 * 2 * tileSize + 12;
        //all sprites + possible 18 custom sprites + 12 for buffer
        this.spriteCanvas.height = SpritePixelArrays.allSprites.length * tileSize + (18 * tileSize) + 12;
    }

    createSpriteSheet() {
        this.spriteCtx.clearRect(0, 0, this.spriteCanvasWidth, this.spriteCanvasHeight);
        SpritePixelArrays.allSprites.forEach((SpriteObject, spriteObjectIndex) => {
            if (SpriteObject.animation) {
                this.createSprite(SpriteObject, spriteObjectIndex)
            }
        });
    }

    redrawSprite(SpriteObject, spriteObjectIndex) {
        const { tileSize } = this.tileMapHandler;
        this.spriteCtx.clearRect(0, spriteObjectIndex * tileSize, this.spriteCanvasWidth, spriteObjectIndex * tileSize + tileSize);
        this.createSpriteSheet(SpriteObject, spriteObjectIndex)
    }

    createSprite(SpriteObject, spriteObjectIndex) {
        if (SpriteObject?.directions) {
            const { right, left, top, bottom } = AnimationHelper.facingDirections;
            if (SpriteObject.directions[0] === bottom || SpriteObject.directions[0] === top) {
                for (var i = 0; i < SpriteObject.directions.length; i++) {
                    if (SpriteObject.directions[i] === left) {
                        let flipppedSprite = i === 0 ? SpriteObject : this.turnSprite(SpriteObject);
                        this.drawAnimation(flipppedSprite.animation, spriteObjectIndex, i);
                    }
                    if (SpriteObject.directions[i] === top) {
                        const turnedSprite = i === 0 ? SpriteObject : this.flipSprite(SpriteObject, this.flipDirection.vertically);
                        this.drawAnimation(turnedSprite.animation, spriteObjectIndex, i);
                    }
                    if (SpriteObject.directions[i] === bottom) {
                        const turnedBottomSprite = i === 0 ? SpriteObject : this.flipSprite(SpriteObject, this.flipDirection.vertically);
                        this.drawAnimation(turnedBottomSprite.animation, spriteObjectIndex, i);
                    }
                    if (SpriteObject.directions[i] === right) {
                        const flipppedSprite = i === 0 ? SpriteObject : this.turnSprite(SpriteObject, true);
                        this.drawAnimation(flipppedSprite.animation, spriteObjectIndex, i);
                    }
                }
            }
            else {
                for (var i = 0; i < SpriteObject.directions.length; i++) {
                    if (SpriteObject.directions[i] === left) {
                        let flipppedSprite = i === 0 ? SpriteObject : this.flipSprite(SpriteObject, this.flipDirection.horizontally);
                        this.drawAnimation(flipppedSprite.animation, spriteObjectIndex, i);
                    }
                    if (SpriteObject.directions[i] === top) {
                        const turnedSprite = i === 0 ? SpriteObject : this.turnSprite(SpriteObject);
                        this.drawAnimation(turnedSprite.animation, spriteObjectIndex, i);
                    }
                    if (SpriteObject.directions[i] === bottom) {
                        const turnedBottomSprite = i === 0 ? SpriteObject : this.turnSprite(SpriteObject, true);
                        this.drawAnimation(turnedBottomSprite.animation, spriteObjectIndex, i);
                    }
                    if (SpriteObject.directions[i] === right) {
                        const flipppedSprite = i === 0 ? SpriteObject : this.flipSprite(SpriteObject, this.flipDirection.horizontally);
                        this.drawAnimation(flipppedSprite.animation, spriteObjectIndex, i);
                    }
                }
            }
        }
        else {
            this.drawAnimation(SpriteObject.animation, spriteObjectIndex);
        }
    }

    //loop variable is there, so you can add more sprite on the same y-axis (f.e. for flipped sprites)
    drawAnimation(animation, yIndex, loop = 0) {
        const { tileSize, pixelArrayUnitSize, pixelArrayUnitAmount } = this.tileMapHandler;
        animation.forEach((SpritePixelArray, spriteIndex) => {
            Display.drawPixelArray(SpritePixelArray.sprite, (spriteIndex + (animation.length * loop)) * tileSize,
                yIndex * tileSize, pixelArrayUnitSize,
                pixelArrayUnitAmount, this.spriteCtx);
        });
    }

    flipSprite(SpritePixelArrayAnimation, flipDirection) {
        let flippedAnimation = [];
        SpritePixelArrayAnimation.animation.map((animationFrame) => {
            if (flipDirection === this.flipDirection.horizontally) {
                let flippedSprite = this.hflip(animationFrame.sprite);
                flippedAnimation.push({ sprite: flippedSprite });
            }
            if (flipDirection === this.flipDirection.vertically) {
                let flippedSprite = this.vflip(animationFrame.sprite);
                flippedAnimation.push({ sprite: flippedSprite });
            }
        });

        let flippedSpriteObject = JSON.parse(JSON.stringify(SpritePixelArrayAnimation));
        flippedSpriteObject.animation = flippedAnimation;
        return flippedSpriteObject;
    }

    turnSprite(SpritePixelArrayAnimation, bigRotation = false) {
        let turnedAnimation = [];
        SpritePixelArrayAnimation.animation.map((animationFrame) => {

            var newArray = [];

            if (bigRotation) {
                newArray = this.rotate270(animationFrame.sprite);
            }
            if (!bigRotation) {
                newArray = this.rotate90(animationFrame.sprite);
            }
            turnedAnimation.push({ sprite: newArray });
        });
        let turnedSpriteObject = JSON.parse(JSON.stringify(SpritePixelArrayAnimation));
        turnedSpriteObject.animation = turnedAnimation;
        return turnedSpriteObject;
    }

    hflip(a) {
        const h = a.length;
        let b = new Array(h);

        for (let y = 0; y < h; y++) {
            let w = a[y].length;
            b[y] = new Array(w);
            b[y] = a[y].slice().reverse();
        }

        return b;
    }

    vflip(a) {
        const h = a.length;
        let b = new Array(h);

        for (let y = 0; y < h; y++) {
            let w = a[y].length;
            let n = h - 1 - y;
            b[n] = new Array(w);

            for (let x = 0; x < w; x++) {
                b[n][x] = a[y][x];
            }
        }

        return b;
    }

    rotate90(a) {
        const w = a.length;
        const h = a[0].length;
        let b = new Array(h);

        for (let y = 0; y < h; y++) {
            b[y] = new Array(w);

            for (let x = 0; x < w; x++) {
                b[y][x] = a[w - 1 - x][y];
            }
        }

        return b;
    }

    rotateCounterClockwise(a){
        var n=a.length;
        for (var i=0; i<n/2; i++) {
            for (var j=i; j<n-i-1; j++) {
                var tmp=a[i][j];
                a[i][j]=a[j][n-i-1];
                a[j][n-i-1]=a[n-i-1][n-j-1];
                a[n-i-1][n-j-1]=a[n-j-1][i];
                a[n-j-1][i]=tmp;
            }
        }
        return a;
    }

    rotate270(a) {
        const w = a.length;
        const h = a[0].length;
        let b = new Array(h);

        for (let y = 0; y < h; y++) {
            b[y] = new Array(w);

            for (let x = 0; x < w; x++) {
                b[y][x] = a[x][h - 1 - y];
            }
        }

        return b;
    }
}

