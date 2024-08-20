(()=>{
  var initsto=setting.settingSto;
  var {on,off,doevent}=getEventHandle();
  var sg=new SettingGroup({
    title:"搜索框",
    index:1
  });
  mainSetting.addNewGroup(sg);
  var core=_REQUIRE_('./_core.js')
  var ui=_REQUIRE_('./_ui.js')

  var _isen=initsto.get('ob_enable')
  if(_isen&&!core.isInit()){
    core.initNative();
  }
  core.initSett(_isen);
  ui.uiEnable(_isen);

  return{
    value:ui.setValue,
    focus:ui.focus,
    blur:ui.blur,
    isblur:ui.isblur,
    addNewSug:core.addNewSA,
    addNewType:core.addNewType,
    on,
    off,
    getSearchType:core.searchUtil.getSearchType,
    getSearchTypeList:core.searchUtil.getSearchTypeList,
    getSearchTypeIndex:core.searchUtil.getSearchTypeIndex,
    setSearchType:core.searchUtil.setSearchType,
    setSearchList:core.searchUtil.setSearchList,
    keywordText:core.searchUtil.keywordText,
    neizhi:core.searchUtil.neizhi,
    search:{
      on:core.searchUtil.on
    },
    sg,
    setAutoFocus:ui.setAutoFocus,
    setJustSearch:ui.setJustSearch
  }
})()