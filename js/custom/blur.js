const { SettingItem, tyGroup } = require("../setting/index");
const { stp } = require("./core");
const bd=document.body;
var si = new SettingItem({
  index: 3,
  title: "毛玻璃效果",
  message: "为所有内容开启毛玻璃效果，可能会影响性能。",
  type: "boolean",
  get() {
    return !!stp.dialogblur;
  },
  callback(v) {
    stp.dialogblur = v;
    d(v);
  }
})

tyGroup.addNewItem(si);

function d(v) {
  if (v) {
    bd.addClass('dialogblur');
  } else {
    bd.removeClass('dialogblur');
  }
}

d(stp.dialogblur);
module.exports = {
  set(a) {
    a = !!a;
    stp.dialogblur=a;
    d(a);
    si.reGet();
  },
  get() {
    return stp.dialogblur;
  }
};