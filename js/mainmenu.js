(function(){
  var mainmenu_icon=new iconc.icon({
    class:"main_menu",
    content:util.getGoogleIcon('e5d2'),
    offset:"tr"
  });

  var main_menu=new menu.contextMenu({
    list:[{
      icon:util.getGoogleIcon('e88e'),
      title:"关于QUIK",
      click:function(){

      }
    }],
    offset:{
      top:40,
      right:15
    }
  });

  mainmenu_icon.getIcon().onclick=function(e){
    e.stopPropagation();
    main_menu.show();
  }

  return{
    
  }
})();