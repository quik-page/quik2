(function(){
  var base=`<div class="def_dialog"><h1>提示</h1><div class="content">$0</div><div class="footer">$1<button class="ok btn">确定</button></div></div>`
  function alert(text,cb){
    var d=new dialog({
      content:base.replace('$0','').replace('$1','')
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
      content:base.replace('$0','').replace('$1','<button class="cancel btn">取消</button>')
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
      content:base.replace('$0','<p class="c"></p><p><input type="text"/></p>').replace('$1','<button class="cancel btn">取消</button>')
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