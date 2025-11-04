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

    static animateFadeCircle(currenFrame, totalFrames, viewport, ctx, preview) {
        const biggestRadius = viewport.width;
        const radiusStep = biggestRadius / totalFrames;

        const radius = biggestRadius - radiusStep * currenFrame;
        let xAnchor = player.x + tileMapHandler.halfTileSize;
        let yAnchor = player.y + tileMapHandler.halfTileSize;

        if (preview) {
            xAnchor = viewport.width / 2;
            yAnchor = viewport.height / 2;
        }

        ctx.fillStyle = "rgb(0,0,0)";
        ctx.beginPath();
        ctx.rect(viewport.left, viewport.top, viewport.width, viewport.height);
        ctx.arc(
            xAnchor,
            yAnchor,
            radius,
            0,
            2 * Math.PI,
            true
        );
        ctx.fill();
        ctx.closePath();
    }

    static animateFadeWholeScreen(currentFrame, totalFrames, viewport, ctx) {
        const percent = currentFrame / totalFrames;
        Display.drawRectangleWithAlpha(viewport.left,
            viewport.top,
            viewport.width,
            viewport.height, "000000", ctx, percent);
    }

    static animateFade(currentFrame, totalFrames, viewport, ctx, preview) {
        const percent = currentFrame / totalFrames * 100;
        let parcelAmount = 10;
        let parcelHeight = Display.canvasHeight / parcelAmount;
        let widthParcelAmount = Math.ceil(Display.canvasWidth / parcelHeight);

        if (preview) {
            parcelAmount = 5;
            parcelHeight = viewport.height / parcelAmount;
            widthParcelAmount = Math.ceil(viewport.width / parcelHeight);
        }

        for (var i = 0; i <= widthParcelAmount; i++) {
            for (var j = 0; j <= parcelAmount; j++) {
                const relativeWidth = parcelHeight / 100 * percent + 1;
                Display.drawRectangle(i * parcelHeight + ((parcelHeight - relativeWidth) / 2) + viewport.left,
                    j * parcelHeight + ((parcelHeight - relativeWidth) / 2) + viewport.top,
                    relativeWidth,
                    relativeWidth, '000000', ctx);
            }
        }
    }

    static drawDiamondExplosion(frameIndex, totalFrames, viewport, ctx) {
        const vp = viewport;
        const w = vp.width;
        const h = vp.height;
        const camX = vp.left;
        const camY = vp.top;

        const parcelAmount = 10;
        const tile = h / parcelAmount;
        const cols = Math.ceil(w / tile);
        const rows = parcelAmount;

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

    static drawCollide(frameIndex, totalFrames, viewport, ctx) {
        const vp = viewport;
        const w = vp.width;
        const h = vp.height;
        const x = vp.left;
        const y = vp.top;

        let progress = frameIndex / totalFrames;
        const totalWidth = w;
        const currentWidth = totalWidth * progress;

        const box1 = { x: x + totalWidth - currentWidth, y, width: currentWidth, height: h };
        const box2 = { x, y, width: currentWidth, height: h };

        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(box1.x, box1.y, box1.width, box1.height);
        ctx.fillRect(box2.x, box2.y, box2.width, box2.height);
    }

    static drawRadialWipe(frameIndex, totalFrames, viewport, ctx) {
        const vp = viewport;
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

        ctx.save();
        ctx.translate(centerX, centerY);

        for (let i = 0; i < numLines; i++) {
            const baseAngle = i * anglePerLine;
            const sweep = anglePerLine * easedProgress;

            const startAngle = baseAngle - Math.PI / 2;
            const endAngle = startAngle + sweep;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle, false);
            ctx.closePath();
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fill();
        }

        ctx.restore();
    }

    static drawDissolve(frameIndex, totalFrames, viewport, ctx) {
        const vp = viewport;
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

    static drawRotatingHole(frameIndex, totalFrames, viewport, ctx) {
        const vp = viewport;
        const w = vp.width;
        const h = vp.height;
        const left = vp.left;
        const top = vp.top;

        // --- Normalized + eased progress ---
        const t = Math.max(0, Math.min(frameIndex / totalFrames, 1));
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

        // --- Oversize factor to avoid gaps when rotating ---
        const extra = Math.hypot(w, h) * 0.5;
        const safeW = w + extra * 2;
        const safeH = h + extra * 2;

        // --- Hole size ---
        const maxHoleSize = Math.max(w, h) * 1.5;
        const holeSize = maxHoleSize * (1 - ease); // expanding hole
        const holeX = (safeW - holeSize) / 2;
        const holeY = (safeH - holeSize) / 2;

        // --- Rotation setup ---
        const rotations = 0.5;
        const wiggleAmplitude = 0.12;
        const wiggleFrequency = 4;
        const angle =
            ease * Math.PI * 2 * rotations +
            Math.sin(ease * Math.PI * wiggleFrequency) * wiggleAmplitude;

        // --- Draw ---
        ctx.save();
        ctx.translate(left + w / 2, top + h / 2);
        ctx.rotate(angle);
        ctx.translate(-safeW / 2, -safeH / 2);

        ctx.fillStyle = "black";

        // small overlap value to avoid seams
        const o = 1; // overlap pixels

        // top
        ctx.fillRect(0, 0, safeW, holeY + o);
        // bottom
        ctx.fillRect(0, holeY + holeSize - o, safeW, safeH - (holeY + holeSize) + o);
        // left
        ctx.fillRect(0, holeY - o, holeX + o, holeSize + 2 * o);
        // right
        ctx.fillRect(holeX + holeSize - o, holeY - o, safeW - (holeX + holeSize) + o, holeSize + 2 * o);

        ctx.restore();
    }

    static drawDiamondSwipe(frameIndex, totalFrames, viewport, ctx) {
        const vp = viewport;
        const w = vp.width;
        const h = vp.height;
        const camX = vp.left;
        const camY = vp.top;

        const parcelAmount = 10;
        const tile = h / parcelAmount;
        const cols = Math.ceil(w / tile);
        const rows = parcelAmount;

        ctx.fillStyle = "rgb(0,0,0)";

        // Direction fixed to SE (1, 1)
        const dx = 1, dy = 1;

        // Precompute min/max distances for SE diagonal motion
        let minDistance = Infinity;
        let maxDistance = -Infinity;
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const dist = c * dx + r * dy;
                if (dist < minDistance) minDistance = dist;
                if (dist > maxDistance) maxDistance = dist;
            }
        }

        const overlapFactor = 0.5;

        // Draw tiles
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const distance = c * dx + r * dy;
                let phase = (distance - minDistance) / (maxDistance - minDistance);

                const start = totalFrames * phase * overlapFactor;
                const end = start + totalFrames * overlapFactor;
                let progress = (frameIndex - start) / (end - start);
                if (progress < 0) continue;
                if (progress > 1) progress = 1;

                const drawX = c * tile + camX + tile / 2;
                const drawY = r * tile + camY + tile / 2;

                ctx.fillStyle = "rgb(0,0,0)";

                if (progress < 0.5) {
                    // diamond growing in
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
                    // rotate and expand to full tile
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
}