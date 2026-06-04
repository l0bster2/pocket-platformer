/**
 * Manages interaction between moving platforms and any living object (player or enemies)
 * Handles collision detection, movement updates, and object tracking
 */
class MovingPlatformHandler {

    /**
     * Update all objects currently on this moving platform
     * @param {DefaultMovingPlatform} movingPlatform - The platform to update
     * @param {Array} objectsOnPlatform - Array of objects currently on the platform
     */
    static updateObjectsOnPlatform(movingPlatform, objectsOnPlatform) {
        objectsOnPlatform.forEach(obj => {
            this.updateSingleObjectOnPlatform(movingPlatform, obj);
        });
    }

    /**
     * Update a single object on the moving platform
     * @param {DefaultMovingPlatform} movingPlatform - The platform
     * @param {Object} obj - The object (player or enemy) on the platform
     */
    static updateSingleObjectOnPlatform(movingPlatform, obj) {
        if (obj.movingPlatformKey !== movingPlatform.key) {
            return;
        }

        const platformMovingUp = movingPlatform.yspeed <= 0;
        const objectMovingUp = obj.yspeed < 0;
        const objectJumpingSlowerThanPlatform = platformMovingUp && objectMovingUp && obj.yspeed > movingPlatform.yspeed;

        // Apply platform movement to object
        obj.bonusSpeedX = movingPlatform.xspeed;
        obj.bonusSpeedY = movingPlatform.yspeed;

        // If object jumping slower than platform moving up, push it down
        if (objectJumpingSlowerThanPlatform) {
            obj.hitWall(AnimationHelper.facingDirections.bottom);
            obj.jumping = false;
            obj.y = movingPlatform.y - obj.height;
            obj.movingPlatformKey = movingPlatform.key;
            obj.onMovingPlatform = true;
        }

        // Check if object is still on platform
        if (!Collision.objectsColliding(obj, movingPlatform.fakeHitBox)) {
            obj.bonusSpeedX = 0;
            obj.bonusSpeedY = 0;
            obj.movingPlatformKey = null;
            obj.onMovingPlatform = false;
        }
    }

    /**
     * Set momentum coyote frames for an object on a moving platform
     * @param {DefaultMovingPlatform} movingPlatform - The platform
     * @param {Object} obj - The object (player or enemy)
     */
    static setObjectMomentumCoyoteFrames(movingPlatform, obj) {
        if (obj.movingPlatformKey === movingPlatform.key &&
            (movingPlatform.xspeed !== 0 || movingPlatform.yspeed < 0)) {
            obj.currentMomentumCoyoteFrame = 0;
            obj.momentumBonusSpeedX = movingPlatform.xspeed;
            obj.momentumBonusSpeedY = movingPlatform.yspeed;
        }
    }

    /**
     * Check if an object should land on the moving platform
     * Used for collision detection
     * @param {DefaultMovingPlatform} movingPlatform - The platform
     * @param {Object} obj - The object to check
     */
    static checkObjectOnPlatformCollision(movingPlatform, obj) {
        const extraY = movingPlatform.yspeed <= 0 ? Math.abs(movingPlatform.yspeed) : 0;
        const extraHeight = extraY + Math.abs(obj.yspeed) + obj.heightOffset;

        const hitBox = {
            ...movingPlatform.fakeHitBox,
            y: movingPlatform.fakeHitBox.y - extraY,
            height: movingPlatform.fakeHitBox.height + extraHeight,
        };

        if (obj.movingPlatformKey !== movingPlatform.key &&
            (Collision.pointAndObjectColliding(obj.bottom_right_pos, hitBox) ||
                Collision.pointAndObjectColliding(obj.bottom_left_pos, hitBox))
        ) {
            obj.hitBottom(true);
            obj.y = movingPlatform.y - obj.height;
            obj.movingPlatformKey = movingPlatform.key;
            obj.onMovingPlatform = true;
        }
    }
}
