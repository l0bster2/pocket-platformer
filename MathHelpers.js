class MathHelpers {
  static getRandomNumberBetweenTwoNumbers(min, max, round = true) {
    const randomNumber = Math.random() * (max - min) + min;
    return round ? Math.floor(randomNumber) : randomNumber;
  }

  static getSometimesNegativeRandomNumber(min, max, round = true) {
    let randomNumber = this.getRandomNumberBetweenTwoNumbers(min, max, round);
    return randomNumber *= Math.round(Math.random()) ? 1 : -1;
  }

  static getBalancedRandomNumber(min, max) {
    const value = Math.random() * (max - min) + min;
    return (Math.random() < 0.5 ? -1 : 1) * value;
  }

  static sortNumbers(numberArray) {
    return numberArray.sort((a, b) => a - b)
  }

  static getAngle(x1, y1, x2, y2) {
    let result = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    return result < 0 ? 360 + result : result; // range [0, 360)
  }

  static normalizeAngle(newAngle) {
    if (newAngle > 360) {
      return Math.abs(360 - newAngle);
    }
    else if (newAngle < 0) {
      return 360 - Math.abs(newAngle);
    }
    return newAngle;
  }

  static getRadians(angle) {
    return angle * Math.PI / 180;
  }

  static getDistanceBetween2Objects(obj1, obj2) {
    var a = obj1.x - obj2.x;
    var b = obj1.y - obj2.y;
    return Math.sqrt(a * a + b * b);
  }

  static arraysHaveSameValues(arr1, arr2) {
    return arr1.every(r => arr2.includes(r));
  }

  static raycastFindEdge(angle, origin, lineSightInTiles) {
    const { x, y } = origin;
    let x2 = x + Math.cos(angle);
    let y2 = y + Math.sin(angle);
    const tan = Math.tan(angle);
    let rx, ry, xo, yo, vx, vy;
    let disV = Number.MAX_VALUE;
    let disH = Number.MAX_VALUE;
    let dof = 0;
    const tileWidth = tileMapHandler.tileSize;

    // check horizontally, intersection against vertical, ie left or right of the tile
    if (y === y2) {
      rx = x;
      ry = y;
      dof = Number.MAX_VALUE;
    } else {
      if (x2 > x) { // looking right
        rx = Math.ceil(x / tileWidth) * tileWidth;
        ry = y + (rx - x) * tan;
        yo = tileWidth * tan;
        xo = tileWidth;
      } else {
        rx = Math.floor(x / tileWidth) * tileWidth - 1;
        ry = y + (rx - x) * tan;
        yo = -tileWidth * tan;
        xo = -tileWidth;
      }
    }

    while (dof < lineSightInTiles) {
      const tileValue = tileMapHandler.getTileTypeByPosition(rx, ry);
      if (tileValue !== 0 && tileValue !== 5) {
        disV = this.getDistanceBetween2Objects({ x, y }, { x: rx, y: ry });
        break;
      } else {
        dof++;
        ry += yo;
        rx += xo;
      }
    }
    vx = rx; vy = ry;

    // check vertically, intersection against horizontal, ie bottom or top of the tile
    if (x === x2) {
      rx = x;
      ry = y;
      dof = Number.MAX_VALUE;
    } else {
      if (y2 > y) { // if looking downwards
        ry = Math.ceil(y / tileWidth) * tileWidth;
        rx = x + (ry - y) / tan;
        xo = tileWidth / tan;
        yo = tileWidth;
      } else {
        ry = Math.floor(y / tileWidth) * tileWidth - 1;
        rx = x + (ry - y) / tan;
        xo = -tileWidth / tan;
        yo = -tileWidth;
      }
      dof = 0;
    }

    while (dof < lineSightInTiles) {
      const tileValue = tileMapHandler.getTileTypeByPosition(rx, ry);
      if (tileValue !== 0 && tileValue !== 5) {
        disH = this.getDistanceBetween2Objects({ x, y }, { x: rx, y: ry });
        break;
      } else {
        dof++;
        rx += xo;
        ry += yo;
      }
    }
    if (disV < disH) {
      rx = vx; ry = vy; disH = disV;
    }
    return { x: rx, y: ry }
  }
}