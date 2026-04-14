const dialog=require('../dialog/index');
const omnibox=require('../omnibox/');
const { SettingItem } = require('../setting/index');
const util=require('../util');
const toast=require('../toast')

var dia;
function drawAll() {
  dia = new dialog({
    content: require('./editor.html').replace('{{close}}', util.getGoogleIcon('e5cd')),
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
    class: "search_editor auto-size"
  });

  var d = dia.getDialogDom();
  var neizhi = omnibox.neizhi;
  var list = omnibox.getSearchTypeList();
  var neizhilist_f = d.$('.neizhilist');
  for (var k in neizhi) {
    var item = el('.item', {
      'data-k': k
    });
    item.html('<img/><div>' + neizhi[k].name + '</div>');
    ((k, item) => {
      util.getFavicon(neizhi[k].link, (fav) => {
        if (fav) {
          item.$("img").src = fav;
        } else {
          item.$("img").src = util.createIcon('s');
        }
      });
    })(k, item)

    neizhilist_f.append(item);
    if (k == 'bing') {
      item.on('click', () => {
        toast.show('该项不可取消')
      })
    } else {
      item.on('click', function () {
        if (this.hasClass('active')) {
          this.removeClass('active');
        } else {
          this.addClass('active');
        }
      })
    }

    if (k in list) {
      item.addClass('active');
      delete list[k];
    }
  }

  var str = '';
  for (var k in list) {
    str += '<div class="item" data-k="' + k + '">' +
      '<div class="icon"><img/></div>' +
      '<div class="url"><input value="' + list[k] + '"/></div>' +
      '<div class="remove">' + util.getGoogleIcon('e5cd') + '</div>' +
      '</div>';
  }
  str += `<div class="addnewitem">${util.getGoogleIcon('e145')} 添加自定义的搜索引擎</div>`
  d.$('.searchlist').innerHTML = str;

  d.$$('.searchlist .item').forEach(item => {
    clitem(item);
  });
  d.$('.searchlist .addnewitem').onclick = () => {
    var item = util.element('div', {
      class: 'item',
      'data-k': "user_" + Date.now().toString().slice(3)
    });
    item.innerHTML = '<div class="icon"><img src="https://cn.bing.com/favicon.ico"/></div>' +
      '<div class="url"><input value="https://cn.bing.com/search?q=%keyword%"/></div>' +
      '<div class="remove">' + util.getGoogleIcon('e5cd') + '</div>';
    d.$('.searchlist').insertBefore(item, d.$('.searchlist .addnewitem'));
    clitem(item, true);
  }


  function clitem(item, a) {
    if (!a) {
      util.getFavicon(list[item.attr('data-k')], (fav) => {
        if (fav) {
          item.$('.icon img').src = fav;
        } else {
          item.$('.icon img').src = util.createIcon('s');
        }
      })
    }
    item.$('.url input').oninput = function () {
      // @note 隐藏用户输入了不正确的URL的报错
      // @edit at 2024/1/30 15:28
      try {
        var img = this.parentElement.parentElement.querySelector('.icon img')
        util.getFavicon(this.value, (fav) => {
          if (fav) {
            img.src = fav;
          } else {
            img.src = util.createIcon('s');
          }
        })
      } catch (e) {
        // 用户输入了不正确的URL
      }
    }
    item.$('.remove').onclick = function () {
      this.parentElement.remove();
    }
  }
  d.$('.closeBtn').onclick = d.$('.cancel.btn').onclick = () => {
    dia.close();
  }
  d.$('.ok.btn').onclick = () => {
    var nlist = {};
    d.$$('.searchlist .item').forEach(item => {
      nlist[item.dataset.k] = item.querySelector('.url input').value;
    });
    d.$$('.neizhilist .item.active').forEach(item => {
      nlist[item.dataset.k] = '';
    });
    list = nlist;
    if (!list[omnibox.getSearchTypeIndex()]) {
      omnibox.setSearchType('bing');
    }
    omnibox.setSearchList(list);
    dia.close();
    toast.show('设置成功')
  }
}
var si = new SettingItem({
  title: "自定义搜索引擎",
  index: 0,
  type: 'null',
  message: "",
  callback(value) {
    if (!dia) {
      drawAll();
      setTimeout(() => {
        dia.open();
      }, 10)
    } else {
      dia.open();
    }
  }
})
omnibox.sg.addNewItem(si);

module.exports = {
  open() {
    if (!dia) {
      drawAll();
      setTimeout(() => {
        dia.open();
      }, 10)
    } else {
      dia.open();
    }
  }
}
