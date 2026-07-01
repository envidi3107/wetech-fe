import React from "react";
import { formatDate } from "@/utils/dateTimeUtils";

const FONT_FAMILY = "'Times New Roman', Times, serif";
const DOCUMENT_FONT_SIZE = "14pt";
const TABLE_FONT_SIZE = "11pt";

const textStyle = {
    fontFamily: FONT_FAMILY,
    fontSize: DOCUMENT_FONT_SIZE,
    lineHeight: 1.6,
    color: "#000",
};

const tableTextStyle = {
    fontFamily: FONT_FAMILY,
    fontSize: TABLE_FONT_SIZE,
    lineHeight: 1.25,
    color: "#000",
};

const inlineStyles = {
    page: {
        ...textStyle,
        padding: "40px 60px",
        background: "#fff",
        maxWidth: "820px",
        margin: "0 auto",
        userSelect: "none",
    },
    header: {
        textAlign: "center",
        marginBottom: "24px",
    },
    headerTitle: {
        ...textStyle,
        fontWeight: 700,
        textTransform: "uppercase",
        margin: 0,
    },
    headerSubtitle: {
        ...textStyle,
        textDecoration: "underline",
        margin: "4px 0 0",
        fontWeight: 700,
    },
    dateLocation: {
        ...textStyle,
        textAlign: "right",
        fontStyle: "italic",
        margin: "16px 0",
    },
    docTitle: {
        ...textStyle,
        textAlign: "center",
        fontWeight: 700,
        textTransform: "uppercase",
        margin: "20px 0 4px",
    },
    centerLine: {
        ...textStyle,
        textAlign: "center",
        margin: "15px 0",
    },
    boldCenterLine: {
        ...textStyle,
        textAlign: "center",
        fontWeight: 700,
        margin: "20px 0 10px",
    },
    infoLine: {
        ...textStyle,
        margin: "0 0 6px",
    },
    infoLabel: {
        ...textStyle,
        whiteSpace: "nowrap",
    },
    heading: {
        ...textStyle,
        fontWeight: 700,
        whiteSpace: "nowrap",
    },
    infoValue: {
        ...textStyle,
        color: "#222",
    },
    infoRow: {
        ...textStyle,
        display: "flex",
        flexWrap: "wrap",
        gap: "4px 32px",
        marginBottom: "6px",
    },
    infoItem: {
        ...textStyle,
        display: "flex",
        gap: "4px",
        minWidth: "200px",
        margin: "0 0 6px",
    },
    infoBorder: {
        ...textStyle,
        border: "1px solid #000",
        padding: "4px 8px",
    },
    italicParagraph: {
        ...textStyle,
        fontStyle: "italic",
        margin: "4px 0 10px 16px",
    },
    tableContainer: {
        width: "100%",
        overflowX: "auto",
        border: "1px solid #aaa",
        borderRadius: "2px",
        margin: "10px 0",
    },
    table: {
        ...tableTextStyle,
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        ...tableTextStyle,
        border: "1px solid #aaa",
        padding: "6px 10px",
        verticalAlign: "top",
        backgroundColor: "#fff",
        fontWeight: 600,
        textAlign: "center",
    },
    td: {
        ...tableTextStyle,
        border: "1px solid #aaa",
        padding: "6px 10px",
        verticalAlign: "top",
        textAlign: "left",
    },
    tdCenter: {
        textAlign: "center",
    },
    tableHeaderParagraph: {
        ...tableTextStyle,
        fontWeight: 600,
        textAlign: "center",
        margin: 0,
    },
    tableParagraph: {
        ...tableTextStyle,
        margin: 0,
    },
    checkRow: {
        ...textStyle,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
    },
    checkedBox: {
        ...textStyle,
        display: "inline-block",
        width: "16px",
        height: "16px",
        border: "1px solid #333",
        textAlign: "center",
        lineHeight: "16px",
        fontWeight: 700,
        fontStyle: "normal",
    },
    uncheckedBox: {
        display: "inline-block",
        width: "16px",
        height: "16px",
        border: "1px solid #333",
        fontStyle: "normal",
    },
    closingText: {
        ...textStyle,
        margin: "16px 0",
        lineHeight: 1.8,
    },
    closingParagraph: {
        ...textStyle,
        margin: "0 0 6px",
        lineHeight: 1.8,
    },
    signatureRow: {
        ...textStyle,
        width: "100%",
        textAlign: "right",
        marginTop: "24px",
    },
    signatureBlock: {
        ...textStyle,
        display: "inline-block",
        width: "70mm",
        minWidth: "58mm",
        maxWidth: "70mm",
        textAlign: "center",
        verticalAlign: "top",
    },
    signatureTitle: {
        ...textStyle,
        fontWeight: 700,
        textTransform: "uppercase",
        margin: "0 0 4px",
    },
    signatureNote: {
        ...textStyle,
        fontStyle: "italic",
        margin: 0,
    },
    signatureName: {
        ...textStyle,
        fontWeight: 700,
        textTransform: "uppercase",
        margin: "20px 0 0",
    },
};

