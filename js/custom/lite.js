const guidecreator = require("../guidecreator");
const link = require("../link/index");
const { stp } = require("../omnibox/_core");
const { SettingItem, tyGroup } = require("../setting/index");
const util = require("../util");
const bd=document.body;

if(isUd(stp.linkblur))stp.linkblur=true;
var si = new SettingItem({
  index: 2,
  title: "极简模式",
  message: "(Alt+X)隐藏所有图标和链接，点击LOGO显示",
  type: "boolean",
  get() {
    return !!stp.lite;
  },
  callback(v) {
    stp.lite=v;
    d(v);
  }
})
var si2 = new SettingItem({
  index: 3,
  title: "链接页面背景模糊",
  message: "链接页面背景一般模糊显示，关闭后正常显示",
  type: "boolean",
  get() {
    return stp.linkblur;
  },
  callback(v) {
    stp.linkblur=v;
    linkblur(v);
  }
})

tyGroup.addNewItem(si);
tyGroup.addNewItem(si2);
var liteBack = el(".liteback");

liteBack.html(util.getGoogleIcon('e5ce'));
$('main .center').appendChild(liteBack);
liteBack.on('click', () => {
  bd.removeClass('showall');
  bd.addClass('hiden');
})

function d(v) {
  bd.removeClass('hiden');
  bd.removeClass('showall');
  if (v) {
    bd.addClass('lite');
    bd.addClass('hiden');
    si2.show();
    if (!stp.lite_firsted) {
      var imglogopos = $('main .logo .imglogo').getRect();
      guidecreator.create([{
        text: "点击LOGO就可以显示链接和所有图标",
        offset: window.innerWidth > 600 ? {
          top: imglogopos.top,
          left: imglogopos.left + imglogopos.width + 10
        } : {
          top: imglogopos.top + imglogopos.height + 10,
          left: imglogopos.left
        }
      }], function () {
        stp.lite_firsted = true;
      })
    }
  } else {
    bd.removeClass('lite');
    link.cateWidthShiPei();
    si2.hide();
  }
}

function linkblur(v) {
  if (v) {
    $('main').removeClass('noblur');
  } else {
    $('main').addClass('noblur');
  }
}

$("main .center .logo").on('click', () => {
  bd.addClass('showall');
  bd.removeClass('hiden');
  link.cateWidthShiPei();
})

d(stp.lite);
linkblur(stp.linkblur);
module.exports = {
  set(a) {
    a = !!a;
    stp.lite=a;
    d(a);
    si.reGet();
  },
  get() {
    return stp.lite;
  }
};
