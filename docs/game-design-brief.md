# Brief thiết kế lại đồ họa — 3 trò chơi STEM (Web Học Tập THCS Nga Sơn)

> Tài liệu mô tả **hiện trạng** 3 game để giao cho agent/designer làm lại phần đồ họa.
> Mục tiêu: nâng chất lượng hình ảnh, **giữ nguyên luật chơi, nội dung câu hỏi và cách điều khiển** (trừ khi ghi rõ là được đổi).
> Ảnh chụp hiện trạng: `docs/game-screens/` (đặt tên `webN-{start|play|orbit}-{rộng}x{cao}.png`).

---

## 1. Bối cảnh chung

| Mục | Nội dung |
|---|---|
| Sản phẩm | Cổng "Web Học Tập THCS Nga Sơn" (Next.js). Trang chủ có Đấu Trường Tri Thức (quiz) và khu "Trò chơi STEM" gồm 3 game. |
| Người chơi | Học sinh THCS (11–15 tuổi), thầy cô; game được trình diễn trước **Ban Giám Khảo** cuộc thi STEM (có chế độ "Trải nghiệm nhanh BGK"). |
| Thiết bị | Máy chiếu/màn hình lớn 1920×1080, laptop 1280×800, máy tính bảng 768×1024, điện thoại 360–430px dọc **và xoay ngang** (~844×390). Phải chơi được bằng **chuột, bàn phím và cảm ứng**. |
| Ngôn ngữ | Tiếng Việt có dấu — font phải hiển thị tốt dấu tiếng Việt (ơ, ư, ặ, ễ…), không bị cắt dấu trên/dưới. |
| Cách nhúng | Mỗi game là **1 file HTML độc lập** ở `public/games/web1.html`, `web2.html`, `web3.html`, mở trong iframe toàn màn hình tại `/tro-choi/chien-co`, `/tro-choi/quy-dao`, `/tro-choi/tau-ngam`. Phía trên iframe có thanh điều hướng mỏng của cổng (về trang chủ, game trước/sau, toàn màn hình) mang màu gradient riêng của từng game. |
| Màu nhận diện từng game (dùng ở thẻ trang chủ & thanh điều hướng) | Chiến Cơ `#4f46e5 → #0369a1` · Quỹ Đạo `#059669 → #0f766e` · Tàu Ngầm `#0891b2 → #1e40af` (định nghĩa trong `src/lib/modules.ts`) |
| Phong cách cổng hiện tại | "Bright Futuristic Arena": nền sáng, palette `#0284c7` (sky), `#10b981` (emerald), `#0369a1` (deep), `#d97706` (amber), font Be Vietnam Pro, bo góc lớn, kính mờ (glass). Ba game hiện **đều dùng nền tối/neon**, chưa đồng bộ với cổng. |

### Kỹ thuật hiện tại (ràng buộc cho bản thiết kế mới)
- **Canvas 2D** vẽ toàn bộ cảnh chơi bằng code (hình học + gradient + glow `shadowBlur`); **không có file ảnh, sprite, font ngoài** — mọi biểu tượng là **emoji** (hiển thị khác nhau giữa Windows/Android/iOS).
- Giao diện ngoài canvas (HUD, màn hình bắt đầu/kết thúc, hộp câu hỏi) là **HTML + CSS** trong cùng file.
- Âm thanh tổng hợp bằng **Web Audio API** (không có file âm thanh), có nút bật/tắt.
- Đã có lớp **responsive** (vừa bổ sung): HUD thu gọn trên di động (ẩn chữ, chỉ còn biểu tượng), màn phủ cuộn được khi màn hình thấp, bố cục canvas tính theo kích thước màn hình. Thiết kế mới **phải giữ được** các hành vi này.
- Được phép thêm asset (SVG/PNG/WebP sprite, webfont) nhưng nên đặt cạnh file game trong `public/games/<tên>/` và giữ dung lượng nhỏ (mục tiêu < 1–1.5 MB mỗi game) vì có thể chạy trên mạng trường.
- Hiệu năng: 60fps trên điện thoại tầm trung; hạn chế `shadowBlur` lớn mỗi frame.

### Điểm yếu đồ họa chung (quan sát từ ảnh chụp)
1. Phong cách "neon tối" chung chung, ba game trông như ba sản phẩm khác nhau, không ăn nhập với cổng sáng màu.
2. Dùng emoji làm vật thể chính → không đồng nhất giữa thiết bị, độ nét thấp khi phóng to trên máy chiếu.
3. Nhân vật chính (phi thuyền tam giác, tàu ngầm hình elip, Trái Đất với lục địa là vệt cam) đơn giản, thiếu chi tiết/cá tính.
4. Màn hình bắt đầu là khối chữ dài, nhiều nút cùng trọng lượng; thiếu minh họa và hệ phân cấp thị giác.
5. Phản hồi đúng/sai chủ yếu là chữ nổi + hạt; thiếu khoảnh khắc "đã" (juice) rõ ràng, thiếu nhân vật/linh vật dẫn dắt.

