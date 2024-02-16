(function(){
  async function getJSON(){
    var jl=getStorageList();
    var ast=getAllStorage();
    var a={};
    for(var k in ast){
      if(jl[k]&&jl[k].sync){
        a[k]={};
        for(var k2 in ast[k]){
          if(typeof ast[k][k2]=='string'&&ast[k][k2][0]=='^'){
            var j={
              "^_t":"db",
              "^_k":ast[k][k2],
              "^_d":await localforage.getItem(ast[k][k2])
            }
            try{
              JSON.stringify(j);
              a[k][k2]=j;
            }catch(e){
              console.warn('非json支持格式存储不同步');
            }
          }else{
            a[k][k2]=ast[k][k2];
          }
        }
      }
    }
    return a;
  }

  async function setJSON(json){
    var ast=getAllStorage();
    for(var k in json){
      if(!ast[k]){
        ast[k]={};
      }
      for(var k2 in ast[k]){
        if(json[k][k2]['^_t']=='db'&&json[k][k2]['^_k']){
          if(quik.storage.checkIDB()){
            await localforage.setItem(json[k][k2]['^_k'],json[k][k2]['^_d']);
            ast[k][k2]=json[k][k2]['^_k'];
          }else{
            throw new Error('Your browser is not support indexedDB,Please update your browser.');
          }
        }else{
          ast[k][k2]=json[k][k2];
        }
      }
    }
    
    localStorage.quik2=JSON.stringify(ast);
    localStorage._wsync='1';
    alert('数据导入成功，请重新加载页面',function(){
      location.reload();
    })
  }
  return {
    getJSON,
    setJSON
  }
})()