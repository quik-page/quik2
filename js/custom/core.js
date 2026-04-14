const getEventHandle = require("../event");
const { settingStp } = require("../setting/index");

let stp=settingStp;
var eventHandle=getEventHandle();
var on=eventHandle.on;
var off=eventHandle.off;
var doevent=eventHandle.doevent;

module.exports={
    stp,
    on,
    off,
    doevent
}