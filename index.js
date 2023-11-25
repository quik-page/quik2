(function(){
  var util=_REQUIRE_('./js/util.js');
  var toast=_REQUIRE_('./js/toast.js');
  var storage=_REQUIRE_('./js/storage.js');
  var dialog=_REQUIRE_('./js/dialog.js');
  var menu=_REQUIRE_('./js/menu.js');
  var iconc=_REQUIRE_('./js/iconc.js');
  var setting=_REQUIRE_('./js/setting.js');
  var omnibox=_REQUIRE_('./js/omnibox.js');
  console.log(omnibox);
  var link=_REQUIRE_('./js/link.js');
  var linkUI=_REQUIRE_('./js/link_ui.js');
  var says=_REQUIRE_('./js/says.js');
  var background=_REQUIRE_('./js/background.js');
  var mainmenu=_REQUIRE_('./js/mainmenu.js');
  var searchEditor=_REQUIRE_('./js/search_editor.js');

  window.quik={
    storage:storage,
    omnibox:omnibox,
    util:util,
    link:link,
    linkUI:linkUI,
    dialog:dialog,
    says:says,
    menu:menu,
    setting:setting,
    iconc:iconc,
    background:background,
    mainmenu:mainmenu,
  }
  document.querySelector("main").style.display='';
})();