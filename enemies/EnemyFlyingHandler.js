/**
 * Handles movement logic for flying enemies.
 *
 * Flying enemies ignore gravity and move freely in any direction. Their heading is stored as
 * an angle in degrees (0 = right, 90 = down, 180 = left, 270 = up) so that bouncing off a wall
 * simply reflects the angle. Player-tracking and pathfinding behaviours only recompute every
 * few frames to keep the per-frame cost low.
 */
class EnemyFlyingHandler {

    /**
     * Reset the runtime flying state and pick a sensible starting heading for the current
     * behaviour. Called on spawn and whenever the flying behaviour is (re)assigned.
     */
    static resetFlyingState(enemy) {
        enemy.flyTimer = 0;
        enemy.flyRecomputeTimer = 0;
        enemy.flyPath = null;
        enemy.flyPathIndex = 0;
        enemy.flyHasLineOfSight = false;

        const behaviours = enemy.flyingBehaviours;
        switch (enemy.flyingBehaviour) {
            case behaviours.moveVertically:
            case behaviours.verticalPatrol:
                enemy.flyAngle = 270; // start moving up
                break;
            case behaviours.diagonal:
                enemy.flyAngle = 135; // start moving bottom-left
                break;
            case behaviours.random:
                enemy.flyAngle = MathHelpers.getRandomNumberBetweenTwoNumbers(0, 360);
                break;
            default:
                enemy.flyAngle = 180; // start moving left
                break;
        }
    }

    /**
     * Full per-frame step for a flying enemy: update its velocity (when active) and then move
     * it, either with normal tile collision or, for ghost-type flyers, by phasing through walls
     * while staying inside the level bounds.
     */
    static stepFlying(enemy) {
        if (enemy.isActive) {
            this.updateFlying(enemy);
        } else {
            // Bleed off momentum smoothly (like releasing a key) instead of stopping dead.
            enemy.xspeed *= enemy.air_friction;
            enemy.yspeed *= enemy.air_friction;
            if (Math.abs(enemy.xspeed) < 0.5) enemy.xspeed = 0;
            if (Math.abs(enemy.yspeed) < 0.5) enemy.yspeed = 0;
        }
        if (enemy.collidesWithWalls) {
            CharacterCollision.checkFloorAndTileCollision(enemy, false);
        } else {
            this.moveWithoutWallCollision(enemy);
        }
    }

    /**
     * Main per-frame update: decide the enemy's velocity from its flying behaviour.
     */
    static updateFlying(enemy) {
        const behaviours = enemy.flyingBehaviours;
        const speed = enemy.currentMaxSpeed;

        switch (enemy.flyingBehaviour) {
            case behaviours.moveHorizontally:
            case behaviours.moveVertically:
            case behaviours.diagonal:
                // Pure heading-based movement; direction only changes when bouncing off walls.
                this.applyAngle(enemy, enemy.flyAngle, speed);
                break;

            case behaviours.horizontalPatrol:
                this.updateTimedReversal(enemy, enemy.flyingHorizontalDuration, true);
                this.applyAngle(enemy, enemy.flyAngle, speed);
                break;

            case behaviours.verticalPatrol:
                this.updateTimedReversal(enemy, enemy.flyingVerticalDuration, false);
                this.applyAngle(enemy, enemy.flyAngle, speed);
                break;

            case behaviours.random:
                this.updateRandomHeading(enemy, enemy.flyingRandomDuration);
                this.applyAngle(enemy, enemy.flyAngle, speed);
                break;

            case behaviours.followPlayer:
                this.followPlayer(enemy, speed, 10);
                break;

            case behaviours.followPlayerPathfinding:
                this.followPlayerWithPathfinding(enemy, speed, 24);
                break;

            case behaviours.alignPlayerHorizontally:
                this.alignWithPlayer(enemy, speed, true);
                break;

            case behaviours.alignPlayerVertically:
                this.alignWithPlayer(enemy, speed, false);
                break;

            case behaviours.standStill:
            default:
                enemy.xspeed = 0;
                enemy.yspeed = 0;
                break;
        }
    }

