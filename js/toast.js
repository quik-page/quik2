(function(){
  var to=util.element('div',{
    class:"toast"
  })

  var g=null;
  util.query(document,'body').append(to);
  return {
    show:function(value,time){
      to.innerHTML=value;
      to.classList.add('show');
      clearTimeout(g);
      g=setTimeout(function(){
        to.classList.remove('show');
      },time??2000);
    }
  }
})();