var redirect_url = '/page';

function redirectTo_deTail(event) {
  wx.navigateTo({
    url: redirect_url + '/Detail?id=' + event.currentTarget.id
  });
}

function redirectTo_deTailVideo(event) {
  wx.navigateTo({
    url: redirect_url + '/VideoDetail?id=' + event.currentTarget.id
  });
}
module.exports = {
  redirectTo_deTail: redirectTo_deTail,
  redirectTo_deTailVideo: redirectTo_deTailVideo
}
