(function(){
    var logoF=document.querySelector('main .center .logo');
    var si=new SettingItem({
        index:4,
        title:"时间LOGO",
        message:"将当前时间作为LOGO",
        type:"boolean",
        get:function(){
          return !!initsto.get('timelogo');
        },
        callback:function(v){
          initsto.set('timelogo',v);
          d(v);
        }
      })

    var isdotime=false;
    function doTime(){
        if(isdotime)return;
        isdotime=true;
        setInterval(function(){
            var da=new Date();
            util.query(logoF,'.timelogo .h').innerText=util.b0(da.getHours());
            util.query(logoF,'.timelogo .m').innerText=util.b0(da.getMinutes());
        },100);
    }
    

    function d(v){
        if(v){
            util.query(logoF,'.timelogo').style.display='block';
            util.query(logoF,'.imglogo').style.display='none';
            doTime();
        }else{
            util.query(logoF,'.imglogo').style.display='block';
            util.query(logoF,'.timelogo').style.display='none';
        }
    }
    d(initsto.get('timelogo'));

    tyGroup.addNewItem(si);

    return {
        set:function(a){
          a=!!a;
          initsto.set('timelogo',a);
          d(a);
          si.reGet();
        },
        get:function(){
          return initsto.get('timelogo');
        }
      }
})();