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

    util.query(logoF,'.timelogo .h').innerHTML=util.query(logoF,'.timelogo .m').innerHTML=createNum()+createNum();

    function createNum(){
      var h='';
      for(var i=0;i<7;i++){
        h+='<div class="num_line a'+i+'"></div>'
      }
      return '<div class="_num">'+h+'</div>'
    }

    function setNum(_num,num){
      var m={
        0:"1110111",
        1:"0010010",
        2:"1011101",
        3:"1011011",
        4:"0111010",
        5:"1101011",
        6:"1101111",
        7:"1010010",
        8:"1111111",
        9:"1111011"
      }
      var f=m[num];
      for(var i=0;i<7;i++){
        var _l=util.query(_num,'.a'+i);
        if(f[i]=='1'){
          _l.classList.add('show');
        }else{
          _l.classList.remove('show');
        }
      }
    }

    var isdotime=false;
    function doTime(){
        if(isdotime)return;
        isdotime=true;
        setInterval(function(){
            var da=new Date();
            var h=util.b0(da.getHours()).toString();
            var m=util.b0(da.getMinutes()).toString();
            var hs=util.query(logoF,'.timelogo .h ._num',true)
            var ms=util.query(logoF,'.timelogo .m ._num',true)
            setNum(hs[0],h[0]);
            setNum(hs[1],h[1]);
            setNum(ms[0],m[0]);
            setNum(ms[1],m[1]);
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