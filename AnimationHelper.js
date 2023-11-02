class AnimationHelper {

    static staticConstructor() {
        this.walkingFrameDuration = 7;
        this.defaultFrameDuration = 20;
        this.facingDirections = {
            top: "top",
            right: "right",
            bottom: "bottom",
            left: "left",
        };
        this.switchableBlockColors = {
            red: "red",
            blue: "blue",
        }
        this.alignments = {
            vertical: "vertical",
            horizontal: "horizontal",
            corner: "corner"
        }
        this.pathVariants = {
            singlePoint: "singlePoint",
            line: "line",
            enclosed: "enclosed",
        }
        this.possibleDirections = {
            forwards: "forwards",
            backwards: "backwards"
        }
    }

    static lightenDarkenColor(col, amt) {
        var usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }

        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;

        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        var g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    }

    static hexToRGB(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec("#" + hex);
        return result = {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    }

    static setSquishValues(obj, squishWidth, squishHeight, squishFrames = 10, direction = this.facingDirections.bottom) {
        const squishAble = obj.type === "player" ? obj?.spriteObject?.squishAble
            : obj?.spriteObject?.[0]?.squishAble;
        if (squishAble) {
            let newSquishWidth = squishWidth;
            let newSquishHeight = squishHeight;
            if (direction === this.facingDirections.left ||
                direction === this.facingDirections.right) {
                newSquishWidth = squishHeight;
                newSquishHeight = squishWidth;
            }
            obj.squishWidth = newSquishWidth;
            obj.squishHeight = newSquishHeight;
            obj.squishWidthStep = (newSquishWidth - obj.drawWidth) / squishFrames;
            obj.squishHeightStep = (newSquishHeight - obj.drawHeight) / squishFrames;
        }
    }

    static checkSquishUpdate(obj) {
        if (obj.drawWidth !== obj.squishWidth) {
            obj.squishXOffset = (obj.drawWidth - obj.originalDrawWidth) / 2;
            obj.drawWidth += obj.squishWidthStep;
            if (obj.drawWidth >= obj.squishWidth && obj.squishWidthStep > 0 ||
                obj.drawWidth <= obj.squishWidth && obj.squishWidthStep < 0) {
                obj.drawWidth = obj.squishWidth;
                this.setSquishValues(obj, obj.originalDrawWidth, obj.originalDrawHeight);
            }
        }
        if (obj.drawHeight !== obj.squishHeight) {
            obj.drawHeight += obj.squishHeightStep;
            obj.squishYOffset = (obj.drawHeight - obj.originalDrawHeight);
            if (obj.drawHeight >= obj.squishHeight && obj.squishHeightStep > 0 ||
                obj.drawHeight <= obj.squishHeight && obj.squishHeightStep < 0) {
                obj.drawHeight = obj.squishHeight;
            }
        }
    }

    static setInitialSquishValues(obj) {
        obj.drawWidth = obj.tileSize;
        obj.drawHeight = obj.tileSize;
        obj.squishWidth = obj.tileSize;
        obj.squishHeight = obj.tileSize;
        obj.squishWidthStep = 0;
        obj.squishHeightStep = 0;
        obj.originalDrawWidth = obj.tileSize;
        obj.originalDrawHeight = obj.tileSize;
        obj.squishXOffset = 0;
        obj.squishYOffset = 0;
    }
}