(function(){
  var tab1,setbg;
  var initsto=storage('bg-def-user');
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

  function loadimg(url,cb){
    var img=new Image();
    img.src=url;
    img.onload=function(){
      cb(true);
    }
    img.onerror=function(){
      cb(false);
    }
  }

  function hasUploadedImg(){
    return !!initsto.get('upload');
  }

  var refreshApiIcon=new iconc.icon({
    content:util.getGoogleIcon('e86a'),
    offset:"br"
  });
  refreshApiIcon.hide();
  var refreshFn=function(){}

  refreshApiIcon.getIcon().onclick=function(){
    refreshFn.call(this);
  };

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
      
    },
    api:function(bgf,data){
      if(data.api=='acg'){
        var url=urlnocache(acgbg.getImg().url);
        draws.img(bgf,{
          url:url
        });
        refreshApiIcon.show();
        refreshFn=function(){
          var url=urlnocache(acgbg.getImg().url);
          this.classList.add('round-anim');
          var _=this;
          loadimg(url,function(ok){
            if(ok){
              _.classList.remove('round-anim');
              draws.img(bgf,{
                url:url
              });
            }else{
              refreshFn.call(_);
            }
          })
          
        }
      }else if(data.api=='fj'){
        var url=urlnocache(fjbg.getImg().url);
        draws.img(bgf,{
          url:url
        });
        refreshApiIcon.show();
        refreshFn=function(){
          var url=urlnocache(fjbg.getImg().url);
          this.classList.add('round-anim');
          var _=this;
          loadimg(url,function(ok){
            if(ok){
              _.classList.remove('round-anim');
              draws.img(bgf,{
                url:url
              });
            }else{
              refreshFn.call(_);
            }
          })
        }
      }else if(data.api=='bing'){
        draws.img(bgf,{
          url:"https://bing.shangzhenyang.com/api/1080p"
        });
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

    }
  }

  // 图片、视频上传器
  var iovuploader=new dialog({
    content:`
    <form>
      <h1>上传背景</h1>
      <div class="content">
        <p>背景类型：<input type="radio" class="uploadi" name="uploadiov" checked/> 图片 
        <input type="radio" class="uploadv" name="uploadiov"/> 视频 </p>
        <p>背景URL：<input type="url" placeholder="URL"/></p>
        <p>从本地选择文件：<input type="file"/></p>
        <p class="tip">URL和文件只需填写一个即可，优先选择本地文件</p>
      </div>
      <div class="footer">
        <div class="cancel btn">取消</div>
        <button class="ok btn">确定</button>
      </div>
    </form>
  `,
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
      console.log(file);
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

  //获取视频快照（第一帧）
  function getVideoCaptrue(url,cb){
    var video=util.element('video',{
      src:url,
      crossOrigin:'anonymous',//跨域处理
      autoplay:"autoplay"// 需要加autoplay才能正常工作
    });
    document.body.append(video);
    video.oncanplay=function(){
      video.currentTime=video.duration/4;
      var canvas=document.createElement('canvas');
      canvas.width=video.videoWidth;
      canvas.height=video.videoHeight;
      var ctx=canvas.getContext('2d');
      ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight);
      var u=canvas.toDataURL('image/png');
      cb(u);
      video.remove();
    }
    
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
          util.query(tab1,'.bgitem',true).forEach(function(b){
            b.classList.remove('selected');
          })
          this.parentElement.classList.add('selected');
        }else{
          iovuploader.open();
        }
      })
      util.query(tab1,'.zdy .editbtn').addEventListener('click',function(){
        iovuploader.open();
      });

      // 内置图片
      var u=util.query(tab1,'.neizhi .unit-content');
      var _=this;
      neizhiImg.forEach(function(im){
        var bgitem=util.element('div',{
          class:"bgitem def",
          'data-img':im.img,
        });
        bgitem.innerHTML='<div class="left"><img src="'+im.thumbnail+'"/></div>'
        u.appendChild(bgitem);
        util.query(bgitem,'.left').onclick=function(){
          util.query(tab1,'.bgitem',true).forEach(function(b){
            b.classList.remove('selected');
          })
          bgitem.classList.add('selected');
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
          util.query(tab1,'.bgitem',true).forEach(function(b){
            b.classList.remove('selected');
          })
          l.parentElement.classList.add('selected');
          e.setbg({
            type:e.type,
            data:{
              type:"api",
              api:l.getAttribute('data-api')
            }
          })
        });
      });


      // pushTab 纯色
      e.pushBgTab({
        tab:"纯色",
        content:_REQUIRE_('./htmls/colorbgtab.html')
      })
      // pushTab 自定义
      e.pushBgTab({
        tab:"自定义",
        content:_REQUIRE_('./htmls/custombgtab.html')
      })
    },
    destory: function (n) {
      // TODO
    },
    cancel: function (n) {
      n.bgf.innerHTML='';
      document.body.classList.remove('t-dark');
      refreshApiIcon.hide();
      refreshFn=function(){}
    },
    draw:function(n){
      var bgf=n.bgf;
      var data=n.data;
      refreshApiIcon.hide();
      refreshFn=function(){}
      draws[data.type](bgf,data);
    }
  }
})();