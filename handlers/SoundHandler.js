class SoundHandler {

  static staticConstructor() {
    this.shortJumpDefault = "https://drive.google.com/uc?export=download&id=1Q54bi8oothHVvLPrqOMT5fmJA8tpoXLa";
    this.longJumpDefault = "https://drive.google.com/uc?export=download&id=12m9FxLjEyBORA4FP3xwb6rxjBQvBb3U2";
    this.hitDefault = "https://drive.google.com/uc?export=download&id=11AUmOV0mBVP6LWb6sd_g1C88rkzLIGrV";
    this.winDefault = "https://drive.google.com/uc?export=download&id=1xk9DMqJDWj-4urGLw6jig8H9-U_RwA_v";
    this.pickupDefault = "https://drive.google.com/uc?export=download&id=1U81-o2IpSH1SGN4B492ztpoq2uQLGHvt";
    this.guiSelectDefault = "https://drive.google.com/uc?export=download&id=13INaCaIZpL3EIXayJr-lRzCNptqFDjYp";
    this.dashDefault = "https://drive.google.com/uc?export=download&id=1L9FUOzkYmXwOAzHrqJTw6Rwhg6LI0hHm";
    this.checkpointDefault = "https://drive.google.com/uc?export=download&id=1aM3MbC-D2lxTnIEqpLoevxsE1WiiAdKQ";
    this.allCoinsCollectedDefault = "https://drive.google.com/uc?export=download&id=13G9ILQvGiMyBczD8K39SzYpAnHgZOElU";
    this.dialogueSoundDefault = "https://drive.google.com/uc?export=download&id=16lQ6U0MN1xTAc263JmM-LIJnY1uI6JGx";
    this.bubbleDefault = "https://drive.google.com/uc?export=download&id=1LLScpBZq_Ukjxl03ifdHYVIYttYv4iBo";
    this.barrelDefault = "https://drive.google.com/uc?export=download&id=1APTVswGa7ZD6DpmI5mo-yO5JWUnKWBdc";
    this.jumpResetDefault = "https://drive.google.com/uc?export=download&id=1pAl98sb2QSaAZImdGmBdcBAY_zNBFawG";
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