class Npc extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.upReleased = true;
        this.key = this.makeid(5);
        this.arrowUpFrameIndex = 0;
        this.upButtonReleased = false;
    }

    collisionEvent() {
        player.collidingWithNpcId = this.key;

        this.arrowUpFrameIndex++;
        const frameModulo = this.arrowUpFrameIndex % 60;
        if (frameModulo < 30) {
            DialogueHandler.showDialogueUpArrow(this.x, this.y - this.tileSize);
        }
        if (!Controller.jump) {
            this.upButtonReleased = true;
        }
        else {
            if (this.upButtonReleased && !DialogueHandler.active) {
                const parsedDialogue = [];
                this.dialogue.forEach(singleDialogue => {
                    const singleDialogueObject = DialogueHandler.createDialogObject(singleDialogue);
                    if (singleDialogueObject.textLength > 0) {
                        parsedDialogue.push(singleDialogueObject);
                    }
                });
                if (parsedDialogue.length > 0) {
                    DialogueHandler.dialogue = parsedDialogue;
                    DialogueHandler.active = true;
                    DialogueHandler.calculateDialogueWindowPosition();
                    SoundHandler.dialogueSound.stopAndPlay();
                    player.fixedSpeed = false;
                    player.xspeed = 0;
                    player.yspeed = 0;
                }
            }
            this.upButtonReleased = false;
        }
    }

    draw(spriteCanvas) {
        if (player.collidingWithNpcId === this.key && !Collision.objectsColliding(player, this)) {
            player.collidingWithNpcId = null;
            this.arrowUpFrameIndex = 0;
            this.upButtonReleased = false;
        }
        super.draw(spriteCanvas);
    }
}