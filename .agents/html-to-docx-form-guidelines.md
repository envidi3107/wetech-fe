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

## Chữ ký

- Chữ ký nên dùng bảng `no-border`, không dùng `div flex`.
- Nếu chữ ký cần nằm bên phải, dùng bảng 2 cột:
  - cột trái là khoảng trống;
  - cột phải chứa nội dung chữ ký và căn giữa text trong cột.
- Cột chữ ký nên có class `signature-cell`; bảng nên có class `signature-table no-border`.
- Nội dung trong cột chữ ký phải đặt `textAlign: "center"` trên từng `p`.
- Không dùng một bảng 1 cột full width nếu muốn chữ ký sát phải, vì DOCX sẽ làm nội dung trông như bị căn giữa cả trang hoặc cột quá rộng.

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
- Không có container border bọc ngoài bảng dữ liệu gây double border PDF.
- Checkbox dùng `☒/☐`, có khoảng cách thật sau ô vuông.
- Chữ ký dùng `signature-table no-border`, 2 cột nếu cần nằm bên phải.
- Không có nhiều `<br />`, `<p>&nbsp;</p>` hoặc wrapper rỗng ở đầu file.
- Không dựa vào flex/grid/absolute cho bố cục quan trọng.
- Không dựa vào width trên `td/th` để điều khiển DOCX.