---

## 2. Game 01 — Chiến Cơ Kiến Thức (`web1.html`, `/tro-choi/chien-co`)

**Chủ đề:** Vũ trụ · Lịch sử – Địa lý – Khoa học Việt Nam & thế giới.
**Ý tưởng:** Lái phi thuyền ở đáy màn hình, bắn trúng **đĩa bay mang đáp án đúng**.

### Màn hình
1. **Bắt đầu:** nhãn "Sản phẩm dự thi STEM • Trường THCS Nga Sơn", tiêu đề "🚀 CHIẾN CƠ KIẾN THỨC", lời chào BGK, 2 nút chọn chế độ (**Thử thách đầy đủ 30 câu** / **Trải nghiệm nhanh BGK 10 câu**), đoạn hướng dẫn điều khiển, nút lớn **KHỞI HÀNH**.
2. **Chơi:** (mô tả bên dưới).
3. **Kết thúc:** "NHIỆM VỤ HOÀN TẤT!", thẻ tổng kết: tổng điểm (đúng x/y câu), **hạng** (🏅 Chỉ huy tối cao vũ trụ ≥90% · 🥈 Phi công tinh nhuệ ≥65% · 🥉 Chiến binh tri thức ≥35% · 🚀 Tân binh khám phá), thời gian, độ chính xác bắn; nút **CHƠI LẠI**.

### Cảnh chơi
- **Nền:** không gian đen xanh, 2 tinh vân radial (tím/xanh), ~150 ngôi sao trôi xuống tạo cảm giác bay.
- **Đĩa bay mẹ (câu hỏi):** elip lớn viền hồng/magenta `#ff00ff`, mái vòm kính, đèn chạy quanh viền; chứa chữ "Câu N: …" nhiều dòng. Lắc nhẹ trái–phải.
- **3 đĩa bay đáp án A/B/C:** elip nhỏ viền cyan `#00f2ff`, huy hiệu tròn vàng `#ffd000` ghi A/B/C phía trên, chữ đáp án bên trong; bay qua lại ngẫu nhiên. Vị trí đáp án đúng được xáo trộn mỗi câu.
- **Phi thuyền người chơi:** tam giác xanh lá `#00cc36` + glow, 2 cánh phụ, buồng lái tròn, lửa phản lực cam; nghiêng theo hướng di chuyển.
- **Đạn:** tia laser.
- **Hiệu ứng:** trúng đúng → nổ hạt xanh + sóng xung kích + chữ "+điểm"; trúng sai → nổ đỏ, rung màn hình, chữ "-5", đĩa sai biến mất.
- **HUD (HTML):** thanh tiến độ mảnh trên cùng; hộp "ĐIỂM | CÂU x/30", "COMBO xN" (vàng), đồng hồ ⏱️, nút âm thanh.

### Luật & điều khiển (giữ nguyên)
- Đúng: +10 × combo, combo tăng tới x5, sang câu mới. Sai: −5 điểm, combo về x1, vẫn ở câu đó.
- Máy tính: chuột hoặc ◀ ▶ / A D để lái; click hoặc Space để bắn. Cảm ứng: kéo ngón tay để lái, chạm để bắn.
- 30 câu hỏi 3 đáp án (lịch sử, địa danh, tự nhiên, đố vui); chữ đáp án dài tới ~25 ký tự, câu hỏi tới ~110 ký tự → thiết kế phải chứa được chữ dài trên điện thoại 360px.

---

## 3. Game 02 — Quỹ Đạo Xanh Trái Đất (`web2.html`, `/tro-choi/quy-dao`)

**Chủ đề:** Quỹ đạo Trái Đất · Môi trường & Địa lý thế giới.
**Ý tưởng:** Vệ tinh bay vòng quanh Trái Đất, ghé **8 kỳ quan**, đọc thông điệp môi trường và trả lời câu hỏi để **phục hồi Trái Đất** từ xám xịt (25%) thành xanh tươi (100%).

