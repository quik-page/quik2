(function(){
  var hitokoto={};
  var hitokotoType=[];
  var hitokotoMinLength=0,hitokotoMaxLength=30;
  hitokoto.load=function(callback){
    var url=new URL('https://v1.hitokoto.cn/');
    hitokotoType.forEach(function(k){
      url.searchParams.append('c',k);
    })
    url.searchParams.append('min_length',hitokotoMinLength);
    url.searchParams.append('max_length',hitokotoMaxLength);
    fetch(url.href).then(function(r){
      return r.json()
    }).then(callback);
  }
  hitokoto.setTypes=function(arr){
    hitokotoType=arr;
  }
  hitokoto.setMinLength=function(l){
    hitokotoMinLength=l;
  }
  hitokoto.setMaxLength=function(l){
    hitokotoMaxLength=l;
  }
  hitokoto.getAllTypes=function(){
    return {
      a:'动画',
      b:'漫画',
      c:'游戏',
      d:'文学',
      e:'原创',
      f:'来自网络',
      g:'其他',
      h:'影视',
      i:'诗词',
      j:'网易云',
      k:'哲学',
      l:'抖机灵'
    }
  }
  return hitokoto;
})();