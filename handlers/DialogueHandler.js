class DialogueHandler {

    static staticConstructor() {
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
    }

    static setDialogueWindowToInactive() {
        this.active = false;
        this.dialogue = [];
        this.currentIndex = 0;
        this.currentAnimationFrame = 0;
        this.currentAnimationHeight = 0;
        this.arrowUpFrameIndex = 0;
        this.calculateDialogueWindowPosition();
    }

    static calculateDialogueWindowPosition() {
        const border = this.paddingFromBorder / Camera.viewport.scale;
        this.leftPos = Camera.viewport.left + border;
        this.topPos = Camera.viewport.top + Camera.viewport.height - (this.dialogueHeight / Camera.viewport.scale) - border;
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
        const currentLine = Math.floor(this.currentAnimationFrame / this.animationDurationFrames / this.maxLineLength);
        const calculatedDialogueWidth = Math.floor(this.dialogueWidth / Camera.viewport.scale);
        const calculatedDialogueHeight = Math.floor(this.dialogueHeight / Camera.viewport.scale);
        const currentBoxTopPosition = topPos + ((calculatedDialogueHeight - this.currentAnimationHeight) / 2);

        Display.drawRectangle(leftPos, currentBoxTopPosition,
            calculatedDialogueWidth, this.currentAnimationHeight, "000000");
        Display.drawRectangleBorder(leftPos, currentBoxTopPosition,
            calculatedDialogueWidth, this.currentAnimationHeight, "FFFFFF");
        Display.drawLine(leftPos + calculatedDialogueWidth - 80, currentBoxTopPosition, leftPos + calculatedDialogueWidth - 20, topPos,
            "000000", 2)

        if (this.currentAnimationHeight >= calculatedDialogueHeight) {
            for (var i = 0; i <= currentLine; i++) {
                if (i < this.dialogue[this.currentIndex].lines.length) {
                    this.animateText(leftPos, topPos, i);
                }
            }
            this.displayArrowUpIcon();
        }
        else {
            const step = calculatedDialogueHeight / this.frameDurationToShowDialogueBox;
            this.currentAnimationHeight += step;
        }
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

    static calculateTextLines(dialogue) {
        let text = dialogue;
        const lines = [];

        for (var i = 0; i < this.linesAmount; i++) {
            if (text.length > 0) {
                if (text.length > this.maxLineLength) {
                    for (let j = this.maxLineLength; j >= 0; j--) {
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

    static createDialogObject(dialogue) {
        return {
            textLength: dialogue.length,
            lines: this.calculateTextLines(dialogue)
        }
    }
}