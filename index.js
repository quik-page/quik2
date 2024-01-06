(function(){
  var util=_REQUIRE_('./js/util.js');
  var toast=_REQUIRE_('./js/toast.js');
  var storage=_REQUIRE_('./js/storage.js');
  var dialog=_REQUIRE_('./js/dialog.js');
  var menu=_REQUIRE_('./js/menu.js');
  var iconc=_REQUIRE_('./js/iconc.js');
  var setting=_REQUIRE_('./js/setting.js');
  var setting_new=_REQUIRE_('./js/setting_new.js');
  var omnibox=_REQUIRE_('./js/omnibox.js');
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
    // linkUI:linkUI,
    dialog:dialog,
    says:says,
    menu:menu,
    setting:setting,
    iconc:iconc,
    background:background,
    mainmenu:mainmenu,
    Setting:setting_new.Setting,
    SettingGroup:setting_new.SettingGroup,
    SettingItem:setting_new.SettingItem,
  }
  document.querySelector("main").style.display='';
})();


var testSetting=new quik.Setting({
  title:"测试设置"
});

var testSettingGroup=new quik.SettingGroup({
  title:"测试设置组",
  index:1
})

var testSettingItem=new quik.SettingItem({
  title:"测试设置项",
  message:"Hello",
  index:1,
  type:"string",
  get:function(){
    return 'test';
  },
  check:function(){
    return true;
  },
  callback:function(v){
    console.log(v);
  }
});
var testSettingItem2=new quik.SettingItem({
  title:"测试设置项2",
  message:"Hello",
  index:2,
  type:"boolean",
  get:function(){
    return true;
  },
  check:function(){
    return true;
  },
  callback:function(v){
    console.log(v);
  }
});
var testSettingItem3=new quik.SettingItem({
  title:"测试设置项",
  message:"Hello",
  index:3,
  type:"select",
  get:function(){
    return 'c';
  },
  check:function(){
    return true;
  },
  callback:function(v){
    console.log(v);
  },
  init:function(){
    return {
      'a':'A',
      'b':'B',
      'c':'C'
    }
  }
});

testSetting.addNewGroup(testSettingGroup);
testSettingGroup.addNewItem(testSettingItem);
testSettingGroup.addNewItem(testSettingItem2);
testSettingGroup.addNewItem(testSettingItem3);

testSetting.open();