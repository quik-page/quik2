const { alert } = require("../dialog/dialog_utils");
const { SettingItem, tyGroup } = require("../setting/index");
const { initsto,doevent } = require("./core");
const addon =require('../addon');
const dialog = require("../dialog");
const util = require("../util");

if (!initsto.get('themea')) {
    initsto.set('themea', 'def');
}

var ys = ['dark', 't-dark', 't-light', 'dialogblur', 'lite', 'hiden', 'showall'];
var themesd = {
    'def': {
        name:"默认主题",
        color:['#fff','#333']
    },
    'defcolor':{
        name:"默认颜色",
        type:'color',
        color:['#fff','#333']
    }
};

var themes={
    'def':'默认主题',
    defcolor:"默认颜色"
}

var si = new SettingItem({
    index: 0,
    title: "主题",
    type: "null",
    message: '',
    callback() {
        selectthemeDia.open();
    }
});

var selectthemeDia=new dialog({
    content:require('./stheme.html').replace('{x}',util.getGoogleIcon('e5cd')),
    class:'theme-dialog def-size',
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN,
})

var std=selectthemeDia.getDialogDom();
util.query(std,'.closeBtn').onclick=function(){
    selectthemeDia.close();
}

tyGroup.addNewItem(si);
let nowtheme='def';

function doTheme(f,justadd) {
    if(justadd){
        document.body.classList.add(f);        
        return;
    }
    let fs=f.split('|');
    let not=0;
    for(let i=0;i<fs.length;i++){
        if(themes[fs[i]]==undefined){
            not++;
        }
    }
    if(not!=0){
        return not;
    }
    document.body.classList.forEach((a) => {
        if (!ys.includes(a)) {
            console.log(a);
            document.body.classList.remove(a);
        }
    })
    console.log(fs);
    fs.forEach((a) => {
        document.body.classList.add(a);        
    })
    nowtheme=f;
    doevent('dotheme', []);
    if (!isdotheme) {
        isdotheme = true;
        wf.forEach(f => f());
    }
    return true;
}
var isdotheme = false, wf = [];
function waitdotheme(f) {
    if (isdotheme) {
        f();
    } else {
        wf.push(f);
    }
}

function addTheme(f, n,detail={}) {
    if(f.indexOf('|')!=-1){
        console.error('主题名称不能包含"|"符号');
        return;
    }
    themes[f] = n;
    detail.name=n;
    themesd[f]=detail;
    si.reInit();
    let glsit=initsto.get('themea').split('|');
    if (wait && glsit.indexOf(f) != -1) {
        wait--;
        doTheme(f,true);
    }

    if(isinitselect){
        gtitm(f);
    }
}

function removeTheme(f) {
    if (f == 'def') { return }
    delete themes[f]
    if (initsto.get('themea') == f) {
        initsto.set('themea', 'def')
        si.reGet();
    }
    si.reInit();
}

function setTheme(f) {
    if (!themes[f]) {
        return;
    }
    initsto.set('themea', f);
    doTheme(f);
    si.reGet();
}

var wait = doTheme(initsto.get('themea'));
wait=typeof wait=='number'?wait:0;
var isinitselect=false;

function gtitm(nm){
    let type=themesd[nm].type||'global';
    let nf=util.element('div',{
        class:"theme-item",
        'data-id':nm,
    })
    nf.innerText=themesd[nm].name;
    if(type=='global'){
        util.query(std,'.ztselects.ty').append(nf);
    }else if(type=='color'){
        util.query(std,'.ztselects.co').append(nf);
    }else if(type=='structure'){
        util.query(std,'.ztselects.st').append(nf);
    }

    nf.onclick=function(){
        let type=this.parentNode.classList[1];
        if(type=='ty'){
            util.query(std,'.ztselects .active',true).forEach(a=>a.classList.remove('active'));
            this.classList.add('active');
        }else if(type=='co'){
            util.query(std,'.ztselects.ty .active',true).forEach(a=>a.classList.remove('active'));
            util.query(std,'.ztselects.co .active',true).forEach(a=>a.classList.remove('active'));
            this.classList.add('active');
        }else if(type=='st'){
            util.query(std,'.ztselects.ty .active',true).forEach(a=>a.classList.remove('active'));
            if(this.classList.contains('active')){
                this.classList.remove('active');
            }else{
                this.classList.add('active');
            }
        }

        let f=util.query(std,'.theme-item.active',true);
        f=Array.prototype.slice.call(f);
        f=f.map(a=>a.getAttribute('data-id')).join('|');
        initsto.set('themea', f);
        console.log(f);
        doTheme(f);

    }
}
addon.on('allrun', () => {
    if (wait!=0) {
        initsto.set('themea', 'def');
        doTheme('def');
        alert('您的主题由于插件缺失无法显示，已为您切换为默认。');
    }

    for(var nm in themes){
        gtitm(nm);
    }

    let acs=initsto.get('themea').split('|');
    for(ac of acs){
        util.query(std,'[data-id="'+ac+'"]').classList.add('active');
    }
    isinitselect=true;
})


module.exports = {
    addTheme,
    removeTheme,
    setTheme,
    waitdotheme,
    getTheme:()=>nowtheme,
    getThemeDetail:()=>{
        let fs=nowtheme.split('|');
        for(let i=0;i<fs.length;i++){
            if(themesd[fs[i]].type=='global'||themesd[fs[i]].type=='color'){
                return {
                    themes:fs.map(a=>themesd[a]),
                    color:themesd[fs[i]].color
                };
            }
        }

        return {
            themes:fs.map(a=>themesd[a])
        }
    }
}
