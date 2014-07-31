$( function() {
  DomHelper.initMainBtn();
  // request init data from Ext-backEnd
  chrome.runtime.sendMessage({type: 'DNWSYA:Request:InitData:TabPage'}, function(response) {
    PageParams.ExtID = response.ExtID;
    PageParams.ExtHost = 'chrome-extension://' + PageParams.ExtID;
    DomHelper.insertExtDom();
    FilterContent(response.shieldList);
  });
});

var DomHelper = ( function(){
  
  function insertExtDom() {
    $('body').append('<div id="' + DNWSYASlt.extDomCont.replace('#', '') + '"></div>');
    
    var ExtHost = PageParams.ExtHost;
    var resList = [
      ExtHost + '/html/frontEnd/trashPanel.html',  // 选项面板
      ExtHost + '/html/frontEnd/oneTrashRow.html'  // 
    ];
    for(var x = 0; x < resList.length; x++){
      $.get(resList[x], function(data){
        $(DNWSYASlt.extDomCont).append(data);
      });
    }
  }

  function mainBtnInsert(){
    var $aLast = $('.pagetop').children('a[href="http://news.dbanotes.net/submit"]');
    var $newA = $aLast.clone();
    $newA.attr({ 
      id   : DNWSYASlt.mainBtn.replace('#', ''),
      href : 'javascript:;',
      style: 'color: #ff6600'
    });
    $newA.html(ExtNickName);
    $aLast.after('&nbsp;|&nbsp;', $newA);
  }

  function mainBtnAttachHandler() {
    $(DNWSYASlt.mainBtn).on('click', function(){
      // viewPort width
      var vpWidth = document.documentElement.clientWidth;
      // body width
      var bodyWdith = document.body.children[0].clientWidth;
      // flipIn distance
      var flipDist = (vpWidth - bodyWdith) / 2 - 5;
      
      var status = $(DNWSYASlt.optsPanel).data('isFlipIn');
      if ( !!status ) { // 已经飞入，即将退入后台
        $(DNWSYASlt.optsPanel).animate({right: '-=' + flipDist});
      } else {          // 后台中，即将飞入
        $(DNWSYASlt.optsPanel).animate({right: '+=' + flipDist}, {duration: 500, easing: 'easeOutBounce'});
      }
      $(DNWSYASlt.optsPanel).data('isFlipIn', !status);
    });

    $(document).on('dblclick', function(){
      $(DNWSYASlt.mainBtn).trigger('click');
    });
  }

  return {
    initMainBtn: function(){
      mainBtnInsert();
      mainBtnAttachHandler();
    },

    insertExtDom: insertExtDom
  }
})();

