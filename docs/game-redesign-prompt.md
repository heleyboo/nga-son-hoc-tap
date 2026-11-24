# Nhiệm vụ: Làm lại đồ họa 3 trò chơi STEM (sửa trực tiếp vào code)

Bạn là game developer kiêm visual designer. Nhiệm vụ: LÀM LẠI ĐỒ HỌA và SỬA TRỰC TIẾP vào code
của 3 trò chơi STEM trong dự án "Web Học Tập THCS Nga Sơn" (người chơi: học sinh THCS 11–15 tuổi;
game được trình diễn trước Ban Giám Khảo cuộc thi STEM).

Thư mục dự án: `nga-son-hoc-tap/` (mọi đường dẫn bên dưới tính từ thư mục này).

---

## 1. Đọc trước khi làm

- `docs/game-design-brief.md` — hiện trạng, luật chơi, ràng buộc, yêu cầu (**bắt buộc đọc hết**).
- `docs/game-screens/*.png` — ảnh chụp hiện trạng để so sánh trước/sau.
- `public/games/web1.html` (Chiến Cơ), `web2.html` (Quỹ Đạo), `web3.html` (Tàu Ngầm) — file cần sửa.
- `src/app/globals.css`, `src/lib/modules.ts` — token màu và màu nhận diện của cổng.
- `src/features/portal/GameFrame.tsx` — khung iframe nhúng game (để hiểu cách game được hiển thị).

---

## 2. Bước 0 — Đề xuất hướng đồ họa (làm trước, CHƯA sửa code game)

Hai quyết định sau **chưa được chốt**, bạn phải đề xuất và chờ duyệt trước khi làm lại 3 game.

### 2.1. Tông màu — so sánh ít nhất 2 phương án
- **A.** Giữ nền tối cho cảnh chơi (vũ trụ, biển sâu); màn bắt đầu/kết thúc/modal dùng tông sáng như cổng.
- **B.** Toàn bộ tông sáng như cổng (nền sáng, glass, bo góc lớn).
- (Được đề xuất thêm **C** nếu thấy hợp lý hơn.)

Đánh giá mỗi phương án theo: đọc rõ trên máy chiếu phòng sáng và trên điện thoại, đồng bộ với cổng,
hợp chủ đề từng game, độ tương phản chữ, công sức thực hiện.

### 2.2. Linh vật dẫn dắt chung cho cả 3 game
- Nên có hay không, vì sao.
- Nếu có: đề xuất 1–2 ý tưởng — tên, tạo hình, tính cách, liên hệ với trường/địa phương Nga Sơn,
  xuất hiện ở đâu (màn bắt đầu, phản hồi đúng/sai, màn kết thúc) mà không gây rối khi đang chơi.
- Linh vật phải là thiết kế gốc, không dựa trên nhân vật có bản quyền.

### 2.3. Bàn giao bước 0
- `docs/game-redesign-proposal.md`: bảng so sánh, phương án **khuyến nghị** + lý do, palette hex
  và font dự kiến.
- Bản xem thử **game Chiến Cơ (web1)** cho từng phương án tông màu — màn bắt đầu + cảnh chơi, khổ
  390×844 và 1280×800. Làm thành file HTML riêng trong `public/games/_preview/` (**không sửa
  `web1.html` thật**), kèm ảnh PNG trong `docs/game-redesign-preview/`.
- Phác thảo linh vật (SVG) nếu đề xuất có linh vật.

### 2.4. Sau đó DỪNG LẠI
Báo cáo ngắn (phương án khuyến nghị + đường dẫn ảnh xem thử) và hỏi người dùng chọn phương án nào.
Chỉ làm tiếp các bước dưới khi người dùng trả lời. Nếu người dùng nói "theo khuyến nghị" thì dùng
phương án bạn đã khuyến nghị.

---

## 3. Phạm vi được sửa

