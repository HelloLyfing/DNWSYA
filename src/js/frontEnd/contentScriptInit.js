$( function() {
  DomHelper.initMainBtn();
  // request init data from Ext-backEnd
  chrome.runtime.sendMessage({type: 'DNWSYA:Request:InitData:TabPage'}, function(response) {
    PageParams.ExtID = response.ExtID;
    PageParams.ExtHost = 'chrome-extension://' + PageParams.ExtID;
    DomHelper.insertExtDom();
    ContentFilter(response.shieldList);
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

  function addTrashBtn() {
    if ( $('#DNWSYA-trashBtn').length > 0 ) return;

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

  return {
    initMainBtn: function(){
      mainBtnInsert();
      mainBtnAttachHandler();
    },
    insertExtDom: insertExtDom,
    addTrashBtn : addTrashBtn
  }
})();
