(function () {
  initsto.set('storage-mode','db');

  // 初始化进度，2为初始化完毕
  var initState = 0;
  function init() {
    // 初始化默认分组
    if (!initsto.get('links')) {
      initsto.set('links', [], true, function () {
        initState++;
        if (initState == 2) {
          readyfn.forEach(a=>a());
        }
      })
    } else {
      initState++;
    }

    // 初始化分组
    if (!initsto.get('cate')) {
      initsto.set('cate', {}, true, function () {
        initState++;
        if (initState == 2) {
          readyfn.forEach(a=>a());
        }
      });
    } else {
      initState++;
    }
  }

  init();
  var readyfn = [];
  if (initState == 2) {
    readyfn.forEach(a=>a());
  }

  return {
    setAll:function(link,cate,cb){
      if (initState != 2) {
        throw '初始化未完成';
      }
      if(Array.isArray(link)&&typeof cate=='object'){
        initsto.set('links',link,true,function(){
          initsto.set('cate',cate,true,function(){
            cb&&cb();
            doevent('change',{
              type:"all",
              links:link,
              cate:cate
            })
          })
        })
      }
    },
    addLink: function (detail, callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      if (!util.checkDetailsCorrect(detail, ['title', 'url'])) {
        throw '参数不正确';
      }
      if (detail.cate) {
        // 包含分类 
        initsto.get('cate', true, function (c) {
          if (!c[detail.cate]) {
            callback&&callback({
              code: -1,
              msg: "分组不存在"
            })
          } else {
            c[detail.cate] = pushLink(detail, c[detail.cate]);
            initsto.set('cate', c, true, function () {
              callback&&callback({
                code: 0,
                msg: "添加成功"
              });
              doevent('change', {
                cate: detail.cate,
                type: 'add',
                detail: detail
              });
            });
          }
        })
      } else {
        // 不包含分类，即为默认分组

        initsto.get('links', true, function (l) {
          l = pushLink(detail, l);
          initsto.set('links', l, true, function () {
            callback&&callback({
              code: 0,
              msg: "添加成功"
            });
            doevent('change', {
              cate: null,
              type: 'add',
              detail: detail
            });
          });
        })
      }
    },
    changeLink: function (cate, index, detail, callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      if (!util.checkDetailsCorrect(detail, ['title', 'url']) || typeof index != 'number') {
        throw '参数错误';
      }
      if (cate) {
        // 包含分类
        initsto.get('cate', true, function (c) {
          if (!c[cate]) {
            callback&&callback({
              code: -1,
              msg: "分组不存在"
            })
            return;
          }

          var r = writeLink(index, detail, c[cate]);
          if (!r) {
            callback&&callback({
              code: -2,
              msg: "链接不存在"
            });
            return;
          }
          c[cate] = r;
          initsto.set('cate', c, true, function () {
            callback&&callback({
              code: 0,
              msg: "修改成功"
            });
            doevent('change', {
              cate: cate,
              index: index,
              type: 'change',
              detail: detail
            });
          })
        })
      } else {
        // 不包含分类
        initsto.get('links', true, function (links) {
          var r = writeLink(index, detail, links);
          if (!r) {
            callback&&callback({
              code: -2,
              msg: "链接不存在"
            });
            return;
          }
          links = r;
          initsto.set('links', links, true, function () {
            callback&&callback({
              code: 0,
              msg: "修改成功"
            });
            doevent('change', {
              cate: null,
              index: index,
              type: 'change',
              detail: detail
            });
          });
        });
      }
    },
    deleteLink: function (cate, index, callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      if (cate) {
        // 包含分类
        initsto.get('cate', true, function (c) {
          if (!c[cate]) {
            callback&&callback({
              code: -1,
              msg: "分组不存在"
            });
            return;
          }
          if (!c[cate][index]) {
            callback&&callback({
              code: -2,
              msg: "链接不存在"
            });
            return;
          }
          c[cate].splice(index, 1);
          initsto.set('cate', c, true, function () {
            callback&&callback({
              code: 0,
              msg: "删除成功"
            });
            doevent('change', {
              cate: cate,
              index: index,
              type: 'delete',
            });
          });
        });
      } else {
        // 不包含分类
        initsto.get('links', true, function (r) {
          if (!r[index]) {
            callback&&callback({
              code: -2,
              msg: "链接不存在"
            });
            return;
          }
          r.splice(index, 1);
          initsto.set('links', r, true, function () {
            callback&&callback({
              code: 0,
              msg: "删除成功"
            });
            doevent('change', {
              cate: null,
              index: index,
              type: 'delete',
            });
          });
        });
      }
    },
    addCate: function (cate, callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      initsto.get('cate', true, function (c) {
        if (c[cate]) {
          callback&&callback({
            code: -1,
            msg: "分组已存在"
          });
          return;
        }
        c[cate] = [];
        initsto.set('cate', c, true, function () {
          callback&&callback({
            code: 0,
            msg: "添加成功"
          });
          doevent('change', {
            cate: cate,
            type: 'cateadd',
          });
        });
      });
    },
    renameCate: function (cate, catename, callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      initsto.get('cate', true, function (c) {
        if (!c[cate]) {
          callback&&callback({
            code: -1,
            msg: "分组不存在"
          });
          return;
        }
        if (c[catename]) {
          callback&&callback({
            code: -2,
            msg: "分组重名"
          });
        }
        c[catename] = c[cate];
        delete c[cate];
        initsto.set('cate', c, true, function () {
          callback&&callback({
            code: 0,
            msg: "修改成功"
          });
          doevent('change', {
            cate: cate,
            catename: catename,
            type: 'caterename',
          });
        });
      });
    },
    deleteCate: function (cate, callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      initsto.get('cate', true, function (c) {
        if (!c[cate]) {
          callback&&callback({
            code: -1,
            msg: "分组不存在"
          });
          return;
        }
        if (c[cate].length <= 1) {
          delete c[cate];
          initsto.set('cate', c, true, function () {
            callback&&callback({
              code: 0,
              msg: "删除成功"
            });
            doevent('change', {
              cate: cate,
              type: 'catedelete',
            });
          });
        } else{
          confirm('确定要删除分组吗？无法恢复！',function(r){
            if(r){
              delete c[cate];
              initsto.set('cate', c, true, function () {
                callback&&callback({
                  code: 0,
                  msg: "删除成功"
                });
                doevent('change', {
                  cate: cate,
                  type: 'catedelete',
                });
              });
            }else{
              callback&&callback({
                code: -2,
                msg: "用户取消删除"
              });
            }
          })
        }

      });
    },
    getLinks: function (cate, callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      if (cate) {
        initsto.get('cate', true, function (c) {
          if (!c[cate]) {
            callback&&callback({
              code: -1,
              msg: "分组不存在"
            });
            return;
          }
          callback&&callback({
            code: 0,
            msg: "获取成功",
            data: c[cate]
          });
        });
      } else {
        initsto.get('links', true, function (c) {
          callback&&callback({
            code: 0,
            msg: "获取成功",
            data: c
          });
        });
      }
    },
    getCates: function (callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      initsto.get('cate', true, function (c) {
        callback&&callback({
          code: 0,
          msg: "获取成功",
          data: Object.keys(c)
        });
      });
    },
    getCateAll: function (callback) {
      if (initState != 2) {
        throw '初始化未完成';
      }
      initsto.get('cate', true, function (c) {
        callback&&callback({
          code: 0,
          msg: "获取成功",
          data: c
        });
      });
    },
    ready: function (fn) {
      if (initState == 2) {
        fn();
      } else {
        readyfn.push(fn);
      }
    },
    on,off
  }
})();