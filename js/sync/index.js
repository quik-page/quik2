(function () {
  var { getJSON, setJSON } = _REQUIRE_('./core.js');

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
    exportDataDialog.open();
    var jl = getStorageList();
    for (var k in jl) {
      if (!jl[k] || !jl[k].sync) {
        continue;
      }
      var j = jl[k];
      var li = document.createElement('div');
      li.classList.add('item');
      li.innerHTML = `<input type="checkbox"/><div class="message">
        <div class="title">${j.title || k}</div>
        <div class="desc">${j.desc || ''}</div>
      </div>`;
      li.dataset.key = k;
      util.query(dm, '.exportslist').appendChild(li);
      util.query(li, 'input').checked = true;
    }
  }
  var importDataSi = new SettingItem({
    title: "导入数据",
    message: "从文件导入数据",
    type: "null",
    callback: openImport
  });
  function openImport() {
    showOpenFilePicker().then(function (files) {
      var file = files[0];
      if (file) {
        try {
          var reader = new FileReader();
          reader.onload = function (e) {
            sl = JSON.parse(e.target.result);
            _importData(sl);
          }
          reader.readAsText(file);
        } catch (e) {
          alert('读取文件有误！');
        }
      }
    })
  }

  function _importData(sl) {
    var jl = getStorageList();
    importDataDialog.open();
    for (var k in sl) {
      importaixr(sl[k], k, jl);
    }
  }
  sg.addNewItem(exportDataSi);
  sg.addNewItem(importDataSi);
  mainSetting.addNewGroup(sg);


  function importaixr(j, k, jl) {
    var li = document.createElement('div');
    if (!jl[k]&&j.addon) {
      var addo = addon.getAddonByUrl(j.addon);
      if (!addo) {
        li.classList.add('item');
        var ismarket = false;
        if (j.addon.indexOf('market:') == 0) {
          ismarket = true;
          addon.loadMarketData().then(function (r) {
            if (r[j.addon.replace('market:', '')])
              setlihtml(r[j.addon.replace('market:', '')].name);
            else
              console.error('解析失败')
          })
        } else {
          setlihtml(j.addon)
        }
        function setlihtml(_d) {
          li.innerHTML = `<input type="checkbox" disabled/><div class="message">
            <div class="title">${j.title || k}</div>
            <div class="desc">需要安装插件以同步：${_d}</div>
          </div>
          <div class="installbtn">安装</div>`;
          li.querySelector('.installbtn').addEventListener('click', function () {
            if (this.classList.contains('ing')) return;
            if (this.classList.contains('err')) {
              this.classList.remove('err');
            }
            this.innerHTML = '安装中...';
            this.classList.add('ing');
            var p;
            if (ismarket) {
              p = addon.installByOfficialMarket(j.addon.replace('market:', ''));
            } else {
              p = addon.installByUrl(j.addon);
            }
            p.on('error', function (e) {
              li.querySelector('.installbtn').innerHTML = '安装失败';
              this.classList.add('err');
            })
            p.on('wait', function (r) {
              r(true);
            })
            p.on('done', function (e) {
              li.remove();
              setTimeout(function () {
                importaixr(j, k, getStorageList());
              }, 10)
            })
          })
        }
        li.dataset.key = k;
        util.query(dm2, '.importslist').appendChild(li);
        
        return;
      }
    }
    if (!jl[k]) return;
    li.classList.add('item');
    li.innerHTML = `<input type="checkbox"/><div class="message">
      <div class="title">${j.title || k}</div>
      <div class="desc">${j.desc || ''}</div>
    </div>`;
    if (jl[k].compare) {
      li.innerHTML += `<select>
        <option value="compare">对比</option>
        <option value="rewrite">覆盖</option>
      </select>`
      util.query(li, 'select').value = "compare";
    }
    li.dataset.key = k;
    util.query(dm2, '.importslist').appendChild(li);
    util.query(li, 'input').checked = true;
  }

  var sl = null;

  var exportDataDialog = new dialog({
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
    class: "sync-dialog",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
  });
  var dm = exportDataDialog.getDialogDom();
  util.query(dm, '.closeBtn').onclick = util.query(dm, '.cancel').onclick = function () {
    exportDataDialog.close();
  }
  util.query(dm, '.ok').onclick = function () {
    var op = [];
    util.query(dm, '.exportslist .item', true).forEach(function (l) {
      if (util.query(l, 'input').checked) {
        op.push(l.dataset.key);
      }
    })
    getJSON(op).then(function (res) {
      download(JSON.stringify(res), 'quik-2-exportdata.json');
    })
    exportDataDialog.close();
  }

  function download(data, filename) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = filename;
    a.click();
  }

  var importDataDialog = new dialog({
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
    class: "sync-dialog",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
  });
  var dm2 = importDataDialog.getDialogDom();
  util.query(dm2, '.closeBtn').onclick = util.query(dm2, '.cancel').onclick = function () {
    sl = null;
    importDataDialog.close();
  }

  util.query(dm2, '.ok').onclick = function () {
    var op = {};
    util.query(dm2, '.importslist .item', true).forEach(function (l) {
      if (util.query(l, 'input').checked) {
        if (util.query(l, 'select')) {
          op[l.dataset.key] = util.query(l, 'select').value;
        } else {
          op[l.dataset.key] = 'rewrite';
        }
      }
    })
    setJSON(sl, op);
    exportDataDialog.close();
  }

  var { registerWebSync, unregister, isSync } = _REQUIRE_('./web.js');

  return {
    getJSON,
    setJSON,
    openImport,
    openExport,
    registerWebSync,
    unregister,
    isSync
  }
})()