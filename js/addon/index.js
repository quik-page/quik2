(()=>{
  var addon_icon = new iconc.icon({
    offset: "tr",
    content: util.getGoogleIcon("e87b", { type: "fill" })
  });
  addon_icon.getIcon().onclick =  ()=> {
    if(!storage.checkIDB()){
      alert('浏览器版本过低，无法使用插件功能！')
      return;
    }
    if(!addon_dialog){
      drawAll();
      setTimeout(()=>{
        addon_dialog.open();
      },10)
    }else{
      addon_dialog.open();
    }
  }
  if(!storage.checkIDB())return;
  var def_addon_icon=window.isExt?("chrome-extension://"+window.extid+"/assets/def_addon.png"):"./assets/def_addon.png"
  var core = _REQUIRE_('./_core.js');
  var ui = _REQUIRE_('./install_ui.js');
  var addon_dialog;
  function drawAll(){
    addon_dialog = new dialog({
      content: (_REQUIRE_('./mb/addon_list.mb.html'))
        .replace('{{close-btn}}', util.getGoogleIcon('e5cd'))
        .replace('{{search}}', util.getGoogleIcon('e8b6'))
        .replace('{{add-btn}}', util.getGoogleIcon('e145')),
      mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
      class: "addon-dialog"
    });
  
    var addon_dialog_d = addon_dialog.getDialogDom();
    util.query(addon_dialog_d, '.closeBtn').addEventListener('click', () => {
      addon_dialog.close();
    });
  
    _REQUIRE_('./xrmenu.js');
    _REQUIRE_('./xrlist.js');
    _REQUIRE_('./xrmarket.js');
  }
 
  if(window.addon_){
    alert('已在安全模式下运行，插件功能已关闭！')
  }
  _REQUIRE_('./core_up.js');
  return core;

})();