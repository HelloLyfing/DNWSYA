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

  var labelList = ['label-default', 'label-primary', 'label-success', 'label-info', 'label-warning'];
  
  function users(userList){
    if ( !userList ) return;

    var $userModel = $('[name=userItem-Model]');
    userList.forEach( function(item){
      var $newUserItem = $userModel.clone();
      var rdIdx = parseInt( Math.random() * labelList.length );
      $newUserItem.attr({name: 'userItem-Normal'});
      $newUserItem.find('.trashItem').addClass(labelList[rdIdx] + ' label');
      $newUserItem.find('.trashItem > span').html(item);
      $newUserItem.find('.trashItem').data('value', item);
      $newUserItem.show();
      $userModel.before($newUserItem);
    });
  }

  function hosts(hostList){
    if ( !hostList ) return;
    
    var $hostModel = $('[name=hostItem-Model]');
    hostList.forEach( function(item){
      var $newHostItem = $hostModel.clone();
      var rdIdx = parseInt( Math.random() * labelList.length );
      $newHostItem.attr({name: 'hostItem-Normal'});
      $newHostItem.find('label').addClass(labelList[rdIdx] + ' label');
      $newHostItem.find('label').prepend(item);
      $newHostItem.find('label').data('value', item);
      $newHostItem.show();
      $hostModel.before($newHostItem);
    });
  }

  return function(list){
    users( list[ShieldList.elemList[0]] );
    hosts( list[ShieldList.elemList[1]] );
  } 
})();

