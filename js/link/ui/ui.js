let {SettingGroup, mainSetting,SettingItem}=require('../../setting/index');
let util=require('../../util');
let link=require('../core/_link');
let {initsto}=require('../core/_core')
let linkui=require('./link');
let cateui=require('./cate');
let fulinkui=require('./fulink');

var linkF =el(".links");

$('main .center').append(linkF);

var linksg = new SettingGroup({
    title: "链接",
});

var drags = new SettingItem({
    type: 'boolean',
    index: 2,
    title: "拖动排序链接(Beta)",
    message: "（仅在链接排列靠左时生效）开启后，你可以通过拖动链接来进行排序，手机端需长按链接1s才可拖动（Beta）",
    get() {
        return initsto.get('draglink');
    },
    callback(v) {
        initsto.set('draglink', v);
    }
});


mainSetting.addNewGroup(linksg);
linksg.addNewItem(drags);

function init() {
    linkF.innerHTML = require('../htmls/linkinit.html')
        .replace('{{cate-left}}', util.getGoogleIcon('e314'))
        .replace('{{cate-right}}', util.getGoogleIcon('e315'))
        .replace('{{cate-add}}', util.getGoogleIcon('e145'))
        .replace('{{mr}}', util.getGoogleIcon('e838', { type: 'fill' }))
        
    linkui.initlink(linkF,linksg);
    cateui.init(linkF,linksg);
    fulinkui.init(linkF,linksg);
    link.ready(() => {
        cateui.dcate(initsto.get('enabledCate'));
        fulinkui.stS(initsto.get('enabledCate'));
        linkui.dsize(initsto.get('linksize'));
        linkui.dstyle(initsto.get('linkstyle'));
        setTimeout(function () {
            linkF.style.opacity = 1;
        }, 300)
        link.getCates(data=>{
            cateui.setCatelist(data.data);
        })
        cateui.drawCate();
        cateui.cateWidthShiPei();
        cateui.actCate(initsto.get('lastingCate'));
    })
    cateui.observeCate();
}


cateui.catechange(function(cate){
    link.getLinks(cate,ls=>{
        linkui.setLinklist(ls.data);
        linkui.drawLinks();
    })
})

init();

link.on('change',function(cl){
    if(cl.type=='all'){
        link.getCates(data=>{
            cateui.setCatelist(data.data);
        })
        cateui.drawCate();
        cateui.cateWidthShiPei();
        cateui.actCate();
        return;
    }
    var actcate = linkF.$('.cate-bar-items .cate-item.active');
    if(cl.type.indexOf('cate')!=-1){
        var acate = actcate.innerText;
        link.getCates(data=>{
            cateui.setCatelist(data.data);
        })
        cateui.drawCate();
        cateui.cateWidthShiPei();
        if(cl.type=='cateadd'){
            cateui.actCate(cl.cate);
        }else if(cl.type=='catedelete'&&acate==cl.cate){
            cateui.actCate();
        }else if(cl.type=='caterename'&&acate==cl.cate){
            cateui.actCate(cl.catename);
        }
        return;
    }
    var linklist = linkui.getLinklist();
    if(!actcate) return;
    if (cl.cate == actcate.text() || (cl.cate == null && actcate.hasClass('mr'))) {
        if (cl.type == 'add') {
            var li = linkui.glinkli(cl.detail);
            linkF.$('.link-list').insertBefore(li, linkF.$('.link-list .link-add'));
            linklist.push(cl.detail);
            linkui.setLinklist(linklist);
        } else if (cl.type == 'change') {
            if (!(cl.other && cl.other.justindex)) {
                linklist.splice(cl.index, 1)
                linklist.splice(cl.detail.index, 0, cl.detail);
                linkui.setLinklist(linklist);
                var lis = linkF.$$('.link-list li');
                var tli = lis[cl.index];
                if (cl.index < cl.detail.index) {
                    linkF.$('.link-list').insertBefore(tli, lis[cl.detail.index + 1]);
                } else {
                    linkF.$('.link-list').insertBefore(tli, lis[cl.detail.index]);
                }
                util.query(tli, 'a').href = cl.detail.url;
                util.query(tli, 'p').innerText = cl.detail.title;
                if(cl.detail.icon){
                    util.query(tli, 'img').src=cl.detail.icon;
                    util.query(tli, 'img').addClass('load');
                }else{
                    util.getFavicon(cl.detail.url, favicon => {
                        if (favicon) {
                            util.query(tli, 'img').src = favicon;
                        } else {
                            util.query(tli, 'img').src = util.createIcon(cl.detail.title[0]);
                        }
                    });
                }
                
            }
        } else if (cl.type == 'delete') {
            var li = linkF.$$('.link-list li')[cl.index];
            li.remove();
            linklist.splice(cl.index, 1);
            linkui.setLinklist(linklist);
        }
    }
})

function resetmenued(){
    linkui.getMenuedLi()&&linkui.getMenuedLi().removeClass('menued');
    cateui.getMenuedCate()&&cateui.getMenuedCate().removeClass('menued');
}

document.addEventListener('click', resetmenued)
document.addEventListener('contextmenu', resetmenued)



module.exports={
    isShowCate() {
        return initsto.get('enabledCate');
    },
    setShowCate(v) {
        initsto.set('enabledCate', v);
        cateui.dcate(v);
        cateui.enabledCateSi.reGet();
    },
    getLinkSize() {
        return initsto.get('linksize');
    },
    setLinkSize(v) {
    if (['xs', 's', 'm', 'l', 'xl'].indexOf(v) != -1) {
        initsto.set('linksize', v);
        dsize(v);
        linkSizeSi.reGet();
    }
    },
    cateWidthShiPei:cateui.cateWidthShiPei
}