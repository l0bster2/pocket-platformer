class ExportedGameInitializer {
    static initializeExportedGame(allData) {
        WorldDataHandler.levels = allData.levels;
        WorldDataHandler.gamesName = allData.gamesName;
        WorldDataHandler.endingMessage = allData.endingMessage;
        WorldDataHandler.effects = allData.effects;
        WorldDataHandler.backgroundColor = allData.backgroundColor;
        WorldDataHandler.textColor = allData.textColor;
        TransitionAnimationHandler.animationFrames = allData.animationFrames;
        TransitionAnimationHandler.animationType = allData.animationType;
        if (allData?.song) {
            SoundHandler.song = new Sound(allData.song, "song", true);
            //WorldDataHandler.insideTool && MusicHandler.addSong(allData.mainSong);
        }
        if(allData?.sounds) {
            allData.sounds.forEach(sound => {
                SoundHandler.reloadSound(sound.key, sound.value);
            })
        }
        for (const [key, value] of Object.entries(allData.playerObject)) {
            player[key] = value;
        }
        for (const [key, value] of Object.entries(allData.sprites)) {
            if (key !== "TELEPORT" && key !== "TELEPORT2" && key !== "SFX4") {
                SpritePixelArrays[key] = value;
            }
        }
        player.setAnimationProperties();
        SpritePixelArrays.fillAllSprites();
    }
}