(()=>{
  var setting_icon = new iconc.icon({
    content: util.getGoogleIcon('e8b8',{type:"fill"}),
    offset: "bl"
  });
  setting_icon.getIcon().title="(Alt+S) 打开设置"
  setting_icon.getIcon().onclick = ()=>{
    mainSetting.open();
  }
})();