var FilterContent = ( function(){
  
  var WhyShieldType = ['USER', 'HOST', 'ADDRESSS', 'TITLE'];

  function addTrashBtn() {
    if ( $('#DNWSYA-trashBtn').length > 0 ) {
      return;
    }

    var iconClass = {
      see : 'glyphicon glyphicon-eye-open',
      hide: 'glyphicon glyphicon-eye-close'
    };

    var $moreBtn = $(DNWSYASlt.moreBtn);
    $moreBtn.after('<a href="javascript:;" id="DNWSYA-trashBtn"></a>');
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

  /**
   * 获取一条垃圾tweet的实体
   * @param {jQueryObj} $TweetRow 垃圾tweet标题所在行
   * @return {[object]} 
   */
  function getTrashItem($tweetRow) {
    var $tweetLink = $tweetRow.find('td.title > a');
    var $userLink = $tweetRow.next().find('a[href^="user?id="]');
    var trashItem = {
      id    : $userLink.prev().prop('id').replace('score_', ''),
      link  : $tweetLink.attr('href'),
      title : $tweetLink.html(),
      author: $userLink.html()
    };
    return trashItem;
  }
  
  /**
   * 在垃圾区域追加一条垃圾tweet
   * @param  {[object]} item tweet实体
   * @param  {[object]} whyShield {type, value}
   */
  function appendTrashItem(item, whyShield) {
    if ( $(DNWSYASlt.oneTrashRow).length === 0 ) {
      // 将单条垃圾tweet的模型作为一行(tr)添加到moreBtn所在行的后边
      var $rowClone = $('#DNWSYA-Container tr[name=DNWSYA-oneTrashTR-Model').clone();
      $(DNWSYASlt.moreBtn).parents('tr:first').after($rowClone);
    }
    // 将已存在的itemID暂存到 model 的数据区，便于对比
    var $trashRowModel = $(DNWSYASlt.oneTrashRow);
    var trashIndex = $trashRowModel.data('trashIndex') || 1;
    var trashIDList = $trashRowModel.data('trashIDList') || [].slice(0);
    // 已存在的就不再添加，并返回
    if ( trashIDList.indexOf(item.id) > -1 ) {
      return;
    }

    trashIDList.push(item.id);
    $trashRowModel.data('trashIDList', trashIDList);
    $trashRowModel.data('trashIndex', trashIndex + 1);

    var $newTrashRow = $trashRowModel.clone();
    $newTrashRow.attr({name: 'DNWSYA-oneTrashTR-Normal'});
    $newTrashRow.find('[name=index]').html(trashIndex);
    $newTrashRow.find('a[name=title]').attr('href', item.link).html(item.title).after('&nbsp;');
    
    var strWhyShield = '@<b>' + whyShield.name + '</b>: ' + whyShield.value;
    switch(whyShield.type){
    case WhyShieldType[0]:
      var $userLink = $newTrashRow.find('a[name=author]');
      $userLink.attr('href', '/user?id=' + item.author);
      $userLink.html(strWhyShield);
    break;
    case WhyShieldType[1]:
      var $strWhy = $newTrashRow.find('span[name=stringWhy]');
      $strWhy.html(strWhyShield);
    break;
    case WhyShieldType[2]:
      var $strWhy = $newTrashRow.find('span[name=stringWhy]');
      $strWhy.html(strWhyShield);
    break;
    case WhyShieldType[3]:
      var $strWhy = $newTrashRow.find('span[name=stringWhy]');
      $strWhy.html(strWhyShield);
    break;
    }
    
    $trashRowModel.before('<tr style="height: 6px; display: none;"></tr>');
    $trashRowModel.before($newTrashRow);
  }

  /**
   * 重新排列某条垃圾tweet（从可见列表移除，追加到垃圾区域）
   * @param {jQueryObj} $TweetRow 垃圾tweet标题所在行
   * @return {[object]}
   */
  function realignTrashItem($tweetRow, whyShield) {
    var trashItem = getTrashItem($tweetRow);
    // 先隐藏，移除追加操作放在异步执行，这样界面便不会卡顿
    $tweetRow.prev().hide().next().hide().next().hide();
    setTimeout( function(){
      $tweetRow.prev().remove();
      $tweetRow.next().remove();
      $tweetRow.remove();
      appendTrashItem(trashItem, whyShield);
    }, 500);
  }
  
  var checkTrashByUser = ( function(){

    var userList;
    var tmpData = {};
    var userLinkSlt = 'td.subtext > a[href^="user?id="]';


    function init( _userList ) {
      userList = _userList;
    }

    function find($tweetRow){
      var userID = $tweetRow.next().find(userLinkSlt).html();
      if (userList.indexOf(userID) > -1) {
        tmpData.userID = userID;
        tmpData.tweetRow = $tweetRow;
        return true;
      }
      return false;
    }

    function getTrash() {
      var trashItem = {};
      trashItem.tweetRow = tmpData.tweetRow;
      trashItem.whyShield = { name: '用户', type: WhyShieldType[0], value: tmpData.userID };
      return trashItem;
    }

    return {
      init    : init,
      find    : find,
      getTrash: getTrash
    }
  })();

  var checkTrashByHost = ( function(){

    var hostList;
    var tmpData = {};
    var tweetLinkSlt = 'td.title > a[target="_blank"]';

    function init( _hostList ) {
      hostList = _hostList;
    }

    function find($tweetRow) {
      var host = $tweetRow.find(tweetLinkSlt)[0].host;
      if (hostList.indexOf(host) > -1) {
        tmpData.host = host;
        tmpData.tweetRow = $tweetRow;
        return true;
      }
      return false;
    }

    function getTrash() {
      var trashItem = {};
      trashItem.tweetRow = tmpData.tweetRow;
      trashItem.whyShield = { name:'网站', type: WhyShieldType[1], value: tmpData.host };
      return trashItem;
    }
    
    return {
      init    : init,
      find    : find,
      getTrash: getTrash
    }
  })();

  return function(list){
    var shieldUsers = list[ShieldList.elemList[0]] || [].slice(0);
    var shieldHosts = list[ShieldList.elemList[1]] || [].slice(0);
    checkTrashByUser.init( shieldUsers );
    checkTrashByHost.init( shieldHosts );

    var foundList = [].slice(0);
    // 首先获取所有条目（32条，标题所在栏TR）
    var allItems = $(DNWSYASlt.tweetLink).map( function(idx){
      return $(this).parents('tr:first');
    });
    // 查看每一条是否符合某项屏蔽条件，一旦符合则返回，不会对同一条目进行多个条件的判断
    for(var x = 0, trashItem; x < allItems.length; x++) {
      if ( checkTrashByUser.find(allItems[x]) ) {
        trashItem = checkTrashByUser.getTrash();
        foundList.push(trashItem);
        continue;
      }

      if ( checkTrashByHost.find(allItems[x]) ) {
        trashItem = checkTrashByHost.getTrash();
        foundList.push(trashItem);
        continue;
      }
    }
    
    foundList.forEach( function(trashItem){
      realignTrashItem(trashItem.tweetRow, trashItem.whyShield);
    });

    if ( foundList.length > 0 ) addTrashBtn();
  }
})();
