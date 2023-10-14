(function(){
  var apis=[{
    url:"https://api.gumengya.com/Api/DmImg?format=image",
    message:{
      from:"故梦API",
      site:"https://gumengya.com/"
    }
  },{
    url:"https://www.loliapi.com/acg/",
    message:{
      from:"LoliApi",
      site:"https://www.loliapi.com/"
    }
  },{
    url:"https://img.xjh.me/random_img.php?return=302&type=bg",
    message:{
      from:"岁月小筑",
      site:"https://img.xjh.me/"
    }
  }]
  return {
    getImg:function(apiindex){
      return apis[typeof apiindex=='number'&&apiindex<apis.length?apiindex:parseInt(Math.random()*apis.length)]
    }
  }
})();