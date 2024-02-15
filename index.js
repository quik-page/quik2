(function(){
  var getEventHandle=_REQUIRE_('./js/event.js');
  var util=_REQUIRE_('./js/util.js');
  var toast=_REQUIRE_('./js/toast.js');
  var {storage,getStorageList,getAllStorage}=_REQUIRE_('./js/storage.js');
  var dialog=_REQUIRE_('./js/dialog/index.js');
  var menu=_REQUIRE_('./js/menu/index.js');
  var iconc=_REQUIRE_('./js/iconc/index.js');
  var setting=_REQUIRE_('./js/setting/index.js');
  var Setting=setting.Setting;
  var SettingGroup=setting.SettingGroup;
  var SettingItem=setting.SettingItem;
  var mainSetting=setting.mainSetting;
  var tyGroup=setting.tyGroup;
  var omnibox=_REQUIRE_('./js/omnibox/index.js');
  var link=_REQUIRE_('./js/link/index.js');
  var says=_REQUIRE_('./js/says/index.js');
  var background=_REQUIRE_('./js/background/index.js');
  var mainmenu=_REQUIRE_('./js/menu/mainmenu.js');
  var searchEditor=_REQUIRE_('./js/search/editor.js');
  var notice=_REQUIRE_('./js/notice/index.js');
  var theme=_REQUIRE_('./js/theme/index.js');
  var addon=_REQUIRE_('./js/addon/index.js');
  let {alert,confirm,prompt}=_REQUIRE_('./js/dialog/dialog_utils.js');
  var card=_REQUIRE_('./js/card/index.js');
  var sync=_REQUIRE_('./js/sync/index.js');

  window.quik={
    sync,
    addon,
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
    theme,
    card
  }
  document.querySelector("main").style.display='';
})();