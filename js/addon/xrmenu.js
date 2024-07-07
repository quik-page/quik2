
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