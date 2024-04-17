const allDataStartComment = "//allDataStart";
const allDataEndComment = "//allDataStart";

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
        /*
          Initially, set all abilitiy checkboxes to false. in case user implemented a game, where
          an ability has not been implemented yet (f.e. dash)
        */
        player["dashChecked"] = false;
        player["runChecked"] = false;
        PlayerAttributesHandler.setInitialCheckboxValue("dashChecked");
        PlayerAttributesHandler.setInitialCheckboxValue("runChecked");

        const fileContent = evt.target.result;
        const indexOfNewImporter = fileContent.indexOf(allDataStartComment);
        if (indexOfNewImporter > 0) {
          var gameData = fileContent.substring(
            indexOfNewImporter + allDataStartComment.length,
            fileContent.lastIndexOf(allDataEndComment)
          );
          gameData = gameData.replace("const allData = ", "");
          const gameDataJson = JSON.parse(gameData);
          ExportedGameInitializer.initializeExportedGame(gameDataJson);
          SoundHandlerRenderer.createSoundOverview();
        }
        else {
          legacyImporter(fileContent);
        }

        resetUIValuesInTool();
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

function resetUIValuesInTool() {
  player.setAnimationProperties();
  WorldColorChanger.changeLevelColor(1);
  document.getElementById("gamesname").value = WorldDataHandler.gamesName;
  document.getElementById("endingmessage").value = WorldDataHandler.endingMessage;
  TransitionAnimationHandler.setDurationElementValue(TransitionAnimationHandler.animationFrames);
  TransitionAnimationHandler.setTypeElementValue(TransitionAnimationHandler.animationType);
  SpritePixelArrays.fillAllSprites();
  tileMapHandler.setTileTypes();
  spriteSheetCreator.setCanvasSize();
  spriteSheetCreator.createSpriteSheet();
  DrawSectionHandler.removeOptions();
  DrawSectionHandler.fillSelectBox();
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
  PlayerAttributesHandler.sliderValues.forEach(sliderValue => {
      sliderValue !== "maxJumpFrames" && PlayerAttributesHandler.setInitialSliderValue(sliderValue);
  })
  PlayerAttributesHandler.checkBoxValues.forEach(checkBoxValue => {
    PlayerAttributesHandler.setInitialCheckboxValue(checkBoxValue);
  });
}

function createPlayerAttributesSectionForAllData() {
  const playerObject = {};
  let sliderValues = PlayerAttributesHandler.sliderValues;
  sliderValues.push("maxJumpFrames");
  sliderValues.forEach(sliderValue => {
    playerObject[sliderValue] = player[sliderValue];
  })
  PlayerAttributesHandler.checkBoxValues.forEach(checkBoxValue => {
    playerObject[checkBoxValue] = player[checkBoxValue];
  })
  return playerObject;
}

function getCustomSounds() {
  const customSounds = [];
  SoundHandler.sounds.forEach(sound => {
    if(sound?.customValue) {
      customSounds.push(sound);
    }
  });
  return customSounds;
}

function exportGame() {
  const fileAsDocObject = createHtmlDocoumentWithCanvas();
  let bundledScripts = bundleAllScripts();
  //remove everything that is marked with special comments and is not needed
  bundledScripts = bundledScripts.replaceAll(/\/\/startRemoval ([\s\S]*?) \/\/endRemoval/g, "");
  const allData = {};
  allData.levels = WorldDataHandler.levels;
  allData.gamesName = WorldDataHandler.gamesName;
  allData.endingMessage = WorldDataHandler.endingMessage;
  allData.effects = WorldDataHandler.effects;
  allData.backgroundColor = WorldDataHandler.backgroundColor;
  allData.textColor = WorldDataHandler.textColor;
  allData.animationFrames = TransitionAnimationHandler.animationFrames;
  allData.animationType = TransitionAnimationHandler.animationType;
  allData.playerObject = createPlayerAttributesSectionForAllData();
  if (SoundHandler?.song?.src) {
    allData.song = SoundHandler.song.src;
  }
  allData.sounds = getCustomSounds();
  allData.sprites = createChangedSpitesObject();
  bundledScripts = bundledScripts.replace("//putAllDataHere",
    `${allDataStartComment}
  const allData = ${JSON.stringify(allData)}
  ${allDataEndComment}`);

  var scriptTag = fileAsDocObject.createElement("script");
  scriptTag.innerHTML = bundledScripts;
  fileAsDocObject.body.appendChild(scriptTag);
  const fileAsString = fileAsDocObject.documentElement.innerHTML;
  download(`${WorldDataHandler.gamesName}`, fileAsString)
}

function createChangedSpitesObject() {
  const spriteArray = {};
  Object.keys(SpritePixelArrays).forEach(key => {
    if (SpritePixelArrays[key]?.descriptiveName && !SpritePixelArrays[key]?.custom) {
      spriteArray[key] = SpritePixelArrays[key];
    }
  })
  SpritePixelArrays.allSprites.forEach(sprite => {
    if (sprite.custom) {
      const key = sprite.descriptiveName.replace(/\s/g, '');
      spriteArray[key] = sprite;
    }
  });
  return spriteArray;
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
            height: 100%;
          }
      }`;
  let style = '<style type="text/css">' + styleSheet + "</style>";
  emptyHtmlDocument.getElementsByTagName('head')[0].innerHTML = style;

  const metaAttributes = [
    { 'name': 'viewport', 'content': "width=device-width, initial-scale=1.0; maximum-scale=1.0, user-scalable=0" },
    { 'charset': 'UTF-8' },
    { 'http-equiv': 'imagetoolbar', 'content': 'no' }
  ];
  metaAttributes.forEach(metaAttribute => {
    var meta = document.createElement('meta');
    for (const [key, value] of Object.entries(metaAttribute)) {
      meta.setAttribute(key, value);
    }
    emptyHtmlDocument.getElementsByTagName('head')[0].appendChild(meta);
  })

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

  var tileCanvas = emptyHtmlDocument.createElement("canvas");
  Helpers.addAttributesToHTMLElement(tileCanvas, { "id": "tileCanvas" });
  tileCanvas.style.display = "none";
  gameScreen.appendChild(tileCanvas);

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
  /*if (checkIfSoundEmptyOrExternal(SoundHandler.song.src)) {
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
  }*/
  const fileName = `${filename}.html`;
  saveAs(blob, fileName);
}

function checkIfSoundEmptyOrExternal(url) {
  if (!url) {
    return true;
  }
  if (url && (url.startsWith('https:') || url.startsWith('http') || url.startsWith('www'))) {
    return true;
  }
  return false;
}

function bundleAllScripts() {
  var scriptTexts = '';
  const unNeededScripts = ['ImportExport', 'LegacyImporter', 'WorldColorHandler', 'DrawHelpers', 'BuildMode', 'CustomSpritesElementsRenderer',
    'LevelNavigationHandler', 'TabNavigation', 'TabPagination', 'DrawSectionHandler', 'helpers', 'ObjectsTooltipElementsRenderer', 'HeaderNavigationHandler',
    'huebee.min', 'jszip.min', 'ProTipHandler', 'TooltipHandler', 'LevelSizeHandler', 'MusicHandler', 'EffectHtmlRenderer', 'SoundHandlerRenderer', 'PathBuildHandler', 'FileSaver'];

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