class MusicHandler {
    static stopMusic() {
        SoundHandler.song.stop();
        this.setMusicPlayerStyles("display: none", "display: inline-block");
    }

    static startMusic() {
        SoundHandler.song.play();
        this.setMusicPlayerStyles();
    }

    static setMusicPlayerStyles (stopButton = "display: inline-block", playButton = "display: none") {
        document.getElementById("stopMusic").style = stopButton;
        document.getElementById("startMusic").style = playButton;
    }
}