(function(){
  var k={
    SA:[],
    enter:[],
  }

  if(initsto.get('ob_justsearch')==undefined){
    initsto.set('ob_justsearch',false);
  }
  if(initsto.get('ob_http')==undefined){
    initsto.set('ob_http',false);
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

  var searchUtil=_REQUIRE_("../search/util.js");

  function checkUrl(text){
    if(initsto.get('ob_justsearch')){
      return false;
    }
    return util.checkUrl(text);
  };

  addNewType({
    check:function(){
      return true;
    },
    enter:function(text){
      open(searchUtil.getSearchType().replace(searchUtil.keywordText,encodeURIComponent(text)));
    },
    icon:":searchtype",
    submit:util.getGoogleIcon('E8B6')
  });

  addNewType({
    check:checkUrl,
    enter:function(text){
      if(text.indexOf('://')==-1){
        text=((!!initsto.get('ob_http'))?'https://':'http://')+text;
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
          open(searchUtil.getSearchType().replace(searchUtil.keywordText,encodeURIComponent(text)));
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
        searchfetch=util.jsonp('https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&wd='+text,function(res){
          var a2=getsa();
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
              text=((!!initsto.get('ob_http'))?'https://':'http://')+text;
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
      return !!initsto.get('ob_justsearch');
    },
    callback:function(value){
      initsto.set('ob_justsearch',value);
      if(value){
        ui.input.placeholder='搜索'
      }else{
        ui.input.placeholder='搜索或输入网址'
      }
      return true;
    }
  })

  var si2=new SettingItem({
    title:"默认HTTPS打开链接",
    index:1,
    type:'boolean',
    message:"打开后，搜索框打开链接在默认情况下使用HTTPS",
    get:function(){
      return !!initsto.get('ob_http');
    },
    callback:function(value){
      initsto.set('ob_http',value);
      return true;
    }
  })
  sg.addNewItem(si);
  sg.addNewItem(si2);
  
  return {
    getSA:getSA,
    enter:enter,
    getType:getType,
    addNewType:addNewType,
    addNewSA:addNewSA,
    searchUtil:searchUtil,
    initsto:initsto,
    setJustSearch:function(value){
      initsto.set('ob_justsearch',value);
      si.reGet();
    }
  }
})();