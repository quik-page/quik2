const {storage,gS} = require("../storage");

var initsto=storage('setting',{
    title:"设置",
    desc:"QUIK起始页的各项设置",
    sync:true
  })

let stp=gS().setting;

module.exports={
    initsto,
    stp
};