$( function(){
  chrome.storage.sync.get( function(items){
    var shieldList = items['ShieldList'] || {};
    showShieldUsers(shieldList.users);
  });
  
  $('body').on('click', 'a[name=delUserIcon]', function(){
    var userID = $(this).parent().data('userID');
    console.log(userID);
    rmItemFromList('users', userID);
  });
});

function rmItemFromList(type, value) {
  chrome.storage.sync.get( function(items){
    var shieldList = items['ShieldList'] || {};
    var tmpList = shieldList[type];
    var idx = tmpList.indexOf(value);
    
    if ( idx === - 1 ) return;
    
    tmpList.splice(idx, 1);
    shieldList[type] = tmpList;
    chrome.storage.sync.set({'ShieldList': shieldList});
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
