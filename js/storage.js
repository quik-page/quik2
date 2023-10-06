(function(){
  if(!localStorage.quik2){
    localStorage.quik2='{}';
  }

  var filerecv={
    get:function(hash,cb){
      localforage.getItem(hash,cb);
    },
    set:function(file,cb){
      var hash='^'+util.getRandomHashCache();
      localforage.setItem(hash,file,function(){
        callback(hash);
      });
    },
    delete:function(hash,cb){
      localforage.removeItem(hash,cb);
    }
  }

  return function(ck){
    if(typeof ck==='string'){
      if(!JSON.parse(localStorage.getItem("quik2"))[ck]){
        setAll({});
      }
      function get(k,useidb,callback){
        if(!useidb){
          return getAll()[ck][k];
        }else{
          filerecv.get(getAll()[ck][k],function(file){
            callback(file);
          });
        }
      }
      function set(k,v,useidb,callback){
        if(!useidb){
          var a=getAll();
          a[ck][k]=v;
          setAll(a[ck]);
        }else{
          filerecv.set(v,function(hash){
            var a=getAll();
            a[ck][k]=hash;
            setAll(a[ck]);
            callback(hash);
          })
        }

      }
      function remove(k,useidb,callback){
        if(!useidb){
        var a=getAll();
        delete a[ck][k]
        setAll(a);
        }else{
          filerecv.delete(a[ck][k],function(){
            var a=getAll();
            delete a[ck][k];
            setAll(a);
            callback();
          });
        }
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