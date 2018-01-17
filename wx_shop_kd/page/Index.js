const app = getApp()
var newsDataList = require("../Utils/api.js");
var redirectTo = require("../Utils/redirectTo.js");
//var Until = require("../Utils/api.js");

// page/Index.js
var latitude=0;
var longitude=0;
var shopTitle='';
var shopAdress='';
Page({


  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 20,
    hasMoreData: true,
    shopInfo:[],
    bannerList:[],
    newsData:[],
    indicatorDots: true,
    indicatorActiveColor: "#ffffff",
    autoplay: true,
    interval: 5000,
    duration: 1000
  
  },
  detail: function (event) {
    redirectTo.redirectTo_deTail(event);
  },
  video: function (event) {
    redirectTo.redirectTo_deTailVideo(event);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
 //   console.log(app.globalData.AccountInfo.User_Group_ID);
 var that = this
 that.getAccountInfo();
 that.getArtListInfo('正在加载数据...')
   // console.log(this.data.newsData);
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
    this.data.page =1;
    console.log("page111:" + this.data.page)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   console.log("上啦刷新了")
  
   if (this.data.hasMoreData) {
     this.getArtListInfo('加载更多数据')
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

  },
  getCallPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopInfo[0].shop_tel //仅为示例，并非真实的电话号码
    })
  },
  getlocation: function () {
    var that=this;
    console.log(that.shopInfo);
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
       // var latitude = 39.832663
       // var longitude = 116.294537
        var speed = res.speed
        var accuracy = res.accuracy
       // console.log("latitude:" + latitude)
        //console.log("longitude:" + longitude)
        wx.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          scale: 15,
          name: shopTitle,
          address: shopAdress
        })
      }
    })
  },
  getArtListInfo: function (message) {
    var that = this,
      Geturl = app.globalData.AccountInfo.Domain +'/ajax/ArticleHandle.ashx?op=GetAccountArticleList';
    var data = {
      user_Group_ID: app.globalData.AccountInfo.User_Group_ID,
      Account_ID: app.globalData.AccountInfo.Member_ID_admin,
      Member_ID:0,
      PageSize: that.data.pageSize,
      CurrentIndex:that.data.page,
      type:600,
      Channel_one:0
    }
    newsDataList.requestLoading(Geturl,data, message, function (res) {
    //  console.log(data)
     //console.log(res);
      var contentlistTem = that.data.newsData
      if (res.errorCode == 200) {
        if (that.data.page == 1) {
          contentlistTem = []
        }
        var contentlist = res.data
        for (var obj = contentlist.length, i=0;i<obj;i++)
        {
          var siteList = [];
          contentlist[i].PicUrl.length == 0 ? (contentlist[i].pic_count = 0) : ( (contentlist[i].PicUrl.split('|').length < 2 ? (contentlist[i].pic_count = 1  ) : (contentlist[i].pic_count = 3)));
//图一
          if (contentlist[i].PicUrl.split('|').length < 2){
            var p = contentlist[i].PicUrl.split('|');
            for (var a = 4, b = '', c = 0; c < a; c++) {
              if (typeof (p[c]) == "undefined" || p[c].length <= 0) {
                continue;
              }
              var url = p[c].split('&');
              //alert(url.length)
              if (url.length > 1) {
                p[c] = url[0] + "&width=500&height=290";

              }
              contentlist[i].PicUrl = p[c]
            }
          }//多图
          else if (contentlist[i].PicUrl.split('|').length >1)
          {
            var siteArr = contentlist[i].PicUrl.split('|');
           
            for (var a = 3, b = '', c = 0; c < a; c++) {
              
          if (typeof (siteArr[c]) == "undefined" || siteArr[c].length <= 0) {
                continue;
              }
          var url = siteArr[c].split('&');
          //alert(url.length)
          if (url.length > 1) {
            siteArr[c] = url[0] + "&width=500&height=290";

          }
              siteList.push(siteArr[c]);
            }
          //  console.log(siteList);
            contentlist[i].PicArr = siteList;
          }
          //视频时间
          if (contentlist[i].otherParameter.split('|').length > 0 && contentlist[i].int_type==2)
          {
            contentlist[i].otherParameter = contentlist[i].otherParameter.split('|')[0];
          }
          // 直播
          if (contentlist[i].otherParameter.split('|').length > 0 && contentlist[i].int_type == 10) {
            contentlist[i].otherParameter = '回 看';
          }
          //阅读数
          contentlist[i].int_hist = app.GetCount(contentlist[i].int_hist);
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

  getAccountInfo:function(){
    var that = this,
      Geturl = app.globalData.AccountInfo.Domain + '/ajax/MallHandler.ashx?op=GetAccountInfo';
    var data = {
      user_Group_ID: app.globalData.AccountInfo.User_Group_ID,
      Account_ID: app.globalData.AccountInfo.Member_ID_admin,
      Member_ID: 0,
      ID: app.globalData.AccountInfo.Account_shop_ID
    }
    newsDataList.requestLoading(Geturl, data, '', function (res) {
      //  console.log(data)
     console.log(res);
     // var contentItem = that.data.newsData
      if (res.errorCode == 200) {
       
       // var contentItem = shopInfo;
        if (that.data.shopInfo.length<1)
          {
          var siteArr = res.data[0].site_Logo_arr.split('|');
          var siteList=[];
          for (var a = 7, b = '', c = 0; c < a; c++) {
            if (typeof (siteArr[c]) == "undefined" || siteArr[c].length <= 0)             {
              continue;
            }
            siteList.push(siteArr[c]);
          }
          longitude=res.data[0].x,
            latitude= res.data[0].y,
              shopTitle= res.data[0].site_title
                shopAdress=res.data[0].shop_address
        //  console.log(siteList);
      that.setData({
        shopInfo: res.data,
        bannerList:siteList
        
      })
    } }

    }, function (res) {
    })


  }
})