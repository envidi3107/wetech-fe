# Quy tắc viết HTML form để export DOCX ổn định

Tài liệu này dùng cho các form confirmation/declaration cần xuất DOCX qua server `export_docx`.
Mục tiêu là để HTML preview, PDF và DOCX giống nhau nhất có thể, tránh các lỗi đã gặp khi làm form hộ kinh doanh.

## Nguyên tắc chung

- Luôn dùng font `Times New Roman`, cỡ chữ `13pt` cho toàn bộ nội dung, kể cả tiêu đề nếu mẫu yêu cầu cùng cỡ chữ.
- Ưu tiên style rõ ràng ngay trên element quan trọng: `textAlign`, `fontWeight`, `fontStyle`, `textDecoration`, `margin`.
- Với nội dung cần in đậm/nghiêng/gạch chân, dùng tag thật:
  - In đậm: `<strong>...</strong>`
  - In nghiêng: `<em>...</em>`
  - Gạch chân: `<u>...</u>`
- Không chỉ dựa vào CSS class hoặc style kế thừa cho bold/italic/underline, vì khi normalize HTML để export DOCX có thể bị mất.
- Dữ liệu người dùng nhập không tự in đậm. Chỉ bọc `<strong>` quanh nhãn/cụm cần nhấn mạnh, không bọc cả dòng nếu trong dòng có dữ liệu động.

Ví dụ đúng:

```jsx
<p>
  <strong>Họ và tên:</strong> {fullName}
</p>
```

Ví dụ nên tránh:

```jsx
<p>
  <strong>Họ và tên: {fullName}</strong>
</p>
```

## Căn trái, giữa, phải

- Muốn căn giữa/căn phải trong DOCX thì đặt trực tiếp `textAlign` trên `p`, `td`, hoặc element chứa text.
- Có thể dùng class chuẩn:
  - `text-center`
  - `text-right`
- Không dựa vào `display: flex`, `justify-content`, `align-items` để căn text trong DOCX. Browser/PDF có thể đúng nhưng DOCX dễ lệch.

Ví dụ:

```jsx
<p className="text-center" style={{ textAlign: "center" }}>
  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
</p>
```

## Khoảng cách dòng và đoạn

- Dùng `marginTop`, `marginBottom`, hoặc `margin` trên `p` để tạo khoảng cách giữa các đoạn.
- Không thêm nhiều `<br />` hoặc đoạn rỗng ở đầu file, vì DOCX dễ sinh vài dòng trắng đầu trang.
- HTML gửi sang backend nên lấy phần body/content thật, không kèm wrapper thừa có khoảng trắng đầu.
- Với khoảng cách giữa tiêu đề và dòng "Kính gửi", dùng margin trên paragraph:

```jsx
<p style={{ textAlign: "center", margin: "12pt 0 0" }}>
  Kính gửi: ...
</p>
```

## Nhiều trường dữ liệu trên cùng một dòng

- Khi hai hoặc nhiều trường dữ liệu cần hiển thị trên cùng một dòng, giữ trường đầu trong luồng text bình thường và bọc các trường tiếp theo bằng component/class `InlineField` (`inlineField`).
- `InlineField` phải dùng `display: "inline-block"` và `marginLeft` rõ ràng, mặc định nên dùng `36pt`. Luồng export sẽ chuyển khoảng cách trái này thành khoảng trắng thật để DOCX không làm các trường dính vào nhau.
- Không dùng chuỗi `&nbsp;&nbsp;`, CSS `gap`, flex hoặc grid để tách các trường cùng dòng.
- Nếu một nội dung bắt buộc bắt đầu ở dòng mới, đặt nó trong một `<p>` riêng; không dùng `InlineField` và không chèn nhiều `<br />`.

Ví dụ:

```jsx
function InlineField({ children, marginLeft = "36pt" }) {
  return (
    <span
      className="inlineField"
      style={{ display: "inline-block", marginLeft, fontWeight: "inherit", fontStyle: "normal" }}
    >
      {children}
    </span>
  );
}

<p>
  Điện thoại: {phone}
  <InlineField>Số fax: {fax}</InlineField>
</p>
```

## Bảng

