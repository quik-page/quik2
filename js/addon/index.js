(function () {
  var core = _REQUIRE_('./_core.js');
  var ui = _REQUIRE_('./install_ui.js');
  var addon_dialog = new dialog({
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

  var addon_menu = new menu({
    list: [{
      icon: util.getGoogleIcon('e157'),
      title: "从第三方链接添加插件",
      click: function () {
        prompt("请输入插件链接", function (link) {
          if (!link) {
            return false;
          }
          var p = core.installByUrl(link);
          var u = new ui();
          u.show();
          u.bind(p);
          p.on('done', function (a) {
            alert('安装成功');
            console.log(a);
          });
          return true;
        })
      }
    }, {
      icon: util.getGoogleIcon('e66d'),
      title: "从第三方文件添加插件",
      click: function () {
        showOpenFilePicker().then(function (files) {
          var f = files[0];
          var n = f.name;
          var r = new FileReader();
          var u = new ui();
          u.show();
          r.onload = function () {
            var p = core.installByLocal(r.result);
            u.bind(p);
            p.ondone = function (a) {
              installing_notice.destroy();
              alert('安装成功');
              console.log(a);
            };
          }
          r.readAsText(f);
        })
      }
    }, {
      icon: util.getGoogleIcon('e86f'),
      title: "添加开发者端口",
      click: function () {
        if(!window.isExt){
          alert('请在浏览器扩展中安装开发端口')
          return;
        }
        prompt("请输入开发者端口链接", function (link) {
          if (!link) {
            return false;
          }
          core.installByDev(link);
          alert('安装成功')
        })
      }
    }],
    offset: {
      top: 0, left: 0
    }
  });

  util.query(addon_dialog_d, '.add-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    var b = this.getBoundingClientRect();
    addon_menu.setOffset({
      top: b.top + b.height,
      right: window.innerWidth - b.left - b.width
    });
    addon_menu.show();
  });

  var addon_icon = new iconc.icon({
    offset: "tr",
    content: util.getGoogleIcon("e87b", { type: "fill" })
  });
  addon_icon.getIcon().onclick = function () {
    addon_dialog.open();
  }
  var tmenu = util.query(addon_dialog_d, '.addon-bar .l .item', true);
  var ps = util.query(addon_dialog_d, '.content .p', true);
  tmenu.forEach(function (a) {
    a.onclick = function () {
      tmenu.forEach(function (b) {
        b.classList.remove('active');
      })
      this.classList.add('active');
      ps.forEach(function (c) {
        c.style.display = '';
      })
      ps[this.dataset.p].style.display = 'block';
    }
  })

  _REQUIRE_('./xrlist.js');
  _REQUIRE_('./xrmarket.js');

  if(!window.addon_){
    core.getAddonList().forEach(function (a) {
      xraddon(a);
    })
  }else{
    alert('已在安全模式下运行，插件功能已关闭！')
  }
  
  core.on('installnew',function(e){
    xraddon(e.id);
  })
  core.on('uninstall',function(e){
    var li = util.query(addon_l, 'li[data-id="' + e.id + '"]');
    if(li){li.remove()}
  })

  core.upinstallByOffcialMarket=function(id){
    // TODO
  }
  core.upinstallByUrl=function(url){
    return new Promise(function(r,j){
      var u=new ui();
          u.show();
      u.ask('要安装来自 '+url+' 的插件吗？',function(n){
        if(n){
          var p=core.installByUrl(url);
          u.bind(p);
          p.on('done', function (a) {
            alert('安装成功');
            r({
              code:0,
              result:a
            })
          });
          p.on('error',function(a){
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
          setTimeout(function(){
            u.destroy()
          },200)
        }
      })
    })
  }
  core.upuninstall=function(id){
    return new Promise(function(r,j){
      if(!core.getAddonBySessionId(id)){
        j({
          code:-1,
          msg:"没有该插件"
        })
      }else{
        confirm('要卸载 '+core.getAddonBySessionId(id).name+' 吗？',function(n){
          if(n){
            core.uninstall(id).then(function (a) {
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
  core.upupdate=function(id){
    return new Promise(function(r,j){
      if(!core.getAddonBySessionId(id)){
        j({
          code:-1,
          msg:"没有该插件"
        })
      }else{
        confirm('要更新 '+core.getAddonBySessionId(id).name+' 吗？',function(n){
          if(n){
            core.update(id).then(function (a) {
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