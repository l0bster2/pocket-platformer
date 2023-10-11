class SoundHandler {

  static staticConstructor() {
    this.sounds = [
      { key: "shortJump", value: "https://drive.google.com/uc?export=download&id=1Q54bi8oothHVvLPrqOMT5fmJA8tpoXLa" },
      { key: "longJump", value: "https://drive.google.com/uc?export=download&id=12m9FxLjEyBORA4FP3xwb6rxjBQvBb3U2" },
      { key: "hit", value: "https://drive.google.com/uc?export=download&id=11AUmOV0mBVP6LWb6sd_g1C88rkzLIGrV" },
      { key: "win", value: "https://drive.google.com/uc?export=download&id=1xk9DMqJDWj-4urGLw6jig8H9-U_RwA_v" },
      { key: "pickup", value: "https://drive.google.com/uc?export=download&id=1U81-o2IpSH1SGN4B492ztpoq2uQLGHvt" },
      { key: "guiSelect", value: "https://drive.google.com/uc?export=download&id=13INaCaIZpL3EIXayJr-lRzCNptqFDjYp" },
      { key: "dash", value: "https://drive.google.com/uc?export=download&id=1L9FUOzkYmXwOAzHrqJTw6Rwhg6LI0hHm" },
      { key: "checkpoint", value: "https://drive.google.com/uc?export=download&id=1aM3MbC-D2lxTnIEqpLoevxsE1WiiAdKQ" },
      { key: "allCoinsCollected", value: "https://drive.google.com/uc?export=download&id=13G9ILQvGiMyBczD8K39SzYpAnHgZOElU" },
      { key: "dialogueSound", value: "https://drive.google.com/uc?export=download&id=16lQ6U0MN1xTAc263JmM-LIJnY1uI6JGx" },
      { key: "bubble", value: "https://drive.google.com/uc?export=download&id=1LLScpBZq_Ukjxl03ifdHYVIYttYv4iBo" },
      { key: "barrel", value: "https://drive.google.com/uc?export=download&id=1APTVswGa7ZD6DpmI5mo-yO5JWUnKWBdc" },
      { key: "jumpReset", value: "https://drive.google.com/uc?export=download&id=1pAl98sb2QSaAZImdGmBdcBAY_zNBFawG" },
      { key: "song", value: "" },
      //{ key: "build", value: "https://drive.google.com/uc?export=download&id=1hgwOVAX30LJ9A71xoAU8IGnXwcm6L2Fc"},
    ];

    this.sounds.forEach(sound => {
      if (sound.key === "song" && WorldDataHandler.insideTool) {
        this.song = new Sound("", "mainSong", true);
      } else {
        this[sound.key] = new Sound(sound.value);
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