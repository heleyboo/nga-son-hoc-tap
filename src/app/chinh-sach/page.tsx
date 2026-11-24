import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { ArenaShell } from "@/features/arena/ArenaShell";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư",
  description: "Web Học Tập THCS Nga Sơn thu thập những dữ liệu gì, dùng để làm gì, ai xem được và cách yêu cầu sửa hoặc xoá.",
};

const UPDATED = "23/11/2026";

/** Email liên hệ đọc lúc chạy (PRIVACY_CONTACT_EMAIL trong .env), không đóng cứng vào mã */
async function Contact() {
  await connection();
  const email = process.env.PRIVACY_CONTACT_EMAIL?.trim();
  return email ? (
    <p>
      Gửi email tới <a className="font-bold text-deep underline" href={`mailto:${email}`}>{email}</a> và ghi rõ tên hiển thị, lớp
      (hoặc email Google đã dùng để đăng nhập) để chúng tôi tìm đúng dữ liệu của bạn.
    </p>
  ) : (
    <p>Liên hệ thầy cô phụ trách dự án tại Trường THCS Nga Sơn và nêu rõ tên hiển thị, lớp hoặc email Google đã dùng để đăng nhập.</p>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-black text-ink text-[length:var(--fs-h2)] leading-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-ink-2 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_b]:text-ink">{children}</div>
    </section>
  );
}

const TOC = [
  ["tom-tat", "Tóm tắt"],
  ["thu-thap", "Chúng tôi thu thập gì"],
  ["muc-dich", "Dùng để làm gì"],
  ["ai-xem", "Ai xem được dữ liệu"],
  ["ben-thu-ba", "Dịch vụ bên ngoài"],
  ["thiet-bi", "Cookie và lưu trữ trên thiết bị"],
  ["luu-tru", "Lưu trữ và bảo mật"],
  ["quyen", "Quyền của bạn"],
  ["tre-em", "Học sinh dưới 16 tuổi"],
  ["lien-he", "Liên hệ"],
] as const;

