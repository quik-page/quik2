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
      icon: util.getGoogleIcon('f1cc'),
      title: "从插件市场添加插件",
      click: function () {
        // TODO
      }
    }, {
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
              installing_notice.destory();
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

  var addon_l = util.query(addon_dialog_d, '.content .p.gl ul');
  function xraddon(id) {
    var addon = core.getAddonBySessionId(id);
    if (addon.type == 'dev') {
      addon.name = '开发者端口：' + addon.url;
      addon.author = 'dev';
      addon.desc = '开发者端口：' + addon.url;
    }
    var li = util.query(addon_l, 'li[data-id="' + id + '"]');
    if (!li) {
      li = util.element('li');
      li.innerHTML = _REQUIRE_('./addon_item.mb.html');
      li.dataset.id = id;
      addon_l.appendChild(li);
      li.onclick = function (e) {
        addon_l.querySelectorAll('li').forEach(function (li) {
          li.classList.remove('active');
        })
        this.classList.add('active');
      }
      util.query(li, '.ch_update').onclick = function () {
        st.innerHTML = '检查更新中...';
        var _ = this;
        _.style.display = '';
        core.checkUpdate(id).then(function (a) {
          if (!a) {
            _.style.display = 'block';
            st.innerHTML = '已是最新版本';
          } else {
            st.innerHTML = '发现新版本';
            util.query(li, '.update').style.display = 'block';
          }
        });
      }

      util.query(li, '.update').onclick = function () {
        st.innerHTML = '更新中...';
        var _ = this;
        _.style.display = '';
        core.update(id).then(function (r) {
          if (r.error) {
            st.innerHTML = '更新失败:' + r.msg;
            _.style.display = 'block';
          } else {
            xraddon(id);
            st.innerHTML = '更新完成，刷新生效';
            util.query(li, '.ch_update').style.display = 'inline-block';
          }
        });
      }
      util.query(li, '.enable').onclick = function () {
        st.innerHTML = '已启用，刷新生效'
        core.enable(id);
        util.query(li, '.disable').style.display = 'block';
        util.query(li, '.disabled_state').style.display="none";
        this.style.display = '';
      }
      util.query(li, '.disable').onclick = function () {
        st.innerHTML = '已禁用，刷新生效'
        core.disable(id);
        util.query(li, '.enable').style.display = 'block';
      util.query(li, '.disabled_state').style.display="";
        this.style.display = '';
      }

      util.query(li, '.uninstall').onclick = function () {
        confirm('你真的要卸载吗？此操作不可恢复！', function (as) {
          if (as) {
            st.innerHTML = '正在卸载...'
            core.uninstall(id).then(function (r) {
              if (r.error) {
                alert('卸载出现错误：' + r.msg)
              } else {
                alert('卸载成功，刷新生效');
              }
            })
          }
        })
      }
    }
    util.query(li, '.n>img').src = addon.icon || "assets/def_addon.png";
    util.query(li, '.n .ds .name span').innerText = addon.name;
    var ms = util.query(li, '.n .ds .message span', true);
    ms[0].innerText = addon.author || '不详';
    ms[1].innerText = addon.version || '';
    ms[2].innerText = '';
    util.query(li, '.d .desc').innerText = addon.desc || '';
    util.query(li, '.d .website').innerText = addon.website || '';
    var st = util.query(li, '.message span', true)[2];
    if (!addon.type) {
      util.query(li, '.ch_update').style.display = 'block';
    }
    if (addon.disabled) {
      util.query(li, '.enable').style.display = 'block';
      util.query(li, '.disabled_state').style.display="";
    } else {
      util.query(li, '.disable').style.display = 'block';
      util.query(li, '.disabled_state').style.display="none";
    }

  }
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

  }
  core.upinstallByUrl=function(url){
    
  }
  core.upuninstall=function(id){
    
  }
  core.upupdate=function(id){
    
  }

  return core;

})();