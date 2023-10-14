(function () {
  var setting_icon = new iconc.icon({
    content: util.getGoogleIcon('e8b8'),
    offset: "bl"
  });

  var setting_dia = new dialog({
    content: `<div class="actionbar">
      <h1>设置</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <ul></ul>`,
    class: "setting_dia",
    mobileShowtype: dialog.SHOW_TYPE_FULLSCREEN
  });

  var d = setting_dia.getDialogDom()
  util.query(d, '.closeBtn').onclick = function () {
    setting_dia.close();
  }

  setting_icon.getIcon().onclick = function () {
    setting_dia.open();
  }

  var setting_ul = util.query(d, "ul");
  var isinit = false;
  setting_dia.onopen = function () {
    if (!isinit) {
      init();
    }
  }

  function init() {
    var flofunit = {};
    for (var k in selist) {
      var unit = selist[k].unit;
      if (!flofunit[unit]) {
        flofunit[unit] = [];
      }
      flofunit[unit].push(selist[k]);
    }
    for (var k in flofunit) {
      flofunit[k].sort((a, b) => {
        return a.index - b.index;
      })
    }
    var str = '';
    for (var k in flofunit) {
      var ustr = `<li class="unit"><div class="title">${k}</div><ul>
        ${(function (ses) {
          var str = '';
          for (var i = 0; i < ses.length; i++) {
            var s = ses[i];
            str += `<li class="setting_item" data-hash="${s.hash}">
              <div class="left-message">
                <div class="name">${s.title}</div>
                <div class="message">${s.message}</div>
              </div>
              <div class="right_con">
                ${getWidght(s.type)}
              </div>
            </li>`;
          }
          return str;
        })(flofunit[k])}
      </ul></li>`;
      str += ustr;
    }
    setting_ul.innerHTML = str;
    isinit = true;
    util.query(setting_ul, 'li.setting_item', true).forEach(function (li) {
      uplise(li);
    })
  }

  function uplise(li){
    var hash = li.getAttribute('data-hash');
      var s = selist[hash];
      function gi() {
        var type = s.type;
        if (type) {
          var value = s.get();
          if (type == 'boolean') {
            li.querySelector('.input').checked = value;
          } else if (type == 'string' || type == 'number') {
            li.querySelector('.input').value = value;
          } else if (type == 'range') {
            var init = s.init(); //{max:n,min:n}
            li.querySelector('.input').value = value;
            li.querySelector('.input').max = init.max;
            li.querySelector('.input').min = init.min;
          } else if (type == 'select') {
            var init = s.init();
            li.querySelector('.input').innerHTML = (function () {
              var str = '';
              for (var k in init) {
                str += `<option value="${k}">${init[k]}</option>`;
              }
              return str;
            })();
            li.querySelector('.input').value = value;
          }
        } else {
          li.onclick = function () {
            s.callback();
          }
        }

      }
      gi();
      li.querySelector('.name').innerHTML=s.title;
      li.querySelector('.message').innerHTML=s.message;
      if (li.querySelector('.input')) {
        li.querySelector('.input').onchange = function () {
          if (this.type == 'checkbox') {
            if (s.check ? s.check(this.checked) : true) {
              s.callback(this.checked);
            } else {
              this.checked = s.get();
            }
          } else {
            if (s.check ? s.check(this.value) : true) {
              s.callback(this.value);
            } else {
              this.value = s.get();
            }
          }

        }
      }
    if(s.show){
      if(!s.show()){
        li.style.display = 'none';
      }else{
        li.style.display = 'block';
      }
    }
  }

  function getWidght(type) {
    switch (type) {
      case 'boolean':
        return `<div class="right_con_item_checkbox">
            <input type="checkbox" class="input" />
          </div>`;
      case 'string':
        return `<div class="right_con_item_input">
            <input type="text" class="input" />
          </div>`;
      case 'number':
        return `<div class="right_con_item_number">
            <input type="number" class="input" />
          </div>`;
      case 'select':
        return `<div class="right_con_item_select">
            <select class="input" ></select>
          </div>`;
      case 'range':
        return `<div class="right_con_item_range">
            <input type="range" class="input" />
          </div>`;
      default:
        return util.getGoogleIcon('e5cc');
    }
  }

  var selist = {

  };
  /**
   * 注册setting
   * @param {Object} options 
   * @param {Number} options.index 设置在该单元中的排序
   * @param {String} options.unit 设置属于的单元
   * @param {String} options.title 设置标题
   * @param {String} options.message? 设置说明
   * @param {'boolean'|'string'|'number'|'range'|'select'} options.type 设置内容类型
   * @param {Function} options.init 返回设置初始化内容
   * @param {Function} options.check? 检查用户输入的内容
   * @param {Function} options.show? 是否显示该设置
   * @param {Function} options.get 获取设置内容
   * @param {Function} options.callback 设置设置内容
   * @returns {String} hash
   */
  var registerSetting = function (options) {
    var hash = 'se_' + util.getRandomHashCache()+Object.keys(selist).length;
    options.hash = hash;
    selist[hash] = options;
    if(isinit){
      hmr(options);
    }
    return hash;
  }

  function hmr(options){
    var unit=options.hash;
    var unit_dom=util.query(setting_ul,'li.unit',true);
    var a=false;
    var sli=get_setting_li(options);
    unit_dom.forEach(function(e){
      if(util.query(e,'.title').innerHTML==unit){
        a=true;
        util.query(e,'ul').append(sli);
      }
    });
    if(!a){
      var unit_li=util.element('li',{
        class:"unit"
      });
      unit_li.innerHTML=`<div class="title">${options.unit}</div><ul></ul>`;
      util.query(unit_li,'ul').append(sli);
    }

    function get_setting_li(){
      var li=util.element('li',{
        class:"setting_item"
      });
      li.setAttribute('data-hash',options.hash);
      li.innerHTML=`<div class="left-message">
      <div class="name">${options.title}</div>
      <div class="message">${options.message}</div>
    </div>
    <div class="right_con">
      ${getWidght(options.type)}
    </div>`;
      return li;
    }

    uplise(li);
  }

  var updateSettingByHash = function (hash, options) {
    if (!selist[hash]) {
      console.warn('SETTING: 没有找到该hash对应的设置');
      return;
    }
    for (var k in options) {
      selist[hash][k] = options[k];
    }
    if(isinit){
      uplise(util.query(setting_ul,'li[data-hash="'+hash+'"]'));
    }
  }

  var recallSettingByHash = function (hash, fnname) {
    if (!selist[hash]) {
      console.warn('SETTING: 没有找到该hash对应的设置');
      return;
    }
    var li=util.query(setting_ul,'li[data-hash="'+hash+'"]');
    if(fnname=='get'){
      var value=selist[hash].get();
      var type=selist[hash].type;
      if (type == 'boolean') {
        li.querySelector('.input').checked = value;
      } else if (type == 'string' || type == 'number'||type == 'range'||type == 'select') {
        li.querySelector('.input').value = value;
      }
    }else if(fnname=='show'){
      if(selist[hash].show){
        if(!selist[hash].show()){
          li.style.display='none';
        }else{
          li.style.display='block';
        }
      }
    }else if(fnname=='callback'){
      selist[hash].callback(selist[hash].get());
    }
  }
  var initsto=storage('setting');
  if(!initsto.get('theme')){
    initsto.set('theme','a');
  }
  registerSetting({
    index:0,
    unit:"通用",
    title:"主题颜色",
    type:"select",
    message:'',
    get:function(){
      
      return initsto.get('theme');
    },
    callback:function(v){
      initsto.set('theme',v);
      checkTheme(v);
    },
    init:function(){
      return {
        a:'浅色',b:'深色',c:'自适应'
      }
    }
  });

  function checkTheme(v){
    if(v=='b'){
      document.body.classList.add('dark');
    }else if(v=='a'){
      document.body.classList.remove('dark');
    }else if(v=='c'){
      if(new Date().getHours()>=18||new Date().getHours()<6){
        document.body.classList.add('dark');
      }else{
        document.body.classList.remove('dark');
      }
    }
  }

  checkTheme(initsto.get('theme'));
  return {
    registerSetting: registerSetting,
    updateSettingByHash: updateSettingByHash,
    recallSettingByHash: recallSettingByHash
  };
})();