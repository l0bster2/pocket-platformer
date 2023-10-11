class Controller {

    static staticConstructor() {
        this.down = false;
        this.left = false;
        this.right = false;
        this.up = false;
        this.jump = false;
        this.jumpReleased = true;
        this.confirm = false;
        this.ctrlPressed = false;
        this.shiftPressed = false;
        this.shiftReleased = true;
        this.alternativeActionButton = false;
        this.alternativeActionButtonReleased = true;
        this.enter = false;
        this.enterReleased = true;
        this.pause = false;
        this.pauseReleased = true;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseXInDrawCanvas = 0;
        this.mouseYInDrawCanvas = 0;
        this.mousePressed = false;
        this.rightMousePressed = false;
        this.mouseInsideMainCanvas = false;
        this.mouseInsideDrawCanvas = false;
        this.xScroll = 0;
        this.yScroll = 0;
        this.gamepadIndex = null;
        window.addEventListener('gamepadconnected', (event) => {
            this.gamepadIndex = event.gamepad.index;
        });
        window.addEventListener('gamepaddisconnected', (event) => {
            this.gamepadIndex = null;
        });
        document.addEventListener("keyup", (e) => { this.keyUp(e) });
        document.addEventListener("keydown", (e) => { this.keyDown(e) });
        //startRemoval 
        document.addEventListener("mousedown", (e) => { this.mouseDown(e) });
        document.addEventListener("mouseup", (e) => { this.mouseUp(e) });
        window.onresize = this.onResize;
        window.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);
        document.addEventListener('scroll', () => { this.onScroll() });
        this.onScroll();
        //endRemoval

        this.addMobileControls();
    }

    static getMobileControlsPositions() {
        const rect = this.mobileArrows.getBoundingClientRect();
        this.mobileControlsLeftPos = rect.left;
        this.mobileControlsTopPos = rect.top;
        this.mobileControlsWidth = 110;
        this.mobileControlsHeight = this.mobileArrows.height;
    }

    static handleMobileArrowInput(e) {
        e.preventDefault();
        if ((e.touches[0].clientX < this.mobileControlsLeftPos + (this.mobileControlsWidth / 2))
            || (e.touches[1] && e.touches[1].clientX < this.mobileControlsLeftPos + (this.mobileControlsWidth / 2))) {
            this.left = true;
            this.up = false;
            this.down = true;
            this.right = false;
        }
        if ((e.touches[0].clientX > this.mobileControlsLeftPos + (this.mobileControlsWidth / 2) && e.touches[0].clientX < this.mobileControlsWidth + 20)
            || (e.touches[1] && e.touches[1].clientX > this.mobileControlsLeftPos + (this.mobileControlsWidth / 2) && e.touches[1].clientX < this.mobileControlsWidth + 20)) {
            this.right = true;
            this.up = true;
            this.down = false;
            this.left = false;
        }
    }

    static handleMobileArrowTouchEnd(e) {
        e.preventDefault();
        this.left = false;
        this.right = false;
    }

    static addMobileControls() {
        if (!WorldDataHandler.insideTool) {
            this.mobileArrows = document.getElementById("mobileArrows");
            this.getMobileControlsPositions();

            window.addEventListener("resize", () => {
                this.getMobileControlsPositions();
            })
            window.addEventListener('orientationchange', () => {
                this.getMobileControlsPositions();
            });
            this.mobileArrows.addEventListener("touchstart", (e) => {
                this.handleMobileArrowInput(e);
            });
            this.mobileArrows.addEventListener("touchmove", (e) => {
                this.handleMobileArrowInput(e);
            });
            this.mobileArrows.addEventListener("touchend", (e) => {
                this.handleMobileArrowTouchEnd(e);
            });

            [{ elementName: "selectMobileControls", variableNames: ["pause"] },
            { elementName: "startMobileControls", variableNames: ["enter"] },
            { elementName: "jumpMobileControls", variableNames: ["jump", "confirm"] },
            { elementName: "alternativeMobileControls", variableNames: ["alternativeActionButton"] },
            ].forEach(control => {
                const element = document.getElementById(control.elementName);
                element.addEventListener("touchstart", (e) => {
                    e.preventDefault();
                    if (control.variableNames.includes("enter")) {
                        this.mobileEnter = true;
                    }
                    control.variableNames.forEach(variable => this[variable] = true);
                });
                element.addEventListener("touchend", (e) => {
                    e.preventDefault();
                    if (control.variableNames.includes("enter")) {
                        this.mobileEnterReleased = true;
                    }
                    control.variableNames.forEach(variable => this[variable] = false);
                });
                element.addEventListener("touchcancel", (e) => {
                    e.preventDefault();
                    this[control.variableName] = false;
                });
            });
        }
    }

    static handleGamepadInput() {
        if (this.gamepadIndex !== null) {
            const DEADZONE = 0.5;
            const myGamepad = navigator.getGamepads()[this.gamepadIndex];
            if (myGamepad?.buttons) {
                const primaryButtonPressed = myGamepad.buttons[0].pressed;
                this.jump = primaryButtonPressed;
                this.confirm = primaryButtonPressed;
                this.alternativeActionButton = myGamepad.buttons[1].pressed || myGamepad.buttons[2].pressed;
                const enterAndPause = myGamepad.buttons[9].pressed || myGamepad.buttons[8].pressed;
                this.enter = enterAndPause;
                this.pause = enterAndPause;

                const v = this.getControllerAxesCorrectedValue(myGamepad.axes[0], DEADZONE);
                this.left = v < DEADZONE * -1 || myGamepad.buttons[14].pressed;
                this.right = v > DEADZONE || myGamepad.buttons[15].pressed;

                const h = this.getControllerAxesCorrectedValue(myGamepad.axes[1], DEADZONE);
                this.up = h < DEADZONE * -1 || myGamepad.buttons[12].pressed;
                this.down = h > DEADZONE || myGamepad.buttons[13].pressed;
            }
        }
    }

    static getControllerAxesCorrectedValue(value, DEADZONE) {
        let v = value;
        if (Math.abs(v) < DEADZONE) {
            v = 0;
        }
        else {
            v = v - Math.sign(v) * DEADZONE;
            v /= (1.0 - DEADZONE);
        }
        return v;
    }

    /*   
       Checks key presses by code and sets the according variable to true or false.
       That way, the function can be reused for key-down and up
    */
    static handleKeyPresses(pressed, e) {
        const key = e.key;
        switch (key) {
            case "Enter": this.enter = pressed; break;
            case "Right": case "ArrowRight": this.right = pressed; e.preventDefault(); break;
            case "d": this.right = pressed; break;
            case "Left": case "ArrowLeft": this.left = pressed; e.preventDefault(); break;
            case "a": this.left = pressed; break;
            case "Up": case "ArrowUp": case "w": this.up = pressed; this.jump = pressed; break;
            case "c": case "j": this.jump = pressed; this.confirm = pressed; break;
            case "x": case "k": this.alternativeActionButton = pressed; break;
            case "Down": case "ArrowDown": this.down = pressed; break;
            case "Control": this.ctrlPressed = pressed; break;
            case "Shift": this.shiftPressed = pressed; break;
            case "Escape": case "p": this.pause = pressed;
        }
    }

    static keyDown(e) {
        this.handleKeyPresses(true, e)
    };

    static keyUp(e) {
        this.handleKeyPresses(false, e)
    }

    static mouseLeave() {
        this.mouseInsideMainCanvas = false;
    }

    static mouseEnter() {
        this.mouseInsideMainCanvas = true;
    }

    static mouseLeaveDrawCanvas() {
        this.mouseInsideDrawCanvas = false;
    }

    static mouseEnterDrawCanvas() {
        this.mouseInsideDrawCanvas = true;
    }

    static mouseMove(e) {
        const coordinatesWithoutTranslation = Camera.worldToScreen(e.clientX, e.clientY);
        this.mouseX = coordinatesWithoutTranslation.x - canvasOffsetLeft + this.xScroll;
        this.mouseY = coordinatesWithoutTranslation.y - canvasOffsetTop + this.yScroll;
    }

    static mouseMoveDrawInCanvas(e) {
        this.mouseXInDrawCanvas = e.clientX;
        this.mouseYInDrawCanvas = e.clientY;
    }

    static mouseDown(evt) {
        switch (evt.which) {
            case 1:
                this.mousePressed = true;
                break;
            case 3:
                this.rightMousePressed = true;
                break;
            default:
                console.log('You have a strange Mouse!');
        }
    }

    static mouseUp() {
        this.mousePressed = false;
        this.rightMousePressed = false;
    }

    static onResize() {
        canvasOffsetLeft = document.getElementById("myCanvas").offsetLeft;
        canvasOffsetTop = document.getElementById("myCanvas").offsetTop;
    }

    static onScroll() {
        this.xScroll = window.scrollX;
        this.yScroll = window.scrollY;
        DrawSectionHandler.getBoundingRectPosition(0);
    }
}