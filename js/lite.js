(function(){
  var initsto=storage('lite',{
    sync:true
  });
  var si=new SettingItem({
    index:2,
    title:"极简模式",
    message:"隐藏所有图标和链接，点击LOGO显示",
    type:"boolean",
    get:function(){
      return !!initsto.get('lite');
    },
    callback:function(v){
      initsto.set('lite',v);
      d(v);
    }
  })

  tyGroup.addNewItem(si);

  function d(v){
    document.body.classList.remove('showall');
    if(v){
      document.body.classList.add('lite');
    }else{
      document.body.classList.remove('lite');
      link.cateWidthShiPei();
    }
  }

  document.querySelector("main .center .logo").addEventListener('click',function(){
    if(initsto.get('lite')){
      if(document.body.classList.contains('showall')){
        document.body.classList.remove('showall');
      }else{
        document.body.classList.add('showall');
        link.cateWidthShiPei();
      }
    }
  })

  d(initsto.get('lite'));
})();