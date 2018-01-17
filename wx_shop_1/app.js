App(
  {
    onLaunch:function(){

  },
    globalData: {
      AccountInfo: {
        User_Group_ID:337,
        Account_ID:6666,
        Account_shop_ID:7826,
        Member_ID_admin:2418412,
        Domain:'https://api.0086org.cn'
      }
    },
    GetCount: function (data) {
      var h;

      h = data / 1000;

      if (h >= 1) {
        h = h.toFixed(1).replace('.0', '万+');
        if (h.indexOf('万') <= 0) {
          h = h + '万';
        }

      } else {
        h = data;
      }

      return h;
    },
  },
  
)