    /**
     * Convert a heading (degrees) into x/y velocity at the given speed.
     */
    static applyAngle(enemy, angle, speed) {
        const radians = MathHelpers.getRadians(angle);
        enemy.xspeed = Math.cos(radians) * speed;
        enemy.yspeed = Math.sin(radians) * speed;
    }

    /**
     * Flip the heading on a timer to bounce back and forth along one axis.
     * @param {boolean} horizontal - true flips left/right, false flips up/down.
     */
    static updateTimedReversal(enemy, durationSeconds, horizontal) {
        enemy.flyTimer++;
        if (enemy.flyTimer >= durationSeconds * 60) {
            enemy.flyTimer = 0;
            enemy.flyAngle = horizontal
                ? MathHelpers.normalizeAngle(180 - enemy.flyAngle)
                : MathHelpers.normalizeAngle(360 - enemy.flyAngle);
        }
    }

    /**
     * Pick a brand new random heading every `durationSeconds`.
     */
    static updateRandomHeading(enemy, durationSeconds) {
        enemy.flyTimer++;
        if (enemy.flyTimer >= durationSeconds * 60) {
            enemy.flyTimer = 0;
            enemy.flyAngle = MathHelpers.getRandomNumberBetweenTwoNumbers(0, 360);
        }
    }

    /**
     * Head straight for the player, recomputing the heading only every `recomputeEvery` frames.
     */
    static followPlayer(enemy, speed, recomputeEvery) {
        const player = PlayMode.player;
        if (!player) {
            enemy.xspeed = 0;
            enemy.yspeed = 0;
            return;
        }
        enemy.flyRecomputeTimer++;
        if (enemy.flyRecomputeTimer >= recomputeEvery) {
            enemy.flyRecomputeTimer = 0;
            enemy.flyAngle = MathHelpers.getAngle(
                this.centerX(enemy), this.centerY(enemy),
                this.centerX(player), this.centerY(player));
        }
        this.applyAngle(enemy, enemy.flyAngle, speed);
    }

    /**
     * Follow the player along a tile path, recomputing the path only every `recomputeEvery`
     * frames. On each recompute it first checks for a clear line of sight to the player: if the
     * player is directly visible (no blocks in between) it skips pathfinding and homes in
     * straight at the player. Falls back to direct homing when no path is found.
     */
    static followPlayerWithPathfinding(enemy, speed, recomputeEvery) {
        const player = PlayMode.player;
        if (!player) {
            enemy.xspeed = 0;
            enemy.yspeed = 0;
            return;
        }

        enemy.flyRecomputeTimer++;
        const needsRecompute = enemy.flyRecomputeTimer >= recomputeEvery
            || (!enemy.flyHasLineOfSight && !enemy.flyPath);
        if (needsRecompute) {
            enemy.flyRecomputeTimer = 0;
            // All 4 corners must have LOS so the enemy won't clip a corner tile while flying straight.
            enemy.flyHasLineOfSight = this.cornersHaveLineOfSight(enemy, player);
            enemy.flyPath = enemy.flyHasLineOfSight ? null : this.computePath(enemy, player);
            enemy.flyPathIndex = 0;
        }

        const ex = this.centerX(enemy);
        const ey = this.centerY(enemy);

        if (enemy.flyHasLineOfSight) {
            enemy.flyAngle = MathHelpers.getAngle(ex, ey, this.centerX(player), this.centerY(player));
        } else {
            const target = this.getCurrentWaypoint(enemy);
            if (target) {
                // Advance to the next waypoint once the current one is reached.
                const dx = target.x - ex;
                const dy = target.y - ey;
                if (Math.sqrt(dx * dx + dy * dy) <= speed) {
                    enemy.flyPathIndex++;
                }
                enemy.flyAngle = MathHelpers.getAngle(ex, ey, target.x, target.y);
            } else {
                // No path: home in directly.
                enemy.flyAngle = MathHelpers.getAngle(ex, ey, this.centerX(player), this.centerY(player));
            }
        }
        this.applyAngle(enemy, enemy.flyAngle, speed);
    }

