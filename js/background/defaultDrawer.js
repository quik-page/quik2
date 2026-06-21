var acgbg = require('../api/acgbg.js');
var fjbg = require('../api/fenjibg.js');
const card = require('../card/index.js');
const { icon } = require('../iconc/index.js');
const util = require('../util');
const { initsto, getd } = require('./core.js');
var { ImgOrVideoSi, checkBgCoverStyle } = require('./_defaultDrawer/ivbgse.js');
var {
  getVideoCaptrue,
  getUserUploadUrl,
  hasUploadedImg,
  uploadIov,
  _listensetbg,
  _listenseti,
  setl
} = require('./_defaultDrawer/userupload.js');

var { colorChange, _listensetbg2,init } = require('./_defaultDrawer/zdycolor.js');
const custom = require('../custom/index.js');
const contextMenu = require('../menu/index.js');
const toast = require('../toast.js');
const { dbTool } = require('../storage.js');

var tab1, setbg, tab2, tab3;
_listensetbg(function (r,i) {
    setbg(r);
})

let menuedubg;
let ubgMenu=new contextMenu({
    list:[{
        icon:util.getGoogleIcon('e92e'),
        title:'删除',
        click:function(){
            let ul=initsto.get("userbgs");
            let index=menuedubg.index();
            if(ul[index].checked&&ul.filter(e=>e.checked).length==1){
                toast.show("必须保留一个用于显示");
            }else{
                ul.splice(index,1);
                menuedubg.remove();
                initsto.set("userbgs",ul);
                toast.show("删除成功")
                let l=initsto.get("bg");
                if(l.type=="default"&&l.data.type=="userbg"){
                    setbg(l); // refresh
                }
            }
        }
    }]
})
function gubg(r,i){
    let ubg=el(".ubg",{},'<img>');
    tab1.$(".ubgs").append(ubg);
    getUserUploadUrl(url=>{
        console.log(url);
      ubg.$("img").src=url;
    },r)
    if(r.checked){
        ubg.addClass("active");
    }
    ubg.onclick = function () {
        let ul=initsto.get("userbgs");
        let index=ubg.index();
        if(ul[index].checked){
            if(ul.filter(e=>e.checked).length==1){
                toast.show("必须保留一个用于显示");
                return;
            }else{
                ul[index].checked=false;
                this.removeClass("active");
                initsto.set("userbgs",ul);
            }
        }else{
            ul[index].checked=true;
            this.addClass("active");
            initsto.set("userbgs",ul);
        }
        let l=initsto.get("bg");
        if(l.type=="default"&&l.data.type=="userbg"){
            setbg(l); // refresh
        }
    }
    ubg.oncontextmenu = function (e) {
        e.preventDefault();
        e.stopPropagation();
        menuedubg = this;
        ubgMenu.show();
        ubgMenu.setOffset({
            top:e.pageY,
            left:e.pageX
        })
    }
}
_listensetbg2(function (r,i) {
    setbg(r)
})
_listenseti(function(r,i){
//   util.query(getd(), '.zdy .left img').src = i;
    gubg(r,i);
    tab1.$(".ubgs").css("width",190*(i+1)+20+"px");
    let l=initsto.get("bg");
    if(l.type=="default"&&l.data.type=="userbg"){
        setbg(l); // refresh
    }
})


var neizhiImg;
if (window.isExt) {
  neizhiImg = require('./_defaultDrawer/neizhi_ext.json')
  for (var i = 0; i < neizhiImg.length; i++) {
    for (var k in neizhiImg[i]) {
      neizhiImg[i][k] = 'chrome-extension://' + window.extid + '/assets/' + neizhiImg[i][k]
    }
  }
} else {
  neizhiImg = require('./_defaultDrawer/neizhi.json');
}

let bgczMenuLists=[
    {
        icon:util.getGoogleIcon('e86a'),
        title:'刷新',
        click: function () {
            var a = $('.bgf .full img');
            if (a) {
                a.style.opacity = '0';
            }
            var _ = this;
            setTimeout(() => {
                refreshFn.call(_);
            }, 300)
        }
    },
    {
        icon:util.getGoogleIcon('f090'),
        title:'下载',
        click: function () {
            window.open($(".bgf img").src);
        }
    },
    {
        icon:util.getGoogleIcon('e8f4', { type: 'fill' }),
        title:'查看壁纸',
        click: function () {
            $('main').style.opacity = 0;
            setTimeout(() => {
                $('main').hide();
            }, 300)
            $('.bgf .cover').style.opacity = 0;
            document.on('click', eyefy)
        }
    }
];
let bgczMenu=new contextMenu({
    list: [],
    offset:{
        right:5,
        bottom:50
    }
})

