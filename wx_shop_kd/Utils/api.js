
var Until = {
  ajax: function (i) {
    
    return wx.request({
      url: 'http://api.taiyasaifu.com/ajax/MemberHandle.ashx?OP=GetAuthType_v2&user_Group_ID=331&&Account_ID=6636',
      data: i.data,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        i.success(res.data);
      }
    });
  }
}

function getShopArtList(Getdata, message, success, fail)
{
return Until.ajax({
   url:Getdata.url,
   data: Getdata.data,
   success: function(e){}
 });
}
function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}
function requestLoading(url, Getdata,message, success, fail) {
  //console.log(Getdata)
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: Getdata,
    header: {
      //'Content-Type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      //console.log(res.data)
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        success(res.data)
      } else {
        fail()
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      fail()
    },
    complete: function (res) {

    },
  })
}

//module.exprots=Until;
module.exports = {
  getShopArtList: getShopArtList,
  request: request,
  requestLoading: requestLoading,

}