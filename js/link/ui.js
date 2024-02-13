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
      try{util.query(linkF,'.cate-bar-items .cate-item.active').classList.remove('active');}catch(e){};
      this.classList.add('active');
      actCate(this.innerText)
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
    linkF.innerHTML=`<div class="cate-bar">
      <div class="cate-bar-controls">
        <div class="cate-left-btn">${util.getGoogleIcon('e314')}</div>
      </div>
      <div class="cate-bar-scrolls">
        <div class="cate-bar-items">
          <div class="cate-item mr active">默认</div>
        </div>
      </div>
      <div class="cate-bar-controls">
      <div class="cate-right-btn">${util.getGoogleIcon('e315')}</div>
        <div class="cate-add-btn">${util.getGoogleIcon('e145')}</div>
      </div>
    </div>
    <ul class="link-list"></ul>`
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
        console.log('addcate');
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
      actCate();
    })
  observeCate();

  }
  function checkScrollBtn(){
    if(this.scrollLeft==0){
      util.query(linkF,'.cate-left-btn').classList.add('disabled');
    }else{
      util.query(linkF,'.cate-left-btn').classList.remove('disabled');
    }
    if(this.scrollLeft>=this.scrollWidth-this.getBoundingClientRect().width){
      util.query(linkF,'.cate-right-btn').classList.add('disabled');
    }else{
      util.query(linkF,'.cate-right-btn').classList.remove('disabled');
    }
  }
  window.addEventListener('resize',function(){
    console.log('r');
    checkScrollBtn.call(util.query(linkF,'.cate-bar-scrolls'));
  })
  function observeCate(){
    var ob=new MutationObserver(function(){
      setTimeout(function(){
        var cates=util.query(linkF,'.cate-bar-items .cate-item',true);
        var w=0;
        cates.forEach(function(c){
          // edit at 2024年1月29日 15点37分
          // @note 因为加了margin
          w+=c.getBoundingClientRect().width+4;
        })
        util.query(linkF,'.cate-bar-items').style.width=w+'px';
        checkScrollBtn.call(util.query(linkF,'.cate-bar-scrolls'));
      },1)
      
    });
    ob.observe(util.query(linkF,'.cate-bar-items'),{childList:true});
  }

  link.addEventListener('change',function(cl){
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

  function actCate(cate){
    util.query(linkF,'.link-list').innerHTML='';
    link.getLinks(cate,function(ls){
      linklist=ls.data;
      ls.data.forEach(function(l){
        var li=util.element('li');
        li.innerHTML=`<a href="${l.url}" target="_blank" rel="noopener noreferer">
   <img src="${util.getFavicon(l.url,true)}" onerror='this.src=quik.util.getFavicon(this.parentElement.href)'/>
   <p></p>
 </a>`
        util.query(linkF,'.link-list').append(li);
        util.query(li,'p').innerText=l.title;
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
        content:`<form>
          <h1></h1>
          <div class="content">
            <p>URL ：<input class="link-add-url" type="url" required placeholder="链接地址(必填)"/></p>
            <p>标题：<input class="link-add-title" type="text" required placeholder="链接标题(必填)"/></p>
            <p>位置：<input class="link-add-index" type="number" min="0" placeholder="链接位置"/></p>
          </div>
          <div class="footer">
            <div class="cancel btn">取消</div>
            <button class="ok btn"></button>
          </div>
        </form>`,
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
      if(index==-1){
        util.query(d,'h1').innerHTML='添加链接';
        util.query(d,'.ok.btn').innerHTML='添加';
        util.query(d,'input.link-add-url').value='';
        util.query(d,'input.link-add-title').value='';
        util.query(d,'input.link-add-index').setAttribute('max',linklist.length);
        util.query(d,'input.link-add-index').value=util.query(d,'input.link-add-index').max;
        util.query(d,'form').onsubmit=function(e){
          e.preventDefault();
          var url=util.query(d,'.link-add-url').value;
          var title=util.query(d,'.link-add-title').value;
          var index=util.query(d,'.link-add-index').value;
          index=typeof index=='undefined'?(util.query(d,'.link-add-index').max-0):index;
          link.addLink({
            url,title,index,cate
          },function(){
            toast.show('添加成功')
          })
          linkaddDialog.close();
        }
      }else{
        util.query(d,'h1').innerHTML='修改链接';
        util.query(d,'.ok.btn').innerHTML='修改';
        util.query(d,'input.link-add-url').value=linklist[index].url;
        util.query(d,'input.link-add-title').value=linklist[index].title;
        util.query(d,'input.link-add-index').value=index;
        util.query(d,'input.link-add-index').setAttribute('max',linklist.length-1);
        util.query(d,'form').onsubmit=function(e){
          e.preventDefault();
          var url=util.query(d,'.link-add-url').value;
          var title=util.query(d,'.link-add-title').value;
          var index2=util.query(d,'.link-add-index').value-0;
          index2=typeof index=='undefined'?index:index2;
          link.changeLink(cate,index,{
            url:url,
            title:title,
            index:index2
          },function(){
            toast.show('修改成功')
          })
          linkaddDialog.close();
        }
      }
      
    })
  }

  var cateeditDialog;

  function openCateEditDialog(cate){
    if(!cateeditDialog){
      cateeditDialog=new dialog({
        class:"link-add-dialog",
        content:`<form>
          <h1></h1>
          <div class="content">
            <p>标题：<input class="cate-name" type="text" required placeholder="分组标题(必填)"/></p>
          </div>
          <div class="footer">
            <div class="cancel btn">取消</div>
            <button class="ok btn">确定</button>
          </div>
        </form>`,
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
})();