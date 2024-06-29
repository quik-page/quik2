(function(){
  
  var initsto=storage('setting',{
    title:"设置",
    desc:"QUIK起始页的各项设置",
    sync:true
  })
  var Setting=_REQUIRE_('./setting.js');
  var SettingGroup=_REQUIRE_('./setting_group.js');
  var SettingItem=_REQUIRE_('./setting_item.js');
  var mainSetting=_REQUIRE_('./main_setting.js');
  _REQUIRE_('./setting_icon.js');
  // @note 添加通用SettingGroup，方便添加设置
  // @edit at 2024/1/31 10:22
  var tyGroup=new SettingGroup({
    title:"通用",
    index:0
  });
  mainSetting.addNewGroup(tyGroup);

  return {
    Setting,
    SettingGroup,
    SettingItem,
    mainSetting,
    tyGroup,
    settingSto:initsto
  }
})()