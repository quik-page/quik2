const util = require("../util");

var fcF = el('.fcard-frame');
var fcFclicked = false;
fcF.on('click', () => {
    fcFclicked = true;
})
$('main').append(fcF);

var idmax = 0;
var fcards = [];

function fcard(options) {
    this.content = options.content;
    idmax++;
    this.id = idmax;
    var fel = el('div', {
        class: "fcard" + (options.class ? " " + options.class : "")
    });
    fel.html('<div class="content">' + this.content + '<div>');
    fcF.insertBefore(fel, fcF.firstChild);
    this.el = fel;
    fcards.push(this);
    this.isShow = true;
    mobZDIcon.css("display",'');
}

fcard.prototype = {
    show() {
        this.el.show();
        this.isShow = true;
        mobZDIcon.css("display",'');
    },
    hide() {
        this.el.hide();
        this.isShow = false;
        if (checkAllHide()) {
            mobZDIcon.hide();
        };
    },
    getFCardDom() {
        return this.el
    },
    destroy() {
        this.el.remove();
        this.el = null;
        fcards.splice(fcards.indexOf(this), 1);
        if (checkAllHide()) {
            mobZDIcon.hide();
        };
    }
}

fcard.getFCardById = (id) => {
    for (var i = 0; i < fcards.length; i++) {
        if (fcards[i].id == id) {
            return fcards[i];
        }
    }
    return null;
}


function checkAllHide() {
    for (var i = 0; i < fcards.length; i++) {
        if (fcards[i].isShow) {
            return false;
        }
    }
    return true;
}

var mobZDIcon = el('.fcard-mob-zd');
mobZDIcon.html(util.getGoogleIcon('e5cc'));
mobZDIcon.hide();
$('main').append(mobZDIcon);
mobZDIcon.onclick = function (e) {
    fcFclicked = true;
    fcF.addClass('show')
    this.addClass('hide');
}
document.on('click', () => {
    if (fcFclicked) {
        fcFclicked = false;
        return;
    }
    fcF.removeClass('show');
    mobZDIcon.removeClass('hide');
})



module.exports = fcard;
