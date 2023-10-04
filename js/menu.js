(function(){
  /**
   * @class contextMenu
   * @param {Object} options 
   * @param {{icon:String,title:String,click:Function}[]} options.list
   * @param {{top?:Number,left?:Number,bottom?:Number,right?:Number}} options.offset 位置
   */
  var contextMenu=function(options){
    this.options=options;
    var el=util.element('div',{
      class:"contextMenu",
    });
    if(options.offset){
      el.style.top=options.offset.top+"px";
      el.style.left=options.offset.left+"px";
      el.style.bottom=options.offset.bottom+"px";
      el.style.right=options.offset.right+"px";
    }

    options.list.forEach(function(itemr){
      var item=util.element('div',{
        class:"item"
      });
      item.innerHTML=`<div class="icon">${itemr.icon}</div><div class="title">${itemr.title}</div>`;
      item.onclick=function(){
        itemr.click();
      }
      el.appendChild(item);
    })

    document.body.appendChild(el);
    this.element=el;
  }

  contextMenu.prototype={
    show:function(){
      this.element.classList.add('show');
      this.element.style.height='auto';
      var h=this.element.getBoundingClientRect().height;
      this.element.style.height='0px';
      this.element.style.transition='height .2s';
      var _this=this;
      setTimeout(function(){
        _this.element.style.height=h+'px';
      })
    },
    hide:function(){
      this.element.style.height='0px';
      var _this=this;
      setTimeout(function(){
        _this.element.style.transition='none';
        _this.element.classList.remove('show');
      },200)
    },
    isShow:function(){
      return this.element.classList.contains('show');
    },
    destory:function(){
      this.element.remove();
    },
    setOffset:function(offset){
      this.options.offset=offset;
      var options=this.options,el=this.element;
      if(options.offset){
        el.style.top=options.offset.top+"px";
        el.style.left=options.offset.left+"px";
        el.style.bottom=options.offset.bottom+"px";
        el.style.right=options.offset.right+"px";
      }
    },
    setList:function(list){
      this.options.list=list;
      var options=this.options,el=this.element;
      el.innerHTML="";
      options.list.forEach(function(itemr){
        var item=util.element('div',{
          class:"item"
        });
        item.innerHTML=`<div class="icon">${itemr.icon}</div><div class="title">${itemr.title}</div>`;
        item.onclick=function(){
          itemr.click();
        }
        el.appendChild(item);
      })
    }
  };

  document.addEventListener('click',function(){
    document.querySelectorAll(".contextMenu").forEach(function(e){
      e.style.height='0px';
      setTimeout(function(){
        e.style.transition='none';
        e.classList.remove('show');
      },200)
    })
  })

  return {
    contextMenu:contextMenu
  }
})();