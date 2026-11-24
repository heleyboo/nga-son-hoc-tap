/**
 * Danh mục phân hệ của cổng. Các trò chơi STEM chạy độc lập (HTML tĩnh ở
 * public/games/*), được mở trong trang /tro-choi/[slug] để có điều hướng chung.
 */
export type GameSlug = "chien-co" | "quy-dao" | "tau-ngam" | "duong-sang-lang-coi" | "lang-coi-mo-hoi";

export interface Game {
  slug: GameSlug;
  file: string;          // đường dẫn file tĩnh
  no: string;            // "01"
  title: string;
  realm: string;         // "Vũ trụ"
  tagline: string;
  desc: string;
  topics: string;
  chips: string[];
  controls: { desktop: string; touch: string };
  from: string;          // màu gradient
  to: string;
  soft: string;
  ink: string;
}

export const GAMES: Game[] = [
  {
    slug: "chien-co",
    file: "/games/web1.html",
    no: "01",
    title: "Chiến Cơ Kiến Thức",
    realm: "Vũ trụ",
    tagline: "Lái phi thuyền, bắn trúng đĩa bay mang đáp án đúng",
    desc: "Vượt qua 30 thử thách lịch sử, địa danh và khoa học tự nhiên. Bắn liên tiếp đúng để nhân điểm Combo.",
    topics: "Lịch sử · Địa lý · Khoa học",
    chips: ["30 câu hỏi", "Chế độ nhanh 10 câu", "Combo nhân điểm"],
    controls: { desktop: "Chuột hoặc ◀ ▶ / A D · Space để bắn", touch: "Kéo cần lái tròn bên trái · chạm Bắn bên phải" },
    from: "#4f46e5", to: "#0369a1", soft: "#e0e7ff", ink: "#3730a3",
  },
  {
    slug: "quy-dao",
    file: "/games/web2.html",
    no: "02",
    title: "Quỹ Đạo Xanh Trái Đất",
    realm: "Quỹ đạo",
    tagline: "Bay vòng quanh Trái Đất, khám phá kỳ quan thế giới",
    desc: "Quan sát hành tinh từ vệ tinh, ghé 8 kỳ quan và trả lời câu hỏi môi trường để phục hồi bầu khí quyển xanh.",
    topics: "Môi trường · Địa lý thế giới",
    chips: ["8 kỳ quan", "Chế độ nhanh 4 kỳ quan", "Pháo hoa chiến thắng"],
    controls: { desktop: "Click kỳ quan hoặc ◀ ▶ · Enter để khám phá", touch: "Chạm kỳ quan · vuốt ngang để bay" },
    from: "#059669", to: "#0f766e", soft: "#d1fae5", ink: "#065f46",
  },
  {
    slug: "tau-ngam",
    file: "/games/web3.html",
    no: "03",
    title: "Tàu Ngầm Xanh Đại Dương",
    realm: "Đại dương",
    tagline: "Lặn sâu, dọn rác nhựa và mở ngọc trai tri thức",
    desc: "Đi qua 3 tầng biển, gom rác giữ chuỗi Combo, né thủy lôi, kích hoạt Sonar và trả lời câu hỏi bảo vệ sinh vật biển.",
    topics: "Biển đảo · Bảo vệ đại dương",
    chips: ["3 tầng biển", "10 ngọc trai tri thức", "Sóng Sonar"],
    controls: { desktop: "Chuột hoặc A D · Space phóng Sonar", touch: "Kéo ngang để lái · nút Sonar" },
    from: "#0891b2", to: "#1e40af", soft: "#cffafe", ink: "#155e75",
  },
  {
    slug: "duong-sang-lang-coi",
    file: "/games/lang-coi/index.html",
    no: "05",
    title: "Đường Sáng Làng Cói 3D",
    realm: "Làng nghề",
    tagline: "Xoay gương, thắp sáng bến thuyền Nga Sơn",
    desc: "Cùng Cói dẫn tia sáng qua sân phơi và bến thuyền. Khám phá định luật phản xạ trên sa bàn làng nghề ba chiều.",
    topics: "Vật lý · Quang học",
    chips: ["2 màn thử thách", "Sa bàn 3D", "Đo góc phản xạ"],
    controls: { desktop: "Phím 1, 2 chọn gương · Phím mũi tên chỉnh góc", touch: "Chạm chọn gương · Dùng nút xoay và nghiêng" },
    from: "#92501f", to: "#57416e", soft: "#ffebc4", ink: "#784019",
  },
  {
    slug: "lang-coi-mo-hoi",
    file: "/games/mo-hoi/index.html",
    no: "06",
    title: "Làng Cói mở hội",
    realm: "Phiên chợ",
    tagline: "Ba thử thách mở phiên chợ Nga Sơn",
    desc: "Trải chiếu quanh bồn hoa, tách muối khỏi cát rồi cân kiện cói lên xe. Mỗi màn là một bài thực hành trên sa bàn 3D.",
    topics: "Toán học · Hóa học · Vật lý",
    chips: ["3 minigame 3D", "Xưởng muối", "Cần cẩu cói"],
    controls: { desktop: "Chọn vật trên sa bàn hoặc dùng Tab và Enter", touch: "Chạm ô sân, dụng cụ hoặc móc treo để thao tác" },
    from: "#245c49", to: "#6f4b32", soft: "#e4eed9", ink: "#254a3b",
  },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
