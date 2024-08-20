(()=>{
  return {
    getImg(cb){
      var u='https://img.gumengya.com/api/fj/'+(parseInt(Math.random()*4000)+1)+'.jpg';
      util.loadimg(u,(ok)=>{
        if(ok){
          cb({
            url:u,
            candownload:true
          });
        }else{
          u="https://api.gumengya.com/Api/FjImg?format=image&_="+Date.now();
          util.loadimg(u,()=>{
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