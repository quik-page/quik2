!function(){
  window.version_code = 5;
  window.version={
    version:'2.0.0-dev',
    version_code:window.version_code,
    updateTime:'2024-02-17 15:33:00',
    log:[
      {
        tag:"new",
        content:"新增 lorem ipsum,fqwe89fiuwqebfulwqeifuoqwegvfuasehkfusevglawiuevgowaeiruvgiwaehfshdcweruiwbaeifclsadfuhawilefuqouqvgiuwercvaw",
      },
      {
        tag:"change",
        content:"修改 lorem ipsum,fqwe89fiuwqebfulwqeifuoqwegvfuasehkfusevglawiuevgowaeiruvgiwaehfshdcweruiwbaeifclsadfuhawilefuqouqvgiuwercvaw"
      },
      {
        tag:"fix",
        content:"修复 lorem ipsum,fqwe89fiuwqebfulwqeifuoqwegvfuasehkfusevglawiuevgowaeiruvgiwaehfshdcweruiwbaeifclsadfuhawilefuqouqvgiuwercvawlorem ipsum,fqwe89fiuwqebfulwqeifuoqwegvfuasehkfusevglawiuevgowaeiruvgiwaehfshdcweruiwbaeifclsadfuhawilefuqouqvgiuwercvaw"
      },
      {
        tag:"del",
        content:"删除 lorem ipsum,fqwe89fiuwqebfulwqeifuoqwegvfuasehkfusevglawiuevgowaeiruvgiwaehfshdcweruiwbaeifclsadfuhawilefuqouqvgiuwercvaw"
      },{
        tag:"thanks",
        content:"感谢 xn"
      }
    ]
  }
  console.log(version);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
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
        content:`<h1>版本更新</h1>
        <div class="version_item">
          <div class="version_item_title">版本号：${window.version.version}</div>
          <div class="version_item_update_time">发布时间：${window.version.updateTime}</div>
          <div class="version_update">${formatVersion(window.version.log)}</div>
        </div>
        <div class="footer">
          <div class="btn ok">我知道了</div>
        </div>`,
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
