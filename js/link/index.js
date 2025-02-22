var {initsto}=require('./_core');
var util=require('../util');
var link=require('./_link');
var ui=require('./ui.js');
link.on('change',function(e){
  initsto.websync(e);
});
module.exports=util.joinObj(link,ui);