const { SettingItem } = require('../../setting/index');
const menu = require('../../menu');
const { initsto } = require('../core/_core');
const dialog = require('../../dialog');
const toast = require('../../toast');
const {showOpenFilePicker} = require('../../base');
let util=require('../../util');
const link=require('../core/_link')
const draglink=require('../draglink');
const { icon } = require('../../iconc');

let linkF,linksg,linkSizeSi;

function initlink(_linkF,_linksg){
    linkF=_linkF;
    linksg=_linksg;
    linkSizeSi = new SettingItem({
        type: 'select',
        title: "链接大小",
        message: "修改链接显示的大小",
        init() {
            return {
                xs: "很小",
                s: "小",
                m: "中",
                l: "大",
                xl: "很大"
            }
        },
        get() {
            return initsto.get('linksize');
        },
        callback(v) {
            initsto.set('linksize', v);
            dsize(v);
        }
    });
    var linkStyleSi = new SettingItem({
        type: 'select',
        title: "链接样式",
        message: "修改链接显示的样式",
        init() {
            return {
                def: "圆方",
                round: "圆形",
                square: "方形",
            }
        },
        get() {
            return initsto.get('linkstyle');
        },
        callback(v) {
            initsto.set('linkstyle', v);
            dstyle(v);
        }
    });
    var linkPLSi = new SettingItem({
        type: 'select',
        title: "链接排列",
        message: "修改链接的排列方式",
        init() {
            return {
                a: "靠左",
                b: "居中",
            }
        },
        get() {
            return initsto.get('linkpailie');
        },
        callback(v) {
            initsto.set('linkpailie', v);
            dstyle();
        }
    });
    var nlinkeditSi=new SettingItem({
        type:'boolean',
        title:"移动端链接操作适配",
        message:"开启后将在右下角显示铅笔图标，点击后单击链接即可进行修改操作",
        get(){
            return initsto.get('touchoe')
        },
        callback(v){
            initsto.set('touchoe',v);
            if(v){
                touchmodeicon.show();
            }else{
                touchmodeicon.hide();
                setTimeout(()=>{
                    toucheditmode=false;
                })
            }
        }
    })
    
    linksg.addNewItem(linkSizeSi);
    linksg.addNewItem(linkStyleSi);
    linksg.addNewItem(linkPLSi);
    linksg.addNewItem(nlinkeditSi);
}

let touchmodeicon=new icon({
    content:util.getGoogleIcon('e3c9'),
    offset:'br',
    class:"touchingmode"
})
if(initsto.get('touchoe')){
    touchmodeicon.show();
}else{
    touchmodeicon.hide();
}

touchmodeicon.getIcon().onclick=function(){
    if(this.classList.contains('active')){
        toucheditmode=false;
        this.removeClass('active');
        toast.show('点击修改模式关闭')
    }else{
        toucheditmode=true;
        this.addClass('active');
        toast.show('点击修改模式开启')
    }
}

var linklist = [];

function drawLinks(){
    linkF.$('.link-list').innerHTML='<div class="insert-line"></div>'
    linklist.forEach(function(link){
        var li = glinkli(link);
        linkF.$('.link-list').append(li);
    })
    var li = el('li', {
        class: "link-add"
    });
    li.innerHTML = `<a href="javascript:void(0)" class="material-symbols-outlined">&#xe145;</a>`;
    linkF.$('.link-list').append(li);
    li.onclick = () => {
        var cate = linkF.$('.cate-bar-items .cate-item.active');
        if (cate.classList.contains('mr')) {
            cate = null
        } else {
            cate = cate.innerText;
        }
        openLinkEditDialog(-1, cate);
    }
}

function getIndex(a, b) {
    for (var i = 0; i < b.length; i++) {
      if (b[i].isSameNode(a)) {
        return i;
      }
    }
    return -1;
}

var menuedLi = null;
function getMenuedLiDetail() {
    var index = getIndex(menuedLi, menuedLi.parent().$$('li'));
    var cate;
    if(linkF.classList.contains("fu")){
        cate=menuedLi.parent().attr('data-cate')||null;
    }else{
        cate = linkF.$('.cate-bar-items .cate-item.active');
        if (cate.classList.contains('mr')) {
            cate = null
        } else {
            cate = cate.innerText;
        }
    }
    
    return { cate, index };
}

