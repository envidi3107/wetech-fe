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
    fontSize: "13pt",
    lineHeight: 1.5,
    color: "#000",
};

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

function Line({ label, value }) {
    return (
        <p style={{ margin: "6pt 0" }}>
            {label}: {value || ""}
        </p>
    );
}

function PersonDetails({ data, prefix }) {
    return (
        <>
            <Line label="Họ, chữ đệm và tên" value={data[`${prefix}_hoTen`]} />
            <Line label="Ngày, tháng, năm sinh" value={formatDate(data[`${prefix}_ngaySinh`])} />
            <Line label="Giới tính" value={data[`${prefix}_gioiTinh`]} />
            <Line label="Số định danh cá nhân" value={data[`${prefix}_cccd`]} />
            <Line label="Điện thoại" value={data[`${prefix}_phone`]} />
        </>
    );
}

export default function GiayDeNghiDangKyThayDoiThongTinGiamDocConfirmation({ dataJson }) {
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
    const hasAccountingInfo = [
        data.keToan_hoTen,
        data.keToan_ngaySinh,
        data.keToan_gioiTinh,
        data.keToan_cccd,
        data.keToan_phone,
    ].some((value) => !isEmptyValue(value));

    return (
        <div className={styles.container} style={DOCUMENT_STYLE}>
            <div className={styles.header} style={{ textAlign: "center" }}>
                <h2 className={styles.nationTitle} style={{ textAlign: "center", fontSize: "13pt" }}>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </h2>
                <h3 className={styles.headerSubtitle} style={{ textAlign: "center", fontSize: "13pt" }}>
                    <strong>
                        <u>Độc lập - Tự do - Hạnh phúc</u>
                    </strong>
                </h3>
                <p className={styles.dateRight} style={{ textAlign: "right", fontStyle: "italic" }}>
                    <CurrentDate prefix={data.kinhGuiProvince} />
                </p>
            </div>

            <h2 className={styles.docTitle} style={{ textAlign: "center", fontSize: "13pt" }}>
                GIẤY ĐỀ NGHỊ
            </h2>
            <h3 className={styles.docTitle} style={{ textAlign: "center", fontSize: "13pt" }}>
                Đăng ký thay đổi nội dung Giấy chứng nhận đăng ký doanh nghiệp
            </h3>

            <div className={styles.content}>
                <p>Kính gửi: {data.kinhGui || ""}</p>
                <Line label="Tên doanh nghiệp (ghi bằng chữ in hoa)" value={companyName} />
                <Line label="Mã số doanh nghiệp/Mã số thuế" value={data.maSoDoanhNghiep} />

                <p style={{ margin: "14pt 0 8pt" }}>
                    <strong>MỤC A: KÊ KHAI THAY ĐỔI THÔNG TIN ĐĂNG KÝ THUẾ</strong>
                </p>
                <p style={{ margin: "8pt 0" }}>
                    <span style={{ fontSize: "15pt", fontStyle: "normal" }}>☒</span>
                    {"\u00A0"}THÔNG BÁO THAY ĐỔI THÔNG TIN ĐĂNG KÝ THUẾ
                </p>

                <table
                    className={styles.borderTable}
                    style={{ width: "100%", borderCollapse: "collapse", ...DOCUMENT_STYLE }}
                >
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #000", textAlign: "center" }}>STT</th>
                            <th style={{ border: "1px solid #000", textAlign: "center" }}>
                                Các chỉ tiêu thông tin đăng ký thuế thay đổi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>10.1</td>
                            <td style={{ border: "1px solid #000" }}>
                                <p style={{ margin: 0 }}>
                                    <strong>Thông tin về Giám đốc/Tổng giám đốc sau khi thay đổi:</strong>
                                </p>
                                <PersonDetails data={data} prefix="giamDoc" />
                            </td>
                        </tr>
                        {hasAccountingInfo && (
                            <tr>
                                <td style={{ border: "1px solid #000", textAlign: "center" }}>10.2</td>
                                <td style={{ border: "1px solid #000" }}>
                                    <p style={{ margin: 0 }}>
                                        <strong>Thông tin về Kế toán trưởng/Phụ trách kế toán:</strong>
                                    </p>
                                    <PersonDetails data={data} prefix="keToan" />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <p style={{ marginTop: "14pt" }}>
                    Doanh nghiệp cam kết hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung
                    thực của nội dung Giấy đề nghị này.
                </p>

                <table
                    className={`${styles.noBorderTable} signature-table no-border`}
                    style={{ width: "100%", borderCollapse: "collapse", border: "none", marginTop: "20pt" }}
                >
                    <tbody>
                        <tr>
                            <td className="signature-spacer" style={{ width: "50%", border: "none" }}>
                                {"\u00A0"}
                            </td>
                            <td className="signature-cell" style={{ border: "none", textAlign: "center" }}>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <strong>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT</strong>
                                </p>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <em>(Ký và ghi họ tên)</em>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
