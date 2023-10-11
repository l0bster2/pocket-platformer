class Sound {

  constructor(src, id = "", loop = false) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    if(id) {
      this.sound.id = id; 
    }
    this.errorWhileLoading = false;
    this.sound.loop = loop;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.onloadeddata = () => this.loadedSrc()
    this.sound.onerror = () => { this.errorWhileLoading = true; };
    this.loaded = false;
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }

  loadedSrc() {
    this.loaded = true;
  }

  stopAndPlay() {
    if (this.loaded) {
      this.sound.currentTime > 0 && this.sound.pause();
      this.sound.currentTime = 0;
      this.sound.play();
    }
  }

  play() {
    if (this.loaded) {
      this.sound.play();
    }
  }

  stop() {
    if (this.loaded) {
      this.sound.pause();
    }
  }
}