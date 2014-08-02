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
    ShieldItemManager.getList(null, function(p1, p2, shieldList){
    ShieldItemManager.addItem(evData.type, evData.value, function(resp){
      var respData = {};
      if ( !!resp.result ) { // 添加屏蔽内容成功
        respData.result = true;
        respData.evData = {shieldList: resp.data.shieldList};
      } else {               // 添加内容失败
        respData.result = false;
      }
      sendResponse(respData);
    });
    });
  break;
  } // end switch
  // 有异步调用sendResponse，所以此处返回true，详见：http://bit.ly/1kfXLWR
  return true;
});
