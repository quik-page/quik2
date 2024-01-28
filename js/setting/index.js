(function(){
  
  var Setting=_REQUIRE_('./setting.js');
  var SettingGroup=_REQUIRE_('./setting_group.js');
  var SettingItem=_REQUIRE_('./setting_item.js');
  var mainSetting=_REQUIRE_('./main_setting.js');
  _REQUIRE_('./setting_icon.js');

  return {
    Setting,
    SettingGroup,
    SettingItem,
    mainSetting
  }
})()