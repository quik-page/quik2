// 数据相关设置和页面高级操作

let {gS,storage}=require('./storage');
let {SettingGroup,SettingItem, mainSetting}=require('./setting/index');
const { cateWidthShiPei } = require('./link/index');
const util = require('./util');
const { icon } = require('./iconc');
const notice=require('./notice');
const { alert, confirm, prompt } = require('./dialog/dialog_utils');

var stp = gS('safe');
window.ign=false; //是否忽略接下来的hashchange
window.on('hashchange', ()=>{
    if(window.ign){
        window.ign=false;
        return;
    }
    window.location.reload(); // 不忽略则刷新
});
window.on('visibilitychange', () => {// 用于降低页面CPU占用
    if (document.visibilityState == 'hidden') {
        document.body.hide();
    } else {
        document.body.show();
        cateWidthShiPei();
    }
})
function hashcl() {
    // 处理hash，hash往往决定页面的模式
    var hash = location.hash.slice(1), cjhash;
    if (hash.indexOf(';') != -1) { // 因为浏览器扩展会将插件id以 id;hash 的形式传入
        cjhash = hash.split(';')[0];
        hash = hash.split(';')[1];
    }
    if (hash == 'safe') {//安全模式
        window.ign=true; // 忽略接下来的hash变化
        location.hash = '#' + (cjhash ? cjhash + ';' : ''); // 设置hash为空，再次刷新即可退出安全模式
        window.addon_ = true; // 此处阻止插件活动
        alert('已阻止所有插件运行，请修改设置或删除插件');
    }
}
hashcl();

var gaoji = new SettingGroup({
    title: "高级",
    index: 5
})

var xnse = new SettingItem({
    title: "性能模式",
    message: "强制关闭所有滤镜和动画效果",
    index: 1,
    type: "boolean",
    get() {
        return !!stp.xnse
    },
    callback(n) {
        stp.xnse = n;
        doxnse(n);// -> 239
    }
});
gaoji.addNewItem(xnse);

var clse = new SettingItem({
    title: "清除数据",
    message: "清除QUIK起始页的所有数据",
    index: 2,
    type: "null",
    callback() {
        confirm('确定要清除所有数据吗？', r => {
            if (r) {
                function c() {
                    prompt('请在下方输入“clearAll”，并再次确定是否要清除所有数据，此操作无法恢复。', t => {
                        if (t == 'clearAll') {
                            var k = storage('oobe')
                            var s = k.getAll(); 
                            // 保留oobe数据，这样清除后就不会再次显示欢迎界面
                            localStorage.quik2 = JSON.stringify({
                                oobe: s
                            })
                            localforage.clear().then(() => {
                                location.reload();
                            });
                        } else {
                            t && c(); // t为空则退出，t不为空则认为输错，则重开再输一遍
                        }
                    })
                }
                c();
            }
        });
    }
});
gaoji.addNewItem(clse);

var clse2 = new SettingItem({
    title: "还原设置",
    message: "还原QUIK起始页的默认设置",
    index: 2,
    type: "null",
    callback() {
        confirm('确定要还原设置为默认吗？', r => {
            if (r) {
                let a=JSON.parse(localStorage.quik2);
                a.setting={};
                a.hello={};
                delete a.link.draglink;
                delete a.link.enabledCate;
                delete a.link.lastingCate;
                delete a.link.linkpailie;
                delete a.link.linksize;
                delete a.link.linkstyle;
                localStorage.quik2 = JSON.stringify(a);
                alert('已还原默认设置，刷新页面后生效。', function () {
                    window.location.reload();
                })
            }
        });
    }
});
gaoji.addNewItem(clse2);

