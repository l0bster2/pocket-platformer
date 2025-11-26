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
        if (key === "dialogueSound") {
            setTimeout(() => {
                SoundHandler[key].stop();
            }, "2000");
        }
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
                const fileName = file.name.substring(0, file.name.lastIndexOf('.'))
                SoundHandler.sounds.push({
                    key: fileName, descriptiveName: "", value: reader.result, type: "music", customValue: true,
                });
                SoundHandler[fileName] = new Sound(reader.result, fileName, true);
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
        SoundHandler.sounds.splice(soundIndex, 1);
        const element = document.getElementById(key);
        element.remove();
        //SoundHandler.sounds[soundIndex].value = "";
        WorldDataHandler.levels.forEach(level => {
            if (level.song === key) {
                level.song = null;
            }
        })
        this.createMusicSection();
    }

    static createMusicSection() {
        document.getElementById("musicContent").innerHTML = `<div class="musicContent">
        ${SoundHandler.sounds.filter(sound => sound.type === 'music' && sound.value).map((song, index) => {
            return this.createMusicControls(song, index);
        }).join(' ')}
            ${this.createMusicUploadButton()}
        </div>`;
    }

    static handleLevelCheckboxClick(event, index) {
        const soundKey = event.target.getAttribute('data-song');
        const musicOnly = SoundHandler.sounds.filter(sound => sound.type === 'music');
        musicOnly.forEach(music => {
            const songElementWithSameIndex = document.getElementById(`musicLevelChecked${index}${music.key}`);
            if (songElementWithSameIndex && songElementWithSameIndex.getAttribute('data-song') !== soundKey) {
                songElementWithSameIndex.checked = false;
                WorldDataHandler.levels[index].song = null;
            }
        })
        this.addSongToLevel(index, soundKey);
    }

    static addSongToLevel(index, key) {
        WorldDataHandler.levels[index].song = key;
    }

    static createLevelSelectCheckboxes(soundKey) {
        let result = "";
        WorldDataHandler.levels.forEach((_, index) => {
            let text = `Level ${index}`;
            if (index > 0) {
                if (index === WorldDataHandler.levels.length - 1) {
                    text = "End screen"
                }
                // If new effect created, select all checkboxes by expect start and finish by default. Otherwise check where checked by user
                const checkCheckbox = WorldDataHandler.levels[index]?.song === soundKey;
                result += `<div class="marginTop4">
                    <input type="checkbox" id="musicLevelChecked${index}${soundKey}" name="musicLevelCheck" onclick="SoundHandlerRenderer.handleLevelCheckboxClick(event, ${index})"
                    ${checkCheckbox ? "checked" : ""} data-song="${soundKey}">
                    <label for="musicLevelChecked${index}${soundKey}" class="checkBoxText">${text}</label>
                </div>`;
            }
        })
        return result;
    }

    static createMusicControls(sound, index) {
        return `
        <div class="musicControls">
        <div class="soundControls">
           <button id="${sound.key}MusicStop" style="display: none" class="levelNavigationButton" onClick="SoundHandlerRenderer.stopMusic('${sound.key}')">
           <img src="images/icons/pause.svg" width="14" height="14">
           </button>
           <button id="${sound.key}MusicStart" class="levelNavigationButton" onClick="SoundHandlerRenderer.startMusic('${sound.key}')">
           <img src="images/icons/right.svg" width="14" height="14">
           </button>
           <span class="soundControlsDescription">${sound.key}</span>
           <div id="${sound.key}Upload">
              <button class="levelNavigationButton tertiaryButton marginTop8"
                 onclick="SoundHandlerRenderer.deleteCustomMusic('${sound.key}')" style="padding: 8px 12px;">
              DELETE CUSTOM<img alt="plus" width="14" height="14" src="images/icons/delete.svg"
                 class="iconInButtonWithText">
              </button>
           </div>
        </div>
        <details class="marginTop4">
           <summary class="sfxTemplateSummary">Select levels</summary>
           <div class="sfxTemplateSection">
              <div style="display: grid; grid-template-columns: auto auto;">
                 ${this.createLevelSelectCheckboxes(sound.key)}
              </div>
           </div>
        </details>
     </div>
        `;
    }

    static createSoundControls(sound) {
        let extraClass = "";
        if (sound.key === "custom1") {
            extraClass = "subSection paddingTop8 ";
        }

        return `<div class=" ${extraClass} soundControls">
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
        return `<button class="levelNavigationButton tertiaryButton marginTop8"
        onclick="SoundHandlerRenderer.deleteCustom('${key}')" style="padding: 8px 12px;">
        DELETE CUSTOM<img alt="plus" width="14" height="14" src="images/icons/delete.svg"
            class="iconInButtonWithText">
        </button>`;
    }

    static createMusicUploadButton() {
        return `<label class="levelNavigationButton block">
        <input type="file" id="uploadMusic" onChange="SoundHandlerRenderer.uploadCustomMusic()" />
        Import custom
        <img src="images/icons/import.svg" class="iconInButtonWithText" alt="import" width="16"
            height="16">
        </label>`
    }

    static createSoundUploadButton(key) {
        return `<label class="levelNavigationButton block">
        <input type="file" id="uploadSound${key}" onChange="SoundHandlerRenderer.uploadCustomSound('${key}')" />
        Import custom
        <img src="images/icons/import.svg" class="iconInButtonWithText" alt="import" width="16"
            height="16">
        </label>`
    }
}
