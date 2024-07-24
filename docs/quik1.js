(function(factory){
    window.quik1to2(factory());
})(function(){
    function helper(_importData){
        quik.confirm('你确定要从QUIK1中导入数据吗？一些数据导入可能会不全。',function(ok){
            var d=new quik.dialog({
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
                    if(e.data.data){
                        var ret=quik1to2(JSON.parse(e.data.data));
                        d.close();
                        _importData(ret);
                    }else{
                        d.close();
                        alert('未发现QUIK1数据，若数据在本地，请将数据导入QUIK1后再试')
                    }
                    
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
                    "theme": data['settings']['通用']?(data['settings']['通用']['msqh']=='浅色'?"a":"b"):"a",
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
                    "linksize": ({'小':'s','中':'m','大':'l'})[data['settings']['通用']?data['settings']['通用']['ljdx']:'中'],
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
                        if(data['settings']['一言']&&data['settings']['一言']['atqd']){
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
                    "ivsetting": data['settings']['背景']?{
                        "mb": data['settings']['背景']['bgmb']*10,
                        "isbr": !!data['settings']['背景']['bgmf'],
                        "br": !!data['settings']['背景']['bgmf']?data['settings']['背景']['bgmf']:6,
                        "th": 1
                    }:{
                        "mb": 30,
                        "isbr": false,
                        "br": 6,
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

    return helper;
})