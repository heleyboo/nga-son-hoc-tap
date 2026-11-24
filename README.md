# Web Học Tập THCS Nga Sơn

Next.js 16 (App Router, Cache Components) · SQLite (better-sqlite3 + Drizzle ORM) · better-auth (Google) · Docker.

## Đăng nhập Google — cấu hình

1. Vào [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials), tạo **OAuth client ID** loại *Web application*.
   - *Authorized JavaScript origins*: `http://localhost:3000` và tên miền thật.
   - *Authorized redirect URIs*: `<BETTER_AUTH_URL>/api/auth/callback/google`, ví dụ `http://localhost:3000/api/auth/callback/google`.
2. Chép `.env.example` thành `.env` rồi điền các giá trị:
   ```bash
   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=...apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_ALLOWED_DOMAIN=            # tùy chọn: chỉ nhận email @tên-miền-trường
   ```
3. Khởi động lại server. Nếu chưa có `GOOGLE_CLIENT_ID`/`SECRET`, nút đăng nhập sẽ bị ẩn và mọi người chơi ở chế độ khách.

Nếu app ở chế độ **Testing** trên Google Console, chỉ những email đã thêm vào *Test users* mới đăng nhập được. Muốn mọi học sinh dùng được thì phải *Publish app*. Nếu chỉ cho phép tài khoản Google Workspace của trường thì chọn loại *Internal*.

## Chạy nhanh

```bash
# Docker (production)
docker compose up -d --build          # http://localhost:3000
docker compose logs -f web

# Docker (dev, hot-reload, DB ở ./data/app.db)
docker compose -f compose.dev.yaml up --build

# Không dùng Docker
npm install
npm run dev
```

Khi server khởi động, `src/instrumentation.ts` tự chạy migration. Nếu bảng `questions` còn trống, nó seed 160 câu cũ từ `src/db/seed/questions.json`. Sau đó nó nạp thêm kho mở rộng `src/db/seed/bank/grade-*.json` (1 440 câu, tổng **1 600 câu**). Bước này chạy cả trên DB đã có dữ liệu nhưng chỉ **thêm** câu có mã chưa tồn tại, không ghi đè câu giáo viên đã sửa hoặc đã ẩn. Muốn tắt seed thì đặt `SEED_ON_START=false`.

## Cấu trúc

```
src/
  app/
    page.tsx               Trang chủ cổng: Đấu Trường + 5 trò chơi STEM
    tro-choi/[slug]/       Trang chơi game (chien-co, quy-dao, tau-ngam, duong-sang-lang-coi, lang-coi-mo-hoi): thanh điều hướng + iframe, nút toàn màn hình
    dau-truong/            Đấu Trường Tri Thức (layout + page client)
      bang-xep-hang/       Bảng xếp hạng (tuần / tháng / mọi lúc, tự làm mới 30 giây)
    api/                   Route handlers (xem bên dưới)
  db/
    schema.ts              Bảng: questions, attempts, attempt_answers, feedbacks, question_reports
    index.ts               Kết nối SQLite (WAL, foreign keys), singleton
    migrate.ts             migrate + seed lúc khởi động
    seed/questions.json    Kho câu hỏi trích từ web4.html cũ (mã G-CB-0xx / G-NC-0xx)
    seed/bank/             Kho mở rộng GDPT 2018, mỗi khối 1 file (mã 1xx: soạn mới; 2xx–4xx: soạn lại từ nguồn tham khảo, có `source`)
  features/arena/          Giao diện Đấu Trường (chuyển từ ../dau-truong-prototype)
    ArenaApp.tsx           Ứng dụng chơi: chào → chọn khối → thiết lập → làm bài → kết quả → xem lại / góp ý / thành tích
    LeaderboardView.tsx    Bảng xếp hạng
    lib/api.ts             Lớp gọi /api/* phía client
    lib/session.tsx        Phiên đăng nhập (better-auth client + /api/me)
  lib/
    auth.ts                Cấu hình better-auth + Google, getSessionUser()
    scoring.ts             Công thức điểm DÙNG CHUNG client/server
    quiz.ts                Nghiệp vụ: lấy đề, chấm bài, nhận xét tự động, bảng điểm, góp ý
    validation.ts          Zod schema cho input API
    data.ts                Hàm đọc DB cho Server Component (có await connection())
drizzle/                   File migration SQL (sinh bởi drizzle-kit)
public/games/              3 game Canvas 2D (web1–3) và hai game Three.js 3D (lang-coi/, mo-hoi/), phục vụ tĩnh
scripts/extract-legacy-questions.mjs
```