- Chỉ dùng bảng có border cho dữ liệu thật, ví dụ danh sách ngành nghề, thành viên, hàng hóa.
- Không để mọi `<table>` mặc định có border. Các bảng layout hoặc chữ ký phải dùng `no-border`.
- Với bảng dữ liệu có border, dùng class/inline style rõ ràng:
  - `borderCollapse: "collapse"`
  - `border: "1px solid #000"` trên `th`, `td`
- Với bảng không border:
  - class `no-border`
  - `border: "none"` trên `table`, `td`, `th` nếu cần
- Tránh bọc bảng dữ liệu trong container cũng có border, vì PDF có thể bị double border trên/dưới.
- Với ô bảng có giá trị số kèm đơn vị (`VNĐ`, `đồng`, `%`, ...), nếu giá trị bằng `0` thì chỉ hiển thị `0`, không kèm đơn vị. Nên dùng helper riêng cho ô bảng để không làm thay đổi câu văn ngoài bảng.

### Font chữ trong bảng

- Mặc định bảng trong form confirmation nên cùng font với nội dung chính: `Times New Roman`, `13pt`.
- Nếu bảng bị nhỏ hơn chữ xung quanh, kiểm tra CSS export chung trong `generateHtmlFile.js` (`table td`, `table th`, `table p`, `table span`, ...). Với bảng cần giữ cỡ chữ nội dung, đặt rule scoped trong CSS module:

```css
.table,
.table th,
.table td,
.table th > p,
.table td > p,
.table th span,
.table td span,
.table th strong,
.table td strong,
.table th em,
.table td em {
  font-size: var(--procedure-confirmation-font-size) !important;
  line-height: inherit !important;
}
```

- Nếu chỉ muốn PDF/DOCX nhỏ hơn nhưng HTML preview vẫn bình thường, không đặt `fontSize` inline trong component. Thêm class đánh dấu export-only, ví dụ `export-table-font-10`, rồi xử lý class đó trong `generateHtmlFile.js` cho cả CSS PDF và inline style Word.
- Tên class export-only nên mô tả rõ mục đích và chỉ dùng cho bảng thật sự cần khác preview.

Ví dụ bảng dữ liệu:

```jsx
<table className="bordered-table" style={{ width: "100%", borderCollapse: "collapse" }}>
  <tbody>
    <tr>
      <th style={{ border: "1px solid #000", textAlign: "center" }}>STT</th>
      <th style={{ border: "1px solid #000", textAlign: "center" }}>Tên</th>
    </tr>
    <tr>
      <td style={{ border: "1px solid #000", textAlign: "center" }}>1</td>
      <td style={{ border: "1px solid #000" }}>{name}</td>
    </tr>
  </tbody>
</table>
```

Ví dụ bảng layout không border:

```jsx
<table className="no-border" style={{ width: "100%", borderCollapse: "collapse" }}>
  <tbody>
    <tr>
      <td style={{ border: "none" }}>Nội dung trái</td>
      <td style={{ border: "none", textAlign: "right" }}>Nội dung phải</td>
    </tr>
  </tbody>
</table>
```

## Bảng một border bao ngoài

Với các khối như "Dân tộc, Quốc tịch, Nơi thường trú, Nơi ở hiện tại" nếu mẫu chỉ có một khung đen bao ngoài:

- Dùng một bảng/khối có class kiểu `single-border-table`.
- Chỉ đặt `border: 1px solid #000` cho bảng ngoài.
- Các `td` bên trong phải `border: none`.
- Không dùng bảng dữ liệu mặc định có border cho loại khối này.

## Width của cột trong DOCX

- Không phụ thuộc vào `width`, `minWidth`, `maxWidth` trên `td/th` khi xuất DOCX.
- Backend `export_docx` đang strip width khỏi `td/th` để tránh lỗi Turbodocx: `Invalid XML name: @w`.
- Nếu cần bố cục cột chắc chắn trong DOCX, ưu tiên:
  - dùng cấu trúc/class đã được backend/frontend normalize hỗ trợ;
  - hoặc thêm post-process DOCX riêng trong backend cho mẫu đặc biệt.
- Với preview HTML/PDF vẫn có thể dùng width trên `td`, nhưng đừng xem đó là bảo đảm cho DOCX.

## Ngắt trang và header bảng khi export

