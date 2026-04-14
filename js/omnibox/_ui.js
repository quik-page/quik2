const { SettingItem } = require("../setting");
const util = require("../util");
const { stp, getSA, enter, searchUtil, getType, sg, doevent } = require("./_core");
const {Onshow}=require('../base');

var searchbox, searchcover, icon, input, submit, saul, searchpadding, inputInputEv;
searchpadding = el('div', {
  class: "searchpadding"
})

$('main .center').append(searchpadding);

function initSearchBox() {

  searchbox = el('.searchbox');

  searchcover = el('.cover.searchcover');

  searchbox.html(require('./htmls/searchbox.html').replace('{i}', stp.ob_autofocus ? 'autofocus' : ''));

  $('main').append(searchbox);
  $('main').append(searchcover);

  icon = searchbox.$('div.icon');
  input = searchbox.$('div.input input');
  submit = searchbox.$('div.submit');
  saul = searchbox.$('ul.sas');

  if (stp.ob_justsearch) {
    input.placeholder = '搜索'
  }

  /* 集中处理input事件 */
  inputInputEv = function () {
    // 渲染Type
    chulitype(this.value.trim());
    saul.html("");
    getSA(this.value.trim(), function (salist) {
      //记录用户原本的active
      var actli = saul.$('li.active')
      if (actli) {
        actli = {
          icon: actli.$('div.saicon').html(),
          text: actli.$('div.sa_text').text(),
        }
      }

      // 渲染搜索联想
      saul.html("");
      salist.forEach(s => {
        var li = el('li');
        li.html(`<div class="saicon">${s.icon}</div><div class="sa_text"></div>`);
        li.$('.sa_text').text(s.text);
        saul.append(li);
        li.onclick = () => {
          s.click()
        };
      });

      // 恢复用户原本的active
      if (actli) {
        saul.$$('li').forEach(li => {
          if (li.$('div.saicon').html() && li.$('div.sa_text').html() == actli.text) {
            li.addClass('active');
          }
        })
      }
    });
    doevent('input', [input.value]);
  }
  input.oninput = util.fangdou(inputInputEv, 300);
  /* * */
  inputInputEv.call(input);

  /* 集中处理keydown事件 */
  input.onkeydown = function (e) {
    if (e.key == 'Enter') {
      var actli = saul.$('li.active')
      if (actli) {
        // 当有li为ACTIVE状态时执行li.click事件
        actli.click();
      } else {
        // 否则交给core处理Enter事件
        enter(this.value);
      }
    } else if (e.key == 'ArrowUp') {
      e.preventDefault();
      // 上一个搜索联想
      var actli = saul.$('li.active')
      if (actli) {
        actli.removeClass('active');
        if (actli.prev()) {
          actli.prev().addClass('active');
        }
      }
    } else if (e.key == 'ArrowDown') {
      e.preventDefault();
      // 下一个搜索联想
      var actli = saul.$('li.active')
      if (actli) {
        if (actli.next()) {
          actli.removeClass('active');
          actli.next().addClass('active');
        }
      } else {
        saul.$('li').addClass('active');
      }
    } else if (e.key == 'ArrowRight') {
      var actli = saul.$('li.active');
      if (actli) {
        input.value = actli.$( '.sa_text').text();
        inputInputEv.call(this);
      }
    } else if (e.key == 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        if (sct.$('li.active').prev()) {
          sct.$('li.active').prev().click();
        } else {
          var lis = sct.$$('li');
          lis[lis.length - 2].click();
        }
      } else {
        if (!sct.$('li.active').next().hasClass('add')) {
          sct.$('li.active').next().click();
        } else {
          sct.$('li').click();
        }
      }

    }
  }

  var blurtimeout;
  // ...
  input.on('focus', _focus);
  function _focus() {
    clearTimeout(blurtimeout)
    searchcover.addClass('active');
    searchbox.addClass('active');
    doevent('focus', [input]);
  }
  // ...
  input.on('blur', function () {
    this.removeClass('active');
    blurtimeout = setTimeout(() => {
      if (hasmousedown) {
        mouseupf = function () {
          setTimeout(() => {
            searchcover.removeClass('active');
            searchbox.removeClass('active');
          }, 10)
        }
      } else {
        searchcover.removeClass('active');
        searchbox.removeClass('active');
      }
    })
    doevent('blur', [input]);
  });

  document.on('mousedown', _down);
  document.on('touchstart', _down);
  document.on('mouseup', _up);
  document.on('touchend', _up);
  var hasmousedown = false, mouseupf = function () { };
  function _down() {
    hasmousedown = true;
  }
  function _up() {
    hasmousedown = false;
    mouseupf();
    mouseupf = function () { }
  }

  // ...
  submit.onclick = function () {
    enter(input.value);
  }

  // 搜索引擎选择
  var sct = el('.searchtypeselector');
  sct.html('<ul></ul>');
  $('main .center').insertBefore(sct, searchpadding.next());
  function chuliSearchTypeSelector() {
    var ul = sct.$('ul');
    var nowset = searchUtil.getSearchTypeIndex();
    ul.html("");
    var list = searchUtil.getSearchTypeList();
    for (var k in list) {
      var li = el('li');
      li.html('<img/>');
      (function (li, k) {
        if (!list[k] && searchUtil.neizhi[k]) {
          list[k] = searchUtil.neizhi[k].link;
        }
        util.getFavicon(list[k], function (fav) {
          if (fav) {
            li.$('img').src = fav;
          } else {
            li.$('img').src = util.createIcon('s');
          }
        })
      })(li, k)

      li.attr('data-type', k);
      ul.append(li);
      if (k == nowset) {
        li.addClass('active');
      }
      li.onclick = function () {
        var actli = sct.$('ul li.active');
        actli && actli.removeClass('active');
        this.addClass('active');
        searchUtil.setSearchType(this.attr('data-type'));
        sct.removeClass('active');
      }
    }
    var li = el('li');
    li.addClass('add')
    li.html(util.getGoogleIcon('e145'));
    ul.append(li);
    li.onclick = function () {
      quik.searchEditor.open();
    }
    sct.style.width = ul.$$('li').length * 36 - 6 + 'px';
  }
  icon.on('click', function () {
    // 避免link遮挡底部
    if (sct.hasClass('active')) {
      sct.removeClass('active');
      $('main .links').removeClass('duan');
    } else {
      sct.addClass('active');
      $('main .links').addClass('duan');
    }
  })


  searchUtil.on('nowtypechange', function () {
    if (icon.attr('data-teshu') == ':searchtype') {
      chulitype(input.value, true);
    }
  })
  searchUtil.on('typelistchange', function () {
    chuliSearchTypeSelector();
  })
  chuliSearchTypeSelector();

  // 初始化处理（默认是搜索模式）
  chulitype('');
  gshowb();
  if (stp.ob_autofocus) {
    // @note 这样才能生效，也许是因为浏览器还没渲染好吧
    // @edit at 2024年1月30日 15点10分
    Onshow(() => {
      setTimeout(() => {
        input.focus();
        _focus();
      }, 100)
    })
  }

  if(stp.ob_alignlink){
    searchbox.addClass('alignlink');
  }

}


