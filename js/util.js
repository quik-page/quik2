(function(){
  return {
    element:function(tagname,options={}){
      var a=document.createElement(tagname);
      for(var i in options){
        a.setAttribute(i,options[i]);
      }
      return a;
    },
    query:function(element,qstr,isall){
      return element['querySelector'+(isall?'All':'')](qstr);
    },
    getFavicon:function(url,useAPI){
      if(useAPI||checkFq(url)){
        return 'https://api.iowen.cn/favicon/'+new URL(url).host+'.png'
      }else{
        return new URL(url).origin+'/favicon.ico';
      }

      function checkFq(url){
        var host=new URL(url).host;
        var list=['google.com','goog.le','chrome.com','youtube.com','youtu.be','facebook.com','fb.com','twitter.com','t.co','reddit.com','instagram.com','pinterest.com','linkedin.com'];
        for(var i=0;i<list.length;i++){
          if(host.indexOf(list[i])>-1){
            return true;
          }
        }
        return false;
      }
    },
    fangdou:function(fn,time){
      var timer=null;
      return function(){
        if(timer) clearTimeout(timer);
        var _this=this;
        timer=setTimeout(function(){
          fn.apply(_this,arguments);
        },time);
      }
    },
    jsonp:function(url,cb,cbkey){
      function getRandom(){
        return 'a'+Math.random().toString(36).slice(2);
      }
      var a=getRandom();
      var script=this.element('script',{
        src:addSearchParam(url,cbkey||'callback',a),
      });

      function addSearchParam(url,key,value){
        var a=new URL(url);
        a.searchParams.set(key,value);
        return a.href;
      }
      document.body.appendChild(script);
      window[a]=function(data){
        cb(data);
        document.body.removeChild(script);
        delete window[a];
      }
    },
    getRandomHashCache:function(){
      return Math.random().toString(36).slice(2)+Date.now().toString(36);
    },
    copyText:function(value){
      if(navigator.clipboard){
        navigator.clipboard.writeText(value);
      }else{
        const input = document.createElement('input');
        input.value = value;
        input.style.display = 'none';
        // 将input元素添加到文档中
        document.body.appendChild(input);
        // 模拟键盘事件以触发复制操作
        input.select();
        document.execCommand('copy');
        // 从文档中移除input元素
        document.body.removeChild(input);
      }
      toast.show('复制成功');
    },
    getGoogleIcon:function(unicode){
      return '<span class="material-symbols-outlined">&#x'+unicode+';</span>'
    }
  }
})();