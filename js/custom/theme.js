const { alert } = require("../dialog/dialog_utils");
const { SettingItem, tyGroup } = require("../setting/index");
const { stp,doevent } = require("./core");
const addon =require('../addon');
const dialog = require("../dialog");
const util = require("../util");
const bd=document.body;
if (!stp.themea) {
    stp.themea = 'def';
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
std.$('.closeBtn').onclick=function(){
    selectthemeDia.close();
}

tyGroup.addNewItem(si);
let nowtheme='def';

function doTheme(f,justadd) {
    if(justadd){
        bd.addClass(f);      
        doevent('dotheme', []);
        return;
    }
    if(!f){
        f='def';
    }
    nowtheme=f;
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
    bd.className.split(' ').forEach((a) => {
        if(!a.trim())return;
        if (!ys.includes(a)) {
            bd.removeClass(a);
        }
    })
    console.log(fs);
    fs.forEach((a) => {
        bd.addClass(a);        
    })
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
    let glsit=stp.themea.split('|');
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
    if (stp.themea == f) {
        stp.themea = 'def';
        si.reGet();
    }
    si.reInit();
}

function setTheme(f) {
    if (!themes[f]) {
        return;
    }
    stp.themea = f;
    doTheme(f);
    si.reGet();
}

var wait = doTheme(stp.themea);
wait=typeof wait=='number'?wait:0;
var isinitselect=false;

function gtitm(nm){
    let type=themesd[nm].type||'global';
    let nf=el('.theme-item',{
        'data-id':nm
    })
    nf.text(themesd[nm].name);
    if(type=='global'){
        std.$('.ztselects.ty').append(nf);
    }else if(type=='color'){
        std.$('.ztselects.co').append(nf);
    }else if(type=='structure'){
        std.$('.ztselects.st').append(nf);
    }

    nf.onclick=function(){
        let type=this.parentNode.classList[1];
        if(type=='ty'){
            std.$$('.ztselects .active').removeClass('active');
            this.addClass('active');
        }else if(type=='co'){
            std.$$('.ztselects.ty .active').removeClass('active');
            std.$$('.ztselects.co .active').removeClass('active');
            this.addClass('active');
        }else if(type=='st'){
            std.$$('.ztselects.ty .active').removeClass('active');
            if(this.hasClass('active')){
                this.removeClass('active');
            }else{
                this.addClass('active');
            }
        }

        let f=std.$$('.theme-item.active');
        f=toRealArray(f);
        f=f.map(a=>a.attr('data-id')).join('|');
        stp.themea=f;
        console.log(f);
        doTheme(f);

    }
}
addon.on('allrun', () => {
    if (wait!=0) {
        stp.themea='def';
        doTheme('def');
        alert('您的主题由于插件缺失无法显示，已为您切换为默认。');
    }

    for(var nm in themes){
        gtitm(nm);
    }

    let acs=stp.themea.split('|');
    for(ac of acs){
        std.$('[data-id="'+ac+'"]').addClass('active');
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
        console.log(fs);
        for(let i=0;i<fs.length;i++){
            if(!themesd[fs[i]])continue;
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
