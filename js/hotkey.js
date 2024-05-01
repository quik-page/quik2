(function(){
    document.addEventListener('keydown',function(e){
        if(e.key=='Enter'){
            omnibox.isblur()&&omnibox.focus();
        }else if(e.key=='Esc'){
            (!omnibox.isblur())&&omnibox.blur();
        }else if(e.key=='s'&&e.altKey){
            e.preventDefault();
            mainSetting.open();
        }else if(e.key=='x'&&e.altKey){
            e.preventDefault();
            lite.set(!lite.get());
        }else if(e.key=='g'&&e.altKey){
            e.preventDefault();
            link.setShowCate(!link.isShowCate());
        }
    });
})();