let bgczIcon=new icon({
    content: util.getGoogleIcon('e5d4'),
    offset: "br",
    important: true
});
bgczIcon.getIcon().onclick = function (e) {
    e.stopPropagation();
    bgczMenu.show();
}

var infoIcon = new icon({
  content: util.getGoogleIcon('e88e'),
  offset: "br",
  important: true
});
var infoCard = new card({
  content: `<div class="copyright">...</div>
      <div class="second">...</div>
      <div class="title">...</div>
      <a class="link" target="_blank" href="https://www.bing.com/">去Bing搜索</a>`,
  offset: {
    right: 5,
    bottom: 50
  },
  class: "bing_info"
});
infoIcon.getIcon().onclick = () => {
  if (infoCard.isShow) {
    infoCard.hide(400);
  } else {
    infoCard.show(400);
    getBingWallPaperInfo(function (r) {
      var infoCardF = infoCard.getCardDom();
      infoCardF.$('.copyright').text(r.copyright);
      infoCardF.$('.second').text(r.second_copyright);
      infoCardF.$('.title').text(r.title);
      infoCardF.$('.link').href = r.link;
    })
  }

}
infoIcon.getIcon().title = '显示壁纸详情';

let inclick=false;
function eyefy() {
    if(!inclick){
        inclick=true;
        return;
    }
  $('main').show();
  setTimeout(() => {
    $('main').style.opacity = 1;
  }, 10)
  $('.bgf .cover').style.opacity = '';
  document.off('click', eyefy)
  inclick=false;
}

function rnMenu(t){
    let n=[];
    for(let i=0;i<t.length;i++){
        n.push(bgczMenuLists[t[i]]);
    }
    console.log(n);
    bgczMenu.setList(n);
}


//时间的颜色API
function getNowColor() {
  var date = new Date();
  return {
    light: `rgb(${256 - date.getHours()},${256 - date.getMinutes()},${256 - date.getSeconds()})`,
    dark: `rgb(${date.getHours()},${date.getMinutes()},${date.getSeconds()})`
  }

}

var infocache;
function getBingWallPaperInfo(fn) {
  if (infocache) {
    fn(infocache);
  } else {
    get('https://bing.shangzhenyang.com/api/json').then(r => {
      var a = r.images[0];
      var b = a.copyright.split('(');
      b[1] = '(' + b[1];
      infocache = {
        copyright: b[0],
        second_copyright: b[1],
        link: a.copyrightlink,
        title: a.title
      };
      fn(infocache)
    }).catch(() => {
      fn({
        copyright: "加载失败",
        second_copyright: "(© Bing)",
        link: "https://www.bing.com/",
        title: "点击前往必应"
      })
    })
  }
}


// dot-timeb
// @note 这里需要一个定时器用于api背景 时间的颜色
var timeb = null;

let themedo=false;

function docthem(){
    console.log(custom.getThemeDetail());
    let g=custom.getThemeDetail().color||[]
    console.log(g);
    draws.color($('.bgf'),{
        light:g[0]||'#fff',
        dark:g[1]||'#333'
    })
}

custom.on('dotheme',function(){
    if(themedo)
    docthem();
})


