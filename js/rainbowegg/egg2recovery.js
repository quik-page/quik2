function init(){
    let opd=el(".ohno");
    document.body.append(opd);
    opd.css({
        "position":"fixed",
        "top":"0",
        "left":"0",
        "width":"100%",
        "height":"100%",
        "background":"#fff",
        opacity:0,
        "z-index":9999999,
        "transition":"all .3s"
    })
    function opdc(){
        opd.onclick=null;
        opd.css({
            opacity:0.6,
            "cursor":"wait",
            "box-sizing":"border-box",
            padding: "40px"
        })
        setTimeout(()=>{
            opd.css({
                transition:"none",
                opacity:1,
                background:"#00f"
            })
            setTimeout(()=>{
                toOps(opd);
            },1500);
        },3000);
    }
    opd.onclick=opdc;
}

function toOps(opd){
    opd.css({
        background:"#fff",
        cursor:"default"
    });
    opd.html(require("./egr.html"));
    opd.$(".item.a1").on("click",()=>{
        location.reload();
    })
    opd.$(".item.a2").on("click",()=>{
        delete localStorage.__quik_egg__;
        toBoot(opd);
    })
}

function toBoot(opd){
    opd.html(require("./boot.html"));
    fetch("./rbegg2-min.js?t="+Date.now()).then(r=>r.text()).then(t=>{
        localforage.setItem("qkegg2",t).then(()=>{
            opd.$("p").text("Done!").css("color","green")
            setTimeout(()=>{
                location.reload();
            },1200)
        });
        localStorage.inegg2="1";
    }).catch(e=>{
        opd.$("p").text("Something went wrong!").css("color","red");
    })
}

module.exports={
    init
}