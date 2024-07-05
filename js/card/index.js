(function(){
  var cardcon=util.query(document,'.cards');

  /**
   * 
   * @param {object} detail 
   * @param {string} detail.content
   * @param {number} detail.width
   * @param {number} detail.height
   * @param {string} detail.class?
   * @param {object} detail.offset
   * @param {number} detail.offset.top?
   * @param {number} detail.offset.left?
   * @param {number} detail.offset.bottom?
   * @param {number} detail.offset.right?
   */
  var card=function(detail){
    this.width=detail.width;
    this.height=detail.height;
    this.offset=detail.offset;
    var c_el=util.element('div',{
      class:"card",
    })

    c_el.innerHTML=detail.content;
    c_el.style.width=detail.width+"px";
    c_el.style.height=detail.height+"px";
    if(detail.class){
      c_el.classList.add(detail.class);
    }

    if(detail.offset){
      if(typeof detail.offset.top=='number'){
        c_el.style.top=detail.offset.top+"px";
      }else if(typeof detail.offset.bottom=='number'){
        c_el.style.bottom=detail.offset.bottom+"px";
      }
      if(typeof detail.offset.left=='number'){
        c_el.style.left=detail.offset.left+"px";
      }else if(typeof detail.offset.right=='number'){
        c_el.style.right=detail.offset.right+"px";
      }
    }
    this.el=c_el;
    cardcon.appendChild(c_el);
    this.isShow=false;
  }

  card.prototype={
    show:function(transition){
      var _=this;
      _.isShow=true;
      this.el.style.display='block';
      if(transition&&transition>0){
        this.el.style.transition='all '+transition+'ms';
        this.el.offsetHeight;
        setTimeout(function(){
          _.el.style.transition='none';
        },transition);
      }
      this.el.style.opacity='1';
    },
    hide:function(transition){
      var _=this;
      _.isShow=false;
      if(transition&&transition>0){
        this.el.style.transition='all '+transition+'ms';
        setTimeout(function(){
          _.el.style.transition='none';
          _.el.style.display='none';
        },transition);
      }else{
        this.el.style.display='none';
      }
      this.el.style.opacity='0';
    },
    destroy:function(){
      this.el.remove();
    },
    getCardDom:function(){
      return this.el;
    },
    getOffset:function(){
      return this.offset;
    },
    getWidth:function(){
      return this.width;
    },
    getHeight:function(){
      return this.height;
    },
    setWidth:function(width){
      this.width=width;
      this.el.style.width=width+'px';
    },
    setHeight:function(height){
      this.el.style.height=height+'px';
    },
    setOffset:function(offset,transition){
      var _=this;
      this.offset=offset;
      if(transition&&transition>0){
        this.el.style.transition='all '+transition+'ms';
        setTimeout(function(){
          _.el.style.transition='none';
        },transition);
      }
      this.el.style.top='auto';
      this.el.style.left='auto';
      this.el.style.bottom='auto';
      this.el.style.right='auto';
      if(typeof offset.top=='number'){
        this.el.style.top=offset.top+"px";
      }else if(typeof offset.bottom=='number'){
        this.el.style.bottom=offset.bottom+"px";
      }
      if(typeof offset.left=='number'){
        this.el.style.left=offset.left+"px";
      }else if(typeof offset.right=='number'){
        this.el.style.right=offset.right+"px";
      }
      
    }
  }
  return card;
})();