var linkMenu = new menu({
    list: [{
        icon: util.getGoogleIcon('e3c9'),
        title: "修改",
        click() {
            var { index, cate } = getMenuedLiDetail();
            openLinkEditDialog(index, cate);
        }
    }, {
        icon: util.getGoogleIcon('e92e'),
        title: "删除",
        click() {
            var { index, cate } = getMenuedLiDetail();
            link.deleteLink(cate, index, function () {
                toast.show('删除成功')
            })
        }
    }, {
        icon: util.getGoogleIcon('e14d'),
        title: "复制链接",
        click() {
            util.copyText(menuedLi.$('a').href);
        }
    }, {
        icon: util.getGoogleIcon('e941'),
        title: "移动至...",
        click() {
            var { index, cate } = getMenuedLiDetail();
            openMoveLinkDialog(cate, index);
        }
    }]
});

let toucheditmode=false;

function glinkli(l,pz={}) {
    var li = el('li');
    li.innerHTML = `<a href="${l.url}" target="_blank" rel="noopener noreferer"><div class="link-icon"><img/></div><p></p></a>`
    li.$('p').innerText = l.title;
    if(l.icon){
        li.$('img').src=l.icon;
        li.$('img').addClass('load');
    }else{
        util.getFavicon(l.url, favicon => {
            if (favicon) {
                li.$('img').src = favicon;
            } else {
                li.$('img').src = util.createIcon(l.title[0]);
            }
            li.$('img').onload = function () {
                this.addClass('load');
            }
        });
    }
    
    function contextmenu(e) {
        e.preventDefault()
        e.stopPropagation();
        menuedLi&&menuedLi.removeClass('menued');
        menuedLi = this;
        linkMenu.setOffset({
            top: e.pageY,
            left: e.pageX
        })
        this.addClass('menued');
        linkMenu.show();
    }
    util.query(li,'a').onclick=function(e){
        if(toucheditmode){
            e.preventDefault();
        }
    }
    li.onclick=function(e){
        if(toucheditmode){
            e.preventDefault();
            contextmenu.call(this,e);
        }
    }
    li.oncontextmenu=contextmenu;
    if(!(pz&&pz.nodrag)){
        draglink(li);
    }
    return li;
}

var movelinkdia = null, movelinkdiad = null, movecc = null;
function openMoveLinkDialog(cate, index) {
    if (!movelinkdia) {
        movelinkdia = new dialog({
            class: "move-link-dialog",
            content: require('../htmls/linkmove.html'),
        });
        movelinkdiad = movelinkdia.getDialogDom();
        util.query(movelinkdiad, '.cancel.btn').onclick = function (e) {
            e.preventDefault();
            movelinkdia.close();
        }
        movecc = util.query(movelinkdiad, '.group-list');
    }
    let link1={};
    link.getLinks(cate,(a)=>{
        if(a.code!=0){
            return;
        }
        link1=a.data[index];
        util.query(movelinkdiad, '.ok.btn').onclick = function (e) {
            var yd = movecc.$('.item.act');
            if (yd) {
                var tocate = yd.classList.contains('mr') ? null : util.query(yd, '.item-name').innerText;
                link.addLink({
                    title: link1.title,
                    url: link1.url,
                    cate: tocate
                }, function () {
                    link.deleteLink(cate, index, function () {
                        toast.show('移动成功')
                        movelinkdia.close();
                    });
                });
    
            } else {
                toast.show('请选择一个分组');
            }
        }
        movecc.innerHTML = '';
        link.getCates(r => {
            r.data.unshift(null);
            r.data.forEach(c => {
                var li = el('div', {
                    class: "item" + ((!c) ? ' mr' : '')
                });
                li.innerHTML = `<div class="item-name">${c ? c : util.getGoogleIcon('e838', { type: 'fill' })}</div><div class="item-select">${util.getGoogleIcon('e5ca')}</div>`;
                movecc.append(li);
                li.onclick = function () {
                    var yd = movecc.$('.item.act');
                    if (yd) {
                        yd.removeClass('act');
                    }
                    this.addClass('act');
                }
            });
        });
        setTimeout(() => {
            movelinkdia.open();
        });
    })
    
}


var linkaddDialog;

