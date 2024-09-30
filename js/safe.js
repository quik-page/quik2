(()=>{
    var initsto=storage('safe');
    window.addEventListener('hashchange',hashcl);
    window.addEventListener('visibilitychange',()=>{
        if(document.visibilityState=='hidden'){
            document.body.style.display='none';
        }else{
            document.body.style.display='block';
            link.cateWidthShiPei();
        }
    })
    function hashcl(){
        var hash=location.hash.slice(1),cjhash;
        if(hash.indexOf(';')!=-1){
            cjhash=hash.split(';')[0];
            hash=hash.split(';')[1];
        }
        if(hash=='safe'){
            location.hash='#'+(cjhash?cjhash+';':'');
            window.addon_=true;
            alert('已阻止所有插件运行，请修改设置或删除插件');
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
        get(){
            return !!initsto.get('xnse')
        },
        callback(n){
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
        callback(){
            confirm('确定要清除所有数据吗？',r=>{
                if(r){
                    function c(){
                        prompt('请在下方输入“clearAll”，并再次确定是否要清除所有数据，此操作无法恢复。',t=>{
                            if(t=='clearAll'){
                                var k=storage('oobe')
                                var s=k.getAll();
                                localStorage.quik2=JSON.stringify({
                                    oobe:s
                                })
                                localforage.clear().then(()=>{
                                    location.reload();
                                });
                            }else{
                                t&&c();
                            }
                        })
                    }
                    c(); 
                } 
                });
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

    var txs=[
        "当前你使用的QUIK扩展使用的网页源为国外的Github Pages，国内访问不太稳定，建议在扩展页面将页面源更换为<b>quik.42web.io</b>，在更换前记得导出数据<br>如果你没有找到该设置，请到<a href='https://quik.42web.io/intro/' target='_blank'>首页</a>下载最新版本的QUIK扩展",
        "当前你使用的是QUIK起始页的Github Pages站点，国内访问不太稳定，建议切换至国内访问速度更快的quik.42web.io，在切换前记得导出数据"
    ]
    if(!initsto.get('ext_notice')){
        if(!window.isDev){
            if(window.location.hostname.indexOf('github.io')){
                if(window.isExt){
                    setTimeout(()=>{
                        new notice({
                            title:"提醒",
                            content:txs[0]
                            ,btns:[{
                                text:"确定",
                                style:"ok",
                                click:()=>{
                                    initsto.set('ext_notice',1);
                                    sync.openExport();
                                }
                            },{
                                text:"取消",
                                click:()=>{
                                    initsto.set('ext_notice',1);
                                }
                            }]
                        }).show();
                    }) 
                }else{
                    setTimeout(()=>{
                        new notice({
                            title:"提醒",
                            content:txs[1]
                            ,btns:[{
                                text:"确定",
                                style:"ok",
                                click:()=>{
                                    initsto.set('ext_notice',1);
                                    window.open('https://quik.42web.io/');
                                    sync.openExport();
                                }
                            },{
                                text:"取消",
                                click:()=>{
                                    initsto.set('ext_notice',1);
                                }
                            }]
                        }).show();
                    }) 
                }
                
            }
        }
        
    }
    

    
    
})();