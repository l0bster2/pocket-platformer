const levelDataCommentStart = "//initialLevelDataStart";
const levelDataCommentEnd = "//initialLevelDataEnd";
const musicCommentStart = "//musicCommentStart";
const musicCommentEnd = "//musicCommentEnd";
const spriteDataCommentStart = "//changedSpritesStart";
const spriteDataCommentEnd = "//changedSpritesEnd";
const playerAttributesCommentStart = "//changedPlayerAttributesStart";
const playerAttributesCommentEnd = "//changedPlayerAttributesEnd";
const levelDataInitialization = "WorldDataHandler.levels = ";
let gamesNameInitialization = "WorldDataHandler.gamesName = ";
let gamesEndingInitialization = "WorldDataHandler.endingMessage = ";
let gamesBackgroundColorInitialization = "WorldDataHandler.backgroundColor = ";
let gamesTextColorInitialization = "WorldDataHandler.textColor = ";
let gameEffectsInitialization = "WorldDataHandler.effects = ";
let gamesMusicUrlInitialization = "SoundHandler.song = new Sound(";
let versionString = "const version = ";
let version = "1.1";

function changeTitleOrEnding(event, name) {
  WorldDataHandler[name] = event.target.value;
}

function importGame() {
  var file = document.getElementById("importButton").files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      try {
        const fileContent = evt.target.result;
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
        const songUrl = parseMusicFromGameFile(fileContent);
        if (songUrl) {
          MusicHandler.addSong(songUrl);
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
        SpritePixelArrays.fillAllSprites();
        tileMapHandler.setTileTypes();
        spriteSheetCreator.setCanvasSize();
        spriteSheetCreator.createSpriteSheet();
        DrawSectionHandler.removeOptions();
        DrawSectionHandler.fillSelectBox();

        const version = parseVersionFromImportedGame(fileContent);

        var playerAttrPart = fileContent.substring(
          fileContent.lastIndexOf(playerAttributesCommentStart) + playerAttributesCommentStart.length,
          fileContent.lastIndexOf(playerAttributesCommentEnd)
        );

        var playerAttrArray = playerAttrPart.match(/(?<=player\s*).*?(?=\s*;)/gs);
        let sliderValues = PlayerAttributesHandler.sliderValues;

        /*
          Initially, set all abilitiy checkboxes to false. in case user implemented a game, where
          an ability has not been implemented yet (f.e. dash)
        */
        player["dashChecked"] = false;
        player["runChecked"] = false;
        PlayerAttributesHandler.setInitialCheckboxValue("dashChecked");
        PlayerAttributesHandler.setInitialCheckboxValue("runChecked");

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
        player.setAnimationProperties();
        TabPagination.setPaginationToDefault();
        DrawSectionHandler.currentSprite = { sprite: SpritePixelArrays.TILE_1, animationFrame: 0, spriteIndexInArray: 0 };
        DrawSectionHandler.changeSelectedSprite({ target: { value: SpritePixelArrays.TILE_1.descriptiveName } }, true);
        DrawSectionHandler.redrawOutsideCanvases();
        if (TabNavigation.currentSelectedTab === SpritePixelArrays.customType) {
          TabNavigation.redrawAfterAddedOrDeletedSprite();
        }
        TabNavigation.handleSelectedSprite(0, 0);
        tileMapHandler.currentLevel = 1;
        tileMapHandler.resetLevel(tileMapHandler.currentLevel);
        LevelNavigationHandler.updateLevel();
      }
      catch (error) {
        alert("Could not parse file. Please try refreshing your page and importing it again.")
      }
    }
    reader.onerror = function (evt) {
      console.log("error");
    }
  }
}

