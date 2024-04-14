class SoundHandlerRenderer {
    static createSoundOverview() {
        document.getElementById("soundContent").innerHTML =
            `<div> 
            ${SoundHandler.sounds.filter(sound => sound.type === 'sound').map(sound => this.createSoundControls(sound)).join(' ')}
        </div>`;
        this.createMusicSection();
    }

    static stopSound(key) {
        SoundHandler[key].stop();
        document.getElementById(key + "Stop").style.display = "none";
        document.getElementById(key + "Start").style.display = "block";
    }

    static startSound(key) {
        SoundHandler[key].stopAndPlay();
    }

    static startMusic(key) {
        SoundHandler[key].stopAndPlay();
        document.getElementById(key + "MusicStop").style.display = "block";
        document.getElementById(key + "MusicStart").style.display = "none";
    }

    static stopMusic(key) {
        SoundHandler[key].stop();
        document.getElementById(key + "MusicStop").style.display = "none";
        document.getElementById(key + "MusicStart").style.display = "block";
    }

    static uploadCustomMusic() {
        var file = document.getElementById("uploadMusic").files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                SoundHandler.reloadSound("song", reader.result);
                this.createMusicSection();
                SoundHandler.stopAllSounds();
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    }

    static uploadCustomSound(key) {
        var file = document.getElementById("uploadSound" + key).files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                SoundHandler.reloadSound(key, reader.result)
                document.getElementById(key + "Upload").innerHTML = this.createSoundDeleteButton(key);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    }

    static deleteCustom(key) {
        const audioElement = document.getElementById(key);
        audioElement.src = SoundHandler[key + "Default"];
        audioElement.load();
        document.getElementById(key + "Upload").innerHTML = this.createSoundUploadButton(key);
        const soundIndex = SoundHandler.sounds.findIndex(sound => sound.key === key);
        SoundHandler.sounds[soundIndex].value = SoundHandler[key + "Default"];
        SoundHandler.sounds[soundIndex].customValue = false;
    }

    static deleteCustomMusic(key) {
        const soundIndex = SoundHandler.sounds.findIndex(sound => sound.key === key);
        SoundHandler.sounds[soundIndex].value = "";
        this.createMusicSection();
    }

    static createMusicSection() {
        const firstSongExists = SoundHandler.doesSoundExist("song");
        document.getElementById("musicContent").innerHTML = `<div class="musicContent">
        ${SoundHandler.sounds.filter(sound => sound.type === 'music' && sound.value).map((song, index) => {
            return this.createMusicControls(song, index);
        })}
            ${!firstSongExists ? this.createMusicUploadButton() : ''}
        </div>`;
    }

    static createMusicControls(sound, index) {
        return `<div class="soundControls">
        <button id="${sound.key}MusicStop" style="display: none" class="levelNavigationButton" onClick="SoundHandlerRenderer.stopMusic('${sound.key}')">
            <img src="images/icons/pause.svg" width="14" height="14">
        </button>
        <button id="${sound.key}MusicStart" class="levelNavigationButton" onClick="SoundHandlerRenderer.startMusic('${sound.key}')">
            <img src="images/icons/right.svg" width="14" height="14">
        </button>
        <span class="soundControlsDescription">Song ${index + 1}</span>
        <div id="${sound.key}Upload">
        <button id="addEffectButton" class="levelNavigationButton tertiaryButton marginTop8"
        onclick="SoundHandlerRenderer.deleteCustomMusic('${sound.key}')" style="padding: 8px 12px;">
        DELETE CUSTOM<img alt="plus" width="14" height="14" src="images/icons/delete.svg"
            class="iconInButtonWithText" style="padding-left: 8px">
        </button>
        </div>
    </div>`;
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
                ? this.createSoundDeleteButton(sound.key)
                : this.createSoundUploadButton(sound.key)
            }
            </div>
        </div>`;
    }

    static createSoundDeleteButton(key) {
        return `<button id="addEffectButton" class="levelNavigationButton tertiaryButton marginTop8"
        onclick="SoundHandlerRenderer.deleteCustom('${key}')" style="padding: 8px 12px;">
        DELETE CUSTOM<img alt="plus" width="14" height="14" src="images/icons/delete.svg"
            class="iconInButtonWithText" style="padding-left: 8px">
        </button>`;
    }

    static createMusicUploadButton() {
        return `<label class="levelNavigationButton importExportButton">
        <input type="file" id="uploadMusic" onChange="SoundHandlerRenderer.uploadCustomMusic()" />
        Import custom
        <img src="images/icons/import.svg" class="iconInButtonWithText" alt="import" width="16"
            height="16">
        </label>`
    }

    static createSoundUploadButton(key) {
        return `<label class="levelNavigationButton importExportButton">
        <input type="file" id="uploadSound${key}" onChange="SoundHandlerRenderer.uploadCustomSound('${key}')" />
        Import custom
        <img src="images/icons/import.svg" class="iconInButtonWithText" alt="import" width="16"
            height="16">
        </label>`
    }
}
