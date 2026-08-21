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
        } else if (enemy.flying) {
            // Flying enemies never jump or fall, so they only have idle/moving poses.
            const moving = enemy.xspeed !== 0 || enemy.yspeed !== 0;
            enemy.currentSpriteIndex = this.findSpriteIndexByName(enemy, moving ? 'walk' : 'idle');
        } else if (enemy.jumping || (enemy.falling && enemy.yspeed > 0)) {
            enemy.currentSpriteIndex = this.findSpriteIndexByName(enemy, 'jump');
        } else if (enemy.walking) {
            enemy.currentSpriteIndex = this.findSpriteIndexByName(enemy, 'walk');
        } else {
            enemy.currentSpriteIndex = this.findSpriteIndexByName(enemy, 'idle');
        }

        // Update facing direction: follow movement, or face the player when standing still.
        if (enemy.xspeed > 0) {
            enemy.facingDirection = AnimationHelper.facingDirections.right;
        } else if (enemy.xspeed < 0) {
            enemy.facingDirection = AnimationHelper.facingDirections.left;
        } else if (PlayMode.player) {
            const enemyCenterX = enemy.x + (enemy.width || 0) / 2;
            const playerCenterX = PlayMode.player.x + (PlayMode.player.width || 0) / 2;
            enemy.facingDirection = playerCenterX >= enemyCenterX
                ? AnimationHelper.facingDirections.right
                : AnimationHelper.facingDirections.left;
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

        // use actual frame pixel dimensions as source so larger sprites aren't cropped+stretched
        const framePixelWidth = (currentSprite.animation[0]?.sprite[0]?.length ?? 8) * WorldDataHandler.pixelArrayUnitSize;
        const framePixelHeight = (currentSprite.animation[0]?.sprite?.length ?? 8) * WorldDataHandler.pixelArrayUnitSize;
        const canvasXSpritePos = (frameIndex + directionOffset) * framePixelWidth;
        const canvasYSpritePos = currentSprite.canvasYPos;

        // Teleport animation: invisible at scale 0; scaled + rotated while transitioning
        if (enemy.teleportScale === 0) return;

        if (enemy.teleportScale !== undefined && enemy.teleportScale !== 1) {
            const scaledSize = Math.round(enemy.drawWidth * enemy.teleportScale);
            const offset = Math.round((enemy.drawWidth - scaledSize) / 2);
            Display.drawImageWithRotation(spriteCanvas, canvasXSpritePos, canvasYSpritePos,
                framePixelWidth, framePixelHeight,
                Math.round(enemy.x) + offset, Math.round(enemy.y) + offset,
                scaledSize, scaledSize,
                enemy.teleportRotation);
        } else {
            Display.drawImage(spriteCanvas, canvasXSpritePos, canvasYSpritePos,
                framePixelWidth, framePixelHeight, Math.round(enemy.x), Math.round(enemy.y), enemy.drawWidth, enemy.drawHeight);
        }
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

    /**
     * Render the enemy's current sprite frame with an arbitrary rotation.
     * Used for death animations where normal game logic no longer applies.
     */
    static renderWithRotation(enemy, spriteCanvas, radians) {
        const currentSprite = enemy.spriteObject[enemy.currentSpriteIndex];
        if (!currentSprite) return;
        const animationLength = currentSprite.animation ? currentSprite.animation.length : 1;
        const directionOffset = enemy.facingDirection === AnimationHelper.facingDirections.right
            ? animationLength : 0;
        const framePixelWidth = (currentSprite.animation[0]?.sprite[0]?.length ?? 8) * WorldDataHandler.pixelArrayUnitSize;
        const framePixelHeight = (currentSprite.animation[0]?.sprite?.length ?? 8) * WorldDataHandler.pixelArrayUnitSize;
        const canvasXSpritePos = directionOffset * framePixelWidth; // always use frame 0
        const canvasYSpritePos = currentSprite.canvasYPos;
        Display.drawImageWithRotation(spriteCanvas, canvasXSpritePos, canvasYSpritePos,
            framePixelWidth, framePixelHeight, Math.round(enemy.x), Math.round(enemy.y),
            enemy.drawWidth, enemy.drawHeight, radians);
    }
}
