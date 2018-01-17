App(
  {
    onLaunch:function(){

  },
    globalData: {
      AccountInfo: {
        User_Group_ID:327,
        Account_ID:1970,
        Account_shop_ID:1977,
        Member_ID_admin: 1590469,
        Domain:'https://api1.tysfweb.com'
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