(() => {
    var linkF = util.element('div', {
        class: "links"
    });

    document.addEventListener('click', resetmenued)
    document.addEventListener('contextmenu', resetmenued)

    function resetmenued() {
        getMenuedCate() && getMenuedCate().classList.remove('menued');
        getMenuedLi() && getMenuedLi().classList.remove('menued');
    }


    util.query(document, 'main .center').append(linkF);

    var linksg = new SettingGroup({
        title: "链接",
    });

    function init() {
        linkF.innerHTML = _REQUIRE_('../htmls/linkinit.html')
            .replace('{{cate-left}}', util.getGoogleIcon('e314'))
            .replace('{{cate-right}}', util.getGoogleIcon('e315'))
            .replace('{{cate-add}}', util.getGoogleIcon('e145'))
            .replace('{{mr}}', util.getGoogleIcon('e838', { type: 'fill' }))
        link.ready(() => {
            dcate(initsto.get('enabledCate'));
            dsize(initsto.get('linksize'));
            dstyle(initsto.get('linkstyle'));
            setTimeout(function () {
                linkF.style.opacity = 1;
            }, 300)
        })
        observeCate();
    }

    mainSetting.addNewGroup(linksg);

    return {
        init,
        linkF,
        linksg,
        resetmenued
    }
})();