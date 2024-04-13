(function(){
  var {addEventListener,removeEventListner,doevent}=getEventHandle();
  var core=_REQUIRE_('./_core.js');
  var addon_dialog=new dialog({
    content:(_REQUIRE_('./addon_list.mb.html')).replace('{{close-btn}}',util.getGoogleIcon('e5cd')).replace('{{add-btn}}',util.getGoogleIcon('e145')),
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
    class:"addon-dialog"
  });

  var addon_dialog_d=addon_dialog.getDialogDom();
  util.query(addon_dialog_d,'.closeBtn').addEventListener('click',()=>{
    addon_dialog.close();
  });

  var addon_menu=new menu({
    list:[{
      icon:util.getGoogleIcon('f1cc'),
      title:"从插件市场添加插件",
      click:function(){
        // TODO
      }
    },{
      icon:util.getGoogleIcon('e157'),
      title:"从第三方链接添加插件",
      click:function(){
        prompt("请输入插件链接",function(link){
          if(!link){
            return false;
          }
          var installing_notice=new notice({
            title:"正在安装插件",
            content:"链接："+link+"\n",
            useprogress:true,
            progress:0
          })
          installing_notice.show();
          core.installByUrl(link,{
            progress:function(e){
              installing_notice.setContent("链接："+link+"\n"+e.message);
              installing_notice.setProgress(e.progress);
            }
          }).then(function(a){
            installing_notice.destory();
            alert('安装成功');
            console.log(a);
          }).catch(function(err){
            installing_notice.destory();
            console.dir(err);
            alert('安装失败，'+err.msg);
          });
          return true;
        })
      }
    },{
      icon:util.getGoogleIcon('e66d'),
      title:"从第三方文件添加插件",
      click:function(){
        showOpenFilePicker().then(function(files){
          var f=files[0];
          var n=f.name;
          var r=new FileReader();
          var installing_notice=new notice({
            title:"正在安装插件",
            content:"from：本地文件\n解析中...",
            useprogress:true,
            progress:0
          })
          installing_notice.show();
          r.onload=function(){
            core.installByLocal(r.result,n,{
              progress:function(e){
                installing_notice.setContent("from：本地文件\n"+e.message);
                installing_notice.setProgress(e.progress);
              }
            }).then(function(a){
              installing_notice.destory();
              alert('安装成功');
              console.log(a);
            }).catch(function(err){
              installing_notice.destory();
              console.dir(err);
              alert('安装失败，'+JSON.parse(err.message).msg);
            });
          }
          r.readAsText(f);
        })
      }
    },{
      icon:util.getGoogleIcon('e86f'),
      title:"添加开发者端口",
      click:function(){
        prompt("请输入开发者端口链接",function(link){
          if(!link){
            return false;
          }
          core.installByDev(link).then(function(a){
            alert('安装成功');
            console.log(a);
          }).catch(function(err){
            console.error(err);
            alert('安装失败，'+JSON.parse(err.message).msg);
          });
          return true;
        })
      }
    }],
    offset:{
      top:0,left:0
    }
  });

  util.query(addon_dialog_d,'.add-btn').addEventListener('click',function(e){
    e.stopPropagation();
    var b=this.getBoundingClientRect();
    addon_menu.setOffset({
      top:b.top+b.height,
      right:window.innerWidth-b.left-b.width
    });
    addon_menu.show();
  });

  var addon_icon=new iconc.icon({
    offset:"tr",
    content:util.getGoogleIcon("e87b",{type:"fill"})
  });
  addon_icon.getIcon().onclick=function(){
    addon_dialog.open();
  }

  core.getAddonList().forEach(function(id){
    core.runAddon(id);
  });

  return core;

})();