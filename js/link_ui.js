(function(){
  var linkF=util.element('div',{
    class:"links"
  });

  util.query(document,'main .center').append(linkF);

  function initLinks(){
    linkF.innerHTML=`<ul class="linklist"></ul>`;
    var ul=util.query(linkF,'ul')
    link.getLinks({type:"all"}).forEach(function(l,i) {
      var li=util.element('li',{
        'data-index':i,
      })
      li.innerHTML=`<a href="${l.url}" target="_blank" rel="noopener noreferer">
        <img src="${util.getFavicon(l.url,true)}" onerror='this.src=quik.util.getFavicon(this.parentElement.href)'/>
        <p></p>
      </a><div class="material-symbols-outlined editlinkbtn">&#xe3c9;</div>`;
      li.querySelector('p').innerText=l.title;
      ul.append(li);
      util.query(li,'.editlinkbtn').onclick=function(){
        openLinkEditDialog(this.parentElement.getAttribute('data-index')-0);
      }
    });
    var li=util.element('li',{
      class:"link-add",
    });
    li.innerHTML=`<a href="javascript:void(0)" class="material-symbols-outlined">&#xe145;</a>`;
    ul.append(li);
    util.query(li,'a').onclick=function(){
      openLinkEditDialog(-1);
    }
  }

  var linkaddDialog;

  function openLinkEditDialog(index){
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
            <button class="delete btn">删除</button>
            <button class="cancel btn">取消</button>
            <button class="ok btn"></button>
          </div>
        </form>`,
      });
      var d=linkaddDialog.getDialogDom();
      util.query(d,'.cancel.btn').onclick=function(e){
        e.preventDefault();
        linkaddDialog.close();
      }
    }
    setTimeout(function(){
      linkaddDialog.open();
      var d=linkaddDialog.getDialogDom();
      var linklist=link.getLinks()
      if(index==-1){
        util.query(d,'h1').innerHTML='添加链接';
        util.query(d,'.ok.btn').innerHTML='添加';
        util.query(d,'input.link-add-url').value='';
        util.query(d,'input.link-add-title').value='';
        util.query(d,'input.link-add-index').setAttribute('max',linklist.length);
        util.query(d,'input.link-add-index').value=util.query(d,'input.link-add-index').max;
        util.query(d,'.delete.btn').style.display='none';
        util.query(d,'form').onsubmit=function(e){
          e.preventDefault();
          var url=util.query(d,'.link-add-url').value;
          var title=util.query(d,'.link-add-title').value;
          var index=util.query(d,'.link-add-index').value;
          index=typeof index=='undefined'?(util.query(d,'.link-add-index').max-0):index;
          link.moveLink(link.addLink({
            url:url,
            title:title
          }),index);
          initLinks();
          linkaddDialog.close();
        }
      }else{
        util.query(d,'h1').innerHTML='修改链接';
        util.query(d,'.ok.btn').innerHTML='修改';
        util.query(d,'.delete.btn').style.display='';
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
          link.changeLink(index,{
            url:url,
            title:title
          })
          if(index!=index2){
            link.moveLink(index,index2);
          }
          initLinks();
          linkaddDialog.close();
        }
        util.query(d,'.delete.btn').onclick=function(e){
          e.preventDefault();
          link.deleteLink(index);
          initLinks();
          linkaddDialog.close();
        }
      }
      
    })
  }
  initLinks();
})();