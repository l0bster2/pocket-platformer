class MathHelpers {
  static getRandomNumberBetweenTwoNumbers(min, max, round = true) {
    const randomNumber = Math.random() * (max - min) + min;
    return round ? Math.floor(randomNumber) : randomNumber;
  }

  static getSometimesNegativeRandomNumber(min, max, round = true) {
    let randomNumber = this.getRandomNumberBetweenTwoNumbers(min, max, round);
    return randomNumber *= Math.round(Math.random()) ? 1 : -1;
  }

  static sortNumbers(numberArray) {
    return numberArray.sort((a,b)=>a-b)
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
      return 360 - newAngle;
    }
    return newAngle;
  }

  static getRadians(angle) {
    return angle * Math.PI / 180;
  }
}