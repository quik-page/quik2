(function(){
  if(!localStorage.quik2){
    localStorage.quik2='{}';
  }
  return function(ck){
    if(typeof ck==='string'){
      if(!JSON.parse(localStorage.getItem("quik2"))[ck]){
        setAll({});
      }
      function get(k){
        return JSON.parse(localStorage.getItem("quik2"))[ck][k];
      }
      function set(k,v){
        var a=getAll();
        a[ck][k]=v;
        setAll(a[ck]);
      }
      function remove(k){
        var a=getAll();
        delete a[ck][k]
        setAll(a);
      }
      function getAll(){
        return JSON.parse(localStorage.getItem("quik2"));
      }
      function setAll(ob){
        var a=getAll();
        a[ck]=ob;
        localStorage.setItem("quik2",JSON.stringify(a));
      }
      return {
        get:get,
        set:set,
        remove:remove
      }
    }else{
      throw new Error('ck is not a string');
    }
  }
})();