- Khi xuất PDF, `<thead>` có thể tự lặp lại ở mỗi trang nếu bảng dài. Nếu mẫu không muốn lặp tiêu đề bảng, CSS export trong `generateHtmlFile.js` phải có rule:

```css
.document-export-root table thead,
.document-export-root table tfoot {
  display: table-row-group !important;
}
```

- Khi xuất DOCX, không để row bảng bị khóa không được tách trang. Trong FE options gửi sang service và trong `export_docx` default, đặt:

```js
table: {
  row: {
    cantSplit: false,
  },
}
```

- Nếu thư viện vẫn sinh `<w:cantSplit />`, post-process `word/document.xml` để gỡ tag này. Nếu không, dòng bảng có nội dung dài có thể bị che/mất thay vì tự sang trang.
- Sau khi sửa service `export_docx`, nhớ restart service để export Word dùng code mới.
- Khi test form có bảng dài, luôn tạo dữ liệu thử có nhiều dòng và một ô có nội dung rất dài, rồi kiểm tra cả PDF và DOCX.

## Chữ ký

- Chữ ký nên dùng bảng `no-border`, không dùng `div flex`.
- Nếu chữ ký cần nằm bên phải, dùng bảng 2 cột:
  - cột trái là khoảng trống;
  - cột phải chứa nội dung chữ ký và căn giữa text trong cột.
- Cột chữ ký nên có class `signature-cell`; bảng nên có class `signature-table no-border`.
- Nội dung trong cột chữ ký phải đặt `textAlign: "center"` trên từng `p`.
- Không dùng một bảng 1 cột full width nếu muốn chữ ký sát phải, vì DOCX sẽ làm nội dung trông như bị căn giữa cả trang hoặc cột quá rộng.
- Với bảng có cột `Nơi nhận` bên trái và cột chữ ký bên phải, dùng class `signature-recipients-table no-border`, `tableLayout: "fixed"`, cột trái `45%` và cột phải `55%`.
- Không dùng `signature-table` cho bảng `Nơi nhận/chữ ký`, vì rule export của `signature-table` sẽ chuẩn hóa cột chữ ký bên phải thành `105mm` và làm cột `Nơi nhận` bị hẹp.

Ví dụ:

```jsx
<table className="signature-table no-border" style={{ width: "100%", borderCollapse: "collapse" }}>
  <tbody>
    <tr>
      <td className="signature-spacer" style={{ border: "none" }}>
        &nbsp;
      </td>
      <td className="signature-cell" style={{ border: "none", textAlign: "center" }}>
        <p className="text-center" style={{ textAlign: "center" }}>
          <strong>CHỦ HỘ KINH DOANH</strong>
        </p>
        <p className="text-center" style={{ textAlign: "center" }}>
          <em>(Ký và ghi họ tên)</em>
        </p>
      </td>
    </tr>
  </tbody>
</table>
```

## Checkbox

- Không dùng `<input type="checkbox">` để export DOCX.
- Dùng ký tự ô vuông trực tiếp hoặc component `CheckboxSymbol`.
- Nên dùng:
  - Checked: `☒`
  - Unchecked: `☐`
- Thêm khoảng cách thật sau checkbox bằng `{"\u00A0"}` hoặc text space, vì CSS `gap` trong flex không đáng tin khi qua DOCX.
- Với các lựa chọn nằm cùng dòng như `Có/Không`, bọc từng lựa chọn và checkbox của nó trong một `CheckboxOption`/`InlineField` riêng. Đặt `marginLeft` thật (`24pt` hoặc `36pt`) cho lựa chọn thứ hai trở đi; không viết trực tiếp `Có <Checkbox /> Không <Checkbox />` trong cùng một luồng text.
- Giữa nhãn và ô checkbox phải có `{"\\u00A0"}`; sau ký tự checkbox cũng nên có `{"\\u00A0"}` để nội dung kế tiếp không dính vào ô.
- Với câu hỏi dài, ví dụ "Có hoạt động theo dự án ... không?", đặt câu hỏi trong một `<p>` và nhóm lựa chọn `Có/Không` trong `<p>` kế tiếp.
- Không dùng `<ul>/<li>` cho nhóm lựa chọn checkbox xuất DOCX, nhất là khi nội dung đã có dấu `-` thủ công. Word có thể sinh thêm marker thành một dòng riêng và làm thừa dấu `-`.
- Mỗi lựa chọn một dòng nên dùng `<p>` riêng; nếu cần bố cục nhiều cột ổn định, dùng bảng `docx-choice-table no-border`.
- Dùng `{"\u00A0"}` giữa phần cuối của nhãn và checkbox để Word không đẩy riêng ô checkbox xuống dòng kế tiếp.
- Với danh sách mà mẫu yêu cầu dấu `-` đầu dòng, không dùng `listStyleType` tùy chỉnh trên `<ul>/<li>`. Dùng mỗi mục là một `<p>` và viết đúng một dấu `-` trong nội dung để Word không sinh marker phụ.
- Nếu ô vuông cần to hơn, tăng `fontSize` của symbol, ví dụ `15pt`.

