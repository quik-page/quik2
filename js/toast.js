var to = el(".toast");

var g = null, g2 = null;
document.body.append(to);
module.exports= {
  show(value, time) {
    to.html(value);
    to.addClass('show');
    to.css("animation", "toastin .3s");
    clearTimeout(g);
    clearTimeout(g2);
    g = setTimeout(() => {
      to.css("animation", "toastout .3s");
      g2 = setTimeout(() => {
        to.removeClass('show');
      }, 298);
    }, time ? time : 2000);
  }
}