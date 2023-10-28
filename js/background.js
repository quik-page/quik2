(function(){
  var erciyuanbg=_REQUIRE_('./api/erciyuanbg.js');
  var fenjibg=_REQUIRE_('./api/fenjibg.js');

  var bgf=util.element('div',{
    class:"bgf"
  });

  var bgcover=util.element('div',{
    class:"bgcover"
  });

  var bgi=util.element('div',{
    class:"bgi"
  });

  util.query(document,'body').appendChild(bgf);
  bgf.appendChild(bgcover);
  bgf.appendChild(bgi);

  var initsto=storage('background');

  // 初始化用户存储
  function initStorage(){
    if(!initsto.get('bg')){
      initsto.set('bg','color-#fff-#333');
    }
    if(!initsto.get('usercolor')){
      initsto.set('usercolor','#fff-#333');
    }
    if(!initsto.get('usergjzdy')){
      initsto.set('usergjzdy',{
        light:'',
        dark:""
      })
    }
  }
  initStorage();

  var intervals=[];

  var INIT_SHOWTYPE={
    // 宽度占满对话框，含标题信息
    full:0,
    // 宽度占一半，含标题信息
    half:1,
    // 默认宽度，不含标题信息
    def:2,
  }
  // 背景对话框内容
  var initalBgs=[{
    tab:"图片/视频",
    content:{
      "自定义":[
        {
          showtype:INIT_SHOWTYPE.full,
          img:function(){
            return new Promise((r,j)=>{
              getUserUploadUrl(function(res){
                if(res) r(res);
              })
            })
          },
          out:"userzdyi",//抛出一个classname以方便外部控制
          select:'user-upload',// 这是选择后背景的抽象字符串
          title:"上传你喜欢的图片或视频作为背景",
          text:"点击左边图片设置背景，点击<a class=\"updateImgOrVideo\" href=\"javascript:;\">此处</a>上传图片或视频，你可以通过输入图片或视频URL的方式设置，也可以从你的设备本地上传"
        }
      ],
      "内置":[
        {
          showtype:INIT_SHOWTYPE.def,
          img:"https://image.gumengya.com/thumbnails/06470348c93db185e44f8acd87c5b683.png",
          select:"img-https://image.gumengya.cn/i/2023/10/13/65294cf55ef7d.png",
        },
        {
          showtype:INIT_SHOWTYPE.def,
          img:"https://image.gumengya.com/thumbnails/5e6200d4552394e722967ef96addd06a.png",
          select:"img-https://image.gumengya.cn/i/2023/10/13/65294c34841b4.jpg",
        },
        {
          showtype:INIT_SHOWTYPE.def,
          img:"https://image.gumengya.com/thumbnails/7ee6991ee0f43be59c28d183597e0cca.png",
          select:"img-https://image.gumengya.cn/i/2023/10/13/65294c30563b7.jpg",
        },
        {
          showtype:INIT_SHOWTYPE.def,
          img:"https://image.gumengya.com/thumbnails/ff674343879116e22e3cf713358f2cb5.png",
          select:"img-https://image.gumengya.com/thumbnails/ff674343879116e22e3cf713358f2cb5.png",
        },
        {
          showtype:INIT_SHOWTYPE.def,
          img:"https://image.gumengya.com/thumbnails/c9c187157ca050044a6589f230e8ddbf.png",
          select:"img-https://image.gumengya.cn/i/2023/10/13/65294c2d8aae1.png",
        }
      ],
      "API":[
        {
          showtype:INIT_SHOWTYPE.half,
          img:function(){
            return "https://bing.shangzhenyang.com/api/1080p";
          },
          select:"api-bing",
          title:"必应壁纸",
          text:"获取必应首页的壁纸作为背景"
        },
        {
          showtype:INIT_SHOWTYPE.half,
          img:function(){
            return erciyuanbg.getImg(1).url;
          },
          select:"api-2cy",
          title:"随机二次元壁纸",
          text:"获取随机二次元壁纸作为背景，背景提供：loliapi.com"
        },
        {
          showtype:INIT_SHOWTYPE.half,
          img:function(){
            return fenjibg.getImg(1).url;
          },
          select:"api-fj",
          title:"随机风景壁纸",
          text:"获取随机风景壁纸作为背景，背景提供：imgapi.cn"
        },
      ]
    }
  },{
    tab:"纯色",
    content:{
      "自定义":[
        {
          showtype:INIT_SHOWTYPE.full,
          color:function(){
            return new Promise((r,j)=>{
              // 获取用户自定义颜色
              r(initsto.get('usercolor').split('-'))
            })
          },
          out:"userzdyc",
          select:"user-color",
          title:"将你喜欢的颜色作为背景",
          text:"点击左边的方块设置背景，点击<a class=\"updateColor\" href=\"javascript:;\">此处</a>编辑颜色",
        }
      ],
      "内置":[
        {
          showtype:INIT_SHOWTYPE.def,
          color:"#fff-#333",
          select:"color-#fff-#333"
        },{
          showtype:INIT_SHOWTYPE.def,
          color:"#f1f1fe-#3e3e31",
          select:"color-#f1f1fe-#3e3e31"
        }
      ],
      "API":[
        {
          showtype:INIT_SHOWTYPE.half,
          color:function(){
            return [getNowColor(0),getNowColor(1)];
          },
          select:"api-time",
          title:"时间的颜色",
          text:"获取当前时间的颜色作为背景，详情<a class=\"timeColorInfo\" href=\"javascript:;\">此处</a>"
        }
      ]
    }
  },{
    tab:"高级自定义",
    content:`
    <p>浅色模式：</p><br>
    <textarea class="gjzdytlight textarea"></textarea>
    <p>深色模式：</p><br>
    <textarea class="gjzdytdark textarea"></textarea>
    <button class="gjzdysetbtn">设置</button>
    <p class="tip">参见 CSS | background属性</p>
    `
  }]

  //时间的颜色API
  function getNowColor(a){
    var date=new Date();
    if(typeof a=='number'){
      if(a==0){
       return `rgb(${256-date.getHours()},${256-date.getMinutes()},${256-date.getSeconds()})`;
      }else{
       return `rgb(${date.getHours()},${date.getMinutes()},${date.getSeconds()})`;
      }
    }else{
     if(document.body.classList.contains('dark')){
       return `rgb(${date.getHours()},${date.getMinutes()},${date.getSeconds()})`;
     }else{
       return `rgb(${256-date.getHours()},${256-date.getMinutes()},${256-date.getSeconds()})`;
     }
    }
  }

  // 方便控制不同主题下的背景样式
  var styleElement=util.element('style');
  document.head.append(styleElement);

  // 处理并应用抽象背景字符串
  function chulibg(bgv){
    // 清理定时器
    intervals.forEach(function(item){
      clearInterval(item);
    });
    intervals=[];

    //清理背景和样式
    bgi.innerHTML='';
    styleElement.innerHTML='';
    document.body.classList.remove('t-dark');

    //处理抽象背景字符串
    bgv=bgv.split('-');

    // 背景类型
    var lx=bgv[0];

    bgv.shift();
    
    // 背景内容
    var value=bgv.join('-');
    if(lx=='def'){
      return;
    }else if(lx=='img'){
      bgi.innerHTML=`<img src="${value}"/>`;
      document.body.classList.add('t-dark');
      // 图片或视频为背景时，采用初步dark主题会更好看
    }else if(lx=='video'){
      bgi.innerHTML=`<video src="${value}" autoplay loop muted></video>`;
      document.body.classList.add('t-dark');
    }else if(lx=='color'){
      // color分亮暗主题
      styleElement.innerHTML=`.bgi{background:${value.split('-')[0]};}body.dark .bgi{background:${value.split('-')[1]};}`
    }else if(lx=='api'){
      if(value=='2cy'){
        // 二次元
        bgi.innerHTML=`<img src="${urlnocache(erciyuanbg.getImg().url)}"/>`
        util.query(bgi,'img').onerror=function(){
          this.src=urlnocache(erciyuanbg.getImg().url);
        }
        document.body.classList.add('t-dark');
      }else if(value=='fj'){
        // 风景
        bgi.innerHTML=`<img src="${urlnocache(fenjibg.getImg().url)}"/>`
        util.query(bgi,'img').onerror=function(){
          this.src=urlnocache(fenjibg.getImg().url);
        }
        document.body.classList.add('t-dark');
      }else if(value=='bing'){
        // bing
        bgi.innerHTML=`<img src="${urlnocache("https://bing.shangzhenyang.com/api/1080p")}"/>`
        util.query(bgi,'img').onerror=function(){
          this.src=urlnocache("https://bing.shangzhenyang.com/api/1080p");
        }
        document.body.classList.add('t-dark');
      }else if(value=='time'){
        // 时间的颜色
        intervals.push(setInterval(function(){
          bgi.style.backgroundColor=getNowColor();
        },1000))
      }
    }else if(lx=='user'){
      //用户自定义
      if(bgv=='upload'){
        // 图片或视频
        var a=initsto.get('userbg');
        if(!a) return;

        document.body.classList.add('t-dark');
        if(a.type=='video'){
          var b=a.upasdb;
          if(b){
            initsto.get('useruploaderbg',true,function(blob){
              bgi.innerHTML=`<video src="${URL.createObjectURL(blob)}" autoplay loop muted></video>`;
            })
          }else{
            bgi.innerHTML=`<video src="${a.url}" autoplay loop muted></video>`;
          }
        }else if(a.type=='image'){
          var b=a.upasdb;
          if(b){
            initsto.get('useruploaderbg',true,function(blob){
              bgi.innerHTML=`<img src="${URL.createObjectURL(blob)}"/>`;
            })
          }else{
            bgi.innerHTML=`<img src="${a.url}"/>`;
          }
        }
      }else if(bgv=='color'){
        //颜色
        var value=initsto.get('usercolor');
        styleElement.innerHTML=`.bgi{background:${value.split('-')[0]};}body.dark .bgi{background:${value.split('-')[1]};}`
      }else if(bgv=='gjzdy'){
        //高级自定义
        var value=initsto.get('usergjzdy');
        styleElement.innerHTML=`.bgi{background:${value.light};}body.dark .bgi{background:${value.dark};}`
      }
    }
  }

  // 避免缓存（用于图片API）
  function urlnocache(url){
    return url+(url.indexOf('?')>-1?'&':'?')+'t='+new Date().getTime();
  }

  // 背景设置对话框
  var bg_set_d=new dialog({
    content:`<div class="actionbar">
    <h1>背景设置</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
  </div>
  <div class="tab_con"></div>
  <div class="scroll_con"></div>
  `,
    class:"bg_d",
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN
  });

  // 背景设置对话框Dom
  var d=bg_set_d.getDialogDom();

  // 关闭按钮
  util.query(d,'.closeBtn').onclick=function(){
    bg_set_d.close();
  }

  // 背景设置对话框Tab
  var tab_con=util.query(d,'div.tab_con');

  // 背景设置对话框内容
  var scroll_con=util.query(d,'div.scroll_con');

  // 实例化
  initalBgs.forEach(function(item,i){
    var tab=item.tab; // tab标题

    // 一个tab标签
    var tabitem=util.element('div',{
      class:'tabitem',
      'data-tab':i //TabID，方便控制
    });
    tab_con.appendChild(tabitem);
    tabitem.innerHTML=tab;
    // 点击时跳转至该Tab
    tabitem.onclick=function(){
      activeTab(this.getAttribute('data-tab'));
    }

    // 内容
    var scrollitem=util.element('div',{
      class:'scrollitem',
      'data-tab':i //对应TabID，方便控制
    });
    scroll_con.appendChild(scrollitem);
    
    // 如果item.content是字符串的化，直接写入
    if(typeof item.content=='string'){
      scrollitem.innerHTML=item.content;
      return;
    }

    // 否则对item.content对象进行解析
    for(var k in item.content){
      var unititem=util.element('div',{
        class:"unititem"
      });
      unititem.innerHTML=`<div class="unit-title">${k}</div><div class="unit-content"></div>`;
      item.content[k].forEach(function(it,i){
        // 一个背景选项
        var bgitem=util.element('div',{
          class:"bgitem "+['full','half','def'][it.showtype]+" "+it.out??'',
          'data-select':it.select,
        });
        if(it.showtype==INIT_SHOWTYPE.def){
          //默认则不用处理信息
          bgitem.innerHTML=_shilifk(it,bgitem);
        }else if(it.showtype==INIT_SHOWTYPE.full||it.showtype==INIT_SHOWTYPE.half){
          //其它处理信息
          bgitem.innerHTML=_shilifk(it,bgitem)+_shilimessage(it);
        }
        util.query(unititem,'.unit-content').append(bgitem);
        util.query(bgitem,'.fk').onclick=function(){
          // 点击改变背景
          changeBg(this.parentElement.getAttribute('data-select'));
        }
      })
      scrollitem.append(unititem);
    }

  });

  function _shilifk(it,bgitem){
    var str='';
    if(it.img){
      if(typeof it.img=='string'){
        str=`<div class="fk"><img src="${it.img}"></div>`
      }else{
        var src=it.img();
        if(src instanceof Promise){
          str=`<div class="fk"></div>`;
          src.then(function(url){
            util.query(bgitem,'.fk').innerHTML=`<img src="${url}"/>`;
          })
        }else{
          str=`<div class="fk"><img src="${src}"></div>`
        }
      }
    }else if(it.color){
      if(typeof it.color=='string'){
        var colors=it.color.split('-');
        str= _shilifk_color_str(colors);
      }else{
        var colors=it.color();
        if(colors instanceof Promise){
          str=`<div class="fk"></div>`;
          colors.then(function(colors){
            util.query(bgitem,'.fk').innerHTML= _shilifk_color_str(colors,true);
          })
        }else{
          str=_shilifk_color_str(colors);
        }
      }
    }
    return str;
  }
  function _shilifk_color_str(colors,a){
    return `${a?'':'<div class="fk">'}
    <div class="leftcolorbox" style="background:${colors[0]}"></div>
    <div class="rightcolorbox" style="background:${colors[1]}"></div>
    ${a?'':'</div>'}`
  }

  util.query(scroll_con,'.updateImgOrVideo').onclick=function(){
    iovuploader.open();
  }
  function _shilimessage(it){
    return `<div class="bg-message">
      <div class="bg-message-title">${it.title}</div>
      <div class="bg-message-text">${it.text}</div>
    </div>`
  }

  // 改变背景
  function changeBg(select){
    // 存储改变
    initsto.set('bg',select);
    // 处理背景
    chulibg(select);
    // 给对应bgitem设置active
    var setbgi= util.query(scroll_con,'.bgitem.selected');
    setbgi&&setbgi.classList.remove('selected');
    var ybgi=util.query(scroll_con,'.bgitem[data-select="'+select+'"');
    ybgi&&ybgi.classList.add('selected');
  }

  // activeTab
  function activeTab(i){
    util.query(d,'.tabitem',true).forEach(function(t){
      t.classList.remove('active');
    });
    util.query(d,'.scrollitem',true).forEach(function(t){
      t.style.display='';
    });
    util.query(d,'.tabitem[data-tab="'+i+'"]').classList.add('active');
    util.query(d,'.scrollitem[data-tab="'+i+'"]').style.display='block';
  }

  //开始activeTab0
  activeTab('0');

  // 在设置添加背景设置选项
  setting.registerSetting({
    title:"设置背景",
    unit:"背景",
    message:"",
    callback:function(){
      bg_set_d.open();
    }
  });

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
        <button class="cancel btn">取消</button>
        <button class="ok btn">确定</button>
      </div>
    </form>
  `,
    class:"iovuploader",
  })
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
    util.query(d,'.userzdyi .fk img').src='';
    if(file){
      // File优先

      // 将内容写入idb
      initsto.set('useruploaderbg',file,true,function(){
        iovuploader.close();
        getUserUploadUrl(function(r){
          // 获取并设置背景设置对话框中的图片src
          util.query(d,'.userzdyi .fk img').src=r;
        })
      });

      // 设置存储
      initsto.set('userbg',{
        type:type,
        upasdb:true // 表示背景内容写入了idb
      })
    }else{
      initsto.set('userbg',{
        type:type,
        url:url
      })
      iovuploader.close();
      getUserUploadUrl(function(r){
        // 获取并设置背景设置对话框中的图片src
        util.query(d,'.userzdyi .fk img').src=r;
      })
    }

    // 最后，直接改变背景
    changeBg('user-upload');
  }

  // 获取用户上传图片、视频URL
  function getUserUploadUrl(cb){
    var a=initsto.get('userbg');
    // 没有上传，直接返回false
    if(!a) cb(false);

    if(a.type=='video'){
      // 视频
      var b=a.upasdb;
      if(b){
        // 来自用户本地上传，从idb提取，获取视频快照返回
        initsto.get('useruploaderbg',true,function(blob){
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
      var b=a.upasdb;
      if(b){
        // 来自用户本地上传，从idb提取返回
        initsto.get('useruploaderbg',true,function(blob){
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

  // 自定义颜色修改对话框
  var colorchanger=new dialog({
    content:`
    <form>
      <h1>自定义背景颜色</h1>
      <div class="content">
        <p>浅色模式：<input type="color" class="lightbgcolor"/></p>
        <p>深色模式：<input type="color" class="darkbgcolor"/></p>
      </div>
      <div class="footer">
        <button class="cancel btn">取消</button>
        <button class="ok btn">确定</button>
      </div>
    </form>
    `
  });
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
    initsto.set('usercolor',lightc+'-'+darkc);
    util.query(d,'.userzdyc .fk').innerHTML=_shilifk_color_str([lightc,darkc],true);

    //直接改变背景
    changeBg('user-color');
    colorchanger.close();
  }

  util.query(d,'a.updateColor').onclick=function(){
    // 点击修改链接时，把对话框中的颜色设置为用户自定义的颜色，方便对比修改
    var colors=initsto.get('usercolor');
    var lightc=colors.split('-')[0];
    var darkc=colors.split('-')[1];
    util.query(colorchangerf,'.lightbgcolor').value=lightc;
    util.query(colorchangerf,'.darkbgcolor').value=darkc;
    colorchanger.open();
  }

  util.query(d,'.gjzdysetbtn').onclick=function(){
    // 设置高级自定义背景
    var lr=util.query(d,'.gjzdytlight').value;
    var dr=util.query(d,'.gjzdytdark').value;
    initsto.set('usergjzdy',{
      light:lr, //light模式
      dark:dr   //dark模式
    });
    changeBg('user-gjzdy');
  }

  // 填充背景设置对话框中的高级自定义背景代码，方便对比修改
  var _gjzdy=initsto.get('usergjzdy');
  util.query(d,'.gjzdytlight').value=_gjzdy.light;
  util.query(d,'.gjzdytdark').value=_gjzdy.dark;


  // 实例化背景
  chulibg(initsto.get('bg'));
  // 选中对应背景
  var setbgi=util.query(scroll_con,'.bgitem[data-select="'+initsto.get('bg')+'"');
  setbgi&&setbgi.classList.add('selected');

  return{
    changeBg
  }
})();