function api(bgf,data){
  function showAcgOrFj(a){
    refreshApiIcon.show();
    refreshApiIcon.getIcon().classList.add('round-anim');
    a.getImg((d)=>{
      refreshApiIcon.getIcon().classList.remove('round-anim');
      draws.img(bgf,{
        url:d.url
      });
      if(d.candownload){
        downloadIcon.show();
      }
    })
    refreshFn=()=>{
      refreshApiIcon.getIcon().classList.add('round-anim');
      a.getImg((d)=>{
        refreshApiIcon.getIcon().classList.remove('round-anim');
        draws.img(bgf,{
          url:d.url
        });
        if(d.candownload){
          downloadIcon.show();
        }
      })
    }
  }
  switch (data.api){
    case 'acg':
      showAcgOrFj(acgbg);
    break;
    case 'fj':
      showAcgOrFj(fjbg);
    break;
    case 'bing':
      draws.img(bgf,{
        url:"https://bing.shangzhenyang.com/api/1080p"
      });
      downloadIcon.show();
      infoIcon.show();
    break;
    case 'time':
      // at ../defaultDrawer.js dot-timeb
      timeb=setInterval(()=>{
        draws.color(bgf,getNowColor());
      },200)
    break;
  }
}