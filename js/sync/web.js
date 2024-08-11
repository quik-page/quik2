(function(){
    // websync

    var initsto=storage('websync');
    console.log(initsto.getAll());
    if(!initsto.get('wait')){
        initsto.set('wait',[]);
    }
    var nsyncM=initsto.get('yesid');
    var syncM;
    function registerWebSync(syncM,session,cb){
        if(!util.checkDetailsCorrect(syncM,['isLogin','login','getLastReq','getAll','update','updateAll'])){
            cb({
                code:-2,
                msg:"格式不正确"
            });
            return;
        }
        if(!util.checkSession(session)){
            cb({
                code:-3,
                msg:"session不正确"
            });
            return;
        }
        if(nsyncM!=session.id){
            confirm('插件 "'+addon.getAddonById(session.id)+'" 申请提供数据云同步功能，是否同意？',function(r){
                if(r){
                    nsyncM=session.id;
                    initsto.set('yesid',nsyncM);
                    initsto.remove('last_req')
                    cb({
                        code:0,
                        msg:"OK"
                    });
                    startSync(syncM);
                }else{
                    cb({
                        code:-1,
                        msg:"用户取消"
                    });
                }
            });
        }else{
            cb({
                code:0,
                msg:"OK"
            });
            startSync(syncM).catch(function(e){
                new notice({
                    title:"云同步",
                    content:"云同步初始化失败，请检查网络连接后刷新"
                }).show();
                console.log(e);
            });
        }
    }

    function unregister(session){
        if(!util.checkSession(session)){
            cb({
                code:-3,
                msg:"session不正确"
            });
            return;
        }
        if(nsyncM==session.id){
            initsto.remove('yesid');
            initsto.remove('last_req');
            console.log(initsto.getAll());
            location.reload();
        }
    }

    function isSync(){
        return !!nsyncM;
    }

    async function startSync(a){
        syncM=a;
        var isLogin=await syncM.isLogin();
        if(!isLogin){
            await syncM.login();
        }
        if(isNewNow()){
            await updateAll();
        }else{
            await syncData();
        }
        listenData();
    }

    function isNewNow(){
        var hash=location.hash.slice(1);
        if(hash.indexOf(';')!=-1){
            hash=hash.split(';')[1]
        }
        if(hash=='newnow'){
            return true;
        }
    }

    var syncConfictDialog=new dialog({
        content:`<div>
            <p>您的在线存档与本地存档存在冲突:</p>
            <p class="last_req"></p>
            <p>你要：</p>
        </div>
        <div class="btns">
            <div class="btn ok">从在线同步</div>
            <div class="btn cancel">本地覆盖在线</div>
        </div>`
    })

    var syncIcon=new iconc.icon({
        content:util.getGoogleIcon('eb5a'),
        offset:"br",
        important:true
    })
    syncIcon.hide();

    function syncData(){
        return new Promise(function(r,j){
            syncM.getLastReq().then((last_req)=>{
                console.log(last_req,initsto.get('last_req'));
                if(last_req!=initsto.get('last_req')){
                    var d=syncConfictDialog.getDialogDom();
                    if(last_req=='no'){
                        updateAll();
                    }else{
                        var _a=new Date(last_req).toLocaleString()+"的更改"
                        util.query(d,'.last_req').innerText=_a;
                        util.query(d,'.btn.ok').onclick=function(){
                            getData();
                        }
                        util.query(d,'.btn.cancel').onclick=function(){
                            updateAll().then(r).catch(j);
                        }
                        syncConfictDialog.open();
                    }
                }else{
                    r()
                    console.log('syncis');
                }
            }).catch(j);
        })
    }

    async function updateAll(){
        syncIcon.show();
        var al=getStorageList();
        var a=await getJSON(Object.keys(al).filter((v)=>{
            return al[v]?al[v].sync:false;
        }));
        var reqId=Date.now();
        await syncM.updateAll(a,reqId);
        initsto.set('last_req',reqId);
        syncIcon.hide();
    }

    async function getData(){
        var _d=new dialog({
            content:"获取中。。。"
        })
        _d.open();
        var a=await syncM.getAll();
        _d.close();
        _importData(a);
    }

    function listenData(){
        console.log('listen');
        var o=initsto.get('wait');
        if(o.length>0){
            syncIcon.show();
        }
        for(var i=0;i<o.length;i++){
            if(!o[i].sp){
                o[i].value=storage(o[i].key).getAll();
            }
            syncChange(o[i]);
        }
        storage.on('websync',function(e){
            console.log('websync');
            var reqId=Date.now();
            e.id=reqId
            pushChange(e);
            syncChange(e);
            console.log('ps');
        })
    }


    function syncChange(e){
        syncM.update(e,function(reqId){
            if(reqId){
                initsto.set('last_req',reqId);
                dealChange(reqId);
            }else{
                new notice({
                    title:"云同步",
                    content:"数据（"+new Date(reqId).toLocaleString()+"的更改）同步失败了，是否重试？",
                    btns:[{
                        text:"确定",
                        click:function(){
                            syncChange(e);
                        }
                    },{
                        text:"取消",
                        click:function(){}
                    }]
                }).show();
            }
        })
    }

    function pushChange(e){
        console.log('pushChange');
        var o=initsto.get('wait');
        if(e.sp){
            o.push(e);
        }else{
            o.push({
                key:e.key,
                id:e.id
            })
        }
        initsto.set('wait',o);
        syncIcon.show();
        console.log('show');
    }

    function dealChange(id){
        initsto.set('last_req',id);
        var o=initsto.get('wait');
        for(var i=0;i<o.length;i++){
            if(o[i].id==id){
                o.splice(i,1);
                break;
            }
        }
        initsto.set('wait',o);
        console.log(o,id);
        if(o.length==0){
            syncIcon.hide();
        }
    }
    return {
        registerWebSync,
        unregister,
        isSync
    };


})();