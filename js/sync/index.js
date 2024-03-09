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
      console.log('exportData');
    }
  });
  var importDataSi=new SettingItem({
    title:"导入数据",
    message:"从文件导入数据",
    type:"null",
    callback:function(){
      console.log('importData');
    }
  });
  sg.addNewItem(exportDataSi);
  sg.addNewItem(importDataSi);
  mainSetting.addNewGroup(sg);


  return {
    getJSON,
    setJSON
  }
})()