function parseVersionFromImportedGame(fileContent) {
  let importedVersion;
  const indexOfVersion = fileContent.indexOf(versionString);

  try {
    if (indexOfVersion > 0) {
      const contentStartingFromVersion = fileContent.substring(indexOfVersion, indexOfVersion + 50);
      const indexOfVersionEnd = contentStartingFromVersion.indexOf(";");
      let parsedVersionString = contentStartingFromVersion.substring(0, indexOfVersionEnd);
      let parsedVersion = parsedVersionString.replace(versionString, "").replace(";", "");
      if (parsedVersion) {
        importedVersion = parseFloat(parsedVersion);
      }
    }
    return importedVersion;
  }
  catch (error) {
    return importedVersion;
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

function findAndRemoveOptionsOnImport(originalString, lineToRemove) {
  var gamesNameLine = originalString.substring(originalString.indexOf(lineToRemove), originalString.indexOf('";') + 2);
  originalString = originalString.replace(gamesNameLine, "");

  var gamesName = gamesNameLine.substring(
    gamesNameLine.indexOf(lineToRemove) + lineToRemove.length + 1,
    gamesNameLine.indexOf('";')
  );
  return gamesName;
}

function createPlayerAttributesSection() {
  var playerAttrStr = "";
  let sliderValues = PlayerAttributesHandler.sliderValues;
  sliderValues.push("maxJumpFrames");
  sliderValues.forEach(sliderValue => {
    playerAttrStr += `player["${sliderValue}"] = ${player[sliderValue]};`;
  })
  PlayerAttributesHandler.checkBoxValues.forEach(checkBoxValue => {
    playerAttrStr += `player["${checkBoxValue}"] = ${player[checkBoxValue]};`;
  })
  return `${playerAttributesCommentStart}
  ${playerAttrStr}
  ${playerAttributesCommentEnd}`;
}

function exportGame() {
  const fileAsDocObject = createHtmlDocoumentWithCanvas();
  let bundledScripts = bundleAllScripts();
  //remove everything that is marked with special comments and is not needed
  bundledScripts = bundledScripts.replaceAll(/\/\/startRemoval ([\s\S]*?) \/\/endRemoval/g, "");
  bundledScripts = bundledScripts.replace("//putVersionHere", `${versionString}${version};`);
  bundledScripts = bundledScripts.replace("//putInitialLevelsInExportHere", createIntialLevels());
  bundledScripts = bundledScripts.replace("//putChangedSpritesHere", createChangedSpites());
  bundledScripts = bundledScripts.replace("//putPlayerAttributesHere", createPlayerAttributesSection());
  if (SoundHandler?.song?.src) {
    bundledScripts = bundledScripts.replace("//putMainSongHere", addMusic());
  }
  var scriptTag = fileAsDocObject.createElement("script");
  scriptTag.innerHTML = bundledScripts;
  fileAsDocObject.body.appendChild(scriptTag);
  const fileAsString = fileAsDocObject.documentElement.innerHTML;
  download(`${WorldDataHandler.gamesName}`, fileAsString)
}

function addMusic() {
  return `${musicCommentStart}
    SoundHandler.song = new Sound("${SoundHandler.song.src}", "mainSong", true);//music here
    ${musicCommentEnd}`;
}

function createIntialLevels() {
  return `${levelDataCommentStart}
  ${levelDataInitialization}
  ${JSON.stringify(WorldDataHandler.levels)}
  WorldDataHandler.gamesName = unescape("${escape(WorldDataHandler.gamesName)}");
  WorldDataHandler.endingMessage = unescape("${escape(WorldDataHandler.endingMessage)}");
  WorldDataHandler.effects = ${JSON.stringify(WorldDataHandler.effects)};
  WorldDataHandler.backgroundColor = "${WorldDataHandler.backgroundColor}";
  WorldDataHandler.textColor = "${WorldDataHandler.textColor}";
  ${levelDataCommentEnd}`;
}

function createChangedSpites() {
  var spriteArrayStr = "";
  Object.keys(SpritePixelArrays).forEach(key => {
    if (SpritePixelArrays[key]?.descriptiveName && !SpritePixelArrays[key]?.custom) {
      spriteArrayStr += `SpritePixelArrays["${key}"] = ${JSON.stringify(SpritePixelArrays[key])};`;
    }
  })
  SpritePixelArrays.allSprites.forEach(sprite => {
    if (sprite.custom) {
      spriteArrayStr += `SpritePixelArrays["${sprite.descriptiveName.replace(/\s/g, '')}"] = ${JSON.stringify(sprite)};`;
    }
  });
  return `${spriteDataCommentStart}
  ${spriteArrayStr}
  player.setAnimationProperties();
  SpritePixelArrays.fillAllSprites();
  ${spriteDataCommentEnd}`;
}

function createHtmlDocoumentWithCanvas() {
  const emptyHtmlDocument = document.implementation.createHTMLDocument(WorldDataHandler.gamesName);
  let styleSheet = `
        #myCanvas {
          width: 100%;
        }
        body {
          -webkit-user-select:none;
          -webkit-touch-callout: none;
          background-color: black; 
          margin: 0; 
        }
        #mobileControls {
          display: flex;
          position: relative;
          padding: 50px 20px 0; 
          background-color: black;
        }
        #mobileArrowControls {
          position: relative; 
          flex: 1; 
          margin: auto;
        }
        @media (min-width: 768px) {
          body {
            background-image: none;
          }
          #myCanvas {
            border: 1px solid white;
            width:auto;
            height:auto;
            background-color: blue;
          }
          #mobileControls {
            display: none;
          }
          body {
            display: flex;
            align-items: center;
            justify-content: center;
          }
      }`;
  let style = '<style type="text/css">' + styleSheet + "</style>";
  emptyHtmlDocument.getElementsByTagName('head')[0].innerHTML = style;

  var meta = document.createElement('meta');
  meta.setAttribute("name", "viewport");
  meta.setAttribute("content", "width=device-width, initial-scale=1.0; maximum-scale=1.0, user-scalable=0");
  emptyHtmlDocument.getElementsByTagName('head')[0].appendChild(meta);

  var meta2 = document.createElement('meta');
  meta2.setAttribute("charset", "UTF-8");
  emptyHtmlDocument.getElementsByTagName('head')[0].appendChild(meta2);

  var meta3 = document.createElement("meta");
  meta3.setAttribute("http-equiv", "imagetoolbar");
  meta3.setAttribute("content", "no");
  emptyHtmlDocument.getElementsByTagName('head')[0].appendChild(meta3);

  var noArrowScrollingScript = document.createElement("script");
  noArrowScrollingScript.innerHTML = `window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
    }
   }, false);`;
  emptyHtmlDocument.getElementsByTagName('head')[0].appendChild(noArrowScrollingScript);

  var gameScreen = document.createElement("div");

  var gameCanvas = emptyHtmlDocument.createElement("canvas");
  Helpers.addAttributesToHTMLElement(gameCanvas, { "id": "myCanvas" });
  gameScreen.appendChild(gameCanvas);

  var noiseCanvas = emptyHtmlDocument.createElement("canvas");
  Helpers.addAttributesToHTMLElement(noiseCanvas, { "id": "noiseCanvas", "width": "900ox", height: "520px" });
  noiseCanvas.style.display = "none";
  gameScreen.appendChild(noiseCanvas);

  const mobileControls = Object.assign(
    document.createElement(`div`),
    {
      innerHTML: `
        <div id="mobileArrowControls">
          <img draggable='false' src="https://drive.google.com/uc?export=download&id=1muOTz3lpcRtNNTeM9CBVC4rPcfEJ5EsY" id="mobileArrows"/>
        </div>
        <div id="mobileButtonControls">
          <div id="mobileStartSelect">
            <img draggable='false' src="https://drive.google.com/uc?export=download&id=1gy7JwmI6KsvP0YHfV5Nh_NoFiSj49Acf" id="selectMobileControls" style="margin-right: 8px"/>
            <img draggable='false' src="https://drive.google.com/uc?export=download&id=1gy7JwmI6KsvP0YHfV5Nh_NoFiSj49Acf" id="startMobileControls"/>
          </div>
          <div>
            <img draggable='false' src="https://drive.google.com/uc?export=download&id=1qSEy4VdASr9eUHNpNWFsCoq-6VqaOM3P" id="jumpMobileControls"style="margin-right: 8px" />
            <img draggable='false' src="https://drive.google.com/uc?export=download&id=1XoREvqEvyuNnHmUs1MHtEpOzDwfFWsf1" id="alternativeMobileControls"/>
          </div>
        </div>`
    });
  mobileControls.id = "mobileControls";
  gameScreen.appendChild(mobileControls);

  emptyHtmlDocument.body.appendChild(gameScreen);

  /*var script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = `window.onload = function () { 
      let isMobile = window.matchMedia("(any-pointer:coarse)").matches;
      if(isMobile) {
        document.getElementById("mobileControls").classList.add('mobileDesign');
      }
    }
  `;
  emptyHtmlDocument.getElementsByTagName('head')[0].appendChild(script);*/

  const fontStylesheet = document.createElement("link");
  fontStylesheet.rel = "stylesheet";
  fontStylesheet.href = "https://fonts.googleapis.com/css?family=DotGothic16";
  emptyHtmlDocument.head.append(fontStylesheet);
  var spriteCanvas = emptyHtmlDocument.createElement("canvas");
  const currentSpriteCanvas = document.getElementById("sprites");
  Helpers.addAttributesToHTMLElement(spriteCanvas, {
    "id": "sprites",
    "width": currentSpriteCanvas.width, "height": currentSpriteCanvas.height, "style": "position: absolute; top: -4000px; left: -400px;"
  });
  emptyHtmlDocument.body.appendChild(spriteCanvas);
  return emptyHtmlDocument;
}

function download(filename, text) {
  var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  if(checkIfSoundEmptyOrExternal(SoundHandler.song.src)) {
    const fileName = `${filename}.html`;
    saveAs(blob, fileName);
  }
  else {
    var zip = new JSZip();
    zip.file("index.html", blob);
    zip.generateAsync({ type: "blob" })
      .then(function (zipContent) {
        saveAs(zipContent, `${filename}.zip`);
      });
  }
}

function checkIfSoundEmptyOrExternal(url) {
  if(!url) {
    return true;
  }
  if(url && (url.startsWith('https:') || url.startsWith('http') || url.startsWith('www'))) {
    return true;
  }
  return false;
}

function bundleAllScripts() {
  var scriptTexts = '';
  const unNeededScripts = ['ImportExport', 'WorldColorHandler', 'DrawHelpers', 'BuildMode', 'CustomSpritesElementsRenderer',
    'LevelNavigationHandler', 'TabNavigation', 'TabPagination', 'DrawSectionHandler', 'helpers', 'ObjectsTooltipElementsRenderer',
    'huebee.min', 'jszip.min', 'ProTipHandler', 'TooltipHandler', 'LevelSizeHandler', 'MusicHandler', 'EffectHtmlRenderer', 'PathBuildHandler', 'FileSaver'];

  const scripts = document.getElementsByTagName("script");
  for (var i = 0; i < scripts.length; i++) {
    script_text = scripts[i].text;
    if (script_text.trim() !== "") {
      // local script text
      scriptTexts += script_text;

    }
    else {
      // external script
      //cut fileName from path
      const fileName = scripts[i].src.split('\\').pop().split('/').pop().replace('.js', '');
      if (!unNeededScripts.includes(fileName)) {
        const classContent = eval(`${fileName}`);
        scriptTexts += classContent.toString();
      }
    }
  }
  return scriptTexts;
}