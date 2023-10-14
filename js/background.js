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
  // if(!initsto.get('bg')){
  //   initsto.set('bg','def-0')
  // }

  // if(!initsto.get('imglist')){
  //   initsto.set('imglist',[])
  // }

  // if(!initsto.get('videolist')){
  //   initsto.set('videolist',[])
  // }

  // if(!initsto.get('colorlist')){
  //   initsto.set('colorlist',[])
  // }

  var bg=initsto.get('bg');
  // var imglist=initsto.get('imglist');
  // var videolist=initsto.get('videolist');
  // var colorlist=initsto.get('colorlist');
  var intervals=[];

  var INIT_SHOWTYPE={
    full:0,
    half:1,
    def:2,
  }
  var initalBgs=[{
    tab:"图片/视频",
    content:{
      "自定义":[
        {
          showtype:INIT_SHOWTYPE.full,
          img:function(){
            return new Promise((r,j)=>{

            })
          },
          select:'user-upload',
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
              
            })
          },
          select:"color-custom",
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
      ]
    }
  },{
    tab:"高级自定义",
    content:`zidiyi`
  }]

  // chulibg(bg);


  function chulibg(bgv){
    bgv=bgv.split('-');
    var lx=bgv[0];
    bgv.shift();
    intervals.forEach(function(item){
      clearInterval(item);
    });
    intervals=[];
    var value=bgv.join('-');
      bgi.style.background='';
      bgi.innerHTML='';
    if(lx=='def'){
      return;
    }else if(lx=='img'){
      bgi.innerHTML=`<img src="${value}"/>`
    }else if(lx=='video'){
      bgi.innerHTML=`<video src="${value}" autoplay loop muted></video>`
    }else if(lx=='color'){
      bgi.innerHTML='';
      bgi.style.backgroundColor=value;
    }else if(lx=='ts'){
      bgi.innerHTML='';
      bgi.style.background=value;
    }else if(lx=='api'){
      if(value=='0'){
        bgi.innerHTML=`<img src="${urlnocache(erciyuanbg.getImg().url)}"/>`
        util.query(bgi,'img').onerror=function(){
          this.src=urlnocache(erciyuanbg.getImg().url);
        }
      }else if(value=='1'){
        bgi.innerHTML=`<img src="${urlnocache(fenjibg.getImg().url)}"/>`
        util.query(bgi,'img').onerror=function(){
          this.src=urlnocache(fenjibg.getImg().url);
        }
      }else if(value=='2'){
        bgi.innerHTML=`<img src="${urlnocache("https://bing.shangzhenyang.com/api/1080p")}"/>`
        util.query(bgi,'img').onerror=function(){
          this.src=urlnocache("https://bing.shangzhenyang.com/api/1080p");
        }
      }else if(value=='3'){
        intervals.push(setInterval(function(){
          var n=new Date();
          bgi.style.backgroundColor='#'+(0xff-n.getHours()).toString(16)+(0xff-n.getMinutes()).toString(16)+(0xff-n.getSeconds()).toString(16);
        },1000))
      }
    }
  }

  // chulibg('api',0);
  function urlnocache(url){
    return url+(url.indexOf('?')>-1?'&':'?')+'t='+new Date().getTime();
  }

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


  var d=bg_set_d.getDialogDom();
  util.query(d,'.closeBtn').onclick=function(){
    bg_set_d.close();
  }
  var tab_con=util.query(d,'div.tab_con');
  var scroll_con=util.query(d,'div.scroll_con');
  initalBgs.forEach(function(item,i){
    var tab=item.tab;
    var tabitem=util.element('div',{
      class:'tabitem',
      'data-tab':i
    });
    tab_con.appendChild(tabitem);
    tabitem.innerHTML=tab;
    tabitem.onclick=function(){
      activeTab(this.getAttribute('data-tab'));
    }
    var scrollitem=util.element('div',{
      class:'scrollitem',
      'data-tab':i
    });
    scroll_con.appendChild(scrollitem);
    if(typeof item.content=='string'){
      scrollitem.innerHTML=item.content;
      return;
    }
    for(var k in item.content){
      var unititem=util.element('div',{
        class:"unititem"
      });
      unititem.innerHTML=`<div class="unit-title">${k}</div><div class="unit-content"></div>`;
      item.content[k].forEach(function(it,i){
        var bgitem=util.element('div',{
          class:"bgitem "+['full','half','def'][it.showtype],
          'data-select':it.select,
        });
        if(it.showtype==INIT_SHOWTYPE.def){
          if(it.img){
            if(typeof it.img=='string'){
              bgitem.innerHTML=`<div class="fk"><img src="${it.img}"></div>`
            }else{
              var src=it.img();
              if(src instanceof Promise){
                bgitem.innerHTML=`<div class="fk"></div>`;
                src.then(function(url){
                  util.query(bgitem,'.fk').innerHTML=`<img src="${url}"/>`;
                })
              }else{
                bgitem.innerHTML=`<div class="fk"><img src="${src}"></div>`
              }
            }
          }else if(it.color){
            if(typeof it.color=='string'){
              var colors=it.color.split('-');
              bgitem.innerHTML= `<div class="fk">
              <div class="leftcolorbox" style="background:${colors[0]}"></div>
              <div class="rightcolorbox" style="background:${colors[1]}"></div>
              </div>`;
            }else{
              var colors=it.color();
              if(colors instanceof Promise){
                bgitem.innerHTML=`<div class="fk"></div>`;
                colors.then(function(colors){
                  util.query(bgitem,'.fk').innerHTML= `<div class="fk">
                  <div class="leftcolorbox" style="background:${colors[0]}"></div>
                  <div class="rightcolorbox" style="background:${colors[1]}"></div>
                  </div>`;
                })
              }else{
                bgitem.innerHTML= `<div class="fk">
                <div class="leftcolorbox" style="background:${colors[0]}"></div>
                <div class="rightcolorbox" style="background:${colors[1]}"></div>
                </div>`;
              }
            }
          }
        }else if(it.showtype==INIT_SHOWTYPE.full||it.showtype==INIT_SHOWTYPE.half){
          if(it.img){
            if(typeof it.img=='string'){
              bgitem.innerHTML=`<div class="fk"><img src="${it.img}"></div>${getMessage(it)}`
            }else{
              var src=it.img();
              if(src instanceof Promise){
                bgitem.innerHTML=`<div class="fk"></div>${getMessage(it)}`;
                src.then(function(url){
                  util.query(bgitem,'.fk').innerHTML=`<img src="${url}"/>`;
                })
              }else{
                bgitem.innerHTML=`<div class="fk"><img src="${src}"></div>${getMessage(it)}`
              }
            }
          }else if(it.color){
            if(typeof it.color=='string'){
              var colors=it.color.split('-');
              bgitem.innerHTML= `<div class="fk">
              <div class="leftcolorbox" style="background:${colors[0]}"></div>
              <div class="rightcolorbox" style="background:${colors[1]}"></div>
              </div>${getMessage(it)}`;
            }else{
              var colors=it.color();
              if(colors instanceof Promise){
                bgitem.innerHTML=`<div class="fk"></div>${getMessage(it)}`;
                colors.then(function(colors){
                  util.query(bgitem,'.fk').innerHTML= `<div class="fk">
                  <div class="leftcolorbox" style="background:${colors[0]}"></div>
                  <div class="rightcolorbox" style="background:${colors[1]}"></div>
                  </div>`;
                })
              }else{
                bgitem.innerHTML= `<div class="fk">
                <div class="leftcolorbox" style="background:${colors[0]}"></div>
                <div class="rightcolorbox" style="background:${colors[1]}"></div>
                </div>${getMessage(it)}`;
              }
            }
          }
        }
        util.query(unititem,'.unit-content').append(bgitem);
        util.query(bgitem,'.fk').onclick=function(){
          changeBg(this.parentElement.getAttribute('data-select'));
        }
      })
      scrollitem.append(unititem);
    }

  });
  function getMessage(it){
    return `<div class="bg-message">
      <div class="bg-message-title">${it.title}</div>
      <div class="bg-message-text">${it.text}</div>
    </div>`
  }
  function changeBg(select){
    initsto.set('bg',select);
  }

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
  activeTab('0');
  setting.registerSetting({
    title:"设置背景",
    unit:"背景",
    message:"",
    callback:function(){
      bg_set_d.open();
      alert('注意！背景当前不可用！')
    }
  });



  return{

  }
})();