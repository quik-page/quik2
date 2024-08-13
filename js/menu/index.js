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
    drawList(options.list,el);
    document.body.appendChild(el);
    this.element=el;
  }

  function drawList(list,el){
    list.forEach(function(itemr){
      if(itemr.type=='hr'){
        var item=util.element('div',{
          class:"hr"
        });
        el.appendChild(item);
      }else{
        var item=util.element('div',{
          class:"item"
        });
        item.innerHTML=`<div class="icon">${itemr.icon}</div><div class="title">${itemr.title}</div>`;
        item.onclick=function(){
          itemr.click();
        }
        el.appendChild(item);
      }
      
    })
  }

  contextMenu.prototype={
    show:function(){
      resetmenu(this.element);
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
    destroy:function(){
      this.element.remove();
    },
    setOffset:function(offset){
      this.options.offset=offset;
      var options=this.options,el=this.element;
      el.style.top="";
      el.style.left="";
      el.style.bottom="";
      el.style.right="";
      if(options.offset){
        if(typeof options.offset.top=='number'){
          el.style.top=options.offset.top+"px";
        }else{
          el.style.bottom=options.offset.bottom+"px";
        }
        if(typeof options.offset.left=='number'){
          el.style.left=options.offset.left+"px";
        }else{
          el.style.right=options.offset.right+"px";
        }
      }
    },
    setList:function(list){
      this.options.list=list;
      var el=this.element;
      el.innerHTML="";
      drawList(list,el);
    }
  };

  document.addEventListener('click',function(){
    resetmenu();
  });
  document.addEventListener('contextmenu',function(){
    resetmenu();
  });
  function resetmenu(el){
    document.querySelectorAll(".contextMenu").forEach(function(e){
      if(el&&e.isSameNode(el))return;
      e.style.height='0px';
      setTimeout(function(){
        e.style.transition='none';
        e.classList.remove('show');
      },200)
    })
  }

  return contextMenu;
})();