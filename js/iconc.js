(function(){
  var icners={
    tl:util.query(document,'.topper .left'),
    tr:util.query(document,'.topper .right'),
    bl:util.query(document,'.bottomer .left'),
    br:util.query(document,'.bottomer .right'),
  }

  /**
   * @class icon
   * @param {Object} options 
   * @param {String} options.content
   * @param {String} options.class?
   * @param {Number} options.width?
   * @param {'tl'|'tr'|'bl'|'br'} options.offset
   */
  var icon=function(options){
    this.content=options.content;
    this.width=options.width;
    var ic=util.element('div',{
      class:"item"+(options.class?(' '+options.class):''),
    });
    icners[options.offset].append(ic);
    ic.innerHTML=this.content;
    this.element=ic;
    if(this.width){
      ic.style.width=this.width+'px';
    }
  }
  icon.prototype={
    getIcon:function(){
      return this.element;
    },
    setIcon:function(content){
      this.content=content;
      this.element.innerHTML=this.content;
    },
    setWidth:function(w){
      this.width=w;
      if(this.width){
        ic.style.width=this.width+'px';
      }
    },
    getWidth:function(){
      return this.width;
    },
    show:function(){
      this.element.style.display='block';
    },
    hide:function(){
      this.element.style.display='none';
    }
  }
  return {
    icon:icon,
  }
})()