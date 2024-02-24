(function(){
  var tab1,setbg,tab2,tab3;
  var initsto=storage('bg-def-user');
  if(!initsto.get('color')){
    initsto.set('color',{
      dark:"#333333",
      light:'#ffffff'
    })
  }
  var acgbg=_REQUIRE_('../api/acgbg.js');
  var fjbg=_REQUIRE_('../api/fenjibg.js');
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

  function hasUploadedImg(){
    return !!initsto.get('userbg');
  }

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
      util.query(document.head,'style.colorSpControl').innerHTML=`.color-sp{background-color:${data.light};}body.dark .color-sp{background-color:${data.dark};}`
    },
    api:function(bgf,data){
      if(data.api=='acg'){
        refreshApiIcon.show();
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
      }else if(data.api=='fj'){
        refreshApiIcon.show();
        refreshApiIcon.getIcon().classList.add('round-anim');
        fjbg.getImg(function(d){
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
          fjbg.getImg(function(d){
            refreshApiIcon.getIcon().classList.remove('round-anim');
            draws.img(bgf,{
              url:d.url
            });
            if(d.candownload){
              downloadIcon.show();
            }
          })
        }
      }else if(data.api=='bing'){
        draws.img(bgf,{
          url:"https://bing.shangzhenyang.com/api/1080p"
        });
        downloadIcon.show();
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
      util.query(document.head,'style.zdySpControl').innerHTML=`.zdy-sp{background:${data.light};}body.dark .zdy-sp{background:${data.dark};}`
    }
  }

  // 图片、视频上传器
  var iovuploader=new dialog({
    content:_REQUIRE_('./htmls/iovuploader.html'),
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
    util.query(tab1,'.hasBg').style.display='block';
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
    content:_REQUIRE_('./htmls/colorchanger.html')
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
      var c=initsto.get('color');
      util.query(tab2,'.zdy .color-left').style.backgroundColor=c.light;
      util.query(tab2,'.zdy .color-right').style.backgroundColor=c.dark;
      util.query(tab2,'.zdy .left').onclick=function(){
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