var stol = new SettingItem({
    title: "清除指定数据",
    message: "请在开发者指导下应急用",
    index: 2,
    type: "null",
    callback() {
        alert('该设置请在开发者指导下使用！', ()=> {
            prompt('如要清除整个库，输入1，如要清除具体键值，输入2，列出库列表输入3，列出键列表输入4', t => {
                var a=JSON.parse(localStorage.quik2);
                if (t=='1') {
                    prompt('输入要清除的库', k => {
                        if(k){
                            a[k]={};
                            localStorage.quik2 = JSON.stringify(a);
                            alert('已清除'+k+'库！', function () {
                                window.location.reload();
                            })
                        }
                    })
                }else if(t=='2'){
                    prompt('输入要清除的库', k => {
                        if(k){
                           prompt('输入要清除的键值', v => {
                               if(v){
                                    try{
                                        delete a[k][v];
                                    }catch(e){
                                        alert('该键值不存在！');
                                    }
                                    localStorage.quik2 = JSON.stringify(a);
                                    alert('已清除'+k+'库的'+v+'键值！', function () {
                                        window.location.reload();
                                    })
                               }
                           }) 
                        }
                    })
                }else if(t=='3'){
                    alert(Object.keys(a).join('\n'));
                }else if(t=='4'){
                    prompt('输入要列出库的键值', k => {
                        if(k){
                            if(a[k]){
                                alert(Object.keys(a[k]).join('\n'));
                            }else{
                                alert('该库不存在！');
                            }
                        }
                    })
                }
            })
        });
    }
});
gaoji.addNewItem(stol);


var cjup = new SettingItem({
    title: "强制更新",
    message: "强行从远程获取最新版本并更新",
    index: 2,
    type: "null",
    callback() {
        confirm('确定要强制更新吗？', r => {
            if (r) {
                if (window.swReg) {
                    updateBySW(window.swReg); //存在serviceWoker则通知更新
                } else {
                    // 不存在则刷新即可
                    alert('更新完成', () => {
                        location.reload();
                    })
                }
            }
        });
    }
});

var _i=0;
function updateBySW(registration){
    // quik.42web.io若在iframe中更新则无法通过cookie校验
    if (window.isInframe && location.href.indexOf('://quik.42web.io/') != -1) {
        alert('因安全原因，扩展程序无法进行强制更新，请在网页端更新', function () {
            window.open('https://quik.42web.io/?forceUpdate=1');
        });
    }else if(location.href.indexOf('://quik.42web.io/') != -1&&_i==0){
        _i++;// 多次调用确保通过cookie校验
        var ifr = util.element('iframe', {
          src: './version',
          style: "opacity:0"
        });
        document.body.appendChild(ifr);
        var i = 0;
        ifr.onload = function () {
          i++;
          if (i >= 2) {
            updateBySW(registration) // 多次调用确保通过cookie校验
          }
        }
        setTimeout(() => {
          updateBySW(registration) // 多次调用确保通过cookie校验
        }, 4000)
        new notice({
            title: "更新提示",
            content: "已向后台发送更新请求，请耐心等待。",
        }).show();
      } else {
        // 通知serviceWorker更新
        registration.active.postMessage('update');
        new notice({
            title: "更新提示",
            content: "已向后台发送更新请求，请耐心等待。",
        }).show();
    }
}
gaoji.addNewItem(cjup);

mainSetting.addNewGroup(gaoji);

// 处理无动效
function doxnse(n) {
    if (n) {
        var s = el('style');
        s.id = 'xnse';
        // 就是全none
        s.innerHTML = '*{filter:none!important;backdrop-filter:none!important;animation:none!important;transition:none!important;}';
        document.head.append(s);
    } else {
        try{
        $('#xnse').remove();
        }catch(e){}
    }
}

doxnse(!!stp.xnse);


// 网络检测 
window.on('offline', ckline)
window.on('online', ckline)

var offlineIcon = new icon({
    content: util.getGoogleIcon('f239'),
    offset: "br",
    important: true
})
offlineIcon.getIcon().style.color = 'red';

var offlineNotice = new notice({
    title: "断网提醒",
    content: "您的网络已断开，请尽快重连！"
})

function ckline() {
    if (!window.navigator.onLine) {
        offlineNotice.show()
        offlineNotice.focus();
        offlineIcon.show();
    } else {
        offlineNotice.hide();
        offlineIcon.hide();
    }
}

ckline();