(function(){
  var setting_icon=new iconc.icon({
    content:util.getGoogleIcon('e8b8'),
    offset:"bl"
  });

  var setting_dia=new dialog({
    content:`<div class="actionbar">
      <h1>设置</h1><div class="closeBtn">${util.getGoogleIcon('e5cd')}</div>
    </div>
    <ul></ul>`,
    class:"setting_dia",
    mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN
  });

  var d=setting_dia.getDialogDom()
  util.query(d,'.closeBtn').onclick=function(){
    setting_dia.close();
  }

  setting_icon.getIcon().onclick=function(){
    setting_dia.open();
  }

  var setting_ul=util.query(d,"ul");
  var isinit=false;
  setting_dia.onopen=function(){
    if(!isinit){
      init();
    }
  }

  function init(){
    var flofunit={};
    for(var k in selist){
      var unit=selist[k].unit;
      if(!flofunit[unit]){
        flofunit[unit]=[];
      }
      flofunit[unit].push(selist[k]);
    }
    for(var k in flofunit){
      flofunit[k].sort((a,b)=>{
        return a.index-b.index;
      })
    }
    var str='';
    for(var k in flofunit){
      var ustr=`<li class="unit"><div class="title">${k}</div><ul>
        ${(function(ses){
          var str='';
          for(var i=0;i<ses.length;i++){
            var s=ses[i];
            str+=`<li class="setting_item" data-hash="${s.hash}">
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
      str+=ustr;
    }
    setting_ul.innerHTML=str;
    isinit=true;
    util.query(setting_ul,'li.setting_item',true).forEach(function(li){
      var hash=li.getAttribute('data-hash');
      var s=selist[hash];
      function gi(){
        var type=s.type;
        var value=s.get();
        if(type=='boolean'){
          li.querySelector('.input').checked=value;
        }else if(type=='string'||type=='number'){
          li.querySelector('.input').value=value;
        }else if(type=='range'){
          var init=s.init(); //{max:n,min:n}
          li.querySelector('.input').value=value;
          li.querySelector('.input').max=init.max;
          li.querySelector('.input').min=init.min;
        }else if(type=='select'){
          var init=s.init();
          li.querySelector('.input').innerHTML=(function(){
            var str='';
            for(var k in init){
              str+=`<option value="${k}">${init[k]}</option>`;
            }
            return str;
          })();
          li.querySelector('.input').value=value;
        }
      }
      gi();
      li.querySelector('.input').onchange=function(){
        if(this.type=='checkbox'){
          if(s.check?s.check(this.checked):true){
            s.callback(this.checked);
          }else{
            this.checked=s.get();
          }
        }else{
          if(s.check?s.check(this.value):true){
            s.callback(this.value);
          }else{
            this.value=s.get();
          }
        }
        
      }
    })
  }
  
  function getWidght(type){
    switch(type){
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
        return '';
    }
  }

  var selist={

  };
  /**
   * 注册setting
   * @param {Object} options 
   * @param {Number} options.index 设置在该单元中的排序
   * @param {String} options.unit 设置属于的单元
   * @param {String} options.title 设置标题
   * @param {String} options.message? 设置说明
   * @param {'boolean'||'string'||'number'||'range'||'select'} options.type 设置内容类型
   * @param {Function} options.init 返回设置初始化内容
   * @param {Function} options.check? 检查用户输入的内容
   * @param {Function} options.get 获取设置内容
   * @param {Function} options.callback 设置设置内容
   * @returns {String} hash
   */
  var registerSetting=function(options){
    var hash='se_'+util.getRandomHashCache();
    options.hash=hash;
    selist[hash]=options;
    return hash;
  }

  var updateSettingByHash=function(hash,options){
    if(!selist[hash]){
      console.warn('SETTING: 没有找到该hash对应的设置');
      return;
    }
    for(var k in options){
      selist[hash][k]=options[k];
    }
  }

  var recallSettingByHash=function(hash,fn){
    if(!selist[hash]){
      console.warn('SETTING: 没有找到该hash对应的设置');
      return;
    }
    if(typeof selist[hash][fn]!='function'){
      console.warn('没有该方法');
    }
    selist[hash][fn]();
  }

  return {
    registerSetting:registerSetting,
    updateSettingByHash:updateSettingByHash,
    recallSettingByHash:recallSettingByHash
  };
})();