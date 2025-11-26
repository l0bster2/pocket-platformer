class TextAnimationHandler {
    static staticConstructor() {
        this.animations = {
            wavy: this.animateWavy,
        };
    }

    static drawAnimatedText(type, ctx, text, x, y, frameIdx, opts) {
        const anim = this.animations[type];
        const duration = opts.duration || 40;
        const localFrame = frameIdx % duration;
        anim(ctx, text, x, y, localFrame, opts);
    }

    static animateWavy(ctx, text, x, y, frameIdx, opts) {
        ctx.font = `${opts.size}px ${WorldDataHandler.selectedFont}`;
        const duration = opts.duration;
        const lines = text.split("\n");
        const amplitude = opts.size * 0.35;
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
}