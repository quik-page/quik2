(function(){
  function showOpenFilePicker(){
    return new Promise(function(resolve,reject){
      var inp=document.createElement('input');
      inp.type='file';
      document.body.append(inp);
      inp.style.display='none';
      inp.click();
      inp.onchange=function(){
        resolve(inp.files);
        inp.remove();
      }
    })
  }

  // (function(){
  //   function bodyResizer(){
  //     document.body.style.width=window.innerWidth+'px';
  //     document.body.style.height=window.innerHeight+'px';
  //   }
  //   window.addEventListener('resize',bodyResizer);
  //   bodyResizer();
  // })()
  

  var getEventHandle=_REQUIRE_('./js/event.js');
  var util=_REQUIRE_('./js/util.js');
  var toast=_REQUIRE_('./js/toast.js');
  var iconc=_REQUIRE_('./js/iconc/index.js');
  var {storage,getStorageList,getAllStorage,dbTool}=_REQUIRE_('./js/storage.js');
  var dialog=_REQUIRE_('./js/dialog/index.js');
  var menu=_REQUIRE_('./js/menu/index.js');
  var mainmenu=_REQUIRE_('./js/menu/mainmenu.js');
  var setting=_REQUIRE_('./js/setting/index.js');
  var Setting=setting.Setting;
  var SettingGroup=setting.SettingGroup;
  var SettingItem=setting.SettingItem;
  var mainSetting=setting.mainSetting;
  var tyGroup=setting.tyGroup;
  var omnibox=_REQUIRE_('./js/omnibox/index.js');
  var link=_REQUIRE_('./js/link/index.js');
  var says=_REQUIRE_('./js/says/index.js');
  var card=_REQUIRE_('./js/card/index.js');
  var background=_REQUIRE_('./js/background/index.js');
  var searchEditor=_REQUIRE_('./js/search/editor.js');
  var notice=_REQUIRE_('./js/notice/index.js');
  var custom=_REQUIRE_('./js/custom/index.js');
  var addon=_REQUIRE_('./js/addon/index.js');
  let {alert,confirm,prompt}=_REQUIRE_('./js/dialog/dialog_utils.js');
  var sync=_REQUIRE_('./js/sync/index.js');
  var hotkey=_REQUIRE_('./js/hotkey.js');

  var ignores=_REQUIRE_('./js/ignores/index.js');
  _REQUIRE_('./js/update.js');
  _REQUIRE_('./js/safe.js');
  _REQUIRE_('./js/oobe/index.js');

  window.quik={
    custom,
    sync,
    addon:{
      installByOffcialMarket:addon.upinstallByOffcialMarket,
      installByUrl:addon.upinstallByUrl,
      uninstall:addon.upuninstall,
      update:addon.upupdate,
      getAddonByUrl:addon.getAddonByUrl,
      getAddonBySessionId:addon.getAddonBySessionId,
      getAddonList:addon.getAddonList,
    },
    storage,
    omnibox,
    util,
    link,
    dialog,
    toast,
    says,
    menu,
    iconc,
    background,
    mainmenu,
    Setting,
    SettingGroup,
    SettingItem,
    mainSetting,
    notice,
    tyGroup,
    alert,
    confirm,
    prompt,
    card
  }
  clearTimeout(loadingtimeout);
  document.querySelector("main").style.display='block';
  document.querySelector(".loading-f").classList.add('h');
  document.querySelector(".loading-f").style.display='none'
})();