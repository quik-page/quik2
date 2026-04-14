function reactive(obj,onchange=()=>1){
    return new Proxy(obj,{
        get(target,key){
            if(typeof target[key]=="object"&&target[key]!=null){
                // if(Array.isArray(target[key])){
                //     return target[key];
                // }
                return reactive(target[key],onchange);
            }else{
                return target[key];
            }
        },
        set(target,key,value){
            target[key]=value;
            onchange();
            return true;
        },
        deleteProperty(target,key){
            delete target[key];
            onchange();
            return true;
        }
    })
}

module.exports = reactive;