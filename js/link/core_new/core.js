var {storage,dbTool}=require('../../storage');

var initsto = storage('link', {
  sync: true,
  title:"链接",
  desc:"QUIK起始页链接数据",
  websync:true,
  get:async function(){
    var a=initsto.getAll();
    var sm=a['storage-mode'];
    if(sm=='db'){
      a.links=await localforage.getItem(a.links);
      a.cate=await localforage.getItem(a.cate);
    }
    delete a['storage-mode'];
    return a;
  },
  rewrite(ast,k,a){
    return new Promise(r=>{
      a['storage-mode']=initsto.get('storage-mode');
      if(initsto.get('storage-mode')=='db'){
        initsto.remove('links',true,()=>{
          dbTool.set(a.links,void 0,(hash)=>{
            a.links=hash;
            initsto.remove('cate',true,()=>{
              dbTool.set(a.cate,void 0,(hash)=>{
                a.cate=hash;
                ast[k]=a;
                r();
              });
            });
          });
         
        })
      }else{
        ast[k]=a;
        r();
      }
    })
    
  },
  compare(ast,km,a){
    return new Promise(r=>{
      a['storage-mode']=initsto.get('storage-mode');
      if(a['storage-mode']=='db'){
        initsto.get('links',true,(old)=>{
          initsto.remove('links',true,()=>{
            a.links=compareLinks(old,a.links);
            dbTool.set(a.links,void 0,(hash)=>{
              a.links=hash;
              dbTool.get(ast[km].cate,(ocate)=>{
                dbTool.delete(ast[km].cate,()=>{
                  var d=ocate;
                  if(d){
                    for(var k in a.cate){
                      d[k]=compareLinks(d[k],a.cate[k]);
                    }
                  }else{
                    d=a.cate;
                  }
                  
                  a.cate=d;
                  dbTool.set(a.cate,void 0,(hash)=>{
                    a.cate=hash;
                    ast[km]=a;
                    r();
                  });
                });
              });
            });
          });
          
        })
      }else{
        a.links=compareLinks(initsto.get('links'),a.links);
        var d=initsto.get('cate');
        for(var k in a.cate){
          d[k]=compareLinks(d[k],a.cate[k]);
        }
        a.cate=d;
        ast[km]=a;
      }
    })
  }
});

/**
 * 
 * @param {Array} a 
 * @param {Array} b 
 */
function compareLinks(a,b){
  if(!a){
    return b;
  }
  if(!b){
    return a;
  }
  for(var i=0;i<a.length;i++){
    if(!b.find(function(v){
      return v.title==a[i].title&&v.url==a[i].url;
    })){
      b.push(a[i]);
    }
  }
  return b;
}

function compareCates(a,b){
  for(var k in a){
    if(b[k]){
      b[k]=compareLinks(a[k],b[k]);
    }else{
      b[k]=a[k];
    }
  }
  return b;
}

module.exports={
    initsto
}