- Chỉ sửa `public/games/web1.html`, `web2.html`, `web3.html`.
- Được thêm asset mới vào `public/games/<chien-co|quy-dao|tau-ngam>/`.
- Nếu đổi màu chủ đạo của game, cập nhật `from/to/soft/ink` tương ứng trong `src/lib/modules.ts`.
- **KHÔNG** sửa các file `web1/2/3.html` gốc ở thư mục cha của dự án (bản lưu).
- **KHÔNG** sửa phần Đấu Trường, đăng nhập, database.
- Trước khi sửa, sao lưu mỗi file thành `public/games/_backup/webN.before-redesign.html`.

---

## 4. Tuyệt đối giữ nguyên (chỉ thay lớp vẽ/CSS)

- **Nội dung:** câu hỏi, đáp án, fact, tên kỳ quan — không viết lại, không cắt bớt.
- **Luật và tính điểm:** combo, tim, khiên, nam châm, sonar, % sức khỏe Trái Đất / % biển sạch,
  điều kiện thắng/thua, xếp hạng cuối game, 2 chế độ chơi, xáo trộn đáp án.
- **Điều khiển:**
  - Chuột và bàn phím (◀ ▶ / A D / Space / Enter).
  - Cảm ứng: kéo để lái, chạm để bắn (web1); vuốt quỹ đạo (web2); nút ◀ ▶ Sonar (web3).
  - Script cảm ứng ở cuối `web1.html` phải còn hoạt động.
- **Các phần responsive đã có** phải còn chạy đúng sau khi đổi đồ họa:
  - **web1:** `computeLayout()`, `layoutLevel()`, `UFO.fit()`.
    - Đĩa bay tự co theo màn hình, không chồng nhau, không bị HUD che.
    - Phi thuyền thu nhỏ khi màn hình thấp.
  - **web2:** `measureChrome()`, `getOrbitGeometry()`.
    - Quỹ đạo nằm gọn giữa HUD và thanh nút.
    - Nhãn trạm không tràn mép màn hình.
  - **Cả 3 game:**
    - Thẻ `span.lbl` trong HUD và nút bị ẩn trên điện thoại (HUD chỉ còn icon + số).
    - Các `.overlay` cuộn được khi màn hình thấp.
    - Có `viewport-fit=cover` và safe-area.
    - Giữ media query `(max-width:640px), (max-height:520px)`.
- **Game vẫn là trang HTML tĩnh:**
  - Không bundler, không framework.
  - Được dùng webfont Google Fonts hoặc tự host; không gọi dịch vụ ngoài khác.
  - Chạy được trong iframe cùng nguồn.

---

## 5. Yêu cầu đồ họa (áp dụng theo phương án đã duyệt ở bước 0)

1. **Hệ ngôn ngữ hình ảnh chung** cho cả 3 game:
   - Cùng font hỗ trợ tốt tiếng Việt có dấu, dấu không bị cắt.
   - Cùng kiểu nút, HUD, modal, màn bắt đầu và màn kết thúc.
   - Mỗi game giữ màu chủ đạo riêng:
     - Chiến Cơ: indigo `#4f46e5 → #0369a1`
     - Quỹ Đạo: emerald `#059669 → #0f766e`
     - Tàu Ngầm: cyan `#0891b2 → #1e40af`
   - Hài hòa với cổng (`#0284c7`, `#10b981`, `#0369a1`, `#d97706`).
   - Gom màu thành biến CSS `:root` ở đầu mỗi file.
2. **Thay emoji bằng minh họa vector nhất quán** (SVG inline / Path2D / file SVG hoặc WebP):
   - Đối tượng cần vẽ: phi thuyền, đĩa bay, Trái Đất, 8 kỳ quan, vệ tinh, tàu ngầm, rác, ngọc trai, khiên, nam châm, tim, thủy lôi, lưới, cá, san hô.
   - Tải trước ảnh trước khi bắt đầu chơi.
   - Nếu tải lỗi, game vẫn phải chơi được, dùng hình đơn giản thay thế.
