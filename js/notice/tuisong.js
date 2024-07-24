;(function(){
    // 一些重要通知的推送
    var tuisongsto=storage('tuisong');
    util.initSet(tuisongsto,'d',0);
    var last_d=tuisongsto.get('d');
    console.log('t');
    util.xhr('/quik-notice.json',function(res){
        res=JSON.parse(res);
        if(res.date>last_d){
            setTimeout(function(){
                tuisongsto.set('d',res.date);
            },10000)

            var tsn=new notice({
                content:res.content,
                title:res.title,
                btns:res.btns.map((v)=>{
                    var fn;
                    if(v.link){
                        console.log('link');
                        fn=function(){
                            tsn.hide();
                            window.open(v.link)
                        }
                    }else{
                        console.log('hide');
                        fn=function(){
                            tsn.hide();
                        }
                    }
                    return{
                        text:v.text,
                        style:v.style,
                        click:fn
                    }
                })
            })

            tsn.show();

            console.log(tsn);
        }
    },function(){
        // 请求失败
        console.log('通知数据请求失败')
    })
})();