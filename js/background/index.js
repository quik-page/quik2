(function () {
  var eventHandle=getEventHandle();
  var addEventListener=eventHandle.addEventListener;
  var removeEventListener=eventHandle.removeEventListener;
  var doevent=eventHandle.doevent;
  var bgf = util.element('div', {
    class: "bgf"
  });
  util.query(document, 'body').appendChild(bgf);
  var initsto = storage('background',{
    sync:true
  });
  var tabindexCount=0;

  // 避免缓存（用于图片API）
  function urlnocache(url) {
    return url + (url.indexOf('?') > -1 ? '&' : '?') + 't=' + new Date().getTime();
  }

  // 背景设置对话框
  var bg_set_d = new dialog({
    content: `<div class="actionbar">
      <h1>背景设置</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <div class="tab_con"></div>
    <div class="scroll_con"></div>
    `,
    class: "bg_d",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN
  });

  // 背景设置对话框Dom
  var d = bg_set_d.getDialogDom();

  // 关闭按钮
  util.query(d, '.closeBtn').onclick = function () {
    bg_set_d.close();
  }

  // 背景设置对话框Tab
  var tab_con = util.query(d, 'div.tab_con');

  // 背景设置对话框内容
  var scroll_con = util.query(d, 'div.scroll_con');

  // 初始化用户存储
  function initStorage() {
    if (!initsto.get('bg')) {
      initsto.set('bg', {
        type: "default",
        data: {
          type: "color",
          light: "#fff",
          dark: "#333"
        }
      });
    }
  }
  initStorage();

  var defDrawer=_REQUIRE_('./defaultDrawer.js');
  var drawers = [defDrawer];
  dodrawer(defDrawer);

  function pushBgTab(item) {
    var tab=item.tab; // tab标题

    // 一个tab标签
    var tabitem=util.element('div',{
      class:'tabitem',
      'data-tab':tabindexCount.toString() //TabID，方便控制
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
      'data-tab':tabindexCount.toString() //对应TabID，方便控制
    });
    scroll_con.appendChild(scrollitem);
    scrollitem.innerHTML=item.content;
    tabindexCount++;
    return scrollitem;
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


  function pushBgDrawer(drawer) {
    var session = drawer.session;
    try {
      if (!util.checkSession(session)) {
        throw 'session error';
      }
    } catch (e) {
      throw new Error('背景Drawer注册失败，Session校验错误。')
    }
    var bgdrawerid = 'bgdrawer-' + util.getRandomHashCache();
    drawer.id = bgdrawerid;
    drawers.push(drawer);
    dodrawer(drawer);
    onbgdrawersign(drawer);
    return bgdrawerid;
  }

  function dodrawer(drawer) {
    drawer.init({
      bgf: bgf,
      pushBgTab:pushBgTab,
      setbg:setbg,
      type:drawer.type
    });
  }

  var waitdraw=null;
  function onbgdrawersign(drawer) {
    if(waitdraw){
      if(drawer.type==waitdraw.type){
        drawers[i].draw({
          bgf:bgf,data:waitdraw.data
        })
      }
    }
  }

  var nowdraw=null;
  function drawbg(data){
    for(var i=0;i<drawers.length;i++){
      if(data.type==drawers[i].type){
        if(nowdraw&&nowdraw.type!=drawers[i].type){
          nowdraw.cancel({bgf:bgf});
          nowdraw=drawers[i];
        }
        drawers[i].draw({
          bgf:bgf,data:data.data
        })
        return;
      }
    }
    waitdraw=data;
  }

  function setbg(data){
    initsto.set('bg',data);
    drawbg(data);
    doevent('change',[data]);
  }

  drawbg(initsto.get('bg'));

  var sg=new SettingGroup({
    title:"背景",
    index:3
  });

  var si=new SettingItem({
    title:"背景设置",
    message:"点击设置背景",
    index:0,
    type:'null',
    callback:function(){
      bg_set_d.open();
    }
  })

  mainSetting.addNewGroup(sg);
  sg.addNewItem(si);

  //开始activeTab0
    activeTab('0');

  function getbg(){
    return initsto.get('bg');
  }

  return{
    pushBgDrawer,
    getbg,
    setbg,
    addEventListener,
    removeEventListener
  }

})();