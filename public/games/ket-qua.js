/*
 * Cầu nối kết quả trò chơi → cổng Web Học Tập (trang /tro-choi/... chứa game trong iframe).
 * Game gọi nsGame.start() khi bắt đầu lượt và nsGame.result({...}) khi kết thúc.
 * Chỉ gửi cho trang cha CÙNG tên miền; mở game riêng lẻ (không có trang cha) thì không làm gì.
 */
(function () {
  var t0 = 0;
  window.nsGame = {
    start: function () { t0 = Date.now(); },
    result: function (data) {
      try {
        if (window.parent === window) return;
        var msg = { type: 'nsgame:result', durationSec: t0 ? Math.round((Date.now() - t0) / 1000) : null };
        for (var k in data) msg[k] = data[k];
        window.parent.postMessage(msg, location.origin);
      } catch (e) { /* không ảnh hưởng trò chơi */ }
      t0 = 0;
    }
  };
})();
