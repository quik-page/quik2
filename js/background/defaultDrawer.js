(function(){
  var initsto=storage('bg-def-user');
  var neizhiImg=[
    {
      thumbnail:"https://image.gumengya.com/thumbnails/06470348c93db185e44f8acd87c5b683.png",
      img:"img-https://image.gumengya.cn/i/2023/10/13/65294cf55ef7d.png",
    },
    {
      thumbnail:"https://image.gumengya.com/thumbnails/5e6200d4552394e722967ef96addd06a.png",
      img:"img-https://image.gumengya.cn/i/2023/10/13/65294c34841b4.jpg",
    },
    {
      thumbnail:"https://image.gumengya.com/thumbnails/7ee6991ee0f43be59c28d183597e0cca.png",
      img:"img-https://image.gumengya.cn/i/2023/10/13/65294c30563b7.jpg",
    },
    {
      thumbnail:"https://image.gumengya.com/thumbnails/ff674343879116e22e3cf713358f2cb5.png",
      img:"img-https://image.gumengya.com/thumbnails/ff674343879116e22e3cf713358f2cb5.png",
    },
    {
      thumbnail:"https://image.gumengya.com/thumbnails/c9c187157ca050044a6589f230e8ddbf.png",
      img:"img-https://image.gumengya.cn/i/2023/10/13/65294c2d8aae1.png",
    }
  ];

  function hasUploadedImg(){
    return !!initsto.get('upload');
  }
  return {
    type: "default",
    init: function (e) {
      // pushTab 图片/视频
      var tab1=e.pushBgTab({
        tab:"图片/视频",
        content:_REQUIRE_('./htmls/imgvideobgtab.html')
      });

      if(!hasUploadedImg()){
        util.query(tab1,'.hasBg').style.display='none';
        util.query(tab1,'.zdy .editbtn').style.display='none';
      }else{
        util.query(tab1,'.noBg').style.display='none';
      }

      var u=util.query(tab1,'.neizhi .unit-content');
      neizhiImg.forEach(function(im){
        var bgitem=util.element('div',{
          class:"bgitem def",
          'data-img':im.img,
        });
        bgitem.innerHTML='<div class="left"><img src="'+im.thumbnail+'"/></div>'
        u.appendChild(bgitem);
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