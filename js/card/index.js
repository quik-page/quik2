var cardcon = $('.cards');
var topcardcon = $('.top.cards');

/**
 * 
 * @param {object} detail 
 * @param {string} detail.content
 * @param {Boolean} detail.topper
 * @param {number} detail.width
 * @param {number} detail.height
 * @param {string} detail.class?
 * @param {object} detail.offset
 * @param {number} detail.offset.top?
 * @param {number} detail.offset.left?
 * @param {number} detail.offset.bottom?
 * @param {number} detail.offset.right?
 */
var card = function (detail) {
  this.width = detail.width;
  this.height = detail.height;
  this.offset = detail.offset;
  var c_el = el('.card');

  c_el.html(detail.content);
  c_el.css({
    width: detail.width + "px",
    height: detail.height + "px",
  })
  if (detail.class) {
    c_el.addClass(detail.class);
  }

  if (detail.offset) {
    if (typeof detail.offset.top == 'number') {
      c_el.css("top",detail.offset.top + "px");
    } else if (typeof detail.offset.bottom == 'number') {
      c_el.css("bottom",detail.offset.bottom + "px");
    }
    if (typeof detail.offset.left == 'number') {
      c_el.css("left",detail.offset.left + "px");
    } else if (typeof detail.offset.right == 'number') {
      c_el.css("right",detail.offset.right + "px");
    }
  }
  this.el = c_el;
  if (detail.topper) {
    topcardcon.appendChild(c_el);
  } else {
    cardcon.appendChild(c_el);
  }
  this.isShow = false;
}

card.prototype = {
  show(transition) {
    var _ = this;
    _.isShow = true;
    this.el.show();
    if (transition && transition > 0) {
        this.el.css("transition", "all " + transition + "ms");
      this.el.offsetHeight;
      setTimeout(() => {
        _.el.css("transition", "none");
      }, transition);
    }
    this.el.css("opacity", "1");
  },
  hide(transition) {
    var _ = this;
    _.isShow = false;
    if (transition && transition > 0) {
        this.el.css("transition", "all " + transition + "ms");
      setTimeout(() => {
        _.el.css("transition","none");
        _.el.hide();
      }, transition);
    } else {
      this.el.hide();
    }
    this.el.css("opacity", "0");
  },
  destroy() {
    this.el.remove();
  },
  getCardDom() {
    return this.el;
  },
  getOffset() {
    return this.offset;
  },
  getWidth() {
    return this.width;
  },
  getHeight() {
    return this.height;
  },
  setWidth(width) {
    this.width = width;
    this.el.css("width", width + 'px');
  },
  setHeight(height) {
    this.height = height;
    this.el.css("height", height + 'px');
  },
  setOffset(offset, transition) {
    var _ = this,w=window.innerWidth,h=window.innerHeight;
    var old = this.offset;
    if (transition && transition > 0) {
      this.el.css("transition", "all " + transition + "ms");
      var _ck = this.el.getBoundingClientRect();
      if (typeof offset.top == 'number') {
        if (typeof old.bottom == 'number') {
            this.el.css("bottom", (h - offset.top - _ck.height) + "px");
        } else {
          this.el.css("top", offset.top + "px");
        }
      } else if (typeof offset.bottom == 'number') {
        if (typeof old.top == 'number') {
          this.el.css("top",(h - offset.bottom - _ck.height) + "px");
        } else {
          this.el.css("bottom", offset.bottom + "px");
        }
      }
      if (typeof offset.left == 'number') {
        if (typeof old.right == 'number') {
          this.el.css("right",(w - offset.left - _ck.width) + "px");
        } else {
          this.el.css("left", offset.left + "px");
        }
      } else if (typeof offset.right == 'number') {
        if (typeof old.left == 'number') {
          this.el.css("left",(w - offset.right - _ck.width) + "px");
        } else {
          this.el.css("right", offset.right + "px");
        }
      }
      setTimeout(() => {
        _.el.css("transition","none");
        sz.call(_);
      }, transition);
    } else {
      sz.call(_);
    }
    function sz() {
      this.offset = offset;
      this.el.css({
        top:"auto",
        left:"auto",
        right:"auto",
        bottom:"auto"
      })
      if (typeof offset.top == 'number') {
        this.el.css("top",offset.top + "px");
      } else if (typeof offset.bottom == 'number') {
        this.el.css("bottom", offset.bottom + "px");
      }
      if (typeof offset.left == 'number') {
        this.el.css("left", offset.left + "px");
      } else if (typeof offset.right == 'number') {
        this.el.css("right", offset.right + "px");
      }
    }

  }
}
module.exports = card;
