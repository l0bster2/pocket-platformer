class SoundHandler {

  static staticConstructor() {
    this.shortJumpDefault = shortSwooshBase64;
    this.longJumpDefault = longJumpBase64;
    this.hitDefault = hitBase64;
    this.winDefault = winBase64;
    this.pickupDefault = collectibleBase64;
    this.guiSelectDefault = startBase64;
    this.dashDefault = dashBase64;
    this.checkpointDefault = checkPointBase64;
    this.allCoinsCollectedDefault = allCoinsCollectedBase64;
    this.dialogueSoundDefault = dialogueBase64;
    this.bubbleDefault = bubbleBase64;
    this.barrelDefault = barrelBase64;
    this.jumpResetDefault = jumpResetBase64;
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
        this.song = new Sound("", "mainSong", true);
      } else {
        this[sound.key] = new Sound(sound.value, sound.key);
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
}