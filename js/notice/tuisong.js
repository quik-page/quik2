const notice = require("./index");
const {gS} = require("../storage");

// 一些重要通知的推送
const stp=gS("tuisong");
if(isUd(stp.d))stp.d=0;
var last_d = stp.d;
console.log('last_d', last_d);
get('/quik-notice.json').then(res => {
    if (res.date > last_d) {
        setTimeout(() => {
            stp.d=res.date;
        }, 5000)

        var tsn = new notice({
            content: res.content,
            title: res.title,
            btns: res.btns.map((v) => {
                var fn;
                if (v.link) {
                    fn = () => {
                        tsn.hide();
                        window.open(v.link)
                    }
                } else {
                    fn = () => {
                        tsn.hide();
                    }
                }
                return {
                    text: v.text,
                    style: v.style,
                    click: fn
                }
            })
        })

        tsn.show();
    }
}, () => {
    // 请求失败
    console.log('通知数据请求失败')
})