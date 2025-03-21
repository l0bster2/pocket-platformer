class DialogueHandler {

    static staticConstructor(tileMapHandler, spriteCanvas) {
        this.setDialogueWindowToInactive();
        const dialogueWidthRelativetoCamera = 90;
        const dialogueHeightRelativetoCamera = 70;
        this.dialogueWidth = Camera.viewport.width / 100 * dialogueWidthRelativetoCamera;
        this.dialogueHeight = Camera.viewport.halfHeight / 100 * dialogueHeightRelativetoCamera;
        this.paddingFromBorder = Camera.viewport.width / 100 * (100 - dialogueWidthRelativetoCamera) / 2;
        this.upButtonReleased = false;
        this.animationDurationFrames = 2;
        this.linesAmount = 4;
        this.maxLineLength = 60;
        this.maxDialogueLength = 240;
        this.currentAnimationHeight = 0;
        this.frameDurationToShowDialogueBox = 8;
        this.spriteCanvas = spriteCanvas;
        this.tileMapHandler = tileMapHandler;
        this.avatarAnimationFrame = 0;
        this.currentSelectedAvatar = null;
        this.avatarOuterPadding = 40;
        this.avatarInnerPadding = 15;
    }

    static setDialogueWindowToInactive() {
        this.active = false;
        this.dialogue = [];
        this.currentIndex = 0;
        this.currentAnimationFrame = 0;
        this.currentAnimationHeight = 0;
        this.arrowUpFrameIndex = 0;
        this.avatarAnimationFrame = 0;
        this.calculateDialogueWindowPosition();
    }

    static calculateDialogueWindowPosition() {
        const border = this.paddingFromBorder / Camera.viewport.scale;
        this.leftPos = Camera.viewport.left + border;
        this.rightPos = Camera.viewport.left + Camera.viewport.width - border;
        this.topPos = Camera.viewport.top + Camera.viewport.height - (this.dialogueHeight / Camera.viewport.scale) - border;

        if(this.tileMapHandler) {
            this.avatarSize = this.tileMapHandler.tileSize * 3 / Camera.viewport.scale;
            this.avatarRightPos = this.rightPos - this.avatarSize - this.avatarOuterPadding / Camera.viewport.scale
            this.avatarLeftPos = this.leftPos + this.avatarOuterPadding / Camera.viewport.scale;
            this.textPosWithAvatarOnTheLeft = this.leftPos + this.avatarSize + (this.avatarInnerPadding + this.avatarOuterPadding) / Camera.viewport.scale;
        }
    }

    static handleDialogue() {
        if (this.active) {
            const animationLength = this.dialogue[this.currentIndex].textLength * this.animationDurationFrames
            const animationPlaying = this.currentAnimationFrame <= animationLength;
            if (animationPlaying) {
                this.currentAnimationFrame++;
            }
            if (this.upButtonReleased && Controller.jump) {
                //If not all text is visible, by pressing jump all text is shown right away. Otherwise go to next dialogue
                if (animationPlaying) {
                    this.currentAnimationFrame = animationLength;
                } else {
                    if (this.currentIndex < this.dialogue.length - 1) {
                        SoundHandler.dialogueSound.stopAndPlay();
                        this.currentIndex++;
                        this.currentAnimationFrame = 0;
                        this.avatarAnimationFrame = 0;
                    }
                    else {
                        this.setDialogueWindowToInactive();
                    }
                }
                this.upButtonReleased = false;
            }
            if (!Controller.jump) {
                this.upButtonReleased = true;
            }
            if (this.active) {
                this.displayDialogue();
            }
        }
    }

    static displayDialogue() {
        const { leftPos, topPos } = this;
        const currentLineLength = this.dialogue[this.currentIndex].lineLength;
        const currentLine = Math.floor(this.currentAnimationFrame / this.animationDurationFrames / currentLineLength);
        const calculatedDialogueWidth = Math.floor(this.dialogueWidth / Camera.viewport.scale);
        const calculatedDialogueHeight = Math.floor(this.dialogueHeight / Camera.viewport.scale);
        const currentBoxTopPosition = topPos + ((calculatedDialogueHeight - this.currentAnimationHeight) / 2);

        Display.drawRectangle(leftPos, currentBoxTopPosition,
            calculatedDialogueWidth, this.currentAnimationHeight, "000000");
        Display.drawRectangleBorder(leftPos, currentBoxTopPosition,
            calculatedDialogueWidth, this.currentAnimationHeight, "FFFFFF");
        Display.drawLine(leftPos + calculatedDialogueWidth - 80, currentBoxTopPosition, leftPos + calculatedDialogueWidth - 20, topPos,
            "000000", 2);

        const avatarOnTheLeft = this.dialogue[this.currentIndex].avatar?.position === AnimationHelper.facingDirections.left;

        if (this.currentAnimationHeight >= calculatedDialogueHeight) {
            for (var i = 0; i <= currentLine; i++) {
                if (i < this.dialogue[this.currentIndex].lines.length) {
                    this.animateText(
                        avatarOnTheLeft
                            ? this.textPosWithAvatarOnTheLeft
                            : leftPos,
                        topPos, i);
                }
            }
            this.displayArrowUpIcon();

            if (this.dialogue[this.currentIndex].avatar) {
                this.displayAvatar(currentBoxTopPosition + calculatedDialogueHeight / 2 - this.avatarSize / 2);
            }
        }
        else {
            const step = calculatedDialogueHeight / this.frameDurationToShowDialogueBox;
            this.currentAnimationHeight += step;
        }
    }

    static displayAvatar(top) {
        const { avatar } = this.dialogue[this.currentIndex];
        const frameModulo = this.avatarAnimationFrame % 40;
        const animationIndex = avatar.animationLength > 1 && frameModulo > 20 ? 1 : 0;
        this.avatarAnimationFrame++;

        const avatarLeftPos = avatar.position === AnimationHelper.facingDirections.right
            ? this.avatarRightPos
            : this.avatarLeftPos;
        const avatarBorderPadding = this.avatarInnerPadding / Camera.viewport.scale;

        if (avatar.border) {
            const borderSize = (this.tileMapHandler.tileSize * 3 + this.avatarInnerPadding  * 2) / Camera.viewport.scale;
            Display.drawRectangleBorder(avatarLeftPos - avatarBorderPadding,
                top - avatarBorderPadding,
                borderSize,
                borderSize,
                "FFFFFF");
        }
        Display.drawPixelArray(avatar.spriteObject.animation[animationIndex].sprite,
            avatarLeftPos, top,
            Math.round(this.tileMapHandler.pixelArrayUnitSize * 3 / Camera.viewport.scale),
            avatar.spriteObject.animation[animationIndex].sprite[0].length, 
            avatar.spriteObject.animation[animationIndex].sprite.length
        );
    }

    static displayArrowUpIcon() {
        const { leftPos, topPos } = this;

        this.arrowUpFrameIndex++;
        const frameModulo = this.arrowUpFrameIndex % 60;
        if (frameModulo < 30) {
            this.showDialogueUpArrow(leftPos + (this.dialogueWidth / Camera.viewport.scale) - 60, topPos - 15);
        }
    }

    static animateText(leftPos, topPos, lineIndex) {
        let previousLinesLength = 0;
        const topPadding = 35 / Camera.viewport.scale;
        const lineBreakHeight = 30 / Camera.viewport.scale;
        const dialoguesLines = this.dialogue[this.currentIndex].lines;
        for (var i = 0; i < lineIndex; i++) {
            previousLinesLength += dialoguesLines[i].length;
        }
        const currentText = dialoguesLines[lineIndex].substring(0,
            Math.ceil(this.currentAnimationFrame / this.animationDurationFrames - previousLinesLength));
        Display.displayText(currentText, leftPos + (20 / Camera.viewport.scale),
            topPos + topPadding + (lineIndex * lineBreakHeight),
            17 / Camera.viewport.scale, "#FFFFFF", "left");
    }

    static calculateTextLines(dialogue, lineLength) {
        let text = dialogue;
        const lines = [];

        for (var i = 0; i < this.linesAmount; i++) {
            if (text.length > 0) {
                if (text.length > lineLength) {
                    for (let j = lineLength; j >= 0; j--) {
                        if (text.charAt(j) === " ") {
                            lines.push(text.substr(0, j));
                            text = text.slice(j + 1);
                            break;
                        }
                    }
                }
                else {
                    lines.push(text.substr(0, text.length).trimEnd());
                    text = text.slice(text.length).trimEnd();
                }
            }
        }
        return lines;
    }

    static showDialogueUpArrow(xPos, yPos) {
        const { pixelArrayUnitSize, tileSize } = tileMapHandler;
        const yAnchor = yPos + tileSize - pixelArrayUnitSize;

        Display.drawRectangle(xPos + pixelArrayUnitSize, yAnchor - pixelArrayUnitSize,
            pixelArrayUnitSize * 6, pixelArrayUnitSize, "FFFFFF")
        Display.drawRectangle(xPos + pixelArrayUnitSize * 2, yAnchor - pixelArrayUnitSize * 2,
            pixelArrayUnitSize * 4, pixelArrayUnitSize, "FFFFFF")
        Display.drawRectangle(xPos + pixelArrayUnitSize * 3, yAnchor - pixelArrayUnitSize * 3,
            pixelArrayUnitSize * 2, pixelArrayUnitSize, "FFFFFF")
    }

    static createDialogObject(dialogue, avatar) {
        let avatarObject = null;
        let lineLength = this.maxLineLength;

        if (avatar) {
            const canvasYPos = SpritePixelArrays.getIndexOfSprite(avatar.descriptiveName, 0, "descriptiveName") * this.tileMapHandler.tileSize;
            const spriteObject = SpritePixelArrays.getSpritesByDescrpitiveName(avatar.descriptiveName)[0];
            avatarObject = spriteObject ?
                {
                    canvasYPos,
                    animationLength: spriteObject.animation.length,
                    spriteObject: spriteObject,
                    border: avatar.border,
                    position: avatar.position
                } : null;
            lineLength = Camera.viewport.scale > 1 ? lineLength - 10 : lineLength - 6;
        }

        return {
            textLength: dialogue.length,
            lines: this.calculateTextLines(dialogue, lineLength),
            lineLength,
            avatar: avatarObject,
        }
    }
}