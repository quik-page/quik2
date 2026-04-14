
var notice_con = $(".notice-con");
var notip = $(".no-notice-tip");
const { icon } = require('../iconc');
const util = require('../util');
var notice_mb = require('./notice.mb.html');
var focus_con = $(".focus-notice");
var hasNew = 0;
var noticeclick = false;
function notice(details) {
  this.el = el('.notice-item');
  notice_con.appendChild(this.el);
  this.title = details.title;
  this.content = details.content;
  this.btns = details.btns || [];
  this.useprogress = details.useprogress;
  this.progress = 0;
  drawNotice(this);
}
notice.prototype = {
  show(time) {
    notip.removeClass('show');
    r(1);
    clearTimeout(this._timeouthide);
    this.el.addClass('show');
    this.el.on('click', function (e) {
      noticeclick = true;
    })
    var _ = this;
    this.el.show();
    this.el.css("animation", 'noticein .3s');

    if (time) {
      setTimeout(() => {
        _.hide();
      }, time)
    }
  },
  hide() {
    this.el.removeClass('show');
    if (!$(".notice-con .notice-item.show")) {
      notip.addClass('show');
      r(0);
    }
    this.el.css("animation", 'noticeout .3s');
    var _ = this;
    this._timeouthide = setTimeout(() => {
      _.el.hide();
    }, 300)
  },
  focus() {
    this.show();
    upfocus(this);
  },
  destroy() {
    this.hide();
    var _ = this;
    setTimeout(() => {
      _.el.remove();
    }, 300)
  },
  setTitle(title) {
    this.title = title;
    drawNoticeTitle(this);
  },
  setContent(content) {
    this.content = content;
    drawNoticeContent(this);
  },
  setBtn(btns) {
    this.btns = btns;
    drawNoticeBtn(this);
  },
  setProgress(progress) {
    if (!this.useprogress || progress > 1 || progress < 0) {
      return;
    }
    this.progress = progress;
    drawNoticeProgress(this);
  }
}

var focus_arr = [];
function upfocus(_) {
  focus_arr.push(_);
  if (focus_arr.length == 1) {
    g();
  }
}

var focus_timeout;
function g() {
  var readyFocusNotice = focus_arr[0];
  var cloneNoticeEl = readyFocusNotice.el.cloneNode(true);
  focus_con.appendChild(cloneNoticeEl);
  cloneNoticeEl.$('.notice-close-btn').onclick = function () {
    clearTimeout(focus_timeout);
    cloneNoticeEl.remove();
    readyFocusNotice.hide();
    focus_arr.shift();
    if (focus_arr.length > 0) {
      g();
    }
  }
  drawNoticeBtn({
    el: cloneNoticeEl,
    btns: readyFocusNotice.btns,
    hide() {
      readyFocusNotice.hide();
      clearTimeout(focus_timeout);
      cloneNoticeEl.remove();
    },
    show() { }
  });
  focus_timeout = setTimeout(() => {
    cloneNoticeEl.remove();
    focus_arr.shift();
    if (focus_arr.length > 0) {
      g();
    }
  }, 3000);
}

function drawNotice(n) {
  n.el.html(notice_mb.replace('{{close-btn}}', util.getGoogleIcon('e5cd')));
  n.el.$('.notice-close-btn').onclick = () => {
    n.hide();
  }
  drawNoticeTitle(n);
  drawNoticeContent(n);
  drawNoticeBtn(n);
  drawNoticeProgress(n);
}

function drawNoticeTitle(n) {
  var titleel = n.el.$('.notice-title');
  titleel.html(n.title);
}

function drawNoticeContent(n) {
  var contentel = n.el.$('.notice-content');
  contentel.html(n.content);
}

function drawNoticeBtn(n) {
  var btncon = n.el.$('.notice-btns');
  btncon.html('');
  for (var i = 0; i < n.btns.length; i++) {
    (i => {
      var btn = n.btns[i];
      var btnel = el('div', {
        class: "btn" + (btn.style ? " " + btn.style : ""),
      });
      btnel.text(btn.text);
      btnel.onclick = () => {
        btn.click(n);
      }
      btncon.appendChild(btnel);
    })(i)

  }
}

function drawNoticeProgress(n) {
  if (!n.useprogress) {
    n.el.$('.notice-progress').hide();
    return;
  }
  var progressel = n.el.$('.notice-progress .p div');
  progressel.css("width", n.progress * 100 + "%");
}
// mobile适配
var mbicon = new icon({
  content: util.getGoogleIcon('e7f4'),
  offset: "tl",
  class: "notice-icon"
});

window.on('resize', () => { r() });
mbicon.getIcon().on('click', () => {
  $(".notice-sc").addClass('show');
})
$(".notice-sc").on('click', function () {
  if (noticeclick) {
    noticeclick = false;
    return;
  }
  this.removeClass('show');
})
function r(a) {
  if (typeof a == "undefined") {
    a = hasNew;
  } else {
    hasNew = a;
  }
  if (window.innerWidth < 600 && a) {
    mbicon.show();
  } else {
    mbicon.hide();
  }
}
r();

module.exports = notice;
