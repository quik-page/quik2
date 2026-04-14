const { SettingGroup, SettingItem, mainSetting } = require("../setting/index");
const util = require("../util");
const dialog = require("../dialog");
var { getJSON, setJSON } = require('./core.js');
var { registerWebSync, unregister, isSync } = require('./web.js');
const { getStorageList } = require("../storage");

function quik1() {
  var d = new dialog({
      content: "正在加载模块..."
  })
  d.open();
  var s = el('script', {
      src: "./quik1.js"
  })
  document.body.append(s);
  window.quik1to2 = (f) => {
      window.quik1to2 = null;
      f(_importData);
      d.close();
  }
}

const { alert } = require("../dialog/dialog_utils");
const { showOpenFilePicker } = require("../base");
const addon=require('../addon/index');


var sg = new SettingGroup({
  title: "数据",
  index: 4
});

var exportDataSi = new SettingItem({
  title: "导出数据",
  message: "导出数据到文件",
  type: "null",
  callback: openExport
});
function openExport() {
  if (!exportDataDialog) {
    drawExportDialog();
  }
  var jl = getStorageList();
  for (var k in jl) {
    if (!jl[k] || !jl[k].sync) {
      continue;
    }
    var j = jl[k];
    var li = el('div');
    li.addClass('item');
    li.html(`<input type="checkbox"/><div class="message">
        <div class="title">${j.title || k}</div>
        <div class="desc">${j.desc || ''}</div>
      </div>`);
    li.dataset.key = k;
    dm.$('.exportslist').appendChild(li);
    li.$('input').checked = true;
  }
  setTimeout(() => {
    exportDataDialog.open();
  }, 10)
}
var importDataSi = new SettingItem({
  title: "导入数据",
  message: "从文件导入数据",
  type: "null",
  callback: openImport
});
function openImport() {
  showOpenFilePicker().then(files => {
    var file = files[0];
    if (file) {
      try {
        var reader = new FileReader();
        reader.onload = e => {
          sl = JSON.parse(e.target.result);
          _importData(sl);
        }
        reader.readAsText(file);
      } catch (e) {
        console.log(e);
        alert('读取文件有误！');
      }
    }
  })
}

function _importData(_sl) {
  sl = _sl;
  var jl = getStorageList();
  if (!importDataDialog) {
    drawImportDialog();
  }
  for (var k in _sl) {
    importaixr(_sl[k], k, jl);
  }
  setTimeout(() => {
    importDataDialog.open();
  }, 10)
}
sg.addNewItem(exportDataSi);
sg.addNewItem(importDataSi);
mainSetting.addNewGroup(sg);


function importaixr(j, k, jl) {
  var li = el('div');
  if (!jl[k] && j.addon) {
    var addo = addon.getAddonByUrl(j.addon);
    if (!addo) {
      li.addClass('item');
      var ismarket = false;
      if (j.addon.indexOf('market:') == 0) {
        ismarket = true;
      }
      setlihtml(j.addon)
      function setlihtml(_d) {
        li.html(`<input type="checkbox" disabled/><div class="message">
            <div class="title">${j.title || k}</div>
            <div class="desc">需要安装插件以同步：${_d}</div>
          </div>
          <div class="installbtn">安装</div>`);
        var installbtn = li.$('.installbtn');
        installbtn.on('click', function () {
          if (this.hasClass('ing')) return;
          if (this.hasClass('err')) {
            this.removeClass('err');
          }
          this.html('安装中...');
          this.addClass('ing');
          var p;
          if (ismarket) {
            p = addon.installByOfficialMarket(j.addon.replace('market:', ''));
          } else {
            p = addon.installByUrl(j.addon);
          }
          p.on('error', () => {
            installbtn.html('安装失败');
            installbtn.addClass('err');
          })
          p.on('wait', (r) => {
            r(true);
          })
          p.on('done', () => {
            li.remove();
            setTimeout(() => {
              importaixr(j, k, getStorageList());
            }, 10)
          })
        })
      }
      li.dataset.key = k;
      dm2.$('.importslist').appendChild(li);

      return;
    }
  }
  if (!jl[k]) return;
  li.addClass('item');
  li.html(`<input type="checkbox"/><div class="message">
      <div class="title">${j.title || k}</div>
      <div class="desc">${j.desc || ''}</div>
    </div>`);
  if (jl[k].compare) {
    li.innerHTML += `<select>
        <option value="compare">对比</option>
        <option value="rewrite">覆盖</option>
      </select>`
    li.$('select').value = "compare";
  }
  li.dataset.key = k;
  dm2.$('.importslist').appendChild(li);
  li.$('input').checked = true;
}

var sl = null;

var exportDataDialog, importDataDialog, dm, dm2;

function drawExportDialog() {
  exportDataDialog = new dialog({
    content: `<div class="actionbar">
        <h1>导出数据</h1>
        <div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
      </div>
      <div class="exportslist">
      </div>
      <div class="btns">
        <div class="btn cancel">取消</div>
        <div class="btn ok">导出</div>
      </div>`,
    class: "sync-dialog auto-size",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
  });
  dm = exportDataDialog.getDialogDom();
  dm.$('.closeBtn').onclick = dm.$('.cancel').onclick = () => {
    exportDataDialog.close();
  }
  dm.$('.ok').onclick = () => {
    var op = [];
    dm.$$('.exportslist .item').forEach(l => {
      if (l.$('input').checked) {
        op.push(l.dataset.key);
      }
    })
    getJSON(op).then((res) => {
      download(JSON.stringify(res), 'quik-2-exportdata.json');
    })
    exportDataDialog.close();
  }
}


function download(data, filename) {
  var a = el('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = filename;
  a.click();
}

function drawImportDialog() {
  importDataDialog = new dialog({
    content: `<div class="actionbar">
        <h1>导入数据</h1>
        <div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
      </div>
      <div class="importslist">
      </div>
      <div class="btns">
        <div class="btn cancel">取消</div>
        <div class="btn ok">导入</div>
      </div>`,
    class: "sync-dialog auto-size",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
  });
  dm2 = importDataDialog.getDialogDom();
  dm2.$('.closeBtn').onclick = dm2.$('.cancel').onclick = () => {
    sl = null;
    importDataDialog.close();
  }

  dm2.$('.ok').onclick = () => {
    var op = {};
    dm2.$$('.importslist .item').forEach((l) => {
      if (l.$('input').checked) {
        if (l.$('select')) {
          op[l.dataset.key] = l.$('select').value;
        } else {
          op[l.dataset.key] = 'rewrite';
        }
      }
    })
    setJSON(sl, op);
    importDataDialog.close();
  }
}

var quik1si = new SettingItem({
  title: "QUIK 1",
  message: "从 QUIK 1 中导入数据",
  type: "null",
  callback: quik1
})

sg.addNewItem(quik1si);


module.exports = {
  getJSON,
  setJSON,
  openImport,
  openExport,
  registerWebSync,
  unregister,
  isSync,
  openQUIK1: quik1
}