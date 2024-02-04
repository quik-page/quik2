(function(){
  var addon_icon=new iconc.icon({
    offset:"tr",
    content:util.getGoogleIcon("e87b",{type:"fill"})
  });
  addon_icon.getIcon().onclick=function(){
    // TODO:open dialog
  }

  var initsto=storage('addon');
  if(!initsto.get('list')){
    initsto.set('list',{});
  }
  var initscripts=storage('addon_script');
  function installAddon(manifest_url){
    util.xhr(manifest_url,function(res){
      try{
        var manifest=JSON.parse(res);
      }catch(e){
        console.error('安装失败，无效的manifest');
        return;
      }
      if(!manifest.url){
        console.error('安装失败，manifest中没有url字段');
        return;
      }
      var addon_session=getSession();
      insertAddon(manifest,addon_session);
    })
  }

  function insertAddon(m,s){
    var a=initsto.get('list');
    a[s.id]=m;
    initsto.set('list',a);
    util.xhr(m.url,function(res){
      initscripts.set(s.id,res,true,function(){
        runAddon(s.id);
      });
    })
  }

  function runAddon(id){
    initscripts.get(id,true,function(res){
      var sc=document.createElement('script');
      sc.innerHTML=`!function(){
        quik.addonPush=function(fn){
          function Session(id){
            this.id=id;
            this.session_token="Hvm_session_token_eoi1j2j";
            this.isSession=true;
          }
          fn({
            session:new Session("${id}"),
          })
        };
        ${res};
      }()`;
      document.body.appendChild(sc);
    })
  }

  function initAddon(){
    initscripts.list().forEach(function(id){
      runAddon(id);//运行插件
    })
  }
  initAddon();

  function getSession(){
    function Session(){
      this.id="ext_"+util.getRandomHashCache();
      this.session_token="Hvm_session_token_eoi1j2j";
      this.isSession=true;
    }
    return new Session();
  }

  
  return {
    installAddon
  }
})();