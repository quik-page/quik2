(()=>{
  
  function getIndex(a,b){
    for(var i=0;i<b.length;i++){
      if(b[i].isSameNode(a)){
        return i;
      }
    }
    return -1;
  }
  
  var linklist = [];

  var draglink=_REQUIRE_('./draglink.js');

  var {
    init,
    linkF,
    linksg,
    resetmenued
  }=_REQUIRE_('./ui/init.js');

  var {
    getMenuedCate,
    observeCate,
    dcate,
    cateWidthShiPei,
    enabledCateSi
  }=_REQUIRE_('./ui/cate.js');

  var {
    drawLinks,
    dstyle,
    dsize,
    getMenuedLi,
    linkSizeSi
  }=_REQUIRE_('./ui/link.js');
  


  init();

  return {
    isShowCate(){
      return initsto.get('enabledCate');
    },
    setShowCate(v){
      initsto.set('enabledCate',v);
      dcate(v);
      enabledCateSi.reGet();
    },
    getLinkSize(){
      return initsto.get('linksize');
    },
    setLinkSize(v){
      if(['xs','s','m','l','xl'].indexOf(v)!=-1){
        initsto.set('linksize',v);
        dsize(v);
        linkSizeSi.reGet();
      }
    },
    cateWidthShiPei
  }
  
})();