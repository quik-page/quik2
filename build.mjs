import fs from 'fs';
import path from 'path';
import {minify} from 'minify';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var reg = /_REQUIRE_\s*\(.*?\)/g;
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
      var url=eval(item.substring(item.indexOf('(')+1,item.lastIndexOf(')')));
      if(cache[url]){
        if(url.lastIndexOf('.js')==url.length-3){
          code=code.replace(item,cache[url]);
        }else{
          code=code.replace(item,zhuanyi(cache[url]));
        }
      }else{
        bcbs.push(new Promise(function(r,j){
          qjs(url,function(codes){
            if(url.lastIndexOf('.js')==url.length-3){
              code=code.replace(item,codes);
            }else{
              code=code.replace(item,zhuanyi(codes));
            }
            r();
          },path.dirname(rootPath))
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

function zhuanyi(code){
  return "\""+code.replaceAll('"','\\"').replaceAll('\r\n','\\n').replaceAll('\n','\\n').replaceAll("\t","\\t")+"\"";
}


qjs(path.join(__dirname,'index.js'), function (code) {
  fs.writeFileSync(path.join(__dirname,'index.bundle.js'),code);
  console.log('js');
  minify(path.join(__dirname,'index.bundle.js'),{
    js:{
      "mangle": true,
      "mangleClassNames": true,
      "removeUnusedVariables": true,
      "removeConsole": false,
      "removeUselessSpread": true
    }
  }).then(function(res){
    fs.writeFileSync(path.join(__dirname,'index.bundle.js'),res);
    console.log('js-done');
  })

});

var css=fs.readFileSync(path.join(__dirname,'index.css')).toString();
var cssmatch=css.match(/@import\s*url\(.*\);/g);

cssmatch.forEach(function(item){
  var p = item.substring(item.indexOf('(') + 1, item.lastIndexOf(')'));
  if(p.indexOf('./')==0){
    css=css.replace(item,fs.readFileSync(path.join(__dirname,p)).toString())
  }
})
fs.writeFileSync(path.join(__dirname,'index.bundle.css'),css);
console.log('css');
minify(path.join(__dirname,'index.bundle.css'),{
  css:{
    "compatibility": "*"
  }
}).then(function(res){
  fs.writeFileSync(path.join(__dirname,'index.bundle.css'),res);
console.log('css-done');
})
;