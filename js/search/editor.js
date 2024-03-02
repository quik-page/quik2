(function(){
  var dia=new dialog({
    content:_REQUIRE_('./editor.html').replace('{{close}}',util.getGoogleIcon('e5cd')),
  mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
    class:"search_editor"
  });

  var d=dia.getDialogDom();
  
  util.query(d,'.closeBtn').onclick=util.query(d,'.cancel.btn').onclick=function(){
    dia.close();
  }
  util.query(d,'.ok.btn').onclick=util.query(d,'.cancel.btn').onclick=function(){
    var nlist={};
    util.query(d,'.searchlist .item',true).forEach(function(item){
      nlist[item.dataset.k]=item.querySelector('.url input').value;
    });
    list=nlist;
    if(!list[omnibox.getSearchTypeIndex()]){
      omnibox.setSearchType('bing');
    }
    omnibox.setSearchList(list);
    dia.close();
    toast.show('设置成功')
  }

  var list=omnibox.getSearchTypeList();
  var str='';
  for(var k in list){
    str+='<div class="item" data-k="'+k+'">'+
'<div class="icon"><img/></div>'+
'<div class="url"><input value="'+list[k]+'"/></div>'+
'<div class="remove">'+util.getGoogleIcon('e5cd')+'</div>'+
'</div>';
  }
  str+=`<div class="addnewitem">${util.getGoogleIcon('e145')} 添加新的搜索引擎</div>`
  util.query(d,'.searchlist').innerHTML=str;

  util.query(d,'.searchlist .item',true).forEach(function(item){
    clitem(item);
  });
  util.query(d,'.searchlist .addnewitem').onclick=function(){
    var item=util.element('div',{
      class:'item',
      'data-k':"user_"+Date.now().toString().slice(3)
    });
    item.innerHTML='<div class="icon"><img src="https://cn.bing.com/favicon.ico"/></div>'+
    '<div class="url"><input value="https://cn.bing.com/search?q=%keyword%"/></div>'+
    '<div class="remove">'+util.getGoogleIcon('e5cd')+'</div>';
    util.query(d,'.searchlist').insertBefore(item,util.query(d,'.searchlist .addnewitem'));
    clitem(item);
  }


  function clitem(item){
    util.getFavicon(list[item.getAttribute('data-k')],function(fav){
      if(fav){
        util.query(item,'.icon img').src=fav;
      }else{
        util.query(item,'.icon img').src=util.createIcon('s');
      }
    })
    util.query(item,'.url input').oninput=function(){
      if(this.parentElement.parentElement.dataset.k=='bing'){
        this.value=list['bing'];
        toast.show('该项只读');
        return;
      }
      // @note 隐藏用户输入了不正确的URL的报错
      // @edit at 2024/1/30 15:28
      try{
        var img=this.parentElement.parentElement.querySelector('.icon img')
        util.getFavicon(this.value,function(fav){
          if(fav){
            img.src=fav;
          }else{
            img.src=util.createIcon('s');
          }
        })
      }catch(e){
        // 用户输入了不正确的URL
      }
    }
    util.query(item,'.remove').onclick=function(){
      if(this.parentElement.dataset.k=='bing'){
        this.value=list['bing'];
        toast.show('该项不可删除');
        return;
      }
      this.parentElement.remove();
    }
  }


  var si=new SettingItem({
    title:"自定义搜索引擎",
    index:2,
    type:'null',
    message:"",
    callback:function(value){
      dia.open();
    }
  })
  omnibox.sg.addNewItem(si);
})();