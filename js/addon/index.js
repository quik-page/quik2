const { icon } = require("../iconc");
var core = require('./_core.js');
const { alert } = require("../dialog/dialog_utils");
const {storage}=require('../storage');
const util = require("../util");
var coreup=require('./core_up.js');
const {SettingItem,SettingGroup,mainSetting,settingSto}=require('../setting/');
const toast = require("../toast");
const notice=require('../notice/')

var addon_dialog;
var addon_icon = new icon({
  offset: "tr",
  content: util.getGoogleIcon("e87b", { type: "fill" })
});
addon_icon.getIcon().onclick = () => {
  if (!storage.checkIDB()) {
    alert('浏览器版本过低，无法使用插件功能！')
    return;
  }
  if (!addon_dialog) {
    drawAll();
    setTimeout(() => {
      addon_dialog.open();
    }, 10)
  } else {
    addon_dialog.open();
  }
}
if (!storage.checkIDB()) return;

function drawAll() {
  require('./xrmenu.js');
  require('./xrlist.js');
  require('./xrmarket.js');
  addon_dialog=require('./xrcore').addon_dialog;
}

if (window.addon_) {
  alert('已在安全模式下运行，插件功能已关闭！')
}

core=coreup(core);

let addonSg=new SettingGroup({
    title:'插件',
    index:1
})

mainSetting.addNewGroup(addonSg);

if(typeof settingSto.get('addon_autoup')=='undefined'){
    settingSto.set('addon_autoup',true);
}

// 自动更新
let autoSi=new SettingItem({
    title:'自动检测插件更新',
    type:'boolean',
    index:0,
    get:function(){
        return settingSto.get('addon_autoup');
    },
    callback:function(v){
        settingSto.set('addon_autoup',v);
        ckautoSi();
    }
})

let autoUpSi=new SettingItem({
    title:'自动安装插件更新',
    type:'boolean',
    index:1,
    get:function(){
        return settingSto.get('addon_autoup_install');
    },
    callback:function(v){
        settingSto.set('addon_autoup_install',v);
        ckautoSi();
    }
})

let silentUpSi=new SettingItem({
    title:'静默安装插件更新',
    type:'boolean',
    index:2,
    get:function(){
        return settingSto.get('addon_autoup_silent');
    },
    callback:function(v){
        settingSto.set('addon_autoup_silent',v);
    }
})

function ckautoSi(){
    let autoUp=settingSto.get('addon_autoup');
    let autoUpInstall=settingSto.get('addon_autoup_install');
    if(!autoUp){
        autoUpSi.hide();
        silentUpSi.hide();
    }else{
        autoUpSi.show();
        if(!autoUpInstall){
            silentUpSi.hide();
        }else{
            silentUpSi.show();
        }
    }
}

function doautoup(){
    let autoUp=settingSto.get('addon_autoup');
    let autoUpInstall=settingSto.get('addon_autoup_install');
    let silent=settingSto.get('addon_autoup_silent');
    let ignores=settingSto.get('addon_autoup_ignore')||[];
    if(autoUp){
        core.getAddonList().forEach(addonId=>{
            console.log(addonId);
            if(ignores.includes(addonId))return;
            core.checkUpdate(addonId).then(hasUpdate=>{
                console.log(addonId,hasUpdate);
                if(hasUpdate){
                    let addon_desc=core.getAddonById(addonId)
                    if(autoUpInstall){
                        if(!silent){
                            toast.show('检测到“'+addon_desc.name+'”插件更新，正在安装...');
                        }
                        core.update(addonId).then(function(){
                            if(!silent){
                                toast.show('“'+addon_desc.name+'”插件更新成功！');
                            }
                        }).catch(e=>{
                            if(!silent){
                                toast.show('“'+addon_desc.name+'”插件更新失败！');
                            }
                        })
                    }else{
                        let n=new notice({
                            title:'插件更新',
                            content:'检测到“'+addon_desc.name+'”插件更新，是否立即更新？',
                            useprogress:true,
                            btns:[{
                                text:"更新",
                                style:"ok", 
                                click:function(){
                                    n.setBtn([]);
                                    n.setProgress(0.3);
                                    n.setContent('正在更新“'+addon_desc.name+'”插件...')
                                    core.update(addonId).then(function(){
                                        n.setProgress(1);
                                        n.setContent('“'+addon_desc.name+'”插件更新成功！');
                                    }).catch(e=>{
                                        n.setProgress(0);
                                        n.setContent('“'+addon_desc.name+'”插件更新失败！');
                                        console.log(e);
                                    })
                                }
                            },{
                                text:"不提醒此插件",
                                click:function(){
                                    ignores.push(addonId);
                                    settingSto.set('addon_autoup_ignore',ignores);
                                    n.hide();
                                }
                            },]
                        })
                        n.show();
                    }
                }
            })
        })
        if(!autoUpInstall){
            silentUpSi.hide();
        }
    }else{
        autoUpSi.hide();
        silentUpSi.hide();
    }
}

doautoup();

addonSg.addNewItem(silentUpSi);
addonSg.addNewItem(autoUpSi);
addonSg.addNewItem(autoSi);

module.exports= core;
