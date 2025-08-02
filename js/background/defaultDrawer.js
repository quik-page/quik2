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

var tab1, setbg, tab2, tab3;
_listensetbg(function (r) {
  setbg(r);
})
_listensetbg2(function (r) {
  setbg(r);
})
_listenseti(function(i){
  util.query(getd(), '.zdy .left img').src = i;
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
            var a = document.querySelector('.bgf .full img');
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
            window.open(document.querySelector(".bgf img").src);
        }
    },
    {
        icon:util.getGoogleIcon('e8f4', { type: 'fill' }),
        title:'查看壁纸',
        click: function () {
            document.querySelector('main').style.opacity = 0;
            setTimeout(() => {
                document.querySelector('main').style.display = 'none';
            }, 300)
            document.querySelector('.bgf .cover').style.opacity = 0;
            document.addEventListener('click', eyefy)
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
      util.query(infoCardF, '.copyright').innerText = r.copyright;
      util.query(infoCardF, '.second').innerText = r.second_copyright;
      util.query(infoCardF, '.title').innerText = r.title;
      util.query(infoCardF, '.link').href = r.link;
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
  document.querySelector('main').style.display = 'block';
  setTimeout(() => {
    document.querySelector('main').style.opacity = 1;
  }, 10)
  document.querySelector('.bgf .cover').style.opacity = '';
  document.removeEventListener('click', eyefy)
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
    util.xhr('https://bing.shangzhenyang.com/api/json', r => {
      r = JSON.parse(r);
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
    }, () => {
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
    draws.color(document.querySelector('.bgf'),{
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
    bgf.innerHTML = '<div class="img-sp full"><div class="cover"></div><img src="' + (data.url || neizhiImg[data.index].img) + '"/></div>';
    bgf.querySelector('img').onload = function () {
      this.style.opacity = '1';
    }
    checkBgCoverStyle();
    ImgOrVideoSi.show();
    bgczIcon.show();
    rnMenu([2]);
  },
  video(bgf, data) {
    bgf.innerHTML = '<div class="video-sp full"><div class="cover"></div><video src="" muted loop></video></div>'
    util.query(bgf, '.video-sp video').src = data.url || neizhiImg[data.index].img;
    util.query(bgf, '.video-sp video').oncanplay = function () {
      this.play();
      this.style.opacity = '1';
    }
    checkBgCoverStyle();
    ImgOrVideoSi.show();
    bgczIcon.show();
    rnMenu([2]);
  },
  color(bgf, data) {
    bgf.innerHTML = '<div class="color-sp full"></div>'
    if (!util.query(document.head, 'style.colorSpControl')) {
      var style = document.createElement('style');
      style.className = 'colorSpControl';
      document.head.appendChild(style);
    }
    util.query(document.head, 'style.colorSpControl').innerHTML = `.color-sp{background-color:${data.light};}body.dark .color-sp{background-color:${data.dark};}`
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
    var a = initsto.get('userbg');
    if (!a) return;

    document.body.classList.add('t-dark');
    if (a.type == 'video') {
      var b = a.useidb;
      if (b) {
        initsto.get('upload', true, (blob) => {
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
        initsto.get('upload', true, (blob) => {
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
    if (!util.query(bgf, '.zdy-sp')) {
      bgf.innerHTML = '<div class="zdy-sp full"></div>'
    }
    if (!util.query(document.head, 'style.zdySpControl')) {
      var style = document.createElement('style');
      style.className = 'zdySpControl';
      document.head.appendChild(style);
    }
    util.query(document.head, 'style.zdySpControl').innerHTML = `.zdy-sp{background:${data.light};}body.dark .zdy-sp{background:${data.dark};}`
  }
}

function dol(){
  util.query(tab1, '.noBg').style.display = 'none';
    util.query(tab1, '.hasBg').style.display = 'block';
    util.query(tab1, '.zdy .editbtn').style.display = 'block';
}

setl(dol);


function selectbgitem(data) {
  util.query(tab1, '.bgitem', true).forEach(it => {
    it.classList.remove('selected');
  })
  util.query(tab2, '.bgitem', true).forEach(it => {
    it.classList.remove('selected');
  })
  if (data.type == 'default') {
    if (data.data.type == 'img') {
      try { util.query(tab1, `.neizhi .bgitem[data-id="${data.data.index}"]`).classList.add('selected'); } catch (e) { }
    } else if (data.data.type == 'userbg') {
      util.query(tab1, '.zdy .bgitem').classList.add('selected');
    } else if (data.data.type == 'api') {
      if (data.data.api == 'theme'||data.data.api=='time') {
        util.query(tab2, `.api .bgitem[data-api="${data.data.api}"]`).classList.add('selected');
      } else {
        util.query(tab1, `.api .bgitem[data-api="${data.data.api}"]`).classList.add('selected');
      }
    } else if (data.data.type == 'color') {
      util.query(tab2, '.zdy .bgitem').classList.add('selected');
    }
  }
}


function _reset() {
  document.body.classList.remove('t-dark');
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
        util.query(tab1, '.hasBg').style.display = 'none';
        util.query(tab1, '.zdy .editbtn').style.display = 'none';
      } else {
        util.query(tab1, '.noBg').style.display = 'none';
        getUserUploadUrl((url) => {
          util.query(tab1, '.zdy .left img').src = url;
        })
      }
      util.query(tab1, '.zdy .left').addEventListener('click', () => {
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
      util.query(tab1, '.zdy .editbtn').addEventListener('click', () => {
        uploadIov(true);
      });

      // 内置图片
      var u = util.query(tab1, '.neizhi .unit-content');
      var _ = this;
      neizhiImg.forEach((im, id) => {
        var bgitem = util.element('div', {
          class: "bgitem def",
          'data-id': id,
        });
        bgitem.innerHTML = '<div class="left"><img data-src="' + im.thumbnail + '" loading="lazy"/></div>'
        u.appendChild(bgitem);
        util.query(bgitem, '.left').onclick = () => {
          e.setbg({
            type: e.type,
            data: {
              type: "img",
              index: parseInt(bgitem.getAttribute('data-id'))
            }
          })
        }
      });

      var se = util.query(tab1, '.u-se');
      se.onclick = () => {
        ImgOrVideoSi.callback();
      }

      // API
      util.query(tab1, '.api.unit-item .left', true).forEach(l => {
        l.addEventListener('click', () => {
          e.setbg({
            type: e.type,
            data: {
              type: "api",
              api: l.parentElement.getAttribute('data-api')
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
      util.query(tab2, '.zdy .color-left').style.backgroundColor = c.light;
      util.query(tab2, '.zdy .color-right').style.backgroundColor = c.dark;
      util.query(tab2, '.zdy .left').onclick = () => {
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
      util.query(tab2, '.zdy .btn').onclick = () => {
        colorChange();
      }
      var cd = getNowColor();
      util.query(tab2, '.api .color-left',true)[1].style.backgroundColor = cd.light;
      util.query(tab2, '.api .color-right',true)[1].style.backgroundColor = cd.dark;
      var ce=custom.getThemeDetail().color||[];
      util.query(tab2, '.api .color-left').style.backgroundColor=ce[0]||'#fff';
      util.query(tab2, '.api .color-right').style.backgroundColor=ce[1]||'#333';
      util.query(tab2, '.api .left',true).forEach(el=>{
        el.onclick = function () {
            e.setbg({
              type: e.type,
              data: {
                type: "api",
                api: this.parentElement.getAttribute('data-api')
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
      util.query(tab3, '.gjzdytlight').value = _l_ ? _l_ : '';
      util.query(tab3, '.gjzdytdark').value = _d_ ? _d_ : '';
      util.query(tab3, '.gjzdysetbtn').onclick = () => {
        initsto.set('custombglight', util.query(tab3, '.gjzdytlight').value);
        initsto.set('custombgdark', util.query(tab3, '.gjzdytdark').value);
        e.setbg({
          type: e.type,
          data: {
            type: 'zdy',
            dark: util.query(tab3, '.gjzdytdark').value,
            light: util.query(tab3, '.gjzdytlight').value
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
      n.bgf.innerHTML = '';
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