chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  // 只监听从conten script发来的信息
  if ( !sender.tab ) return;
  
  var activeTab = sender.tab;
  var evData = request.evData;
  switch(request.type) {
    case 'DNWSYA:Request:InitData:TabPage':
      chrome.storage.sync.get( function(items){
        var shieldList = items['ShieldList'] || {};
        var resp = {
          ExtID     : chrome.runtime.id,
          shieldList: shieldList
        };
        sendResponse(resp);
      });
    break;
    case 'DNWSYA:Request:GetNewShieldItem:TabPage':
      chrome.storage.sync.get( function(items){
        var list = items['ShieldList'] || {};
        switch(evData.type){
          case 'user':
            if ( !Array.isArray(list.users) ) list.users = [];
            if ( list.users.indexOf(evData.value) === -1 ) {
              list.users.push(evData.value);
            }
          break;
        }
        chrome.storage.sync.set({'ShieldList': list});
        var resp = {
          result: true,
          evData: {list: list}
        };
        sendResponse(resp);
      });
    break;
  } // end switch
  // 有异步调用sendResponse，所以此处返回true，详见：https://developer.chrome.com/extensions/runtime#event-onMessage
  return true;
});
