(function(){
  var marketData;
  var ERRCODES={
    GET_CODE_FAILED:-1,
    GET_MANIFEST_FAILED:-2,
    NO_DB_SUPPORT:-3,
    MANIFEST_ERROR:-4,
    NO_ADDON_FOUND:-5,
    NO_UPDATE_SUPPORT:-6
  }

  async function getCode(jsurl){
    const r = await fetch(jsurl);
    return await r.text();
  }

  var initsto=storage('addon',{
    sync:true
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

  async function fetchAddon(url,update=false){
    if(!update){
      var ck=getAddonByUrl(url);
      if(ck){
        return {
          msg:"OK",
          code:0,
          data:{
            id:ck.id
          }
        }
      }
    }
    
    if(!url.endsWith('/')) url=url+'/';
    try{
      var manifest=await fetch(url+'manifest.json');
    }catch(e){
      throw new Error(JSON.stringify({
        msg:"获取插件manifest失败",
        code:ERRCODES.GET_MANIFEST_FAILED,
        err:e
      }))
    }
    try{
      var data=await manifest.json();
    }catch(e){
      throw new Error(JSON.stringify({
        msg:"插件manifest格式错误",
        code:ERRCODES.MANIFEST_ERROR,
        err:e
      }));
    }
    var code;
    if(data.main){
      try{
        code=await getCode(data.main);
      }catch(e){
        throw new Error(JSON.stringify({
          msg:"获取插件代码失败",
          code:ERRCODES.GET_CODE_FAILED,
          err:e
        }))
      }
    }else{
      throw new Error(JSON.stringify({
        msg:"插件manifest格式错误",
        code:ERRCODES.MANIFEST_ERROR,
        err:'manifest.main 缺失'
      }));
    }
    data.rootPath=url;
    return {data,code};
  }

  async function install(data,code,cldatafn){
    var adid=util.getRandomHashCache();
    await new Promise(function(r){
      codesto.set(adid,code,true,r);
    });
    data.id=adid;
    if(cldatafn){
      cldatafn(data);
    }
    initsto.set(adid,data);
    return adid;
  }

  // 从官方插件市场安装
  async function installByOfficialMarket(id,p){
    var p_pr=p.progress||function(){};
    if(!storage.checkIDB()){
      throw new Error(JSON.stringify({
        msg:"浏览器不支持IndexedDB",
        code:ERRCODES.NO_DB_SUPPORT
      }))
    }
    p_pr({
      progress:0,
      message:"加载插件市场数据..."
    })
    if(!marketData){
      await loadMarketData();
    }
    
    if(marketData[id]){
      p_pr({
        progress:0.1,
        message:"获取插件数据..."
      })
      var url=marketData[id].url;
      var {data,code}=await fetchAddon(url);
      p_pr({
        progress:0.55,
        message:"安装插件..."
      })
      var adid=await install(data,code,function(data){
        data.marketId=id;
      });
      p_pr({
        progress:1,
        message:"安装完成"
      })
      return {
        msg:"OK",
        code:0,
        data:{
          id:adid,
          marketId:id
        }
      } 
    }else{
      throw new Error(JSON.stringify({
        msg:"插件未找到",
        code:ERRCODES.NO_ADDON_FOUND
      }))
    }
  }

  // 从链接安装
  async function installByUrl(url,p){
    var p_pr=p.progress||function(){};
    if(!storage.checkIDB()){
      throw new Error(JSON.stringify({
        msg:"浏览器不支持IndexedDB",
        code:ERRCODES.NO_DB_SUPPORT
      }))
    }
    p_pr({
      progress:0.2,
      message:"加载插件数据..."
    });
    var {data,code}=await fetchAddon(url);
    p_pr({
      progress:0.65,
      message:"安装插件..."
    });
    var adid=await install(data,code);
    p_pr({
      progress:1,
      message:"安装完成"
    });
    return {
      msg:"OK",
      code:0,
      data:{
        id:adid
      }
    }
  }

  // 从本地安装
  async function installByLocal(code,name,p){
    var p_pr=p.progress||function(){};
    if(!storage.checkIDB()){
      throw new Error(JSON.stringify({
        msg:"浏览器不支持IndexedDB",
        code:ERRCODES.NO_DB_SUPPORT
      }))
    }
    p_pr({
      progress:0.5,
      message:"安装插件..."
    });
    var adid=install({
      name,type:'local'
    },code);
    p_pr({
      progress:1,
      message:"安装完成"
    });
    return {
      msg:"OK",
      code:0,
      data:{
        id:adid
      }
    }
  }

  // 从开发端口安装
  async function installByDev(devurl){
    var adid=util.getRandomHashCache();
    initsto.set(adid,{
      name:"DEVPORT:"+devurl,
      url:devurl,
      type:"dev"
    });
    return {
      msg:"OK",
      code:0,
      data:{
        id:adid
      }
    }
  }

  // 插件卸载
  async function uninstall(id){
    if(initsto.get(id)){
      initsto.remove(id);
      await new Promise((r)=>codesto.remove(id,true,r));
      return {
        msg:"OK",
        code:0,
        data:{
          id:id
        }
      }
    }else{
      throw new Error(JSON.stringify({
        msg:"插件未安装",
        code:ERRCODES.NO_ADDON_FOUND
      }))
    }
    

  }
  
  // 插件运行
  async function runAddon(id){
    var code;
    var data=initsto.get(id);
    if(data.type=='dev'){
      code=await getCode(data.url+'index.js');
    }else{
      code=await new Promise((r)=>codesto.get(id,true,r));
    }
    var script=document.createElement('script');
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
    document.body.appendChild(script);
  }

  // 插件升级
  async function checkAddonUpdate(id){
    var data=initsto.get(id);
    if(!data){
      throw new Error(JSON.stringify({
        msg:"插件未安装",
        code:ERRCODES.NO_ADDON_FOUND
      }))
    }
    if(!data.type){
      try{
        var manifest=await fetch(url+'manifest.json');
      }catch(e){
        throw new Error(JSON.stringify({
          msg:"获取插件manifest失败",
          code:ERRCODES.GET_MANIFEST_FAILED,
          err:e
        }))
      }
      try{
        var ndata=await manifest.json();
      }catch(e){
        throw new Error(JSON.stringify({
          msg:"插件manifest格式错误",
          code:ERRCODES.MANIFEST_ERROR,
          err:e
        }));
      }
      if(data.version&&ndata.version!=data.version){
        var code;
        if(ndata.main){
          try{
            code=await getCode(ndata.main);
          }catch(e){
            throw new Error(JSON.stringify({
              msg:"获取插件代码失败",
              code:ERRCODES.GET_CODE_FAILED,
              err:e
            }))
          }
        }else{
          throw new Error(JSON.stringify({
            msg:"插件manifest格式错误",
            code:ERRCODES.MANIFEST_ERROR,
            err:'manifest.main 缺失'
          }));
        }
        ndata.rootPath=url;
        ndata.id=id;
        if(data.marketId){
          ndata.marketId=data.marketId;
        }
        initsto.set(id,ndata);
        await new Promise(r=>codesto.set(id,code,true,r));
        return {
          msg:"OK",
          code:0,
          data:{
            id:id,
            oldversion:data.version,
            newversion:ndata.version
          }
        }
      }else{
        return{
          msg:"插件已最新",
          code:1,
          data:{
            id:id
          }
        }
      }
    }else{
      throw new Error(JSON.stringify({
        msg:"本地和开发端口插件不支持升级",
        code:ERRCODES.NO_UPDATE_SUPPORT,
        data:{
          id:id
        }
      }))
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

  return {
    installByOfficialMarket,
    installByUrl,
    installByLocal,
    installByDev,
    uninstall,
    runAddon,
    checkAddonUpdate,
    checkMarket,
    getAddonByUrl,
    getAddonBySessionId,
    getAddonList
  }
})();