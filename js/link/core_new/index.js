const { storage, gS, dbTool } = require("../../storage");
const { fangdou } = require("../../util");
const { initsto } = require("./core");
const defLinks = require("./def_link");
let cateLinks = {};
let defCateLinks = [];
let idb = storage.checkIDB();
let saveLink = fangdou((cate) => {
    if (cate) {
        initsto.set("cate", cateLinks, idb);
    } else {
        initsto.set("links", defCateLinks, idb);
    }
}, 50);

let isInit = false;
function initLinks() {
    return new Promise(r => {
        if (isInit) return r();
        let rd = 0;
        let _t = () => {
            rd++;
            if (rd == 2) {
                isInit = 1;
                r();
            }
        }
        if (initsto.get("links")) {
            if (idb) {
                initsto.get("links", 1, res => {
                    if (!res) res = [];
                    defCateLinks = res;
                    _t();
                })
            } else {
                defCateLinks = initsto.get("links");
                _t();
            }
        } else {
            initsto.set("links", defLinks, idb);
            defCateLinks = cloneObj(defLinks);
            _t();
        }
        if (initsto.get("cate")) {
            if (idb) {
                initsto.get("cate", 1, res => {
                    if (!res) res = {};
                    cateLinks = res;
                    _t();
                })
            } else {
                cateLinks = initsto.get("cate");
                _t();
            }
        } else {
            initsto.set("cate", {}, idb);
            cateLinks = {};
            _t();
        }
    })
}

function pushLink(detail, ob) {
    var link = {
        title: detail.title,
        url: detail.url
    }
    if (detail.icon) {
        link.icon = detail.icon;
    }
    if (typeof detail.index == 'number' && detail.index >= 0) {
        if (detail.index > ob.length) {
            console.warn('添加链接时，index超出范围，应在0-' + ob.length + '之间');
            ob.push(link);
        } else {
            ob.splice(detail.index, 0, link);
        }
    } else {
        ob.push(link);
    }
    return ob;
}

function writeLink(index, detail, ob) {
    if (!ob[index]) {
        return false;
    }
    var link = {
        title: detail.title,
        url: detail.url
    }
    if (detail.icon) {
        link.icon = detail.icon;
    }
    ob[index] = link;
    if (typeof detail.index == 'number' && detail.index >= 0) {
        if (detail.index >= ob.length) {
            console.warn('修改链接时，index超出范围，应在0-' + (ob.length - 1) + '之间');
        } else {
            var linkb = ob.splice(index, 1)[0];
            ob.splice(detail.index, 0, linkb);
        }
    }
    return ob;
}

let coLink={
    getLinks(ob){
        return ob;
    },
    addLink(link,ob){
        return pushLink(link,ob);
    },
    changeLink(index,link,ob){
        return writeLink(index,link,ob);
    },
    deleteLink(index,ob){
        return ob.splice(index, 1);
    },
    setAll(ob,cate){
        if(cate) cateLinks[cate]=ob;
        else defCateLinks=ob;
    },
    
}
module.exports = {
    limitURL(detail) {
        if (detail.url.length > 1000) {
            return 'url';
        } else if (detail.title.length > 60) {
            return 'title';
        }
        return false;
    },
    getLinks(cate) {
        return cate ? cateLinks[cate] : defCateLinks;
    },
    addLink(detail) {
        let c=detail.cate;
        let so = c ? cateLinks[c] : defCateLinks;
        pushLink(detail, so);
        saveLink(c);
    },
    changeLink(detail){
        let c=detail.cate;
        let so = c ? cateLinks[c] : defCateLinks;
        writeLink(detail.index,detail,so);
        saveLink(c);
    },
    deleteLink(cate,index) {
        let so = cate ? cateLinks[cate] : defCateLinks;
        so.splice(index, 1);
        saveLink(cate);
    },
    setAll(cate,links) {
        if(cate) cateLinks[cate]=links;
        else defCateLinks=links;
        saveLink(cate);
    },
    getAll(){
        return {cate:cateLinks,links:defCateLinks};
    },
    addCate(name){
        if(!cateLinks[name]) cateLinks[name]=[];
        saveLink(1);
    },
    renameCate(cate,name){
        if(cateLinks[cate]){
            cateLinks[name]=cateLinks[cate];
            delete cateLinks[cate];
            saveLink(1);
        }
    },
    deleteCate(cate){
        if(cateLinks[cate]){
            delete cateLinks[cate];
            saveLink(1);
        }
    },

}
