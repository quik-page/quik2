(function(){
  function alert(text,cb){
    var d=new dialog({
      content:`<div class="def_dialog">
      <h1>提示</h1>
      <div class="content"></div>
      <div class="footer">
        <button class="ok btn">确定</button>
      </div>
    </div>`
    });
    setTimeout(function(){d.open()},10)
    var dd=d.getDialogDom();
    util.query(dd,'.content').innerText=text;
    util.query(dd,'.ok').onclick=function(){
      cb();
      d.close();
      setTimeout(function(){d.destory()},299);
    }
  }
  function confirm(text,cb){
    var d=new dialog({
      content:`<div class="def_dialog">
      <h1>提示</h1>
      <div class="content"></div>
      <div class="footer">
        <button class="cancel btn">取消</button>
        <button class="ok btn">确定</button>
      </div>
    </div>`
    });
    setTimeout(function(){d.open()},10)
    var dd=d.getDialogDom();
    util.query(dd,'.content').innerText=text;
    util.query(dd,'.ok').onclick=function(){
      cb(true);
      d.close();
      setTimeout(function(){d.destory()},299);
    }
    util.query(dd,'.cancel').onclick=function(){
      cb(false);
      d.close();
      setTimeout(function(){d.destory()},299);
    }
  }
  function prompt(text,cb){
    var d=new dialog({
      content:`<div class="def_dialog">
      <h1>提示</h1>
      <div class="content">
        <p class="c"></p>
        <p><input type="text"/></p>
      </div>
      <div class="footer">
        <button class="cancel btn">取消</button>
        <button class="ok btn">确定</button>
      </div>
    </div>`
    });
    setTimeout(function(){d.open()},10)
    var dd=d.getDialogDom();
    util.query(dd,'.content .c').innerText=text;
    util.query(dd,'.ok').onclick=function(){
      cb(util.query(dd,'.content input').value);
      d.close();
      setTimeout(function(){d.destory()},299);
    }
    util.query(dd,'.cancel').onclick=function(){
      cb('');
      d.close();
      setTimeout(function(){d.destory()},299);
    }
  }

  return{
    alert,
    confirm,
    prompt
  }
})();