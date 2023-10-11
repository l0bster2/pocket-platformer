class Helpers {
  static debounce(callback, wait) {
    let timeoutId = null;
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null);
    }, wait);
  }

  static addAttributesToHTMLElement(el, attrs) {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  static removeHtmlElement(id) {
    var elem = document.getElementById(id);
    if (elem) {
      elem.remove();
    }
  }

  static findClosestValueInArray(array, value) {
    const closest = array.reduce((a, b) => {
      return Math.abs(b - value) < Math.abs(a - value) ? b : a;
    });
    return closest;
  }

  static isObjEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  static objectHasValue(object, value) {
    return Object.values(object).indexOf(value) > -1;
  }

  static getHuebeeDefaultProperties() {
    return {
      hue0: 210,
      hues: 12,
      shades: 8,
      saturations: 2,
      notation: 'hex',
    }
  }
}