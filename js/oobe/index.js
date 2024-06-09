(function(){
    var initsto=storage('oobe');
    if(!initsto.get('agree')){
    var lichtml=ignores.lic;
    var i=0;
    var all=_REQUIRE_('./htmls/all.html');
    var parts=[_REQUIRE_('./htmls/part1.html'),_REQUIRE_('./htmls/part2.html')]
    parts.forEach(function(a,i){
        all=all.replace('{{part'+(i+1)+'}}',a);
    })
    all=all.replace('{{lic}}',lichtml);
    var oobeDia=new dialog({
        content:all,
        class:'oobedia',
        mobileShowtype:dialog.SHOW_TYPE_FULLSCREEN
    })
    var d=oobeDia.getDialogDom();

    util.query(d,'.part.a1 .btn.ok').onclick=function(){
        initsto.set('agree',true);
        nextPart();
    }

    util.query(d,'.part.a1 .btn.cancel').onclick=function(){
        location.href='about:blank'
    }
    util.query(d,'.part.a2 .item.a').onclick=function(){
        nextPart();
    }
    util.query(d,'.part.a2 .item.b').onclick=function(){
        nextPart();
        sync.openImport();
    }

    function nextPart(){
        if(i>0){
            util.query(d,'.part.a'+i).classList.remove('show');
            util.query(d,'.part.a'+i).classList.add('n');
        }
        if(i==parts.length){
            oobeDia.close();
            return;
        }
        i++;
        setTimeout(function() {
            util.query(d,'.part.a'+i).classList.add('show');  
        }, 200);
    }
    nextPart();
    oobeDia.open();
}
})()