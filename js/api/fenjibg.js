(function(){
  return {
    getImg:function(cb){
      var u='https://img.gumengya.com/api/fj/'+(parseInt(Math.random()*4000)+1)+'.jpg';
      util.loadimg(u,function(ok){
        if(ok){
          cb({
            url:u,
            candownload:true
          });
        }else{
          u="https://api.gumengya.com/Api/FjImg?format=image&_="+Date.now();
          util.loadimg(u,function(){
            cb({
              url:u,
              candoanload:false
            })
          })
          
        }
      })
    }
  }
})();