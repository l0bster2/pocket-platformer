class SpritePixelArrays {

  static staticConstructor() {

    this.pathMovementMapper = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 6,
      6: 8,
      7: 12,
    };

    this.changeableAttributeFormElements = {
      toggle: "toggle",
      checkbox: "checkbox"
    }

    this.tilesWithAnimation = [
      ObjectTypes.RED_BLUE_BLOCK_SWITCH,
      ObjectTypes.RED_BLOCK,
      ObjectTypes.BLUE_BLOCK,
      ObjectTypes.TREADMILL,
      ObjectTypes.ICE_BLOCK,
    ];

    this.changeableAttributeTypes = {
      frequency: "frequency",
      speed: "speed",
      dialogue: "dialogue",
      stopFrames: "stopFrames",
      movementDirection: "movementDirection",
      rotationSpeed: "rotationSpeed",
      collectiblesNeeded: "collectiblesNeeded",
      laserDuration: "laserDuration",
      pauseDuration: "pauseDuration",
      collidesWithWalls: "collidesWithWalls",
    };

    this.backgroundSprites = [
      ObjectTypes.WATER,
    ];

    this.foregroundSprites = [
      ObjectTypes.DISAPPEARING_FOREGROUND_TILE,
    ];

    this.customType = "custom";

    this.TILE_1 = {
      name: 1,
      descriptiveName: "Left top",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00"],
            ["00AA00", "005500", "005500", "005500", "005500", "005500", "005500", "005500"],
            ["AAFF55", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["00AA00", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["AAFF55", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["00AA00", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["AAFF55", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["00AA00", "005500", "c26241", "c26241", "e1a45b", "e1a45b", "e1a45b", "e1a45b"],
          ]
      }
      ]
    };

    this.TILE_2 = {
      name: 2,
      descriptiveName: "Middle top",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00"],
            ["005500", "005500", "005500", "005500", "005500", "005500", "005500", "005500"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["c26241", "c26241", "c26241", "c26241", "e1a45b", "e1a45b", "e1a45b", "e1a45b"],
          ]
      }
      ]
    };

    this.TILE_3 = {
      name: 3,
      descriptiveName: "Right top",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00"],
            ["005500", "005500", "005500", "005500", "005500", "005500", "005500", "AAFF55"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "00AA00"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "AAFF55"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "00AA00"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "AAFF55"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "00AA00"],
            ["c26241", "c26241", "c26241", "c26241", "e1a45b", "e1a45b", "005500", "AAFF55"],
          ]
      }
      ]
    };

    this.TILE_4 = {
      name: 4,
      descriptiveName: "Left",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["AAFF55", "005500", "fbe7cf", "fbe7cf", "eeb39e", "eeb39e", "eeb39e", "eeb39e"],
            ["00AA00", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["AAFF55", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["00AA00", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["AAFF55", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["00AA00", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["AAFF55", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["00AA00", "005500", "c26241", "c26241", "e1a45b", "e1a45b", "e1a45b", "e1a45b"],
          ]
      }
      ]
    };

    this.TILE_6 = {
      name: 6,
      descriptiveName: "Middle",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["fbe7cf", "fbe7cf", "fbe7cf", "fbe7cf", "eeb39e", "eeb39e", "eeb39e", "eeb39e"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["c26241", "c26241", "c26241", "c26241", "e1a45b", "e1a45b", "e1a45b", "e1a45b"],
          ]
      }
      ]
    };

    this.TILE_7 = {
      name: 7,
      descriptiveName: "Right",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["fbe7cf", "fbe7cf", "fbe7cf", "fbe7cf", "eeb39e", "eeb39e", "005500", "00AA00"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "AAFF55"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "00AA00"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "AAFF55"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "00AA00"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "AAFF55"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "00AA00"],
            ["c26241", "c26241", "c26241", "c26241", "e1a45b", "e1a45b", "005500", "AAFF55"],
          ]
      }
      ]
    };

    this.TILE_8 = {
      name: 8,
      descriptiveName: "Left bottom",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["AAFF55", "005500", "fbe7cf", "fbe7cf", "eeb39e", "eeb39e", "eeb39e", "eeb39e"],
            ["00AA00", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["AAFF55", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["00AA00", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["AAFF55", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["00AA00", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["AAFF55", "005500", "005500", "005500", "005500", "005500", "005500", "005500"],
            ["00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55"],
          ]
      }
      ]
    };


    this.TILE_9 = {
      name: 9,
      descriptiveName: "Middle bottom",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["fbe7cf", "fbe7cf", "fbe7cf", "fbe7cf", "eeb39e", "eeb39e", "eeb39e", "eeb39e"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["005500", "005500", "005500", "005500", "005500", "005500", "005500", "005500"],
            ["00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55"],
          ]
      }
      ]
    };

    this.TILE_10 = {
      name: 10,
      descriptiveName: "Right bottom",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["fbe7cf", "fbe7cf", "fbe7cf", "fbe7cf", "eeb39e", "eeb39e", "005500", "00AA00"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "AAFF55"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "00AA00"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "AAFF55"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "00AA00"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "AAFF55"],
            ["005500", "005500", "005500", "005500", "005500", "005500", "005500", "00AA00"],
            ["00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55"],
          ]
      }
      ]
    };

    this.TILE_11 = {
      name: 15,
      descriptiveName: "Top and bottom",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00"],
            ["005500", "005500", "005500", "005500", "005500", "005500", "005500", "005500"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["005500", "005500", "005500", "005500", "005500", "005500", "005500", "005500"],
            ["AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00"],
          ]
      }
      ]
    };

    this.TILE_12 = {
      name: 16,
      descriptiveName: "Left and right",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["AAFF55", "005500", "fbe7cf", "fbe7cf", "eeb39e", "eeb39e", "005500", "AAFF55"],
            ["00AA00", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "00AA00"],
            ["AAFF55", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "AAFF55"],
            ["00AA00", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "00AA00"],
            ["AAFF55", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "AAFF55"],
            ["00AA00", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "00AA00"],
            ["AAFF55", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "AAFF55"],
            ["00AA00", "005500", "c26241", "c26241", "e1a45b", "e1a45b", "005500", "00AA00"],
          ]
      }
      ]
    };

    this.TILE_13 = {
      name: 17,
      descriptiveName: "All sides",
      description: "Just a solid block. <br/><br/> Hold CTRL in game screen to draw bigger areas.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00"],
            ["00AA00", "005500", "005500", "005500", "005500", "005500", "005500", "AAFF55"],
            ["AAFF55", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "00AA00"],
            ["00AA00", "005500", "f6c992", "f6c992", "ee8764", "ee8764", "005500", "AAFF55"],
            ["AAFF55", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "00AA00"],
            ["00AA00", "005500", "ee8764", "ee8764", "f6c992", "f6c992", "005500", "AAFF55"],
            ["AAFF55", "005500", "005500", "005500", "005500", "005500", "005500", "00AA00"],
            ["00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55", "00AA00", "AAFF55"],
          ]
      }
      ]
    };

    this.TILE_5 = {
      name: 5,
      descriptiveName: "One way block",
      description: "The player can jump through it, but will land on it when he falls",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["transp", "e97977", "e97977", "transp", "transp", "e97977", "e97977", "transp"],
            ["d55c5a", "d55c5a", "d55c5a", "e97977", "d55c5a", "d55c5a", "d55c5a", "e97977"],
            ["ba3d3b", "d55c5a", "d55c5a", "e97977", "ba3d3b", "d55c5a", "d55c5a", "e97977"],
            ["transp", "ba3d3b", "ba3d3b", "transp", "transp", "ba3d3b", "ba3d3b", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.TILE_edge = {
      name: "edge",
      descriptiveName: "Edge block",
      description: "Will display on the edge of the game screen",
      animation: [{
        sprite:
          [
            ["b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4"],
            ["6c686c", "b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4", "6c686c"],
            ["6c686c", "6c686c", "b3a1b4", "b3a1b4", "b3a1b4", "b3a1b4", "6c686c", "6c686c"],
            ["6c686c", "6c686c", "6c686c", "b3a1b4", "b3a1b4", "6c686c", "6c686c", "6c686c"],
            ["6c686c", "6c686c", "6c686c", "524f52", "524f52", "6c686c", "6c686c", "6c686c"],
            ["6c686c", "6c686c", "524f52", "524f52", "524f52", "524f52", "6c686c", "6c686c"],
            ["6c686c", "524f52", "524f52", "524f52", "524f52", "524f52", "524f52", "6c686c"],
            ["524f52", "524f52", "524f52", "524f52", "524f52", "524f52", "524f52", "524f52"],
          ]
      }
      ]
    };

    this.PLAYER_IDLE_SPRITE = {
      name: ObjectTypes.PLAYER_IDLE,
      descriptiveName: "Player idle",
      description: "The player sprite that is shown when you are not moving.",
      directions: [AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.left],
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "4080BF", "4080BF", "4080BF", "4080BF", "transp", "transp"],
            ["transp", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF"],
            ["transp", "transp", "EABFBF", "FFFFFF", "80552B", "EABFBF", "80552B", "transp"],
            ["transp", "transp", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "transp"],
            ["transp", "transp", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "transp", "transp"],
            ["transp", "f2cbc9", "transp", "d55c5a", "d55c5a", "transp", "f2cbc9", "transp"],
            ["transp", "transp", "BF8040", "transp", "transp", "BF8040", "transp", "transp"],
          ]
      }
      ]
    };

    this.PLAYER_JUMP_SPRITE = {
      name: ObjectTypes.PLAYER_JUMP,
      descriptiveName: "Player jump",
      description: "The player sprite that is shown when you are jumping.<br/>" +
        "<span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'SFX 1'} }, true)\">Jump SFX</span> will be displayed underneath.",
      squishAble: true,
      directions: [AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.left],
      animation: [{
        sprite:
          [
            ["transp", "transp", "4080BF", "4080BF", "4080BF", "4080BF", "transp", "4080BF"],
            ["transp", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "transp"],
            ["transp", "transp", "EABFBF", "FFFFFF", "80552B", "EABFBF", "80552B", "transp"],
            ["transp", "transp", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "transp"],
            ["transp", "EABFBF", "BF4040", "BF4040", "BF4040", "BF4040", "EABFBF", "transp"],
            ["transp", "transp", "transp", "BF4040", "BF4040", "FFAA55", "transp", "transp"],
            ["transp", "transp", "FFAA55", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.PLAYER_WALL_JUMP_SPRITE = {
      name: ObjectTypes.PLAYER_WALL_JUMP,
      descriptiveName: "Player wall jump",
      description: "The player sprite that is shown when you are jumping.",
      squishAble: false,
      hiddenEverywhere: true,
      directions: [AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.left],
      animation: [{
        sprite:
          [
            ["transp", "transp", "4080BF", "4080BF", "4080BF", "4080BF", "transp", "4080BF"],
            ["transp", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "transp"],
            ["transp", "transp", "EABFBF", "FFFFFF", "80552B", "EABFBF", "80552B", "transp"],
            ["transp", "transp", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "transp"],
            ["transp", "EABFBF", "BF4040", "BF4040", "BF4040", "BF4040", "EABFBF", "transp"],
            ["transp", "transp", "transp", "BF4040", "BF4040", "FFAA55", "transp", "transp"],
            ["transp", "transp", "FFAA55", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.PLAYER_WALK_SPRITE = {
      name: ObjectTypes.PLAYER_WALK,
      descriptiveName: "Player walk",
      description: "The player sprite that is shown when you are running.",
      directions: [AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.left],
      animation: [{
        sprite:
          [
            ["transp", "transp", "4080BF", "4080BF", "4080BF", "4080BF", "transp", "transp"],
            ["transp", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF"],
            ["transp", "transp", "EABFBF", "FFFFFF", "80552B", "EABFBF", "80552B", "transp"],
            ["transp", "transp", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "transp"],
            ["transp", "transp", "BF4040", "BF4040", "BF4040", "BF4040", "EABFBF", "transp"],
            ["transp", "EABFBF", "BF4040", "BF4040", "BF4040", "BF8040", "transp", "transp"],
            ["transp", "transp", "BF8040", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "4080BF", "4080BF", "4080BF", "4080BF", "transp", "transp"],
            ["transp", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF", "4080BF"],
            ["transp", "transp", "EABFBF", "FFFFFF", "80552B", "EABFBF", "80552B", "transp"],
            ["transp", "transp", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "EABFBF", "transp"],
            ["transp", "transp", "BF4040", "BF4040", "BF4040", "BF4040", "transp", "transp"],
            ["transp", "EABFBF", "BF8040", "BF4040", "BF4040", "transp", "EABFBF", "transp"],
            ["transp", "transp", "transp", "transp", "BF8040", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.START_FLAG_SPRITE = {
      name: ObjectTypes.START_FLAG,
      descriptiveName: "Start flag",
      description: "The starting point of a level. You also respawn here, if you die. <br/> If you create multiple start-flags, for non-linear games, you can click on a set start flag again, to declare it as the default start of a level.",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["fdfdfd", "d55c5a", "d55c5a", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "transp", "transp", "transp"],
            ["fdfdfd", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "transp"],
            ["fdfdfd", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "transp", "transp", "transp"],
            ["fdfdfd", "d55c5a", "d55c5a", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.CHECKPOINT_FLAG = {
      name: ObjectTypes.CHECKPOINT,
      descriptiveName: "Checkpoint",
      description: "If the player touches the checkpoint, he will respawn here after a death. If there are multiple checkpoints, the latest one the player touched will become the respawn point.",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["fdfdfd", "E3E300", "E3E300", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "E3E300", "E3E300", "E3E300", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "E3E300", "E3E300", "E3E300", "E3E300", "transp", "transp", "transp"],
            ["fdfdfd", "E3E300", "E3E300", "E3E300", "E3E300", "E3E300", "transp", "transp"],
            ["fdfdfd", "E3E300", "E3E300", "E3E300", "E3E300", "E3E300", "E3E300", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["fdfdfd", "E3E300", "E3E300", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "E3E300", "E3E300", "E3E300", "E3E300", "transp", "transp", "transp"],
            ["fdfdfd", "E3E300", "E3E300", "E3E300", "E3E300", "E3E300", "E3E300", "transp"],
            ["fdfdfd", "E3E300", "E3E300", "E3E300", "E3E300", "transp", "transp", "transp"],
            ["fdfdfd", "E3E300", "E3E300", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.FINISH_FLAG_SPRITE = {
      name: ObjectTypes.FINISH_FLAG,
      descriptiveName: "Finish flag",
      changeableAttributes: [
        { name: this.changeableAttributeTypes.collectiblesNeeded, defaultValue: false },
      ],
      description: "The goal of a level. If you touch it, by default you continue to the next level. If you want to specify a custom exit to a different level, click on a set finish flag again. <br/>" +
        "<span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Finish flag closed'} }, true)\">Closed finish flag sprite</span>",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["fdfdfd", "208220", "208220", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "208220", "208220", "208220", "208220", "transp", "transp", "transp"],
            ["fdfdfd", "208220", "208220", "208220", "208220", "208220", "208220", "transp"],
            ["fdfdfd", "208220", "208220", "208220", "208220", "transp", "transp", "transp"],
            ["fdfdfd", "208220", "208220", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.FINISH_FLAG_CLOSED_SPRITE = {
      name: ObjectTypes.FINISH_FLAG_CLOSED,
      descriptiveName: "Finish flag closed",
      description: "This sprite will be displayed if the player needs to collect collectibles to access the <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Finish flag'} }, true)\">Finish flag</span> (Can be configured by clicking on a set finish flag in the game screen).",
      hiddenSprite: true,
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["fdfdfd", "8E8E8E", "8E8E8E", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "8E8E8E", "8E8E8E", "8E8E8E", "8E8E8E", "transp", "transp", "transp"],
            ["fdfdfd", "8E8E8E", "8E8E8E", "8E8E8E", "8E8E8E", "8E8E8E", "8E8E8E", "transp"],
            ["fdfdfd", "8E8E8E", "8E8E8E", "8E8E8E", "8E8E8E", "transp", "transp", "transp"],
            ["fdfdfd", "8E8E8E", "8E8E8E", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["fdfdfd", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.SPIKE_SPRITE = {
      name: ObjectTypes.SPIKE,
      descriptiveName: "Spike",
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      description: "A spike. If you touch it, you die",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "b3a1b4", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "b3a1b4", "b3a1b4", "transp", "transp", "transp"],
            ["transp", "transp", "b3a1b4", "6c686c", "6c686c", "b3a1b4", "transp", "transp"],
            ["b3a1b4", "b3a1b4", "6c686c", "524f52", "FFFFFF", "6c686c", "b3a1b4", "transp"],
            ["transp", "b3a1b4", "6c686c", "524f52", "524f52", "6c686c", "b3a1b4", "b3a1b4"],
            ["transp", "transp", "b3a1b4", "6c686c", "6c686c", "b3a1b4", "transp", "transp"],
            ["transp", "transp", "transp", "b3a1b4", "b3a1b4", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "b3a1b4", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.TRAMPOLINE_SRPITE = {
      name: ObjectTypes.TRAMPOLINE,
      descriptiveName: "Trampoline",
      description: "A trampoline. You will jump approximately twice as high when you land on it.",
      animNotEditale: true,
      squishAble: false,
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["e97977", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "e97977"],
            ["e97977", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "e97977"],
            ["transp", "transp", "6c686c", "6c686c", "b3a1b4", "fdfdfd", "transp", "transp"],
            ["transp", "transp", "524f52", "524f52", "524f52", "524f52", "transp", "transp"],
            ["transp", "transp", "6c686c", "6c686c", "b3a1b4", "fdfdfd", "transp", "transp"],
            ["transp", "transp", "524f52", "524f52", "524f52", "524f52", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["e97977", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "e97977"],
            ["e97977", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "d55c5a", "e97977"],
            ["transp", "transp", "6c686c", "6c686c", "b3a1b4", "fdfdfd", "transp", "transp"],
            ["transp", "transp", "524f52", "524f52", "524f52", "524f52", "transp", "transp"],
            ["transp", "transp", "6c686c", "6c686c", "b3a1b4", "fdfdfd", "transp", "transp"],
            ["transp", "transp", "524f52", "524f52", "524f52", "524f52", "transp", "transp"],
            ["transp", "transp", "6c686c", "6c686c", "b3a1b4", "fdfdfd", "transp", "transp"],
            ["transp", "transp", "524f52", "524f52", "524f52", "524f52", "transp", "transp"],
          ]
      }
      ]
    };

    this.CANON_SPRITE = {
      name: ObjectTypes.CANON,
      changeableAttributes: [
        { name: this.changeableAttributeTypes.speed, defaultValue: 3, minValue: 1, maxValue: 10 },
        { name: this.changeableAttributeTypes.frequency, defaultValue: 3, minValue: 1, maxValue: 8 },
        { name: this.changeableAttributeTypes.collidesWithWalls, defaultValue: true, 
          formElement: this.changeableAttributeFormElements.checkbox, checkboxDescription: "Cannonball collides with walls" }
      ],
      descriptiveName: "Cannon",
      description: "A cannon. It shoots <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Cannon ball'} }, true)\">cannonballs</span> at certain time intervals. Click on it after placing it again, to change the attributes of the individual cannon.",
      type: this.SPRITE_TYPES.object,
      squishAble: false,
      directions: [AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.bottom],
      animation: [{
        sprite:
          [
            ["FFFFFF", "transp", "transp", "transp", "FFFFFF", "FFFFFF", "FFFFFF", "transp"],
            ["FFFFFF", "FFFFFF", "transp", "FFFFFF", "000000", "000000", "000000", "FFFFFF"],
            ["FFFFFF", "000000", "FFFFFF", "000000", "000000", "000000", "000000", "FFFFFF"],
            ["FFFFFF", "000000", "000000", "000000", "000000", "000000", "000000", "FFFFFF"],
            ["FFFFFF", "000000", "000000", "000000", "000000", "000000", "000000", "FFFFFF"],
            ["FFFFFF", "000000", "FFFFFF", "000000", "000000", "000000", "000000", "FFFFFF"],
            ["FFFFFF", "FFFFFF", "transp", "FFFFFF", "000000", "000000", "000000", "FFFFFF"],
            ["FFFFFF", "transp", "transp", "transp", "FFFFFF", "FFFFFF", "FFFFFF", "transp"],
          ]
      }
      ]
    };

    this.STOMPER = {
      name: ObjectTypes.STOMPER,
      type: this.SPRITE_TYPES.object,
      descriptiveName: "Stomper",
      squishAble: false,
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      description: "A deadly hazard, that will fly torwards the player, if he is in it's way and move back to it's initial place once it hits a solid block. Can be rotated by clicking on a placed object again.",
      animation: [{
        sprite:
          [
            ['AAAAAA', 'AAAAAA', 'transp', 'AAAAAA', 'AAAAAA', 'transp', 'AAAAAA', 'AAAAAA'],
            ['AAAAAA', '717171', 'transp', '717171', '717171', 'transp', '717171', 'AAAAAA'],
            ['transp', 'transp', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'transp', 'transp'],
            ['AAAAAA', '717171', 'FFFFFF', 'AAAAAA', 'AAAAAA', 'FFFFFF', '717171', 'AAAAAA'],
            ['AAAAAA', '717171', 'FF1C1C', 'AAAAAA', 'AAAAAA', 'FF1C1C', '717171', 'AAAAAA'],
            ['transp', 'transp', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'transp', 'transp'],
            ['AAAAAA', '717171', 'transp', '717171', '717171', 'transp', '717171', 'AAAAAA'],
            ['AAAAAA', 'AAAAAA', 'transp', 'AAAAAA', 'AAAAAA', 'transp', 'AAAAAA', 'AAAAAA']

          ]
      }
      ]
    };

    this.TOGGLE_MINE = {
      name: ObjectTypes.TOGGLE_MINE,
      type: this.SPRITE_TYPES.object,
      descriptiveName: "Toggle mine",
      description: "An object that is harmless at first, but once you step in and out of it, it becomes deadly.",
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'C6C6C6', 'C6C6C6', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'C6C6C6', 'transp', 'transp', 'C6C6C6', 'transp', 'transp'],
            ['transp', 'C6C6C6', 'transp', 'transp', 'transp', 'transp', 'C6C6C6', 'transp'],
            ['transp', 'C6C6C6', 'transp', 'transp', 'transp', 'transp', 'C6C6C6', 'transp'],
            ['transp', 'transp', 'C6C6C6', 'transp', 'transp', 'C6C6C6', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'C6C6C6', 'C6C6C6', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ]
      },
      {
        sprite:
          [
            ['transp', 'transp', 'transp', 'FF1C1C', 'FF1C1C', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'FF1C1C', 'transp', 'transp', 'FF1C1C', 'transp', 'transp'],
            ['transp', 'FF1C1C', 'transp', 'transp', 'transp', 'transp', 'FF1C1C', 'transp'],
            ['FF1C1C', 'transp', 'FFFFFF', 'transp', 'transp', 'FFFFFF', 'transp', 'FF1C1C'],
            ['FF1C1C', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'FF1C1C'],
            ['transp', 'FF1C1C', 'transp', 'transp', 'transp', 'transp', 'FF1C1C', 'transp'],
            ['transp', 'transp', 'FF1C1C', 'transp', 'transp', 'FF1C1C', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FF1C1C', 'FF1C1C', 'transp', 'transp', 'transp'],
          ]
      }
      ]
    };

    this.DISAPPEARING_BLOCK_SPRITE = {
      name: ObjectTypes.DISAPPEARING_BLOCK,
      descriptiveName: "Disappearing block",
      description: "A block that will disappear upon touching it. It will reappear after a certain time.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["804c51", "9c6853", "f6c992", "f6c992", "9c6853", "804c51", "804c51", "804c51"],
            ["9c6853", "f6c992", "f6c992", "f6c992", "f6c992", "804c51", "f6c992", "9c6853"],
            ["f6c992", "f6c992", "f6c992", "f6c992", "9c6853", "804c51", "9c6853", "9c6853"],
            ["9c6853", "f6c992", "f6c992", "9c6853", "9c6853", "804c51", "804c51", "804c51"],
            ["9c6853", "9c6853", "9c6853", "9c6853", "804c51", "9c6853", "f6c992", "9c6853"],
            ["804c51", "9c6853", "9c6853", "804c51", "9c6853", "f6c992", "f6c992", "9c6853"],
            ["804c51", "804c51", "804c51", "804c51", "9c6853", "9c6853", "9c6853", "804c51"],
            ["804c51", "9c6853", "9c6853", "804c51", "804c51", "804c51", "804c51", "804c51"],
          ]
      }
      ]
    };

    this.WATER = {
      name: ObjectTypes.WATER,
      descriptiveName: "Water",
      description: "A passable block that slows down gravity and let's you jump infinitely inside it. Every object can be placed on it.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "C6E3FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "C6E3FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
          ]
      },
      {
        sprite:
          [
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "C6E3FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "C6E3FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
            ["8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF"],
          ]
      }
      ]
    };

    this.RED_BLOCK = {
      name: ObjectTypes.RED_BLOCK,
      descriptiveName: "Red block",
      description: "There are red blocks and blue blocks. Only one them can be active at a time. By touching the switch (in the objects tab), the active tiles can be switched.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["FF8E8E", "FF8E8E", "FF8E8E", "FF8E8E", "FF8E8E", "FF8E8E", "FF8E8E", "FF8E8E"],
            ["FF8E8E", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "AA0000"],
            ["FF8E8E", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "AA0000"],
            ["FF8E8E", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "AA0000"],
            ["FF8E8E", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "AA0000"],
            ["FF8E8E", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "AA0000"],
            ["FF8E8E", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "FF1C1C", "AA0000"],
            ["FF8E8E", "AA0000", "AA0000", "AA0000", "AA0000", "AA0000", "AA0000", "AA0000"],
          ]
      },
      {
        sprite:
          [
            ["FF1C1C", "FF1C1C", "transp", "FF1C1C", "FF1C1C", "transp", "FF1C1C", "FF1C1C"],
            ["FF1C1C", "transp", "transp", "transp", "transp", "transp", "transp", "FF1C1C"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["FF1C1C", "transp", "transp", "transp", "transp", "transp", "transp", "FF1C1C"],
            ["FF1C1C", "transp", "transp", "transp", "transp", "transp", "transp", "FF1C1C"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["FF1C1C", "transp", "transp", "transp", "transp", "transp", "transp", "FF1C1C"],
            ["FF1C1C", "FF1C1C", "transp", "FF1C1C", "FF1C1C", "transp", "FF1C1C", "FF1C1C"],
          ]
      }
      ]
    };

    this.BLUE_BLOCK = {
      name: ObjectTypes.BLUE_BLOCK,
      descriptiveName: "Blue block",
      description: "There are red blocks and blue blocks. Only one them can be active at a time. By touching the switch (in the objects tab), the active tiles can be switched.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["8E8EFF", "8E8EFF", "8E8EFF", "8E8EFF", "8E8EFF", "8E8EFF", "8E8EFF", "8E8EFF"],
            ["8E8EFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "0000AA"],
            ["8E8EFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "0000AA"],
            ["8E8EFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "0000AA"],
            ["8E8EFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "0000AA"],
            ["8E8EFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "0000AA"],
            ["8E8EFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "1C1CFF", "0000AA"],
            ["8E8EFF", "0000AA", "0000AA", "0000AA", "0000AA", "0000AA", "0000AA", "0000AA"],
          ]
      },
      {
        sprite:
          [
            ["1C1CFF", "1C1CFF", "transp", "1C1CFF", "1C1CFF", "transp", "1C1CFF", "1C1CFF"],
            ["1C1CFF", "transp", "transp", "transp", "transp", "transp", "transp", "1C1CFF"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["1C1CFF", "transp", "transp", "transp", "transp", "transp", "transp", "1C1CFF"],
            ["1C1CFF", "transp", "transp", "transp", "transp", "transp", "transp", "1C1CFF"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["1C1CFF", "transp", "transp", "transp", "transp", "transp", "transp", "1C1CFF"],
            ["1C1CFF", "1C1CFF", "transp", "1C1CFF", "1C1CFF", "transp", "1C1CFF", "1C1CFF"],
          ]
      }
      ]
    };

    this.RED_BLUE_BLOCK_SWITCH = {
      name: ObjectTypes.RED_BLUE_BLOCK_SWITCH,
      descriptiveName: "Red/blue switch",
      description: "A switch for red/blue tiles. Can be activated by hitting it with your head, or if a stomper/cannon-ball/rocket hits it.",
      type: this.SPRITE_TYPES.tile,
      squishAble: false,
      animNotEditale: true,
      animation: [{
        sprite:
          [
            ['FF8E8E', 'FF8E8E', 'FF8E8E', 'FF8E8E', 'FF8E8E', 'FF8E8E', 'FF8E8E', 'FF8E8E'],
            ['FF8E8E', 'FF1C1C', 'FF1C1C', 'FF1C1C', 'FF1C1C', 'FF1C1C', 'FF1C1C', 'AA0000'],
            ['FF8E8E', 'FF1C1C', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FF1C1C', 'FF1C1C', 'AA0000'],
            ['FF8E8E', 'FF1C1C', 'FFFFFF', 'FF1C1C', 'FF1C1C', 'FFFFFF', 'FF1C1C', 'AA0000'],
            ['FF8E8E', 'FF1C1C', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FF1C1C', 'FF1C1C', 'AA0000'],
            ['FF8E8E', 'FF1C1C', 'FFFFFF', 'FF1C1C', 'FF1C1C', 'FFFFFF', 'FF1C1C', 'AA0000'],
            ['FF8E8E', 'FF1C1C', 'FF1C1C', 'FF1C1C', 'FF1C1C', 'FF1C1C', 'FF1C1C', 'AA0000'],
            ['FF8E8E', 'AA0000', 'AA0000', 'AA0000', 'AA0000', 'AA0000', 'AA0000', 'AA0000']

          ]
      },
      {
        sprite:
          [
            ['8E8EFF', '8E8EFF', '8E8EFF', '8E8EFF', '8E8EFF', '8E8EFF', '8E8EFF', '8E8EFF'],
            ['8E8EFF', '1C1CFF', '1C1CFF', '1C1CFF', '1C1CFF', '1C1CFF', '1C1CFF', '0000AA'],
            ['8E8EFF', '1C1CFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', '1C1CFF', '0000AA'],
            ['8E8EFF', '1C1CFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', '1C1CFF', '1C1CFF', '0000AA'],
            ['8E8EFF', '1C1CFF', 'FFFFFF', '1C1CFF', '1C1CFF', 'FFFFFF', '1C1CFF', '0000AA'],
            ['8E8EFF', '1C1CFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', '1C1CFF', '1C1CFF', '0000AA'],
            ['8E8EFF', '1C1CFF', '1C1CFF', '1C1CFF', '1C1CFF', '1C1CFF', '1C1CFF', '0000AA'],
            ['8E8EFF', '0000AA', '0000AA', '0000AA', '0000AA', '0000AA', '0000AA', '0000AA']
          ]
      }
      ]
    };

    this.TREADMILL = {
      name: ObjectTypes.TREADMILL,
      descriptiveName: "Treadmill",
      description: "It will move the player in a certain direction when he stands on it. Click on a set treadmill again to change it's direction. (Or press shift before placing it)",
      type: this.SPRITE_TYPES.tile,
      directions: [AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.left],
      animation: [{
        sprite:
          [
            ["8E8E8E", "8E8E8E", "8E8E8E", "AAAAAA", "AAAAAA", "AAAAAA", "8E8E8E", "8E8E8E"],
            ["AAAAAA", "393939", "393939", "555555", "555555", "393939", "393939", "8E8E8E"],
            ["AAAAAA", "AAAAAA", "8E8E8E", "8E8E8E", "8E8E8E", "AAAAAA", "AAAAAA", "AAAAAA"],
            ["393939", "393939", "393939", "393939", "393939", "393939", "393939", "393939"],
            ["555555", "555555", "555555", "555555", "555555", "555555", "555555", "555555"],
            ["555555", "393939", "717171", "555555", "555555", "393939", "717171", "555555"],
            ["555555", "555555", "555555", "555555", "555555", "555555", "555555", "555555"],
            ["393939", "393939", "393939", "393939", "393939", "393939", "393939", "393939"]
          ]
      },
      {
        sprite:
          [
            ["AAAAAA", "AAAAAA", "AAAAAA", "8E8E8E", "8E8E8E", "8E8E8E", "AAAAAA", "AAAAAA"],
            ["8E8E8E", "393939", "393939", "555555", "555555", "393939", "393939", "AAAAAA"],
            ["8E8E8E", "8E8E8E", "AAAAAA", "AAAAAA", "AAAAAA", "8E8E8E", "8E8E8E", "8E8E8E"],
            ["393939", "393939", "393939", "393939", "393939", "393939", "393939", "393939"],
            ["555555", "555555", "555555", "555555", "555555", "555555", "555555", "555555"],
            ["555555", "393939", "717171", "555555", "555555", "393939", "717171", "555555"],
            ["555555", "555555", "555555", "555555", "555555", "555555", "555555", "555555"],
            ["393939", "393939", "393939", "393939", "393939", "393939", "393939", "393939"]
          ]
      }
      ]
    };

    this.ICE_BLOCK = {
      name: ObjectTypes.ICE_BLOCK,
      descriptiveName: "Ice block",
      description: "It's slippery. The player can't stick to it if walljump is active.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["C6E3FF", "C6E3FF", "C6E3FF", "C6E3FF", "C6E3FF", "C6E3FF", "C6E3FF", "C6E3FF"],
            ["C6E3FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "55AAFF"],
            ["C6E3FF", "8EC6FF", "8EC6FF", "C6E3FF", "8EC6FF", "8EC6FF", "8EC6FF", "55AAFF"],
            ["C6E3FF", "8EC6FF", "C6E3FF", "8EC6FF", "8EC6FF", "C6E3FF", "8EC6FF", "55AAFF"],
            ["C6E3FF", "8EC6FF", "8EC6FF", "8EC6FF", "C6E3FF", "8EC6FF", "8EC6FF", "55AAFF"],
            ["C6E3FF", "8EC6FF", "8EC6FF", "C6E3FF", "8EC6FF", "8EC6FF", "8EC6FF", "55AAFF"],
            ["C6E3FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "8EC6FF", "55AAFF"],
            ["C6E3FF", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "55AAFF"]
          ]
      },
      ]
    };

    this.DISAPPEARING_FOREGROUND_TILE = {
      name: ObjectTypes.DISAPPEARING_FOREGROUND_TILE,
      descriptiveName: "Disappearing foreground",
      description: "It will be displayed above all objects and deco. Once the player touches it, the tile and all it's neighbours disappear. You can hide secrets behind it.",
      type: this.SPRITE_TYPES.tile,
      animation: [{
        sprite:
          [
            ["fbe7cf", "fbe7cf", "eeb39e", "fbe7cf", "eeb39e", "eeb39e", "eeb39e", "eeb39e"],
            ["fbe7cf", "f6c992", "eeb39e", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["fbe7cf", "eeb39e", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["fbe7cf", "f6c992", "f6c992", "f6c992", "ee8764", "ee8764", "ee8764", "c26241"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "f6c992", "e1a45b"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "f6c992", "eeb39e", "e1a45b"],
            ["eeb39e", "ee8764", "ee8764", "ee8764", "f6c992", "eeb39e", "f6c992", "e1a45b"],
            ["c26241", "c26241", "c26241", "c26241", "e1a45b", "eeb39e", "e1a45b", "e1a45b"],
          ]
      },
      ]
    };

    this.ROCKET_LAUNCHER = {
      name: ObjectTypes.ROCKET_LAUNCHER,
      type: this.SPRITE_TYPES.object,
      descriptiveName: "Rocket launcher",
      changeableAttributes: [
        { name: this.changeableAttributeTypes.speed, defaultValue: 3, minValue: 1, maxValue: 10 },
        { name: this.changeableAttributeTypes.frequency, defaultValue: 3, minValue: 1, maxValue: 8 },
        {
          name: this.changeableAttributeTypes.rotationSpeed, defaultValue: 8, minValue: 0, maxValue: 24, descriptiveName: "rotation speed <span data-microtip-size='large'aria-label='Determines how fast the rockets will rotate to the players direction. 0 = rockets will decide direction once and not turn at all. 24 = basically following the player everywhere.'"
            + "data-microtip-position='top-left' role='tooltip' class='songInputInfo'>"
            + "<img src='images/icons/info.svg' alt='info' width='16' height='16'>"
        }
      ],
      squishAble: false,
      rotateable: true,
      description: "A rocket-launcher. It shoots <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Rocket'} }, true)\">rockets</span> at certain time intervals that will follow the player. Click on it after placing it again, to change the attributes of the individual cannon.",
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'AAAAAA', 'AAAAAA', 'transp', 'transp'],
            ['AAAAAA', 'AAAAAA', 'FF1C1C', 'FF1C1C', 'AAAAAA', 'AAAAAA', '717171', 'transp'],
            ['AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', '717171', '717171'],
            ['FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', '717171', '717171'],
            ['FFFFFF', 'FFFFFF', 'FF1C1C', 'FF1C1C', 'FFFFFF', 'FFFFFF', '717171', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'FFFFFF', 'FFFFFF', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ]
      },
      ]
    };

    this.NPC_SPRITE = {
      name: ObjectTypes.NPC,
      changeableAttributes: [
        { name: this.changeableAttributeTypes.dialogue, defaultValue: [""] },
      ],
      descriptiveName: "Npc",
      description: "An object that can display a dialogue. Click on it again after placing it, to display the dialogue window.",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['FFAA55', 'FFAA55', 'FFAA55', 'FFAA55', 'FFAA55', 'FFAA55', 'FFAA55', 'AA5500'],
            ['FFAA55', 'FF8E1C', 'FFFFFF', 'FFFFFF', 'FF8E1C', 'FFFFFF', 'FF8E1C', 'AA5500'],
            ['FFAA55', 'FF8E1C', 'FF8E1C', 'FF8E1C', 'FF8E1C', 'FF8E1C', 'FF8E1C', 'AA5500'],
            ['FFAA55', 'FF8E1C', 'FFFFFF', 'FF8E1C', 'FFFFFF', 'FFFFFF', 'FF8E1C', 'AA5500'],
            ['AA5500', 'AA5500', 'AA5500', 'AA5500', 'AA5500', 'AA5500', 'AA5500', 'AA5500'],
            ['transp', 'transp', 'transp', '713900', '713900', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', '713900', '713900', 'transp', 'transp', 'transp'],
          ]
      },
      ]
    };

    this.CANON_BALL_SPRITE = {
      name: ObjectTypes.CANON_BALL,
      descriptiveName: "Cannon ball",
      directions: [AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.bottom],
      description: "A cannonball. The <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Cannon'} }, true)\">cannon</span> shoots it. <br/>" +
        "When it hits a wall, <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'SFX 2'} }, true)\">explosion</span> will be displayed. " +
        "Leaves <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'SFX 9'} }, true)\">trail</span>.",
      animation: [{
        sprite:
          [
            ["transp", "transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp", "transp"],
            ["transp", "FFFFFF", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "FFFFFF", "transp"],
            ["FFFFFF", "ff5e7a", "ff5e7a", "ff5e7a", "FFFFFF", "ff5e7a", "ff5e7a", "FFFFFF"],
            ["FFFFFF", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "FFFFFF", "ff5e7a", "FFFFFF"],
            ["FFFFFF", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "FFFFFF"],
            ["FFFFFF", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "FFFFFF"],
            ["transp", "FFFFFF", "ff5e7a", "ff5e7a", "ff5e7a", "ff5e7a", "FFFFFF", "transp"],
            ["transp", "transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp", "transp"],
          ]
      }
      ]
    };

    this.ROCKET = {
      name: ObjectTypes.ROCKET,
      descriptiveName: "Rocket",
      description: "A rocket. The <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Rocket launcher'} }, true)\">rocket launcher</span> shoots it.<br/>" +
        "When it hits a wall, <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'SFX 2'} }, true)\">explosion</span> will be displayed.",
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'FFFFFF', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'FFFFFF', 'FFFFFF', 'transp', 'transp'],
            ['FF1C1C', 'FF1C1C', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFF8E', 'FF8E1C'],
            ['FF1C1C', 'FF1C1C', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'FFFF8E', 'FF8E1C'],
            ['transp', 'transp', 'transp', 'transp', 'AAAAAA', 'AAAAAA', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'AAAAAA', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ]
      },
      {
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'FFFFFF', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'FFFFFF', 'FFFFFF', 'transp', 'transp'],
            ['FF1C1C', 'FF1C1C', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'transp', 'FF8E1C'],
            ['FF1C1C', 'FF1C1C', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'transp', 'FF8E1C'],
            ['transp', 'transp', 'transp', 'transp', 'AAAAAA', 'AAAAAA', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'AAAAAA', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ]
      }
      ]
    };

    this.PORTAL = {
      name: ObjectTypes.PORTAL,
      type: this.SPRITE_TYPES.object,
      descriptiveName: "Portal",
      squishAble: false,
      description:
        "<b>Second Sprite:</b> <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Portal 2'} }, true)\">Here</span>"
        + "<br/><br/>A portal with 2 exits. <br/>"
        + "Just draw 2 portals on the game screen. The odd one will automatically be the first, the even one the second.",
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'FFFFFF', 'FFFFFF', 'transp', 'transp', 'transp'],
            ['transp', 'transp', '0071E3', '0071E3', '0071E3', '0071E3', 'transp', 'transp'],
            ['transp', '0071E3', '0071E3', '55AAFF', '55AAFF', '0071E3', '0071E3', 'transp'],
            ['FFFFFF', '0071E3', '55AAFF', '8EC6FF', '8EC6FF', '55AAFF', '0071E3', 'FFFFFF'],
            ['FFFFFF', '0071E3', '55AAFF', '8EC6FF', '8EC6FF', '55AAFF', '0071E3', 'FFFFFF'],
            ['transp', '0071E3', '0071E3', '55AAFF', '55AAFF', '0071E3', '0071E3', 'transp'],
            ['transp', 'transp', '0071E3', '0071E3', '0071E3', '0071E3', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFFFF', 'FFFFFF', 'transp', 'transp', 'transp'],
          ]
      },
      ]
    };

    this.PORTAL2 = {
      name: ObjectTypes.PORTAL2,
      type: this.SPRITE_TYPES.object,
      descriptiveName: "Portal 2",
      description:
        "<b>First Sprite:</b> <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Portal'} }, true)\">Here</span>"
        + "<br/><br/>A portal with 2 exits. <br/>"
        + "Just draw 2 portals on the game screen. The odd one will automatically be the first, the even one the second.",
      squishAble: false,
      hiddenSprite: true,
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'FFFFFF', 'FFFFFF', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'E37100', 'E37100', 'E37100', 'E37100', 'transp', 'transp'],
            ['transp', 'E37100', 'E37100', 'FFAA55', 'FFAA55', 'E37100', 'E37100', 'transp'],
            ['FFFFFF', 'E37100', 'FFAA55', 'FFC68E', 'FFC68E', 'FFAA55', 'E37100', 'FFFFFF'],
            ['FFFFFF', 'E37100', 'FFAA55', 'FFC68E', 'FFC68E', 'FFAA55', 'E37100', 'FFFFFF'],
            ['transp', 'E37100', 'E37100', 'FFAA55', 'FFAA55', 'E37100', 'E37100', 'transp'],
            ['transp', 'transp', 'E37100', 'E37100', 'E37100', 'E37100', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFFFF', 'FFFFFF', 'transp', 'transp', 'transp'],
          ]
      },
      ]
    };

    this.COLLECTIBLE = {
      name: ObjectTypes.COLLECTIBLE,
      type: this.SPRITE_TYPES.object,
      descriptiveName: "Collectible",
      description: "They can be placed to give the player an additional challenge. <br/> Inside the tool, the collectibles will reappear if you die or reset the level, in the exported game they are gone forever, once " +
        "<span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'SFX 4'} }, true)\">collected</span>.",
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFFC6', 'FFFFC6', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'FFFFC6', 'FFFF8E', 'FFFF8E', 'FFFF55', 'transp', 'transp'],
            ['transp', 'transp', 'FFFFC6', 'FFFF8E', 'FFFF8E', 'FFFF55', 'transp', 'transp'],
            ['transp', 'transp', 'FFFFC6', 'FFFF8E', 'FFFF8E', 'FFFF55', 'transp', 'transp'],
            ['transp', 'transp', 'FFFFC6', 'FFFF8E', 'FFFF8E', 'FFFF55', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFF55', 'FFFF55', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ]
      },
      {
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFFC6', 'FFFFC6', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFFC6', 'FFFF55', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFFC6', 'FFFF55', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFFC6', 'FFFF55', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFFC6', 'FFFF55', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'FFFF55', 'FFFF55', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ]
      },
      ]
    };

    this.LASER_CANON = {
      name: ObjectTypes.LASER_CANON,
      changeableAttributes: [
        { name: this.changeableAttributeTypes.laserDuration, defaultValue: 60, minValue: 10, maxValue: 140, step: 10, descriptiveName: "laser duration" },
        { name: this.changeableAttributeTypes.pauseDuration, defaultValue: 60, minValue: 0, maxValue: 140, step: 10, descriptiveName: "pause duration" }
      ],
      descriptiveName: "Laser cannon",
      description: "A laser cannon. It shoots <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Laser'} }, true)\">lasers</span> until they hit a wall. Click on it after placing it again, to change the attributes of the individual laser cannon.",
      type: this.SPRITE_TYPES.object,
      squishAble: false,
      directions: [AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.bottom],
      animation: [{
        sprite:
          [
            ["transp", "transp", "8E8E8E", "8E8E8E", "8E8E8E", "8E8E8E", "8E8E8E", "8E8E8E"],
            ["transp", "555555", "8E8E8E", "717171", "717171", "717171", "717171", "555555"],
            ["C6C6C6", "555555", "8E8E8E", "717171", "717171", "717171", "717171", "555555"],
            ["FFFFFF", "555555", "8E8E8E", "393939", "FF8E8E", "FF8E8E", "393939", "555555"],
            ["FFFFFF", "555555", "8E8E8E", "393939", "E30000", "E30000", "393939", "555555"],
            ["C6C6C6", "555555", "8E8E8E", "717171", "717171", "717171", "717171", "555555"],
            ["transp", "555555", "8E8E8E", "717171", "717171", "717171", "717171", "555555"],
            ["transp", "transp", "555555", "555555", "555555", "555555", "555555", "555555"],
          ]
      }
      ]
    };

    this.LASER = {
      name: ObjectTypes.LASER,
      descriptiveName: "Laser",
      directions: [AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.bottom],
      description: "A laser. The <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Laser cannon'} }, true)\">laser cannon</span> shoots it. <br/>",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFC68E", "transp", "transp", "transp", "FFC68E", "transp"],
            ["transp", "transp", "FF1C1C", "transp", "transp", "transp", "FF1C1C", "transp"],
            ["transp", "FF1C1C", "transp", "FF1C1C", "transp", "FF1C1C", "transp", "FF1C1C"],
            ["FFC68E", "transp", "transp", "transp", "FFC68E", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["FFC68E", "transp", "transp", "transp", "FFC68E", "transp", "transp", "transp"],
            ["FF1C1C", "transp", "transp", "transp", "FF1C1C", "transp", "transp", "transp"],
            ["transp", "FF1C1C", "transp", "FF1C1C", "transp", "FF1C1C", "transp", "FF1C1C"],
            ["transp", "transp", "FFC68E", "transp", "transp", "transp", "FFC68E", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.BARREL_CANNON = {
      name: ObjectTypes.BARREL_CANNON,
      descriptiveName: "Barrel",
      description: "A barrel. When the player touches it, he gets inside of it and stays there, until he presses the jump button - then he will be launched out of it in it's direction.",
      type: this.SPRITE_TYPES.object,
      squishAble: true,
      directions: [AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.bottom],
      animation: [{
        sprite:
          [
            ["transp", "transp", "717171", "FFAA55", "FFAA55", "717171", "transp", "transp"],
            ["transp", "FFAA55", "8E8E8E", "FF8E1C", "FF8E1C", "8E8E8E", "FFAA55", "transp"],
            ["717171", "FF8E1C", "8E8E8E", "FFFFFF", "E37100", "8E8E8E", "FF8E1C", "717171"],
            ["8E8E8E", "FF8E1C", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FF8E1C", "8E8E8E"],
            ["8E8E8E", "FF8E1C", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FF8E1C", "8E8E8E"],
            ["717171", "FF8E1C", "8E8E8E", "FFFFFF", "E37100", "8E8E8E", "FF8E1C", "717171"],
            ["transp", "FFAA55", "8E8E8E", "FF8E1C", "FF8E1C", "8E8E8E", "FFAA55", "transp"],
            ["transp", "transp", "717171", "FFAA55", "FFAA55", "717171", "transp", "transp"]
          ]
      }
      ]
    };

    this.JUMP_RESET = {
      name: ObjectTypes.JUMP_RESET,
      descriptiveName: "Jump reset",
      description: "It resets your jump in air. It is deactivated upon touching the ground or wall.",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["transp", "transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["FFFFFF", "transp", "transp", "55AAFF", "55AAFF", "transp", "transp", "FFFFFF"],
            ["FFFFFF", "transp", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "transp", "FFFFFF"],
            ["FFFFFF", "transp", "transp", "55AAFF", "55AAFF", "transp", "transp", "FFFFFF"],
            ["FFFFFF", "transp", "transp", "55AAFF", "55AAFF", "transp", "transp", "FFFFFF"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp", "transp"],
          ]
      }
      ]
    };

    this.FIXED_SPEED_RIGHT = {
      name: ObjectTypes.FIXED_SPEED_RIGHT,
      descriptiveName: "Auto run",
      directions: [AnimationHelper.facingDirections.right, AnimationHelper.facingDirections.left],
      description: "Activates auto-run mode upon touching. <br/> The auto-run can be stopped by the auto-run stopper tile. <br/> Jumping off a wall will change the run direction. Click on a set object again, to change it's default direction.",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["FF8E1C", "FF8E1C", "transp", "transp", "transp", "transp", "FF8E1C", "FF8E1C"],
            ["FF8E1C", "transp", "transp", "transp", "transp", "transp", "transp", "FF8E1C"],
            ["transp", "transp", "transp", "transp", "FF8E1C", "transp", "transp", "transp"],
            ["transp", "transp", "FF8E1C", "FF8E1C", "FF8E1C", "FF8E1C", "transp", "transp"],
            ["transp", "transp", "FF8E1C", "FF8E1C", "FF8E1C", "FF8E1C", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "FF8E1C", "transp", "transp", "transp"],
            ["FF8E1C", "transp", "transp", "transp", "transp", "transp", "transp", "FF8E1C"],
            ["FF8E1C", "FF8E1C", "transp", "transp", "transp", "transp", "FF8E1C", "FF8E1C"],
          ]
      },
      {
        sprite:
          [
            ["FF8E1C", "FF8E1C", "transp", "transp", "transp", "transp", "FF8E1C", "FF8E1C"],
            ["FF8E1C", "transp", "transp", "transp", "transp", "transp", "transp", "FF8E1C"],
            ["transp", "transp", "transp", "transp", "AA5500", "transp", "transp", "transp"],
            ["transp", "transp", "AA5500", "AA5500", "AA5500", "AA5500", "transp", "transp"],
            ["transp", "transp", "AA5500", "AA5500", "AA5500", "AA5500", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "AA5500", "transp", "transp", "transp"],
            ["FF8E1C", "transp", "transp", "transp", "transp", "transp", "transp", "FF8E1C"],
            ["FF8E1C", "FF8E1C", "transp", "transp", "transp", "transp", "FF8E1C", "FF8E1C"],
          ]
      }
      ]
    };

    this.FIXED_SPEED_STOPPER = {
      name: ObjectTypes.FIXED_SPEED_STOPPER,
      descriptiveName: "Auto-run stopper",
      description: "This tile stops the auto-run activated by the <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Auto run'} }, true)\">auto-run sprite</span>.",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ["transp", "transp", "FFC6C6", "FFC6C6", "FFC6C6", "FFC6C6", "transp", "transp"],
            ["transp", "FFC6C6", "390000", "390000", "390000", "390000", "FFC6C6", "transp"],
            ["FFC6C6", "390000", "FFC6C6", "390000", "390000", "390000", "390000", "FFC6C6"],
            ["FFC6C6", "390000", "390000", "FFC6C6", "390000", "390000", "390000", "FFC6C6"],
            ["FFC6C6", "390000", "390000", "390000", "FFC6C6", "390000", "390000", "FFC6C6"],
            ["FFC6C6", "390000", "390000", "390000", "390000", "FFC6C6", "390000", "FFC6C6"],
            ["transp", "FFC6C6", "390000", "390000", "390000", "390000", "FFC6C6", "transp"],
            ["transp", "transp", "FFC6C6", "FFC6C6", "FFC6C6", "FFC6C6", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "FFC6C6", "FFC6C6", "FFC6C6", "FFC6C6", "transp", "transp"],
            ["transp", "FFC6C6", "710000", "710000", "710000", "710000", "FFC6C6", "transp"],
            ["FFC6C6", "710000", "FFC6C6", "710000", "710000", "710000", "710000", "FFC6C6"],
            ["FFC6C6", "710000", "710000", "FFC6C6", "710000", "710000", "710000", "FFC6C6"],
            ["FFC6C6", "710000", "710000", "710000", "FFC6C6", "710000", "710000", "FFC6C6"],
            ["FFC6C6", "710000", "710000", "710000", "710000", "FFC6C6", "710000", "FFC6C6"],
            ["transp", "FFC6C6", "710000", "710000", "710000", "710000", "FFC6C6", "transp"],
            ["transp", "transp", "FFC6C6", "FFC6C6", "FFC6C6", "FFC6C6", "transp", "transp"],
          ]
      }
      ]
    };

    this.PATH_SPRITE = {
      name: ObjectTypes.PATH_POINT,
      changeableAttributes: [
        { name: this.changeableAttributeTypes.speed, defaultValue: 3, minValue: 1, maxValue: 7, mapper: this.pathMovementMapper },
        {
          name: this.changeableAttributeTypes.stopFrames, defaultValue: 10, minValue: 0, maxValue: 80, step: 5, descriptiveName: "wait <span data-microtip-size='large'aria-label='The objects on the path will wait that amount of time, if an object reaches the path´s end.'"
            + "data-microtip-position='top-left' role='tooltip' class='songInputInfo'>"
            + "<img src='images/icons/info.svg' alt='info' width='16' height='16'>"
        },
        {
          name: this.changeableAttributeTypes.movementDirection, formElement: this.changeableAttributeFormElements.toggle, defaultValue: AnimationHelper.possibleDirections.forwards,
          options: [{ "true": AnimationHelper.possibleDirections.forwards }, { "false": AnimationHelper.possibleDirections.backwards }]
        },
      ],
      directions: [AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      descriptiveName: "Path",
      description: "<div>Draw paths, put objects on top and the objects will follow them. Click on an already set path-point, while paths are selected in build-tools to adjust the path's attributes."
        + "<div class='subSection'>"
        + "<details><summary>Compatible objects</summary><div class='marginTop8'><ul style='padding-left: 16px'><li>Finish flag</li><li>Spikes</li><li>Trampolines</li><li>Toggle mine</li><li>Rocket launchers</li><li>Portals</li><li>Collectibles</li><li>Barrel cannons</li><li>Jump reset</li></ul></div></details>"
        + "<details class='marginTop8'><summary>Rules</summary><div class='marginTop8'><ul style='padding-left: 16px'><li>Draw paths in a line or in an enclosed 'circle'</li><li>Place as many different objects on them as you want</li><li>You can't draw 2 paths above or beside each other. You need to leave 1 free space inbetween</li></ul></div></details>"
        + "</div></div>",
      type: this.SPRITE_TYPES.object,
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['FFFFFF', 'FFFFFF', 'transp', 'FFFFFF', 'FFFFFF', 'transp', 'FFFFFF', 'FFFFFF'],
            ['1C1C1C', '1C1C1C', 'transp', '1C1C1C', '1C1C1C', 'transp', '1C1C1C', '1C1C1C'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ]
      },
      ]
    };

    this.DEKO_SPRITE = {
      name: ObjectTypes.DEKO,
      type: this.SPRITE_TYPES.deko,
      descriptiveName: "Deco 1",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "40BF40", "transp", "transp", "transp", "40BF40"],
            ["transp", "40BF40", "transp", "40BF40", "transp", "40BF40", "transp", "40BF40"],
            ["transp", "40BF40", "40BF40", "40BF40", "40BF40", "40BF40", "transp", "40BF40"],
            ["40BF40", "40BF40", "40BF40", "40BF40", "40BF40", "40BF40", "transp", "40BF40"],
          ]
      }
      ]
    };

    this.DEKO_SPRITE2 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 2",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "FF55FF", "FF55FF", "transp"],
            ["transp", "FF5555", "FF5555", "transp", "FF00FF", "transp", "transp", "FF00FF"],
            ["FF5555", "transp", "transp", "FF5555", "transp", "FF00FF", "FF00FF", "transp"],
            ["transp", "FF5555", "FF5555", "transp", "transp", "2B802B", "2B802B", "transp"],
          ]
      }
      ]
    };

    this.DEKO_SPRITE3 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 3",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["FFFFFF", "FFFFFF", "transp", "FFFFFF", "FFFFFF", "transp", "FFFFFF", "FFFFFF"],
            ["FFFFFF", "FFFFFF", "FFFFFF", "0000FF", "0000FF", "FFFFFF", "FFFFFF", "FFFFFF"],
            ["transp", "transp", "transp", "0000FF", "0000FF", "transp", "transp", "transp"],
            ["FFFFFF", "FFFFFF", "55AAFF", "transp", "transp", "55AAFF", "FFFFFF", "FFFFFF"],
            ["FFFFFF", "FFFFFF", "FFFFFF", "55AAFF", "55AAFF", "FFFFFF", "FFFFFF", "FFFFFF"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.DEKO_SPRITE4 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 4",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "2B8055", "transp", "15402A", "15402A", "transp", "2B8055", "transp"],
            ["transp", "2B8055", "2B8055", "15402A", "15402A", "2B8055", "2B8055", "transp"],
            ["transp", "transp", "2B8055", "15402A", "15402A", "2B8055", "transp", "transp"],
            ["transp", "transp", "transp", "15402A", "15402A", "transp", "transp", "transp"],
            ["transp", "2B8055", "transp", "15402A", "15402A", "transp", "2B8055", "transp"],
            ["transp", "2B8055", "2B8055", "15402A", "15402A", "2B8055", "2B8055", "transp"],
            ["transp", "transp", "2B8055", "15402A", "15402A", "2B8055", "transp", "transp"],
            ["transp", "transp", "transp", "15402A", "15402A", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.DEKO_SPRITE5 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 5",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["713900", "transp", "transp", "transp", "transp", "transp", "transp", "AA5500"],
            ["713900", "E37100", "E37100", "E37100", "E37100", "E37100", "E37100", "AA5500"],
            ["713900", "transp", "transp", "transp", "transp", "transp", "transp", "AA5500"],
            ["713900", "E37100", "E37100", "E37100", "E37100", "E37100", "E37100", "AA5500"],
            ["713900", "transp", "transp", "transp", "transp", "transp", "transp", "AA5500"],
            ["713900", "E37100", "E37100", "E37100", "E37100", "E37100", "E37100", "AA5500"],
          ]
      }
      ]
    };

    this.DEKO_SPRITE6 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 6",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["717171", "8E8E8E", "AAAAAA", "C6C6C6", "C6C6C6", "AAAAAA", "8E8E8E", "717171"],
            ["transp", "717171", "8E8E8E", "AAAAAA", "AAAAAA", "8E8E8E", "717171", "transp"],
            ["transp", "transp", "FFFF1C", "FFFF55", "FFFF55", "FFFF1C", "transp", "transp"],
            ["transp", "717171", "710071", "AA00AA", "AA00AA", "710071", "717171", "transp"],
            ["717171", "8E8E8E", "AAAAAA", "C6C6C6", "C6C6C6", "AAAAAA", "8E8E8E", "717171"],
            ["717171", "8E8E8E", "AAAAAA", "C6C6C6", "C6C6C6", "AAAAAA", "8E8E8E", "717171"],
            ["717171", "8E8E8E", "AAAAAA", "C6C6C6", "C6C6C6", "AAAAAA", "8E8E8E", "717171"],
            ["transp", "717171", "8E8E8E", "AAAAAA", "AAAAAA", "8E8E8E", "717171", "transp"]
          ]
      },

      ]
    };

    this.DEKO_SPRITE7 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 7",
      type: this.SPRITE_TYPES.deko,
      animation: [
        {
          sprite:
            [
              ["2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A"],
              ["transp", "2A2A2A", "transp", "transp", "2A2A2A", "transp", "2A2A2A", "transp"],
              ["transp", "2A2A2A", "transp", "2A2A2A", "transp", "transp", "2A2A2A", "transp"],
              ["transp", "2A2A2A", "transp", "2A2A2A", "2A2A2A", "transp", "2A2A2A", "transp"],
              ["transp", "2A2A2A", "transp", "transp", "2A2A2A", "transp", "2A2A2A", "transp"],
              ["transp", "2A2A2A", "transp", "2A2A2A", "transp", "transp", "2A2A2A", "transp"],
              ["transp", "2A2A2A", "transp", "2A2A2A", "2A2A2A", "transp", "2A2A2A", "transp"],
              ["2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A"],
            ]
        }
      ]
    };

    this.DEKO_SPRITE8 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 8",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "transp", "2A2A2A", "2A2A2A"],
            ["2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "transp", "2A2A2A", "2A2A2A"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["2A2A2A", "2A2A2A", "transp", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A"],
            ["2A2A2A", "2A2A2A", "transp", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "transp", "2A2A2A", "2A2A2A"],
            ["2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "2A2A2A", "transp", "2A2A2A", "2A2A2A"],
          ]
      }
      ]
    };

    this.DEKO_SPRITE9 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 9",
      type: this.SPRITE_TYPES.deko,
      animation: [
        {
          sprite: [
            ['transp', 'transp', 'transp', 'FF8E1C', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'FF8E1C', 'FFC68E', 'FF8E1C', 'transp', 'transp', 'transp'],
            ['transp', 'FF8E1C', 'FFC68E', 'FFFFC6', 'FFC68E', 'FF8E1C', 'transp', 'transp'],
            ['transp', 'FF8E1C', 'FFC68E', 'FFFFC6', 'FFC68E', 'FF8E1C', 'transp', 'transp'],
            ['transp', '8E8E8E', 'AAAAAA', 'AAAAAA', 'AAAAAA', '8E8E8E', 'transp', 'transp'],
            ['transp', 'transp', '8E8E8E', 'AAAAAA', '8E8E8E', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', '8E8E8E', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', '8E8E8E', 'transp', 'transp', 'transp', 'transp']
          ]
        },
        {
          sprite:
            [
              ["transp", "transp", "transp", "AA5500", "transp", "transp", "transp", "transp"],
              ["transp", "transp", "AA5500", "FF8E1C", "AA5500", "transp", "transp", "transp"],
              ["transp", "AA5500", "FF8E1C", "FFFF8E", "FF8E1C", "AA5500", "transp", "transp"],
              ["transp", "AA5500", "FF8E1C", "FFFF8E", "FF8E1C", "AA5500", "transp", "transp"],
              ["transp", "8E8E8E", "AAAAAA", "AAAAAA", "AAAAAA", "8E8E8E", "transp", "transp"],
              ["transp", "transp", "8E8E8E", "AAAAAA", "8E8E8E", "transp", "transp", "transp"],
              ["transp", "transp", "transp", "8E8E8E", "transp", "transp", "transp", "transp"],
              ["transp", "transp", "transp", "8E8E8E", "transp", "transp", "transp", "transp"]
            ]
        }
      ]
    };

    this.DEKO_SPRITE10 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 10",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp", "transp"],
            ["transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp"],
            ["C6E3FF", "C6E3FF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp"],
            ["C6E3FF", "C6E3FF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF"],
            ["transp", "C6E3FF", "C6E3FF", "C6E3FF", "C6E3FF", "C6E3FF", "C6E3FF", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"]
          ]
      }
      ]
    };

    this.DEKO_SPRITE11 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 11",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFC6FF", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "FFC6FF", "FFFFFF", "FFC6FF", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFC6FF", "transp", "transp", "FFC6FF", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "FFC6FF", "FFFFFF", "FFC6FF", "transp"],
            ["transp", "transp", "FFC6FF", "transp", "transp", "FFC6FF", "transp", "transp"],
            ["transp", "FFC6FF", "FFFFFF", "FFC6FF", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFC6FF", "transp", "transp", "transp", "transp", "transp"]
          ]
      },
      {
        sprite: [
          ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ['transp', 'transp', '393939', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ['transp', '393939', 'FFC6FF', '393939', 'transp', 'transp', 'transp', 'transp'],
          ['transp', 'transp', '393939', 'transp', 'transp', '393939', 'transp', 'transp'],
          ['transp', 'transp', 'transp', 'transp', '393939', 'FFC6FF', '393939', 'transp'],
          ['transp', 'transp', '393939', 'transp', 'transp', '393939', 'transp', 'transp'],
          ['transp', '393939', 'FFC6FF', '393939', 'transp', 'transp', 'transp', 'transp'],
          ['transp', 'transp', '393939', 'transp', 'transp', 'transp', 'transp', 'transp']

        ]
      }
      ]
    };

    this.DEKO_SPRITE12 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 12",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', '0055AA', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', '8EC6FF', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', '8EC6FF', 'C6E3FF', '8EC6FF', 'transp', 'transp', 'transp'],
            ['0055AA', '8EC6FF', 'C6E3FF', 'C6E3FF', 'C6E3FF', '8EC6FF', '0055AA', 'transp'],
            ['transp', 'transp', '8EC6FF', 'C6E3FF', '8EC6FF', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', '8EC6FF', 'transp', 'transp', 'transp', 'transp'],
            ['transp', 'transp', 'transp', '0055AA', 'transp', 'transp', 'transp', 'transp']
          ]
      },
      {
        sprite: [
          ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ['transp', 'transp', 'transp', '003971', 'transp', 'transp', 'transp', 'transp'],
          ['transp', 'transp', 'transp', '0055AA', 'transp', 'transp', 'transp', 'transp'],
          ['transp', 'transp', '0055AA', 'C6E3FF', '0055AA', 'transp', 'transp', 'transp'],
          ['003971', '0055AA', 'C6E3FF', 'C6E3FF', 'C6E3FF', '0055AA', '003971', 'transp'],
          ['transp', 'transp', '0055AA', 'C6E3FF', '0055AA', 'transp', 'transp', 'transp'],
          ['transp', 'transp', 'transp', '0055AA', 'transp', 'transp', 'transp', 'transp'],
          ['transp', 'transp', 'transp', '003971', 'transp', 'transp', 'transp', 'transp']
        ]
      }
      ]
    };

    this.DEKO_SPRITE13 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 13",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "55AA00", "397100", "transp", "transp", "transp"],
            ["transp", "55AA00", "transp", "55AA00", "397100", "transp", "transp", "transp"],
            ["transp", "55AA00", "transp", "55AA00", "397100", "transp", "transp", "transp"],
            ["transp", "55AA00", "55AA00", "55AA00", "397100", "transp", "55AA00", "transp"],
            ["transp", "transp", "transp", "55AA00", "397100", "transp", "55AA00", "transp"],
            ["transp", "transp", "transp", "55AA00", "55AA00", "55AA00", "55AA00", "transp"],
            ["transp", "transp", "transp", "55AA00", "397100", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "55AA00", "397100", "transp", "transp", "transp"]
          ]
      },
      ]
    };

    this.DEKO_SPRITE14 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 14",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "2B8055", "2B8055", "2B8055", "2B8055", "transp", "transp"],
            ["transp", "2B8055", "2B8055", "15402A", "2B8055", "15402A", "2B8055", "transp"],
            ["transp", "2B8055", "15402A", "2B8055", "15402A", "15402A", "2B8055", "transp"],
            ["transp", "2B8055", "2B8055", "15402A", "15402A", "2B8055", "2B8055", "transp"],
            ["transp", "2B8055", "15402A", "15402A", "391C00", "15402A", "2B8055", "transp"],
            ["transp", "transp", "2B8055", "391C00", "713900", "2B8055", "transp", "transp"],
            ["transp", "transp", "transp", "391C00", "713900", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "391C00", "713900", "transp", "transp", "transp"]
          ]
      }
      ]
    };

    this.DEKO_SPRITE15 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 15",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "393939", "transp", "transp"],
            ["transp", "393939", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "713900", "transp", "transp", "transp"],
            ["transp", "transp", "713900", "713900", "713900", "713900", "transp", "transp"],
            ["transp", "713900", "713900", "713900", "713900", "713900", "713900", "transp"]
          ]
      },
      {
        sprite: [
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "393939", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "393939", "transp"],
          ["transp", "transp", "transp", "transp", "713900", "transp", "transp", "transp"],
          ["transp", "transp", "713900", "713900", "713900", "713900", "transp", "transp"],
          ["transp", "713900", "713900", "713900", "713900", "713900", "713900", "transp"]
        ]
      }
      ]
    };

    this.DEKO_SPRITE16 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 16",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "transp", "transp", "transp"],
            ["transp", "55AAFF", "55AAFF", "transp", "55AAFF", "transp", "transp", "transp"],
            ["FFFF8E", "FFFF8E", "55AAFF", "55AAFF", "55AAFF", "transp", "transp", "transp"],
            ["transp", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "55AAFF"],
            ["transp", "transp", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "55AAFF", "transp"],
            ["transp", "transp", "transp", "FFFF8E", "FFFF8E", "transp", "transp", "transp"],
          ]
      },
      {
        sprite: [
          ['transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp', 'transp'],
          ['transp', '55AAFF', '55AAFF', '55AAFF', '55AAFF', 'transp', 'transp', 'transp'],
          ['FFFF8E', '55AAFF', '55AAFF', 'transp', '55AAFF', 'transp', 'transp', 'transp'],
          ['transp', 'FFFF8E', '55AAFF', '55AAFF', '55AAFF', 'transp', 'transp', 'transp'],
          ['FFFF8E', '55AAFF', '55AAFF', '55AAFF', '55AAFF', '55AAFF', '55AAFF', '55AAFF'],
          ['transp', 'transp', '55AAFF', '55AAFF', '55AAFF', '55AAFF', '55AAFF', 'transp'],
          ['transp', 'transp', 'transp', 'transp', 'FFFF8E', 'transp', 'transp', 'transp'],
          ['transp', 'transp', 'transp', 'FFFF8E', 'FFFF8E', 'transp', 'transp', 'transp']
        ]
      }
      ]
    };

    this.DEKO_SPRITE17 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 17",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "000000", "717171", "FFFFFF", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "FFFFFF", "FF8E1C", "FF8E1C", "transp", "transp"],
            ["AA5500", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "AA5500"],
            ["transp", "AA5500", "FFFFFF", "FFFFFF", "000000", "FFFFFF", "AA5500", "transp"],
            ["transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp"],
            ["transp", "FFFFFF", "FFFFFF", "FFFFFF", "000000", "FFFFFF", "FFFFFF", "transp"],
            ["transp", "transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp", "transp"]
          ]
      }
      ]
    };

    this.DEKO_SPRITE18 = {
      name: ObjectTypes.DEKO,
      descriptiveName: "Deco 18",
      type: this.SPRITE_TYPES.deko,
      animation: [{
        sprite:
          [
            ["E30000", "FF1C1C", "transp", "transp", "transp", "transp", "FF1C1C", "E30000"],
            ["AA0000", "transp", "1C1CFF", "FFFFFF", "1C1CFF", "FFFFFF", "transp", "E30000"],
            ["transp", "AA0000", "0000E3", "1C1CFF", "0000E3", "1C1CFF", "AA0000", "transp"],
            ["transp", "transp", "AA0000", "E30000", "E30000", "E30000", "transp", "transp"],
            ["transp", "transp", "transp", "AA0000", "E30000", "transp", "transp", "transp"],
            ["transp", "transp", "E30000", "AA0000", "E30000", "E30000", "transp", "transp"],
            ["transp", "transp", "transp", "AA0000", "E30000", "transp", "transp", "transp"],
            ["transp", "transp", "E30000", "transp", "transp", "E30000", "transp", "transp"]
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["E30000", "FF1C1C", "transp", "transp", "transp", "transp", "FF1C1C", "E30000"],
            ["AA0000", "transp", "AA0000", "FF1C1C", "AA0000", "FF1C1C", "transp", "E30000"],
            ["transp", "AA0000", "AA0000", "AA0000", "AA0000", "AA0000", "AA0000", "transp"],
            ["transp", "transp", "AA0000", "E30000", "E30000", "E30000", "transp", "transp"],
            ["transp", "transp", "transp", "AA0000", "E30000", "transp", "transp", "transp"],
            ["transp", "transp", "E30000", "AA0000", "E30000", "E30000", "transp", "transp"],
            ["transp", "transp", "E30000", "transp", "transp", "E30000", "transp", "transp"]
          ]
      }
      ]
    };

    this.SFX1 = {
      name: ObjectTypes.SFX,
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      descriptiveName: "SFX 1",
      description: "SFX that shows when the <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Player jump'} }, true)\">player jumps</span>.",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
          ]
      }
      ]
    };

    this.SFX2 = {
      name: ObjectTypes.SFX,
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      descriptiveName: "SFX 2",
      description: "SFX when <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Cannon ball'} }, true)\">cannon ball</span>, " +
        "<span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Rocket'} }, true)\">rocket</span> or " +
        "<span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Stomper'} }, true)\">stomper</span> hit a wall, or player is shot out of a " +
        "<span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Barrel'} }, true)\">barrel</span>",

      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "transp", "transp", "FFFFFF", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "transp", "transp", "FFFFFF", "transp", "transp"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "transp", "transp", "FFFFFF", "transp", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "transp", "FFFFFF", "transp", "transp", "FFFFFF", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.SFX3 = {
      name: ObjectTypes.SFX,
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      descriptiveName: "SFX 3",
      description: "SFX when player dashes",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "393939", "393939", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "393939", "393939", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "393939", "transp", "transp", "393939", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "393939", "transp", "transp", "393939", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.SFX4 = {
      name: ObjectTypes.SFX,
      descriptiveName: "Build SFX",
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      hiddenEverywhere: true,
      description: "SFX when an object is placed in build mode",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "FFFFFF", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      ]
    };

    this.SFX5 = {
      name: ObjectTypes.SFX,
      descriptiveName: "SFX 4",
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      description: "Plays when the player touches a <span class='textAsLink' onclick=\"DrawSectionHandler.changeSelectedSprite({ target: { value:  'Collectible'} }, true)\">collectible</span>.",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "transp", "transp", "FFFFFF", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "transp", "transp", "FFFFFF", "transp", "transp"],
            ["transp", "transp", "transp", "FFFFFF", "FFFFFF", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFFFFF", "transp", "transp", "FFFFFF", "transp", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "FFFFFF", "transp", "transp", "transp", "transp", "FFFFFF", "transp"],
            ["transp", "transp", "FFFFFF", "transp", "transp", "FFFFFF", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.SFX6 = {
      name: ObjectTypes.SFX,
      descriptiveName: "SFX 5",
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      description: "Used for shaders",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "8EC6FF", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "8EC6FF", "transp", "8EC6FF", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "8EC6FF", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },

      ]
    };

    this.SFX7 = {
      name: ObjectTypes.SFX,
      descriptiveName: "SFX 6",
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      description: "Used for shaders",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FF8EFF", "FF8EFF", "FF8EFF", "FF8EFF", "transp", "transp"],
            ["transp", "transp", "FF8EFF", "transp", "transp", "FF8EFF", "transp", "transp"],
            ["transp", "transp", "FF8EFF", "transp", "transp", "FF8EFF", "transp", "transp"],
            ["transp", "transp", "FF8EFF", "FF8EFF", "FF8EFF", "FF8EFF", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      ]
    };

    this.SFX8 = {
      name: ObjectTypes.SFX,
      descriptiveName: "SFX 7",
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      description: "Used for shaders",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFAA55", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFFF55", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.SFX9 = {
      name: ObjectTypes.SFX,
      descriptiveName: "SFX 8",
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      description: "Will be displayed behind the player, if the player is in auto-run mode.",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "FFAA55", "FFAA55", "transp", "transp", "transp"],
            ["transp", "transp", "FFAA55", "transp", "transp", "FFAA55", "transp", "transp"],
            ["transp", "transp", "FFAA55", "transp", "transp", "FFAA55", "transp", "transp"],
            ["transp", "transp", "transp", "FFAA55", "FFAA55", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "FFAA55", "transp", "transp", "FFAA55", "transp", "transp"],
            ["transp", "FFAA55", "transp", "transp", "transp", "transp", "FFAA55", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "FFAA55", "transp", "transp", "transp", "transp", "FFAA55", "transp"],
            ["transp", "transp", "FFAA55", "transp", "transp", "FFAA55", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.SFX10 = {
      name: ObjectTypes.SFX,
      descriptiveName: "SFX 9",
      directions: [AnimationHelper.facingDirections.bottom, AnimationHelper.facingDirections.left, AnimationHelper.facingDirections.top, AnimationHelper.facingDirections.right],
      description: "Cannon ball and rocket will leave this trail.",
      animation: [{
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "AA0055", "AA0055", "transp", "transp", "transp"],
            ["transp", "transp", "AA0055", "AA0055", "AA0055", "AA0055", "transp", "transp"],
            ["transp", "transp", "AA0055", "AA0055", "AA0055", "AA0055", "transp", "transp"],
            ["transp", "transp", "transp", "AA0055", "AA0055", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      },
      {
        sprite:
          [
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "AA0055", "AA0055", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "AA0055", "AA0055", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
            ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ]
      }
      ]
    };

    this.allSprites = [];

    this.fillAllSprites = () => {
      this.allSprites = Object.entries(this).filter(key =>
        this[key[0]]?.descriptiveName
      ).map(object => object[1])
    };

    this.fillAllSprites();
  }

  static allTileSprites() {
    return [
      ...this.allSprites.filter(sprite => Number.isInteger(sprite.name)),
      this.TILE_edge
    ];
  }

  static get SPRITE_TYPES() {
    return {
      tile: "tiles",
      object: "objects",
      deko: "deco"
    }
  }

  static get EMPTY_ANIMATION_FRAME() {
    return {
      sprite:
        [
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
          ["transp", "transp", "transp", "transp", "transp", "transp", "transp", "transp"],
        ]
    }
  }

  static getSpritesByIndex(index) {
    return this.allSprites[index];
  }

  static getSpritesByName(name) {
    return this.allSprites.filter(sprite => sprite.name === name);
  }

  static getCustomSprites() {
    return this.allSprites.filter(sprite => sprite.custom);
  }

  static getSpritesByType(type) {
    return this.allSprites.filter(sprite => sprite.type === type && !sprite.hiddenSprite);
  }

  static getSpritesByDescrpitiveName(descriptiveName) {
    return this.allSprites.filter(sprite => sprite.descriptiveName === descriptiveName);
  }

  static getIndexOfSprite(searchValue, index = 0, searchKey = "name") {
    let indexInSpriteArray = 0;
    let currentIndexForSameSprites = 0;
    this.allSprites.every((sprite, spriteIndex) => {
      if (sprite[searchKey] === searchValue) {
        if (currentIndexForSameSprites === index) {
          indexInSpriteArray = spriteIndex;
          return false;
        }
        else {
          currentIndexForSameSprites++;
        }
      }
      return true;
    });
    return indexInSpriteArray;
  }
}