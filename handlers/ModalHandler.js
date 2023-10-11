

class ModalHandler {

    static showModal(id) {
        let el = document.getElementById(id);  
        if(Game.playMode === Game.PLAY_MODE){
            Game.changeGameMode();
            el.setAttribute('data-initial-game-mode', Game.PLAY_MODE);
        }
        else {
            el.setAttribute('data-initial-game-mode', Game.BUILD_MODE);
        }
        
        let body = document.querySelector("body");
        let bg = document.createElement("div");
        bg.className = "modal-js-overlay";
        el.classList.add('on');
        body.appendChild(bg);

        const closeButton = document.createElement("img");
        Helpers.addAttributesToHTMLElement(closeButton, { "src": "images/icons/close.svg", 
        "width": 16, "height": 16, "class": "tooltipClose", "id": "modalCloseButton" });
        closeButton.onclick = () => {
            let overlay = body.querySelector(".modal-js-overlay");
            let closeButton = document.getElementById("modalCloseButton");
            body.removeChild(overlay);
            el.classList.remove('on');
            el.removeChild(closeButton);
        };
        el.appendChild(closeButton);
    }

    static closeModal(id) {
        let body = document.querySelector("body");
        let el = document.getElementById(id);
        const initialGameMode = el.getAttribute('data-initial-game-mode');
        if(initialGameMode === Game.PLAY_MODE && Game.playMode === Game.BUILD_MODE) {
            Game.changeGameMode();
        }
        let overlay = body.querySelector(".modal-js-overlay");
        el.classList.remove('on');
        body.removeChild(overlay);
    }
}