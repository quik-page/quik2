var initsto = storage('link',{
  sync:true
});

  var eventfns={
    change:[]
  };
  function pushLink(detail, ob) {
    var link = {
      title: detail.title,
      url: detail.url
    }
    if (typeof detail.index=='number' && detail.index >= 0) {
      if (detail.index > ob.length) {
        console.warn('添加链接时，index超出范围，应在0-' + ob.length + '之间');
        ob.push(link);
      } else {
        ob.splice(detail.index, 0, link);
      }
    } else {
      ob.push(link);
    }
    return ob;
  }

  function writeLink(index, detail, ob) {
    if (!ob[index]) {
      return false;
    }
    var link = {
      title: detail.title,
      url: detail.url
    }
    ob[index] = link;
    if (typeof detail.index=='number'&& detail.index >= 0) {
      if (detail.index >= ob.length) {
        console.warn('添加链接时，index超出范围，应在0-' + (ob.length-1) + '之间');
      }else{
        var linkb = ob.splice(index, 1)[0];
        ob.splice(detail.index, 0, linkb);
      }
    }
    return ob;
  }

  function limitURL(detail) {
    if (detail.url.length > 1000) {
      return 'url';
    } else if (detail.title.length > 60) {
      return 'title';
    }
    return false;
  }