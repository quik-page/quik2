(function(){
  var eventFn={
    focus:[],
    blur:[],
    input:[],
    beforeenter:[],
    afterenter:[]
  };
  var sg=new SettingGroup({
    title:"搜索框",
    index:1
  });
  mainSetting.addNewGroup(sg);
  var core=_REQUIRE_('./_core.js')
  var ui=_REQUIRE_('./_ui.js')

  return{
    value:ui.setValue,
    addNewSug:core.addNewSA,
    addEventListener:function(event,callback){
      if(eventFn[event]){
        eventFn[event].push(callback);
      }
    },
    getSearchType:core.searchUtil.getSearchType,
    getSearchTypeList:core.searchUtil.getSearchTypeList,
    getSearchTypeIndex:core.searchUtil.getSearchTypeIndex,
    setSearchType:core.searchUtil.setSearchType,
    setSearchList:core.searchUtil.setSearchList,
    search:{
      addEventListener:core.searchUtil.addEventListener
    },
    sg
  }
})()