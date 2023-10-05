(function(){
  var to=util.element('div',{
    class:"toast"
  })

  var g=null;
  util.query(document,'body').append(to);
  return {
    show:function(value){
      to.innerHTML=value;
      to.classList.add('show');
      clearTimeout(g);
      g=setTimeout(function(){
        to.classList.remove('show');
      },2000);
    }
  }
})();