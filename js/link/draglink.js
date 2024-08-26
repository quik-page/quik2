(()=>{
    util.initSet(initsto,'draglink',true);
    var drags=new SettingItem({
        type:'boolean',
        index:2,
        title:"拖动排序链接(Beta)",
        message:"开启后，你可以通过拖动链接来进行排序，手机端需长按链接1s才可拖动（Beta）",
        get(){
          return initsto.get('draglink');
        },
        callback(v){
          initsto.set('draglink',v);
        }
    });
    setTimeout(()=>{
    linksg.addNewItem(drags);
    });
    function getLineLinkNum(){
        var a=util.query(linkF,'.link-list').offsetWidth/util.query(linkF,'.link-list li').offsetWidth;
        return parseInt(a);
    }


    function f(li){
        function g(a){
            var gtimeout=null;
            li.addEventListener(a?'mousedown':'touchstart',(e)=>{
                if(e.which==3){return;}
                if(!initsto.get('draglink'))return;
                let startX =a? e.offsetX:(e.targetTouches[0].pageX-li.getBoundingClientRect().left);
                let startY =a? e.offsetY:(e.targetTouches[0].pageY-li.getBoundingClientRect().top);
                console.log(startX,startY);
                console.log(li.offsetTop);
                if(a){
                    gtimeout=setTimeout(()=>{
                        document.addEventListener('mousemove',_move,{passive:false})
                    },50);
                    document.addEventListener('mouseup',_up,{passive:false});
                }else{
                    gtimeout=setTimeout(()=>{
                        document.addEventListener('touchmove',_move,{passive:false});
                        li.classList.add('touching');
                    },1000);
                    document.addEventListener('touchend',_up,{passive:false});
                }
                
                var b=null,n=null;
                function _move(e){
                    e.preventDefault();
                    if(!b){
                        li.querySelector('a').addEventListener('click',pv);
                        b=li.cloneNode(true);
                        b.classList.add('dragging-link');
                        document.body.appendChild(b);
                        b.style.width=li.offsetWidth+'px';
                        b.style.height=li.offsetHeight+'px';
                    }
                    var x=(a?e.pageX:e.targetTouches[0].pageX)-startX;
                    var y=(a?e.pageY:e.targetTouches[0].pageY)-startY;
                    b.style.left=x+'px';
                    b.style.top=y+'px';
                    var jx=util.query(linkF,'.link-list').offsetLeft;
                    var jy=util.query(linkF,'.link-list').offsetTop;
                    var dx=x-jx+50;
                    var dy=y-jy+util.query(linkF,'.link-list').scrollTop;
                    var dw=b.offsetWidth;
                    var dh=b.offsetHeight;
                    if(y-jy<0||y>util.query(linkF,'.link-list').offsetHeight+util.query(linkF,'.link-list').offsetTop){
                        var line=util.query(linkF,'.link-list .insert-line');
                        line.style.display='none';
                        console.log('out');
                        n=null;
                        if(y-jy<0){
                            scrollingtop();
                        }else{
                            scrollingbottom();
                        }
                    }else{
                        clearInterval(stt);
                        var h=parseInt(dy/dh);
                        var w=parseInt(dx/dw);
                        var ne=w+h*getLineLinkNum();
                        if(linklist.length>ne){
                            n=ne;
                            console.log(n,h,w);
                            var line=util.query(linkF,'.link-list .insert-line');
                            line.style.top=h*dh+7+'px';
                            line.style.left=w*dw+'px';
                            line.style.height=dh+'px';
                            line.style.display='block';
                        }
                    }
                    

                }

                function pv(e){
                    e.preventDefault();
                }

                function _up(e){
                    clearTimeout(gtimeout);
                    li.classList.remove('touching');
                    setTimeout(()=>li.querySelector('a').removeEventListener('click',pv),10);
                    document.removeEventListener(a?'mousemove':'touchmove',_move)
                    document.removeEventListener(a?'mouseup':'touchend',_up)
                    if(b){
                        b.remove();
                        b=null;
                    }
                    if(n!==null){
                        var line=util.query(linkF,'.link-list .insert-line');
                        line.style.display='none';
                        var index=getIndex(li,util.query(linkF,'.link-list li',true));
                        if(n==index)return;
                        var cate=util.query(linkF,'.cate-bar-items .cate-item.active');
                        if(cate.classList.contains('mr')){
                            cate=null
                        }else{
                            cate=cate.innerText;
                        }
                        link.changeLink(cate,index,{
                            url:linklist[index].url,
                            title:linklist[index].title,
                            index:n
                        },(back)=>{
                            if(back.code!=0){
                                toast.show(back.msg);
                            }else{
                                linklist.splice(n,0,linklist.splice(index,1)[0]);
                                if(n>index){
                                    util.query(linkF,'.link-list').insertBefore(li,util.query(linkF,'.link-list li',true)[n+1]);
                                }else{
                                     util.query(linkF,'.link-list').insertBefore(li,util.query(linkF,'.link-list li',true)[n]);
                                }
                            }
                        },{
                            justindex:true
                        })
                    }
                }
                return true;
            });
        }
        g(0);
        g(1);
    }

    var stt=null;
    function scrollingtop(){
        clearInterval(stt);
        stt=setInterval(()=>{
            util.query(linkF,'.link-list').scrollTop--;  
            if(util.query(linkF,'.link-list').scrollTop<=0){
                clearInterval(stt);
            }           
        },5);
    }

    function scrollingbottom(){
        clearInterval(stt);
        stt=setInterval(()=>{
            util.query(linkF,'.link-list').scrollTop++;    
            if(util.query(linkF,'.link-list').scrollTop>=util.query(linkF,'.link-list').scrollHeight-util.query(linkF,'.link-list').offsetHeight){
                clearInterval(stt);
            }         
        },5);
    }

    return f;
})()