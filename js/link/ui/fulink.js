const { SettingItem } = require("../../setting");
const util = require("../../util");
const { initsto } = require("../core/_core");
const { getCates,getLinks,on } = require("../core/_link");
// const link = require("./link");
const { glinkli, openLinkEditDialog } = require("./link");


let fulinkF=el("div.fulink-con.linkscroll");
function drawFulink(){
    fulinkF.parent().addClass("fu");
    fulinkF.innerHTML=`<div class="cate-item" data-mr>${util.getGoogleIcon('e838', { type: 'fill' })}</div><ul class="link-list" data-mr></ul>`;
    getLinks(null,(a)=>{
        if(a.code!=0)return;
        let d=a.data;
        d.forEach((l)=>{
            let li=glinkli(l,{
                nodrag:true
            });
            fulinkF.$(".link-list[data-mr]").append(li);
        })
        var li = el('li.link-add');
        li.innerHTML = `<a href="javascript:void(0)" class="material-symbols-outlined">&#xe145;</a>`;
        fulinkF.$(".link-list[data-mr]").append(li);
        li.onclick = () => {
            openLinkEditDialog(-1, null);
        }
    })
    getCates((a)=>{
        if(a.code!=0)return;
        let c=require("./cate");
        let d=a.data;
        for(let k of d){
            let tF=el("div",{
                class:"cate-item",
                'data-cate':k
            });
            tF.innerText=k;
            c.gcate(tF);
            tF.onclick=function(e){
                this.oncontextmenu.call(this,e);
            }
            let lF=el("ul",{
                class:"link-list",
                'data-cate':k
            });
            fulinkF.append(tF);
            fulinkF.append(lF);
            getLinks(k,(lm)=>{
                lm.data.forEach((l)=>{
                    let li=glinkli(l,{
                        nodrag:true
                    });
                    lF.append(li);
                })
                var li = el('li.link-add');
                li.innerHTML = `<a href="javascript:void(0)" class="material-symbols-outlined">&#xe145;</a>`;
                lF.append(li);
                li.onclick = () => {
                    openLinkEditDialog(-1, k);
                }
            })
            
        }
    })
}

on("change",(cl)=>{
    console.log(cl);
    
    if(!fulinkF.parent().classList.contains('fu'))return;
    if(cl.type=="all"||cl.type.indexOf("cate")!=-1){
        drawFulink();return;
    }
    let lsF;
    if(cl.cate){
        lsF=fulinkF.$( '.link-list[data-cate="'+cl.cate+'"]');
    }else{
        lsF=fulinkF.$(".link-list[data-mr]");
    }
    if(cl.type=='add'){
        var li = glinkli(cl.detail,{nodrag:true});
        lsF.insertBefore(li, util.query(lsF,".link-add"));
    }else if (cl.type == 'change') {
        if (!(cl.other && cl.other.justindex)) {
            var lis = lsF.$$('li');
            var tli = lis[cl.index];
            if (cl.index < cl.detail.index) {
                lsF.insertBefore(tli, lis[cl.detail.index + 1]);
            } else {
                lsF.insertBefore(tli, lis[cl.detail.index]);
            }
            tli.$('a').href = cl.detail.url;
            tli.$('p').innerText = cl.detail.title;
            if(cl.detail.icon){
                tli.$('img').src=cl.detail.icon;
                tli.$('img').addClass('load');
            }else{
                util.getFavicon(cl.detail.url, favicon => {
                    if (favicon) {
                        tli.$('img').src = favicon;
                    } else {
                        tli.$('img').src = util.createIcon(cl.detail.title[0]);
                    }
                });
            }
            
        }
    }else if (cl.type == 'delete') {
        var li = lsF.$$('li')[cl.index];
        li.remove();
    }
})
let s;
function init(linkF,linksg){
    s=new SettingItem({
        title:"全分组显示",
        message:"开启后所有分组链接将会全部显示在页面上",
        type:"boolean",
        get(){
            return !!initsto.get("showfulink");
        },
        callback(v){
            initsto.set("showfulink",v);
            if(v){
                drawFulink();
            }else{
                linkF.removeClass("fu");
                require("./cate").cateWidthShiPei();
            }
        }
    })

    linksg.addNewItem(s);
    linkF.append(fulinkF);
    if(initsto.get("showfulink")){        
        drawFulink();
    }
}

function stS(v){
    if(!s)return;
    if(v){
        s.show();
    }else{
        initsto.set("showfulink",false);
        s.reGet();
        s.hide();
    }
}

module.exports={
    init,
    stS
}
