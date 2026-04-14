require("./js/qui-core.js");
const { getShowFns } = require('./js/base.js');
require('./js/requirein.js'); // 导入执行所有模块
var { waitdotheme }= require('./js/custom/index.js');
var { cateWidthShiPei } = require('./js/link/index.js');


if (localStorage.__quik_egg__) {
    // 彩蛋触发 
  delete localStorage.__quik_egg__;
  window.eggnow__ = true;
  clearTimeout(loadingtimeout);
  document.querySelector(".loading-f").style.display = 'block';
} else {
//当页面主题初始化完毕后显示页面，因为考虑到插件初始化要时间
  waitdotheme(() => {
    showmain();
  });
// 500ms超时
  setTimeout(() => {
    showmain();
  }, 500);
}

var isshowmain = false;
function showmain() {
  // 因为存在重复调用，此处控制仅能调用一次 
  if (isshowmain) return;
  clearTimeout(loadingtimeout);
  // 隐藏加载界面，显示主界面
  document.querySelector(".loading-f").classList.add('h');
  document.querySelector(".loading-f").style.display = 'none';
  document.querySelector("main").style.display = 'block';
  document.querySelector("main").style.opacity = '1';
  // onshow事件触发
  getShowFns().forEach(f => f());
  // 适配链接分组宽度，详见link
  cateWidthShiPei();
  isshowmain = true;

  // 动画设置
  setTimeout(() => {
    document.querySelector("main").classList.add('sicon');
  }, 360)
}



var f = `@font-face {
    font-family: 'Material Symbols Outlined';
    font-style: normal;
    font-weight: 100 700;
    src: url($0) format('woff2');
  }`
// requirein内模块util会检测浏览器扩展环境，若有则使用扩展内的资源以提升加载速度
if (window.isExt) {
  util.addStyle(f.replace('$0', 'chrome-extension://' + window.extid + '/assets/google-icon.woff2'))
} else {
  util.addStyle(f.replace('$0', 'https://fonts.gstatic.com/s/materialsymbolsoutlined/v213/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2'))
}