### Màn hình
1. **Bắt đầu:** nhãn trường, tiêu đề "QUỸ ĐẠO XANH TRÁI ĐẤT" (chữ gradient), mô tả, 2 nút chế độ (**8 kỳ quan** / **Nhanh BGK 4 kỳ quan**), khung "Hướng dẫn cách chơi" 3 bước, nút **🚀 BẮT ĐẦU HÀNH TRÌNH**. Nền phía sau là cảnh quỹ đạo mờ.
2. **Quỹ đạo (cảnh chính):**
   - Trái Đất ở giữa: đại dương gradient xanh, lục địa là các mảng màu, mây trắng trôi, quầng khí quyển; **màu thay đổi theo "Sức khỏe Trái Đất"** (thấp: xám/xanh đậm, khí quyển xám; cao: xanh dương sáng + quầng xanh lá).
   - Đường quỹ đạo elip nét đứt; **8 nút trạm** tròn trên quỹ đạo, mỗi trạm có màu và biểu tượng riêng, tên bên dưới:
     Vịnh Hạ Long 🏝️ `#38bdf8` · Thành Nhà Hồ 🏰 `#fbbf24` · Rừng Nhiệt Đới Amazon 🌳 `#4ade80` · Kim Tự Tháp Giza 🔺 `#f59e0b` · Đấu Trường La Mã Colosseum 🏛️ `#fb7185` · Vạn Lý Trường Thành 🧱 `#f97316` · Rạn San Hô Great Barrier 🪸 `#2dd4bf` · Đền Taj Mahal 🕌 `#c084fc`.
   - Trạm đang chọn: to hơn, vòng sáng nhấp nháy, tên in đậm trắng; **vệ tinh 🛰️** đứng trên trạm với tia quét radar. Trạm đã xong đổi thành ✅ (đúng, viền xanh) hoặc 💡 (sai, viền vàng).
   - Quỹ đạo xoay mượt khi chuyển trạm; nền sao + sao băng.
   - **HUD:** "🛰️ Quỹ đạo kỳ quan x/8", "🌍 Sức khỏe Trái Đất %" kèm thanh tiến độ, "⭐ Điểm xanh", nút âm thanh.
   - **Thanh dưới:** ◀ Trạm trước · 🔍 Khám phá trạm này (nổi bật, gradient xanh dương→xanh lá) · Trạm tiếp ▶.
3. **Thẻ kỳ quan (modal):** nhãn vùng ("🇻🇳 VIỆT NAM • DI SẢN THIÊN NHIÊN"), tên + biểu tượng, đoạn mô tả, ô "🌱 Thông điệp bảo vệ môi trường" (nền xanh lá), câu hỏi, 3 lựa chọn A/B/C (đúng → xanh ✓, sai → đỏ ✕ và tô xanh đáp án đúng), hộp "Mời bạn chuyển câu tiếp theo" + fact, nút **Chuyển sang địa điểm tiếp theo ▶**. Có pháo hoa khi trả lời.
4. **Kết thúc:** tổng kết số kỳ quan, số câu đúng, % sức khỏe Trái Đất, tổng điểm xanh; pháo hoa lớn; nút **BAY VÒNG QUỸ ĐẠO MỚI**.

### Luật & điều khiển (giữ nguyên)
- Đúng: +25 điểm, Trái Đất hồi phục (25% + đúng/tổng × 75%). Sai: +5 điểm (khuyến khích), vẫn tính đã ghé.
- Máy tính: click trạm hoặc ◀ ▶, Enter để khám phá. Cảm ứng: chạm trạm, vuốt ngang để xoay quỹ đạo.

---

## 4. Game 03 — Tàu Ngầm Xanh Đại Dương (`web3.html`, `/tro-choi/tau-ngam`)

**Chủ đề:** Biển đảo · Bảo vệ đại dương.
**Ý tưởng:** Lái tàu ngầm ở đáy màn hình, **hứng rác rơi xuống** để làm sạch biển, né thủy lôi/lưới, nhặt **ngọc trai tri thức** để trả lời câu hỏi.

### Màn hình
1. **Bắt đầu:** nhãn trường, tiêu đề "🌊 TÀU NGẦM XANH ĐẠI DƯƠNG", mô tả, 2 nút chế độ (**10 câu hỏi** / **Nhanh BGK 5 câu**), khung "Cách chơi & cơ chế mới" (3 gạch đầu dòng), lưới 5 thẻ chú giải vật phẩm, nút **LẶN XUỐNG ĐẠI DƯƠNG**.
2. **Chơi:**
   - **Nền biển:** gradient dọc; màu phần trên **sáng dần theo độ "Biển xanh"** (đục → xanh ngọc); 4 cột tia nắng chiếu xiên; bong bóng nổi; cá trang trí bơi ngang; đáy biển dải tối với 🪸 🌿.
   - **3 tầng biển** theo % sạch: Vùng Ven Bờ (<45%) → Rạn San Hô (45–74%) → Vực Thẳm Xanh (≥75%); tầng sâu vật rơi nhanh hơn. Hiện chỉ đổi màu nền + nhãn tầng — **cơ hội lớn để thiết kế 3 cảnh riêng biệt**.
   - **Tàu ngầm:** thân elip vàng, cửa sổ tròn xanh, tháp + kính tiềm vọng, đèn pha chiếu lên.
   - **Vật phẩm rơi (đều là emoji):** rác 🧴 🛍️ 🥤 🥫 · ngọc trai 🦪 (có quầng sáng) · khiên 🛡️ · nam châm 🧲 · tim 💖 · nguy hiểm 💣 thủy lôi / 🕸️ lưới.
   - **Sonar:** khi thanh đầy, nút sonar phát sáng vàng nhấp nháy; kích hoạt tạo sóng tròn lan ra, quét sạch rác + nguy hiểm trên màn hình.
   - **HUD:** "ĐIỂM | ❤️❤️❤️ (+🛡️/🧲 khi có)", "COMBO xN", "🌊 Biển xanh %" + thanh + tên tầng, "📡 Sonar" + thanh, "🦪 Câu hỏi x/10", nút âm.
   - **Thanh dưới:** nút tròn ◀ · nút **SONAR %** (viên thuốc) · nút tròn ▶.
