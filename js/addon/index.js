(()=>{
  var def_addon_icon=window.isExt?("chrome-extension://"+window.extid+"/assets/def_addon.png"):"./assets/def_addon.png"
  var core = _REQUIRE_('./_core.js');
  var ui = _REQUIRE_('./install_ui.js');
  var addon_dialog;
  function drawAll(){
    addon_dialog = new dialog({
      content: (_REQUIRE_('./addon_list.mb.html'))
        .replace('{{close-btn}}', util.getGoogleIcon('e5cd'))
        .replace('{{search}}', util.getGoogleIcon('e8b6'))
        .replace('{{add-btn}}', util.getGoogleIcon('e145')),
      mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
      class: "addon-dialog"
    });
  
    var addon_dialog_d = addon_dialog.getDialogDom();
    util.query(addon_dialog_d, '.closeBtn').addEventListener('click', () => {
      addon_dialog.close();
    });
  
    _REQUIRE_('./xrmenu.js');
    _REQUIRE_('./xrlist.js');
    _REQUIRE_('./xrmarket.js');
  }
  var addon_icon = new iconc.icon({
    offset: "tr",
    content: util.getGoogleIcon("e87b", { type: "fill" })
  });
  addon_icon.getIcon().onclick =  ()=> {
    if(!addon_dialog){
      drawAll();
      setTimeout(()=>{
        addon_dialog.open();
      },10)
    }else{
      addon_dialog.open();
    }
  }
  

  if(window.addon_){
    alert('已在安全模式下运行，插件功能已关闭！')
  }

  core.upinstallByOfficialMarket=(id)=>{
    return new Promise((r,j)=>{
      if(core.getAddonByMarketId(id)){
        j({
          code:-3,
          msg:"插件已安装"
        })
        return;
      }
      var u=new ui();
      u.show();
      core.loadMarketData().then((res)=>{
        if(!res[id]){
          j({
            code:-2,
            msg:"插件ID不存在"
          });
          return;
        }
        u.ask('要安装插件 “'+res[id].name+'” 吗？（该插件来自官方商店）',(ok)=>{
          if(ok){
            var p=core.installByOfficialMarket(id);
            u.bind(p);
            p.on('done',  (a)=>{
              alert('安装成功');
              r({
                code:0,
                result:a
              })
            });
            p.on('error',(a)=>{
              j({
                code:-2,
                msg:"安装错误",
                err:a
              })
            })
          }else{
            j({
              code:-1,
              msg:"用户取消"
            })
          }
        },{
          img:res[id].icon,
          name:res[id].name,
          version:res[id].version
        })
      })
    });
  }
  core.upinstallByUrl=(url)=>{
    return new Promise((r,j)=>{
      if(core.getAddonByUrl(url)){
        j({
          code:-3,
          msg:"插件已安装"
        })
        return;
      }
      var u=new ui();
          u.show();
      u.ask('要安装来自 '+url+' 的插件吗？',(n)=>{
        if(n){
          var p=core.installByUrl(url);
          u.bind(p);
          p.on('done',  (a)=>{
            alert('安装成功');
            r({
              code:0,
              result:a
            })
          });
          p.on('error',(a)=>{
            j({
              code:-2,
              msg:"安装错误",
              err:a
            })
          })
        }else{
          j({
            code:-1,
            msg:"用户取消"
          })
          u.hide();
          setTimeout(()=>{
            u.destroy()
          },200)
        }
      })
    })
  }
  core.upuninstall=function(id){
    return new Promise((r,j)=>{
      if(!core.getAddonBySessionId(id)){
        j({
          code:-1,
          msg:"没有该插件"
        })
      }else{
        confirm('要卸载 '+core.getAddonBySessionId(id).name+' 吗？',(n)=>{
          if(n){
            core.uninstall(id).then((a)=> {
              if (a.error) {
                alert('卸载出现错误：' + a.msg)
                j({
                  code:-3,
                  msg:"卸载出现错误",
                  err:a
                })
              } else {
                alert('卸载成功，刷新生效');
                r({
                  code:0,
                  result:a
                })
              }
            })
          }else{
            j({
              code:-2,
              msg:"用户取消"
            })
          }
        })
      }
    })
  }
  core.upupdate=(id)=>{
    return new Promise((r,j)=>{
      if(!core.getAddonBySessionId(id)){
        j({
          code:-1,
          msg:"没有该插件"
        })
      }else{
        confirm('要更新 '+core.getAddonBySessionId(id).name+' 吗？',(n)=>{
          if(n){
            core.update(id).then((a)=>{
              if (a.error) {
                alert('更新出现错误：' + a.msg)
                j({
                  code:-3,
                  msg:"更新出现错误",
                  err:a
                })
              } else {
                alert('更新成功，刷新生效');
                r({
                  code:0,
                  result:a
                })
                xraddon(id);
              }
            })
          }else{
            j({
              code:-2,
              msg:"用户取消"
            })
          }
        })
      }
    })
  }

  return core;

})();