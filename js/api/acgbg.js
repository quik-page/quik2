(()=>{

  function ce(cb){
    var u='';
    if(window.innerWidth<=500){
      u='https://img.loliapi.cn/i/pe/img'+(parseInt(Math.random()*3095)+1)+'.webp'
    }else{
      u='https://img.loliapi.cn/i/pc/img'+(parseInt(Math.random()*696)+1)+'.webp'
    }
    util.loadimg(u,ok=>{
      if(ok){
        cb({
          url:u,
          candownload:true
        });
      }else{
        if(window.location.host=='siquan001.github.io'){
          return (cb)=>{
            util.xhr('https://stear.cn/api/quik.php?m=bg&key=sys81a1g519lsokh0e8&host=siquan001.github.io',function(r){
              r=JSON.parse(r);
              cb({
                url:r.url,
                candoanload:true
              });
            },()=>{
              u="https://loliapi.com/acg/?_="+Date.now();
              util.loadimg(u,()=>{
                cb({
                  url:u,
                  candoanload:false
                })
              })
            })
          }
        }else{
          u="https://loliapi.com/acg/?_="+Date.now();
          util.loadimg(u,()=>{
            cb({
              url:u,
              candoanload:false
            })
          })
        }
        
        
      }
    })
  }
  
  return {
    getImg:ce
  }
})();