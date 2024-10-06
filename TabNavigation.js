class TabNavigation {

  static staticConstructor(spriteCanvas) {
    this.spriteCanvas = spriteCanvas;
    this.selectableSpritesCanvas = document.getElementById('buildSpritesCanvas');
    this.createNewSpriteButton = document.getElementById('createNewSpriteButton');
    this.canvasWrapper = document.getElementById('buildSpritesCanvasWrapper');
    this.selectableCanvasWidth = this.selectableSpritesCanvas.width;
    this.selectableCanvasHeight = this.selectableSpritesCanvas.height;
    this.selectableSpritesCtx = this.selectableSpritesCanvas.getContext('2d');
    this.selectableSprites = null;
    this.currentSelectedTab = SpritePixelArrays.SPRITE_TYPES.tile;
    this.breakLineAtElement = 3;
    this.margin = 24;
    this.padding = 8;
    this.maxSpritesPerTab = 18;
    this.changeTab(null, SpritePixelArrays.SPRITE_TYPES.tile);
    this.handleSelectedSprite(0, 0);
    this.colorModalSections = ["colorModalColorsSection", "colorModalTransitionSection", "colorModalEffectsSection"];
  }

  static redrawAfterAddedOrDeletedSprite() {
    this.selectableSprites = SpritePixelArrays.getCustomSprites();
    this.positionNewSpriteButton();
    this.drawDeleteIconsForCustomSprites();
  }

  static changeTab(evt, name) {
    this.currentSelectedTab = name;
    this.redrawCustomTabIcons();
    TabPagination.changePaginationVisibility(this.currentSelectedTab);
    evt && this.changeActiveTabStyle(evt);
    this.drawSpritesByType();
    document.getElementById("spritesTitle").innerHTML = name;
  }

  static redrawCustomTabIcons() {
    if (this.currentSelectedTab === SpritePixelArrays.customType) {
      this.redrawAfterAddedOrDeletedSprite();
      this.drawDeleteIconsForCustomSprites();
    }
    else {
      this.removeOldDeleteIcons();
      this.selectableSprites = SpritePixelArrays.getSpritesByType(this.currentSelectedTab).filter(sprite => !sprite.custom)
      this.createNewSpriteButton.style.display = "none";
    }
  }

  static getPositionForSingleSprite(index) {
    const { tileSize } = WorldDataHandler;
    const indexRelativeToPage = index - TabPagination.getPageOffset();
    const x = this.margin + indexRelativeToPage % this.breakLineAtElement * (tileSize + this.margin);
    const yLine = Math.floor((indexRelativeToPage) / this.breakLineAtElement);
    const y = this.margin + yLine * (tileSize + this.margin);
    return { x: x, y: y };
  }


  static removeOldDeleteIcons() {
    TabNavigation?.selectableSprites?.forEach((_, index) => {
      Helpers.removeHtmlElement("removeCustomSprite" + index);
    });
  }

  static drawDeleteIconsForCustomSprites() {
    if (this.currentSelectedTab === SpritePixelArrays.customType) {
      this.removeOldDeleteIcons();
      const { startIndex, endIndex } = this.getStartAndEndIndexPerPage();

      for (var index = startIndex; index < endIndex; index++) {
        const { x, y } = TabNavigation.getPositionForSingleSprite(index);
        const deleteImgWrapper = CustomSpritesElementsRenderer.createRemoveCustomSpriteIcon(x, y, index)
        deleteImgWrapper.onclick = (event) => {
          const id = parseInt(event.target.id.replace("removeCustomSprite", ""));
          CustomSpriteHandler.showDeleteModal(id);
        };
        this.canvasWrapper.appendChild(deleteImgWrapper);
      }
    }
  }

  static positionNewSpriteButton() {
    const customSprites = SpritePixelArrays.getCustomSprites();
    const customSpritesAmount = customSprites.length;
    const { startIndex, endIndex } = this.getStartAndEndIndexPerPage();
    //If whole page is filled with custom items
    if (startIndex % this.maxSpritesPerTab === 0 && endIndex % this.maxSpritesPerTab === 0
      && !(startIndex === endIndex)) {
      this.createNewSpriteButton.style.display = "none";
    }
    else if(this.currentSelectedTab === 'custom'){
      const { x, y } = this.getPositionForSingleSprite(customSpritesAmount);
      this.createNewSpriteButton.style.display = "block";
      this.createNewSpriteButton.style.left = `${x}px`;
      this.createNewSpriteButton.style.top = `${y}px`;
    }
  }

  static getStartAndEndIndexPerPage() {
    const currentPage = TabPagination.currentPages[this.currentSelectedTab];
    const startIndex = (currentPage - 1) * this.maxSpritesPerTab;
    const endIndex = currentPage * this.maxSpritesPerTab < this.selectableSprites.length
      ? currentPage * this.maxSpritesPerTab : this.selectableSprites.length;
    return { startIndex, endIndex };
  }

  static drawSpritesByType() {
    this.selectableSpritesCtx.clearRect(0, 0, this.selectableCanvasWidth, this.selectableCanvasHeight);
    const { startIndex, endIndex } = this.getStartAndEndIndexPerPage();

    for (var index = startIndex; index < endIndex; index++) {
      const sprite = this.selectableSprites[index];
      const { tileSize } = WorldDataHandler;
      const { x, y } = this.getPositionForSingleSprite(index);
      this.selectableSpritesCtx.fillStyle = "#" + WorldColorChanger.getCurrentColor(tileMapHandler.currentLevel);
      this.selectableSpritesCtx.fillRect(x, y, tileSize + this.padding * 2, tileSize + this.padding * 2);

      const spriteIndex = SpritePixelArrays.getIndexOfSprite(sprite.descriptiveName, 0, "descriptiveName");
      const canvasYSpritePos = spriteIndex * tileSize;

      this.drawSelectableSprite(this.spriteCanvas, 0, canvasYSpritePos,
        tileSize, tileSize, x + this.padding, y + this.padding, tileSize, tileSize);
    }
  }

  static drawSelectableSprite(img, sx, sy, sw, sh, dx, dy, dw, dh) {
    this.selectableSpritesCtx.drawImage(
      img,
      Math.round(sx),
      Math.round(sy),
      sw,
      sh,
      dx,
      dy,
      dw,
      dh);
  }

  static changeActiveTabStyle(evt) {
    // Get all elements with class="tablinks" and remove the class "active"
    const tablinks = document.getElementsByClassName("tabButton");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
    }
    evt.currentTarget.classList.add("active");
  }

  static selectSprite(evt) {
    var rect = this.selectableSpritesCanvas.getBoundingClientRect();
    const { margin, breakLineAtElement } = this;
    const { tileSize } = WorldDataHandler;
    var canvasClickPosition = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
    if (canvasClickPosition.x > margin && canvasClickPosition.x < margin * 2 + breakLineAtElement * (tileSize + margin)) {
      var yLine = Math.floor((canvasClickPosition.y - margin) / (tileSize + margin));
      var x = Math.floor((canvasClickPosition.x - margin) / (tileSize + margin));

      var index = yLine * breakLineAtElement + x;
      if (index < this.selectableSprites.length) {
        this.handleSelectedSprite(index, yLine);
      }
    }
  }

  static handleSelectedSprite(index, yPos) {
    //Set current selected sprite from array
    let indexInSpriteArray = index;
    this.drawSpritesByType();
    const indexRelativeToPage = index + TabPagination.getPageOffset();
    const selectedSprite = this.selectableSprites[indexRelativeToPage];
    if (selectedSprite) {
      let extraAttributes = {};
      if (selectedSprite.custom) {
        extraAttributes.customName = selectedSprite.descriptiveName;
      }
      if (selectedSprite.type === SpritePixelArrays.SPRITE_TYPES.deko) {
        const allDekoSprites = SpritePixelArrays.getSpritesByType(SpritePixelArrays.SPRITE_TYPES.deko);
        indexInSpriteArray = allDekoSprites.findIndex((deko) => deko.descriptiveName === selectedSprite.descriptiveName);
      }
      const canvasYSpritePos = SpritePixelArrays.getIndexOfSprite(selectedSprite.descriptiveName, 0, "descriptiveName") * WorldDataHandler.tileSize;

      BuildMode.setCurrentSelectedObject({ name: selectedSprite.name, index: indexInSpriteArray, type: selectedSprite.type, extraAttributes,
        canvasYSpritePos, sprite: selectedSprite });
      DrawSectionHandler.changeSelectedSprite({ target: { value: selectedSprite.descriptiveName } }, true);
      this.markSelectedSprite(index, yPos)
    }
  }

  static markSelectedSprite(index, yPos) {
    const { margin, breakLineAtElement, padding } = this;
    const { tileSize } = WorldDataHandler;

    const markedSpriteX = margin + index % breakLineAtElement * (tileSize + margin);
    const markedSpriteY = margin + yPos * (tileSize + margin);
    this.selectableSpritesCtx.strokeStyle = 'green';
    this.selectableSpritesCtx.lineWidth = 4;
    this.selectableSpritesCtx.strokeRect(markedSpriteX, markedSpriteY, tileSize + padding * 2, tileSize + padding * 2);
  }

  static changeColorModalSectionVisibility(_, selectedSection) {
    this.colorModalSections.forEach(colorModalSection => {
      document.getElementById(colorModalSection + 'Button').classList.remove("active");
      document.getElementById(colorModalSection).style.display = 'none';
    })
    document.getElementById(selectedSection + 'Button').classList.add("active");
    document.getElementById(selectedSection).style.display = 'block';
  }
}