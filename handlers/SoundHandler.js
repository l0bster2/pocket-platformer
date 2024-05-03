class SoundHandler {

  static staticConstructor() {
    this.shortJumpDefault = Base64Sounds.shortSwooshBase64;
    this.longJumpDefault = Base64Sounds.longJumpBase64;
    this.hitDefault = Base64Sounds.hitBase64;
    this.winDefault = Base64Sounds.winBase64;
    this.pickupDefault = Base64Sounds.collectibleBase64;
    this.guiSelectDefault = Base64Sounds.startBase64;
    this.dashDefault = Base64Sounds.dashBase64;
    this.checkpointDefault = Base64Sounds.checkPointBase64;
    this.allCoinsCollectedDefault = Base64Sounds.allCoinsCollectedBase64;
    this.dialogueSoundDefault = Base64Sounds.dialogueBase64;
    this.bubbleDefault = Base64Sounds.bubbleBase64;
    this.barrelDefault = Base64Sounds.barrelBase64;
    this.jumpResetDefault = Base64Sounds.jumpResetBase64;
    this.songDefault = "";

    this.sounds = [
      { key: "shortJump", descriptiveName: "jump", value: this.shortJumpDefault, type: "sound" },
      { key: "longJump", descriptiveName: "trampoline", value: this.longJumpDefault, type: "sound" },
      { key: "hit", descriptiveName: "hit", value: this.hitDefault, type: "sound" },
      { key: "win", descriptiveName: "finish flag", value: this.winDefault, type: "sound" },
      { key: "pickup", descriptiveName: "coin collected", value: this.pickupDefault, type: "sound" },
      { key: "guiSelect", descriptiveName: "game start", value: this.guiSelectDefault, type: "sound" },
      { key: "dash", descriptiveName: "dash", value: this.dashDefault, type: "sound" },
      { key: "checkpoint", descriptiveName: "checkpoint", value: this.checkpointDefault, type: "sound" },
      { key: "allCoinsCollected", descriptiveName: "all coins in level collected", value: this.allCoinsCollectedDefault, type: "sound" },
      { key: "dialogueSound", descriptiveName: "dialogue", value: this.dialogueSoundDefault, type: "sound" },
      { key: "bubble", descriptiveName: "water", value: this.bubbleDefault, type: "sound" },
      { key: "barrel", descriptiveName: "barrel", value: this.barrelDefault, type: "sound" },
      { key: "jumpReset", descriptiveName: "jump reset", value: this.jumpResetDefault, type: "sound" },
      { key: "song", descriptiveName: "", value: "", type: "music" },
      //{ key: "build", value: "https://drive.google.com/uc?export=download&id=1hgwOVAX30LJ9A71xoAU8IGnXwcm6L2Fc"},
    ];

    this.sounds.forEach(sound => {
      if (sound.key === "song" && WorldDataHandler.insideTool) {
        this.song = new Sound("", "song", true);
      } else {
        this[sound.key] = new Sound(sound.value, sound.key, sound.type === "music");
      }
    });
  }

  static setVolume(audoElementId, volume = 1) {
    const sound = document.getElementById(audoElementId);
    if (sound) {
      sound.volume = volume;
    }
  };

  static fadeAudio(audoElementId, interval = 200) {
    if (audoElementId) {
      const sound = document.getElementById(audoElementId);
      if (sound) {
        const fadeAudio = setInterval(() => {
          if ((sound.volume !== 0)) {
            sound.volume -= 0.1;
          }

          if (sound.volume < 0.11) {
            clearInterval(fadeAudio);
          }
        }, interval);
      }
    }
  }

  static stopAllSounds() {
    this.sounds.forEach(sound => {
      this[sound.key].stop();
      this[sound.key].currentTime = 0;
    });
  }

  static doesSoundExist(key) {
    const soundIndex = SoundHandler.sounds.findIndex(sound => sound.key === key);
    return SoundHandler.sounds[soundIndex].value;
  }

  static reloadSound(key, value) {
    const audioElement = document.getElementById(key);
    audioElement.src = value;
    audioElement.load();
    let foundIndex = 0;
    this.sounds.forEach((sound, index) => {
      if (sound.key === key) {
        foundIndex = index;
      }
    });
    this.sounds[foundIndex].customValue = true;
    this.sounds[foundIndex].value = value;
  }
}