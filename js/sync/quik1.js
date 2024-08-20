(()=>{
    var quik1si=new SettingItem({
        title: "QUIK 1",
        message: "从 QUIK 1 中导入数据",
        type: "null",
        callback: openQUIK1Helper
    })

    sg.addNewItem(quik1si);

    function openQUIK1Helper(){
        var d=new dialog({
            content:"正在加载模块..."
        })   
        d.open();
        var s=util.element('script',{
            src:"./quik1.js"
        })
        document.body.append(s);
        window.quik1to2=(f)=>{
            window.quik1to2=null;
            f(_importData);
            d.close();
        }
    }
    
    return openQUIK1Helper;
})();