/** Trang chính sách quyền riêng tư (dùng cho màn hình đăng nhập Google và người dùng) */
export default function PrivacyPage() {
  return (
    <ArenaShell>
      <main className="container-arena max-w-3xl py-8 sm:py-12">
        <Link href="/" className="text-sm font-bold text-ink-3 hover:text-deep">← Trang chủ</Link>
        <h1 className="mt-3 font-black text-[length:var(--fs-h1)] leading-tight title-gradient">Chính sách quyền riêng tư</h1>
        <p className="mt-2 text-ink-3 font-semibold">Web Học Tập THCS Nga Sơn · thcsngason.online · Cập nhật lần cuối: {UPDATED}</p>

        <nav aria-label="Mục lục" className="glass-soft rounded-[var(--radius-card)] mt-6 p-5">
          <p className="font-bold text-ink mb-2">Mục lục</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1 list-decimal pl-5 text-ink-2">
            {TOC.map(([id, t]) => <li key={id}><a href={`#${id}`} className="hover:text-deep hover:underline">{t}</a></li>)}
          </ol>
        </nav>

        <div className="glass mt-6 p-6 sm:p-8 space-y-9">
          <Section id="tom-tat" title="1. Tóm tắt">
            <p>
              Web Học Tập THCS Nga Sơn là sản phẩm STEM của Trường THCS Nga Sơn, giúp học sinh khối 6–9 ôn luyện kiến thức qua trắc nghiệm,
              thử thách mỗi ngày, lớp học trực tiếp, bài tập thầy cô giao và trò chơi giáo dục.
            </p>
            <ul>
              <li>Bạn có thể dùng hầu hết tính năng <b>không cần đăng nhập</b>.</li>
              <li>Nếu đăng nhập bằng Google, chúng tôi chỉ nhận tên, email và ảnh đại diện để lưu điểm và hiện trên bảng xếp hạng. <b>Chúng tôi không bao giờ nhận mật khẩu Google của bạn.</b></li>
              <li>Bảng xếp hạng chỉ hiện <b>tên hiển thị, lớp và điểm</b>, không hiện email hay ảnh.</li>
              <li>Không quảng cáo, không bán dữ liệu, không dùng công cụ theo dõi hay phân tích của bên thứ ba.</li>
            </ul>
          </Section>

          <Section id="thu-thap" title="2. Chúng tôi thu thập gì">
            <p><b>Khi bạn đăng nhập bằng Google</b> (không bắt buộc):</p>
            <ul>
              <li>Họ tên, địa chỉ email, ảnh đại diện và mã định danh tài khoản Google, do Google gửi sau khi bạn đồng ý.</li>
              <li>Tên hiển thị (mặc định là tên gọi trong tài khoản Google) và lớp (do bạn tự nhập). Bạn có thể đổi bất cứ lúc nào.</li>
              <li>Thông tin phiên đăng nhập: mã phiên, thời điểm đăng nhập, địa chỉ IP và loại trình duyệt, dùng để giữ bạn đăng nhập (tối đa 30 ngày) và phát hiện truy cập bất thường.</li>
            </ul>
            <p><b>Khi bạn học và chơi</b>:</p>
            <ul>
              <li>Kết quả các lượt làm bài: khối, cấp độ, môn, câu đã trả lời, đúng/sai, thời gian trả lời, điểm và thời điểm làm bài.</li>
              <li>Thử thách mỗi ngày: các câu trả lời, điểm, chuỗi ngày liên tiếp.</li>
              <li>Bài tập thầy cô giao và Lớp học trực tiếp: <b>tên và lớp bạn tự nhập</b> khi vào bài hoặc vào phòng, câu trả lời, điểm và thứ hạng.</li>
              <li>Góp ý về bộ đề và báo lỗi câu hỏi: nội dung bạn tự nguyện gửi.</li>
              <li>Thẻ thành tích, chỉ khi bạn bấm “Chia sẻ”: tên hiển thị, lớp, điểm, số câu đúng, chuỗi ngày và hạng. Thẻ có đường dẫn riêng, <b>ai có đường dẫn đều xem được</b>.</li>
            </ul>
            <p><b>Chúng tôi không thu thập</b> số điện thoại, địa chỉ nhà, ngày sinh, thông tin thanh toán hay danh bạ.</p>
          </Section>

          <Section id="muc-dich" title="3. Dùng để làm gì">
            <ul>
              <li>Chấm điểm, lưu lịch sử học tập, huy hiệu và chuỗi ngày của bạn.</li>
              <li>Hiển thị bảng xếp hạng theo tuần, tháng và theo ngày.</li>
              <li>Giúp thầy cô theo dõi kết quả bài tập, lớp học trực tiếp và biết câu hỏi nào học sinh hay sai để ôn lại.</li>
              <li>Sửa câu hỏi sai sót dựa trên báo lỗi và góp ý.</li>
              <li>Giữ an toàn cho hệ thống (chống gian lận điểm, chống truy cập trái phép).</li>
            </ul>
            <p>Chúng tôi không dùng dữ liệu của bạn để quảng cáo hay lập hồ sơ cho bất kỳ mục đích nào khác ngoài học tập.</p>
          </Section>

          <Section id="ai-xem" title="4. Ai xem được dữ liệu">
            <ul>
              <li><b>Mọi người dùng</b>: bảng xếp hạng (tên hiển thị, lớp, điểm) và thẻ thành tích bạn đã chia sẻ.</li>
              <li><b>Thầy cô có tài khoản giáo viên của trường</b>: kết quả các bài tập và buổi lớp học trực tiếp trên hệ thống (tên, lớp, điểm, câu trả lời), thống kê câu hỏi, góp ý và báo lỗi.</li>
              <li><b>Người quản trị kỹ thuật</b> của dự án: chỉ truy cập dữ liệu khi cần vận hành, sửa lỗi hoặc xử lý yêu cầu của bạn.</li>
            </ul>
            <p>Chúng tôi <b>không bán, không cho thuê</b> dữ liệu cá nhân. Chúng tôi chỉ cung cấp dữ liệu cho cơ quan có thẩm quyền khi pháp luật Việt Nam yêu cầu.</p>
          </Section>

          <Section id="ben-thu-ba" title="5. Dịch vụ bên ngoài chúng tôi sử dụng">
            <ul>
              <li><b>Google</b>: đăng nhập bằng tài khoản Google (OAuth). Google xử lý việc đăng nhập theo <a className="text-deep underline" href="https://policies.google.com/privacy?hl=vi" target="_blank" rel="noopener noreferrer">Chính sách quyền riêng tư của Google</a>.</li>
              <li><b>Cloudflare</b>: quản lý tên miền, mã hoá HTTPS và bảo vệ website khỏi tấn công. Mọi truy cập đi qua Cloudflare nên Cloudflare thấy địa chỉ IP và thông tin kỹ thuật của yêu cầu.</li>
              <li><b>Máy chủ lưu trữ (VPS)</b>: nơi chạy website và lưu cơ sở dữ liệu. Nhật ký truy cập của máy chủ ghi địa chỉ IP và trang được mở để vận hành và bảo mật.</li>
              <li><b>Facebook / Zalo / Messenger</b>: chỉ khi bạn tự bấm chia sẻ thẻ thành tích lên các dịch vụ đó.</li>
            </ul>
          </Section>

          <Section id="thiet-bi" title="6. Cookie và lưu trữ trên thiết bị">
            <ul>
              <li><b>Cookie phiên đăng nhập</b>: chỉ có khi bạn đăng nhập, dùng để nhận ra bạn ở các lần mở trang sau. Đăng xuất là cookie bị xoá.</li>
              <li><b>Bộ nhớ trình duyệt (localStorage/sessionStorage)</b>: lưu trên chính máy của bạn tên và lớp đã nhập, lịch sử và chuỗi ngày khi chơi ở chế độ khách, khối lớp đã chọn và lượt chơi đang làm dở. Dữ liệu này không tự gửi lên máy chủ. Bạn xoá được bằng cách xoá dữ liệu trang web trong cài đặt trình duyệt.</li>
              <li>Cloudflare có thể đặt cookie kỹ thuật để chống bot và tấn công. Chúng tôi không dùng cookie quảng cáo hay cookie theo dõi.</li>
            </ul>
          </Section>

          <Section id="luu-tru" title="7. Lưu trữ và bảo mật">
            <ul>
              <li>Mọi kết nối tới website đều được mã hoá HTTPS.</li>
              <li>Điểm số được máy chủ tự chấm. Đáp án không gửi về trình duyệt trước khi bạn trả lời.</li>
              <li>Dữ liệu được lưu trong suốt thời gian bạn còn sử dụng website, để giữ lịch sử và bảng xếp hạng. Bạn có thể yêu cầu xoá bất cứ lúc nào (xem mục 8).</li>
              <li>Phòng Lớp học trực tiếp chỉ tồn tại trong bộ nhớ máy chủ trong lúc học. Khi buổi học kết thúc, chỉ bảng điểm của buổi đó được lưu lại cho thầy cô.</li>
            </ul>
          </Section>

          <Section id="quyen" title="8. Quyền của bạn">
            <ul>
              <li><b>Xem và sửa</b>: đổi tên hiển thị và lớp ngay trong trang Đấu Trường sau khi đăng nhập. Xem lịch sử ở mục “Thành tích của tôi”.</li>
              <li><b>Xoá</b>: yêu cầu xoá tài khoản cùng toàn bộ kết quả gắn với tài khoản, hoặc gỡ một thẻ thành tích đã chia sẻ. Chúng tôi xử lý trong vòng 30 ngày.</li>
              <li><b>Rút lại quyền truy cập Google</b>: bất cứ lúc nào tại <a className="text-deep underline" href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.</li>
              <li><b>Không đăng nhập</b>: bạn vẫn học và chơi được ở chế độ khách.</li>
            </ul>
          </Section>

          <Section id="tre-em" title="9. Học sinh dưới 16 tuổi">
            <p>
              Website dành cho học sinh THCS. Với học sinh dưới 16 tuổi, chúng tôi khuyến khích cha mẹ, người giám hộ hoặc thầy cô biết và đồng ý trước khi
              em đăng nhập bằng tài khoản Google. Cha mẹ có thể liên hệ chúng tôi (mục 10) để xem hoặc yêu cầu xoá dữ liệu của con em mình.
              Ở chế độ khách, học sinh không cần cung cấp thông tin gì ngoài tên hiển thị tự chọn.
            </p>
          </Section>

          <Section id="lien-he" title="10. Liên hệ và thay đổi chính sách">
            <Suspense fallback={<p>Liên hệ thầy cô phụ trách dự án tại Trường THCS Nga Sơn.</p>}><Contact /></Suspense>
            <p>Khi chính sách thay đổi, chúng tôi cập nhật trang này và ngày “Cập nhật lần cuối” ở đầu trang.</p>
          </Section>
        </div>
      </main>
    </ArenaShell>
  );
}