/**
 * 渲染指定文字的Type至页面
 * @param {String} text 
 */
function chulitype(text, isMust) {
  var i = getType(text);
  if (i.icon[0] == ':') {
    if ((!isMust) && icon.attr('data-teshu') == i.icon) return;
    icon.attr('data-teshu', i.icon);
    var _ts = chuliteshuicon(i.icon);
    if (_ts instanceof Promise) {
      _ts.then(function (r) {
        icon.html(r);
      })
    } else {
      icon.html(_ts);
    }
  } else {
    icon.html(i.icon);
    icon.removeAttribute('data-teshu');
  }
  if (i.submit[0] == ':') {
    submit.attr('data-teshu', i.submit);
    submit.html(chuliteshusubmit(i.submit));
  } else {
    submit.html(i.submit);
    submit.removeAttribute('data-teshu');
  }


}

/**
 * 渲染特殊Icon
 * @param {String} text 
 * @returns {String} iconhtmlstr
 */
function chuliteshuicon(icon) {
  if (icon == ':searchtype') {
    return new Promise(function (r, j) {
      util.getFavicon(searchUtil.getSearchType(), function (fav) {
        if (fav) {
          r('<img src="' + fav + '" style="border-radius:50%;"/>');
        } else {
          r('<img src="' + util.createIcon('S') + '" style="border-radius:50%;"/>');
        }
      })
    });
  } else {
    return '';
  }
}

