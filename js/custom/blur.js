(function(){
    var si=new SettingItem({
      index:3,
      title:"毛玻璃效果",
      message:"为所有内容开启毛玻璃效果，可能会影响性能。",
      type:"boolean",
      get:function(){
        return !!initsto.get('dialogblur');
      },
      callback:function(v){
        initsto.set('dialogblur',v);
        d(v);
      }
    })
  
    tyGroup.addNewItem(si);
  
    function d(v){
      if(v){
        document.body.classList.add('dialogblur');
      }else{
        document.body.classList.remove('dialogblur');
      }
    }
  
    d(initsto.get('dialogblur'));
    return {
      set:function(a){
        a=!!a;
        initsto.set('dialogblur',a);
        d(a);
        si.reGet();
      },
      get:function(){
        return initsto.get('dialogblur');
      }
    };
  })();