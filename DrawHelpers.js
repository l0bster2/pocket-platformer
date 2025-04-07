class DrawHelpers {
    
    static deleteSprite() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const emptySprite = JSON.parse(JSON.stringify(SpritePixelArrays.createDynamicEmptySprite(DrawSectionHandler.currentSpriteWidth, DrawSectionHandler.currentSpriteHeight)));
        sprite.animation[animationFrame].sprite = emptySprite.sprite;
        this.redrawAllSprites();
    }

    static flipHorzontally() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const flippedSprite = spriteSheetCreator.hflip(sprite.animation[animationFrame].sprite);
        sprite.animation[animationFrame].sprite = flippedSprite;
        this.redrawAllSprites();
    }

    static flipVertically() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const flippedSprite = spriteSheetCreator.vflip(sprite.animation[animationFrame].sprite);
        sprite.animation[animationFrame].sprite = flippedSprite;
        this.redrawAllSprites();
    }

    static moveUp() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const movedSprite = this.swapLastWithFirst(sprite.animation[animationFrame].sprite);
        sprite.animation[animationFrame].sprite = movedSprite;
        this.redrawAllSprites();
    }

    static moveDown() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const movedSprite = this.swapFirstWithlast(sprite.animation[animationFrame].sprite);
        sprite.animation[animationFrame].sprite = movedSprite;
        this.redrawAllSprites();
    }

    static moveLeft() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const movedSprite =  sprite.animation[animationFrame].sprite.map(arrayLine => 
            this.swapLastWithFirst(arrayLine));
        sprite.animation[animationFrame].sprite = movedSprite;
        this.redrawAllSprites();
    }

    static moveRight() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const movedSprite =  sprite.animation[animationFrame].sprite.map(arrayLine => 
            this.swapFirstWithlast(arrayLine));
        sprite.animation[animationFrame].sprite = movedSprite;
        this.redrawAllSprites();
    }

    static rotateLeft() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const flippedSprite = spriteSheetCreator.rotate90(sprite.animation[animationFrame].sprite);
        sprite.animation[animationFrame].sprite = flippedSprite;
        this.redrawAllSprites();
    }

    static rotateRight() {
        const { animationFrame, sprite } = DrawSectionHandler.currentSprite;
        const flippedSprite = spriteSheetCreator.rotateCounterClockwise(sprite.animation[animationFrame].sprite);
        sprite.animation[animationFrame].sprite = flippedSprite;
        this.redrawAllSprites();
    }

    static swapLastWithFirst(arr) {
        var tempArray = arr;
        var firstElement = tempArray.shift();
        tempArray.push(firstElement);
        return tempArray;
    }

    static swapFirstWithlast(arr) {
        var tempArray = arr;
        var firstElement = tempArray.pop();
        tempArray.unshift(firstElement);
        return tempArray;
    }

    static redrawAllSprites() {
        DrawSectionHandler.drawCurrentSprite();
        DrawSectionHandler.redrawOutsideCanvases(true);
        DrawSectionHandler.drawCurrentSprite();
        DrawSectionHandler.redrawOutsideCanvases();
    }
}