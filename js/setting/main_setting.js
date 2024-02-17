(function(){
  var mainSetting=new Setting({
    title:"设置"
  });
  mainmenu.pushMenu({
    icon:util.getGoogleIcon('e8b8',{type:"fill"}),
    title:'主设置',
    click:function(){
      mainSetting.open();
    }
  },mainmenu.MAIN_MENU_TOP)
  return mainSetting;
})()