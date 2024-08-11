(function(){
  if(!localStorage.quik2){
    localStorage.quik2='{}';
  }

  var evn=getEventHandle();

  var idbsupport=localforage._getSupportedDrivers([localforage.INDEXEDDB])[0]==localforage.INDEXEDDB;
  // var idbsupport=false;
  var filerecv={
    get:function(hash,cb){
      localforage.getItem(hash).then(cb);
    },
    set:function(file,hash,cb){
      hash=hash||('^'+util.getRandomHashCache());
      localforage.setItem(hash,file).then(function(){
        cb(hash);
      });
    },
    delete:function(hash,cb){
      localforage.removeItem(hash).then(cb);
    }
  }

  var jl={};

  var f=function(ck,details){
    if(typeof ck==='string'){
      if(!JSON.parse(localStorage.getItem("quik2"))[ck]){
        setAll({});
      }
      jl[ck]=details;
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
          filerecv.set(v,get(k),function(hash){
            var a=getAll();
            a[ck][k]=hash;
            setAll(a[ck]);
            callback(hash);
          })
        }

      }
      function remove(k,useidb,callback){
        var a=getAll();
        if(!useidb){
          delete a[ck][k]
          setAll(a[ck]);
        }else{
          if(!idbsupport){
            throw new Error('indexedDB is not support in this browser');
          }
          filerecv.delete(a[ck][k],function(){
            var a=getAll();
            delete a[ck][k];
            setAll(a[ck]);
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
        evn.doevent('storage',[{
          key:ck,
          value:ob
        }])
        if(details&&(!details.websync)&&details.sync){
          console.log('websync',ck,ob);
          evn.doevent('websync',[{
            key:ck,
            value:ob
          }])
        }
      }
      function list(){
        return Object.keys(getAll()[ck]);
      }
      function websync(option){
        console.log('websync',option);
        evn.doevent('websync',[{
          key:ck,
          value:option,
          sp:true
        }])
      }
      return {
        get:get,
        websync,
        set:set,
        remove:remove,
        list:list,
        getAll:function(){
          return getAll()[ck];
        },
        clear:function(){
          var a=getAll()[ck];
          for(var k in a){
            var b=k[a];
            if(typeof b=='string'&&b.startsWith('^')){
              filerecv.delete(b);
            }
          }
          setAll({});
        }
      }
    }else{
      throw new Error('ck is not a string');
    }
  }

  /**
   * 检查浏览器是否支持indexedDB
   * @returns {Boolean} indexedDB support
   */
  f.checkIDB=function(){
    return idbsupport;
  }
  f.on=evn.on;
  f.off=evn.off;
  return {
    storage:f,
    getStorageList:function(){
      return jl;
    },
    getAllStorage:function(){
      return JSON.parse(localStorage.getItem("quik2"));
    },
    dbTool:filerecv
  };
})();