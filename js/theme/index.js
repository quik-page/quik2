(function(){

  // 等待重构

  var eventHandle=getEventHandle();
  var addEventListener=eventHandle.addEventListener;
  var removeEventListener=eventHandle.removeEventListener;
  var doevent=eventHandle.doevent;
  var initsto=storage('theme',{
    sync:true,
    title:"主题设置",
  });
  var n=null;
  if(!initsto.get('theme')){
    initsto.set('theme','a');
  }
  var si=new SettingItem({
    index:0,
    title:"主题颜色",
    type:"select",
    message:'',
    get:function(){
      return initsto.get('theme');
    },
    callback:function(v){
      initsto.set('theme',v);
      checkTheme(v);
    },
    init:function(){
      return {
        a:'浅色',b:'深色',c:'跟随时间',d:"跟随系统"
      }
    }
  });

  tyGroup.addNewItem(si);

  var _g=3;
  function checkTheme(v){
    if(_g!=3){_g=false;}
    if(v=='b'){
      document.body.classList.add('dark');
      doevent('change',['dark']);
      n='dark';
    }else if(v=='a'){
      document.body.classList.remove('dark');
      doevent('change',['light']);
      n='light'
    }else if(v=='c'){
      if(new Date().getHours()>=18||new Date().getHours()<6){
        document.body.classList.add('dark');
        doevent('change',['dark']);
        n='dark';
      }else{
        document.body.classList.remove('dark');
        doevent('change',['light']);
        n='light'
      }
    }else if(v=='d'){
      if(window.matchMedia){
        if(_g==3){
          _g=true;
          listenTheme();
        }else{
          _g=true;
        }
      }else{
        toast('你的浏览器不支持此功能')
      }
    }
  }
  function listenTheme(){
    var d=window.matchMedia('(prefers-color-scheme: dark)');
    console.log(d);
    d.matches?document.body.classList.add('dark'):document.body.classList.remove('dark');
    d.addEventListener('change', e => {
      if(e.matches){
        document.body.classList.add('dark');
        doevent('change',['dark']);
        n='dark';
      }else{
        document.body.classList.remove('dark');
        doevent('change',['light']);
        n='light'
      }
    });
  }

  checkTheme(initsto.get('theme'));

  function getTheme(){
    return n;
  }
  return {
    setTheme:function(v){
      initsto.set('theme',v);
      checkTheme(v);
      si.reGet();
    },
    addEventListener,
    removeEventListener,
    getTheme,
  }
})()