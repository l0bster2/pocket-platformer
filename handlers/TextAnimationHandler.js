class TextAnimationHandler {
    static staticConstructor() {
        this.animations = {
            wavy: this.animateWavy,
            bounce: this.animateBounce,
            typewriter: this.animateTypewriter
        };
    }

    static drawAnimatedText(type, ctx, text, x, y, frameIdx, opts) {
        const anim = this.animations[type];
        const duration = opts.duration ?? 40;
        const localFrame = frameIdx % duration;
        anim(ctx, text, x, y, localFrame, opts);
    }

    static animateWavy(ctx, text, x, y, frameIdx, opts) {
        ctx.font = `${opts.size}px ${WorldDataHandler.selectedFont}`;
        const duration = opts.duration || 40;
        const lines = text.split("\n");
        const amplitude = opts.size * opts.amplitude;
        const waveSpeed = (2 * Math.PI) / duration;
        const waveLength = opts.size * 2.5;

        lines.forEach((line, lineIdx) => {
            const chars = line.split("");
            const baseY = y + lineIdx * opts.lineHeight;

            const widths = chars.map(ch => ctx.measureText(ch).width);
            const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;

            const spacing = avgWidth * 0.1;
            const totalWidth = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);

            let charX = x - totalWidth / 2;

            for (let i = 0; i < chars.length; i++) {
                const char = chars[i];
                const charWidth = widths[i];

                const phase = (i / chars.length) * 2 * Math.PI;
                const yOffset = Math.sin(frameIdx * waveSpeed + phase) * amplitude;

                Display.drawStyledChar(ctx, char, charX, baseY + yOffset, opts);

                charX += charWidth + spacing;
            }
        });
    }

    static animateBounce(ctx, text, x, y, frameIdx, opts) {
        ctx.font = `${opts.size}px ${WorldDataHandler.selectedFont}`;
        const duration = opts.duration || 40;
        const lines = text.split("\n");

        const t = (frameIdx % duration) / duration;
        const bounce = Math.abs(Math.sin(t * Math.PI * 2)); // 0→1→0

        lines.forEach((line, lineIdx) => {
            const chars = line.split("");
            const baseY = y + lineIdx * opts.lineHeight;

            const widths = chars.map(ch => ctx.measureText(ch).width);
            const spacing = (widths.reduce((a, b) => a + b, 0) / widths.length) * 0.1;

            const totalWidth = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
            let charX = x - totalWidth / 2;

            for (let i = 0; i < chars.length; i++) {
                const char = chars[i];
                const scale = 1 + bounce * 0.2; // 20% stretch

                Display.ctx.save();
                Display.ctx.translate(charX + widths[i] / 2, baseY);
                Display.ctx.scale(1, scale);   // vertical squash/stretch
                Display.drawStyledChar(ctx, char, 0, 0, opts);
                Display.ctx.restore();

                charX += widths[i] + spacing;
            }
        });
    }

    static animateTypewriter(ctx, text, x, y, frameIdx, opts) {
        ctx.font = `${opts.size}px ${WorldDataHandler.selectedFont}`;

        const duration = opts.duration || 40;
        const stagger = opts.stagger || 1;        // delay between characters
        const startAngle = opts.startAngle || Math.PI / 2; // 90° flat
        const fade = opts.fade ?? true;

        const lines = text.split("\n");

        lines.forEach((line, lineIdx) => {
            const chars = line.split("");
            const baseY = y + lineIdx * opts.lineHeight;

            const widths = chars.map(ch => ctx.measureText(ch).width);
            const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;

            const spacing = avgWidth * 0.1;
            const totalWidth = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);

            let charX = x - totalWidth / 2;

            for (let i = 0; i < chars.length; i++) {
                const char = chars[i];
                const charWidth = widths[i];

                // Timeline
                const t = Math.min(1, Math.max(0, (frameIdx - i * stagger) / duration));

                // 3D rotation angle (EASED)
                const angle = startAngle * (1 - t); // rotates from angle → 0

                const perspective = Math.cos(angle);          // flattening effect
                const scaleY = perspective;                   // vertical squish
                const scaleX = 1 + (1 - perspective) * 0.3;   // perspective widen

                const alpha = fade ? t : 1;

                ctx.save();

                ctx.translate(charX + charWidth / 2, baseY);
                ctx.scale(scaleX, scaleY);
                ctx.globalAlpha = alpha;

                Display.drawStyledChar(ctx, char, -charWidth / 2, 0, opts);

                ctx.restore();

                charX += charWidth + spacing;
            }
        });
    }
}