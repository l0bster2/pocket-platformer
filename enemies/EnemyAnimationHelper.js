/**
 * Handles animation updates for enemies
 */
class EnemyAnimationHelper {
    /**
     * Update animation based on enemy state
     * @param {Enemy} enemy - The enemy to update animation for
     * @param {CanvasRenderingContext2D} spriteCanvas - The canvas with sprites
     */
    static updateAnimation(enemy, spriteCanvas) {
        // Select sprite based on state
        if (!enemy.isActive) {
            // Inactive or stunned enemies always show their idle pose.
            enemy.currentSpriteIndex = this.findSpriteIndexByName(enemy, 'idle');
        } else if (enemy.jumping || (enemy.falling && enemy.yspeed > 0)) {
            enemy.currentSpriteIndex = this.findSpriteIndexByName(enemy, 'jump');
        } else if (enemy.walking) {
            enemy.currentSpriteIndex = this.findSpriteIndexByName(enemy, 'walk');
        } else {
            enemy.currentSpriteIndex = this.findSpriteIndexByName(enemy, 'idle');
        }

        // Update facing direction based on horizontal movement (keep last direction when idle)
        if (enemy.xspeed > 0) {
            enemy.facingDirection = AnimationHelper.facingDirections.right;
        } else if (enemy.xspeed < 0) {
            enemy.facingDirection = AnimationHelper.facingDirections.left;
        }

        // Get animation length for current sprite (update dynamically in case it changes)
        const currentSprite = enemy.spriteObject[enemy.currentSpriteIndex];
        const animationLength = currentSprite && currentSprite.animation ? currentSprite.animation.length : 1;
        enemy.animationLengths[enemy.currentSpriteIndex] = animationLength;

        // Update frame duration (can be tweaked per sprite type)
        const frameDuration = AnimationHelper.defaultFrameDuration;

        // Increment animation index
        enemy.currentAnimationIndex++;
        if (enemy.currentAnimationIndex >= frameDuration * animationLength || Game.playMode === Game.BUILD_MODE) {
            enemy.currentAnimationIndex = 0;
        }

        // Calculate which animation frame to display
        const animationFrameIndex = Math.floor(enemy.currentAnimationIndex / frameDuration) || 0;

        // Render the animation frame
        this.renderAnimationFrame(enemy, spriteCanvas, animationFrameIndex, animationLength);
    }

    /**
     * Render the current animation frame
     * @private
     */
    static renderAnimationFrame(enemy, spriteCanvas, frameIndex, animationLength) {
        const currentSprite = enemy.spriteObject[enemy.currentSpriteIndex];
        if (!currentSprite) {
            return;
        }

        /*
            The sprite canvas holds two sets of frames per animation:
            the first set faces left, the second set faces right.
            When facing right, offset into the second (mirrored) set.
        */
        const directionOffset = enemy.facingDirection === AnimationHelper.facingDirections.right
            ? animationLength
            : 0;

        const canvasXSpritePos = (frameIndex + directionOffset) * enemy.tileSize;
        const canvasYSpritePos = currentSprite.canvasYPos;
        
        Display.drawImage(spriteCanvas, canvasXSpritePos, canvasYSpritePos,
            enemy.tileSize, enemy.tileSize, enemy.x, enemy.y, enemy.tileSize, enemy.tileSize);
    }

    /**
     * Find sprite index by descriptive name
     * @private
     */
    static findSpriteIndexByName(enemy, searchTerm) {
        return enemy.spriteObject.findIndex(sprite => 
            sprite.descriptiveName && sprite.descriptiveName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    /**
     * Initialize animation lengths from spriteObject array
     * @static
     */
    static initializeAnimationLengths(enemy) {
        const lengths = {};
        enemy.spriteObject.forEach((sprite, index) => {
            if (sprite.animation && sprite.animation.length > 0) {
                lengths[index] = sprite.animation.length;
            }
        });
        return lengths;
    }
}
