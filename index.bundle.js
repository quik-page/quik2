(function(){
  var util=(function(){
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
    xhr:function(url,cb,err){
      var xhr=new XMLHttpRequest();
      xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
          if(xhr.status==200){
            cb(xhr.responseText);
          }
        }
      }
      xhr.onerror=function(){
        err&&err({
          status:xhr.status,
          statusText:xhr.statusText,
          readyState:xhr.readyState,
          responseText:xhr.responseText
        });
      }
      xhr.open('GET',url,true);
      xhr.send();
      return{
        abort:function(){
          xhr.abort();
        }
      }
    },
    checkSession:function (session){
      return session.isSession&&session.session_token==="Hvm_session_token_eoi1j2j";
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
    getGoogleIcon:function(unicode,d){
      return '<span class="material-symbols-outlined'+(d&&d.type?' '+d.type:'')+'">&#x'+unicode+';</span>'
    },
    /**
     * 检查details中是否含有必选项
     * @param {Object} details 
     * @param {String[]} requires 
     */
    checkDetailsCorrect:function(details,requires){
      for(var i=0;i<requires.length;i++){
        if(details.hasOwnProperty(requires[i])==false){
          return false;
        }
      }
      return true;
    }
  }
})();;
  var toast=(function(){
  var to=util.element('div',{
    class:"toast"
  })

  var g=null,g2=null;
  util.query(document,'body').append(to);
  return {
    show:function(value,time){
      to.innerHTML=value;
      to.classList.add('show');
      to.style.animation="toastin .3s";
      clearTimeout(g);
      clearTimeout(g2);
      g=setTimeout(function(){
        to.style.animation="toastout .3s";
        g2=setTimeout(function(){
          to.classList.remove('show');
        },298);
      },time??2000);
    }
  }
})();;
  var storage=(function(){
  if(!localStorage.quik2){
    localStorage.quik2='{}';
  }

  var idbsupport=localforage._getSupportedDrivers([localforage.INDEXEDDB])[0]==localforage.INDEXEDDB;
  var filerecv={
    get:function(hash,cb){
      localforage.getItem(hash).then(cb);
    },
    set:function(file,cb){
      var hash='^'+util.getRandomHashCache();
      localforage.setItem(hash,file).then(function(){
        cb(hash);
      });
    },
    delete:function(hash,cb){
      localforage.removeItem(hash).then(cb);
    }
  }

  var f=function(ck){
    if(typeof ck==='string'){
      if(!JSON.parse(localStorage.getItem("quik2"))[ck]){
        setAll({});
      }
      function get(k,useidb,callback){
        if(!useidb){
          return getAll()[ck][k];
        }else{
          if(!idbsupport){
            throw new Error('indexedDB is not support in this browser');
          }
          filerecv.get(getAll()[ck][k],function(file){
            callback(file);
          });
        }
      }
      function set(k,v,useidb,callback){
        if(!useidb){
          var a=getAll();
          a[ck][k]=v;
          setAll(a[ck]);
        }else{
          if(!idbsupport){
            throw new Error('indexedDB is not support in this browser');
          }
          if(get(k)){
           filerecv.delete(get(k)); 
          }
          filerecv.set(v,function(hash){
            var a=getAll();
            a[ck][k]=hash;
            setAll(a[ck]);
            callback(hash);
          })
        }

      }
      function remove(k,useidb,callback){
        var a=getAll();
        if(!useidb){
          delete a[ck][k]
          setAll(a[ck]);
        }else{
          if(!idbsupport){
            throw new Error('indexedDB is not support in this browser');
          }
          filerecv.delete(a[ck][k],function(){
            var a=getAll();
            delete a[ck][k];
            setAll(a);
            callback();
          });
        }
      }
      function getAll(){
        return JSON.parse(localStorage.getItem("quik2"));
      }
      function setAll(ob){
        var a=getAll();
        a[ck]=ob;
        localStorage.setItem("quik2",JSON.stringify(a));
      }
      function list(){
        return Object.keys(getAll()[ck]);
      }
      return {
        get:get,
        set:set,
        remove:remove,
        list:list
      }
    }else{
      throw new Error('ck is not a string');
    }
  }

  /**
   * 检查浏览器是否支持indexedDB
   * @returns {Boolean} indexedDB support
   */
  f.checkIDB=function(){
    return idbsupport;
  }
  return f;
})();;
  var dialog=(function(){
  var allDialog=[];

  /**
   * @class dialog
   * @param {Object} options 
   * @param {String} options.content
   * @param {Number} options.mobileShowtype?
   * @param {String} options.class?
   */
  var dialog=function(options){
    this.options=options;
    var dialogF=util.element('div',{
      class:"dialog",
    });
    dialogF.innerHTML=`<div class="d-b"></div><div class="d-c">${options.content}</div>`;
    util.query(document,'main').append(dialogF);
    var dialogC=util.query(dialogF,'.d-c');
    if(options.class){
      dialogC.classList.add(options.class);
    }
    if(options.mobileShowtype==1){
      dialogF.classList.add('mobile-show-full');
    }
    this.element=dialogF;
    this.id=util.getRandomHashCache();
    dialogF.setAttribute('data-id',this.id);
    dialogF.querySelector('.d-b').addEventListener('click',function(){
      if(window.innerWidth<=650){
        getDialogById(this.parentElement.getAttribute('data-id')).close();
      }
    })
    allDialog.push(this);
  }

  function getDialogById(id){
    var d=null;
    allDialog.forEach(function(dd){
      if(dd.id==id){
        d=dd;
      }
    })
    return d;
  }

  dialog.SHOW_TYPE_FULLSCREEN=1;
  dialog.SHOW_TYPE_DIALOG=2;

  dialog.iframeDialogBuilder=function(url,mobileShowtype=1){
    var d=new dialog({
      content:`<div class="material-symbols-outlined closebtn">&#xE5CD;</div><iframe src="${url}" class="dialog-iframe"></iframe>`,
      class:"iframe-dialog",
      mobileShowtype:mobileShowtype
    });
    var q=d.getDialogDom();
    util.query(q,'.closebtn').onclick=function(){
      d.close();
    }
    this.closed=true;
    return d;
  }

  dialog.prototype={
    open:function(){
      this.element.classList.add('show');
      this.closed=false;
      if(this.onopen){
        this.onopen();
      }
    },
    close:function(){
      this.element.classList.remove('show');
      this.closed=true;
      if(this.onclose){
        this.onopen();
      }
    },
    destory:function(){
      this.element.remove();
      allDialog.splice(allDialog.indexOf(this),1);
    },
    getDialogDom:function(){
      return util.query(this.element,'.d-c');
    }
  }
  return dialog;
})();;
  var menu=(function(){
  /**
   * @class contextMenu
   * @param {Object} options 
   * @param {{icon:String,title:String,click:Function}[]} options.list
   * @param {{top?:Number,left?:Number,bottom?:Number,right?:Number}} options.offset 位置
   */
  var contextMenu=function(options){
    this.options=options;
    var el=util.element('div',{
      class:"contextMenu",
    });
    if(options.offset){
      el.style.top=options.offset.top+"px";
      el.style.left=options.offset.left+"px";
      el.style.bottom=options.offset.bottom+"px";
      el.style.right=options.offset.right+"px";
    }

    options.list.forEach(function(itemr){
      var item=util.element('div',{
        class:"item"
      });
      item.innerHTML=`<div class="icon">${itemr.icon}</div><div class="title">${itemr.title}</div>`;
      item.onclick=function(){
        itemr.click();
      }
      el.appendChild(item);
    })

    document.body.appendChild(el);
    this.element=el;
  }

  contextMenu.prototype={
    show:function(){
      this.element.classList.add('show');
      this.element.style.height='auto';
      var h=this.element.getBoundingClientRect().height;
      this.element.style.height='0px';
      this.element.style.transition='height .2s';
      var _this=this;
      setTimeout(function(){
        _this.element.style.height=h+'px';
      })
    },
    hide:function(){
      this.element.style.height='0px';
      var _this=this;
      setTimeout(function(){
        _this.element.style.transition='none';
        _this.element.classList.remove('show');
      },200)
    },
    isShow:function(){
      return this.element.classList.contains('show');
    },
    destory:function(){
      this.element.remove();
    },
    setOffset:function(offset){
      this.options.offset=offset;
      var options=this.options,el=this.element;
      if(options.offset){
        el.style.top=options.offset.top+"px";
        el.style.left=options.offset.left+"px";
        el.style.bottom=options.offset.bottom+"px";
        el.style.right=options.offset.right+"px";
      }
    },
    setList:function(list){
      this.options.list=list;
      var options=this.options,el=this.element;
      el.innerHTML="";
      options.list.forEach(function(itemr){
        var item=util.element('div',{
          class:"item"
        });
        item.innerHTML=`<div class="icon">${itemr.icon}</div><div class="title">${itemr.title}</div>`;
        item.onclick=function(){
          itemr.click();
        }
        el.appendChild(item);
      })
    }
  };

  document.addEventListener('click',function(){
    document.querySelectorAll(".contextMenu").forEach(function(e){
      e.style.height='0px';
      setTimeout(function(){
        e.style.transition='none';
        e.classList.remove('show');
      },200)
    })
  })

  return contextMenu;
})();;
  var iconc=(function(){
  var icners={
    tl:util.query(document,'.topper .left'),
    tr:util.query(document,'.topper .right'),
    bl:util.query(document,'.bottomer .left'),
    br:util.query(document,'.bottomer .right'),
  }

  /**
   * @class icon
   * @param {Object} options 
   * @param {String} options.content
   * @param {String} options.class?
   * @param {Number} options.width?
   * @param {'tl'|'tr'|'bl'|'br'} options.offset
   */
  var icon=function(options){
    this.content=options.content;
    this.width=options.width;
    var ic=util.element('div',{
      class:"item"+(options.class?(' '+options.class):''),
    });
    icners[options.offset].append(ic);
    ic.innerHTML=this.content;
    this.element=ic;
    if(this.width){
      ic.style.width=this.width+'px';
    }
  }
  icon.prototype={
    getIcon:function(){
      return this.element;
    },
    setIcon:function(content){
      this.content=content;
      this.element.innerHTML=this.content;
    },
    setWidth:function(w){
      this.width=w;
      if(this.width){
        ic.style.width=this.width+'px';
      }
    },
    getWidth:function(){
      return this.width;
    },
    show:function(){
      this.element.style.display='block';
    },
    hide:function(){
      this.element.style.display='none';
    }
  }
  return {
    icon:icon,
  }
})();
  var setting=(function(){
  
  var Setting=(function(){
function Setting(details){
  this.title=details.title;
  this.dialog=new dialog({
    content:`<div class="actionbar">
    <h1>设置</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
  </div>
  <ul class="setting-root"></ul>`,
    class: "setting_dia",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN
  });
  this.dialogDom=this.dialog.getDialogDom();
  util.query(this.dialogDom,'.closeBtn').addEventListener('click',()=>{
    this.dialog.close();
  });
  util.query(this.dialogDom,'.actionbar h1').innerText=this.title;
  this.groups=[];
  this._events={
    change:[]
  }
}

Setting.prototype={
  addNewGroup:function(group){
    this.groups.push(group);
    var _=this;
    group.on('change',function(dt,_this){
      _._dochange({
        type:dt.type,
        details:dt.details,
        id:dt.id
      })
      if(dt.type=='it'){
        _._dochangeGroup(_this,dt.details);
      }else if(dt.type=='add'){
        _._drawItem(_this,_this.items[_this.items.length-1])
      }else if(dt.type=='change'){
        _._dochangeItem(_this,_this.items.find(item=>item.id==dt.id),dt.details);
      }
    })
    _._dochange({
      type:"addgroup",
    })
    _._drawGroup(group);
  },
  setTitle:function(title){
    this.title=title;
    util.query(this.dialogDom,'.actionbar h1').innerText=title;
    _._dochange({
      type:"changetitle",
      title:title
    })
  },
  open:function(){
    this.dialog.open()
  },
  close:function(){
    this.dialog.close();
  },
  on:function(event,callback){
    if(this._events[event]){
      this._events[event].push(callback);
    }
  },
  _dochange:function(dt){
    var _=this;
    this._events.change.forEach(function(callback){
      callback(dt,_);
    });
  },
  _drawGroup:function(group){
    var groupEle=util.element('li',{
      class:'setting-group',
      'data-index':group.index,
      'data-id':group.id
    });
    groupEle.innerHTML=`<div class="setting-group-title"></div><ul class="setting-tree"></ul>`;
    var sr=util.query(this.dialogDom,'.setting-root');
    var srls=sr.children;
    var q=true;
    for(var i=0;i<srls.length;i++){
      if(parseInt(srls[i].getAttribute('data-index'))>group.index){
        sr.insertBefore(groupEle,srls[i]);
        q=false;
        break;
      }
    }
    if(q) sr.appendChild(groupEle);
    util.query(groupEle,'.setting-group-title').innerText=group.title;
    
  },
  _drawItem:function(group,item){
    var itemEle=util.element('li',{
      class:'setting-item',
      'data-index':item.index,
      'data-id':item.id
    });
    itemEle.innerHTML=`<div class="setting-item-left">
<div class="setting-item-title"></div>
<div class="setting-item-message"></div>
</div>
<div class="setting-item-right"></div>`;
    var sr=util.query(this.dialogDom,'.setting-group[data-id='+group.id+'] .setting-tree');
    var srls=sr.children;
    var q=true;
    for(var i=0;i<srls.length;i++){
      if(parseInt(srls[i].getAttribute('data-index'))>item.index){
        sr.insertBefore(itemEle,srls[i]);
        q=false;
        break;
      }
    }
    if(q) sr.appendChild(itemEle);
    util.query(itemEle,'.setting-item-title').innerText=item.title;
    util.query(itemEle,'.setting-item-message').innerText=item.message;
    var elr=util.query(itemEle,'.setting-item-right');
    var cb=function(){}
    var types={
      string:function(){
        elr.innerHTML=`<input type="text" class="setting-item-input">`;
        cb=function(v){
          util.query(elr,'.setting-item-input').value=v;
        }
      },
      number:function(){
        elr.innerHTML=`<input type="number" class="setting-item-input">`;
        cb=function(v){
          util.query(elr,'.setting-item-input').value=v;
        }
      },
      boolean:function(){
        elr.innerHTML=`<div class="check-box"><div class="check-box-inner"></div><input type="checkbox" class="setting-item-input"></div>`;
        cb=function(v){
          util.query(elr,'.setting-item-input').checked=v;
          if(v){
            util.query(elr,'.check-box').classList.add('checked');
          }
          util.query(elr,'.check-box').addEventListener('click',function(){
            util.query(elr,'.setting-item-input').click();
            if(util.query(elr,'.setting-item-input').checked){
              this.classList.add('checked');
            }else{
              this.classList.remove('checked');
            }
          })
        }
      },
      range:function(){
        elr.innerHTML=`<input type="range" class="setting-item-input">`;
        cb=function(v){
          util.query(elr,'.setting-item-input').value=v;
        }
        var l=item.init()
        if(l instanceof Promise){
          l.then(_init)
        }else{
          _init(l);
        }
        function _init(inited){
          util.query(elr,'.setting-item-input').max=inited.max;
          util.query(elr,'.setting-item-input').min=inited.min;
        }
      },
      select:function(){
        elr.innerHTML=`<select class="setting-item-input"></select>`;
        var guaqi;
        cb=function(v){
          guaqi=v;
        }
        var l=item.init()
        if(l instanceof Promise){
          l.then(_init)
        }else{
          _init(l);
        }
        function _init(inited){
          util.query(elr,'.setting-item-input').innerHTML=(()=>{
            var html='';
            for(var k in inited){
              html+=`<option value="${k}">${inited[k]}</option>`;
            }
            return html;
          })();
          cb=function(v){
            util.query(elr,'.setting-item-input').value=v;
          }
          if(guaqi)cb(guaqi);
        }
      },
      'null':function(){
        elr.innerHTML=`<div class="setting-item-input null-click">${util.getGoogleIcon('e5e1')}</div>`;
        itemEle.classList.add('just-callback-item');
        itemEle.onclick=function(){
          item.callback();
        }
      }
    }
    types[item.type]();
    function getacb(){
      if(item.type=='null') return;
      var l=item.get();
      if(l instanceof Promise){
        l.then(cb);
      }else{
        cb(l);
      }
    }
    getacb();
    util.query(elr,'.setting-item-input').addEventListener((()=>{
      if(item.type=='range'){
        return 'input'
      }else if(item.type=='null'){
        return 'click'
      }else{
        return 'change'
      }
    })(),function(e){
      if(this.classList.contains('null-click')) return;
        var v;
        if(this.type=='checkbox'){
          v=this.checked;
        }else{
          v=this.value;
        }
        //@note 判断check方法是否存在，check是可选参数
        //@edit at 2023/1/30 15:12
        if(typeof item.check=='function'){
          if(item.check(v)){
            item.callback(v)
          }else{
            getacb();
          }
        }else{
          item.callback(v);
        }
        
    });
  },
  _dochangeGroup:function(group,dt){
    var g=util.query(this.dialogDom,'.setting-group[data-id='+group.id+']');
    if(dt.attr=='title'){
      util.query(g,'.setting-group-title').innerText=dt.content;
    }else if(dt.attr=='index'){
      g.setAttribute('data-index',dt.content);
      var sr=util.query(this.dialogDom,'.setting-root');
      var srls=sr.children;
      var q=true;
      for(var i=0;i<srls.length;i++){
        if(srls[i].isSameNode(g)) continue;
        if(parseInt(srls[i].getAttribute('data-index'))>dt.content){
          sr.insertBefore(g,srls[i]);
          q=false
          break;
        }
      }
      if(q) sr.appendChild(g);
    }else if(dt.attr=='show'){
      g.style.display=dt.content?'block':'none';
    }
  },
  _dochangeItem:function(group,item,dt){
    var g=util.query(this.dialogDom,'.setting-group[data-id='+group.id+'] .setting-item[data-id='+item.id+']');
    if(dt.attr=='title'){
      util.query(g,'.setting-group-title').innerText=dt.content;
    }else if(dt.attr=='message'){
      util.query(g,'.setting-item-message').innerText=dt.content;
    }else if(dt.attr=='index'){
      g.setAttribute('data-index',dt.content);
      var sr=util.query(this.dialogDom,'.setting-group[data-id='+group.id+'] .setting-tree');
      var srls=sr.children;
      var q=true;
      for(var i=0;i<srls.length;i++){
        if(srls[i].isSameNode(g)) continue;
        if(parseInt(srls[i].getAttribute('data-index'))>dt.content){
          sr.insertBefore(g,srls[i]);
          q=false
          break;
        }
      }
      if(q) sr.appendChild(g);
    }else if(dt.attr=='show'){
      g.style.display=dt.content?'block':'none';
    }
  }
}

return Setting;
})();;
  var SettingGroup=(function(){
function SettingGroup(details){
  this.title=details.title;
  this.index=details.index;
  if(this.index<0) this.index=0
  this.items=[];
  this.id='seg_'+util.getRandomHashCache();
  this._events={
    change:[]
  }
}

SettingGroup.prototype={
  addNewItem:function(item){
    this.items.push(item);
    var _=this;
    item.on('change',function(dt,_this){
      _._dochange({
        type:"change",
        details:dt,
        id:_this.id
      })
    });
    _._dochange({
      type:"add"
    })
  },
  setTitle:function(title){
    this.title=title;
    this._dochange({
      type:"it",
      details:{
        attr:"title",
        content:title
      }
    })
  },
  setIndex:function(index){
    this.index=index;
    this._dochange({
      type:"it",
      details:{
        attr:"index",
        content:index
      }
    })
  },
  on:function(event,callback){
    if(this._events[event]){
      this._events[event].push(callback);
    }
  },
  show:function(){
    this.show=true;
    this._dochange({
      type:"it",
      details:{
      attr:"show",
      content:true
    }})
  },
  hide:function(){
    this.show=false;
    this._dochange({
      type:"it",
      details:{
      attr:"show",
      content:false
    }})
  },
  _dochange:function(dt){
    var _=this;
    this._events.change.forEach(function(callback){
      callback(dt,_);
    });
  }
}
return SettingGroup;
})();;
  var SettingItem=(function(){
function SettingItem(details){
  this.title=details.title;
  this.index=details.index;
  this.type=details.type;
  this.init=details.init;
  this.check=details.check;
  this.callback=details.callback;
  this.message=details.message;
  this.get=details.get;
  this.show=true;
  this.id='sei_'+util.getRandomHashCache();
  this._events={
    change:[]
  }
}

SettingItem.prototype={
  setTitle:function(title){
    this.title=title;
    this._dochange({
      attr:"title",
      content:title
    })
  },
  setIndex:function(index){
    this.index=index;
    this._dochange({
      attr:"index",
      content:index
    })
  },
  setMessage:function(message){
    this.message=message;
    this._dochange({
      attr:"message",
      content:message
    })
  },
  show:function(){
    this.show=true;
    this._dochange({
      attr:"show",
      content:true
    })
  },
  hide:function(){
    this.show=false;
    this._dochange({
      attr:"show",
      content:false
    })
  },
  on:function(event,callback){
    if(this._events[event]){
      this._events[event].push(callback);
    }
  },
  _dochange:function(dt){
    var _=this;
    this._events.change.forEach(function(callback){
      callback(dt,_);
    });
  }
}
return SettingItem;
})();;
  var mainSetting=(function(){
  var mainSetting=new Setting({
    title:"设置"
  });
  return mainSetting;
})();
  (function(){
  var setting_icon = new iconc.icon({
    content: util.getGoogleIcon('e8b8',{type:"fill"}),
    offset: "bl"
  });

  setting_icon.getIcon().onclick = function () {
    mainSetting.open();
  }
})();;
  // @note 添加通用SettingGroup，方便添加设置
  // @edit at 2024/1/31 10:22
  var tyGroup=new SettingGroup({
    title:"通用",
    index:0
  });
  mainSetting.addNewGroup(tyGroup);

  return {
    Setting,
    SettingGroup,
    SettingItem,
    mainSetting,
    tyGroup
  }
})();
  var Setting=setting.Setting;
  var SettingGroup=setting.SettingGroup;
  var SettingItem=setting.SettingItem;
  var mainSetting=setting.mainSetting;
  var tyGroup=setting.tyGroup;
  var omnibox=(function(){
  var eventFn={
    focus:[],
    blur:[],
    input:[],
    beforeenter:[],
    afterenter:[]
  };
  var sg=new SettingGroup({
    title:"搜索框",
    index:1
  });
  mainSetting.addNewGroup(sg);
  var core=(function(){
  var k={
    SA:[],
    enter:[],
  }

  var initsto=storage('omnibox');
  var sawait=[];


  /**
   * @param {String} text
   * @param {Function} updateFn(salist:{icon:String,text:String,click:Function}[])
   */
  var getSA=function(text,updateFn){
    if(sawait.length>0){
      sawait.forEach(function(v){
        k.SA[v].interrupt();
      })
    }
    var sa=[];
    var a=k.SA.length;
    for(var i=0;i<a;i++){
      if(k.SA[i].check(text)){
        var b=k.SA[i].get(text,function(){
          return sa;
        })
        if(b instanceof Promise){
          sawait.push(i);
          (function(i){
            b.then(function(res){
              sa=res;
              sawait.splice(sawait.indexOf(i),1);
              updateFn(sa);
            });
          })(i);

        }else{
          sa=b;
          updateFn(sa);
        }
      }
    }
  }

  // 回车事件
  var enter=function(text){
    getType(text).enter(text);
  }

  // 获取类型
  var getType=function(text){
    for(var i=0;i<k.enter.length;i++){
      if(k.enter[i].check(text)){
        return k.enter[i];
      }
    }
  }

  var addNewType=function(options){
    k.enter.unshift(options);
  }

  var addNewSA=function(options){
    k.SA.push(options);
  }

  var searchUtil=(function(){
  if(!storage){
    return;
  }

  var initsto=storage('search');
  var keyword="%keyword%";
  var deftypelist={
    "bing":"https://cn.bing.com/search?q="+keyword,
    "baidu":"https://www.baidu.com/s?wd="+keyword,
    "so":"https://so.com/s?q="+keyword,
    "sogou":"https://sogou.com/web?query="+keyword,
    "google":"https://google.com/search?q="+keyword,
  };
  if(!initsto.get('typelist')){
    initsto.set('typelist',deftypelist);
  }
  if(!initsto.get('type')){
    initsto.set('type',"bing");
  }

  var events={};

  var getSearchType=function(){
    return initsto.get('typelist')[initsto.get('type')];
  }
  var addEventListener=function(ev,fn){
    if(events[ev]){
      events[ev].push(fn);
    }else{
      events[ev]=[fn];
    }
  }

  var doevents=function(ev,data){
    if(events[ev]){
      events[ev].forEach(function(item){
        item.apply(null,data);
      })
    }
  }
  var setSearchList=function(newList){
    if(Object.keys(newList).length==0){
      throw new Error('newList is empty');
    }
    initsto.set('typelist',newList);
    var oldList=initsto.get('typelist');
    doevents('typelistchange');
    var t=initsto.get('type');
    if(oldList[t]!=newList[t]){
      doevents('nowtypechange');
    }
  }
  var getSearchTypeList=function(){
    return initsto.get('typelist')
  }
  var setSearchType=function(type){
    initsto.set('type',type);
    doevents('nowtypechange');
  }
  var getSearchTypeIndex=function(){
    return initsto.get('type');
  }

  var retob={
    getSearchType:getSearchType,
    addEventListener:addEventListener,
    setSearchList:setSearchList,
    getSearchTypeList:getSearchTypeList,
    setSearchType:setSearchType,
    getSearchTypeIndex:getSearchTypeIndex
  }

  Object.defineProperty(retob,'keywordText',{
    get:function(){
      return keyword;
    }
  });

  return retob;
})();;

  function checkUrl(text){
    if(initsto.get('justsearch')){
      return false;
    }
    return /^(https?:\/\/)?([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&%\$\-]+)*@)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.[a-zA-Z]{2,4})(\:[0-9]+)?(\/[^\/][a-zA-Z0-9\.\,\?\'\\\/\+&%\$#\=~_\-@]*)*(\/)?$/.test(text);
  }

  addNewType({
    check:function(){
      return true;
    },
    enter:function(text){
      open(searchUtil.getSearchType().replace(searchUtil.keywordText,text));
    },
    icon:":searchtype",
    submit:util.getGoogleIcon('E8B6')
  });

  addNewType({
    check:checkUrl,
    enter:function(text){
      if(text.indexOf('://')==-1){
        text='http://'+text;
      }
      open(text);
    },
    icon:util.getGoogleIcon('E80B'),
    submit:util.getGoogleIcon('E89E')
  });

  addNewSA({
    check:function(text){
      return !!text;
    },
    get:function(text,getsa){
      var a=getsa();
      a.unshift({
        icon:util.getGoogleIcon('E8B6'),
        text:text,
        click:function(){
          open(searchUtil.getSearchType().replace(searchUtil.keywordText,text));
        }
      });
      return a;
    }
  })


  var searchfetch=null;
  addNewSA({
    check:function(text){
      return !!text;
    },
    get:function(text,getsa){
      return new Promise(function(r,j){
        var a2=getsa();
        searchfetch=util.jsonp('https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&wd='+text,function(res){
          searchfetch=null;
          if(!res.g){
            r(a2);
            return;
          } 
          res.g.forEach(function(item){
            a2.push({
              icon:util.getGoogleIcon('E8B6'),
              text:item.q,
              click:function(){
                open(searchUtil.getSearchType().replace(searchUtil.keywordText,item.q));
              }
            });
          })
          r(a2);
        },'cb');
      })
    },
    interrupt:function(){
      if(searchfetch){
        searchfetch.abort();
        searchfetch=null;
      }
    }
  });

  addNewSA({
    check:checkUrl,
    get:function(text,getsa){
      return new Promise(function(r,j){
        var a=getsa();
        a.unshift({
          icon:util.getGoogleIcon('E80B'),
          text:text,
          click:function(){
            if(text.indexOf('://')==-1){
              text='http://'+text;
            }
            open(text);
          }
        });
        r(a);
      })
    }
  });

  
  /*setting.registerSetting({
    index:1,
    unit:'搜索框',
    title:"搜索框仅搜索",
    type:'boolean',
    message:"打开后，搜索框将失去打开链接的功能",
    get:function(){
      return !!initsto.get('justsearch');
    },
    callback:function(value){
      initsto.set('justsearch',value);
      return true;
    }
  })*/


  var si=new SettingItem({
    title:"搜索框仅搜索",
    index:1,
    type:'boolean',
    message:"打开后，搜索框将失去打开链接的功能",
    get:function(){
      return !!initsto.get('justsearch');
    },
    callback:function(value){
      initsto.set('justsearch',value);
      return true;
    }
  })
  sg.addNewItem(si);
  
  return {
    getSA:getSA,
    enter:enter,
    getType:getType,
    addNewType:addNewType,
    addNewSA:addNewSA,
    searchUtil:searchUtil,
    initsto:initsto
  }
})();
  var ui=(function(){
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
      return !!core.initsto.get('autofocus');
    },
    callback:function(value){
      core.initsto.set('autofocus',value);
      return true;
    }
  })
  sg.addNewItem(si);

  return {
    setValue:function(value){
      input.value=value;
      input.focus();
    }
  }
})();

  return{
    value:ui.setValue,
    addNewSug:core.addNewSA,
    addEventListener:function(event,callback){
      if(eventFn[event]){
        eventFn[event].push(callback);
      }
    },
    getSearchType:core.searchUtil.getSearchType,
    getSearchTypeList:core.searchUtil.getSearchTypeList,
    getSearchTypeIndex:core.searchUtil.getSearchTypeIndex,
    setSearchType:core.searchUtil.setSearchType,
    setSearchList:core.searchUtil.setSearchList,
    search:{
      addEventListener:core.searchUtil.addEventListener
    },
    sg
  }
})();
  var link=(function () {
  var initsto = storage('link');

  var eventfns={
    change:[]
  };
  function pushLink(detail, ob) {
    var link = {
      title: detail.title,
      url: detail.url
    }
    if (typeof detail.index=='number' && detail.index >= 0) {
      if (detail.index > ob.length) {
        console.warn('添加链接时，index超出范围，应在0-' + ob.length + '之间');
        ob.push(link);
      } else {
        ob.splice(detail.index, 0, link);
      }
    } else {
      ob.push(link);
    }
    return ob;
  }

  function writeLink(index, detail, ob) {
    if (!ob[index]) {
      return false;
    }
    var link = {
      title: detail.title,
      url: detail.url
    }
    ob[index] = link;
    if (typeof detail.index=='number'&& detail.index >= 0) {
      if (detail.index >= ob.length) {
        console.warn('添加链接时，index超出范围，应在0-' + (ob.length-1) + '之间');
      }else{
        var linkb = ob.splice(index, 1)[0];
        ob.splice(detail.index, 0, linkb);
      }
    }
    return ob;
  }

  function limitURL(detail) {
    if (detail.url.length > 1000) {
      return 'url';
    } else if (detail.title.length > 60) {
      return 'title';
    }
    return false;
  };
  var link;
  if (storage.checkIDB()) {
    // 支持数据库
    link=(function () {
  initsto.set('storage-mode','db');

  // 初始化进度，2为初始化完毕
  var initState = 0;
  function init() {
    // 初始化默认分组
    if (!initsto.get('links')) {
      initsto.set('links', [], true, function () {
        initState++;
        if (initState == 2) {
          readyfn();
        }
      })
    } else {
      initState++;
    }

    // 初始化分组
    if (!initsto.get('cate')) {
      initsto.set('cate', {}, true, function () {
        initState++;
        if (initState == 2) {
          readyfn();
        }
      });
    } else {
      initState++;
    }
  }

  init();
  var readyfn = function () { };
  if (initState == 2) {
    readyfn();
  }


  function doevents(ev, ar) {
    eventfns[ev].forEach(function (fn) {
      fn.apply(null, [ar]);
    })
  }

  return {
    addLink: function (detail, callback = function () { }) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      if (!util.checkDetailsCorrect(detail, ['title', 'url'])) {
        throw '参数不正确';
      }
      if (detail.cate) {
        // 包含分类 
        initsto.get('cate', true, function (c) {
          if (!c[detail.cate]) {
            callback({
              code: -1,
              msg: "分组不存在"
            })
          } else {
            c[detail.cate] = pushLink(detail, c[detail.cate]);
            initsto.set('cate', c, true, function () {
              callback({
                code: 0,
                msg: "添加成功"
              });
              doevents('change', {
                cate: detail.cate,
                type: 'add',
                detail: detail
              });
            });
          }
        })
      } else {
        // 不包含分类，即为默认分组

        initsto.get('links', true, function (l) {
          l = pushLink(detail, l);
          initsto.set('links', l, true, function () {
            callback({
              code: 0,
              msg: "添加成功"
            });
            doevents('change', {
              cate: null,
              type: 'add',
              detail: detail
            });
          });
        })
      }
    },
    changeLink: function (cate, index, detail, callback = function () { }) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      if (!util.checkDetailsCorrect(detail, ['title', 'url']) || typeof index != 'number') {
        throw '参数错误';
      }
      if (cate) {
        // 包含分类
        initsto.get('cate', true, function (c) {
          if (!c[cate]) {
            callback({
              code: -1,
              msg: "分组不存在"
            })
            return;
          }

          var r = writeLink(index, detail, c[cate]);
          if (!r) {
            callback({
              code: -2,
              msg: "链接不存在"
            });
            return;
          }
          c[cate] = r;
          initsto.set('cate', c, true, function () {
            callback({
              code: 0,
              msg: "修改成功"
            });
            doevents('change', {
              cate: cate,
              index: index,
              type: 'change',
              detail: detail
            });
          })
        })
      } else {
        // 不包含分类
        initsto.get('links', true, function (links) {
          var r = writeLink(index, detail, links);
          if (!r) {
            callback({
              code: -2,
              msg: "链接不存在"
            });
            return;
          }
          links = r;
          initsto.set('links', links, true, function () {
            callback({
              code: 0,
              msg: "修改成功"
            });
            doevents('change', {
              cate: null,
              index: index,
              type: 'change',
              detail: detail
            });
          });
        });
      }
    },
    deleteLink: function (cate, index, callback = function () { }) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      if (cate) {
        // 包含分类
        initsto.get('cate', true, function (c) {
          if (!c[cate]) {
            callback({
              code: -1,
              msg: "分组不存在"
            });
            return;
          }
          if (!c[cate][index]) {
            callback({
              code: -2,
              msg: "链接不存在"
            });
            return;
          }
          c[cate].splice(index, 1);
          initsto.set('cate', c, true, function () {
            callback({
              code: 0,
              msg: "删除成功"
            });
            doevents('change', {
              cate: cate,
              index: index,
              type: 'delete',
            });
          });
        });
      } else {
        // 不包含分类
        initsto.get('links', true, function (r) {
          if (!r[index]) {
            callback({
              code: -2,
              msg: "链接不存在"
            });
            return;
          }
          r.splice(index, 1);
          initsto.set('links', r, true, function () {
            callback({
              code: 0,
              msg: "删除成功"
            });
            doevents('change', {
              cate: null,
              index: index,
              type: 'delete',
            });
          });
        });
      }
    },
    addCate: function (cate, callback = function () { }) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      initsto.get('cate', true, function (c) {
        if (c[cate]) {
          callback({
            code: -1,
            msg: "分组已存在"
          });
          return;
        }
        c[cate] = [];
        initsto.set('cate', c, true, function () {
          callback({
            code: 0,
            msg: "添加成功"
          });
          doevents('change', {
            cate: cate,
            type: 'cateadd',
          });
        });
      });
    },
    renameCate: function (cate, catename, callback = function () { }) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      initsto.get('cate', true, function (c) {
        if (!c[cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          });
          return;
        }
        if (c[catename]) {
          callback({
            code: -2,
            msg: "分组重名"
          });
        }
        c[catename] = c[cate];
        delete c[cate];
        initsto.set('cate', c, true, function () {
          callback({
            code: 0,
            msg: "修改成功"
          });
          doevents('change', {
            cate: cate,
            catename: catename,
            type: 'caterename',
          });
        });
      });
    },
    deleteCate: function (cate, callback = function () { }) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      initsto.get('cate', true, function (c) {
        if (!c[cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          });
          return;
        }
        if (c[cate].length <= 1) {
          delete c[cate];
          initsto.set('cate', c, true, function () {
            callback({
              code: 0,
              msg: "删除成功"
            });
            doevents('change', {
              cate: cate,
              type: 'catedelete',
            });
          });
        } else{
          confirm('确定要删除分组吗？无法恢复！',function(r){
            if(r){
              delete c[cate];
              initsto.set('cate', c, true, function () {
                callback({
                  code: 0,
                  msg: "删除成功"
                });
                doevents('change', {
                  cate: cate,
                  type: 'catedelete',
                });
              });
            }else{
              callback({
                code: -2,
                msg: "用户取消删除"
              });
            }
          })
        }

      });
    },
    getLinks: function (cate, callback = function () { }) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      if (cate) {
        initsto.get('cate', true, function (c) {
          if (!c[cate]) {
            callback({
              code: -1,
              msg: "分组不存在"
            });
            return;
          }
          callback({
            code: 0,
            msg: "获取成功",
            data: c[cate]
          });
        });
      } else {
        initsto.get('links', true, function (c) {
          callback({
            code: 0,
            msg: "获取成功",
            data: c
          });
        });
      }
    },
    getCates: function (callback = function () { }) {
      initsto.get('cate', true, function (c) {
        callback({
          code: 0,
          msg: "获取成功",
          data: Object.keys(c)
        });
      });
    },
    getCateAll: function (callback = function () { }) {
      initsto.get('cate', true, function (c) {
        callback({
          code: 0,
          msg: "获取成功",
          data: c
        });
      });
    },
    ready: function (fn) {
      if (initState == 2) {
        fn();
      } else {
        readyfn = fn;
      }
    },
    addEventListener: function (event, fn) {
      if (eventfns[event]) {
        eventfns[event].push(fn);
      } else {
        eventfns[event] = [fn];
      }
    },
    removeEventListener: function (event, fn) {
      if (eventfns[event]) {
        eventfns[event].forEach(function (item, index) {
          if (item === fn) {
            eventfns[event].splice(index, 1);
          }
        });
      }
    }
  }
})();;
  } else {
    // 不支持数据库，使用localStorage
    link=(function () {
  console.warn('浏览器不支持indexedDB，将在限制模式下使用');

  initsto.set('storage-mode','localstorage');
  // 初始化默认分组
  if (!initsto.get('links')) {
    initsto.set('links', [])
  }

  // 初始化分组
  if (!initsto.get('cate')) {
    initsto.set('cate', {});
  }

  return {
    addLink: function (detail, callback = function () { }) {
      if (!util.checkDetailsCorrect(detail, ['title', 'url'])) {
        throw '参数不正确';
      }
      var lm = limitURL(detail);
      if (lm) {
        callback({
          code: -3,
          msg: "受限模式下，" + lm + "长度过长",
          lm: lm
        });
      }
      if (detail.cate) {
        // 包含分类 
        var c = initsto.get('cate');
        if (!c[detail.cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          })
        } else {
          if (c[detail.cate].length > 100) {
            callback({
              code: -4,
              msg: "受限模式下，分组下已超过100条链接，无法添加"
            })
            return;
          }
          c[detail.cate] = pushLink(detail, c[detail.cate]);
          initsto.set('cate', c);
          callback({
            code: 0,
            msg: "添加成功"
          });
          doevents('change', {
            cate: detail.cate,
            type: 'add',
            detail: detail
          });
        }
      } else {
        // 不包含分类，即为默认分组

        var l = initsto.get('links');
        if (l.length > 100) {
          callback({
            code: -4,
            msg: "受限模式下，分组下已超过100条链接，无法添加"
          })
          return;
        }
        l = pushLink(detail, l);
        initsto.set('links', l);
        callback({
          code: 0,
          msg: "添加成功"
        });
        doevents('change', {
          cate: null,
          type: 'add',
          detail: detail
        });

      }
    },
    changeLink: function (cate, index, detail, callback = function () { }) {
      if (!util.checkDetailsCorrect(detail, ['title', 'url']) || typeof index != 'number') {
        throw '参数错误';
      }
      var lm = limitURL(detail);
      if (lm) {
        callback({
          code: -3,
          msg: "受限模式下，" + lm + "长度过长",
          lm: lm
        });
      }
      if (cate) {
        // 包含分类
        var c = initsto.get('cate');
        if (!c[cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          })
          return;
        }

        var r = writeLink(index, detail, c[cate]);
        if (!r) {
          callback({
            code: -2,
            msg: "链接不存在"
          });
          return;
        }
        c[cate] = r;
        initsto.set('cate', c);
        callback({
          code: 0,
          msg: "修改成功"
        });
        doevents('change', {
          cate: cate,
          index: index,
          type: 'change',
          detail: detail
        });
      } else {
        // 不包含分类
        var links = initsto.get('links');
        var r = writeLink(index, detail, links);
        if (!r) {
          callback({
            code: -2,
            msg: "链接不存在"
          });
          return;
        }
        links = r;
        initsto.set('links', links);
        callback({
          code: 0,
          msg: "修改成功"
        });
        doevents('change', {
          cate: null,
          index: index,
          type: 'change',
          detail: detail
        });
      }
    },
    deleteLink: function (cate, index, callback = function () { }) {
      if (cate) {
        // 包含分类
        var c = initsto.get('cate');
        if (!c[cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          });
          return;
        }
        if (!c[cate][index]) {
          callback({
            code: -2,
            msg: "链接不存在"
          });
          return;
        }
        c[cate].splice(index, 1);
        initsto.set('cate', c);
        callback({
          code: 0,
          msg: "删除成功"
        });
        doevents('change', {
          cate: cate,
          index: index,
          type: 'delete',
        });
      } else {
        // 不包含分类
        var r = initsto.get('links');
        if (!r[index]) {
          callback({
            code: -2,
            msg: "链接不存在"
          });
          return;
        }
        r.splice(index, 1);
        initsto.set('links', r);
        callback({
          code: 0,
          msg: "删除成功"
        });
        doevents('change', {
          cate: null,
          index: index,
          type: 'delete',
        });
      }
    },
    addCate: function (cate, callback = function () { }) {
      var c = initsto.get('cate');
      if (c[cate]) {
        callback({
          code: -1,
          msg: "分组已存在"
        });
        return;
      }
      if (Object.keys(c).length >= 20) {
        callback({
          code: -2,
          msg: "受限模式下，分组数量不能超过20个"
        });
        return;
      }
      c[cate] = [];
      initsto.set('cate', c);
      callback({
        code: 0,
        msg: "添加成功"
      });
      doevents('change', {
        cate: cate,
        type: 'cateadd',
      });
    },
    renameCate: function (cate, catename, callback = function () { }) {
      var c = initsto.get('cate');
      if (!c[cate]) {
        callback({
          code: -1,
          msg: "分组不存在"
        });
        return;
      }
      if (c[catename]) {
        callback({
          code: -2,
          msg: "分组重名"
        });
      }
      c[catename] = c[cate];
      delete c[cate];
      initsto.set('cate', c);
      callback({
        code: 0,
        msg: "修改成功"
      });
      doevents('change', {
        cate: cate,
        catename: catename,
        type: 'caterename',
      });
    },
    deleteCate: function (cate, callback = function () { }) {
      var c = initsto.get('cate');
      if (!c[cate]) {
        callback({
          code: -1,
          msg: "分组不存在"
        });
        return;
      }
      if (c[cate].length <= 1) {
        delete c[cate];
        initsto.set('cate', c);
        callback({
          code: 0,
          msg: "删除成功"
        });
      } else{
        confirm('确定要删除分组吗？无法恢复！',function(r){
          if(r){
            delete c[cate];
            initsto.set('cate', c);
            callback({
              code: 0,
              msg: "删除成功"
            });
            doevents('change', {
              cate: cate,
              type: 'catedelete',
            });
          }else{
            callback({
              code: -2,
              msg: "用户取消删除"
            });
          }
        })
      }
    },
    getLinks: function (cate, callback = function () { }) {
      if (cate) {
        var c = initsto.get('cate');
        if (!c[cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          });
          return;
        }
        callback({
          code: 0,
          msg: "获取成功",
          data: c[cate]
        });
      } else {
        var c = initsto.get('links');
        callback({
          code: 0,
          msg: "获取成功",
          data: c
        });
      }
    },
    getCates: function (callback = function () { }) {
      var c = initsto.get('cate');
      callback({
        code: 0,
        msg: "获取成功",
        data: Object.keys(c)
      });
    },
    getCateAll: function (callback = function () { }) {
      var c = initsto.get('cate');
      callback({
        code: 0,
        msg: "获取成功",
        data: c
      });
    },
    ready: function (fn) {
      fn();
    },
    addEventListener: function (event, fn) {
      if (eventfns[event]) {
        eventfns[event].push(fn);
      } else {
        eventfns[event] = [fn];
      }
    },
    removeEventListener: function (event, fn) {
      if (eventfns[event]) {
        eventfns[event].forEach(function (item, index) {
          if (item === fn) {
            eventfns[event].splice(index, 1);
          }
        });
      }
    }
  }
})();;
  }
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
  return link;
})();;
  var says=(function(){
  var initsto=storage('says');
  var jinrishici=(function(){
  var jinrishici={}, tokenStorageKey="jinrishici-token";
  function request(callback,url){
    var xhr=new XMLHttpRequest();
    xhr.open("get",url);
    xhr.withCredentials=false;
    xhr.send();
    xhr.onreadystatechange=function(){
      if(4===xhr.readyState){
        var res=JSON.parse(xhr.responseText);
        if("success"===res.status){
          callback(res)
        }else{
          console.error("今日诗词API加载失败，错误原因："+res.errMessage)
        }
      }
    }
  }
  jinrishici.load=function(callback){
    var key=initsto.get(tokenStorageKey);
    if(key){
      return request(callback,"https://v2.jinrishici.com/one.json?client=browser-sdk/1.2&X-User-Token="+encodeURIComponent(key))
    }else{
      return request(function(res){
        initsto.set(tokenStorageKey,res.token);
        callback(res);
      },"https://v2.jinrishici.com/one.json?client=browser-sdk/1.2")
    }
  }

  return jinrishici;
})();;
  var hitokoto=(function(){
  var hitokoto={};
  var hitokotoType=[];
  var hitokotoMinLength=0,hitokotoMaxLength=30;
  var d=0;
  hitokoto.load=function(callback){
    fetch(gurl()).then(function(r){
      return r.json()
    }).then(callback).catch(function(){
      d=1;
      fetch(gurl()).then(function(r){
        return r.json()
      }).then(callback)
    });
  }

  function gurl(){
    var cu=['https://v1.hitokoto.cn/','https://international.v1.hitokoto.cn/']
    var url=new URL(cu[d]);
    hitokotoType.forEach(function(k){
      url.searchParams.append('c',k);
    })
    url.searchParams.append('min_length',hitokotoMinLength);
    url.searchParams.append('max_length',hitokotoMaxLength);
    return url.href;
  }
  hitokoto.setTypes=function(arr){
    hitokotoType=arr;
  }
  hitokoto.setMinLength=function(l){
    hitokotoMinLength=l;
  }
  hitokoto.setMaxLength=function(l){
    hitokotoMaxLength=l;
  }
  hitokoto.getAllTypes=function(){
    return {
      a:'动画',
      b:'漫画',
      c:'游戏',
      d:'文学',
      e:'原创',
      f:'来自网络',
      g:'其他',
      h:'影视',
      i:'诗词',
      j:'网易云',
      k:'哲学',
      l:'抖机灵'
    }
  }
  return hitokoto;
})();;

//   var sayTypes=['user','jinrishici','hitokoto'];

  var sayF=util.element('div',{
    class:"says"
  });

  util.query(document,'main').appendChild(sayF);

  var def='海内存知己，天涯若比邻'; 
  sayF.innerHTML=`<div class="say-inner"></div><div class="say-control">${util.getGoogleIcon('e5d4')}</div>`;

  var sayI=util.query(sayF,'div.say-inner');
  var sayC=util.query(sayF,'div.say-control');
  var sayMenu=new menu({
    list:[],
  });

  var sayinfoDialog=new dialog({
    content:`<div class="closeBtn">${util.getGoogleIcon('e5cd')}</div><ul></ul>`,
    class:"says_info"
  });

  var infd=sayinfoDialog.getDialogDom();
  util.query(infd,'div.closeBtn').onclick=function(){
    sayinfoDialog.close();
  }

  var sayTypes={},nowSay={};
  function addSayType(details){
    if(typeof details!='object'||!details||!util.checkDetailsCorrect(details,['name','key','callback'])||typeof details.callback!='function'){
      throw '参数不正确';
    }
    sayTypes[details.key]={
      name:details.name,
      callback:details.callback,
      click:details.click||function(){},
      menu:details.menu||[
        {
          icon:util.getGoogleIcon('e14d'),
          title:'复制',
          click:function(){
            var value=nowSay.say;
            util.copyText(value);
          }
        }
      ]
    }
  }

  function setSayType(key,cb){
    if(!sayTypes[key]){
      throw 'key不存在';
    }

    initsto.set('saytype',key);
    sayMenu.setList(sayTypes[key].menu);
    sayI.onclick=sayTypes[key].click

    refsay(key,cb);
  }

  function refsay(key,cb){
    if(!sayTypes[key]){
      throw 'key不存在';
    }
    sayI.innerText='...';
    sayI.title='加载中';
    sayTypes[key].callback().then(function(say){
      sayI.innerText=say.say;
      sayI.setAttribute('title',say.title);
      nowSay=say;
      cb&&cb();
    })
  }

  function getNowSay(){
    return nowSay;
  }

  function openSayDetailsDialog(op){
    util.query(infd,'ul').innerHTML=(function(){
      var str='';
      for(var k in op){
        str+='<li><b>'+k+':</b> '+op[k]+'</li>';
      }
      return str;
    })();
    sayinfoDialog.open();
  }

  sayC.onclick=function(e){
    e.stopPropagation();
    var bo=sayC.getBoundingClientRect()
    sayMenu.setOffset({
      bottom:window.innerHeight-bo.top,
      left:bo.left-90+bo.width
    });
    sayMenu.show();
  }

  addSayType({
    key:"user",
    name:"用户自定义",
    callback:function(){
      return new Promise(function(resolve,reject){
        resolve({
        say:initsto.get('usersay'),
        title:"点击修改"});
      });
    },
    click:function(){
      openSaysEditor();
    },
    menu:[{
      icon:util.getGoogleIcon('e3c9'),
      title:'修改',
      click:function(){
        openSaysEditor();
      }
    },{
      icon:util.getGoogleIcon('e14d'),
      title:'复制',
      click:function(){
        var value=nowSay.say;
        util.copyText(value);
      }
    }]
  });

  addSayType({
    key:"hitokoto",
    name:"Hitokoto",
    callback:function(){
      return new Promise(function(resolve,reject){
        hitokoto.load(function(res){
          resolve({
            say:res.hitokoto,
            from:res.from,
            uuid:res.uuid,
            from_who:res.from_who,
            title:"该一言来自"+res.from+"，由"+res.from_who+"上传"
          })
        })
      })
    },
    click:function(){
      refsay('hitokoto');
    },
    menu:[{
      icon:util.getGoogleIcon('e5d5'),
      title:'刷新',
      click:function(){
        refsay('hitokoto');
      }
    },{
      icon:util.getGoogleIcon('e14d'),
      title:'复制',
      click:function(){
        var value=nowSay.say;
        util.copyText(value);
      }
    },{
      icon:util.getGoogleIcon('e88e'),
      title:'一言详情',
      click:function(){
        openSayDetailsDialog({
          'API':"Hitokoto",
          '内容':nowSay.say,
          '来源':nowSay.from,
          '上传者':nowSay.from_who,
          'UUID':nowSay.uuid
        })
      }
    }]
  })

  addSayType({
    key:"jinrishici",
    name:"今日诗词",
    callback:function(){
      return new Promise(function(resolve,reject){
        jinrishici.load(function(res){
          resolve({
            say:res.data.content,
            author:'('+res.data.origin.dynasty+')'+res.data.origin.author,
            p_title:'《'+res.data.origin.title+'》',
            tags:res.data.matchTags.join(' '),
            content:'<br>'+res.data.origin.content.join('<br>'),
            title:"摘自"+res.data.origin.dynasty+"·"+res.data.origin.author+"的《"+res.data.origin.title+'》',
          })
        })
      })
    },
    click:function(){
      refsay('jinrishici');
    },
    menu:[{
      icon:util.getGoogleIcon('e5d5'),
      title:'刷新',
      click:function(){
        refsay('jinrishici');
      }
    },{
      icon:util.getGoogleIcon('e14d'),
      title:'复制',
      click:function(){
        var value=nowSay.say;
        util.copyText(value);
      }
    },{
      icon:util.getGoogleIcon('e88e'),
      title:'一言详情',
      click:function(){
        openSayDetailsDialog({
          'API':"今日诗词",
          '内容':nowSay.say,
          '作者':nowSay.author,
          '标题':nowSay.p_title,
          '全部内容':nowSay.content
        })
      }
    }]
  })


  if(!initsto.get('usersay')){
    initsto.set('usersay',def);
  }

  if(!initsto.get('saytype')){
    initsto.set('saytype','user');
  }

  var sayseditordialog=null;
  function openSaysEditor(){
    if(!sayseditordialog){
      sayseditordialog=new dialog({
        class:"sayseditordialog",
        content:`<h1>修改一言</h1>
<div class="content">
  <p><input class="says-input" type="text"/></p>
</div>
<div class="footer">
  <div class="cancel btn">取消</div>
  <button class="ok btn">确定</button>
</div>`
      })
      // @note 将cancel按钮修改为div，防止表单submit到cancel
      // @edit at 2024/1/30 15:20
      var d=sayseditordialog.getDialogDom();
      util.query(d,'.cancel.btn').onclick=function(){
        sayseditordialog.close();
      }
      util.query(d,'.ok.btn').onclick=function(){
        var v=util.query(d,'.says-input').value;
        initsto.set('usersay',v);
        initSays(nowsaystype);
        sayseditordialog.close();
      }
    }
    setTimeout(function(){
      var d=sayseditordialog.getDialogDom();
      sayseditordialog.open();
      util.query(d,'.says-input').value=initsto.get('usersay');
    })
  }
  if(initsto.get('enabled')==undefined){
    initsto.set('enabled',true);
  }
  if(initsto.get('enabled')){
    setSayType(initsto.get('saytype'));
  }else{
    sayF.style.display='none';
  }

  return {
    getNowSay,
    setSayType,
  }
})();;
  var background=(function () {
  var bgf = util.element('div', {
    class: "bgf"
  });
  util.query(document, 'body').appendChild(bgf);
  var initsto = storage('background');
  var tabindexCount=0;

  // 避免缓存（用于图片API）
  function urlnocache(url) {
    return url + (url.indexOf('?') > -1 ? '&' : '?') + 't=' + new Date().getTime();
  }

  // 背景设置对话框
  var bg_set_d = new dialog({
    content: `<div class="actionbar">
      <h1>背景设置</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <div class="tab_con"></div>
    <div class="scroll_con"></div>
    `,
    class: "bg_d",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN
  });

  // 背景设置对话框Dom
  var d = bg_set_d.getDialogDom();

  // 关闭按钮
  util.query(d, '.closeBtn').onclick = function () {
    bg_set_d.close();
  }

  // 背景设置对话框Tab
  var tab_con = util.query(d, 'div.tab_con');

  // 背景设置对话框内容
  var scroll_con = util.query(d, 'div.scroll_con');

  // 初始化用户存储
  function initStorage() {
    if (!initsto.get('bg')) {
      initsto.set('bg', {
        type: "default",
        data: {
          type: "color",
          light: "#fff",
          dark: "#333"
        }
      });
    }
  }
  initStorage();

  var defDrawer=(function(){
  var tab1,setbg,tab2,tab3;
  var initsto=storage('bg-def-user');
  if(!initsto.get('color')){
    initsto.set('color',{
      dark:"#333333",
      light:'#ffffff'
    })
  }
  var acgbg=(function(){
  var apis=[{
    url:"https://api.gumengya.com/Api/DmImg?format=image",
    message:{
      from:"故梦API",
      site:"https://gumengya.com/"
    }
  },{
    url:"https://www.loliapi.com/acg/",
    message:{
      from:"LoliApi",
      site:"https://www.loliapi.com/"
    }
  },{
    url:"https://img.xjh.me/random_img.php?return=302&type=bg",
    message:{
      from:"岁月小筑",
      site:"https://img.xjh.me/"
    }
  }]
  return {
    getImg:function(apiindex){
      return apis[typeof apiindex=='number'&&apiindex<apis.length?apiindex:parseInt(Math.random()*apis.length)]
    }
  }
})();;
  var fjbg=(function(){
  var apis=[{
    url:"https://api.gumengya.com/Api/FjImg?format=image",
    message:{
      from:"故梦API",
      site:"https://gumengya.com/"
    }
  },{
    url:"https://imgapi.cn/api.php?fl=fengjing",
    message:{
      from:"IMGAPI",
      site:"https://imgapi.cn/"
    }
  },{
    url:"https://img.xjh.me/random_img.php?return=302&type=bg&ctype=nature",
    message:{
      from:"岁月小筑",
      site:"https://img.xjh.me/"
    }
  }]
  return {
    getImg:function(apiindex){
      return apis[typeof apiindex=='number'&&apiindex<apis.length?apiindex:parseInt(Math.random()*apis.length)]
    }
  }
})();;
  var neizhiImg=[
    {
      thumbnail:"https://image.gumengya.com/thumbnails/06470348c93db185e44f8acd87c5b683.png",
      img:"https://image.gumengya.cn/i/2023/10/13/65294cf55ef7d.png",
    },
    {
      thumbnail:"https://image.gumengya.com/thumbnails/5e6200d4552394e722967ef96addd06a.png",
      img:"https://image.gumengya.cn/i/2023/10/13/65294c34841b4.jpg",
    },
    {
      thumbnail:"https://image.gumengya.com/thumbnails/7ee6991ee0f43be59c28d183597e0cca.png",
      img:"https://image.gumengya.cn/i/2023/10/13/65294c30563b7.jpg",
    },
    {
      thumbnail:"https://image.gumengya.com/thumbnails/ff674343879116e22e3cf713358f2cb5.png",
      img:"https://image.gumengya.com/thumbnails/ff674343879116e22e3cf713358f2cb5.png",
    },
    {
      thumbnail:"https://image.gumengya.com/thumbnails/c9c187157ca050044a6589f230e8ddbf.png",
      img:"https://image.gumengya.cn/i/2023/10/13/65294c2d8aae1.png",
    }
  ];

  function loadimg(url,cb){
    var img=new Image();
    img.src=url;
    img.onload=function(){
      cb(true);
    }
    img.onerror=function(){
      cb(false);
    }
  }

  function hasUploadedImg(){
    return !!initsto.get('upload');
  }

  var refreshApiIcon=new iconc.icon({
    content:util.getGoogleIcon('e86a'),
    offset:"br"
  });
  refreshApiIcon.hide();
  var refreshFn=function(){}

  refreshApiIcon.getIcon().onclick=function(){
    refreshFn.call(this);
  };

  //时间的颜色API
  function getNowColor(){
    var date=new Date();
    return {
      light:`rgb(${256-date.getHours()},${256-date.getMinutes()},${256-date.getSeconds()})`,
      dark:`rgb(${date.getHours()},${date.getMinutes()},${date.getSeconds()})`
    }
    
  }

  var timeb=null;

  var draws={
    img:function(bgf,data){
      if(!util.query(bgf,'.img-sp')){
        bgf.innerHTML='<div class="img-sp full"><div class="cover"></div><img src=""/></div>'
      }
      util.query(bgf,'.img-sp img').src=data.url;
      document.body.classList.add('t-dark');
    },
    video:function(bgf,data){
      if(!util.query(bgf,'.video-sp')){
        bgf.innerHTML='<div class="video-sp full"><div class="cover"></div><video src="" muted loop></video></div>'
      }
      util.query(bgf,'.video-sp video').src=data.url;
      util.query(bgf,'.video-sp video').oncanplay=function(){
        this.play();
      }
      document.body.classList.add('t-dark');
    },
    color:function(bgf,data){
      if(!util.query(bgf,'.color-sp')){
        bgf.innerHTML='<div class="color-sp full"></div>'
      }
      if(!util.query(document.head,'style.colorSpControl')){
        var style=document.createElement('style');
        style.className='colorSpControl';
        document.head.appendChild(style);
      }
      util.query(document.head,'style.colorSpControl').innerHTML=`.color-sp{
        background-color:${data.light};
      }body.dark .color-sp{
        background-color:${data.dark};
      }`
    },
    api:function(bgf,data){
      if(data.api=='acg'){
        var url=urlnocache(acgbg.getImg().url);
        draws.img(bgf,{
          url:url
        });
        refreshApiIcon.show();
        refreshFn=function(){
          var url=urlnocache(acgbg.getImg().url);
          this.classList.add('round-anim');
          var _=this;
          loadimg(url,function(ok){
            if(ok){
              _.classList.remove('round-anim');
              draws.img(bgf,{
                url:url
              });
            }else{
              refreshFn.call(_);
            }
          })
          
        }
      }else if(data.api=='fj'){
        var url=urlnocache(fjbg.getImg().url);
        draws.img(bgf,{
          url:url
        });
        refreshApiIcon.show();
        refreshFn=function(){
          var url=urlnocache(fjbg.getImg().url);
          this.classList.add('round-anim');
          var _=this;
          loadimg(url,function(ok){
            if(ok){
              _.classList.remove('round-anim');
              draws.img(bgf,{
                url:url
              });
            }else{
              refreshFn.call(_);
            }
          })
        }
      }else if(data.api=='bing'){
        draws.img(bgf,{
          url:"https://bing.shangzhenyang.com/api/1080p"
        });
      }else if(data.api=='time'){
        timeb=setInterval(function(){
          draws.color(bgf,getNowColor());
        },200)
      }
    },
    userbg:function(bgf,data){
      // 图片或视频
      var a=initsto.get('userbg');
      if(!a) return;

      document.body.classList.add('t-dark');
      if(a.type=='video'){
        var b=a.useidb;
        if(b){
          initsto.get('upload',true,function(blob){
            draws.video(bgf,{
              url:URL.createObjectURL(blob)
            })
          })
        }else{
          draws.video(bgf,{
            url:a.url
          })
        }
      }else if(a.type=='image'){
        var b=a.useidb;
        if(b){
          initsto.get('upload',true,function(blob){
            draws.img(bgf,{
              url:URL.createObjectURL(blob)
            })
          })
        }else{
          draws.img(bgf,{
            url:a.url
          })
        }
      }
    },
    zdy:function(bgf,data){
      if(!util.query(bgf,'.zdy-sp')){
        bgf.innerHTML='<div class="zdy-sp full"></div>'
      }
      if(!util.query(document.head,'style.zdySpControl')){
        var style=document.createElement('style');
        style.className='zdySpControl';
        document.head.appendChild(style);
      }
      util.query(document.head,'style.zdySpControl').innerHTML=`.zdy-sp{
        background:${data.light};
      }body.dark .zdy-sp{
        background:${data.dark};
      }`
    }
  }

  // 图片、视频上传器
  var iovuploader=new dialog({
    content:`
    <form>
      <h1>上传背景</h1>
      <div class="content">
        <p>背景类型：<input type="radio" class="uploadi" name="uploadiov" checked/> 图片 
        <input type="radio" class="uploadv" name="uploadiov"/> 视频 </p>
        <p>背景URL：<input type="url" placeholder="URL"/></p>
        <p>从本地选择文件：<input type="file"/></p>
        <p class="tip">URL和文件只需填写一个即可，优先选择本地文件</p>
      </div>
      <div class="footer">
        <div class="cancel btn">取消</div>
        <button class="ok btn">确定</button>
      </div>
    </form>
  `,
    class:"iovuploader",
  })
  // @note 将cancel按钮修改为div，防止表单submit到cancel
  // @edit at 2024/1/30 15:20

  // Dom
  var iovuploaderf=iovuploader.getDialogDom();
  // 取消
  util.query(iovuploaderf,'.cancel').onclick=function(e){
    e.preventDefault();
    iovuploader.close();
  }
  // 提交
  util.query(iovuploaderf,'form').onsubmit=function(e){
    e.preventDefault();
    // 类型 image(图片) / video(视频)
    var type=util.query(iovuploaderf,'.uploadi').checked?'image':'video';
    // url?
    var url=util.query(iovuploaderf,'input[type="url"]').value;
    // File?
    var file=util.query(iovuploaderf,'input[type="file"]').files[0];
    // 先把背景设置对话框中的图片src重置
    util.query(d,'.zdy .left img').src='';
    if(file){
      // File优先

      // 将内容写入idb
      initsto.set('upload',file,true,function(){
        iovuploader.close();
        getUserUploadUrl(function(r){
          // 获取并设置背景设置对话框中的图片src
          util.query(d,'.zdy .left img').src=r;
        })
        setbg({
          type:"default",
          data:{
            type:"userbg"
          }
        })
      });

      // 设置存储
      initsto.set('userbg',{
        type:type,
        useidb:true
      })
    }else{
      initsto.set('userbg',{
        type:type,
        url:url
      })
      iovuploader.close();
      getUserUploadUrl(function(r){
        // 获取并设置背景设置对话框中的图片src
        util.query(tab1,'.zdy .left img').src=r;
        setbg({
          type:"default",
          data:{
            type:"userbg"
          }
        })
      })
    }

    util.query(tab1,'.noBg').style.display='none';
    util.query(tab1,'.zdy .editbtn').style.display='block';
  }

  // 获取用户上传图片、视频URL
  function getUserUploadUrl(cb){
    var a=initsto.get('userbg');
    // 没有上传，直接返回false
    if(!a) {
      cb(false);
      return;
    }

    if(a.type=='video'){
      // 视频
      var b=a.useidb;
      if(b){
        // 来自用户本地上传，从idb提取，获取视频快照返回
        initsto.get('upload',true,function(blob){
          getVideoCaptrue(URL.createObjectURL(blob),function(c){
            cb(c);
          });
        })
      }else{
        // 来自外站，尝试获取视频快照返回
        try{
          getVideoCaptrue(a.url,function(c){
            cb(c);
          });
        }catch(e){
          //失败（CORS|>400）
          cb(false);
        }
      }
    }else if(a.type=='image'){
      var b=a.useidb;
      if(b){
        // 来自用户本地上传，从idb提取返回
        initsto.get('upload',true,function(blob){
          cb(URL.createObjectURL(blob));
        })
      }else{
        // 来自外站，直接返回
        cb(a.url);
      }
    }
  }

  //获取视频快照
  function getVideoCaptrue(url, callback) {
    var video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';
  
    video.onloadedmetadata = function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      video.currentTime = video.duration /4;
  
      video.oncanplay = function() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL('image/png'));
        this.remove();
      };
    };
  }
  

  // 自定义颜色修改对话框
  var colorchanger=new dialog({
    content:`
    <form>
      <h1>自定义背景颜色</h1>
      <div class="content">
        <p>浅色模式：<input type="color" class="lightbgcolor"/></p>
        <p>深色模式：<input type="color" class="darkbgcolor"/></p>
      </div>
      <div class="footer">
        <div class="cancel btn">取消</div>
        <button class="ok btn">确定</button>
      </div>
    </form>
    `
  });
  // @note 将cancel按钮修改为div，防止表单submit到cancel
  // @edit at 2024/1/30 15:20

  // Dom
  var colorchangerf=colorchanger.getDialogDom();
  // 取消
  util.query(colorchangerf,'.cancel').onclick=function(e){
    e.preventDefault();
    colorchanger.close();
  }
  // 提交
  util.query(colorchangerf,'form').onsubmit=function(e){
    e.preventDefault();
    var lightc=util.query(colorchangerf,'.lightbgcolor').value;
    var darkc=util.query(colorchangerf,'.darkbgcolor').value;
    initsto.set('color',{
      light:lightc,
      dark:darkc
    });
    util.query(tab2,'.zdy .color-left').style.backgroundColor=lightc;
    util.query(tab2,'.zdy .color-right').style.backgroundColor=darkc;
    colorchanger.close();

    setbg({
      type:"default",
      data:{
        type:"color",
        light:lightc,
        dark:darkc
      }
    })
  }
  
  return {
    type: "default",
    init: function (e) {
      setbg=e.setbg;
      // pushTab 图片/视频
      tab1=e.pushBgTab({
        tab:"图片/视频",
        content:"<div class=\"unit-item zdy\">\n  <div class=\"unit-title\">自定义</div>\n  <div class=\"unit-content\">\n    <div class=\"bgitem full\">\n      <div class=\"left\">\n        <div class=\"hasBg\">\n          <img src=\"\" alt=\"\">\n        </div>\n        <div class=\"noBg\">\n          <span class=\"material-symbols-outlined\">&#xf09b;</span>\n        </div>\n      </div>\n      <div class=\"right\">\n        <div class=\"bg-title\">用户自定义背景</div>\n        <div class=\"bg-message\">上传任意你喜欢的图片/视频作背景</div>\n      </div>\n      <div class=\"editbtn\">\n        <div class=\"btn ok\">重新上传</div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"unit-item neizhi\">\n  <div class=\"unit-title\">内置</div>\n  <div class=\"unit-content\"></div>\n</div>\n<div class=\"unit-item api\">\n  <div class=\"unit-title\">API</div>\n  <div class=\"unit-content\">\n    <div class=\"bgitem half\">\n      <div class=\"left\" data-api=\"bing\">\n        <img src=\"https://bing.shangzhenyang.com/api/1080p\" alt=\"\">\n      </div>\n      <div class=\"right\">\n        <div class=\"bg-title\">必应壁纸</div>\n        <div class=\"bg-message\">获取必应首页的壁纸作为背景</div>\n      </div>\n    </div>\n    <div class=\"bgitem half\">\n      <div class=\"left\" data-api=\"acg\">\n        <img src=\"https://www.loliapi.com/acg/\" alt=\"\">\n      </div>\n      <div class=\"right\">\n        <div class=\"bg-title\">随机二次元壁纸</div>\n        <div class=\"bg-message\">获取随机二次元壁纸作为背景，背景提供：loliapi.com</div>\n      </div>\n    </div>\n    <div class=\"bgitem half\">\n      <div class=\"left\" data-api=\"fj\">\n        <img src=\"https://imgapi.cn/api.php?fl=fengjing\" alt=\"\">\n      </div>\n      <div class=\"right\">\n        <div class=\"bg-title\">随机风景壁纸</div>\n        <div class=\"bg-message\">获取随机风景壁纸作为背景，背景提供：imgapi.cn</div>\n      </div>\n    </div>\n  </div>\n</div>"
      });

      if(!hasUploadedImg()){
        util.query(tab1,'.hasBg').style.display='none';
        util.query(tab1,'.zdy .editbtn').style.display='none';
      }else{
        util.query(tab1,'.noBg').style.display='none';
        getUserUploadUrl(function(url){
          util.query(tab1,'.zdy .left img').src=url;
        })
      }
      util.query(tab1,'.zdy .left').addEventListener('click',function(){
        if(hasUploadedImg()){
          e.setbg({
            type:e.type,
            data:{
              type:"userbg"
            }
          })
          util.query(tab1,'.bgitem',true).forEach(function(b){
            b.classList.remove('selected');
          })
          this.parentElement.classList.add('selected');
        }else{
          iovuploader.open();
        }
      })
      util.query(tab1,'.zdy .editbtn').addEventListener('click',function(){
        iovuploader.open();
      });

      // 内置图片
      var u=util.query(tab1,'.neizhi .unit-content');
      var _=this;
      neizhiImg.forEach(function(im){
        var bgitem=util.element('div',{
          class:"bgitem def",
          'data-img':im.img,
        });
        bgitem.innerHTML='<div class="left"><img src="'+im.thumbnail+'"/></div>'
        u.appendChild(bgitem);
        util.query(bgitem,'.left').onclick=function(){
          util.query(tab1,'.bgitem',true).forEach(function(b){
            b.classList.remove('selected');
          })
          bgitem.classList.add('selected');
          e.setbg({
            type:e.type,
            data:{
              type:"img",
              url:bgitem.getAttribute('data-img')
            }
          })
        }
      });

      // API
      util.query(tab1,'.api.unit-item .left',true).forEach(function(l){
        l.addEventListener('click',function(){
          util.query(tab1,'.bgitem',true).forEach(function(b){
            b.classList.remove('selected');
          })
          l.parentElement.classList.add('selected');
          e.setbg({
            type:e.type,
            data:{
              type:"api",
              api:l.getAttribute('data-api')
            }
          })
        });
      });


      // pushTab 纯色
      tab2=e.pushBgTab({
        tab:"纯色",
        content:"<div class=\"unit-item zdy\">\n  <div class=\"unit-title\">自定义颜色</div>\n  <div class=\"unit-content\">\n    <div class=\"bgitem full\">\n      <div class=\"left\">\n        <div class=\"color-left color\"></div>\n        <div class=\"color-right color\"></div>\n      </div>\n      <div class=\"right\">\n        <div class=\"bg-title\">自定义纯色背景</div>\n        <div class=\"bg-message\">将你喜欢的颜色做背景，分亮色和暗色（你也可以都设一个颜色或反着来，但不建议这么做）</div>\n      </div>\n      <div class=\"editbtn\">\n        <div class=\"btn ok\">编辑</div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"unit-item api\">\n  <div class=\"unit-title\">API</div>\n  <div class=\"unit-content\">\n    <div class=\"bgitem full\" data-api=\"time\">\n      <div class=\"left\">\n        <div class=\"color-left color\"></div>\n        <div class=\"color-right color\"></div>\n      </div>\n      <div class=\"right\">\n        <div class=\"bg-title\">时间的颜色</div>\n        <div class=\"bg-message\">如果当前时间为12:34:56，那么时间的颜色就是rgb(12,34,56)，在亮色模式下就是rgb(255-12,255-34,255-56)</div>\n      </div>\n    </div>\n  </div>\n</div>"
      });
      var c=initsto.get('color');
      util.query(tab2,'.zdy .color-left').style.backgroundColor=c.light;
      util.query(tab2,'.zdy .color-right').style.backgroundColor=c.dark;
      util.query(tab2,'.zdy .left').onclick=function(){
        util.query(tab2,'.bgitem',true).forEach(function(b){
          b.classList.remove('selected');
        })
        this.parentElement.classList.add('selected');
        var c=initsto.get('color');
        e.setbg({
          type:e.type,
          data:{
            type:"color",
            light:c.light,
            dark:c.dark
          }
        })
      }
      util.query(tab2,'.zdy .btn').onclick=function(){
        var c=initsto.get('color');
        util.query(colorchangerf,'.lightbgcolor').value=c.light;
        util.query(colorchangerf,'.darkbgcolor').value=c.dark;
        colorchanger.open();
      }
      var cd=getNowColor();
      util.query(tab2,'.api .color-left').style.backgroundColor=cd.light;
      util.query(tab2,'.api .color-right').style.backgroundColor=cd.dark;
      util.query(tab2,'.api .left').onclick=function(){
        var l=this;
        util.query(tab1,'.bgitem',true).forEach(function(b){
          b.classList.remove('selected');
        })
        l.parentElement.classList.add('selected');
        e.setbg({
          type:e.type,
          data:{
            type:"api",
            api:l.parentElement.getAttribute('data-api')
          }
        })
      }

      // pushTab 自定义
      tab3=e.pushBgTab({
        tab:"自定义",
        content:"<p>浅色模式：</p><br>\n<textarea class=\"gjzdytlight textarea\"></textarea>\n<p>深色模式：</p><br>\n<textarea class=\"gjzdytdark textarea\"></textarea>\n<button class=\"gjzdysetbtn\">设置</button>\n<p class=\"tip\">参见 CSS | background属性</p>"
      });
      util.query(tab3,'.gjzdytlight').value=initsto.get('custombglight')??'';
      util.query(tab3,'.gjzdytdark').value=initsto.get('custombgdark')??'';
      util.query(tab3,'.gjzdysetbtn').onclick=function(){
        initsto.set('custombglight',util.query(tab3,'.gjzdytlight').value);
        initsto.set('custombgdark',util.query(tab3,'.gjzdytdark').value);
        e.setbg({
          type:e.type,
          data:{
            type:'zdy',
            dark:util.query(tab3,'.gjzdytdark').value,
            light:util.query(tab3,'.gjzdytlight').value
          }
        })
        quik.toast.show('设置成功')
      }
    },
    destory: function (n) {
      // TODO
    },
    cancel: function (n) {
      n.bgf.innerHTML='';
      document.body.classList.remove('t-dark');
      refreshApiIcon.hide();
      refreshFn=function(){}
      clearInterval(timeb);
    },
    draw:function(n){
      var bgf=n.bgf;
      var data=n.data;
      document.body.classList.remove('t-dark');
      refreshApiIcon.hide();
      refreshFn=function(){}
      clearInterval(timeb);
      draws[data.type](bgf,data);
    }
  }
})();;
  var drawers = [defDrawer];
  dodrawer(defDrawer);

  function pushBgTab(item) {
    var tab=item.tab; // tab标题

    // 一个tab标签
    var tabitem=util.element('div',{
      class:'tabitem',
      'data-tab':tabindexCount.toString() //TabID，方便控制
    });
    tab_con.appendChild(tabitem);
    tabitem.innerHTML=tab;
    // 点击时跳转至该Tab
    tabitem.onclick=function(){
      activeTab(this.getAttribute('data-tab'));
    }

    // 内容
    var scrollitem=util.element('div',{
      class:'scrollitem',
      'data-tab':tabindexCount.toString() //对应TabID，方便控制
    });
    scroll_con.appendChild(scrollitem);
    scrollitem.innerHTML=item.content;
    tabindexCount++;
    return scrollitem;
  }

  // activeTab
  function activeTab(i){
    util.query(d,'.tabitem',true).forEach(function(t){
      t.classList.remove('active');
    });
    util.query(d,'.scrollitem',true).forEach(function(t){
      t.style.display='';
    });
    util.query(d,'.tabitem[data-tab="'+i+'"]').classList.add('active');
    util.query(d,'.scrollitem[data-tab="'+i+'"]').style.display='block';
  }


  function pushBgDrawer(drawer) {
    var session = drawer.session;
    try {
      if (!util.checkSession(session)) {
        throw 'session error';
      }
    } catch (e) {
      throw new Error('背景Drawer注册失败，Session校验错误。')
    }
    var bgdrawerid = 'bgdrawer-' + util.getRandomHashCache();
    drawer.id = bgdrawerid;
    drawers.push(drawer);
    dodrawer(drawer);
    onbgdrawersign(drawer);
    return bgdrawerid;
  }

  function dodrawer(drawer) {
    drawer.init({
      bgf: bgf,
      pushBgTab:pushBgTab,
      setbg:setbg,
      type:drawer.type
    });
  }

  var waitdraw=null;
  function onbgdrawersign(drawer) {
    if(waitdraw){
      if(drawer.type==waitdraw.type){
        drawers[i].draw({
          bgf:bgf,data:waitdraw.data
        })
      }
    }
  }

  var nowdraw=null;
  function drawbg(data){
    for(var i=0;i<drawers.length;i++){
      if(data.type==drawers[i].type){
        if(nowdraw&&nowdraw.type!=drawers[i].type){
          nowdraw.cancel({bgf:bgf});
          nowdraw=drawers[i];
        }
        drawers[i].draw({
          bgf:bgf,data:data.data
        })
        return;
      }
    }
    waitdraw=data;
  }

  function setbg(data){
    initsto.set('bg',data);
    drawbg(data);
  }

  drawbg(initsto.get('bg'));

  var sg=new SettingGroup({
    title:"背景",
    index:3
  });

  var si=new SettingItem({
    title:"背景设置",
    message:"点击设置背景",
    index:0,
    type:'null',
    callback:function(){
      bg_set_d.open();
    }
  })

  mainSetting.addNewGroup(sg);
  sg.addNewItem(si);

  //开始activeTab0
    activeTab('0');

  return{
    pushBgDrawer,
    setbg
  }

})();;
  var mainmenu=(function(){
  var mainmenu_icon=new iconc.icon({
    class:"main_menu",
    content:util.getGoogleIcon('e5d2'),
    offset:"tr"
  });

  var main_menu=new menu({
    list:[{
      icon:util.getGoogleIcon('e88e'),
      title:"关于QUIK",
      click:function(){

      }
    }],
    offset:{
      top:40,
      right:15
    }
  });

  mainmenu_icon.getIcon().onclick=function(e){
    e.stopPropagation();
    main_menu.show();
  }

  return{
    
  }
})();;
  var searchEditor=(function(){
  var dia=new dialog({
    content:`<div class="actionbar">
    <h1>自定义搜索引擎</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
  </div>
  <div class="searchlist"></div>
  <div class="footer">
    <button class="cancel btn">取消</button>
    <button class="ok btn">确定</button>
  </div>`,
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
    str+=`<div class="item" data-k="${k}">
      <div class="icon"><img src="${util.getFavicon(list[k])}" onerror="this.src=quik.util.getFavicon(this.src,true)"/></div>
      <div class="url"><input value="${list[k]}"/></div>
      <div class="remove">${util.getGoogleIcon('e5cd')}</div>
    </div>`;
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
    item.innerHTML=`<div class="icon"><img src="https://cn.bing.com/favicon.ico" onerror="this.src=quik.util.getFavicon(this.src,true)"/></div>
    <div class="url"><input value="https://cn.bing.com/search?q=%keyword%"/></div>
    <div class="remove">${util.getGoogleIcon('e5cd')}</div>`;
    util.query(d,'.searchlist').insertBefore(item,util.query(d,'.searchlist .addnewitem'));
    clitem(item);
  }


  function clitem(item){
    util.query(item,'.url input').oninput=function(){
      if(this.parentElement.parentElement.dataset.k=='bing'){
        this.value=list['bing'];
        toast.show('该项只读');
        return;
      }
      // @note 隐藏用户输入了不正确的URL的报错
      // @edit at 2024/1/30 15:28
      try{
        this.parentElement.parentElement.querySelector('.icon img').src=util.getFavicon(this.value);
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
})();;
  var notice=(function(){
  var notice_con=document.querySelector(".notice-con");
  var notip=document.querySelector(".no-notice-tip");
  var notice_mb="<div class=\"notice-actionbar\">\n  <div class=\"notice-title\"></div>\n  <div class=\"notice-close-btn\">{{close-btn}}</div>\n</div>\n<div class=\"notice-content\"></div>\n<div class=\"notice-progress\">\n  <div class=\"p\"><div></div></div>\n</div>\n<div class=\"notice-btns\"></div>";
  var focus_con=document.querySelector(".focus-notice");
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
      mbicon.getIcon().classList.add('notice-hasnew-icon');
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
        mbicon.getIcon().classList.remove('notice-hasnew-icon');
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
    offset:"tl"
  });
  
  window.addEventListener('resize',r);
  mbicon.getIcon().addEventListener('click',function(){
    document.querySelector(".notice-sc").classList.add('show');
  })
  document.querySelector(".notice-sc").addEventListener('click',function(){
    this.classList.remove('show');
  })
  function r(){
    if(window.innerWidth>600){
      mbicon.hide();
    }else{
      mbicon.show();
    }
  }
  r();

  
  return notice;

})();;
  var theme=(function(){
  var eventfn={}
  var initsto=storage('theme');
  var n=null;
  if(!initsto.get('theme')){
    initsto.set('theme','a');
  }
  var si=new SettingItem({
    index:0,
    title:"主题颜色",
    type:"select",
    message:'',
    get:function(){
      return initsto.get('theme');
    },
    callback:function(v){
      initsto.set('theme',v);
      checkTheme(v);
    },
    init:function(){
      return {
        a:'浅色',b:'深色',c:'跟随时间',d:"跟随系统"
      }
    }
  });

  tyGroup.addNewItem(si);

  var _g=3;
  function checkTheme(v){
    if(_g!=3){_g=false;}
    if(v=='b'){
      document.body.classList.add('dark');
      doevent('change',['dark']);
      n='dark';
    }else if(v=='a'){
      document.body.classList.remove('dark');
      doevent('change',['light']);
      n='light'
    }else if(v=='c'){
      if(new Date().getHours()>=18||new Date().getHours()<6){
        document.body.classList.add('dark');
        doevent('change',['dark']);
        n='dark';
      }else{
        document.body.classList.remove('dark');
        doevent('change',['light']);
        n='light'
      }
    }else if(v=='d'){
      if(window.matchMedia){
        if(_g==3){
          _g=true;
          listenTheme();
        }else{
          _g=true;
        }
      }else{
        toast('你的浏览器不支持此功能')
      }
    }
  }
  function listenTheme(){
    var d=window.matchMedia('(prefers-color-scheme: dark)');
    d.matches?document.body.classList.add('dark'):document.body.classList.remove('dark');
    d.addEventListener('change', e => {
      if(e.matches){
        document.body.classList.add('dark');
        doevent('change',['dark']);
        n='dark';
      }else{
        document.body.classList.remove('dark');
        doevent('change',['light']);
        n='light'
      }
    });
  }

  checkTheme(initsto.get('theme'));

  function getTheme(){
    return n;
  }

  function addEventListener(e,f){
    if(!eventfn[e]){eventfn[e]=[]}
    eventfn[e].push(f);
  }

  function removeEventListener(e,f){
    if(!eventfn[e]){return}
    for(var i=0;i<eventfn[e].length;i++){
      if(eventfn[e][i]===f){
        eventfn[e].splice(i,1);
        return;
      }
    }
  }
  function doevent(e,d){
    if(eventfn[e]){
      for(var i=0;i<eventfn[e].length;i++){
        eventfn[e][i].apply(null,d);
      }
    }
  }

  return {
    setTheme:function(v){
      initsto.set('theme',v);
      checkTheme(v);
    },
    addEventListener,
    removeEventListener,
    getTheme,
  }
})();
  var addon=(function(){
  var eventfns={
    initdone:[]
  }
  var _isinitdone=false;
  var addon_dialog=new dialog({
    content:("<div class=\"actionbar\">\n  <h1>插件管理</h1><div class=\"closeBtn\">{{close-btn}}</div>\n</div>\n<ul class=\"addon-root\">\n  \n</ul>").replace('{{close-btn}}',util.getGoogleIcon('e5cd')),
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
    class:"addon-dialog"
  });

  var addon_dialog_d=addon_dialog.getDialogDom();
  util.query(addon_dialog_d,'.closeBtn').addEventListener('click',()=>{
    addon_dialog.close();
  });

  var addon_icon=new iconc.icon({
    offset:"tr",
    content:util.getGoogleIcon("e87b",{type:"fill"})
  });
  addon_icon.getIcon().onclick=function(){
    addon_dialog.open();
  }

  var initsto=storage('addon');
  if(!initsto.get('list')){
    initsto.set('list',{});
  }
  var initscripts=storage('addon_script');
  function installAddon(manifest_url,cb){
    if(!manifest_url||typeof manifest_url!='string'){
      return;
    }
    var l=initsto.get('list');
    for(var k in l){
      if(l[k].url==manifest_url){
        cb({
          code:1,
          msg:"该插件已经安装"
        });
        return;
      }
    }
    util.xhr(manifest_url,function(res){
      try{
        var manifest=JSON.parse(res);
      }catch(e){
        cb({
          code:-3,
          msg:'安装失败，无效的manifest'
        });
        return;
      }
      if(!manifest.url){
        cb({
          code:-2,
          msg:'安装失败，manifest中没有url字段'
        });
        return;
      }
      var addon_session=getSession();
      insertAddon(manifest_url,manifest,addon_session,function(code){
        if(code==0){
          cb({
            code:0,
            msg:'安装成功'
          });
        }else if(code==-1){
          cb({
            code:code,
            msg:'安装失败，脚本请求失败'
          })
        }
      });
    },function(){
      cb({
        code:-4,
        msg:'安装失败，manifest请求失败'
      });
    })
  }

  function uninstallAddon(session_id,cb){
    if(!initsto.get('list')[session_id]){
      cb({
        code:-1,
        msg:'卸载失败，未找到该插件'
      })
    }else{
      var l=initsto.get('list');
      delete l[session_id];
      initsto.set('list',l);
      initscripts.remove(session_id,true,function(){
        cb({
          code:0,
          msg:"卸载成功"
        });
      })
    }
  }

  function insertAddon(u,m,s,cb){
    util.xhr(m.url,function(res){
      var a=initsto.get('list');
      a[s.id]={
        url:u,
        manifest:m
      };
      initsto.set('list',a);
      initscripts.set(s.id,res,true,function(){
        cb(0);
        runAddon(s.id);
      });
    },function(){
      cb(-1)
    })
  }

  function runAddon(id){
    return new Promise(function(r,j){
      initscripts.get(id,true,function(res){
        var sc=document.createElement('script');
        sc.innerHTML=`!function(){
          quik.addonPush=function(fn){
            function Session(id){
              this.id=id;
              this.session_token="Hvm_session_token_eoi1j2j";
              this.isSession=true;
            }
            fn({
              session:new Session("${id}"),
            })
          };
          ${res};
        }()`;
        document.body.appendChild(sc);
        setTimeout(function(){
          r();
        })
      })
    })
    
  }

  function initAddon(){
    var n=[];
    initscripts.list().forEach(function(id){
      n.push(runAddon(id));//运行插件
    })
    Promise.all(n).finally(function(){
      _isinitdone=true;
      doevent('initdone',[]);
    })
  }
  initAddon();

  function getSession(){
    function Session(){
      this.id="ext_"+util.getRandomHashCache();
      this.session_token="Hvm_session_token_eoi1j2j";
      this.isSession=true;
    }
    return new Session();
  }

  function getAddonList(){
    return initsto.get('list');
  }


  function addEventListener(event,cb){
    if(eventfns[event]){
      eventfns[event].push(cb);
    }else{
      eventfns[event]=[cb];
    }
  }

  function doevent(event,data){
    eventfns[event].forEach(function(fn){
      fn.apply(null,data);
    });
  }
  function isinitdone(){
    return _isinitdone
  }
  
  return {
    installAddon,
    uninstallAddon,
    getAddonList,
    addEventListener,
    isinitdone
  }
})();;
  let {alert,confirm,prompt}=(function(){
  function alert(text,cb){
    var d=new dialog({
      content:`<div class="def_dialog">
      <h1>提示</h1>
      <div class="content"></div>
      <div class="footer">
        <button class="ok btn">确定</button>
      </div>
    </div>`
    });
    setTimeout(function(){d.open()},10)
    var dd=d.getDialogDom();
    util.query(dd,'.content').innerText=text;
    util.query(dd,'.ok').onclick=function(){
      cb();
      d.close();
      setTimeout(function(){d.destory()},299);
    }
  }
  function confirm(text,cb){
    var d=new dialog({
      content:`<div class="def_dialog">
      <h1>提示</h1>
      <div class="content"></div>
      <div class="footer">
        <button class="cancel btn">取消</button>
        <button class="ok btn">确定</button>
      </div>
    </div>`
    });
    setTimeout(function(){d.open()},10)
    var dd=d.getDialogDom();
    util.query(dd,'.content').innerText=text;
    util.query(dd,'.ok').onclick=function(){
      cb(true);
      d.close();
      setTimeout(function(){d.destory()},299);
    }
    util.query(dd,'.cancel').onclick=function(){
      cb(false);
      d.close();
      setTimeout(function(){d.destory()},299);
    }
  }
  function prompt(text,cb){
    var d=new dialog({
      content:`<div class="def_dialog">
      <h1>提示</h1>
      <div class="content">
        <p class="c"></p>
        <p><input type="text"/></p>
      </div>
      <div class="footer">
        <button class="cancel btn">取消</button>
        <button class="ok btn">确定</button>
      </div>
    </div>`
    });
    setTimeout(function(){d.open()},10)
    var dd=d.getDialogDom();
    util.query(dd,'.content .c').innerText=text;
    util.query(dd,'.ok').onclick=function(){
      cb(util.query(dd,'.content input').value);
      d.close();
      setTimeout(function(){d.destory()},299);
    }
    util.query(dd,'.cancel').onclick=function(){
      cb('');
      d.close();
      setTimeout(function(){d.destory()},299);
    }
  }

  return{
    alert,
    confirm,
    prompt
  }
})();;

  window.quik={
    addon,
    storage,
    omnibox,
    util,
    link,
    dialog,
    toast,
    says,
    menu,
    iconc,
    background,
    mainmenu,
    Setting,
    SettingGroup,
    SettingItem,
    mainSetting,
    notice,
    tyGroup,
    alert,
    confirm,
    prompt,
    theme
  }
  document.querySelector("main").style.display='';
})();