var ShieldItemManager = ( function() {

  /**
   * 清空所有内容
   * @param  {Function}(可选) callback fn() 无参数
   */
  function reset(callback) {
    chrome.storage.sync.clear( function(){
      if ( !!callback ) callback();
    });
  }

  /**
   * 获取某个列表（如用户的）
   * @param  {[string]} type 列表的键索引(例如'users')
   * @param  {Function} callback fn(type, typeList, shieldList);
   */
  function getList(type, callback) {
    chrome.storage.sync.get( function(items) {
      var shieldList = items[ShieldList.key] || {};
      // 不指定type时，返回整个list
      if ( typeof(type) !== 'string' || !type ) {
        callback(null, null, shieldList);
        return;
      }
      // 指定type
      var typeList = shieldList[type] || [].slice(0);
      callback(type, typeList, shieldList);
    });
  }

  function addIntoList(type, value, callback) {
    getList(type, function(type, typeList, shieldList) {
      var resp = {};
      // 有可能已存在
      if ( typeList.indexOf(value) > -1 ) {
        resp.result = false;
        resp.msg = '项已存在';
        callback(resp);
        return;
      }
      // 开始添加新内容
      typeList.push(value);
      shieldList[type] = typeList;

      var setObj = {}; 
      setObj[ShieldList.key] = shieldList;
      chrome.storage.sync.set(setObj, function(){
        resp.result = true;
        callback(resp);
      });
    });
  }

  function rmFromList(type, value, callback) {
    getList(type, function(type, typeList, shieldList) {
      var resp = {};
      var idx = typeList.indexOf(value);
      // 没有找到项
      if ( idx === - 1 ) {
        resp.result = false;
        resp.msg = '项不存在';
        callback(resp);
        return;
      }
      // 找到项，准备移除    
      typeList.splice(idx, 1);
      shieldList[type] = typeList;
      // 保存
      var setObj = {}; 
      setObj[ShieldList.key] = shieldList;
      chrome.storage.sync.set(setObj, function(){
        resp.result = true;
        callback(resp);
      });
    });
  }

  return {
    reset  : reset,
    getList: getList,
    addItem: addIntoList,
    rmItem : rmFromList
  }
})();
