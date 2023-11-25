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

  searchbox.innerHTML=`
  <div class="box">
    <div class="icon"></div>
    <div class="input">
      <input type="text" placeholder="搜索或输入网址"/>
    </div>
    <div class="submit"></div>
    </div>
  <ul class="sas"></ul>
  `;

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
      icon.innerHTML=chuliteshuicon(i.icon);
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
      return `<img src=${util.getFavicon(core.searchUtil.getSearchType())} onerror='this.src=quik.util.getFavicon(this.src,true)'>`;
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
  input.oninput=util.fangdou(function(){
    // 渲染Type
    chulitype(this.value.trim());
    saul.innerHTML='';
    core.getSA(this.value.trim(),function(salist){
      //记录用户原本的active
      var actli=util.query(saul,'li.active')
      if(actli){
        actli={
          icon:util.query(actli,'div.saicon').innerHTML,
          text:util.query(actli,'div.sa_text').innerHTML,
        }
      }

      // 渲染搜索联想
      saul.innerHTML='';
      salist.forEach(function(s){
        var li=util.element('li');
        li.innerHTML=`<div class="saicon">${s.icon}</div><div class="sa_text">${s.text}</div>`;
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
    eventFn.input.forEach(function(fn){
      fn(input.value);
    })
  },300)
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
    }
  }

  // ...
  input.addEventListener('focus',function(){
    searchcover.classList.add('active');
    searchbox.classList.add('active');
    eventFn.focus.forEach(function(fn){
      fn(input);
    })
  });

  // ...
  input.addEventListener('blur',function(){
    setTimeout(function(){
      searchcover.classList.remove('active');
      searchbox.classList.remove('active');
      eventFn.blur.forEach(function(fn){
        fn(input);
      })
    },5);
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
      li.innerHTML=`<img src=${util.getFavicon(list[k])} onerror='this.src=quik.util.getFavicon(this.src,true)'>`;
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
  

  core.searchUtil.addEventListener('nowtypechange',function(){
    if(icon.getAttribute('data-teshu')==':searchtype'){
      chulitype(input.value);
    }
  })
  core.searchUtil.addEventListener('typelistchange',function(){
    chuliSearchTypeSelector();
  })
  chuliSearchTypeSelector();

  // 初始化处理（默认是搜索模式）
  chulitype('');

  if(core.initsto.get('autofocus')){
    input.focus();
  }

  setting.registerSetting({
    index:0,
    unit:"搜索框",
    title:"自动聚焦",
    message:"打开页面自动聚焦搜索框",
    type:"boolean",
    get:function(){
      return !!core.initsto.get('autofocus');
    },
    callback:function(value){
      core.initsto.set('autofocus',value);
      return true;
    }
  })

  return {
    setValue:function(value){
      input.value=value;
      input.focus();
    }
  }
})();