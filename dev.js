const fs = require('fs');
const path = require('path');

const watchDir = path.join(__dirname, 'js');
const outputFile = path.join(__dirname, 'index.dev.js');


function getCode(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log('err');
                reject(err);
            } else {
                resolve(data.toString() + '\n');
            }
        })
    })
}

var reg = /(?<!\.)require\s*\(.*?\)/g;
var defCode = `(function(modules){var ranmodules={};function require(e){ranmodules[e]||run(e);return ranmodules[e].exports}function run(e){var r={exports:{}};ranmodules[e]=r,modules[e](require,r);}run(0);})({`;

var d = {
    '.css': function (code) {
        code = 'var style=document.createElement("style");style.innerHTML=`' + code.replace(/`/g, '\\`') + '`;document.head.appendChild(style);';
        return code;
    },
    '.json': function (code) {
        code = 'var json=' + code + ';module.exports=json;';
        return code;
    },
    '.html': function (code) {
        code = 'module.exports=`' + code.replace(/`/g, '\\`') + '`;';
        return code;
    },
    def: function (code) {
        code = 'module.exports=`' + code.replace(/`/g, '\\`') + '`;';
        return code;
    }
};

function installExt(ext, func) {
    d[ext] = func;
}

async function build(path) {
    var codes = {
        code: {},
        id: {},
        length: 0,
    };
    await parseRem(path, codes);
    var code = defCode + (() => {
        var str = '';
        for (var i = 0; i < codes.length; i++) {
            str += i + ':(function(_r,module){' + codes.code[i] + '}),';
        }
        return str;
    })() + '})';
    return code;
}

async function parseRem(src, codes, rootPath = '') {
    if (src[0] === '.' && rootPath) {
        src = path.join(rootPath, src);
    }
    if (src[src.length - 1] == '/') {
        src += 'index.js';
    } else {
        var st;
        try {
            var st = fs.statSync(src);
            if (st.isDirectory() == true) {
                src = path.join(src, 'index.js');
            } else {
                if (!path.extname(src)) {
                    src = src.trim() + '.js';
                }
            }
        } catch (e) {
            src = src.trim() + '.js';
        }

    }

    if (codes.id[src]) return codes.id[src];
    let code;
    try {
        code = await getCode(src);
    } catch (e) {
        console.log(e);
        throw new Error(JSON.stringify({
            message: 'Failed to load ' + src,
            error: e.message
        }))

    }
    codes.length++;
    var id = codes.length - 1;
    codes.id[src] = id;
    if (path.extname(src) === '.js' || path.extname(src) === '.cjs') {
        var requires = code.match(reg);
        if (requires) {
            for (var i = 0; i < requires.length; i++) {
                var requireStr = requires[i];
                var requirePath = eval(requireStr.replace('require(', '').replace(')', ''));
                try {
                    var id_ = await parseRem(requirePath, codes, path.dirname(src));
                    code = code.replace(requireStr, '_r(' + id_ + ')');
                } catch (e) {
                    console.warn('Failed to load ' + requirePath + ' in ' + src, e.message);
                }

            }
        }
    } else if (d[path.extname(src)]) {
        code = d[path.extname(src)](code);
        if (code instanceof Promise) {
            code = await code;
        }
    } else {
        code = d.def(code);
    }

    codes.code[id] = code;
    return id;
}

function zhuanyi(code) {
    return "\"" + code.replace(/"/g, '\\"').replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\t/g, "\\t") + "\"";
}

let nd=Date.now(),sc;
(async ()=>{
    let code = await build(path.join(__dirname, 'index.js'));
    fs.writeFileSync(outputFile, code);
    console.log('编译完成，耗时：'+(Date.now()-nd)+'ms');
    
    // 监听js目录下的文件变化
    fs.watch(watchDir, { recursive: true }, async () => {
        if(Date.now()-sc<1000) return;
        console.log('监听到文件变化，重新编译');
        sc=nd=Date.now();
        let code = await build(path.join(__dirname, 'index.js'));
        fs.writeFileSync(outputFile, code);
        console.log('编译完成，耗时：'+(Date.now()-nd)+'ms');
        nd=Date.now();
    });
})();



