$( function(){
  chrome.storage.sync.get( function(items){
    var shieldList = items['ShieldList'] || {};
    showShieldUsers(shieldList.users);
  });
  
  $('body').on('click', 'a[name=delUserIcon]', function(){
    var userID = $(this).parent().data('userID');
    rmItemFromList(ShieldList.elemList[0], userID);
    $(this).parents('[name=userItem-Normal]').fadeOut(400, function(){
      $(this).remove();
    });
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

function showShieldUsers(userList){
  var labelList = ['label-default', 'label-primary', 'label-success', 'label-info', 'label-warning'];
  var $userModel = $('[name=userItem-Model]');
  userList.forEach( function(item){
    var $newUserItem = $userModel.clone();
    var rdIdx = parseInt( Math.random() * labelList.length );
    $newUserItem.attr({name: 'userItem-Normal'});
    $newUserItem.find('label').addClass(labelList[rdIdx] + ' label');
    $newUserItem.find('label').prepend(item);
    $newUserItem.find('label').data('userID', item);
    $newUserItem.show();
    $userModel.after($newUserItem);
  });
}
