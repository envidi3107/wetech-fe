import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { formatDate } from "@/utils/dateTimeUtils";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS,
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const DOCUMENT_STYLE = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "var(--procedure-confirmation-font-size)",
    lineHeight: 1.5,
    color: "#000",
};
const LEGAL_PARAGRAPH_STYLE = {
    textAlign: "justify",
    textIndent: "36pt",
};
const DECISION_NUMBER = "01/2026/QĐ-CSH";

function isEmptyValue(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function withCompanyNamePrefix(value, prefix) {
    if (isEmptyValue(value)) return "";
    const displayValue = String(value).trim();
    const upperDisplayValue = displayValue.toLocaleUpperCase("vi-VN");
    const knownPrefixes = [...TNHH_COMPANY_NAME_PREFIX_OPTIONS, ...CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS];
    return knownPrefixes.some((knownPrefix) => upperDisplayValue.startsWith(knownPrefix.toLocaleUpperCase("vi-VN")))
        ? displayValue
        : `${prefix} ${displayValue}`;
}

function InlineField({ children, marginLeft = "36pt" }) {
    return (
        <span
            className={`${styles.inlineField} inlineField`}
            style={{ display: "inline-block", marginLeft, fontWeight: "inherit", fontStyle: "normal" }}
        >
            {children}
        </span>
    );
}

export default function QuyetDinhChuSoHuuThayDoiNguoiDaiDienConfirmation({ dataJson }) {
    const data = normalizeDataJson(dataJson);
    if (!Object.keys(data).length) {
        return <p className={styles.emptyMessage}>Đang tải dữ liệu...</p>;
    }

    const companyNamePrefix = getCompanyNamePrefix(
        data,
        DEFAULT_TNHH_COMPANY_NAME_PREFIX,
        TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    );
    const companyName = withCompanyNamePrefix(data.tenDoanhNghiep || data.tenCongTyVN, companyNamePrefix);
    const ownerName = data.chuSoHuu_hoTen || "";

    return (
        <div className={styles.container} style={DOCUMENT_STYLE} data-export-document-font-size="13pt">
            <table
                className={`${styles.noBorderTable} no-border docx-contained-table docx-column-grid-table decision-header-table`}
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    tableLayout: "fixed",
                    borderCollapse: "collapse",
                    border: "none",
                    ...DOCUMENT_STYLE,
                }}
            >
                <colgroup>
                    <col width="45%" style={{ width: "45%" }} />
                    <col width="55%" style={{ width: "55%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td style={{ width: "45%", maxWidth: "45%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                            <p style={{ margin: 0, textAlign: "center" }}>
                                <strong>{companyName.toLocaleUpperCase("vi-VN")}</strong>
                            </p>
                            <p style={{ margin: "2pt 0 0", textAlign: "center" }}>-------</p>
                        </td>
                        <td style={{ width: "55%", maxWidth: "55%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                            <p style={{ margin: 0, textAlign: "center", whiteSpace: "nowrap" }}>
                                <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
                            </p>
                            <p style={{ margin: "2pt 0 0", textAlign: "center" }}>
                                <strong>
                                    <u>Độc lập - Tự do - Hạnh phúc</u>
                                </strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: "45%", maxWidth: "45%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                            <p style={{ margin: "8pt 0 0", textAlign: "center" }}>Số: {DECISION_NUMBER}</p>
                        </td>
                        <td style={{ width: "55%", maxWidth: "55%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                            <p
                                className="decision-date-line"
                                style={{
                                    display: "block",
                                    margin: "8pt 0 0",
                                    textAlign: "center",
                                    fontStyle: "italic",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <em>
                                    <CurrentDate prefix={data.kinhGuiProvince} />
                                </em>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2
                className={styles.docTitle}
                style={{ marginTop: "14pt", textAlign: "center", fontSize: "var(--procedure-confirmation-font-size)" }}
            >
                QUYẾT ĐỊNH
            </h2>
            <p style={{ margin: "4pt 0 14pt", textAlign: "center" }}>
                <strong>Về việc thay đổi nội dung đăng ký doanh nghiệp</strong>
            </p>
            <p style={{ margin: "10pt 0", textAlign: "center" }}>
                <strong>CHỦ SỞ HỮU</strong>
            </p>

            <div className={styles.content}>
                <p style={LEGAL_PARAGRAPH_STYLE}>
                    - Căn cứ Luật Doanh nghiệp số 59/2020/QH14 được Quốc hội thông qua ngày 17 tháng 06 năm 2020, được
                    sửa đổi, bổ sung một số điều theo Luật số 03/2022/QH15 và Luật số 76/2025/QH15;
                </p>
                <p style={LEGAL_PARAGRAPH_STYLE}>
                    - Căn cứ Nghị định số 168/2025/NĐ-CP về đăng ký doanh nghiệp ban hành ngày 30/06/2025;
                </p>
                <p style={LEGAL_PARAGRAPH_STYLE}>- Căn cứ Điều lệ {companyName || "Công ty"};</p>

                <p style={{ margin: "14pt 0", textAlign: "center" }}>
                    <strong>QUYẾT ĐỊNH:</strong>
                </p>
                <p>
                    <strong>Điều 1: Đăng ký thay đổi người đại diện theo pháp luật</strong>
                </p>
                <p style={LEGAL_PARAGRAPH_STYLE}>
                    <strong>Người đại diện theo pháp luật sau khi thay đổi:</strong>
                </p>
                <p>Họ, chữ đệm và tên (ghi bằng chữ in hoa): {data.nguoiDaiDien_hoTen || ""}</p>
                <p>Ngày, tháng, năm sinh: {formatDate(data.nguoiDaiDien_ngaySinh)}</p>
                <p>Giới tính: {data.nguoiDaiDien_gioiTinh || ""}</p>
                <p>Số định danh cá nhân: {data.nguoiDaiDien_cccd || ""}</p>
                <p>Chức danh: {data.nguoiDaiDien_chucDanh || "Giám đốc"}</p>
                <p>Địa chỉ liên lạc:</p>
                <p>
                    Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {data.nguoiDaiDien_soNha || ""}
                </p>
                <p>Xã/Phường/Đặc khu: {data.nguoiDaiDien_xa || ""}</p>
                <p>Tỉnh/Thành phố trực thuộc trung ương: {data.nguoiDaiDien_tinh || ""}</p>
                <p>Quốc gia: {data.nguoiDaiDien_lienLac_quocGia || "Việt Nam"}</p>
                <p>
                    Điện thoại (nếu có): {data.nguoiDaiDien_phone || ""}
                    <InlineField>Thư điện tử (nếu có): {data.nguoiDaiDien_email || ""}</InlineField>
                </p>

                <p>
                    <strong>Điều 2:</strong> Người đại diện theo pháp luật của công ty có trách nhiệm thi hành Quyết
                    định này.
                </p>
                <p>
                    <strong>Điều 3:</strong> Quyết định này có hiệu lực kể từ ngày ký.
                </p>

                <table
                    className="signature-recipients-table no-border docx-column-grid-table"
                    style={{
                        width: "100%",
                        tableLayout: "fixed",
                        borderCollapse: "collapse",
                        border: "none",
                        marginTop: "18pt",
                        ...DOCUMENT_STYLE,
                    }}
                >
                    <colgroup>
                        <col width="45%" style={{ width: "45%" }} />
                        <col width="55%" style={{ width: "55%" }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td
                                className={`${styles.recipientsBlock} export-recipients-block signature-recipients-cell`}
                                style={{ width: "45%", border: "none", verticalAlign: "top" }}
                            >
                                <p style={{ margin: 0 }}>
                                    <strong>
                                        <em>Nơi nhận:</em>
                                    </strong>
                                </p>
                                <p style={{ margin: 0 }}>- Như Điều 2 (để thực hiện);</p>
                                <p style={{ margin: 0 }}>- Phòng ĐKKD – Sở TC (để đăng ký);</p>
                                <p style={{ margin: 0 }}>- Lưu.</p>
                            </td>
                            <td style={{ width: "55%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <strong>CHỦ SỞ HỮU</strong>
                                </p>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <em>(Ký, ghi rõ họ tên)</em>
                                </p>
                                <p style={{ margin: "56pt 0 0", textAlign: "center" }}>{ownerName}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
