import React from "react";
// Reuse styles from HoKinhDoanh
import styles from "@/components/Procedure/ProcedureTemplate/HoKinhDoanh/FormConfirmation/confirmation.module.css";
import { getToday, formatDate } from "@/utils/dateTimeUtils";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

function formatNumber(val) {
    if (!val) return "";
    const raw = String(val).replace(/[^0-9]/g, "");
    if (!raw) return "";
    return Number(raw).toLocaleString("vi-VN");
}

export default function GiayDeNghiDKHGDNConfirmation({ dataJson }) {
    if (!dataJson) return null;

    const {
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

    const today = getToday();

    let kinhGuiTemp = kinhGui;
    if (kinhGuiTemp.includes("xã")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.lastIndexOf("xã") + 3).trim();
    } else if (kinhGuiTemp.includes("phường")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.lastIndexOf("phường") + 6).trim();
    } else if (kinhGuiTemp.includes("thị trấn")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.lastIndexOf("thị trấn") + 7).trim();
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
            </div>
            <p className={styles.dateLocation}>
                <>
                    <CurrentDate />
                </>
            </p>
            <p className={styles.docTitle}>GIẤY ĐỀ NGHỊ ĐĂNG KÝ HỘ KINH DOANH</p>
            <p style={{ textAlign: "center", margin: "15px 0", fontSize: "var(--procedure-confirmation-font-size)" }}>
                Kính gửi: {kinhGui}
            </p>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Tôi là (ghi họ tên bằng chữ in hoa):{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        textTransform: "uppercase",
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {nguoiDaiDien_hoTen}
                </b>
            </p>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Sinh ngày:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {formatDate(nguoiDaiDien_ngaySinh)}
                </b>
            </p>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Giới tính:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {nguoiDaiDien_gioiTinh}
                </b>
            </p>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Số định danh cá nhân:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {nguoiDaiDien_cccd}
                </b>
            </p>
            <div className={styles.infoRow}>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Điện thoại (nếu có):{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nguoiDaiDien_phone}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Thư điện tử (nếu có):{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nguoiDaiDien_email}
                    </b>
                </p>
            </div>
            <p
                style={{
                    fontStyle: "italic",
                    fontSize: "var(--procedure-confirmation-font-size)",
                    margin: "4px 0 10px 16px",
                }}
            >
                Trường hợp việc kết nối giữa Cơ sở dữ liệu về đăng ký hộ kinh doanh với Cơ sở dữ liệu quốc gia về dân cư
                bị gián đoạn thì đề nghị kê khai thêm các thông tin cá nhân dưới đây:
            </p>
            <div className={styles.infoRow}>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Dân tộc:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nguoiDaiDien_danToc || "Kinh"}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Quốc tịch:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nguoiDaiDien_quocTich || "Việt Nam"}
                    </b>
                </p>
            </div>
            <p className={styles.infoLine} style={{ marginTop: "10px" }}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Nơi thường trú:
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {thuongTru_soNha}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Xã/Phường/Đặc khu: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {thuongTru_xa}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Tỉnh/Thành phố trực thuộc trung ương: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {thuongTru_tinh}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginTop: "10px" }}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Nơi ở hiện tại:
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {hienTai_soNha}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Xã/Phường/Đặc khu: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {hienTai_xa}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Tỉnh/Thành phố trực thuộc trung ương: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {hienTai_tinh}
                </b>
            </p>
            <p style={{ textAlign: "center", fontWeight: "bold", margin: "20px 0 10px" }}>
                Đăng ký hộ kinh doanh do tôi là chủ hộ với các nội dung sau:
            </p>
            <p className={styles.infoLine}>
                <b
                    className={`${styles.infoLabel} ${styles.heading1}`}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    1. Tên hộ kinh doanh:
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Tên hộ kinh doanh viết bằng tiếng Việt (ghi bằng chữ in hoa): HỘ KINH DOANH </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {hkd_tenVN?.toUpperCase()}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Tên hộ kinh doanh viết bằng tiếng nước ngoài (nếu có): </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {hkd_tenEN}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Tên hộ kinh doanh viết tắt (nếu có): </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {hkd_tenVietTat}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginTop: "10px" }}>
                <b
                    className={`${styles.infoLabel} ${styles.heading1}`}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    2. Trụ sở của hộ kinh doanh:
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {truSo_soNha}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Xã/Phường/Đặc khu: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {truSo_xa}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Tỉnh/Thành phố trực thuộc trung ương: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {truSo_tinh}
                </b>
            </p>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <>Điện thoại: </>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {truSo_phone}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <>Fax (nếu có): ..........</>
                </p>
            </div>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <>Thư điện tử (nếu có): </>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {truSo_email}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <>Website (nếu có): ..........</>
                </p>
            </div>
            <div className={styles.checkRow} style={{ marginLeft: "16px", marginTop: "6px" }}>
                <i
                    className={!truSo_soNha && !truSo_xa && !truSo_tinh ? styles.checkedBox : styles.uncheckedBox}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {!truSo_soNha && !truSo_xa && !truSo_tinh ? "X" : ""}
                </i>
                <>
                    Không kinh doanh tại trụ sở (đánh dấu X vào ô này nếu hộ kinh doanh không có địa điểm kinh doanh cố
                    định)
                </>
            </div>
            <p className={styles.infoLine} style={{ marginTop: "14px" }}>
                <b
                    className={`${styles.infoLabel} ${styles.heading1}`}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    3. Ngành, nghề kinh doanh:
                </b>
            </p>
            <div className={styles.tableContainer}>
                <table className={`${styles.table} single-border-table`}>
                    <thead>
                        <tr>
                            <th style={{ width: "40px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    STT
                                </p>
                            </th>
                            <th>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tên ngành
                                </p>
                            </th>
                            <th style={{ width: "100px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Mã ngành
                                </p>
                            </th>
                            <th style={{ width: "120px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ngành, nghề kinh doanh chính
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {nganhNgheList.length > 0 ? (
                            nganhNgheList.map((row, idx) => (
                                <tr key={idx}>
                                    <td style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {idx + 1}
                                        </p>
                                    </td>
                                    <td style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.tenNganh}
                                            {row.chiTiet && <span style={{ display: "block", marginTop: "4px" }}>{row.chiTiet}</span>}
                                        </p>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.maNganh}
                                        </p>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.laNganhChinh ? "X" : ""}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td style={{ textAlign: "center" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        1
                                    </p>
                                </td>
                                <td>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        ................................................
                                    </p>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p className={styles.infoLine} style={{ marginTop: "14px" }}>
                <b
                    className={`${styles.infoLabel} ${styles.heading1}`}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    4. Vốn kinh doanh:
                </b>
            </p>
            <p className={styles.infoLine}>
                <>Tổng số (bằng số, VNĐ): </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {formatNumber(vonKinhDoanh)} VNĐ{" "}
                </b>{" "}
                <b
                    className={styles.infoValue}
                    style={{
                        fontStyle: "italic",
                        fontWeight: "inherit",
                    }}
                >
                    ({vonKinhDoanh_bangChu})
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginTop: "10px" }}>
                <b
                    className={`${styles.infoLabel} ${styles.heading1}`}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    5. Thông tin đăng ký thuế:
                </b>
            </p>
            <p className={styles.infoLine}>
                <>5.1. Địa chỉ nhận thông báo thuế (chỉ kê khai nếu địa chỉ nhận thông báo thuế khác địa chỉ trụ sở):</>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {thue_soNha}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Xã/Phường/Đặc khu: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {thue_xa}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <>Tỉnh/Thành phố trực thuộc trung ương: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {thue_tinh}
                </b>
            </p>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <>Điện thoại (nếu có): </>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {thue_phone}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <>Thư điện tử (nếu có): </>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {thue_email}
                    </b>
                </p>
            </div>
            <p className={styles.infoLine} style={{ marginTop: "6px" }}>
                <>5.2. Ngày bắt đầu hoạt động: </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {formatDate(ngayBatDau)}
                </b>
            </p>
            <p className={styles.infoLine}>
                <>5.3. Tổng số lao động (dự kiến): </>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {soLaoDong}
                </b>
            </p>
            <p className={styles.infoLine} style={{ marginTop: "6px" }}>
                <>5.4. Phương pháp tính thuế GTGT (chọn 1 trong 2 phương pháp):</>
            </p>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <div className={styles.checkRow} style={{ marginRight: "40px" }}>
                    <i
                        className={isPPKeKhai ? styles.checkedBox : styles.uncheckedBox}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {isPPKeKhai ? "X" : ""}
                    </i>
                    <>Phương pháp kê khai</>
                </div>
                <div className={styles.checkRow}>
                    <i
                        className={isPPKhoan ? styles.checkedBox : styles.uncheckedBox}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {isPPKhoan ? "X" : ""}
                    </i>
                    <>Phương pháp khoán</>
                </div>
            </div>
            <p className={styles.infoLine} style={{ marginTop: "14px" }}>
                <b
                    className={`${styles.infoLabel} ${styles.heading1}`}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    6. Chủ thể thành lập hộ kinh doanh:{" "}
                </b>
                <>(đánh dấu X vào ô thích hợp)</>
            </p>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <div className={styles.checkRow} style={{ marginRight: "40px" }}>
                    <i
                        className={isCaNhan ? styles.checkedBox : styles.uncheckedBox}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {isCaNhan ? "X" : ""}
                    </i>
                    <>Cá nhân</>
                </div>
                <div className={styles.checkRow}>
                    <i
                        className={isGiaDinh ? styles.checkedBox : styles.uncheckedBox}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {isGiaDinh ? "X" : ""}
                    </i>
                    <>Các thành viên hộ gia đình</>
                </div>
            </div>
            <p className={styles.infoLine} style={{ marginTop: "14px" }}>
                <b
                    className={`${styles.infoLabel} ${styles.heading1}`}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    7. Thông tin về các thành viên hộ gia đình đăng ký hộ kinh doanh:
                </b>
            </p>
            <div className={styles.tableContainer}>
                <table className={`${styles.table} single-border-table`}>
                    <thead>
                        <tr>
                            <th style={{ width: "30px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    STT
                                </p>
                            </th>
                            <th>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Họ tên
                                </p>
                            </th>
                            <th style={{ width: "60px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ngày, tháng, năm sinh
                                </p>
                            </th>
                            <th>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Số định danh cá nhân
                                </p>
                            </th>
                            <th style={{ width: "40px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Giới tính
                                </p>
                            </th>
                            <th style={{ width: "50px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Quốc tịch
                                </p>
                            </th>
                            <th style={{ width: "40px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Dân tộc
                                </p>
                            </th>
                            <th>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Nơi thường trú
                                </p>
                            </th>
                            <th>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Nơi ở hiện tại
                                </p>
                            </th>
                            <th>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Chữ ký
                                </p>
                            </th>
                        </tr>
                        <tr style={{ backgroundColor: "#fff", color: "#000" }}>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    1
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    2
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    3
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    4
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    5
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    6
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    7
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    8
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    9
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10
                                </p>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {thanhVienList.length > 0 ? (
                            thanhVienList.map((row, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {idx + 1}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.hoTen}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {formatDate(row.ngaySinh)}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.cccd}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.gioiTinh}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.quocTich}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.danToc}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.thuongTru || ""}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.hienTai || ""}
                                        </p>
                                    </td>
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.chuKy || ""}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" style={{ height: "30px" }}></td>
                            </tr>
                        )}
                        {/* Empty rows to match paper style if no list or short list */}
                        {Array.from({ length: Math.max(0, 3 - thanhVienList.length) }).map((_, i) => (
                            <tr key={`empty-${i}`}>
                                <td>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {(thanhVienList.length || 0) + i + 1}
                                    </p>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className={styles.infoLine} style={{ marginTop: "14px" }}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Tôi xin cam kết:
                </b>
            </p>
            <div className={styles.closingText}>
                <p>
                    - Bản thân đồng ý chia sẻ thông tin cá nhân được lưu giữ tại Cơ sở dữ liệu quốc gia về dân cư cho Cơ
                    quan đăng ký kinh doanh cấp xã, Cơ quan quản lý nhà nước về đăng ký kinh doanh để phục vụ công tác
                    quản lý nhà nước về đăng ký hộ kinh doanh theo quy định;
                </p>
                <p>
                    - Bản thân không thuộc diện pháp luật cấm kinh doanh; không đồng thời là chủ hộ kinh doanh, thành
                    viên hộ gia đình đăng ký hộ kinh doanh khác; không là chủ doanh nghiệp tư nhân;
                </p>
                <p>
                    - Trụ sở thuộc quyền sử dụng hợp pháp của hộ kinh doanh và được sử dụng đúng mục đích theo quy định
                    của pháp luật (hộ kinh doanh chỉ cam kết trong trường hợp kinh doanh tại trụ sở);
                </p>
                <p>
                    - Hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung thực của nội dung
                    đăng ký trên.
                </p>
            </div>
            <div className={styles.signatureRow}>
                <div className={styles.signatureBlock}>
                    <p className={styles.signatureTitle}>CHỦ HỘ KINH DOANH</p>
                    <p className={styles.signatureNote}>(Ký và ghi họ tên)</p>
                </div>
            </div>
        </div>
    );
}
