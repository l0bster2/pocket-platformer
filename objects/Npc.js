class Npc extends InteractiveLevelObject {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        super(x, y, tileSize, type, 0, extraAttributes);
        this.key = this.makeid(5);
        this.playedOnce = false;
    }

    resetObject() {
        this.playedOnce = false;
    }

    collisionEvent() {
        if(this.playAutomatically) {
            if(!this.playedOnce) {
                this.playedOnce = true;
                this.startDialogue();
            }
        }
        else {
            PlayerInteractionHandler.registerInteractionTarget(this);
        }
    }

    startDialogue() {
        const parsedDialogue = [];
        this.dialogue.forEach(singleDialogue => {
            const singleDialogueObject = DialogueHandler.createDialogObject(singleDialogue);
            if (singleDialogueObject.textLength > 0) {
                parsedDialogue.push(singleDialogueObject);
            }
        });
        if (parsedDialogue.length > 0) {
            PlayerInteractionHandler.blockInteractionsFor("dialogue");
            DialogueHandler.dialogue = parsedDialogue;
            DialogueHandler.active = true;
            DialogueHandler.calculateDialogueWindowPosition();
            SoundHandler.dialogueSound.stopAndPlay();
            player.fixedSpeed = false;
            player.xspeed = 0;
            player.yspeed = 0;
        }
    }

    draw(spriteCanvas) {
        super.draw(spriteCanvas);
    }
}