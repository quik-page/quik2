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
            var j=await localforage.getItem(ast[k][k2]);
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
  return {
    getJSON
  }
})()