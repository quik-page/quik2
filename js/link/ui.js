(()=>{
  var linkF=util.element('div',{
    class:"links"
  });

  document.addEventListener('click',resetmenued)
  document.addEventListener('contextmenu',resetmenued)

  function resetmenued(){
    menuedCate&&menuedCate.classList.remove('menued');
    menuedLi&&menuedLi.classList.remove('menued');
  }

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
      click(){
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
      click(){
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
      click(){
        util.copyText(util.query(menuedLi,'a').href);
      }
    }]
  });
  var menuedCate=null;
  var cateMenu=new menu({
    list:[{
      icon:util.getGoogleIcon('e3c9'),
      title:"修改",
      click(){
        var cate=menuedCate.innerText;
        openCateEditDialog(cate);
      }
    },{
      icon:util.getGoogleIcon('e92e'),
      title:"删除",
      click(){
        var cate=menuedCate.innerText;
        link.deleteCate(cate,result=>{
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
      e.stopPropagation();
      resetmenued();
      menuedCate=this;
      cateMenu.setOffset({
        top:e.pageY,
        left:e.pageX
      })
      this.classList.add('menued');
      cateMenu.show();
    }
  }
  function init(){
    linkF.innerHTML=_REQUIRE_('./htmls/linkinit.html')
    .replace('{{cate-left}}',util.getGoogleIcon('e314'))
    .replace('{{cate-right}}',util.getGoogleIcon('e315'))
    .replace('{{cate-add}}',util.getGoogleIcon('e145'))
    .replace('{{mr}}',util.getGoogleIcon('e838',{type:'fill'}))
    link.ready(()=>{
      dcate(initsto.get('enabledCate'));
      dsize(initsto.get('linksize'));
      dstyle(initsto.get('linkstyle'));
      setTimeout(function(){
        linkF.style.opacity=1;
      },300)
    })
    observeCate();
  }

  var isinitcate=false;
  var mrcateMenu=new menu({
    list:[{
      icon:util.getGoogleIcon('e92e'),
      title:"清空",
      click(){
        confirm('确定清空默认分组的链接吗？该操作不可恢复！',function(ok){
          if(ok){
            link.setAll([],null,function(o){
              if(o=='link'){
                toast.show('清空成功')
              }
            });
          }
        })
      }
    }],
    offset:{
      top:0,
      left:0
    }
  });
  function initCate(){
    console.log('initCate');
    if(isinitcate)return;
    link.getCates(r=>{
      r.data.forEach(g=>{
        bcate(g);
      });
    })
    util.query(linkF,'.cate-item.mr').onclick=function(){
      try{util.query(linkF,'.cate-bar-items .cate-item.active').classList.remove('active');}catch(e){};
      this.classList.add('active');
      actCate();
    }
    util.query(linkF,'.cate-item.mr').oncontextmenu=function(e){
      e.preventDefault();
      e.stopPropagation();
      mrcateMenu.setOffset({
        top:e.pageY,
        left:e.pageX
      })
      mrcateMenu.show();
    }
    util.query(linkF,'.cate-add-btn').onclick=()=>{
      openCateEditDialog();
    }
    util.query(linkF,'.cate-left-btn').onclick=()=>{
      util.query(linkF,'.cate-bar-scrolls').scrollTo({
        left:
          c(util.query(linkF,'.cate-bar-scrolls').scrollLeft-
          util.query(linkF,'.cate-bar-scrolls').getBoundingClientRect().width/2),
        behavior: 'smooth'
      })
    }
    util.query(linkF,'.cate-right-btn').onclick=()=>{
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
    isinitcate=true;
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
  window.addEventListener('resize',()=>{
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
    var ob=new MutationObserver(()=>{
      setTimeout(cateWidthShiPei,1)
    });
    ob.observe(util.query(linkF,'.cate-bar-items'),{
      childList:true
    });
  }

  link.on('change',cl=>{
    var actcate=util.query(linkF,'.cate-bar-items .cate-item.active');
    if(cl.cate==actcate.innerText||(cl.cate==null&&actcate.classList.contains('mr'))){
      if(cl.type=='add'){
        var li=glinkli(cl.detail);
        util.query(linkF,'.link-list').insertBefore(li,util.query(linkF,'.link-list .link-add'));
        linklist.push(cl.detail);
      }else if(cl.type=='change'){
        console.log(cl.other);
        if(!(cl.other&&cl.other.justindex)){
          console.log(cl.other);
          linklist.splice(cl.index,1)
          linklist.splice(cl.detail.index,0,cl.detail);
          var lis=util.query(linkF,'.link-list li',true);
          var tli=lis[cl.index];
          util.query(linkF,'.link-list').insertBefore(tli,lis[cl.detail.index+1]);
          util.query(tli,'a').href=cl.detail.url;
          util.query(tli,'p').innerText=cl.detail.title;
          util.getFavicon(cl.detail.url,favicon=>{
            if(favicon){
              util.query(tli,'img').src=favicon;
            }else{
              util.query(tli,'img').src=util.createIcon(cl.detail.title[0]);
            }
          });
        }
      }else if(cl.type=='delete'){
        var li=util.query(linkF,'.link-list li',true)[cl.index];
        li.remove();
        linklist.splice(cl.index,1);
      }else if(cl.type=='all'){
        reinitCate();
        actCate();
      }
    }
    if(cl.type=='cateadd'){
      reinitCate();
      actCate(cl.cate);
    }else if(cl.type=='catedelete'){
      var acate=util.query(linkF,'.cate-bar-items .cate-item.active').innerText;
      reinitCate();
      if(acate!=cl.cate){
        actCate(acate);
      }
    }else if(cl.type=='caterename'){
      var acate=util.query(linkF,'.cate-bar-items .cate-item.active').innerText;
      reinitCate();
      if(acate!=cl.cate){
        actCate(acate);
      }
    }
  })

  function reinitCate(){
    var cates=util.query(linkF,'.cate-bar-items .cate-item',true);
    cates.forEach(c=>{
      if(c.classList.contains('mr')){
        return;
      }else if(c.classList.contains('active')){
        actCate();
      }else{
        c.remove();
      }
    })
    link.getCates(r=>{
      r.data.forEach(g=>{
        bcate(g);
      });
    })
  }

  var draglink=_REQUIRE_('./draglink.js');

  function actCate(cateEl){
    util.query(linkF,'.link-list').innerHTML='<div class="insert-line"></div>';
    var cate=null;
    if(typeof cateEl=='string'){
      if(cateEl=='默认'){
        actCate();
        return;
      }
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
    

    link.getLinks(cate,ls=>{
      linklist=ls.data;
      ls.data.forEach(l=>{
        var li=glinkli(l);
        util.query(linkF,'.link-list').append(li);
      })
      var li=util.element('li',{
        class:"link-add"
      });
      li.innerHTML=`<a href="javascript:void(0)" class="material-symbols-outlined">&#xe145;</a>`;
      util.query(linkF,'.link-list').append(li);
      li.onclick=()=>{
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

  function glinkli(l){
    var li=util.element('li');
        li.innerHTML=`<a href="${l.url}" target="_blank" rel="noopener noreferer"><img/><p></p></a>`
        util.query(li,'p').innerText=l.title;
        util.getFavicon(l.url,favicon=>{
          if(favicon){
            util.query(li,'img').src=favicon;
          }else{
            util.query(li,'img').src=util.createIcon(l.title[0]);
          }
        });
        li.oncontextmenu=function(e){
          e.preventDefault()
          e.stopPropagation();
          resetmenued();
           menuedLi=this;
           linkMenu.setOffset({
              top:e.pageY,
              left:e.pageX
           })
            this.classList.add('menued');
           linkMenu.show();
         }
         draglink(li);
        return li;
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
    setTimeout(()=>{
      linkaddDialog.open();
      var d=linkaddDialog.getDialogDom();
      var ll=linklist.length;
      if(index==-1){
        _n('添加链接','添加','','',ll,ll,(e)=>{
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
          },r=>{
            if(r.code!=0){
              toast.show(r.msg);
            }else{
              toast.show('添加成功')
              linkaddDialog.close();
            }
          })
        });
      }else{
        _n('修改链接','修改',linklist[index].url,linklist[index].title,ll-1,index,(e)=>{
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
          },(back)=>{
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
      util.query(d,'.cancel.btn').onclick=(e)=>{
        e.preventDefault();
        cateeditDialog.close();
      }
    setTimeout(()=>{
      cateeditDialog.open();
      link.getCates(function(r){
        var k=r.data;
        if(cate){
          _n('修改分组',cate,k.indexOf(cate)+1,k.length,function(catename,cateindex){
            link.renameCate(cate,catename,(result)=>{
              if(result.code<0){
                toast.show(result.msg);
                return;
              }
              toast.show('修改成功')
              cateeditDialog.close();
            },cateindex)
          })
        }else{
          _n('添加分组','',k.length+1,k.length+1,function(catename,cateindex){
            link.addCate(catename,(result)=>{
              if(result.code<0){
                toast.show(result.msg);
                return;
              }
              toast.show('添加成功')
              cateeditDialog.close();
            },cateindex)
          });
        }
      });
      
    })

    function _n(a,b,c,f,h){
      util.query(d,'h1').innerHTML=a;
      util.query(d,'.cate-name').value=b;
      util.query(d,'.cate-index').value=c;
      util.query(d,'.cate-index').max=f;
      util.query(d,'.cate-index').min=1;
      util.query(d,'form').onsubmit=(e)=>{
        e.preventDefault();
        var catename=util.query(d,'.cate-name').value;
        var cateindex=util.query(d,'.cate-index').value;
        h(catename,cateindex-1);
      }
    }
  }
  // initLinks();

  if(typeof initsto.get('enabledCate')=='undefined'){
    initsto.set('enabledCate',false);
  }

  if(!initsto.get('linksize')){
    initsto.set('linksize','m');
  }
  if(!initsto.get('linkstyle')){
    initsto.set('linkstyle','round');
  }

  var linksg=new SettingGroup({
    title:"链接",
  });

  var enabledCateSi=new SettingItem({
    type:'boolean',
    title:"链接分组",
    message:"(Alt+G)启用链接分组功能来管理链接",
    get(){
      return initsto.get('enabledCate');
    },
    callback(v){
      initsto.set('enabledCate',v);
      dcate(v);
    }
  });
  var linkSizeSi=new SettingItem({
    type:'select',
    title:"链接大小",
    message:"修改链接显示的大小",
    init(){
      return {
        xs:"很小",
        s:"小",
        m:"中",
        l:"大",
        xl:"很大"
      }
    },
    get(){
      return initsto.get('linksize');
    },
    callback(v){
      initsto.set('linksize',v);
      dsize(v);
    }
  });
  var linkStyleSi=new SettingItem({
    type:'select',
    title:"链接样式",
    message:"修改链接显示的样式",
    init(){
      return {
        def:"圆方",
        round:"圆形",
        square:"方形",
      }
    },
    get(){
      return initsto.get('linkstyle');
    },
    callback(v){
      initsto.set('linkstyle',v);
      dstyle(v);
    }
  });

  mainSetting.addNewGroup(linksg);
  linksg.addNewItem(enabledCateSi);
  linksg.addNewItem(linkSizeSi);
  linksg.addNewItem(linkStyleSi);

  function dcate(v){
    actCate();
    if(v){
      util.query(linkF,'.cate-bar').style.display='block';
      initCate();
      setTimeout(()=>{cateWidthShiPei();},10);
    }else{
      util.query(linkF,'.cate-bar').style.display='none';
    }
  }
  function dstyle(v){
    linkF.className='links '+v;
  }


  function dsize(v){
    util.query(linkF,'.link-list').className='link-list '+v;
  }

  return {
    isShowCate(){
      return initsto.get('enabledCate');
    },
    setShowCate(v){
      initsto.set('enabledCate',v);
      dcate(v);
      enabledCateSi.reGet();
    },
    getLinkSize(){
      return initsto.get('linksize');
    },
    setLinkSize(v){
      if(['xs','s','m','l','xl'].indexOf(v)!=-1){
        initsto.set('linksize',v);
        dsize(v);
        linkSizeSi.reGet();
      }
    },
    cateWidthShiPei
  }
  
})();