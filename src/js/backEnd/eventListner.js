chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  // 只监听从conten script发来的信息
  if ( !sender.tab ) return;
  
  var activeTab = sender.tab;
  var evData = request.evData;
  switch(request.type) {
    case 'DNWSYA:Request:InitData:TabPage':
      chrome.storage.sync.get( function(items){
        var shieldList = items[ShieldList.key] || {};
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
      chrome.storage.sync.get( function(items){
        var tmpList = items[ShieldList.key] || {};
        switch(evData.type){
          case ShieldList.elemList[0]:
            var userList = tmpList[ ShieldList.elemList[0] ];
            if ( !Array.isArray(userList) ) userList = [];
            if ( userList.indexOf(evData.value) === -1 ) {
              userList.push(evData.value);
            }
            tmpList[ ShieldList.elemList[0] ] = userList;
          break;
        }
        var setObj = {}; setObj[ShieldList.key] = tmpList;
        chrome.storage.sync.set(setObj);
        var resp = {
          result: true,
          evData: {list: tmpList}
        };
        sendResponse(resp);
      });
    break;
  } // end switch
  // 有异步调用sendResponse，所以此处返回true，详见：https://developer.chrome.com/extensions/runtime#event-onMessage
  return true;
});
