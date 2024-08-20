(()=>{
    document.addEventListener('keydown',function(e){
        if(e.key=='s'&&e.altKey){
            e.preventDefault();
            mainSetting.open();
        }else if(e.key=='x'&&e.altKey){
            e.preventDefault();
            custom.setLite(!custom.isLite());
        }else if(e.key=='g'&&e.altKey){
            e.preventDefault();
            link.setShowCate(!link.isShowCate());
        }
    });
})();