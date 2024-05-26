(function(){
    window.addEventListener('hashchange',hashcl);
    function hashcl(){
        var hash=location.hash;
        if(hash=='#clearAll'){
            confirm('确定要清除所有数据吗？',function(r){
            if(r){
                function c(){
                    prompt('请在下方输入“clearAll”，并再次确定是否要清除所有数据，此操作无法恢复。',function(t){
                        if(t=='clearAll'){
                            localStorage.clear();
                            localforage.clear().then(function(){
                                location.reload();
                            });
                            location.hash='';
                        }else if(!t){
                            
                        }else{
                            c();
                        }
                    })
                }
                c(); 
            } 
            });
        }else if(hash=='#safe'){
            location.hash='';
            window.addon_=false;
        }
    }
    hashcl();
    
})();