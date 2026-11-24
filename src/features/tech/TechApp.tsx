"use client";
import { Blocks, Database, FileCode2, Home, Layers, Palette, Rocket, Route, Sparkles, Trophy, Zap } from "lucide-react";
import { ArenaShell } from "@/features/arena/ArenaShell";
import { TopBar } from "@/features/arena/components/TopBar";
import { CardBuilder, HouseAnalogy } from "./Builder";
import { Journey, TechQuiz } from "./Journey";
import { CssLab, DbLab, HtmlLab, JsLab } from "./Labs";
import { Remember, Section, TECH } from "./shared";

const TOC = [
  ["vi-von", "Ngôi nhà"], ["lap-rap", "Lắp ráp"], ["html", "HTML"], ["css", "CSS"], ["javascript", "JavaScript"],
  ["co-so-du-lieu", "Cơ sở dữ liệu"], ["hanh-trinh", "Hành trình"], ["app-nay", "App này"], ["do-vui", "Đố vui"],
] as const;

const STACK: { tech: keyof typeof TECH | "other"; name: string; what: string }[] = [
  { tech: "html", name: "HTML (qua React)", what: "Mỗi màn hình được ghép từ các “khối Lego” HTML nhỏ như thẻ câu hỏi, nút bấm, bảng xếp hạng." },
  { tech: "css", name: "CSS (Tailwind CSS)", what: "Màu xanh trời, nền kính mờ, góc bo tròn, tự co giãn vừa màn hình điện thoại lẫn máy chiếu." },
  { tech: "js", name: "JavaScript (React, Next.js)", what: "Đếm giờ, chấm điểm, âm thanh, lớp học trực tiếp. Phía máy chủ cũng viết bằng JavaScript." },
  { tech: "db", name: "Cơ sở dữ liệu SQLite", what: "Một file dữ liệu cất câu hỏi, lượt làm bài, điểm, bài tập và thử thách mỗi ngày." },
  { tech: "other", name: "KaTeX", what: "Vẽ công thức toán đẹp như sách: phân số, căn, số mũ." },
  { tech: "other", name: "Máy chủ, tên miền, Cloudflare", what: "Một máy tính chạy suốt ngày đêm ở trung tâm dữ liệu, có địa chỉ thcsngason.online, được bảo vệ và tăng tốc." },
];

