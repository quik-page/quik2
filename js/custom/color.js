const { SettingItem, tyGroup } = require("../setting/index");
const toast = require("../toast");
const { on, off,stp,doevent } = require("./core");
const bd=document.body;
var n = null;
if (!stp.theme) {
  stp.theme="a";
}
var si = new SettingItem({
  index: 1,
  title: "主题颜色",
  type: "select",
  message: '',
  get() {
    return stp.theme;
  },
  callback(v) {
    stp.theme=v;
    checkTheme(v);
  },
  init() {
    return {
      a: '浅色', b: '深色', c: '跟随时间', d: "跟随系统"
    }
  }
});

tyGroup.addNewItem(si);

var _g = 3;
function checkTheme(v) {
  if (_g != 3) { _g = false; }
  if (v == 'b') {
    bd.addClass('dark');
    doevent('colorchange', ['dark']);
    n = 'dark';
  } else if (v == 'a') {
    bd.removeClass('dark');
    doevent('colorchange', ['light']);
    n = 'light'
  } else if (v == 'c') {
    if (new Date().getHours() >= 18 || new Date().getHours() < 6) {
      bd.addClass('dark');
      doevent('colorchange', ['dark']);
      n = 'dark';
    } else {
      bd.removeClass('dark');
      doevent('colorchange', ['light']);
      n = 'light'
    }
  } else if (v == 'd') {
    if (window.matchMedia) {
      if (_g == 3) {
        _g = true;
        listenTheme();
      } else {
        _g = true;
      }
    } else {
      toast.show('你的浏览器不支持此功能');
    }
  }
}
function listenTheme() {
  var d = window.matchMedia('(prefers-color-scheme: dark)');
  d.matches ? bd.addClass('dark') : bd.removeClass('dark');
  d.addEventListener('change', e => {
    if (e.matches) {
      bd.addClass('dark');
      doevent('colorchange', ['dark']);
      n = 'dark';
    } else {
      bd.removeClass('dark');
      doevent('colorchange', ['light']);
      n = 'light'
    }
  });
}

checkTheme(stp.theme);

function getTheme() {
  return n;
}
module.exports = {
  setTheme(v) {
    stp.theme=v;
    checkTheme(v);
    si.reGet();
  },
  on,
  off,
  getTheme,
}