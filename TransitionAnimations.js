class TransitionAnimations {

    static staticConstructor() {
        const vp = Camera.viewport;
        const w = vp.width;
        const h = vp.height;

        const parcelAmount = 15;
        const tile = h / parcelAmount;
        const cols = Math.ceil(w / tile);
        const rows = parcelAmount;
        const totalTiles = cols * rows;

        const arr = [];
        const rng = MathHelpers.mulberry32(Date.now() & 0xffffffff);
        for (let i = 0; i < totalTiles; i++) arr.push(i);
        MathHelpers.shuffleArray(arr, rng);

        this.tileOrder = arr;
        this.cols = cols;
        this.rows = rows;
        this.tile = tile;
        this.totalTiles = totalTiles;
    }

    static animateFadeCircle(currenFrame, totalFrames) {
        const biggestRadius = Camera.viewport.width;
        const radiusStep = biggestRadius / totalFrames;
        const radius = radiusStep * currenFrame;
        Display.ctx.fillStyle = `rgb(0,0,0)`;
        Display.ctx.beginPath();
        Display.ctx.rect(Camera.viewport.left, Camera.viewport.top, Camera.viewport.width, Camera.viewport.height);
        Display.ctx.arc(player.x + tileMapHandler.halfTileSize, player.y + tileMapHandler.halfTileSize,
            radius, 0, 2 * Math.PI, true);
        Display.ctx.fill();
        Display.ctx.closePath();
    }

    static animateFadeWholeScreen(currentFrame, totalFrames) {
        const percent = currentFrame / totalFrames;
        Display.drawRectangleWithAlpha(Camera.viewport.left,
            Camera.viewport.top,
            Camera.viewport.width,
            Camera.viewport.height, "000000", Display.ctx, percent);
    }

    static animateFade(currentFrame, totalFrames) {
        const percent = currentFrame / totalFrames * 100;
        const parcelAmount = 10;
        const parcelHeight = Display.canvasHeight / parcelAmount;
        const widthParcelAmount = Math.ceil(Display.canvasWidth / parcelHeight);

        for (var i = 0; i <= widthParcelAmount; i++) {
            for (var j = 0; j <= parcelAmount; j++) {
                const relativeWidth = parcelHeight / 100 * percent + 1;
                Display.drawRectangle(i * parcelHeight + ((parcelHeight - relativeWidth) / 2) + Camera.viewport.left,
                    j * parcelHeight + ((parcelHeight - relativeWidth) / 2) + Camera.viewport.top,
                    relativeWidth,
                    relativeWidth);
            }
        }
    }

    static drawDiamondExplosion(frameIndex, totalFrames) {
        const vp = Camera.viewport;
        const w = vp.width;
        const h = vp.height;
        const camX = vp.left;
        const camY = vp.top;

        const parcelAmount = 10;
        const tile = h / parcelAmount;
        const cols = Math.ceil(w / tile);
        const rows = parcelAmount;

        const ctx = Display.ctx;
        ctx.fillStyle = "rgb(0,0,0)";

        // camera-centered coordinates for distance calculations
        const centerX = w / 2;
        const centerY = h / 2;

        // precompute min/max distance
        let minDistance = Infinity;
        let maxDistance = -Infinity;
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const cx = c * tile + tile / 2;
                const cy = r * tile + tile / 2;
                const dist = Math.hypot(cx - centerX, cy - centerY);
                if (dist < minDistance) minDistance = dist;
                if (dist > maxDistance) maxDistance = dist;
            }
        }

        const overlapFactor = 0.5;

        // draw tiles
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const cx = c * tile + tile / 2;
                const cy = r * tile + tile / 2;

                const distance = Math.hypot(cx - centerX, cy - centerY);
                let phase = (distance - minDistance) / (maxDistance - minDistance);

                const start = totalFrames * phase * overlapFactor;
                const end = start + totalFrames * overlapFactor;
                let progress = (frameIndex - start) / (end - start);
                if (progress < 0) continue;
                if (progress > 1) progress = 1;

                ctx.fillStyle = "rgb(0,0,0)";

                // draw relative to camera
                const drawX = c * tile + camX + tile / 2;
                const drawY = r * tile + camY + tile / 2;

                if (progress < 0.5) {
                    const t = progress / 0.5;
                    const half = (tile / 2) * t;

                    ctx.beginPath();
                    ctx.moveTo(drawX, drawY - half);
                    ctx.lineTo(drawX + half, drawY);
                    ctx.lineTo(drawX, drawY + half);
                    ctx.lineTo(drawX - half, drawY);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    const t = (progress - 0.5) / 0.5;
                    const angle = Math.PI / 4 + (Math.PI / 4) * t;
                    const scale = 1 + 0.6 * t;
                    const size = tile * scale;

                    ctx.save();
                    ctx.translate(drawX, drawY);
                    ctx.rotate(angle);
                    ctx.fillRect(-size / 2, -size / 2, size, size);
                    ctx.restore();
                }
            }
        }
    }


    static drawCollide(frameIndex, totalFrames) {
        const vp = Camera.viewport;
        const w = vp.width;
        const h = vp.height;
        const x = vp.left;
        const y = vp.top;

        let progress = frameIndex / totalFrames;
        const totalWidth = w;
        const currentWidth = totalWidth * progress;

        const box1 = { x: x + totalWidth - currentWidth, y, width: currentWidth, height: h };
        const box2 = { x, y, width: currentWidth, height: h };

        Display.ctx.fillStyle = "rgb(0,0,0)";
        Display.ctx.fillRect(box1.x, box1.y, box1.width, box1.height);
        Display.ctx.fillRect(box2.x, box2.y, box2.width, box2.height);
    }

    static drawRadialWipe(frameIndex, totalFrames) {
        const vp = Camera.viewport;
        const w = vp.width;
        const h = vp.height;
        const centerX = vp.left + w / 2;
        const centerY = vp.top + h / 2;

        const numLines = 4;

        const t = frameIndex / totalFrames;
        const easedProgress = 0.5 - 0.5 * Math.cos(t * Math.PI);

        const totalSweep = 2 * Math.PI;
        const anglePerLine = totalSweep / numLines;
        const radius = Math.max(w, h);

        Display.ctx.save();
        Display.ctx.translate(centerX, centerY);

        for (let i = 0; i < numLines; i++) {
            const baseAngle = i * anglePerLine;
            const sweep = anglePerLine * easedProgress;

            const startAngle = baseAngle - Math.PI / 2;
            const endAngle = startAngle + sweep;

            Display.ctx.beginPath();
            Display.ctx.moveTo(0, 0);
            Display.ctx.arc(0, 0, radius, startAngle, endAngle, false);
            Display.ctx.closePath();
            Display.ctx.fillStyle = "rgb(0,0,0)";
            Display.ctx.fill();
        }

        Display.ctx.restore();
    }

    static drawDissolve(frameIndex, totalFrames) {
        const vp = Camera.viewport;
        const camX = vp.left;
        const camY = vp.top;
        const w = vp.width;
        const h = vp.height;

        const parcelAmount = 15; // number of rows
        const tile = h / parcelAmount; // tile size dynamically based on camera height
        const cols = Math.ceil(w / tile);
        const totalTiles = cols * parcelAmount;

        const order = this.tileOrder;
        const tilesToShow = Math.floor((frameIndex / totalFrames) * totalTiles);

        const ctx = Display.ctx;
        ctx.fillStyle = "rgb(0,0,0)";

        for (let i = 0; i < tilesToShow; i++) {
            const tileIndex = order[i];
            const col = tileIndex % cols;
            const row = Math.floor(tileIndex / cols);

            const x = col * tile + camX;
            const y = row * tile + camY;

            ctx.fillRect(x, y, tile + 1, tile + 1); // +1 avoids seams
        }
    }
}