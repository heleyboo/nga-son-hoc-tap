# Chuyển công thức sang LaTeX — danh sách để thầy cô rà soát

Sinh bởi `node scripts/math-format.mjs`. 1082 trường (Toán, KHTN). Cột phải là nội dung mới, công thức nằm trong \\( … \\).

| Mã | Trường | Trước | Sau |
|---|---|---|---|
| 6-CB-003 | content | Kết quả của phép tính 2^3 là? | Kết quả của phép tính \(2^{3}\) là? |
| 6-CB-003 | explanation | 2^3 = 2 . 2 . 2 = 8. Lũy thừa là phép nhân nhiều thừa số bằng nhau, không phải 2 . 3 = 6. | \(2^{3} = 2 \cdot 2 \cdot 2 = 8\). Lũy thừa là phép nhân nhiều thừa số bằng nhau, không phải \(2 \cdot 3 = 6\). |
| 6-NC-001 | content | Tìm số nguyên n để (n+3) chia hết cho (n+1)? | Tìm số nguyên \(n\) để \((n+3)\) chia hết cho \((n+1)\)? |
| 6-NC-001 | options.0 | n=0 | \(n=0\) |
| 6-NC-001 | options.1 | n=1 | \(n=1\) |
| 6-NC-001 | options.2 | n=0 và n=1 | \(n=0\) và \(n=1\) |
| 6-NC-001 | options.3 | n=2 | \(n=2\) |
| 6-NC-001 | explanation | n + 3 = (n + 1) + 2, nên (n+3) chia hết cho (n+1) khi 2 chia hết cho (n+1). Với n tự nhiên: n + 1 = 1 hoặc 2, tức n = 0 hoặc n = 1. | \(n + 3 = (n + 1) + 2\), nên \((n+3)\) chia hết cho \((n+1)\) khi 2 chia hết cho \((n+1)\). Với \(n\) tự nhiên: \(n + 1 = 1\) hoặc 2, tức \(n = 0\) hoặc \(n = 1\). |
| 6-NC-002 | content | Số dư khi chia 2^100 cho 7 là? | Số dư khi chia \(2^{100}\) cho 7 là? |
| 6-NC-002 | explanation | 2^3 = 8 chia 7 dư 1. Vì 100 = 3.33 + 1 nên 2^100 = (2^3)^33 . 2 chia 7 có cùng số dư với 1 . 2 = 2. | \(2^{3} = 8\) chia 7 dư 1. Vì \(100 = 3 \cdot 33 + 1\) nên \(2^{100} = (2^{3})^{33} \cdot 2\) chia 7 có cùng số dư với \(1 \cdot 2 = 2\). |
| 6-NC-005 | content | Ước chung lớn nhất của 2n+1 và 6n+5 là? | Ước chung lớn nhất của \(2n+1\) và \(6n+5\) là? |
| 6-NC-005 | options.2 | n | \(n\) |
| 6-NC-005 | explanation | Gọi d = ƯCLN. Khi đó d là ước của (6n+5) - 3(2n+1) = 2, nên d = 1 hoặc 2. Vì 2n+1 lẻ nên d = 1. | Gọi \(d\) = ƯCLN. Khi đó \(d\) là ước của \((6n+5) - 3(2n+1) = 2\), nên \(d = 1\) hoặc 2. Vì \(2n+1\) lẻ nên \(d = 1\). |
| 6-NC-009 | content | Tổng các số nguyên x thỏa mãn -5 < x < 5 là? | Tổng các số nguyên \(x\) thỏa mãn \(-5 < x < 5\) là? |
| 6-NC-009 | explanation | Các số nguyên x là -4; -3; ...; 3; 4. Các cặp số đối nhau như (-4) + 4 có tổng bằng 0, nên tổng tất cả bằng 0. | Các số nguyên \(x\) là -4; -3; ...; 3; 4. Các cặp số đối nhau như \((-4) + 4\) có tổng bằng 0, nên tổng tất cả bằng 0. |
| 6-NC-012 | explanation | Diện tích hình vuông S = a . a. Nếu cạnh là 2a thì S = 2a . 2a = 4a^2, tức là gấp 4 lần. | Diện tích hình vuông \(S = a \cdot a\). Nếu cạnh là \(2a\) thì \(S = 2a \cdot 2a = 4a^{2}\), tức là gấp 4 lần. |
| 6-NC-014 | content | Kết quả phép tính: 1 - 2 + 3 - 4 + ... + 99 - 100 là? | Kết quả phép tính: \(1 - 2 + 3 - 4 + \ldots + 99 - 100\) là? |
| 6-NC-014 | explanation | Ghép từng cặp: (1 - 2) + (3 - 4) + ... + (99 - 100). Có 50 cặp, mỗi cặp bằng -1, nên tổng là -50. | Ghép từng cặp: \((1 - 2) + (3 - 4) + \ldots + (99 - 100)\). Có 50 cặp, mỗi cặp bằng -1, nên tổng là -50. |
| 7-CB-001 | explanation | Giá trị tuyệt đối là khoảng cách từ số đó đến 0 trên trục số, luôn không âm. Vậy \|-15\| = 15. | Giá trị tuyệt đối là khoảng cách từ số đó đến 0 trên trục số, luôn không âm. Vậy \(\|-15\| = 15\). |
| 7-CB-003 | options.0 | 1/2 | \(\frac{1}{2}\) |
| 7-CB-003 | options.2 | √2 | \(\sqrt{2}\) |
| 7-CB-003 | explanation | Số vô tỉ là số thập phân vô hạn không tuần hoàn. √2 = 1,41421… là số vô tỉ; còn 1/2, 0,5 và 3 đều là số hữu tỉ. | Số vô tỉ là số thập phân vô hạn không tuần hoàn. \(\sqrt{2}\) = 1,41421… là số vô tỉ; còn \(\frac{1}{2}\), 0,5 và 3 đều là số hữu tỉ. |
| 7-CB-004 | content | Nếu y tỉ lệ thuận với x theo hệ số k thì công thức biểu diễn là? | Nếu \(y\) tỉ lệ thuận với \(x\) theo hệ số \(k\) thì công thức biểu diễn là? |
| 7-CB-004 | options.0 | y = k/x | \(y = \frac{k}{x}\) |
| 7-CB-004 | options.1 | y = k.x | \(y = k \cdot x\) |
| 7-CB-004 | options.2 | x = y.k | \(x = y \cdot k\) |
| 7-CB-004 | options.3 | y = x + k | \(y = x + k\) |
| 7-CB-004 | explanation | y tỉ lệ thuận với x theo hệ số tỉ lệ k khi y = k . x (k là hằng số khác 0). Công thức y = k/x là tỉ lệ nghịch. | \(y\) tỉ lệ thuận với \(x\) theo hệ số tỉ lệ \(k\) khi y = k . x (k là hằng số khác 0). Công thức \(y = \frac{k}{x}\) là tỉ lệ nghịch. |
| 7-CB-009 | options.0 | v = s / t | \(v = s\) / t |
| 7-CB-009 | options.1 | v = s . t | \(v = s \cdot t\) |
| 7-CB-009 | options.2 | v = t / s | \(v = t\) / s |
| 7-CB-009 | options.3 | v = s + t | \(v = s + t\) |
| 7-CB-009 | explanation | Tốc độ bằng quãng đường chia cho thời gian đi quãng đường đó: v = s / t. | Tốc độ bằng quãng đường chia cho thời gian đi quãng đường đó: \(v = s\) / t. |
| 7-NC-001 | content | Tìm chữ số tận cùng của A = 2^1 + 2^2 + ... + 2^2024? | Tìm chữ số tận cùng của \(A = 2^{1} + 2^{2} + \ldots + 2^{2024}\)? |
| 7-NC-001 | explanation | Chữ số tận cùng của 2^n lặp theo chu kì 2, 4, 8, 6, mỗi nhóm 4 số hạng có tổng tận cùng là 0. 2024 chia hết cho 4 nên A tận cùng là 0. | Chữ số tận cùng của \(2^{n}\) lặp theo chu kì 2, 4, 8, 6, mỗi nhóm 4 số hạng có tổng tận cùng là 0. 2024 chia hết cho 4 nên \(A\) tận cùng là 0. |
| 7-NC-002 | content | Số dư khi chia 3^2024 cho 7 là? | Số dư khi chia \(3^{2024}\) cho 7 là? |
| 7-NC-002 | explanation | 3^6 = 729 chia 7 dư 1. Vì 2024 = 6.337 + 2 nên 3^2024 chia 7 có cùng số dư với 3^2 = 9, tức là dư 2. | \(3^{6} = 729\) chia 7 dư 1. Vì \(2024 = 6 \cdot 337 + 2\) nên \(3^{2024}\) chia 7 có cùng số dư với \(3^{2} = 9\), tức là dư 2. |
| 7-NC-005 | explanation | Góc phản xạ bằng góc tới = 30°. Góc hợp bởi tia tới và tia phản xạ bằng tổng hai góc: 30° + 30° = 60°. | Góc phản xạ bằng góc tới = 30°. Góc hợp bởi tia tới và tia phản xạ bằng tổng hai góc: \(30^\circ + 30^\circ = 60^\circ\). |
| 7-NC-006 | content | Giá trị nhỏ nhất của P = \|x-1\| + \|x-2024\| là? | Giá trị nhỏ nhất của \(P = \|x-1\| + \|x-2024\|\) là? |
| 7-NC-006 | explanation | \|x - 1\| + \|x - 2024\| = \|x - 1\| + \|2024 - x\| ≥ \|x - 1 + 2024 - x\| = 2023. Dấu '=' xảy ra khi 1 ≤ x ≤ 2024, nên GTNN là 2023. | \(\|x - 1\| + \|x - 2024\| = \|x - 1\| + \|2024 - x\| \ge \|x - 1 + 2024 - x\| = 2023\). Dấu '=' xảy ra khi \(1 \le x \le 2024\), nên GTNN là 2023. |
| 7-NC-008 | content | Cho a/b = c/d. Khẳng định nào SAI? | Cho \(\frac{a}{b} = \frac{c}{d}\). Khẳng định nào SAI? |
| 7-NC-008 | options.0 | ad=bc | \(ad=bc\) |
| 7-NC-008 | options.1 | a/c=b/d | \(\frac{a}{c}=\frac{b}{d}\) |
| 7-NC-008 | options.2 | a+b=c+d | \(a+b=c+d\) |
| 7-NC-008 | options.3 | (a+b)/b=(c+d)/d | \(\frac{a+b}{b}=\frac{c+d}{d}\) |
| 7-NC-008 | explanation | Từ a/b = c/d suy ra ad = bc, a/c = b/d và (a+b)/b = (c+d)/d. Nhưng a + b = c + d không luôn đúng, ví dụ 1/2 = 2/4 mà 1 + 2 ≠ 2 + 4. | Từ \(\frac{a}{b} = \frac{c}{d}\) suy ra \(ad = bc\), \(\frac{a}{c} = \frac{b}{d}\) và \(\frac{a+b}{b} = \frac{c+d}{d}\). Nhưng \(a + b = c + d\) không luôn đúng, ví dụ \(\frac{1}{2} = \frac{2}{4}\) mà \(1 + 2 \ne 2 + 4\). |
| 7-NC-011 | content | Đa thức x^2 + 1 có bao nhiêu nghiệm thực? | Đa thức \(x^{2} + 1\) có bao nhiêu nghiệm thực? |
| 7-NC-011 | explanation | Với mọi số thực x, x^2 ≥ 0 nên x^2 + 1 ≥ 1 > 0. Đa thức không bao giờ bằng 0, nên không có nghiệm thực. | Với mọi số thực \(x\), \(x^{2} \ge 0\) nên \(x^{2} + 1 \ge 1 > 0\). Đa thức không bao giờ bằng 0, nên không có nghiệm thực. |
| 8-CB-001 | content | Khai triển của hằng đẳng thức (a + b)^2 là? | Khai triển của hằng đẳng thức \((a + b)^{2}\) là? |
| 8-CB-001 | options.0 | a^2 + b^2 | \(a^{2} + b^{2}\) |
| 8-CB-001 | options.1 | a^2 + 2ab + b^2 | \(a^{2} + 2ab + b^{2}\) |
| 8-CB-001 | options.2 | a^2 - 2ab + b^2 | \(a^{2} - 2ab + b^{2}\) |
| 8-CB-001 | options.3 | a^2 + ab + b^2 | \(a^{2} + ab + b^{2}\) |
| 8-CB-001 | explanation | (a + b)^2 = (a + b)(a + b) = a^2 + 2ab + b^2. Đây là hằng đẳng thức bình phương của một tổng. | \((a + b)^{2} = (a + b)(a + b) = a^{2} + 2ab + b^{2}\). Đây là hằng đẳng thức bình phương của một tổng. |
| 8-CB-003 | content | Phân thức đại số A/B xác định khi nào? | Phân thức đại số \(\frac{A}{B}\) xác định khi nào? |
| 8-CB-003 | options.0 | A khác 0 | \(A\) khác 0 |
| 8-CB-003 | options.1 | B khác 0 | \(B\) khác 0 |
| 8-CB-003 | options.2 | A và B đều khác 0 | \(A\) và \(B\) đều khác 0 |
| 8-CB-003 | options.3 | A = B | \(A = B\) |
| 8-CB-003 | explanation | Phân thức A/B chỉ có nghĩa khi mẫu B khác 0, vì không thể chia cho 0. Tử A có thể bằng 0. | Phân thức \(\frac{A}{B}\) chỉ có nghĩa khi mẫu \(B\) khác 0, vì không thể chia cho 0. Tử \(A\) có thể bằng 0. |
| 8-CB-011 | options.0 | P = F / S | \(P = F\) / S |
| 8-CB-011 | options.1 | P = F . S | \(P = F \cdot S\) |
| 8-CB-011 | options.2 | P = S / F | \(P = S\) / F |
| 8-CB-011 | options.3 | P = m . g | \(P = m \cdot g\) |
| 8-CB-011 | explanation | Áp suất bằng áp lực chia cho diện tích bị ép: p = F / S, đơn vị là Pa (N/m²). | Áp suất bằng áp lực chia cho diện tích bị ép: \(p = F\) / S, đơn vị là Pa \((\frac{N}{m}^2)\). |
| 8-CB-022 | explanation | Công cơ học A = F . s, đơn vị là jun (J), với 1 J = 1 N . 1 m. Oát (W) là đơn vị công suất, Niu-tơn (N) là đơn vị lực. | Công cơ học \(A = F \cdot s\), đơn vị là jun (J), với 1 J = 1 N . 1 m. Oát (W) là đơn vị công suất, Niu-tơn (N) là đơn vị lực. |
| 8-NC-001 | content | Phân tích x^4 + 64 thành nhân tử? | Phân tích \(x^{4} + 64\) thành nhân tử? |
| 8-NC-001 | options.0 | (x2+8)2 | \((x^{2}+8)^{2}\) |
| 8-NC-001 | options.1 | (x2-4x+8)(x2+4x+8) | \((x^{2}-4x+8)(x^{2}+4x+8)\) |
| 8-NC-001 | options.2 | (x2-8)2 | \((x^{2}-8)^{2}\) |
| 8-NC-001 | options.3 | x2(x2+64) | \(x^{2}(x^{2}+64)\) |
| 8-NC-001 | explanation | x^4 + 64 = (x^2 + 8)^2 - 16x^2 = (x^2 + 8)^2 - (4x)^2 = (x^2 - 4x + 8)(x^2 + 4x + 8). | \(x^{4} + 64 = (x^{2} + 8)^{2} - 16x^{2} = (x^{2} + 8)^{2} - (4x)^{2} = (x^{2} - 4x + 8)(x^{2} + 4x + 8)\). |
| 8-NC-002 | options.2 | 5.26% | \(5 \cdot 26\%\) |
| 8-NC-002 | explanation | Khối lượng dung dịch = 10 + 190 = 200 g. C% = 10/200 . 100% = 5%. | Khối lượng dung dịch = \(10 + 190 = 200\) g. \(C\% = \frac{10}{200} \cdot 100\% = 5\%\). |
| 8-NC-004 | content | GTNN của A = x^2 - 6x + 2024 là? | GTNN của \(A = x^{2} - 6x + 2024\) là? |
| 8-NC-004 | explanation | A = x^2 - 6x + 9 + 2015 = (x - 3)^2 + 2015 ≥ 2015. Dấu '=' xảy ra khi x = 3, nên GTNN là 2015. | \(A = x^{2} - 6x + 9 + 2015 = (x - 3)^{2} + 2015 \ge 2015\). Dấu '=' xảy ra khi \(x = 3\), nên GTNN là 2015. |
| 8-NC-005 | content | Áp suất đáy bể nước cao 2m là? (d=10000) | Áp suất đáy bể nước cao 2m là? \((d=10000)\) |
| 8-NC-005 | explanation | Áp suất chất lỏng p = d . h = 10000 . 2 = 20000 Pa. | Áp suất chất lỏng \(p = d \cdot h = 10000 \cdot 2 = 20000\) Pa. |
| 8-NC-010 | explanation | F_A = d . V, với V là thể tích phần chất lỏng bị vật chiếm chỗ (phần chìm) và d là trọng lượng riêng chất lỏng; không phụ thuộc độ sâu. | \(F_A = d \cdot V\), với V là thể tích phần chất lỏng bị vật chiếm chỗ (phần chìm) và d là trọng lượng riêng chất lỏng; không phụ thuộc độ sâu. |
| 8-NC-011 | content | Cho x+y+z=0. Tính x^3+y^3+z^3? | Cho \(x+y+z=0\). Tính \(x^{3}+y^{3}+z^{3}\)? |
| 8-NC-011 | options.2 | 3xyz | \(3xyz\) |
| 8-NC-011 | options.3 | x2+y2+z2 | \(x^{2}+y^{2}+z^{2}\) |
| 8-NC-011 | explanation | Ta có x^3 + y^3 + z^3 - 3xyz = (x + y + z)(x^2 + y^2 + z^2 - xy - yz - zx). Vì x + y + z = 0 nên x^3 + y^3 + z^3 = 3xyz. | Ta có \(x^{3} + y^{3} + z^{3} - 3xyz = (x + y + z)(x^{2} + y^{2} + z^{2} - xy - yz - zx)\). Vì \(x + y + z = 0\) nên \(x^{3} + y^{3} + z^{3} = 3xyz\). |
| 8-NC-014 | options.0 | 1/3 | \(\frac{1}{3}\) |
| 8-NC-014 | options.1 | 1/2 | \(\frac{1}{2}\) |
| 8-NC-014 | options.2 | 2/3 | \(\frac{2}{3}\) |
| 8-NC-014 | options.3 | 1/4 | \(\frac{1}{4}\) |
| 8-NC-014 | explanation | Đường trung bình của tam giác song song và bằng 1/2 cạnh thứ ba (cạnh đáy). | Đường trung bình của tam giác song song và bằng \(\frac{1}{2}\) cạnh thứ ba (cạnh đáy). |
| 8-NC-015 | explanation | Tổng các góc của đa giác n cạnh là (n - 2) . 180°. Với ngũ giác: (5 - 2) . 180° = 540°. | Tổng các góc của đa giác \(n\) cạnh là \((n - 2) \cdot 180^\circ\). Với ngũ giác: \((5 - 2) \cdot 180^\circ = 540^\circ\). |
| 9-CB-001 | options.2 | ±9 | \(\pm 9\) |
| 9-CB-002 | content | Hàm số bậc nhất y = ax + b (a ≠ 0) đồng biến khi nào? | Hàm số bậc nhất \(y = ax + b (a \ne 0)\) đồng biến khi nào? |
| 9-CB-002 | options.0 | a > 0 | \(a > 0\) |
| 9-CB-002 | options.1 | a < 0 | \(a < 0\) |
| 9-CB-002 | options.2 | a = 0 | \(a = 0\) |
| 9-CB-002 | options.3 | b > 0 | \(b > 0\) |
| 9-CB-002 | explanation | Hàm số y = ax + b (a ≠ 0) đồng biến trên R khi a > 0 và nghịch biến khi a < 0. | Hàm số \(y = ax + b (a \ne 0)\) đồng biến trên \(R\) khi \(a > 0\) và nghịch biến khi \(a < 0\). |
| 9-CB-004 | content | Phương trình ax^2 + bx + c = 0 (a ≠ 0) có nghiệm kép khi Delta (Δ) bằng bao nhiêu? | Phương trình \(ax^{2} + bx + c = 0 (a \ne 0)\) có nghiệm kép khi Delta (Δ) bằng bao nhiêu? |
| 9-CB-004 | options.0 | Δ > 0 | \(\Delta > 0\) |
| 9-CB-004 | options.1 | Δ = 0 | \(\Delta = 0\) |
| 9-CB-004 | options.2 | Δ < 0 | \(\Delta < 0\) |
| 9-CB-004 | options.3 | Δ ≥ 0 | \(\Delta \ge 0\) |
| 9-CB-004 | explanation | Phương trình bậc hai có nghiệm kép khi Δ = 0, khi đó x1 = x2 = -b/(2a). | Phương trình bậc hai có nghiệm kép khi \(\Delta = 0\), khi đó \(x1 = x^{2} = -\frac{b}{2a}\). |
| 9-CB-011 | options.0 | I = U / R | \(I = U\) / R |
| 9-CB-011 | options.1 | I = U . R | \(I = U \cdot R\) |
| 9-CB-011 | options.2 | U = I / R | \(U = I\) / R |
| 9-CB-011 | options.3 | R = I / U | \(R = I\) / U |
| 9-CB-011 | explanation | Định luật Ôm: cường độ dòng điện tỉ lệ thuận với hiệu điện thế và tỉ lệ nghịch với điện trở, I = U / R. | Định luật Ôm: cường độ dòng điện tỉ lệ thuận với hiệu điện thế và tỉ lệ nghịch với điện trở, \(I = U\) / R. |
| 9-CB-020 | content | Cho phương trình x^2 - 5x + 6 = 0. Hai nghiệm x1, x2 có tổng bằng bao nhiêu (Theo Vi-ét)? | Cho phương trình \(x^{2} - 5x + 6 = 0\). Hai nghiệm x1, x2 có tổng bằng bao nhiêu (Theo Vi-ét)? |
| 9-CB-020 | explanation | Theo hệ thức Vi-ét: x1 + x2 = -b/a = -(-5)/1 = 5. (Kiểm tra: hai nghiệm là 2 và 3.) | Theo hệ thức Vi-ét: \(x1 + x^{2} = -\frac{b}{a} = -\frac{-5}{1} = 5\). (Kiểm tra: hai nghiệm là 2 và 3.) |
| 9-NC-001 | content | Cho x, y dương thỏa x+y=2. GTNN của P = 1/x + 1/y là? | Cho \(x\), \(y\) dương thỏa \(x+y=2\). GTNN của \(P = \frac{1}{x} + \frac{1}{y}\) là? |
| 9-NC-001 | explanation | Với x, y dương: 1/x + 1/y ≥ 4/(x + y) = 4/2 = 2. Dấu '=' xảy ra khi x = y = 1, nên GTNN của P là 2. | Với \(x\), \(y\) dương: \(\frac{1}{x} + \frac{1}{y} \ge \frac{4}{x + y} = \frac{4}{2} = 2\). Dấu '=' xảy ra khi \(x = y = 1\), nên GTNN của \(P\) là 2. |
| 9-NC-004 | content | GTLN của P = √(x-1) + √(3-x) là? | GTLN của \(P = \sqrt{x-1} + \sqrt{3-x}\) là? |
| 9-NC-004 | options.1 | √2 | \(\sqrt{2}\) |
| 9-NC-004 | options.3 | 2√2 | \(2\sqrt{2}\) |
| 9-NC-004 | explanation | Điều kiện 1 ≤ x ≤ 3. P^2 = 2 + 2√((x-1)(3-x)) ≤ 2 + (x - 1) + (3 - x) = 4, nên P ≤ 2. Dấu '=' khi x = 2. | Điều kiện \(1 \le x \le 3\). \(P^{2} = 2 + 2\sqrt{(x-1)(3-x)} \le 2 + (x - 1) + (3 - x) = 4\), nên \(P \le 2\). Dấu '=' khi \(x = 2\). |
| 9-NC-005 | explanation | Mắc song song: R = R1 . R2 / (R1 + R2) = 6 . 12 / (6 + 12) = 72/18 = 4 Ω. | Mắc song song: R = R1 . R2 / (R1 + R2) = 6 . 12 / \((6 + 12) = \frac{72}{18} = 4\) Ω. |
| 9-NC-006 | options.0 | 1/2 | \(\frac{1}{2}\) |
| 9-NC-006 | options.1 | √3/2 | \(\frac{\sqrt{3}}{2}\) |
| 9-NC-006 | explanation | sin 30° = 1/2. Trong tam giác vuông có góc 30°, cạnh đối diện góc 30° bằng nửa cạnh huyền. | \(\sin 30^\circ = \frac{1}{2}\). Trong tam giác vuông có góc 30°, cạnh đối diện góc 30° bằng nửa cạnh huyền. |
| 9-NC-009 | content | Hệ số góc đường thẳng y = -3x + 1 là? | Hệ số góc đường thẳng \(y = -3x + 1\) là? |
| 9-NC-009 | explanation | Đường thẳng y = ax + b có hệ số góc là a. Với y = -3x + 1 thì hệ số góc là -3. | Đường thẳng \(y = ax + b\) có hệ số góc là \(a\). Với \(y = -3x + 1\) thì hệ số góc là -3. |
| 9-NC-011 | explanation | Công suất điện P = U . I, đơn vị là oát (W). J là đơn vị công, A là đơn vị cường độ dòng điện, V là đơn vị hiệu điện thế. | Công suất điện \(P = U \cdot I\), đơn vị là oát (W). J là đơn vị công, A là đơn vị cường độ dòng điện, V là đơn vị hiệu điện thế. |
| 6-CB-102 | explanation | 29 chỉ có hai ước là 1 và 29. Các số 21 = 3 . 7, 27 = 3 . 9, 33 = 3 . 11 là hợp số dù đều là số lẻ. | 29 chỉ có hai ước là 1 và 29. Các số \(21 = 3 \cdot 7\), \(27 = 3 \cdot 9\), \(33 = 3 \cdot 11\) là hợp số dù đều là số lẻ. |
| 6-CB-103 | content | Giá trị của biểu thức 20 - 4 . 3 là? | Giá trị của biểu thức \(20 - 4 \cdot 3\) là? |
| 6-CB-103 | explanation | Nhân trước, trừ sau: 4 . 3 = 12, rồi 20 - 12 = 8. Làm từ trái sang phải (20 - 4) . 3 = 48 là sai thứ tự thực hiện. | Nhân trước, trừ sau: \(4 \cdot 3 = 12\), rồi \(20 - 12 = 8\). Làm từ trái sang phải \((20 - 4) \cdot 3 = 48\) là sai thứ tự thực hiện. |
| 6-CB-104 | content | Kết quả của phép tính (-7) + 12 là? | Kết quả của phép tính \((-7) + 12\) là? |
| 6-CB-104 | explanation | Cộng hai số nguyên khác dấu: 12 - 7 = 5, lấy dấu của số có giá trị tuyệt đối lớn hơn (12, dấu dương) nên kết quả là 5. | Cộng hai số nguyên khác dấu: \(12 - 7 = 5\), lấy dấu của số có giá trị tuyệt đối lớn hơn (12, dấu dương) nên kết quả là 5. |
| 6-CB-105 | content | Phân số nào sau đây bằng phân số 2/3? | Phân số nào sau đây bằng phân số \(\frac{2}{3}\)? |
| 6-CB-105 | options.0 | 6/9 | \(\frac{6}{9}\) |
| 6-CB-105 | options.1 | 4/9 | \(\frac{4}{9}\) |
| 6-CB-105 | options.2 | 3/2 | \(\frac{3}{2}\) |
| 6-CB-105 | options.3 | 5/6 | \(\frac{5}{6}\) |
| 6-CB-105 | explanation | Nhân cả tử và mẫu của 2/3 với 3 được 6/9. 4/9 chỉ nhân tử mà không nhân mẫu; 3/2 là phân số nghịch đảo của 2/3. | Nhân cả tử và mẫu của \(\frac{2}{3}\) với 3 được \(\frac{6}{9}\). \(\frac{4}{9}\) chỉ nhân tử mà không nhân mẫu; \(\frac{3}{2}\) là phân số nghịch đảo của \(\frac{2}{3}\). |
| 6-CB-106 | explanation | Chu vi = 2 . (8 + 5) = 26 cm. 13 cm mới là nửa chu vi, còn 40 là số đo diện tích (đơn vị cm^2). | Chu vi = \(2 \cdot (8 + 5) = 26\) cm. 13 cm mới là nửa chu vi, còn 40 là số đo diện tích (đơn vị cm²). |
| 6-NC-109 | explanation | Độ dãn của lò xo tỉ lệ với khối lượng vật treo. 300 g gấp 3 lần 100 g nên độ dãn là 3 . 2 = 6 cm. | Độ dãn của lò xo tỉ lệ với khối lượng vật treo. 300 g gấp 3 lần 100 g nên độ dãn là \(3 \cdot 2 = 6\) cm. |
| 6-NC-110 | explanation | Mỗi lần phân chia, 1 tế bào tạo 2 tế bào: 1 → 2 → 4 → 8, tức 2^3 = 8. Đáp án 6 là do nhầm thành phép nhân 3 . 2. | Mỗi lần phân chia, 1 tế bào tạo 2 tế bào: 1 → 2 → 4 → 8, tức \(2^{3} = 8\). Đáp án 6 là do nhầm thành phép nhân \(3 \cdot 2\). |
| 6-CB-201 | content | Tập hợp A = {x ∈ N \| 5 ≤ x < 12} có bao nhiêu phần tử? | Tập hợp \(A = \{x \in \mathbb{N} \| 5 \le x < 12\}\) có bao nhiêu phần tử? |
| 6-CB-202 | content | Kết quả của phép tính 3^4 . 3^5 viết dưới dạng một lũy thừa là? | Kết quả của phép tính \(3^{4} \cdot 3^{5}\) viết dưới dạng một lũy thừa là? |
| 6-CB-202 | options.0 | 3^9 | \(3^{9}\) |
| 6-CB-202 | options.1 | 3^20 | \(3^{20}\) |
| 6-CB-202 | options.2 | 9^9 | \(9^{9}\) |
| 6-CB-202 | options.3 | 3^1 | \(3^{1}\) |
| 6-CB-202 | explanation | Nhân hai lũy thừa cùng cơ số thì giữ nguyên cơ số và cộng số mũ: 3^4 . 3^5 = 3^(4+5) = 3^9. Lỗi hay gặp là nhân số mũ (ra 3^20) hoặc nhân luôn cả cơ số (ra 9^9). | Nhân hai lũy thừa cùng cơ số thì giữ nguyên cơ số và cộng số mũ: \(3^{4} \cdot 3^{5} = 3^{4+5} = 3^{9}\). Lỗi hay gặp là nhân số mũ (ra \(3^{20}\)) hoặc nhân luôn cả cơ số (ra \(9^{9}\)). |
| 6-CB-203 | explanation | XIV = X + IV = 10 + 4 = 14. Chữ I đứng trước V nghĩa là lấy 5 − 1 = 4. Nếu đọc thành X + V + I = 16 là nhầm vị trí của chữ I. | XIV = X + IV = \(10 + 4 = 14\). Chữ I đứng trước V nghĩa là lấy \(5 - 1 = 4\). Nếu đọc thành \(\mathrm{X} + \mathrm{V} + \mathrm{I} = 16\) là nhầm vị trí của chữ I. |
| 6-CB-205 | explanation | 36 = 2^2 . 3^2 và 60 = 2^2 . 3 . 5. Lấy các thừa số chung với số mũ nhỏ nhất: 2^2 . 3 = 12. Số 180 là BCNN(36, 60), không phải ƯCLN. | \(36 = 2^{2} \cdot 3^{2}\) và \(60 = 2^{2} \cdot 3 \cdot 5\). Lấy các thừa số chung với số mũ nhỏ nhất: \(2^{2} \cdot 3 = 12\). Số 180 là BCNN(36, 60), không phải ƯCLN. |
| 6-CB-206 | content | Bỏ dấu ngoặc rồi tính: 25 − (15 − 37) = ? | Bỏ dấu ngoặc rồi tính: \(25 - (15 - 37)\) = ? |
| 6-CB-206 | explanation | Trước ngoặc có dấu "−" nên khi bỏ ngoặc phải đổi dấu các số hạng bên trong: 25 − 15 + 37 = 47. Nếu quên đổi dấu sẽ ra 25 − 15 − 37 = −27. | Trước ngoặc có dấu "−" nên khi bỏ ngoặc phải đổi dấu các số hạng bên trong: \(25 - 15 + 37 = 47\). Nếu quên đổi dấu sẽ ra \(25 - 15 - 37 = -27\). |
| 6-CB-207 | explanation | Có 3 thừa số âm (số lẻ) nên tích mang dấu âm: 4 . 5 . 3 = 60, vậy tích bằng −60. Chọn 60 là quên quy tắc dấu; chọn −12 là cộng thay vì nhân. | Có 3 thừa số âm (số lẻ) nên tích mang dấu âm: \(4 \cdot 5 \cdot 3 = 60\), vậy tích bằng −60. Chọn 60 là quên quy tắc dấu; chọn −12 là cộng thay vì nhân. |
| 6-CB-208 | options.0 | 30 cm^2 | 30 cm² |
| 6-CB-208 | options.1 | 60 cm^2 | 60 cm² |
| 6-CB-208 | options.2 | 16 cm^2 | 16 cm² |
| 6-CB-208 | options.3 | 32 cm^2 | 32 cm² |
| 6-CB-208 | explanation | Diện tích hình thoi bằng nửa tích hai đường chéo: (10 . 6) : 2 = 30 cm^2. Chọn 60 cm^2 là quên chia 2; chọn 32 là lấy chu vi hình chữ nhật cạnh 10 và 6. | Diện tích hình thoi bằng nửa tích hai đường chéo: \((10 \cdot 6) : 2 = 30\) cm². Chọn 60 cm² là quên chia 2; chọn 32 là lấy chu vi hình chữ nhật cạnh 10 và 6. |
| 6-CB-210 | explanation | Chữ số hàng phần mười là 2, chữ số ngay sau là 8 ≥ 5 nên tăng 2 lên 3 và bỏ các chữ số phía sau: 7,3. Số 7,29 là làm tròn đến hàng phần trăm, chưa đúng yêu cầu. | Chữ số hàng phần mười là 2, chữ số ngay sau là \(8 \ge 5\) nên tăng 2 lên 3 và bỏ các chữ số phía sau: 7,3. Số 7,29 là làm tròn đến hàng phần trăm, chưa đúng yêu cầu. |
| 6-CB-211 | content | Lớp 6A có 40 học sinh, trong đó có 18 học sinh nữ. Tỉ số phần trăm của số học sinh nữ so với số học sinh cả lớp là? | Lớp \(6A\) có 40 học sinh, trong đó có 18 học sinh nữ. Tỉ số phần trăm của số học sinh nữ so với số học sinh cả lớp là? |
| 6-CB-211 | explanation | Tỉ số phần trăm là 18 : 40 . 100% = 45%. Số 55% là tỉ số của học sinh nam (22 bạn) so với cả lớp. | Tỉ số phần trăm là \(18 : 40 \cdot 100\% = 45\%\). Số 55% là tỉ số của học sinh nam (22 bạn) so với cả lớp. |
| 6-CB-212 | content | Tung một đồng xu 50 lần thì mặt N xuất hiện 22 lần. Xác suất thực nghiệm xuất hiện mặt N là? | Tung một đồng xu 50 lần thì mặt \(N\) xuất hiện 22 lần. Xác suất thực nghiệm xuất hiện mặt \(N\) là? |
| 6-CB-212 | options.0 | 11/25 | \(\frac{11}{25}\) |
| 6-CB-212 | options.1 | 14/25 | \(\frac{14}{25}\) |
| 6-CB-212 | options.2 | 1/2 | \(\frac{1}{2}\) |
| 6-CB-212 | options.3 | 11/28 | \(\frac{11}{28}\) |
| 6-CB-212 | explanation | Xác suất thực nghiệm = số lần mặt N xuất hiện : tổng số lần tung = 22/50 = 11/25. Phân số 14/25 là của mặt S (28 lần); 1/2 là xác suất lí thuyết, không phải kết quả thực nghiệm. | Xác suất thực nghiệm = số lần mặt \(N\) xuất hiện : tổng số lần tung = \(\frac{22}{50} = \frac{11}{25}\). Phân số \(\frac{14}{25}\) là của mặt S (28 lần); \(\frac{1}{2}\) là xác suất lí thuyết, không phải kết quả thực nghiệm. |
| 6-CB-231 | explanation | 1 giờ = 60 phút, mỗi phút có 60 giây, nên 1 giờ = 60 . 60 = 3 600 giây. Số 86 400 giây là thời gian của 1 ngày (24 giờ). | 1 giờ = 60 phút, mỗi phút có 60 giây, nên 1 giờ = \(60 \cdot 60 = 3\,600\) giây. Số 86 400 giây là thời gian của 1 ngày (24 giờ). |
| 6-NC-202 | content | Tính tổng S = 1/(1·2) + 1/(2·3) + 1/(3·4) + ... + 1/(9·10). | Tính tổng \(S = \frac{1}{1\cdot 2} + \frac{1}{2\cdot 3} + \frac{1}{3\cdot 4} + \ldots + \frac{1}{9\cdot 10}\). |
| 6-NC-202 | options.0 | 1/10 | \(\frac{1}{10}\) |
| 6-NC-202 | options.1 | 9/10 | \(\frac{9}{10}\) |
| 6-NC-202 | options.2 | 10/11 | \(\frac{10}{11}\) |
| 6-NC-202 | options.3 | 9/11 | \(\frac{9}{11}\) |
| 6-NC-202 | explanation | Ta có 1/(n(n+1)) = 1/n − 1/(n+1). Nên S = 1 − 1/2 + 1/2 − 1/3 + ... + 1/9 − 1/10 = 1 − 1/10 = 9/10. Chọn 1/10 là quên lấy 1 trừ đi. | Ta có \(\frac{1}{n(n+1)} = \frac{1}{n} - \frac{1}{n+1}\). Nên \(S = 1 - \frac{1}{2} + \frac{1}{2} - \frac{1}{3} + \ldots + \frac{1}{9} - \frac{1}{10} = 1 - \frac{1}{10} = \frac{9}{10}\). Chọn \(\frac{1}{10}\) là quên lấy 1 trừ đi. |
| 6-NC-203 | content | Có bao nhiêu số nguyên n để phân số (n + 5)/(n − 1) có giá trị là số nguyên? | Có bao nhiêu số nguyên \(n\) để phân số \(\frac{n + 5}{n - 1}\) có giá trị là số nguyên? |
| 6-NC-203 | explanation | (n + 5)/(n − 1) = 1 + 6/(n − 1). Cần (n − 1) là ước của 6, gồm ±1, ±2, ±3, ±6, tức 8 giá trị. Chọn 4 là chỉ tính các ước dương mà quên các ước âm. | \(\frac{n + 5}{n - 1} = 1 + \frac{6}{n - 1}\). Cần \((n - 1)\) là ước của 6, gồm \(\pm 1\), \(\pm 2\), \(\pm 3\), \(\pm 6\), tức 8 giá trị. Chọn 4 là chỉ tính các ước dương mà quên các ước âm. |
| 6-NC-204 | content | Chữ số tận cùng của 7^2023 là? | Chữ số tận cùng của \(7^{2023}\) là? |
| 6-NC-204 | explanation | Các lũy thừa 7^1, 7^2, 7^3, 7^4 lần lượt có chữ số tận cùng 7, 9, 3, 1, và lặp lại theo chu kì 4. Vì 2023 = 4 . 505 + 3 nên 7^2023 có tận cùng giống 7^3, tức là 3. | Các lũy thừa \(7^{1}\), \(7^{2}\), \(7^{3}\), \(7^{4}\) lần lượt có chữ số tận cùng 7, 9, 3, 1, và lặp lại theo chu kì 4. Vì \(2023 = 4 \cdot 505 + 3\) nên \(7^{2023}\) có tận cùng giống \(7^{3}\), tức là 3. |
| 6-NC-205 | content | Ngày đầu An đọc 1/3 số trang sách, ngày thứ hai đọc 3/5 số trang còn lại thì còn 40 trang chưa đọc. Quyển sách có bao nhiêu trang? | Ngày đầu An đọc \(\frac{1}{3}\) số trang sách, ngày thứ hai đọc \(\frac{3}{5}\) số trang còn lại thì còn 40 trang chưa đọc. Quyển sách có bao nhiêu trang? |
| 6-NC-205 | explanation | Sau ngày đầu còn 2/3 quyển. Ngày hai đọc 3/5 . 2/3 = 2/5 quyển. Phần còn lại là 2/3 − 2/5 = 4/15 quyển, ứng với 40 trang. Vậy cả quyển có 40 : 4/15 = 150 trang. | Sau ngày đầu còn \(\frac{2}{3}\) quyển. Ngày hai đọc \(\frac{3}{5} \cdot \frac{2}{3} = \frac{2}{5}\) quyển. Phần còn lại là \(\frac{2}{3} - \frac{2}{5} = \frac{4}{15}\) quyển, ứng với 40 trang. Vậy cả quyển có \(40 : \frac{4}{15} = 150\) trang. |
| 6-NC-206 | content | Trên tia Ox lấy hai điểm A, B sao cho OA = 2 cm, OB = 8 cm. Gọi M là trung điểm của AB. Độ dài đoạn OM là? | Trên tia Ox lấy hai điểm \(A\), B sao cho \(OA = 2\) cm, \(OB = 8\) cm. Gọi \(M\) là trung điểm của AB. Độ dài đoạn OM là? |
| 6-NC-206 | explanation | A nằm giữa O và B (vì 2 < 8) nên AB = 8 − 2 = 6 cm. M là trung điểm AB nên AM = 3 cm, và OM = OA + AM = 2 + 3 = 5 cm. Chọn 3 cm là nhầm OM với AM. | \(A\) nằm giữa \(O\) và \(B\) (vì \(2 < 8\)) nên \(AB = 8 - 2 = 6\) cm. \(M\) là trung điểm AB nên \(AM = 3\) cm, và \(OM = OA + AM = 2 + 3 = 5\) cm. Chọn 3 cm là nhầm OM với AM. |
| 6-NC-207 | explanation | Mỗi điểm nối được với 5 điểm còn lại, ra 6 . 5 = 30 lần nối. Nhưng mỗi đường thẳng bị đếm 2 lần (AB và BA), nên số đường thẳng là 30 : 2 = 15. Chọn 30 là quên chia 2. | Mỗi điểm nối được với 5 điểm còn lại, ra \(6 \cdot 5 = 30\) lần nối. Nhưng mỗi đường thẳng bị đếm 2 lần (AB và BA), nên số đường thẳng là \(30 : 2 = 15\). Chọn 30 là quên chia 2. |
| 6-NC-208 | explanation | Sau lần giảm 20%, giá áo là 250 000 . 80% = 200 000 đồng. Lần giảm thứ hai: 200 000 . 90% = 180 000 đồng. Chọn 175 000 là cộng gộp thành giảm 30% trên giá gốc, cách này sai. | Sau lần giảm 20%, giá áo là \(250\,000 \cdot 80\% = 200\,000\) đồng. Lần giảm thứ hai: \(200\,000 \cdot 90\% = 180\,000\) đồng. Chọn 175 000 là cộng gộp thành giảm 30% trên giá gốc, cách này sai. |
| 6-NC-219 | explanation | Khối lượng xi măng là 12 . 50 = 600 kg. Trọng lượng P = 10 . m = 10 . 600 = 6 000 N. Chọn 600 N là quên nhân 10 khi đổi từ khối lượng sang trọng lượng. | Khối lượng xi măng là \(12 \cdot 50 = 600\) kg. Trọng lượng \(P = 10 \cdot m = 10 \cdot 600 = 6\,000\) N. Chọn 600 N là quên nhân 10 khi đổi từ khối lượng sang trọng lượng. |
| 6-NC-220 | explanation | Theo định luật bảo toàn năng lượng: hao phí = 100 − 10 = 90 J. Với đèn sợi đốt, ánh sáng là có ích, phần hao phí chủ yếu chuyển thành nhiệt làm nóng bóng đèn. Đây cũng là lí do đèn sợi đốt tốn điện. | Theo định luật bảo toàn năng lượng: hao phí = \(100 - 10 = 90\) J. Với đèn sợi đốt, ánh sáng là có ích, phần hao phí chủ yếu chuyển thành nhiệt làm nóng bóng đèn. Đây cũng là lí do đèn sợi đốt tốn điện. |
| 6-CB-301 | content | Phân số 23/6 viết dưới dạng hỗn số là? | Phân số \(\frac{23}{6}\) viết dưới dạng hỗn số là? |
| 6-CB-301 | options.0 | 2 5/6 | \(2 \frac{5}{6}\) |
| 6-CB-301 | options.1 | 3 1/6 | \(3 \frac{1}{6}\) |
| 6-CB-301 | options.2 | 5 3/6 | \(5 \frac{3}{6}\) |
| 6-CB-301 | options.3 | 3 5/6 | \(3 \frac{5}{6}\) |
| 6-CB-301 | explanation | 23 : 6 = 3 dư 5 nên 23/6 = 3 5/6. Phương án 2 5/6 sai vì lấy nhầm thương là 2 (2 5/6 = 17/6). | \(23 : 6 = 3\) dư 5 nên \(\frac{23}{6} = 3 \frac{5}{6}\). Phương án \(2 \frac{5}{6}\) sai vì lấy nhầm thương là \(2 (2 \frac{5}{6} = \frac{17}{6})\). |
| 6-CB-302 | content | Hỗn số −3 2/5 viết dưới dạng phân số là? | Hỗn số \(-3 \frac{2}{5}\) viết dưới dạng phân số là? |
| 6-CB-302 | options.0 | −17/5 | \(-\frac{17}{5}\) |
| 6-CB-302 | options.1 | −13/5 | \(-\frac{13}{5}\) |
| 6-CB-302 | options.2 | −6/5 | \(-\frac{6}{5}\) |
| 6-CB-302 | options.3 | −32/5 | \(-\frac{32}{5}\) |
| 6-CB-302 | explanation | −3 2/5 = −(3 + 2/5) = −(15 + 2)/5 = −17/5. Phương án −13/5 sai vì đã tính −3 + 2/5, quên rằng dấu trừ áp dụng cho cả hỗn số. | \(-3 \frac{2}{5} = -(3 + \frac{2}{5}) = -\frac{15 + 2}{5} = -\frac{17}{5}\). Phương án \(-\frac{13}{5}\) sai vì đã tính \(-3 + \frac{2}{5}\), quên rằng dấu trừ áp dụng cho cả hỗn số. |
| 6-CB-303 | options.0 | 35/10 | \(\frac{35}{10}\) |
| 6-CB-303 | options.1 | 7/20 | \(\frac{7}{20}\) |
| 6-CB-303 | options.2 | 3/5 | \(\frac{3}{5}\) |
| 6-CB-303 | options.3 | 7/2 | \(\frac{7}{2}\) |
| 6-CB-303 | explanation | 0,35 = 35/100 = 7/20 (rút gọn cho 5). Phương án 35/10 sai vì 35/10 = 3,5, đặt nhầm số chữ số 0 ở mẫu. | \(0{,}35 = \frac{35}{100} = \frac{7}{20}\) (rút gọn cho 5). Phương án \(\frac{35}{10}\) sai vì \(\frac{35}{10} = 3{,}5\), đặt nhầm số chữ số 0 ở mẫu. |
| 6-CB-304 | explanation | Với số âm, số có phần số (bỏ dấu trừ) nhỏ hơn thì lớn hơn. 2,105 < 2,15 < 2,5 < 2,51 nên −2,105 lớn nhất. Chọn −2,51 là so sánh như số dương. | Với số âm, số có phần số (bỏ dấu trừ) nhỏ hơn thì lớn hơn. \(2{,}105 < 2{,}15 < 2{,}5 < 2{,}51\) nên −2,105 lớn nhất. Chọn −2,51 là so sánh như số dương. |
| 6-CB-305 | explanation | Chữ số hàng chục là 4 < 5 nên giữ nguyên hàng trăm và thay các chữ số sau bằng 0: 18 600. Chọn 18 700 là làm tròn lên sai quy tắc. | Chữ số hàng chục là \(4 < 5\) nên giữ nguyên hàng trăm và thay các chữ số sau bằng 0: 18 600. Chọn 18 700 là làm tròn lên sai quy tắc. |
| 6-CB-306 | content | Làm tròn mỗi thừa số đến hàng đơn vị, kết quả ước lượng của tích 39,8 · 5,1 là? | Làm tròn mỗi thừa số đến hàng đơn vị, kết quả ước lượng của tích \(39{,}8 \cdot 5{,}1\) là? |
| 6-CB-306 | explanation | 39,8 ≈ 40 và 5,1 ≈ 5 nên tích ≈ 40 · 5 = 200 (tích đúng là 202,98). Các phương án 20 và 2000 sai vị trí dấu phẩy, sai lệch gấp 10 lần. | 39,8 ≈ 40 và 5,1 ≈ 5 nên tích ≈ \(40 \cdot 5 = 200\) (tích đúng là 202,98). Các phương án 20 và 2000 sai vị trí dấu phẩy, sai lệch gấp 10 lần. |
| 6-CB-307 | explanation | 3 : 8 = 0,375 = 37,5%. Phương án 266,7% sai vì đã tính 8 : 3, nhầm thứ tự hai số; 0,375% là quên nhân với 100. | \(3 : 8 = 0{,}375 = 37{,}5\%\). Phương án 266,7% sai vì đã tính \(8 : 3\), nhầm thứ tự hai số; 0,375% là quên nhân với 100. |
| 6-CB-308 | explanation | 15% của 240 kg là 240 · 15 : 100 = 36 kg. Phương án 16 kg sai vì đã lấy 240 : 15. | 15% của 240 kg là \(240 \cdot 15 : 100 = 36\) kg. Phương án 16 kg sai vì đã lấy \(240 : 15\). |
| 6-CB-309 | content | Ba điểm A, O, B thẳng hàng, O nằm giữa A và B. Khẳng định nào đúng? | Ba điểm \(A\), \(O\), \(B\) thẳng hàng, \(O\) nằm giữa \(A\) và \(B\). Khẳng định nào đúng? |
| 6-CB-309 | explanation | O nằm giữa A và B nên hai tia chung gốc O là OA và OB tạo thành đường thẳng AB, chúng đối nhau. Tia AO và BO không chung gốc nên không thể là hai tia đối nhau. | \(O\) nằm giữa \(A\) và \(B\) nên hai tia chung gốc \(O\) là OA và OB tạo thành đường thẳng AB, chúng đối nhau. Tia AO và BO không chung gốc nên không thể là hai tia đối nhau. |
| 6-CB-310 | content | Phát biểu nào sau đây KHÔNG đúng về trung điểm M của đoạn thẳng AB? | Phát biểu nào sau đây KHÔNG đúng về trung điểm \(M\) của đoạn thẳng AB? |
| 6-CB-310 | options.0 | M nằm giữa A và B | \(M\) nằm giữa \(A\) và \(B\) |
| 6-CB-310 | options.1 | MA = MB = AB/2 | \(MA = MB = \frac{AB}{2}\) |
| 6-CB-310 | options.2 | Điểm cách đều A và B luôn là trung điểm của AB | Điểm cách đều \(A\) và \(B\) luôn là trung điểm của AB |
| 6-CB-310 | options.3 | AB = 2 · MA | \(AB = 2 \cdot MA\) |
| 6-CB-310 | explanation | Trung điểm phải vừa nằm giữa A, B vừa cách đều A và B. Một điểm cách đều A, B nhưng không nằm trên đoạn AB (như đỉnh tam giác cân) không phải trung điểm. | Trung điểm phải vừa nằm giữa \(A\), \(B\) vừa cách đều \(A\) và \(B\). Một điểm cách đều \(A\), \(B\) nhưng không nằm trên đoạn AB (như đỉnh tam giác cân) không phải trung điểm. |
| 6-CB-312 | explanation | Mặt đồng hồ chia 12 khoảng, mỗi khoảng 360° : 12 = 30°. Lúc 2 giờ, hai kim cách nhau 2 khoảng nên tạo góc 60°. Chọn 30° là chỉ tính một khoảng. | Mặt đồng hồ chia 12 khoảng, mỗi khoảng \(360^\circ : 12 = 30^\circ\). Lúc 2 giờ, hai kim cách nhau 2 khoảng nên tạo góc 60°. Chọn 30° là chỉ tính một khoảng. |
| 6-CB-313 | explanation | Mỗi cặp điểm cho một đoạn thẳng: 4 · 3 : 2 = 6 đoạn. Chọn 12 là đếm AB và BA thành hai đoạn khác nhau. | Mỗi cặp điểm cho một đoạn thẳng: \(4 \cdot 3 : 2 = 6\) đoạn. Chọn 12 là đếm AB và BA thành hai đoạn khác nhau. |
| 6-CB-314 | options.0 | Lớp 6B có số nữ giỏi hơn số nam giỏi 3 em | Lớp \(6B\) có số nữ giỏi hơn số nam giỏi 3 em |
| 6-CB-314 | options.1 | Lớp 6A có số nữ giỏi hơn số nam giỏi 1 em | Lớp \(6A\) có số nữ giỏi hơn số nam giỏi 1 em |
| 6-CB-314 | options.2 | Lớp 6A có số nữ giỏi hơn số nam giỏi 3 em | Lớp \(6A\) có số nữ giỏi hơn số nam giỏi 3 em |
| 6-CB-314 | options.3 | Lớp 6B có tổng số HS giỏi nhiều hơn 6A | Lớp \(6B\) có tổng số HS giỏi nhiều hơn \(6A\) |
| 6-CB-314 | explanation | Lớp 6A: 11 − 8 = 3 nữ nhiều hơn nam. Lớp 6B có nam nhiều hơn nữ. Tổng 6A là 19, tổng 6B là 17 nên 6B không nhiều hơn. | Lớp \(6A\): \(11 - 8 = 3\) nữ nhiều hơn nam. Lớp \(6B\) có nam nhiều hơn nữ. Tổng \(6A\) là 19, tổng \(6B\) là 17 nên \(6B\) không nhiều hơn. |
| 6-CB-315 | options.0 | Chiều cao (cm) của các bạn lớp 6A | Chiều cao (cm) của các bạn lớp \(6A\) |
| 6-CB-315 | options.2 | Môn thể thao yêu thích của các bạn lớp 6A | Môn thể thao yêu thích của các bạn lớp \(6A\) |
| 6-CB-315 | options.3 | Điểm kiểm tra Toán của lớp 6A | Điểm kiểm tra Toán của lớp \(6A\) |
| 6-CB-317 | options.0 | 1/6 | \(\frac{1}{6}\) |
| 6-CB-317 | options.1 | 1/5 | \(\frac{1}{5}\) |
| 6-CB-317 | options.2 | 4/5 | \(\frac{4}{5}\) |
| 6-CB-317 | options.3 | 1/8 | \(\frac{1}{8}\) |
| 6-CB-317 | explanation | Xác suất thực nghiệm = 8/40 = 1/5. Phương án 1/6 là xác suất lí thuyết, không phải kết quả từ 40 lần gieo; 4/5 là tỉ lệ không xuất hiện mặt 6. | Xác suất thực nghiệm = \(\frac{8}{40} = \frac{1}{5}\). Phương án \(\frac{1}{6}\) là xác suất lí thuyết, không phải kết quả từ 40 lần gieo; \(\frac{4}{5}\) là tỉ lệ không xuất hiện mặt 6. |
| 6-CB-318 | explanation | Các ước nguyên của 6 là ±1; ±2; ±3; ±6, tổng cộng 8 phần tử. Chọn 4 là quên các ước âm. | Các ước nguyên của 6 là \(\pm 1\); \(\pm 2\); \(\pm 3\); \(\pm 6\), tổng cộng 8 phần tử. Chọn 4 là quên các ước âm. |
| 6-CB-319 | explanation | Nhiệt độ buổi trưa: −2 + 7 = 5 (°C). Phương án −9 °C sai vì đã trừ đi 7 thay vì cộng thêm. | Nhiệt độ buổi trưa: \(-2 + 7 = 5 ({}^{\circ}\mathrm{C})\). Phương án −9 °C sai vì đã trừ đi 7 thay vì cộng thêm. |
| 6-CB-320 | explanation | Trên trục số, số bên trái nhỏ hơn: −7 < −3 < 0 < 2 < 5. Dãy bắt đầu bằng −3; −7 sai vì so sánh số âm như số dương. | Trên trục số, số bên trái nhỏ hơn: \(-7 < -3 < 0 < 2 < 5\). Dãy bắt đầu bằng −3; −7 sai vì so sánh số âm như số dương. |
| 6-CB-321 | explanation | 12 = 2^2 · 3; 18 = 2 · 3^2. BCNN = 2^2 · 3^2 = 36. Số 6 là ƯCLN; 216 là tích 12 · 18, chỉ là một bội chung chứ không nhỏ nhất. | \(12 = 2^{2} \cdot 3\); \(18 = 2 \cdot 3^{2}\). BCNN = \(2^{2} \cdot 3^{2} = 36\). Số 6 là ƯCLN; 216 là tích \(12 \cdot 18\), chỉ là một bội chung chứ không nhỏ nhất. |
| 6-CB-322 | options.0 | 2^3 · 15 | \(2^{3} \cdot 15\) |
| 6-CB-322 | options.1 | 2^2 · 3 · 10 | \(2^{2} \cdot 3 \cdot 10\) |
| 6-CB-322 | options.2 | 2^2 · 3^2 · 5 | \(2^{2} \cdot 3^{2} \cdot 5\) |
| 6-CB-322 | options.3 | 2^3 · 3 · 5 | \(2^{3} \cdot 3 \cdot 5\) |
| 6-CB-322 | explanation | 120 = 8 · 15 = 2^3 · 3 · 5. Cách 2^3 · 15 sai vì 15 không phải số nguyên tố; 2^2 · 3^2 · 5 = 180. | \(120 = 8 \cdot 15 = 2^{3} \cdot 3 \cdot 5\). Cách \(2^{3} \cdot 15\) sai vì 15 không phải số nguyên tố; \(2^{2} \cdot 3^{2} \cdot 5 = 180\). |
| 6-CB-323 | explanation | Vườn: 20 · 12 = 240 m². Bồn hoa: 10 · 8 : 2 = 40 m². Cỏ: 240 − 40 = 200 m². Chọn 160 m² là quên chia đôi khi tính diện tích hình thoi (240 − 80). | Vườn: \(20 \cdot 12 = 240 m^2\). Bồn hoa: \(10 \cdot 8 : 2 = 40 m^2\). Cỏ: \(240 - 40 = 200 m^2\). Chọn 160 m² là quên chia đôi khi tính diện tích hình thoi \((240 - 80)\). |
| 6-CB-324 | content | Điểm M thuộc tia Ox, điểm N thuộc tia đối của tia Ox (M, N khác O). Trong ba điểm M, O, N, điểm nào nằm giữa hai điểm còn lại? | Điểm \(M\) thuộc tia Ox, điểm \(N\) thuộc tia đối của tia Ox (M, \(N\) khác \(O\)). Trong ba điểm \(M\), \(O\), \(N\), điểm nào nằm giữa hai điểm còn lại? |
| 6-CB-324 | options.0 | Điểm M | Điểm \(M\) |
| 6-CB-324 | options.1 | Điểm O | Điểm \(O\) |
| 6-CB-324 | options.2 | Điểm N | Điểm \(N\) |
| 6-CB-324 | explanation | Ox và tia đối của nó tạo thành một đường thẳng, M và N nằm về hai phía của O nên O nằm giữa M và N. | Ox và tia đối của nó tạo thành một đường thẳng, \(M\) và \(N\) nằm về hai phía của \(O\) nên \(O\) nằm giữa \(M\) và \(N\). |
| 6-CB-325 | explanation | GHĐ là số lớn nhất ghi trên thước: 30 cm. ĐCNN là khoảng giữa hai vạch liên tiếp: 1 cm : 10 = 1 mm. Chọn 1 cm là nhầm ĐCNN với khoảng giữa hai số ghi. | GHĐ là số lớn nhất ghi trên thước: 30 cm. ĐCNN là khoảng giữa hai vạch liên tiếp: 1 cm : \(10 = 1\) mm. Chọn 1 cm là nhầm ĐCNN với khoảng giữa hai số ghi. |
| 6-NC-301 | content | Tính hợp lí: 5 3/7 − (2 1/4 + 1 3/7). | Tính hợp lí: \(5 \frac{3}{7} - (2 \frac{1}{4} + 1 \frac{3}{7})\). |
| 6-NC-301 | options.0 | 2 1/4 | \(2 \frac{1}{4}\) |
| 6-NC-301 | options.1 | 1 1/4 | \(1 \frac{1}{4}\) |
| 6-NC-301 | options.2 | 1 3/4 | \(1 \frac{3}{4}\) |
| 6-NC-301 | options.3 | 4 3/4 | \(4 \frac{3}{4}\) |
| 6-NC-301 | explanation | Bỏ ngoặc và nhóm: (5 3/7 − 1 3/7) − 2 1/4 = 4 − 2 1/4 = 1 3/4. Chọn 1 1/4 là trừ nhầm 4 − 2 3/4. | Bỏ ngoặc và nhóm: \((5 \frac{3}{7} - 1 \frac{3}{7}) - 2 \frac{1}{4} = 4 - 2 \frac{1}{4} = 1 \frac{3}{4}\). Chọn \(1 \frac{1}{4}\) là trừ nhầm \(4 - 2 \frac{3}{4}\). |
| 6-NC-303 | content | Điểm O thuộc đường thẳng xy. Lấy A trên tia Ox với OA = 4 cm, B trên tia Oy với OB = 10 cm. M là trung điểm AB. Độ dài OM là? | Điểm \(O\) thuộc đường thẳng xy. Lấy \(A\) trên tia Ox với \(OA = 4\) cm, \(B\) trên tia Oy với \(OB = 10\) cm. \(M\) là trung điểm AB. Độ dài OM là? |
| 6-NC-303 | explanation | O nằm giữa A, B nên AB = 4 + 10 = 14 cm, AM = 7 cm. M thuộc đoạn OB nên OM = AM − OA = 7 − 4 = 3 cm. Chọn 7 cm là nhầm OM với AM. | \(O\) nằm giữa \(A\), \(B\) nên \(AB = 4 + 10 = 14\) cm, \(AM = 7\) cm. \(M\) thuộc đoạn OB nên \(OM = AM - OA = 7 - 4 = 3\) cm. Chọn 7 cm là nhầm OM với AM. |
| 6-NC-304 | content | Đoạn AB = 16 cm, C nằm giữa A và B với AC = 4 cm. M là trung điểm AC, N là trung điểm AB. Độ dài MN là? | Đoạn \(AB = 16\) cm, \(C\) nằm giữa \(A\) và \(B\) với \(AC = 4\) cm. \(M\) là trung điểm AC, \(N\) là trung điểm AB. Độ dài MN là? |
| 6-NC-304 | explanation | AM = 4 : 2 = 2 cm; AN = 16 : 2 = 8 cm. M, N cùng nằm trên tia AB và AM < AN nên MN = 8 − 2 = 6 cm. Chọn 10 cm là cộng AM với AN. | \(AM = 4 : 2 = 2\) cm; \(AN = 16 : 2 = 8\) cm. \(M\), \(N\) cùng nằm trên tia AB và \(AM < AN\) nên \(MN = 8 - 2 = 6\) cm. Chọn 10 cm là cộng AM với AN. |
| 6-NC-306 | content | Vẽ 7 tia chung gốc O, không có hai tia nào trùng nhau. Có tất cả bao nhiêu góc đỉnh O tạo bởi hai trong các tia đó? | Vẽ 7 tia chung gốc \(O\), không có hai tia nào trùng nhau. Có tất cả bao nhiêu góc đỉnh \(O\) tạo bởi hai trong các tia đó? |
| 6-NC-306 | explanation | Mỗi cặp tia tạo một góc: 7 · 6 : 2 = 21 góc. Chọn 42 là đếm góc xOy và yOx thành hai góc khác nhau. | Mỗi cặp tia tạo một góc: \(7 \cdot 6 : 2 = 21\) góc. Chọn 42 là đếm góc xOy và yOx thành hai góc khác nhau. |
| 6-NC-308 | options.0 | Thôn B, tăng 30% | Thôn \(B\), tăng 30% |
| 6-NC-308 | options.1 | Thôn B, tăng 37,5% | Thôn \(B\), tăng 37,5% |
| 6-NC-308 | options.2 | Thôn A, tăng 20% | Thôn \(A\), tăng 20% |
| 6-NC-308 | options.3 | Thôn C, tăng 0% | Thôn \(C\), tăng 0% |
| 6-NC-308 | explanation | Chỉ thôn B tăng: 110 − 80 = 30 tấn, 30 : 80 = 37,5%. Chọn 30% là lấy số tấn tăng thay cho phần trăm; thôn A giảm 20% chứ không tăng. | Chỉ thôn \(B\) tăng: \(110 - 80 = 30\) tấn, \(30 : 80 = 37{,}5\%\). Chọn 30% là lấy số tấn tăng thay cho phần trăm; thôn \(A\) giảm 20% chứ không tăng. |
| 6-NC-309 | content | Mỗi bạn trong nhóm 8 bạn tung một đồng xu 5 lần. Tổng cộng mặt S xuất hiện 22 lần. Xác suất thực nghiệm xuất hiện mặt N là? | Mỗi bạn trong nhóm 8 bạn tung một đồng xu 5 lần. Tổng cộng mặt \(S\) xuất hiện 22 lần. Xác suất thực nghiệm xuất hiện mặt \(N\) là? |
| 6-NC-309 | options.0 | 9/20 | \(\frac{9}{20}\) |
| 6-NC-309 | options.1 | 11/20 | \(\frac{11}{20}\) |
| 6-NC-309 | options.2 | 9/11 | \(\frac{9}{11}\) |
| 6-NC-309 | options.3 | 1/2 | \(\frac{1}{2}\) |
| 6-NC-309 | explanation | Tổng số lần tung: 8 · 5 = 40; mặt N: 40 − 22 = 18 lần. Xác suất thực nghiệm của N = 18/40 = 9/20. 11/20 là xác suất của mặt S. | Tổng số lần tung: \(8 \cdot 5 = 40\); mặt \(N\): \(40 - 22 = 18\) lần. Xác suất thực nghiệm của \(N = \frac{18}{40} = \frac{9}{20}\). \(\frac{11}{20}\) là xác suất của mặt \(S\). |
| 6-NC-310 | explanation | Thời gian: 12 : 24 = 0,5 giờ và 12 : 12 = 1 giờ. Vận tốc TB = 24 : 1,5 = 16 km/h. Chọn 18 km/h là lấy trung bình cộng hai vận tốc, sai vì thời gian đi hai đoạn khác nhau. | Thời gian: \(12 : 24 = 0{,}5\) giờ và \(12 : 12 = 1\) giờ. Vận tốc \(TB = 24 : 1{,}5 = 16\) km/h. Chọn 18 km/h là lấy trung bình cộng hai vận tốc, sai vì thời gian đi hai đoạn khác nhau. |
| 6-NC-311 | explanation | Giá vốn = 60 000 : 25% = 240 000 đồng; giá bán = 240 000 + 60 000 = 300 000 đồng. Chọn 240 000 đồng là dừng ở giá vốn. | Giá vốn = \(60\,000 : 25\% = 240\,000\) đồng; giá bán = \(240\,000 + 60\,000 = 300\,000\) đồng. Chọn 240 000 đồng là dừng ở giá vốn. |
| 6-NC-312 | explanation | −45 − 18 + 30 = −33 (m). Chọn −57 m là chỉ tính −45 + 18 − 30, hiểu ngược chiều lặn xuống và nổi lên. | \(-45 - 18 + 30 = -33 (m)\). Chọn −57 m là chỉ tính \(-45 + 18 - 30\), hiểu ngược chiều lặn xuống và nổi lên. |
| 6-NC-313 | explanation | Thời gian cần tìm là BCNN(12, 20) = 60 phút, nên lần tiếp theo là 7 giờ. 10 giờ ứng với 240 phút (tích 12 · 20), là bội chung nhưng không nhỏ nhất. | Thời gian cần tìm là BCNN(12, 20) = 60 phút, nên lần tiếp theo là 7 giờ. 10 giờ ứng với 240 phút (tích \(12 \cdot 20\)), là bội chung nhưng không nhỏ nhất. |
| 6-NC-314 | content | Tìm số tự nhiên a lớn nhất sao cho 157 chia cho a dư 7 và 207 chia cho a cũng dư 7. | Tìm số tự nhiên \(a\) lớn nhất sao cho 157 chia cho \(a\) dư 7 và 207 chia cho \(a\) cũng dư 7. |
| 6-NC-314 | explanation | Khi đó 150 và 200 đều chia hết cho a, nên a lớn nhất là ƯCLN(150, 200) = 50 (thỏa mãn a > 7). Chọn 100 sai vì 150 không chia hết cho 100. | Khi đó 150 và 200 đều chia hết cho \(a\), nên \(a\) lớn nhất là ƯCLN(150, 200) = 50 (thỏa mãn \(a > 7\)). Chọn 100 sai vì 150 không chia hết cho 100. |
| 6-NC-315 | content | So sánh hai số 2^30 và 3^20. | So sánh hai số \(2^{30}\) và \(3^{20}\). |
| 6-NC-315 | options.0 | 2^30 < 3^20 | \(2^{30} < 3^{20}\) |
| 6-NC-315 | options.1 | 2^30 > 3^20 | \(2^{30} > 3^{20}\) |
| 6-NC-315 | options.2 | 2^30 = 3^20 | \(2^{30} = 3^{20}\) |
| 6-NC-315 | explanation | 2^30 = (2^3)^10 = 8^10 và 3^20 = (3^2)^10 = 9^10. Vì 8 < 9 nên 2^30 < 3^20. Nhiều bạn chọn 2^30 lớn hơn vì thấy số mũ 30 > 20. | \(2^{30} = (2^{3})^{10} = 8^{10}\) và \(3^{20} = (3^{2})^{10} = 9^{10}\). Vì \(8 < 9\) nên \(2^{30} < 3^{20}\). Nhiều bạn chọn \(2^{30}\) lớn hơn vì thấy số mũ \(30 > 20\). |
| 6-NC-316 | content | Vườn hình chữ nhật 30 m × 16 m. Bồn hoa hình thoi có diện tích bằng 1/3 diện tích vườn, còn lại trồng cỏ. Trồng hoa 40 000 đ/m², cỏ 20 000 đ/m². Tổng chi phí là? | Vườn hình chữ nhật 30 m × 16 m. Bồn hoa hình thoi có diện tích bằng \(\frac{1}{3}\) diện tích vườn, còn lại trồng cỏ. Trồng hoa 40 000 đ/m², cỏ 20 000 đ/m². Tổng chi phí là? |
| 6-NC-316 | explanation | Vườn 480 m², bồn hoa 160 m², cỏ 320 m². Chi phí: 160 · 40 000 + 320 · 20 000 = 6 400 000 + 6 400 000 = 12 800 000 đồng. 6 400 000 chỉ là tiền một phần. | Vườn 480 m², bồn hoa 160 m², cỏ 320 m². Chi phí: \(160 \cdot 40\,000 + 320 \cdot 20\,000 = 6\,400\,000 + 6\,400\,000 = 12\,800\,000\) đồng. 6 400 000 chỉ là tiền một phần. |
| 6-NC-317 | explanation | Thêm 200 g lò xo dài thêm 2 cm, nên cứ 100 g lò xo dãn 1 cm. Treo 100 g dãn 1 cm thì chiều dài tự nhiên là 13 − 1 = 12 cm. Chọn 13 cm là quên lò xo đã dãn. | Thêm 200 g lò xo dài thêm 2 cm, nên cứ 100 g lò xo dãn 1 cm. Treo 100 g dãn 1 cm thì chiều dài tự nhiên là \(13 - 1 = 12\) cm. Chọn 13 cm là quên lò xo đã dãn. |
| 6-NC-318 | explanation | Quả nặng đứng yên nên lực đàn hồi cân bằng với trọng lực. Trọng lượng của vật 200 g = 0,2 kg là khoảng 0,2 · 10 = 2 N. Chọn 20 N là đổi nhầm 200 g ra 2 kg. | Quả nặng đứng yên nên lực đàn hồi cân bằng với trọng lực. Trọng lượng của vật 200 g = 0,2 kg là khoảng \(0{,}2 \cdot 10 = 2\) N. Chọn 20 N là đổi nhầm 200 g ra 2 kg. |
| 6-NC-320 | explanation | Trọng lượng 4,5 N ứng với khối lượng 4,5 : 10 = 0,45 kg = 450 g. Chọn 4,5 kg là nhầm số chỉ lực kế (N) với khối lượng (kg). | Trọng lượng 4,5 N ứng với khối lượng \(4{,}5 : 10 = 0{,}45\) kg = 450 g. Chọn 4,5 kg là nhầm số chỉ lực kế (N) với khối lượng (kg). |
| 7-CB-101 | content | Kết quả của phép tính 2/3 + (-1/2) là bao nhiêu? | Kết quả của phép tính \(\frac{2}{3} + (-\frac{1}{2})\) là bao nhiêu? |
| 7-CB-101 | options.0 | 1/6 | \(\frac{1}{6}\) |
| 7-CB-101 | options.1 | 1/5 | \(\frac{1}{5}\) |
| 7-CB-101 | options.2 | -1/6 | \(-\frac{1}{6}\) |
| 7-CB-101 | options.3 | 3/5 | \(\frac{3}{5}\) |
| 7-CB-101 | explanation | 2/3 + (-1/2) = 4/6 - 3/6 = 1/6. Lỗi hay gặp là cộng tử với tử, mẫu với mẫu: (2 - 1)/(3 + 2) = 1/5. | \(\frac{2}{3} + (-\frac{1}{2}) = \frac{4}{6} - \frac{3}{6} = \frac{1}{6}\). Lỗi hay gặp là cộng tử với tử, mẫu với mẫu: \(\frac{2 - 1}{3 + 2} = \frac{1}{5}\). |
| 7-CB-102 | content | Giá trị của (-2/3)^2 là bao nhiêu? | Giá trị của \((-\frac{2}{3})^{2}\) là bao nhiêu? |
| 7-CB-102 | options.0 | -4/9 | \(-\frac{4}{9}\) |
| 7-CB-102 | options.1 | 4/6 | \(\frac{4}{6}\) |
| 7-CB-102 | options.2 | -2/9 | \(-\frac{2}{9}\) |
| 7-CB-102 | options.3 | 4/9 | \(\frac{4}{9}\) |
| 7-CB-102 | explanation | (-2/3)^2 = (-2/3).(-2/3) = 4/9. Lũy thừa bậc chẵn của số âm là số dương nên -4/9 sai; 4/6 sai vì mẫu cũng phải bình phương. | \((-\frac{2}{3})^{2} = (-\frac{2}{3}) \cdot (-\frac{2}{3}) = \frac{4}{9}\). Lũy thừa bậc chẵn của số âm là số dương nên \(-\frac{4}{9}\) sai; \(\frac{4}{6}\) sai vì mẫu cũng phải bình phương. |
| 7-CB-103 | explanation | Hàng phần trăm là chữ số thứ hai sau dấu phẩy (4); chữ số liền sau là 1 < 5 nên giữ nguyên: 3,14. 3,1 là làm tròn đến hàng phần mười. | Hàng phần trăm là chữ số thứ hai sau dấu phẩy (4); chữ số liền sau là \(1 < 5\) nên giữ nguyên: 3,14. 3,1 là làm tròn đến hàng phần mười. |
| 7-CB-104 | options.3 | ±8 | \(\pm 8\) |
| 7-CB-104 | explanation | √64 = 8 vì 8 ≥ 0 và 8^2 = 64. Số 64 có hai căn bậc hai là 8 và -8, nhưng căn bậc hai số học chỉ lấy giá trị không âm nên -8 và ±8 sai; 32 là lấy 64 chia 2. | \(\sqrt{64} = 8\) vì \(8 \ge 0\) và \(8^{2} = 64\). Số 64 có hai căn bậc hai là 8 và -8, nhưng căn bậc hai số học chỉ lấy giá trị không âm nên -8 và \(\pm 8\) sai; 32 là lấy 64 chia 2. |
| 7-CB-105 | content | Tìm x biết x/4 = 15/20. | Tìm \(x\) biết \(\frac{x}{4} = \frac{15}{20}\). |
| 7-CB-105 | explanation | Từ tỉ lệ thức: x = 4 . 15 : 20 = 60 : 20 = 3. Nếu quên chia cho 20 sẽ ra 60 là sai. | Từ tỉ lệ thức: \(x = 4 \cdot 15 : 20 = 60 : 20 = 3\). Nếu quên chia cho 20 sẽ ra 60 là sai. |
| 7-CB-106 | options.0 | 9 cm^3 | 9 cm³ |
| 7-CB-106 | options.1 | 27 cm^3 | 27 cm³ |
| 7-CB-106 | options.2 | 18 cm^3 | 18 cm³ |
| 7-CB-106 | options.3 | 54 cm^3 | 54 cm³ |
| 7-CB-106 | explanation | V = a^3 = 3 . 3 . 3 = 27 (cm^3). 9 cm^2 là diện tích một mặt, 54 cm^2 là diện tích toàn phần, không phải thể tích. | \(V = a^{3} = 3 \cdot 3 \cdot 3 = 27\) (cm³). 9 cm² là diện tích một mặt, 54 cm² là diện tích toàn phần, không phải thể tích. |
| 7-NC-101 | content | Cho x/2 = y/3 và x + y = 20. Giá trị của y là bao nhiêu? | Cho \(\frac{x}{2} = \frac{y}{3}\) và \(x + y = 20\). Giá trị của \(y\) là bao nhiêu? |
| 7-NC-101 | explanation | x/2 = y/3 = (x + y)/(2 + 3) = 20/5 = 4, nên y = 3 . 4 = 12 (x = 8). Chọn 8 là nhầm sang giá trị của x. | \(\frac{x}{2} = \frac{y}{3} = \frac{x + y}{2 + 3} = \frac{20}{5} = 4\), nên \(y = 3 \cdot 4 = 12 (x = 8)\). Chọn 8 là nhầm sang giá trị của \(x\). |
| 7-NC-102 | explanation | Số người và số ngày tỉ lệ nghịch: 4 . 12 = 6 . x, nên x = 48 : 6 = 8 (ngày). Ra 18 ngày là nhầm thành tỉ lệ thuận. | Số người và số ngày tỉ lệ nghịch: \(4 \cdot 12 = 6 \cdot x\), nên \(x = 48 : 6 = 8\) (ngày). Ra 18 ngày là nhầm thành tỉ lệ thuận. |
| 7-NC-108 | explanation | Đổi 1 giờ 30 phút = 1,5 h; v = s : t = 90 : 1,5 = 60 km/h. Lấy 90 : 2 = 45 là sai vì 1 giờ 30 phút không phải 2 giờ; 135 là nhân thay vì chia. | Đổi 1 giờ 30 phút = 1,5 h; \(v = s : t = 90 : 1{,}5 = 60\) km/h. Lấy \(90 : 2 = 45\) là sai vì 1 giờ 30 phút không phải 2 giờ; 135 là nhân thay vì chia. |
| 7-NC-109 | content | Khối lượng phân tử của CO₂ là bao nhiêu? (Biết C = 12 amu, O = 16 amu) | Khối lượng phân tử của CO₂ là bao nhiêu? (Biết \(C = 12\) amu, \(O = 16\) amu) |
| 7-NC-109 | explanation | CO₂ gồm 1 nguyên tử C và 2 nguyên tử O: 12 + 2 . 16 = 44 (amu). 28 amu là quên nhân 2 với O (12 + 16). | CO₂ gồm 1 nguyên tử C và 2 nguyên tử O: \(12 + 2 \cdot 16 = 44\) (amu). 28 amu là quên nhân 2 với \(O (12 + 16)\). |
| 7-NC-110 | explanation | Theo quy tắc hóa trị: 2 . a = 3 . II, suy ra a = III. Chọn II là nhầm lấy hóa trị của oxygen. | Theo quy tắc hóa trị: \(2 \cdot a = 3\) . II, suy ra a = III. Chọn II là nhầm lấy hóa trị của oxygen. |
| 7-NC-111 | explanation | Tần số = số dao động trong 1 giây = 500 : 20 = 25 (Hz). 10 000 là nhân 500 với 20 thay vì chia. | Tần số = số dao động trong 1 giây = \(500 : 20 = 25\) (Hz). 10 000 là nhân 500 với 20 thay vì chia. |
| 7-NC-112 | explanation | Ảnh qua gương phẳng cách gương bằng vật (1,5 m) nên khoảng cách người – ảnh là 1,5 + 1,5 = 3 m. 1,5 m chỉ là khoảng cách từ ảnh đến gương. | Ảnh qua gương phẳng cách gương bằng vật (1,5 m) nên khoảng cách người – ảnh là \(1{,}5 + 1{,}5 = 3\) m. 1,5 m chỉ là khoảng cách từ ảnh đến gương. |
| 7-CB-201 | content | Số hữu tỉ nào lớn nhất trong các số: −3/4; −2/3; −5/6; −1/2? | Số hữu tỉ nào lớn nhất trong các số: \(-\frac{3}{4}\); \(-\frac{2}{3}\); \(-\frac{5}{6}\); \(-\frac{1}{2}\)? |
| 7-CB-201 | options.0 | −5/6 | \(-\frac{5}{6}\) |
| 7-CB-201 | options.1 | −3/4 | \(-\frac{3}{4}\) |
| 7-CB-201 | options.2 | −1/2 | \(-\frac{1}{2}\) |
| 7-CB-201 | options.3 | −2/3 | \(-\frac{2}{3}\) |
| 7-CB-201 | explanation | Quy đồng mẫu 12: −9/12; −8/12; −10/12; −6/12. Trong các số âm, số có giá trị tuyệt đối nhỏ nhất là số lớn nhất nên −1/2 lớn nhất. Chọn −5/6 là nhầm so sánh như số dương. | Quy đồng mẫu 12: \(-\frac{9}{12}\); \(-\frac{8}{12}\); \(-\frac{10}{12}\); \(-\frac{6}{12}\). Trong các số âm, số có giá trị tuyệt đối nhỏ nhất là số lớn nhất nên \(-\frac{1}{2}\) lớn nhất. Chọn \(-\frac{5}{6}\) là nhầm so sánh như số dương. |
| 7-CB-202 | options.0 | 5/12 | \(\frac{5}{12}\) |
| 7-CB-202 | options.1 | 7/20 | \(\frac{7}{20}\) |
| 7-CB-202 | options.2 | 4/15 | \(\frac{4}{15}\) |
| 7-CB-202 | options.3 | 1/6 | \(\frac{1}{6}\) |
| 7-CB-202 | explanation | Phân số tối giản có mẫu chỉ chứa thừa số nguyên tố 2 và 5 thì viết được dạng thập phân hữu hạn: 20 = 2^2.5 nên 7/20 = 0,35. Các mẫu 12, 15, 6 có thừa số 3 nên cho số thập phân vô hạn tuần hoàn. | Phân số tối giản có mẫu chỉ chứa thừa số nguyên tố 2 và 5 thì viết được dạng thập phân hữu hạn: \(20 = 2^{2} \cdot 5\) nên \(\frac{7}{20} = 0{,}35\). Các mẫu 12, 15, 6 có thừa số 3 nên cho số thập phân vô hạn tuần hoàn. |
| 7-CB-203 | content | Kết quả của phép tính 3^5 : 3^2 là bao nhiêu? | Kết quả của phép tính \(3^{5} : 3^{2}\) là bao nhiêu? |
| 7-CB-203 | options.0 | 1^3 | \(1^{3}\) |
| 7-CB-203 | options.3 | 3^7 | \(3^{7}\) |
| 7-CB-203 | explanation | Chia hai lũy thừa cùng cơ số: giữ cơ số, trừ số mũ: 3^5 : 3^2 = 3^3 = 27. Viết 3^7 là nhầm sang cộng số mũ (quy tắc của phép nhân). | Chia hai lũy thừa cùng cơ số: giữ cơ số, trừ số mũ: \(3^{5} : 3^{2} = 3^{3} = 27\). Viết \(3^{7}\) là nhầm sang cộng số mũ (quy tắc của phép nhân). |
| 7-CB-204 | explanation | Hai góc kề bù có tổng bằng 180° nên góc còn lại là 180° − 65° = 115°. Đáp án 25° là nhầm sang hai góc phụ nhau (tổng 90°). | Hai góc kề bù có tổng bằng 180° nên góc còn lại là \(180^\circ - 65^\circ = 115^\circ\). Đáp án 25° là nhầm sang hai góc phụ nhau (tổng 90°). |
| 7-CB-205 | content | Tia Ot là tia phân giác của góc xOy. Biết góc xOt = 35°. Số đo góc xOy là bao nhiêu? | Tia Ot là tia phân giác của góc xOy. Biết góc \(xOt = 35^\circ\). Số đo góc xOy là bao nhiêu? |
| 7-CB-205 | explanation | Tia phân giác chia góc thành hai góc bằng nhau nên góc xOy = 2 . 35° = 70°. Đáp án 17,5° là nhầm chia đôi thay vì nhân đôi. | Tia phân giác chia góc thành hai góc bằng nhau nên góc \(xOy = 2 \cdot 35^\circ = 70^\circ\). Đáp án 17,5° là nhầm chia đôi thay vì nhân đôi. |
| 7-CB-206 | content | Đường thẳng c cắt hai đường thẳng song song a và b, tạo ra một cặp góc so le trong cùng bằng 72°. Góc trong cùng phía với một trong hai góc 72° đó bằng bao nhiêu? | Đường thẳng \(c\) cắt hai đường thẳng song song \(a\) và \(b\), tạo ra một cặp góc so le trong cùng bằng 72°. Góc trong cùng phía với một trong hai góc 72° đó bằng bao nhiêu? |
| 7-CB-206 | explanation | Khi a // b, hai góc trong cùng phía bù nhau. Góc trong cùng phía với góc 72° là 180° − 72° = 108°. Đáp án 72° là nhầm với tính chất của góc so le trong (bằng nhau). | Khi \(a\) // \(b\), hai góc trong cùng phía bù nhau. Góc trong cùng phía với góc 72° là \(180^\circ - 72^\circ = 108^\circ\). Đáp án 72° là nhầm với tính chất của góc so le trong (bằng nhau). |
| 7-CB-207 | content | Tam giác ABC vuông tại A có góc B = 38°. Số đo góc C là bao nhiêu? | Tam giác ABC vuông tại \(A\) có góc \(B = 38^\circ\). Số đo góc \(C\) là bao nhiêu? |
| 7-CB-207 | explanation | Trong tam giác vuông, hai góc nhọn phụ nhau: góc C = 90° − 38° = 52°. Đáp án 142° là lấy 180° − 38° mà quên trừ góc vuông. | Trong tam giác vuông, hai góc nhọn phụ nhau: góc \(C = 90^\circ - 38^\circ = 52^\circ\). Đáp án 142° là lấy 180° − 38° mà quên trừ góc vuông. |
| 7-CB-208 | content | Tam giác ABC và DEF có AB = DE, góc B = góc E, BC = EF. Hai tam giác bằng nhau theo trường hợp nào? | Tam giác ABC và DEF có \(AB = DE\), góc \(B\) = góc \(E\), \(BC = EF\). Hai tam giác bằng nhau theo trường hợp nào? |
| 7-CB-208 | explanation | Góc B nằm xen giữa hai cạnh AB và BC, góc E xen giữa DE và EF. Hai cặp cạnh bằng nhau và cặp góc xen giữa bằng nhau nên hai tam giác bằng nhau theo trường hợp c.g.c. | Góc \(B\) nằm xen giữa hai cạnh AB và BC, góc E xen giữa DE và EF. Hai cặp cạnh bằng nhau và cặp góc xen giữa bằng nhau nên hai tam giác bằng nhau theo trường hợp c.g.c. |
| 7-CB-209 | options.3 | Cân nặng (kg) của học sinh lớp 7A | Cân nặng (kg) của học sinh lớp \(7A\) |
| 7-CB-210 | content | Giá trị của biểu thức 2x^2 − 3x + 1 tại x = −1 là bao nhiêu? | Giá trị của biểu thức \(2x^{2} - 3x + 1\) tại \(x = -1\) là bao nhiêu? |
| 7-CB-210 | explanation | Thay x = −1: 2.(−1)^2 − 3.(−1) + 1 = 2 + 3 + 1 = 6. Đáp án 0 là do tính −3.(−1) thành −3. | Thay \(x = -1\): \(2 \cdot (-1)^{2} - 3 \cdot (-1) + 1 = 2 + 3 + 1 = 6\). Đáp án 0 là do tính \(-3 \cdot (-1)\) thành −3. |
| 7-CB-211 | content | Cho đa thức P(x) = 3x^4 − x^2 + 5x − 2. Hệ số cao nhất và hệ số tự do của P(x) lần lượt là bao nhiêu? | Cho đa thức \(P(x) = 3x^{4} - x^{2} + 5x - 2\). Hệ số cao nhất và hệ số tự do của \(P(x)\) lần lượt là bao nhiêu? |
| 7-CB-211 | explanation | Hạng tử có bậc cao nhất là 3x^4 nên hệ số cao nhất là 3; hạng tử không chứa biến là −2 nên hệ số tự do là −2. Số 4 là bậc của đa thức, không phải hệ số. | Hạng tử có bậc cao nhất là \(3x^{4}\) nên hệ số cao nhất là 3; hạng tử không chứa biến là −2 nên hệ số tự do là −2. Số 4 là bậc của đa thức, không phải hệ số. |
| 7-CB-212 | options.0 | 2/3 | \(\frac{2}{3}\) |
| 7-CB-212 | options.1 | 1/2 | \(\frac{1}{2}\) |
| 7-CB-212 | options.2 | 1/3 | \(\frac{1}{3}\) |
| 7-CB-212 | options.3 | 1/6 | \(\frac{1}{6}\) |
| 7-CB-212 | explanation | Các số nguyên tố trong 1–6 là 2, 3, 5: có 3 kết quả thuận lợi trên 6 kết quả có thể, nên xác suất là 3/6 = 1/2. Lưu ý 1 không phải số nguyên tố. | Các số nguyên tố trong 1–6 là 2, 3, 5: có 3 kết quả thuận lợi trên 6 kết quả có thể, nên xác suất là \(\frac{3}{6} = \frac{1}{2}\). Lưu ý 1 không phải số nguyên tố. |
| 7-CB-233 | explanation | Theo quy tắc hóa trị: II . x = I . y nên x : y = 1 : 2, công thức là CaCl₂. CaCl sai vì tổng hóa trị hai bên không bằng nhau. | Theo quy tắc hóa trị: II . \(x = \mathrm{I} \cdot y\) nên \(x : y = 1 : 2\), công thức là CaCl₂. CaCl sai vì tổng hóa trị hai bên không bằng nhau. |
| 7-CB-234 | explanation | 1 km/h = 1000 m / 3600 s nên 54 km/h = 54 : 3,6 = 15 m/s. Đáp án 194,4 m/s là nhân với 3,6 thay vì chia. | 1 km/h = 1000 m / 3600 s nên 54 km/h = \(54 : 3{,}6 = 15\) m/s. Đáp án 194,4 m/s là nhân với 3,6 thay vì chia. |
| 7-NC-201 | content | Tìm x biết \|2x − 1\| = 5. | Tìm \(x\) biết \(\|2x - 1\| = 5\). |
| 7-NC-201 | options.0 | x = 3 | \(x = 3\) |
| 7-NC-201 | options.1 | x = 2 hoặc x = −2 | \(x = 2\) hoặc \(x = -2\) |
| 7-NC-201 | options.2 | x = −3 hoặc x = 2 | \(x = -3\) hoặc \(x = 2\) |
| 7-NC-201 | options.3 | x = 3 hoặc x = −2 | \(x = 3\) hoặc \(x = -2\) |
| 7-NC-201 | explanation | \|2x − 1\| = 5 nên 2x − 1 = 5 hoặc 2x − 1 = −5, suy ra x = 3 hoặc x = −2. Chỉ ghi x = 3 là bỏ sót trường hợp biểu thức bên trong âm. | \(\|2x - 1\| = 5\) nên \(2x - 1 = 5\) hoặc \(2x - 1 = -5\), suy ra \(x = 3\) hoặc \(x = -2\). Chỉ ghi \(x = 3\) là bỏ sót trường hợp biểu thức bên trong âm. |
| 7-NC-202 | content | Cho a/2 = b/3 = c/4 và a + 2b − c = 12. Giá trị của c là bao nhiêu? | Cho \(\frac{a}{2} = \frac{b}{3} = \frac{c}{4}\) và \(a + 2b - c = 12\). Giá trị của \(c\) là bao nhiêu? |
| 7-NC-202 | explanation | Đặt a/2 = b/3 = c/4 = k thì a = 2k, b = 3k, c = 4k. Khi đó 2k + 6k − 4k = 4k = 12 nên k = 3 và c = 4.3 = 12. Đáp án 48 là do quên hệ số 2 của b (được k = 12); 3 chỉ là giá trị của k. | Đặt \(\frac{a}{2} = \frac{b}{3} = \frac{c}{4} = k\) thì \(a = 2k\), \(b = 3k\), \(c = 4k\). Khi đó \(2k + 6k - 4k = 4k = 12\) nên \(k = 3\) và \(c = 4 \cdot 3 = 12\). Đáp án 48 là do quên hệ số 2 của \(b\) (được \(k = 12\)); 3 chỉ là giá trị của \(k\). |
| 7-NC-203 | content | Tìm m để x = 2 là nghiệm của đa thức P(x) = x^2 − mx + 6. | Tìm \(m\) để \(x = 2\) là nghiệm của đa thức \(P(x) = x^{2} - mx + 6\). |
| 7-NC-203 | options.0 | m = 5 | \(m = 5\) |
| 7-NC-203 | options.1 | m = −5 | \(m = -5\) |
| 7-NC-203 | options.2 | m = 3 | \(m = 3\) |
| 7-NC-203 | options.3 | m = 1 | \(m = 1\) |
| 7-NC-203 | explanation | x = 2 là nghiệm nên P(2) = 0: 4 − 2m + 6 = 0, suy ra 2m = 10, m = 5. Kiểm tra: P(x) = x^2 − 5x + 6 có P(2) = 4 − 10 + 6 = 0. | \(x = 2\) là nghiệm nên \(P(2) = 0\): 4 − 2m + \(6 = 0\), suy ra 2m = 10, m = 5. Kiểm tra: \(P(x) = x^{2} - 5x + 6\) có \(P(2) = 4 - 10 + 6 = 0\). |
| 7-NC-204 | explanation | Theo bất đẳng thức tam giác: 7 − 2 < c < 7 + 2, tức 5 < c < 9, nên c ∈ {6; 7; 8}. Số nguyên lẻ duy nhất là 7. Chọn 5 hoặc 9 là quên rằng dấu bất đẳng thức là dấu nhỏ hơn thực sự. | Theo bất đẳng thức tam giác: \(7 - 2 < c < 7 + 2\), tức \(5 < c < 9\), nên c ∈ {6; 7; 8}. Số nguyên lẻ duy nhất là 7. Chọn 5 hoặc 9 là quên rằng dấu bất đẳng thức là dấu nhỏ hơn thực sự. |
| 7-NC-205 | content | Cho G là trọng tâm tam giác ABC, AM là đường trung tuyến và GM = 3 cm. Độ dài AG là bao nhiêu? | Cho \(G\) là trọng tâm tam giác ABC, AM là đường trung tuyến và \(GM = 3\) cm. Độ dài AG là bao nhiêu? |
| 7-NC-205 | explanation | Trọng tâm cách đỉnh 2/3 độ dài trung tuyến nên AG = 2GM = 6 cm (khi đó AM = 9 cm). Đáp án 9 cm là độ dài cả đường trung tuyến AM. | Trọng tâm cách đỉnh \(\frac{2}{3}\) độ dài trung tuyến nên \(AG = 2GM = 6\) cm (khi đó \(AM = 9\) cm). Đáp án 9 cm là độ dài cả đường trung tuyến AM. |
| 7-NC-206 | content | So sánh hai số 2^300 và 3^200. | So sánh hai số \(2^{300}\) và \(3^{200}\). |
| 7-NC-206 | options.0 | 2^300 = 3^200 | \(2^{300} = 3^{200}\) |
| 7-NC-206 | options.1 | 2^300 > 3^200 | \(2^{300} > 3^{200}\) |
| 7-NC-206 | options.3 | 2^300 < 3^200 | \(2^{300} < 3^{200}\) |
| 7-NC-206 | explanation | Đưa về cùng số mũ: 2^300 = (2^3)^100 = 8^100 và 3^200 = (3^2)^100 = 9^100. Vì 8 < 9 nên 2^300 < 3^200. Nhầm lẫn thường gặp là thấy số mũ 300 lớn hơn nên kết luận 2^300 lớn hơn. | Đưa về cùng số mũ: \(2^{300} = (2^{3})^{100} = 8^{100}\) và \(3^{200} = (3^{2})^{100} = 9^{100}\). Vì \(8 < 9\) nên \(2^{300} < 3^{200}\). Nhầm lẫn thường gặp là thấy số mũ 300 lớn hơn nên kết luận \(2^{300}\) lớn hơn. |
| 7-NC-207 | content | Tìm số tự nhiên x biết 2^(x+1) + 2^x = 96. | Tìm số tự nhiên \(x\) biết \(2^{x+1} + 2^{x} = 96\). |
| 7-NC-207 | options.0 | x = 5 | \(x = 5\) |
| 7-NC-207 | options.1 | x = 4 | \(x = 4\) |
| 7-NC-207 | options.2 | x = 32 | \(x = 32\) |
| 7-NC-207 | options.3 | x = 6 | \(x = 6\) |
| 7-NC-207 | explanation | 2^(x+1) + 2^x = 2^x.(2 + 1) = 3.2^x = 96 nên 2^x = 32 = 2^5, suy ra x = 5. Đáp án 32 là dừng lại ở giá trị 2^x. | \(2^{x+1} + 2^{x} = 2^{x} \cdot (2 + 1) = 3 \cdot 2^{x} = 96\) nên \(2^{x} = 32 = 2^{5}\), suy ra \(x = 5\). Đáp án 32 là dừng lại ở giá trị \(2^{x}\). |
| 7-NC-208 | content | Hộp có 3 bi đỏ, 5 bi xanh, 2 bi vàng. Cần thêm bao nhiêu bi đỏ để xác suất lấy ngẫu nhiên được 1 bi đỏ bằng 1/2? | Hộp có 3 bi đỏ, 5 bi xanh, 2 bi vàng. Cần thêm bao nhiêu bi đỏ để xác suất lấy ngẫu nhiên được 1 bi đỏ bằng \(\frac{1}{2}\)? |
| 7-NC-208 | explanation | Thêm n bi đỏ: (3 + n)/(10 + n) = 1/2 nên 6 + 2n = 10 + n, suy ra n = 4. Kiểm tra: 7 bi đỏ trên 14 bi, xác suất 7/14 = 1/2. Đáp án 2 là nhầm chỉ cho số bi đỏ bằng số bi xanh. | Thêm \(n\) bi đỏ: \(\frac{3 + n}{10 + n} = \frac{1}{2}\) nên \(6 + 2n = 10 + n\), suy ra \(n = 4\). Kiểm tra: 7 bi đỏ trên 14 bi, xác suất \(\frac{7}{14} = \frac{1}{2}\). Đáp án 2 là nhầm chỉ cho số bi đỏ bằng số bi xanh. |
| 7-NC-219 | explanation | Tổng quãng đường 12 km, tổng thời gian 50 phút = 5/6 giờ, nên v = 12 : (5/6) = 14,4 km/h. Lấy trung bình cộng hai tốc độ (12 và 18 km/h) được 15 km/h là sai. | Tổng quãng đường 12 km, tổng thời gian 50 phút = \(\frac{5}{6}\) giờ, nên \(v = 12 : (\frac{5}{6}) = 14{,}4\) km/h. Lấy trung bình cộng hai tốc độ (12 và 18 km/h) được 15 km/h là sai. |
| 7-NC-220 | explanation | Trong 1,2 s âm đi được 340 . 1,2 = 408 m, gồm cả đường đi tới vách núi và đường phản xạ về. Khoảng cách là 408 : 2 = 204 m. Đáp án 408 m là quên chia đôi. | Trong 1,2 s âm đi được \(340 \cdot 1{,}2 = 408\) m, gồm cả đường đi tới vách núi và đường phản xạ về. Khoảng cách là \(408 : 2 = 204\) m. Đáp án 408 m là quên chia đôi. |
| 7-NC-221 | explanation | Góc tới là góc giữa tia tới và pháp tuyến: 90° − 35° = 55°. Góc phản xạ bằng góc tới nên bằng 55°. Đáp án 35° là nhầm góc với mặt gương thành góc tới. | Góc tới là góc giữa tia tới và pháp tuyến: \(90^\circ - 35^\circ = 55^\circ\). Góc phản xạ bằng góc tới nên bằng 55°. Đáp án 35° là nhầm góc với mặt gương thành góc tới. |
| 7-NC-222 | explanation | Khối lượng phân tử CaCO₃ = 40 + 12 + 3.16 = 100 amu. %O = 48/100 . 100% = 48%. Đáp án 40% là phần trăm của Ca. | Khối lượng phân tử CaCO₃ = \(40 + 12 + 3 \cdot 16 = 100\) amu. %O = 48/100 . 100% = 48%. Đáp án 40% là phần trăm của Ca. |
| 7-NC-223 | explanation | Trong X₂O₃, X có hóa trị III (O hóa trị II); trong YH₂, Y có hóa trị II. Theo quy tắc hóa trị: III . a = II . b nên a : b = 2 : 3, công thức là X₂Y₃. | Trong X₂O₃, X có hóa trị III (O hóa trị II); trong YH₂, Y có hóa trị II. Theo quy tắc hóa trị: III . a = II . b nên \(a : b = 2 : 3\), công thức là X₂Y₃. |
| 7-NC-224 | explanation | Gọi số p = số e = Z, số n = N: 2Z + N = 34 và 2Z − N = 10. Cộng lại: 4Z = 44 nên Z = 11, N = 12. Nguyên tố có Z = 11 là sodium. | Gọi số p = số \(e = Z\), số \(n = N\): \(2Z + N = 34\) và \(2Z - N = 10\). Cộng lại: \(4Z = 44\) nên \(Z = 11\), N = 12. Nguyên tố có \(Z = 11\) là sodium. |
| 7-CB-301 | content | Phân số 5/11 viết dưới dạng số thập phân là số nào? | Phân số \(\frac{5}{11}\) viết dưới dạng số thập phân là số nào? |
| 7-CB-301 | explanation | 5 : 11 = 0,454545… nên chu kì là 45, viết 0,(45). Viết 0,45 là sai vì đó là số thập phân hữu hạn, còn 0,4(5) chỉ lặp lại chữ số 5. | \(5 : 11\) = 0,454545… nên chu kì là 45, viết 0,(45). Viết 0,45 là sai vì đó là số thập phân hữu hạn, còn 0,4(5) chỉ lặp lại chữ số 5. |
| 7-CB-302 | options.0 | −0,(6) < −0,66 | \(-0,(6) < -0{,}66\) |
| 7-CB-302 | options.1 | −0,(6) > −0,66 | \(-0,(6) > -0{,}66\) |
| 7-CB-302 | options.2 | −0,(6) = −0,66 | \(-0,(6) = -0{,}66\) |
| 7-CB-302 | explanation | 0,(6) = 0,666… > 0,66 nên khi lấy số đối thì bất đẳng thức đổi chiều: −0,(6) < −0,66. Nhiều bạn chọn "bằng nhau" vì quên phần lặp lại vô hạn. | 0,(6) = 0,666… > 0,66 nên khi lấy số đối thì bất đẳng thức đổi chiều: \(-0,(6) < -0{,}66\). Nhiều bạn chọn "bằng nhau" vì quên phần lặp lại vô hạn. |
| 7-CB-303 | explanation | Độ chính xác 0,05 thì làm tròn đến hàng phần mười. Chữ số hàng phần trăm là 6 ≥ 5 nên được 12,5. Kết quả 12,47 là làm tròn đến hàng phần trăm, chưa đúng yêu cầu. | Độ chính xác 0,05 thì làm tròn đến hàng phần mười. Chữ số hàng phần trăm là \(6 \ge 5\) nên được 12,5. Kết quả 12,47 là làm tròn đến hàng phần trăm, chưa đúng yêu cầu. |
| 7-CB-304 | content | Tìm x biết \|x\| = 3/4 và x < 0. | Tìm \(x\) biết \(\|x\| = \frac{3}{4}\) và \(x < 0\). |
| 7-CB-304 | options.0 | x = 3/4 | \(x = \frac{3}{4}\) |
| 7-CB-304 | options.1 | x = −4/3 | \(x = -\frac{4}{3}\) |
| 7-CB-304 | options.2 | x = −3/4 | \(x = -\frac{3}{4}\) |
| 7-CB-304 | options.3 | x = 4/3 | \(x = \frac{4}{3}\) |
| 7-CB-304 | explanation | \|x\| = 3/4 nên x = 3/4 hoặc x = −3/4. Vì x < 0 nên chỉ nhận x = −3/4. Chọn 3/4 là bỏ qua điều kiện x âm. | \(\|x\| = \frac{3}{4}\) nên \(x = \frac{3}{4}\) hoặc \(x = -\frac{3}{4}\). Vì \(x < 0\) nên chỉ nhận \(x = -\frac{3}{4}\). Chọn \(\frac{3}{4}\) là bỏ qua điều kiện \(x\) âm. |
| 7-CB-305 | content | Giá trị của (−0,5)^3 là bao nhiêu? | Giá trị của \((-0{,}5)^{3}\) là bao nhiêu? |
| 7-CB-305 | explanation | (−0,5)^3 = (−0,5)·(−0,5)·(−0,5) = −0,125. Lũy thừa bậc lẻ của số âm là số âm. Kết quả −1,5 là nhầm lũy thừa thành phép nhân với 3. | \((-0{,}5)^{3} = (-0{,}5)\cdot (-0{,}5)\cdot (-0{,}5) = -0{,}125\). Lũy thừa bậc lẻ của số âm là số âm. Kết quả −1,5 là nhầm lũy thừa thành phép nhân với 3. |
| 7-CB-306 | content | Kết quả của phép tính √0,81 + √1,44 là bao nhiêu? | Kết quả của phép tính \(\sqrt{0{,}81} + \sqrt{1{,}44}\) là bao nhiêu? |
| 7-CB-306 | explanation | √0,81 = 0,9 và √1,44 = 1,2 nên tổng là 2,1. Đáp án 1,5 sai vì đã cộng hai số trong căn rồi mới khai căn (√2,25), mà √a + √b ≠ √(a + b). | \(\sqrt{0{,}81} = 0{,}9\) và \(\sqrt{1{,}44} = 1{,}2\) nên tổng là 2,1. Đáp án 1,5 sai vì đã cộng hai số trong căn rồi mới khai căn \((\sqrt{2{,}25})\), mà \(\sqrt{a} + \sqrt{b} \ne \sqrt{a + b}\). |
| 7-CB-307 | content | Từ đẳng thức 3·8 = 4·6, tỉ lệ thức nào sau đây SAI? | Từ đẳng thức \(3\cdot 8 = 4\cdot 6\), tỉ lệ thức nào sau đây SAI? |
| 7-CB-307 | options.0 | 3/4 = 8/6 | \(\frac{3}{4} = \frac{8}{6}\) |
| 7-CB-307 | options.1 | 3/4 = 6/8 | \(\frac{3}{4} = \frac{6}{8}\) |
| 7-CB-307 | options.2 | 3/6 = 4/8 | \(\frac{3}{6} = \frac{4}{8}\) |
| 7-CB-307 | options.3 | 8/4 = 6/3 | \(\frac{8}{4} = \frac{6}{3}\) |
| 7-CB-307 | explanation | Từ ad = bc lập được a/b = c/d, a/c = b/d, d/b = c/a. Ta có 3/4 = 0,75 còn 8/6 ≈ 1,33 nên 3/4 = 8/6 sai. Các tỉ lệ thức 3/6 = 4/8 và 8/4 = 6/3 đều đúng (cùng bằng 0,5 và 2). | Từ \(ad = bc\) lập được \(\frac{a}{b} = \frac{c}{d}\), \(\frac{a}{c} = \frac{b}{d}\), \(\frac{d}{b} = \frac{c}{a}\). Ta có \(\frac{3}{4} = 0{,}75\) còn \(\frac{8}{6} \approx 1{,}33\) nên \(\frac{3}{4} = \frac{8}{6}\) sai. Các tỉ lệ thức \(\frac{3}{6} = \frac{4}{8}\) và \(\frac{8}{4} = \frac{6}{3}\) đều đúng (cùng bằng 0,5 và 2). |
| 7-CB-308 | explanation | Số tiền tỉ lệ thuận với khối lượng: 1 kg giá 90 000 : 5 = 18 000 đồng, nên 8 kg giá 144 000 đồng. Kết quả 56 250 đồng là tính nhầm theo tỉ lệ nghịch. | Số tiền tỉ lệ thuận với khối lượng: 1 kg giá \(90\,000 : 5 = 18\,000\) đồng, nên 8 kg giá 144 000 đồng. Kết quả 56 250 đồng là tính nhầm theo tỉ lệ nghịch. |
| 7-CB-309 | content | Cho y tỉ lệ nghịch với x theo hệ số tỉ lệ 12. Khi x = −3 thì y bằng bao nhiêu? | Cho \(y\) tỉ lệ nghịch với \(x\) theo hệ số tỉ lệ 12. Khi \(x = -3\) thì \(y\) bằng bao nhiêu? |
| 7-CB-309 | options.3 | −1/4 | \(-\frac{1}{4}\) |
| 7-CB-309 | explanation | y tỉ lệ nghịch với x theo hệ số 12 nghĩa là x·y = 12, nên y = 12 : (−3) = −4. Kết quả −36 là nhầm sang tỉ lệ thuận (y = 12x). | \(y\) tỉ lệ nghịch với \(x\) theo hệ số 12 nghĩa là \(x\cdot y = 12\), nên \(y = 12 : (-3) = -4\). Kết quả −36 là nhầm sang tỉ lệ thuận \((y = 12x)\). |
| 7-CB-311 | content | Cho a // b và đường thẳng c vuông góc với a. Khẳng định nào đúng? | Cho \(a\) // \(b\) và đường thẳng \(c\) vuông góc với \(a\). Khẳng định nào đúng? |
| 7-CB-311 | options.0 | c ⊥ b | \(c\) ⊥ \(b\) |
| 7-CB-311 | options.1 | c // b | \(c\) // \(b\) |
| 7-CB-311 | options.2 | c trùng với b | \(c\) trùng với \(b\) |
| 7-CB-311 | options.3 | c cắt b tạo góc 45° | \(c\) cắt \(b\) tạo góc 45° |
| 7-CB-311 | explanation | Một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng còn lại, nên c ⊥ b. Chọn c // b là sai vì c đã cắt a nên cũng phải cắt b. | Một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng còn lại, nên \(c\) ⊥ \(b\). Chọn \(c\) // \(b\) là sai vì \(c\) đã cắt \(a\) nên cũng phải cắt \(b\). |
| 7-CB-312 | content | Góc ngoài tại đỉnh C của tam giác ABC bằng 115°, góc A = 60°. Số đo góc B là bao nhiêu? | Góc ngoài tại đỉnh \(C\) của tam giác ABC bằng 115°, góc \(A = 60^\circ\). Số đo góc \(B\) là bao nhiêu? |
| 7-CB-312 | explanation | Góc ngoài tại C bằng tổng hai góc trong không kề với nó: A + B = 115°, nên B = 55°. Kết quả 65° là số đo góc C (180° − 115°), không phải góc B. | Góc ngoài tại \(C\) bằng tổng hai góc trong không kề với nó: \(A + B = 115^\circ\), nên \(B = 55^\circ\). Kết quả 65° là số đo góc C (180° − 115°), không phải góc \(B\). |
| 7-CB-313 | explanation | Hai góc ở đáy bằng nhau nên góc ở đỉnh = 180° − 2·40° = 100°. Kết quả 140° là chỉ trừ một góc đáy. | Hai góc ở đáy bằng nhau nên góc ở đỉnh = \(180^\circ - 2\cdot 40^\circ = 100^\circ\). Kết quả 140° là chỉ trừ một góc đáy. |
| 7-CB-314 | content | Tam giác ABC có AB = 5 cm, BC = 7 cm, AC = 6 cm. Góc lớn nhất của tam giác là góc nào? | Tam giác ABC có \(AB = 5\) cm, \(BC = 7\) cm, \(AC = 6\) cm. Góc lớn nhất của tam giác là góc nào? |
| 7-CB-314 | options.0 | Góc B | Góc \(B\) |
| 7-CB-314 | options.1 | Góc A | Góc \(A\) |
| 7-CB-314 | options.2 | Góc C | Góc \(C\) |
| 7-CB-314 | explanation | Trong tam giác, góc đối diện cạnh lớn hơn thì lớn hơn. Cạnh lớn nhất là BC = 7 cm, đối diện góc A. Chọn góc C là nhầm góc đối diện với cạnh AB. | Trong tam giác, góc đối diện cạnh lớn hơn thì lớn hơn. Cạnh lớn nhất là \(BC = 7\) cm, đối diện góc \(A\). Chọn góc \(C\) là nhầm góc đối diện với cạnh AB. |
| 7-CB-315 | content | Từ điểm A nằm ngoài đường thẳng d, kẻ AH ⊥ d (H ∈ d) và hai đường xiên AB, AC với HB < HC. Khẳng định nào đúng? | Từ điểm \(A\) nằm ngoài đường thẳng \(d\), kẻ AH ⊥ \(d (H \in d)\) và hai đường xiên AB, AC với \(HB < HC\). Khẳng định nào đúng? |
| 7-CB-315 | options.0 | AH < AB < AC | \(AH < AB < AC\) |
| 7-CB-315 | options.1 | AH < AC < AB | \(AH < AC < AB\) |
| 7-CB-315 | options.2 | AB < AH < AC | \(AB < AH < AC\) |
| 7-CB-315 | options.3 | AB = AC | \(AB = AC\) |
| 7-CB-315 | explanation | Đường vuông góc ngắn hơn mọi đường xiên. Đường xiên nào có hình chiếu lớn hơn thì dài hơn; HB < HC nên AB < AC. Vậy AH < AB < AC. | Đường vuông góc ngắn hơn mọi đường xiên. Đường xiên nào có hình chiếu lớn hơn thì dài hơn; \(HB < HC\) nên \(AB < AC\). Vậy \(AH < AB < AC\). |
| 7-CB-316 | options.0 | 120 cm^3 | 120 cm³ |
| 7-CB-316 | options.1 | 70 cm^3 | 70 cm³ |
| 7-CB-316 | options.2 | 60 cm^3 | 60 cm³ |
| 7-CB-316 | options.3 | 20 cm^3 | 20 cm³ |
| 7-CB-316 | explanation | Diện tích đáy = 1/2·3·4 = 6 cm^2, thể tích = 6·10 = 60 cm^3. Kết quả 120 cm^3 là quên nhân 1/2 khi tính diện tích tam giác vuông. | Diện tích đáy = \(\frac{1}{2}\cdot 3\cdot 4 = 6\) cm², thể tích = \(6\cdot 10 = 60\) cm³. Kết quả 120 cm³ là quên nhân \(\frac{1}{2}\) khi tính diện tích tam giác vuông. |
| 7-CB-318 | options.2 | Chia mỗi đường phân giác theo tỉ số 2/3 | Chia mỗi đường phân giác theo tỉ số \(\frac{2}{3}\) |
| 7-CB-318 | explanation | Mỗi điểm trên tia phân giác của một góc cách đều hai cạnh của góc, nên giao điểm ba đường phân giác cách đều ba cạnh tam giác và luôn nằm trong tam giác. Tỉ số 2/3 là tính chất của trọng tâm. | Mỗi điểm trên tia phân giác của một góc cách đều hai cạnh của góc, nên giao điểm ba đường phân giác cách đều ba cạnh tam giác và luôn nằm trong tam giác. Tỉ số \(\frac{2}{3}\) là tính chất của trọng tâm. |
| 7-CB-319 | options.0 | Chỉ hỏi các bạn lớp 7A | Chỉ hỏi các bạn lớp \(7A\) |
| 7-CB-319 | explanation | Mẫu đại diện phải có đủ các khối lớp, cả nam và nữ, và được chọn ngẫu nhiên. Chỉ hỏi lớp 7A hay chỉ hỏi học sinh nữ thì mẫu bị lệch về một nhóm. | Mẫu đại diện phải có đủ các khối lớp, cả nam và nữ, và được chọn ngẫu nhiên. Chỉ hỏi lớp \(7A\) hay chỉ hỏi học sinh nữ thì mẫu bị lệch về một nhóm. |
| 7-CB-320 | content | Biểu đồ quạt tròn về cách đến trường: đi xe đạp 45%, đi bộ 25%, đi xe buýt x%, bố mẹ đưa 10%. Giá trị của x là bao nhiêu? | Biểu đồ quạt tròn về cách đến trường: đi xe đạp 45%, đi bộ 25%, đi xe buýt x%, bố mẹ đưa 10%. Giá trị của \(x\) là bao nhiêu? |
| 7-CB-320 | explanation | Tổng các phần của biểu đồ quạt tròn bằng 100%, nên x = 100 − 45 − 25 − 10 = 20. Kết quả 30 là quên trừ phần 10% bố mẹ đưa. | Tổng các phần của biểu đồ quạt tròn bằng 100%, nên \(x = 100 - 45 - 25 - 10 = 20\). Kết quả 30 là quên trừ phần 10% bố mẹ đưa. |
| 7-CB-322 | options.0 | 2/5 | \(\frac{2}{5}\) |
| 7-CB-322 | options.1 | 3/5 | \(\frac{3}{5}\) |
| 7-CB-322 | options.2 | 1/6 | \(\frac{1}{6}\) |
| 7-CB-322 | options.3 | 1/2 | \(\frac{1}{2}\) |
| 7-CB-322 | explanation | Có 10 viên, khả năng được mỗi viên như nhau, trong đó 6 viên xanh nên xác suất là 6/10 = 3/5. Kết quả 2/5 là xác suất lấy được bi đỏ. | Có 10 viên, khả năng được mỗi viên như nhau, trong đó 6 viên xanh nên xác suất là \(\frac{6}{10} = \frac{3}{5}\). Kết quả \(\frac{2}{5}\) là xác suất lấy được bi đỏ. |
| 7-CB-323 | content | Bậc của đa thức P(x) = 4x^5 − 3x^2 + 1 − 4x^5 + x^3 là bao nhiêu? | Bậc của đa thức \(P(x) = 4x^{5} - 3x^{2} + 1 - 4x^{5} + x^{3}\) là bao nhiêu? |
| 7-CB-323 | explanation | Thu gọn: 4x^5 − 4x^5 = 0, nên P(x) = x^3 − 3x^2 + 1, có bậc 3. Chọn 5 là chưa thu gọn đa thức trước khi tìm bậc. | Thu gọn: \(4x^{5} - 4x^{5} = 0\), nên \(P(x) = x^{3} - 3x^{2} + 1\), có bậc 3. Chọn 5 là chưa thu gọn đa thức trước khi tìm bậc. |
| 7-CB-324 | content | Cho A(x) = 2x^2 − x + 3 và B(x) = −x^2 + 4x − 5. Tổng A(x) + B(x) bằng đa thức nào? | Cho \(A(x) = 2x^{2} - x + 3\) và \(B(x) = -x^{2} + 4x - 5\). Tổng \(A(x) + B(x)\) bằng đa thức nào? |
| 7-CB-324 | options.0 | x^2 + 3x − 2 | \(x^{2} + 3x - 2\) |
| 7-CB-324 | options.1 | 3x^2 − 5x + 8 | \(3x^{2} - 5x + 8\) |
| 7-CB-324 | options.2 | x^2 − 5x − 2 | \(x^{2} - 5x - 2\) |
| 7-CB-324 | options.3 | x^2 + 3x + 8 | \(x^{2} + 3x + 8\) |
| 7-CB-324 | explanation | Cộng các hạng tử cùng bậc: (2 − 1)x^2 + (−1 + 4)x + (3 − 5) = x^2 + 3x − 2. Đa thức 3x^2 − 5x + 8 là kết quả của hiệu A(x) − B(x). | Cộng các hạng tử cùng bậc: \((2 - 1)x^{2} + (-1 + 4)x + (3 - 5) = x^{2} + 3x - 2\). Đa thức \(3x^{2} - 5x + 8\) là kết quả của hiệu \(A(x) - B(x)\). |
| 7-CB-325 | content | Nguyên tử aluminium (Z = 13) có bao nhiêu electron ở lớp ngoài cùng? | Nguyên tử aluminium \((Z = 13)\) có bao nhiêu electron ở lớp ngoài cùng? |
| 7-CB-326 | content | Nguyên tố có số hiệu nguyên tử Z = 16 nằm ở vị trí nào trong bảng tuần hoàn? | Nguyên tố có số hiệu nguyên tử \(Z = 16\) nằm ở vị trí nào trong bảng tuần hoàn? |
| 7-CB-326 | explanation | Z = 16 cho các lớp electron 2, 8, 6: có 3 lớp nên thuộc chu kì 3, có 6 electron lớp ngoài cùng nên thuộc nhóm VIA (sulfur). Đáp án "chu kì 6, nhóm IIIA" là đảo ngược hai con số. | \(Z = 16\) cho các lớp electron 2, 8, 6: có 3 lớp nên thuộc chu kì 3, có 6 electron lớp ngoài cùng nên thuộc nhóm VIA (sulfur). Đáp án "chu kì 6, nhóm IIIA" là đảo ngược hai con số. |
| 7-CB-330 | explanation | KLPT = 2·1 + 32 + 4·16 = 98 amu. Kết quả 97 amu là chỉ tính 1 nguyên tử H, quên chỉ số 2. | KLPT = \(2\cdot 1 + 32 + 4\cdot 16 = 98\) amu. Kết quả 97 amu là chỉ tính 1 nguyên tử H, quên chỉ số 2. |
| 7-NC-301 | explanation | Gọi ba cạnh là 4k, 5k, 6k thì 15k = 45, suy ra k = 3. Cạnh lớn nhất là 6·3 = 18 cm. Kết quả 15 cm là cạnh thứ hai (5k). | Gọi ba cạnh là \(4k\), \(5k\), \(6k\) thì \(15k = 45\), suy ra \(k = 3\). Cạnh lớn nhất là \(6\cdot 3 = 18\) cm. Kết quả 15 cm là cạnh thứ \(hai (5k)\). |
| 7-NC-302 | explanation | Số máy tỉ lệ nghịch với số ngày: x : y : z = 1/3 : 1/4 : 1/6 = 4 : 3 : 2. Tổng 9 phần ứng với 36 máy, mỗi phần 4 máy, nên đội I có 16 máy. Kết quả 8 máy là số máy của đội III (2 phần), không phải đội I. | Số máy tỉ lệ nghịch với số ngày: \(x : y : z = \frac{1}{3} : \frac{1}{4} : \frac{1}{6} = 4 : 3 : 2\). Tổng 9 phần ứng với 36 máy, mỗi phần 4 máy, nên đội I có 16 máy. Kết quả 8 máy là số máy của đội III (2 phần), không phải đội I. |
| 7-NC-303 | content | Tìm x biết (2x − 1)^2 = 9/4. | Tìm \(x\) biết \((2x - 1)^{2} = \frac{9}{4}\). |
| 7-NC-303 | options.0 | x = 5/4 | \(x = \frac{5}{4}\) |
| 7-NC-303 | options.1 | x = −5/4 hoặc x = 1/4 | \(x = -\frac{5}{4}\) hoặc \(x = \frac{1}{4}\) |
| 7-NC-303 | options.2 | x = 1/4 hoặc x = 5/4 | \(x = \frac{1}{4}\) hoặc \(x = \frac{5}{4}\) |
| 7-NC-303 | options.3 | x = 5/4 hoặc x = −1/4 | \(x = \frac{5}{4}\) hoặc \(x = -\frac{1}{4}\) |
| 7-NC-303 | explanation | (2x − 1)^2 = (3/2)^2 nên 2x − 1 = 3/2 hoặc 2x − 1 = −3/2, suy ra x = 5/4 hoặc x = −1/4. Chỉ chọn x = 5/4 là bỏ sót trường hợp cơ số âm. | \((2x - 1)^{2} = (\frac{3}{2})^{2}\) nên \(2x - 1 = \frac{3}{2}\) hoặc \(2x - 1 = -\frac{3}{2}\), suy ra \(x = \frac{5}{4}\) hoặc \(x = -\frac{1}{4}\). Chỉ chọn \(x = \frac{5}{4}\) là bỏ sót trường hợp cơ số âm. |
| 7-NC-304 | content | Giá trị của biểu thức (4^5 · 9^4) : (2 · 6^8) là bao nhiêu? | Giá trị của biểu thức \((4^{5} \cdot 9^{4}) : (2 \cdot 6^{8})\) là bao nhiêu? |
| 7-NC-304 | options.2 | 1/2 | \(\frac{1}{2}\) |
| 7-NC-304 | explanation | 4^5 = 2^10, 9^4 = 3^8, 2·6^8 = 2^9·3^8. Thương bằng 2^10·3^8 : (2^9·3^8) = 2. Kết quả 1 là quên thừa số 2 hoặc viết nhầm 4^5 thành 2^9. | \(4^{5} = 2^{10}\), \(9^{4} = 3^{8}\), \(2\cdot 6^{8} = 2^{9}\cdot 3^{8}\). Thương bằng \(2^{10}\cdot 3^{8} : (2^{9}\cdot 3^{8}) = 2\). Kết quả 1 là quên thừa số 2 hoặc viết nhầm \(4^{5}\) thành \(2^{9}\). |
| 7-NC-305 | content | Có bao nhiêu số nguyên x thỏa mãn \|x\| < √10? | Có bao nhiêu số nguyên \(x\) thỏa mãn \(\|x\| < \sqrt{10}\)? |
| 7-NC-305 | explanation | √10 ≈ 3,16 nên \|x\| ≤ 3, tức x ∈ {−3; −2; −1; 0; 1; 2; 3}, có 7 số. Đáp án 6 là quên số 0, còn 3 là chỉ đếm các số dương. | \(\sqrt{10} \approx 3{,}16\) nên \(\|x\| \le 3\), tức x ∈ {−3; −2; −1; 0; 1; 2; 3}, có 7 số. Đáp án 6 là quên số 0, còn 3 là chỉ đếm các số dương. |
| 7-NC-306 | content | Giá trị nhỏ nhất của A = (x − 3)^2 + \|y + 1\| − 5 là bao nhiêu? | Giá trị nhỏ nhất của \(A = (x - 3)^{2} + \|y + 1\| - 5\) là bao nhiêu? |
| 7-NC-306 | explanation | (x − 3)^2 ≥ 0 và \|y + 1\| ≥ 0 nên A ≥ −5. Dấu bằng xảy ra khi x = 3 và y = −1. Vậy giá trị nhỏ nhất là −5, không phải 0. | \((x - 3)^{2} \ge 0\) và \(\|y + 1\| \ge 0\) nên \(A \ge -5\). Dấu bằng xảy ra khi \(x = 3\) và \(y = -1\). Vậy giá trị nhỏ nhất là −5, không phải 0. |
| 7-NC-307 | content | Đa thức P(x) = x^2 − 4x có các nghiệm nào? | Đa thức \(P(x) = x^{2} - 4x\) có các nghiệm nào? |
| 7-NC-307 | options.0 | Chỉ x = 4 | Chỉ \(x = 4\) |
| 7-NC-307 | options.1 | x = 2 và x = −2 | \(x = 2\) và \(x = -2\) |
| 7-NC-307 | options.2 | x = 0 và x = 4 | \(x = 0\) và \(x = 4\) |
| 7-NC-307 | options.3 | x = 0 và x = −4 | \(x = 0\) và \(x = -4\) |
| 7-NC-307 | explanation | P(x) = x(x − 4) = 0 khi x = 0 hoặc x = 4. Nhiều bạn chia cả hai vế cho x nên mất nghiệm x = 0. Còn x = ±2 là nghiệm của x^2 − 4. | \(P(x) = x(x - 4) = 0\) khi \(x = 0\) hoặc \(x = 4\). Nhiều bạn chia cả hai vế cho \(x\) nên mất nghiệm \(x = 0\). Còn \(x = \pm 2\) là nghiệm của \(x^{2} - 4\). |
| 7-NC-308 | content | Thực hiện phép chia (x^3 − 8) : (x − 2) được thương là đa thức nào? | Thực hiện phép chia \((x^{3} - 8) : (x - 2)\) được thương là đa thức nào? |
| 7-NC-308 | options.0 | x^2 − 2x + 4 | \(x^{2} - 2x + 4\) |
| 7-NC-308 | options.1 | x^2 + 4 | \(x^{2} + 4\) |
| 7-NC-308 | options.2 | x^2 + 2x − 4 | \(x^{2} + 2x - 4\) |
| 7-NC-308 | options.3 | x^2 + 2x + 4 | \(x^{2} + 2x + 4\) |
| 7-NC-308 | explanation | Thử lại: (x − 2)(x^2 + 2x + 4) = x^3 + 2x^2 + 4x − 2x^2 − 4x − 8 = x^3 − 8. Với x^2 − 2x + 4, tích có các hạng tử x^2 và x không triệt tiêu. | Thử lại: \((x - 2)(x^{2} + 2x + 4) = x^{3} + 2x^{2} + 4x - 2x^{2} - 4x - 8 = x^{3} - 8\). Với \(x^{2} - 2x + 4\), tích có các hạng tử \(x^{2}\) và \(x\) không triệt tiêu. |
| 7-NC-309 | content | Hệ số của x^2 trong tích (2x − 3)(x^2 + x − 1) là bao nhiêu? | Hệ số của \(x^{2}\) trong tích \((2x - 3)(x^{2} + x - 1)\) là bao nhiêu? |
| 7-NC-309 | explanation | Khai triển: 2x^3 + 2x^2 − 2x − 3x^2 − 3x + 3 = 2x^3 − x^2 − 5x + 3. Hệ số của x^2 là −1. Còn −5 là hệ số của x. | Khai triển: \(2x^{3} + 2x^{2} - 2x - 3x^{2} - 3x + 3 = 2x^{3} - x^{2} - 5x + 3\). Hệ số của \(x^{2}\) là −1. Còn −5 là hệ số của \(x\). |
| 7-NC-310 | content | Tam giác ABC cân tại A có góc A = 40°. Tia phân giác của góc B cắt AC tại D. Số đo góc ADB là bao nhiêu? | Tam giác ABC cân tại \(A\) có góc \(A = 40^\circ\). Tia phân giác của góc \(B\) cắt AC tại \(D\). Số đo góc ADB là bao nhiêu? |
| 7-NC-310 | explanation | Góc B = góc C = (180° − 40°) : 2 = 70°, nên góc ABD = 35°. Do đó góc ADB = 180° − 40° − 35° = 105°. Kết quả 75° là góc BDC, kề bù với góc ADB. | Góc \(B\) = góc \(C = (180^\circ - 40^\circ) : 2 = 70^\circ\), nên góc \(ABD = 35^\circ\). Do đó góc \(ADB = 180^\circ - 40^\circ - 35^\circ = 105^\circ\). Kết quả 75° là góc BDC, kề bù với góc ADB. |
| 7-NC-311 | content | Tam giác ABC có hai đường trung tuyến BM và CN cắt nhau tại G. Biết BM = 12 cm, CN = 9 cm. Tổng BG + CG bằng bao nhiêu? | Tam giác ABC có hai đường trung tuyến BM và CN cắt nhau tại \(G\). Biết \(BM = 12\) cm, \(CN = 9\) cm. Tổng \(BG + CG\) bằng bao nhiêu? |
| 7-NC-311 | explanation | Trọng tâm G chia mỗi trung tuyến sao cho khoảng cách từ đỉnh bằng 2/3 trung tuyến: BG = 8 cm, CG = 6 cm, tổng 14 cm. Kết quả 7 cm là lấy nhầm 1/3 trung tuyến (GM + GN). | Trọng tâm \(G\) chia mỗi trung tuyến sao cho khoảng cách từ đỉnh bằng \(\frac{2}{3}\) trung tuyến: \(BG = 8\) cm, \(CG = 6\) cm, tổng 14 cm. Kết quả 7 cm là lấy nhầm \(\frac{1}{3}\) trung tuyến \((GM + GN)\). |
| 7-NC-312 | explanation | Nếu ba cạnh là 3; 3; 7 thì 3 + 3 < 7, vi phạm bất đẳng thức tam giác. Vậy ba cạnh là 7; 7; 3 và chu vi bằng 17 cm. Chọn "13 cm hoặc 17 cm" là chưa kiểm tra điều kiện tồn tại tam giác. | Nếu ba cạnh là 3; 3; 7 thì \(3 + 3 < 7\), vi phạm bất đẳng thức tam giác. Vậy ba cạnh là 7; 7; 3 và chu vi bằng 17 cm. Chọn "13 cm hoặc 17 cm" là chưa kiểm tra điều kiện tồn tại tam giác. |
| 7-NC-313 | options.0 | 1/10 | \(\frac{1}{10}\) |
| 7-NC-313 | options.1 | 11/90 | \(\frac{11}{90}\) |
| 7-NC-313 | options.2 | 1/8 | \(\frac{1}{8}\) |
| 7-NC-313 | options.3 | 1/9 | \(\frac{1}{9}\) |
| 7-NC-313 | explanation | Có 90 số có hai chữ số (từ 10 đến 99). Các số chia hết cho 9 là 18, 27, …, 99, có 10 số. Xác suất = 10/90 = 1/9. Kết quả 11/90 là đếm nhầm cả số 9, vốn chỉ có một chữ số. | Có 90 số có hai chữ số (từ 10 đến 99). Các số chia hết cho 9 là 18, 27, …, 99, có 10 số. Xác suất = \(\frac{10}{90} = \frac{1}{9}\). Kết quả \(\frac{11}{90}\) là đếm nhầm cả số 9, vốn chỉ có một chữ số. |
| 7-NC-314 | content | Lớp 7A có 40 học sinh. Biểu đồ quạt tròn cho thấy học lực Tốt chiếm 25%, Khá chiếm 45%, còn lại là Đạt. Lớp có bao nhiêu học sinh xếp loại Đạt? | Lớp \(7A\) có 40 học sinh. Biểu đồ quạt tròn cho thấy học lực Tốt chiếm 25%, Khá chiếm 45%, còn lại là Đạt. Lớp có bao nhiêu học sinh xếp loại Đạt? |
| 7-NC-314 | explanation | Tỉ lệ Đạt là 100% − 25% − 45% = 30%, nên số học sinh là 30% · 40 = 12. Kết quả 18 là số học sinh Khá, còn 30 là nhầm phần trăm thành số học sinh. | Tỉ lệ Đạt là \(100\% - 25\% - 45\% = 30\%\), nên số học sinh là \(30\% \cdot 40 = 12\). Kết quả 18 là số học sinh Khá, còn 30 là nhầm phần trăm thành số học sinh. |
| 7-NC-315 | content | Hình hộp chữ nhật có đáy là hình chữ nhật 5 cm × 4 cm và diện tích xung quanh bằng 90 cm^2. Thể tích của hình hộp là bao nhiêu? | Hình hộp chữ nhật có đáy là hình chữ nhật 5 cm × 4 cm và diện tích xung quanh bằng 90 cm². Thể tích của hình hộp là bao nhiêu? |
| 7-NC-315 | options.0 | 90 cm^3 | 90 cm³ |
| 7-NC-315 | options.1 | 180 cm^3 | 180 cm³ |
| 7-NC-315 | options.2 | 100 cm^3 | 100 cm³ |
| 7-NC-315 | options.3 | 450 cm^3 | 450 cm³ |
| 7-NC-315 | explanation | S xung quanh = chu vi đáy · chiều cao = 18 · h = 90, suy ra h = 5 cm. Thể tích = 5 · 4 · 5 = 100 cm^3. Kết quả 450 cm^3 là lấy nhầm 90 · 5. | \(S\) xung quanh = chu vi đáy · chiều cao = \(18 \cdot h = 90\), suy ra \(h = 5\) cm. Thể tích = \(5 \cdot 4 \cdot 5 = 100\) cm³. Kết quả 450 cm³ là lấy nhầm \(90 \cdot 5\). |
| 7-NC-316 | content | Cho x/3 = y/5 và x·y = 60. Giá trị của x là bao nhiêu? | Cho \(\frac{x}{3} = \frac{y}{5}\) và \(x\cdot y = 60\). Giá trị của \(x\) là bao nhiêu? |
| 7-NC-316 | options.0 | x = 6 | \(x = 6\) |
| 7-NC-316 | options.1 | x = −6 | \(x = -6\) |
| 7-NC-316 | options.2 | x = 12 | \(x = 12\) |
| 7-NC-316 | options.3 | x = 6 hoặc x = −6 | \(x = 6\) hoặc \(x = -6\) |
| 7-NC-316 | explanation | Đặt x = 3k, y = 5k thì 15k^2 = 60, suy ra k^2 = 4, tức k = 2 hoặc k = −2. Vậy x = 6 hoặc x = −6. Chỉ chọn x = 6 là quên trường hợp k âm (khi đó x, y cùng âm, tích vẫn dương). | Đặt \(x = 3k\), \(y = 5k\) thì \(15k^{2} = 60\), suy ra \(k^{2} = 4\), tức \(k = 2\) hoặc \(k = -2\). Vậy \(x = 6\) hoặc \(x = -6\). Chỉ chọn \(x = 6\) là quên trường hợp \(k\) âm (khi đó \(x\), \(y\) cùng âm, tích vẫn dương). |
| 7-NC-317 | explanation | KLPT Fe₂O₃ = 2·56 + 3·16 = 160 amu, nên %Fe = 112/160 · 100% = 70%. Kết quả 30% là phần trăm của oxygen, còn 35% là quên chỉ số 2 của Fe. | KLPT Fe₂O₃ = \(2\cdot 56 + 3\cdot 16 = 160\) amu, nên %Fe = \(\frac{112}{160} \cdot 100\% = 70\%\). Kết quả 30% là phần trăm của oxygen, còn 35% là quên chỉ số 2 của Fe. |
| 7-NC-318 | content | Hợp chất X chỉ gồm sulfur và oxygen, trong đó sulfur chiếm 50% khối lượng. Công thức của X là gì? (S = 32, O = 16) | Hợp chất X chỉ gồm sulfur và oxygen, trong đó sulfur chiếm 50% khối lượng. Công thức của X là gì? (\(S = 32\), \(O = 16\)) |
| 7-NC-318 | explanation | Với SO₂: %S = 32/64 = 50%, đúng yêu cầu. SO₃ có %S = 32/80 = 40%, còn SO có %S ≈ 66,7%. | Với SO₂: \(\%S = \frac{32}{64} = 50\%\), đúng yêu cầu. SO₃ có \(\%S = \frac{32}{80} = 40\%\), còn SO có %S ≈ 66,7%. |
| 7-NC-319 | explanation | Theo quy tắc hóa trị: 2·x = 3·II, suy ra x = III. Đáp án VI là quên chia cho chỉ số 2 của Fe. | Theo quy tắc hóa trị: \(2\cdot x\) = 3·II, suy ra x = III. Đáp án VI là quên chia cho chỉ số 2 của Fe. |
| 7-NC-320 | explanation | Khối lượng electron rất nhỏ nên khối lượng nguyên tử ≈ số p + số n = 11 + 12 = 23 amu (đó là sodium). Kết quả 34 amu là cộng cả 11 electron như thể mỗi electron nặng 1 amu. | Khối lượng electron rất nhỏ nên khối lượng nguyên tử ≈ số p + số \(n = 11 + 12 = 23\) amu (đó là sodium). Kết quả 34 amu là cộng cả 11 electron như thể mỗi electron nặng 1 amu. |
| 7-NC-322 | explanation | Gọi mỗi nửa là s: tổng thời gian = s/60 + s/40 = s/24. Tốc độ trung bình = 2s : (s/24) = 48 km/h. Kết quả 50 km/h là lấy trung bình cộng hai tốc độ, sai vì thời gian đi hai nửa khác nhau. | Gọi mỗi nửa là s: tổng thời gian = \(\frac{s}{60} + \frac{s}{40} = \frac{s}{24}\). Tốc độ trung bình = 2s : \((\frac{s}{24}) = 48\) km/h. Kết quả 50 km/h là lấy trung bình cộng hai tốc độ, sai vì thời gian đi hai nửa khác nhau. |
| 7-NC-323 | explanation | 72 km/h = 20 m/s, nên s = 20 · 0,8 = 16 m. Kết quả 57,6 m là nhân trực tiếp 72 · 0,8 mà chưa đổi đơn vị. | 72 km/h = 20 m/s, nên \(s = 20 \cdot 0{,}8 = 16\) m. Kết quả 57,6 m là nhân trực tiếp \(72 \cdot 0{,}8\) mà chưa đổi đơn vị. |
| 7-NC-324 | explanation | Tổng quãng đường 180 m, tổng thời gian 40 + 20 + 20 = 80 s, nên v = 180 : 80 = 2,25 m/s. Kết quả 3 m/s là bỏ qua 20 s vật dừng lại. | Tổng quãng đường 180 m, tổng thời gian \(40 + 20 + 20 = 80\) s, nên \(v = 180 : 80 = 2{,}25\) m/s. Kết quả 3 m/s là bỏ qua 20 s vật dừng lại. |
| 7-NC-325 | content | Ta nghe được tiếng vang khi âm phản xạ đến tai chậm hơn âm trực tiếp ít nhất 1/15 s. Biết tốc độ âm là 340 m/s. Phải đứng cách vách ít nhất bao xa để nghe tiếng vang? | Ta nghe được tiếng vang khi âm phản xạ đến tai chậm hơn âm trực tiếp ít nhất \(\frac{1}{15} s\). Biết tốc độ âm là 340 m/s. Phải đứng cách vách ít nhất bao xa để nghe tiếng vang? |
| 7-NC-325 | explanation | Trong 1/15 s, âm đi được 340/15 ≈ 22,7 m. Quãng đường này gồm cả lượt đi và lượt về, nên khoảng cách tới vách ≈ 11,3 m. Chọn 22,7 m là quên chia đôi. | Trong \(\frac{1}{15} s\), âm đi được \(\frac{340}{15} \approx 22{,}7\) m. Quãng đường này gồm cả lượt đi và lượt về, nên khoảng cách tới vách ≈ 11,3 m. Chọn 22,7 m là quên chia đôi. |
| 7-NC-326 | explanation | Tần số của A = 1 200 : 60 = 20 Hz, của B = 30 Hz. Tần số lớn hơn thì âm cao hơn, nên B phát âm cao hơn. Con số 1 200 lần lớn hơn nhưng được đếm trong thời gian dài hơn. | Tần số của \(A = 1\,200 : 60 = 20\) Hz, của \(B = 30\) Hz. Tần số lớn hơn thì âm cao hơn, nên B phát âm cao hơn. Con số 1 200 lần lớn hơn nhưng được đếm trong thời gian dài hơn. |
| 7-NC-327 | explanation | Lúc sau người cách gương 2 − 0,5 = 1,5 m. Ảnh cách gương cũng 1,5 m nên người cách ảnh 3 m. Kết quả 1,5 m là chỉ tính khoảng cách từ người đến gương. | Lúc sau người cách gương \(2 - 0{,}5 = 1{,}5\) m. Ảnh cách gương cũng 1,5 m nên người cách ảnh 3 m. Kết quả 1,5 m là chỉ tính khoảng cách từ người đến gương. |
| 8-CB-101 | content | Bậc của đơn thức 3x^2y^3 là bao nhiêu? | Bậc của đơn thức \(3x^{2}y^{3}\) là bao nhiêu? |
| 8-CB-101 | explanation | Bậc của đơn thức là tổng số mũ của các biến: 2 + 3 = 5. Hệ số 3 không tính vào bậc; nhân các số mũ (2 . 3 = 6) là sai. | Bậc của đơn thức là tổng số mũ của các biến: \(2 + 3 = 5\). Hệ số 3 không tính vào bậc; nhân các số mũ \((2 \cdot 3 = 6)\) là sai. |
| 8-CB-102 | content | Khai triển (x − 2)^3 ta được kết quả nào? | Khai triển \((x - 2)^{3}\) ta được kết quả nào? |
| 8-CB-102 | options.0 | x^3 − 6x^2 + 12x − 8 | \(x^{3} - 6x^{2} + 12x - 8\) |
| 8-CB-102 | options.1 | x^3 − 8 | \(x^{3} - 8\) |
| 8-CB-102 | options.2 | x^3 + 6x^2 + 12x − 8 | \(x^{3} + 6x^{2} + 12x - 8\) |
| 8-CB-102 | options.3 | x^3 − 6x^2 − 12x − 8 | \(x^{3} - 6x^{2} - 12x - 8\) |
| 8-CB-102 | explanation | (a − b)^3 = a^3 − 3a^2b + 3ab^2 − b^3, với a = x, b = 2 được x^3 − 6x^2 + 12x − 8. Viết x^3 − 8 là quên các hạng tử giữa. | \((a - b)^{3} = a^{3} - 3a^{2}b + 3ab^{2} - b^{3}\), với \(a = x\), \(b = 2\) được \(x^{3} - 6x^{2} + 12x - 8\). Viết \(x^{3} - 8\) là quên các hạng tử giữa. |
| 8-CB-103 | explanation | Theo định lí Pythagore: cạnh huyền^2 = 6^2 + 8^2 = 36 + 64 = 100, nên cạnh huyền = 10 cm. Cộng trực tiếp 6 + 8 = 14 là sai. | Theo định lí Pythagore: cạnh huyền^2 = \(6^{2} + 8^{2} = 36 + 64 = 100\), nên cạnh huyền = 10 cm. Cộng trực tiếp \(6 + 8 = 14\) là sai. |
| 8-CB-104 | content | Nghiệm của phương trình 2x + 5 = 11 là? | Nghiệm của phương trình \(2x + 5 = 11\) là? |
| 8-CB-104 | options.0 | x = 8 | \(x = 8\) |
| 8-CB-104 | options.1 | x = 3 | \(x = 3\) |
| 8-CB-104 | options.2 | x = −3 | \(x = -3\) |
| 8-CB-104 | options.3 | x = 5 | \(x = 5\) |
| 8-CB-104 | explanation | 2x = 11 − 5 = 6 nên x = 3. Nếu chuyển vế quên đổi dấu (2x = 16) sẽ ra x = 8, sai. | \(2x = 11 - 5 = 6\) nên \(x = 3\). Nếu chuyển vế quên đổi dấu \((2x = 16)\) sẽ ra \(x = 8\), sai. |
| 8-CB-106 | content | Tam giác ABC có DE // BC (D ∈ AB, E ∈ AC), AD = 2 cm, DB = 3 cm, AE = 4 cm. Độ dài EC là? | Tam giác ABC có DE // BC (D ∈ AB, \(E \in AC\)), \(AD = 2\) cm, \(DB = 3\) cm, \(AE = 4\) cm. Độ dài EC là? |
| 8-CB-106 | options.1 | 8/3 cm | \(\frac{8}{3}\) cm |
| 8-CB-106 | explanation | Theo định lí Thalès: AD/DB = AE/EC ⇒ 2/3 = 4/EC ⇒ EC = 6 cm. Lấy AD/AB = AE/EC (2/5 = 4/EC) ra 10 cm là lập sai tỉ số. | Theo định lí Thalès: \(\frac{AD}{DB} = \frac{AE}{EC} \Rightarrow \frac{2}{3} = \frac{4}{EC} \Rightarrow EC = 6\) cm. Lấy \(\frac{AD}{AB} = \frac{AE}{EC} (\frac{2}{5} = \frac{4}{EC})\) ra 10 cm là lập sai tỉ số. |
| 8-NC-101 | content | Tìm m để đường thẳng y = (m − 1)x + 3 song song với đường thẳng y = 2x − 1. | Tìm \(m\) để đường thẳng \(y = (m - 1)x + 3\) song song với đường thẳng \(y = 2x - 1\). |
| 8-NC-101 | options.0 | m = 2 | \(m = 2\) |
| 8-NC-101 | options.1 | m = 3 | \(m = 3\) |
| 8-NC-101 | options.2 | m = 1 | \(m = 1\) |
| 8-NC-101 | options.3 | m = −1 | \(m = -1\) |
| 8-NC-101 | explanation | Hai đường thẳng song song khi hệ số góc bằng nhau và tung độ gốc khác nhau: m − 1 = 2 ⇒ m = 3 (và 3 ≠ −1). Chọn m = 2 là quên trừ 1. | Hai đường thẳng song song khi hệ số góc bằng nhau và tung độ gốc khác nhau: \(m - 1 = 2 \Rightarrow m = 3\) (và \(3 \ne -1\)). Chọn \(m = 2\) là quên trừ 1. |
| 8-NC-109 | explanation | n(Mg) = 2,4 : 24 = 0,1 mol; theo phương trình n(MgO) = n(Mg) = 0,1 mol; m(MgO) = 0,1 × 40 = 4 g. Ra 2 g là nhầm tỉ lệ mol 2 : 1. | n(Mg) = \(2{,}4 : 24 = 0{,}1\) mol; theo phương trình n(MgO) = n(Mg) = 0,1 mol; m(MgO) = \(0{,}1 \times 40 = 4\) g. Ra 2 g là nhầm tỉ lệ mol \(2 : 1\). |
| 8-NC-111 | explanation | n(NaOH) = 8 : 40 = 0,2 mol; V = 200 mL = 0,2 L; C(M) = 0,2 : 0,2 = 1 M. Ra 0,04 M là do lấy 8 : 200, quên đổi khối lượng ra mol và mL ra L. | n(NaOH) = \(8 : 40 = 0{,}2\) mol; V = 200 mL = 0,2 L; C(M) = 0,2 : 0,2 = 1 M. Ra 0,04 M là do lấy \(8 : 200\), quên đổi khối lượng ra mol và mL ra L. |
| 8-CB-201 | content | Thu gọn đa thức P = x^3y + 2x^2y^2 − x^3y + 5xy. Bậc của P là bao nhiêu? | Thu gọn đa thức \(P = x^{3}y + 2x^{2}y^{2} - x^{3}y + 5xy\). Bậc của \(P\) là bao nhiêu? |
| 8-CB-201 | explanation | Hai hạng tử x^3y và −x^3y triệt tiêu, còn P = 2x^2y^2 + 5xy. Hạng tử bậc cao nhất là 2x^2y^2 có bậc 2 + 2 = 4. Chọn 2 là chỉ nhìn hạng tử 5xy. | Hai hạng tử \(x^{3}y\) và \(-x^{3}y\) triệt tiêu, còn \(P = 2x^{2}y^{2} + 5xy\). Hạng tử bậc cao nhất là \(2x^{2}y^{2}\) có bậc \(2 + 2 = 4\). Chọn 2 là chỉ nhìn hạng tử \(5xy\). |
| 8-CB-202 | content | Tính nhanh: 102^2 − 98^2 = ? | Tính nhanh: \(102^{2} - 98^{2}\) = ? |
| 8-CB-202 | explanation | Áp dụng a^2 − b^2 = (a − b)(a + b): (102 − 98)(102 + 98) = 4 . 200 = 800. Kết quả 16 là do lấy (102 − 98)^2, sai hằng đẳng thức. | Áp dụng \(a^{2} - b^{2} = (a - b)(a + b)\): \((102 - 98)(102 + 98) = 4 \cdot 200 = 800\). Kết quả 16 là do lấy \((102 - 98)^{2}\), sai hằng đẳng thức. |
| 8-CB-203 | content | Phân tích đa thức 3x^2 − 12 thành nhân tử ta được: | Phân tích đa thức \(3x^{2} - 12\) thành nhân tử ta được: |
| 8-CB-203 | options.0 | 3(x − 2)(x + 2) | \(3(x - 2)(x + 2)\) |
| 8-CB-203 | options.1 | 3(x − 4)(x + 4) | \(3(x - 4)(x + 4)\) |
| 8-CB-203 | options.2 | 3(x − 2)^2 | \(3(x - 2)^{2}\) |
| 8-CB-203 | options.3 | (3x − 4)(x + 3) | \((3x - 4)(x + 3)\) |
| 8-CB-203 | explanation | Đặt nhân tử chung 3: 3(x^2 − 4), rồi dùng hiệu hai bình phương x^2 − 4 = (x − 2)(x + 2). Chọn 3(x − 4)(x + 4) là nhầm 4 = 4^2, trong khi 4 = 2^2 (khai triển 3(x − 4)(x + 4) ra 3x^2 − 48). | Đặt nhân tử chung 3: \(3(x^{2} - 4)\), rồi dùng hiệu hai bình phương \(x^{2} - 4 = (x - 2)(x + 2)\). Chọn \(3(x - 4)(x + 4)\) là nhầm \(4 = 4^{2}\), trong khi \(4 = 2^{2}\) (khai triển \(3(x - 4)(x + 4)\) ra \(3x^{2} - 48\)). |
| 8-CB-204 | content | Rút gọn phân thức (x^2 − 4)/(x + 2) với x ≠ −2, ta được: | Rút gọn phân thức \(\frac{x^{2} - 4}{x + 2}\) với \(x \ne -2\), ta được: |
| 8-CB-204 | options.0 | x + 2 | \(x + 2\) |
| 8-CB-204 | options.1 | x − 4 | \(x - 4\) |
| 8-CB-204 | options.2 | x − 2 | \(x - 2\) |
| 8-CB-204 | options.3 | x^2 − 2 | \(x^{2} - 2\) |
| 8-CB-204 | explanation | Tử x^2 − 4 = (x − 2)(x + 2). Chia cả tử và mẫu cho nhân tử chung x + 2 được x − 2. Không được “gạch” từng số hạng như x^2/x hay 4/2. | Tử \(x^{2} - 4 = (x - 2)(x + 2)\). Chia cả tử và mẫu cho nhân tử chung \(x + 2\) được \(x - 2\). Không được “gạch” từng số hạng như \(\frac{x^{2}}{x}\) hay \(\frac{4}{2}\). |
| 8-CB-205 | content | Với x ≠ 1, kết quả của phép tính x/(x − 1) − 1/(x − 1) là: | Với \(x \ne 1\), kết quả của phép tính \(\frac{x}{x - 1} - \frac{1}{x - 1}\) là: |
| 8-CB-205 | options.2 | x | \(x\) |
| 8-CB-205 | options.3 | (x + 1)/(x − 1) | \(\frac{x + 1}{x - 1}\) |
| 8-CB-205 | explanation | Hai phân thức cùng mẫu nên trừ các tử: (x − 1)/(x − 1) = 1 (vì x ≠ 1). Kết quả (x + 1)/(x − 1) là do cộng nhầm tử thay vì trừ. | Hai phân thức cùng mẫu nên trừ các tử: \(\frac{x - 1}{x - 1} = 1\) (vì \(x \ne 1\)). Kết quả \(\frac{x + 1}{x - 1}\) là do cộng nhầm tử thay vì trừ. |
| 8-CB-206 | content | Hình thang cân ABCD (AB // CD) có góc C = 65°. Số đo góc A là: | Hình thang cân ABCD (AB // CD) có góc \(\mathrm{C} = 65^\circ\). Số đo góc A là: |
| 8-CB-206 | explanation | Hình thang cân có hai góc kề đáy CD bằng nhau nên góc D = 65°. Góc A và góc D là hai góc trong cùng phía (AB // CD) nên A = 180° − 65° = 115°. | Hình thang cân có hai góc kề đáy CD bằng nhau nên góc \(\mathrm{D} = 65^\circ\). Góc A và góc D là hai góc trong cùng phía (AB // CD) nên \(A = 180^\circ - 65^\circ = 115^\circ\). |
| 8-CB-207 | explanation | Ta có 5^2 + 12^2 = 25 + 144 = 169 = 13^2 nên theo định lí Pythagore đảo, tam giác là vuông. Các bộ còn lại: 16 + 25 ≠ 36; 36 + 49 ≠ 81; 4 + 9 ≠ 16. | Ta có \(5^{2} + 12^{2} = 25 + 144 = 169 = 13^{2}\) nên theo định lí Pythagore đảo, tam giác là vuông. Các bộ còn lại: \(16 + 25 \ne 36\); \(36 + 49 \ne 81\); \(4 + 9 \ne 16\). |
| 8-CB-208 | content | Nghiệm của phương trình 3(x − 2) = x + 4 là: | Nghiệm của phương trình \(3(x - 2) = x + 4\) là: |
| 8-CB-208 | options.0 | x = 5 | \(x = 5\) |
| 8-CB-208 | options.1 | x = 3 | \(x = 3\) |
| 8-CB-208 | options.2 | x = 1 | \(x = 1\) |
| 8-CB-208 | options.3 | x = −5 | \(x = -5\) |
| 8-CB-208 | explanation | Bỏ ngoặc: 3x − 6 = x + 4 ⇒ 3x − x = 4 + 6 ⇒ 2x = 10 ⇒ x = 5. Nếu quên nhân 3 với −2 (viết 3x − 2) sẽ ra x = 3, sai. | Bỏ ngoặc: \(3x - 6 = x + 4 \Rightarrow 3x - x = 4 + 6 \Rightarrow 2x = 10 \Rightarrow x = 5\). Nếu quên nhân 3 với −2 (viết \(3x - 2\)) sẽ ra \(x = 3\), sai. |
| 8-CB-209 | content | Điểm nào sau đây thuộc đồ thị hàm số y = 2x − 1? | Điểm nào sau đây thuộc đồ thị hàm số \(y = 2x - 1\)? |
| 8-CB-209 | explanation | Thay x = 2: y = 2 . 2 − 1 = 3 nên (2; 3) thuộc đồ thị. Kiểm tra: x = 1 cho y = 1; x = 0 cho y = −1; x = −1 cho y = −3, đều không khớp. | Thay \(x = 2\): \(y = 2 \cdot 2 - 1 = 3\) nên (2; 3) thuộc đồ thị. Kiểm tra: \(x = 1\) cho \(y = 1\); \(x = 0\) cho \(y = -1\); \(x = -1\) cho \(y = -3\), đều không khớp. |
| 8-CB-210 | content | Cho ΔABC ∽ ΔDEF theo tỉ số đồng dạng k = 3. Biết AB = 6 cm, độ dài DE là: | Cho ΔABC ∽ ΔDEF theo tỉ số đồng dạng \(k = 3\). Biết \(AB = 6\) cm, độ dài DE là: |
| 8-CB-210 | explanation | ΔABC ∽ ΔDEF theo tỉ số k nghĩa là AB/DE = 3, suy ra DE = 6 : 3 = 2 cm. Đáp số 18 cm là nhầm chiều tỉ số (nhân thay vì chia). | ΔABC ∽ ΔDEF theo tỉ số \(k\) nghĩa là \(\frac{AB}{DE} = 3\), suy ra \(DE = 6 : 3 = 2\) cm. Đáp số 18 cm là nhầm chiều tỉ số (nhân thay vì chia). |
| 8-CB-211 | options.0 | 144 cm^2 | 144 cm² |
| 8-CB-211 | options.1 | 72 cm^2 | 72 cm² |
| 8-CB-211 | options.2 | 48 cm^2 | 48 cm² |
| 8-CB-211 | options.3 | 96 cm^2 | 96 cm² |
| 8-CB-211 | explanation | Sxq = p . d, p là nửa chu vi đáy: p = 3 . 6 : 2 = 9 cm, nên Sxq = 9 . 8 = 72 cm^2. Kết quả 144 cm^2 là do dùng cả chu vi thay cho nửa chu vi. | \(Sxq = p \cdot d\), \(p\) là nửa chu vi đáy: \(p = 3 \cdot 6 : 2 = 9\) cm, nên \(Sxq = 9 \cdot 8 = 72\) cm². Kết quả 144 cm² là do dùng cả chu vi thay cho nửa chu vi. |
| 8-CB-212 | options.0 | 1/3 | \(\frac{1}{3}\) |
| 8-CB-212 | options.1 | 3/7 | \(\frac{3}{7}\) |
| 8-CB-212 | options.2 | 1/10 | \(\frac{1}{10}\) |
| 8-CB-212 | options.3 | 3/10 | \(\frac{3}{10}\) |
| 8-CB-212 | explanation | Có 10 kết quả đồng khả năng, trong đó 3 kết quả thuận lợi (bi xanh), nên P = 3/10. Đáp số 3/7 là do chia cho số bi không xanh (7) thay vì tổng số bi. | Có 10 kết quả đồng khả năng, trong đó 3 kết quả thuận lợi (bi xanh), nên \(P = \frac{3}{10}\). Đáp số \(\frac{3}{7}\) là do chia cho số bi không xanh (7) thay vì tổng số bi. |
| 8-CB-231 | explanation | Theo định luật bảo toàn khối lượng: m(CO₂) = m(C) + m(O₂) = 3 + 8 = 11 g. Đáp số 5 g là do lấy hiệu thay vì tổng khối lượng các chất tham gia. | Theo định luật bảo toàn khối lượng: m(CO₂) = \(m(C)\) + m(O₂) = \(3 + 8 = 11\) g. Đáp số 5 g là do lấy hiệu thay vì tổng khối lượng các chất tham gia. |
| 8-CB-232 | explanation | n = m/M = 11,2 : 56 = 0,2 mol. Lấy 56 : 11,2 = 5 rồi suy ra 0,5 mol là chia ngược công thức. | \(n = \frac{m}{M} = 11{,}2 : 56 = 0{,}2\) mol. Lấy \(56 : 11{,}2 = 5\) rồi suy ra 0,5 mol là chia ngược công thức. |
| 8-CB-235 | content | Một khối gỗ có thể tích 0,02 m^3 và khối lượng 16 kg. Khối lượng riêng của gỗ là: | Một khối gỗ có thể tích 0,02 m³ và khối lượng 16 kg. Khối lượng riêng của gỗ là: |
| 8-CB-235 | options.0 | 320 kg/m^3 | 320 kg/m³ |
| 8-CB-235 | options.1 | 80 kg/m^3 | 80 kg/m³ |
| 8-CB-235 | options.2 | 800 kg/m^3 | 800 kg/m³ |
| 8-CB-235 | options.3 | 8000 kg/m^3 | 8000 kg/m³ |
| 8-CB-235 | explanation | D = m/V = 16 : 0,02 = 800 kg/m^3. Các kết quả 80 hay 8000 là do đặt sai dấu phẩy khi chia cho 0,02. | \(D = \frac{m}{V} = 16 : 0{,}02 = 800\) kg/m³. Các kết quả 80 hay 8000 là do đặt sai dấu phẩy khi chia cho 0,02. |
| 8-NC-201 | content | Phân tích đa thức x^2 − 2xy + y^2 − 9 thành nhân tử ta được: | Phân tích đa thức \(x^{2} - 2xy + y^{2} - 9\) thành nhân tử ta được: |
| 8-NC-201 | options.0 | (x + y − 3)(x + y + 3) | \((x + y - 3)(x + y + 3)\) |
| 8-NC-201 | options.1 | (x − y − 9)(x − y + 9) | \((x - y - 9)(x - y + 9)\) |
| 8-NC-201 | options.2 | (x − y − 3)(x − y + 3) | \((x - y - 3)(x - y + 3)\) |
| 8-NC-201 | options.3 | (x − y − 3)^2 | \((x - y - 3)^{2}\) |
| 8-NC-201 | explanation | Nhóm x^2 − 2xy + y^2 = (x − y)^2, được (x − y)^2 − 3^2, rồi dùng hiệu hai bình phương: (x − y − 3)(x − y + 3). Nhầm thành (x − y − 9)(x − y + 9) là quên 9 = 3^2. | Nhóm \(x^{2} - 2xy + y^{2} = (x - y)^{2}\), được \((x - y)^{2} - 3^{2}\), rồi dùng hiệu hai bình phương: \((x - y - 3)(x - y + 3)\). Nhầm thành \((x - y - 9)(x - y + 9)\) là quên \(9 = 3^{2}\). |
| 8-NC-202 | content | Cho x − y = 3 và xy = 4. Giá trị của x^3 − y^3 là: | Cho \(x - y = 3\) và \(xy = 4\). Giá trị của \(x^{3} - y^{3}\) là: |
| 8-NC-202 | explanation | x^3 − y^3 = (x − y)^3 + 3xy(x − y) = 27 + 3 . 4 . 3 = 63. Kiểm tra với x = 4, y = 1: 64 − 1 = 63. Chọn 27 là chỉ tính (x − y)^3. | \(x^{3} - y^{3} = (x - y)^{3} + 3xy(x - y) = 27 + 3 \cdot 4 \cdot 3 = 63\). Kiểm tra với \(x = 4\), \(y = 1\): \(64 - 1 = 63\). Chọn 27 là chỉ tính \((x - y)^{3}\). |
| 8-NC-203 | content | Có bao nhiêu số nguyên x để phân thức A = 6/(x − 1) nhận giá trị nguyên? | Có bao nhiêu số nguyên \(x\) để phân thức \(A = \frac{6}{x - 1}\) nhận giá trị nguyên? |
| 8-NC-203 | explanation | A nguyên khi x − 1 là ước của 6: ±1, ±2, ±3, ±6, tức 8 giá trị, cho x ∈ {2; 0; 3; −1; 4; −2; 7; −5}. Chọn 4 là quên các ước âm. | \(A\) nguyên khi \(x - 1\) là ước của 6: \(\pm 1\), \(\pm 2\), \(\pm 3\), \(\pm 6\), tức 8 giá trị, cho x ∈ {2; 0; 3; −1; 4; −2; 7; −5}. Chọn 4 là quên các ước âm. |
| 8-NC-204 | content | Ô tô đi từ A đến B với vận tốc 50 km/h, rồi về A với vận tốc 40 km/h. Tổng thời gian đi và về là 4 giờ 30 phút. Quãng đường AB dài: | Ô tô đi từ \(A\) đến \(B\) với vận tốc 50 km/h, rồi về \(A\) với vận tốc 40 km/h. Tổng thời gian đi và về là 4 giờ 30 phút. Quãng đường AB dài: |
| 8-NC-204 | explanation | Gọi AB = x (km): x/50 + x/40 = 4,5 ⇒ 4x + 5x = 900 ⇒ x = 100. Không được dùng vận tốc trung bình cộng 45 km/h vì thời gian đi và về khác nhau. | Gọi \(AB = x\) (km): \(\frac{x}{50} + \frac{x}{40} = 4{,}5 \Rightarrow 4x + 5x = 900 \Rightarrow x = 100\). Không được dùng vận tốc trung bình cộng 45 km/h vì thời gian đi và về khác nhau. |
| 8-NC-205 | content | Đường thẳng y = 2x + 4 cắt trục Ox tại A và trục Oy tại B. Diện tích tam giác OAB (O là gốc tọa độ) bằng: | Đường thẳng \(y = 2x + 4\) cắt trục Ox tại \(A\) và trục Oy tại \(B\). Diện tích tam giác OAB (O là gốc tọa độ) bằng: |
| 8-NC-205 | explanation | Cho y = 0 được x = −2 nên A(−2; 0), OA = 2. Cho x = 0 được B(0; 4), OB = 4. Tam giác OAB vuông tại O: S = 2 . 4 : 2 = 4. Chọn 8 là quên chia 2. | Cho \(y = 0\) được \(x = -2\) nên A(−2; 0), \(OA = 2\). Cho \(x = 0\) được B(0; 4), \(OB = 4\). Tam giác OAB vuông tại \(O\): \(S = 2 \cdot 4 : 2 = 4\). Chọn 8 là quên chia 2. |
| 8-NC-206 | content | Cho ΔABC ∽ ΔMNP theo tỉ số đồng dạng 2/3. Biết diện tích ΔABC là 24 cm^2, diện tích ΔMNP là: | Cho ΔABC ∽ ΔMNP theo tỉ số đồng dạng \(\frac{2}{3}\). Biết diện tích ΔABC là 24 cm², diện tích ΔMNP là: |
| 8-NC-206 | options.0 | 36 cm^2 | 36 cm² |
| 8-NC-206 | options.1 | 54 cm^2 | 54 cm² |
| 8-NC-206 | options.2 | 16 cm^2 | 16 cm² |
| 8-NC-206 | options.3 | 32 cm^2 | 32 cm² |
| 8-NC-206 | explanation | Tỉ số diện tích bằng bình phương tỉ số đồng dạng: S(ABC)/S(MNP) = 4/9, nên S(MNP) = 24 . 9 : 4 = 54 cm^2. Đáp số 36 cm^2 là nhầm tỉ số diện tích bằng tỉ số đồng dạng. | Tỉ số diện tích bằng bình phương tỉ số đồng dạng: \(\frac{S(ABC)}{S(MNP)} = \frac{4}{9}\), nên \(S(MNP) = 24 \cdot 9 : 4 = 54\) cm². Đáp số 36 cm² là nhầm tỉ số diện tích bằng tỉ số đồng dạng. |
| 8-NC-207 | content | Hình chóp tứ giác đều có thể tích 200 cm^3 và chiều cao 6 cm. Độ dài cạnh đáy là: | Hình chóp tứ giác đều có thể tích 200 cm³ và chiều cao 6 cm. Độ dài cạnh đáy là: |
| 8-NC-207 | explanation | V = (1/3) . S . h ⇒ S = 3V : h = 600 : 6 = 100 cm^2. Đáy là hình vuông nên cạnh đáy bằng 10 cm. Quên hệ số 1/3 sẽ ra S ≈ 33,3 cm^2, sai. | \(V = (\frac{1}{3}) \cdot S \cdot h \Rightarrow S = 3V : h = 600 : 6 = 100\) cm². Đáy là hình vuông nên cạnh đáy bằng 10 cm. Quên hệ số \(\frac{1}{3}\) sẽ ra S ≈ 33,3 cm², sai. |
| 8-NC-208 | explanation | Mặt chẵn là 2, 4, 6: 11 + 12 + 10 = 33 lần. Xác suất thực nghiệm = 33/60 = 0,55. Kết quả 0,5 là xác suất lí thuyết, không phải xác suất thực nghiệm. | Mặt chẵn là 2, 4, 6: \(11 + 12 + 10 = 33\) lần. Xác suất thực nghiệm = \(\frac{33}{60} = 0{,}55\). Kết quả 0,5 là xác suất lí thuyết, không phải xác suất thực nghiệm. |
| 8-NC-219 | explanation | n(Al) = 5,4 : 27 = 0,2 mol; theo phương trình n(H₂) = 0,2 . 3/2 = 0,3 mol; V = 0,3 . 24,79 = 7,437 L. 6,72 L là tính theo 22,4 L/mol (điều kiện cũ); 4,958 L là quên tỉ lệ 2 : 3. | n(Al) = \(5{,}4 : 27 = 0{,}2\) mol; theo phương trình n(H₂) = \(0{,}2 \cdot \frac{3}{2} = 0{,}3\) mol; V = 0,3 . 24,79 = 7,437 L. 6,72 L là tính theo 22,4 L/mol (điều kiện cũ); 4,958 L là quên tỉ lệ \(2 : 3\). |
| 8-NC-220 | explanation | m(NaCl) = 200 . 10% + 300 . 20% = 20 + 60 = 80 g; m(dd) = 500 g; C% = 80 : 500 . 100% = 16%. Lấy trung bình cộng (10 + 20) : 2 = 15% là sai vì hai khối lượng dung dịch khác nhau. | m(NaCl) = \(200 \cdot 10\% + 300 \cdot 20\% = 20 + 60 = 80\) g; m(dd) = 500 g; C% = 80 : 500 . 100% = 16%. Lấy trung bình cộng \((10 + 20) : 2 = 15\%\) là sai vì hai khối lượng dung dịch khác nhau. |
| 8-NC-222 | content | Trong một hồ nước (d = 10 000 N/m^3), áp suất do nước gây ra tại điểm A là 30 000 Pa, tại điểm B là 50 000 Pa. Điểm B sâu hơn điểm A bao nhiêu mét? | Trong một hồ nước (\(d = 10\,000\) N/m³), áp suất do nước gây ra tại điểm A là 30 000 Pa, tại điểm B là 50 000 Pa. Điểm B sâu hơn điểm A bao nhiêu mét? |
| 8-NC-222 | explanation | p = d . h nên h(A) = 30 000 : 10 000 = 3 m, h(B) = 50 000 : 10 000 = 5 m. B sâu hơn A: 5 − 3 = 2 m. Chọn 5 m là nhầm độ sâu của B với khoảng chênh lệch. | \(p = d \cdot h\) nên \(h(A) = 30\,000 : 10\,000 = 3\) m, \(h(B) = 50\,000 : 10\,000 = 5\) m. B sâu hơn A: \(5 - 3 = 2\) m. Chọn 5 m là nhầm độ sâu của B với khoảng chênh lệch. |
| 8-NC-223 | explanation | Moment lực M = F . d không đổi: 40 . 25 = F . 40 ⇒ F = 25 N. Cánh tay đòn dài hơn thì cần lực nhỏ hơn; đáp số 64 N là nhân ngược tỉ lệ. | Moment lực \(M = F \cdot d\) không đổi: \(40 \cdot 25 = F \cdot 40 \Rightarrow F = 25\) N. Cánh tay đòn dài hơn thì cần lực nhỏ hơn; đáp số 64 N là nhân ngược tỉ lệ. |
| 8-NC-224 | content | Một vật nặng 54 N, thể tích 0,002 m^3 được treo vào lực kế rồi nhúng chìm hoàn toàn trong nước (d = 10 000 N/m^3). Số chỉ lực kế khi đó là: | Một vật nặng 54 N, thể tích 0,002 m³ được treo vào lực kế rồi nhúng chìm hoàn toàn trong nước (\(d = 10\,000\) N/m³). Số chỉ lực kế khi đó là: |
| 8-NC-224 | explanation | Lực đẩy Archimedes F = d . V = 10 000 . 0,002 = 20 N, hướng lên. Số chỉ lực kế = 54 − 20 = 34 N. Đáp số 74 N là cộng nhầm vì nghĩ lực đẩy hướng xuống. | Lực đẩy Archimedes \(F = d \cdot V = 10\,000 \cdot 0{,}002 = 20\) N, hướng lên. Số chỉ lực kế = \(54 - 20 = 34\) N. Đáp số 74 N là cộng nhầm vì nghĩ lực đẩy hướng xuống. |
| 8-CB-301 | content | Đơn thức nào sau đây đồng dạng với đơn thức −3x^2y? | Đơn thức nào sau đây đồng dạng với đơn thức \(-3x^{2}y\)? |
| 8-CB-301 | options.0 | 3x^3y | \(3x^{3}y\) |
| 8-CB-301 | options.1 | 5yx^2 | \(5yx^{2}\) |
| 8-CB-301 | options.2 | −3x^2y^2 | \(-3x^{2}y^{2}\) |
| 8-CB-301 | options.3 | −3xy^2 | \(-3xy^{2}\) |
| 8-CB-301 | explanation | Hai đơn thức đồng dạng khi có hệ số khác 0 và cùng phần biến: 5yx^2 = 5x^2y có phần biến x^2y. −3xy^2 sai vì số mũ của x và y bị đổi chỗ, chỉ giống hệ số thì chưa đủ. | Hai đơn thức đồng dạng khi có hệ số khác 0 và cùng phần biến: \(5yx^{2} = 5x^{2}y\) có phần biến \(x^{2}y\). \(-3xy^{2}\) sai vì số mũ của \(x\) và \(y\) bị đổi chỗ, chỉ giống hệ số thì chưa đủ. |
| 8-CB-302 | content | Kết quả của phép nhân 2x(x^2 − 3x + 1) là: | Kết quả của phép nhân \(2x(x^{2} - 3x + 1)\) là: |
| 8-CB-302 | options.0 | 2x^2 − 6x + 2 | \(2x^{2} - 6x + 2\) |
| 8-CB-302 | options.1 | 2x^3 − 6x^2 + 2x | \(2x^{3} - 6x^{2} + 2x\) |
| 8-CB-302 | options.2 | 2x^3 − 3x + 1 | \(2x^{3} - 3x + 1\) |
| 8-CB-302 | options.3 | 2x^3 − 6x^2 + 1 | \(2x^{3} - 6x^{2} + 1\) |
| 8-CB-302 | explanation | Nhân 2x với từng hạng tử: 2x·x^2 = 2x^3, 2x·(−3x) = −6x^2, 2x·1 = 2x. Kết quả 2x^3 − 6x^2 + 1 sai vì quên nhân 2x với hạng tử tự do 1. | Nhân \(2x\) với từng hạng tử: \(2x\cdot x^{2} = 2x^{3}\), \(2x\cdot (-3x) = -6x^{2}\), \(2x\cdot 1 = 2x\). Kết quả \(2x^{3} - 6x^{2} + 1\) sai vì quên nhân \(2x\) với hạng tử tự do 1. |
| 8-CB-303 | content | Kết quả của phép chia (6x^3y^2 − 9x^2y^3) : 3x^2y là: | Kết quả của phép chia \((6x^{3}y^{2} - 9x^{2}y^{3}) : 3x^{2}y\) là: |
| 8-CB-303 | options.0 | 2xy − 3y^2 | \(2xy - 3y^{2}\) |
| 8-CB-303 | options.1 | 3xy − 6y^2 | \(3xy - 6y^{2}\) |
| 8-CB-303 | options.2 | 2xy^2 − 3y^3 | \(2xy^{2} - 3y^{3}\) |
| 8-CB-303 | options.3 | 2x − 3y | \(2x - 3y\) |
| 8-CB-303 | explanation | Chia từng hạng tử: 6x^3y^2 : 3x^2y = 2xy; 9x^2y^3 : 3x^2y = 3y^2. Đáp số 2x − 3y sai vì đã trừ hết số mũ của y ở cả hai hạng tử. | Chia từng hạng tử: \(6x^{3}y^{2} : 3x^{2}y = 2xy\); \(9x^{2}y^{3} : 3x^{2}y = 3y^{2}\). Đáp số \(2x - 3y\) sai vì đã trừ hết số mũ của \(y\) ở cả hai hạng tử. |
| 8-CB-304 | options.0 | (a − b)^2 = a^2 − 2ab + b^2 | \((a - b)^{2} = a^{2} - 2ab + b^{2}\) |
| 8-CB-304 | options.1 | (a − b)(a + b) = a^2 − b^2 | \((a - b)(a + b) = a^{2} - b^{2}\) |
| 8-CB-304 | options.2 | a^3 − b^3 = (a − b)(a^2 − ab + b^2) | \(a^{3} - b^{3} = (a - b)(a^{2} - ab + b^{2})\) |
| 8-CB-304 | options.3 | a^3 + b^3 = (a + b)(a^2 − ab + b^2) | \(a^{3} + b^{3} = (a + b)(a^{2} - ab + b^{2})\) |
| 8-CB-304 | explanation | Đúng phải là a^3 − b^3 = (a − b)(a^2 + ab + b^2): thừa số thứ hai mang dấu cộng ở giữa. Công thức tổng hai lập phương mới có −ab, nên dễ nhầm hai công thức với nhau. | Đúng phải là \(a^{3} - b^{3} = (a - b)(a^{2} + ab + b^{2})\): thừa số thứ hai mang dấu cộng ở giữa. Công thức tổng hai lập phương mới có −ab, nên dễ nhầm hai công thức với nhau. |
| 8-CB-305 | content | Tính nhanh giá trị biểu thức 49^2 + 2·49 + 1. | Tính nhanh giá trị biểu thức \(49^{2} + 2\cdot 49 + 1\). |
| 8-CB-305 | explanation | Biểu thức có dạng a^2 + 2a + 1 = (a + 1)^2 với a = 49, nên bằng 50^2 = 2500. Kết quả 2401 chỉ là 49^2, đã bỏ quên 2·49 + 1. | Biểu thức có dạng \(a^{2} + 2a + 1 = (a + 1)^{2}\) với \(a = 49\), nên bằng \(50^{2} = 2500\). Kết quả 2401 chỉ là \(49^{2}\), đã bỏ quên \(2\cdot 49 + 1\). |
| 8-CB-306 | content | Phân tích đa thức x^3 − 4x thành nhân tử ta được: | Phân tích đa thức \(x^{3} - 4x\) thành nhân tử ta được: |
| 8-CB-306 | options.0 | x(x − 2)^2 | \(x(x - 2)^{2}\) |
| 8-CB-306 | options.1 | (x − 2)(x + 2) | \((x - 2)(x + 2)\) |
| 8-CB-306 | options.2 | x(x − 2)(x + 2) | \(x(x - 2)(x + 2)\) |
| 8-CB-306 | options.3 | x(x − 4) | \(x(x - 4)\) |
| 8-CB-306 | explanation | Đặt nhân tử chung: x^3 − 4x = x(x^2 − 4), rồi dùng hiệu hai bình phương x^2 − 4 = (x − 2)(x + 2). Viết x(x − 2)^2 sai vì (x − 2)^2 = x^2 − 4x + 4 chứ không phải x^2 − 4. | Đặt nhân tử chung: \(x^{3} - 4x = x(x^{2} - 4)\), rồi dùng hiệu hai bình phương \(x^{2} - 4 = (x - 2)(x + 2)\). Viết \(x(x - 2)^{2}\) sai vì \((x - 2)^{2} = x^{2} - 4x + 4\) chứ không phải \(x^{2} - 4\). |
| 8-CB-307 | content | Phân thức (x + 3)/(x^2 − 9) xác định khi nào? | Phân thức \(\frac{x + 3}{x^{2} - 9}\) xác định khi nào? |
| 8-CB-307 | options.0 | x ≠ 9 | \(x \ne 9\) |
| 8-CB-307 | options.1 | x ≠ 3 | \(x \ne 3\) |
| 8-CB-307 | options.2 | x ≠ −3 | \(x \ne -3\) |
| 8-CB-307 | options.3 | x ≠ 3 và x ≠ −3 | \(x \ne 3\) và \(x \ne -3\) |
| 8-CB-307 | explanation | Phân thức xác định khi mẫu khác 0: x^2 − 9 = (x − 3)(x + 3) ≠ 0, tức x ≠ 3 và x ≠ −3. Chỉ ghi x ≠ 3 là thiếu, vì tại x = −3 mẫu cũng bằng 0 (dù tử cũng bằng 0). | Phân thức xác định khi mẫu khác 0: \(x^{2} - 9 = (x - 3)(x + 3) \ne 0\), tức \(x \ne 3\) và \(x \ne -3\). Chỉ ghi \(x \ne 3\) là thiếu, vì tại \(x = -3\) mẫu cũng bằng 0 (dù tử cũng bằng 0). |
| 8-CB-308 | content | Với x ≠ 1 và x ≠ −1, kết quả của phép tính 1/(x − 1) + 1/(x + 1) là: | Với \(x \ne 1\) và \(x \ne -1\), kết quả của phép tính \(\frac{1}{x - 1} + \frac{1}{x + 1}\) là: |
| 8-CB-308 | options.0 | 2x/(x^2 − 1) | \(\frac{2x}{x^{2} - 1}\) |
| 8-CB-308 | options.1 | 2/(x^2 − 1) | \(\frac{2}{x^{2} - 1}\) |
| 8-CB-308 | options.2 | 2x/(x^2 + 1) | \(\frac{2x}{x^{2} + 1}\) |
| 8-CB-308 | options.3 | 2/(2x) | \(\frac{2}{2x}\) |
| 8-CB-308 | explanation | Quy đồng mẫu chung (x − 1)(x + 1) = x^2 − 1: tử bằng (x + 1) + (x − 1) = 2x. Kết quả 2/(2x) sai vì cộng tử với tử, mẫu với mẫu như cộng phân số sai cách. | Quy đồng mẫu chung \((x - 1)(x + 1) = x^{2} - 1\): tử bằng \((x + 1) + (x - 1) = 2x\). Kết quả \(\frac{2}{2x}\) sai vì cộng tử với tử, mẫu với mẫu như cộng phân số sai cách. |
| 8-CB-309 | content | Với x ≠ 0, y ≠ 0, kết quả của phép chia (x^2/y) : (x/y^2) là: | Với \(x \ne 0\), \(y \ne 0\), kết quả của phép chia \((\frac{x^{2}}{y}) : (\frac{x}{y^{2}})\) là: |
| 8-CB-309 | options.0 | y/x | \(\frac{y}{x}\) |
| 8-CB-309 | options.1 | x^3/y^3 | \(\frac{x^{3}}{y^{3}}\) |
| 8-CB-309 | options.2 | x/y | \(\frac{x}{y}\) |
| 8-CB-309 | explanation | Chia cho một phân thức là nhân với phân thức nghịch đảo: (x^2/y)·(y^2/x) = x^2y^2/(xy) = xy. Kết quả x^3/y^3 là do nhân thẳng hai phân thức mà không nghịch đảo. | Chia cho một phân thức là nhân với phân thức nghịch đảo: \((\frac{x^{2}}{y})\cdot (\frac{y^{2}}{x}) = x^{2}y^{2}/(xy) = xy\). Kết quả \(\frac{x^{3}}{y^{3}}\) là do nhân thẳng hai phân thức mà không nghịch đảo. |
| 8-CB-310 | explanation | Hai đường chéo hình thoi vuông góc và cắt nhau tại trung điểm mỗi đường, tạo tam giác vuông có hai cạnh góc vuông 3 cm và 4 cm, nên cạnh = √(9 + 16) = 5 cm. Đáp số 10 cm là lấy nguyên hai đường chéo làm cạnh góc vuông. | Hai đường chéo hình thoi vuông góc và cắt nhau tại trung điểm mỗi đường, tạo tam giác vuông có hai cạnh góc vuông 3 cm và 4 cm, nên cạnh = \(\sqrt{9 + 16} = 5\) cm. Đáp số 10 cm là lấy nguyên hai đường chéo làm cạnh góc vuông. |
| 8-CB-312 | content | Để đo khoảng cách BC qua một cái ao, bạn Lan chọn điểm A rồi lấy M, N lần lượt là trung điểm của AB, AC và đo được MN = 45 m. Khoảng cách BC là: | Để đo khoảng cách BC qua một cái ao, bạn Lan chọn điểm \(A\) rồi lấy \(M\), \(N\) lần lượt là trung điểm của AB, AC và đo được \(MN = 45\) m. Khoảng cách BC là: |
| 8-CB-312 | explanation | MN là đường trung bình của tam giác ABC nên MN // BC và MN = BC/2, suy ra BC = 2·45 = 90 m. Đáp số 22,5 m là chia đôi nhầm chiều. | MN là đường trung bình của tam giác ABC nên MN // BC và \(MN = \frac{BC}{2}\), suy ra \(BC = 2\cdot 45 = 90\) m. Đáp số 22,5 m là chia đôi nhầm chiều. |
| 8-CB-313 | content | Tam giác ABC có AB = 6 cm, AC = 9 cm, AD là đường phân giác của góc A (D ∈ BC), BD = 4 cm. Độ dài DC là: | Tam giác ABC có \(AB = 6\) cm, \(AC = 9\) cm, AD là đường phân giác của góc \(A (\mathrm{D} \in BC)\), \(BD = 4\) cm. Độ dài DC là: |
| 8-CB-313 | explanation | Theo tính chất đường phân giác: DB/DC = AB/AC = 6/9, nên DC = 4·9/6 = 6 cm. Viết nhầm tỉ lệ DB/DC = AC/AB sẽ ra DC ≈ 2,7 cm, không khớp phương án nào. | Theo tính chất đường phân giác: \(\frac{DB}{\mathrm{DC}} = \frac{AB}{AC} = \frac{6}{9}\), nên \(\mathrm{DC} = \frac{4\cdot 9}{6} = 6\) cm. Viết nhầm tỉ lệ \(\frac{DB}{\mathrm{DC}} = \frac{AC}{AB}\) sẽ ra DC ≈ 2,7 cm, không khớp phương án nào. |
| 8-CB-314 | content | Tam giác ABC có MN // BC (M ∈ AB, N ∈ AC), AM = 3 cm, AB = 9 cm, BC = 12 cm. Độ dài MN là: | Tam giác ABC có MN // BC (M ∈ AB, \(N \in AC\)), \(AM = 3\) cm, \(AB = 9\) cm, \(BC = 12\) cm. Độ dài MN là: |
| 8-CB-314 | explanation | Theo hệ quả định lí Thalès: MN/BC = AM/AB = 3/9 = 1/3, nên MN = 12/3 = 4 cm. Đáp số 6 cm là coi MN là đường trung bình, nhưng M không phải trung điểm AB. | Theo hệ quả định lí Thalès: \(\frac{MN}{BC} = \frac{AM}{AB} = \frac{3}{9} = \frac{1}{3}\), nên \(MN = \frac{12}{3} = 4\) cm. Đáp số 6 cm là coi MN là đường trung bình, nhưng \(M\) không phải trung điểm AB. |
| 8-CB-315 | content | Tam giác ABC và DEF có AB/DE = AC/DF = 2 và góc A bằng góc D. Kết luận nào đúng? | Tam giác ABC và DEF có \(\frac{AB}{DE} = \frac{AC}{DF} = 2\) và góc \(A\) bằng góc \(D\). Kết luận nào đúng? |
| 8-CB-315 | explanation | Hai cạnh tương ứng tỉ lệ và góc xen giữa (góc A và góc D) bằng nhau là trường hợp cạnh – góc – cạnh. Viết ΔEDF sai thứ tự đỉnh tương ứng: A phải ứng với D. | Hai cạnh tương ứng tỉ lệ và góc xen giữa (góc \(A\) và góc \(D\)) bằng nhau là trường hợp cạnh – góc – cạnh. Viết ΔEDF sai thứ tự đỉnh tương ứng: \(A\) phải ứng với \(D\). |
| 8-CB-316 | explanation | Thang, tường và mặt đất tạo tam giác vuông, thang là cạnh huyền: h = √(2,5^2 − 0,7^2) = √(6,25 − 0,49) = √5,76 = 2,4 m. Đáp số 2,6 m là cộng bình phương thay vì trừ. | Thang, tường và mặt đất tạo tam giác vuông, thang là cạnh huyền: \(h = \sqrt{2{,}5^{2} - 0{,}7^{2}} = \sqrt{6{,}25 - 0{,}49} = \sqrt{5{,}76} = 2{,}4\) m. Đáp số 2,6 m là cộng bình phương thay vì trừ. |
| 8-CB-317 | content | Cho hàm số y = f(x) = 3 − 2x. Giá trị f(−2) bằng: | Cho hàm số \(y = f(x) = 3 - 2x\). Giá trị \(f(-2)\) bằng: |
| 8-CB-317 | explanation | Thay x = −2: f(−2) = 3 − 2·(−2) = 3 + 4 = 7. Kết quả −1 là do quên dấu âm của x, tính 3 − 2·2. | Thay \(x = -2\): \(f(-2) = 3 - 2\cdot (-2) = 3 + 4 = 7\). Kết quả −1 là do quên dấu âm của \(x\), tính \(3 - 2\cdot 2\). |
| 8-CB-318 | content | Hệ số góc của đường thẳng y = −3x + 5 là: | Hệ số góc của đường thẳng \(y = -3x + 5\) là: |
| 8-CB-318 | explanation | Đường thẳng y = ax + b có hệ số góc là a, ở đây a = −3. Số 5 là tung độ gốc (b), không phải hệ số góc. | Đường thẳng \(y = ax + b\) có hệ số góc là \(a\), ở đây \(a = -3\). Số 5 là tung độ gốc (b), không phải hệ số góc. |
| 8-CB-319 | content | Hai đường thẳng y = 2x + 1 và y = 2x − 3 có vị trí tương đối như thế nào? | Hai đường thẳng \(y = 2x + 1\) và \(y = 2x - 3\) có vị trí tương đối như thế nào? |
| 8-CB-319 | explanation | Hai đường thẳng có cùng hệ số góc a = 2 và tung độ gốc khác nhau (1 ≠ −3) nên song song. Chúng chỉ trùng nhau khi cả a và b đều bằng nhau. | Hai đường thẳng có cùng hệ số góc \(a = 2\) và tung độ gốc khác nhau \((1 \ne -3)\) nên song song. Chúng chỉ trùng nhau khi cả \(a\) và \(b\) đều bằng nhau. |
| 8-CB-320 | options.0 | 1/x + 2 = 0 | \(\frac{1}{x} + 2 = 0\) |
| 8-CB-320 | options.1 | 3 − 2x = 0 | \(3 - 2x = 0\) |
| 8-CB-320 | options.2 | 0x + 2 = 0 | \(0x + 2 = 0\) |
| 8-CB-320 | options.3 | x^2 − 1 = 0 | \(x^{2} - 1 = 0\) |
| 8-CB-320 | explanation | Phương trình bậc nhất một ẩn có dạng ax + b = 0 với a ≠ 0; 3 − 2x = 0 có a = −2. Phương trình 0x + 2 = 0 có a = 0 nên không phải bậc nhất. | Phương trình bậc nhất một ẩn có dạng \(ax + b = 0\) với \(a \ne 0\); \(3 - 2x = 0\) có \(a = -2\). Phương trình \(0x + 2 = 0\) có \(a = 0\) nên không phải bậc nhất. |
| 8-CB-321 | explanation | Gọi tuổi con là x thì tuổi bố là 3x: x + 3x = 48, suy ra x = 12. Đáp số 36 là tuổi bố, không phải tuổi con; 16 là lấy 48 : 3. | Gọi tuổi con là \(x\) thì tuổi bố là \(3x\): \(x + 3x = 48\), suy ra \(x = 12\). Đáp số 36 là tuổi bố, không phải tuổi con; 16 là lấy \(48 : 3\). |
| 8-CB-322 | options.0 | 1/4 | \(\frac{1}{4}\) |
| 8-CB-322 | options.1 | 3/10 | \(\frac{3}{10}\) |
| 8-CB-322 | options.2 | 7/20 | \(\frac{7}{20}\) |
| 8-CB-322 | options.3 | 1/3 | \(\frac{1}{3}\) |
| 8-CB-322 | explanation | Có 20 kết quả đồng khả năng; các số chia hết cho 3 là 3, 6, 9, 12, 15, 18 (6 số), nên xác suất là 6/20 = 3/10. Đáp án 1/3 là đoán theo cảm tính “cứ 3 số có 1 số”, không đúng khi đếm đến 20. | Có 20 kết quả đồng khả năng; các số chia hết cho 3 là 3, 6, 9, 12, 15, 18 (6 số), nên xác suất là \(\frac{6}{20} = \frac{3}{10}\). Đáp án \(\frac{1}{3}\) là đoán theo cảm tính “cứ 3 số có 1 số”, không đúng khi đếm đến 20. |
| 8-CB-323 | explanation | Xác suất thực nghiệm = số lần biến cố xảy ra : tổng số lần quan sát = 18 : 50 = 0,36. Kết quả 0,64 là xác suất của biến cố đối “không phải xe đạp điện”. | Xác suất thực nghiệm = số lần biến cố xảy ra : tổng số lần quan sát = \(18 : 50 = 0{,}36\). Kết quả 0,64 là xác suất của biến cố đối “không phải xe đạp điện”. |
| 8-CB-327 | explanation | Ở điều kiện chuẩn, 1 mol khí chiếm 24,79 L, nên V = 0,5·24,79 = 12,395 L. Đáp số 11,2 L dùng giá trị 22,4 L của điều kiện cũ (0 °C, 1 atm), không còn dùng trong SGK mới. | Ở điều kiện chuẩn, 1 mol khí chiếm 24,79 L, nên \(V = 0{,}5\cdot 24{,}79 = 12{,}395\) L. Đáp số 11,2 L dùng giá trị 22,4 L của điều kiện cũ (0 °C, 1 atm), không còn dùng trong SGK mới. |
| 8-CB-328 | content | Khí nào sau đây nặng hơn không khí (M không khí ≈ 29 g/mol)? (C = 12, O = 16, N = 14, H = 1) | Khí nào sau đây nặng hơn không khí (M không khí ≈ 29 g/mol)? (\(C = 12\), \(O = 16\), N = 14, \(H = 1\)) |
| 8-CB-328 | explanation | Tỉ khối của CO₂ so với không khí là 44/29 ≈ 1,52 > 1 nên CO₂ nặng hơn không khí. NH₃ (17), CH₄ (16), H₂ (2) đều có M < 29 nên nhẹ hơn không khí. | Tỉ khối của CO₂ so với không khí là \(\frac{44}{29} \approx 1{,}52 > 1\) nên CO₂ nặng hơn không khí. NH₃ (17), CH₄ (16), H₂ (2) đều có M < 29 nên nhẹ hơn không khí. |
| 8-CB-329 | explanation | Độ tan 32 g nghĩa là 100 g nước ở 20 °C hòa tan tối đa 32 g KNO₃. Cho 40 g thì tan 32 g, dung dịch bão hòa, còn dư 40 − 32 = 8 g. “Chỉ tan 8 g” là nhầm lượng tan với lượng dư. | Độ tan 32 g nghĩa là 100 g nước ở 20 °C hòa tan tối đa 32 g KNO₃. Cho 40 g thì tan 32 g, dung dịch bão hòa, còn dư \(40 - 32 = 8\) g. “Chỉ tan 8 g” là nhầm lượng tan với lượng dư. |
| 8-CB-334 | explanation | Áp suất p = F/S; với cùng lực ấn, lưỡi dao sắc có diện tích tiếp xúc S rất nhỏ nên áp suất lớn. Chọn “diện tích tăng” là hiểu ngược công thức: S tăng thì áp suất giảm. | Áp suất \(p = \frac{F}{S}\); với cùng lực ấn, lưỡi dao sắc có diện tích tiếp xúc S rất nhỏ nên áp suất lớn. Chọn “diện tích tăng” là hiểu ngược công thức: S tăng thì áp suất giảm. |
| 8-NC-301 | content | Giá trị lớn nhất của biểu thức C = −x^2 + 6x − 2 là: | Giá trị lớn nhất của biểu thức \(C = -x^{2} + 6x - 2\) là: |
| 8-NC-301 | explanation | C = −(x^2 − 6x + 9) + 7 = −(x − 3)^2 + 7 ≤ 7, dấu bằng khi x = 3. Đáp số 3 là giá trị của x làm C lớn nhất, chứ không phải giá trị lớn nhất của C. | \(C = -(x^{2} - 6x + 9) + 7 = -(x - 3)^{2} + 7 \le 7\), dấu bằng khi \(x = 3\). Đáp số 3 là giá trị của \(x\) làm \(C\) lớn nhất, chứ không phải giá trị lớn nhất của \(C\). |
| 8-NC-302 | content | Cho a + b = 5 và ab = 6. Giá trị của a^2 + b^2 là: | Cho \(a + b = 5\) và \(ab = 6\). Giá trị của \(a^{2} + b^{2}\) là: |
| 8-NC-302 | explanation | a^2 + b^2 = (a + b)^2 − 2ab = 25 − 12 = 13. Đáp số 37 do cộng 2ab thay vì trừ; 19 là chỉ trừ ab một lần. | \(a^{2} + b^{2} = (a + b)^{2} - 2ab = 25 - 12 = 13\). Đáp số 37 do cộng \(2ab\) thay vì trừ; 19 là chỉ trừ ab một lần. |
| 8-NC-303 | content | Phân tích đa thức x^2 − 5x + 6 thành nhân tử ta được: | Phân tích đa thức \(x^{2} - 5x + 6\) thành nhân tử ta được: |
| 8-NC-303 | options.0 | (x − 1)(x − 6) | \((x - 1)(x - 6)\) |
| 8-NC-303 | options.1 | (x + 2)(x + 3) | \((x + 2)(x + 3)\) |
| 8-NC-303 | options.2 | (x − 2)(x − 3) | \((x - 2)(x - 3)\) |
| 8-NC-303 | options.3 | (x + 2)(x − 3) | \((x + 2)(x - 3)\) |
| 8-NC-303 | explanation | Tách −5x = −2x − 3x: x^2 − 2x − 3x + 6 = x(x − 2) − 3(x − 2) = (x − 2)(x − 3). Thử lại (x − 1)(x − 6) = x^2 − 7x + 6, sai hệ số của x. | Tách \(-5x = -2x - 3x\): \(x^{2} - 2x - 3x + 6 = x(x - 2) - 3(x - 2) = (x - 2)(x - 3)\). Thử lại \((x - 1)(x - 6) = x^{2} - 7x + 6\), sai hệ số của \(x\). |
| 8-NC-304 | content | Có bao nhiêu giá trị của x thỏa mãn x^3 = 9x? | Có bao nhiêu giá trị của \(x\) thỏa mãn \(x^{3} = 9x\)? |
| 8-NC-304 | explanation | x^3 − 9x = x(x − 3)(x + 3) = 0 nên x = 0, x = 3 hoặc x = −3: có 3 giá trị. Chia hai vế cho x để được x^2 = 9 là làm mất nghiệm x = 0, dẫn đến đáp số 2. | \(x^{3} - 9x = x(x - 3)(x + 3) = 0\) nên \(x = 0\), \(x = 3\) hoặc \(x = -3\): có 3 giá trị. Chia hai vế cho \(x\) để được \(x^{2} = 9\) là làm mất nghiệm \(x = 0\), dẫn đến đáp số 2. |
| 8-NC-305 | content | Rút gọn phân thức A = (x^2 − 1)/(x^2 + x) với x ≠ 0, x ≠ −1, rồi tính giá trị của A tại x = 2. | Rút gọn phân thức \(A = \frac{x^{2} - 1}{x^{2} + x}\) với \(x \ne 0\), \(x \ne -1\), rồi tính giá trị của \(A\) tại \(x = 2\). |
| 8-NC-305 | options.1 | 1/2 | \(\frac{1}{2}\) |
| 8-NC-305 | options.2 | 1/3 | \(\frac{1}{3}\) |
| 8-NC-305 | options.3 | 3/2 | \(\frac{3}{2}\) |
| 8-NC-305 | explanation | A = (x − 1)(x + 1)/[x(x + 1)] = (x − 1)/x. Tại x = 2: A = 1/2. Đáp số 3/2 là do rút gọn nhầm thành (x + 1)/x. | \(A = \frac{(x - 1)(x + 1)}{[x(x + 1)]} = \frac{x - 1}{x}\). Tại \(x = 2\): A = \(\frac{1}{2}\). Đáp số \(\frac{3}{2}\) là do rút gọn nhầm thành \(\frac{x + 1}{x}\). |
| 8-NC-306 | content | Giá trị của phân thức (x^2 − 9)/(x^2 + 6x + 9) tại x = 7 là: | Giá trị của phân thức \(\frac{x^{2} - 9}{x^{2} + 6x + 9}\) tại \(x = 7\) là: |
| 8-NC-306 | options.0 | 5/2 | \(\frac{5}{2}\) |
| 8-NC-306 | options.2 | 1/4 | \(\frac{1}{4}\) |
| 8-NC-306 | options.3 | 2/5 | \(\frac{2}{5}\) |
| 8-NC-306 | explanation | Rút gọn: (x − 3)(x + 3)/(x + 3)^2 = (x − 3)/(x + 3) với x ≠ −3. Thay x = 7 được 4/10 = 2/5. Chọn 5/2 là đảo ngược tử và mẫu; −1 là rút gọn sai từng hạng tử. | Rút gọn: \(\frac{(x - 3)(x + 3)}{(x + 3)^{2}} = \frac{x - 3}{x + 3}\) với \(x \ne -3\). Thay \(x = 7\) được \(\frac{4}{10} = \frac{2}{5}\). Chọn \(\frac{5}{2}\) là đảo ngược tử và mẫu; −1 là rút gọn sai từng hạng tử. |
| 8-NC-307 | options.0 | 180 m^2 | 180 m² |
| 8-NC-307 | options.1 | 224 m^2 | 224 m² |
| 8-NC-307 | options.2 | 160 m^2 | 160 m² |
| 8-NC-307 | options.3 | 192 m^2 | 192 m² |
| 8-NC-307 | explanation | Gọi chiều rộng là x (m): 2(x + x + 4) = 56, suy ra x = 12, chiều dài 16 m, diện tích 12·16 = 192 m^2. Đáp số 224 m^2 là lấy nửa chu vi 28 nhân 8, không đúng công thức. | Gọi chiều rộng là x (m): \(2(x + x + 4) = 56\), suy ra \(x = 12\), chiều dài 16 m, diện tích \(12\cdot 16 = 192\) m². Đáp số 224 m² là lấy nửa chu vi 28 nhân 8, không đúng công thức. |
| 8-NC-308 | explanation | Sau năm 1: 50·1,06 = 53 triệu; sau năm 2: 53·1,06 = 56,18 triệu. Đáp số 56 triệu là tính lãi đơn (mỗi năm 3 triệu), bỏ qua lãi của phần lãi nhập gốc. | Sau năm 1: \(50\cdot 1{,}06 = 53\) triệu; sau năm 2: \(53\cdot 1{,}06 = 56{,}18\) triệu. Đáp số 56 triệu là tính lãi đơn (mỗi năm 3 triệu), bỏ qua lãi của phần lãi nhập gốc. |
| 8-NC-309 | content | Tìm m để đồ thị hàm số y = (2m − 1)x + 3 đi qua điểm A(1; 6). | Tìm \(m\) để đồ thị hàm số \(y\) = (2m − 1)x + 3 đi qua điểm A(1; 6). |
| 8-NC-309 | options.0 | m = 1 | \(m = 1\) |
| 8-NC-309 | options.1 | m = 4 | \(m = 4\) |
| 8-NC-309 | options.2 | m = 3/2 | \(m = \frac{3}{2}\) |
| 8-NC-309 | options.3 | m = 2 | \(m = 2\) |
| 8-NC-309 | explanation | Thay x = 1, y = 6: 6 = (2m − 1) + 3, suy ra 2m − 1 = 3, m = 2. Khi đó a = 3 ≠ 0 nên đúng là hàm bậc nhất. Đáp số m = 3/2 do giải nhầm 2m − 1 = 2. | Thay \(x = 1\), \(y = 6\): 6 = (2m − 1) + 3, suy ra 2m − \(1 = 3\), m = 2. Khi đó \(a = 3 \ne 0\) nên đúng là hàm bậc nhất. Đáp số \(m = \frac{3}{2} do\) giải nhầm 2m − \(1 = 2\). |
| 8-NC-310 | content | Tọa độ giao điểm của hai đường thẳng y = x + 1 và y = −2x + 7 là: | Tọa độ giao điểm của hai đường thẳng \(y = x + 1\) và \(y = -2x + 7\) là: |
| 8-NC-310 | explanation | Giải x + 1 = −2x + 7 được 3x = 6, x = 2, y = 3. Điểm (3; 4) thuộc đường y = x + 1 nhưng không thuộc y = −2x + 7, nên không phải giao điểm. | Giải \(x + 1 = -2x + 7\) được \(3x = 6\), \(x = 2\), \(y = 3\). Điểm (3; 4) thuộc đường \(y = x + 1\) nhưng không thuộc \(y = -2x + 7\), nên không phải giao điểm. |
| 8-NC-311 | explanation | Số tiền y = 12 000 + 10 000(x − 1) với x là số km. Với x = 15: y = 12 000 + 140 000 = 152 000 đồng. Đáp số 162 000 là tính cả 15 km theo giá 10 000 rồi cộng thêm km đầu. | Số tiền \(y = 12\,000 + 10\,000(x - 1)\) với \(x\) là số km. Với \(x = 15\): \(y = 12\,000 + 140\,000 = 152\,000\) đồng. Đáp số 162 000 là tính cả 15 km theo giá 10 000 rồi cộng thêm km đầu. |
| 8-NC-312 | explanation | Tia nắng song song nên hai tam giác (vật – bóng) đồng dạng: h/12 = 1,5/2, suy ra h = 9 m. Đáp số 16 m là do lập tỉ số ngược h/12 = 2/1,5. | Tia nắng song song nên hai tam giác (vật – bóng) đồng dạng: \(\frac{h}{12} = \frac{1{,}5}{2}\), suy ra \(h = 9\) m. Đáp số 16 m là do lập tỉ số ngược \(\frac{h}{12} = \frac{2}{1{,}5}\). |
| 8-NC-313 | content | Tam giác ABC vuông tại A có AB = 6 cm, AC = 8 cm, AH là đường cao. Độ dài AH là: | Tam giác ABC vuông tại \(A\) có \(AB = 6\) cm, \(AC = 8\) cm, AH là đường cao. Độ dài AH là: |
| 8-NC-313 | explanation | BC = √(36 + 64) = 10 cm. Từ ΔHBA ∽ ΔABC (hay hai cách tính diện tích): AH·BC = AB·AC, nên AH = 48/10 = 4,8 cm. Đáp số 5 cm là độ dài trung tuyến AM = BC/2, không phải đường cao. | \(BC = \sqrt{36 + 64} = 10\) cm. Từ ΔHBA ∽ ΔABC (hay hai cách tính diện tích): \(AH\cdot BC = AB\cdot AC\), nên \(AH = \frac{48}{10} = 4{,}8\) cm. Đáp số 5 cm là độ dài trung tuyến \(AM = \frac{BC}{2}\), không phải đường cao. |
| 8-NC-314 | content | Tam giác ABC có AB = 10 cm, AC = 15 cm, BC = 20 cm, AD là phân giác của góc A (D ∈ BC). Độ dài BD là: | Tam giác ABC có \(AB = 10\) cm, \(AC = 15\) cm, \(BC = 20\) cm, AD là phân giác của góc \(A (D \in BC)\). Độ dài BD là: |
| 8-NC-314 | explanation | BD/DC = AB/AC = 2/3, mà BD + DC = 20 nên BD = 20·2/5 = 8 cm, DC = 12 cm. Đáp số 12 cm là độ dài DC, gán nhầm cho BD. | \(\frac{BD}{\mathrm{DC}} = \frac{AB}{AC} = \frac{2}{3}\), mà \(BD + \mathrm{DC} = 20\) nên \(BD = \frac{20\cdot 2}{5} = 8\) cm, \(\mathrm{DC} = 12\) cm. Đáp số 12 cm là độ dài DC, gán nhầm cho BD. |
| 8-NC-315 | options.0 | 1/6 | \(\frac{1}{6}\) |
| 8-NC-315 | options.1 | 7/36 | \(\frac{7}{36}\) |
| 8-NC-315 | options.2 | 1/12 | \(\frac{1}{12}\) |
| 8-NC-315 | options.3 | 5/36 | \(\frac{5}{36}\) |
| 8-NC-315 | explanation | Có 36 kết quả đồng khả năng; tổng bằng 7 gồm (1;6), (2;5), (3;4), (4;3), (5;2), (6;1): 6 kết quả, xác suất 6/36 = 1/6. Chỉ đếm 3 cặp mà không phân biệt thứ tự sẽ ra 1/12. | Có 36 kết quả đồng khả năng; tổng bằng 7 gồm (1;6), (2;5), (3;4), (4;3), (5;2), (6;1): 6 kết quả, xác suất \(\frac{6}{36} = \frac{1}{6}\). Chỉ đếm 3 cặp mà không phân biệt thứ tự sẽ ra \(\frac{1}{12}\). |
| 8-NC-316 | options.0 | 260 cm^3 | 260 cm³ |
| 8-NC-316 | options.1 | 433,3 cm^3 | 433,3 cm³ |
| 8-NC-316 | options.2 | 400 cm^3 | 400 cm³ |
| 8-NC-316 | options.3 | 1200 cm^3 | 1200 cm³ |
| 8-NC-316 | explanation | Chiều cao h = √(13^2 − 5^2) = √144 = 12 cm; V = (1/3)·10^2·12 = 400 cm^3. Lấy trung đoạn 13 cm làm chiều cao sẽ ra 433,3 cm^3; quên nhân 1/3 sẽ ra 1200 cm^3. | Chiều cao \(h = \sqrt{13^{2} - 5^{2}} = \sqrt{144} = 12\) cm; \(V = (\frac{1}{3})\cdot 10^{2}\cdot 12 = 400\) cm³. Lấy trung đoạn 13 cm làm chiều cao sẽ ra 433,3 cm³; quên nhân \(\frac{1}{3}\) sẽ ra 1200 cm³. |
| 8-NC-317 | explanation | n(Zn) = 6,5 : 65 = 0,1 mol; theo phương trình n(H₂) = n(Zn) = 0,1 mol, V = 0,1·24,79 = 2,479 L. Đáp số 4,958 L là lấy nhầm tỉ lệ theo hệ số 2 của HCl. | n(Zn) = \(6{,}5 : 65 = 0{,}1\) mol; theo phương trình n(H₂) = n(Zn) = 0,1 mol, V = 0,1·24,79 = 2,479 L. Đáp số 4,958 L là lấy nhầm tỉ lệ theo hệ số 2 của HCl. |
| 8-NC-318 | explanation | n(CaCO₃) = 10 : 100 = 0,1 mol, nên theo lí thuyết m(CaO) = 0,1·56 = 5,6 g. H = 4,48 : 5,6·100% = 80%. Đáp số 44,8% là chia nhầm 4,48 cho 10 g CaCO₃. | n(CaCO₃) = \(10 : 100 = 0{,}1\) mol, nên theo lí thuyết m(CaO) = \(0{,}1\cdot 56 = 5{,}6\) g. H = 4,48 : 5,6·100% = 80%. Đáp số 44,8% là chia nhầm 4,48 cho 10 g CaCO₃. |
| 8-NC-319 | explanation | Số mol NaOH không đổi: n = 0,1·2 = 0,2 mol; C = 0,2 : 0,4 = 0,5 M. Đáp số 8 M là nhân thay vì chia: pha loãng thì nồng độ phải giảm. | Số mol NaOH không đổi: \(n = 0{,}1\cdot 2 = 0{,}2\) mol; C = 0,2 : 0,4 = 0,5 M. Đáp số 8 M là nhân thay vì chia: pha loãng thì nồng độ phải giảm. |
| 8-NC-320 | explanation | n(HCl) = 0,2 mol, phản ứng tỉ lệ 1 : 1 nên n(NaOH) = 0,2 mol, V = 0,2 : 0,5 = 0,4 L = 400 mL. Đáp số 100 mL là lấy 0,2·0,5, nhầm phép chia thành phép nhân. | n(HCl) = 0,2 mol, phản ứng tỉ lệ \(1 : 1\) nên n(NaOH) = 0,2 mol, V = 0,2 : 0,5 = 0,4 L = 400 mL. Đáp số 100 mL là lấy \(0{,}2\cdot 0{,}5\), nhầm phép chia thành phép nhân. |
| 8-NC-321 | explanation | Theo định luật bảo toàn khối lượng: m(FeCl₂) = m(Fe) + m(HCl) − m(H₂) = 5,6 + 7,3 − 0,2 = 12,7 g. Đáp số 12,9 g là quên trừ khối lượng khí H₂ thoát ra. | Theo định luật bảo toàn khối lượng: m(FeCl₂) = m(Fe) + m(HCl) − m(H₂) = \(5{,}6 + 7{,}3 - 0{,}2 = 12{,}7\) g. Đáp số 12,9 g là quên trừ khối lượng khí H₂ thoát ra. |
| 8-NC-324 | content | Phần trăm khối lượng nitrogen trong phân đạm ammonium nitrate NH₄NO₃ là: (N = 14, H = 1, O = 16) | Phần trăm khối lượng nitrogen trong phân đạm ammonium nitrate NH₄NO₃ là: (\(N = 14\), \(H = 1\), \(O = 16\)) |
| 8-NC-324 | explanation | M(NH₄NO₃) = 80 g/mol, chứa 2 nguyên tử N: %N = 28 : 80·100% = 35%. Đáp số 17,5% là chỉ tính 1 nguyên tử N; 46,7% là %N của urea. | M(NH₄NO₃) = 80 g/mol, chứa 2 nguyên tử N: \(\%N = 28 : 80\cdot 100\% = 35\%\). Đáp số 17,5% là chỉ tính 1 nguyên tử N; 46,7% là %N của urea. |
| 8-NC-325 | content | Một người nặng 60 kg, diện tích mỗi bàn chân là 0,02 m^2. Khi người này đứng bằng một chân, áp suất lên mặt sàn là: | Một người nặng 60 kg, diện tích mỗi bàn chân là 0,02 m². Khi người này đứng bằng một chân, áp suất lên mặt sàn là: |
| 8-NC-325 | explanation | Áp lực F = P = 10·60 = 600 N; đứng một chân thì S = 0,02 m^2, p = 600 : 0,02 = 30 000 Pa. Đáp số 15 000 Pa là trường hợp đứng hai chân (S = 0,04 m^2). | Áp lực \(F = P = 10\cdot 60 = 600\) N; đứng một chân thì \(S = 0{,}02\) m², \(p = 600 : 0{,}02 = 30\,000\) Pa. Đáp số 15 000 Pa là trường hợp đứng hai chân (\(S = 0{,}04\) m²). |
| 8-NC-326 | content | Một tàu ngầm đo được áp suất nước biển tác dụng lên vỏ tàu là 2 060 000 Pa. Biết trọng lượng riêng của nước biển là 10 300 N/m^3. Tàu đang ở độ sâu: | Một tàu ngầm đo được áp suất nước biển tác dụng lên vỏ tàu là 2 060 000 Pa. Biết trọng lượng riêng của nước biển là 10 300 N/m³. Tàu đang ở độ sâu: |
| 8-NC-326 | explanation | Từ p = d·h suy ra h = p : d = 2 060 000 : 10 300 = 200 m. Đáp số 206 m là dùng nhầm d = 10 000 N/m^3 của nước ngọt. | Từ \(p = d\cdot h\) suy ra \(h = p : d = 2\,060\,000 : 10\,300 = 200\) m. Đáp số 206 m là dùng nhầm \(d = 10\,000\) N/m³ của nước ngọt. |
| 8-NC-327 | content | Một khối gỗ thể tích 0,005 m^3 nổi trên mặt nước, phần chìm có thể tích 0,003 m^3. Trọng lượng riêng của nước là 10 000 N/m^3. Trọng lượng khối gỗ là: | Một khối gỗ thể tích 0,005 m³ nổi trên mặt nước, phần chìm có thể tích 0,003 m³. Trọng lượng riêng của nước là 10 000 N/m³. Trọng lượng khối gỗ là: |
| 8-NC-327 | explanation | Vật nổi cân bằng nên P = F(A) = d·V(chìm) = 10 000·0,003 = 30 N. Đáp số 50 N là dùng cả thể tích khối gỗ, nhưng lực đẩy chỉ tính theo phần chìm. | Vật nổi cân bằng nên \(P = F(A)\) = d·V(chìm) = \(10\,000\cdot 0{,}003 = 30\) N. Đáp số 50 N là dùng cả thể tích khối gỗ, nhưng lực đẩy chỉ tính theo phần chìm. |
| 8-NC-328 | content | Máy nén thủy lực có pít-tông nhỏ diện tích 2 cm^2, pít-tông lớn 200 cm^2. Tác dụng lực 100 N lên pít-tông nhỏ thì lực tác dụng lên pít-tông lớn là: | Máy nén thủy lực có pít-tông nhỏ diện tích 2 cm², pít-tông lớn 200 cm². Tác dụng lực 100 N lên pít-tông nhỏ thì lực tác dụng lên pít-tông lớn là: |
| 8-NC-328 | explanation | Áp suất được chất lỏng truyền nguyên vẹn: F/S = f/s, nên F = 100·200 : 2 = 10 000 N. Đáp số 1 N là lập tỉ số ngược, trong khi pít-tông lớn phải nhận lực lớn hơn. | Áp suất được chất lỏng truyền nguyên vẹn: \(\frac{F}{S} = \frac{f}{s}\), nên \(F = 100\cdot 200 : 2 = 10\,000\) N. Đáp số 1 N là lập tỉ số ngược, trong khi pít-tông lớn phải nhận lực lớn hơn. |
| 9-CB-101 | content | Điều kiện xác định của biểu thức √(x - 3) là gì? | Điều kiện xác định của biểu thức \(\sqrt{x - 3}\) là gì? |
| 9-CB-101 | options.0 | x ≥ 3 | \(x \ge 3\) |
| 9-CB-101 | options.1 | x > 3 | \(x > 3\) |
| 9-CB-101 | options.2 | x ≤ 3 | \(x \le 3\) |
| 9-CB-101 | options.3 | x ≠ 3 | \(x \ne 3\) |
| 9-CB-101 | explanation | √A xác định khi A ≥ 0, nên x - 3 ≥ 0 hay x ≥ 3. Chọn x > 3 là thiếu giá trị x = 3, vì √0 = 0 vẫn có nghĩa. | \(\sqrt{A}\) xác định khi \(A \ge 0\), nên \(x - 3 \ge 0\) hay \(x \ge 3\). Chọn \(x > 3\) là thiếu giá trị \(x = 3\), vì \(\sqrt{0} = 0\) vẫn có nghĩa. |
| 9-CB-102 | content | Cặp số nào là nghiệm của hệ phương trình x + y = 5 và x - y = 1? | Cặp số nào là nghiệm của hệ phương trình \(x + y = 5\) và \(x - y = 1\)? |
| 9-CB-102 | explanation | Cộng vế hai phương trình: 2x = 6 nên x = 3, suy ra y = 2. Cặp (2; 3) thỏa x + y = 5 nhưng x - y = -1 ≠ 1. | Cộng vế hai phương trình: \(2x = 6\) nên \(x = 3\), suy ra \(y = 2\). Cặp (2; 3) thỏa \(x + y = 5\) nhưng \(x - y = -1 \ne 1\). |
| 9-CB-103 | content | Kết quả của phép tính √12 . √3 là bao nhiêu? | Kết quả của phép tính \(\sqrt{12} \cdot \sqrt{3}\) là bao nhiêu? |
| 9-CB-103 | options.1 | 2√3 | \(2\sqrt{3}\) |
| 9-CB-103 | options.3 | 3√2 | \(3\sqrt{2}\) |
| 9-CB-103 | explanation | √12 . √3 = √(12 . 3) = √36 = 6. Đáp án 36 sai vì quên lấy căn của tích. | \(\sqrt{12} \cdot \sqrt{3} = \sqrt{12 \cdot 3} = \sqrt{36} = 6\). Đáp án 36 sai vì quên lấy căn của tích. |
| 9-CB-104 | content | Đồ thị hàm số y = 2x^2 đi qua điểm nào sau đây? | Đồ thị hàm số \(y = 2x^{2}\) đi qua điểm nào sau đây? |
| 9-CB-104 | explanation | Thay x = 1: y = 2 . 1^2 = 2, nên điểm (1; 2) thuộc đồ thị. Với x = 2 thì y = 8 chứ không phải 4; y = 2x^2 luôn ≥ 0 nên (-1; -2) không thuộc đồ thị. | Thay \(x = 1\): \(y = 2 \cdot 1^{2} = 2\), nên điểm (1; 2) thuộc đồ thị. Với \(x = 2\) thì \(y = 8\) chứ không phải 4; \(y = 2x^{2}\) luôn ≥ 0 nên (-1; -2) không thuộc đồ thị. |
| 9-CB-105 | content | Nghiệm của bất phương trình 2x - 6 > 0 là gì? | Nghiệm của bất phương trình \(2x - 6 > 0\) là gì? |
| 9-CB-105 | options.0 | x > 3 | \(x > 3\) |
| 9-CB-105 | options.1 | x < 3 | \(x < 3\) |
| 9-CB-105 | options.2 | x > -3 | \(x > -3\) |
| 9-CB-105 | options.3 | x < -3 | \(x < -3\) |
| 9-CB-105 | explanation | 2x - 6 > 0 ⇔ 2x > 6 ⇔ x > 3 (chia hai vế cho 2 > 0 thì giữ nguyên chiều). Chỉ đổi chiều khi chia cho số âm. | \(2x - 6 > 0 \Leftrightarrow 2x > 6 \Leftrightarrow x > 3\) (chia hai vế cho \(2 > 0\) thì giữ nguyên chiều). Chỉ đổi chiều khi chia cho số âm. |
| 9-CB-106 | options.0 | 1/6 | \(\frac{1}{6}\) |
| 9-CB-106 | options.1 | 1/2 | \(\frac{1}{2}\) |
| 9-CB-106 | options.2 | 1/3 | \(\frac{1}{3}\) |
| 9-CB-106 | options.3 | 2/3 | \(\frac{2}{3}\) |
| 9-CB-106 | explanation | Có 6 kết quả đồng khả năng, trong đó 3 kết quả thuận lợi (2, 4, 6), nên xác suất là 3/6 = 1/2. Đáp án 1/6 là xác suất của chỉ một mặt. | Có 6 kết quả đồng khả năng, trong đó 3 kết quả thuận lợi (2, 4, 6), nên xác suất là \(\frac{3}{6} = \frac{1}{2}\). Đáp án \(\frac{1}{6}\) là xác suất của chỉ một mặt. |
| 9-CB-118 | options.0 | Wđ = m . v | \(W\text{đ} = m \cdot v\) |
| 9-CB-118 | options.1 | Wđ = 1/2 . m . v^2 | \(W\text{đ} = \frac{1}{2} \cdot m \cdot v^{2}\) |
| 9-CB-118 | options.2 | Wđ = m . v^2 | \(W\text{đ} = m \cdot v^{2}\) |
| 9-CB-118 | options.3 | Wđ = P . h | \(W\text{đ} = P \cdot h\) |
| 9-CB-118 | explanation | Động năng Wđ = 1/2 . m . v^2 (J). Công thức P . h là thế năng trọng trường, không phải động năng. | Động năng \(W\text{đ} = \frac{1}{2} \cdot m \cdot v^{2} (J)\). Công thức P . h là thế năng trọng trường, không phải động năng. |
| 9-NC-101 | content | Phương trình x^2 - 2x + m = 0 có hai nghiệm x₁, x₂ thỏa mãn x₁^2 + x₂^2 = 10. Giá trị của m là? | Phương trình \(x^{2} - 2x + m = 0\) có hai nghiệm \(x_1\), \(x_2\) thỏa mãn \(x_1^{2} + x_2^{2} = 10\). Giá trị của \(m\) là? |
| 9-NC-101 | options.0 | m = 3 | \(m = 3\) |
| 9-NC-101 | options.1 | m = -2 | \(m = -2\) |
| 9-NC-101 | options.2 | m = 7 | \(m = 7\) |
| 9-NC-101 | options.3 | m = -3 | \(m = -3\) |
| 9-NC-101 | explanation | Δ' = 1 - m ≥ 0 ⇔ m ≤ 1. Theo Vi-ét: x₁ + x₂ = 2, x₁x₂ = m nên x₁^2 + x₂^2 = 4 - 2m = 10 ⇔ m = -3 (thỏa). Nhầm dấu sẽ ra m = 3, khi đó phương trình vô nghiệm. | \(\Delta ' = 1 - m \ge 0 \Leftrightarrow m \le 1\). Theo Vi-ét: \(x_1 + x_2 = 2\), \(x_1x_2 = m\) nên \(x_1^{2} + x_2^{2} = 4\) - 2m = \(10 \Leftrightarrow m = -3\) (thỏa). Nhầm dấu sẽ ra \(m = 3\), khi đó phương trình vô nghiệm. |
| 9-NC-110 | content | Đốt cháy hoàn toàn 1,6 g CH₄ trong oxygen dư. Khối lượng CO₂ thu được là? (C = 12, H = 1, O = 16) | Đốt cháy hoàn toàn 1,6 g CH₄ trong oxygen dư. Khối lượng CO₂ thu được là? (\(C = 12\), \(H = 1\), \(O = 16\)) |
| 9-NC-110 | explanation | CH₄ + 2O₂ → CO₂ + 2H₂O. n(CH₄) = 1,6 : 16 = 0,1 mol ⇒ n(CO₂) = 0,1 mol ⇒ m = 0,1 . 44 = 4,4 g. 3,6 g là khối lượng H₂O tạo ra, không phải CO₂. | CH₄ + 2O₂ → CO₂ + 2H₂O. n(CH₄) = \(1{,}6 : 16 = 0{,}1\) mol ⇒ n(CO₂) = 0,1 mol ⇒ \(m = 0{,}1 \cdot 44 = 4{,}4\) g. 3,6 g là khối lượng H₂O tạo ra, không phải CO₂. |
| 9-NC-111 | options.0 | 9 : 3 : 3 : 1 | \(9 : 3 : 3 : 1\) |
| 9-NC-111 | options.1 | 1 : 1 : 1 : 1 | \(1 : 1 : 1 : 1\) |
| 9-NC-111 | options.2 | 3 : 1 | \(3 : 1\) |
| 9-NC-111 | options.3 | 1 : 2 : 1 | \(1 : 2 : 1\) |
| 9-NC-111 | explanation | AaBb cho 4 loại giao tử tỉ lệ bằng nhau, aabb chỉ cho giao tử ab, nên đời con có 4 kiểu hình tỉ lệ 1 : 1 : 1 : 1. Tỉ lệ 9 : 3 : 3 : 1 là của phép lai AaBb × AaBb. | AaBb cho 4 loại giao tử tỉ lệ bằng nhau, aabb chỉ cho giao tử ab, nên đời con có 4 kiểu hình tỉ lệ \(1 : 1 : 1 : 1\). Tỉ lệ \(9 : 3 : 3 : 1\) là của phép lai AaBb × AaBb. |
| 9-CB-201 | content | Nghiệm của phương trình (2x − 1)(x + 3) = 0 là gì? | Nghiệm của phương trình \((2x - 1)(x + 3) = 0\) là gì? |
| 9-CB-201 | options.0 | x = 1/2 và x = −3 | \(x = \frac{1}{2}\) và \(x = -3\) |
| 9-CB-201 | options.1 | x = −1/2 và x = 3 | \(x = -\frac{1}{2}\) và \(x = 3\) |
| 9-CB-201 | options.2 | x = 2 và x = −3 | \(x = 2\) và \(x = -3\) |
| 9-CB-201 | options.3 | x = 1/2 và x = 3 | \(x = \frac{1}{2}\) và \(x = 3\) |
| 9-CB-201 | explanation | Tích bằng 0 khi một thừa số bằng 0: 2x − 1 = 0 ⇒ x = 1/2; x + 3 = 0 ⇒ x = −3. Chọn x = 3 là sai dấu khi chuyển vế. | Tích bằng 0 khi một thừa số bằng 0: \(2x - 1 = 0 \Rightarrow x = \frac{1}{2}\); \(x + 3 = 0 \Rightarrow x = -3\). Chọn \(x = 3\) là sai dấu khi chuyển vế. |
| 9-CB-202 | content | Điều kiện xác định của phương trình (x + 1)/(x − 2) + 3/x = 1 là gì? | Điều kiện xác định của phương trình \(\frac{x + 1}{x - 2} + \frac{3}{x} = 1\) là gì? |
| 9-CB-202 | options.0 | x ≠ 2 và x ≠ 0 | \(x \ne 2\) và \(x \ne 0\) |
| 9-CB-202 | options.1 | x ≠ 2 | \(x \ne 2\) |
| 9-CB-202 | options.2 | x ≠ −1 và x ≠ 2 | \(x \ne -1\) và \(x \ne 2\) |
| 9-CB-202 | options.3 | x ≠ 0 | \(x \ne 0\) |
| 9-CB-202 | explanation | Các mẫu phải khác 0: x − 2 ≠ 0 và x ≠ 0. Điều kiện x ≠ −1 là sai vì x + 1 nằm ở tử, tử bằng 0 không làm phương trình mất nghĩa. | Các mẫu phải khác 0: \(x - 2 \ne 0\) và \(x \ne 0\). Điều kiện \(x \ne -1\) là sai vì \(x + 1\) nằm ở tử, tử bằng 0 không làm phương trình mất nghĩa. |
| 9-CB-203 | content | Cặp số nào là một nghiệm của phương trình 3x − 2y = 4? | Cặp số nào là một nghiệm của phương trình \(3x - 2y = 4\)? |
| 9-CB-203 | explanation | Thay (2; 1): 3.2 − 2.1 = 4, đúng. Với (2; −1): 6 + 2 = 8 ≠ 4; với (0; 2): −4 ≠ 4. | Thay (2; 1): \(3 \cdot 2 - 2 \cdot 1 = 4\), đúng. Với (2; −1): \(6 + 2 = 8 \ne 4\); với (0; 2): \(-4 \ne 4\). |
| 9-CB-204 | explanation | Gọi x là số vở: 8 000x + 30 000 ≤ 150 000 ⇒ x ≤ 15. Đáp số 18 quyển là do quên trừ tiền hộp bút (150 000 : 8 000 ≈ 18,75). | Gọi \(x\) là số vở: \(8\,000x + 30\,000 \le 150\,000 \Rightarrow x \le 15\). Đáp số 18 quyển là do quên trừ tiền hộp bút \((150\,000 : 8\,000 \approx 18{,}75)\). |
| 9-CB-205 | content | Giá trị của biểu thức ∛(−27) + ∛8 là bao nhiêu? | Giá trị của biểu thức \(\sqrt[3]{-27} + \sqrt[3]{8}\) là bao nhiêu? |
| 9-CB-205 | explanation | ∛(−27) = −3 vì (−3)^3 = −27; ∛8 = 2. Tổng bằng −3 + 2 = −1. Căn bậc ba của số âm vẫn xác định và là số âm. | \(\sqrt[3]{-27} = -3\) vì \((-3)^{3} = -27\); \(\sqrt[3]{8} = 2\). Tổng bằng \(-3 + 2 = -1\). Căn bậc ba của số âm vẫn xác định và là số âm. |
| 9-CB-206 | content | Rút gọn biểu thức √((2 − √5)^2). | Rút gọn biểu thức \(\sqrt{(2 - \sqrt{5})^{2}}\). |
| 9-CB-206 | options.0 | √5 − 2 | \(\sqrt{5} - 2\) |
| 9-CB-206 | options.1 | 2 − √5 | \(2 - \sqrt{5}\) |
| 9-CB-206 | options.2 | 2 + √5 | \(2 + \sqrt{5}\) |
| 9-CB-206 | options.3 | −2 − √5 | \(-2 - \sqrt{5}\) |
| 9-CB-206 | explanation | √(A^2) = \|A\|. Vì √5 ≈ 2,24 > 2 nên 2 − √5 < 0, do đó \|2 − √5\| = √5 − 2. Chọn 2 − √5 là quên lấy giá trị tuyệt đối (kết quả âm). | \(\sqrt{A^{2}} = \|A\|\). Vì \(\sqrt{5} \approx 2{,}24 > 2\) nên \(2 - \sqrt{5} < 0\), do đó \(\|2 - \sqrt{5}\| = \sqrt{5} - 2\). Chọn \(2 - \sqrt{5}\) là quên lấy giá trị tuyệt đối (kết quả âm). |
| 9-CB-207 | content | Tam giác ABC vuông tại A có AB = 6 cm, AC = 8 cm. Giá trị tan B bằng bao nhiêu? | Tam giác ABC vuông tại \(A\) có \(AB = 6\) cm, \(AC = 8\) cm. Giá trị tan B bằng bao nhiêu? |
| 9-CB-207 | options.0 | 3/4 | \(\frac{3}{4}\) |
| 9-CB-207 | options.1 | 3/5 | \(\frac{3}{5}\) |
| 9-CB-207 | options.2 | 4/5 | \(\frac{4}{5}\) |
| 9-CB-207 | options.3 | 4/3 | \(\frac{4}{3}\) |
| 9-CB-207 | explanation | tan B = cạnh đối/cạnh kề = AC/AB = 8/6 = 4/3. Phương án 3/4 là tan C (nhầm cạnh đối và cạnh kề của góc B). | tan B = cạnh đối/cạnh kề = \(\frac{AC}{AB} = \frac{8}{6} = \frac{4}{3}\). Phương án \(\frac{3}{4}\) là tan C (nhầm cạnh đối và cạnh kề của góc \(B\)). |
| 9-CB-208 | content | Cho đường tròn (O; 5 cm) và đường thẳng d cách O một khoảng 3 cm. Vị trí tương đối của d và (O) là gì? | Cho đường tròn (\(O\); 5 cm) và đường thẳng \(d\) cách \(O\) một khoảng 3 cm. Vị trí tương đối của \(d\) và (O) là gì? |
| 9-CB-208 | options.2 | d đi qua tâm O | \(d\) đi qua tâm \(O\) |
| 9-CB-208 | explanation | Khoảng cách d = 3 cm < R = 5 cm nên đường thẳng cắt đường tròn tại hai điểm. Tiếp xúc chỉ xảy ra khi khoảng cách bằng đúng R. | Khoảng cách \(d = 3\) cm < \(R = 5\) cm nên đường thẳng cắt đường tròn tại hai điểm. Tiếp xúc chỉ xảy ra khi khoảng cách bằng đúng \(R\). |
| 9-CB-209 | explanation | l = πRn/180 = π.6.60/180 = 2π (cm). Phương án 12π cm là chu vi cả đường tròn (2πR), không phải độ dài cung 60°. | \(l = \frac{\pi Rn}{180} = \frac{\pi \cdot 6 \cdot 60}{180} = 2\pi\) (cm). Phương án 12π cm là chu vi cả đường tròn (2πR), không phải độ dài cung 60°. |
| 9-CB-210 | content | Phương trình 2x^2 − 3x + 5 = 0 có bao nhiêu nghiệm? | Phương trình \(2x^{2} - 3x + 5 = 0\) có bao nhiêu nghiệm? |
| 9-CB-210 | explanation | Δ = (−3)^2 − 4.2.5 = 9 − 40 = −31 < 0 nên phương trình vô nghiệm. Hai nghiệm trái dấu chỉ khi a.c < 0, ở đây a.c = 10 > 0. | \(\Delta = (-3)^{2} - 4 \cdot 2 \cdot 5 = 9 - 40 = -31 < 0\) nên phương trình vô nghiệm. Hai nghiệm trái dấu chỉ khi \(a \cdot c < 0\), ở đây \(a \cdot c = 10 > 0\). |
| 9-CB-211 | content | Lớp 9A có 40 học sinh, trong đó 10 bạn đạt điểm 8 môn Toán. Tần số tương đối của điểm 8 là bao nhiêu? | Lớp \(9A\) có 40 học sinh, trong đó 10 bạn đạt điểm 8 môn Toán. Tần số tương đối của điểm 8 là bao nhiêu? |
| 9-CB-211 | explanation | Tần số tương đối = tần số : tổng số × 100% = 10 : 40 × 100% = 25%. Phương án 10% là nhầm tần số (10) với tỉ lệ phần trăm. | Tần số tương đối = tần số : tổng số × \(100\% = 10 : 40 \times 100\% = 25\%\). Phương án 10% là nhầm tần số (10) với tỉ lệ phần trăm. |
| 9-CB-212 | explanation | V = πr^2h = π.3^2.5 = 45π (cm³). Phương án 30π cm³ là diện tích xung quanh 2πrh (đơn vị cm²), không phải thể tích. | \(V = \pi r^{2}h = \pi \cdot 3^{2} \cdot 5 = 45\pi\) (cm³). Phương án 30π cm³ là diện tích xung quanh 2πrh (đơn vị cm²), không phải thể tích. |
| 9-CB-231 | explanation | Wt = P.h = 10m.h = 10.2.5 = 100 J. Phương án 10 J là lấy m.h mà quên đổi khối lượng ra trọng lượng. | Wt = \(P \cdot h = 10m \cdot h = 10 \cdot 2 \cdot 5 = 100\) J. Phương án 10 J là lấy m.h mà quên đổi khối lượng ra trọng lượng. |
| 9-CB-232 | explanation | Đổi t = 1 phút = 60 s; P = A/t = 3 600 : 60 = 60 W. Phương án 3 600 W là để nguyên t = 1 mà không đổi ra giây. | Đổi \(t = 1\) phút = 60 s; \(P = \frac{A}{t} = 3\,600 : 60 = 60\) W. Phương án 3 600 W là để nguyên \(t = 1\) mà không đổi ra giây. |
| 9-CB-233 | explanation | n = c/v = 300 000 : 225 000 = 4/3 ≈ 1,33. Kết quả 0,75 là lấy v/c (đảo ngược); chiết suất tuyệt đối của môi trường luôn lớn hơn 1. | \(n = \frac{c}{v} = 300\,000 : 225\,000 = \frac{4}{3} \approx 1{,}33\). Kết quả 0,75 là lấy \(\frac{v}{c}\) (đảo ngược); chiết suất tuyệt đối của môi trường luôn lớn hơn 1. |
| 9-CB-234 | explanation | Vật trong khoảng tiêu cự (d < f) cho ảnh ảo, cùng chiều, lớn hơn vật; đây là nguyên tắc của kính lúp. Ảnh ảo nhỏ hơn vật là đặc điểm của thấu kính phân kì. | Vật trong khoảng tiêu cự \((d < f)\) cho ảnh ảo, cùng chiều, lớn hơn vật; đây là nguyên tắc của kính lúp. Ảnh ảo nhỏ hơn vật là đặc điểm của thấu kính phân kì. |
| 9-NC-201 | content | Tìm m để phương trình x^2 − 2(m − 1)x + m^2 − 3 = 0 có hai nghiệm x₁, x₂ thỏa mãn x₁ + x₂ = x₁x₂. | Tìm \(m\) để phương trình \(x^{2} - 2(m - 1)x + m^{2} - 3 = 0\) có hai nghiệm \(x_1\), \(x_2\) thỏa mãn \(x_1 + x_2 = x_1x_2\). |
| 9-NC-201 | options.0 | m = 1 + √2 | \(m = 1 + \sqrt{2}\) |
| 9-NC-201 | options.1 | m = 1 ± √2 | \(m = 1 \pm \sqrt{2}\) |
| 9-NC-201 | options.2 | m = 2 | \(m = 2\) |
| 9-NC-201 | options.3 | m = 1 − √2 | \(m = 1 - \sqrt{2}\) |
| 9-NC-201 | explanation | Có nghiệm khi Δ' = (m − 1)^2 − (m^2 − 3) = 4 − 2m ≥ 0 ⇒ m ≤ 2. Vi-ét: 2(m − 1) = m^2 − 3 ⇒ m^2 − 2m − 1 = 0 ⇒ m = 1 ± √2. Loại 1 + √2 > 2, nhận m = 1 − √2. | Có nghiệm khi \(\Delta ' = (m - 1)^{2} - (m^{2} - 3) = 4\) − 2m ≥ \(0 \Rightarrow m \le 2\). Vi-ét: \(2(m - 1) = m^{2} - 3 \Rightarrow m^{2}\) − 2m − \(1 = 0 \Rightarrow m = 1 \pm \sqrt{2}\). Loại \(1 + \sqrt{2} > 2\), nhận \(m = 1 - \sqrt{2}\). |
| 9-NC-202 | explanation | Gọi dài a, rộng b: a + b = 17 và (a + 3)(b + 2) − ab = 45 ⇒ 2a + 3b = 39. Thay a = 17 − b: 34 + b = 39 ⇒ b = 5, a = 12. Kiểm tra: 15.7 − 60 = 45. | Gọi dài \(a\), rộng \(b\): \(a + b = 17\) và \((a + 3)(b + 2) - ab = 45 \Rightarrow 2a + 3b = 39\). Thay \(a = 17 - b\): \(34 + b = 39 \Rightarrow b = 5\), \(a = 12\). Kiểm tra: \(15 \cdot 7 - 60 = 45\). |
| 9-NC-203 | content | Với x > 0, x ≠ 1, rút gọn P = √x/(√x − 1) − 1/(x − √x). | Với \(x > 0\), \(x \ne 1\), rút gọn \(P = \frac{\sqrt{x}}{\sqrt{x} - 1} - \frac{1}{x - \sqrt{x}}\). |
| 9-NC-203 | options.0 | (√x − 1)/√x | \(\frac{\sqrt{x} - 1}{\sqrt{x}}\) |
| 9-NC-203 | options.1 | (√x + 1)/√x | \(\frac{\sqrt{x} + 1}{\sqrt{x}}\) |
| 9-NC-203 | options.2 | √x + 1 | \(\sqrt{x} + 1\) |
| 9-NC-203 | options.3 | 1/√x | \(\frac{1}{\sqrt{x}}\) |
| 9-NC-203 | explanation | x − √x = √x(√x − 1). Quy đồng: P = (x − 1)/[√x(√x − 1)] = (√x − 1)(√x + 1)/[√x(√x − 1)] = (√x + 1)/√x. | \(x - \sqrt{x} = \sqrt{x}(\sqrt{x} - 1)\). Quy đồng: \(P = \frac{x - 1}{[\sqrt{x}(\sqrt{x} - 1)]} = \frac{(\sqrt{x} - 1)(\sqrt{x} + 1)}{[\sqrt{x}(\sqrt{x} - 1)]} = \frac{\sqrt{x} + 1}{\sqrt{x}}\). |
| 9-NC-204 | content | Tìm m để đường thẳng y = 2x + m cắt parabol y = x^2 tại hai điểm phân biệt đều nằm bên phải trục tung. | Tìm \(m\) để đường thẳng \(y = 2x + m\) cắt parabol \(y = x^{2}\) tại hai điểm phân biệt đều nằm bên phải trục tung. |
| 9-NC-204 | options.0 | m > −1 | \(m > -1\) |
| 9-NC-204 | options.1 | m < 0 | \(m < 0\) |
| 9-NC-204 | options.2 | −1 < m < 0 | \(-1 < m < 0\) |
| 9-NC-204 | options.3 | m > 0 | \(m > 0\) |
| 9-NC-204 | explanation | Hoành độ giao điểm: x^2 − 2x − m = 0. Cần Δ' = 1 + m > 0, S = 2 > 0 và P = −m > 0 ⇒ −1 < m < 0. Chỉ có m > −1 thì hai giao điểm có thể nằm hai phía trục tung. | Hoành độ giao điểm: \(x^{2} - 2x - m = 0\). Cần \(\Delta ' = 1 + m > 0\), \(S = 2 > 0\) và \(P = -m > 0 \Rightarrow -1 < m < 0\). Chỉ có \(m > -1\) thì hai giao điểm có thể nằm hai phía trục tung. |
| 9-NC-205 | explanation | Bán kính đường tròn ngoại tiếp tam giác đều cạnh a là R = a√3/3 = 2√3 cm. S = πR^2 = 12π cm². Phương án 3π cm² dùng nhầm bán kính đường tròn nội tiếp r = √3. | Bán kính đường tròn ngoại tiếp tam giác đều cạnh \(a\) là \(R = \frac{a\sqrt{3}}{3} = 2\sqrt{3}\) cm. \(S = \pi R^{2} = 12\pi\) cm². Phương án 3π cm² dùng nhầm bán kính đường tròn nội tiếp \(r = \sqrt{3}\). |
| 9-NC-206 | options.0 | 1/6 | \(\frac{1}{6}\) |
| 9-NC-206 | options.1 | 5/36 | \(\frac{5}{36}\) |
| 9-NC-206 | options.2 | 1/9 | \(\frac{1}{9}\) |
| 9-NC-206 | options.3 | 5/18 | \(\frac{5}{18}\) |
| 9-NC-206 | explanation | Không gian mẫu có 6.6 = 36 kết quả. Tổng bằng 8: (2;6), (3;5), (4;4), (5;3), (6;2), tức 5 kết quả. P = 5/36. Phương án 1/9 = 4/36 là quên cặp (4;4). | Không gian mẫu có \(6 \cdot 6 = 36\) kết quả. Tổng bằng 8: (2;6), (3;5), (4;4), (5;3), (6;2), tức 5 kết quả. \(P = \frac{5}{36}\). Phương án \(\frac{1}{9} = \frac{4}{36}\) là quên cặp (4;4). |
| 9-NC-207 | content | Với x ≥ 0, giá trị nhỏ nhất của A = x − 2√x + 3 là bao nhiêu? | Với \(x \ge 0\), giá trị nhỏ nhất của \(A = x - 2\sqrt{x} + 3\) là bao nhiêu? |
| 9-NC-207 | explanation | A = (√x − 1)^2 + 2 ≥ 2, dấu bằng khi √x = 1 hay x = 1. Phương án 3 là giá trị tại x = 0, chưa phải nhỏ nhất. | \(A = (\sqrt{x} - 1)^{2} + 2 \ge 2\), dấu bằng khi \(\sqrt{x} = 1\) hay \(x = 1\). Phương án 3 là giá trị tại \(x = 0\), chưa phải nhỏ nhất. |
| 9-NC-208 | explanation | V cốc = π.3^2.10 = 90π. V bi = (4/3)π.3^3 = 36π, lượng nước tràn ra bằng thể tích bi. Nước còn lại: 90π − 36π = 54π (cm³). Phương án 36π là thể tích nước tràn ra. | \(V\) cốc = \(\pi \cdot 3^{2} \cdot 10 = 90\pi\). \(V\) bi = \((\frac{4}{3})\pi \cdot 3^{3} = 36\pi\), lượng nước tràn ra bằng thể tích bi. Nước còn lại: \(90\pi - 36\pi = 54\pi\) (cm³). Phương án 36π là thể tích nước tràn ra. |
| 9-NC-219 | explanation | R tđ = 6.3/(6 + 3) = 2 Ω; P = U^2/R tđ = 36/2 = 18 W (kiểm tra: 6 W + 12 W). Phương án 4 W là tính như mắc nối tiếp: 36/9. | \(R_{\text{tđ}} = \frac{6 \cdot 3}{6 + 3} = 2\) Ω; \(P = \frac{U^{2}}{R_{\text{tđ}}} = \frac{36}{2} = 18\) W (kiểm tra: 6 W + 12 W). Phương án 4 W là tính như mắc nối tiếp: \(\frac{36}{9}\). |
| 9-NC-220 | content | Một tế bào ruồi giấm (2n = 8) nguyên phân liên tiếp 3 lần. Tổng số NST trong các tế bào con tạo ra là bao nhiêu? | Một tế bào ruồi giấm \((2n = 8)\) nguyên phân liên tiếp 3 lần. Tổng số NST trong các tế bào con tạo ra là bao nhiêu? |
| 9-NC-220 | explanation | Sau 3 lần nguyên phân tạo 2^3 = 8 tế bào con, mỗi tế bào vẫn có 2n = 8 NST, tổng 8.8 = 64. Phương án 24 là lấy 8.3, nhầm số tế bào tăng theo cấp số cộng. | Sau 3 lần nguyên phân tạo \(2^{3} = 8\) tế bào con, mỗi tế bào vẫn có \(2n = 8\) NST, tổng \(8 \cdot 8 = 64\). Phương án 24 là lấy 8.3, nhầm số tế bào tăng theo cấp số cộng. |
| 9-NC-221 | explanation | f < d < 2f nên ảnh thật, ngược chiều, lớn hơn vật. 1/d' = 1/f − 1/d = 1/10 − 1/15 = 1/30 ⇒ d' = 30 cm. Kết quả 6 cm là cộng nhầm 1/10 + 1/15. | \(f < d < 2f\) nên ảnh thật, ngược chiều, lớn hơn vật. \(\frac{1}{d'} = \frac{1}{f} - \frac{1}{d} = \frac{1}{10} - \frac{1}{15} = \frac{1}{30} \Rightarrow d' = 30\) cm. Kết quả 6 cm là cộng nhầm \(\frac{1}{10} + \frac{1}{15}\). |
| 9-NC-222 | explanation | Cơ năng W = Wt(20 m). Khi Wđ = 3Wt thì W = 4Wt ⇒ Wt = W/4 ⇒ h = 20/4 = 5 m. Độ cao 10 m là vị trí Wđ = Wt. | Cơ năng W = Wt(20 m). Khi Wđ = 3Wt thì W = 4Wt ⇒ Wt = \(\frac{W}{4} \Rightarrow h = \frac{20}{4} = 5\) m. Độ cao 10 m là vị trí Wđ = Wt. |
| 9-NC-223 | explanation | Fe + CuSO₄ → FeSO₄ + Cu. Cứ 1 mol Fe tan, 1 mol Cu bám thì thanh tăng 64 − 56 = 8 g. Tăng 0,8 g ⇒ 0,1 mol Cu ⇒ 6,4 g. Phương án 5,6 g là khối lượng Fe đã tan. | Fe + CuSO₄ → FeSO₄ + Cu. Cứ 1 mol Fe tan, 1 mol Cu bám thì thanh tăng \(64 - 56 = 8\) g. Tăng 0,8 g ⇒ 0,1 mol Cu ⇒ 6,4 g. Phương án 5,6 g là khối lượng Fe đã tan. |
| 9-NC-224 | explanation | n acid = 6 : 60 = 0,1 mol ⇒ ester lí thuyết 0,1 mol × 88 = 8,8 g. Hiệu suất 50% ⇒ 4,4 g. Phương án 8,8 g là quên nhân hiệu suất. | n acid = \(6 : 60 = 0{,}1\) mol ⇒ ester lí thuyết 0,1 mol × \(88 = 8{,}8\) g. Hiệu suất 50% ⇒ 4,4 g. Phương án 8,8 g là quên nhân hiệu suất. |
| 9-NC-225 | explanation | n C₂H₅OH = 4,6 : 46 = 0,1 mol; C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O ⇒ n CO₂ = 0,2 mol ⇒ V = 0,2 × 24,79 = 4,958 L. Kết quả 4,48 L là dùng 22,4 L/mol (điều kiện cũ). | n C₂H₅OH = \(4{,}6 : 46 = 0{,}1\) mol; C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O ⇒ n CO₂ = 0,2 mol ⇒ V = 0,2 × 24,79 = 4,958 L. Kết quả 4,48 L là dùng 22,4 L/mol (điều kiện cũ). |
| 9-NC-226 | options.0 | 1/4 | \(\frac{1}{4}\) |
| 9-NC-226 | options.1 | 3/4 | \(\frac{3}{4}\) |
| 9-NC-226 | options.2 | 2/3 | \(\frac{2}{3}\) |
| 9-NC-226 | options.3 | 1/3 | \(\frac{1}{3}\) |
| 9-NC-226 | explanation | F₁: 1AA : 2Aa : 1aa. Cây thân cao gồm 1AA + 2Aa = 3 phần, trong đó thuần chủng AA là 1 phần ⇒ 1/3. Phương án 1/4 là tỉ lệ AA trên tổng số cây. | F₁: 1AA : 2Aa : 1aa. Cây thân cao gồm 1AA + 2Aa = 3 phần, trong đó thuần chủng AA là 1 phần ⇒ \(\frac{1}{3}\). Phương án \(\frac{1}{4}\) là tỉ lệ AA trên tổng số cây. |
| 9-CB-301 | explanation | Số dương a có hai căn bậc hai là √a và −√a; 7^2 = (−7)^2 = 49. Chọn chỉ 7 là nhầm với căn bậc hai số học. | Số dương \(a\) có hai căn bậc hai là \(\sqrt{a}\) và \(-\sqrt{a}\); \(7^{2} = (-7)^{2} = 49\). Chọn chỉ 7 là nhầm với căn bậc hai số học. |
| 9-CB-302 | content | Điều kiện xác định của biểu thức (x + 2)/√(5 − x) là | Điều kiện xác định của biểu thức \(\frac{x + 2}{\sqrt{5 - x}}\) là |
| 9-CB-302 | options.0 | x ≤ 5 | \(x \le 5\) |
| 9-CB-302 | options.1 | x < 5 | \(x < 5\) |
| 9-CB-302 | options.2 | x > 5 | \(x > 5\) |
| 9-CB-302 | options.3 | x ≠ −2 | \(x \ne -2\) |
| 9-CB-302 | explanation | Cần 5 − x ≥ 0 để căn có nghĩa và √(5 − x) ≠ 0 vì nằm ở mẫu, nên 5 − x > 0 hay x < 5. Chọn x ≤ 5 là quên điều kiện mẫu khác 0. | Cần \(5 - x \ge 0\) để căn có nghĩa và \(\sqrt{5 - x} \ne 0\) vì nằm ở mẫu, nên \(5 - x > 0\) hay \(x < 5\). Chọn \(x \le 5\) là quên điều kiện mẫu khác 0. |
| 9-CB-303 | content | Giá trị của biểu thức A = √((√3 − 2)^2) + √3 là | Giá trị của biểu thức \(A = \sqrt{(\sqrt{3} - 2)^{2}} + \sqrt{3}\) là |
| 9-CB-303 | options.0 | 2√3 − 2 | \(2\sqrt{3} - 2\) |
| 9-CB-303 | options.3 | 2 + 2√3 | \(2 + 2\sqrt{3}\) |
| 9-CB-303 | explanation | Vì √3 < 2 nên √((√3 − 2)^2) = \|√3 − 2\| = 2 − √3. Do đó A = 2 − √3 + √3 = 2. Đáp án 2√3 − 2 do bỏ dấu giá trị tuyệt đối sai. | Vì \(\sqrt{3} < 2\) nên \(\sqrt{(\sqrt{3} - 2)^{2}} = \|\sqrt{3} - 2\| = 2 - \sqrt{3}\). Do đó \(A = 2 - \sqrt{3} + \sqrt{3} = 2\). Đáp án \(2\sqrt{3} - 2 do\) bỏ dấu giá trị tuyệt đối sai. |
| 9-CB-304 | content | Trục căn thức ở mẫu của biểu thức 2/(√5 − √3) ta được | Trục căn thức ở mẫu của biểu thức \(\frac{2}{\sqrt{5} - \sqrt{3}}\) ta được |
| 9-CB-304 | options.0 | √5 + √3 | \(\sqrt{5} + \sqrt{3}\) |
| 9-CB-304 | options.1 | √5 − √3 | \(\sqrt{5} - \sqrt{3}\) |
| 9-CB-304 | options.2 | 2(√5 + √3) | \(2(\sqrt{5} + \sqrt{3})\) |
| 9-CB-304 | options.3 | (√5 + √3)/4 | \(\frac{\sqrt{5} + \sqrt{3}}{4}\) |
| 9-CB-304 | explanation | Nhân cả tử và mẫu với √5 + √3: 2(√5 + √3)/(5 − 3) = √5 + √3. Đáp án 2(√5 + √3) là quên chia cho mẫu 5 − 3 = 2. | Nhân cả tử và mẫu với \(\sqrt{5} + \sqrt{3}\): \(\frac{2(\sqrt{5} + \sqrt{3})}{5 - 3} = \sqrt{5} + \sqrt{3}\). Đáp án \(2(\sqrt{5} + \sqrt{3})\) là quên chia cho mẫu \(5 - 3 = 2\). |
| 9-CB-305 | options.0 | x^2 + y = 4 | \(x^{2} + y = 4\) |
| 9-CB-305 | options.1 | xy − 2 = 0 | \(xy - 2 = 0\) |
| 9-CB-305 | options.2 | 0x + 0y = 5 | \(0x + 0y = 5\) |
| 9-CB-305 | options.3 | 3x − 2y = 1 | \(3x - 2y = 1\) |
| 9-CB-305 | explanation | Phương trình bậc nhất hai ẩn có dạng ax + by = c với a, b không đồng thời bằng 0. 0x + 0y = 5 có a = b = 0 nên không phải; x^2 + y và xy chứa bậc hai. | Phương trình bậc nhất hai ẩn có dạng \(ax + by = c\) với \(a\), \(b\) không đồng thời bằng 0. \(0x + 0y = 5\) có \(a = b = 0\) nên không phải; \(x^{2} + y\) và xy chứa bậc hai. |
| 9-CB-306 | options.0 | x − y = −1 và x + y = 3 | \(x - y = -1\) và \(x + y = 3\) |
| 9-CB-306 | options.1 | x + y = −1 và 2x − y = 4 | \(x + y = -1\) và \(2x - y = 4\) |
| 9-CB-306 | options.2 | 2x + y = 4 và x − y = 3 | \(2x + y = 4\) và \(x - y = 3\) |
| 9-CB-306 | options.3 | x + 2y = −3 và 3x + y = 2 | \(x + 2y = -3\) và \(3x + y = 2\) |
| 9-CB-306 | explanation | Thay x = 1, y = −2: 1 + (−2) = −1 và 2 + 2 = 4, thỏa cả hai. Hệ x + 2y = −3, 3x + y = 2 chỉ thỏa phương trình đầu (3 − 2 = 1 ≠ 2). | Thay \(x = 1\), \(y = -2\): \(1 + (-2) = -1\) và \(2 + 2 = 4\), thỏa cả hai. Hệ \(x + 2y = -3\), \(3x + y = 2\) chỉ thỏa phương trình đầu \((3 - 2 = 1 \ne 2)\). |
| 9-CB-307 | content | Biết (x₀; y₀) là nghiệm của hệ 2x + y = 7 và x − y = 2. Giá trị của x₀^2 + y₀ là | Biết (\(x_0\); \(y_0\)) là nghiệm của hệ \(2x + y = 7\) và \(x - y = 2\). Giá trị của \(x_0^{2} + y_0\) là |
| 9-CB-307 | explanation | Cộng vế: 3x = 9 nên x₀ = 3, y₀ = 1. Vậy x₀^2 + y₀ = 9 + 1 = 10. Đáp án 7 là tính nhầm x₀ + 2y₀ + 2. | Cộng vế: \(3x = 9\) nên \(x_0 = 3\), \(y_0 = 1\). Vậy \(x_0^{2} + y_0 = 9 + 1 = 10\). Đáp án 7 là tính nhầm \(x_0 + 2y_0 + 2\). |
| 9-CB-308 | content | Biển báo yêu cầu ô tô chạy với tốc độ v (km/h) không vượt quá 60 km/h. Bất đẳng thức đúng là | Biển báo yêu cầu ô tô chạy với tốc độ \(v\) (km/h) không vượt quá 60 km/h. Bất đẳng thức đúng là |
| 9-CB-308 | options.0 | v < 60 | \(v < 60\) |
| 9-CB-308 | options.1 | v ≥ 60 | \(v \ge 60\) |
| 9-CB-308 | options.2 | v > 60 | \(v > 60\) |
| 9-CB-308 | options.3 | v ≤ 60 | \(v \le 60\) |
| 9-CB-308 | explanation | "Không vượt quá" nghĩa là nhỏ hơn hoặc bằng, nên v ≤ 60. Chọn v < 60 là bỏ sót trường hợp chạy đúng 60 km/h vẫn được phép. | "Không vượt quá" nghĩa là nhỏ hơn hoặc bằng, nên \(v \le 60\). Chọn \(v < 60\) là bỏ sót trường hợp chạy đúng 60 km/h vẫn được phép. |
| 9-CB-309 | content | Cho a > b. Khẳng định nào sau đây sai? | Cho \(a > b\). Khẳng định nào sau đây sai? |
| 9-CB-309 | options.0 | −2a > −2b | \(-2a > -2b\) |
| 9-CB-309 | options.1 | a + 3 > b + 3 | \(a + 3 > b + 3\) |
| 9-CB-309 | options.2 | 5a > 5b | \(5a > 5b\) |
| 9-CB-309 | options.3 | a − 1 > b − 1 | \(a - 1 > b - 1\) |
| 9-CB-309 | explanation | Nhân hai vế với số âm thì phải đổi chiều: a > b ⇒ −2a < −2b. Các khẳng định còn lại đúng vì cộng/trừ một số hoặc nhân số dương giữ nguyên chiều. | Nhân hai vế với số âm thì phải đổi chiều: \(a > b \Rightarrow -2a < -2b\). Các khẳng định còn lại đúng vì cộng/trừ một số hoặc nhân số dương giữ nguyên chiều. |
| 9-CB-310 | content | Nghiệm của bất phương trình 3x − 5 ≤ x + 3 là | Nghiệm của bất phương trình \(3x - 5 \le x + 3\) là |
| 9-CB-310 | options.0 | x ≤ 4 | \(x \le 4\) |
| 9-CB-310 | options.1 | x ≥ 4 | \(x \ge 4\) |
| 9-CB-310 | options.2 | x ≤ −4 | \(x \le -4\) |
| 9-CB-310 | options.3 | x ≤ −1 | \(x \le -1\) |
| 9-CB-310 | explanation | Chuyển vế: 3x − x ≤ 3 + 5 ⇔ 2x ≤ 8 ⇔ x ≤ 4. Đáp án x ≤ −1 do chuyển −5 sang vế phải mà quên đổi dấu (2x ≤ 3 − 5 = −2). | Chuyển vế: \(3x - x \le 3 + 5 \Leftrightarrow 2x \le 8 \Leftrightarrow x \le 4\). Đáp án \(x \le -1 do\) chuyển −5 sang vế phải mà quên đổi dấu \((2x \le 3 - 5 = -2)\). |
| 9-CB-311 | content | Đồ thị hàm số y = ax^2 đi qua điểm M(−3; 18). Giá trị của a là | Đồ thị hàm số \(y = ax^{2}\) đi qua điểm M(−3; 18). Giá trị của \(a\) là |
| 9-CB-311 | explanation | Thay x = −3, y = 18: 18 = a.(−3)^2 = 9a nên a = 2. Đáp án −6 là chia 18 cho x = −3 thay vì chia cho x^2 = 9. | Thay \(x = -3\), \(y = 18\): \(18 = a \cdot (-3)^{2} = 9a\) nên \(a = 2\). Đáp án −6 là chia 18 cho \(x = -3\) thay vì chia cho \(x^{2} = 9\). |
| 9-CB-312 | content | Phát biểu nào đúng về hàm số y = −0,5x^2? | Phát biểu nào đúng về hàm số \(y = -0{,}5x^{2}\)? |
| 9-CB-312 | options.0 | Hàm số đồng biến khi x > 0 | Hàm số đồng biến khi \(x > 0\) |
| 9-CB-312 | options.3 | Hàm số đồng biến khi x < 0 | Hàm số đồng biến khi \(x < 0\) |
| 9-CB-312 | explanation | Với a = −0,5 < 0, hàm số đồng biến khi x < 0, nghịch biến khi x > 0; đồ thị nằm dưới trục hoành và giá trị lớn nhất là 0 (không phải nhỏ nhất). | Với \(a = -0{,}5 < 0\), hàm số đồng biến khi \(x < 0\), nghịch biến khi \(x > 0\); đồ thị nằm dưới trục hoành và giá trị lớn nhất là 0 (không phải nhỏ nhất). |
| 9-CB-313 | content | Phương trình 2x^2 − 7x + 5 = 0 có các nghiệm là | Phương trình \(2x^{2} - 7x + 5 = 0\) có các nghiệm là |
| 9-CB-313 | options.0 | x = −1 và x = −5/2 | \(x = -1\) và \(x = -\frac{5}{2}\) |
| 9-CB-313 | options.1 | x = 1 và x = 5 | \(x = 1\) và \(x = 5\) |
| 9-CB-313 | options.2 | x = 1 và x = 5/2 | \(x = 1\) và \(x = \frac{5}{2}\) |
| 9-CB-313 | options.3 | x = 2 và x = 5/2 | \(x = 2\) và \(x = \frac{5}{2}\) |
| 9-CB-313 | explanation | a + b + c = 2 − 7 + 5 = 0 nên x₁ = 1, x₂ = c/a = 5/2. Đáp án x = 1 và x = 5 là quên chia c cho a. | \(a + b + c = 2 - 7 + 5 = 0\) nên \(x_1 = 1\), \(x_2 = \frac{c}{a} = \frac{5}{2}\). Đáp án \(x = 1\) và \(x = 5\) là quên chia \(c\) cho \(a\). |
| 9-CB-314 | content | Gọi x₁, x₂ là hai nghiệm của phương trình x^2 − 6x − 7 = 0. Khi đó | Gọi \(x_1\), \(x_2\) là hai nghiệm của phương trình \(x^{2} - 6x - 7 = 0\). Khi đó |
| 9-CB-314 | options.0 | x₁ + x₂ = 6; x₁x₂ = −7 | \(x_1 + x_2 = 6\); \(x_1x_2 = -7\) |
| 9-CB-314 | options.1 | x₁ + x₂ = −6; x₁x₂ = −7 | \(x_1 + x_2 = -6\); \(x_1x_2 = -7\) |
| 9-CB-314 | options.2 | x₁ + x₂ = 6; x₁x₂ = 7 | \(x_1 + x_2 = 6\); \(x_1x_2 = 7\) |
| 9-CB-314 | options.3 | x₁ + x₂ = −7; x₁x₂ = 6 | \(x_1 + x_2 = -7\); \(x_1x_2 = 6\) |
| 9-CB-314 | explanation | Phương trình có ac < 0 nên có hai nghiệm. Theo Vi-ét: x₁ + x₂ = −b/a = 6, x₁x₂ = c/a = −7. Đáp án −6 là quên dấu trừ trong −b/a. | Phương trình có \(ac < 0\) nên có hai nghiệm. Theo Vi-ét: \(x_1 + x_2 = -\frac{b}{a} = 6\), \(x_1x_2 = \frac{c}{a} = -7\). Đáp án −6 là quên dấu trừ trong \(-\frac{b}{a}\). |
| 9-CB-315 | content | Tam giác ABC vuông tại A có AB = 9 cm, AC = 12 cm, đường cao AH. Độ dài AH là | Tam giác ABC vuông tại \(A\) có \(AB = 9\) cm, \(AC = 12\) cm, đường cao AH. Độ dài AH là |
| 9-CB-315 | explanation | BC = √(81 + 144) = 15 cm. AH = AB.AC/BC = 108/15 = 7,2 cm. Đáp án 15 cm là độ dài cạnh huyền BC, không phải đường cao. | \(BC = \sqrt{81 + 144} = 15\) cm. \(AH = \frac{AB \cdot AC}{BC} = \frac{108}{15} = 7{,}2\) cm. Đáp án 15 cm là độ dài cạnh huyền BC, không phải đường cao. |
| 9-CB-316 | options.0 | sin 35° = cos 55° | \(\sin 35^\circ = \cos 55^\circ\) |
| 9-CB-316 | options.1 | cos 30° = −sin 60° | \(\cos 30^\circ = -\sin 60^\circ\) |
| 9-CB-316 | options.2 | tan 40° . cot 40° = 1 | \(\tan 40^\circ . \cot 40^\circ = 1\) |
| 9-CB-316 | options.3 | sin^2 20° + cos^2 20° = 1 | \(\sin ^{2} 20^\circ + \cos ^{2} 20^\circ = 1\) |
| 9-CB-316 | explanation | Hai góc phụ nhau thì sin góc này bằng cos góc kia nên cos 30° = sin 60°, tỉ số lượng giác góc nhọn luôn dương, không có dấu trừ. Các khẳng định khác đều là hệ thức cơ bản. | Hai góc phụ nhau thì sin góc này bằng cos góc kia nên \(\cos 30^\circ = \sin 60^\circ\), tỉ số lượng giác góc nhọn luôn dương, không có dấu trừ. Các khẳng định khác đều là hệ thức cơ bản. |
| 9-CB-317 | content | Trên đường tròn (O), góc ở tâm AOB = 140°. Góc nội tiếp ACB chắn cung nhỏ AB có số đo là | Trên đường tròn (O), góc ở tâm \(AOB = 140^\circ\). Góc nội tiếp ACB chắn cung nhỏ AB có số đo là |
| 9-CB-317 | explanation | Góc nội tiếp bằng nửa góc ở tâm cùng chắn một cung: 140° : 2 = 70°. Đáp án 140° là nhầm góc nội tiếp bằng góc ở tâm. | Góc nội tiếp bằng nửa góc ở tâm cùng chắn một cung: \(140^\circ : 2 = 70^\circ\). Đáp án 140° là nhầm góc nội tiếp bằng góc ở tâm. |
| 9-CB-318 | content | Tứ giác ABCD nội tiếp đường tròn có góc A = 75°. Số đo góc C là | Tứ giác ABCD nội tiếp đường tròn có góc \(A = 75^\circ\). Số đo góc \(C\) là |
| 9-CB-318 | explanation | Tứ giác nội tiếp có tổng hai góc đối bằng 180°, nên C = 180° − 75° = 105°. Đáp án 15° là nhầm hai góc phụ nhau (tổng 90°). | Tứ giác nội tiếp có tổng hai góc đối bằng 180°, nên \(C = 180^\circ - 75^\circ = 105^\circ\). Đáp án 15° là nhầm hai góc phụ nhau (tổng 90°). |
| 9-CB-319 | options.0 | 9√3 cm | \(9\sqrt{3}\) cm |
| 9-CB-319 | options.1 | 3√3 cm | \(3\sqrt{3}\) cm |
| 9-CB-319 | options.2 | 3√3/2 cm | \(\frac{3\sqrt{3}}{2}\) cm |
| 9-CB-319 | options.3 | √3 cm | \(\sqrt{3}\) cm |
| 9-CB-319 | explanation | R = a√3/3 = 9√3/3 = 3√3 cm. Đáp án 3√3/2 cm là bán kính đường tròn nội tiếp (r = a√3/6). | \(R = \frac{a\sqrt{3}}{3} = \frac{9\sqrt{3}}{3} = 3\sqrt{3}\) cm. Đáp án \(\frac{3\sqrt{3}}{2}\) cm là bán kính đường tròn nội tiếp \((r = \frac{a\sqrt{3}}{6})\). |
| 9-CB-320 | explanation | S = πR^2.n/360 = π.36.120/360 = 12π cm². Đáp án 4π cm² là độ dài cung (πRn/180 = 4π cm), không phải diện tích. | \(S = \frac{\pi R^{2} \cdot n}{360} = \frac{\pi \cdot 36 \cdot 120}{360} = 12\pi\) cm². Đáp án 4π cm² là độ dài cung (\(\frac{\pi Rn}{180} = 4\pi\) cm), không phải diện tích. |
| 9-CB-321 | explanation | Đường sinh l = √(3^2 + 4^2) = 5 cm. S_xq = πrl = π.3.5 = 15π cm². Đáp án 12π là dùng nhầm chiều cao thay cho đường sinh. | Đường sinh \(l = \sqrt{3^{2} + 4^{2}} = 5\) cm. \(S_{\text{xq}} = \pi rl = \pi \cdot 3 \cdot 5 = 15\pi\) cm². Đáp án 12π là dùng nhầm chiều cao thay cho đường sinh. |
| 9-CB-322 | explanation | V = (4/3)πR^3 = (4/3).π.27 = 36π dm³. Đáp án 108π là dùng 4πR^3, quên chia 3 trong hệ số 4/3. | \(V = (\frac{4}{3})\pi R^{3} = (\frac{4}{3}) \cdot \pi \cdot 27 = 36\pi\) dm³. Đáp án 108π là dùng \(4\pi R^{3}\), quên chia 3 trong hệ số \(\frac{4}{3}\). |
| 9-CB-323 | options.0 | 1/4 | \(\frac{1}{4}\) |
| 9-CB-323 | options.1 | 1/5 | \(\frac{1}{5}\) |
| 9-CB-323 | options.2 | 3/10 | \(\frac{3}{10}\) |
| 9-CB-323 | options.3 | 2/5 | \(\frac{2}{5}\) |
| 9-CB-323 | explanation | Các số chia hết cho 4 là 4 và 8, có 2 kết quả thuận lợi trên 10 kết quả: 2/10 = 1/5. Đáp án 3/10 là số thẻ chia hết cho 3 (3, 6, 9). | Các số chia hết cho 4 là 4 và 8, có 2 kết quả thuận lợi trên 10 kết quả: \(\frac{2}{10} = \frac{1}{5}\). Đáp án \(\frac{3}{10}\) là số thẻ chia hết cho 3 (3, 6, 9). |
| 9-CB-324 | explanation | Giá trị đại diện là trung điểm của nhóm: (150 + 155) : 2 = 152,5. Đáp án 5 là độ dài nhóm, không phải giá trị đại diện. | Giá trị đại diện là trung điểm của nhóm: \((150 + 155) : 2 = 152{,}5\). Đáp án 5 là độ dài nhóm, không phải giá trị đại diện. |
| 9-CB-325 | explanation | A = F.s = 50.4 = 200 J. Đáp án 12,5 J là lấy F chia s, sai công thức. | \(A = F \cdot s = 50 \cdot 4 = 200\) J. Đáp án 12,5 J là lấy F chia s, sai công thức. |
| 9-CB-340 | content | Kết quả của quá trình nguyên phân từ một tế bào mẹ (2n) là | Kết quả của quá trình nguyên phân từ một tế bào mẹ \((2n)\) là |
| 9-CB-340 | options.2 | 2 tế bào con có bộ NST 2n | 2 tế bào con có bộ NST \(2n\) |
| 9-CB-340 | options.3 | 4 tế bào con có bộ NST 2n | 4 tế bào con có bộ NST \(2n\) |
| 9-CB-340 | explanation | Nguyên phân giữ nguyên bộ NST: 1 tế bào 2n tạo 2 tế bào con 2n giống hệt mẹ. Kết quả 4 tế bào n là của giảm phân. | Nguyên phân giữ nguyên bộ NST: 1 tế bào \(2n\) tạo 2 tế bào con \(2n\) giống hệt mẹ. Kết quả 4 tế bào n là của giảm phân. |
| 9-NC-301 | content | Với x ≥ 0, x ≠ 4, biểu thức A = 1/(√x − 2) + 1/(√x + 2) rút gọn được là | Với \(x \ge 0\), \(x \ne 4\), biểu thức \(A = \frac{1}{\sqrt{x} - 2} + \frac{1}{\sqrt{x} + 2}\) rút gọn được là |
| 9-NC-301 | options.0 | 4/(x − 4) | \(\frac{4}{x - 4}\) |
| 9-NC-301 | options.1 | 2/(x − 4) | \(\frac{2}{x - 4}\) |
| 9-NC-301 | options.2 | 2√x/(4 − x) | \(\frac{2\sqrt{x}}{4 - x}\) |
| 9-NC-301 | options.3 | 2√x/(x − 4) | \(\frac{2\sqrt{x}}{x - 4}\) |
| 9-NC-301 | explanation | Quy đồng mẫu (√x − 2)(√x + 2) = x − 4: tử là √x + 2 + √x − 2 = 2√x. Vậy A = 2√x/(x − 4). Đáp án 4/(x − 4) do cộng nhầm hai số hạng hằng thay vì triệt tiêu. | Quy đồng mẫu \((\sqrt{x} - 2)(\sqrt{x} + 2) = x - 4\): tử là \(\sqrt{x} + 2 + \sqrt{x} - 2 = 2\sqrt{x}\). Vậy \(A = \frac{2\sqrt{x}}{x - 4}\). Đáp án \(\frac{4}{x - 4} do\) cộng nhầm hai số hạng hằng thay vì triệt tiêu. |
| 9-NC-302 | content | Cho P = √x/(√x + 3) với x ≥ 0. Tập hợp giá trị của x để P < 1/2 là | Cho \(P = \frac{\sqrt{x}}{\sqrt{x} + 3}\) với \(x \ge 0\). Tập hợp giá trị của \(x\) để \(P < \frac{1}{2}\) là |
| 9-NC-302 | options.0 | x < 9 | \(x < 9\) |
| 9-NC-302 | options.1 | 0 ≤ x < 3 | \(0 \le x < 3\) |
| 9-NC-302 | options.2 | 0 ≤ x < 9 | \(0 \le x < 9\) |
| 9-NC-302 | options.3 | x > 9 | \(x > 9\) |
| 9-NC-302 | explanation | √x + 3 > 0 nên P < 1/2 ⇔ 2√x < √x + 3 ⇔ √x < 3 ⇔ x < 9, kết hợp x ≥ 0. Đáp án 0 ≤ x < 3 là dừng ở √x < 3 mà quên bình phương. | \(\sqrt{x} + 3 > 0\) nên \(P < \frac{1}{2} \Leftrightarrow 2\sqrt{x} < \sqrt{x} + 3 \Leftrightarrow \sqrt{x} < 3 \Leftrightarrow x < 9\), kết hợp \(x \ge 0\). Đáp án \(0 \le x < 3\) là dừng ở \(\sqrt{x} < 3\) mà quên bình phương. |
| 9-NC-303 | content | Tìm m để phương trình x^2 − 5x + m = 0 có hai nghiệm x₁, x₂ thỏa mãn x₁ − x₂ = 3. | Tìm \(m\) để phương trình \(x^{2} - 5x + m = 0\) có hai nghiệm \(x_1\), \(x_2\) thỏa mãn \(x_1 - x_2 = 3\). |
| 9-NC-303 | options.0 | m = 1 | \(m = 1\) |
| 9-NC-303 | options.1 | m = 6 | \(m = 6\) |
| 9-NC-303 | options.2 | m = 4 | \(m = 4\) |
| 9-NC-303 | options.3 | m = −4 | \(m = -4\) |
| 9-NC-303 | explanation | (x₁ − x₂)^2 = (x₁ + x₂)^2 − 4x₁x₂ = 25 − 4m = 9 nên m = 4. Khi đó Δ = 9 > 0, nghiệm là 4 và 1, thỏa mãn. m = 6 là nhầm thành 25 − 4m = 1. | \((x_1 - x_2)^{2} = (x_1 + x_2)^{2} - 4x_1x_2 = 25\) − 4m = 9 nên \(m = 4\). Khi đó \(\Delta = 9 > 0\), nghiệm là 4 và 1, thỏa mãn. \(m = 6\) là nhầm thành 25 − 4m = 1. |
| 9-NC-304 | content | Phương trình x^2 − 2x + m − 3 = 0 có hai nghiệm trái dấu khi và chỉ khi | Phương trình \(x^{2} - 2x + m - 3 = 0\) có hai nghiệm trái dấu khi và chỉ khi |
| 9-NC-304 | options.0 | m > 3 | \(m > 3\) |
| 9-NC-304 | options.1 | m < 4 | \(m < 4\) |
| 9-NC-304 | options.2 | m ≤ 3 | \(m \le 3\) |
| 9-NC-304 | options.3 | m < 3 | \(m < 3\) |
| 9-NC-304 | explanation | Hai nghiệm trái dấu ⇔ a.c < 0 ⇔ m − 3 < 0 ⇔ m < 3. Đáp án m < 4 là điều kiện Δ' > 0 (1 − m + 3 > 0), chỉ bảo đảm hai nghiệm phân biệt chứ chưa trái dấu. | Hai nghiệm trái dấu ⇔ \(a \cdot c < 0 \Leftrightarrow m - 3 < 0 \Leftrightarrow m < 3\). Đáp án \(m < 4\) là điều kiện \(\Delta ' > 0 (1 - m + 3 > 0)\), chỉ bảo đảm hai nghiệm phân biệt chứ chưa trái dấu. |
| 9-NC-305 | content | Đường thẳng y = 2x + 3 cắt parabol y = x^2 tại hai điểm A và B. Tổng tung độ của A và B là | Đường thẳng \(y = 2x + 3\) cắt parabol \(y = x^{2}\) tại hai điểm \(A\) và \(B\). Tổng tung độ của \(A\) và \(B\) là |
| 9-NC-305 | explanation | Hoành độ giao điểm: x^2 − 2x − 3 = 0 ⇒ x = −1 hoặc x = 3, tung độ tương ứng 1 và 9. Tổng là 10. Đáp án 2 là tổng hoành độ, không phải tung độ. | Hoành độ giao điểm: \(x^{2} - 2x - 3 = 0 \Rightarrow x = -1\) hoặc \(x = 3\), tung độ tương ứng 1 và 9. Tổng là 10. Đáp án 2 là tổng hoành độ, không phải tung độ. |
| 9-NC-306 | explanation | Gọi chiều rộng x (m), dài 360/x. (x + 2)(360/x − 6) = 360 ⇒ x^2 + 2x − 120 = 0 ⇒ x = 10 (loại −12). Kiểm tra: 12 . 30 = 360. Đáp án 36 m là chiều dài. | Gọi chiều rộng x (m), dài \(\frac{360}{x}\). \((x + 2)(\frac{360}{x} - 6) = 360 \Rightarrow x^{2} + 2x - 120 = 0 \Rightarrow x = 10\) (loại −12). Kiểm tra: \(12 \cdot 30 = 360\). Đáp án 36 m là chiều dài. |
| 9-NC-307 | explanation | 48/(v + 4) + 48/(v − 4) = 5 ⇒ 5v^2 − 96v − 80 = 0 ⇒ v = 20 (loại −0,8). Đáp án 19,2 km/h do lấy 96 : 5, bỏ qua ảnh hưởng của dòng nước. | \(\frac{48}{v + 4} + \frac{48}{v - 4} = 5 \Rightarrow 5v^{2} - 96v - 80 = 0 \Rightarrow v = 20\) (loại −0,8). Đáp án 19,2 km/h do lấy \(96 : 5\), bỏ qua ảnh hưởng của dòng nước. |
| 9-NC-308 | content | Hệ phương trình mx + y = 2 và x + y = 1 vô nghiệm khi | Hệ phương trình \(mx + y = 2\) và \(x + y = 1\) vô nghiệm khi |
| 9-NC-308 | options.0 | m = 2 | \(m = 2\) |
| 9-NC-308 | options.1 | m ≠ 1 | \(m \ne 1\) |
| 9-NC-308 | options.2 | m = 1 | \(m = 1\) |
| 9-NC-308 | options.3 | m = −1 | \(m = -1\) |
| 9-NC-308 | explanation | Trừ vế: (m − 1)x = 1. Hệ vô nghiệm ⇔ m − 1 = 0 ⇔ m = 1 (khi đó x + y bằng cả 2 và 1). Với m ≠ 1 hệ có nghiệm duy nhất. | Trừ vế: \((m - 1)x = 1\). Hệ vô nghiệm ⇔ \(m - 1 = 0 \Leftrightarrow m = 1\) (khi đó \(x + y\) bằng cả 2 và 1). Với \(m \ne 1\) hệ có nghiệm duy nhất. |
| 9-NC-309 | content | Với x > 0, giá trị nhỏ nhất của biểu thức B = x + 9/x là | Với \(x > 0\), giá trị nhỏ nhất của biểu thức \(B = x + \frac{9}{x}\) là |
| 9-NC-309 | explanation | Ta có x + 9/x − 6 = (√x − 3/√x)^2 ≥ 0 nên B ≥ 6, dấu bằng khi √x = 3/√x tức x = 3. Đáp án 3 là giá trị của x khi B nhỏ nhất, không phải giá trị nhỏ nhất của B. | Ta có \(x + \frac{9}{x} - 6 = (\sqrt{x} - \frac{3}{\sqrt{x}})^{2} \ge 0\) nên \(B \ge 6\), dấu bằng khi \(\sqrt{x} = \frac{3}{\sqrt{x}}\) tức \(x = 3\). Đáp án 3 là giá trị của \(x\) khi \(B\) nhỏ nhất, không phải giá trị nhỏ nhất của \(B\). |
| 9-NC-310 | explanation | Độ cao h = 5 . sin 60° = 5√3/2 ≈ 4,33 m. Đáp án 2,50 m = 5 . cos 60° là khoảng cách từ chân thang đến tường. | Độ cao \(h = 5 \cdot \sin 60^\circ = \frac{5\sqrt{3}}{2} \approx 4{,}33\) m. Đáp án 2,50 m = 5 . cos 60° là khoảng cách từ chân thang đến tường. |
| 9-NC-311 | content | Đường tròn (O; 5 cm) có dây AB = 8 cm. Khoảng cách từ tâm O đến dây AB là | Đường tròn (\(O\); 5 cm) có dây \(AB = 8\) cm. Khoảng cách từ tâm \(O\) đến dây AB là |
| 9-NC-311 | options.1 | √41 cm | \(\sqrt{41}\) cm |
| 9-NC-311 | explanation | Kẻ OH ⊥ AB thì H là trung điểm AB, HB = 4 cm. OH = √(5^2 − 4^2) = 3 cm. Đáp án 4 cm là nửa dây AB. | Kẻ OH ⊥ AB thì \(H\) là trung điểm AB, \(HB = 4\) cm. \(OH = \sqrt{5^{2} - 4^{2}} = 3\) cm. Đáp án 4 cm là nửa dây AB. |
| 9-NC-312 | content | Từ điểm M ngoài (O; 5 cm) kẻ hai tiếp tuyến MA, MB (A, B là tiếp điểm) với góc AMB = 60°. Độ dài OM là | Từ điểm \(M\) ngoài (\(O\); 5 cm) kẻ hai tiếp tuyến MA, MB (A, \(B\) là tiếp điểm) với góc \(AMB = 60^\circ\). Độ dài OM là |
| 9-NC-312 | options.1 | 5√3 cm | \(5\sqrt{3}\) cm |
| 9-NC-312 | options.3 | 10√3 cm | \(10\sqrt{3}\) cm |
| 9-NC-312 | explanation | MO là phân giác góc AMB nên góc AMO = 30°. Tam giác OAM vuông tại A: OM = OA/sin 30° = 10 cm. Đáp án 5√3 cm là độ dài tiếp tuyến MA. | MO là phân giác góc AMB nên góc \(AMO = 30^\circ\). Tam giác OAM vuông tại \(A\): \(OM = \frac{OA}{\sin} 30^\circ = 10\) cm. Đáp án \(5\sqrt{3}\) cm là độ dài tiếp tuyến MA. |
| 9-NC-313 | explanation | r = 0,6 m; V = π r^2 h ≈ 3,14 . 0,36 . 1,5 ≈ 1,696 m³ ≈ 1 696 lít. Đáp án 6 782 lít do lấy nhầm đường kính 1,2 m làm bán kính. | \(r = 0{,}6\) m; \(V = \pi r^{2} h \approx 3{,}14 \cdot 0{,}36 \cdot 1{,}5 \approx 1{,}696 m^3 \approx 1\,696\) lít. Đáp án 6 782 lít do lấy nhầm đường kính 1,2 m làm bán kính. |
| 9-NC-314 | options.0 | 3/8 | \(\frac{3}{8}\) |
| 9-NC-314 | options.1 | 1/8 | \(\frac{1}{8}\) |
| 9-NC-314 | options.2 | 7/8 | \(\frac{7}{8}\) |
| 9-NC-314 | options.3 | 1/2 | \(\frac{1}{2}\) |
| 9-NC-314 | explanation | Có 2^3 = 8 kết quả đồng khả năng; chỉ 1 kết quả không có mặt ngửa (SSS). Xác suất cần tìm 1 − 1/8 = 7/8. Đáp án 3/8 là xác suất có đúng một lần ngửa. | Có \(2^{3} = 8\) kết quả đồng khả năng; chỉ 1 kết quả không có mặt ngửa (SSS). Xác suất cần tìm \(1 - \frac{1}{8} = \frac{7}{8}\). Đáp án \(\frac{3}{8}\) là xác suất có đúng một lần ngửa. |
| 9-NC-315 | options.0 | 1/2 | \(\frac{1}{2}\) |
| 9-NC-315 | options.1 | 1/3 | \(\frac{1}{3}\) |
| 9-NC-315 | options.2 | 1/4 | \(\frac{1}{4}\) |
| 9-NC-315 | options.3 | 2/3 | \(\frac{2}{3}\) |
| 9-NC-315 | explanation | Không gian mẫu có 6 cặp (AB, AC, AD, BC, BD, CD); có 4 cặp gồm 1 nam 1 nữ. P = 4/6 = 2/3. Đáp án 1/2 do nghĩ chỉ có hai khả năng "cùng giới" và "khác giới" như nhau. | Không gian mẫu có 6 cặp (AB, AC, AD, BC, BD, CD); có 4 cặp gồm 1 nam 1 nữ. \(P = \frac{4}{6} = \frac{2}{3}\). Đáp án \(\frac{1}{2} do\) nghĩ chỉ có hai khả năng "cùng giới" và "khác giới" như nhau. |
| 9-NC-316 | explanation | Đi x km: 15 000 + 12 000(x − 1) ≤ 200 000 ⇒ x − 1 ≤ 15,4 ⇒ x ≤ 16,4. Vậy tối đa 16 km. Đáp án 15 km là lấy x − 1 làm số km. | Đi \(x\) km: \(15\,000 + 12\,000(x - 1) \le 200\,000 \Rightarrow x - 1 \le 15{,}4 \Rightarrow x \le 16{,}4\). Vậy tối đa 16 km. Đáp án 15 km là lấy \(x - 1\) làm số km. |
| 9-NC-317 | explanation | R₂₃ = 6.12/18 = 4 Ω, R = 8 Ω, I = 12/8 = 1,5 A. U₂₃ = 1,5 . 4 = 6 V nên I₂ = 6/6 = 1 A. Đáp án 1,5 A là dòng mạch chính, chưa chia cho hai nhánh. | R₂₃ = \(\frac{6 \cdot 12}{18} = 4\) Ω, R = 8 Ω, I = 12/8 = 1,5 A. U₂₃ = \(1{,}5 \cdot 4 = 6\) V nên I₂ = \(\frac{6}{6} = 1\) A. Đáp án 1,5 A là dòng mạch chính, chưa chia cho hai nhánh. |
| 9-NC-318 | explanation | A = P.t = 1 kW . 2 h . 30 = 60 kWh. Tiền = 60 . 2 000 = 120 000 đồng. Đáp án 60 000 đồng là quên rằng mỗi ngày dùng 2 giờ (chỉ tính 1 giờ/ngày). | \(A = P \cdot t = 1 kW \cdot 2\) h . \(30 = 60\) kWh. Tiền = \(60 \cdot 2\,000 = 120\,000\) đồng. Đáp án 60 000 đồng là quên rằng mỗi ngày dùng 2 giờ (chỉ tính 1 giờ/ngày). |
| 9-NC-319 | content | Dây nikelin dài 10 m, tiết diện 0,2 mm², điện trở suất 0,4 . 10^(−6) Ω.m. Điện trở của dây là | Dây nikelin dài 10 m, tiết diện 0,2 mm², điện trở suất \(0{,}4 \cdot 10^{-6}\) Ω.m. Điện trở của dây là |
| 9-NC-319 | explanation | R = ρl/S = 0,4 . 10^(−6) . 10 / (0,2 . 10^(−6)) = 20 Ω. Lỗi hay gặp là không đổi mm² sang m² (1 mm² = 10^(−6) m²) nên ra kết quả lệch bậc. | R = ρl/S = \(0{,}4 \cdot 10^{-6} \cdot 10\) / \((0{,}2 \cdot 10^{-6}) = 20\) Ω. Lỗi hay gặp là không đổi mm² sang m² (1 mm² = \(10^{-6} m^2\)) nên ra kết quả lệch bậc. |
| 9-NC-320 | explanation | 1/d' = 1/12 − 1/36 = 1/18 ⇒ d' = 18 cm. h' = h.d'/d = 4 . 18/36 = 2 cm (ảnh thật, ngược chiều). Đáp án 1,33 cm là lấy h.f/d. | \(\frac{1}{d'} = \frac{1}{12} - \frac{1}{36} = \frac{1}{18} \Rightarrow d' = 18\) cm. \(h' = \frac{h \cdot d'}{d} = 4 \cdot \frac{18}{36} = 2\) cm (ảnh thật, ngược chiều). Đáp án 1,33 cm là lấy \(\frac{h \cdot f}{d}\). |
| 9-NC-321 | content | Ném vật 0,5 kg thẳng đứng lên từ mặt đất với tốc độ 10 m/s, bỏ qua sức cản, lấy g = 10 m/s². Độ cao cực đại vật đạt được là | Ném vật 0,5 kg thẳng đứng lên từ mặt đất với tốc độ 10 m/s, bỏ qua sức cản, lấy \(g = 10 \frac{m}{s}^2\). Độ cao cực đại vật đạt được là |
| 9-NC-321 | explanation | Cơ năng bảo toàn: ½mv^2 = mgh ⇒ h = v^2/(2g) = 100/20 = 5 m, không phụ thuộc khối lượng. Đáp án 10 m là quên hệ số ½ của động năng. | Cơ năng bảo toàn: ½mv^2 = \(mgh \Rightarrow h = \frac{v^{2}}{2g} = \frac{100}{20} = 5\) m, không phụ thuộc khối lượng. Đáp án 10 m là quên hệ số ½ của động năng. |
| 9-NC-322 | explanation | A = P.h = 9 000 . 8 = 72 000 J; t = 60 s nên P = 72 000/60 = 1 200 W. Đáp án 72 000 W là quên chia thời gian (đó là công tính bằng J). | \(A = P \cdot h = 9\,000 \cdot 8 = 72\,000\) J; \(t = 60\) s nên \(P = 72 \frac{000}{60} = 1\,200\) W. Đáp án 72 000 W là quên chia thời gian (đó là công tính bằng J). |
| 9-NC-323 | explanation | Mg + H₂SO₄ → MgSO₄ + H₂. n(Mg) = 4,8 : 24 = 0,2 mol = n(H₂), V = 0,2 · 24,79 = 4,958 L. Đáp số 4,48 L là dùng 22,4 L/mol theo quy ước cũ (điều kiện tiêu chuẩn). | Mg + H₂SO₄ → MgSO₄ + H₂. n(Mg) = \(4{,}8 : 24 = 0{,}2\) mol = n(H₂), V = 0,2 · 24,79 = 4,958 L. Đáp số 4,48 L là dùng 22,4 L/mol theo quy ước cũ (điều kiện tiêu chuẩn). |
| 9-NC-324 | content | Lên men 360 g glucose với hiệu suất 80%. Khối lượng ethylic alcohol thu được là (C = 12, H = 1, O = 16) | Lên men 360 g glucose với hiệu suất 80%. Khối lượng ethylic alcohol thu được là (\(C = 12\), \(H = 1\), \(O = 16\)) |
| 9-NC-324 | explanation | C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. n(glucose) = 2 mol ⇒ lí thuyết 4 mol C₂H₅OH = 184 g; thực tế 184 . 0,8 = 147,2 g. Đáp án 184 g là quên nhân hiệu suất. | C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. n(glucose) = 2 mol ⇒ lí thuyết 4 mol C₂H₅OH = 184 g; thực tế \(184 \cdot 0{,}8 = 147{,}2\) g. Đáp án 184 g là quên nhân hiệu suất. |
| 9-NC-325 | explanation | Trùng hợp bảo toàn khối lượng: lí thuyết 28 kg PE, thực tế 28 . 0,9 = 25,2 kg. Đáp án 31,1 kg là chia cho 0,9 – cách làm khi tính ngược lượng chất ban đầu cần dùng. | Trùng hợp bảo toàn khối lượng: lí thuyết 28 kg PE, thực tế \(28 \cdot 0{,}9 = 25{,}2\) kg. Đáp án 31,1 kg là chia cho 0,9 – cách làm khi tính ngược lượng chất ban đầu cần dùng. |
| 9-NC-326 | explanation | n(CH₃COOH) = 12/60 = 0,2 mol ⇒ n(CH₃COONa) = 0,2 mol ⇒ m = 0,2 . 82 = 16,4 g. Đáp án 8,2 g là lấy số mol 0,1. | n(CH₃COOH) = \(\frac{12}{60} = 0{,}2\) mol ⇒ n(CH₃COONa) = 0,2 mol ⇒ \(m = 0{,}2 \cdot 82 = 16{,}4\) g. Đáp án 8,2 g là lấy số mol 0,1. |
| 9-NC-327 | explanation | Chỉ C₂H₄ bị giữ lại: n(C₂H₄) = 1,4/28 = 0,05 mol; n(hỗn hợp) = 2,479/24,79 = 0,1 mol. Vậy CH₄ chiếm 0,05/0,1 = 50%. CH₄ không phản ứng với bromine. | Chỉ C₂H₄ bị giữ lại: n(C₂H₄) = \(\frac{1{,}4}{28} = 0{,}05\) mol; n(hỗn hợp) = \(\frac{2{,}479}{24{,}79} = 0{,}1\) mol. Vậy CH₄ chiếm \(\frac{0{,}05}{0{,}1} = 50\%\). CH₄ không phản ứng với bromine. |
| 9-NC-328 | content | Một phân tử DNA có 3 000 nucleotide, trong đó A = 600. Số liên kết hydrogen của phân tử là | Một phân tử DNA có 3 000 nucleotide, trong đó \(A = 600\). Số liên kết hydrogen của phân tử là |
| 9-NC-328 | explanation | A = T = 600 ⇒ G = X = (3 000 − 1 200)/2 = 900. H = 2A + 3G = 1 200 + 2 700 = 3 900. Đáp án 3 600 là nhầm A–T có 3 liên kết, G–X có 2 liên kết; 3 000 là tính 2A + 2G. | \(A = T = 600 \Rightarrow G = X = \frac{3\,000 - 1\,200}{2} = 900\). \(H = 2A + 3G = 1\,200 + 2\,700 = 3\,900\). Đáp án 3 600 là nhầm A–T có 3 liên kết, G–X có 2 liên kết; 3 000 là tính \(2A + 2G\). |
| 9-NC-329 | explanation | Mỗi lần tái bản số phân tử tăng gấp đôi: 2^3 = 8. Đáp án 6 là nhân 2 . 3 thay vì lũy thừa. | Mỗi lần tái bản số phân tử tăng gấp đôi: \(2^{3} = 8\). Đáp án 6 là nhân \(2 \cdot 3\) thay vì lũy thừa. |
| 9-NC-330 | explanation | Mỗi cặp nucleotide dài 3,4 Å nên số cặp là 5 100/3,4 = 1 500, tổng số nucleotide N = 3 000. Đáp án 1 500 là số cặp, quên nhân 2. | Mỗi cặp nucleotide dài 3,4 Å nên số cặp là \(5 \frac{100}{3{,}4} = 1\,500\), tổng số nucleotide \(N = 3\,000\). Đáp án 1 500 là số cặp, quên nhân 2. |
| 9-NC-331 | options.0 | 3/16 | \(\frac{3}{16}\) |
| 9-NC-331 | options.1 | 9/16 | \(\frac{9}{16}\) |
| 9-NC-331 | options.2 | 1/16 | \(\frac{1}{16}\) |
| 9-NC-331 | options.3 | 3/4 | \(\frac{3}{4}\) |
| 9-NC-331 | explanation | Mỗi cặp Aa × Aa cho 3/4 trội, nên tỉ lệ trội cả hai là 3/4 . 3/4 = 9/16. 3/16 là tỉ lệ trội một tính trạng, lặn tính trạng kia. | Mỗi cặp Aa × Aa cho \(\frac{3}{4}\) trội, nên tỉ lệ trội cả hai là \(\frac{3}{4} \cdot \frac{3}{4} = \frac{9}{16}\). \(\frac{3}{16}\) là tỉ lệ trội một tính trạng, lặn tính trạng kia. |
| 9-NC-332 | content | Ở người (2n = 46), một tế bào đang ở kì sau của nguyên phân có bao nhiêu NST? | Ở người \((2n = 46)\), một tế bào đang ở kì sau của nguyên phân có bao nhiêu NST? |
| 9-NC-332 | explanation | Ở kì sau, mỗi NST kép tách thành hai NST đơn đi về hai cực, trong tế bào có 4n = 92 NST đơn. 46 NST kép là trạng thái ở kì giữa. | Ở kì sau, mỗi NST kép tách thành hai NST đơn đi về hai cực, trong tế bào có \(4n = 92\) NST đơn. 46 NST kép là trạng thái ở kì giữa. |
