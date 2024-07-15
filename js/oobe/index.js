(function () {
    var initsto = storage('oobe');
    if (!initsto.get('agree')) {
        var lichtml = ignores.lic;
        var i = 0;
        var all = _REQUIRE_('./htmls/all.html');
        var parts = [_REQUIRE_('./htmls/part1.html'), _REQUIRE_('./htmls/part2.html')]
        parts.forEach(function (a, i) {
            all = all.replace('{{part' + (i + 1) + '}}', a);
        })
        all = all.replace('{{lic}}', lichtml);
        var oobeDia = new dialog({
            content: all,
            class: 'oobedia',
            mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
            clickOtherToClose: false
        })
        var d = oobeDia.getDialogDom();

        util.query(d, '.part.a1 .btn.ok').onclick = function () {
            initsto.set('agree', true);
            nextPart();
        }

        util.query(d, '.part.a1 .btn.cancel').onclick = function () {
            location.href = 'about:blank'
        }
        util.query(d, '.part.a2 .item.a').onclick = function () {
            nextPart();
        }
        util.query(d, '.part.a2 .item.b').onclick = function () {
            nextPart();
            sync.openImport();
        }
        util.query(d, '.part.a2 .item.c').onclick = function () {
            nextPart();
            sync.openQUIK1();
        }

        function nextPart() {
            if (i > 0) {
                util.query(d, '.part.a' + i).classList.remove('show');
                util.query(d, '.part.a' + i).classList.add('n');
            }
            if (i == parts.length) {
                oobeDia.close();
                showguide();
                return;
            }
            i++;
            setTimeout(function () {
                util.query(d, '.part.a' + i).classList.add('show');
            }, 200);
        }
        nextPart();
        oobeDia.open();
    }else{
        showguide();
    }
    function showguide(){
        if(!initsto.get('guided')){
            guidecreator.create([
                {
                    text:"点击左下角的"+util.getGoogleIcon('e8b8',{type:"fill"})+"就可以打开设置，你可以在设置里个性化你的QUIK起始页",
                    offset:{
                        bottom:40,
                        left:0
                    }
                },
                {
                    text:"QUIK起始页提供插件来拓展QUIK起始页的功能，点击"+util.getGoogleIcon("e87b", { type: "fill" })+"看看插件市场里是否有中意的吧",
                    offset:{
                        top:40,
                        right:40
                    }
                }
            ],function(){
                initsto.set('guided',true);
            })
        }
    }
})()