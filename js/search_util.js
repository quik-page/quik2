(function(){
  if(!storage){
    return;
  }

  var initsto=storage('search');
  var keyword="%keyword%";
  var deftypelist={
    "bing":"https://cn.bing.com/search?q="+keyword,
    "baidu":"https://www.baidu.com/s?wd="+keyword,
    "so":"https://so.com/s?q="+keyword,
    "sogou":"https://sogou.com/web?query="+keyword,
    "google":"https://google.com/search?q="+keyword,
  };
  if(!initsto.get('typelist')){
    initsto.set('typelist',deftypelist);
  }
  if(!initsto.get('type')){
    initsto.set('type',"bing");
  }

  var events={};

  var getSearchType=function(){
    return initsto.get('typelist')[initsto.get('type')];
  }
  var addEventListener=function(ev,fn){
    if(events[ev]){
      events[ev].push(fn);
    }else{
      events[ev]=[fn];
    }
  }

  var doevents=function(ev,data){
    if(events[ev]){
      events[ev].forEach(function(item){
        item.apply(null,data);
      })
    }
  }
  var setSearchList=function(newList){
    if(Object.keys(newList).length==0){
      throw new Error('newList is empty');
    }
    initsto.set('typelist',newList);
    var oldList=initsto.get('typelist');
    doevents('typelistchange');
    var t=initsto.get('type');
    if(oldList[t]!=newList[t]){
      doevents('nowtypechange');
    }
  }
  var getSearchTypeList=function(){
    return initsto.get('typelist')
  }
  var setSearchType=function(type){
    initsto.set('type',type);
    doevents('nowtypechange');
  }
  var getSearchTypeIndex=function(){
    return initsto.get('type');
  }

  var retob={
    getSearchType:getSearchType,
    addEventListener:addEventListener,
    setSearchList:setSearchList,
    getSearchTypeList:getSearchTypeList,
    setSearchType:setSearchType,
    getSearchTypeIndex:getSearchTypeIndex
  }

  Object.defineProperty(retob,'keywordText',{
    get:function(){
      return keyword;
    }
  });

  return retob;
})();