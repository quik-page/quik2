const { SettingItem, tyGroup } = require("../setting/index");
const util = require("../util");
const { stp } = require("./core");

var logoF = $('main .center .logo');
// timelogo can be removed 
if (!stp.logo) {
  stp.logo='a';
}
var si = new SettingItem({
  index: 4,
  title: "LOGO样式",
  message: "切换LOGO显示的内容",
  type: "select",
  init() {
    return {
      a: "普通LOGO",
      b: "LED时间",
      c: "空"
    }
  },
  get() {
    return stp.logo;
  },
  callback(v) {
    stp.logo = v;
    d(v);
  }
})

var sitime = new SettingItem({
  index: 5,
  title: "显示日期",
  message: "开启后时间LOGO下方将显示日期",
  type: "boolean",
  get() {
    return !!stp.timelogo_x;
  },
  callback(v) {
    stp.timelogo_x = v;
    dtx(v);
  }
})

logoF.$('.timelogo .h').innerHTML = logoF.$('.timelogo .m').innerHTML = createNum() + createNum();
function createNum() {
  var h = '';
  for (var i = 0; i < 7; i++) {
    h += '<div class="num_line a' + i + '"></div>'
  }
  return '<div class="_num">' + h + '</div>'
}

function setNum(_num, num) {
  var m = {
    0: "1110111",
    1: "0010010",
    2: "1011101",
    3: "1011011",
    4: "0111010",
    5: "1101011",
    6: "1101111",
    7: "1010010",
    8: "1111111",
    9: "1111011"
  }
  var f = m[num];
  for (var i = 0; i < 7; i++) {
    var _l = _num.$('.a' + i);
    if (f[i] == '1') {
      _l.addClass('show');
    } else {
      _l.removeClass('show');
    }
  }
}

var isdotime = false;
function doTime() {
  if (isdotime) return;
  isdotime = true;
  var z = () => {
    var da = new Date();
    var h = util.b0(da.getHours()).toString();
    var m = util.b0(da.getMinutes()).toString();
    var hs = logoF.$$('.timelogo .h ._num')
    var ms = logoF.$$('.timelogo .m ._num')
    setNum(hs[0], h[0]);
    if (h[0] == '1') {
      logoF.$('.timelogo .t').style.marginLeft = '-13px';
    } else {
      logoF.$('.timelogo .t').style.marginLeft = '';
    }
    setNum(hs[1], h[1]);
    setNum(ms[0], m[0]);
    setNum(ms[1], m[1]);
  }
  setInterval(z, 1000);
  z();
  var xxxx = el(".xxxx");
  logoF.$('.timelogo').append(xxxx);
  var da = new Date();
  xxxx.innerHTML = da.getFullYear() + ' 年 ' + (da.getMonth() + 1) + ' 月 ' + da.getDate() + ' 日 星期' + '日一二三四五六'[da.getDay()];
  dtx(stp.timelogo_x);
}
function dtx(v) {
  if (!isdotime) return;
  if (v) {
    logoF.$('.timelogo').addClass('showxx');
  } else {
    logoF.$('.timelogo').removeClass('showxx');
  }
}

function d(v) {
  logoF.$('.timelogo').hide();
  logoF.$('.imglogo').hide();
  sitime.hide();
  if (v == 'a') {
    logoF.$('.imglogo').show();
  } else if (v == 'b') {
    logoF.$('.timelogo').show();
    doTime();
    sitime.show();
  }

}
d(stp.logo);

tyGroup.addNewItem(si);
tyGroup.addNewItem(sitime);
if (stp.logo != 'b') {
  sitime.hide();
}

module.exports = {
  set(a) {
    stp.logo=a;
    d(a);
    si.reGet();
  },
  get() {
    return stp.logo;
  }
}