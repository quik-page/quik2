/**
 * @class contextMenu
 * @param {Object} options 
 * @param {{icon:String,title:String,click}[]} options.list
 * @param {{top?:Number,left?:Number,bottom?:Number,right?:Number}} options.offset 位置
 */
var contextMenu = function (options) {
  this.options = options;
  var El = el(".contextMenu");
  if (options.offset) {
    for(let k in options.offset){
        El.css(k,options.offset[k]+"px");
    }
  }
  drawList(options.list, El);
  document.body.appendChild(El);
  this.element = El;
}

function drawList(list, El) {
  list.forEach(function (itemr) {
    if (itemr.type == 'hr') {
      var item = el(".hr");
      El.appendChild(item);
    } else {
      var item = el(".item")
      item.html(`<div class="icon">${itemr.icon}</div><div class="title">${itemr.title}</div>`);
      item.onclick = function () {
        itemr.click();
      }
      El.appendChild(item);
    }

  })
}

contextMenu.prototype = {
  show() {
    let te=this.element;
    resetmenu(te);
    te.addClass('show');
    te.style.height = 'auto';
    var h = te.getRect().height;
    te.style.height = '0px';
    te.style.transition = 'height .2s';
    setTimeout(() => {
      te.style.height = h + 'px';
    })
  },
  hide() {
    let te=this.element;
    te.style.height = '0px';
    setTimeout(() => {
      te.style.transition = 'none';
      te.classList.remove('show');
    }, 200)
  },
  isShow() {
    return this.element.hasClass('show');
  },
  destroy() {
    this.element.remove();
  },
  setOffset(offset) {
    this.options.offset = offset;
    var options = this.options, el = this.element;
    el.css({
        top:"",
        left:"",
        bottom:"",
        right:""
    })
    if (options.offset) {
      for(let k in options.offset){
          el.css(k,options.offset[k]+"px");
      }
    }
  },
  setList(list) {
    this.options.list = list;
    var el = this.element;
    el.html('');
    drawList(list, el);
  }
};

document.on('click', () => {
  resetmenu();
});
document.on('contextmenu', () => {
  resetmenu();
});
function resetmenu(el) {
  $$(".contextMenu").forEach(e => {
    if (el && e.isSameNode(el)) return;
    e.style.height = '0px';
    setTimeout(() => {
      e.style.transition = 'none';
      e.removeClass('show');
    }, 200)
  })
}

module.exports = contextMenu;