(function(){
  var initsto=storage('says');
  var jinrishici=_REQUIRE_('./api/jinrishici.js');
  var hitokoto=_REQUIRE_('./api/hitokoto.js');

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
  <button class="cancel btn">取消</button>
  <button class="ok btn">确定</button>
</div>`
      })

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
})();