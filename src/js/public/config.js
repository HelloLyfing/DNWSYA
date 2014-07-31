var ExtFullName = '清爽一下(for StartupNews)';
var ExtNickName = '清爽一下';
var ExtEngName = 'DNWSYA';

var ShieldList = {
  key     : 'ShieldList',
  elemList: ['users', 'hosts', 'addres', 'titles']
};

var DNWSYASlt = {
  extDomCont : '#DNWSYA-Container',
  optsPanel  : '#DNWSYA-OptsPanel',
  mainBtn    : '#DNWSYA-Btn',
  moreBtn    : 'body > center > table .title > a[href^="/x?fnid="]',
  userLink   : 'body > center > table table td.subtext > a[href^="user?id="]',
  tweetLink  : 'body > center > table table tr:not(.trashRow) > td.title > a[target="_blank"]',
  oneTrashRow: 'body > center > table tr[name=DNWSYA-oneTrashTR-Model]'
};

var PageParams = {
  ExtID  : null,
  ExtHost: null
};
