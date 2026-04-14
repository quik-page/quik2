const {gS} = require("../../storage");
const util = require("../../util");
const { refsay, openSayDetailsDialog,getNowSay } = require("../core");

var stp = gS('jrsc');
var jinrishici = {}, tokenStorageKey = "jinrishici-token";
function request(callback, url) {
  get(url).then(res=>{
    if ("success" === res.status) {
        callback(res)
    } else {
        console.error("今日诗词API加载失败，错误原因：" + res.errMessage)
    }
  }).catch(err=>{
    console.error("今日诗词API加载失败，错误原因：",err);
  })
}
jinrishici.load = (callback) => {
  var key = stp[tokenStorageKey];
  if (key) {
    return request(callback, "https://v2.jinrishici.com/one.json?client=browser-sdk/1.2&X-User-Token=" + encodeURIComponent(key))
  } else {
    return request((res) => {
      stp[tokenStorageKey]=res.token;
      callback(res);
    }, "https://v2.jinrishici.com/one.json?client=browser-sdk/1.2")
  }
}
module.exports={
  key: "jinrishici",
  name: "今日诗词",
  callback() {
    return new Promise((resolve, reject) => {
      jinrishici.load((res) => {
        resolve({
          say: res.data.content,
          author: '(' + res.data.origin.dynasty + ')' + res.data.origin.author,
          p_title: '《' + res.data.origin.title + '》',
          tags: res.data.matchTags.join(' '),
          content: '<br>' + res.data.origin.content.join('<br>'),
          title: "摘自" + res.data.origin.dynasty + "·" + res.data.origin.author + "的《" + res.data.origin.title + '》',
        })
      })
    })
  },
  click() {
    refsay('jinrishici');
  },
  menu: [{
    icon: util.getGoogleIcon('e5d5'),
    title: '刷新',
    click() {
      refsay('jinrishici');
    }
  }, {
    icon: util.getGoogleIcon('e14d'),
    title: '复制',
    click() {
      var value = getNowSay().say;
      util.copyText(value);
    }
  }, {
    icon: util.getGoogleIcon('e88e'),
    title: '诗词详情',
    click() {
      var nowSay=getNowSay();
      openSayDetailsDialog({
        'API': "今日诗词（jinrishici.com）",
        '内容': nowSay.say,
        '作者': nowSay.author,
        '标题': nowSay.p_title,
        '全部内容': nowSay.content
      })
    }
  }]
}