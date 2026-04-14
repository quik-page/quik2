const getEventHandle = require("../event");
const {storage, gS} = require("../storage");
const toast = require("../toast");

storage('search', {
  sync: true,
  title: "搜索引擎",
  desc: "搜索引擎配置",
  compare(ast, k, a) {
    var o = getSearchTypeList();
    for (var k in a.typelist) {
      o[k] = a.typelist[k];
    }
    a.typelist = o;
    ast[k] = a;
  }
});

let StP=gS().search;

var keyword = "%keyword%";
var deftypelist = {
  "bing": "",
  "baidu": "",
  "so": "",
  "sogou": "",
  "google": "",
};
if (!StP.typelist) StP.typelist = deftypelist;
if (!StP.type) StP.type = "bing";
var neizhi = {
  "bing": {
    name: "必应",
    link: "https://www.bing.com/search?q="
  },
  "baidu": {
    name: "百度",
    link: "https://www.baidu.com/s?ie=utf-8&wd="
  },
  "google": {
    name: "Google",
    link: "https://www.google.com/search?q="
  },
  "so": {
    name: "360搜索",
    link: "https://www.so.com/s?q="
  },
  "sogou": {
    name: "搜狗",
    link: "https://www.sogou.com/sogou?query="
  },
  "yandex": {
    name: "Yandex",
    link: "https://yandex.com/search/?text="
  },
  "github": {
    name: "GitHub",
    link: "https://github.com/search?q="
  },
  "bilibili": {
    name: "哔哩哔哩",
    link: "https://search.bilibili.com/all?keyword="
  },

  "zhihu": {
    name: "知乎",
    link: "https://www.zhihu.com/search?type=content&q="
  },

  "weibo": {
    name: "微博",
    link: "https://s.weibo.com/weibo?q="
  },
  "taobao": {
    name: "淘宝",
    link: "https://ai.taobao.com/search/index.htm?pid=mm_31205575_2237000308_114588650482&union_lens=lensId%3APUB%401667806444%402104ee54_0bea_1845102bd01_03e9%4001&key="
  },
  "jd": {
    name: "京东",
    link: "https://search.jd.com/Search?keyword="
  },
  "xiaohongshu": {
    name: "小红书",
    link: "https://www.xiaohongshu.com/search_result/?&m_source=itab&keyword="
  },
  "kugou": {
    name: "酷狗音乐",
    link: "https://www.kugou.com/yy/html/search.html#searchType=song&searchKeyWord="
  },
  "qqm": {
    name: "QQ音乐",
    link: "https://y.qq.com/n/ryqq/search?t=song&remoteplace=txt.yqq.top&w="
  },
  "netease": {
    name: "网易云音乐",
    link: "https://music.163.com/#/search/m/?type=1&s="
  },
  "douyin": {
    name: "抖音",
    link: "https://www.douyin.com/search/%s?ug_source=lenovo_stream"
  },
  "stackoverflow": {
    name: "StackOverflow",
    link: "https://stackoverflow.com/nocaptcha?s="
  },
  "mdn": {
    name: "MDN",
    link: "https://developer.mozilla.org/zh-CN/search?q="
  },
  "douban": {
    name: "豆瓣",
    link: "https://www.douban.com/search?q="
  },
  "toutiao": {
    name: "头条搜索",
    link: "https://so.toutiao.com/search?dvpf=pc&keyword="
  },
}

var getSearchType = () => {
  if (neizhi[StP.type]) {
    return neizhi[StP.type].link + '%keyword%';
  } else {
    return StP.typelist[StP.type];
  }
}
var { on, off, doevent } = getEventHandle();
var doevents = doevent;
var setSearchList = (newList) => {
  if (Object.keys(newList).length == 0) {
    throw new Error('newList is empty');
  }
  var oldList = StP.typelist;
  StP.typelist = newList;
  doevents('typelistchange');
  var t = StP.type;
  if (oldList[t] != newList[t]) {
    doevents('nowtypechange');
  }
}
var getSearchTypeList = () => {
  return cloneObj(StP.typelist);
}
var setSearchType = (type) => {
  StP.type = type;
  checkGoogle();
  doevents('nowtypechange');
}

function checkGoogle(){
    if(StP.type!="google")return;
    if(isUd(window.isOutGoogle)){
        setTimeout(checkGoogle, 1000);
        return;
    }
    if(isOutGoogle){
        toast.show("当前网络环境对Google的访问存在限制")
    }
}

setTimeout(checkGoogle, 1000);

var getSearchTypeIndex = () => {
    // to avoid neizhi list change
    if(!StP.typelist[StP.type]){
        if(!neizhi[StP.type]){
            StP.type="bing";
        }
    }
  return StP.type;
}

var retob = {
  getSearchType,
  on,
  off,
  setSearchList,
  getSearchTypeList,
  setSearchType,
  getSearchTypeIndex,
  neizhi,
  keywordText:keyword
}
// why do such that?

module.exports = retob;