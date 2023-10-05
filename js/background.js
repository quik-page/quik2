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
  if(!initsto.get('bg')){
    initsto.set('bg','def-0')
  }

  if(!initsto.get('imglist')){
    initsto.set('imglist',[])
  }

  if(!initsto.get('videolist')){
    initsto.set('videolist',[])
  }

  if(!initsto.get('colorlist')){
    initsto.set('colorlist',[])
  }

  var bg=initsto.get('bg');
  var imglist=initsto.get('imglist');
  var videolist=initsto.get('videolist');
  var colorlist=initsto.get('colorlist');
  var intervals=[];

  chulibg(bg);


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
  <div class="scroll_con">
  <div class="bgfl">
    <div class="c">
      <div class="item" data-l='def-0'>默认（无背景，跟随主题变化）</div>
    </div>
  </div>
  <div class="bgfl">
    <div class="bgfl_title">图片背景</div>
    <div class="c img">
    </div>
  </div>
  <div class="bgfl">
    <div class="bgfl_title">纯色背景</div>
    <div class="c color">/div>
  </div>
  <div class="bgfl">
    <div class="bgfl_title">视频背景</div>
    <div class="c video"></div>
  </div>
  <div class="bgfl">
    <div class="bgfl_title">API背景</div>
    <div class="c">
      <div class="item" data-l='api-0'>
        <div class="api-title">二次元壁纸</div>
        <div class="api-desc">随机二次元壁纸背景</div>
      </div>
      <div class="item" data-l='api-1'>
        <div class="api-title">风景壁纸</div>
        <div class="api-desc">随机风景壁纸背景</div>
      </div>
      <div class="item" data-l='api-2'>
        <div class="api-title">Bing每日壁纸</div>
        <div class="api-desc">把Bing首页的每日壁纸设为背景</div>
      </div>
      <div class="item" data-l='api-3'>
        <div class="api-title">时间的颜色</div>
        <div class="api-desc">根据时间和主题变化的纯色背景</div>
      </div>
    </div>
  </div>
  <div class="bgfl">
    <div class="bgfl_title">高级自定义背景</div>
    <div class="i">
      <input type="text" class="cssbginput"/><button class="cssbgsubmit">设置</button><div class="statu"></div>
    </div>
    <div class="fl_tip">参见 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/background" target="_blank">CSS | Background 属性</a></div>
  </div>
  </div>
  `,
    class:"bg_d",
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN
  });

  var d=bg_set_d.getDialogDom();
  util.query(d,'.closeBtn').onclick=function(){
    bg_set_d.close();
  }

  var adddialogs={
    img:new dialog({
      class:"bg_add_img",
      content:`<h1>添加图片背景</h1>
      <form>
      <div class="content">
        <input type="url" required/>
      </div>
      <img class="preview"/>
      <div class="footer">
        <button class="cancel btn">取消</button>
        <button class="preview btn">预览</button>
        <button class="ok btn">确定</button>
      </div>
      </form>`
    }),
    color:new dialog({
      class:"bg_add_color",
      content: `<h1>添加纯色背景</h1>
      <form>
      <div class="content">
        <input type="color" required/>
      </div>
      <div class="footer">
        <button class="cancel btn">取消</button>
        <button class="ok btn">确定</button>
      </div>
      </form>`
    }),
    video:new dialog({
      class:"bg_add_video",
      content:`<h1>添加视频背景</h1>
      <form>
        <div class="content">
          <input type="url" required/>
        </div>
        <video class="preview" controls style="display:none;"></video>
        <div class="footer">
          <button class="cancel btn">取消</button>
          <button class="preview btn">预览</button>
          <button class="ok btn">确定</button>
        </div>
      </form>`
    }),
  };

  function initadddialogEvent(){
    var imgd=adddialogs.img.getDialogDom();
    util.query(imgd,'form').onsubmit=function(e){
      e.preventDefault();
      var imgurl=util.query(imgd,'input').value;
      var imgl=initsto.get('imglist');
      imgl.push(imgurl);
      initsto.set('imglist',imgl);
      imglist=imgl;
      initsto.set('bg','img-'+imgurl);
      chulibg('img-'+imgurl)
      initbgdia();
      adddialogs.img.close();
      toast.show('设置背景成功');
    }
    util.query(imgd,'.cancel.btn').onclick=function(e){
      e.preventDefault();
      adddialogs.img.close();
    }
    util.query(imgd,'.preview.btn').onclick=function(e){
      e.preventDefault();
      util.query(imgd,'.preview').src=util.query(imgd,'input').value;
    }

    var colord=adddialogs.color.getDialogDom();
    util.query(colord,'form').onsubmit=function(e){
      e.preventDefault();
      var color=util.query(colord,'input').value;
      var colorl=initsto.get('colorlist');
      colorl.push(color);
      initsto.set('colorlist',colorl);
      colorlist=colorl;
      initsto.set('bg','color-'+color);
      chulibg('color-'+color)
      initbgdia();
      adddialogs.color.close();
      toast.show('设置背景成功');
    }
    util.query(colord,'.cancel.btn').onclick=function(e){
      e.preventDefault();
      adddialogs.color.close();
    }

    var videod=adddialogs.video.getDialogDom();
    util.query(videod,'form').onsubmit=function(e){
      e.preventDefault();
      var videourl=util.query(videod,'input').value;
      var videol=initsto.get('videolist');
      videol.push(videourl);
      initsto.set('videolist',videol);
      videolist=videol;
      initsto.set('bg','video-'+videourl);
      chulibg('video-'+videourl)
      initbgdia();
      adddialogs.video.close();
      util.query(videod,'.preview').style.display='none';
      util.query(videod,'.preview').src='';
      toast.show('设置背景成功');
    }
    util.query(videod,'.cancel.btn').onclick=function(e){
      e.preventDefault();
      adddialogs.video.close();
      util.query(videod,'.preview').style.display='none';
      util.query(videod,'.preview').src='';
    }
    util.query(videod,'.preview.btn').onclick=function(e){
      e.preventDefault();
      util.query(videod,'.preview').style.display='block';
      util.query(videod,'.preview').src=util.query(videod,'input').value;
    }
  }
  initadddialogEvent();
  function initbgdia(){
    var str='';
    for(var i=0;i<imglist.length;i++){
      str+=`<div class="item" style="background-image:url(${imglist[i]});" data-l="img-${imglist[i]}"><div class="removebtn">${util.getGoogleIcon('E5CD')}</div></div>`;
    }
    str+=`<div class="addbtn bg_image">${util.getGoogleIcon('e145')}</div>`;
    util.query(d,'.bgfl .c.img').innerHTML=str;
    util.query(d,'.addbtn.bg_image').onclick=function(){
      adddialogs.img.open();
    }

    var str='';
    for(var i=0;i<colorlist.length;i++){
      str+=`<div class="item" style="background-color:${colorlist[i]};" data-l="color-${colorlist[i]}"><div class="removebtn">${util.getGoogleIcon('E5CD')}</div></div>`;
    }
    str+=`<div class="addbtn bg_color">${util.getGoogleIcon('e145')}</div>`;
    util.query(d,'.bgfl .c.color').innerHTML=str;
    util.query(d,'.addbtn.bg_color').onclick=function(){
      adddialogs.color.open();
    }

    var str='';
    for(var i=0;i<colorlist.length;i++){
      str+=`<div class="item" data-l="video-${videolist[i]}"><div class="removebtn">${util.getGoogleIcon('E5CD')}</div>${videolist[i]}</div>`;
    }
    str+=`<div class="addbtn bg_video">${util.getGoogleIcon('e145')}</div>`;
    util.query(d,'.bgfl .c.video').innerHTML=str;
    util.query(d,'.addbtn.bg_video').onclick=function(){
      adddialogs.video.open();
    }

    util.query(d,'.bgfl .c .item',true).forEach(function(e){
      e.onclick=function(){
      chulibg(this.getAttribute('data-l'));
      var oldselect=util.query(d,'.item.selected');
      if(oldselect){
        oldselect.classList.remove('selected');
      }
      this.classList.add('selected');
      initsto.set('bg',this.getAttribute('data-l'));
      toast.show('设置背景成功');
    }
    try{
      e.querySelector('.removebtn').onclick=function(e2){
        e2.stopPropagation();
        if(e.parentElement.classList.contains('img')){
          imglist.splice(imglist.indexOf(e.getAttribute('data-l').slice(4)),1);
          initsto.set('imglist',imglist);
        }else if(e.parentElement.classList.contains('color')){
          colorlist.splice(colorlist.indexOf(e.getAttribute('data-l').slice(6)),1);
          initsto.set('colorlist',colorlist);
        }else if(e.parentElement.classList.contains('video')){
          videolist.splice(videolist.indexOf(e.getAttribute('data-l').slice(6)),1);
          initsto.set('videolist',videolist);
        }
        if(e.classList.contains('selected')){
          util.query(d,'.item').click();
        }
        e.remove();
  
      }
    }catch(e){}
    
  });

    var toselect=util.query(d,'[data-l="'+initsto.get('bg')+'"]');
    if(toselect){
      toselect.classList.add('selected');
    }
  }
  initbgdia();

  setting.registerSetting({
    title:"设置背景",
    unit:"背景",
    message:"",
    callback:function(){
      bg_set_d.open();
    }
  });



  return{

  }
})();