var draws = {
  img(bgf, data) {
    if((!data.url)&&typeof data.index=='undefined')return;
    bgf.html('<div class="img-sp full"><div class="cover"></div><img src="' + (data.url || neizhiImg[data.index].img) + '"/></div>');
    bgf.querySelector('img').onload = function () {
      this.style.opacity = '1';
    }
    checkBgCoverStyle();
    ImgOrVideoSi.show();
    bgczIcon.show();
    rnMenu([2]);
  },
  video(bgf, data) {
    if((!data.url)&&typeof data.index=='undefined')return;
    bgf.html('<div class="video-sp full"><div class="cover"></div><video src="" muted loop></video></div>')
    bgf.$('.video-sp video').src = data.url || neizhiImg[data.index].img;
    bgf.$('.video-sp video').oncanplay = function () {
      this.play();
      this.style.opacity = '1';
    }
    checkBgCoverStyle();
    ImgOrVideoSi.show();
    bgczIcon.show();
    rnMenu([2]);
  },
  color(bgf, data) {
    bgf.html('<div class="color-sp full"></div>')
    if (!document.head.$('style.colorSpControl')) {
      var style = el('style.colorSpControl');
      document.head.appendChild(style);
    }
    document.head.$('style.colorSpControl').html(`.color-sp{background-color:${data.light};}body.dark .color-sp{background-color:${data.dark};}`);
  },
  api: function api(bgf, data) {
    function showAcgOrFj(a) {
        bgczIcon.show();
        rnMenu([0,2]);
      a.getImg((d) => {
        draws.img(bgf, {
          url: d.url
        });
        if (d.candownload) {
            rnMenu([0,1,2]);
        }else{
            rnMenu([0,2]);
        }
      })
      refreshFn = () => {
        a.getImg((d) => {
          draws.img(bgf, {
            url: d.url
          });
          if (d.candownload) {
            rnMenu([0,1,2]);
          }else{
            rnMenu([0,2]);
          }
        })
      }
    }
    switch (data.api) {
      case 'acg':
        showAcgOrFj(acgbg);
        break;
      case 'fj':
        showAcgOrFj(fjbg);
        break;
      case 'bing':
        bgczIcon.show();
        infoIcon.show();
        draws.img(bgf, {
          url: "https://bing.shangzhenyang.com/api/1080p"
        });
        rnMenu([1,2])
        break;
      case 'time':
        // at ../defaultDrawer.js dot-timeb
        timeb = setInterval(() => {
          draws.color(bgf, getNowColor());
        }, 200)
        break;
      case 'theme':
        themedo=true;
        docthem();
        break;
    }
  },
  userbg(bgf, data) {
    // 图片或视频
    var a = initsto.get('userbgs').filter(e=>e.checked);
    if (!a||a.length==0) return;
    a=a[Math.floor(Math.random()*a.length)];

    document.body.addClass('t-dark');
    if (a.type == 'video') {
      var b = a.useidb;
      if (b) {
        dbTool.get(a.src,(blob)=>{
            draws.video(bgf, {
                url: URL.createObjectURL(blob)
            })
        })
      } else {
        draws.video(bgf, {
          url: a.url
        })
      }
    } else if (a.type == 'image') {
      var b = a.useidb;
      if (b) {
        dbTool.get(a.src,(blob)=>{
            draws.img(bgf, {
                url: URL.createObjectURL(blob)
            })
        })
      } else {
        draws.img(bgf, {
          url: a.url
        })
      }
    }
  },
  zdy(bgf, data) {
    if (!bgf.$('.zdy-sp')) {
      bgf.html('<div class="zdy-sp full"></div>');
    }
    if (!document.head.$('style.zdySpControl')) {
      var style = el('style.zdySpControl');
      document.head.appendChild(style);
    }
    document.head.$('style.zdySpControl').html(`.zdy-sp{background:${data.light};}body.dark .zdy-sp{background:${data.dark};}`);
  }
}

function dol(){
  tab1.$('.noBg').hide()
    tab1.$('.hasBg').show()
    tab1.$('.zdy .editbtn').show()
}

setl(dol);


function selectbgitem(data) {
  tab1.$$('.bgitem').forEach(it => {
    it.removeClass('selected');
  })
  tab2.$$('.bgitem').forEach(it => {
    it.removeClass('selected');
  })
  if (data.type == 'default') {
    if (data.data.type == 'img') {
      try { tab1.$(`.neizhi .bgitem[data-id="${data.data.index}"]`).addClass('selected'); } catch (e) { }
    } else if (data.data.type == 'userbg') {
      tab1.$('.zdy .bgitem').addClass('selected');
    } else if (data.data.type == 'api') {
      if (data.data.api == 'theme'||data.data.api=='time') {
        tab2.$(`.api .bgitem[data-api="${data.data.api}"]`).addClass('selected');
      } else {
        tab1.$(`.api .bgitem[data-api="${data.data.api}"]`).addClass('selected');
      }
    } else if (data.data.type == 'color') {
      tab2.$('.zdy .bgitem').addClass('selected');
    }
  }
}


function _reset() {
  document.body.removeClass('t-dark');
  refreshFn = () => { }
  clearInterval(timeb);
  ImgOrVideoSi.hide();
  infoIcon.hide();
  themedo=false;
  infoCard.hide();
  bgczIcon.hide();
}

