(function(){
  var initsto=storage('link');

  if(!initsto.get('links')){
    initsto.set('links',[])
  }

  /**
   * 添加链接
   * @param {Object} option
   * @param {String} option.url
   * @param {String} option.title
   */
  function addLink(option){
    var links=initsto.get('links');
    links.push(option);
    initsto.set('links',links);
    return links.length-1;
  }

  /**
   * 获取所有链接
   * @returns Array 链接
   */
  function getLinks(){
    return initsto.get('links');
  }

  function changeLink(index,option){
    var links=initsto.get('links');
    links[index]=option;
    initsto.set('links',links);
  }
  function deleteLink(index){
    var links=initsto.get('links');
    links.splice(index,1);
    initsto.set('links',links);
  }

  function moveLink(index,to){
    var links=initsto.get('links');
    var thislink=links[index];
    links.splice(index,1);
    links.splice(to,0,thislink);
    initsto.set('links',links);
  }

  return {
    addLink:addLink,
    getLinks:getLinks,
    changeLink:changeLink,
    deleteLink:deleteLink,
    moveLink:moveLink
  }
})();