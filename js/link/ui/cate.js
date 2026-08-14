let util=require('../../util');
let toast=require('../../toast');
let {initsto}=require('../core/_core');
let link=require('../core/_link');
const { SettingItem } = require('../../setting');
const dialog = require('../../dialog');
const { confirm } = require('../../dialog/dialog_utils');
const menu = require('../../menu/index');
const { stS } = require('./fulink');
const { isTouchEdit } = require('./link');


var linkF,linksg,enabledCateSi;
let catechange=()=>{};

function init(_linkF,_linksg){
    linkF=_linkF;
    linksg=_linksg;
    enabledCateSi = new SettingItem({
        type: 'boolean',
        title: "链接分组",
        message: "(Alt+G)启用链接分组功能来管理链接",
        get() {
            return initsto.get('enabledCate');
        },
        callback(v) {
            initsto.set('enabledCate', v);
            stS(v);
            dcate(v);
        }
    });
    
    
    linksg.addNewItem(enabledCateSi);
    
    
    var remeberCateSi = new SettingItem({
        type: 'boolean',
        title: "记住分组",
        message: "开启后，下次打开时会自动选择上一次的分组",
        get() {
            return !!initsto.get('remeberCate');
        },
        callback(v) {
            initsto.set('remeberCate', v);
        }
    });
    
    
    linksg.addNewItem(remeberCateSi);

    initCate();
}

let catelist=[];

var menuedCate = null;
var cateMenu = new menu({
    list: [{
        icon: util.getGoogleIcon('e3c9'),
        title: "修改",
        click() {
            var cate = menuedCate.innerText;
            openCateEditDialog(cate);
        }
    }, {
        icon: util.getGoogleIcon('e92e'),
        title: "删除",
        click() {
            var cate = menuedCate.innerText;
            link.deleteCate(cate, result => {
                if (result == 0) {
                    toast.show('删除成功')
                } else {
                    toast.show(result.msg);
                }
            });
        }
    }, {
        icon: util.getGoogleIcon('E89E'),
        title: "打开",
        click() {
            actCate(menuedCate);
        }
    }]
});

function bcate(g) {
    var li = util.element('div', {
        class: "cate-item"
    });
    li.innerText = g;
    util.query(linkF, '.cate-bar-items').append(li);
    gcate(li);
}

function gcate(li){
    li.onclick = function (e) {
        if(isTouchEdit()){
            li.oncontextmenu.call(this,e);
            return;
        }
        actCate(this)
    }
    li.oncontextmenu = function (e) {
        e.preventDefault();
        e.stopPropagation();
        menuedCate&&menuedCate.classList.remove('menued');
        menuedCate = this;
        cateMenu.setOffset({
            top: e.pageY,
            left: e.pageX
        })
        this.classList.add('menued');
        cateMenu.show();
    }
}

function drawCate() {
    var cates = util.query(linkF, '.cate-bar-items .cate-item', true);
    cates.forEach(c => {
        if (c.classList.contains('mr')) {
            return;
        } else {
            c.remove();
        }
    })
    catelist.forEach(g => {
        bcate(g);
    });
}

function actCate(cateEl) {
    util.query(linkF, '.link-list').innerHTML = '<div class="insert-line"></div>';
    var cate = null;
    if (typeof cateEl == 'string') {
        try { util.query(linkF, '.cate-bar-items .cate-item.active').classList.remove('active'); } catch (e) { };
        var cateEls = util.query(linkF, '.cate-bar-items .cate-item', true);
        for (var i = 0; i < cateEls.length; i++) {
            if (cateEls[i].classList.contains('mr')) {
                continue;
            }
            if (cateEls[i].innerText == cateEl) {
                cateEls[i].classList.add('active');
                break;
            }
        }
        cate = cateEl;
    } else if (!cateEl) {
        try { util.query(linkF, '.cate-bar-items .cate-item.active').classList.remove('active'); } catch (e) { };
        util.query(linkF, '.cate-bar-items .cate-item.mr').classList.add('active');
    } else {
        try { util.query(linkF, '.cate-bar-items .cate-item.active').classList.remove('active'); } catch (e) { };
        if(!(cateEl instanceof HTMLElement)){
            actCate();
            return;
        }
        cateEl.classList.add('active');
        if (!cateEl.classList.contains('mr')) {
            cate = cateEl.innerText;
        }else{
            cate = null;
        }
    }
    initsto.set('lastingCate', cate);
    catechange(cate);
}

var cateeditDialog;

function openCateEditDialog(cate) {
    if (!cateeditDialog) {
        cateeditDialog = new dialog({
            class: "link-add-dialog",
            content: require('../htmls/cateedit.html'),
        });
        // @note 将cancel按钮修改为div，防止表单submit到cancel
        // @edit at 2024/1/30 15:20
    }
    var d = cateeditDialog.getDialogDom();
    util.query(d, '.cancel.btn').onclick = (e) => {
        e.preventDefault();
        cateeditDialog.close();
    }
    setTimeout(() => {
        cateeditDialog.open();
        link.getCates(function (r) {
            var k = r.data;
            if (cate) {
                _n('修改分组', cate, k.indexOf(cate) + 1, k.length, function (catename, cateindex) {
                    link.renameCate(cate, catename, (result) => {
                        if (result.code < 0) {
                            toast.show(result.msg);
                            return;
                        }
                        toast.show('修改成功')
                        cateeditDialog.close();
                    }, cateindex)
                })
            } else {
                _n('添加分组', '', k.length + 1, k.length + 1, function (catename, cateindex) {
                    link.addCate(catename, (result) => {
                        if (result.code < 0) {
                            toast.show(result.msg);
                            return;
                        }
                        toast.show('添加成功')
                        cateeditDialog.close();
                    }, cateindex)
                });
            }
        });

    })

    function _n(a, b, c, f, h) {
        util.query(d, 'h1').innerHTML = a;
        util.query(d, '.cate-name').value = b;
        util.query(d, '.cate-index').value = c;
        util.query(d, '.cate-index').max = f;
        util.query(d, '.cate-index').min = 1;
        util.query(d, 'form').onsubmit = (e) => {
            e.preventDefault();
            var catename = util.query(d, '.cate-name').value;
            var cateindex = util.query(d, '.cate-index').value;
            h(catename, cateindex - 1);
        }
    }
}

