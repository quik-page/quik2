const fs = require('fs');
const path = require('path');

var reg = /_REQUIRE_\s*\(.*\)/g;
var cache = {};
var qjs = function (src, cb, rootPath) {
  if (src[0] === '.' && rootPath) {
    src = path.join(rootPath, src);
  }
  var code=fs.readFileSync(src).toString();
  ijs(code, function (code) {
    cache[src] = code;
    cb(code, src);
  }, src)

}
var ijs = function (code, cb, rootPath) {
  var bcbs = [];
  var matches = code.match(reg);
  if (matches) {
    matches.forEach(function (item, index) {
      var url = eval(item.substring(item.indexOf('(') + 1, item.lastIndexOf(')')));
      if (cache[url]) {
        code = code.replace(item, cache[url]);
      } else {
        bcbs.push(new Promise(function (r, j) {
          qjs(url, function (codes) {
            code = code.replace(item, codes);
            r();
          }, path.dirname(rootPath))
        }));

      }
    })
    if (bcbs.length == 0) {
      cb(code);
    } else {
      Promise.all(bcbs).then(function () {
        cb(code);
      })
    }
  } else {
    cb(code);
  }
}


qjs(path.join(__dirname,'index.js'), function (code) {
  fs.writeFileSync(path.join(__dirname,'index.bundle.js'),code);
});

var css=fs.readFileSync(path.join(__dirname,'index.css')).toString();
var cssmatch=css.match(/@import\s*url\(.*\)/g);

cssmatch.forEach(function(item){
  var p = item.substring(item.indexOf('(') + 1, item.lastIndexOf(')'));
  if(p.indexOf('./')==0){
    css=css.replace(item,fs.readFileSync(path.join(__dirname,p)).toString())
  }
})
fs.writeFileSync(path.join(__dirname,'index.bundle.css'),css);