3. **Câu hỏi ngọc trai (modal, game tạm dừng):** thẻ gradient xanh biển, tag "🦪 Câu hỏi bảo vệ đại dương", câu hỏi, 3 lựa chọn, banner kết quả + fact, nút **Tiếp tục lặn & chuyển câu tiếp theo ▶**; pháo hoa.
4. **Kết thúc:** thắng "HOÀN THÀNH SỨ MỆNH!" (biển sạch 100% hoặc hết câu hỏi) / thua (hết tim); tổng kết; nút **CHƠI LẠI**.

### Luật & điều khiển (giữ nguyên)
- Rác: +10 × combo (tối đa x4), +3% sạch, +15% sonar. Để rác rơi lọt đáy → combo về x1.
- Ngọc trai đúng: +30 điểm, +10% sạch. Nguy hiểm: −1 tim, −5% sạch, rung màn hình (khiên chặn được 1 lần). Nam châm hút rác ~7 giây. Tim hồi 1 mạng (tối đa 3).
- Máy tính: chuột hoặc A D / ◀ ▶, Space phóng sonar. Cảm ứng: kéo ngang hoặc nút ◀ ▶, nút Sonar.

---

## 5. Yêu cầu cho bản thiết kế mới

**Phải giữ**
- Toàn bộ nội dung chữ (câu hỏi, đáp án, fact, tên kỳ quan), luật tính điểm, điều khiển, 2 chế độ chơi, việc xáo trộn đáp án.
- Hoạt động tốt ở 360×740, 390×844, 844×390 (ngang), 768×1024, 1280×800, 1920×1080; vùng chạm ≥ 44px; chữ câu hỏi đọc được trên điện thoại và từ xa trên máy chiếu.
- Mỗi game vẫn là trang tĩnh chạy được khi mở trực tiếp file, không cần build.

**Mong muốn**
- Một **hệ ngôn ngữ hình ảnh chung** cho cả 3 game (cùng font, cùng kiểu nút/HUD/modal/màn kết thúc), mỗi game giữ màu chủ đạo riêng (indigo vũ trụ / emerald quỹ đạo / cyan đại dương) và hài hòa với cổng sáng màu.
- Thay emoji bằng **bộ minh họa nhất quán** (vector/SVG hoặc sprite) cho nhân vật chính, vật phẩm, kỳ quan.
- Màn hình bắt đầu gọn hơn: minh họa chủ đề + 1 nút chính rõ ràng, hướng dẫn chơi dạng icon/ngắn.
- Phản hồi đúng/sai giàu cảm xúc hơn nhưng không chói, không nhấp nháy mạnh (an toàn cho học sinh nhạy cảm ánh sáng); tôn trọng `prefers-reduced-motion`.
- Trạng thái tiến bộ thấy rõ bằng hình ảnh: Trái Đất hồi sinh dần (game 2), biển trong dần và đổi cảnh theo tầng (game 3).

**Câu hỏi còn mở cho designer**
- Giữ nền tối cho cảnh chơi (vũ trụ, biển sâu) hay chuyển sang tông sáng như cổng? (Màn bắt đầu/kết thúc có thể sáng dù cảnh chơi tối.)
- Có thêm linh vật/nhân vật dẫn dắt chung cho cả 3 game không?

**Sản phẩm cần bàn giao**
1. Moodboard + style guide (màu, font, icon, nút, HUD, modal).
2. Mockup cho mỗi game: màn bắt đầu, cảnh chơi, modal câu hỏi (game 2, 3), màn kết thúc — ở khổ điện thoại dọc và desktop.
3. Asset xuất sẵn (SVG/PNG/WebP) đặt tên rõ ràng, kèm thông số kích thước/vị trí để lập trình viên ghép vào canvas.
