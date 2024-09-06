!function(){
  window.version_code = '${VERSION_CODE}';
  window.version={
    version:'2.5.0',
    version_code:window.version_code,
    updateTime:'2024/9/6',
    log:[
      {
        tag:"fix",
        content:"修复搜索联想的BUG"
      },
      {
        tag:"new",
        content:"链接样式可在设置中更改，且将默认样式改为圆形"
      },
      {
        tag:"change",
        content:"链接池的拖动条改为透明效果"
      },
      {
        tag:"change",
        content:"设置界面在大屏幕上会自适应变大"
      },
      {
        tag:"change",
        content:"设置中的下拉菜单在选项多时会显示拖动条"
      },
      {
        tag:"fix",
        content:"原随机风景图片API失效，更换随机风景图片API为tu.ltyuanfang.cn"
      }
    ]
  }
  if ('serviceWorker' in navigator&&!window._dev) {
    navigator.serviceWorker.ready.then(registration=> {
      window.swReg=registration;
      quik.util.xhr('./version', r=> {
        var nv = parseInt(r);
        if (nv > version_code) {
          quik.toast.show('发现新版本(版本序号：'+nv+')，正在更新');
          registration.active.postMessage('update');
        }
      }, ()=> {
        console.log('获取版本失败');
      })
    });
    navigator.serviceWorker.addEventListener('message', e=> {
      if (e.data == 'updated') {
        quik.confirm('新版本已准备就绪，是否刷新页面',v=> {
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
      util.query(version_dia.getDialogDom(),'.btn.ok').onclick=()=>{
        version_dia.close();
      }
    }
    
    setTimeout(()=>{
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
