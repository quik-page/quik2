(()=>{
  var colorchanger,colorchangerf;
  function drawColorDialog(){
    // 自定义颜色修改对话框
    colorchanger=new dialog({
      content:_REQUIRE_('../htmls/colorchanger.html')
    });
    // @note 将cancel按钮修改为div，防止表单submit到cancel
    // @edit at 2024/1/30 15:20

    // Dom
    colorchangerf=colorchanger.getDialogDom();
    // 取消
    util.query(colorchangerf,'.cancel').onclick=function(e){
      e.preventDefault();
      colorchanger.close();
    }
    // 提交
    util.query(colorchangerf,'form').onsubmit=function(e){
      e.preventDefault();
      var lightc=util.query(colorchangerf,'.lightbgcolor').value;
      var darkc=util.query(colorchangerf,'.darkbgcolor').value;
      initsto.set('color',{
        light:lightc,
        dark:darkc
      });
      util.query(tab2,'.zdy .color-left').style.backgroundColor=lightc;
      util.query(tab2,'.zdy .color-right').style.backgroundColor=darkc;
      colorchanger.close();

      setbg({
        type:"default",
        data:{
          type:"color",
          light:lightc,
          dark:darkc
        }
      })
    }
  }
  

  function colorChange(){
    if(!colorchanger){
      drawColorDialog();
      setTimeout(()=>{
        colorchanger.open();
      },10)
    }else{
      colorchanger.open();
    }

    var c=initsto.get('usercolor');
    util.query(colorchangerf,'.lightbgcolor').value=c.light;
    util.query(colorchangerf,'.darkbgcolor').value=c.dark;
  }

  return {colorChange};
})();