function openLinkEditDialog(index, cate) {
    if (!linkaddDialog) {
        linkaddDialog = new dialog({
            class: "link-add-dialog",
            content: require('../htmls/linkedit.html'),
        });
        // @note 将cancel按钮修改为div，防止表单submit到cancel
        // @edit at 2024/1/30 15:20
        var d = linkaddDialog.getDialogDom();
        d.$( '.cancel.btn').onclick = function (e) {
            e.preventDefault();
            linkaddDialog.close();
        }

        d.$('.link-add-icon-upload').onclick=function(e){
            showOpenFilePicker().then(files=>{
                // file to base64
                var reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = function () {
                    var base64 = reader.result;
                    var icon=d.$( '.link-add-icon');
                    icon.value=base64;
                }
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                    toast.show('文件读取失败');
                }
            })
        }
    }
    setTimeout(() => {
        linkaddDialog.open();
        var d = linkaddDialog.getDialogDom();
        var ll = linklist.length;
        if (index == -1) {
            if(linkF.hasClass("fu")){
                link.getLinks(cate,(a)=>{
                    ll=a.data.length;
                    _rthen();
                })
            }else{
                _rthen();
            }
            function _rthen(){
                _n('添加链接', '添加', '', '', ll, ll, (e) => {
                    e.preventDefault();
                    var url = d.$( '.link-add-url').value;
                    if (url.indexOf('://') == -1) {
                        url = 'http://' + url;
                    }
                    var title = d.$( '.link-add-title').value;
                    var index3 = d.$( '.link-add-index').value;
                    index3 = index3 == '' ? ll : (index3 - 0);
                    var icon=d.$( '.link-add-icon').value;
    
                    link.addLink({
                        url, title, index: index3, cate,icon
                    }, r => {
                        if (r.code != 0) {
                            toast.show(r.msg);
                        } else {
                            toast.show('添加成功')
                            linkaddDialog.close();
                        }
                    })
    
                },'');
            }
           
        } else {
            let u=linklist[index].url;
            let t=linklist[index].title;
            let ic=linklist[index].icon;
            if(linkF.hasClass("fu")){
                link.getLinks(cate,(a)=>{
                    let lst=a.data;
                    u=lst[index].url;
                    t=lst[index].title;
                    ic=lst[index].icon;
                    ll=lst.length;
                    _then();
                })
            }else{
                _then();
            }
            function _then(){
                _n('修改链接', '修改', u, t, ll - 1, index, (e) => {
                    e.preventDefault();
                    var url = d.$( '.link-add-url').value;
                    if (url.indexOf('://') == -1) {
                        url = 'http://' + url;
                    }
                    var title = d.$( '.link-add-title').value;
                    var index2 = d.$( '.link-add-index').value;
                    var icon=d.$( '.link-add-icon').value;
                    index2 = index2 == '' ? index : (index2 - 0);
                    link.changeLink(cate, index, {
                        url: url,
                        title: title,
                        index: index2,
                        icon:icon
                    }, (back) => {
                        if (back.code != 0) {
                            toast.show(back.msg);
                        } else {
                            toast.show('修改成功')
                            linkaddDialog.close();
                        }
                    })
                },ic);
            }
        }

        function _n(a, b, c, e, f, g, h,icon) {
            d.$( 'h1').innerHTML = a;
            d.$( '.ok.btn').innerHTML = b;
            d.$( 'input.link-add-url').value = c;
            d.$( 'input.link-add-title').value = e;
            d.$( 'input.link-add-index').setAttribute('max', f);
            d.$( 'input.link-add-index').value = g;
            d.$( 'input.link-add-icon').value=icon||'';
            d.$( 'form').onsubmit = h;
        }
    })
}

if (!initsto.get('linksize')) {
    initsto.set('linksize', 'm');
}
if (!initsto.get('linkstyle')) {
    initsto.set('linkstyle', 'round');
}
if (!initsto.get('linkpailie')) {
    initsto.set('linkpailie', 'a');
}


function dstyle() {
    linkF.className = 'links ' + initsto.get('linkstyle') + ' ' + initsto.get('linkpailie')+ " "+(initsto.get("showfulink")?"fu":"");
}


function dsize(v) {
    linkF.$$('.link-list').forEach(l=>{l.className = 'link-list ' + v});
}


module.exports = {
    initlink,
    drawLinks,
    getLinklist:()=>linklist,
    setLinklist:(l)=>linklist=l,
    dsize,
    dstyle,
    glinkli,
    linkSizeSi,
    getMenuedLi:()=>menuedLi,
    linkMenu,
    getIndex,
    isTouchEdit(){
        return toucheditmode;
    },
    openLinkEditDialog
}