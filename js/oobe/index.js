const dialog = require('../dialog/index');
const guidecreator = require('../guidecreator');
const {gS} = require('../storage');
const util = require('../util');
const ignores=require('../ignores');
const sync=require("../sync");

var stp = gS('oobe');
if (!stp.agree) {
    var lichtml = ignores.lic;
    var i = 0;
    var all = require('./htmls/all.html');
    var parts = [require('./htmls/part1.html'), require('./htmls/part2.html')]
    parts.forEach((a, i) => {
        all = all.replace('{{part' + (i + 1) + '}}', a);
    })
    all = all.replace('{{lic}}', lichtml);
    var oobeDia = new dialog({
        content: all,
        class: 'oobedia def-size',
        mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
        clickOtherToClose: false
    })
    var d = oobeDia.getDialogDom();

    d.$('.part.a1 .btn.ok').onclick = () => {
        stp.agree = true;
        nextPart();
    }

    d.$('.part.a1 .btn.cancel').onclick = () => {
        location.href = 'about:blank'
    }
    d.$('.part.a2 .item.a').onclick = () => {
        nextPart();
    }
    d.$('.part.a2 .item.b').onclick = () => {
        nextPart();
        sync.openImport();
    }
    d.$('.part.a2 .item.c').onclick = () => {
        nextPart();
        sync.openQUIK1();
    }

    function nextPart() {
        if (i > 0) {
            d.$('.part.a' + i).removeClass('show');
            d.$('.part.a' + i).addClass('n');
        }
        if (i == parts.length) {
            oobeDia.close();
            showguide();
            return;
        }
        i++;
        setTimeout(() => {
            d.$('.part.a' + i).addClass('show');
        }, 200);
    }
    nextPart();
    oobeDia.open();
} else {
    showguide();
}
function showguide() {
    if (!stp.guided) {
        guidecreator.create([
            {
                text: "点击左下角的" + util.getGoogleIcon('e8b8', { type: "fill" }) + "就可以打开设置，你可以在设置里个性化你的QUIK起始页",
                offset: {
                    bottom: 40,
                    left: 0
                }
            },
            {
                text: "QUIK起始页提供插件来拓展QUIK起始页的功能，点击" + util.getGoogleIcon("e87b", { type: "fill" }) + "看看插件市场里是否有中意的吧",
                offset: {
                    top: 40,
                    right: 40
                }
            },
            {
                text: "主菜单中包含常用功能，有时也是插件的功能入口。",
                offset: {
                    top: 40,
                    right: 0
                }
            },
            {
                text: "单击鼠标右键或长按链接即可修改链接，点击“+”号可以添加新链接。",
                offset: {
                    bottom: window.innerHeight / 2 - 150,
                    right: window.innerWidth / 2 - 100
                }
            },
            {
                text: "开始使用QUIK起始页吧！",
                offset: {
                    bottom: window.innerHeight / 2 - 50,
                    right: window.innerWidth / 2 - 80
                }
            }
        ], () => {
            stp.guided = true;
        })
    }
}