/*QUIK_ADDON 1|Storage Test|2|2.0|For Storage Test|siquan|https://siquan001.github.io/favicon.ico|https://siquan001.github.io/|/test/stup.txt|siquan.sttest */

console.log(addonData.session);
console.log('st');

var initsto=quik.storage('st_test',{
    title:"插件存储测试",
    desc:"用于测试",
    addon:"/test/st.js",
    sync:true
});

initsto.set('test','test');