(function(){
  if(!localStorage.quik2){
    localStorage.quik2='{}';
  }

  var isidbready=false;
  var idbsupport=localforage._getSupportedDrivers([localforage.INDEXEDDB])[0]==localforage.INDEXEDDB;
  var readyfn=[];
  localforage.ready(function(){
    setTimeout(function(){
      isidbready=true;
      readyfn.forEach(function(fn){
        fn();
      })
    },200)

  })

  var filerecv={
    get:function(hash,cb){
      if(!isidbready){
        readyfn.push(function(){
          localforage.getItem(hash).then(cb);
        })
      }else{
        localforage.getItem(hash).then(cb);
      }
    },
    set:function(file,cb){
      if(!isidbready){
        readyfn.push(function(){
          var hash='^'+util.getRandomHashCache();
          localforage.setItem(hash,file).then(function(){
            cb(hash);
          });
        })
      }else{
        var hash='^'+util.getRandomHashCache();
      localforage.setItem(hash,file).then(function(){
        cb(hash);
      });
      }
      
    },
    delete:function(hash,cb){
      if(!isidbready){
        readyfn.push(function(){
          localforage.removeItem(hash).then(cb);
        })
      }else{
        localforage.removeItem(hash).then(cb);
      }
    }
  }

  var f=function(ck){
    if(typeof ck==='string'){
      if(!JSON.parse(localStorage.getItem("quik2"))[ck]){
        setAll({});
      }
      function get(k,useidb,callback){
        if(!useidb){
          return getAll()[ck][k];
        }else{
          if(!idbsupport){
            throw new Error('indexedDB is not support in this browser');
          }
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
          if(!idbsupport){
            throw new Error('indexedDB is not support in this browser');
          }
          if(get(k)){
           filerecv.delete(get(k)); 
          }
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
          if(!idbsupport){
            throw new Error('indexedDB is not support in this browser');
          }
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
  f.checkIDB=function(){
    return idbsupport;
  }
  return f;
})();