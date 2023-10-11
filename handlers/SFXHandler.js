class SFXHandler {

    static staticConstructor(tileSize, spriteCanvas) {
        this.tileSize = tileSize;
        this.spriteCanvas = spriteCanvas;
        this.sfxAnimations = [];
        this.backgroundSFX = [];
    }

    static updateSfxAnimations(type = "sfxAnimations") {
        for (var i = this[type].length - 1; i >= 0; i--) {
            this[type][i].draw(this.spriteCanvas);
            if (this[type][i].ended) { 
                this[type].splice(i, 1);
            }
        }
    }

    static resetSfx() {
        this.sfxAnimations = [];
        this.backgroundSFX = [];
    }

    static createSFX(x, y, sfxIndex, direction, xspeed = 0, yspeed = 0, reduceAlpha = false, animationLength = 8, growByTimes = 0, type = "sfxAnimations") {
        const sfxAnimation = new SFX(x, y, this.tileSize, sfxIndex, direction, xspeed, yspeed, reduceAlpha, animationLength, growByTimes);
        this[type].push(sfxAnimation);
    }
  }