module.exports = {
  drawer: {
    type: "default",
    init(e) {
      setbg = e.setbg;
      // pushTab 图片/视频
      tab1 = e.pushBgTab({
        tab: "图片/视频",
        content: require('./htmls/imgvideobgtab.html')
      });

      if (!hasUploadedImg()) {
        tab1.$('.hasBg').hide()
        tab1.$('.zdy .editbtn').hide()
      } else {
        tab1.$('.noBg').hide()
        getUserUploadUrl((url) => {
          tab1.$('.zdy .left img').src = url;
        })
      }

      let ubgl=initsto.get("userbgs");
      ubgl.forEach((item,i)=>{
        gubg(item,i);
      })
      tab1.$(".ubgs").css("width",190*ubgl.length+20+"px");

      tab1.$('.zdy .left').on('click', () => {
        if (hasUploadedImg()) {
          e.setbg({
            type: e.type,
            data: {
              type: "userbg"
            }
          })
        } else {
          uploadIov();
        }
      })
      tab1.$('.zdy .editbtn').on('click', () => {
        uploadIov(true);
      });

      // 内置图片
      var u = tab1.$('.neizhi .unit-content');
      var _ = this;
      neizhiImg.forEach((im, id) => {
        var bgitem = util.element('div', {
          class: "bgitem def",
          'data-id': id,
        });
        bgitem.html('<div class="left"><img data-src="' + im.thumbnail + '" loading="lazy"/></div>');
        u.appendChild(bgitem);
        bgitem.$('.left').onclick = () => {
          e.setbg({
            type: e.type,
            data: {
              type: "img",
              index: parseInt(bgitem.attr('data-id'))
            }
          })
        }
      });

      var se = tab1.$('.u-se');
      se.onclick = () => {
        ImgOrVideoSi.callback();
      }

      // API
      tab1.$$('.api.unit-item .left').forEach(l => {
        l.on('click', () => {
          e.setbg({
            type: e.type,
            data: {
              type: "api",
              api: l.parent().attr('data-api')
            }
          })
        });
      });


      // pushTab 纯色
      tab2 = e.pushBgTab({
        tab: "纯色",
        content: require('./htmls/colorbgtab.html')
      });
      init(tab2);
      var c = initsto.get('usercolor');
      tab2.$('.zdy .color-left').style.backgroundColor = c.light;
      tab2.$('.zdy .color-right').style.backgroundColor = c.dark;
      tab2.$('.zdy .left').onclick = () => {
        var c = initsto.get('usercolor');
        e.setbg({
          type: e.type,
          data: {
            type: "color",
            light: c.light,
            dark: c.dark
          }
        })
      }
      tab2.$('.zdy .btn').onclick = () => {
        colorChange();
      }
      var cd = getNowColor();
      tab2.$$('.api .color-left')[1].style.backgroundColor = cd.light;
      tab2.$$('.api .color-right')[1].style.backgroundColor = cd.dark;
      var ce=custom.getThemeDetail().color||[];
      tab2.$('.api .color-left').style.backgroundColor=ce[0]||'#fff';
      tab2.$('.api .color-right').style.backgroundColor=ce[1]||'#333';
      tab2.$$('.api .left').forEach(El=>{
        El.onclick = function () {
            e.setbg({
              type: e.type,
              data: {
                type: "api",
                api: this.parent().attr('data-api')
              }
            })
        }
      });

      // pushTab 自定义
      tab3 = e.pushBgTab({
        tab: "自定义",
        content: require('./htmls/custombgtab.html')
      });
      var _l_ = initsto.get('custombglight');
      var _d_ = initsto.get('custombgdark');
      tab3.$('.gjzdytlight').value = _l_ ? _l_ : '';
      tab3.$('.gjzdytdark').value = _d_ ? _d_ : '';
      tab3.$('.gjzdysetbtn').onclick = () => {
        initsto.set('custombglight', tab3.$('.gjzdytlight').value);
        initsto.set('custombgdark', tab3.$('.gjzdytdark').value);
        e.setbg({
          type: e.type,
          data: {
            type: 'zdy',
            dark: tab3.$('.gjzdytdark').value,
            light: tab3.$('.gjzdytlight').value
          }
        })
        quik.toast.show('设置成功')
      }
      setTimeout(() => {
        selectbgitem(quik.background.getbg());
        quik.background.on('change', selectbgitem)
      });
    },
    cancel(n) {
      n.bgf.html('');
      _reset();
    },
    draw(n) {
      var bgf = n.bgf;
      var data = n.data;
      _reset();
      draws[data.type](bgf, data);
    }
  }, draws
}