export function TechApp() {
  return (
    <ArenaShell>
      <TopBar brand={{ title: "CÔNG NGHỆ", subtitle: "Web Học Tập THCS Nga Sơn", href: "/cong-nghe" }} />
      <main className="container-arena max-w-5xl pb-10">
        {/* Mở đầu */}
        <header className="pt-8 sm:pt-12 text-center">
          <span className="pill"><Sparkles className="size-4" aria-hidden /> Góc tìm hiểu công nghệ</span>
          <h1 className="mt-3 font-black uppercase tracking-tight text-[clamp(1.8rem,1.2rem+2.6vw,3.4rem)] leading-tight title-gradient">Một trang web được làm từ gì?</h1>
          <p className="mt-3 mx-auto max-w-2xl text-ink-2 text-lg leading-relaxed">
            Mỗi ngày em mở trang web để làm bài, chơi game, xem bảng xếp hạng. Phía sau màn hình đó là <b className="text-ink">4 công nghệ</b> phối hợp với nhau.
            Cùng “mở nắp” ứng dụng này ra xem nhé! Mỗi phần đều có chỗ để em <b className="text-ink">tự bấm, tự sửa, tự thử</b>.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {(["html", "css", "js", "db"] as const).map((k) => (
              <span key={k} className="rounded-full px-4 py-2 font-extrabold text-white text-sm sm:text-base" style={{ background: TECH[k].color }}>{TECH[k].name}</span>
            ))}
          </div>
        </header>

        <nav aria-label="Mục lục" className="sticky top-2 z-20 mt-8">
          <ol className="glass-soft rounded-2xl p-2 flex gap-1 overflow-x-auto scroll-pretty">
            {TOC.map(([id, t], i) => (
              <li key={id} className="shrink-0"><a href={`#${id}`} className="block rounded-xl px-3 py-2 text-sm font-bold text-ink-2 hover:bg-white hover:text-deep whitespace-nowrap">{i + 1}. {t}</a></li>
            ))}
          </ol>
        </nav>

        <Section id="vi-von" icon={Home} kicker="Phần 1 · Hình dung" title="Làm trang web giống như xây một ngôi nhà">
          <p className="text-ink-2 text-lg leading-relaxed">Hãy nhớ bốn vai trò này. Mọi trang web em từng dùng, từ YouTube tới trang của trường, đều được xây như vậy.</p>
          <HouseAnalogy />
        </Section>

        <Section id="lap-rap" icon={Blocks} kicker="Phần 2 · Tự tay lắp ráp" title="Từng lớp ghép lại thành một thẻ câu hỏi">
          <p className="text-ink-2 text-lg leading-relaxed">Đây là thẻ câu hỏi giống ở Đấu Trường Tri Thức. Bấm lần lượt từng nút để thêm từng công nghệ và xem nó thay đổi ra sao.</p>
          <CardBuilder />
        </Section>

        <Section id="html" tech="html" icon={FileCode2} kicker="Phần 3 · HTML" title="HTML: bộ khung của trang web">
          <p className="text-ink-2 text-lg leading-relaxed"><b className="text-ink">HTML</b> (HyperText Markup Language, ngôn ngữ đánh dấu siêu văn bản) cho trình duyệt biết <b className="text-ink">mỗi phần là gì</b>: đây là tiêu đề, đây là đoạn văn, đây là nút bấm.</p>
          <HtmlLab />
          <Remember tech="html">HTML trả lời câu hỏi <b>“Trên trang có GÌ?”</b>. Nội dung được bọc trong thẻ: <code>&lt;thẻ&gt;nội dung&lt;/thẻ&gt;</code>. Các thẻ lồng vào nhau như hộp trong hộp.</Remember>
        </Section>

        <Section id="css" tech="css" icon={Palette} kicker="Phần 4 · CSS" title="CSS: sơn màu và sắp xếp">
          <p className="text-ink-2 text-lg leading-relaxed"><b className="text-ink">CSS</b> (Cascading Style Sheets, bảng định kiểu) quyết định <b className="text-ink">trông ra sao</b>: màu gì, to hay nhỏ, nằm ở đâu, trên điện thoại thì xếp 1 cột, trên máy tính thì 2 cột. Kéo các thanh trượt dưới đây để tự thiết kế nút “Bắt đầu”.</p>
          <CssLab />
          <Remember tech="css">CSS trả lời câu hỏi <b>“Trông như THẾ NÀO?”</b>. Mỗi quy tắc = <b>chọn ai</b> + <code>{"{ thuộc tính: giá trị; }"}</code>. Cùng một HTML, đổi CSS là có giao diện hoàn toàn khác.</Remember>
        </Section>

        <Section id="javascript" tech="js" icon={Zap} kicker="Phần 5 · JavaScript" title="JavaScript: làm cho trang web biết hành động">
          <p className="text-ink-2 text-lg leading-relaxed"><b className="text-ink">JavaScript</b> là ngôn ngữ lập trình chạy ngay trong trình duyệt. Không có nó, trang web chỉ là tờ giấy đẹp: bấm vào không có gì xảy ra. Hãy bấm đáp án và quan sát dòng code được tô sáng.</p>
          <JsLab />
          <Remember tech="js">JavaScript trả lời câu hỏi <b>“Khi em bấm thì LÀM GÌ?”</b>. Máy chạy lệnh từ trên xuống; <b>biến</b> là hộp cất giá trị; <code>if … else</code> giúp máy ra quyết định. Đây chính là thuật toán em học ở môn Tin học!</Remember>
        </Section>

        <Section id="co-so-du-lieu" tech="db" icon={Database} kicker="Phần 6 · Cơ sở dữ liệu" title="Cơ sở dữ liệu: tủ hồ sơ khổng lồ">
          <p className="text-ink-2 text-lg leading-relaxed">Khi em tắt điện thoại, điểm của em vẫn còn. Đó là vì điểm được lưu ở <b className="text-ink">cơ sở dữ liệu</b> trên máy chủ, chứ không phải trên điện thoại. Hãy chọn điều kiện để “hỏi” bảng điểm bên dưới.</p>
          <DbLab />
          <Remember tech="db">Cơ sở dữ liệu trả lời câu hỏi <b>“Thông tin CẤT Ở ĐÂU?”</b>. Dữ liệu xếp thành <b>bảng</b> (cột = loại thông tin, hàng = bản ghi). Ta hỏi bằng SQL: <code>SELECT … FROM … WHERE …</code>.</Remember>
        </Section>

        <Section id="hanh-trinh" icon={Route} kicker="Phần 7 · Ghép lại" title="Hành trình một giây của một cú bấm">
          <p className="text-ink-2 text-lg leading-relaxed">Bốn công nghệ không làm việc riêng lẻ. Khi em chọn đáp án, chúng “chuyền bóng” cho nhau rất nhanh:</p>
          <Journey />
        </Section>

        <Section id="app-nay" icon={Layers} kicker="Phần 8 · Bật mí" title="Web Học Tập THCS Nga Sơn được làm từ gì?">
          <ul className="grid sm:grid-cols-2 gap-3">
            {STACK.map((s) => {
              const t = s.tech === "other" ? null : TECH[s.tech];
              return (
                <li key={s.name} className="glass p-4 border-l-8" style={{ borderLeftColor: t?.color ?? "#94a3b8" }}>
                  <p className="font-black text-ink">{s.name}</p>
                  <p className="mt-1 text-ink-2 text-sm leading-relaxed">{s.what}</p>
                </li>
              );
            })}
          </ul>
          <div className="glass p-5 sm:p-6">
            <p className="font-black text-ink text-lg flex items-center gap-2"><Rocket className="size-5 text-deep" aria-hidden /> Em muốn tự làm trang web?</p>
            <ul className="mt-2 space-y-2 text-ink-2 leading-relaxed list-disc pl-5">
              <li><b className="text-ink">Không cần cài gì cả:</b> mở Notepad, gõ vài thẻ HTML, lưu thành <code>trang-cua-em.html</code> rồi mở bằng trình duyệt.</li>
              <li><b className="text-ink">Soi trang web bất kỳ:</b> trên máy tính, nhấn <kbd className="rounded bg-white px-1.5 border">F12</kbd> (hoặc chuột phải → “Kiểm tra”) để xem HTML và CSS của trang đó. Thử sửa chữ ngay trong đó, chỉ máy em thấy, tải lại là mất.</li>
              <li><b className="text-ink">Học tiếp ở môn Tin học:</b> các bài về thuật toán, cấu trúc rẽ nhánh, vòng lặp, bảng tính và tạo trang web chính là nền móng của mọi thứ ở đây.</li>
            </ul>
          </div>
        </Section>

        <Section id="do-vui" icon={Trophy} kicker="Phần 9 · Kiểm tra nhanh" title="Đố vui: em đã hiểu chưa?">
          <TechQuiz />
        </Section>
      </main>
    </ArenaShell>
  );
}