if (typeof initsto.get('enabledCate') == 'undefined') {
    initsto.set('enabledCate', false);
}




function dcate(v) {
    if (v) {
        util.query(linkF, '.cate-bar').style.display = 'block';
        initCate();
        setTimeout(() => { cateWidthShiPei(); }, 10);
    } else {
        util.query(linkF, '.cate-bar').style.display = 'none';
    }
    actCate(initsto.get('remeberCate')?(initsto.get('lastingCate')||null):null);
}

function initCate() {
    if (isinitcate) return;
    util.query(linkF, '.cate-item.mr').onclick = function () {
        try { util.query(linkF, '.cate-bar-items .cate-item.active').classList.remove('active'); } catch (e) { };
        this.classList.add('active');
        actCate();
    }
    util.query(linkF, '.cate-item.mr').oncontextmenu = function (e) {
        e.preventDefault();
        e.stopPropagation();
        mrcateMenu.setOffset({
            top: e.pageY,
            left: e.pageX
        })
        mrcateMenu.show();
    }
    util.query(linkF, '.cate-add-btn').onclick = () => {
        openCateEditDialog();
    }
    util.query(linkF, '.cate-left-btn').onclick = () => {
        util.query(linkF, '.cate-bar-scrolls').scrollTo({
            left:
                c(util.query(linkF, '.cate-bar-scrolls').scrollLeft -
                    util.query(linkF, '.cate-bar-scrolls').getBoundingClientRect().width / 2),
            behavior: 'smooth'
        })
    }
    util.query(linkF, '.cate-right-btn').onclick = () => {
        util.query(linkF, '.cate-bar-scrolls').scrollTo({
            left:
                c(util.query(linkF, '.cate-bar-scrolls').scrollLeft +
                    util.query(linkF, '.cate-bar-scrolls').getBoundingClientRect().width / 2),
            behavior: 'smooth'
        })
    }
    function c(a) {
        if (a < 0) return 0;
        var w = util.query(linkF, '.cate-bar-scrolls').scrollWidth - util.query(linkF, '.cate-bar-scrolls').getBoundingClientRect().width;
        if (a > w) return w;
    }
    util.query(linkF, '.cate-bar-scrolls').onscroll = function () {
        checkScrollBtn.call(this);
    }
    checkScrollBtn.call(util.query(linkF, '.cate-bar-scrolls'));
    isinitcate = true;
}

function checkScrollBtn() {
    var a = 0;
    if (this.scrollLeft == 0) {
        util.query(linkF, '.cate-left-btn').classList.add('disabled');
        a++;
    } else {
        util.query(linkF, '.cate-left-btn').classList.remove('disabled');
    }
    if (this.scrollLeft >= this.scrollWidth - this.getBoundingClientRect().width) {
        util.query(linkF, '.cate-right-btn').classList.add('disabled');
        a++;
    } else {
        util.query(linkF, '.cate-right-btn').classList.remove('disabled');
    }
    this.style.width = 'calc(100% - ' + (120 - a * 40) + 'px)';
}
window.addEventListener('resize', () => {
    checkScrollBtn.call(util.query(linkF, '.cate-bar-scrolls'));
})

function cateWidthShiPei() {
    var cates = util.query(linkF, '.cate-bar-items .cate-item', true);
    // edit at 2024年2月24日 17点45分
    // @note 清除上次width的影响 （除非width>100000px）
    util.query(linkF, '.cate-bar-items').style.width = '100000px';
    // 强行渲染
    cates[0].offsetWidth;
    var w = 0;
    cates.forEach(function (c) {
        // console.log(c.getBoundingClientRect().width+4);
        // edit at 2024年1月29日 15点37分
        // @note 因为加了margin
        w += c.getBoundingClientRect().width + 10;
    })
    util.query(linkF, '.cate-bar-items').style.width = w + 'px';
    checkScrollBtn.call(util.query(linkF, '.cate-bar-scrolls'));
}


function observeCate() {
    var ob = new MutationObserver(() => {
        setTimeout(cateWidthShiPei, 1)
    });
    ob.observe(util.query(linkF, '.cate-bar-items'), {
        childList: true
    });
}

var isinitcate = false;
var mrcateMenu = new menu({
    list: [{
        icon: util.getGoogleIcon('e92e'),
        title: "清空",
        click() {
            confirm('确定清空默认分组的链接吗？该操作不可恢复！', function (ok) {
                if (ok) {
                    link.setAll([], null, function (o) {
                        if (o == 'link') {
                            toast.show('清空成功')
                        }
                    });
                }
            })
        }
    }],
    offset: {
        top: 0,
        left: 0
    }
});


let ex={
    observeCate,
    init,
    getCatelist:()=>catelist,
    setCatelist:(cl)=>{
        catelist=cl;
    },
    actCate,
    bcate,
    drawCate,
    dcate,
    cateWidthShiPei,
    catechange:(fn)=>{
        catechange=fn;
    },
    gcate,
    getMenuedCate:()=>menuedCate,
}

Object.defineProperty(ex,'enabledCateSi',{
    get:()=>enabledCateSi
})

module.exports=ex;