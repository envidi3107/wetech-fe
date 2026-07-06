import React from "react";
import styles from "./confirmation.module.css";
import { formatDate } from "@/utils/dateTimeUtils";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

const DOCUMENT_TEXT_STYLE = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "13pt",
    lineHeight: 1.6,
    color: "#000",
};

const SECTION_TITLE_STYLE = {
    ...DOCUMENT_TEXT_STYLE,
    textDecoration: "underline",
    fontWeight: "bold",
};

const signatureTableStyle = {
    ...DOCUMENT_TEXT_STYLE,
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
};

const signatureCellStyle = {
    ...DOCUMENT_TEXT_STYLE,
    width: "50%",
    border: "none",
    textAlign: "center",
    verticalAlign: "top",
    padding: "0 40px",
};

export default function GiayUyQuyen({ dataJson }) {
    if (!dataJson) return null;

    const {
        uyQuyen_hoTen = "",
        uyQuyen_ngaySinh = "",
        uyQuyen_gioiTinh = "",
        uyQuyen_cccd = "",
        uyQuyen_phone = "",
        uyQuyen_email = "",
        uyQuyen_soNha = "",
        uyQuyen_xa = "",
        uyQuyen_tinh = "",

        chuHo_ten = "",
        chuHo_xa_phuong = "",
        kinhGuiPrefix = "Phòng Kinh tế, Hạ tầng và Đô thị Phường ",
    } = dataJson;

    const benB = {
        hoTen: dataJson.nhanUyQuyen_hoTen || "",
        gioiTinh: dataJson.nhanUyQuyen_gioiTinh || "",
        ngaySinh: formatDate(dataJson.nhanUyQuyen_ngaySinh || ""),
        danToc: dataJson.nhanUyQuyen_danToc || "",
        quocTich: dataJson.nhanUyQuyen_quocTich || "",
        cccd: dataJson.nhanUyQuyen_cccd || "",
        thuongTru: [
            dataJson.nhanUyQuyen_thuongTru_soNha,
            dataJson.nhanUyQuyen_thuongTru_xa,
            dataJson.nhanUyQuyen_thuongTru_tinh,
        ]
            .filter(Boolean)
            .join(", "),
        lienLac: [
            dataJson.nhanUyQuyen_lienLac_soNha,
            dataJson.nhanUyQuyen_lienLac_xa,
            dataJson.nhanUyQuyen_lienLac_tinh,
        ]
            .filter(Boolean)
            .join(", "),
        phone: dataJson.nhanUyQuyen_phone || "",
        email: dataJson.nhanUyQuyen_email || "",
    };

    return (
        <div className={styles.page} style={DOCUMENT_TEXT_STYLE}>
            <div className={styles.header}>
                <h2 className={`${styles.headerTitle} text-center`} style={{ ...DOCUMENT_TEXT_STYLE, textAlign: "center", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </h2>
                <p className={`${styles.headerSubtitle} text-center`} style={{ ...DOCUMENT_TEXT_STYLE, textAlign: "center", textDecoration: "underline", margin: "4px 0 0", fontWeight: 700 }}>
                    <strong>
                        <u>Độc lập - Tự do - Hạnh phúc</u>
                    </strong>
                </p>
            </div>
            <h1 className={`${styles.docTitle} text-center`} style={{ ...DOCUMENT_TEXT_STYLE, textAlign: "center", fontWeight: 700, textTransform: "uppercase", margin: "30px 0" }}>
                GIẤY UỶ QUYỀN
            </h1>
            <p className={styles.sectionTitle} style={SECTION_TITLE_STYLE}>
                <strong>
                    <u>BÊN ỦY QUYỀN (BÊN A):</u>
                </strong>
            </p>
            <table className="no-border" style={{ width: "100%", marginBottom: "8px" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "60%", verticalAlign: "top" }}>
                            <p className={styles.infoItem} style={{ margin: 0 }}>
                                <b
                                    className={styles.infoLabel}
                                    style={{
                                        fontWeight: "inherit",
                                        fontStyle: "normal",
                                    }}
                                >
                                    Họ và tên:{" "}
                                </b>
                                <b
                                    className={styles.infoValue}
                                    style={{
                                        fontWeight: "inherit",
                                        fontStyle: "normal",
                                    }}
                                >
                                    {uyQuyen_hoTen}
                                </b>
                            </p>
                        </td>
                        <td style={{ width: "40%", verticalAlign: "top" }}>
                            <p className={styles.infoItem} style={{ margin: 0 }}>
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
                                    {uyQuyen_gioiTinh}
                                </b>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p style={{ margin: "8px 0" }}>
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
                    {formatDate(uyQuyen_ngaySinh)}
                </b>
            </p>
            <p style={{ margin: "8px 0" }}>
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
                    {uyQuyen_cccd}
                </b>
            </p>
            <p style={{ margin: "8px 0" }}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Địa chỉ liên lạc:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {[uyQuyen_soNha, uyQuyen_xa, uyQuyen_tinh].filter(Boolean).join(", ")}
                </b>
            </p>
            <table className="no-border" style={{ width: "100%", marginBottom: "8px" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "50%", verticalAlign: "top" }}>
                            <p style={{ margin: 0 }}>
                                Số điện thoại: <b>{uyQuyen_phone}</b>
                            </p>
                        </td>
                        {uyQuyen_email && (
                            <td style={{ width: "50%", verticalAlign: "top" }}>
                                <p style={{ margin: 0 }}>
                                    Email: <b>{uyQuyen_email}</b>
                                </p>
                            </td>
                        )}
                    </tr>
                </tbody>
            </table>
            <p className={styles.infoLine} style={{ marginTop: "10px", lineHeight: "1.8" }}>
                <>Là chủ hộ kinh doanh đăng ký thành lập HỘ KINH DOANH </>
                <>{chuHo_ten} {" "}</>
                <>tại {kinhGuiPrefix.trim()} </>
                <>{chuHo_xa_phuong}</>
            </p>
            <p
                className={styles.sectionTitle}
                style={{ ...SECTION_TITLE_STYLE, marginTop: "20px" }}
            >
                <strong>
                    <u>BÊN NHẬN UỶ QUYỀN (BÊN B):</u>
                </strong>
            </p>
            <table className="no-border" style={{ width: "100%", marginBottom: "8px" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "60%", verticalAlign: "top" }}>
                            <p className={styles.infoItem} style={{ margin: 0 }}>
                                <b
                                    className={styles.infoLabel}
                                    style={{
                                        fontWeight: "inherit",
                                        fontStyle: "normal",
                                    }}
                                >
                                    Họ và tên:{" "}
                                </b>
                                <b
                                    className={styles.infoValue}
                                    style={{
                                        textTransform: "uppercase",
                                        fontWeight: "inherit",
                                        fontStyle: "normal",
                                    }}
                                >
                                    {benB.hoTen}
                                </b>
                            </p>
                        </td>
                        <td style={{ width: "40%", verticalAlign: "top" }}>
                            <p className={styles.infoItem} style={{ margin: 0 }}>
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
                                    {benB.gioiTinh}
                                </b>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className="no-border" style={{ width: "100%", marginBottom: "8px" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "40%", verticalAlign: "top" }}>
                            <p className={styles.infoItem} style={{ margin: 0 }}>
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
                                    {benB.ngaySinh}
                                </b>
                            </p>
                        </td>
                        <td style={{ width: "30%", verticalAlign: "top" }}>
                            <p className={styles.infoItem} style={{ margin: 0 }}>
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
                                    {benB.danToc}
                                </b>
                            </p>
                        </td>
                        <td style={{ width: "30%", verticalAlign: "top" }}>
                            <p className={styles.infoItem} style={{ margin: 0 }}>
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
                                    {benB.quocTich}
                                </b>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p style={{ margin: "8px 0" }}>
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
                    {benB.cccd}
                </b>
            </p>
            <p style={{ margin: "8px 0" }}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Địa chỉ thường trú:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {benB.thuongTru}
                </b>
            </p>
            <p style={{ margin: "8px 0" }}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Địa chỉ liên lạc:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {benB.lienLac}
                </b>
            </p>
            <table className="no-border" style={{ width: "100%", marginBottom: "8px" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "50%", verticalAlign: "top" }}>
                            <p style={{ margin: 0 }}>
                                Số điện thoại: <b>{benB.phone}</b>
                            </p>
                        </td>
                        {benB.email && (
                            <td style={{ width: "50%", verticalAlign: "top" }}>
                                <p style={{ margin: 0 }}>
                                    Email: <b>{benB.email}</b>
                                </p>
                            </td>
                        )}
                    </tr>
                </tbody>
            </table>
            <p
                className={styles.sectionTitle}
                style={{ ...SECTION_TITLE_STYLE, marginTop: "20px" }}
            >
                <strong>
                    <u>NỘI DUNG ỦY QUYỀN:</u>
                </strong>
            </p>
            <p className={styles.infoLine} style={{ marginBottom: "10px" }}>
                Bên A ủy quyền cho bên B thực hiện các công việc sau đây:
            </p>
            <p className={styles.infoLine} style={{ lineHeight: "1.8" }}>
                Nộp hồ sơ và nhận kết quả thủ tục đăng ký thành lập HỘ KINH DOANH <>{chuHo_ten}</> tại{" "}
                {kinhGuiPrefix.trim()} <>{chuHo_xa_phuong}</>
            </p>
            <p
                className={styles.sectionTitle}
                style={{ ...SECTION_TITLE_STYLE, marginTop: "20px" }}
            >
                <strong>
                    <u>THỜI HẠN UỶ QUYỀN:</u>
                </strong>
            </p>
            <p style={{ margin: "8px 0" }}>Từ ngày ký đến khi hoàn tất công việc.</p>
            <p style={{ margin: "8px 0" }}>Thù lao ủy quyền: ủy quyền này không có thù lao</p>
            <p style={{ margin: "8px 0" }}>
                Chúng tôi cam kết chịu trách nhiệm trước pháp luật về nội dung ủy quyền này.
            </p>
            <p style={{ margin: "8px 0" }}>Giấy ủy quyền này được lập thành 02 bản chính, mỗi bên giữ 01 bản.</p>
            <p className={`${styles.dateLocation} text-right`} style={{ ...DOCUMENT_TEXT_STYLE, textAlign: "right", fontStyle: "italic" }}>
                <CurrentDate prefix={chuHo_xa_phuong} style={{ ...DOCUMENT_TEXT_STYLE, fontStyle: "italic" }} />
            </p>
            <table className="signature-table no-border" style={signatureTableStyle}>
                <tbody>
                    <tr>
                        <td style={signatureCellStyle}>
                            <p className="text-center" style={{ ...DOCUMENT_TEXT_STYLE, textAlign: "center", marginBottom: "10px", textDecoration: "underline", fontWeight: 700 }}>
                                <strong>
                                    <u>BÊN NHẬN ỦY QUYỀN</u>
                                </strong>
                            </p>
                        </td>
                        <td style={signatureCellStyle}>
                            <p className="text-center" style={{ ...DOCUMENT_TEXT_STYLE, textAlign: "center", marginBottom: "10px", textDecoration: "underline", fontWeight: 700 }}>
                                <strong>
                                    <u>BÊN ỦY QUYỀN</u>
                                </strong>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
