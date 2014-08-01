$( function(){
  ShieldItemManager.getList(null, function(p1, p2, shieldList){
    ShowShieldItems.all(shieldList);
  });

  OptPageActions();
});

var OptPageActions = ( function(){

  function commonActions(){
    // 重置按钮
    $('#resetBtn').on('click', function(){
      ShieldItemManager.reset();
      setTimeout( function(){ window.location.reload(); }, 300);
      return false;
    });
    // 删除按钮 浮现、消失
    $('body').on('mouseenter', '.trashItem', function(){
      $(this).find('a[name=delUserIcon]').show();
    }).on('mouseleave', '.trashItem', function(){
      $(this).find('a[name=delUserIcon]').hide();
    });
    // 删除按钮按下动作
    $('body').on('click', 'a[name=delUserIcon]', function(){
      var $item = $(this).parents('.trashItem:first');
      var type = $item.data('shield_type');
      var value = $item.data('value');
      ShieldItemManager.rmItem(type, value);
      $(this).parents('[class^="col-"]:first').fadeOut(400, function(){
        $(this).remove();
      });
      // 防止a标签锚点跳动
      return false;
    });
  }

  function addrActions(){
    var $addrTitle = $('[name=addrHeadTitle]');
    var $addrInp = $addrTitle.find('input');

    $addrTitle.on('mouseenter', function(){
      if ( $addrInp.is(':visible') ) return;
      $(this).find('a').show();
    }).on('mouseleave', function(){
      $(this).find('a').hide();
    });

    $addrTitle.find('a').on('click',function(){
      $(this).hide();
      var tmpWd = $addrInp.width();
      // 不知道为什么这个输入框在每次动画时都会损失4个长度，这里就暂且给它补充4个长度
      $addrInp.width(1).show().animate({width: tmpWd + 4});
      $addrInp.focus();
      return false;
    });

    $addrInp.on('blur', function(){
      var tmpWd = $(this).width();
      $addrInp.animate({width: 0}, function(){
        $(this).hide();
        $(this).width(tmpWd);
      });
    }).on('keyup', function(e){
      if ( e.keyCode !== 13 || !$(this).val() ) return;

      var type = $(this).data('shield_type');
      var value = $(this).val();
      $(this).val('');
      ShieldItemManager.addItem(type, value, function(resp){
        if ( !resp.result ) {
          alert('添加失败 [ ' + resp.msg + ' ]');
          return;
        }
        ShieldItemManager.getList(type, function(p1, typeList, p3){
          ShowShieldItems.addres(typeList);
        });
      });
    });
  }

  function titleActions(){
    var $titleDiv = $('[name=titleHeadTitle]');
    var $titleInp = $titleDiv.find('input');

    $titleDiv.on('mouseenter', function(){
      if ( $titleInp.is(':visible') ) return;
      $(this).find('a').show();
    }).on('mouseleave', function(){
      $(this).find('a').hide();
    });

    $titleDiv.find('a').on('click',function(){
      $(this).hide();
      var tmpWd = $titleInp.width();
      // 不知道为什么这个输入框在每次动画时都会损失4个长度，这里就暂且给它补充4个长度
      $titleInp.width(0).show().animate({width: tmpWd + 4});
      $titleInp.focus();
      return false;
    });

    $titleInp.on('blur', function(){
      var tmpWd = $titleInp.width();
      $titleInp.animate({width: 0}, function() {
        $titleInp.hide();
        $titleInp.width(tmpWd);
      });
    }).on('keyup', function(e){
      if ( e.keyCode !== 13 || !$(this).val() ) return;

      var type = $(this).data('shield_type');
      var value = $(this).val();
      $(this).val('');
      ShieldItemManager.addItem(type, value, function(resp){
        if ( !resp.result ) {
          alert('添加失败 [ ' + resp.msg + ' ]');
          return;
        }
        ShieldItemManager.getList(type, function(p1, typeList, p3){
          ShowShieldItems.titles(typeList);
        });
      });
    });
  }

  return function(){
    commonActions();
    addrActions();
    titleActions();
  }
})();

var ShowShieldItems = ( function(){

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

  function addres(addrList){
    if ( !addrList ) return;
    // 删除旧内容
    $('[name=addrItem-Normal]').remove();
    // 准备添加新内容
    var $addrModel = $('[name=addrItem-Model]');
    // 每行多少栏？
    var clOneRow = $addrModel.attr('class').match(/col-md-(\d{1,2})/)[1];
    clOneRow = 12 / parseInt(clOneRow);
    var maxLen = 25;
    addrList.forEach( function(item, idx){
      var $newAddrItem = $addrModel.clone();
      var strShow = item.length > maxLen ? item.substring(0, maxLen - 2) + '...' : item;
      $newAddrItem.attr({name: 'addrItem-Normal', title: item});
      $newAddrItem.find('.trashItem').data('value', item);
      $newAddrItem.find('.trashItem').addClass(getLabelClass(idx, clOneRow) + ' label');
      $newAddrItem.find('.trashItem > span').html(strShow);
      $newAddrItem.show();
      $addrModel.before($newAddrItem);
    });
  }

  function titles(titleList){
    if ( !titleList ) return;
    // 删除旧内容
    $('[name=titleItem-Normal]').remove();
    // 准备添加新内容
    var $titleModel = $('[name=titleItem-Model]');
    // 每行多少栏？
    var clOneRow = $titleModel.attr('class').match(/col-md-(\d{1,2})/)[1];
    clOneRow = 12 / parseInt(clOneRow);
    var maxLen = 18;
    titleList.forEach( function(item, idx){
      var $newTitleItem = $titleModel.clone();
      var strShow = item.length > maxLen ? item.substring(0, maxLen - 2) + '...' : item;
      $newTitleItem.attr({name: 'titleItem-Normal', title: item});
      $newTitleItem.find('.trashItem').data('value', item);
      $newTitleItem.find('.trashItem').addClass(getLabelClass(idx, clOneRow) + ' label');
      $newTitleItem.find('.trashItem > span').html(strShow);
      $newTitleItem.show();
      $titleModel.before($newTitleItem);
    });
  }

  return {
    all: function(list) {
      users( list[ShieldList.elemList[0]] );
      hosts( list[ShieldList.elemList[1]] );    
      addres( list[ShieldList.elemList[2]] );
      titles( list[ShieldList.elemList[3]] );
    },
    addres: addres,
    titles: titles
  }
})();
