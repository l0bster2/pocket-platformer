class SoundHandlerRenderer {
    static createSoundOverview() {
        document.getElementById("soundContent").innerHTML =
            `<div> 
            ${SoundHandler.sounds.filter((sound) => sound.type === 'sound').map(sound => this.createSoundControls(sound)).join(' ')}
        </div>`;
        document.getElementById("musicContent").innerHTML =
        `
        `;
    }

    static stopSound(key) {
        SoundHandler[key].stop();
        document.getElementById(key + "Stop").style.display = "none";
        document.getElementById(key + "Start").style.display = "block";
    }

    static startSound(key) {
        SoundHandler[key].stopAndPlay();
        //document.getElementById(key + "Stop").style.display = "block";
        //document.getElementById(key + "Start").style.display = "none";
    }

    static uploadCustom(key) {
        var file = document.getElementById("uploadSound" + key).files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                SoundHandler.reloadSound(key, reader.result)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
        document.getElementById(key + "Upload").innerHTML = this.createDeleteButton(key);
    }

    static deleteCustom(key) {
        const audioElement = document.getElementById(key);
        audioElement.src = SoundHandler[key + "Default"];
        audioElement.load();
        document.getElementById(key + "Upload").innerHTML = this.createUploadButton(key);
        const soundIndex = SoundHandler.sounds.findIndex(sound => sound.key = key);
        SoundHandler.sounds[soundIndex].value = SoundHandler[key + "Default"];
        SoundHandler.sounds[soundIndex].customValue = false;
    }

    static createSoundControls(sound) {
        return `<div class="soundControls">
            <button id="${sound.key}Stop" style="display: none" class="levelNavigationButton" onClick="SoundHandlerRenderer.stopSound('${sound.key}')">
                <img src="images/icons/pause.svg" width="14" height="14">
            </button>
            <button id="${sound.key}Start" class="levelNavigationButton" onClick="SoundHandlerRenderer.startSound('${sound.key}')">
                <img src="images/icons/right.svg" width="14" height="14">
            </button>
            <span class="soundControlsDescription">${sound.descriptiveName}</span>
            <div id="${sound.key}Upload">
            ${sound?.customValue 
                ? this.createDeleteButton(sound.key)
                : this.createUploadButton(sound.key)
            }
            </div>
        </div>`;
    }

    static createDeleteButton(key) {
        return `<button id="addEffectButton" class="levelNavigationButton tertiaryButton marginTop8"
        onclick="SoundHandlerRenderer.deleteCustom('${key}')" style="padding: 8px 12px;">
        DELETE CUSTOM<img alt="plus" width="14" height="14" src="images/icons/delete.svg"
            class="iconInButtonWithText" style="padding-left: 8px">
        </button>`;
    }

    static createUploadButton(key) {
        return `<label class="levelNavigationButton importExportButton">
        <input type="file" id="uploadSound${key}" onChange="SoundHandlerRenderer.uploadCustom('${key}')" />
        Import custom
        <img src="images/icons/import.svg" class="iconInButtonWithText" alt="import" width="16"
            height="16">
        </label>`
    }
}