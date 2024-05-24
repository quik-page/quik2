(function(){
  var igsg=new SettingGroup({
    title:"关于",
    index:5
  });
  mainSetting.addNewGroup(igsg);
  var aboutSi=new SettingItem({
    type:'null',
    title:"关于QUIK起始页",
    index:1,
    callback:function(){
      aboutDialog.open();
    }
  });
  var updateSi=new SettingItem({
    type:'null',
    title:"更新日志",
    index:2,
    callback:function(){
      updateDialog.open();
    }
  });
  var licSi=new SettingItem({
    type:'null',
    title:"用户协议和隐私政策",
    index:3,
    callback:function(){
      licDialog.open();
    }
  });
  var thankSi=new SettingItem({
    type:'null',
    title:"特别鸣谢",
    index:4,
    callback:function(){
      thaDialog.open();
    }
  });
  igsg.addNewItem(aboutSi);
  igsg.addNewItem(updateSi);
  igsg.addNewItem(licSi);
  igsg.addNewItem(thankSi);

  mainmenu.pushMenu({
    icon:util.getGoogleIcon('e88e'),
    title:"关于QUIK",
    click:function(){
      aboutDialog.open();
    }
  },1)


  var aboutDialog=new dialog({
    content:_REQUIRE_('./text/about.html').replace('{{close-btn}}',util.getGoogleIcon('e5cd')),
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN
  });

  var addom=aboutDialog.getDialogDom();
  util.query(addom,'.close').onclick=function(){
    aboutDialog.close();
  }
  util.query(addom,'.t.thanks a').onclick=function(){
    thaDialog.open();
  }
  setTimeout(function(){
    util.query(addom,'.ver span').innerText=window.version.version;
  });

  _REQUIRE_('./text/updates.js');
  var updateDialog=new dialog({
    content:`<div class="actionbar">
      <h1>更新日志</h1>
      <div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <div class="version_list"></div>`,
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
    class:"update_dia"
  });

  var updom=updateDialog.getDialogDom();
  util.query(updom,'.closeBtn').onclick=function(){
    updateDialog.close();
  }

  util.query(updom,'.version_list').innerHTML=(function(){
    var s='';
    for(var k in updatelog){
      s+=formatVersion(k,updatelog[k]);
    }
    return s;
  })();
  function formatVersion(v,fv){
    var str='',gl={
      "new":"新增",
      "del":"删除",
      "fix":"修复",
      "change":"修改",
      "thanks":"感谢"
    };
    var _fv=fv.updates;
    for(var i=0;i<_fv.length;i++){
      str+='<div class="update_item"><div class="update_item_tag '+_fv[i].tag+'"><div>'+gl[_fv[i].tag]+'</div></div><div class="update_item_content">'+_fv[i].content+'</div></div>'
    }
    var s='<div class="version_item"><div class="version_item_title">'+v+'</div><div class="version_item_update_time">发布时间：'+fv.time+'</div><div class="version_update">'+str+'</div></div>';
    return s;
  }

  var lichtml=_REQUIRE_('./text/license.html');
  function getLicense(){
    return lichtml;
  }

  var licDialog=new dialog({
    content:` <div class="close">${util.getGoogleIcon('e5cd')}</div><div class="lic-con">${getLicense()}</div>`,
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
    class:"lic-dialog"
  });

  util.query(licDialog.getDialogDom(),'.close').onclick=function(){
    licDialog.close();
  }

  var thankhtml=_REQUIRE_('./text/thanks.html');
  var thaDialog=new dialog({
    content:`<div class="close">${util.getGoogleIcon('e5cd')}</div><div class="thank-con">${thankhtml}</div>`,
    class:"thank-dialog",
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN
  });

  util.query(thaDialog.getDialogDom(),'.close').onclick=function(){
    thaDialog.close();
  }

})();