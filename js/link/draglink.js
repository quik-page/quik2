
let { initsto } = require('./core/_core');
let util = require('../util');
let link=require('./core/_link');
util.initSet(initsto, 'draglink', true);
let linkMenu,getLinklist,getIndex,linkF;
setTimeout(() => {
    linkMenu = require('./ui/link').linkMenu;
    getLinklist = require('./ui/link').getLinklist;
    getIndex = require('./ui/link').getIndex;
    linkF=$('.links');
})

function getLineLinkNum() {
    var a = linkF.$('.link-list').getRect().width / linkF.$('.link-list li').getRect().width;
    return parseInt(a);
}


function f(li) {
    function g(a) {
        var gtimeout = null, ttimeout = null;
        li.on(a ? 'mousedown' : 'touchstart', (e) => {
            var linklist=getLinklist();
            if (e.which == 3) { return true; }
            if (!a) {
                ttimeout = setTimeout(() => {
                    quik.link.resetmenued();
                    menuedLi = li;
                    linkMenu.setOffset({
                        top: e.targetTouches[0].pageY,
                        left: e.targetTouches[0].pageX
                    })
                    li.addClass('menued');
                    linkMenu.show();
                }, 600);
            }
            if ((!initsto.get('draglink')) || (initsto.get('linkpailie') == 'b')) return true;
            let startX = a ? (e.pageX - li.getRect().left) : (e.targetTouches[0].pageX - li.getRect().left);
            let startY = a ? (e.pageY - li.getRect().top) : (e.targetTouches[0].pageY - li.getRect().top);
            if (a) {
                gtimeout = setTimeout(() => {
                    document.on('mousemove', _move, { passive: false })
                }, 50);
                document.on('mouseup', _up, { passive: false });
            } else {
                gtimeout = setTimeout(() => {
                    document.on('touchmove', _move, { passive: false });
                    li.addClass('touching');
                    linkMenu.hide();
                }, 1000);
                document.on('touchend', _up, { passive: false });
            }

            var b = null, n = null;
            var jx = linkF.$('.link-list').getRect().left;
            var jy = linkF.$('.link-list').getRect().top;
            var dw = li.getRect().width;
            var dh = li.getRect().height;
            function _move(e) {
                e.preventDefault();
                clearTimeout(ttimeout);
                if (!b) {
                    li.$('a').on('click', pv);
                    b = li.cloneNode(true);
                    b.addClass('dragging-link');
                    li.addClass('mousing');
                    document.body.appendChild(b);
                    b.style.width = li.getRect().width + 'px';
                    b.style.height = li.getRect().height + 'px';
                }
                var x = (a ? e.pageX : e.targetTouches[0].pageX) - startX;
                var y = (a ? e.pageY : e.targetTouches[0].pageY) - startY;
                b.style.left = x + 'px';
                b.style.top = y + 'px';

                var dx = x - jx + 50;
                var dy = y - jy + linkF.$('.link-list').scrollTop;

                if (y - jy < -dh / 2 || y > linkF.$('.link-list').getRect().height + linkF.$('.link-list').getRect().top) {
                    var line = linkF.$('.link-list .insert-line');
                    line.hide();
                    n = null;
                    if (y - jy < 0) {
                        scrollingtop();
                    } else {
                        scrollingbottom();
                    }
                } else {
                    clearInterval(stt);
                    var h = parseInt(dy / dh);
                    var w = parseInt(dx / dw);
                    var ne = w + h * getLineLinkNum();
                    if (linklist.length > ne) {
                        n = ne;
                        var line = linkF.$('.link-list .insert-line');
                        line.style.top = h * dh + 7 + 'px';
                        line.style.left = w * dw + 'px';
                        line.style.height = dh + 'px';
                        line.show();
                    }
                }


            }

            function pv(e) {
                e.preventDefault();
            }

            function _up(e) {
                clearTimeout(gtimeout);
                clearTimeout(ttimeout);
                li.removeClass('touching');
                li.removeClass('mousing');
                setTimeout(() => li.$('a').off('click', pv), 10);
                document.off(a ? 'mousemove' : 'touchmove', _move)
                document.off(a ? 'mouseup' : 'touchend', _up)
                if (b) {
                    b.remove();
                    b = null;
                }
                if (n !== null) {
                    var line = linkF.$('.link-list .insert-line');
                    line.hide();
                    var index = getIndex(li, linkF.$$('.link-list li'));
                    if (n == index) return;
                    var cate = linkF.$('.cate-bar-items .cate-item.active');
                    if (cate.hasClass('mr')) {
                        cate = null
                    } else {
                        cate = cate.text();
                    }
                    link.changeLink(cate, index, {
                        url: linklist[index].url,
                        title: linklist[index].title,
                        index: n
                    }, (back) => {
                        if (back.code != 0) {
                            toast.show(back.msg);
                        } else {
                            linklist.splice(n, 0, linklist.splice(index, 1)[0]);
                            if (n > index) {
                                linkF.$('.link-list').insertBefore(li, linkF.$$('.link-list li')[n + 1]);
                            } else {
                                linkF.$('.link-list').insertBefore(li, linkF.$$('.link-list li')[n]);
                            }
                        }
                    }, {
                        justindex: true
                    })
                }
                return true;
            }
            return true;
        });
    }
    g(0);
    g(1);
}

var stt = null;
function scrollingtop() {
    clearInterval(stt);
    stt = setInterval(() => {
        linkF.$('.link-list').scrollTop -= 2;
        if (linkF.$('.link-list').scrollTop <= 0) {
            clearInterval(stt);
        }
    }, 5);
}

function scrollingbottom() {
    clearInterval(stt);
    stt = setInterval(() => {
        linkF.$('.link-list').scrollTop += 2;
        if (linkF.$('.link-list').scrollTop >= linkF.$('.link-list').scrollHeight - linkF.$('.link-list').getRect().height) {
            clearInterval(stt);
        }
    }, 5);
}

module.exports = f;