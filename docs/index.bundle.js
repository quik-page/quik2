(function(){
  function showOpenFilePicker(){
    return new Promise(function(resolve,reject){
      var inp=document.createElement('input');
      inp.type='file';
      document.body.append(inp);
      inp.style.display='none';
      inp.click();
      inp.onchange=function(){
        resolve(inp.files);
        inp.remove();
      }
    })
  }

  // (function(){
  //   function bodyResizer(){
  //     document.body.style.width=window.innerWidth+'px';
  //     document.body.style.height=window.innerHeight+'px';
  //   }
  //   window.addEventListener('resize',bodyResizer);
  //   bodyResizer();
  // })()
  

  var getEventHandle=(function(){
  var events=[];
  function getEventHandle(){
    var ev_i=events.length;
    events.push({});
    return {
      addEventListener:function(ev,fn){
        if(!events[ev_i][ev]) events[ev_i][ev]=[];
        events[ev_i][ev].push(fn);
        return true;
      },
      removeEventListener:function(ev,fn){
        if(!events[ev_i][ev]) return false;
        for(var i=0;i<events[ev_i][ev].length;i++){
          if(events[ev_i][ev][i]===fn){
            events[ev_i][ev].splice(i,1);
            return true;
          }
        }
        return false;
      },
      doevent:function(ev,args){
        if(!events[ev_i][ev]) return false;
        for(var i=0;i<events[ev_i][ev].length;i++){
          events[ev_i][ev][i].apply(null,args);
        }
        return true;
      }
    }
  }
  return getEventHandle; 
})();;
  var util=(function(){
  return {
    initSet:function(sto,key,ob){
      var o=sto.get(key);
      if(typeof o=='object'&&o){
        for(var k in ob){
          if(!o[k]){
            o[k]=ob[k];
          }
        }
        sto.set(key,o);
      }else{
        sto.set(key,ob);
      }
    },
    joinObj:function(){
      var obs=arguments;
      var n=obs[0];
      function jt(a,b){
        for(var k in b){
          a[k]=b[k];
        }
        return a;
      }
      for(var i=1;i<obs.length;i++){
        n=jt(n,obs[i]);
      }
      return n;
    },
    loadimg:function (url,cb){
      var img=new Image();
      img.src=url;
      img.onload=function(){
        cb(true);
      }
      img.onerror=function(){
        cb(false);
      }
    },
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
    getFavicon:function(url,cb){
      try{
        var u=new URL(url);
      }catch(e){
        cb(false);
        return;
      }
        var _ic='https://api.xinac.net/icon/?url='+u.origin;
        if(u.hostname.indexOf('bing.com')!=-1){
          _ic='https://bing.com/favicon.ico';
        }
        this.loadimg(_ic,function(st){
          if(st){
            cb(_ic);
          }else{
            cb(false)
          }
        });
      
      
      // 删除多余代码，统一体验
    },
    createIcon:function(t){
      var canvas=document.createElement('canvas');
      canvas.width=64;
      canvas.height=64;
      var ctx=canvas.getContext('2d');
      ctx.fillStyle=this.getRandomColor();
      ctx.font='bold 32px Arial';
      ctx.fillText(t,20,40);
      return canvas.toDataURL();
    },
    getRandomColor:function(){
      return '#'+Math.random().toString(16).substring(2,8).toUpperCase();
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
      },time?time:2000);
    }
  }
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
   * @param {Boolean} options.important?
   * @param {String} options.class?
   * @param {Number} options.width?
   * @param {'tl'|'tr'|'bl'|'br'} options.offset
   */
  var icon=function(options){
    this.content=options.content;
    this.width=options.width;
    var ic=util.element('div',{
      class:"item"+(options.class?(' '+options.class):'')+(options.important?' important':''),
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
      this.element.classList.remove('hide');
      this.element.classList.add('show');
    },
    hide:function(){
      this.element.classList.add('hide');
      this.element.classList.remove('show');
    }
  }
  return {
    icon:icon,
  }
})();
  var {storage,getStorageList,getAllStorage,dbTool}=(function(){
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

  var jl={};

  var f=function(ck,details){
    if(typeof ck==='string'){
      if(!JSON.parse(localStorage.getItem("quik2"))[ck]){
        setAll({});
      }
      jl[ck]=details;
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
        list:list,
        getAll:function(){
          return getAll()[ck];
        },
        clear:function(){
          var a=getAll()[ck];
          for(var k in a){
            var b=k[a];
            if(typeof b=='string'&&b.startsWith('^')){
              filerecv.delete(b);
            }
          }
          setAll({});
        }
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
  return {
    storage:f,
    getStorageList:function(){
      return jl;
    },
    getAllStorage:function(){
      return JSON.parse(localStorage.getItem("quik2"));
    },
    dbTool:filerecv
  };
})();;
  var dialog=(function(){
  var allDialog=[],d_index=1,idmax=0;

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
    util.query(document,'.dialogs').append(dialogF);
    var dialogC=util.query(dialogF,'.d-c');
    if(options.class){
      dialogC.classList.add(options.class);
    }
    if(options.mobileShowtype==1){
      dialogF.classList.add('mobile-show-full');
    }
    this.element=dialogF;
    this.id=idmax;
    idmax++;
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
      this.element.style.zIndex=d_index;
      d_index++;
      this.closed=false;
      if(this.onopen){
        this.onopen();
      }
      util.query(this.element,'img[data-src]',true).forEach(function(lazyimg){
        lazyimg.src=lazyimg.getAttribute('data-src');
        lazyimg.removeAttribute('data-src');
      })
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
      el.style.top="";
      el.style.left="";
      el.style.bottom="";
      el.style.right="";
      if(options.offset){
        if(typeof options.offset.top=='number'){
          el.style.top=options.offset.top+"px";
        }else{
          el.style.bottom=options.offset.bottom+"px";
        }
        if(typeof options.offset.left=='number'){
          el.style.left=options.offset.left+"px";
        }else{
          el.style.right=options.offset.right+"px";
        }
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
  var mainmenu=(function(){
  var mainmenu_icon=new iconc.icon({
    class:"main_menu",
    content:util.getGoogleIcon('e5d2'),
    offset:"tr"
  });

  var mainmenulist_top=[];
  var mainmenulist_bottom=[];

  var main_menu=new menu({
    list:[],
    offset:{
      top:40,
      right:15
    }
  });

  function glist(){
    main_menu.setList(mainmenulist_top.concat(mainmenulist_bottom));
  }

  mainmenu_icon.getIcon().onclick=function(e){
    e.stopPropagation();
    main_menu.show();
  }
  var MAIN_MENU_TOP=0;
  var MAIN_MENU_BOTTOM=1;

  function pushMenu(a,b){
    if(b==MAIN_MENU_BOTTOM){
      mainmenulist_bottom.push(a);
    }else{
      mainmenulist_top.push(a);
    }
    glist();
  }


  return{
    pushMenu,
    MAIN_MENU_BOTTOM,
    MAIN_MENU_TOP
  }
})();;
  var setting=(function(){
  
  var Setting=(function () {
  function Setting(details) {
    this.title = details.title;
    this.dialog = new dialog({
      content: `<div class="actionbar"><h1>设置</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div></div><ul class="setting-root"></ul>`,
      class: "setting_dia",
      mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN
    });
    this.dialogDom = this.dialog.getDialogDom();
    util.query(this.dialogDom, '.closeBtn').addEventListener('click', () => {
      this.dialog.close();
    });
    util.query(this.dialogDom, '.actionbar h1').innerText = this.title;
    this.groups = [];
    this._events = {
      change: []
    }
  }

  Setting.prototype = {
    addNewGroup: function (group) {
      this.groups.push(group);
      var _ = this;
      group.on('change', function (dt, _this) {
        _._dochange({
          type: dt.type,
          details: dt.details,
          id: dt.id
        })
        if (dt.type == 'it') {
          _._dochangeGroup(_this, dt.details);
        } else if (dt.type == 'add') {
          _._drawItem(_this, _this.items[_this.items.length - 1])
        } else if (dt.type == 'change') {
          if(dt.details.attr=='reinit'){
            _._reinitItem(_this, _this.items.find(item => item.id == dt.id), dt.details);
          }else if(dt.details.attr=='reget'){
            _._regetItem( _this.items.find(item => item.id == dt.id), dt.details);
          }else{
            _._dochangeItem(_this, _this.items.find(item => item.id == dt.id), dt.details);
          }
        }
      })
      _._dochange({
        type: "addgroup",
      })
      _._drawGroup(group);
    },
    setTitle: function (title) {
      this.title = title;
      util.query(this.dialogDom, '.actionbar h1').innerText = title;
      _._dochange({
        type: "changetitle",
        title: title
      })
    },
    open: function () {
      this.dialog.open()
    },
    close: function () {
      this.dialog.close();
    },
    on: function (event, callback) {
      if (this._events[event]) {
        this._events[event].push(callback);
      }
    },
    _dochange: function (dt) {
      var _ = this;
      this._events.change.forEach(function (callback) {
        callback(dt, _);
      });
    },
    _drawGroup: function (group) {
      var _=this;
      var groupEle = util.element('li', {
        class: 'setting-group',
        'data-index': group.index,
        'data-id': group.id
      });
      groupEle.innerHTML = `<div class="setting-group-title"></div><ul class="setting-tree"></ul>`;
      var sr = util.query(this.dialogDom, '.setting-root');
      var srls = sr.children;
      var q = true;
      for (var i = 0; i < srls.length; i++) {
        if (parseInt(srls[i].getAttribute('data-index')) > group.index) {
          sr.insertBefore(groupEle, srls[i]);
          q = false;
          break;
        }
      }
      if (q) sr.appendChild(groupEle);
      util.query(groupEle, '.setting-group-title').innerText = group.title;
      group.items.forEach(function(item){
        _._drawItem(group,item);
      })
    },
    _drawItem: function (group, item) {
      var itemEle = util.element('li', {
        class: 'setting-item',
        'data-index': item.index,
        'data-id': item.id
      });
      itemEle.innerHTML = `<div class="setting-item-left"><div class="setting-item-title"></div><div class="setting-item-message"></div></div><div class="setting-item-right"></div>`;
      var sr = util.query(this.dialogDom, '.setting-group[data-id=' + group.id + '] .setting-tree');
      var srls = sr.children;
      var q = true;
      for (var i = 0; i < srls.length; i++) {
        if (parseInt(srls[i].getAttribute('data-index')) > item.index) {
          sr.insertBefore(itemEle, srls[i]);
          q = false;
          break;
        }
      }
      if (q) sr.appendChild(itemEle);
      util.query(itemEle, '.setting-item-title').innerText = item.title;
      if(item.message){
        util.query(itemEle, '.setting-item-message').innerText = item.message;
      }else{
        itemEle.classList.add('no-message');
      }
      var elr = util.query(itemEle, '.setting-item-right');
      var cb = function () { }
      var types = {
        string: function () {
          elr.innerHTML = `<input type="text" class="setting-item-input">`;
          cb = function (v) {
            util.query(elr, '.setting-item-input').value = v;
          }
        },
        number: function () {
          elr.innerHTML = `<input type="number" class="setting-item-input">`;
          cb = function (v) {
            util.query(elr, '.setting-item-input').value = v;
          }
        },
        boolean: function () {
          elr.innerHTML = `<div class="check-box"><div class="check-box-inner"></div><input type="checkbox" class="setting-item-input"></div>`;
          cb = function (v) {
            util.query(elr, '.setting-item-input').checked = v;
            if (v) {
              util.query(elr, '.check-box').classList.add('checked');
            }
            util.query(elr, '.check-box').addEventListener('click', function () {
              util.query(elr, '.setting-item-input').click();
              if (util.query(elr, '.setting-item-input').checked) {
                this.classList.add('checked');
              } else {
                this.classList.remove('checked');
              }
            })
          }
        },
        range: function () {
          elr.innerHTML = `<input type="range" class="setting-item-input">`;
          cb = function (v) {
            util.query(elr, '.setting-item-input').value = v;
          }
          var l = item.init()
          if (l instanceof Promise) {
            l.then(_init)
          } else {
            _init(l);
          }
          function _init(inited) {
            util.query(elr, '.setting-item-input').max = inited[1];
            util.query(elr, '.setting-item-input').min = inited[0];
          }
        },
        select: function () {
          elr.innerHTML = `<select class="setting-item-input"></select>`;
          var guaqi;
          cb = function (v) {
            guaqi = v;
          }
          var l = item.init()
          if (l instanceof Promise) {
            l.then(_init)
          } else {
            _init(l);
          }
          function _init(inited) {
            util.query(elr, '.setting-item-input').innerHTML = (() => {
              var html = '';
              for (var k in inited) {
                html += `<option value="${k}">${inited[k]}</option>`;
              }
              return html;
            })();
            cb = function (v) {
              util.query(elr, '.setting-item-input').value = v;
            }
            if (guaqi) cb(guaqi);
          }
        },
        'null': function () {
          elr.innerHTML = `<div class="setting-item-input null-click">${util.getGoogleIcon('e5e1')}</div>`;
          itemEle.classList.add('just-callback-item');
          itemEle.onclick = function () {
            item.callback();
          }
        }
      }
      types[item.type]();
      function getacb() {
        if (item.type == 'null') return;
        var l = item.get();
        if (l instanceof Promise) {
          l.then(cb);
        } else {
          cb(l);
        }
      }
      getacb();
      item.getacb=getacb;
      util.query(elr, '.setting-item-input').addEventListener((() => {
        if (item.type == 'range') {
          return 'input'
        } else if (item.type == 'null') {
          return 'click'
        } else {
          return 'change'
        }
      })(), function (e) {
        if (this.classList.contains('null-click')) return;
        var v;
        if (this.type == 'checkbox') {
          v = this.checked;
        } else {
          v = this.value;
        }
        //@note 判断check方法是否存在，check是可选参数
        //@edit at 2023/1/30 15:12
        if (typeof item.check == 'function') {
          if (item.check(v)) {
            item.callback(v)
          } else {
            getacb();
          }
        } else {
          item.callback(v);
        }

      });
    },
    _dochangeGroup: function (group, dt) {
      var g = util.query(this.dialogDom, '.setting-group[data-id=' + group.id + ']');
      if (dt.attr == 'title') {
        util.query(g, '.setting-group-title').innerText = dt.content;
      } else if (dt.attr == 'index') {
        g.setAttribute('data-index', dt.content);
        var sr = util.query(this.dialogDom, '.setting-root');
        var srls = sr.children;
        var q = true;
        for (var i = 0; i < srls.length; i++) {
          if (srls[i].isSameNode(g)) continue;
          if (parseInt(srls[i].getAttribute('data-index')) > dt.content) {
            sr.insertBefore(g, srls[i]);
            q = false
            break;
          }
        }
        if (q) sr.appendChild(g);
      } else if (dt.attr == 'show') {
        g.style.display = dt.content ? 'block' : 'none';
      }
    },
    _dochangeItem: function (group, item, dt) {
      var g = util.query(this.dialogDom, '.setting-group[data-id=' + group.id + '] .setting-item[data-id=' + item.id + ']');
      if (dt.attr == 'title') {
        util.query(g, '.setting-group-title').innerText = dt.content;
      } else if (dt.attr == 'message') {
        if(dt.content){
          util.query(g, '.setting-item-message').innerText = dt.content;
          g.classList.remove('no-message');
        }else{
          g.classList.add('no-message');
        }
      } else if (dt.attr == 'index') {
        g.setAttribute('data-index', dt.content);
        var sr = util.query(this.dialogDom, '.setting-group[data-id=' + group.id + '] .setting-tree');
        var srls = sr.children;
        var q = true;
        for (var i = 0; i < srls.length; i++) {
          if (srls[i].isSameNode(g)) continue;
          if (parseInt(srls[i].getAttribute('data-index')) > dt.content) {
            sr.insertBefore(g, srls[i]);
            q = false
            break;
          }
        }
        if (q) sr.appendChild(g);
      } else if (dt.attr == 'show') {
        g.style.display = dt.content ? 'block' : 'none';
      }
    },
    _reinitItem: function (group, item) {
      var _init;
      var itemEle = util.query(this.dialogDom, '.setting-group[data-id=' + group.id + '] .setting-item[data-id=' + item.id + ']');
      var elr = util.query(itemEle, '.setting-item-right')
      if (item.type == 'range') {
        _init = function (inited) {
          util.query(elr, '.setting-item-input').max = inited[1];
          util.query(elr, '.setting-item-input').min = inited[0];
        }
      } else if (item.type == 'select') {
        _init = function (inited) {
          util.query(elr, '.setting-item-input').innerHTML = (() => {
            var html = '';
            for (var k in inited) {
              html += `<option value="${k}">${inited[k]}</option>`;
            }
            return html;
          })();
          cb = function (v) {
            util.query(elr, '.setting-item-input').value = v;
          }
          if (guaqi) cb(guaqi);
        }
      } else {
        return;
      }
      var l = item.init()
      if (l instanceof Promise) {
        l.then(_init)
      } else {
        _init(l);
      }
    },
    _regetItem: function (item) {
      item.getacb();
    }
  }

  return Setting;
})();;
  var SettingGroup=(function(){
  var idmax=0;
function SettingGroup(details){
  this.title=details.title;
  this.index=details.index;
  if(this.index<0) this.index=0
  this.items=[];
  this.id='seg_'+idmax;
  idmax++;
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
  var idmax=0;
function SettingItem(details){
  this.title=details.title;
  this.index=details.index;
  this.type=details.type;
  this.init=details.init;
  this.check=details.check;
  this.callback=details.callback;
  this.message=details.message;
  this.get=details.get;
  this._show=true;
  this.id='sei_'+idmax;
  idmax++;
  this._events={
    change:[]
  }
}

SettingItem.prototype={
  reInit:function(){
    this._dochange({
      attr:"reinit"
    })
  },
  reGet:function(){
    this._dochange({
      attr:"reget"
    })
  },
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
    this._show=true;
    this._dochange({
      attr:"show",
      content:true
    })
  },
  hide:function(){
    this._show=false;
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
  mainmenu.pushMenu({
    icon:util.getGoogleIcon('e8b8',{type:"fill"}),
    title:'主设置',
    click:function(){
      mainSetting.open();
    }
  },mainmenu.MAIN_MENU_TOP)
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
  var {addEventListener,removeEventListener,doevent}=getEventHandle();
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
  

  var initsto=storage('omnibox',{
    sync:true,
    title:"搜索框",
    desc:"搜索框相关设置"
  });
  if(initsto.get('autofocus')==undefined){
    initsto.set('autofocus',false);
  }
  if(initsto.get('justsearch')==undefined){
    initsto.set('justsearch',false);
  }
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
    doevent('beforeenter',[text])
    getType(text).enter(text);
    doevent('afterenter',[text])
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

  var initsto=storage('search',{
    sync:true,
    title:"搜索引擎",
    desc:"搜索引擎配置",
    compare:function(ast,k,a){
      var o=getSearchTypeList();
      for(var k in a.typelist){
        o[k]=a.typelist[k];
      }
      a.typelist=o;
      ast[k]=a;
    }
  });
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
    initsto:initsto,
    setJustSearch:function(value){
      initsto.set('justsearch',value);
      si.reGet();
    }
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

  searchbox.innerHTML="<div class=\"box\"><div class=\"icon\"></div><div class=\"input\"><input type=\"text\" placeholder=\"搜索或输入网址\"></div><div class=\"submit\"></div></div><ul class=\"sas\"></ul>";
  searchbox.addEventListener('click',function(e){
    e.stopPropagation();
  })

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

  // ...
  input.addEventListener('focus',function(){
    searchcover.classList.add('active');
    searchbox.classList.add('active');
    doevent('focus',[input]);
  });

  // ...
  input.addEventListener('blur',function(){
    this.classList.remove('active');
    doevent('blur',[input]);
  });
  document.addEventListener('click',function(){
    searchcover.classList.remove('active');
    searchbox.classList.remove('active');
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
  if(core.initsto.get('autofocus')==undefined){
    core.initsto.set('autofocus',false);
  }

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
      core.initsto.set('autofocus',value);
      si.reGet();
    }
  }
})();

  core.addNewSA({
    check:function(text){
        return text[0]=='='
    },
    get:function(text,getsa){
      var a=getsa();
      try{
          text=text.substr(1);
          if(!text) return;
          var e=Math.E;
          var PI=Math.PI;
          var ln=Math.log;
          var lg=Math.log10;
          var sin=Math.sin;
          var cos=Math.cos;
          var tan=Math.tan;
          var asin=Math.asin;
          var acos=Math.acos;
          var atan=Math.atan;
          var sqrt=Math.sqrt;
          var abs=Math.abs;
          text=text.replaceAll('^','**')
          .replaceAll('π','PI')
          .replaceAll('[','(')
          .replaceAll(']',')')
          .replaceAll('{','(')
          .replaceAll('}',')');
          var result=eval(text);
          a.unshift({
              icon:util.getGoogleIcon('ea5f'),
              text:result,
              click:function(){
                  ui.setValue(result);
              }
          });
      }catch(e){}
      
      r(a);
    }
  });;
  var _t_re;
core.addNewSA({
    check:function(text){
        return checkLang(text);
    },
    get:function(text,getsa){
      return new Promise(function(r,j){
        _t_re=util.xhr('https://api.gumengya.com/Api/Translate?text='+encodeURI(text)+'&from=auto&to=zh',function(res){
            var a=getsa();    
            var o=JSON.parse(res);
            if(o.code==200){
                var a=getsa();
                var result=o.data.result;
                a.unshift({
                    icon:util.getGoogleIcon('e8e2'),
                    text:result,
                    click:function(){
                        ui.setValue(result);
                    }
                })
            }else{
                console.log('Translate API Err:',o);
            }
            r(a);
            
        },function(err){
            console.log('Translate API Err:',err);
        })
      })
    },
    interrupt:function(){
        if(_t_re){
            _t_re.abort();
        }
    }
  });

function checkLang(text){
    var l=text.length
    var y=text.match(/[a-zA-Z\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FFйцукенгшщзхъфывапролджэячсмитьбюёàâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ\u0530-\u1CDF]/g);
    return y?y.length/l>0.5:!1;
};

  return{
    value:ui.setValue,
    focus:ui.focus,
    blur:ui.blur,
    isblur:ui.isblur,
    addNewSug:core.addNewSA,
    addEventListener,
    removeEventListener,
    getSearchType:core.searchUtil.getSearchType,
    getSearchTypeList:core.searchUtil.getSearchTypeList,
    getSearchTypeIndex:core.searchUtil.getSearchTypeIndex,
    setSearchType:core.searchUtil.setSearchType,
    setSearchList:core.searchUtil.setSearchList,
    search:{
      addEventListener:core.searchUtil.addEventListener
    },
    sg,
    setAutoFocus:ui.setAutoFocus,
    setJustSearch:ui.setJustSearch
  }
})();
  var link=(function () {
  var initsto = storage('link', {
  sync: true,
  title:"链接",
  desc:"QUIK起始页链接数据",
  get:async function(){
    var a=initsto.getAll();
    var sm=a['storage-mode'];
    if(sm=='db'){
      a.links=await localforage.getItem(a.links);
      a.cate=await localforage.getItem(a.cate);
    }
    delete a['storage-mode'];
    return a;
  },
  rewrite:function(ast,k,a){
    return new Promise(function(r){
      a['storage-mode']=initsto.get('storage-mode');
      if(initsto.get('storage-mode')=='db'){
        initsto.remove('links',true,function(){
          dbTool.set(a.links,function(hash){
            a.links=hash;
            initsto.remove('cate',true,function(){
              dbTool.set(a.cate,function(hash){
                a.cate=hash;
                ast[k]=a;
                r();
              });
            });
          });
         
        })
      }else{
        ast[k]=a;
      }
    })
    
  },
  compare:function(ast,km,a){
    return new Promise(function(r){
      a['storage-mode']=initsto.get('storage-mode');
      if(a['storage-mode']=='db'){
        initsto.get('links',true,function(old){
          initsto.remove('links',true,function(){
            a.links=compareLinks(old,a.links);
            dbTool.set(a.links,function(hash){
              a.links=hash;
              dbTool.get(ast[km].cate,function(ocate){
                console.log(ocate);
                dbTool.delete(ast[km].cate,function(){
                  var d=ocate;
                  for(var k in a.cate){
                    d[k]=compareLinks(d[k],a.cate[k]);
                  }
                  a.cate=d;
                  dbTool.set(a.cate,function(hash){
                    a.cate=hash;
                    ast[km]=a;
                    r();
                  });
                });
              });
            });
          });
          
        })
      }else{
        a.links=compareLinks(initsto.get('links'),a.links);
        var d=initsto.get('cate');
        for(var k in a.cate){
          d[k]=compareLinks(d[k],a.cate[k]);
        }
        a.cate=d;
        ast[km]=a;
      }
    })
  }
});

/**
 * 
 * @param {Array} a 
 * @param {Array} b 
 */
function compareLinks(a,b){
  if(!a){
    return b;
  }
  if(!b){
    return a;
  }
  for(var i=0;i<a.length;i++){
    if(!b.find(function(v){
      return v.title==a[i].title&&v.url==a[i].url;
    })){
      b.push(a[i]);
    }
  }
  return b;
}

function compareCates(a,b){
  for(var k in a){
    if(b[k]){
      b[k]=compareLinks(a[k],b[k]);
    }else{
      b[k]=a[k];
    }
  }
  return b;
}

var eventfns = {
  change: []
};
function pushLink(detail, ob) {
  var link = {
    title: detail.title,
    url: detail.url
  }
  if (typeof detail.index == 'number' && detail.index >= 0) {
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
  if (typeof detail.index == 'number' && detail.index >= 0) {
    if (detail.index >= ob.length) {
      console.warn('修改链接时，index超出范围，应在0-' + (ob.length - 1) + '之间');
    } else {
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
    console.log(initsto.get('links'),initsto.get('cate'));
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
        console.log(Object.keys(c),initsto.get('cate'));
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
  var ui=(function(){
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
    linkF.innerHTML="<div class=\"cate-bar\"><div class=\"cate-bar-controls\"><div class=\"cate-left-btn\">{{cate-left}}</div></div><div class=\"cate-bar-scrolls\"><div class=\"cate-bar-items\"><div class=\"cate-item mr active\">默认</div></div></div><div class=\"cate-bar-controls r\"><div class=\"cate-right-btn\">{{cate-right}}</div><div class=\"cate-add-btn\">{{cate-add}}</div></div></div><ul class=\"link-list\"></ul>".replace('{{cate-left}}',util.getGoogleIcon('e314')).replace('{{cate-right}}',util.getGoogleIcon('e315')).replace('{{cate-add}}',util.getGoogleIcon('e145'))
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
        content:"<form><h1></h1><div class=\"content\"><p>URL ：<input class=\"link-add-url\" type=\"text\" required placeholder=\"链接地址(必填)\"></p><p>标题：<input class=\"link-add-title\" type=\"text\" required placeholder=\"链接标题(必填)\"></p><p>位置：<input class=\"link-add-index\" type=\"number\" min=\"0\" placeholder=\"链接位置\"></p></div><div class=\"footer\"><div class=\"cancel btn\">取消</div><button class=\"ok btn\"></button></div></form>",
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
          },function(){
            toast.show('添加成功')
          })
          linkaddDialog.close();
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
        content:"<form><h1></h1><div class=\"content\"><p>标题：<input class=\"cate-name\" type=\"text\" required placeholder=\"分组标题(必填)\"></p></div><div class=\"footer\"><div class=\"cancel btn\">取消</div><button class=\"ok btn\">确定</button></div></form>",
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
    initsto.set('enabledCate',true);
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
  
})();;
  return util.joinObj(link,ui);
})();;
  var says=(function(){
  var initsto=storage('says',{
    sync:true,
    title:"一言",
    desc:"QUIK起始页一言相关配置",
    get:async function(){
      var a=initsto.getAll();
      var ra=quik.addon.getAddonBySessionId(a.saytype);
      if(ra){
        a.requireAddon=ra.url;
      }
      return a;
    },
    rewrite:function(ast,k,a){
      return new Promise(function(resolve, reject){
        if(a.requireAddon){
          var raddon=quik.addon.getAddonByUrl(a.requireAddon);
          if(raddon){
            a.saytype=raddon.session.id;
            ast[k]=a;
            resolve();
          }else{
            confirm('该一言数据需要安装插件以同步，是否安装？',function(v){
              if(v){
                quik.addon.installAddon(a.requireAddon).then(function(_addon){
                  a.saytype=_addon.session.id;
                  ast[k]=a;
                  resolve();
                }).catch(function(code){
                  if(code==0){
                    alert('插件取消安装，同步取消',function(){
                      resolve();
                    })
                  }else{
                    alert('插件安装失败，同步取消',function(){
                      resolve();
                    })
                  }
                });
              }else{
                alert('已取消一言同步',function(){
                  resolve();
                })
              }
            })
          }
        }else{
          ast[k]=a;
          resolve();
        }
      })
    }
  });

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
  function _addSayType(details){
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

  _addSayType((function(){
  if(!initsto.get('usersay')){
    initsto.set('usersay',def);
  }

  var sayseditordialog=null;
  function openSaysEditor(){
    if(!sayseditordialog){
      sayseditordialog=new dialog({
        class:"sayseditordialog",
        content:`<h1>修改一言</h1><div class="content"><p><input class="says-input" type="text"/></p></div><div class="footer"><div class="cancel btn">取消</div><button class="ok btn">确定</button></div>`
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
        refsay('user');
        sayseditordialog.close();
      }
    }
    setTimeout(function(){
      var d=sayseditordialog.getDialogDom();
      sayseditordialog.open();
      util.query(d,'.says-input').value=initsto.get('usersay');
    })
  }
  return {
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
  }
})());
  _addSayType((function(){
  var hitokoto={
    load:function(fn){
      var i_=0;
      function g(){
        util.xhr('https://tenapi.cn/v2/yiyan?format=json',function(res){
          fn(JSON.parse(res).data);
        },function(){
          i_++;
          if(i_<=5)g();
        })
      }
      g();
    },
    cats:{
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

  return {
    key:"hitokoto",
    name:"随机一言",
    callback:function(){
      return new Promise(function(resolve,reject){
        hitokoto.load(function(res){
          resolve({
            say:res.hitokoto,
            from:res.source,
            uuid:res.id,
            cat:res.cat,
            from_who:res.author,
            title:"该一言来自"+res.source+"，由"+res.author+"上传"
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
        var c=hitokoto.cats[nowSay.cat];
        openSayDetailsDialog({
          'API':"Ten·API（tenapi.cn） | Hitokoto (hitokoto.cn)",
          '内容':nowSay.say,
          '来源':nowSay.from,
          '上传者':nowSay.from_who,
          '分类':c?c:'未知',
          'UUID':nowSay.uuid
        })
      }
    }]
  }
})());
  _addSayType((function(){
  var jinrishicisto=storage('jrsc');
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
    var key=jinrishicisto.get(tokenStorageKey);
    if(key){
      return request(callback,"https://v2.jinrishici.com/one.json?client=browser-sdk/1.2&X-User-Token="+encodeURIComponent(key))
    }else{
      return request(function(res){
        initsto.set(tokenStorageKey,res.token);
        callback(res);
      },"https://v2.jinrishici.com/one.json?client=browser-sdk/1.2")
    }
  }
  return {
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
      title:'诗词详情',
      click:function(){
        openSayDetailsDialog({
          'API':"今日诗词（jinrishici.com）",
          '内容':nowSay.say,
          '作者':nowSay.author,
          '标题':nowSay.p_title,
          '全部内容':nowSay.content
        })
      }
    }]
  }
})());

  function addSayType(details){
    if(util.checkSession(details.session)){
      throw "错误的session";
    }
    details.key=details.session.id;
    _addSayType(details)
    typesi.reInit();
  }

  function setSayType(key,cb){
    if(util.checkSession(key)){
      key=key.id;
    }
    if(!sayTypes[key]){
      throw 'type不存在 type:'+key;
    }

    initsto.set('saytype',key);
    sayMenu.setList(sayTypes[key].menu);
    sayI.onclick=sayTypes[key].click

    refsay(key,cb);
    typesi.reGet();
  }

  function refsay(key,cb){
    if(util.checkSession(key)){
      key=key.id;
    }
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

  if(!initsto.get('saytype')){
    initsto.set('saytype','user');
  }

  
  if(initsto.get('enabled')==undefined){
    initsto.set('enabled',true);
  }
  

  var sg=new SettingGroup({
    title:"一言",
    index:3
  });
  var typesi=new SettingItem({
    title:"一言类型",
    type:'select',
    index:1,
    message:"页面底部显示的一言类型",
    init:function(){
      var ks={};
      for(var k in sayTypes){
        ks[k]=sayTypes[k].name;
      }
      return ks;
    },
    callback:function(v){
      setSayType(v);
    },
    get:function(){
      return initsto.get('saytype');
    }
  })
  var showsi=new SettingItem({
    title:"显示一言",
    type:'boolean',
    message:"是否页面底部显示的一言",
    index:0,
    callback:function(v){
      initsto.set('enabled',v);
      if(v){
        setSayType(initsto.get('saytype'));
        sayF.style.display='';
        typesi.show();
      }else{
        sayF.style.display='none';
        typesi.hide();
      }
    },
    get:function(){
      return initsto.get('enabled');
    }
  })
  mainSetting.addNewGroup(sg);
  sg.addNewItem(typesi);
  sg.addNewItem(showsi);
  if(initsto.get('enabled')){
    setSayType(initsto.get('saytype'));
  }else{
    sayF.style.display='none';
    typesi.hide();
  }
  return {
    getNowSay,
    setSayType,
    addSayType
  }
})();;
  var background=(function () {
  var backgroundsg=new SettingGroup({
    title:"背景",
    index:3
  });

  var backgroundsi=new SettingItem({
    title:"背景设置",
    message:"点击设置背景",
    index:0,
    type:'null',
    callback:function(){
      bg_set_d.open();
    }
  })

  mainSetting.addNewGroup(backgroundsg);
  backgroundsg.addNewItem(backgroundsi);


  var eventHandle=getEventHandle();
  var addEventListener=eventHandle.addEventListener;
  var removeEventListener=eventHandle.removeEventListener;
  var doevent=eventHandle.doevent;
  var bgf = util.element('div', {
    class: "bgf"
  });
  util.query(document, 'body').appendChild(bgf);
  var initsto = storage('background',{
    sync:true,
    get:function(){
      return new Promise(function(resolve, reject) {
        var a=initsto.getAll();
        delete a.upload;
        debugger;
        if(a.bg.type!='default'){
          a.requireAddon=quik.addon.getAddonBySessionId(a.bg.type).url;
        }else{
          if(a.bg.data.type=='userbg'&&a.userbg.useidb){
            a.bg={
              type: "default",
              data: {
                type: "color",
                light: "#fff",
                dark: "#333"
              }
            }
          }
        }
        if(a.userbg&&a.userbg.useidb){
          delete a.userbg;
          alert('不支持同步用户上传的背景',function(){
            resolve(a);
          })
        }else{
          resolve(a);
        }
      });
    },
    rewrite:function(ast,k,a){
      return new Promise(function(resolve, reject){
        if(a.requireAddon){
          var raddon=quik.addon.getAddonByUrl(a.requireAddon);
          if(raddon){
            a.bg.type=raddon.session.id;
            ast[k]=a;
            resolve();
          }else{
            confirm('该背景数据需要安装插件以同步，是否安装？',function(v){
              if(v){
                quik.addon.installAddon(a.requireAddon).then(function(_addon){
                  a.bg.type=_addon.session.id;
                  ast[k]=a;
                  resolve();
                }).catch(function(code){
                  if(code==0){
                    alert('插件取消安装，同步取消',function(){
                      resolve();
                    })
                  }else{
                    alert('插件安装失败，同步取消',function(){
                      resolve();
                    })
                  }
                });
              }else{
                alert('已取消背景同步',function(){
                  resolve();
                })
              }
            })
          }
        }else{
          ast[k]=a;
          resolve();
        }
      })
      
    },
    title:"背景",
    desc:"QUIK起始页背景相关配置"
  });
  var tabindexCount=0;

  // 避免缓存（用于图片API）
  function urlnocache(url) {
    return url + (url.indexOf('?') > -1 ? '&' : '?') + 't=' + new Date().getTime();
  }

  // 背景设置对话框
  var bg_set_d = new dialog({
    content: `<div class="actionbar"><h1>背景设置</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div></div><div class="tab_con"></div><div class="scroll_con"></div>`,
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
  util.initSet(initsto,'bg', {
    type: "default",
    data: {
      type: "color",
      light: "#fff",
      dark: "#333"
    }
  });

  var defDrawer=(function(){
  var tab1,setbg,tab2,tab3;
  util.initSet(initsto,'usercolor',{
    dark:"#333333",
    light:'#ffffff'
  })
  util.initSet(initsto,'ivsetting',{
    mb:50,
    isbr:false,
    br:6,
    th:1
  })
  var acgbg=(function(){

  function ce(cb){
    var u='';
    if(window.innerWidth<=500){
      u='https://img.loliapi.cn/i/pe/img'+(parseInt(Math.random()*3095)+1)+'.webp'
    }else{
      u='https://img.loliapi.cn/i/pc/img'+(parseInt(Math.random()*696)+1)+'.webp'
    }
    util.loadimg(u,function(ok){
      if(ok){
        cb({
          url:u,
          candownload:true
        });
      }else{
        if(window.location.host=='siquan001.github.io'){
          return function(cb){
            util.xhr('https://stear.cn/api/quik.php?m=bg&key=sys81a1g519lsokh0e8&host=siquan001.github.io',function(r){
              r=JSON.parse(r);
              cb({
                url:r.url,
                candoanload:true
              });
            },function(){
              u="https://loliapi.com/acg/?_="+Date.now();
              util.loadimg(u,function(){
                cb({
                  url:u,
                  candoanload:false
                })
              })
            })
          }
        }else{
          u="https://loliapi.com/acg/?_="+Date.now();
          util.loadimg(u,function(){
            cb({
              url:u,
              candoanload:false
            })
          })
        }
        
        
      }
    })
  }
  
  return {
    getImg:ce
  }
})();;
  var fjbg=(function(){
  return {
    getImg:function(cb){
      var u='https://img.gumengya.com/api/fj/'+(parseInt(Math.random()*4000)+1)+'.jpg';
      util.loadimg(u,function(ok){
        if(ok){
          cb({
            url:u,
            candownload:true
          });
        }else{
          u="https://api.gumengya.com/Api/FjImg?format=image&_="+Date.now();
          util.loadimg(u,function(){
            cb({
              url:u,
              candoanload:false
            })
          })
          
        }
      })
    }
  }
})();;
  var neizhiImg=[
  {
    "thumbnail":"https://image.gumengya.com/thumbnails/06470348c93db185e44f8acd87c5b683.png",
    "img":"https://image.gumengya.cn/i/2023/10/13/65294cf55ef7d.png"
  },
  {
    "thumbnail":"https://image.gumengya.com/thumbnails/5e6200d4552394e722967ef96addd06a.png",
    "img":"https://image.gumengya.cn/i/2023/10/13/65294c34841b4.jpg"
  },
  {
    "thumbnail":"https://image.gumengya.com/thumbnails/7ee6991ee0f43be59c28d183597e0cca.png",
    "img":"https://image.gumengya.cn/i/2023/10/13/65294c30563b7.jpg"
  },
  {
    "thumbnail":"https://image.gumengya.com/thumbnails/ff674343879116e22e3cf713358f2cb5.png",
    "img":"https://image.gumengya.com/thumbnails/ff674343879116e22e3f713358f2cb5.png",
  },
  {
    "thumbnail":"https://image.gumengya.com/thumbnails/c9c187157ca050044a6589f230e8ddbf.png",
    "img":"https://image.gumengya.cn/i/2023/10/13/65294c2d8aae1.png"
  }
];

  var refreshApiIcon=new iconc.icon({
    content:util.getGoogleIcon('e86a'),
    offset:"br",
    important:true
  });
  var downloadIcon=new iconc.icon({
    content:util.getGoogleIcon('f090'),
    offset:"br"
  });
  downloadIcon.getIcon().onclick=function(){
    window.open(document.querySelector(".bgf img").src);
  }

  var infoIcon=new iconc.icon({
    content:util.getGoogleIcon('e88e'),
    offset:"br",
    important:true
  })
  infoIcon.getIcon().onclick=function(){
    window.open('https://bing.com/');
  }
  infoIcon.getIcon().title='去往必应首页';

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

  var {ImgOrVideoSi,checkBgCoverStyle}=(function(){
  var ImgOrVideoSi=new SettingItem({
    title:"背景图片/视频显示设置",
    message:"设置背景图片/视频显示的蒙版和模糊等",
    type:"null",
    callback:function(){
      ImgOrVideoSe.open();
    }
  });

  backgroundsg.addNewItem(ImgOrVideoSi);

  var ImgOrVideoSe=new Setting({
    title:"背景图片/视频显示设置",
  });

  var ivsg=new SettingGroup({
    title:"通用",
    index:0
  });

  var ivse_th=new SettingItem({
    title:"背景蒙版颜色主题",
    index:0,
    type:"select",
    init:function(){
      return {
        0:"跟随主题",
        1:"黑色",
        2:"白色"
      }
    },
    get:function(){
      return initsto.get('ivsetting').th||1;
    },
    callback:function(v){
      var o=initsto.get('ivsetting');
      o.th=parseInt(v);
      initsto.set('ivsetting',o);
      r();
    }
  })

  var ivse_mb=new SettingItem({
    title:"背景蒙版浓度",
    index:1,
    type:"range",
    init:function(){
      return [0,90]
    },
    get:function(){
      return initsto.get('ivsetting').mb;
    },
    callback:function(v){
      var o=initsto.get('ivsetting');
      o.mb=v;
      initsto.set('ivsetting',o);
      r();
    }
  })

  var ivse_isbr=new SettingItem({
    title:"背景模糊",
    message:"可能会影响性能",
    type:"boolean",
    index:2,
    get:function(){
      return initsto.get('ivsetting').isbr;
    },
    callback:function(v){
      if(v){
        ivse_br.show();
      }else{
        ivse_br.hide();
      }
      var o=initsto.get('ivsetting');
      o.isbr=v;
      initsto.set('ivsetting',o);
      r();
    }
  });
  

  var ivse_br=new SettingItem({
    title:"背景模糊程度",
    index:3,
    type:"range",
    init:function(){
      return [1,20]
    },
    get:function(){
      return initsto.get('ivsetting').br;
    },
    callback:function(v){
      var o=initsto.get('ivsetting');
      o.br=v;
      initsto.set('ivsetting',o);
      r();
    }
  });

  ImgOrVideoSe.addNewGroup(ivsg);
  ivsg.addNewItem(ivse_th);
  ivsg.addNewItem(ivse_mb);
  ivsg.addNewItem(ivse_isbr);
  ivsg.addNewItem(ivse_br);
  if(!initsto.get('ivsetting').isbr){
    ivse_br.hide();
  }

  function r(){
    // create Style
    if(!document.querySelector('.bgf .img-sp')&&!document.querySelector('.bgf .video-sp')) return;
    
    var o=initsto.get('ivsetting');
    var s=document.querySelector("#ivbgse");
    if(!s){
      s=document.createElement('style');
      s.id='ivbgse';
      document.head.append(s);
    }
    var h='';
    var b='';
    if(o.th==1){
      b='0,0,0';
      document.body.classList.add('t-dark')
    }else if(o.th==2){
      b='255,255,255'
      document.body.classList.remove('t-dark')
    }else if(o.th==0){
      if(document.body.classList.contains('dark')){
        document.body.classList.add('t-dark')
        b='0,0,0';
      }else{
        document.body.classList.remove('t-dark')
        b='255,255,255';
      }
    }
    h+='.img-sp .cover,.video-sp .cover{background-color:rgba('+b+','+(o.mb/100)+')}';
    if(o.isbr){
      h+='.img-sp .cover,.video-sp .cover{backdrop-filter:blur('+o.br+'px)}'
    }
    s.innerHTML=h;
  }

  r();
  return {ImgOrVideoSi,checkBgCoverStyle:r};
})();;

  // dot-timeb
  // @note 这里需要一个定时器用于api背景 时间的颜色
  var timeb=null;

  var draws={
    img:function(bgf,data){
      bgf.innerHTML='<div class="img-sp full"><div class="cover"></div><img src="'+data.url+'"/></div>';
      checkBgCoverStyle();
      ImgOrVideoSi.show();
    },
    video:function(bgf,data){
      bgf.innerHTML='<div class="video-sp full"><div class="cover"></div><video src="" muted loop></video></div>'
      util.query(bgf,'.video-sp video').src=data.url;
      util.query(bgf,'.video-sp video').oncanplay=function(){
        this.play();
      }
      checkBgCoverStyle();
      ImgOrVideoSi.show();
    },
    color:function(bgf,data){
      bgf.innerHTML='<div class="color-sp full"></div>'
      if(!util.query(document.head,'style.colorSpControl')){
        var style=document.createElement('style');
        style.className='colorSpControl';
        document.head.appendChild(style);
      }
      util.query(document.head,'style.colorSpControl').innerHTML=`.color-sp{background-color:${data.light};}body.dark .color-sp{background-color:${data.dark};}`
    },
    api:function api(bgf,data){
  function showAcgOrFj(a){
    refreshApiIcon.show();
    refreshApiIcon.getIcon().classList.add('round-anim');
    a.getImg(function(d){
      refreshApiIcon.getIcon().classList.remove('round-anim');
      draws.img(bgf,{
        url:d.url
      });
      if(d.candownload){
        downloadIcon.show();
      }
    })
    refreshFn=function(){
      refreshApiIcon.getIcon().classList.add('round-anim');
      acgbg.getImg(function(d){
        refreshApiIcon.getIcon().classList.remove('round-anim');
        draws.img(bgf,{
          url:d.url
        });
        if(d.candownload){
          downloadIcon.show();
        }
      })
    }
  }
  switch (data.api){
    case 'acg':
      showAcgOrFj(acgbg);
    break;
    case 'fj':
      showAcgOrFj(fjbg);
    break;
    case 'bing':
      draws.img(bgf,{
        url:"https://bing.shangzhenyang.com/api/1080p"
      });
      downloadIcon.show();
      infoIcon.show();
    break;
    case 'time':
      // at ../defaultDrawer.js dot-timeb
      timeb=setInterval(function(){
        draws.color(bgf,getNowColor());
      },200)
    break;
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
      util.query(document.head,'style.zdySpControl').innerHTML=`.zdy-sp{background:${data.light};}body.dark .zdy-sp{background:${data.dark};}`
    }
  }

  /* outputs: 
    getVideoCaptrue
    getUserUploadUrl
    hasUploadedImg
  */
  var {
    getVideoCaptrue,
    getUserUploadUrl,
    hasUploadedImg,
    iovuploader
  }=(function () {
  // 图片、视频上传器
  var iovuploader = new dialog({
    content: "<form><h1>上传背景</h1><div class=\"content\"><p>背景类型：<input type=\"radio\" class=\"uploadi\" name=\"uploadiov\" checked=\"checked\"> 图片 <input type=\"radio\" class=\"uploadv\" name=\"uploadiov\"> 视频</p><p>背景URL：<input type=\"url\" placeholder=\"URL\"></p><p>从本地选择文件：<input type=\"file\"></p><p class=\"tip\">URL和文件只需填写一个即可，优先选择本地文件</p></div><div class=\"footer\"><div class=\"cancel btn\">取消</div><button class=\"ok btn\">确定</button></div></form>",
    class: "iovuploader",
  })
  // @note 将cancel按钮修改为div，防止表单submit到cancel
  // @edit at 2024/1/30 15:20

  // Dom
  var iovuploaderf = iovuploader.getDialogDom();
  // 取消
  util.query(iovuploaderf, '.cancel').onclick = function (e) {
    e.preventDefault();
    iovuploader.close();
  }
  // 提交
  util.query(iovuploaderf, 'form').onsubmit = function (e) {
    e.preventDefault();
    // 类型 image(图片) / video(视频)
    var type = util.query(iovuploaderf, '.uploadi').checked ? 'image' : 'video';
    // url?
    var url = util.query(iovuploaderf, 'input[type="url"]').value;
    // File?
    var file = util.query(iovuploaderf, 'input[type="file"]').files[0];
    // 先把背景设置对话框中的图片src重置
    util.query(d, '.zdy .left img').src = '';
    if (file) {
      // File优先

      // 将内容写入idb
      initsto.set('upload', file, true, function () {
        iovuploader.close();
        getUserUploadUrl(function (r) {
          // 获取并设置背景设置对话框中的图片src
          util.query(d, '.zdy .left img').src = r;
        })
        setbg({
          type: "default",
          data: {
            type: "userbg"
          }
        })
      });

      // 设置存储
      initsto.set('userbg', {
        type: type,
        useidb: true
      })
    } else {
      initsto.set('userbg', {
        type: type,
        url: url
      })
      iovuploader.close();
      getUserUploadUrl(function (r) {
        // 获取并设置背景设置对话框中的图片src
        util.query(tab1, '.zdy .left img').src = r;
        setbg({
          type: "default",
          data: {
            type: "userbg"
          }
        })
      })
    }

    util.query(tab1, '.noBg').style.display = 'none';
    util.query(tab1, '.hasBg').style.display = 'block';
    util.query(tab1, '.zdy .editbtn').style.display = 'block';
  }

  // 获取用户上传图片、视频URL
  function getUserUploadUrl(cb) {
    var a = initsto.get('userbg');
    // 没有上传，直接返回false
    if (!a) {
      cb(false);
      return;
    }

    if (a.type == 'video') {
      // 视频
      var b = a.useidb;
      if (b) {
        // 来自用户本地上传，从idb提取，获取视频快照返回
        initsto.get('upload', true, function (blob) {
          getVideoCaptrue(URL.createObjectURL(blob), function (c) {
            cb(c);
          });
        })
      } else {
        // 来自外站，尝试获取视频快照返回
        try {
          getVideoCaptrue(a.url, function (c) {
            cb(c);
          });
        } catch (e) {
          //失败（CORS|>400）
          cb(false);
        }
      }
    } else if (a.type == 'image') {
      var b = a.useidb;
      if (b) {
        // 来自用户本地上传，从idb提取返回
        initsto.get('upload', true, function (blob) {
          cb(URL.createObjectURL(blob));
        })
      } else {
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

    video.onloadedmetadata = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.currentTime = video.duration / 4;

      video.oncanplay = function () {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL('image/png'));
        this.remove();
      };
    };
  }

  function hasUploadedImg() {
    return !!initsto.get('userbg');
  }
  return{
    hasUploadedImg,
    getUserUploadUrl,
    getVideoCaptrue,
    iovuploader
  }
})();
;

  var {colorchanger,colorchangerf}=(function(){
  // 自定义颜色修改对话框
  var colorchanger=new dialog({
    content:"<form><h1>自定义背景颜色</h1><div class=\"content\"><p>浅色模式：<input type=\"color\" class=\"lightbgcolor\"></p><p>深色模式：<input type=\"color\" class=\"darkbgcolor\"></p></div><div class=\"footer\"><div class=\"cancel btn\">取消</div><button class=\"ok btn\">确定</button></div></form>"
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
  return {colorchanger,colorchangerf};
})();

;

  function selectbgitem(data){
    util.query(tab1,'.bgitem',true).forEach(function(it){
      it.classList.remove('selected');
    })
    util.query(tab2,'.bgitem',true).forEach(function(it){
      it.classList.remove('selected');
    })
    if(data.type=='default'){
      if(data.data.type=='img'){
        util.query(tab1,'.neizhi .bgitem[data-img="'+data.data.url+'"]').classList.add('selected');
      }else if(data.data.type=='userbg'){
        util.query(tab1,'.zdy .bgitem').classList.add('selected');
      }else if(data.data.type=='api'){
        if(data.data.api=='time'){
          util.query(tab2,'.api .bgitem').classList.add('selected');
        }else{
          util.query(tab1,'.api .bgitem[data-api="'+data.data.api+'"]').classList.add('selected');
        }
      }else if(data.data.type=='color'){
        util.query(tab2,'.zdy .bgitem').classList.add('selected');
      }
    }
  }
  setTimeout(function(){
    selectbgitem(quik.background.getbg());
    quik.background.addEventListener('change',selectbgitem)
  });

  function _reset(){
    document.body.classList.remove('t-dark');
    refreshApiIcon.hide();
    refreshFn=function(){}
    clearInterval(timeb);
    downloadIcon.hide();
    ImgOrVideoSi.hide();
    infoIcon.hide();
  }
  
  return {
    type: "default",
    init: function (e) {
      setbg=e.setbg;
      // pushTab 图片/视频
      tab1=e.pushBgTab({
        tab:"图片/视频",
        content:"<div class=\"unit-item zdy\"><div class=\"unit-title\">自定义</div><div class=\"unit-content\"><div class=\"bgitem full\"><div class=\"left\"><div class=\"hasBg\"><img src=\"\" alt=\"\"></div><div class=\"noBg\"><span class=\"material-symbols-outlined\">&#xf09b;</span></div></div><div class=\"right\"><div class=\"bg-title\">用户自定义背景</div><div class=\"bg-message\">上传任意你喜欢的图片/视频作背景</div></div><div class=\"editbtn\"><div class=\"btn ok\">重新上传</div></div></div></div></div><div class=\"unit-item neizhi\"><div class=\"unit-title\">内置</div><div class=\"unit-content\"></div></div><div class=\"unit-item api\"><div class=\"unit-title\">API</div><div class=\"unit-content\"><div class=\"bgitem half\" data-api=\"bing\"><div class=\"left\"><img data-src=\"https://bing.shangzhenyang.com/api/1080p\" alt=\"\" loading=\"lazy\"></div><div class=\"right\"><div class=\"bg-title\">必应壁纸</div><div class=\"bg-message\">获取必应首页的壁纸作为背景</div></div></div><div class=\"bgitem half\" data-api=\"acg\"><div class=\"left\"><img data-src=\"https://www.loliapi.com/acg/\" alt=\"\" loading=\"lazy\"></div><div class=\"right\"><div class=\"bg-title\">随机二次元壁纸</div><div class=\"bg-message\">获取随机二次元壁纸作为背景，背景提供：loliapi.com</div></div></div><div class=\"bgitem half\" data-api=\"fj\"><div class=\"left\"><img data-src=\"https://api.gumengya.com/Api/FjImg?format=image\" alt=\"\" loading=\"lazy\"></div><div class=\"right\"><div class=\"bg-title\">随机风景壁纸</div><div class=\"bg-message\">获取随机风景壁纸作为背景，背景提供：imgapi.cn</div></div></div></div></div><div class=\"unit-item se\"><div class=\"u-se\"><p>背景图片显示设置</p><p class=\"material-symbols-outlined\">&#xe5cc;</p></div></div>"
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
        }else{
          iovuploader.open();
        }
      })
      util.query(tab1,'.zdy .editbtn').addEventListener('click',function(){
        iovuploader.open();
        var j=initsto.get('userbg');
        if(j){
          util.query(iovuploaderf,'input[type="url"]').value=j.url;
          if(j.type=='image'){
            util.query(iovuploaderf,'.uploadi').checked=true;
          }else{
            util.query(iovuploaderf,'.uploadv').checked=true;
          }
        }
      });

      // 内置图片
      var u=util.query(tab1,'.neizhi .unit-content');
      var _=this;
      neizhiImg.forEach(function(im){
        var bgitem=util.element('div',{
          class:"bgitem def",
          'data-img':im.img,
        });
        bgitem.innerHTML='<div class="left"><img data-src="'+im.thumbnail+'" loading="lazy"/></div>'
        u.appendChild(bgitem);
        util.query(bgitem,'.left').onclick=function(){
          e.setbg({
            type:e.type,
            data:{
              type:"img",
              url:bgitem.getAttribute('data-img')
            }
          })
        }
      });

      var se=util.query(tab1,'.u-se');
      se.onclick=function(){
        ImgOrVideoSi.callback();
      }

      // API
      util.query(tab1,'.api.unit-item .left',true).forEach(function(l){
        l.addEventListener('click',function(){
          e.setbg({
            type:e.type,
            data:{
              type:"api",
              api:l.parentElement.getAttribute('data-api')
            }
          })
        });
      });


      // pushTab 纯色
      tab2=e.pushBgTab({
        tab:"纯色",
        content:"<div class=\"unit-item zdy\"><div class=\"unit-title\">自定义颜色</div><div class=\"unit-content\"><div class=\"bgitem full\"><div class=\"left\"><div class=\"color-left color\"></div><div class=\"color-right color\"></div></div><div class=\"right\"><div class=\"bg-title\">自定义纯色背景</div><div class=\"bg-message\">将你喜欢的颜色做背景，分亮色和暗色（你也可以都设一个颜色或反着来，但不建议这么做）</div></div><div class=\"editbtn\"><div class=\"btn ok\">编辑</div></div></div></div></div><div class=\"unit-item api\"><div class=\"unit-title\">API</div><div class=\"unit-content\"><div class=\"bgitem full\" data-api=\"time\"><div class=\"left\"><div class=\"color-left color\"></div><div class=\"color-right color\"></div></div><div class=\"right\"><div class=\"bg-title\">时间的颜色</div><div class=\"bg-message\">如果当前时间为12:34:56，那么时间的颜色就是rgb(12,34,56)，在亮色模式下就是rgb(255-12,255-34,255-56)</div></div></div></div></div>"
      });
      var c=initsto.get('usercolor');
      util.query(tab2,'.zdy .color-left').style.backgroundColor=c.light;
      util.query(tab2,'.zdy .color-right').style.backgroundColor=c.dark;
      util.query(tab2,'.zdy .left').onclick=function(){
        var c=initsto.get('usercolor');
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
        var c=initsto.get('usercolor');
        util.query(colorchangerf,'.lightbgcolor').value=c.light;
        util.query(colorchangerf,'.darkbgcolor').value=c.dark;
        colorchanger.open();
      }
      var cd=getNowColor();
      util.query(tab2,'.api .color-left').style.backgroundColor=cd.light;
      util.query(tab2,'.api .color-right').style.backgroundColor=cd.dark;
      util.query(tab2,'.api .left').onclick=function(){
        e.setbg({
          type:e.type,
          data:{
            type:"api",
            api:this.parentElement.getAttribute('data-api')
          }
        })
      }

      // pushTab 自定义
      tab3=e.pushBgTab({
        tab:"自定义",
        content:"<p>浅色模式：</p><br><textarea class=\"gjzdytlight textarea\"></textarea><p>深色模式：</p><br><textarea class=\"gjzdytdark textarea\"></textarea> <button class=\"gjzdysetbtn\">设置</button><p class=\"tip\">参见 <a href=\"https://developer.mozilla.org/zh-CN/docs/Web/CSS/background\" target=\"_blank\">CSS | background属性</a></p>"
      });
      var _l_=initsto.get('custombglight');
      var _d_=initsto.get('custombgdark');
      util.query(tab3,'.gjzdytlight').value=_l_?_l_:'';
      util.query(tab3,'.gjzdytdark').value=_d_?_d_:'';
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
    cancel: function (n) {
      n.bgf.innerHTML='';
      _reset();
    },
    draw:function(n){
      var bgf=n.bgf;
      var data=n.data;
      _reset();
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


  var idmax=0;
  function pushBgDrawer(drawer) {
    var session = drawer.session;
    try {
      if (!util.checkSession(session)) {
        throw 'session error';
      }
    } catch (e) {
      throw new Error('背景Drawer注册失败，Session校验错误。')
    }
    var bgdrawerid = 'bgdrawer-' + idmax;
    idmax++;
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
    doevent('change',[data]);
  }

  drawbg(initsto.get('bg'));
  //开始activeTab0
    activeTab('0');

  function getbg(){
    return initsto.get('bg');
  }

  mainmenu.pushMenu({
    icon:util.getGoogleIcon('e1bc'),
    title:'背景设置',
    click:function(){
      bg_set_d.open();
    }
  },mainmenu.MAIN_MENU_TOP)

  return{
    pushBgDrawer,
    getbg,
    setbg,
    addEventListener,
    removeEventListener
  }

})();;
  var searchEditor=(function(){
  var dia=new dialog({
    content:"<div class=\"actionbar\"><h1>自定义搜索引擎</h1><div class=\"closeBtn\">{{close}}</div></div><div class=\"searchlist\"></div><div class=\"footer\"><button class=\"cancel btn\">取消</button> <button class=\"ok btn\">确定</button></div>".replace('{{close}}',util.getGoogleIcon('e5cd')),
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
    str+='<div class="item" data-k="'+k+'">'+
'<div class="icon"><img/></div>'+
'<div class="url"><input value="'+list[k]+'"/></div>'+
'<div class="remove">'+util.getGoogleIcon('e5cd')+'</div>'+
'</div>';
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
    item.innerHTML='<div class="icon"><img src="https://cn.bing.com/favicon.ico"/></div>'+
    '<div class="url"><input value="https://cn.bing.com/search?q=%keyword%"/></div>'+
    '<div class="remove">'+util.getGoogleIcon('e5cd')+'</div>';
    util.query(d,'.searchlist').insertBefore(item,util.query(d,'.searchlist .addnewitem'));
    clitem(item);
  }


  function clitem(item){
    util.getFavicon(list[item.getAttribute('data-k')],function(fav){
      if(fav){
        util.query(item,'.icon img').src=fav;
      }else{
        util.query(item,'.icon img').src=util.createIcon('s');
      }
    })
    util.query(item,'.url input').oninput=function(){
      if(this.parentElement.parentElement.dataset.k=='bing'){
        this.value=list['bing'];
        toast.show('该项只读');
        return;
      }
      // @note 隐藏用户输入了不正确的URL的报错
      // @edit at 2024/1/30 15:28
      try{
        var img=this.parentElement.parentElement.querySelector('.icon img')
        util.getFavicon(this.value,function(fav){
          if(fav){
            img.src=fav;
          }else{
            img.src=util.createIcon('s');
          }
        })
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
  var notice_mb="<div class=\"notice-actionbar\"><div class=\"notice-title\"></div><div class=\"notice-close-btn\">{{close-btn}}</div></div><div class=\"notice-content\"></div><div class=\"notice-progress\"><div class=\"p\"><div></div></div></div><div class=\"notice-btns\"></div>";
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

})();;
  var theme=(function(){

  // 等待重构

  var eventHandle=getEventHandle();
  var addEventListener=eventHandle.addEventListener;
  var removeEventListener=eventHandle.removeEventListener;
  var doevent=eventHandle.doevent;
  var initsto=storage('theme',{
    sync:true,
    title:"主题设置",
  });
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
    console.log(d);
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
  return {
    setTheme:function(v){
      initsto.set('theme',v);
      checkTheme(v);
      si.reGet();
    },
    addEventListener,
    removeEventListener,
    getTheme,
  }
})();
  var addon=(function () {
  var { addEventListener, removeEventListner, doevent } = getEventHandle();
  var core = (function(){
  var marketData;
  var evn=getEventHandle();

  function getCode(jsurl,p){
    return new Promise(function(resolve,reject){
      var xhr=new XMLHttpRequest();
      xhr.open('GET',jsurl,true);
      xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
          if(xhr.status==200){
            resolve(xhr.responseText);
          }
        }
      }
      xhr.onerror=function(){
        console.log('getCode error');
        reject(xhr.status);
      }
      xhr.onprogress=function(pr){
        p&&p(pr);
      }
      xhr.send();
    })
    
  }

  function deAddon(addon_code){
    addon_code=addon_code.trim();
    if(addon_code.indexOf('/*QUIK_ADDON ')==0){
      var meta=addon_code.substring(13,addon_code.indexOf(' */'));
      meta=meta.split('|');
      var metaver=meta[0];
      if(metaver=='1'){
        return {
          name:meta[1],
          version_code:parseInt(meta[2]),
          version:meta[3],
          desc:meta[4],
          author:meta[5],
          icon:meta[6],
          website:meta[7],
          update:meta[8],
          signature:meta[9],
          marketId:meta[10]
        }
      }else{
        return {
          error:true,
          msg:'un support meta version'
        }
      }
    }else{
      return {
        error:true,
        msg:'not QUIK addon'
      }
    }
  }

  function hasSame(signature){
    if(!signature) return false;
    var a=initsto.list();
    for(var i=0;i<a.length;i++){
      if(initsto.get(a).signature==signature){
        return true;
      }
    }
  }

  async function installAddon(code,meta,detail){
    if(typeof meta!='object'||meta.error){
      return {
        msg:"插件格式错误:"+(meta.msg||'META isn\'t an object'),
        error:true,
      }
    }else if(hasSame(meta.signature)){
      return {
        msg:"已安装相同插件",
        error:true
      }
    }else{
      var adid=util.getRandomHashCache();
      await new Promise(function(r){
        codesto.set(adid,code,true,r);
      });
      meta.id=adid;
      for(var k in detail){
        if(typeof meta[k]=='undefined'){
          meta[k]=detail[k];
        }
      }
      initsto.set(adid,meta);
      await runAddon(adid);
      return {
        id:adid
      };
    }
  }

  async function checkUpdate(id){
    var addon=initsto.get(id);
    if(!addon){
      throw 'not found addon';
    }
    if(!addon.type){
      var update=addon.update;
      var nc=await fetch(update);
      nc= await nc.text();
      nc=parseInt(nc);
      if(nc>addon.version_code){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  var initsto=storage('addon',{
    sync:true,
    title:"插件",
    desc:"QUIK起始页插件数据（暂未开发完）",
    rewrite:function(ast,k,a){
      return new Promise(function(r){
        var d=new dialog({
          content:"<div>正在同步插件...[<span>0</span>/"+Object.keys(a).length+"]</div>",
          class:"dialog-addon-install",
        });
        d.open();
        var df=d.getDialogDom();
        var i=0;
        for(var k in a){
          var p;
          if(a[k].url&&getAddonByUrl(a[k].url)){
            _pu();
            continue;
          }
          if(a[k].marketId){
            p=installByOfficialMarket(a[k].marketId);
          }else if(!a[k].type){
            p=installByUrl(a[k].url);
          }else{
            _pu();
          }
          p.addEventListener('done',function(){
            _pu();
          })
          p.addEventListener('error',function(){
            _pu();
            alert('安装一个插件时失败');
          })
          p.addEventListener('wait',function(r){r(true)});
        }
        function _pu(){
          i++;
            util.query(df,'span').innerHTML=i;
          if(i==Object.keys(a).length){
            r(initsto.getAll());
          }
        }
        

      });
    }
  });
  var codesto=storage('addonscript');
  

  function getAddonByUrl(url){
    var as=initsto.getAll();
    for(var k in as){
      if(as[k].url==url){
        return as[k];
      }
    }
  }

  function getAddonBySessionId(id){
    return initsto.get(id);
  }

  var ainstatus=['初始化','获取插件信息','下载插件','等待确认','安装插件','安装成功'];
  var ainerrors=['初始化失败','未找到插件信息','下载插件失败','插件解析错误','用户取消','安装失败'];
  function addonInstallProcess(){
    this.statuCode=0;
    this.statuMsg=ainstatus[0];
    this.progress=0;
    this.errorCode=-1;
    this.errorMsg='';
    this.result=null;
    this.ev=getEventHandle();
    this.addEventListener=this.ev.addEventListener;
    this.removeEventListener=this.ev.removeEventListener;
  }
  addonInstallProcess.prototype={
    setProgress:function(n){
      this.progress=n;
      this.ev.doevent('progress',[n]);
    },
    setStatu:function(n){
      this.statuCode=n;
      this.statuMsg=ainstatus[n];
      this.ev.doevent('statu',[{
        code:n,
        msg:ainstatus[n]
      }])
    },
    setError:function(n,m){
      this.errorCode=n;
      this.errorMsg=ainerrors[n]+' '+m;
      this.ev.doevent('error',[{
        code:n,
        msg:ainerrors[n]+' '+m
      }])
    },
    setDone:function(res){
      console.log('a');
      this.result=res;
      this.ev.doevent('done',[res]);
    },
    wait:function(d,fn){
      this.waiting=true;
      var _=this;
      this.ev.doevent('wait',[function(a){
        _.waiting=false;
        fn(a);
        _._waitfn=fn;
        _._waitd=d;
      },d]);
      this._waitfn=fn;
      this._waitd=d;
    }
  }

  function _install_end(p){
    return function(r){
      if(r.error){
        p.setError(5,r.msg);
      }else{
        p.setStatu(5);
        p.setProgress(1);
        p.setDone(r);
        evn.doevent('installnew',[r])
      }
    }
  }

  // 从官方插件市场安装
  function installByOfficialMarket(id){
    var p=new addonInstallProcess();
    if(!storage.checkIDB()){
      p.setError(0,"浏览器不支持IndexedDB");
    }
    if(!marketData){
      loadMarketData().then(getmarketData);
    }else{
      getmarketData();
    }
    function getmarketData(){
      if(marketData[id]){
        p.setProgress(0.1);
        p.setStatu(2);
        var url=marketData[id].url;
        getCode(url,function(pr){
          p.setProgress(0.1+pr*0.5);
        }).then(function(code){
          p.setProgress(0.6);
          p.setStatu(3);
          installAddon(code,deAddon(code),{
            marketId:id
          }).then(_install_end(p))
        }).catch(function(){
          p.setError(2,url);
        });
      }else{
        p.setError(1,id);
      }
    }
    return p;
  }

  // 从链接安装
  function installByUrl(url){
    var p=new addonInstallProcess();
    if(!storage.checkIDB()){
      p.setError(0,"浏览器不支持IndexedDB");
    }
    p.setProgress(0.1);
    p.setStatu(2);
    getCode(url,function(pr){
      p.setProgress(0.1+pr*0.5);
    }).catch(function(err){
      console.log(err);
      p.setError(2,url);
    }).then(function(code){
      p.setProgress(0.6);
      var meta=deAddon(code);
      if(meta.error){
        p.setError(3,meta.msg);
      }else{
        p.setStatu(3);
        p.wait({
          meta:meta,
          msg:"确定是否安装此插件？"
        },function(n){
          if(n){
            installAddon(code,meta,{
              url:url
            }).then(_install_end(p));
          }else{
            p.setError(4,'');
          }
        })
        
      }
    });
    return p;
  }

  // 从本地安装
  function installByLocal(code,p){
    var p=new addonInstallProcess();
    if(!storage.checkIDB()){
      p.setError(0,"浏览器不支持IndexedDB");
    }
    p.setProgress(0.1);
    p.setStatu(1);
    var meta=deAddon(code);
    if(meta.error){
      p.setError(3,meta.msg);
    }else{
      p.setProgress(0.5);
      p.setStatu(3);
      p.wait({
        meta:meta,
        msg:"确定是否安装此插件？"
      },function(n){
        if(n){
          installAddon(code,meta,{
            local:true
          }).then(_install_end(p));
        }else{
          p.setError(4,'');
        }
      })
    }
    return p;
  }

  // 从开发端口安装
  function installByDev(devurl){
    var adid=util.getRandomHashCache();
    initsto.set(adid,{
      name:"DEVPORT:"+devurl,
      url:devurl,
      type:"dev"
    });
    return adid;
  }

  // 插件卸载
  async function uninstall(id){
    var addon=initsto.get(id);
    if(addon){
      initsto.remove(id);
      if(addon.type!='dev'){
        await new Promise((r)=>codesto.remove(id,true,r));
      }
      evn.doevent('uninstall',[{id}])
      return true;
    }else{
      return false;
    }
  }
  
  // 插件运行
  async function runAddon(id){
    var code;
    var data=initsto.get(id);
    var script=document.createElement('script');
    if(data.type=='dev'){
      script.src=data.url+'index.js?id='+id;
      script.onerror=function(){
        alert('开发端口出错');
      }
    }else{
      code=await new Promise((r)=>codesto.get(id,true,r));
      script.innerHTML=`(function(){
        function Session(id){
          this.id="ext_"+id;
          this.session_token="Hvm_session_token_eoi1j2j";
          this.isSession=true;
        };
        var addonData={
          session:new Session('${id}')
        };
        (function(){
          ${code}
        })();
      })()`;
    }
    document.body.appendChild(script);
    
  }

  // 插件升级
  async function update(id){
    var addon=initsto.get(id);
    console.log(addon);
    if(!addon){
      return {
        error:true,
        msg:"未找到插件"
      }
    }
    if(addon.url){
      try{
        var code=await getCode(addon.url);
      }catch(e){
        return {
          error:true,
          msg:"代码请求失败",
          code:e
        }
      }
      var meta=deAddon(code);
      if(meta.error){
        return {
          error:true,
          msg:'META 解析失败:'+meta.msg
        }
      }
      if(meta.signature!=addon.signature){
        return {
          error:true,
          msg:'签名校验失败'
        }
      }
      if(meta.version_code>=addon.version_code){
        for(var k in meta){
          addon[k]=meta[k];
        }
        await new Promise(function(r){
          codesto.set(id,code,true,r);
        });
        initsto.set(id,addon);
        return {
          ok:1,id,version_code:meta.version_code
        }
      }else{
        return {
          error:true,
          msg:'版本校验失败'
        }
      }
    }else{
      return {
        error:true,
        msg:"无法升级此插件"
      }
    }
  }

  // 官方插件验证
  async function checkMarket(url){
    if(!marketData){
      await loadMarketData();
    }
    for(var k in marketData){
      if(marketData[k].url==url){
        var o=JSON.parse(JSON.stringify(marketData[k]));
        o.id=k;
        return o;
      }
    }
    return false;
  }

  // 加载官方插件市场数据库
  async function loadMarketData(){
    // fetch(...).then(r=>r.json()).then(data=>{marketData=data});
    // 模拟数据
    marketData = {
      "000":{
        "name":"插件名称",
        "version":"1.0.0",
        "description":"插件描述",
        "author":"作者",
        "icon":"插件图标",
        "url":"插件下载链接",
      }
    }
  }

  function getAddonList(){
    return initsto.list()
  }

  getAddonList().forEach(id=>{
    if(!initsto.get(id).disabled){
      runAddon(id);
    }
  })

  function enable(id){
    var o=initsto.get(id);
    o.disabled=false;
    initsto.set(id,o)
  }
  function disable(id){
    var o=initsto.get(id);
    o.disabled=true;
    initsto.set(id,o)
  }
  function getEnable(id){
    return !initsto.get(id).disabled;
  }
  return {
    enable,
    disable,
    installByOfficialMarket,
    installByUrl,
    installByLocal,
    installByDev,
    uninstall,
    runAddon,
    checkUpdate,
    update,
    checkMarket,
    getAddonByUrl,
    getAddonBySessionId,
    getAddonList,
    getEnable,
    addEventListener:evn.addEventListener,
    removeEventListener:evn.removeEventListener
  }
})();;
  var ui = (function(){
    function installui(){
        var n=new dialog({
            content:"<div class=\"ma\"><div class=\"sth\"><img src=\"assets/def_addon.png\" alt=\"图标\"><p class=\"name\">...</p><p class=\"version\">版本：...</p></div><div class=\"progress\"><div class=\"r\"></div></div><div class=\"msg\"></div><div class=\"btns\"><div class=\"btn l\">取消</div><div class=\"btn r\">确定</div></div></div>",
            class:"addon_install_ui"
        });
        this._d=n;
        var d=this._d.getDialogDom();
        util.query(d,'.btns').style.display='none';
    }

    installui.prototype={
        bind:function(p){
            var _=this;
            var d=this._d.getDialogDom();
            util.query(d,'.msg').innerText=p.statuMsg+'...';
            util.query(d,'.progress .r').style.width=p.progress*100+'%';
            if(p.errorCode!=-1){
                util.query(d,'.msg').innerText=p.errorMsg;
                util.query(d,'.progress').className='progress error';
                util.query(d,'.btns').style.display='block';
                util.query(d,'.btn.l').onclick=
                util.query(d,'.btn.r').onclick=function(){
                    _.hide();
                    setTimeout(function(){
                        _.destory();
                    },200)
                }
            }
            p.addEventListener('status',function(s){
                util.query(d,'.msg').innerText=s.msg;
            });
            p.addEventListener('progress',function(p){
                util.query(d,'.progress .r').style.width=p*100+'%';
            });
            p.addEventListener('error',function(e){
                util.query(d,'.msg').innerText=e.msg;
                util.query(d,'.progress').className='progress error';
                util.query(d,'.btns').style.display='block';
                util.query(d,'.btn.l').onclick=
                util.query(d,'.btn.r').onclick=function(){
                    _.hide();
                    setTimeout(function(){
                        _.destory();
                    },200)
                }
            });
            p.addEventListener('wait',function(e,d2){
                if(d2.meta){
                    util.query(d,'.sth img').src=d2.meta.icon;
                    util.query(d,'.sth .name').innerText=d2.meta.name;
                    util.query(d,'.sth .version').innerText='版本：'+d2.meta.version;
                }
                util.query(d,'.msg').innerText=d2.msg;
                util.query(d,'.btns').style.display='block';
                util.query(d,'.btn.l').onclick=function(){
                    e(false)
                }
                util.query(d,'.btn.r').onclick=function(){
                    e(true)
                }
            });
            p.addEventListener('done',function(){
                console.log('a');
                _.hide();
                setTimeout(function(){
                    _.destory();
                },200)
            });
        },
        ask:function(msg,fn){
            var d=this._d.getDialogDom();
            util.query(d,'.msg').innerText=msg;
            util.query(d,'.btns').style.display='block';
            util.query(d,'.l').onclick=function(){
                fn(false);
                util.query(d,'.btns').style.display='none';
            }
            util.query(d,'.r').onclick=function(){
                fn(true);
                util.query(d,'.btns').style.display='none';
            }
        },
        show:function(){
            this._d.open();
        },
        hide:function(){
            this._d.close();
        },
        destory:function(){
            this._d.destory();
        }
    }

    return installui;
})();;
  var addon_dialog = new dialog({
    content: ("<div class=\"addon-bar\"><div class=\"l\"><div class=\"item active\" data-p=\"0\">插件管理</div><div class=\"item\" data-p=\"1\">插件市场</div></div><div class=\"r\"><div class=\"add-btn\">{{add-btn}}</div><div class=\"closeBtn\">{{close-btn}}</div></div></div><div class=\"content\"><div class=\"p gl\" style=\"display:block\"><ul></ul></div><div class=\"p ma\"><div class=\"addon-search-box\"><input type=\"text\"> <button>{{search}}</button></div><ul></ul></div></div>")
      .replace('{{close-btn}}', util.getGoogleIcon('e5cd'))
      .replace('{{search}}', util.getGoogleIcon('e8b6'))
      .replace('{{add-btn}}', util.getGoogleIcon('e145')),
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
    class: "addon-dialog"
  });

  var addon_dialog_d = addon_dialog.getDialogDom();
  util.query(addon_dialog_d, '.closeBtn').addEventListener('click', () => {
    addon_dialog.close();
  });

  var addon_menu = new menu({
    list: [{
      icon: util.getGoogleIcon('f1cc'),
      title: "从插件市场添加插件",
      click: function () {
        // TODO
      }
    }, {
      icon: util.getGoogleIcon('e157'),
      title: "从第三方链接添加插件",
      click: function () {
        prompt("请输入插件链接", function (link) {
          if (!link) {
            return false;
          }
          var p = core.installByUrl(link);
          var u = new ui();
          u.show();
          u.bind(p);
          p.addEventListener('done', function (a) {
            alert('安装成功');
            console.log(a);
          });
          return true;
        })
      }
    }, {
      icon: util.getGoogleIcon('e66d'),
      title: "从第三方文件添加插件",
      click: function () {
        showOpenFilePicker().then(function (files) {
          var f = files[0];
          var n = f.name;
          var r = new FileReader();
          var u = new ui();
          u.show();
          r.onload = function () {
            var p = core.installByLocal(r.result);
            u.bind(p);
            p.ondone = function (a) {
              installing_notice.destory();
              alert('安装成功');
              console.log(a);
            };
          }
          r.readAsText(f);
        })
      }
    }, {
      icon: util.getGoogleIcon('e86f'),
      title: "添加开发者端口",
      click: function () {
        prompt("请输入开发者端口链接", function (link) {
          if (!link) {
            return false;
          }
          core.installByDev(link);
          alert('安装成功')
        })
      }
    }],
    offset: {
      top: 0, left: 0
    }
  });

  util.query(addon_dialog_d, '.add-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    var b = this.getBoundingClientRect();
    addon_menu.setOffset({
      top: b.top + b.height,
      right: window.innerWidth - b.left - b.width
    });
    addon_menu.show();
  });

  var addon_icon = new iconc.icon({
    offset: "tr",
    content: util.getGoogleIcon("e87b", { type: "fill" })
  });
  addon_icon.getIcon().onclick = function () {
    addon_dialog.open();
  }
  var tmenu = util.query(addon_dialog_d, '.addon-bar .l .item', true);
  var ps = util.query(addon_dialog_d, '.content .p', true);
  tmenu.forEach(function (a) {
    a.onclick = function () {
      tmenu.forEach(function (b) {
        b.classList.remove('active');
      })
      this.classList.add('active');
      ps.forEach(function (c) {
        c.style.display = '';
      })
      ps[this.dataset.p].style.display = 'block';
    }
  })

  var addon_l = util.query(addon_dialog_d, '.content .p.gl ul');
  function xraddon(id) {
    var addon = core.getAddonBySessionId(id);
    if (addon.type == 'dev') {
      addon.name = '开发者端口：' + addon.url;
      addon.author = 'dev';
      addon.desc = '开发者端口：' + addon.url;
    }
    var li = util.query(addon_l, 'li[data-id="' + id + '"]');
    if (!li) {
      li = util.element('li');
      li.innerHTML = "<div class=\"n\"><img src=\"assets/def_addon.png\" alt=\"\" onerror=\"this.src='assets/def_addon.png'\"><div class=\"ds\"><div class=\"name\"><span></span><div class=\"disabled_state\">已禁用</div></div><div class=\"message\"><span></span> <span></span> <span></span></div></div></div><div class=\"d\"><div class=\"desc\"></div><div class=\"website\"></div><div class=\"controls\"><div class=\"btn ch_update\">检查更新</div><div class=\"btn update\">更新</div><div class=\"btn enable\">启用</div><div class=\"btn disable\">禁用</div><div class=\"btn uninstall\" style=\"display:block\">卸载</div></div></div>";
      li.dataset.id = id;
      addon_l.appendChild(li);
      li.onclick = function (e) {
        addon_l.querySelectorAll('li').forEach(function (li) {
          li.classList.remove('active');
        })
        this.classList.add('active');
      }
      util.query(li, '.ch_update').onclick = function () {
        st.innerHTML = '检查更新中...';
        var _ = this;
        _.style.display = '';
        core.checkUpdate(id).then(function (a) {
          if (!a) {
            _.style.display = 'block';
            st.innerHTML = '已是最新版本';
          } else {
            st.innerHTML = '发现新版本';
            util.query(li, '.update').style.display = 'block';
          }
        });
      }

      util.query(li, '.update').onclick = function () {
        st.innerHTML = '更新中...';
        var _ = this;
        _.style.display = '';
        core.update(id).then(function (r) {
          if (r.error) {
            st.innerHTML = '更新失败:' + r.msg;
            _.style.display = 'block';
          } else {
            xraddon(id);
            st.innerHTML = '更新完成，刷新生效';
            util.query(li, '.ch_update').style.display = 'inline-block';
          }
        });
      }
      util.query(li, '.enable').onclick = function () {
        st.innerHTML = '已启用，刷新生效'
        core.enable(id);
        util.query(li, '.disable').style.display = 'block';
        util.query(li, '.disabled_state').style.display="none";
        this.style.display = '';
      }
      util.query(li, '.disable').onclick = function () {
        st.innerHTML = '已禁用，刷新生效'
        core.disable(id);
        util.query(li, '.enable').style.display = 'block';
      util.query(li, '.disabled_state').style.display="";
        this.style.display = '';
      }

      util.query(li, '.uninstall').onclick = function () {
        confirm('你真的要卸载吗？此操作不可恢复！', function (as) {
          if (as) {
            st.innerHTML = '正在卸载...'
            core.uninstall(id).then(function (r) {
              if (r.error) {
                alert('卸载出现错误：' + r.msg)
              } else {
                alert('卸载成功，刷新生效');
              }
            })
          }
        })
      }
    }
    util.query(li, '.n>img').src = addon.icon || "assets/def_addon.png";
    util.query(li, '.n .ds .name span').innerText = addon.name;
    var ms = util.query(li, '.n .ds .message span', true);
    ms[0].innerText = addon.author || '不详';
    ms[1].innerText = addon.version || '';
    ms[2].innerText = '';
    util.query(li, '.d .desc').innerText = addon.desc || '';
    util.query(li, '.d .website').innerText = addon.website || '';
    var st = util.query(li, '.message span', true)[2];
    if (!addon.type) {
      util.query(li, '.ch_update').style.display = 'block';
    }
    if (addon.disabled) {
      util.query(li, '.enable').style.display = 'block';
      util.query(li, '.disabled_state').style.display="";
    } else {
      util.query(li, '.disable').style.display = 'block';
      util.query(li, '.disabled_state').style.display="none";
    }

  }
  core.getAddonList().forEach(function (a) {
    xraddon(a);
  })
  core.addEventListener('installnew',function(e){
    xraddon(e.id);
  })
  core.addEventListener('uninstall',function(e){
    var li = util.query(addon_l, 'li[data-id="' + e.id + '"]');
    if(li){li.remove()}
  })

  core.upinstallByOffcialMarket=function(id){

  }
  core.upinstallByUrl=function(url){
    
  }
  core.upuninstall=function(id){
    
  }
  core.upupdate=function(id){
    
  }

  return core;

})();;
  let {alert,confirm,prompt}=(function(){
  var base=`<div class="def_dialog"><h1>提示</h1><div class="content">$0</div><div class="footer">$1<button class="ok btn">确定</button></div></div>`
  var emptyFn=function(){};
  function alert(text,cb){
    if(!cb)cb=emptyFn;
    var d=new dialog({
      content:base.replace('$0','').replace('$1','')
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
    if(!cb)cb=emptyFn;
    var d=new dialog({
      content:base.replace('$0','').replace('$1','<button class="cancel btn">取消</button>')
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
    if(!cb)cb=emptyFn;
    var d=new dialog({
      content:base.replace('$0','<p class="c"></p><p><input type="text"/></p>').replace('$1','<button class="cancel btn">取消</button>')
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
  var card=(function(){
  var cardcon=util.query(document,'.cards');

  /**
   * 
   * @param {object} detail 
   * @param {string} detail.content
   * @param {number} detail.width
   * @param {number} detail.height
   * @param {string} detail.class?
   * @param {object} detail.offset
   * @param {number} detail.offset.top?
   * @param {number} detail.offset.left?
   * @param {number} detail.offset.bottom?
   * @param {number} detail.offset.right?
   */
  var card=function(detail){
    this.width=detail.width;
    this.height=detail.height;
    this.offset=detail.offset;
    var c_el=util.element('div',{
      class:"card",
    })

    c_el.innerHTML=detail.content;
    c_el.style.width=detail.width+"px";
    c_el.style.height=detail.height+"px";
    if(detail.class){
      c_el.classList.add(detail.class);
    }

    if(detail.offset){
      if(typeof detail.offset.top=='number'){
        c_el.style.top=detail.offset.top+"px";
      }else if(typeof detail.offset.bottom=='number'){
        c_el.style.bottom=detail.offset.bottom+"px";
      }
      if(typeof detail.offset.left=='number'){
        c_el.style.left=detail.offset.left+"px";
      }else if(typeof detail.offset.right=='number'){
        c_el.style.right=detail.offset.right+"px";
      }
    }
    this.el=c_el;
    cardcon.appendChild(c_el);
  }

  card.prototype={
    show:function(transition){
      var _=this;
      this.el.style.display='block';
      if(transition&&transition>0){
        this.el.style.transition='all '+transition+'ms';
        this.el.offsetHeight;
        setTimeout(function(){
          _.el.style.transition='none';
        },transition);
      }
      this.el.style.opacity='1';
    },
    hide:function(transition){
      var _=this;
      if(transition&&transition>0){
        this.el.style.transition='all '+transition+'ms';
        setTimeout(function(){
          _.el.style.transition='none';
          _.el.style.display='none';
        },transition);
      }else{
        this.el.style.display='none';
      }
      this.el.style.opacity='0';
    },
    destory:function(){
      this.el.remove();
    },
    getCardDom:function(){
      return this.el;
    },
    getOffset:function(){
      return this.offset;
    },
    getWidth:function(){
      return this.width;
    },
    getHeight:function(){
      return this.height;
    },
    setWidth:function(width){
      this.width=width;
      this.el.style.width=width+'px';
    },
    setHeight:function(height){
      this.el.style.height=height+'px';
    },
    setOffset:function(offset,transition){
      var _=this;
      this.offset=offset;
      if(transition&&transition>0){
        this.el.style.transition='all '+transition+'ms';
        setTimeout(function(){
          _.el.style.transition='none';
        },transition);
      }
      this.el.style.top='auto';
      this.el.style.left='auto';
      this.el.style.bottom='auto';
      this.el.style.right='auto';
      if(typeof offset.top=='number'){
        this.el.style.top=offset.top+"px";
      }else if(typeof offset.bottom=='number'){
        this.el.style.bottom=offset.bottom+"px";
      }
      if(typeof offset.left=='number'){
        this.el.style.left=offset.left+"px";
      }else if(typeof offset.right=='number'){
        this.el.style.right=offset.right+"px";
      }
      
    }
  }
  return card;
})();;
  var sync=(function () {
  var { getJSON, setJSON } = (function(){
  async function getJSON(config){
    var jl=getStorageList();
    var ast=getAllStorage();
    var a={};
    for(var i=0;i<config.length;i++){
      var k=config[i];
      if(jl[k]){
        a[k]={
          title:jl[k].title||k,
          desc:jl[k].desc||'',
          addon:jl[k].addon,
          data:null
        };
        try{
          if(jl[k]&&jl[k].sync){
            if(jl[k].get){
              console.log('t');
              a[k].data=await jl[k].get();
            }else{
              console.log('d');
              a[k].data=await dget(ast[k]);
            }
          }
        }catch(e){
          console.trace();
          throw new Error('在获取 '+k+' 时遇到错误',e);
        }
      }else{
        console.warn(k+' 存储区域不存在');
      }
    }
    return a;
  }

  async function dget(n){
    var m={};
    for(var k2 in n){
      if(typeof n[k2]=='string'&&n[k2][0]=='^'){
        var j={
          "^_t":"db",
          "^_k":n[k2],
          "^_d":await localforage.getItem(n[k2])
        }
        try{
          JSON.stringify(j);
          m[k2]=j;
        }catch(e){
          console.warn('非json支持格式存储不同步');
        }
      }else{
        m[k2]=n[k2];
      }
    }
    return m;
  }

  async function dwrite(ast,k,j){
    for(var k2 in j){
      if(j[k2]['^_t']=='db'&&j[k2]['^_k']){
        if(quik.storage.checkIDB()){
          await localforage.setItem(j[k2]['^_k'],j[k2]['^_d']);
          ast[k][k2]=j[k2]['^_k'];
        }else{
          throw new Error('Your browser is not support indexedDB,Please update your browser.');
        }
      }else{
        ast[k][k2]=j[k2];
      }
    }
  }

  var rewrite='rewrite',compare='compare';

  async function setJSON(json,config){
    var jl=getStorageList();
    var ast=getAllStorage();
    for(var k in json){
      if(config[k]){
        if(jl[k]){
          if(config[k]==rewrite){
            if(typeof jl[k].rewrite=='function'){
              await jl[k].rewrite(ast,k,json[k].data);
            }else{
              await dwrite(ast,k,json[k].data);
            }
          }else if(config[k]==compare){
            if(typeof jl[k].compare=='function'){
              await jl[k].compare(ast,k,json[k].data);
    console.log(ast); 
            }else{
              throw new Error(k+' 不支持compare')
            }
          }
          
        }else{
          if(json[k].addon){
            console.warn(k+' 存储区域不存在，但提示需先安装插件，插件URL: '+json[k].addon);
          }else{
            console.warn(k+' 存储区域不存在');
          }
        }
      }
      
    }
    
    console.log(ast);
    localStorage.quik2=JSON.stringify(ast);
    alert('数据导入成功，请重新加载页面',function(){
      location.reload();
    })
  }

  return {getJSON,setJSON}
})();;

  var sg = new SettingGroup({
    title: "数据",
    index: 4
  });

  var exportDataSi = new SettingItem({
    title: "导出数据",
    message: "导出数据到文件",
    type: "null",
    callback: function () {
      exportDataDialog.open();
      var jl = getStorageList();
      for (var k in jl) {
        if (!jl[k] || !jl[k].sync) {
          continue;
        }
        var j = jl[k];
        var li = document.createElement('div');
        li.classList.add('item');
        li.innerHTML = `<input type="checkbox"/><div class="message">
          <div class="title">${j.title || k}</div>
          <div class="desc">${j.desc || ''}</div>
        </div>`;
        li.dataset.key = k;
        util.query(dm, '.exportslist').appendChild(li);
        util.query(li, 'input').checked = true;
      }
    }
  });
  var importDataSi = new SettingItem({
    title: "导入数据",
    message: "从文件导入数据",
    type: "null",
    callback: function () {
      showOpenFilePicker().then(function (files) {
        var file = files[0];
        if (file) {
          try {
            var reader = new FileReader();
            reader.onload = function (e) {
              sl = JSON.parse(e.target.result);
              var jl = getStorageList();
              importDataDialog.open();
              for (var k in sl) {
                importaixr(sl[k], k, jl);
              }
            }
            reader.readAsText(file);
          } catch (e) {
            alert('读取文件有误！');
          }
        }
      })
    }
  });
  sg.addNewItem(exportDataSi);
  sg.addNewItem(importDataSi);
  mainSetting.addNewGroup(sg);


  function importaixr(j, k, jl) {
    var li = document.createElement('div');
    if (j.addon&&!jl[k]) {
      var addo = addon.getAddonByUrl(j.addon);
      if (!addo) {
        addon.checkMarket(j.addon).then(function (ismarket) {
          li.classList.add('item');
          li.innerHTML = `<input type="checkbox" disabled/><div class="message">
            <div class="title">${j.title || k}</div>
            <div class="desc">需要安装插件以同步：${ismarket ? ismarket.name : j.addon}</div>
          </div>
          <div class="installbtn">安装</div>`;
          li.dataset.key = k;
          util.query(dm2, '.importslist').appendChild(li);
          li.querySelector('.installbtn').addEventListener('click', function () {
            if (this.classList.contains('ing')) return;
            if (this.classList.contains('err')) {
              this.classList.remove('err');
            }
            this.innerHTML = '安装中...';
            this.classList.add('ing');
            var p;
            if (ismarket) {
              p = addon.installByOfficialMarket(ismarket.id);
            } else {
              p = addon.installByUrl(j.addon);
            }
            p.addEventListener('error', function (e) {
              li.querySelector('.installbtn').innerHTML = '安装失败';
              this.classList.add('err');
            })
            p.addEventListener('wait',function(r){
              r(true);
            })
            p.addEventListener('done', function (e) {
              li.remove();
              setTimeout(function () {
                importaixr(j, k, getStorageList());
              },10)
            })
          })
        });
        return;
      }

    }
    li.classList.add('item');
    li.innerHTML = `<input type="checkbox"/><div class="message">
      <div class="title">${j.title || k}</div>
      <div class="desc">${j.desc || ''}</div>
    </div>`;
    if (jl[k].compare) {
      li.innerHTML += `<select>
        <option value="compare">对比</option>
        <option value="rewrite">覆盖</option>
      </select>`
      util.query(li, 'select').value = "compare";
    }
    li.dataset.key = k;
    util.query(dm2, '.importslist').appendChild(li);
    util.query(li, 'input').checked = true;
  }

  var sl = null;

  var exportDataDialog = new dialog({
    content: `<div class="actionbar">
      <h1>导出数据</h1>
      <div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <div class="exportslist">
    </div>
    <div class="btns">
      <div class="btn cancel">取消</div>
      <div class="btn ok">导出</div>
    </div>`,
    class: "sync-dialog",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
  });
  var dm = exportDataDialog.getDialogDom();
  util.query(dm, '.closeBtn').onclick = util.query(dm, '.cancel').onclick = function () {
    exportDataDialog.close();
  }
  util.query(dm, '.ok').onclick = function () {
    var op = [];
    util.query(dm, '.exportslist .item', true).forEach(function (l) {
      if (util.query(l, 'input').checked) {
        op.push(l.dataset.key);
      }
    })
    getJSON(op).then(function (res) {
      download(JSON.stringify(res), 'quik-2-exportdata.json');
    })
    exportDataDialog.close();
  }

  function download(data, filename) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = filename;
    a.click();
  }

  var importDataDialog = new dialog({
    content: `<div class="actionbar">
      <h1>导入数据</h1>
      <div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <div class="importslist">
    </div>
    <div class="btns">
      <div class="btn cancel">取消</div>
      <div class="btn ok">导入</div>
    </div>`,
    class: "sync-dialog",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN,
  });
  var dm2 = importDataDialog.getDialogDom();
  util.query(dm2, '.closeBtn').onclick = util.query(dm2, '.cancel').onclick = function () {
    sl = null;
    importDataDialog.close();
  }

  util.query(dm2, '.ok').onclick = function () {
    var op = {};
    util.query(dm2, '.importslist .item', true).forEach(function (l) {
      if (util.query(l, 'input').checked) {
        if (util.query(l, 'select')) {
          op[l.dataset.key] = util.query(l, 'select').value;
        } else {
          op[l.dataset.key] = 'rewrite';
        }
      }
    })
    setJSON(sl, op);
    exportDataDialog.close();
  }

  return {
    getJSON,
    setJSON
  }
})();
  var lite=(function(){
  var initsto=storage('lite',{
    sync:true,
    title:"极简模式"
  });
  var si=new SettingItem({
    index:2,
    title:"极简模式",
    message:"隐藏所有图标和链接，点击LOGO显示",
    type:"boolean",
    get:function(){
      return !!initsto.get('lite');
    },
    callback:function(v){
      initsto.set('lite',v);
      d(v);
    }
  })

  tyGroup.addNewItem(si);
  var liteBack=util.element('div',{
    class:"liteback"
  });

  liteBack.innerHTML=util.getGoogleIcon('e5ce');
  document.querySelector('main .center').appendChild(liteBack);
  liteBack.addEventListener('click',function(){
    document.body.classList.remove('showall');
    document.body.classList.add('hiden');
  })

  function d(v){
    document.body.classList.remove('hiden');
    document.body.classList.remove('showall');
    if(v){
      document.body.classList.add('lite');
      document.body.classList.add('hiden');
    }else{
      document.body.classList.remove('lite');
      link.cateWidthShiPei();
    }
  }

  document.querySelector("main .center .logo").addEventListener('click',function(){
    document.body.classList.add('showall');
    document.body.classList.remove('hiden');
    link.cateWidthShiPei();
  })

  d(initsto.get('lite'));
  return {
    set:function(a){
      a=!!a;
      initsto.set('lite',a);
      d(a);
      si.reGet();
    },
    get:function(){
      return initsto.get('lite');
    }
  };
})();;
  var hotkey=(function(){
    document.addEventListener('keydown',function(e){
        if(e.key=='s'&&e.altKey){
            e.preventDefault();
            mainSetting.open();
        }else if(e.key=='x'&&e.altKey){
            e.preventDefault();
            lite.set(!lite.get());
        }else if(e.key=='g'&&e.altKey){
            e.preventDefault();
            link.setShowCate(!link.isShowCate());
        }
    });
})();;

  (function(){
  var igsg=new SettingGroup({
    title:"关于",
    index:5
  });
  mainSetting.addNewGroup(igsg);
  var aboutSi=new SettingItem({
    type:'null',
    title:"关于QUIK起始页",
    index:1,
    callback:function(){
      aboutDialog.open();
    }
  });
  var updateSi=new SettingItem({
    type:'null',
    title:"更新日志",
    index:2,
    callback:function(){
      updateDialog.open();
    }
  });
  var licSi=new SettingItem({
    type:'null',
    title:"用户协议和隐私政策",
    index:3,
    callback:function(){
      licDialog.open();
    }
  });
  var thankSi=new SettingItem({
    type:'null',
    title:"特别鸣谢",
    index:4,
    callback:function(){
      thaDialog.open();
    }
  });
  igsg.addNewItem(aboutSi);
  igsg.addNewItem(updateSi);
  igsg.addNewItem(licSi);
  igsg.addNewItem(thankSi);

  mainmenu.pushMenu({
    icon:util.getGoogleIcon('e88e'),
    title:"关于QUIK",
    click:function(){
      aboutDialog.open();
    }
  },1)


  var aboutDialog=new dialog({
    content:"<div class=\"about-dialog\"><div class=\"close\">{{close-btn}}</div><div class=\"ab-logo\"><svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 456 128\"><circle cx=\"64\" cy=\"64\" r=\"40\" stroke=\"black\" stroke-width=\"3\" fill=\"transparent\"/><line x1=\"74\" y1=\"74\" x2=\"104\" y2=\"104\" style=\"stroke:rgb(0,0,0);stroke-width:3;\"/><path d=\"M148 24L148 68Q148 104 180 104Q212 104 212 68L212 24\" style=\"fill:transparent;stroke:rgb(0,0,0);stroke-width:3;\"></path><path d=\"M276 24L306 24M291 24L291 104M276 104L306 104\" style=\"fill:transparent;stroke:rgb(0,0,0);stroke-width:3;\"></path><path d=\"M384 24L384 104M424 26L384 68M424 102L384 68\" style=\"fill:transparent;stroke:rgb(0,0,0);stroke-width:3;\"></path></svg></div><div class=\"t ver\">当前版本: <span></span></div><div class=\"t intro\">介绍: QUIK起始页是由前端爱好者<a href=\"https://siquan001.github.io/?ref=quik\" target=\"_blank\">陈思全</a>编写的一个简洁、实用的浏览器主页</div><div class=\"t license\">版权声明: 本项目以GPL 3.0协议声明，版权归原作者所有。</div><div class=\"t thanks\">感谢这些项目或可爱的人为QUIK起始页提供的支持: <a href=\"javascript:;\">点击查看</a></div><div class=\"t feedback\">反馈: chensiquan2023@qq.com</div></div>".replace('{{close-btn}}',util.getGoogleIcon('e5cd')),
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN
  });

  var addom=aboutDialog.getDialogDom();
  util.query(addom,'.close').onclick=function(){
    aboutDialog.close();
  }
  util.query(addom,'.t.thanks a').onclick=function(){
    thaDialog.open();
  }
  setTimeout(function(){
    util.query(addom,'.ver span').innerText=window.version.version;
  });

  var updatelog={
  "1.7.8": {
    "updates": [
      {
        "tag": "change",
        "content": "UI第一次大优化"
      },
      {
        "tag": "thanks",
        "content": "感谢 川上星林 提供的反馈"
      }
    ],
    "time": "2023/9/24"
  },
  "1.7.5": {
    "updates": [
      {
        "tag": "change",
        "content": "优化UI"
      },
      {
        "tag": "new",
        "content": "新增显示效果设置"
      },
      {
        "tag": "fix",
        "content": "修复若干问题，优化体验"
      },
      {
        "tag": "thanks",
        "content": "感谢 edgebook 提供的反馈"
      }
    ],
    "time": "2023/9/23"
  },
  "1.7.2": {
    "updates": [
      {
        "tag": "fix",
        "content": "修复一言BUG"
      },
      {
        "tag": "fix",
        "content": "修复若干问题，优化体验"
      }
    ],
    "time": "2023/9/22"
  },
  "1.7.1": {
    "updates": [
      {
        "tag": "new",
        "content": "一言添加今日诗词API"
      }
    ],
    "time": "2023/9/17"
  },
  "1.7": {
    "updates": [
      {
        "tag": "change",
        "content": "更新文档"
      },
      {
        "tag": "fix",
        "content": "进一步解决背景相关的BUG"
      },
      {
        "tag": "change",
        "content": "切换背景API为故梦API"
      },
      {
        "tag": "new",
        "content": "API背景支持下载到本地"
      },
      {
        "tag": "new",
        "content": "为休息模式的图片和一言和第一界面底部一言添加来源信息，休息模式的图片来源会显示在左上角，一言的来源在鼠标放在一言上时显示"
      },
      {
        "tag": "new",
        "content": "天气支持查看不同的城市（仅中国大陆）"
      },
      {
        "tag": "fix",
        "content": "修复若干问题，优化体验"
      }
    ],
    "time": "2023/9/10"
  },
  "1.6": {
    "updates": [
      {
        "tag": "fix",
        "content": "修复背景模糊的BUG"
      },
      {
        "tag": "change",
        "content": "底部一言修改方式改为直接点击"
      },
      {
        "tag": "new",
        "content": "添加一个彩蛋（我可不会告诉你）"
      }
    ],
    "time": "2023/9/2"
  },
  "1.5": {
    "updates": [
      {
        "tag": "new",
        "content": "添加搜索框内容翻译功能"
      },
      {
        "tag": "new",
        "content": "添加搜索框输入=计算"
      },
      {
        "tag": "new",
        "content": "天气预报添加空气质量"
      },
      {
        "tag": "new",
        "content": "新增问候功能"
      }
    ],
    "time": "2023/8/29"
  },
  "1.3.1": {
    "updates": [
      {
        "tag": "change",
        "content": "修改QUIK起始页使用的图片相关API"
      },
      {
        "tag": "change",
        "content": "修改QUIK起始页使用的热榜相关API"
      }
    ],
    "time": "2023/8/22"
  },
  "1.3": {
    "updates": [
      {
        "tag": "new",
        "content": "添加休息模式(Beta)，Ctrl+Alt+B进入，Ctrl+Q退出，累了就休息一下吧~"
      },
      {
        "tag": "change",
        "content": "修改用户协议与隐私政策、新手文档等"
      }
    ],
    "time": "2023/8/20"
  },
  "1.2.1": {
    "updates": [
      {
        "tag": "fix",
        "content": "修复已知BUG,优化用户体验"
      }
    ],
    "time": "2023/8/20"
  },
  "1.2": {
    "updates": [
      {
        "tag": "new",
        "content": "便笺:支持在第一界面就可以直接添加固定的便签，并在编辑页面添加固定按钮。"
      },
      {
        "tag": "new",
        "content": "搜索框:添加一个搜索框仅搜索的设置"
      },
      {
        "tag": "new",
        "content": "链接:下方链接可以支持大中小三个样式"
      },
      {
        "tag": "new",
        "content": "热点:支持把热点添加到首页"
      },
      {
        "tag": "fix",
        "content": "计算器:修复+/-键"
      }
    ],
    "time": "2023/8/18"
  },
  "1.0.1": {
    "updates": [
      {
        "tag": "fix",
        "content": "修复已知BUG,优化用户体验"
      }
    ],
    "time": "2023/8/3"
  },
  "1.0.0": {
    "updates": [
      {
        "tag": "new",
        "content": "梦开始的地方~"
      }
    ],
    "time": "2023/8/1"
  }
};
  var updateDialog=new dialog({
    content:`<div class="actionbar">
      <h1>更新日志</h1>
      <div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <div class="version_list"></div>`,
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
    class:"update_dia"
  });

  var updom=updateDialog.getDialogDom();
  util.query(updom,'.closeBtn').onclick=function(){
    updateDialog.close();
  }

  util.query(updom,'.version_list').innerHTML=(function(){
    var s='';
    for(var k in updatelog){
      s+=formatVersion(k,updatelog[k]);
    }
    return s;
  })();
  function formatVersion(v,fv){
    var str='',gl={
      "new":"新增",
      "del":"删除",
      "fix":"修复",
      "change":"修改",
      "thanks":"感谢"
    };
    var _fv=fv.updates;
    for(var i=0;i<_fv.length;i++){
      str+='<div class="update_item"><div class="update_item_tag '+_fv[i].tag+'"><div>'+gl[_fv[i].tag]+'</div></div><div class="update_item_content">'+_fv[i].content+'</div></div>'
    }
    var s='<div class="version_item"><div class="version_item_title">'+v+'</div><div class="version_item_update_time">发布时间：'+fv.time+'</div><div class="version_update">'+str+'</div></div>';
    return s;
  }

  var lichtml="<h1>QUIK起始页用户协议与隐私政策</h1><p><b>请务必认真阅读！</b></p><h2>一、QUIK起始页简介</h2><p>QUIK起始页（以下简称本产品）是一个由个人开发者（<a href=\"https://siquan001.github.io/\" target=\"_blank\">陈思全</a>）编写的一个开源免费的纯前端项目，以GPL 3.0 license声明，版权归原作者所有</p><h2>二、用户使用须知</h2><p>1.使用本产品即代表您同意本条款的所有内容。</p><p>2.本产品中一言的“随机一言”功能由Ten·API提供，如若出现有关一言的“随机一言”的内容相关问题，请联系Ten·API，本产品不负责任</p><p>3.本产品中一言的“今日诗词”功能由jinrishici.com提供，如若出现有关一言的“今日诗词”的内容相关问题，请联系jinrishici.com，本产品不负责任</p><p>4.本产品中的搜索联想功能由百度提供，如若出现有关搜索联想的内容相关问题，请联系百度，本产品不负责任</p><p>5.本产品中背景的“必应壁纸”功能由bing.shangzhenyang.com和必应提供，如若出现有关背景的“必应壁纸”的图片内容相关问题，请联系bing.shangzhenyang.com和必应，本产品不负责任</p><p>6.本产品中背景的“随机二次元壁纸”功能由loliapi.com提供，如若出现有关背景的“随机二次元壁纸”的图片内容相关问题，请联系loliapi.com，本产品不负责任</p><p>7.本产品中背景的“随机风景壁纸”功能由api.gumengya.com提供，如若出现有关背景的“随机风景壁纸”的图片内容相关问题，请联系api.gumengya.com，本产品不负责任</p><p>8.本产品的随机背景API均支持下载壁纸，但这些壁纸仅能用做壁纸，禁止商业化使用</p><h2>三、插件使用须知</h2><p>1.本产品提供插件拓展功能，使用本产品的插件拓展功能即代表您知晓并同意本条款的所有内容。</p><p>2.安装官方提供的插件需要您同意插件的用户协议与隐私政策，若与本协议存在出入，以本协议为准</p><p>3.安装来自第三方的不明插件是十分不安全的行为，同时请保证您的设备未被病毒程序感染，<b>否则本产品不能保证您的数据安全和使用安全！</b></p><h2>四、隐私政策</h2><p>1.本产品本身属于纯前端项目，不会收集您的任何信息，您的所有数据都会存在本地</p><p>2.如您安装了插件，插件可能会收集您的一些信息，详见插件的用户协议与隐私政策。</p><p>3.本产品中使用的一些API和站点服务提供者可能会收集您的IP地址、Cookie等信息用于数据分析和安全防护等</p>";
  function getLicense(){
    return lichtml;
  }

  var licDialog=new dialog({
    content:` <div class="close">${util.getGoogleIcon('e5cd')}</div><div class="lic-con">${getLicense()}</div>`,
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
    class:"lic-dialog"
  });

  util.query(licDialog.getDialogDom(),'.close').onclick=function(){
    licDialog.close();
  }

  var thankhtml="<h1>特别鸣谢</h1><h2>感谢以下项目对QUIK的支持</h2><ul><li><a href=\"https://github.com/localForage/localForage\" target=\"_blank\">localforage</a> - 为indexedDB的管理提供一个方便的类似于localStorage的API</li><li><a href=\"https://github.com/siquan001/rem/\" target=\"_blank\">REM</a> - 简单的模块化工具（我做的）</li></ul><h2>感谢以下服务对QUIK的支持</h2><ul><li><a href=\"https://loliapi.com/\" target=\"_blank\">loliapi</a> - 双端自适应随机二次元图片API提供</li><li><a href=\"https://api.gumengya.com/\" target=\"_blank\">故梦API</a> - 随机风景图片API提供</li><li><a href=\"https://tenapi.cn/\" target=\"_blank\">Ten·API</a> - 随机一言API提供</li><li><a href=\"https://bing.com/\" target=\"_blank\">必应</a> | <a href=\"https://bing.shangzhenyang.com/\" target=\"_blank\">bing.shangzhenyang.com</a> - 每日必应壁纸API提供</li><li><a href=\"https://jinrishici.com/\" target=\"_blank\">jinrishici.com</a> - 随机诗词API提供</li><li><a href=\"https://baidu.com/\" target=\"_blank\">百度</a> - 搜索联想API提供</li><li><a href=\"https://github.com/\" target=\"_blank\">Github</a> - 静态网站托管服务提供</li></ul><h2>感谢以下可爱的人对QUIK的支持</h2><ul><li><a href=\"https://stear.cn/wm/\" target=\"_blank\">川上星林</a></li></ul><p>没有你们，就没有现在的QUIK起始页。</p>";
  var thaDialog=new dialog({
    content:`<div class="close">${util.getGoogleIcon('e5cd')}</div><div class="thank-con">${thankhtml}</div>`,
    class:"thank-dialog",
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN
  });

  util.query(thaDialog.getDialogDom(),'.close').onclick=function(){
    thaDialog.close();
  }

})();;
  !function(){
  window.version_code = 24;
  window.version={
    version:'2.0.0-dev',
    version_code:window.version_code,
    updateTime:'2024/4/20',
    log:[
      {
        tag:"new",
        content:"新增了很多方便的功能",
      }
    ]
  }
  if ('serviceWorker' in navigator&&!window._dev) {
    navigator.serviceWorker.ready.then(function (registration) {
      window.swReg=registration;
      quik.util.xhr('./version', function (r) {
        var nv = parseInt(r);
        if (nv > version_code) {
          registration.active.postMessage('update');
        }
      }, function () {
        console.log('获取版本失败');
      })
    });
    navigator.serviceWorker.addEventListener('message', function (e) {
      if (e.data == 'updated') {
        quik.confirm('新版本已准备就绪，是否刷新页面', function (v) {
          if (v) {
            localStorage.setItem('__q__s__','1');
            location.reload();
          }
        })
      }
    });
  }
  var version_dia=null;
  function showVersion(){
    if(!version_dia){
      version_dia=new dialog({
        content:`<h1>版本更新</h1><div class="version_item">
<div class="version_item_title">版本号：${window.version.version}</div>
<div class="version_item_update_time">发布时间：${window.version.updateTime}</div>
<div class="version_update">${formatVersion(window.version.log)}</div>
</div><div class="footer"><div class="btn ok">我知道了</div></div>`,
        class:"update_dialog"
      });
      util.query(version_dia.getDialogDom(),'.btn.ok').onclick=function(){
        version_dia.close();
      }
    }
    
    setTimeout(function(){
      version_dia.open();
    })
  }
  if(localStorage.getItem('__q__s__')){
    showVersion();
    localStorage.removeItem('__q__s__');
  }

  function formatVersion(fv){
    var str='',gl={
      "new":"新增",
      "del":"删除",
      "fix":"修复",
      "change":"修改",
      "thanks":"感谢"
    };
    for(var i=0;i<fv.length;i++){
      str+='<div class="update_item"><div class="update_item_tag '+fv[i].tag+'"><div>'+gl[fv[i].tag]+'</div></div><div class="update_item_content">'+fv[i].content+'</div></div>'
    }
    return str;
  }
}();
;
  

  window.quik={
    sync,
    addon:{
      installByOffcialMarket:addon.upinstallByOffcialMarMarket,
      installByUrl:addon.upinstallByUrl,
      uninstall:addon.upuninstall,
      update:addon.upupdate,
      getAddonByUrl:addon.getAddonByUrl,
      getAddonBySessionId:addon.getAddonBySessionId,
      getAddonList:addon.getAddonList,
    },
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
    theme,
    card
  }
  clearTimeout(loadingtimeout);
  document.querySelector("main").style.display='block';
  document.querySelector(".loading-f").classList.add('h');
})();