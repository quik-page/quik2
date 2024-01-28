(function(){
  var setting_icon = new iconc.icon({
    content: util.getGoogleIcon('e8b8'),
    offset: "bl"
  });

  setting_icon.getIcon().onclick = function () {
    mainSetting.open();
  }
})();