(function(){
  var ImgOrVideoSi=new SettingItem({
    title:"背景图片/视频显示设置",
    message:"设置背景图片/视频显示的蒙版和模糊等",
    type:"null",
    callback:function(){
      ImgOrVideoSe.open();
    }
  });

  backgroundsg.addNewItem(ImgOrVideoSi);

  var ImgOrVideoSe=new Setting({
    title:"背景图片/视频显示设置",
  });

  var ivsg=new SettingGroup({
    title:"通用",
    index:0
  });

  var ivse_mb=new SettingItem({
    title:"背景蒙版浓度",
    index:1,
    type:"range",
    init:function(){
      return [0,90]
    },
    get:function(){
      return initsto.get('ivsetting').mb;
    },
    callback:function(v){
      var o=initsto.get('ivsetting');
      o.mb=v;
      initsto.set('ivsetting',o);
      r();
    }
  })

  var ivse_isbr=new SettingItem({
    title:"背景模糊",
    message:"可能会影响性能",
    type:"boolean",
    index:2,
    get:function(){
      return initsto.get('ivsetting').isbr;
    },
    callback:function(v){
      if(v){
        ivse_br.show();
      }else{
        ivse_br.hide();
      }
      var o=initsto.get('ivsetting');
      o.isbr=v;
      initsto.set('ivsetting',o);
      r();
    }
  });
  

  var ivse_br=new SettingItem({
    title:"背景模糊程度",
    index:3,
    type:"range",
    init:function(){
      return [1,20]
    },
    get:function(){
      return initsto.get('ivsetting').br;
    },
    callback:function(v){
      var o=initsto.get('ivsetting');
      o.br=v;
      initsto.set('ivsetting',o);
      r();
    }
  });

  ImgOrVideoSe.addNewGroup(ivsg);
  ivsg.addNewItem(ivse_mb);
  ivsg.addNewItem(ivse_isbr);
  ivsg.addNewItem(ivse_br);
  if(!initsto.get('ivsetting').isbr){
    ivse_br.hide();
  }

  function r(){
    // create Style
    
    var o=initsto.get('ivsetting');
    var s=document.querySelector("#ivbgse");
    if(!s){
      s=document.createElement('style');
      s.id='ivbgse';
      document.head.append(s);
    }
    var h='';
    h+='.img-sp .cover,.video-sp .cover{background-color:rgba(0,0,0,'+(o.mb/100)+')}';
    if(o.isbr){
      h+='.img-sp .cover,.video-sp .cover{backdrop-filter:blur('+o.br+'px)}'
    }
    s.innerHTML=h;
  }

  r();
  return ImgOrVideoSi;
})();