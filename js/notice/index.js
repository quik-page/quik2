(function(){
  var notice_con=document.querySelector(".notice-con");
  var notip=document.querySelector(".no-notice-tip");
  var notice_mb=_REQUIRE_('./notice.mb.html');
  var focus_con=document.querySelector(".focus-notice");
  var hasNew=0;
  function notice(details){
    this.el=util.element('div',{
      class:"notice-item"
    });
    notice_con.appendChild(this.el);
    this.title=details.title;
    this.content=details.content;
    this.btns=details.btns||[];
    this.useprogress=details.useprogress;
    this.progress=0;
    drawNotice(this);
  }
  notice.prototype={
    show:function(time){
      notip.classList.remove('show');
      r(1);
      clearTimeout(this._timeouthide);
      this.el.classList.add('show');
      this.el.addEventListener('click',function(e){
        e.stopPropagation();
      })
      var _=this;
      this.el.style.display='block';
      this.el.style.animation='noticein .3s';

      if(time){
        setTimeout(function(){
          _.hide();
        },time)
      }
    },
    hide:function(){
      this.el.classList.remove('show');
      if(!document.querySelector(".notice-con .notice-item.show")){
        notip.classList.add('show');
        r(0);
      }
      this.el.style.animation='noticeout .3s';
      var _=this;
      this._timeouthide=setTimeout(function(){
        _.el.style.display='none';
      },300)
    },
    focus:function(){
      this.show();
      upfocus(this);
    },
    destory:function(){
      this.hide();
      var _=this;
      setTimeout(function(){
        _.el.remove();
      },300)
    },
    setTitle:function(title){
      this.title=title;
      drawNoticeTitle(this);
    },
    setContent:function(content){
      this.content=content;
      drawNoticeContent(this);
    },
    setBtn:function(btns){
      this.btns=btns;
      drawNoticeBtn(this);
    },
    setProgress:function(progress){
      if(!this.useprogress||progress>1||progress<0){
        return;
      }
      this.progress=progress;
      drawNoticeProgress(this);
    }
  }

  var focus_arr=[];
  function upfocus(_){
    focus_arr.push(_);
    if(focus_arr.length==1){
      g();
    }
  }

  var ___;
  function g(){
    var _=focus_arr[0];
    var _f=_.el.cloneNode(true);
    focus_con.appendChild(_f);
    util.query(_f,'.notice-close-btn').onclick=function(){
      clearTimeout(___);
      _f.remove();
      _.hide();
      focus_arr.shift();
      if(focus_arr.length>0){
        g();
      }
    }
    drawNoticeBtn({
      el:_f,
      btns:_.btns,
      hide:function(){
        _.hide();
        clearTimeout(___);
        _f.remove();
      },
      show:function(){}
    });
    ___=setTimeout(function(){
      _f.remove();
      focus_arr.shift();
      if(focus_arr.length>0){
        g();
      }
    },3000);
  }

  function drawNotice(n){
    n.el.innerHTML=notice_mb.replace('{{close-btn}}',util.getGoogleIcon('e5cd'));
    util.query(n.el,'.notice-close-btn').onclick=function(){
      n.hide();
    }
    drawNoticeTitle(n);
    drawNoticeContent(n);
    drawNoticeBtn(n);
    drawNoticeProgress(n);
  }

  function drawNoticeTitle(n){
    var titleel=util.query(n.el,'.notice-title');
    titleel.innerHTML=n.title;
  }

  function drawNoticeContent(n){
    var contentel=util.query(n.el,'.notice-content');
    contentel.innerHTML=n.content;
  }

  function drawNoticeBtn(n){
    var btncon=util.query(n.el,'.notice-btns');
    btncon.innerHTML='';
    for(var i=0;i<n.btns.length;i++){
      var btn=n.btns[i];
      var btnel=util.element('div',{
        class:"btn"+(btn.style?" "+btn.style:""),
      });
      btnel.innerText=btn.text;
      btnel.onclick=function(){
        btn.click(n);
      }
      btncon.appendChild(btnel);
    }
  }

  function drawNoticeProgress(n){
    if(!n.useprogress){
      util.query(n.el,'.notice-progress').style.display="none";
      return;
    }
    var progressel=util.query(n.el,'.notice-progress .p div');
    progressel.style.width=n.progress*100+"%";
  }
  // mobile适配
  var mbicon=new iconc.icon({
    content:util.getGoogleIcon('e7f4'),
    offset:"tl",
    class:"notice-icon"
  });
  
  window.addEventListener('resize',function(){r()});
  mbicon.getIcon().addEventListener('click',function(){
    document.querySelector(".notice-sc").classList.add('show');
  })
  document.querySelector(".notice-sc").addEventListener('click',function(){
    this.classList.remove('show');
  })
  function r(a){
    if(typeof a=="undefined"){
      a=hasNew;
    }else{
      hasNew=a;
    }
    if(window.innerWidth<600&&a){
      mbicon.show();
    }else{
      mbicon.hide();
    }
  }
  r();

  
  return notice;

})();