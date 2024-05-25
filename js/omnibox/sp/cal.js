core.addNewSA({
    check:function(text){
        return text[0]=='='
    },
    get:function(text,getsa){
      var a=getsa();
      try{
          text=text.substr(1);
          if(!text) return;
          var e=Math.E;
          var PI=Math.PI;
          var ln=Math.log;
          var lg=Math.log10;
          var sin=Math.sin;
          var cos=Math.cos;
          var tan=Math.tan;
          var asin=Math.asin;
          var acos=Math.acos;
          var atan=Math.atan;
          var sqrt=Math.sqrt;
          var abs=Math.abs;
          text=text.replaceAll('^','**')
          .replaceAll('π','PI')
          .replaceAll('[','(')
          .replaceAll(']',')')
          .replaceAll('{','(')
          .replaceAll('}',')');
          var result=eval(text);
          a.unshift({
              icon:util.getGoogleIcon('ea5f'),
              text:result,
              click:function(){
                  ui.setValue(result);
              }
          });
      }catch(e){}
      
      r(a);
    }
  });