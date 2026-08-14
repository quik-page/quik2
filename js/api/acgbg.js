const util = require("../util");

function ce(cb) {
  var u = '';
  if (window.innerWidth <= 500) {
    u = 'https://eo-img.loliapi.cn/i/pe/img' + (parseInt(Math.random() * 3095) + 1) + '.webp'
  } else {
    let p= parseInt(Math.random() * 696) + 1;
    if(p==462)p=463; // 过滤一张图片
    u = 'https://eo-img.loliapi.cn/i/pc/img' + p + '.webp'
  }
  util.loadimg(u, ok => {
    if (ok) {
      cb({
        url: u,
        candownload: true
      });
    } else {
      u = "https://loliapi.com/acg/?_=" + Date.now();
      util.loadimg(u, () => {
        cb({
          url: u,
          candoanload: false
        })
      })
    }
  })
}

function dce2(a,b,c){
    return function ce2(cb){
        let u='https://t.alcy.cc/json?';
        u+=window.innerWidth<=500?a:b;
        util.xhr(u,d=>{
            let t;
            try {
                t=JSON.parse(d);
            } catch (error) {
                rp()
            }
            if(t&&t.data){
                util.loadimg(t.data.link,ok=>{
                    if(ok){
                        cb({
                            url:t.data.link,
                            candownload:true
                        })
                    }else{
                        rp();
                    }
                })
            }else{
                rp();
            }
        },rp)
    
        function rp(){
            cb({
                url:"https://t.alcy.cc/"+c+"?_="+Date.now(),
                candownload:false
            })
        }
    }
}


module.exports = {
  getImg: ce,
  getImg2: dce2("mp","pc","ycy"),
  getImg3: dce2("moemp","moe","moez")
}