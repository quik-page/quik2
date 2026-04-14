const { SettingItem } = require("../../setting/index");
const { gS } = require("../../storage");
const util = require("../../util");
const { addNewSA,stp, sg } = require("../_core");
const { setValue } = require("../_ui");

var si = new SettingItem({
    title: "历史记录",
    index: 2,
    type: 'boolean',
    message: "开启后，搜索框为空时将显示历史记录（300字以上不计入，最多15条）",
    get() {
        return !!stp.ob_his;
    },
    callback(value) {
        stp.ob_his = value;
        return true;
    }
})

let hisstp=gS("omhis");
if(hisstp.his==undefined){
    hisstp.his=[];
}

sg.addNewItem(si);
addNewSA({
    check(text) {
        return (!!stp.ob_his) && !text;
    },
    get(text, getsa) {
        var a = getsa();
        var his = hisstp.his;
        for (let i = 0; i < his.length; i++) {
            a.push({
                icon:util.getGoogleIconByString('history'),
                text:his[i],
                click(){
                    setValue(his[i]);
                }
            })
        }
        return a;
    }
});

module.exports = si;