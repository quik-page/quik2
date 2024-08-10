(function(){
    var initsto=setting.settingSto;
    var eventHandle=getEventHandle();
    var on=eventHandle.on;
    var off=eventHandle.off;
    var doevent=eventHandle.doevent;
    var lite=_REQUIRE_('./lite.js');
    var logo=_REQUIRE_('./logo.js');
    var color=_REQUIRE_('./color.js');
    var theme=_REQUIRE_('./theme.js');
    var dialogblur=_REQUIRE_('./blur.js');

    return {
        setLite:lite.set,
        isLite:lite.get,
        getColor:color.getTheme,
        setColor:color.setTheme,
        setTheme:theme.setTheme,
        addTheme:theme.addTheme,
        removeTheme:theme.removeTheme,
        isTimeLogo:function(){
            return logo.get()=='b'
        },
        setTimeLogo:function(){
            logo.set('b')
        },
        getLogo:logo.get,
        setLogo:logo.set,
        isDialogBlur:dialogblur.get,
        setDialogBlur:dialogblur.set,
        on,off,
        waitdotheme:theme.waitdotheme
    }
})();