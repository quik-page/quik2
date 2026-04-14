var icners = {
  tl: $('.topper .left'),
  tr: $('.topper .right'),
  bl: $('.bottomer .left'),
  br: $('.bottomer .right'),
}

/**
 * @class icon
 * @param {Object} options 
 * @param {String} options.content
 * @param {Boolean} options.important?
 * @param {String} options.class?
 * @param {Number} options.width?
 * @param {'tl'|'tr'|'bl'|'br'} options.offset
 */
var icon = function (options) {
  this.content = options.content;
  this.width = options.width;
  var ic = el('div', {
    class: "item" + (options.class ? (' ' + options.class) : '') + (options.important ? ' important' : ''),
  });
  icners[options.offset].append(ic);
  ic.html(this.content);
  this.element = ic;
  if (this.width) {
    ic.css("width" ,this.width + 'px');
  }
}
icon.prototype = {
  getIcon() {
    return this.element;
  },
  setIcon(content) {
    this.content = content;
    this.element.html(this.content);
  },
  setWidth(w) {
    this.width = w;
    if (this.width) {
      ic.css("width", this.width + 'px');
    }
  },
  getWidth() {
    return this.width;
  },
  show() {
    this.element.removeClass('hide');
    this.element.addClass('show');
  },
  hide() {
    this.element.addClass('hide');
    this.element.removeClass('show');
  }
}
module.exports.icon = icon;