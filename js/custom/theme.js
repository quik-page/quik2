(function(){
    if(!initsto.get('themea')){
        initsto.set('themea','def');
    }

    var ys=['dark','t-dark','t-light','dialogblur','lite','hiden','showall'];
    var themes={
        'def':"默认主题"
    };

    var si=new SettingItem({
        index:0,
        title:"主题",
        type:"select",
        message:'',
        get:function(){
          return initsto.get('themea');
        },
        callback:function(v){
          initsto.set('themea',v);
          doTheme(v);
        },
        init:function(){
          return themes;
        }
      });
  tyGroup.addNewItem(si);

    function doTheme(f){
        if(ys.indexOf(f)!=-1){
            return;
        }
        if(!themes[f]){
            return;
        }
        document.body.classList.forEach(function(a){
            if(ys.indexOf(a)==-1){
                document.body.classList.remove(a);
            }
        })
        document.body.classList.add(f);
        return true;
    }

    function addTheme(f,n){
        themes[f]=n;
        si.reInit();
        if(wait&&f==initsto.get('themea')){
            wait=false;
        }
    }

    function removeTheme(f){
        if(f=='def'){return}
        delete themes[f]
        if(initsto.get('themea')==f){
            initsto.set('themea','def')
            si.reGet();
        }
        si.reInit();
    }

    function setTheme(f){
        if(!themes[f]){
            return;
        }
        initsto.set('themea',f);
        doTheme(f);
        si.reGet();
    }

    var wait=false;
    if(!doTheme(initsto.get('themea'))){
        wait=true;
        setTimeout(function(){
            addon.on('allrun',function(){
                if(wait){
                    initsto.set('themea','def');
                    doTheme('def');
                    alert('您的主题由于插件缺失无法显示，已为您切换为默认。');
                }
            })
        })
    }
    

    return {
        addTheme,
        removeTheme,
        setTheme
    }
})();