Ví dụ:

```jsx
function CheckboxSymbol({ checked }) {
  return (
    <span
      className="checkbox-symbol"
      style={{
        display: "inline-block",
        fontSize: "15pt",
        marginRight: "5px",
        verticalAlign: "middle",
      }}
    >
      {checked ? "☒" : "☐"}
      {"\u00A0"}
    </span>
  );
}
```

## CSS nên tránh khi cần DOCX giống HTML

Không nên phụ thuộc vào các CSS sau cho nội dung chính:

- `display: flex`
- `display: grid`
- `position: absolute`
- `position: fixed`
- pseudo element `::before`, `::after`
- CSS variable phức tạp
- `@media`, `@font-face`, vendor CSS như `-webkit-*`
- shadow, transform, background phức tạp

DOCX không render như browser 100%, nên các layout quan trọng nên làm bằng `p`, `table`, `tr`, `td`, `th` và style đơn giản.

## Ảnh

- Nếu muốn ảnh ổn định trong DOCX, ưu tiên base64 data URI.
- Luôn set `width`, `height` rõ ràng cho ảnh.
- Không phụ thuộc vào ảnh remote nếu môi trường export có thể không truy cập mạng.

## Checklist trước khi áp dụng form mới

- Font toàn form là Times New Roman, cỡ 13pt.
- Tiêu đề/căn giữa dùng `textAlign: "center"` thật.
- Bold/italic/underline dùng `<strong>`, `<em>`, `<u>`.
- Dữ liệu người dùng không bị bọc trong `<strong>` ngoài ý muốn.
- Bảng dữ liệu có border rõ ràng; bảng layout/chữ ký có `no-border`.
- Font trong bảng đúng với mẫu: mặc định cùng cỡ nội dung chính; chỉ nhỏ hơn nếu có class/export rule riêng.
- Nếu bảng chỉ cần nhỏ khi export, HTML preview không bị gắn inline `fontSize` nhỏ.
- Không có container border bọc ngoài bảng dữ liệu gây double border PDF.
- PDF không lặp tiêu đề bảng ở trang sau nếu mẫu không yêu cầu.
- DOCX không bị che/mất nội dung khi dòng bảng dài hoặc bảng chạy qua nhiều trang.
- Ô số bằng `0` trong bảng không hiển thị thêm đơn vị.
- Checkbox dùng `☒/☐`, có khoảng cách thật sau ô vuông.
- Các trường dữ liệu cùng dòng dùng `InlineField`; không tách bằng chuỗi `&nbsp;` thủ công.
- Các lựa chọn checkbox cùng dòng được bọc riêng và có `marginLeft` thật; câu hỏi dài được tách khỏi dòng lựa chọn khi cần.
- Nhóm checkbox không dùng `<ul>/<li>`; không để list marker và dấu `-` thủ công cùng tồn tại.
- Bảng `Nơi nhận/chữ ký` dùng `signature-recipients-table` với tỷ lệ cột `45/55`.
- Chữ ký dùng `signature-table no-border`, 2 cột nếu cần nằm bên phải.
- Không có nhiều `<br />`, `<p>&nbsp;</p>` hoặc wrapper rỗng ở đầu file.
- Không dựa vào flex/grid/absolute cho bố cục quan trọng.
- Không dựa vào width trên `td/th` để điều khiển DOCX.