    /**
     * Move along a single axis to line up with the player on that axis.
     * @param {boolean} horizontal - true aligns the X axis, false aligns the Y axis.
     */
    static alignWithPlayer(enemy, speed, horizontal) {
        const player = PlayMode.player;
        if (!player) {
            enemy.xspeed = 0;
            enemy.yspeed = 0;
            return;
        }
        const accel = enemy.air_acceleration;
        if (horizontal) {
            const dx = player.x - enemy.x;
            const target = Math.sign(dx) * Math.min(Math.abs(dx), speed);
            const diff = target - enemy.xspeed;
            enemy.xspeed += Math.abs(diff) <= accel ? diff : Math.sign(diff) * accel;
            enemy.yspeed = 0;
        } else {
            const dy = player.y - enemy.y;
            const target = Math.sign(dy) * Math.min(Math.abs(dy), speed);
            const diff = target - enemy.yspeed;
            enemy.yspeed += Math.abs(diff) <= accel ? diff : Math.sign(diff) * accel;
            enemy.xspeed = 0;
        }
    }

    /**
     * Reflect the heading off a wall (and zero the blocked velocity component). Called from
     * Enemy.hitWall while flying. Only reverses the heading when the enemy's wall behaviour is
     * "change direction"; otherwise it just stops against the wall ("continue flying").
     */
    static handleWallCollision(enemy, direction) {
        const reverse = enemy.wallBehaviour === enemy.wallBehaviours.changeDirection;
        switch (direction) {
            case AnimationHelper.facingDirections.left:
            case AnimationHelper.facingDirections.right:
                if (reverse) enemy.flyAngle = MathHelpers.normalizeAngle(180 - enemy.flyAngle);
                enemy.xspeed = 0;
                break;
            case AnimationHelper.facingDirections.top:
            case AnimationHelper.facingDirections.bottom:
                if (reverse) enemy.flyAngle = MathHelpers.normalizeAngle(360 - enemy.flyAngle);
                enemy.yspeed = 0;
                break;
        }
    }

    /**
     * Move a non-colliding ("ghost") flying enemy: it phases through walls but is still kept
     * inside the level bounds so it can't escape the play area and break the collision logic.
     * Hitting a bound is treated like hitting a wall (reverse direction / stop).
     */
    static moveWithoutWallCollision(enemy) {
        enemy.x += enemy.xspeed;
        enemy.y += enemy.yspeed;

        const maxX = tileMapHandler.levelWidth * tileMapHandler.tileSize - enemy.width;
        const maxY = tileMapHandler.levelHeight * tileMapHandler.tileSize - enemy.height;
        const directions = AnimationHelper.facingDirections;

        if (enemy.x < 0) {
            enemy.x = 0;
            this.handleWallCollision(enemy, directions.left);
        } else if (enemy.x > maxX) {
            enemy.x = maxX;
            this.handleWallCollision(enemy, directions.right);
        }
        if (enemy.y < 0) {
            enemy.y = 0;
            this.handleWallCollision(enemy, directions.top);
        } else if (enemy.y > maxY) {
            enemy.y = maxY;
            this.handleWallCollision(enemy, directions.bottom);
        }
    }

    /**
     * Current waypoint (pixel center) the enemy is steering towards, or null when the path
     * has been fully consumed.
     */
    static getCurrentWaypoint(enemy) {
        if (!enemy.flyPath || enemy.flyPathIndex >= enemy.flyPath.length) return null;
        return enemy.flyPath[enemy.flyPathIndex];
    }

