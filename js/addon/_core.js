(function(){
  var marketData;

  function getCode(jsurl,p){
    return new Promise(function(resolve,reject){
      var xhr=new XMLHttpRequest();
      xhr.open('GET',jsurl,true);
      xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
          if(xhr.status==200){
            resolve(xhr.responseText);
          }
        }
      }
      xhr.onerror=function(){
        console.log('getCode error');
        reject(xhr.status);
      }
      xhr.onprogress=function(pr){
        p&&p(pr);
      }
      xhr.send();
    })
    
  }

  function deAddon(addon_code){
    addon_code=addon_code.trim();
    if(addon_code.indexOf('/*QUIK_ADDON ')==0){
      var meta=addon_code.substring(13,addon_code.indexOf(' */'));
      meta=meta.split('|');
      var metaver=meta[0];
      if(metaver=='1'){
        return {
          name:meta[1],
          version_code:parseInt(meta[2]),
          version:meta[3],
          desc:meta[4],
          author:meta[5],
          icon:meta[6],
          website:meta[7],
          update:meta[8],
          signature:meta[9],
          marketId:meta[10]
        }
      }else{
        return {
          error:true,
          msg:'un support meta version'
        }
      }
    }else{
      return {
        error:true,
        msg:'not QUIK addon'
      }
    }
  }

  function hasSame(signature){
    if(!signature) return false;
    var a=initsto.list();
    for(var i=0;i<a.length;i++){
      if(initsto.get(a).signature==signature){
        return true;
      }
    }
  }

  async function installAddon(code,meta,detail){
    if(typeof meta!='object'||meta.error){
      return {
        msg:"插件格式错误:"+(meta.msg||'META isn\'t an object'),
        error:true,
      }
    }else if(hasSame(meta.signature)){
      return {
        msg:"已安装相同插件",
        error:true
      }
    }else{
      var adid=util.getRandomHashCache();
      await new Promise(function(r){
        codesto.set(adid,code,true,r);
      });
      meta.id=adid;
      for(var k in detail){
        if(typeof meta[k]=='undefined'){
          meta[k]=detail[k];
        }
      }
      initsto.set(adid,meta);
      runAddon(adid);
      return {
        id:adid
      };
    }
  }

  async function checkUpdate(id){
    var addon=initsto.get(id);
    if(!addon){
      throw 'not found addon';
    }
    if(!addon.type){
      var update=addon.update;
      var nc=await fetch(update);
      nc= await nc.text();
      nc=parseInt(nc);
      if(nc>addon.version_code){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  var initsto=storage('addon',{
    sync:true,
    title:"插件",
    desc:"QUIK起始页插件数据（暂未开发完）"
  });
  var codesto=storage('addonscript');
  

  function getAddonByUrl(url){
    var as=initsto.getAll();
    for(var k in as){
      if(as[k].rootPath==url){
        return as[k];
      }
    }
  }

  function getAddonBySessionId(id){
    return initsto.get(id);
  }

  var ainstatus=['初始化','获取插件信息','下载插件','等待确认','安装插件','安装成功'];
  var ainerrors=['初始化失败','未找到插件信息','下载插件失败','插件解析错误','用户取消','安装失败'];
  function addonInstallProcess(){
    this.statuCode=0;
    this.statuMsg=ainstatus[0];
    this.progress=0;
    this.errorCode=-1;
    this.errorMsg='';
    this.result=null;
    this.ev=getEventHandle();
    this.addEventListener=this.ev.addEventListener;
    this.removeEventListener=this.ev.removeEventListener;
  }
  addonInstallProcess.prototype={
    setProgress:function(n){
      this.progress=n;
      this.ev.doevent('progress',[n]);
    },
    setStatu:function(n){
      this.statuCode=n;
      this.statuMsg=ainstatus[n];
      this.ev.doevent('statu',[{
        code:n,
        msg:ainstatus[n]
      }])
    },
    setError:function(n,m){
      this.errorCode=n;
      this.errorMsg=ainerrors[n]+' '+m;
      this.ev.doevent('error',[{
        code:n,
        msg:ainerrors[n]+' '+m
      }])
    },
    setDone:function(res){
      console.log('a');
      this.result=res;
      this.ev.doevent('done',[res]);
    },
    wait:function(d,fn){
      this.waiting=true;
      var _=this;
      this.ev.doevent('wait',[function(a){
        _.waiting=false;
        fn(a);
        _._waitfn=fn;
        _._waitd=d;
      },d]);
      this._waitfn=fn;
      this._waitd=d;
    }
  }

  function _install_end(p){
    return function(r){
      if(r.error){
        p.setError(5,r.msg);
      }else{
        p.setStatu(5);
        p.setProgress(1);
        p.setDone(r);
      }
    }
  }

  // 从官方插件市场安装
  function installByOfficialMarket(id){
    var p=new addonInstallProcess();
    if(!storage.checkIDB()){
      p.setError(0,"浏览器不支持IndexedDB");
    }
    if(!marketData){
      loadMarketData().then(getmarketData);
    }else{
      getmarketData();
    }
    function getmarketData(){
      if(marketData[id]){
        p.setProgress(0.1);
        p.setStatu(2);
        var url=marketData[id].url;
        getCode(url,function(pr){
          p.setProgress(0.1+pr*0.5);
        }).then(function(code){
          p.setProgress(0.6);
          p.setStatu(3);
          installAddon(code,deAddon(code),{
            marketId:id
          }).then(_install_end(p))
        }).catch(function(){
          p.setError(2,url);
        });
      }else{
        p.setError(1,id);
      }
    }
    return p;
  }

  // 从链接安装
  function installByUrl(url){
    var p=new addonInstallProcess();
    if(!storage.checkIDB()){
      p.setError(0,"浏览器不支持IndexedDB");
    }
    p.setProgress(0.1);
    p.setStatu(2);
    getCode(url,function(pr){
      p.setProgress(0.1+pr*0.5);
    }).catch(function(err){
      console.log(err);
      p.setError(2,url);
    }).then(function(code){
      p.setProgress(0.6);
      var meta=deAddon(code);
      if(meta.error){
        p.setError(3,meta.msg);
      }else{
        p.setStatu(3);
        p.wait({
          meta:meta,
          msg:"确定是否安装此插件？"
        },function(n){
          if(n){
            installAddon(code,meta,{
              url:url
            }).then(_install_end(p));
          }else{
            p.setError(4,'');
          }
        })
        
      }
    });
    return p;
  }

  // 从本地安装
  function installByLocal(code,p){
    var p=new addonInstallProcess();
    if(!storage.checkIDB()){
      p.setError(0,"浏览器不支持IndexedDB");
    }
    p.setProgress(0.1);
    p.setStatu(1);
    var meta=deAddon(code);
    if(meta.error){
      p.setError(3,meta.msg);
    }else{
      p.setProgress(0.5);
      p.setStatu(3);
      p.wait({
        meta:meta,
        msg:"确定是否安装此插件？"
      },function(n){
        if(n){
          installAddon(code,meta,{
            local:true
          }).then(_install_end(p));
        }else{
          p.setError(4,'');
        }
      })
    }
    return p;
  }

  // 从开发端口安装
  function installByDev(devurl){
    var adid=util.getRandomHashCache();
    initsto.set(adid,{
      name:"DEVPORT:"+devurl,
      url:devurl,
      type:"dev"
    });
    return adid;
  }

  // 插件卸载
  async function uninstall(id){
    if(initsto.get(id)){
      initsto.remove(id);
      await new Promise((r)=>codesto.remove(id,true,r));
      return true;
    }else{
      return false;
    }
  }
  
  // 插件运行
  async function runAddon(id){
    var code;
    var data=initsto.get(id);
    var script=document.createElement('script');
    if(data.type=='dev'){
      script.src=data.url+'index.js?id='+id;
      script.onerror=function(){
        alert('开发端口出错');
      }
    }else{
      code=await new Promise((r)=>codesto.get(id,true,r));
      script.innerHTML=`(function(){
        function Session(id){
          this.id="ext_"+id;
          this.session_token="Hvm_session_token_eoi1j2j";
          this.isSession=true;
        };
        var addonData={
          session:new Session('${id}')
        };
        (function(){
          ${code}
        })();
      })()`;
    }
    document.body.appendChild(script);
    
  }

  // 插件升级
  async function update(id){
    var addon=initsto.get(id);
    console.log(addon);
    if(!addon){
      return {
        error:true,
        msg:"未找到插件"
      }
    }
    if(addon.url){
      try{
        var code=await getCode(addon.url);
      }catch(e){
        return {
          error:true,
          msg:"代码请求失败",
          code:e
        }
      }
      var meta=deAddon(code);
      if(meta.error){
        return {
          error:true,
          msg:'META 解析失败:'+meta.msg
        }
      }
      if(meta.signature!=addon.signature){
        return {
          error:true,
          msg:'签名校验失败'
        }
      }
      if(meta.version_code>=addon.version_code){
        for(var k in meta){
          addon[k]=meta[k];
        }
        await new Promise(function(r){
          codesto.set(id,code,true,r);
        });
        initsto.set(id,addon);
        return {
          ok:1,id,version_code:meta.version_code
        }
      }else{
        return {
          error:true,
          msg:'版本校验失败'
        }
      }
    }else{
      return {
        error:true,
        msg:"无法升级此插件"
      }
    }
  }

  // 官方插件验证
  async function checkMarket(id,url){
    if(!marketData){
      await loadMarketData();
    }
    if(marketData[id].url==url){
      return true
    }else{
      return false;
    }
  }

  // 加载官方插件市场数据库
  async function loadMarketData(){
    // fetch(...).then(r=>r.json()).then(data=>{marketData=data});
    // 模拟数据
    marketData = {
      "000":{
        "name":"插件名称",
        "version":"1.0.0",
        "description":"插件描述",
        "author":"作者",
        "icon":"插件图标",
        "url":"插件下载链接",
      }
    }
  }

  function getAddonList(){
    return initsto.list()
  }

  getAddonList().forEach(id=>{
    if(!initsto.get(id).disabled){
      runAddon(id);
    }
  })

  function enable(id){
    var o=initsto.get(id);
    o.disabled=false;
    initsto.set(id,o)
  }
  function disable(id){
    var o=initsto.get(id);
    o.disabled=true;
    initsto.set(id,o)
  }
  function getEnable(id){
    return !initsto.get(id).disabled;
  }
  return {
    enable,
    disable,
    installByOfficialMarket,
    installByUrl,
    installByLocal,
    installByDev,
    uninstall,
    runAddon,
    checkUpdate,
    update,
    checkMarket,
    getAddonByUrl,
    getAddonBySessionId,
    getAddonList
  }
})();