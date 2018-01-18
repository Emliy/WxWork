
const app = getApp();
var newsDataList = require("../Utils/api.js");
var redirectTo = require("../Utils/redirectTo.js");
var WxParse = require('../wxParse/wxParse.js');

var ArtID = 0;
// page/Detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Title: '',
    int_Comments: '',
    Description: '',
    pubDate: '',
    int_hist: '',
    headerList: [],
    page: 1,
    pageSize: 8,
    hasMoreData: true,
    newsData: [],
    otherParameter:'',
    vodUrl:''
  },
  getArtCommentList: function (ArtID, message) {
    var that = this,
      Geturl = app.globalData.AccountInfo.Domain + '/ajax/ArticleHandle.ashx?OP=GetComments';
    var data = {
      user_Group_ID: app.globalData.AccountInfo.User_Group_ID,
      Account_ID: app.globalData.AccountInfo.Member_ID_admin,
      Articel_ID: ArtID,
      PageSize: that.data.pageSize,
      CurrentIndex: that.data.page
    }
    newsDataList.requestLoading(Geturl, data, message, function (res) {
      //  console.log(data)
    //  console.log(res);
      var contentlistTem = that.data.newsData
      if (res.errorCode == 200) {
        if (that.data.page == 1) {
          contentlistTem = []
        }
        var contentlist = res.data
        for (var obj = contentlist.length, i = 0; i < obj; i++) {
        }

        if (contentlist[0].PageCount <= that.data.page) {
          that.setData({
            newsData: contentlistTem.concat(contentlist),
            hasMoreData: false
          })
        }
        else {
          that.setData({
            newsData: contentlistTem.concat(contentlist),
            hasMoreData: true,
            page: that.data.page + 1
          })
        }
      }

    }, function (res) {
    })
  },
  getArtInfo: function (ArtID, message) {
    var that = this,
      Geturl = app.globalData.AccountInfo.Domain + '/ajax/ArticleHandle.ashx?OP=GetArticlInfo';
    var data = {
      user_Group_ID: app.globalData.AccountInfo.User_Group_ID,
      Account_ID: app.globalData.AccountInfo.Account_ID,
      Member_ID: 0,
      ID: ArtID
    }
    newsDataList.requestLoading(Geturl, data, message, function (res) {
      //  console.log(data)
      console.log(res);

      var headdata = {
        headimgurl: res.data[0].headimgurl,
        Name: res.data[0].Name
      }

      if (res.errorCode == 200) {
        var urlvideo = res.data[0].vodUrl.split('|');
        var GetUrl = res.data[0].vodUrl;
        if (res.data[0].int_type===10)
        {
          var GetUrl = urlvideo[1];
        }
        that.setData({
          Title: res.data[0].Title,
          int_hist: app.GetCount(res.data[0].int_hist),
          int_Comments: (res.data[0].int_Comments == 0 ? '' : res.data[0].int_Comments),
          Description: WxParse.wxParse('article', 'html', res.data[0].Description, that, 5),
          vodUrl: encodeURI(GetUrl),//res.data[0].vodUrl,//encodeURI
           otherParameter :res.data[0].otherParameter,

          pubDate: res.data[0].pubDate,
          headerList: headdata
        })

      }

    }, function (res) {
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
   // console.log(options.id);
    ArtID = options.id;
    that.getArtInfo(options.id, '')
    that.getArtCommentList(options.id, '正在加载数据...')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下啦刷新了");
    this.data.page = 1;
    console.log("page111:" + this.data.page)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上啦刷新了")

    if (this.data.hasMoreData) {
      this.getArtCommentList(ArtID, '加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})