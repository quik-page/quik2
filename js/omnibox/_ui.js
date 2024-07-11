(function(){
  'use strict';
  var searchbox=util.element('div',{
    class:"searchbox"
  });

  var searchcover=util.element('div',{
    class:"cover searchcover"
  })

  var searchpadding=util.element('div',{
    class:"searchpadding"
  })

  searchbox.innerHTML=_REQUIRE_('./htmls/searchbox.html');

  util.query(document,'main').append(searchbox);
  util.query(document,'main').append(searchcover);
  util.query(document,'main .center').append(searchpadding);

  var icon=util.query(searchbox,'div.icon');
  var input=util.query(searchbox,'div.input input');
  var submit=util.query(searchbox,'div.submit');
  var saul=util.query(searchbox,'ul.sas');

  /**
   * 渲染指定文字的Type至页面
   * @param {String} text 
   */
  function chulitype(text){
    var i=core.getType(text);
    if(i.icon[0]==':'){
      icon.setAttribute('data-teshu',i.icon);
      var _ts=chuliteshuicon(i.icon);
      if(_ts instanceof Promise){
        _ts.then(function(r){
          icon.innerHTML=r;
        })
      }else{
        icon.innerHTML=_ts;
      }
    }else{
      icon.innerHTML=i.icon;
      icon.removeAttribute('data-teshu');
    }
    if(i.submit[0]==':'){
      submit.setAttribute('data-teshu',i.submit);
      submit.innerHTML=chuliteshusubmit(i.submit);
    }else{
      submit.innerHTML=i.submit;
      submit.removeAttribute('data-teshu');
    }


  }

  /**
   * 渲染特殊Icon
   * @param {String} text 
   * @returns {String} iconhtmlstr
   */
  function chuliteshuicon(icon){
    if(icon==':searchtype'){
      return new Promise(function(r,j){
        util.getFavicon(core.searchUtil.getSearchType(),function(fav){
          if(fav){
            r('<img src="'+fav+'"/>');
          }else{
            r('<img src="'+util.createIcon('s')+'"/>');
          }
        })
      });
    }else{
      return '';
    }
  }

  /**
   * 渲染特殊SubmitIcon
   * @param {String} text 
   * @returns {String} iconhtmlstr
   */
  function chuliteshusubmit(submit){
    return "";
  }

  /* 集中处理input事件 */
  input.oninput=util.fangdou(inputInputEv,300)
  function inputInputEv(){
    // 渲染Type
    chulitype(this.value.trim());
    saul.innerHTML='';
    core.getSA(this.value.trim(),function(salist){
      //记录用户原本的active
      var actli=util.query(saul,'li.active')
      if(actli){
        actli={
          icon:util.query(actli,'div.saicon').innerHTML,
          text:util.query(actli,'div.sa_text').innerText,
        }
      }

      // 渲染搜索联想
      saul.innerHTML='';
      salist.forEach(function(s){
        var li=util.element('li');
        li.innerHTML=`<div class="saicon">${s.icon}</div><div class="sa_text"></div>`;
        li.querySelector('.sa_text').innerText=s.text;
        saul.append(li);
        li.onclick=s.click;
      });

      // 恢复用户原本的active
      if(actli){
        util.query(saul,'li',true).forEach(function(li){
          if(util.query(li,'div.saicon').innerHTML&&util.query(li,'div.sa_text').innerHTML==actli.text){
            li.classList.add('active');
          }
        })
      }
    })
    doevent('input',[input.value]);
  }
  /* * */

  /* 集中处理keydown事件 */
  input.onkeydown=function(e){
    if(e.key=='Enter'){
      var actli=util.query(saul,'li.active')
      if(actli){
        // 当有li为ACTIVE状态时执行li.click事件
        actli.click();
      }else{
        // 否则交给core处理Enter事件
        core.enter(this.value);
      }
    }else if(e.key=='ArrowUp'){
      e.preventDefault();
      // 上一个搜索联想
      var actli=util.query(saul,'li.active')
      if(actli){
        actli.classList.remove('active');
        if(actli.previousElementSibling){
          actli.previousElementSibling.classList.add('active');
        }
      }
    }else if(e.key=='ArrowDown'){
      e.preventDefault();
      // 下一个搜索联想
      var actli=util.query(saul,'li.active')
      if(actli){
        if(actli.nextElementSibling){
          actli.classList.remove('active');
          actli.nextElementSibling.classList.add('active');
        }
      }else{
        util.query(saul,'li').classList.add('active');
      }
    }else if(e.key=='ArrowRight'){
      var actli=util.query(saul,'li.active');
      if(actli){
        input.value=util.query(actli,'.sa_text').innerText;
        inputInputEv.call(this);
      }
    }
  }

  var blurtimeout;
  // ...
  input.addEventListener('focus',function(){
    clearTimeout(blurtimeout)
    searchcover.classList.add('active');
    searchbox.classList.add('active');
    doevent('focus',[input]);
  });

  // ...
  input.addEventListener('blur',function(){
    this.classList.remove('active');
    blurtimeout=setTimeout(function(){
      searchcover.classList.remove('active');
      searchbox.classList.remove('active');
    },100)
    doevent('blur',[input]);
  });

  // ...
  submit.onclick=function(){
    core.enter(input.value);
  }

  var sct=util.element('div',{
    class:'searchtypeselector'
  })
  sct.innerHTML='<ul></ul>'
  util.query(document,'main .center').append(sct);
  function chuliSearchTypeSelector(){
    var ul=util.query(sct,'ul');
    var nowset=core.searchUtil.getSearchTypeIndex();
    ul.innerHTML='';
    var list=core.searchUtil.getSearchTypeList();
    for(var k in list){
      var li=util.element('li');
      li.innerHTML='<img/>';
      (function(li,k){
        util.getFavicon(list[k],function(fav){
          if(fav){
            li.querySelector('img').src=fav;
          }else{
            li.querySelector('img').src=util.createIcon('s');
          }
        })
      })(li,k)
      
      li.setAttribute('data-type',k);
      ul.append(li);
      if(k==nowset){
        li.classList.add('active');
      }
      li.onclick=function(){
        var actli=util.query(sct,'ul li.active');
        actli&&actli.classList.remove('active');
        this.classList.add('active');
        core.searchUtil.setSearchType(this.getAttribute('data-type'));
        sct.classList.remove('active');
      }
    }
    sct.style.width=util.query(ul,'li',true).length*36+'px';
  }
  icon.addEventListener('click',function(){
    if(sct.classList.contains('active')){
      sct.classList.remove('active');
    }else{
      sct.classList.add('active');
    }
  })
  

  core.searchUtil.on('nowtypechange',function(){
    if(icon.getAttribute('data-teshu')==':searchtype'){
      chulitype(input.value);
    }
  })
  core.searchUtil.on('typelistchange',function(){
    chuliSearchTypeSelector();
  })
  chuliSearchTypeSelector();

  // 初始化处理（默认是搜索模式）
  chulitype('');
  if(core.initsto.get('ob_autofocus')==undefined){
    core.initsto.set('ob_autofocus',false);
  }

  if(core.initsto.get('ob_autofocus')){
    // @note 这样才能生效，也许是因为浏览器还没渲染好吧
    // @edit at 2024年1月30日 15点10分
    setTimeout(function(){
      input.focus();
    })
  }
  

  var si=new SettingItem({
    title:"自动聚焦",
    index:1,
    type:'boolean',
    message:"打开页面自动聚焦搜索框",
    get:function(){
      return !!core.initsto.get('ob_autofocus');
    },
    callback:function(value){
      core.initsto.set('ob_autofocus',value);
      return true;
    }
  })
  sg.addNewItem(si);

  return {
    setValue:function(value){
      input.value=value;
      input.focus();
      inputInputEv.call(input);
    },
    focus:function(){
      input.focus();
    },
    blur:function(){
      input.blur();
    },
    isblur:function(){
      return !input.classList.contains('active');
    },
    setAutoFocus:function(value){
      core.initsto.set('ob_autofocus',value);
      si.reGet();
    }
  }
})();