class Weapon extends LevelObject {

    constructor(x, y, tileSize, type, tileMapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type);
        this.hitBoxOffset = 0;
        this.tileMapHandler = tileMapHandler;
        this.pickupSound = 'pickup';
    }

    getCategory() { return 'unknown'; }
    getDisplayName() { return 'Weapon'; }
    getEditableAttributes() { return {}; }
    setEditableAttributes(attrs) { Object.assign(this, attrs); }

    // Rendered relative to the player while held; overridden in subclasses or Section 6.
    drawOnPlayer(player) {
        const { dx, dy } = this._getAimDirection(player);
        const ts = player.tileSize;
        const hw = player.width / 2;
        const hh = player.height / 2;
        const x = Math.round(player.x + hw + dx * (hw + ts / 2) - ts / 2);
        const y = Math.round(player.y + hh + dy * (hh + ts / 2) - ts / 2);
        const facingLeft = player.facingDirection === AnimationHelper.facingDirections.left;
        const mirror = dx < 0 || (dx === 0 && facingLeft);
        this.checkFrameAndDraw((canvasXSpritePos) => {
            if (mirror) {
                Display.drawImageFlippedX(
                    player.spriteCanvas,
                    canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                    x, y, ts, ts, Math.atan2(dy, -dx)
                );
            } else {
                Display.drawImageWithRotation(
                    player.spriteCanvas,
                    canvasXSpritePos, this.canvasYSpritePos, ts, ts,
                    x, y, ts, ts, Math.atan2(dy, dx)
                );
            }
        });
    }

    // Returns a unit direction vector based on player facing + controller + directionAmount.
    _getAimDirection(player) {
        let facingRight = player.facingDirection === AnimationHelper.facingDirections.right;
        // While wall sliding the player faces the wall, so aim the gun the other way.
        if (player.wallJumpSlide) facingRight = !facingRight;
        const dirs = this.directionAmount || 2;
        const up = Controller.up && !Controller.down;
        const down = Controller.down && !Controller.up;

        if (dirs === 8) {
            const noH = !Controller.left && !Controller.right;
            if (up && noH) return { dx: 0, dy: -1 };
            if (down && noH) return { dx: 0, dy: 1 };
            // While wall sliding the controller points into the wall, so aim away from it.
            const hDir = player.wallJumpSlide
                ? (facingRight ? 1 : -1)
                : (Controller.right ? 1 : Controller.left ? -1 : (facingRight ? 1 : -1));
            const dy = up ? -1 : down ? 1 : 0;
            return { dx: hDir, dy };
        }

        if (dirs >= 4) {
            if (up) return { dx: 0, dy: -1 };
            if (down) return { dx: 0, dy: 1 };
        }
        return { dx: facingRight ? 1 : -1, dy: 0 };
    }

    tick(player) {}
    attack(player) {}
    drawBehindPlayer(player) {}
}
