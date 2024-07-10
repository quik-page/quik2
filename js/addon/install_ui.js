(function(){
    function installui(){
        var n=new dialog({
            content:_REQUIRE_('./install_ui.html').replace('{deficon}',def_addon_icon),
            class:"addon_install_ui",
            clickOtherToClose:false
        });
        this._d=n;
        var d=this._d.getDialogDom();
        util.query(d,'.btns').style.display='none';
    }

    installui.prototype={
        bind:function(p){
            var _=this;
            var d=this._d.getDialogDom();
            util.query(d,'.msg').innerText=p.statuMsg+'...';
            util.query(d,'.progress .r').style.width=p.progress*100+'%';
            if(p.errorCode!=-1){
                util.query(d,'.msg').innerText=p.errorMsg;
                util.query(d,'.progress').className='progress error';
                util.query(d,'.btns').style.display='block';
                util.query(d,'.btn.l').onclick=
                util.query(d,'.btn.r').onclick=function(){
                    _.hide();
                    setTimeout(function(){
                        _.destroy();
                    },200)
                }
            }
            p.on('status',function(s){
                util.query(d,'.msg').innerText=s.msg;
            });
            p.on('progress',function(p){
                util.query(d,'.progress .r').style.width=p*100+'%';
            });
            p.on('error',function(e){
                util.query(d,'.msg').innerText=e.msg;
                util.query(d,'.progress').className='progress error';
                util.query(d,'.btns').style.display='block';
                util.query(d,'.btn.l').onclick=
                util.query(d,'.btn.r').onclick=function(){
                    _.hide();
                    setTimeout(function(){
                        _.destroy();
                    },200)
                }
            });
            p.on('wait',function(e,d2){
                if(d2.meta){
                    util.query(d,'.sth img').src=d2.meta.icon;
                    util.query(d,'.sth .name').innerText=d2.meta.name;
                    util.query(d,'.sth .version').innerText='版本：'+d2.meta.version;
                }
                util.query(d,'.msg').innerText=d2.msg;
                util.query(d,'.btns').style.display='block';
                util.query(d,'.btn.l').onclick=function(){
                    e(false)
                }
                util.query(d,'.btn.r').onclick=function(){
                    e(true)
                }
            });
            p.on('done',function(){
                console.log('a');
                _.hide();
                setTimeout(function(){
                    _.destroy();
                },200)
            });
        },
        ask:function(msg,fn,de={}){
            var d=this._d.getDialogDom();
            util.query(d,'.sth img').src=de.img||"assets/def_addon.png";
            util.query(d,'.sth .name').innerText=de.name||"-";
            util.query(d,'.sth .version').innerText='版本：'+de.version||'-';
            util.query(d,'.msg').innerText=msg;
            util.query(d,'.btns').style.display='block';
            util.query(d,'.btn.l').onclick=function(){
                fn(false);
                util.query(d,'.btns').style.display='none';
            };
            util.query(d,'.btn.r').onclick=function(){
                fn(true);
                util.query(d,'.btns').style.display='none';
            }
        },
        show:function(){
            this._d.open();
        },
        hide:function(){
            this._d.close();
        },
        destroy:function(){
            this._d.destroy();
        }
    }

    return installui;
})();