# Bàn giao đồ họa ba trò chơi STEM Nga Sơn

Ba trò chơi dùng phương án A đã duyệt. Cảnh chơi dùng nền tối, màn chọn chế độ, hộp câu hỏi và màn tổng kết dùng nền sáng. Cói chào học sinh ở màn đầu và xuất hiện cạnh kết quả. Ba game dùng chung font Be Vietnam Pro cục bộ, cách chọn chế độ, nút chính, HUD thu gọn trên điện thoại và nút có viền focus khi dùng bàn phím.

| Game | Thay đổi ở cảnh chơi | Trước và sau |
|---|---|---|
| [Chiến Cơ](http://localhost:3000/tro-choi/chien-co) | Chiến cơ hai động cơ bay trên đường chân trời màu đồng. Đĩa mẹ và ba đĩa đáp án có vòm kính, thân chàm, huy hiệu chữ cái. Bố cục lấy chiều cao thực của iframe để chừa khoảng giữa câu hỏi, mục tiêu và mũi tàu khi xoay ngang. | [Điện thoại](web1-truoc-sau-390x844.jpg) · [Máy tính](web1-truoc-sau-1280x800.jpg) |
| [Quỹ Đạo](http://localhost:3000/tro-choi/quy-dao) | Tám kỳ quan có tám hình riêng. Vệ tinh với hai cánh pin đánh dấu trạm đang chọn. Màu đại dương, lục địa, mây và khí quyển chuyển liên tục theo sức khỏe. Hình Trái Đất ở thẻ phản hồi và tổng kết phản ánh kết quả thật của lượt chơi. | [Điện thoại](web2-truoc-sau-390x844.jpg) · [Máy tính](web2-truoc-sau-1280x800.jpg) · [Trái Đất ở 25%, 63% và 100%](web2-trai-dat.png) |
| [Tàu Ngầm](http://localhost:3000/tro-choi/tau-ngam) | Tàu màu hổ phách, vật phẩm và sinh vật dùng minh họa vector. Ven bờ có rong và thềm cát, rạn có các nhánh san hô, vực thẳm có khe sâu, cột đá và các điểm sáng. Độ sạch chi phối màu nước, số cá và tầng biển. | [Điện thoại](web3-truoc-sau-390x844.jpg) · [Máy tính](web3-truoc-sau-1280x800.jpg) · [Rạn san hô](web3-reef-390x844.png) · [Vực thẳm](web3-abyss-390x844.png) |

## Kiểm tra

| Hạng mục | Kết quả |
|---|---|
| Nội dung | Đối chiếu dữ liệu với bản sao trước chỉnh sửa. Chiến Cơ có 30 câu, Quỹ Đạo có 8 kỳ quan và Tàu Ngầm có 12 câu trong kho để rút 10 hoặc 5 câu mỗi ván. Câu hỏi, đáp án, chỉ số đáp án đúng, tên kỳ quan, mô tả, thông điệp và phần giải thích đều khớp. |
| Chiến Cơ | Chơi tới tổng kết và chơi lại. Từ 0 điểm, bắn đúng được 10, số câu tiến lên; bắn sai còn 5 và combo về ×1. Thử cảm ứng kéo lái và chạm bắn, phím Space và xoay giữa ván. Kiểm tra đủ 30 câu ở cả sáu kích thước trong iframe. Ở 844×390, sau khi trừ thanh điều hướng, khoảng cách nhỏ nhất đo được giữa đĩa đáp án và mũi tàu là 18 px. Câu hỏi xuất hiện trên đĩa mẹ ngay trong cảnh chơi. |
| Quỹ Đạo | Chơi chế độ 4 và 8 trạm. Thử chọn bằng phím, Enter, chạm và vuốt, đổi hướng màn hình, trả lời đúng và sai, chuyển trạm, tổng kết và chơi lại. Đúng +25, sai +5; sức khỏe khớp công thức 25 + 75 × số đúng / tổng số trạm, làm tròn tới phần trăm. Một lần chạm trạm chỉ mở thẻ; người chơi chọn đáp án bằng lần chạm tiếp theo. |
| Tàu Ngầm | Kiểm tra sinh vật phẩm tự nhiên, sau đó đặt vật phẩm tại tọa độ xác định để kiểm thử đường xử lý va chạm. Nhặt rác đầu tiên được 10 điểm, tăng 3% sạch và 15% sonar. Thủy lôi trừ 1 tim và 5% sạch. Khiên chặn lưới, tim hồi mạng, nam châm bật bộ đếm. Ngọc đúng +30 điểm, +10% sạch, +40% sonar; ngọc sai hiển thị đáp án đúng. Sonar đầy quét rác và nguy hiểm. Đã thử nút cảm ứng, Space, xoay ngang, cả ba tầng, thắng, [hết tim](web3-maintenance-390x844.png) và chơi lại. |
| Hình ảnh và truy cập | Dùng Playwright chụp các màn ở sáu kích thước bên dưới và xem lại ảnh. HUD thu gọn theo chiều rộng hoặc chiều cao. Hộp thoại dài cuộn được. Ở màn phủ, các nút phía sau được vô hiệu hóa đối với bàn phím. Chế độ giảm chuyển động được bật trong lượt 390×844. |
| Chạy độc lập và dự phòng | Đã mở trực tiếp các file HTML và chạy qua máy chủ tĩnh. Khi chủ động chặn toàn bộ SVG, ba game vẫn khởi hành, xử lý bắn, trả lời hoặc nhặt vật phẩm bằng hình dự phòng. Các lượt chơi bình thường và kiểm tra iframe hoàn tất với console sạch. |
| Docker | Đã chạy `docker compose up -d --build`. Container báo `healthy`. Ba đường dẫn trong bảng trên trả HTTP 200, tải đúng iframe, khởi hành và dùng được nút âm thanh. |

**Hiệu năng.** Nền tĩnh vẽ vào canvas đệm. Canvas chính dùng điểm ảnh theo thiết bị, tối đa 2×. Trong mẫu 180 khung hình trên Chrome máy phát triển với viewport 390×844, DPR 2, cả ba game đạt trung bình 60,0 khung hình/giây. Thời gian khung hình ở phân vị 95 lần lượt là 16,7 ms, 16,8 ms và 16,7 ms. Tài nguyên ngoài HTML tải trong lượt đo lần lượt khoảng 132 KB, 104 KB và 104 KB. Chưa đo trên điện thoại tầm trung thật hoặc thử độ sáng máy chiếu trong phòng thi.

## Mã nguồn và tài nguyên

- Ba trang đã sửa nằm ở [web1.html](../../public/games/web1.html), [web2.html](../../public/games/web2.html) và [web3.html](../../public/games/web3.html). [Thư mục sao lưu](../../public/games/_backup/) chứa ba file `webN.before-redesign.html`.
- [chien-co/](../../public/games/chien-co/) chứa `chien-co.svg`, `sky.svg`, `mobile.svg`, `poster.svg`, `banner.svg`. Tài nguyên dùng chung tại đây gồm `coi.svg`, `art.js`, `interface.css` và thư mục `fonts/` chứa 6 file WOFF2, CSS và giấy phép OFL.
- [quy-dao/](../../public/games/quy-dao/) chứa `poster.svg`, `banner.svg`, `satellite.svg`, `earth-low.svg`, `earth-mid.svg`, `earth-full.svg` và tám hình kỳ quan `ha-long`, `thanh-ho`, `amazon`, `giza`, `rome`, `great-wall`, `reef`, `taj` (SVG).
- [tau-ngam/](../../public/games/tau-ngam/) chứa `poster.svg`, `banner.svg`, `submarine.svg`, các hình môi trường `fish`, `kelp`, `coral`, `vent` cùng các vật phẩm `bottle`, `bag`, `cup`, `can`, `pearl`, `shield`, `magnet`, `heart`, `mine`, `net` (SVG).

## Ảnh kiểm tra ở kích thước gốc

### Chiến Cơ

| Kích thước | Bắt đầu | Cảnh chơi | Kết thúc |
|---|---|---|---|
| 360×740 | [Bắt đầu](web1-start-360x740.png) | [Cảnh chơi](web1-play-360x740.png) | [Kết thúc](web1-end-360x740.png) |
| 390×844 | [Bắt đầu](web1-start-390x844.png) | [Cảnh chơi](web1-play-390x844.png) | [Kết thúc](web1-end-390x844.png) |
| 844×390 | [Bắt đầu](web1-start-844x390.png) | [Cảnh chơi](web1-play-844x390.png) | [Kết thúc](web1-end-844x390.png) |
| 768×1024 | [Bắt đầu](web1-start-768x1024.png) | [Cảnh chơi](web1-play-768x1024.png) | [Kết thúc](web1-end-768x1024.png) |
| 1280×800 | [Bắt đầu](web1-start-1280x800.png) | [Cảnh chơi](web1-play-1280x800.png) | [Kết thúc](web1-end-1280x800.png) |
| 1920×1080 | [Bắt đầu](web1-start-1920x1080.png) | [Cảnh chơi](web1-play-1920x1080.png) | [Kết thúc](web1-end-1920x1080.png) |

### Quỹ Đạo

| Kích thước | Bắt đầu | Cảnh chơi | Câu hỏi | Kết thúc |
|---|---|---|---|---|
| 360×740 | [Bắt đầu](web2-start-360x740.png) | [Cảnh chơi](web2-play-360x740.png) | [Câu hỏi](web2-modal-360x740.png) | [Kết thúc](web2-end-360x740.png) |
| 390×844 | [Bắt đầu](web2-start-390x844.png) | [Cảnh chơi](web2-play-390x844.png) | [Câu hỏi](web2-modal-390x844.png) | [Kết thúc](web2-end-390x844.png) |
| 844×390 | [Bắt đầu](web2-start-844x390.png) | [Cảnh chơi](web2-play-844x390.png) | [Câu hỏi](web2-modal-844x390.png) | [Kết thúc](web2-end-844x390.png) |
| 768×1024 | [Bắt đầu](web2-start-768x1024.png) | [Cảnh chơi](web2-play-768x1024.png) | [Câu hỏi](web2-modal-768x1024.png) | [Kết thúc](web2-end-768x1024.png) |
| 1280×800 | [Bắt đầu](web2-start-1280x800.png) | [Cảnh chơi](web2-play-1280x800.png) | [Câu hỏi](web2-modal-1280x800.png) | [Kết thúc](web2-end-1280x800.png) |
| 1920×1080 | [Bắt đầu](web2-start-1920x1080.png) | [Cảnh chơi](web2-play-1920x1080.png) | [Câu hỏi](web2-modal-1920x1080.png) | [Kết thúc](web2-end-1920x1080.png) |

### Tàu Ngầm

| Kích thước | Bắt đầu | Cảnh chơi | Câu hỏi | Kết thúc |
|---|---|---|---|---|
| 360×740 | [Bắt đầu](web3-start-360x740.png) | [Cảnh chơi](web3-play-360x740.png) | [Câu hỏi](web3-modal-360x740.png) | [Kết thúc](web3-end-360x740.png) |
| 390×844 | [Bắt đầu](web3-start-390x844.png) | [Cảnh chơi](web3-play-390x844.png) | [Câu hỏi](web3-modal-390x844.png) | [Kết thúc](web3-end-390x844.png) |
| 844×390 | [Bắt đầu](web3-start-844x390.png) | [Cảnh chơi](web3-play-844x390.png) | [Câu hỏi](web3-modal-844x390.png) | [Kết thúc](web3-end-844x390.png) |
| 768×1024 | [Bắt đầu](web3-start-768x1024.png) | [Cảnh chơi](web3-play-768x1024.png) | [Câu hỏi](web3-modal-768x1024.png) | [Kết thúc](web3-end-768x1024.png) |
| 1280×800 | [Bắt đầu](web3-start-1280x800.png) | [Cảnh chơi](web3-play-1280x800.png) | [Câu hỏi](web3-modal-1280x800.png) | [Kết thúc](web3-end-1280x800.png) |
| 1920×1080 | [Bắt đầu](web3-start-1920x1080.png) | [Cảnh chơi](web3-play-1920x1080.png) | [Câu hỏi](web3-modal-1920x1080.png) | [Kết thúc](web3-end-1920x1080.png) |

