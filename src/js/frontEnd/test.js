var PageParams = {
  ExtID: null
};

$( function() {
  var $aLast = $('.pagetop').children('a[href="http://news.dbanotes.net/submit"]');
  var $newA = $aLast.clone();
  $newA.attr({ id: 'DNWSYA-Btn', href: 'javascript:;', style: 'color: #ff6600' });
  $newA.html(ExtNickName);
  $aLast.after('&nbsp;|&nbsp;', $newA);

  $('#DNWSYA-Btn').on('click', function(){
    var $optsPanel = $('#DNWSYA-OptsPanel');
    var status = $optsPanel.data('isFlipIn');
    if ( !!status ) { // 已经飞入，即将退入后台
      $optsPanel.animate({right: '-=185'});
    } else {          // 后台中，即将飞入
      $optsPanel.animate({right: '+=185'}, {duration: 500, easing: 'easeOutBounce'});
    }
    $optsPanel.data('isFlipIn', !status);
  });
  
  $(document).on('dblclick', function(){
    $('#DNWSYA-Btn').trigger('click');
  });

  chrome.runtime.sendMessage({type: 'DNWSYA:Request:InitData:TabPage'}, function(response) {
    PageParams.ExtID = response.ExtID;
    PageParams.ExtHost = 'chrome-extension://' + PageParams.ExtID;
    insertDom();
    FilterContent(response.shieldList);
  });
});

function insertDom() {
  $('body').append('<div id="DNWSYA-Container"></div>');
  var host = PageParams.ExtHost;

  var resList = [
    host + '/html/frontEnd/optionPanel.html' // 选项面板
  ];
  for(var x = 0; x < resList.length; x++){
    $('#DNWSYA-Container').load(resList[x]);
  }
}

var FilterContent = ( function(){
  
  var slt = {
    user: 'td.subtext > a[href^="user?id="]'
  };
  
  function trashBtnShow() {
    if ( $('#DNWSYA-trashBtn').length > 0 ) {
      return;
    }

    var iconClass = {
      see : 'glyphicon glyphicon-eye-open',
      hide: 'glyphicon glyphicon-eye-close'
    }
    var $moreBtn = $('.title > a[href^="/x?fnid="]');
    $moreBtn.after('&nbsp;', '<a href="#" id="DNWSYA-trashBtn"></a>');
    var $trashBtn = $('#DNWSYA-trashBtn');
    $trashBtn.css({'color': '#828282', 'margin-left': '600px'});
    $trashBtn.html('<span></span>');
    $trashBtn.find('span').addClass(iconClass.see);
    $trashBtn.on('click', function(){
      var isOpen = $(this).data('isOpen');
      if ( !!isOpen ) {
        $moreBtn.parents('tr:first').nextAll().hide();
        $(this).find('span').removeClass().addClass(iconClass.see);
      } else {
        $moreBtn.parents('tr:first').nextAll().show();
        $(this).find('span').removeClass().addClass(iconClass.hide);
      }
      $(this).data('isOpen', !isOpen);
    });
  }

  function appendTrashItem(item) {
    var $moreBtnRow = $('.title > a[href^="/x?fnid="]').parents('tr:first');
    var count = $moreBtnRow.data('count') || 1;
    var trashItemList = $moreBtnRow.data('trashItemList') || [].slice(0);
    // 已存在的就不再添加
    if ( trashItemList.indexOf(item.id) > -1 ) {
      return;
    }
    
    var $trashItem = $moreBtnRow.clone();
    $trashItem.find('td:first').html(count);
    $trashItem.find('td.title').html('');
    $trashItem.find('td.title').append('<a name="title"></a>');
    $trashItem.find('td.title').append('<a name="author"></a>');
    $trashItem.find('a[name=title]').attr('href', item.link).html(item.title);
    $trashItem.find('a[name=author]').attr('href', '/user?id=' + item.author).html(' @' + item.author);
    $trashItem.find('a').css('color', '#828282');
    $trashItem.hide();

    var $insertBaseRow = $moreBtnRow.next().length ? $moreBtnRow.siblings(':last') : $moreBtnRow;
    $insertBaseRow.after($trashItem);
    $insertBaseRow.after('<tr style="height: 6px; display: none;"></tr>');

    $moreBtnRow.data('count', ++count);
    trashItemList.push(item.id);
    $moreBtnRow.data('trashItemList', trashItemList);
  }

  function filterUser(userList) {
    var foundList = [].slice(0);
    // 找到项
    $(slt.user).each( function(idx) {
      var userID = $(this).html().trim();
      if ( userList.indexOf(userID) > -1) {
        foundList.push(this);
      }
    });

    // 暂存项后删除项
    foundList.forEach( function(item){
      var $userLink = $(item);
      var $userRow = $userLink.parents('tr:first');
      var $contentLink = $userRow.prev().find('.title > a');
      
      $userRow.hide().prev().hide().prev().hide();
      
      // 把即将删除的内容储存起来
      var trashItem = {
        id    : $userLink.prev().prop('id').replace('score_', ''),
        link  : $contentLink.attr('href'),
        title : $contentLink.html(),
        author: $userLink.html()
      };
      setTimeout( function(){
        $userRow.prev().remove();
        $userRow.prev().remove();
        $userRow.remove();
        appendTrashItem(trashItem);
      }, 1000);
    });
    // 返回删除个数
    return foundList.length;
  }

  return function(list){
    var count = 0;
    count += filterUser(list.users);
    if ( count > 0 ) {
      trashBtnShow();
    }
    //filterWebsite(list.webSites);
  }
})();