## API

| Method | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/api/health` | Kiểm tra sống (Docker healthcheck) |
| GET | `/api/subjects?grade=6` | Số câu theo khối, cấp độ, môn |
| GET | `/api/quiz?grade=6&level=basic&subjects=Toán,KHTN&count=10` | Đề ngẫu nhiên, **không kèm đáp án** |
| POST | `/api/questions/:id/check` `{selectedIndex}` | Chấm 1 câu, trả đáp án và giải thích (chế độ Luyện tập) |
| POST | `/api/questions/:id/report` `{reason, note?}` | Báo lỗi câu hỏi 🚩 (`wrong_answer`, `unclear`, `typo`, `other`) |
| POST | `/api/attempts` | Nộp bài. Server tự chấm, lưu lại, trả nhận xét theo môn và danh sách câu sai |
| GET | `/api/leaderboard?grade=8\|all&level=basic\|advanced\|all&mode=arena\|practice&period=week\|month\|all` | Bảng xếp hạng, kèm `me` (hạng của người đang đăng nhập) |
| GET/PATCH | `/api/me` | Người dùng hiện tại, `googleEnabled`; PATCH `{nickname, className}` để đổi tên hiển thị |
| GET | `/api/me/history` | Lịch sử lượt chơi của tài khoản |
| GET/POST | `/api/auth/*` | better-auth (đăng nhập Google, callback, đăng xuất) |
| GET | `/api/feedback` | Điểm sao trung bình và nhận xét gần đây |
| POST | `/api/feedback` `{rating, difficulty?, tags?, comment?, attemptId?}` | Nhận xét, đánh giá của người làm |

Ví dụ body cho `POST /api/attempts`:

```json
{ "playerName": "Lan", "className": "6A", "grade": 6, "level": "basic", "mode": "arena",
  "durationSec": 120, "answers": [{ "questionId": 5, "selectedIndex": 2, "timeMs": 4200 }] }
```

## Đổi schema DB

```bash
# sửa src/db/schema.ts rồi:
npm run db:generate      # sinh file SQL mới trong drizzle/
# lần khởi động server tiếp theo sẽ tự áp dụng
npm run db:studio        # xem/sửa dữ liệu qua giao diện web
```

## Lưu ý

- **Next 16 + driver đồng bộ:** trong Server Component phải `await connection()` trước khi query, nếu không Next sẽ prerender dữ liệu lúc build (xem `src/lib/data.ts`). Route handler đọc `req` thì không cần.
- **Dữ liệu Docker** nằm trong volume `sqlite-data`. Sao lưu bằng lệnh:
  `docker compose exec web node -e "require('better-sqlite3')('/app/data/app.db').backup('/app/data/backup.db')"`
- Kho câu hỏi đã chuẩn hóa theo chương trình GDPT 2018: Lý, Hóa, Sinh của khối 8–9 được gộp vào môn **KHTN**, tên phân môn cũ giữ ở cột `topic`.
- Image Docker dùng `npm ci --ignore-scripts` vì better-sqlite3 đã có sẵn bản build cho linux x64 và arm64, không cần cài Python hay trình biên dịch.

## Đấu Trường: luật nghiệp vụ

- **Chấm điểm** do server làm (`src/lib/scoring.ts`, dùng chung với client nên hai bên hiển thị khớp nhau). Luyện tập được +10 mỗi câu đúng. Thi đấu được 100 điểm, cộng thưởng tốc độ (tối đa +50) và thưởng chuỗi (từ câu đúng thứ 3 liên tiếp, mỗi bậc +20, tối đa +80). Thời gian dưới 1 giây vẫn tính như 1 giây.
- **Đề không kèm đáp án.** Đáp án và giải thích chỉ trả về sau khi chấm từng câu (`/check`). Client xáo thứ tự đáp án rồi quy đổi về chỉ số gốc trước khi gửi.
- **Bảng xếp hạng:** chỉ tính tài khoản Google. Mỗi người lấy 1 lượt tốt nhất trong kỳ, xếp theo điểm, rồi số câu đúng, rồi thời gian. Không tính lượt khách và lượt "làm lại câu sai". Tuần bắt đầu từ 0 giờ thứ Hai, tháng từ ngày 1, theo giờ Việt Nam. Server chỉ nhận câu hỏi đúng khối và cấp độ đã khai báo.
- **Quyền riêng tư:** bảng xếp hạng chỉ hiện *tên hiển thị* (mặc định là tên gọi Google, đổi được ở màn chào) và lớp. Không hiện email hay ảnh đại diện của người khác.
- **Khách** vẫn chơi được: kết quả lưu trên server (không gắn tài khoản) và lịch sử, thành tích lưu ở trình duyệt.
- **Kho câu hỏi:** 1 600 câu, mỗi khối 400 câu (240 cơ bản, 160 nâng cao), chia theo 8 môn: Toán, Ngữ văn, Tiếng Anh, KHTN, Lịch sử và Địa lý, GDCD, Tin học, Công nghệ. Muốn thêm câu thì thêm vào `src/db/seed/bank/grade-N.json` với mã mới chưa dùng, rồi chạy `npm run bank:check` (kiểm tra định dạng, mã, trùng nội dung, phân bố đáp án và in bảng thống kê). Giáo viên cũng thêm được câu ở trang giáo viên.
- **Giải thích** của 1 440 câu mới là bản nháp do AI soạn và đã được soát lại một lượt. 1 200 câu mã 2xx–4xx được viết lại (không chép nguyên văn) dựa trên đề và bài trắc nghiệm công khai trên mạng; URL tham khảo nằm ở trường `source` trong JSON, không nạp vào DB. Giải thích của 160 câu cũ là bản nháp soạn tự động (`src/db/seed/explanations.draft.json`), được nạp vào các ô còn trống khi khởi động. Giao diện gắn nhãn "chờ GV duyệt" cho đến khi `explanation_reviewed = 1`.
- Migration `0001` sửa đáp án câu `7-NC-002`: 3^2024 chia 7 dư **2**. Danh sách các câu mơ hồ hoặc sai chính tả khác xem ở `../dau-truong-prototype/README.md`.

## Trò chơi STEM

Ba game canvas cũ (`web1–3.html`) được giữ nguyên trong `public/games/` và mở trong `/tro-choi/<slug>`. Danh mục (tên, mô tả, cách điều khiển, màu) nằm ở `src/lib/modules.ts`. Muốn thêm game mới: chép file HTML vào `public/games/` rồi thêm một mục vào `GAMES`.

Điểm khác với bản gốc ở thư mục cha: `public/games/web1.html` (Chiến Cơ) được thêm **điều khiển cảm ứng**, kéo để lái và chạm để bắn.

## Lớp học trực tiếp

Giáo viên mở phòng tại `/truc-tiep`, chiếu màn hình lên máy chiếu/TV/laptop. Học sinh vào `/tham-gia` (quét QR hoặc nhập mã 6 số, không cần đăng nhập) và trả lời bằng điện thoại.

- Nhịp chơi do giáo viên điều khiển (phím **Space/Enter**): câu hỏi → công bố đáp án (tự động khi hết giờ hoặc khi cả lớp đã trả lời) → bảng xếp hạng → câu tiếp → bục vinh danh + tải bảng điểm CSV. Phím **F**: toàn màn hình.
- Điểm: 100 khi đúng + thưởng tốc độ (≤ 50, theo thời gian mỗi câu của phòng) + thưởng chuỗi (≤ 80) — cùng công thức `src/lib/scoring.ts`. Server tự bấm giờ và chấm; điện thoại không biết đáp án trước khi công bố.
- Thời gian thực bằng Server-Sent Events (`/api/live/:code/stream`). Trạng thái phòng giữ **trong bộ nhớ** tiến trình Node (1 container): khởi động lại server thì các phòng đang mở sẽ mất; phòng không hoạt động 3 giờ tự xoá. Tối đa 120 học sinh/phòng, 60 phòng.
- Chỉ trình duyệt đã tạo phòng giữ khoá điều khiển (localStorage). Giáo viên có thể mời học sinh ra khỏi phòng (di chuột vào tên ở màn hình chờ).
- Điện thoại phải truy cập được máy chủ. Khi giáo viên mở bằng `localhost`, mã QR dùng `LIVE_PUBLIC_URL` trong `.env` (vd `http://192.168.1.10:3000` cho cùng Wi-Fi).

**Thử không cần cả lớp:** mở phòng rồi chạy học sinh ảo

```bash
node scripts/live-bots.mjs <mã-phòng> 30            # 30 học sinh ảo, trả lời ngẫu nhiên
node scripts/live-bots.mjs <mã-phòng> 30 http://192.168.1.10:3000
```

| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/live` | Tạo phòng `{grade, level, subjects[], count, seconds}` → `{code, hostKey}` |
| POST | `/api/live/:code/join` | Học sinh vào phòng `{name, className?}` → `{playerId, token}` |
| POST | `/api/live/:code/answer` | `{playerId, token, qIndex, choice}` |
| POST | `/api/live/:code/host` | `{key, action: start\|reveal\|leaderboard\|next\|end\|kick, playerId?}` |
| GET | `/api/live/:code/stream` | SSE — `?key=` (giáo viên) hoặc `?pid=&token=` (học sinh) |
| GET | `/api/live/qr?url=` | Ảnh QR (SVG) |

## Trang quản lý giáo viên (`/giao-vien`)

Ai được vào: tài khoản Google có email nằm trong `TEACHER_EMAILS` (`.env`, cách nhau bởi dấu phẩy) hoặc có `role = 'teacher'` trong bảng `user`. Mọi API `/api/teacher/*` đều kiểm tra lại quyền (401 chưa đăng nhập, 403 không phải giáo viên). Trong menu tài khoản có mục "Quản lý giáo viên".

- **Tổng quan**: số câu hỏi, giải thích chờ duyệt, báo lỗi chưa xử lý, lượt làm bài 7 ngày, các câu học sinh hay sai nhất.
- **Ngân hàng câu hỏi**: tìm/lọc theo khối, cấp độ, môn, trạng thái; thêm, sửa, ẩn/hiện, duyệt giải thích; **nhập/xuất CSV** (mở bằng Excel; có file mẫu, kiểm tra trước khi ghi, cột `ma` trùng thì cập nhật). Số mũ viết `x^2`.
- **Báo lỗi & góp ý**: báo lỗi gom theo câu (sửa câu → "Đã sửa xong" / "Bỏ qua"), góp ý của học sinh.
- **Bài giao**: chọn khối/cấp độ/môn/số câu → hệ thống lấy ngẫu nhiên một đề **cố định**, gửi mã 6 ký tự hoặc QR cho học sinh làm tại `/bai-tap?ma=…` (không cần đăng nhập). Hai hình thức: *Kiểm tra* (xem đáp án khi nộp) và *Luyện tập* (đáp án + giải thích sau mỗi câu). Tuỳ chọn giới hạn thời gian (hết giờ tự nộp) và hạn nộp. Chấm thang 10 ở server; giáo viên xem bảng điểm, tỉ lệ đúng từng câu, tải CSV, đóng/mở, xoá. Bài nộp lưu riêng (`assignment_submissions`), không ảnh hưởng bảng xếp hạng Đấu Trường.
- **Lớp trực tiếp**: kết quả mỗi buổi được lưu khi kết thúc (`live_sessions`) — bảng điểm, tỉ lệ đúng từng câu, tải CSV.

## Thử thách mỗi ngày (`/thu-thach`)

- Mỗi khối 5 câu/ngày (3 Cơ bản + 2 Nâng cao, ưu tiên khác môn), cả trường cùng một đề và cùng thứ tự đáp án. Ngày tính theo giờ Việt Nam; đề được chốt vào bảng `daily_sets` khi có người mở lần đầu trong ngày (sửa kho câu hỏi giữa ngày không làm đổi đề).
- Server bấm giờ: câu được tính giờ từ lúc bấm mở câu (`/api/daily/next`) đến lúc gửi đáp án; quá giờ (+1 giây trễ mạng) tính như không trả lời. Điểm giống chế độ Thi đấu (100 + tốc độ + chuỗi). Không tự chuyển câu — học sinh xem đáp án, giải thích rồi bấm "Câu tiếp theo".
- Tài khoản Google: lượt đầu tiên trong ngày là lượt tính điểm (vào lại thì tiếp tục đúng lượt đó), lên bảng xếp hạng ngày theo khối, chuỗi ngày liên tiếp + kỷ lục + lịch 5 tuần. Khách: chơi được, chuỗi lưu trên máy, không lên bảng.

| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/daily/start` | `{grade}` → bắt đầu/tiếp tục lượt hôm nay (kèm `runId`, `token`) |
| GET | `/api/daily/run?runId=&token=` | Trạng thái lượt chơi |
| POST | `/api/daily/next` | `{runId, token}` mở câu kế tiếp (bắt đầu tính giờ) |
| POST | `/api/daily/answer` | `{runId, token, index, choice}` (choice `null` = hết giờ) |
| GET | `/api/daily/board?grade=` | Bảng xếp hạng hôm nay của khối |
| GET | `/api/daily/me` | Chuỗi ngày, lịch đã chơi, giờ đổi đề |

## Thẻ thành tích để chia sẻ

- Sau mỗi lượt **Thử thách mỗi ngày** và **Đấu Trường** (đã lưu) có nút "Chia sẻ thành tích": server dựng thẻ từ kết quả thật (lượt thử thách xác thực bằng token; lượt Đấu Trường phải của chính tài khoản, lượt của khách chỉ chia sẻ được trong 30 phút sau khi làm) và lưu vào `share_cards` — mỗi kết quả một đường dẫn cố định `/chia-se/<mã>`.
- Ảnh 1200×630 vẽ bằng `next/og` tại `/api/share/<mã>/image` (thêm `?tai=1` để tải về), font Noto Sans trong `public/fonts` (OFL) để hiển thị đủ dấu tiếng Việt.
- Trang `/chia-se/<mã>` có thẻ Open Graph → dán link vào Zalo/Facebook/Messenger hiện ảnh xem trước. Trên điện thoại, nút "Gửi qua Zalo, Messenger…" mở bảng chia sẻ của máy (gửi kèm ảnh).
- Thẻ chỉ có tên hiển thị, lớp, điểm, số câu đúng, chuỗi/hạng — không có email.
- Ảnh xem trước chỉ hiện được khi web có địa chỉ công khai: link dùng `LIVE_PUBLIC_URL` (hoặc `BETTER_AUTH_URL`) trong `.env`.

## Triển khai (production)

Web chạy tại **https://thcsngason.online** trên một VPS (Ubuntu 22.04, dùng chung với các site khác).

```
Người dùng ─HTTPS─▶ Cloudflare (proxy, Full strict, Always Use HTTPS)
           ─HTTPS─▶ nginx trên VPS (chứng chỉ Let's Encrypt, /etc/nginx/sites-available/thcsngason.online)
           ─HTTP──▶ container nga-son-hoc-tap (chỉ nghe 127.0.0.1:3210)
```

- **Cập nhật code:** `deploy/deploy.sh` (địa chỉ VPS lấy từ tham số, biến `DEPLOY_HOST` hoặc file `deploy/.host` — file này không đưa lên git) — rsync mã lên `/opt/nga-son-hoc-tap` (không đụng `.env` và dữ liệu trên VPS), build lại container, kiểm tra `/api/health`.
- **Cấu hình production:** `/opt/nga-son-hoc-tap/.env` trên VPS (quyền 600): `PORT=127.0.0.1:3210`, `BETTER_AUTH_URL`/`LIVE_PUBLIC_URL=https://thcsngason.online`, secret riêng của production, Google OAuth, `TEACHER_EMAILS`.
- **Dữ liệu:** SQLite trong docker volume `nga-son-hoc-tap_sqlite-data`. Sao lưu: `docker exec nga-son-hoc-tap node -e "require('better-sqlite3')('/app/data/app.db').backup('/app/data/backup.db')"` rồi `docker cp nga-son-hoc-tap:/app/data/backup.db .`
- **nginx:** `deploy/nginx-thcsngason.online.conf` (SSE của lớp học trực tiếp không đệm, IP thật qua `CF-Connecting-IP`). Chứng chỉ do certbot cấp (`deploy/wait-cert.sh`), tự gia hạn bằng `certbot.timer`.
- **DNS:** quản lý trên Cloudflare bằng lệnh `cfdns` (`~/.local/bin/cfdns`, token chỉ có quyền DNS của thcsngason.online). Google OAuth client đã có redirect `https://thcsngason.online/api/auth/callback/google`.

## Công thức toán (KaTeX)

- Câu hỏi, đáp án, giải thích hiển thị công thức chuẩn sách giáo khoa bằng **KaTeX** (đóng gói trong app, không cần mạng ngoài). Viết LaTeX trong `\( … \)` (trong dòng) hoặc `\[ … \]` (dòng riêng, vd hệ phương trình). **Không dùng `$…$`** vì câu Tin học có địa chỉ ô Excel như `$B$1`. Câu không có `\( \)` vẫn hiển thị như cũ (`x^2` → x²).
- Trang giáo viên có hàng nút chèn công thức (phân số, căn, mũ, chỉ số, hệ phương trình, ≤ ≥ ≠ ± × ÷ π °) và xem trước ngay khi gõ.
- Kho câu hỏi cũ viết công thức dạng chữ (`2/3`, `√(x-1)`, `x^2 − 5x + 6 = 0`) được chuyển tự động bởi `node scripts/math-format.mjs` (Toán + KHTN): sinh `src/db/seed/math-format.json` và danh sách rà soát `docs/math-format-review.md`. Khi khởi động, `src/db/migrate.ts` áp bảng này **chỉ khi nội dung trong DB còn đúng bản gốc** — câu giáo viên đã sửa giữ nguyên. Đơn vị đo viết thẳng (cm², kg/m³), công thức hoá học (H₂O, CaCO₃) để nguyên. Sau khi thêm câu hỏi mới vào kho, chạy lại script để cập nhật bảng.

## Trang “Bên trong ứng dụng” (`/cong-nghe`)

Giới thiệu cho học sinh THCS 4 công nghệ làm nên app: HTML, CSS, JavaScript, Cơ sở dữ liệu. Gồm: ví von xây ngôi nhà, lắp ráp thẻ câu hỏi qua 4 bước, khu thực hành (sửa HTML xem ngay trong khung sandbox không chạy script; thanh trượt CSS; chạy từng dòng JavaScript; hỏi bảng điểm bằng SQL), hành trình một cú bấm, “app này làm từ gì” và đố vui 5 câu. Mã ở `src/features/tech/`. Liên kết từ trang chủ và chân trang.

## Ứng dụng cài được (PWA) & chơi offline

- `src/app/manifest.ts`: tên, màu, biểu tượng (`public/icons/*`, vẽ lại bằng hình trường học), lối tắt (Đấu Trường, Thử thách, Vào lớp, Trò chơi).
- `/sw.js` (route `src/app/sw.js/route.ts`, mã ở `src/lib/pwa/sw-source.ts`): sinh lúc chạy, phiên bản = BUILD_ID + chữ ký file trò chơi → mỗi lần deploy trình duyệt tự cập nhật.
  - Lưu sẵn: trang `/offline`, trang chủ, 5 trang trò chơi và **toàn bộ file trò chơi** trong `public/games` (bỏ `_backup`, `_preview`) → mất mạng vẫn chơi được.
  - `/_next/static/*` lưu lâu; `/games` hỏi mạng trước (tối đa 4 giây) nên deploy game là thấy ngay; `/icons`, `/fonts` dùng bản lưu và cập nhật ngầm; trang: hỏi mạng trước, mất mạng mới dùng bản lưu, không có thì hiện `/offline`.
  - **Không bao giờ** lưu `/api/*` (điểm, đăng nhập, bảng xếp hạng) hay dữ liệu RSC.
  - Chỉ đăng ký ở bản production (`next build && next start`), không chạy khi `next dev`.
- Nút “Cài ứng dụng lên điện thoại” ở trang chủ (`src/features/portal/InstallApp.tsx`): Android/Chrome bấm là cài; iPhone hiện hướng dẫn Chia sẻ → Thêm vào MH chính; đã cài thì ẩn.
- Mất mạng: dải thông báo ở đáy (tự thu thành biểu tượng nhỏ sau 7 giây để không che trò chơi).

## Tiến trình chung: Điểm Tri Thức (XP), cấp độ, hồ sơ

- Luật tính ở `src/lib/progress-rules.ts` (dùng chung máy chủ và trình duyệt):
  - **XP:** Đấu Trường (thi đấu 10 + 3/câu đúng, luyện tập 5 + 2/câu), thử thách ngày (20 + 4/câu), bài tập (10 + 2/câu), trò chơi STEM (theo từng game).
  - **Giới hạn:** mỗi game chỉ cộng XP cho **3 lượt/ngày**.
  - **Cấp độ:** 10 cấp ("Mầm non tri thức" → "Nhà thông thái Nga Sơn").
  - **Chuỗi ngày học:** tính chung mọi hoạt động.
  - **Huy hiệu:** 6 huy hiệu trò chơi, cộng với 8 huy hiệu Đấu Trường sẵn có.
- **Trò chơi báo kết quả** qua `public/games/ket-qua.js` (`nsGame.start()` / `nsGame.result({...})`, gửi `postMessage` cho trang cha cùng tên miền).
  - `GameFrame` chỉ nhận tin từ đúng iframe của mình.
  - Tài khoản đăng nhập: gửi `POST /api/games/result`. Khách: lưu ở localStorage `dttt.v1.games`.
  - Máy chủ chặn kết quả vô lý (vượt điểm tối đa, thiếu hoặc quá ít thời gian chơi, gửi liên tục dưới 8 giây). Điểm game vẫn nằm ở trình duyệt nên không chống gian lận tuyệt đối; bảng Đấu Trường không trộn điểm game.
  - **Game mới:** gọi `nsGame.start()` khi bắt đầu lượt, `nsGame.result({ game: "<slug>", score, correct, total, victory })` khi kết thúc, rồi thêm luật vào `GAME_RULES`.
- **Bảng `game_plays`** (migration `0005_game_plays`).
- **API:** `GET /api/progress`, `GET /api/leaderboard/xp?period=`, `GET /api/leaderboard/games?game=&total=&period=`.
- **Giao diện:**
  - Trang `/ho-so`.
  - Huy hiệu cấp độ trên thanh trên cùng.
  - Bảng xếp hạng có 3 tab: `?bang=xp` và `?bang=game`.
