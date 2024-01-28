(function () {
  _REQUIRE_('./_core.js');
  var link;
  if (storage.checkIDB()) {
    // 支持数据库
    link=_REQUIRE_('./_db.js');
  } else {
    // 不支持数据库，使用localStorage
    link=_REQUIRE_('./_localstorage.js');
  }
  _REQUIRE_('./ui.js')
  return link;
})();