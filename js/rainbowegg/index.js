(()=>{
    omnibox.on('beforeenter',(text)=>{
        console.log(text);
        if(text=='rainbowcatXquik'){
            localStorage.__quik_egg__='1';
        }
    });


    setTimeout(()=>{
        if(window.eggnow__){
            var audio=util.element('audio',{
                src:'http://music.163.com/song/media/outer/url?id=22660279.mp3',
                loop:true,
            })
            console.log('egg');
            setTimeout(()=>{
                document.querySelector(".loading-f").innerHTML='<p>CLICK TO PLAY 点击开始播放</p><img src="https://image.gumengya.com/i/2024/08/22/66c694973aba5.gif"/>'
                document.querySelector(".loading-f").classList.add('rainbow');
                try {
                    audio.play();   
                    dozm();
                } catch (error) {
                    document.addEventListener('click',playAudio);
                    function playAudio(){
                        audio.play();
                        dozm();
                        document.removeEventListener('click',playAudio);
                    }
                }

                function dozm(){
                    var a;
                    setTimeout(()=>{
                        var d=0,m=[
                            'Nyan Cat',
                            'Artist:桃音モモ',
                            'From:网易云音乐',
                        ];
                        document.querySelector(".loading-f p").innerHTML=m[d];
                        a=setInterval(()=>{
                            d=d==m.length-1?0:d+1;
                            document.querySelector(".loading-f p").innerHTML=m[d];
                        },2000)
                    },0)
                    
                    setTimeout(()=>{
                        clearInterval(a);
                        var d=0,m=[
                            'nya nya nya nya nya nya nya nya nya nya nya nya nyan',
                            'nay nya nya~ nay nya nya_ nya nya nya nya nya nya nyan?',
                            'nya nya nya_ nya nya nya nay nya nya nya nay nya nyan',
                            'nya nya nya nya nay nya nya_ nya nya~ nya nya nya nyan*',
                            'nya nya nya nya nya nya~ nya nya nya nya nya nya nyan',
                            'nya nya~ nya nya nya_ nya nya nay nya nya nya nya nyan!',
                            'nya nya nya nya nya nya nya nya_ nya nya nya nya nyan',
                            'nya nya nya nay nya nya_ nya nya nya nya nya nya nyan:',
                            'nya nya~ nya nya nya nya nya nya_ nya nya nya nya nyan..',
                            'nya nya nya nya nya nya nay nya nya nya nya_ nya nyan',
                        ];
                        document.querySelector(".loading-f p").innerHTML=m[d];
                        a=setInterval(()=>{
                            d=d==m.length-1?0:d+1;
                            document.querySelector(".loading-f p").innerHTML=m[d];
                        },250)
                    },8000)
                    setTimeout(()=>{
                        clearInterval(a);
                        var d=0,m=[
                            '',
                            'nya',
                            'nya!',
                            'nay',
                            'n_ay',
                            'n_ya',
                            'nya?',
                            'nya~',
                            'nya',
                            'nyanya',
                            'nyan',
                            'nyan:',
                            'nyan..',
                            'ny',
                        ];
                        document.querySelector(".loading-f p").innerHTML=m[d];
                        a=setInterval(()=>{
                            d=d==m.length-1?0:d+1;
                            document.querySelector(".loading-f p").innerHTML='QUIK 2.4.1 - 彩蛋 - RainbowCat'+m[d];
                        },250)
                    },35000)
                    setTimeout(()=>{
                        clearInterval(a);
                        a=setInterval(()=>{
                            document.querySelector(".loading-f p").innerHTML=randomString();
                        },100)
                    },48000)
                }
            },4000);
            util.addStyle(`.loading-f.rainbow{background:#036}.loading-f p{font-size:20px;line-height:36px;width:100%;color:#fff;position:absolute;top:0;left:0;text-align:center;}.loading-f img{${window.innerWidth>window.innerHeight?'height':"width"}:100%;display:block;margin:0 auto}`)
        }
    },10)
    function randomString() {    
        e = Math.random()*6+17;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678!@#$%^&*()_+~`-=[];'\\,./{}:\"|<>/?",
        a = t.length,
        n = "";
        for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }
    
})()