// 提供重写的showOpenFilePicker方法和Onshow事件

function showOpenFilePicker() {
    return new Promise((resolve, reject) => {
      var inp = document.createElement('input');
      inp.type = 'file';
      document.body.append(inp);
      inp.style.display = 'none';
      inp.click();
      inp.onchange = () => {
        resolve(inp.files);
        inp.remove();
      }
    })
}

var onshows_fns = [];
function Onshow(f) {
  onshows_fns.push(f)
}

// 当页面模块加载完成，页面显示时调用，详见index.js
function getShowFns(){
    return onshows_fns;
}

module.exports={
    showOpenFilePicker,
    Onshow,
    getShowFns
}