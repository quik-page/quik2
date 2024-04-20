(function(){
  var {getJSON,setJSON}=_REQUIRE_('./core.js');

  var sg=new SettingGroup({
    title:"数据",
    index:4
  });

  var exportDataSi=new SettingItem({
    title:"导出数据",
    message:"导出数据到文件",
    type:"null",
    callback:function(){
      exportDataDialog.open();
      var jl=getStorageList();
      for(var k in jl){
        if(!jl[k]||!jl[k].sync){
          continue;
        }
        var j=jl[k];
        var li=document.createElement('div');
        li.classList.add('item');
        li.innerHTML=`<input type="checkbox"/><div class="message">
          <div class="title">${j.title||k}</div>
          <div class="desc">${j.desc||''}</div>
        </div>`;
        li.dataset.key=k;
        util.query(dm,'.exportslist').appendChild(li);
        util.query(li,'input').checked=true;
      }
    }
  });
  var importDataSi=new SettingItem({
    title:"导入数据",
    message:"从文件导入数据",
    type:"null",
    callback:function(){
      showOpenFilePicker().then(function(files){
        var file=files[0];
        if(file){
          try{
            var reader=new FileReader();
            reader.onload=function(e){
              sl=JSON.parse(e.target.result);
              importDataDialog.open();
              for(var k in sl){
                var j=jl[k];
                var li=document.createElement('div');
                li.classList.add('item');
                li.innerHTML=`<input type="checkbox"/><div class="message">
                  <div class="title">${j.title||k}</div>
                  <div class="desc">${j.desc||''}</div>
                </div>`;
                li.dataset.key=k;
                util.query(dm2,'.exportslist').appendChild(li);
                util.query(li,'input').checked=true;
                // TODO
              }
            }
            reader.readAsText(file);
          }catch(e){
            alert('读取文件有误！');
          }
        }
      })
    }
  });
  sg.addNewItem(exportDataSi);
  sg.addNewItem(importDataSi);
  mainSetting.addNewGroup(sg);

  var sl=null;

  var exportDataDialog=new dialog({
    content:`<div class="actionbar">
      <h1>导出数据</h1>
      <div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <div class="exportslist">
    </div>
    <div class="btns">
      <div class="btn cancel">取消</div>
      <div class="btn ok">导出</div>
    </div>`,
    class:"sync-dialog",
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
  });
  var dm=exportDataDialog.getDialogDom();
  util.query(dm,'.closeBtn').onclick=util.query(dm,'.cancel').onclick=function(){
    exportDataDialog.close();
  }
  util.query(dm,'.ok').onclick=function(){
    var op=[];
    util.query(dm,'.exportslist .item',true).forEach(function(l){
      if(util.query(l,'input').checked){
        op.push(l.dataset.key);
      }
    })
    getJSON(op).then(function(res){
      download(JSON.stringify(res),'quik-2-exportdata.json');
    })
    exportDataDialog.close();
  }

  function download(data,filename){
    var a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));
    a.download=filename;
    a.click();
  }

  var importDataDialog=new dialog({
    content:`<div class="actionbar">
      <h1>导入数据</h1>
      <div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <div class="exportslist">
    </div>
    <div class="btns">
      <div class="btn cancel">取消</div>
      <div class="btn ok">导入</div>
    </div>`,
    class:"sync-dialog",
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
  });
  var dm2=importDataDialog.getDialogDom();
  util.query(dm2,'.closeBtn').onclick=util.query(dm2,'.cancel').onclick=function(){
    importDataDialog.close();
  }
  // TODO

  return {
    getJSON,
    setJSON
  }
})()