/**
 * 渲染特殊SubmitIcon
 * @param {String} text 
 * @returns {String} iconhtmlstr
 */
function chuliteshusubmit(submit) {
  // 因为还没有特殊SubmitIcon
  return "";
}

if (isUd(stp.ob_autofocus)) {
  stp.ob_autofocus=false;
}


var si = new SettingItem({
  title: "自动聚焦",
  index: 1,
  type: 'boolean',
  message: "打开页面自动聚焦搜索框",
  get() {
    return !!stp.ob_autofocus;
  },
  callback(value) {
    stp.ob_autofocus=value;
    return true;
  }
})
sg.addNewItem(si);

var si2 = new SettingItem({
  title: "聚焦时背景蒙版",
  index: 6,
  type: 'boolean',
  message: "关闭后聚焦搜索框时不再出现背景蒙版",
  get() {
    return !stp.ob_notshowb;
  },
  callback(value) {
    stp.ob_notshowb = !value;
    gshowb();
    return true;
  }
})
sg.addNewItem(si2);
var si3 = new SettingItem({
  title: "背景蒙版模糊",
  index: 7,
  type: 'boolean',
  message: "背景蒙版模糊（可能会影响性能）",
  get() {
    return stp.ob_bblur;
  },
  callback(value) {
    stp.ob_bblur = value;
    gshowb();
    return true;
  }
})
sg.addNewItem(si3);

var si4 = new SettingItem({
  title: "对齐链接部分",
  index: 8,
  type: 'boolean',
  message: "使搜索框长度对齐链接部分",
  get() {
    return stp.ob_alignlink;
  },
  callback(value) {
    stp.ob_alignlink = value;
    if(value){
      searchbox.addClass('alignlink');
    }else{
      searchbox.removeClass('alignlink');
    }
    return true;
  }
})
sg.addNewItem(si4);

function gshowb() {
  if (stp.ob_notshowb) {
    searchcover.addClass('notshow');
    si3.hide();
  } else {
    searchcover.removeClass('notshow');
    si3.show();
    if (stp.ob_bblur) {
      searchcover.addClass('blur');
    } else {
      searchcover.removeClass('blur');
    }
  }
}

function uiEnable(a) {
  if (a) {
    if (!searchbox) {
      initSearchBox();
    }
    searchbox.show();
    searchpadding.style.height = '';
    si.show();
    si2.show();
    si3.show();
  } else {
    if (searchbox) {
      searchbox.hide();
    }
    searchpadding.style.height = '20px';
    si.hide();
    si2.hide();
    si3.hide();

  }
}
module.exports = {
  setValue(value) {
    input.value = value;
    input.focus();
    inputInputEv.call(input);
  },
  focus() {
    input.focus();
  },
  blur() {
    input.blur();
  },
  isblur() {
    return !input.hasClass('active');
  },
  setAutoFocus(value) {
    stp.ob_autofocus = value;
    si.reGet();
  },
  getInput() {
    return input;
  },
  uiEnable
}