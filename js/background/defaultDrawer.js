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

      // pushTab 自定义

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