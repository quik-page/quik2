(function(){
  var initsto=storage('says');
  var jinrishici=_REQUIRE_('./api/jinrishici.js');
  var hitokoto=_REQUIRE_('./api/hitokoto.js');

  var sayTypes=['user','jinrishici','hitokoto'];

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

  sayC.onclick=function(e){
    e.stopPropagation();
    if(nowsaystype=='user'){
      sayMenu.setList([{
        icon:util.getGoogleIcon('e3c9'),
        title:'修改',
        click:function(){
          openSaysEditor();
        }
      },{
        icon:util.getGoogleIcon('e14d'),
        title:'复制',
        click:function(){
          // 用document.execCommand 把 sayI的内容复制到剪切板
          var value=sayI.innerText;
          util.copyText(value);
        }
      }])
    }else if(nowsaystype=='jinrishici'){
      sayMenu.setList([{
        icon:util.getGoogleIcon('e5d5'),
        title:'刷新',
        click:function(){
          sayI.click();
        }
      },{
        icon:util.getGoogleIcon('e14d'),
        title:'复制',
        click:function(){
          // 用document.execCommand 把 sayI的内容复制到剪切板
          var value=sayI.innerText;
          util.copyText(value);
        }
      },{
        icon:util.getGoogleIcon('e88e'),
        title:'诗句详情',
        click:function(){
          util.query(infd,'ul').innerHTML=(function(){
            var str='';
            for(var k in sjp){
              str+='<li><b>'+k+':</b> '+sjp[k]+'</li>';
            }
            return str;
          })();
          sayinfoDialog.open();
        }
      }])
    }else if(nowsaystype=='hitokoto'){
      sayMenu.setList([{
        icon:util.getGoogleIcon('e5d5'),
        title:'刷新',
        click:function(){
          sayI.click();
        }
      },{
        icon:util.getGoogleIcon('e14d'),
        title:'复制',
        click:function(){
          // 用document.execCommand 把 sayI的内容复制到剪切板
          var value=sayI.innerText;
          util.copyText(value);
        }
      },{
        icon:util.getGoogleIcon('e88e'),
        title:'一言详情',
        click:function(){
          util.query(infd,'ul').innerHTML=(function(){
            var str='';
            for(var k in sjp){
              str+='<li><b>'+k+':</b> '+sjp[k]+'</li>';
            }
            return str;
          })();
          sayinfoDialog.open();
        }
      }])
    }
    var bo=sayC.getBoundingClientRect()
    sayMenu.setOffset({
      bottom:window.innerHeight-bo.top,
      left:bo.left-90+bo.width
    });
    sayMenu.show();
  }

  if(!initsto.get('usersay')){
    initsto.set('usersay',def);
  }

  if(!initsto.get('saytype')){
    initsto.set('saytype','user');
  }

  var nowsaystype=null,sjp={};
  function initSays(saytype){
    nowsaystype=saytype;
    if(saytype=='user'){
      sayI.innerText=initsto.get('usersay');
      sjp={};
    }else if(saytype=='jinrishici'){
      sayI.innerText='...';
      jinrishici.load(function(res){
        sayI.innerHTML=res.data.content;
        sjp={
          'API':"jinrishici",
          '内容':res.data.content,
          '作者':'('+res.data.origin.dynasty+')'+res.data.origin.author,
          '标题':'《'+res.data.origin.title+'》',
          '标签':res.data.matchTags.join(' '),
          '全部内容':'<br>'+res.data.origin.content.join('<br>')
        }
      })
    }else if(saytype=='hitokoto'){
      sayI.innerText='...';
      hitokoto.load(function(res){
        sayI.innerText=res.hitokoto;
        sjp={
          'API':"hitokoto",
          '内容':res.hitokoto,
          '来自':res.from,
          '上传者':res.from_who,
          'UUID':res.uuid
        }
      })
    }
  }

  sayI.addEventListener('click',function(){
    if(nowsaystype=='user'){
      openSaysEditor();
    }else if(nowsaystype=='jinrishici'){
      sayI.innerHTML='...';
      jinrishici.load(function(res){
        sayI.innerHTML=res.data.content;
        sjp={
          'API':"jinrishici",
          '内容':res.data.content,
          '作者':'('+res.data.origin.dynasty+')'+res.data.origin.author,
          '标题':'《'+res.data.origin.title+'》',
          '标签':res.data.matchTags.join(' '),
          '全部内容':'<br>'+res.data.origin.content.join('<br>')
        }
      })
    }else if(nowsaystype=='hitokoto'){
      sayI.innerHTML='...';
      hitokoto.load(function(res){
        sayI.innerHTML=res.hitokoto;
        sjp={
          'API':"hitokoto",
          '内容':res.hitokoto,
          '来自':res.from,
          '上传者':res.from_who,
          'UUID':res.uuid
        }
      })
    }
  });

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
    initSays(initsto.get('saytype'));
  }else{
    sayF.style.display='none';
  }
  // initSays('jinrishici');

  setting.registerSetting({
    unit:"一言",
    title:"显示一言",
    message:"在页面下方显示一句话",
    index:0,
    type:'boolean',
    get:function(){
      return initsto.get('enabled');
    },
    callback:function(value){
      initsto.set('enabled',value);
      if(value){
        if(!nowsaystype){
          initSays(initsto.get('saytype'));
        }
        sayF.style.display='block';
      }else{
        sayF.style.display='none';
      }
      return true;
    }
  })
  setting.registerSetting({
    unit:"一言",
    title:"一言类型",
    message:"一言类型设置",
    index:1,
    type:'select',
    get:function(){
      return initsto.get('saytype');
    },
    init:function(){
      return {
        'user':"自定义",
        'jinrishici':"今日诗词",
        'hitokoto':"随机一言"
      };
    },
    check:function(value){
      return sayTypes.indexOf(value)!=-1;
    },
    callback:function(value){
      initSays(value);
      initsto.set('saytype',value);
      return true;
    }
  })
})();