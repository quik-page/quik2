(function(){
  var tab1,setbg,tab2,tab3;
  if(!initsto.get('usercolor')){
    initsto.set('usercolor',{
      dark:"#333333",
      light:'#ffffff'
    })
  }
  if(!initsto.get('ivsetting')){
    initsto.set('ivsetting',{
      mb:50,
      isbr:false,
      br:6
    })
  }
  var acgbg=_REQUIRE_('../api/acgbg.js');
  var fjbg=_REQUIRE_('../api/fenjibg.js');
  var neizhiImg=_REQUIRE_('./_defaultDrawer/neizhi.json');

  var refreshApiIcon=new iconc.icon({
    content:util.getGoogleIcon('e86a'),
    offset:"br",
    important:true
  });
  refreshApiIcon.hide();
  var downloadIcon=new iconc.icon({
    content:util.getGoogleIcon('f090'),
    offset:"br"
  });
  downloadIcon.hide();
  downloadIcon.getIcon().onclick=function(){
    window.open(document.querySelector(".bgf img").src);
  }

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

  var ImgOrVideoSe=_REQUIRE_('./_defaultDrawer/ivbgse.js');

  // dot-timeb
  // @note 这里需要一个定时器用于api背景 时间的颜色
  var timeb=null;

  var draws={
    img:function(bgf,data){
      bgf.innerHTML='<div class="img-sp full"><div class="cover"></div><img src="'+data.url+'"/></div>';
      document.body.classList.add('t-dark');
      ImgOrVideoSe.show();
    },
    video:function(bgf,data){
      bgf.innerHTML='<div class="video-sp full"><div class="cover"></div><video src="" muted loop></video></div>'
      util.query(bgf,'.video-sp video').src=data.url;
      util.query(bgf,'.video-sp video').oncanplay=function(){
        this.play();
      }
      document.body.classList.add('t-dark');
      ImgOrVideoSe.show();
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
    api:_REQUIRE_('./_defaultDrawer/apidraw.js'),
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
    hasUploadedImg
  }=_REQUIRE_('./_defaultDrawer/userupload.js');

  _REQUIRE_('./_defaultDrawer/zdycolor.js');

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
    ImgOrVideoSe.hide();
  }
  
  return {
    type: "default",
    init: function (e) {
      setbg=e.setbg;
      // pushTab 图片/视频
      tab1=e.pushBgTab({
        tab:"图片/视频",
        content:_REQUIRE_('./htmls/imgvideobgtab.html')
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
        bgitem.innerHTML='<div class="left"><img src="'+im.thumbnail+'" loading="lazy"/></div>'
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
        content:_REQUIRE_('./htmls/colorbgtab.html')
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
        content:_REQUIRE_('./htmls/custombgtab.html')
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
})();