function mergeStyles(...styles) {
    return Object.assign({}, ...styles.filter(Boolean));
}

function Th({ children, style, ...props }) {
    return (
        <th {...props} style={mergeStyles(inlineStyles.th, style)}>
            <p style={inlineStyles.tableHeaderParagraph}>{children}</p>
        </th>
    );
}

function Td({ children, style, center = false, raw = false, ...props }) {
    return (
        <td {...props} style={mergeStyles(inlineStyles.td, center && inlineStyles.tdCenter, style)}>
            {raw ? (
                children
            ) : (
                <p style={mergeStyles(inlineStyles.tableParagraph, center && inlineStyles.tdCenter)}>{children}</p>
            )}
        </td>
    );
}

function formatNumber(val) {
    if (!val) return "";
    const raw = String(val).replace(/[^0-9]/g, "");
    if (!raw) return "";
    return Number(raw).toLocaleString("vi-VN");
}

export default function GiayDeNghi({ dataJson }) {
    if (!dataJson) return null;

    const {
        chuKy_ten = "",
        chuKy_hoTen = "",
        nguoiDaiDien_hoTen = "",
        nguoiDaiDien_ngaySinh = "",
        nguoiDaiDien_gioiTinh = "",
        nguoiDaiDien_cccd = "",
        nguoiDaiDien_phone = "",
        nguoiDaiDien_email = "",
        nguoiDaiDien_danToc = "",
        nguoiDaiDien_quocTich = "",

        thuongTru_soNha = "",
        thuongTru_xa = "",
        thuongTru_tinh = "",

        hienTai_soNha = "",
        hienTai_xa = "",
        hienTai_tinh = "",

        hkd_tenVN = "",
        hkd_tenEN = "",
        hkd_tenVietTat = "",

        truSo_soNha = "",
        truSo_xa = "",
        truSo_tinh = "",
        truSo_phone = "",
        truSo_email = "",

        nganhNgheList = [],
        vonKinhDoanh = "",
        vonKinhDoanh_bangChu = "",

        thue_soNha = "",
        thue_xa = "",
        thue_tinh = "",
        thue_phone = "",
        thue_email = "",

        ngayBatDau = "",
        soLaoDong = "",
        vatMethod = "khoan",
        subject = "ca_nhan",

        thanhVienList = [],
        kinhGui = "",
    } = dataJson;

    const isPPKeKhai = vatMethod === "ke_khai";
    const isPPKhoan = vatMethod === "khoan";
    const isCaNhan = subject === "ca_nhan";
    const isGiaDinh = subject === "thanh_vien_gd";

    let kinhGuiTemp = kinhGui;
    if (kinhGuiTemp.includes("xã")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.indexOf("xã") + 3).trim();
    } else if (kinhGuiTemp.includes("Phường") || kinhGuiTemp.includes("phường")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.indexOf("Phường") + 6).trim();
    } else if (kinhGuiTemp.includes("thị trấn")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.indexOf("thị trấn") + 7).trim();
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const datePrefix = kinhGuiTemp || ".........";
    const currentDateLabel = `${datePrefix}, ngày ${day} tháng ${month} năm ${year}`;

    return (
        <div style={inlineStyles.page}>
            <div style={inlineStyles.header}>
                <h2 style={inlineStyles.headerTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 style={inlineStyles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
            </div>
            <p style={inlineStyles.dateLocation}>{currentDateLabel}</p>
            <p style={inlineStyles.docTitle}>GIẤY ĐỀ NGHỊ ĐĂNG KÝ HỘ KINH DOANH</p>
            <p style={inlineStyles.centerLine}>Kính gửi: {kinhGui}</p>
            <p style={inlineStyles.infoLine}>
                Tôi là (ghi họ tên bằng chữ in hoa): {(nguoiDaiDien_hoTen || "").toUpperCase()}
            </p>
            <p style={inlineStyles.infoLine}>Sinh ngày: {formatDate(nguoiDaiDien_ngaySinh)}</p>
            <p style={inlineStyles.infoLine}>Giới tính: {nguoiDaiDien_gioiTinh}</p>
            <p style={inlineStyles.infoLine}>Số định danh cá nhân: {nguoiDaiDien_cccd}</p>
            <div style={inlineStyles.infoRow}>
                <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>Điện thoại (nếu có): {nguoiDaiDien_phone}</p>
                <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>
                    Thư điện tử (nếu có): {nguoiDaiDien_email}
                </p>
            </div>
            <p style={inlineStyles.italicParagraph}>
                Trường hợp việc kết nối giữa Cơ sở dữ liệu về đăng ký hộ kinh doanh với Cơ sở dữ liệu quốc gia về dân cư
                bị gián đoạn thì đề nghị kê khai thêm các thông tin cá nhân dưới đây:
            </p>
            <div style={inlineStyles.infoBorder}>
                <div style={inlineStyles.infoRow}>
                    <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>
                        Dân tộc: {nguoiDaiDien_danToc || "Kinh"}
                    </p>
                    <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>
                        Quốc tịch: {nguoiDaiDien_quocTich || "Việt Nam"}
                    </p>
                </div>

                <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "10px" })}>Nơi thường trú:</p>
                <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                    Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {thuongTru_soNha}
                </p>
                <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                    Xã/Phường/Đặc khu: {thuongTru_xa}
                </p>
                <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                    Tỉnh/Thành phố trực thuộc trung ương: {thuongTru_tinh}
                </p>

                <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "10px" })}>Nơi ở hiện tại:</p>
                <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                    Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {hienTai_soNha}
                </p>
                <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                    Xã/Phường/Đặc khu: {hienTai_xa}
                </p>
                <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                    Tỉnh/Thành phố trực thuộc trung ương: {hienTai_tinh}
                </p>
            </div>
            <p style={inlineStyles.boldCenterLine}>Đăng ký hộ kinh doanh do tôi là chủ hộ với các nội dung sau:</p>
            <p style={inlineStyles.infoLine}>
                <strong style={inlineStyles.heading}>1. Tên hộ kinh doanh:</strong>
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                Tên hộ kinh doanh viết bằng tiếng Việt (ghi bằng chữ in hoa): HỘ KINH DOANH {hkd_tenVN?.toUpperCase()}
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                Tên hộ kinh doanh viết bằng tiếng nước ngoài (nếu có): {hkd_tenEN}
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                Tên hộ kinh doanh viết tắt (nếu có): {hkd_tenVietTat}
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "10px" })}>
                <strong style={inlineStyles.heading}>2. Trụ sở của hộ kinh doanh:</strong>
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {truSo_soNha}
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>Xã/Phường/Đặc khu: {truSo_xa}</p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                Tỉnh/Thành phố trực thuộc trung ương: {truSo_tinh}
            </p>
            <div style={mergeStyles(inlineStyles.infoRow, { marginLeft: "16px" })}>
                <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>Điện thoại: {truSo_phone}</p>
                <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>Fax (nếu có): ..........</p>
            </div>
            <div style={mergeStyles(inlineStyles.infoRow, { marginLeft: "16px" })}>
                <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>Thư điện tử (nếu có): {truSo_email}</p>
                <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>Website (nếu có): ..........</p>
            </div>
            <p style={mergeStyles(inlineStyles.checkRow, { marginLeft: "16px", marginTop: "6px" })}>
                <i
                    style={
                        !truSo_soNha && !truSo_xa && !truSo_tinh ? inlineStyles.checkedBox : inlineStyles.uncheckedBox
                    }
                >
                    {!truSo_soNha && !truSo_xa && !truSo_tinh ? "X" : ""}
                </i>
                Không kinh doanh tại trụ sở (đánh dấu X vào ô này nếu hộ kinh doanh không có địa điểm kinh doanh cố
                định)
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "14px" })}>
                <strong style={inlineStyles.heading}>3. Ngành, nghề kinh doanh:</strong>
            </p>
            <div style={inlineStyles.tableContainer}>
                <table style={inlineStyles.table}>
                    <thead>
                        <tr>
                            <Th style={{ width: "40px" }}>STT</Th>
                            <Th>Tên ngành</Th>
                            <Th style={{ width: "100px" }}>Mã ngành</Th>
                            <Th style={{ width: "120px" }}>Ngành, nghề kinh doanh chính</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {nganhNgheList.length > 0 &&
                            nganhNgheList.map((row, idx) => (
                                <tr key={idx}>
                                    <Td center>{idx + 1}</Td>
                                    <Td raw>
                                        <p style={inlineStyles.tableParagraph}>{row.tenNganh}</p>
                                        {row.chiTiet && (
                                            <p
                                                style={{
                                                    ...tableTextStyle,
                                                    margin: 0,
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {row.chiTiet}
                                            </p>
                                        )}
                                    </Td>
                                    <Td center>{row.maNganh}</Td>
                                    <Td center>{row.laNganhChinh ? "X" : ""}</Td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "14px" })}>
                <strong style={inlineStyles.heading}>4. Vốn kinh doanh:</strong>
            </p>
            <p style={inlineStyles.infoLine}>
                Tổng số (bằng số): {formatNumber(vonKinhDoanh)} VNĐ
                <em style={mergeStyles(inlineStyles.infoValue, { fontStyle: "italic" })}>({vonKinhDoanh_bangChu})</em>
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "10px" })}>
                <strong style={inlineStyles.heading}>5. Thông tin đăng ký thuế:</strong>
            </p>
            <p style={inlineStyles.infoLine}>
                5.1. Địa chỉ nhận thông báo thuế (chỉ kê khai nếu địa chỉ nhận thông báo thuế khác địa chỉ trụ sở):
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {thue_soNha}
            </p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>Xã/Phường/Đặc khu: {thue_xa}</p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginLeft: "16px" })}>
                Tỉnh/Thành phố trực thuộc trung ương: {thue_tinh}
            </p>
            <div style={mergeStyles(inlineStyles.infoRow, { marginLeft: "16px" })}>
                <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>Điện thoại (nếu có): {thue_phone}</p>
                <p style={mergeStyles(inlineStyles.infoItem, { flex: 1 })}>Thư điện tử (nếu có): {thue_email}</p>
            </div>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "6px" })}>
                5.2. Ngày bắt đầu hoạt động: {formatDate(ngayBatDau)}
            </p>
            <p style={inlineStyles.infoLine}>5.3. Tổng số lao động (dự kiến): {soLaoDong}</p>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "6px" })}>
                5.4. Phương pháp tính thuế GTGT (chọn 1 trong 2 phương pháp):
            </p>
            <div style={mergeStyles(inlineStyles.infoRow, { marginLeft: "16px" })}>
                <p style={mergeStyles(inlineStyles.checkRow, { marginRight: "40px" })}>
                    <i style={isPPKeKhai ? inlineStyles.checkedBox : inlineStyles.uncheckedBox}>
                        {isPPKeKhai ? "X" : ""}
                    </i>
                    Phương pháp kê khai
                </p>
                <p style={inlineStyles.checkRow}>
                    <i style={isPPKhoan ? inlineStyles.checkedBox : inlineStyles.uncheckedBox}>
                        {isPPKhoan ? "X" : ""}
                    </i>
                    Phương pháp khoán
                </p>
            </div>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "14px" })}>
                <strong style={inlineStyles.heading}>6. Chủ thể thành lập hộ kinh doanh: </strong>
                (đánh dấu X vào ô thích hợp)
            </p>
            <div style={mergeStyles(inlineStyles.infoRow, { marginLeft: "16px" })}>
                <p style={mergeStyles(inlineStyles.checkRow, { marginRight: "40px" })}>
                    <i style={isCaNhan ? inlineStyles.checkedBox : inlineStyles.uncheckedBox}>{isCaNhan ? "X" : ""}</i>
                    Cá nhân
                </p>
                <p style={inlineStyles.checkRow}>
                    <i style={isGiaDinh ? inlineStyles.checkedBox : inlineStyles.uncheckedBox}>
                        {isGiaDinh ? "X" : ""}
                    </i>
                    Các thành viên hộ gia đình
                </p>
            </div>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "14px" })}>
                <strong style={inlineStyles.heading}>
                    7. Thông tin về các thành viên hộ gia đình đăng ký hộ kinh doanh:
                </strong>
            </p>
            <div style={inlineStyles.tableContainer}>
                <table style={inlineStyles.table}>
                    <thead>
                        <tr>
                            <Th style={{ width: "30px" }}>STT</Th>
                            <Th>Họ tên</Th>
                            <Th style={{ width: "60px" }}>Ngày, tháng, năm sinh</Th>
                            <Th>Số định danh cá nhân</Th>
                            <Th style={{ width: "40px" }}>Giới tính</Th>
                            <Th style={{ width: "50px" }}>Quốc tịch</Th>
                            <Th style={{ width: "40px" }}>Dân tộc</Th>
                            <Th>Nơi thường trú</Th>
                            <Th>Nơi ở hiện tại</Th>
                            <Th>Chữ ký</Th>
                        </tr>
                        <tr style={{ backgroundColor: "#fff", color: "#000" }}>
                            <Td center>1</Td>
                            <Td center>2</Td>
                            <Td center>3</Td>
                            <Td center>4</Td>
                            <Td center>5</Td>
                            <Td center>6</Td>
                            <Td center>7</Td>
                            <Td center>8</Td>
                            <Td center>9</Td>
                            <Td center>10</Td>
                        </tr>
                    </thead>
                    <tbody>
                        {thanhVienList.length > 0 ? (
                            thanhVienList.map((row, idx) => (
                                <tr key={idx}>
                                    <Td center>{idx + 1}</Td>
                                    <Td>{row.hoTen}</Td>
                                    <Td>{formatDate(row.ngaySinh)}</Td>
                                    <Td>{row.cccd}</Td>
                                    <Td>{row.gioiTinh}</Td>
                                    <Td>{row.quocTich}</Td>
                                    <Td>{row.danToc}</Td>
                                    <Td>{row.thuongTru || ""}</Td>
                                    <Td>{row.hienTai || ""}</Td>
                                    <Td>{row.chuKy || ""}</Td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <Td colSpan="10" style={{ height: "30px" }}></Td>
                            </tr>
                        )}
                        {/* Empty rows to match paper style if no list or short list */}
                        {Array.from({ length: Math.max(0, 3 - thanhVienList.length) }).map((_, i) => (
                            <tr key={`empty-${i}`}>
                                <Td center>{(thanhVienList.length || 0) + i + 1}</Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p style={mergeStyles(inlineStyles.infoLine, { marginTop: "14px" })}>Tôi xin cam kết:</p>
            <div style={inlineStyles.closingText}>
                <p style={inlineStyles.closingParagraph}>
                    - Bản thân đồng ý chia sẻ thông tin cá nhân được lưu giữ tại Cơ sở dữ liệu quốc gia về dân cư cho Cơ
                    quan đăng ký kinh doanh cấp xã, Cơ quan quản lý nhà nước về đăng ký kinh doanh để phục vụ công tác
                    quản lý nhà nước về đăng ký hộ kinh doanh theo quy định;
                </p>
                <p style={inlineStyles.closingParagraph}>
                    - Bản thân không thuộc diện pháp luật cấm kinh doanh; không đồng thời là chủ hộ kinh doanh, thành
                    viên hộ gia đình đăng ký hộ kinh doanh khác; không là chủ doanh nghiệp tư nhân;
                </p>
                <p style={inlineStyles.closingParagraph}>
                    - Trụ sở thuộc quyền sử dụng hợp pháp của hộ kinh doanh và được sử dụng đúng mục đích theo quy định
                    của pháp luật (hộ kinh doanh chỉ cam kết trong trường hợp kinh doanh tại trụ sở);
                </p>
                <p style={inlineStyles.closingParagraph}>
                    - Hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung thực của nội dung
                    đăng ký trên.
                </p>
            </div>
            <div style={inlineStyles.signatureRow}>
                <div style={inlineStyles.signatureBlock}>
                    <p style={inlineStyles.signatureTitle}>CHỦ HỘ KINH DOANH</p>
                    <p style={inlineStyles.signatureNote}>(Ký và ghi họ tên)</p>
                    <p style={inlineStyles.signatureName}>{chuKy_ten}</p>
                    <p style={inlineStyles.signatureName}>{chuKy_hoTen}</p>
                </div>
            </div>
        </div>
    );
}
