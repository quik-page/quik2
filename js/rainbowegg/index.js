const omnibox=require('../omnibox');
omnibox.on('beforeenter', (text) => {
    if (text == 'rainbowcatXquik') {
        localStorage.__quik_egg__ = '1';
    }
});


setTimeout(() => {
    if (window.eggnow__) {

        console.log('egg');
        setTimeout(() => {
            var audio = el('audio', {
                src: './assets/nyan.mp3',
                // src:'./assets/nyan.mp3',
                loop: true,
                preload: true,
            });
            document.body.append(audio);
            $(".loading-f").html('<p>正在加载音频中...</p><img src="https://image.gmya.net/i/2024/08/22/66c694973aba5.gif"/>')
            audio.oncanplaythrough = function () {
                try { audio.play(); } catch (e) { }
                if (!audio.paused) {
                    dozm();
                }
                $(".loading-f p").html('CLICK TO PLAY 点击播放音乐');
                document.on('click', playAudio);
                function playAudio() {
                    audio.play();
                    dozm();
                    document.off('click', playAudio);
                }
            }
            $(".loading-f").classList.add('rainbow');
            document.on('click', () => {
                document.body.requestFullscreen();
            })


            function dozm() {
                var a;
                setTimeout(() => {
                    var d = 0, m = [
                        'Nyan Cat',
                        'Artist:桃音モモ',
                        'From:网易云音乐',
                    ];
                    $(".loading-f p").html(m[d]);
                    a = setInterval(() => {
                        d = d == m.length - 1 ? 0 : d + 1;
                        $(".loading-f p").html(m[d]);
                    }, 2000)
                }, 0)

                setTimeout(() => {
                    clearInterval(a);
                    var m ="nya",k="~!#&:^~";
                    function clm(){
                        let s='';
                        for(let i=0;i<13;i++){
                            if(Math.random()>0.5){
                                s+=m+k[Math.floor(Math.random()*k.length)]+" ";
                            }else{
                                s+=m+" ";
                            }
                        }
                        return s;
                    }
                    $(".loading-f p").html(clm());
                    a = setInterval(() => {
                        $(".loading-f p").html(clm());
                    }, 250)
                }, 8000)
                setTimeout(() => {
                    clearInterval(a);
                    var d = 0, m = [
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
                    $(".loading-f p").html(m[d]);
                    a = setInterval(() => {
                        d = Math.floor(Math.random() * m.length);
                        $(".loading-f p").html('QUIK 2.4.1 - 彩蛋 - RainbowCat ' + m[d]);
                    }, 250)
                }, 35000)
                setTimeout(() => {
                    clearInterval(a);
                    a = setInterval(() => {
                        $(".loading-f p").html(randomString());
                    }, 100)
                }, 48000)
            }
        }, 4000);
        css(`.loading-f.rainbow{background:#036}.loading-f p{font-size:20px;line-height:36px;width:100%;color:#fff;position:absolute;top:0;left:0;text-align:center;}.loading-f img{${window.innerWidth > window.innerHeight ? 'height' : "width"}:100%;display:block;margin:0 auto}`)
    }
}, 10)
function randomString() {
    e = Math.random() * 6 + 17;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678!@#$%^&*()_+~`-=[];'\\,./{}:\"|<>/?",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}


// newly-egg
if(localStorage.inegg2){
    localforage.getItem("qkegg2").then(t=>{
        eval(t);
    })
    // js("./rbegg2.js",true);
}else{
    window.eggerfn=function(){
        localStorage.__quik_egg__ = '1';
        require("./egg2recovery.js").init();
    }
}
