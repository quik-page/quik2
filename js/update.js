!function(){
  window.version_code = '${VERSION_CODE}';
  window.version={
    version:'2.0.4-beta',
    version_code:window.version_code,
    updateTime:'2024/7/30',
    log:[
      {
        "tag": "new",
        "content": "搜索框背景蒙版可在设置中关闭或设置模糊"
      },
      {
        "tag":"thanks",
        "content":"感谢 银海浮乐 提供的建议"
      }
    ]
  }
  if ('serviceWorker' in navigator&&!window._dev) {
    navigator.serviceWorker.ready.then(function (registration) {
      window.swReg=registration;
      quik.util.xhr('./version', function (r) {
        var nv = parseInt(r);
        if (nv > version_code) {
          registration.active.postMessage('update');
        }
      }, function () {
        console.log('获取版本失败');
      })
    });
    navigator.serviceWorker.addEventListener('message', function (e) {
      if (e.data == 'updated') {
        quik.confirm('新版本已准备就绪，是否刷新页面', function (v) {
          if (v) {
            localStorage.setItem('__q__s__','1');
            location.reload();
          }
        })
      }
    });
  }
  var version_dia=null;
  function showVersion(){
    if(!version_dia){
      version_dia=new dialog({
        content:`<h1>版本更新</h1><div class="version_item">
<div class="version_item_title">版本号：${window.version.version}</div>
<div class="version_item_update_time">发布时间：${window.version.updateTime}</div>
<div class="version_update">${formatVersion(window.version.log)}</div>
</div><div class="footer"><div class="btn ok">我知道了</div></div>`,
        class:"update_dialog"
      });
      util.query(version_dia.getDialogDom(),'.btn.ok').onclick=function(){
        version_dia.close();
      }
    }
    
    setTimeout(function(){
      version_dia.open();
    })
  }
  if(localStorage.getItem('__q__s__')){
    showVersion();
    localStorage.removeItem('__q__s__');
  }

  function formatVersion(fv){
    var str='',gl={
      "new":"新增",
      "del":"删除",
      "fix":"修复",
      "change":"修改",
      "thanks":"感谢"
    };
    for(var i=0;i<fv.length;i++){
      str+='<div class="update_item"><div class="update_item_tag '+fv[i].tag+'"><div>'+gl[fv[i].tag]+'</div></div><div class="update_item_content">'+fv[i].content+'</div></div>'
    }
    return str;
  }
}();
