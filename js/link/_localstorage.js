(function () {
  console.warn('浏览器不支持indexedDB，将在限制模式下使用');

  initsto.set('storage-mode','localstorage');
  // 初始化默认分组
  if (!initsto.get('links')) {
    initsto.set('links', [])
  }

  // 初始化分组
  if (!initsto.get('cate')) {
    initsto.set('cate', {});
  }

  return {
    addLink: function (detail, callback = function () { }) {
      if (!util.checkDetailsCorrect(detail, ['title', 'url'])) {
        throw '参数不正确';
      }
      var lm = limitURL(detail);
      if (lm) {
        callback({
          code: -3,
          msg: "受限模式下，" + lm + "长度过长",
          lm: lm
        });
      }
      if (detail.cate) {
        // 包含分类 
        var c = initsto.get('cate');
        if (!c[detail.cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          })
        } else {
          if (c[detail.cate].length > 100) {
            callback({
              code: -4,
              msg: "受限模式下，分组下已超过100条链接，无法添加"
            })
            return;
          }
          c[detail.cate] = pushLink(detail, c[detail.cate]);
          initsto.set('cate', c);
          callback({
            code: 0,
            msg: "添加成功"
          });
          doevents('change', {
            cate: detail.cate,
            type: 'add',
            detail: detail
          });
        }
      } else {
        // 不包含分类，即为默认分组

        var l = initsto.get('links');
        if (l.length > 100) {
          callback({
            code: -4,
            msg: "受限模式下，分组下已超过100条链接，无法添加"
          })
          return;
        }
        l = pushLink(detail, l);
        initsto.set('links', l);
        callback({
          code: 0,
          msg: "添加成功"
        });
        doevents('change', {
          cate: null,
          type: 'add',
          detail: detail
        });

      }
    },
    changeLink: function (cate, index, detail, callback = function () { }) {
      if (!util.checkDetailsCorrect(detail, ['title', 'url']) || typeof index != 'number') {
        throw '参数错误';
      }
      var lm = limitURL(detail);
      if (lm) {
        callback({
          code: -3,
          msg: "受限模式下，" + lm + "长度过长",
          lm: lm
        });
      }
      if (cate) {
        // 包含分类
        var c = initsto.get('cate');
        if (!c[cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          })
          return;
        }

        var r = writeLink(index, detail, c[cate]);
        if (!r) {
          callback({
            code: -2,
            msg: "链接不存在"
          });
          return;
        }
        c[cate] = r;
        initsto.set('cate', c);
        callback({
          code: 0,
          msg: "修改成功"
        });
        doevents('change', {
          cate: cate,
          index: index,
          type: 'change',
          detail: detail
        });
      } else {
        // 不包含分类
        var links = initsto.get('links');
        var r = writeLink(index, detail, links);
        if (!r) {
          callback({
            code: -2,
            msg: "链接不存在"
          });
          return;
        }
        links = r;
        initsto.set('links', links);
        callback({
          code: 0,
          msg: "修改成功"
        });
        doevents('change', {
          cate: null,
          index: index,
          type: 'change',
          detail: detail
        });
      }
    },
    deleteLink: function (cate, index, callback = function () { }) {
      if (cate) {
        // 包含分类
        var c = initsto.get('cate');
        if (!c[cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          });
          return;
        }
        if (!c[cate][index]) {
          callback({
            code: -2,
            msg: "链接不存在"
          });
          return;
        }
        c[cate].splice(index, 1);
        initsto.set('cate', c);
        callback({
          code: 0,
          msg: "删除成功"
        });
        doevents('change', {
          cate: cate,
          index: index,
          type: 'delete',
        });
      } else {
        // 不包含分类
        var r = initsto.get('links');
        if (!r[index]) {
          callback({
            code: -2,
            msg: "链接不存在"
          });
          return;
        }
        r.splice(index, 1);
        initsto.set('links', r);
        callback({
          code: 0,
          msg: "删除成功"
        });
        doevents('change', {
          cate: null,
          index: index,
          type: 'delete',
        });
      }
    },
    addCate: function (cate, callback = function () { }) {
      var c = initsto.get('cate');
      if (c[cate]) {
        callback({
          code: -1,
          msg: "分组已存在"
        });
        return;
      }
      if (Object.keys(c).length >= 20) {
        callback({
          code: -2,
          msg: "受限模式下，分组数量不能超过20个"
        });
        return;
      }
      c[cate] = [];
      initsto.set('cate', c);
      callback({
        code: 0,
        msg: "添加成功"
      });
      doevents('change', {
        cate: cate,
        type: 'cateadd',
      });
    },
    renameCate: function (cate, catename, callback = function () { }) {
      var c = initsto.get('cate');
      if (!c[cate]) {
        callback({
          code: -1,
          msg: "分组不存在"
        });
        return;
      }
      if (c[catename]) {
        callback({
          code: -2,
          msg: "分组重名"
        });
      }
      c[catename] = c[cate];
      delete c[cate];
      initsto.set('cate', c);
      callback({
        code: 0,
        msg: "修改成功"
      });
      doevents('change', {
        cate: cate,
        catename: catename,
        type: 'caterename',
      });
    },
    deleteCate: function (cate, callback = function () { }) {
      var c = initsto.get('cate');
      if (!c[cate]) {
        callback({
          code: -1,
          msg: "分组不存在"
        });
        return;
      }
      if (c[cate].length <= 1) {
        delete c[cate];
        initsto.set('cate', c);
        callback({
          code: 0,
          msg: "删除成功"
        });
      } else if (confirm('确定要删除分组吗？无法恢复！')) {
        delete c[cate];
        initsto.set('cate', c);
        callback({
          code: 0,
          msg: "删除成功"
        });
        doevents('change', {
          cate: cate,
          type: 'catedelete',
        });
      } else {
        callback({
          code: -2,
          msg: "用户取消删除"
        });
        doevents('change', {
          cate: cate,
          type: 'catedelete',
        });
      }
    },
    getLinks: function (cate, callback = function () { }) {
      if (cate) {
        var c = initsto.get('cate');
        if (!c[cate]) {
          callback({
            code: -1,
            msg: "分组不存在"
          });
          return;
        }
        callback({
          code: 0,
          msg: "获取成功",
          data: c[cate]
        });
      } else {
        var c = initsto.get('links');
        callback({
          code: 0,
          msg: "获取成功",
          data: c
        });
      }
    },
    getCates: function (callback = function () { }) {
      var c = initsto.get('cate');
      callback({
        code: 0,
        msg: "获取成功",
        data: Object.keys(c)
      });
    },
    getCateAll: function (callback = function () { }) {
      var c = initsto.get('cate');
      callback({
        code: 0,
        msg: "获取成功",
        data: c
      });
    },
    ready: function (fn) {
      fn();
    },
    addEventListener: function (event, fn) {
      if (eventfns[event]) {
        eventfns[event].push(fn);
      } else {
        eventfns[event] = [fn];
      }
    },
    removeEventListener: function (event, fn) {
      if (eventfns[event]) {
        eventfns[event].forEach(function (item, index) {
          if (item === fn) {
            eventfns[event].splice(index, 1);
          }
        });
      }
    }
  }
})();