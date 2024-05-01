(function(){
  var initsto=storage('lite',{
    sync:true,
    title:"极简模式"
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
  var liteBack=util.element('div',{
    class:"liteback"
  });

  liteBack.innerHTML=util.getGoogleIcon('e5ce');
  document.querySelector('main .center').appendChild(liteBack);
  liteBack.addEventListener('click',function(){
    document.body.classList.remove('showall');
    document.body.classList.add('hiden');
  })

  function d(v){
    document.body.classList.remove('hiden');
    document.body.classList.remove('showall');
    if(v){
      document.body.classList.add('lite');
      document.body.classList.add('hiden');
    }else{
      document.body.classList.remove('lite');
      link.cateWidthShiPei();
    }
  }

  document.querySelector("main .center .logo").addEventListener('click',function(){
    document.body.classList.add('showall');
    document.body.classList.remove('hiden');
    link.cateWidthShiPei();
  })

  d(initsto.get('lite'));
  return {
    set:function(a){
      a=!!a;
      initsto.set('lite',a);
      d(a);
      si.reGet();
    },
    get:function(){
      return initsto.get('lite');
    }
  };
})();