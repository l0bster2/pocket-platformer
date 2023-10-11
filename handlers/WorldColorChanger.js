class WorldColorChanger {
    
    static getCurrentColor(levelIndex) {
        const levelColor = WorldDataHandler.levels[levelIndex]?.backgroundColor;
        if (levelColor && levelColor !== "transp") {
            return levelColor;
        }
        else {
            return WorldDataHandler.backgroundColor;
        }
    }

    static changeLevelColor(levelIndex) {
        const color = this.getCurrentColor(levelIndex);
        this.setBackgroundColor(color)
    }

    static setBackgroundColor(color) {
        const newColor = color.startsWith('#') ? color : "#" + color;
        const gameCanvas = document.getElementById("myCanvas");

        if (gameCanvas) {
            gameCanvas.style.backgroundColor = newColor;
        }

        if (WorldDataHandler.insideTool) {
            const drawCanvas = document.getElementById("redrawSpriteCanvas");
            const animationFrames = document.getElementsByClassName("animationFrameCanvas");

            if (drawCanvas) {
                drawCanvas.style.backgroundColor = newColor;
                drawCanvas.style.border = "3px solid" + newColor;
            }
            if (animationFrames) {
                for (var i = 0; i < animationFrames.length; i++) {
                    animationFrames[i].style.backgroundColor = newColor;
                }
            }
            //At the very beginning, some data doesn't exist yet, therefore the check
            DrawSectionHandler?.redrawSpriteCanvasCtx &&
                DrawSectionHandler?.redrawOutsideCanvases(true);
        }
    }

    static setTextColor(color) {
        WorldDataHandler.textColor = color.replace("#", "");
    }
}