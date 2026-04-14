// 快捷键

let { mainSetting } = require('./setting/index.js');
let {setLite,isLite}=require('./custom/index.js');
let {setShowCate,isShowCate}=require('./link/index.js');

document.on('keydown', function (e) {
    if (e.key == 's' && e.altKey) { // Alt+S打开设置
        e.preventDefault();
        mainSetting.open();
    } else if (e.key == 'x' && e.altKey) { //Alt+X开关极简模式
        e.preventDefault();
        setLite(!isLite());
    } else if (e.key == 'g' && e.altKey) { //Alt+G开关链接分组
        e.preventDefault();
        setShowCate(!isShowCate());
    }
});