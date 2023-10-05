(function(){
  var apis=[{
    url:"https://api.gumengya.com/Api/FjImg?format=image",
    message:{
      from:"故梦API",
      site:"https://gumengya.com/"
    }
  },{
    url:"https://imgapi.cn/api.php?fl=fengjing",
    message:{
      from:"IMGAPI",
      site:"https://imgapi.cn/"
    }
  },{
    url:"https://img.xjh.me/random_img.php?return=302&type=bg&ctype=nature",
    message:{
      from:"岁月小筑",
      site:"https://img.xjh.me/"
    }
  }]
  return {
    getImg:function(){
      return apis[parseInt(Math.random()*apis.length)]
    }
  }
})();