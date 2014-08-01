chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  // 只监听从conten script发来的信息
  if ( !sender.tab ) return;
  
  var activeTab = sender.tab;
  var evData = request.evData;
  switch(request.type) {
  case 'DNWSYA:Request:InitData:TabPage':
    ShieldItemManager.getList(null, function(p1, p2, shieldList){
      var resp = {
        ExtID     : chrome.runtime.id,
        shieldList: shieldList
      };
      sendResponse(resp);
    });
  break;
  case 'DNWSYA:Request:NewTab:TabPage':
    chrome.tabs.create({url: evData.url, index: (activeTab.index + 1)});
  break;
  case 'DNWSYA:Request:GetNewShieldItem:TabPage':
    chrome.storage.sync.get( function(items) {
      var shieldList = items[ShieldList.key] || {};
      
      var typeList = shieldList[ evData.type ];
      if ( !Array.isArray(typeList) ) typeList = [];
      // 只有未添加过的才会被添加
      if ( typeList.indexOf(evData.value) === -1 ) {
        typeList.push(evData.value);
      }
      shieldList[ evData.type ] = typeList;

      var setObj = {}; setObj[ShieldList.key] = shieldList;
      chrome.storage.sync.set(setObj);
      var resp = {
        result: true,
        evData: {shieldList: shieldList}
      };
      sendResponse(resp);
    });
  break;
  } // end switch
  // 有异步调用sendResponse，所以此处返回true，详见：http://bit.ly/1kfXLWR
  return true;
});
