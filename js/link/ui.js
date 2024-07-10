(function(){
  var linkF=util.element('div',{
    class:"links"
  });

  util.query(document,'main .center').append(linkF);

  function getIndex(a,b){
    for(var i=0;i<b.length;i++){
      if(b[i].isSameNode(a)){
        return i;
      }
    }
    return -1;
  }
  
  var menuedLi=null;
  var linklist=[];
  var linkMenu=new menu({
    list:[{
      icon:util.getGoogleIcon('e3c9'),
      title:"修改",
      click:function(){
        var index=getIndex(menuedLi,util.query(linkF,'.link-list li',true));
        var cate=util.query(linkF,'.cate-bar-items .cate-item.active');
        if(cate.classList.contains('mr')){
          cate=null
        }else{
          cate=cate.innerText;
        }
        openLinkEditDialog(index,cate);
      }
    },{
      icon:util.getGoogleIcon('e92e'),
      title:"删除",
      click:function(){
        var index=getIndex(menuedLi,util.query(linkF,'.link-list li',true));
        var cate=util.query(linkF,'.cate-bar-items .cate-item.active');
        if(cate.classList.contains('mr')){
          cate=null
        }else{
          cate=cate.innerText;
        }
        link.deleteLink(cate,index,function(){
          toast.show('删除成功')
        })
      }
    },{
      icon:util.getGoogleIcon('e14d'),
      title:"复制链接",
      click:function(){
        util.copyText(util.query(menuedLi,'a').href);
      }
    }]
  });
  var menuedCate=null;
  var cateMenu=new menu({
    list:[{
      icon:util.getGoogleIcon('e3c9'),
      title:"重命名",
      click:function(){
        var cate=menuedCate.innerText;
        openCateEditDialog(cate);
      }
    },{
      icon:util.getGoogleIcon('e92e'),
      title:"删除",
      click:function(){
        var cate=menuedCate.innerText;
        link.deleteCate(cate,function(result){
          if(result==0){
            toast.show('删除成功')
          }else{
            toast.show(result.msg);
          }
        });
      }
    }]
  });

  function bcate(g){
    var li=util.element('div',{
      class:"cate-item"
    });
    li.innerText=g;
    util.query(linkF,'.cate-bar-items').append(li);
    li.onclick=function(){
      actCate(this)
    }
    li.oncontextmenu=function(e){
      e.preventDefault();
      menuedCate=this;
      cateMenu.setOffset({
        top:e.pageY,
        left:e.pageX
     })
     cateMenu.show();
    }
  }
  function init(){
    linkF.innerHTML=_REQUIRE_('./htmls/linkinit.html').replace('{{cate-left}}',util.getGoogleIcon('e314')).replace('{{cate-right}}',util.getGoogleIcon('e315')).replace('{{cate-add}}',util.getGoogleIcon('e145'))
    link.ready(function(){
      link.getCates(function(r){
        r.data.forEach(function(g){
          bcate(g);
        });
      })
      util.query(linkF,'.cate-item.mr').onclick=function(){
        try{util.query(linkF,'.cate-bar-items .cate-item.active').classList.remove('active');}catch(e){};
        this.classList.add('active');
        actCate();
      }
      util.query(linkF,'.cate-add-btn').onclick=function(){
        openCateEditDialog();
      }
      util.query(linkF,'.cate-left-btn').onclick=function(){
        util.query(linkF,'.cate-bar-scrolls').scrollTo({
          left:
            c(util.query(linkF,'.cate-bar-scrolls').scrollLeft-
            util.query(linkF,'.cate-bar-scrolls').getBoundingClientRect().width/2),
          behavior: 'smooth'
        })
      }
      util.query(linkF,'.cate-right-btn').onclick=function(){
        util.query(linkF,'.cate-bar-scrolls').scrollTo({
          left:
            c(util.query(linkF,'.cate-bar-scrolls').scrollLeft+
            util.query(linkF,'.cate-bar-scrolls').getBoundingClientRect().width/2),
          behavior: 'smooth'
        })
      }
      function c(a){
        if(a<0)return 0;
        var w=util.query(linkF,'.cate-bar-scrolls').scrollWidth-util.query(linkF,'.cate-bar-scrolls').getBoundingClientRect().width;
        if(a>w)return w;
      }
      util.query(linkF,'.cate-bar-scrolls').onscroll=function(){
        checkScrollBtn.call(this);
      }
      checkScrollBtn.call(util.query(linkF,'.cate-bar-scrolls'));
      dcate(initsto.get('enabledCate'));
      dsize(initsto.get('linksize'));
    })
    observeCate();
  }
  function checkScrollBtn(){
    var a=0;
    if(this.scrollLeft==0){
      util.query(linkF,'.cate-left-btn').classList.add('disabled');
      a++;
    }else{
      util.query(linkF,'.cate-left-btn').classList.remove('disabled');
    }
    if(this.scrollLeft>=this.scrollWidth-this.getBoundingClientRect().width){
      util.query(linkF,'.cate-right-btn').classList.add('disabled');
      a++;
    }else{
      util.query(linkF,'.cate-right-btn').classList.remove('disabled');
    }
    this.style.width='calc(100% - '+(120-a*40)+'px)';
  }
  window.addEventListener('resize',function(){
    checkScrollBtn.call(util.query(linkF,'.cate-bar-scrolls'));
  })

  function cateWidthShiPei(){
    var cates=util.query(linkF,'.cate-bar-items .cate-item',true);
    // edit at 2024年2月24日 17点45分
    // @note 清除上次width的影响 （除非width>100000px）
    util.query(linkF,'.cate-bar-items').style.width='100000px';
    // 强行渲染
    cates[0].offsetHeight;
    var w=0;
    cates.forEach(function(c){
      // edit at 2024年1月29日 15点37分
      // @note 因为加了margin
      w+=c.getBoundingClientRect().width+4;
    })
    util.query(linkF,'.cate-bar-items').style.width=w+'px';
    checkScrollBtn.call(util.query(linkF,'.cate-bar-scrolls'));
  }
  function observeCate(){
    var ob=new MutationObserver(function(){
      setTimeout(cateWidthShiPei,1)
      
    });
    ob.observe(util.query(linkF,'.cate-bar-items'),{
      childList:true
    });
  }

  link.on('change',function(cl){
    var actcate=util.query(linkF,'.cate-bar-items .cate-item.active');
    if(cl.cate==actcate.innerText||(cl.cate==null&&actcate.classList.contains('mr'))){
      if(['add','change','delete'].indexOf(cl.type)!=-1){
        actCate(cl.cate);
      }
    }
    if(cl.type=='cateadd'){
      bcate(cl.cate);
    }else if(cl.type=='catedelete'){
      var cates=util.query(linkF,'.cate-bar-items .cate-item',true);
      for(var i=0;i<cates.length;i++){
        if(cates[i].innerText==cl.cate){
          if(cates[i].classList.contains('active')){
            actCate();
            util.query(linkF,'.cate-bar-items .cate-item.mr').classList.add('active');
          }
          cates[i].remove();
          break;
        }
      }
    }else if(cl.type=='caterename'){
      var cates=util.query(linkF,'.cate-bar-items .cate-item',true);
      for(var i=0;i<cates.length;i++){
        if(cates[i].innerText==cl.cate){
          cates[i].innerText=cl.catename;
          break;
        }
      }
    }
  })

  function actCate(cateEl){
    util.query(linkF,'.link-list').innerHTML='';
    var cate=null;
    if(typeof cateEl=='string'){
      try{util.query(linkF,'.cate-bar-items .cate-item.active').classList.remove('active');}catch(e){};
      var cateEls=util.query(linkF,'.cate-bar-items .cate-item',true);
      for(var i=0;i<cateEls.length;i++){
        if(cateEls[i].classList.contains('mr')){
          continue;
        }
        if(cateEls[i].innerText==cateEl){
          cateEls[i].classList.add('active');
          break;
        }
      }
      cate=cateEl;
    }else if(!cateEl){
      try{util.query(linkF,'.cate-bar-items .cate-item.active').classList.remove('active');}catch(e){};
      util.query(linkF,'.cate-bar-items .cate-item.mr').classList.add('active');
    }else{
      try{util.query(linkF,'.cate-bar-items .cate-item.active').classList.remove('active');}catch(e){};
      cateEl.classList.add('active');
      cate=cateEl.innerText;
    }
    

    link.getLinks(cate,function(ls){
      linklist=ls.data;
      ls.data.forEach(function(l){
        var li=util.element('li');
        li.innerHTML=`<a href="${l.url}" target="_blank" rel="noopener noreferer"><img/><p></p></a>`
        util.query(linkF,'.link-list').append(li);
        util.query(li,'p').innerText=l.title;
        util.getFavicon(l.url,function(favicon){
          if(favicon){
            util.query(li,'img').src=favicon;
          }else{
            util.query(li,'img').src=util.createIcon(l.title[0]);
          }
        });
        li.oncontextmenu=function(e){
          e.preventDefault()
           menuedLi=this;
           linkMenu.setOffset({
              top:e.pageY,
              left:e.pageX
           })
           linkMenu.show();
         }
      })
      var li=util.element('li',{
        class:"link-add"
      });
      li.innerHTML=`<a href="javascript:void(0)" class="material-symbols-outlined">&#xe145;</a>`;
      util.query(linkF,'.link-list').append(li);
      li.onclick=function(){
        var cate=util.query(linkF,'.cate-bar-items .cate-item.active');
        if(cate.classList.contains('mr')){
          cate=null
        }else{
          cate=cate.innerText;
        }
        openLinkEditDialog(-1,cate);
      }
    })
  }

  init();

  var linkaddDialog;

  function openLinkEditDialog(index,cate){
    if(!linkaddDialog){
      linkaddDialog=new dialog({
        class:"link-add-dialog",
        content:_REQUIRE_('./htmls/linkedit.html'),
      });
      // @note 将cancel按钮修改为div，防止表单submit到cancel
      // @edit at 2024/1/30 15:20
      var d=linkaddDialog.getDialogDom();
      util.query(d,'.cancel.btn').onclick=function(e){
        e.preventDefault();
        linkaddDialog.close();
      }
    }
    setTimeout(function(){
      linkaddDialog.open();
      var d=linkaddDialog.getDialogDom();
      var ll=linklist.length;
      if(index==-1){
        _n('添加链接','添加','','',ll,ll,function(e){
          e.preventDefault();
          var url=util.query(d,'.link-add-url').value;
          if(url.indexOf('://')==-1){
            url='http://'+url;
          }
          var title=util.query(d,'.link-add-title').value;
          var index3=util.query(d,'.link-add-index').value;
          index3=index3==''?ll:(index3-0);
          link.addLink({
            url,title,index: index3,cate
          },function(r){
            if(r.code!=0){
              toast.show(r.msg);
            }else{
              toast.show('添加成功')
              linkaddDialog.close();
            }
          })
        });
      }else{
        _n('修改链接','修改',linklist[index].url,linklist[index].title,ll-1,index,function(e){
          e.preventDefault();
          var url=util.query(d,'.link-add-url').value;
          if(url.indexOf('://')==-1){
            url='http://'+url;
          }
          var title=util.query(d,'.link-add-title').value;
          var index2=util.query(d,'.link-add-index').value;
          index2=index2==''?index:(index2-0);
          link.changeLink(cate,index,{
            url:url,
            title:title,
            index:index2
          },function(back){
            if(back.code!=0){
              toast.show(back.msg);
            }else{
              toast.show('修改成功')
              linkaddDialog.close();
            }
          })
        });
      }
      
      function _n(a,b,c,e,f,g,h){
        util.query(d,'h1').innerHTML=a;
        util.query(d,'.ok.btn').innerHTML=b;
        util.query(d,'input.link-add-url').value=c;
        util.query(d,'input.link-add-title').value=e;
        util.query(d,'input.link-add-index').setAttribute('max',f);
        util.query(d,'input.link-add-index').value=g;
        util.query(d,'form').onsubmit=h;
      }
    })
  }

  var cateeditDialog;

  function openCateEditDialog(cate){
    if(!cateeditDialog){
      cateeditDialog=new dialog({
        class:"link-add-dialog",
        content:_REQUIRE_('./htmls/cateedit.html'),
      });
      // @note 将cancel按钮修改为div，防止表单submit到cancel
      // @edit at 2024/1/30 15:20
    }
      var d=cateeditDialog.getDialogDom();
      util.query(d,'.cancel.btn').onclick=function(e){
        e.preventDefault();
        cateeditDialog.close();
      }
    setTimeout(function(){
      cateeditDialog.open();
      if(cate){
        util.query(d,'h1').innerHTML='修改分组';
        util.query(d,'.cate-name').value=cate;
        util.query(d,'form').onsubmit=function(e){
          e.preventDefault();
          var catename=util.query(d,'.cate-name').value;
          link.renameCate(cate,catename,function(result){
            if(result.code<0){
              toast.show(result.msg);
              return;
            }
            toast.show('修改成功')
            cateeditDialog.close();
          })
        }
      }else{
        util.query(d,'h1').innerHTML='添加分组';
        util.query(d,'.cate-name').value='';
        util.query(d,'form').onsubmit=function(e){
          e.preventDefault();
          var catename=util.query(d,'.cate-name').value;
          link.addCate(catename,function(result){
            if(result.code<0){
              toast.show(result.msg);
              return;
            }
            toast.show('添加成功')
            cateeditDialog.close();
          })
        }
      }
    })
  }
  // initLinks();

  if(typeof initsto.get('enabledCate')=='undefined'){
    initsto.set('enabledCate',false);
  }

  if(!initsto.get('linksize')){
    initsto.set('linksize','m');
  }

  var linksg=new SettingGroup({
    title:"链接",
  });

  var enabledCateSi=new SettingItem({
    type:'boolean',
    title:"链接分组",
    message:"启用链接分组功能来管理链接",
    get:function(){
      return initsto.get('enabledCate');
    },
    callback:function(v){
      initsto.set('enabledCate',v);
      dcate(v);
    }
  });
  var linkSizeSi=new SettingItem({
    type:'select',
    title:"链接大小",
    message:"修改链接显示的大小",
    init:function(){
      return {
        xs:"很小",
        s:"小",
        m:"中",
        l:"大",
        xl:"很大"
      }
    },
    get:function(){
      return initsto.get('linksize');
    },
    callback:function(v){
      initsto.set('linksize',v);
      dsize(v);
    }
  });

  mainSetting.addNewGroup(linksg);
  linksg.addNewItem(enabledCateSi);
  linksg.addNewItem(linkSizeSi);

  function dcate(v){
    actCate();
    if(v){
      util.query(linkF,'.cate-bar').style.display='block';
      setTimeout(function(){cateWidthShiPei();});
    }else{
      util.query(linkF,'.cate-bar').style.display='none';
    }
  }

  function dsize(v){
    util.query(linkF,'.link-list').className='link-list '+v;
  }

  return {
    isShowCate:function(){
      return initsto.get('enabledCate');
    },
    setShowCate:function(v){
      initsto.set('enabledCate',v);
      dcate(v);
      enabledCateSi.reGet();
    },
    getLinkSize:function(){
      return initsto.get('linksize');
    },
    setLinkSize:function(v){
      if(['xs','s','m','l','xl'].indexOf(v)!=-1){
        initsto.set('linksize',v);
        dsize(v);
        linkSizeSi.reGet();
      }
    },
    cateWidthShiPei
  }
  
})();