/*QUIK_ADDON 1|Test|3|3.0|For Test|siquan|https://siquan001.github.io/favicon.ico|https://siquan001.github.io/|/test/update.txt|siquan.test */

console.log(addonData.session);
console.log('Hello,World3!');
quik.alert('Hello3');

var initsto=quik.storage('myaddon_sto');
if(typeof initsto.get('url')=='undefined'){
    initsto.set('url','');
}

var bgdrawerid=quik.background.pushBgShower({
    session: addonData.session, 
    init: function (e) {
        var tab=e.pushTab({
            tab:"MyBg",
            content:"<input type=\"text\" placeholder=\"输入图片URL\"/><button>确定</button>"
        }) 

        var input=tab.querySelector('input');
        input.value=initsto.get('url');

        var submitbtn=tab.querySelector('button');
        submitbtn.onclick=function(){
            if(input.value.trim()){
                e.setbg({
                    type:e.type,
                    data:{
                        url:input.value.trim()
                    }
                })
            }
        }
    },
    cancel: function (n) {
        n.bgf.innerHTML='';
    },
    draw:function(n){
        n.bgf.innerHTML='<div class="mybg_frame"><img src="'+n.data.url+'"/></div>';
    }
  })

quik.addStyle(`.mybg_frame,.mybg_frame img{
    width:100%;
    height:100%;
}
.mybg_frame img{
    object-fit:cover;
    object-position:center center;
}`)