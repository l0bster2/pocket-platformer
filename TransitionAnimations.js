class TransitionAnimations {

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
        const w = Display.canvasWidth;
        const h = Display.canvasHeight;
        const parcelAmount = 10;
        const tile = h / parcelAmount;

        const ctx = Display.ctx;
        ctx.fillStyle = "rgb(0,0,0)";

        const centerX = w / 2;
        const centerY = h / 2;

        // Compute distance range
        let minDistance = Infinity;
        let maxDistance = -Infinity;
        for (let c = 0; c < Math.ceil(w / tile); c++) {
            for (let r = 0; r < Math.ceil(h / tile); r++) {
                const cx = c * tile + tile / 2;
                const cy = r * tile + tile / 2;
                const dist = Math.hypot(cx - centerX, cy - centerY);
                if (dist < minDistance) minDistance = dist;
                if (dist > maxDistance) maxDistance = dist;
            }
        }

        const overlapFactor = 0.5;

        for (let col = 0; col < Math.ceil(w / tile); col++) {
            for (let row = 0; row < Math.ceil(h / tile); row++) {
                const x = col * tile;
                const y = row * tile;
                const cx = x + tile / 2;
                const cy = y + tile / 2;

                const distance = Math.hypot(cx - centerX, cy - centerY);
                let phase = (distance - minDistance) / (maxDistance - minDistance);

                const start = totalFrames * phase * overlapFactor;
                const end = start + totalFrames * overlapFactor;
                let progress = (frameIndex - start) / (end - start);
                if (progress < 0) continue;
                if (progress > 1) progress = 1;

                ctx.fillStyle = "rgb(0,0,0)";

                // --- expansion phase (diamond grows) ---
                if (progress < 0.5) {
                    const t = progress / 0.5;
                    const half = (tile / 2) * t;

                    ctx.beginPath();
                    ctx.moveTo(cx, cy - half);
                    ctx.lineTo(cx + half, cy);
                    ctx.lineTo(cx, cy + half);
                    ctx.lineTo(cx - half, cy);
                    ctx.closePath();
                    ctx.fill();

                    // --- contraction phase (diamond rotates to square) ---
                } else {
                    const t = (progress - 0.5) / 0.5;

                    // Start at 45°, end at 90° rotation
                    const angle = Math.PI / 4 + (Math.PI / 4) * t;

                    // constant size
                    const size = tile;

                    ctx.save();
                    ctx.translate(cx, cy);
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

        // normalized progress [0–1]
        let progress = frameIndex / totalFrames;

        // compute the growing box widths
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

    static drawClouds(frameIndex, totalFrames) {
        const vp = Camera.viewport;
        const w = vp.width;
        const h = vp.height;
        const left = vp.left;
        const top = vp.top;
        const scale = 3 / 100;

        const threshold = 0.05 + 0.95 * (frameIndex / totalFrames);
        const ctxData = Display.ctx.createImageData(w, h);
        const data = ctxData.data;

        const fg = [0, 0, 0];

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;

                const worldX = x + left;
                const worldY = y + top;

                let n = (noise.perlin2(worldX * scale, worldY * scale) + 1) / 2;

                if (n < threshold) {
                    data[i] = fg[0];
                    data[i + 1] = fg[1];
                    data[i + 2] = fg[2];
                    data[i + 3] = 255;
                } else {
                    data[i] = 0;
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                    data[i + 3] = 0;
                }
            }
        }

        Display.ctx.putImageData(ctxData, left, top);
    }
}