class ExportedGameInitializer {
    static initializeExportedGame(allData) {
        WorldDataHandler.levels = allData.levels;
        WorldDataHandler.gamesName = allData.gamesName;
        WorldDataHandler.endingMessage = allData.endingMessage;
        WorldDataHandler.effects = allData.effects;
        WorldDataHandler.backgroundColor = allData.backgroundColor;
        WorldDataHandler.textColor = allData.textColor;
        WorldDataHandler.backgroundImage = allData.backgroundImage;
        WorldDataHandler.backgroundImageSize = allData.backgroundImageSize;
        TransitionAnimationHandler.animationFrames = allData.animationFrames;
        TransitionAnimationHandler.animationType = allData.animationType;
        if(allData.images) {
            ImageHandler.images = allData.images;
        }
        else {
            //ImageHandler.images = [];
        }

        if(allData?.sounds) {
            allData.sounds.forEach(sound => {
                if(sound.type === 'music' && !SoundHandler.doesSoundExist(sound.key)) {
                    SoundHandler.sounds.push({
                        key: sound.key, descriptiveName: "", value: sound.value, type: "music", customValue: true,
                    });
                    SoundHandler[sound.key] = new Sound(sound.value, sound.key, true);
                }
                SoundHandler.reloadSound(sound.key, sound.value);
            })
        }
        for (const [key, value] of Object.entries(allData.playerObject)) {
            player[key] = value;
        }
        for (const [key, value] of Object.entries(allData.sprites)) {
            if (key !== "TELEPORT" && key !== "TELEPORT2" && key !== "SFX4") {
                SpritePixelArrays[key] = value;
                /*if(key.includes("PLAYER")) {
                    SpritePixelArrays[key].commonType = "player";
                }*/
            }
        }
        SpritePixelArrays.fillAllSprites();
        SpritePixelArrays.indexAllSprites();
        player.setAnimationProperties();
        player.updateExtraColissionPoints();
    }
}