    /**
     * Breadth-first search across passable tiles from the enemy to the player. Returns an array
     * of pixel-center waypoints (excluding the enemy's own tile), or null if unreachable.
     * Expansion is capped so the search stays cheap on large levels.
     */
    static computePath(enemy, player) {
        const tmh = tileMapHandler;
        const { tileSize, levelWidth, levelHeight, tileMap } = tmh;
        const passable = [0, 5];

        const startCol = tmh.getTileValueForPosition(this.centerX(enemy));
        const startRow = tmh.getTileValueForPosition(this.centerY(enemy));
        const goalCol = tmh.getTileValueForPosition(this.centerX(player));
        const goalRow = tmh.getTileValueForPosition(this.centerY(player));

        const inBounds = (col, row) => col >= 0 && col < levelWidth && row >= 0 && row < levelHeight;
        const isPassable = (col, row) => inBounds(col, row) && passable.includes(tileMap[row][col]);

        if (!isPassable(goalCol, goalRow)) return null;

        const key = (col, row) => row * levelWidth + col;
        const queue = [{ col: startCol, row: startRow }];
        const cameFrom = new Map();
        cameFrom.set(key(startCol, startRow), null);

        const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        const maxExpansions = 2000;
        let expansions = 0;
        let found = false;

        while (queue.length && expansions < maxExpansions) {
            const current = queue.shift();
            expansions++;
            if (current.col === goalCol && current.row === goalRow) {
                found = true;
                break;
            }
            for (const [dc, dr] of neighbours) {
                const nc = current.col + dc;
                const nr = current.row + dr;
                const nKey = key(nc, nr);
                if (!isPassable(nc, nr) || cameFrom.has(nKey)) continue;
                cameFrom.set(nKey, { col: current.col, row: current.row });
                queue.push({ col: nc, row: nr });
            }
        }

        if (!found) return null;

        // Reconstruct the path from goal back to start.
        const tiles = [];
        let step = { col: goalCol, row: goalRow };
        while (step) {
            tiles.push(step);
            step = cameFrom.get(key(step.col, step.row));
        }
        tiles.reverse();
        tiles.shift(); // drop the enemy's own starting tile

        return tiles.map(tile => ({
            x: tile.col * tileSize + tileSize / 2,
            y: tile.row * tileSize + tileSize / 2,
        }));
    }

    static centerX(obj) {
        return obj.x + obj.width / 2;
    }

    static centerY(obj) {
        return obj.y + obj.height / 2;
    }

    /**
     * Returns true only when all 4 corners of the enemy have an unobstructed tile-ray to the
     * player centre. Prevents the enemy from getting snagged on a corner tile while flying straight.
     */
    static cornersHaveLineOfSight(enemy, player) {
        const tmh = tileMapHandler;
        const px = this.centerX(player);
        const py = this.centerY(player);
        const halfTile = tmh.halfTileSize;
        const corners = [
            { x: enemy.x - 1,               y: enemy.y - 1 },
            { x: enemy.x + enemy.width + 1, y: enemy.y - 1 },
            { x: enemy.x - 1,               y: enemy.y + enemy.height + 1 },
            { x: enemy.x + enemy.width + 1, y: enemy.y + enemy.height + 1 },
        ];
        for (const corner of corners) {
            const dx = px - corner.x;
            const dy = py - corner.y;
            const steps = Math.max(Math.abs(Math.round(dx / halfTile)), Math.abs(Math.round(dy / halfTile)));
            if (steps === 0) continue;
            const ix = dx / steps;
            const iy = dy / steps;
            for (let s = 0; s < steps - 1; s++) {
                const tile = tmh.getTileLayerValueByIndex(
                    tmh.getTileValueForPosition(corner.y + iy * s),
                    tmh.getTileValueForPosition(corner.x + ix * s));
                if (tile !== 0 && tile !== 5) { return false; }
            }
        }
        return true;
    }
}
