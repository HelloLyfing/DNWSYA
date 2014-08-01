$( function(){
  chrome.storage.sync.get( function(items){
    var shieldList = items['ShieldList'] || {};
    showShieldItems(shieldList);
  });
  
  $('body').on('mouseenter', '.trashItem', function(){
    $(this).find('a[name=delUserIcon]').show();
  }).on('mouseleave', '.trashItem', function(){
    $(this).find('a[name=delUserIcon]').hide();
  });

  $('body').on('click', 'a[name=delUserIcon]', function(){
    var $item = $(this).parents('.trashItem:first');
    var value = $item.data('value');
    var shieldType = $item.data('shield_type');
    rmItemFromList(shieldType, value);
    $(this).parents('[class^="col-"]:first').fadeOut(400, function(){
      $(this).remove();
    });
    // 防止a标签锚点跳动
    return false;
  });
});

function rmItemFromList(type, value) {
  chrome.storage.sync.get( function(items){
    var shieldList = items[ShieldList.key] || {};
    var typeList = shieldList[type];
    var idx = typeList.indexOf(value);
    
    if ( idx === - 1 ) return;
    
    typeList.splice(idx, 1);
    shieldList[type] = typeList;
    var setObj = {}; setObj[ShieldList.key] = shieldList;
    chrome.storage.sync.set(setObj);
  });
}

var showShieldItems = ( function(){

  var labelList = ['label-success', 'label-info'];
  
  function getLabelClass(idx, column){
    var labelIdx = parseInt(idx / column % 2);
    return labelList[labelIdx];
  }

  function users(userList){
    if ( !userList ) return;

    var $userModel = $('[name=userItem-Model]');
    
    var clOneRow = $userModel.attr('class').match(/col-md-(\d{1,2})/)[1];
    clOneRow = 12 / parseInt(clOneRow);
    var maxLen = 10;
    userList.forEach( function(item, idx){
      var $newUserItem = $userModel.clone();
      var strShow = item.length > maxLen ? item.substring(0, maxLen - 2) + '...' : item;
      $newUserItem.attr({name: 'userItem-Normal', title: item});
      $newUserItem.find('.trashItem').data('value', item);
      $newUserItem.find('.trashItem').addClass(getLabelClass(idx, clOneRow) + ' label');
      $newUserItem.find('.trashItem > span').html(strShow);
      $newUserItem.show();
      $userModel.before($newUserItem);
    });
  }

  function hosts(hostList){
    if ( !hostList ) return;
    
    var $hostModel = $('[name=hostItem-Model]');
    // 每行多少栏？
    var clOneRow = $hostModel.attr('class').match(/col-md-(\d{1,2})/)[1];
    clOneRow = 12 / parseInt(clOneRow);
    var maxLen = 17;
    hostList.forEach( function(item, idx){
      var $newHostItem = $hostModel.clone();
      var strShow = item.length > maxLen ? item.substring(0, maxLen - 2) + '...' : item;
      $newHostItem.attr({name: 'hostItem-Normal', title: item});
      $newHostItem.find('.trashItem').data('value', item);
      $newHostItem.find('.trashItem').addClass(getLabelClass(idx, clOneRow) + ' label');
      $newHostItem.find('.trashItem > span').html(strShow);
      $newHostItem.show();
      $hostModel.before($newHostItem);
    });
  }

  return function(list){
    users( list[ShieldList.elemList[0]] );
    hosts( list[ShieldList.elemList[1]] );
  } 
})();

