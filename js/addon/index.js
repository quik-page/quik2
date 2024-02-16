(function(){
  var eventfns={
    initdone:[]
  }
  var _isinitdone=false;
  var addon_dialog=new dialog({
    content:(_REQUIRE_('./addon_list.mb.html')).replace('{{close-btn}}',util.getGoogleIcon('e5cd')),
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
    class:"addon-dialog"
  });

  var addon_dialog_d=addon_dialog.getDialogDom();
  util.query(addon_dialog_d,'.closeBtn').addEventListener('click',()=>{
    addon_dialog.close();
  });

  var addon_icon=new iconc.icon({
    offset:"tr",
    content:util.getGoogleIcon("e87b",{type:"fill"})
  });
  addon_icon.getIcon().onclick=function(){
    addon_dialog.open();
  }

  var initsto=storage('addon',{
    sync:true
  });
  if(!initsto.get('list')){
    initsto.set('list',{});
  }
  var initscripts=storage('addon_script');
  function installAddon(manifest_url,cb){
    if(!manifest_url||typeof manifest_url!='string'){
      return;
    }
    var l=initsto.get('list');
    for(var k in l){
      if(l[k].url==manifest_url){
        cb({
          code:1,
          msg:"该插件已经安装"
        });
        return;
      }
    }
    util.xhr(manifest_url,function(res){
      try{
        var manifest=JSON.parse(res);
      }catch(e){
        cb({
          code:-3,
          msg:'安装失败，无效的manifest'
        });
        return;
      }
      if(!manifest.url){
        cb({
          code:-2,
          msg:'安装失败，manifest中没有url字段'
        });
        return;
      }
      var addon_session=getSession();
      insertAddon(manifest_url,manifest,addon_session,function(code){
        if(code==0){
          cb({
            code:0,
            msg:'安装成功'
          });
        }else if(code==-1){
          cb({
            code:code,
            msg:'安装失败，脚本请求失败'
          })
        }
      });
    },function(){
      cb({
        code:-4,
        msg:'安装失败，manifest请求失败'
      });
    })
  }

  function uninstallAddon(session_id,cb){
    if(!initsto.get('list')[session_id]){
      cb({
        code:-1,
        msg:'卸载失败，未找到该插件'
      })
    }else{
      var l=initsto.get('list');
      delete l[session_id];
      initsto.set('list',l);
      initscripts.remove(session_id,true,function(){
        cb({
          code:0,
          msg:"卸载成功"
        });
      })
    }
  }

  function insertAddon(u,m,s,cb){
    util.xhr(m.url,function(res){
      var a=initsto.get('list');
      a[s.id]={
        url:u,
        manifest:m
      };
      initsto.set('list',a);
      initscripts.set(s.id,res,true,function(){
        cb(0);
        runAddon(s.id);
      });
    },function(){
      cb(-1)
    })
  }

  function runAddon(id){
    return new Promise(function(r,j){
      initscripts.get(id,true,function(res){
        if(!res){
          j();
        }
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
        setTimeout(function(){
          r();
        })
      })
    })
    
  }

  function initAddon(){
    var n=[];
    initscripts.list().forEach(function(id){
      n.push(runAddon(id));//运行插件
    })
    Promise.all(n).finally(function(){
      _isinitdone=true;
      doevent('initdone',[]);
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

  function getAddonList(){
    return initsto.get('list');
  }


  function addEventListener(event,cb){
    if(eventfns[event]){
      eventfns[event].push(cb);
    }else{
      eventfns[event]=[cb];
    }
  }

  function doevent(event,data){
    eventfns[event].forEach(function(fn){
      fn.apply(null,data);
    });
  }
  function isinitdone(){
    return _isinitdone
  }

  function syncAddon(cb){
    var l=getAddonList();
    var il=0,ll=Object.keys(l).length;
    if(ll==0){cb()}
    for(var id in l){
      if(initscripts.get(id)){
        il++;
        a();
        continue;
      }
      util.xhr(l[id].url,function(res){
        initscripts.set(id,res,true,function(){
          runAddon(id);
          il++;
          a();
        });
      },function(){
        il++;
        // TODO
      })
    }
    function a(){
      if(il==ll){
        cb();
      }
    }
  }

  if(localStorage._wsync){
    toast.show('正在同步插件中，请不要刷新页面')
    syncAddon(function(){
      toast.show('同步完成');
      localStorage.removeItem('_wsync');
    });
  }
  
  return {
    installAddon,
    uninstallAddon,
    getAddonList,
    addEventListener,
    isinitdone,
    syncAddon
  }
})();