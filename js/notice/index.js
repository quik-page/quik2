(function(){
  var notice_con=document.querySelector(".notice-con");
  var notice_mb=_REQUIRE_('./notice.mb.html');
  function notice(details){
    this.el=util.element('div',{
      class:"notice-item"
    });
    notice_con.appendChild(this.el);
    this.title=details.title;
    this.content=details.content;
    this.btns=details.btns||[{
      text:"确定",
      click:function(n){
        n.hide();
      }
    }];
    this.useprogress=details.useprogress;
    this.progress=0;
    drawNotice(this);
  }
  notice.prototype={
    show:function(time){
      this.el.classList.add('show');
      var _=this;
      if(time){
        setTimeout(function(){
          _.hide();
        },time)
      }
    },
    hide:function(){
      this.el.classList.remove('show');
    },
    focus:function(){
      // TODO
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
      drawNoticeProgress();
    }
  }

  function drawNotice(n){
    n.el.innerHTML=notice_mb.replace('{{close-btn}}',util.getGoogleIcon('e5cd'));
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

})();