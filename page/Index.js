const app = getApp()
var newsDataList = require("../Utils/api.js");
var redirectTo = require("../Utils/redirectTo.js");

var menu_static = 0;

var latitude = 0;
var longitude = 0;
var shopTitle = '';
var shopAdress = '';
var map = app.getMap();
var Systemheight = '';
var Totalpage = 10;
Page({


  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 20,
    hasMoreData: true,
    shopInfo: [],
    bannerList: [],
    newsData: [],
    indicatorDots: true,
    indicatorActiveColor: "#ffffff",
    autoplay: true,
    interval: 5000,
    duration: 1000,
    menuStatic: 0,
    menu: [],
    NomoreData: []


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
    wx.getSystemInfo({
      success: function (res) {
        Systemheight = res.screenHeight;
        //  console.log(res.windowHeight)

      }
    })
    //   console.log(app.globalData.AccountInfo.User_Group_ID);
    var that = this
    that.getAccountChannle();
    that.getAccountInfo();
    map.put(that.data.menuStatic, []);

    // console.log(this.data.newsData);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log("ready");
    var that = this;
    that.getArtListInfo(0, this.data.menuStatic, '正在加载数据...')
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

    if (this.data.hasMoreData) {
      this.getArtListInfo(0, this.data.menuStatic, '加载更多数据')
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
    var that = this;
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
  click_menu: function (event) {
    this.data.menuStatic = event.currentTarget.id;

    this.getArtListInfo(1, this.data.menuStatic, '正在加载数据...')
  },
  getArtListInfo: function (Gettype, menuStatic, message) {

    var that = this;

    if (Gettype == 1) //Gettype:判断是滚动加载还是切换加载
    {
      var ChannlePage = 1;
      var Nodata = {
        viewheight: Systemheight,
        viewshow: 'inblock'
      }

      var contentlistMap = [];
      if (map.get(menuStatic) != undefined) {
        contentlistMap = map.get(menuStatic);
      } else {
        this.data.page = 1;
        this.getArtListInfo(0, this.data.menuStatic, '正在加载数据...')
      }
      if (contentlistMap.length > 0) {
        Nodata = {
          viewheight: Systemheight,
          viewshow: 'none'
        }
      }
      ChannlePage = (contentlistMap.length / that.data.pageSize) == 0 ? 1 : (contentlistMap.length / that.data.pageSize);

      //  console.log(menuStatic);
      that.setData({
        menuStatic: menuStatic,
        newsData: contentlistMap,
        hasMoreData: true,
        NomoreData: Nodata,
        page: ChannlePage + 1
      });
      return;
    }

    var Geturl = app.globalData.AccountInfo.Domain + '/ajax/ArticleHandle.ashx?op=GetAccountArticleList';
    var data = {
      user_Group_ID: app.globalData.AccountInfo.User_Group_ID,
      Account_ID: app.globalData.AccountInfo.Member_ID_admin,
      Member_ID: 0,
      PageSize: that.data.pageSize,
      CurrentIndex: that.data.page,
      type: 600,
      Channel_one: that.data.menuStatic
    };
    var Nodata = {
      viewheight: Systemheight,
      viewshow: 'none'
    }
    if (Totalpage < that.data.page) {
      that.setData({
        hasMoreData: false
      });
      return;
    }
    newsDataList.requestLoading(Geturl, data, message, function (res) {

      var contentlistTem = [];
      if (map.get(menuStatic) == undefined) {
        map.put(menuStatic, contentlistTem); //that.data.newsData; 
      }
      if (res.errorCode == 404) {

        Nodata = {
          viewheight: Systemheight,
          viewshow: 'inblock'
        }
        that.setData({
          newsData: [],
          NomoreData: Nodata,
          hasMoreData: false
        });

      }
      if (res.errorCode == 200) {
        Nodata = {
          viewheight: Systemheight,
          viewshow: 'none'
        }
        var contentlist = res.data
        Totalpage = contentlist[0].PageCount;
        for (var obj = contentlist.length, i = 0; i < obj; i++) {
          var siteList = [];
          contentlist[i].PicUrl.length == 0 ? (contentlist[i].pic_count = 0) : ((contentlist[i].PicUrl.split('|').length < 2 ? (contentlist[i].pic_count = 1) : (contentlist[i].pic_count = 3)));
          //图一
          if (contentlist[i].PicUrl.split('|').length < 2) {
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
          else if (contentlist[i].PicUrl.split('|').length > 1) {
            var siteArr = contentlist[i].PicUrl.split('|');

            for (var a = 3, b = '', c = 0; c < a; c++) {

              if (typeof (siteArr[c]) == "undefined" || siteArr[c].length <= 0)
              { continue; }
              var url = siteArr[c].split('&');
              //alert(url.length)
              if (url.length > 1) {
                siteArr[c] = url[0] + "&width=500&height=290";

              }
              siteList.push(siteArr[c]);
            }
            console.log(siteList);
            contentlist[i].PicArr = siteList;
          }
          //视频时间
          if (contentlist[i].otherParameter.split('|').length > 0 && contentlist[i].int_type == 2) {
            contentlist[i].otherParameter = contentlist[i].otherParameter.split('|')[0];
          }
          // 直播
          if (contentlist[i].otherParameter.split('|').length > 0 && contentlist[i].int_type == 10) {
            contentlist[i].otherParameter = '回 看';
          }
          //阅读数
          contentlist[i].int_hist = app.GetCount(contentlist[i].int_hist);
        }
        map.put(menuStatic, contentlistTem.concat(contentlist));


        if (contentlist[0].PageCount <= that.data.page) {
          that.setData({
            menuStatic: menuStatic,
            newsData: contentlistTem.concat(contentlist),
            hasMoreData: false,
            NomoreData: Nodata
          })
        }
        else {
          that.setData({
            menuStatic: menuStatic,
            newsData: contentlistTem.concat(contentlist),
            hasMoreData: true,
            NomoreData: Nodata,
            page: that.data.page + 1
          })
        }
      }
    }, function (res) {
    })
  },

  getAccountInfo: function () {
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
      // console.log(res);
      // var contentItem = that.data.newsData
      if (res.errorCode == 200) {

        // var contentItem = shopInfo;
        if (that.data.shopInfo.length < 1) {
          var siteArr = res.data[0].site_Logo_arr.split('|');
          var siteList = [];
          for (var a = 7, b = '', c = 0; c < a; c++) {
            if (typeof (siteArr[c]) == "undefined" || siteArr[c].length <= 0) {
              continue;
            }
            siteList.push(siteArr[c]);
          }
          longitude = res.data[0].x,
            latitude = res.data[0].y,
            shopTitle = res.data[0].site_title
          shopAdress = res.data[0].shop_address
          //  console.log(siteList);
          //     res.data[0].shop_address='';
          that.setData({
            shopInfo: res.data,
            bannerList: siteList,
            locationshow: (res.data[0].shop_address.length > 0 ? 'inblock' : 'none'),
            Phoneshow: (res.data[0].shop_tel.length > 0 ? 'inblock' : 'none'),
            Businessshow: (res.data[0].shop_BusinessHours.length > 0 ? 'inblock' : 'none'),
            Introshow: (res.data[0].shop_Introduction.length > 0 ? 'inblock' : 'none'),

          })
        }
      }

    }, function (res) {
    })


  },
  getAccountChannle: function () {
    var that = this,
      Geturl = app.globalData.AccountInfo.Domain + '/ajax/MallHandler.ashx?OP=GetAccountChannelList';
    var data = {
      user_Group_ID: app.globalData.AccountInfo.User_Group_ID,
      Account_ID: app.globalData.AccountInfo.Account_shop_ID,
      Member_ID: app.globalData.AccountInfo.Member_ID_admin
    }
    newsDataList.requestLoading(Geturl, data, '', function (res) {

      //console.log(res);
      if (res.errorCode == 200) {
        that.setData({
          menu: res.data
        })

      }
    }, function (res) {
    })

  }
})