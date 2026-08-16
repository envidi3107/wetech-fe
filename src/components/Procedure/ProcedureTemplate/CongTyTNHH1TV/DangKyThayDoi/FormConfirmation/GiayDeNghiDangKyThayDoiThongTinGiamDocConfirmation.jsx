import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import CheckboxChoiceTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CheckboxChoiceTable/CheckboxChoiceTable";
import { formatDate } from "@/utils/dateTimeUtils";
import {
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
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

const LEGAL_PARAGRAPH_STYLE = {
    textAlign: "justify",
    textIndent: "36pt",
};

function Checkbox({ checked, margin = "0 0 0 4pt" }) {
    return (
        <span
            className={`${styles.checkbox} checkbox-symbol`}
            style={{
                display: "inline-block",
                fontWeight: "inherit",
                fontStyle: "normal",
                fontSize: "var(--procedure-confirmation-checkbox-font-size, 18pt)",
                lineHeight: 1,
                margin,
                minWidth: "18pt",
                textAlign: "center",
                verticalAlign: "middle",
            }}
        >
            {checked ? "☒" : "☐"}
            {"\u00A0"}
        </span>
    );
}

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
                <table
                    className={`${styles.noBorderTable} no-border docx-contained-table docx-column-grid-table`}
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
                        <col width="40%" style={{ width: "40%" }} />
                        <col width="60%" style={{ width: "60%" }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td
                                style={{
                                    width: "40%",
                                    maxWidth: "40%",
                                    border: "none",
                                    textAlign: "center",
                                    verticalAlign: "top",
                                }}
                            >
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <strong>{companyName.toLocaleUpperCase("vi-VN")}</strong>
                                </p>
                                <p style={{ margin: "8pt 0 0", textAlign: "center" }}>Số: ……………</p>
                            </td>
                            <td
                                style={{
                                    width: "60%",
                                    maxWidth: "60%",
                                    border: "none",
                                    textAlign: "center",
                                    verticalAlign: "top",
                                }}
                            >
                                <h2
                                    className={styles.nationTitle}
                                    style={{ margin: 0, textAlign: "center", fontSize: "13pt", whiteSpace: "nowrap" }}
                                >
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
                            </td>
                        </tr>
                    </tbody>
                </table>
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

                <p style={{ margin: "14pt 0 8pt", textAlign: "center" }}>
                    <strong>A. ĐĂNG KÝ THAY ĐỔI NỘI DUNG ĐĂNG KÝ DOANH NGHIỆP</strong>
                </p>

                <p style={{ margin: "10pt 0 4pt", ...LEGAL_PARAGRAPH_STYLE }}>
                    Doanh nghiệp đăng ký thay đổi trên cơ sở (chỉ kê khai trong trường hợp doanh nghiệp đăng ký thay đổi
                    trên cơ sở tách doanh nghiệp hoặc sáp nhập doanh nghiệp, đánh dấu X vào ô thích hợp):
                </p>
                <p style={{ margin: "4pt 0 4pt 18pt" }}>
                    - Đăng ký thay đổi trên cơ sở tách doanh nghiệp{"\u00A0"}
                    <Checkbox checked={data.coSoThayDoi === "tach"} />
                </p>
                <p style={{ margin: "4pt 0 4pt 18pt" }}>
                    - Đăng ký thay đổi trên cơ sở sáp nhập doanh nghiệp{"\u00A0"}
                    <Checkbox checked={data.coSoThayDoi === "sap_nhap"} />
                </p>
                <p style={{ margin: "8pt 0 4pt" }}>
                    <strong>
                        Thông tin về doanh nghiệp bị sáp nhập (chỉ kê khai trong trường hợp doanh nghiệp đăng ký thay đổi
                        trên cơ sở sáp nhập doanh nghiệp):
                    </strong>
                </p>
                <Line
                    label="Tên doanh nghiệp (ghi bằng chữ in hoa)"
                    value={data.sapNhap_tenDoanhNghiep}
                />
                <Line label="Mã số doanh nghiệp/Mã số thuế" value={data.sapNhap_maSoDoanhNghiep} />
                <p style={LEGAL_PARAGRAPH_STYLE}>
                    Đề nghị Quý Cơ quan thực hiện chấm dứt tồn tại đối với doanh nghiệp bị sáp nhập và các chi nhánh/văn
                    phòng đại diện/địa điểm kinh doanh của doanh nghiệp bị sáp nhập.
                </p>
                <p style={LEGAL_PARAGRAPH_STYLE}>
                    - Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo và xã, phường biên giới; xã, phường ven
                    biển; khu vực khác có ảnh hưởng đến quốc phòng, an ninh:
                </p>
                <CheckboxChoiceTable
                    CheckboxComponent={Checkbox}
                    options={[
                        { label: "Có", checked: data.anNinhQuocPhong === "Có" },
                        { label: "Không", checked: data.anNinhQuocPhong !== "Có" },
                    ]}
                />

                <p style={{ margin: "8pt 0", textAlign: "center" }}>THÔNG BÁO THAY ĐỔI THÔNG TIN ĐĂNG KÝ THUẾ</p>

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
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>1</td>
                            <td style={{ border: "1px solid #000" }}>
                                <p style={{ margin: 0 }}>
                                    <strong>Thông tin về Giám đốc/Tổng giám đốc sau khi thay đổi:</strong>
                                </p>
                                <PersonDetails data={data} prefix="giamDoc" />
                            </td>
                        </tr>
                        {hasAccountingInfo && (
                            <tr>
                                <td style={{ border: "1px solid #000", textAlign: "center" }}>2</td>
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

                <table
                    className={`${styles.noBorderTable} ${styles.checkboxParagraphTable} no-border docx-contained-table`}
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        tableLayout: "fixed",
                        borderCollapse: "collapse",
                        border: "none",
                        marginTop: 16,
                        ...DOCUMENT_STYLE,
                    }}
                >
                    <colgroup>
                        <col width="36pt" style={{ width: "36pt" }} />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td
                                style={{
                                    width: "36pt",
                                    maxWidth: "36pt",
                                    border: "none",
                                    padding: 0,
                                    textAlign: "left",
                                    verticalAlign: "top",
                                }}
                            >
                                <Checkbox checked={isTruthy(data.deNghiCapGiayXacNhan)} margin="0" />
                            </td>
                            <td style={{ border: "none", padding: 0, textAlign: "justify", verticalAlign: "top" }}>
                                Đề nghị Quý Cơ quan cấp Giấy xác nhận thay đổi nội dung đăng ký doanh nghiệp cho doanh
                                nghiệp đối với các thông tin thay đổi nêu trên.
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "14pt", ...LEGAL_PARAGRAPH_STYLE }}>
                    Trường hợp hồ sơ đăng ký doanh nghiệp hợp lệ, đề nghị Quý Cơ quan đăng công bố nội dung đăng ký doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.
                </p>

                <p style={LEGAL_PARAGRAPH_STYLE}>
                    Doanh nghiệp cam kết hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung
                    thực của nội dung Giấy đề nghị này.
                </p>

                <p style={LEGAL_PARAGRAPH_STYLE}>
                    Người ký tại Thông báo này cam kết là người có quyền và nghĩa vụ thực hiện thủ tục đăng ký doanh
                    nghiệp theo quy định của pháp luật và Điều lệ công ty.
                </p>

                <table
                    className={`${styles.noBorderTable} signature-table no-border`}
                    style={{ width: "100%", borderCollapse: "collapse", border: "none", marginTop: "20pt" }}
                >
                    <tbody>
                        <tr>
                            <td className="signature-spacer" style={{ width: "55%", border: "none" }}>
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
