(function(){
    var initsto=storage('safe');
    window.addEventListener('hashchange',hashcl);
    function hashcl(){
        var hash=location.hash;
        if(hash=='#clearAll'){
            confirm('确定要清除所有数据吗？',function(r){
            if(r){
                function c(){
                    prompt('请在下方输入“clearAll”，并再次确定是否要清除所有数据，此操作无法恢复。',function(t){
                        if(t=='clearAll'){
                            localStorage.clear();
                            localforage.clear().then(function(){
                                location.reload();
                            });
                            location.hash='';
                        }else if(!t){
                            
                        }else{
                            c();
                        }
                    })
                }
                c(); 
            } 
            });
        }else if(hash=='#safe'){
            location.hash='';
            window.addon_=false;
            alert('已阻止所有插件运行');
        }
    }
    hashcl();

    var gaoji=new SettingGroup({
        title:"高级",
        index:5
    })

    var xnse=new SettingItem({
        title:"性能模式",
        message:"强制关闭所有滤镜和动画效果",
        index:1,
        type:"boolean",
        get:function(){
            return !!initsto.get('xnse')
        },
        callback:function(n){
            initsto.set('xnse',n);
            doxnse(n);
        }
    });
    gaoji.addNewItem(xnse);

    var clse=new SettingItem({
        title:"清除数据",
        message:"清除QUIK起始页的所有数据",
        index:2,
        type:"null",
        callback:function(n){
            location.hash='#clearAll';
        }
    });
    gaoji.addNewItem(clse);

    mainSetting.addNewGroup(gaoji);

    function doxnse(n){
        if(n){
            var s=util.element('style');
            s.id='xnse';
            s.innerHTML='*{filter:none!important;backdrop-filter:none!important;animation:none!important;transition:none!important;}';
            document.head.append(s);
        }else{
            try {
                document.getElementById('xnse').remove(); 
            } catch (error) {}
        }
    }

    doxnse(!!initsto.get('xnse'));

    window.addEventListener('offline',ckline)
    window.addEventListener('online',ckline)

    var offlineIcon=new iconc.icon({
        content:util.getGoogleIcon('f239'),
        offset:"br",
        important:true
    })
    offlineIcon.getIcon().style.color='red';

    var offlineNotice=new notice({
        title:"断网提醒",
        content:"您的网络已断开，请尽快重连！"
    })

    function ckline(){
        if(!window.navigator.onLine){
            offlineNotice.show()
            offlineNotice.focus();
            offlineIcon.show();
        }else{
            offlineNotice.hide();
            offlineIcon.hide();
        }
    }

    ckline();
})();