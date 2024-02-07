(function(){
  return {
    type: "default",
    init: function (e) {
      // pushTab 图片/视频
      e.pushBgTab({
        tab:"图片/视频",
        content:_REQUIRE_('./htmls/imgvideobgtab.html')
      })
      // pushTab 纯色
      e.pushBgTab({
        tab:"纯色",
        content:_REQUIRE_('./htmls/colorbgtab.html')
      })
      // pushTab 自定义
      e.pushBgTab({
        tab:"自定义",
        content:_REQUIRE_('./htmls/custombgtab.html')
      })
    },
    destory: function () {
      // TODO
    },
    cancel: function () {
      // TODO 
    },
    draw:function(){
      // TODO
    }
  }
})();