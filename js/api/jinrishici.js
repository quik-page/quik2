(function(){
  var jinrishici={}, tokenStorageKey="jinrishici-token";
  function request(callback,url){
    var xhr=new XMLHttpRequest();
    xhr.open("get",url);
    xhr.withCredentials=false;
    xhr.send();
    xhr.onreadystatechange=function(){
      if(4===xhr.readyState){
        var res=JSON.parse(xhr.responseText);
        if("success"===res.status){
          callback(res)
        }else{
          console.error("今日诗词API加载失败，错误原因："+res.errMessage)
        }
      }
    }
  }
  jinrishici.load=function(callback){
    var key=initsto.get(tokenStorageKey);
    if(key){
      return request(callback,"https://v2.jinrishici.com/one.json?client=browser-sdk/1.2&X-User-Token="+encodeURIComponent(key))
    }else{
      return request(function(res){
        initsto.set(tokenStorageKey,res.token);
        callback(res);
      },"https://v2.jinrishici.com/one.json?client=browser-sdk/1.2")
    }
  }

  return jinrishici;
})();