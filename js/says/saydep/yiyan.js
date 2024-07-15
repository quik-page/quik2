(function(){
  var hitokoto={
    load:function(fn){
      var i_=0;
      function g(){
        util.xhr('https://api.gumengya.com/Api/YiYan?format=json',function(res){
          fn(JSON.parse(res).data);
        },function(){
          i_++;
          if(i_<=5)g();
        })
      }
      g();
    }
  }

  return {
    key:"hitokoto",
    name:"随机一言",
    callback:function(){
      return new Promise(function(resolve,reject){
        hitokoto.load(function(res){
          resolve({
            say:res.text,
            title:"来自故梦API"
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
          'API':"故梦API",
          '内容':nowSay.say,
          '来源':'故梦'
        })
      }
    }]
  }
})()