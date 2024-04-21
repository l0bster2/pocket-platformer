const levelDataCommentStart = "//initialLevelDataStart";
const levelDataCommentEnd = "//initialLevelDataEnd";
const musicCommentStart = "//musicCommentStart";
const musicCommentEnd = "//musicCommentEnd";
const spriteDataCommentStart = "//changedSpritesStart";
const spriteDataCommentEnd = "//changedSpritesEnd";
const playerAttributesCommentStart = "//changedPlayerAttributesStart";
const playerAttributesCommentEnd = "//changedPlayerAttributesEnd";
const transitionCommentStart = "//initialTransitionStart";
const transitionCommentEnd = "//initialTransitionEnd";
const levelDataInitialization = "WorldDataHandler.levels = ";
let gamesNameInitialization = "WorldDataHandler.gamesName = ";
let gamesEndingInitialization = "WorldDataHandler.endingMessage = ";
let gamesBackgroundColorInitialization = "WorldDataHandler.backgroundColor = ";
let gamesTextColorInitialization = "WorldDataHandler.textColor = ";
let gameEffectsInitialization = "WorldDataHandler.effects = ";
let gamesMusicUrlInitialization = "SoundHandler.song = new Sound(";
let version = "1.1";

function legacyImporter(fileContent) {
    var worldDataPart = fileContent.substring(
        fileContent.lastIndexOf(levelDataCommentStart) + levelDataCommentStart.length,
        fileContent.lastIndexOf(levelDataCommentEnd)
    );
    worldDataPart = worldDataPart.replace(levelDataInitialization, "");
    const indexOfUnescape = worldDataPart.indexOf("WorldDataHandler.gamesName = unescape(");

    var endingPart = indexOfUnescape > 0 ? '");' : '";';
    gamesNameInitialization = indexOfUnescape > 0
        ? gamesNameInitialization.replace("= ", "= unescape(") : gamesNameInitialization;
    gamesEndingInitialization = indexOfUnescape > 0
        ? gamesEndingInitialization.replace("= ", "= unescape(") : gamesEndingInitialization;

    const { value: parsedGameName, worldDataPart: withoutGameName } = getWorldDataPartValue(worldDataPart, gamesNameInitialization, endingPart);
    worldDataPart = withoutGameName;
    if (parsedGameName) {
        WorldDataHandler.gamesName = unescape(parsedGameName);
        document.getElementById("gamesname").value = WorldDataHandler.gamesName;
    }

    const { value: parsedEndingMessage, worldDataPart: withoutEndingMessage } = getWorldDataPartValue(worldDataPart, gamesEndingInitialization, endingPart);
    worldDataPart = withoutEndingMessage;
    if (parsedEndingMessage) {
        WorldDataHandler.endingMessage = unescape(parsedEndingMessage);
        document.getElementById("endingmessage").value = WorldDataHandler.endingMessage;
    }

    const { value: backgroundColor, worldDataPart: withoutBackgroundColor } = getWorldDataPartValue(worldDataPart, gamesBackgroundColorInitialization, '";');
    worldDataPart = withoutBackgroundColor;
    if (backgroundColor) {
        WorldDataHandler.backgroundColor = backgroundColor;
        WorldColorChanger.changeLevelColor(1);
    }

    const { value: textColor, worldDataPart: withoutTextColor } = getWorldDataPartValue(worldDataPart, gamesTextColorInitialization, '";');
    worldDataPart = withoutTextColor;
    if (textColor) {
        WorldColorChanger.setTextColor("#" + textColor);
    }

    const { value: effects, worldDataPart: withoutEffects } = getWorldDataPartValue(worldDataPart, gameEffectsInitialization, '];');
    worldDataPart = withoutEffects;

    if (effects) {
        WorldDataHandler.effects = JSON.parse(`[${effects}]`);
    }

    WorldDataHandler.levels = JSON.parse(worldDataPart);

    var spriteDataPart = fileContent.substring(
        fileContent.lastIndexOf(spriteDataCommentStart) + spriteDataCommentStart.length,
        fileContent.lastIndexOf(spriteDataCommentEnd)
    );
    var spriteArr = spriteDataPart.match(/(?<=SpritePixelArrays\s*).*?(?=\s*;)/gs);

    if (spriteArr) {
        spriteArr.forEach(sprite => {
            const spriteNamePart = sprite.substring(0, sprite.indexOf("=") + 1);
            const spriteName = spriteNamePart.substring(
                spriteNamePart.indexOf("[") + 2, spriteNamePart.indexOf("]") - 1);
            if (spriteNamePart && spriteName) {
                const spriteToReplace = JSON.parse(sprite.replace(spriteNamePart, ""));

                if (spriteName !== "TELEPORT" && spriteName !== "TELEPORT2" && spriteName !== "SFX4") {
                    if (spriteToReplace.custom) {
                        SpritePixelArrays[spriteToReplace.descriptiveName] = spriteToReplace;
                    }
                    else {
                        SpritePixelArrays[spriteName].animation = spriteToReplace.animation;
                        if (spriteToReplace.squishAble !== undefined) {
                            SpritePixelArrays[spriteName].squishAble = spriteToReplace.squishAble;
                        }
                    }
                }
            }
        })
    }

    var playerAttrPart = fileContent.substring(
        fileContent.lastIndexOf(playerAttributesCommentStart) + playerAttributesCommentStart.length,
        fileContent.lastIndexOf(playerAttributesCommentEnd)
    );

    var playerAttrArray = playerAttrPart.match(/(?<=player\s*).*?(?=\s*;)/gs);
    let sliderValues = PlayerAttributesHandler.sliderValues;

    sliderValues.push("maxJumpFrames");
    playerAttrArray && playerAttrArray.forEach(playerAttr => {
        const attrName = playerAttr.substring(playerAttr.indexOf('"') + 1, playerAttr.lastIndexOf('"'));
        const attrValue = playerAttr.substring(playerAttr.indexOf('=') + 1, playerAttr.length);
        if (sliderValues.includes(attrName)) {
            player[attrName] = Number(attrValue);
            attrName !== "maxJumpFrames" && PlayerAttributesHandler.setInitialSliderValue(attrName);
        }
        else {
            player[attrName] = attrValue.includes('true') ? true : false;
            PlayerAttributesHandler.setInitialCheckboxValue(attrName);
        }
    });

    const transitionStartIndex = fileContent.lastIndexOf(transitionCommentStart);
    if (transitionStartIndex) {
        var transitionPart = fileContent.substring(
            transitionStartIndex + transitionCommentStart.length,
            fileContent.lastIndexOf(transitionCommentEnd)
        );
        const { value: animationFrames, worldDataPart: output } = getWorldDataPartValue(transitionPart, 'TransitionAnimationHandler.animationFrames = ', '";');
        transitionPart = output;
        if (animationFrames) {
            TransitionAnimationHandler.setDurationElementValue(animationFrames);
        }

        const { value: animationType, worldDataPart: output2 } = getWorldDataPartValue(transitionPart, 'TransitionAnimationHandler.animationType = ', '";');
        transitionPart = output2;
        if (animationType) {
            TransitionAnimationHandler.setTypeElementValue(animationType);
        }
    }
}


function parseMusicFromGameFile(gameContent) {
    const musicUrlIndex = gameContent.indexOf(gamesMusicUrlInitialization);
    if (musicUrlIndex >= 0) {
        const endingIndex = gameContent.indexOf('", "mainSong", true);//music here');
        return gameContent.substring(musicUrlIndex + gamesMusicUrlInitialization.length + 1, endingIndex);
    }
    return null;
}

function getWorldDataPartValue(worldDataPart, stringToSearchFor, endingPart) {
    if (worldDataPart.indexOf(stringToSearchFor) >= 0) {
        var wholeLine = worldDataPart.substring(
            worldDataPart.indexOf(stringToSearchFor),
            worldDataPart.indexOf(endingPart) + endingPart.length
        );
        worldDataPart = worldDataPart.replace(wholeLine, "");
        const value = wholeLine.substring(
            wholeLine.indexOf(stringToSearchFor) + stringToSearchFor.length + 1,
            wholeLine.indexOf(endingPart)
        );
        return { worldDataPart, value };
    }
    return { worldDataPart, value: null };
};