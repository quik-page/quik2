(function(){
    var initsto=storage('custom',{
        sync:true,
        title:"个性化设置",
        desc:"主题颜色、极简模式、自定义LOGO等"
    });
    var eventHandle=getEventHandle();
    var on=eventHandle.on;
    var off=eventHandle.off;
    var doevent=eventHandle.doevent;
    var lite=_REQUIRE_('./lite.js');
    var logo=_REQUIRE_('./logo.js');
    var theme=_REQUIRE_('./theme.js');

    return {
        setLite:lite.set,
        isLite:lite.get,
        getTheme:theme.getTheme,
        setTheme:theme.setTheme,
        isTimeLogo:logo.get,
        setTimeLogo:theme.set,
        on,off
    }
})();