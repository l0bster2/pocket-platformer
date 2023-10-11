class Camera {

    static staticConstructor(context, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        this.follow = { x: 0, y: 0 };
        this.context = context;
        this.viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: canvasWidth,
            halfWidth: canvasWidth / 2,
            height: canvasHeight,
            halfHeight: canvasHeight / 2,
            scale: [1.0, 1.0],
            worldWidth: worldWidth,
            worldHeight: worldHeight
        };

        this.moveTo(this.viewport.halfWidth, this.viewport.halfHeight);
        this.updateViewport();
    }

    static begin() {
        this.context.save();
        this.applyTranslation();
    }

    static end() {
        this.context.restore();
    }

    static applyTranslation() {
        //this.context.scale(2, 2)
        this.context.translate(-this.viewport.left, -this.viewport.top);
    }

    static updateViewport() {
        this.viewport.left = this.follow.x - this.viewport.halfWidth;
        this.viewport.top = this.follow.y - this.viewport.halfHeight;
    }

    static zoomTo(z) {
        this.canvasWidth = z;
        this.updateViewport();
    }

    static followObject(x, y) {
        let newFollowX;
        let newFollowY;
        let positionChanged = false;

        newFollowX = this.outOfBoundsXCorrection(x);
        newFollowY = this.outOfBoundsYCorrection(y);

        if(newFollowX && newFollowX !== this.follow.x){
            this.follow.x = newFollowX;
            positionChanged= true;
        }
        if(newFollowY && newFollowY !== this.follow.y){
            this.follow.y = newFollowY;
            positionChanged= true;
        }
        if(positionChanged) {
            this.updateViewport();
        }
    }

    static outOfBoundsXCorrection(x) {
        if (x <= this.viewport.halfWidth) {
            return Math.round(this.viewport.halfWidth);
        }
        else if(x >= this.viewport.worldWidth - this.viewport.halfWidth) {
            return Math.round(this.viewport.worldWidth - this.viewport.halfWidth);
        }
        else {
            return Math.round(x);
        }
    }

    static outOfBoundsYCorrection(y) {
        if(y <= this.viewport.halfHeight){
            return Math.round(this.viewport.halfHeight);
        }
        else if(y >= this.viewport.worldHeight - this.viewport.halfHeight) {
            return Math.round(this.viewport.worldHeight - this.viewport.halfHeight);
        }
        else {
            return Math.round(y);
        }
    }

    static moveTo(x, y) {
        this.follow.x = this.outOfBoundsXCorrection(x);
        this.follow.y = this.outOfBoundsYCorrection(y);
        this.updateViewport();
    }

    static screenToWorld(x, y) {
        return { x: x - this.viewport.left, y: y - this.viewport.top };
    }

    static worldToScreen(x, y) {
        return { x: x + this.viewport.left, y: y + this.viewport.top };
    }
}