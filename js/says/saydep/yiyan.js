(function(){

  // 因tenapi即将关停（https://5ime.cn/tenapi-issue-bankruptcy.html），所以换回hitokoto官方API。
  var hitokoto={
    load:function(fn){
      var i_=0;
      function g(){
        util.xhr('https://v1.hitokoto.cn/',function(res){
          fn(JSON.parse(res));
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
            from:res.from,
            uuid:res.uuid,
            cat:res.type,
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
        var c=hitokoto.cats[nowSay.cat];
        openSayDetailsDialog({
          'API':"Hitokoto (hitokoto.cn)",
          '内容':nowSay.say,
          '来源':nowSay.from,
          '上传者':nowSay.from_who,
          '分类':c?c:'未知',
          'UUID':nowSay.uuid
        })
      }
    }]
  }
})()