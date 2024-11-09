class PlayerInteractionHandler {
    static lastTarget = null;
    static currentTarget = null;
    static blockers = [];
    static registeredTargets = [];
    static framesOnTarget = 0;
    static pressed = {};
    static justPressed = {};
    static recentlyBlocked = false;

    // putting TRIGGERS here instead of declaring a const because the export process only supports classes?
    static TRIGGERS = {
        UP_BUTTON : 'btn-up',
        DOWN_BUTTON : 'btn-down',
        AUTOMATIC : 'auto' // automaticaly triggered by overlap
    };

    static reset(includeControls) {
        this.currentTarget = null;
        this.framesOnTarget = 0;
        this.blockers = [];
        this.recentlyBlocked = false
        if (includeControls) {
            this.pressed = {};
            this.justPressed = {};
        }

        this.clearInteractionTargets();
    }

    static clearInteractionTargets() {
        this.registeredTargets = [];
        this.lastTarget = this.currentTarget;
    }

    static registerInteractionTarget(interactiveObject) {
        this.registeredTargets.push(interactiveObject);
    }

    static blockInteractionsFor(reasonString) {
        if (!this.blockers.includes(reasonString)) {
            this.blockers.push(reasonString);
        }
    }

    static unblockInteractionsFor(reasonString) {
        let index = this.blockers.indexOf(reasonString);
        if (index > -1) {
            this.blockers.splice(index, 1);
        }
    }

    static isTargeting(obj) {
        return this.currentTarget === obj;
    }

    static canTrigger(obj) {
        return (this.isTargeting(obj) && this.blockers.length === 0);
    }

    static willAllowJump() {
        let target = this.currentTarget || this.lastTarget;

        if (!target) {
            return true;
        }

        if (target.type === ObjectTypes.NPC) {
            // original NPC behavior uses jump button to trigger dialog
            return false;
        } 
        if (target.type === ObjectTypes.DOOR) {
            return (target.activationTrigger !== this.TRIGGERS.UP_BUTTON);
        }
    }

    static updateControl(id) {
        // should probably merge updateControl stuff into Controller and read from there instead?
        let buttonDown = Controller[id];
        this.justPressed[id] = buttonDown && !this.pressed[id];
        this.pressed[id] = buttonDown;
    }

    static handleInput() {
        // in future: should probably merge updateControl stuff into Controller and read from there instead?
        // controls need to be updated every frame
        this.updateControl('jump');
        this.updateControl('up');
        this.updateControl('down');

        if (!this.currentTarget) {
            return;
        }
        if (this.blockers.length > 0) {
            this.recentlyBlocked = true;
            return;
        }

        if (this.recentlyBlocked) {
            // wait an extra frame before interacting if recently blocked
            this.recentlyBlocked = false;
            return;
        }

        if (this.currentTarget.type === ObjectTypes.NPC) {
            // original NPC behavior is to trigger dialog with jump button
            // (would be nice to make it configurable in the future, so it doesn't block jumping)
            if (this.justPressed.jump) {
                this.currentTarget.startDialogue();
            }
        }
        if (this.currentTarget.type === ObjectTypes.DOOR) {
            let triggerType = this.currentTarget.activationTrigger;
            let cueEntrance = false;

            if (triggerType === this.TRIGGERS.AUTOMATIC) {
                cueEntrance = true;
            }
            else if (triggerType === this.TRIGGERS.UP_BUTTON) {
                cueEntrance = this.justPressed.up;
            }
            else if (triggerType === this.TRIGGERS.DOWN_BUTTON) {
                cueEntrance = this.justPressed.down;
            }
            
            if (cueEntrance) {
                this.currentTarget.sendPlayerThroughExit();
            }
        }
    }

    static updatePlayerTarget(player) {
        if (player.death) {
            this.lastTarget = this.currentTarget;
            this.currentTarget = null;
            return;
        }
        let minDist = Infinity;
        let nearestTarget = null;

        this.registeredTargets.forEach((target) => {
            let xDist = target.x - player.x;
            let yDist = target.y - player.y;
            let dist = Math.sqrt((xDist * xDist) + (yDist * yDist));
            if (dist < minDist) {
                minDist = dist;
                nearestTarget = target;
            }
        });

        this.lastTarget = this.currentTarget;
        this.currentTarget = nearestTarget;
    }

    static updateOverlay() {
        let target = this.currentTarget;

        if (!target) {
            // no target means no arrow to draw
            return;
        }

        if (this.blockers.length > 0) {
            // if currently blocked from interaction, don't show the arrow
            return;
        }

        // frame-based blink timing copied from orignal NPC code. might want some constants in lieu of magic numbers?
        if (target != this.lastTarget) {
            this.framesOnTarget = 0;
        } else {
            this.framesOnTarget++;
        }

        if ((this.framesOnTarget % 60) < 30) {
            if (target.activationTrigger && target.activationTrigger === this.TRIGGERS.DOWN_BUTTON) {
                this.drawDownArrow(target.x, target.y - target.tileSize);
            } 
            else if (!target.playAutomatically) { // this is an NPC quality -- it would be better to make it use standard triggers with doors
                this.drawUpArrow(target.x, target.y - target.tileSize);
            }
        }
    }

    static drawUpArrow(xPos, yPos) {
        const { pixelArrayUnitSize, tileSize } = tileMapHandler;
        const yAnchor = yPos + tileSize - pixelArrayUnitSize;

        Display.drawRectangle(xPos + pixelArrayUnitSize, yAnchor - pixelArrayUnitSize,
            pixelArrayUnitSize * 6, pixelArrayUnitSize, "FFFFFF")
        Display.drawRectangle(xPos + pixelArrayUnitSize * 2, yAnchor - pixelArrayUnitSize * 2,
            pixelArrayUnitSize * 4, pixelArrayUnitSize, "FFFFFF")
        Display.drawRectangle(xPos + pixelArrayUnitSize * 3, yAnchor - pixelArrayUnitSize * 3,
            pixelArrayUnitSize * 2, pixelArrayUnitSize, "FFFFFF")
    }

    static drawDownArrow(xPos, yPos) {
        const { pixelArrayUnitSize, tileSize } = tileMapHandler;
        const yAnchor = yPos + tileSize - pixelArrayUnitSize;

        Display.drawRectangle(xPos + pixelArrayUnitSize, yAnchor - pixelArrayUnitSize * 3,
            pixelArrayUnitSize * 6, pixelArrayUnitSize, "FFFFFF")
        Display.drawRectangle(xPos + pixelArrayUnitSize * 2, yAnchor - pixelArrayUnitSize * 2,
            pixelArrayUnitSize * 4, pixelArrayUnitSize, "FFFFFF")
        Display.drawRectangle(xPos + pixelArrayUnitSize * 3, yAnchor - pixelArrayUnitSize,
            pixelArrayUnitSize * 2, pixelArrayUnitSize, "FFFFFF")
    }
}