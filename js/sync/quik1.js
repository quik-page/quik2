(function(){
    var quik1si=new SettingItem({
        title: "QUIK 1",
        message: "从 QUIK 1 中导入数据",
        type: "null",
        callback: openQUIK1Helper
    })

    sg.addNewItem(quik1si);

    function openQUIK1Helper(){
        confirm('你确定要从QUIK1中导入数据吗？一些数据导入可能会不全。',function(ok){
            var d=new dialog({
                content:"正在获取QUIK 1数据...",
                clickOtherToClose:false
            })
            setTimeout(function(){
                d.open();
            },10)
            var ifr=util.element('iframe');
            ifr.src='https://siquan001.github.io/quik/getdata.html?session=hhh';
            document.body.append(ifr);
            window.addEventListener('message',listen)
            function listen(e){
                if(e.data.type=='rdata-quik1'){
                    var ret=quik1to2(JSON.parse(e.data.data));
                    console.log(ret);
                    d.close();
                    _importData(ret);
                }
            }
        })  
    }

    function quik1to2(data){
        var quik2mb={
            "setting": {
                "title": "设置",
                "desc": "QUIK起始页的各项设置",
                "data": {
                    "ob_justsearch": data.jusearch,
                    "ob_http": data.qhttps,
                    "ob_autofocus": data.autofocuss,
                    "theme": data['settings']['通用']['msqh']=='浅色'?"a":"b",
                    "ob_cal": data.casearch,
                    "ob_tran": data.trsearch
                }
            },
            "search": {
                "title": "搜索引擎",
                "desc": "搜索引擎配置",
                "data": {
                    "typelist": (function(){
                        var o={},_o=data.searchmodes;
                        for(var k in _o){
                            o[k]=_o[k].search.replace('{}','%keyword%')
                        }
                        return o;
                    })(),
                    "type": data.searchmode
                }
            },
            "link": {
                "title": "链接",
                "desc": "QUIK起始页链接数据",
                "data": {
                    "linksize": ({'小':'s','中':'m','大':'l'})[data['settings']['通用']['ljdx']],
                    "links": (function(){
                        var o=[],_o=data.pins;
                        for(var i=0;i<_o.length;i++){
                            o.push({
                                title:_o[i].name,
                                url:_o[i].url
                            })
                        }
                        return o;
                    })(),
                    "cate": {}
                }
            },
            "says": {
                "title": "一言",
                "desc": "QUIK起始页一言相关配置",
                "data": {
                    "usersay": data.says,
                    "saytype": (function(){
                        if(data['settings']['一言']['atqd']){
                            if(data['settings']['一言']['apiq']=='今日诗词'){
                                return 'jinrishici'
                            }else{
                                return 'hitokoto'
                            }
                        }else{
                            return 'user'
                        }
                    })(),
                    "enabled": true
                }
            },
            "background": {
                "title": "背景",
                "desc": "QUIK起始页背景相关配置",
                "data": {
                    "bg": (function(){
                        var d;
                        if(data.background.type==0){
                            d={
                                "type": "color",
                                "light": "#fff",
                                "dark": "#333"
                            }
                        }else if(data.background.type==1||data.background.type==2){
                            d={
                                "type": "userbg",
                            }
                        }else if(data.background.type==3){
                            d={
                                "type": "color",
                                "light": data.background.src,
                                "dark": data.background.src
                            }
                        }else if(data.background.type==4){
                            var b={
                                'api:by':"bing",
                                'api:2cy':'acg',
                                'api:fj':'fj',
                                'api:tc':'time'
                            }
                            d={
                                "type": "api",
                                "api":b[data.background.src]
                            }
                        }else if(data.background.type==5){
                            d={
                                type:"zdy",
                                light:data.background.src,
                                dark:data.background.src,
                            }
                        }
                        return {
                            "type": "default",
                            "data": d
                        }
                    })(),
                    "usercolor": (function(){
                        if(data.background.type==3){
                            return{
                                "light": data.background.src,
                                "dark": data.background.src
                            }
                        }else{
                            return {
                                "dark": "#333333",
                                "light": "#ffffff"
                            }
                        }
                    })(),
                    "ivsetting": {
                        "mb": data['settings']['背景']['bgmb']*10,
                        "isbr": !!data['settings']['背景']['bgmf'],
                        "br": !!data['settings']['背景']['bgmf']?data['settings']['背景']['bgmf']:6,
                        "th": 1
                    }
                }
            },
            "notes": {
                "title": "便签",
                "desc": "便签数据",
                "addon": "market:003",
                "data": {
                    "comment": [],
                    "gdlist": [],
                }
            }
        }

        if(data.background.type==1){
            quik2mb.background.data.userbg={
                type:"image",
                url:data.background.src
            }
        }else if(data.background.type==2){
            quik2mb.background.data.userbg={
                type:"video",
                url:data.background.src
            }
        }else if(data.background.type==5){
            quik2mb.background.data.custombglight=
            quik2mb.background.data.custombgdark=
            data.background.src
        }

        for(var i=0;i<data.note.length;i++){
            var id=data.note[i][2].toString(36);
            quik2mb.notes.data['n-'+id]=data.note[i][0];
            quik2mb.notes.data.comment.push({
                id:id,title:getTitle(data.note[i][0]),date:data.note[i][2]
            })
        }

        for(var i=0;i<data['note-pins'].length;i++){
            for(var j=0;j<quik2mb.notes.data.comment.length;j++){
                var v=quik2mb.notes.data.comment[j];
                if(v.date==data['note-pins'][i]){
                    quik2mb.notes.data.gdlist.push(v);
                }
                quik2mb.notes.data.comment[j].pined=true;
            }
        }
        function getTitle(note){
            var firstLine='',firstLinePos=note.indexOf('\n');
            if(firstLinePos!=-1){
                firstLine=note.substring(0,firstLinePos)
            }else{
                firstLine=note;
            }
            if(firstLine.length>30){
                return firstLine.substring(0,30);
            }else{
                return firstLine;
            }
        }

        return quik2mb;
    }
    return openQUIK1Helper;
    
    /*
    {
    "searchmodes": {
        "bing": {
            "icon": "https://cn.bing.com/favicon.ico",
            "search": "https://cn.bing.com/search?q={}"
        }
    },
    "pins": [
        {
            "url": "https://fanyi.baidu.com/",
            "name": "百度翻译"
        }
    ],
    "settings": {
        "通用": {
            "asif": true,
            "msqh": "浅色",
            "atfs": false,
            "juse": false,
            "trse": true,
            "caase": true,
            "qhttps": false,
            "ljdx": "小"
        },
        "一言": {
            "atqd": true,
            "apiq": "hitokoto"
        },
        "休息模式": {
            "0": true,
            "1": "0.5min"
        },
        "显示效果": {
            "aaaa": false,
            "aaab": false,
            "aabb": false
        },
        "背景": {
            "bgmb": "2",
            "bgmf": 0
        }
    },
    "autofocuss": false,
    "jusearch": false,
    "trsearch": true,
    "casearch": true,
    "qhttps": false,
    "says": "海内存知己，天涯若比邻。",
    "daojishi": [],
    "note": [
        [
            "Hello4",
            "2024/6/24 10:37:01",
            1719196617390
        ],
        [
            "Hello3",
            "2024/6/24 10:36:55",
            1719196611957
        ],
        [
            "Hello2",
            "2024/6/24 10:36:50",
            1719196607898
        ],
        [
            "Hello",
            "2024/6/24 10:34:55",
            1719196495286
        ]
    ],
    "note-pins": [],
    "background": {
        "type": 0,
        "src": 0
    },
    "bg-list": {
        "img": [
            "https://img.loliapi.cn/i/pc/img69.webp",
            "https://img.loliapi.cn/i/pc/img316.webp",
            "https://img.loliapi.cn/i/pc/img250.webp",
            "https://img.loliapi.cn/i/pc/img40.webp"
        ],
        "color": [],
        "video": []
    },
    "logined": true,
    "version": {
        "name": "1.7.8",
        "code": 12,
        "exp": "<ol><li><b> ! </b>UI第一次大优化</li></ol>"
    },
    "news_select": "bilibili",
    "userLocation": {
        "ok": 1,
        "data": {
            "province": "江西省",
            "city": "赣州市",
            "district": "全南县"
        }
    },
    "searchmode": "bing"
}
    */
   /*
   {
    "setting": {
        "title": "设置",
        "desc": "QUIK起始页的各项设置",
        "data": {
            "justsearch": false,
            "ob_autofocus": false,
            "linkblur": true,
            "theme": "a",
            "ob_cal": true,
            "ob_tran": true
        }
    },
    "search": {
        "title": "搜索引擎",
        "desc": "搜索引擎配置",
        "data": {
            "typelist": {
                "bing": "https://cn.bing.com/search?q=%keyword%",
                "baidu": "https://www.baidu.com/s?wd=%keyword%",
                "so": "https://so.com/s?q=%keyword%",
                "sogou": "https://sogou.com/web?query=%keyword%",
                "google": "https://google.com/search?q=%keyword%"
            },
            "type": "bing"
        }
    },
    "link": {
        "title": "链接",
        "desc": "QUIK起始页链接数据",
        "data": {
            "enabledCate": true,
            "linksize": "m",
            "links": [
                {
                    "title": "百度翻译",
                    "url": "https://fanyi.baidu.com/"
                },
                {
                    "title": "哔哩哔哩",
                    "url": "https://bilibili.com/"
                },
                {
                    "title": "B站创作者中心",
                    "url": "https://member.bilibili.com/"
                },
                {
                    "title": "我的小站",
                    "url": "https://siquan001.github.io/"
                },
                {
                    "title": "我的音乐盒子",
                    "url": "https://siquan001.github.io/mymusicbox3/"
                },
                {
                    "title": "Fh音乐",
                    "url": "https://siquan001.github.io/fhmusic/beta/"
                },
                {
                    "title": "Github",
                    "url": "https://github.com/"
                },
                {
                    "title": "Codespaces",
                    "url": "https://github.com/codespaces/"
                },
                {
                    "title": "MDN",
                    "url": "https://developer.mozilla.org/zh-CN"
                },
                {
                    "title": "Neat Reader",
                    "url": "https://neat-reader.cn/"
                },
                {
                    "title": "Vue",
                    "url": "https://cn.vuejs.org"
                },
                {
                    "title": "酷狗音乐",
                    "url": "https://kugou.com/"
                },
                {
                    "title": "腾讯微云",
                    "url": "https://weiyun.com/"
                },
                {
                    "title": "百度",
                    "url": "http://www.baidu.com"
                }
            ],
            "cate": {
                "国外网站": [
                    {
                        "title": "Google",
                        "url": "https://google.com/"
                    },
                    {
                        "title": "Youtube",
                        "url": "https://youtube.com/"
                    },
                    {
                        "title": "Facebook",
                        "url": "https://facebook.com/"
                    },
                    {
                        "title": "Google Developers",
                        "url": "https://developers.google.com/"
                    },
                    {
                        "title": "Google Fonts",
                        "url": "https://fonts.google.com/"
                    },
                    {
                        "title": "Pixiv",
                        "url": "https://pixiv.net/"
                    }
                ],
                "好的项目": [
                    {
                        "title": "android on web",
                        "url": "https://android.blueedge.me/"
                    },
                    {
                        "title": "Win11 in React",
                        "url": "https://win11.blueedge.me/"
                    },
                    {
                        "title": "Clear Writer",
                        "url": "https://clearwriter.gitee.io/clearwriter-online/"
                    },
                    {
                        "title": "PrismJS - 代码高亮插件",
                        "url": "http://prismjs.com/"
                    },
                    {
                        "title": "CodeMirror 5",
                        "url": "http://codemirror.net/5"
                    },
                    {
                        "title": "Editor.MD",
                        "url": "https://pandao.github.io/editor.md/"
                    },
                    {
                        "title": "layui",
                        "url": "http://layui.dev/"
                    },
                    {
                        "title": "varlet",
                        "url": "https://varlet.gitee.io/varlet-ui/"
                    },
                    {
                        "title": "Bootstrap Icon",
                        "url": "https://icons.getbootstrap.com/"
                    },
                    {
                        "title": "Font Awesome",
                        "url": "https://fontawesome.com/"
                    }
                ],
                "奇怪的东西": []
            }
        }
    },
    "says": {
        "title": "一言",
        "desc": "QUIK起始页一言相关配置",
        "data": {
            "usersay": "海内存知己，天涯若比邻",
            "saytype": "user",
            "enabled": true
        }
    },
    "background": {
        "title": "背景",
        "desc": "QUIK起始页背景相关配置",
        "data": {
            "bg": {
                "type": "default",
                "data": {
                    "type": "color",
                    "light": "#fff",
                    "dark": "#333"
                }
            },
            "usercolor": {
                "dark": "#333333",
                "light": "#ffffff"
            },
            "ivsetting": {
                "mb": "24",
                "isbr": false,
                "br": 6,
                "th": 1
            }
        }
    },
    "addon": {
        "title": "插件",
        "desc": "QUIK起始页插件数据",
        "data": {
            "575vhjn5ielyhz7gw9": {
                "name": "天气",
                "version_code": 5,
                "version": "1.0.4",
                "desc": "在QUIK起始页左上角显示今日天气",
                "author": "siquan",
                "icon": "https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/weather/day/01.png",
                "website": "https://siquan001.github.io/",
                "update": "version.txt",
                "signature": "siquan.weather",
                "id": "575vhjn5ielyhz7gw9",
                "marketId": "001"
            },
            "n0jgj6wpw4jlyhz7iws": {
                "name": "热点",
                "version_code": 2,
                "version": "1.0.1",
                "desc": "点击左下角的图标查看今日热点",
                "author": "siquan",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA55JREFUaEPtWjuPElEUdhAZ8RFi66oxZjpE5CWFndnEmGyrhnVj53Zro4nuRrNosrqNhZaURrCwsbCwMnZglqdIpWtMfPyA1QRWXn6X3EsAZ4Z7YQaGwCST3Zk595zvO4977sxF2qNzBAKBA3h8F+dis9k8KUnSXj15s58BQx0YvsFO3OFwbCaTybKkZZSCf4fnYbOBDag/BRIX9Ag8hOL7AyofyTBE44EmAb/fvw2BUxTJWqVSeVIqlf6OBJmGEbfb7ZBl+TZwbVCRL3oEaiznAV4eN3jGSVEU2eVyVch1qyZ0aqDJnmUyGU25cUQE9dnGJkwgGAxugPktAJc5wX+G3CU4YZtTvq+YKgGPx3ME+bUAcEephk21CGDwLu47+lrpFlgDgceCYzTF/yOAgr2CfI9hhEttVGcKdQ7mBURmi3Q6HeWV7yfXRQApcb7RaLyHEbvWQC0CerUBvVFEc53o7CRAnIVbcT17KjjysOVj97sI4OItHlxk0xL+vsZZx3lHI4W4iluLAOydgN4bOPf18zR7DkcUs9lsXJUAPLIDbxymDxVWbJ0sjYwAL2g9ud4IqHp0RkCjBsLh8LFqtRpB1G0C0fiKLHilVQMjjQBS9iotYpGV7UcQ8FqCgIDX+fqAaK739AHyrqB6YOaYR5rM906jViPAhcfURjZABMjaRuFCToUQjSU2j5vRyISKGAAUeDQCbAc5SZACfAnZlh3DG5loBDhBmyo2VCMzFRmn8qEIYPBl2GGvmpwmhxYzrpGhBoqogdNDQxJTUEQdnTGkkYnZNUd6qBQyB5KY1ukmAPYF+Kudj2K+G1i6gBo4a0gNoIiXRl3E6OSf0MlfGEJgYB8aOHDqa0CokSH8jXq9nigUCj9JEMb+RibayOg3/Qh7JaSr0YTgXsOskVn34+7ULadFGxlqgOwzLLIaIKtZ3CM1oPkpU2XGHWsjq9psttjW1tZ3AiwUCh3Ht9hl/CvyaXHWyCayiNlGxi7yd3/HOmQyGhndSrqJgnuKhdQ9RsCKjew3wB0iAFFcc7lc7peB6y7DVXm93jm73f6DKIZzdySfz/cBs8Q5amkV6dLeGzPcugEKMQ2vQs0jqiol4cYKLp7RG2Qjex2ReG61SFDPXwe+KM7WJiN6yYpEN45TuG6/8RjgqFGoyGMDPtyaHim7NxNEIl+r1RbIEr09v5PfITidzmUUxjUQId99WoVtoeMPUqYIPIlyuRxjP334B98K7ZM3qBnqAAAAAElFTkSuQmCC",
                "website": "https://siquan001.github.io/",
                "update": "version.txt",
                "signature": "siquan.news",
                "id": "n0jgj6wpw4jlyhz7iws",
                "marketId": "002"
            },
            "pf06bv6jq4glyiff0a2": {
                "name": "便签",
                "version_code": 2,
                "version": "1.0.1",
                "desc": "在右上角打开便签，快速记录一些事情，也可以将一条便签固定在页面左上方提醒自己",
                "author": "siquan",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAd5JREFUaEPtWTtOwzAYtl1YkJK02TvDxgUYYIEVCakSO/QMXAJxABAXAIkLMFBRxMqIujAAAxKkL8FE/eOAiprGeblOYivuGNu/v5dTx8ZI8x/WHD8yBMp2kOvA17nbnFB6ggBvI4ytUkECjBHC1wDkyG6/9+axhAj8gUcPrKNbKvDw5F4N0PrKofcy2xQiMD6rXyJE9hQDP4VzYR14rXgCp41R6bGJUo/CyGr3nQQHXFBU/V9YzIFAajgR0pzAsOso7YCzMYx3wBDIeQEZB3IWOLG8cSBRopw7VNcB8ljLWdtgebo24c4n7ID2BAqVP2YyYQcMAUkKVNcB7Rex9gQkRXjhMtVdAwtLJ6lAdR0QXcRRexpRQ4Qd0J6AqGJpxuFv1uuNIPzJDhxo9Aiw6Y3dGmzFHmwVfSrhg8dPbKvO3z3/Y+WB9xtDB1uFE3hlyo/jrymiwCtBgPSY+hljo1SE4l4OYAPLfD+Q+fkVUnqEogikAa9GhDjf2mnBK0kgC3g+gVu70AuO2QhlBc8lMLhzrjCg3TR/QDL6TAmIgOcSGHWtVUDknjU2ZABMquETEAXPJeA//Oi4zeWlyTFQ2GH3ZXYSiEXa4Zl06vv9TdEa5qZeVDlZ44wDspQUrfMDQ3UCQPMbnfEAAAAASUVORK5CYII=",
                "website": "https://siquan001.github.io/",
                "update": "version.txt",
                "signature": "siquan.notes",
                "id": "pf06bv6jq4glyiff0a2",
                "marketId": "003"
            }
        }
    },
    "notes": {
        "title": "便签",
        "desc": "便签数据",
        "addon": "market:003",
        "data": {
            "comment": [
                {
                    "title": "海内存知己，天涯若比邻。",
                    "date": 1720772397193,
                    "id": "9l9m84xk3s8"
                }
            ],
            "gdlist": [],
            "n-9l9m84xk3s8": "海内存知己，天涯若比邻。"
        }
    }
}
   */
})();