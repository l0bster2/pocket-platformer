function navDropDownClick(event, id = "myDropdown") {
    event.stopPropagation();
    const collection = document.getElementsByClassName("dropdown-content");
    if(collection.length) {
        for (let element of collection) {
            if(element.id && element.id !== id) {
                closeSpecificDropdown(element.id);
            }
        }
    }
    document.getElementById(id).classList.toggle("show");
}

function changeView(value) {
    if(value === "sounds") {
        document.getElementById("gameView").style.display = "none";
        document.getElementById("imageView").style.display = "none";
        document.getElementById("soundView").style.display = "flex";
        document.getElementById("gameViewCheckmark").style.display = "none";
        document.getElementById("imageViewCheckmark").style.display = "none";
        document.getElementById("soundViewCheckmark").style.display = "block";
        SoundHandlerRenderer.createSoundOverview();
    }
    else if(value === "game"){
        document.getElementById("gameView").style.display = "block";
        document.getElementById("soundView").style.display = "none";
        document.getElementById("imageView").style.display = "none";
        document.getElementById("gameViewCheckmark").style.display = "block";
        document.getElementById("imageViewCheckmark").style.display = "none";
        document.getElementById("soundViewCheckmark").style.display = "none";
        SoundHandler.checkSongOnLevelReset(tileMapHandler.currentLevel);
        ImageHandler.setBackgroundImage();
    }
    else {
        document.getElementById("gameView").style.display = "none";
        document.getElementById("imageView").style.display = "flex";
        document.getElementById("soundView").style.display = "none";
        document.getElementById("gameViewCheckmark").style.display = "none";
        document.getElementById("imageViewCheckmark").style.display = "block";
        document.getElementById("soundViewCheckmark").style.display = "none";
        ImageHandlerRenderer.createImageOverview();
        ImageHandler.showFirstPreviewImage();
    }
    SoundHandler.stopAllSounds();
}

function closeSpecificDropdown(id) {
    var myDropdown = document.getElementById(id);
    if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
    if (!e.target.matches('.dropbtn') && !e.target.matches('.dropdown-nav-item')) {
        const collection = document.getElementsByClassName("dropdown-content");
        if(collection.length) {
            for (let element of collection) {
                if(element.id) {
                    closeSpecificDropdown(element.id);
                }
            }
        }
    }
}