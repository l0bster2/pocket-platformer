class ProTipHandler {

    static staticConstructor() {
        this.proTipEl = document.getElementById("proTip");
        this.proTips = [
            "Delete elements from the game and draw screen with the right mouse.",
            "Use import/export as a save/load function, to continue working on your game later on.",
            "Some elements, like canons, have changeable attributes. Click on them in the game screen again to see the options.",
            "Player can be dragged around the game screen in build mode. You can also press 'p' to put the player at mouse position.",
            "On high levels, camera can be moved vertically with the mouse wheel.",
            "Cannonballs and rockets can trigger the red/blue switch.",
            "Stompers can collide with each other",
            "Press shift in build mode to rotate the currently selected object (if it's rotateable)",
            "Hold CTRL to draw bigger areas of objects on the screen. Hold CTRL + right mouse to delete bigger areas.",
            "Write 'wobbly:' before the game's name and see what happens.",
        ]
        this.proTipEl.innerHTML = this.proTips[0];
        this.resetTimer();
    }

    static resetTimer() {
        this.timer = setInterval(() => {
            this.setRandomProTip();
        }, 60000);
    }

    static nextTip() {
        const currentIndex = this.proTips.indexOf(this.proTipEl.innerHTML);
        const newIndex = currentIndex === this.proTips.length - 1 ? 0 : currentIndex + 1;
        this.proTipEl.innerHTML = this.proTips[newIndex];
        clearInterval(this.timer);
        this.resetTimer();
    }

    static setRandomProTip() {
        var randomProTip = this.proTips[Math.floor(Math.random() * this.proTips.length)];
        this.proTipEl.innerHTML = randomProTip;
    } 
}