3. **Tiến bộ phải thấy được bằng hình ảnh:**
   - Game 2: Trái Đất hồi sinh dần từ 25% đến 100%, chuyển màu mượt, có ít nhất 3 trạng thái.
   - Game 3: 3 cảnh biển riêng (Ven Bờ / Rạn San Hô / Vực Thẳm), nước trong dần.
4. **Màn bắt đầu gọn hơn:**
   - Có minh họa chủ đề và 1 nút chính nổi bật.
   - Phần chọn chế độ rõ ràng.
   - Hướng dẫn ngắn bằng icon, vẫn giữ đủ ý của hướng dẫn hiện có.
5. **Phản hồi đúng/sai, combo, sonar, chiến thắng có cảm xúc:**
   - Không chớp mạnh, không đổi độ sáng toàn màn liên tục.
   - Khi `prefers-reduced-motion` bật: tắt rung, giảm hạt và pháo hoa.
6. **Hiệu năng:**
   - 60fps trên điện thoại tầm trung.
   - Không dùng `shadowBlur` lớn trong vòng lặp; cache phần vẽ tĩnh bằng offscreen canvas.
   - Hỗ trợ `devicePixelRatio`, tối đa 2.
   - Asset dưới khoảng 1.5 MB mỗi game.
7. **Truy cập:**
   - Tương phản chữ ≥ 4.5:1.
   - Vùng chạm ≥ 44px.
   - Nút có `aria-label`.
   - Focus bàn phím nhìn thấy được.

---

## 6. Cách làm

- Làm **từng game một**: web1 → web2 → web3. Xong và kiểm tra xong game này mới sang game tiếp.
- Tách phần vẽ thành các hàm rõ ràng (`drawBackground`, `drawPlayer`, `drawItem`…) để không đụng logic.

## 7. Kiểm tra bắt buộc (mỗi game)

1. Chạy server tĩnh cho `public/games`, ví dụ `python3 -m http.server <cổng trống>`; kiểm tra cổng chưa bị app khác dùng. Hoặc chạy Next dev rồi mở `/tro-choi/chien-co`, `/tro-choi/quy-dao`, `/tro-choi/tau-ngam`.
2. Dùng Playwright chụp màn bắt đầu, cảnh chơi, modal câu hỏi và màn kết thúc.
   - Kích thước cần chụp: **360×740, 390×844, 844×390, 768×1024, 1280×800, 1920×1080**.
   - Tự xem ảnh và sửa đến khi: không chồng chéo, không bị cắt, không tràn ngang; HUD không che câu hỏi hay vật thể; chữ tiếng Việt đọc rõ.
3. Chơi thử bằng script:
   - web1: bắn trúng đáp án đúng thì điểm và số câu tăng; bắn sai thì trừ 5.
   - web2: mở trạm và trả lời; % Trái Đất và điểm tăng đúng luật.
   - web3: nhặt rác và ngọc trai, trả lời câu hỏi; chạm thủy lôi thì mất tim; sonar quét được rác.
   - Thử cả cảm ứng (`hasTouch`) và xoay màn hình giữa ván.
4. Console không có lỗi JavaScript.
5. Ghép ảnh trước/sau cạnh nhau để báo cáo.

## 8. Khi xong

- Build lại Docker bằng `docker compose up -d --build` trong thư mục `nga-son-hoc-tap`, rồi kiểm tra `http://localhost:3000/tro-choi/*` trả về 200.
- Báo cáo gồm:
  - Những gì đã đổi ở từng game.
  - Danh sách file và asset mới.
  - Đường dẫn ảnh trước/sau.
  - Kết quả từng bước kiểm tra; nói rõ bước nào chưa đạt.
- Không commit git trừ khi được yêu cầu.

Nếu brief có điểm mâu thuẫn hoặc chưa rõ, hãy hỏi trước khi bắt đầu, đừng tự đoán.
