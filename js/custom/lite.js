(function(){
  util.initSet(initsto,'linkblur',true);
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
  var si2=new SettingItem({
    index:3,
    title:"链接页面背景模糊",
    message:"链接页面背景一般模糊显示，关闭后正常显示",
    type:"boolean",
    get:function(){
      return initsto.get('linkblur');
    },
    callback:function(v){
      initsto.set('linkblur',v);
      linkblur(v);
    }
  })

  tyGroup.addNewItem(si);
  tyGroup.addNewItem(si2);
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
  si2.show();
    }else{
      document.body.classList.remove('lite');
      link.cateWidthShiPei();
  si2.hide();
    }
  }

  function linkblur(v){
    if(v){
      document.querySelector('main').classList.remove('noblur');
    }else{
      document.querySelector('main').classList.add('noblur');
    }
  }

  document.querySelector("main .center .logo").addEventListener('click',function(){
    document.body.classList.add('showall');
    document.body.classList.remove('hiden');
    link.cateWidthShiPei();
  })

  d(initsto.get('lite'));
  linkblur(initsto.get('linkblur'));
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