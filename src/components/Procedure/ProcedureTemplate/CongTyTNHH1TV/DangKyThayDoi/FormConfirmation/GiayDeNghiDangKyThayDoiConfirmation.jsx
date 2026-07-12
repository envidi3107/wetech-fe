import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { formatDate } from "@/utils/dateTimeUtils";
import {
    A_CHANGE_OPTIONS,
    BENEFICIAL_OWNER_CHANGE_OPTIONS,
    MAIN_CHANGE_OPTIONS,
    SHAREHOLDER_CHANGE_OPTIONS,
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS,
    DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const Checkbox = ({ checked }) => (
    <span
        className={`${styles.checkbox} checkbox-symbol`}
        style={{
            display: "inline-block",
            fontWeight: "inherit",
            fontStyle: "normal",
            fontSize: "var(--procedure-confirmation-checkbox-font-size, 18pt)",
            lineHeight: 1,
            margin: "0 0 0 4pt",
            minWidth: "18pt",
            textAlign: "center",
            verticalAlign: "middle",
        }}
    >
        {checked ? "\u2612" : "\u2610"}
        {"\u00A0"}
    </span>
);

function InlineField({ children, marginLeft = "36pt" }) {
    return (
        <span
            className={`${styles.inlineField} inlineField`}
            style={{
                display: "inline-block",
                marginLeft,
                fontWeight: "inherit",
                fontStyle: "normal",
            }}
        >
            {children}
        </span>
    );
}

function CheckboxOption({ label, checked, marginLeft = "0" }) {
    return (
        <InlineField marginLeft={marginLeft}>
            {label}
            {"\u00A0"}
            <Checkbox checked={checked} />
        </InlineField>
    );
}

const DEFAULT_EXCLUDED_A_OPTION_NAMES = ["a_doiThanhVien", "a_doiCoDong", "a_doiVonDauTuDNTN"];
const compactPdfTableClassName = `${styles.borderTable} ${styles.compactPdfTable}`;
const widePdfTableClassName = `${styles.borderTable} ${styles.compactPdfTable} ${styles.widePdfTable}`;

function isEmptyValue(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function isZeroValue(value) {
    if (isEmptyValue(value)) return false;

    const normalizedValue = String(value)
        .trim()
        .replace(/(VNĐ|VND|%)/gi, "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    return normalizedValue !== "" && !Number.isNaN(Number(normalizedValue)) && Number(normalizedValue) === 0;
}

function formatUnitValue(value, unit) {
    if (isEmptyValue(value)) return "";

    const displayValue = String(value).trim();
    const alreadyHasUnit = unit === "%" ? displayValue.includes("%") : /(VNĐ|VND)/i.test(displayValue);

    if (alreadyHasUnit || isZeroValue(displayValue)) {
        return displayValue;
    }

    return `${displayValue} ${unit}`;
}

function CheckboxList({ items }) {
    return (
        <div style={{ margin: "4pt 0 4pt 18pt" }}>
            {items.map((item) => (
                <p key={item.label} style={{ margin: "4pt 0" }}>
                    {item.label}
                    {"\u00A0"}
                    <Checkbox checked={item.checked} />
                </p>
            ))}
        </div>
    );
}

function BeneficialOwnerChangeList({ data }) {
    return (
        <div>
            {BENEFICIAL_OWNER_CHANGE_OPTIONS.map(
                (option) =>
                    isTruthy(data[option.name]) && (
                        <p key={option.name} style={{ margin: "8px 0" }}>
                            <strong>{option.marker}</strong> {option.label}
                        </p>
                    ),
            )}
        </div>
    );
}

function ShareholderChangeList({ data }) {
    return (
        <div>
            {SHAREHOLDER_CHANGE_OPTIONS.map(
                (option) =>
                    isTruthy(data[option.name]) && (
                        <p key={option.name} style={{ margin: "8px 0" }}>
                            {option.label}
                        </p>
                    ),
            )}
        </div>
    );
}

function Line({ label, value }) {
    return (
        <p>
            {label}: {value || ""}
        </p>
    );
}

function withCompanyNamePrefix(value, prefix) {
    if (isEmptyValue(value)) return "";

    const displayValue = String(value).trim();
    const upperDisplayValue = displayValue.toLocaleUpperCase("vi-VN");
    const knownPrefixes = [...TNHH_COMPANY_NAME_PREFIX_OPTIONS, ...CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS];
    const alreadyHasPrefix = knownPrefixes.some((knownPrefix) =>
        upperDisplayValue.startsWith(knownPrefix.toLocaleUpperCase("vi-VN")),
    );

    return alreadyHasPrefix ? displayValue : `${prefix} ${displayValue}`;
}

function Section({ title, children, className }) {
    return (
        <div className={className} style={{ marginTop: 16 }}>
            <h3 style={{ textAlign: "center", fontSize: "16px" }}>{title}</h3>
            {children}
        </div>
    );
}

function SubSection({ title, children, className }) {
    return (
        <div className={className} style={{ marginTop: 16 }}>
            <p style={{ textAlign: "center", fontSize: "16px" }}>{title}</p>
            {children}
        </div>
    );
}

const REGISTRATION_A_OPTION_NAMES = new Set([
    "a_doiTen",
    "a_doiDiaChi",
    "a_doiThanhVien",
    "a_doiVonDieuLe",
    "a_doiVonDauTuDNTN",
]);

function getDocumentSubtitle(mainOptions, selectedAOptions) {
    const defaultSubtitle =
        "Đăng ký thay đổi nội dung Giấy chứng nhận đăng ký doanh nghiệp/Thông báo thay đổi nội dung đăng ký doanh nghiệp";

    if (!mainOptions.includes("A")) return defaultSubtitle;

    const hasRegistrationChange = selectedAOptions.some((option) => REGISTRATION_A_OPTION_NAMES.has(option.name));
    const hasNotificationChange = selectedAOptions.some((option) => !REGISTRATION_A_OPTION_NAMES.has(option.name));

    if (hasRegistrationChange && !hasNotificationChange) {
        return "Đăng ký thay đổi nội dung Giấy chứng nhận đăng ký doanh nghiệp";
    }

    if (!hasRegistrationChange && hasNotificationChange) {
        return "Thông báo thay đổi nội dung đăng ký doanh nghiệp";
    }

    return defaultSubtitle;
}

const normalizeSelectedMainOptions = (value) => {
    if (Array.isArray(value)) {
        const selectedValues = value.filter((item) => MAIN_CHANGE_OPTIONS.some((option) => option.value === item));
        return selectedValues.length ? selectedValues : ["A"];
    }

    return MAIN_CHANGE_OPTIONS.some((option) => option.value === value) ? [value] : ["A"];
};

const getMainOptionLabel = (value) => MAIN_CHANGE_OPTIONS.find((option) => option.value === value)?.label || "";

function addressToString(soNha, xa, tinh) {
    return [soNha, xa, tinh].filter(Boolean).join(", ");
}

function renderBusinessRows(rows) {
    return rows.map((row, index) => (
        <tr key={index}>
            <td style={{ textAlign: "center" }}>
                <p
                    style={{
                        margin: 0,
                        lineHeight: "inherit",
                        textAlign: "inherit",
                        font: "inherit",
                    }}
                >
                    {index + 1}
                </p>
            </td>
            <td>
                <p style={{ margin: 0 }}>{row.tenNganh}</p>
                {row.chiTiet && <p style={{ margin: 0, fontStyle: "italic" }}>{row.chiTiet}</p>}
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
                    <Checkbox checked={!!row.laNganhChinh} />
                </p>
            </td>
        </tr>
    ));
}

function BusinessChangeTable({ index, title, rows, headers }) {
    if (!rows?.length) return null;

    return (
        <>
            <p>
                <strong>
                    {index}. {title}
                </strong>
            </p>
            <table className={styles.borderTable}>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {header}
                                </p>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{renderBusinessRows(rows)}</tbody>
            </table>
        </>
    );
}

function MemberChangeTable({ rows }) {
    return (
        <table className={widePdfTableClassName} style={{ marginTop: 8 }}>
            <thead>
                <tr>
                    <th rowSpan={2}>
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
                    <th rowSpan={2}>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Tên thành viên
                        </p>
                    </th>
                    <th rowSpan={2}>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Ngày, tháng, năm sinh đối với thành viên là cá nhân
                        </p>
                    </th>
                    <th rowSpan={2}>
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
                    <th rowSpan={2}>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Loại giấy tờ, số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                        </p>
                    </th>
                    <th rowSpan={2}>
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
                    <th rowSpan={2}>
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
                    <th rowSpan={2}>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Địa chỉ liên lạc
                        </p>
                    </th>
                    <th colSpan={3}>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Vốn góp
                        </p>
                    </th>
                    <th rowSpan={2}>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Thời hạn góp vốn
                        </p>
                    </th>
                    <th rowSpan={2}>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Chữ ký của thành viên
                        </p>
                    </th>
                    <th rowSpan={2}>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Ghi chú
                        </p>
                    </th>
                </tr>
                <tr>
                    <th>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Phần vốn góp
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
                            Tỷ lệ (%)
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
                            Loại tài sản, số lượng, giá trị tài sản góp vốn
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows?.length ? (
                    rows.map((row, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {index + 1}
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
                            <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
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
                            <td style={{ textAlign: "center" }}>
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
                                    {row.giaTo}
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
                                    {row.quocTich}
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
                                    {row.diaChiLienLac}
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
                                    {formatUnitValue(row.phanVonGop, "VNĐ")}
                                    {row.phanVonGopNgoaiTe_GiaTri ? (
                                        <>
                                            <br />({row.phanVonGopNgoaiTe_GiaTri} {row.phanVonGopNgoaiTe_Loai})
                                        </>
                                    ) : (
                                        ""
                                    )}
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
                                    {formatUnitValue(row.tyLe, "%")}
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
                                    {row.loaiTaiSan}
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
                                    {row.thoiHan}
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
                                    {row.chuKy}
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
                                    {row.ghiChu}
                                </p>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={14} style={{ textAlign: "center" }}>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Không có dữ liệu
                            </p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

function MoneySourceTable({ data }) {
    const rows = [
        ["Vốn ngân sách nhà nước", "nguonVon_nganSach"],
        ["Vốn tư nhân", "nguonVon_tuNhan"],
        ["Vốn nước ngoài", "nguonVon_nuocNgoai"],
        ["Vốn khác", "nguonVon_khac"],
        ["Tổng cộng", "nguonVon_tongCong"],
    ];

    return (
        <table className={styles.borderTable} style={{ marginTop: 8 }}>
            <thead>
                <tr>
                    <th>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Loại nguồn vốn
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
                            Số tiền
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
                            Tỷ lệ (%)
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows.map(([label, prefix]) => (
                    <tr key={prefix}>
                        <td>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                {label}
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
                                {formatUnitValue(data[`${prefix}_soTien`], "VNĐ")}
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
                                {formatUnitValue(data[`${prefix}_tyLe`], "%")}
                            </p>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function AssetTable({ data, fieldPrefix = "taiSan" }) {
    const rows = [
        ["1", "Đồng Việt Nam", `${fieldPrefix}_dongVN`],
        ["2", "Ngoại tệ tự do chuyển đổi", `${fieldPrefix}_ngoaiTe`],
        ["3", "Vàng", `${fieldPrefix}_vang`],
        ["4", "Quyền sử dụng đất", `${fieldPrefix}_qsdDat`],
        ["5", "Quyền sở hữu trí tuệ", `${fieldPrefix}_shtt`],
        [
            "6",
            `Các tài sản khác (loại tài sản, số lượng và giá trị còn lại của mỗi loại tài sản): ${data[`${fieldPrefix}_khac_loaiTaiSan`] || ""}, ${data[`${fieldPrefix}_khac_soLuong`] ? `${data[`${fieldPrefix}_khac_soLuong`]}` : ""}`,
            `${fieldPrefix}_khac`,
        ],
        ["", "Tổng số", `${fieldPrefix}_tongSo`],
    ];

    return (
        <table className={styles.borderTable} style={{ marginTop: 8 }}>
            <thead>
                <tr>
                    <th style={{ width: 50 }}>
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
                            Tài sản góp vốn
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
                            Giá trị vốn
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
                            Tỷ lệ (%)
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows.map(([stt, label, prefix]) => (
                    <tr key={prefix}>
                        <td style={{ textAlign: "center" }}>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                {stt}
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
                                {label}
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
                                {formatUnitValue(data[`${prefix}_giaTri`], "VNĐ")}
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
                                {formatUnitValue(data[`${prefix}_tyLe`], "%")}
                            </p>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ShareInfoTable({ data }) {
    const rows = [
        ["Cổ phần phổ thông", "cp_cptt_soLuong", "cp_cptt_giaTri", "cp_cptt_tiLe"],
        ["Cổ phần ưu đãi biểu quyết", "cp_cpudbq_soLuong", "cp_cpudbq_giaTri", "cp_cpudbq_tiLe"],
        ["Cổ phần ưu đãi cổ tức", "cp_cpudct_soLuong", "cp_cpudct_giaTri", "cp_cpudct_tiLe"],
        ["Cổ phần ưu đãi hoàn lại", "cp_cpudhl_soLuong", "cp_cpudhl_giaTri", "cp_cpudhl_tiLe"],
        ["Các cổ phần ưu đãi khác", "cp_cpudk_soLuong", "cp_cpudk_giaTri", "cp_cpudk_tiLe"],
        ["Tổng số", "cp_tongSoLuong", "cp_tongGiaTri", "cp_tongTiLe"],
    ];

    return (
        <>
            <p>
                <strong>Thông tin về cổ phần sau khi thay đổi:</strong>
            </p>
            <Line label="Mệnh giá cổ phần" value={data.menhGiaCoPhan} />
            <table className={compactPdfTableClassName} style={{ marginTop: 8 }}>
                <thead>
                    <tr>
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Loại cổ phần
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
                                Số lượng
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
                                Giá trị
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
                                Tỷ lệ so với vốn điều lệ (%)
                            </p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(([label, soLuongKey, giaTriKey, tiLeKey]) => (
                        <tr key={soLuongKey}>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {label}
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
                                    {data[soLuongKey] || ""}
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
                                    {formatUnitValue(data[giaTriKey], "VNĐ")}
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
                                    {formatUnitValue(data[tiLeKey], "%")}
                                </p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

function GiayDeNghiDangKyThayDoiConfirmation({
    dataJson,
    excludedAOptionNames = DEFAULT_EXCLUDED_A_OPTION_NAMES,
    includeCoPhanFields = false,
}) {
    const data = normalizeDataJson(dataJson);

    if (!Object.keys(data).length) {
        return <p className={styles.emptyMessage}>Đang tải dữ liệu...</p>;
    }

    const mainOptions = normalizeSelectedMainOptions(data.noiDungThayDoi);
    const isMainSelected = (value) => mainOptions.includes(value);
    const excludedAOptionNamesSet = new Set(excludedAOptionNames);
    const availableAChangeOptions = A_CHANGE_OPTIONS.filter((option) => !excludedAOptionNamesSet.has(option.name));
    const selectedAOptions = availableAChangeOptions.filter((option) => isTruthy(data[option.name]));
    const documentSubtitle = getDocumentSubtitle(mainOptions, selectedAOptions);
    const defaultCompanyNamePrefix = includeCoPhanFields
        ? DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX
        : DEFAULT_TNHH_COMPANY_NAME_PREFIX;
    const companyNamePrefix = getCompanyNamePrefix(data, defaultCompanyNamePrefix);
    const changedCompanyNamePrefix = data.tenSauThayDoiPrefix || companyNamePrefix;
    const doiThanhVienRows = data.doiThanhVienList || data.thanhVienList || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.nationTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
                <p className={styles.dateRight} style={{ fontStyle: "italic" }}>
                    <CurrentDate prefix={data.kinhGuiProvince} />
                </p>
            </div>
            <h2 className={styles.docTitle}>GIẤY ĐỀ NGHỊ</h2>
            <h3 className={styles.docTitle}>{documentSubtitle}</h3>
            <div className={styles.content}>
                <p>Kính gửi: {data.kinhGui}</p>
                <Line
                    label="Tên doanh nghiệp (ghi bằng chữ in hoa)"
                    value={withCompanyNamePrefix(data.tenDoanhNghiep, companyNamePrefix)}
                />
                <Line label="Mã số doanh nghiệp/Mã số thuế" value={data.maSoDoanhNghiep} />

                {isMainSelected("A") && (
                    <>
                        <Section title={`A. ${documentSubtitle?.toUpperCase()}`}>
                            <div>
                                <p>
                                    Doanh nghiệp đăng ký thay đổi trên cơ sở (chỉ kê khai trong trường hợp doanh nghiệp
                                    đăng ký thay đổi trên cơ sở tách doanh nghiệp hoặc sáp nhập doanh nghiệp, đánh dấu X
                                    vào ô thích hợp):
                                </p>
                                <div style={{ margin: "4pt 0 4pt 18pt" }}>
                                    <p style={{ margin: "4pt 0" }}>
                                        - Đăng ký thay đổi trên cơ sở tách doanh nghiệp
                                        {"\u00A0"}
                                        <Checkbox checked={data.coSoThayDoi === "tach"} />
                                    </p>
                                    <p style={{ margin: "4pt 0" }}>
                                        - Đăng ký thay đổi trên cơ sở sáp nhập doanh nghiệp
                                        {"\u00A0"}
                                        <Checkbox checked={data.coSoThayDoi === "sap_nhap"} />
                                    </p>
                                </div>
                                {data.coSoThayDoi === "sap_nhap" && (
                                    <>
                                        <Line
                                            label="Tên doanh nghiệp bị sáp nhập"
                                            value={data.sapNhap_tenDoanhNghiep}
                                        />
                                        <Line
                                            label="Mã số doanh nghiệp/Mã số thuế của doanh nghiệp bị sáp nhập"
                                            value={data.sapNhap_maSoDoanhNghiep}
                                        />
                                        <p>
                                            Đề nghị Quý Cơ quan thực hiện chấm dứt tồn tại đối với doanh nghiệp bị sáp
                                            nhập và các chi nhánh/văn phòng đại diện/địa điểm kinh doanh của doanh
                                            nghiệp bị sáp nhập.
                                        </p>
                                    </>
                                )}
                                <p>
                                    Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo, xã/phường biên giới,
                                    xã/phường ven biển hoặc khu vực ảnh hưởng quốc phòng, an ninh:
                                    <CheckboxOption
                                        label="Có"
                                        checked={data.anNinhQuocPhong === "Có"}
                                        marginLeft="36pt"
                                    />
                                    <CheckboxOption
                                        label="Không"
                                        checked={data.anNinhQuocPhong !== "Có"}
                                        marginLeft="24pt"
                                    />
                                </p>
                            </div>
                        </Section>

                        {selectedAOptions.some((option) => option.name === "a_doiTen") && (
                            <SubSection title="ĐĂNG KÝ THAY ĐỔI TÊN DOANH NGHIỆP">
                                <Line
                                    label="Tên doanh nghiệp viết bằng tiếng Việt sau khi thay đổi"
                                    value={withCompanyNamePrefix(data.tenSauThayDoiVN, changedCompanyNamePrefix)}
                                />
                                <Line
                                    label="Tên doanh nghiệp viết bằng tiếng nước ngoài sau khi thay đổi"
                                    value={data.tenSauThayDoiEN}
                                />
                                <Line
                                    label="Tên doanh nghiệp viết tắt sau khi thay đổi"
                                    value={data.tenSauThayDoiVietTat}
                                />
                            </SubSection>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiDiaChi") && (
                            <SubSection title="ĐĂNG KÝ THAY ĐỔI ĐỊA CHỈ TRỤ SỞ CHÍNH">
                                <p>Địa chỉ trụ sở chính sau khi thay đổi:</p>
                                <Line
                                    label="Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn"
                                    value={data.truSo_soNha}
                                />
                                <Line label="Xã/Phường/Đặc khu" value={data.truSo_xa} />
                                <Line label="Tỉnh/Thành phố trực thuộc trung ương" value={data.truSo_tinh} />
                                <p>
                                    Điện thoại: {data.truSo_phone}
                                    <InlineField>Số fax: {data.truSo_fax}</InlineField>
                                </p>
                                <p>
                                    Thư điện tử: {data.truSo_email}
                                    <InlineField>Website: {data.truSo_website}</InlineField>
                                </p>
                                <p>
                                    <CheckboxOption
                                        label="Đồng thời thay đổi địa chỉ nhận thông báo thuế:"
                                        checked={isTruthy(data.doiDiaChiNhanThongBaoThue)}
                                    />
                                </p>
                                <p>Doanh nghiệp nằm trong:</p>
                                <CheckboxList
                                    items={[
                                        {
                                            label: "Khu công nghiệp",
                                            checked: isTruthy(data.truSo_loaiKhu_Khu_công_nghiệp),
                                        },
                                        {
                                            label: "Khu chế xuất",
                                            checked: isTruthy(data.truSo_loaiKhu_Khu_chế_xuất),
                                        },
                                        {
                                            label: "Khu kinh tế",
                                            checked: isTruthy(data.truSo_loaiKhu_Khu_kinh_tế),
                                        },
                                        {
                                            label: "Khu công nghệ cao",
                                            checked: isTruthy(data.truSo_loaiKhu_Khu_công_nghệ_cao),
                                        },
                                    ]}
                                />
                            </SubSection>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiThanhVien") && (
                            <SubSection
                                title="ĐĂNG KÝ THAY ĐỔI THÀNH VIÊN CÔNG TY TNHH"
                                className={styles.landscapePage}
                            >
                                <MemberChangeTable rows={doiThanhVienRows} />
                            </SubSection>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiVonDieuLe") && (
                            <SubSection title="ĐĂNG KÝ THAY ĐỔI VỐN ĐIỀU LỆ, PHẦN VỐN GÓP, TỶ LỆ PHẦN VỐN GÓP">
                                <Line
                                    label="Vốn điều lệ đã đăng ký"
                                    value={`${data.vonDieuLeDaDangKy || ""} ${data.vonDieuLeDaDangKy_bangChu ? `(${data.vonDieuLeDaDangKy_bangChu})` : ""}`.trim()}
                                />
                                <Line
                                    label="Vốn điều lệ sau khi thay đổi"
                                    value={`${data.vonDieuLeSauThayDoi || ""} ${data.vonDieuLeSauThayDoi_bangChu ? `(${data.vonDieuLeSauThayDoi_bangChu})` : ""}`.trim()}
                                />
                                <Line
                                    label="Giá trị tương đương theo đơn vị tiền nước ngoài (bằng số)"
                                    value={data.vonDieuLe_ngoaiTeBangSo || data.vonDieuLe_ngoaiTe}
                                />
                                <Line label="Loại ngoại tệ" value={data.vonDieuLe_ngoaiTeDonVi} />
                                <p>
                                    Hiển thị thông tin ngoại tệ:
                                    <CheckboxOption
                                        label="Có"
                                        checked={data.hienThiNgoaiTe === "Có"}
                                        marginLeft="36pt"
                                    />
                                    <CheckboxOption
                                        label="Không"
                                        checked={data.hienThiNgoaiTe !== "Có"}
                                        marginLeft="24pt"
                                    />
                                </p>
                                <Line label="Thời điểm thay đổi vốn" value={formatDate(data.thoiDiemThayDoiVon)} />
                                <Line label="Hình thức tăng, giảm vốn" value={data.hinhThucTangGiamVon} />
                                <p>
                                    <strong>Nguồn vốn điều lệ sau khi thay đổi:</strong>
                                </p>
                                <MoneySourceTable data={data} />
                                {includeCoPhanFields && <ShareInfoTable data={data} />}
                                <p>
                                    <strong>Tài sản góp vốn sau khi thay đổi vốn điều lệ:</strong>
                                </p>
                                <AssetTable data={data} />
                                {data.camKetSauGiamVon && (
                                    <Line label="Cam kết sau khi giảm vốn" value={data.camKetSauGiamVon} />
                                )}
                            </SubSection>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiNganhNghe") &&
                            (() => {
                                const businessSections = [
                                    {
                                        title: "Bổ sung ngành, nghề kinh doanh sau:",
                                        rows: data.nganhNgheBoSungList,
                                        headers: [
                                            "STT",
                                            "Tên ngành, nghề kinh doanh được bổ sung",
                                            "Mã ngành",
                                            "Ngành, nghề kinh doanh chính",
                                        ],
                                    },
                                    {
                                        title: "Bỏ ngành, nghề kinh doanh sau:",
                                        rows: data.nganhNgheBoList,
                                        headers: ["STT", "Tên ngành, nghề kinh doanh được bỏ", "Mã ngành", "Ghi chú"],
                                    },
                                    {
                                        title: "Sửa đổi chi tiết ngành, nghề kinh doanh sau:",
                                        rows: data.nganhNgheSuaList,
                                        headers: [
                                            "STT",
                                            "Tên ngành, nghề kinh doanh được sửa đổi chi tiết",
                                            "Mã ngành",
                                            "Ngành, nghề kinh doanh chính",
                                        ],
                                    },
                                ].filter((section) => section.rows?.length);

                                if (!businessSections.length) return null;

                                return (
                                    <SubSection title="THÔNG BÁO THAY ĐỔI NGÀNH, NGHỀ KINH DOANH">
                                        {businessSections.map((section, index) => (
                                            <BusinessChangeTable
                                                key={section.title}
                                                index={index + 1}
                                                title={section.title}
                                                rows={section.rows}
                                                headers={section.headers}
                                            />
                                        ))}
                                    </SubSection>
                                );
                            })()}

                        {selectedAOptions.some((option) => option.name === "a_doiVonDauTuDNTN") && (
                            <SubSection title="ĐĂNG KÝ THAY ĐỔI VỐN ĐẦU TƯ CỦA CHỦ DOANH NGHIỆP TƯ NHÂN">
                                <Line
                                    label="Vốn đầu tư đã đăng ký"
                                    value={`${data.vonDauTuDaDangKy || ""} ${data.vonDauTuDaDangKy_bangChu ? `(${data.vonDauTuDaDangKy_bangChu})` : ""}`.trim()}
                                />
                                <Line
                                    label="Vốn đầu tư sau khi thay đổi"
                                    value={`${data.vonDauTuSauThayDoi || ""} ${data.vonDauTuSauThayDoi_bangChu ? `(${data.vonDauTuSauThayDoi_bangChu})` : ""}`.trim()}
                                />
                                <Line
                                    label="Giá trị tương đương theo đơn vị tiền nước ngoài (bằng số)"
                                    value={data.vonDauTu_ngoaiTeBangSo || data.vonDauTu_ngoaiTe}
                                />
                                <Line label="Loại ngoại tệ" value={data.vonDauTu_ngoaiTeDonVi} />
                                <p>
                                    Hiển thị thông tin ngoại tệ:
                                    <CheckboxOption
                                        label="Có"
                                        checked={data.vonDauTu_hienThiNgoaiTe === "Có"}
                                        marginLeft="36pt"
                                    />
                                    <CheckboxOption
                                        label="Không"
                                        checked={data.vonDauTu_hienThiNgoaiTe !== "Có"}
                                        marginLeft="24pt"
                                    />
                                </p>
                                <Line
                                    label="Thời điểm thay đổi vốn"
                                    value={formatDate(data.vonDauTu_thoiDiemThayDoi)}
                                />
                                <Line label="Hình thức tăng, giảm vốn" value={data.vonDauTu_hinhThucTangGiam} />
                                <p>
                                    <strong>Tài sản góp vốn sau khi thay đổi vốn đầu tư:</strong>
                                </p>
                                <AssetTable data={data} fieldPrefix="vonDauTu_taiSan" />
                                {data.vonDauTu_taiSanGopVon && (
                                    <Line
                                        label="Tài sản góp vốn sau khi thay đổi vốn đầu tư"
                                        value={data.vonDauTu_taiSanGopVon}
                                    />
                                )}
                            </SubSection>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiNguoiDaiDienUyQuyen") && (
                            <SubSection
                                title="THÔNG BÁO THAY ĐỔI NGƯỜI ĐẠI DIỆN THEO ỦY QUYỀN"
                                className={styles.landscapePage}
                            >
                                <table className={widePdfTableClassName}>
                                    <thead>
                                        <tr>
                                            <th>
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
                                                    Chủ sở hữu/Thành viên/Cổ đông là tổ chức
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
                                                    Tên người đại diện
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
                                                    Ngày sinh
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
                                                    Giới tính
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
                                                    Giấy tờ pháp lý
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
                                                    Quốc tịch
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
                                                    Địa chỉ liên lạc
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
                                                    Vốn được ủy quyền
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
                                                    Tỷ lệ (%)
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
                                                    Thời điểm đại diện phần vốn
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
                                            <th>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Ghi chú
                                                </p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.nguoiDaiDienUyQuyenList?.length ? (
                                            data.nguoiDaiDienUyQuyenList.map((row, index) => (
                                                <tr key={index}>
                                                    <td style={{ textAlign: "center" }}>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                lineHeight: "inherit",
                                                                textAlign: "inherit",
                                                                font: "inherit",
                                                            }}
                                                        >
                                                            {index + 1}
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
                                                            {row.chuSoHuu}
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
                                                            {row.ngaySinh}
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
                                                            {row.giayTo}
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
                                                            {row.diaChiLienLac}
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
                                                            {formatUnitValue(row.tongVonDaiDien, "VNĐ")}
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
                                                            {formatUnitValue(row.tyLe, "%")}
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
                                                            {row.thoiDiemDaiDien}
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
                                                            {row.chuKy}
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
                                                            {row.ghiChu}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr></tr>
                                        )}
                                    </tbody>
                                </table>
                            </SubSection>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiCoDong") && (
                            <SubSection title="THÔNG BÁO THAY ĐỔI CỔ ĐÔNG SÁNG LẬP/CỔ ĐÔNG LÀ NHÀ ĐẦU TƯ NƯỚC NGOÀI">
                                <ShareholderChangeList data={data} />
                            </SubSection>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiThongTinThue") && (
                            <SubSection title="THÔNG BÁO THAY ĐỔI THÔNG TIN ĐĂNG KÝ THUẾ">
                                <table className={styles.borderTable}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: 50, textAlign: "center" }}>
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
                                                <p>Thông tin về Giám đốc/Tổng giám đốc:</p>
                                                <Line label="Họ, chữ đệm và tên" value={data.giamDoc_hoTen} />
                                                <Line label="Ngày sinh" value={formatDate(data.giamDoc_ngaySinh)} />
                                                <Line label="Giới tính" value={data.giamDoc_gioiTinh} />
                                                <Line label="Số định danh cá nhân" value={data.giamDoc_cccd} />
                                                <Line label="Điện thoại" value={data.giamDoc_phone} />
                                            </td>
                                        </tr>
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
                                                    2
                                                </p>
                                            </td>
                                            <td>
                                                <p>Thông tin về Kế toán trưởng/Phụ trách kế toán:</p>
                                                <Line label="Họ, chữ đệm và tên" value={data.keToan_hoTen} />
                                                <Line label="Ngày sinh" value={formatDate(data.keToan_ngaySinh)} />
                                                <Line label="Giới tính" value={data.keToan_gioiTinh} />
                                                <Line label="Số định danh cá nhân" value={data.keToan_cccd} />
                                                <Line label="Điện thoại" value={data.keToan_phone} />
                                            </td>
                                        </tr>
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
                                                    3
                                                </p>
                                            </td>
                                            <td>
                                                <Line
                                                    label="Địa chỉ nhận thông báo thuế"
                                                    value={addressToString(
                                                        data.thongBaoThue_soNha,
                                                        data.thongBaoThue_xa,
                                                        data.thongBaoThue_tinh,
                                                    )}
                                                />
                                                <p>
                                                    Điện thoại: {data.thongBaoThue_phone}
                                                    <InlineField>Fax: {data.thongBaoThue_fax}</InlineField>
                                                </p>
                                                <Line label="Thư điện tử" value={data.thongBaoThue_email} />
                                            </td>
                                        </tr>
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
                                                    4
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
                                                    <Line
                                                        label="Ngày bắt đầu hoạt động"
                                                        value={formatDate(data.ngayBatDauHoatDong)}
                                                    />
                                                </p>
                                            </td>
                                        </tr>
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
                                                    5
                                                </p>
                                            </td>
                                            <td>
                                                <p style={{ margin: 0 }}>
                                                    <CheckboxOption
                                                        label="Hạch toán độc lập"
                                                        checked={data.hinhThucHachToan !== "phu_thuoc"}
                                                    />
                                                    <CheckboxOption
                                                        label="Có báo cáo tài chính hợp nhất"
                                                        checked={data.baoCaoTaiChinhHopNhat === "co"}
                                                        marginLeft="36pt"
                                                    />
                                                </p>
                                                <p style={{ margin: "4px 0 0" }}>
                                                    <CheckboxOption
                                                        label="Hạch toán phụ thuộc"
                                                        checked={data.hinhThucHachToan === "phu_thuoc"}
                                                    />
                                                </p>
                                            </td>
                                        </tr>
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
                                                    6
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
                                                    Năm tài chính: áp dụng từ ngày {data.namTaiChinh_tuNgay || "01/01"}
                                                    <InlineField>
                                                        đến ngày {data.namTaiChinh_denNgay || "31/12"}
                                                    </InlineField>
                                                </p>
                                            </td>
                                        </tr>
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
                                                    7
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
                                                    Tổng số lao động: {data.tongSoLaoDong}
                                                </p>
                                            </td>
                                        </tr>
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
                                                    8
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
                                                    Có hoạt động theo dự án BOT/BTO/BT/BOO, BLT, BTL, O&M không?
                                                </p>
                                                <p style={{ margin: "4px 0 0" }}>
                                                    <CheckboxOption label="Có" checked={data.hoatDongDuAn === "co"} />
                                                    <CheckboxOption
                                                        label="Không"
                                                        checked={data.hoatDongDuAn !== "co"}
                                                        marginLeft="36pt"
                                                    />
                                                </p>
                                            </td>
                                        </tr>
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
                                                    9
                                                </p>
                                            </td>
                                            <td>
                                                <p>Phương pháp tính thuế GTGT:</p>
                                                <CheckboxList
                                                    items={[
                                                        {
                                                            label: "Khấu trừ",
                                                            checked:
                                                                !data.phuongPhapTinhThueGTGT ||
                                                                data.phuongPhapTinhThueGTGT === "khau_tru",
                                                        },
                                                        {
                                                            label: "Trực tiếp trên GTGT",
                                                            checked: data.phuongPhapTinhThueGTGT === "truc_tiep_gtgt",
                                                        },
                                                        {
                                                            label: "Trực tiếp trên doanh số",
                                                            checked:
                                                                data.phuongPhapTinhThueGTGT === "truc_tiep_doanh_so",
                                                        },
                                                        {
                                                            label: "Không phải nộp thuế GTGT",
                                                            checked: data.phuongPhapTinhThueGTGT === "khong_nop",
                                                        },
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </SubSection>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiChuSoHuuHuongLoi") && (
                            <SubSection title="THÔNG BÁO THAY ĐỔI THÔNG TIN VỀ CHỦ SỞ HỮU HƯỞNG LỢI CỦA DOANH NGHIỆP/THÔNG BÁO THAY ĐỔI THÔNG TIN ĐỂ XÁC ĐỊNH CHỦ SỞ HỮU HƯỞNG LỢI">
                                <BeneficialOwnerChangeList data={data} />
                            </SubSection>
                        )}
                    </>
                )}

                {isMainSelected("B") && (
                    <Section title={getMainOptionLabel("B")}>
                        <Line
                            label="Nội dung bổ sung, cập nhật thông tin đăng ký doanh nghiệp"
                            value={data.boSungCapNhat_noiDung}
                        />
                    </Section>
                )}

                {isMainSelected("C") && (
                    <Section title={getMainOptionLabel("C")}>
                        <>
                            <p>
                                - Thông tin trên Giấy chứng nhận đăng ký doanh nghiệp/Giấy xác nhận về việc thay đổi nội
                                dung đăng ký doanh nghiệp cấp ngày {formatDate(data.hieuDinh_ngayCapGiay) || ""} là{" "}
                                {data.hieuDinh_thongTinTrenGiay || ""}.
                            </p>
                            <p>
                                - Thông tin đã đăng ký trong hồ sơ đăng ký doanh nghiệp nộp ngày{" "}
                                {formatDate(data.hieuDinh_ngayNopHoSo) || ""} là {data.hieuDinh_thongTinHoSo || ""}.
                            </p>
                            <p>
                                Do vậy, đề nghị Quý Cơ quan hiệu đính thông tin trên Giấy chứng nhận đăng ký doanh
                                nghiệp, Giấy xác nhận về việc thay đổi nội dung đăng ký doanh nghiệp theo đúng thông tin
                                trong hồ sơ đăng ký doanh nghiệp mà doanh nghiệp đã đăng ký.
                            </p>
                        </>
                    </Section>
                )}

                <p style={{ marginTop: 16 }}>
                    <Checkbox checked={isTruthy(data.deNghiCapGiayXacNhan)} />
                    Đề nghị Quý Cơ quan cấp Giấy xác nhận thay đổi nội dung đăng ký doanh nghiệp cho doanh nghiệp đối
                    với các thông tin thay đổi nêu trên.
                </p>
                <p>
                    Trường hợp hồ sơ đăng ký doanh nghiệp hợp lệ, đề nghị Quý Cơ quan đăng công bố nội dung đăng ký
                    doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.
                </p>
                <p>
                    Doanh nghiệp cam kết hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung
                    thực của nội dung Thông báo này.
                </p>
                <p>
                    Người ký tại Thông báo này cam kết là người có quyền và nghĩa vụ thực hiện thủ tục đăng ký doanh
                    nghiệp theo quy định của pháp luật và Điều lệ công ty.
                </p>

                <table
                    className={`${styles.noBorderTable} signature-table no-border`}
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "none",
                        marginTop: 30,
                        marginBottom: 50,
                    }}
                >
                    <tbody>
                        <tr>
                            <td className="signature-spacer" style={{ border: "none", width: "50%" }}></td>
                            <td
                                className={`${styles.textCenter} signature-cell`}
                                style={{ border: "none", textAlign: "center", verticalAlign: "top" }}
                            >
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    <strong>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT</strong>
                                </p>
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    <em>(Ký và ghi họ tên)</em>
                                </p>
                                {data.nguoiKy_thongTin && (
                                    <p style={{ textAlign: "center", margin: "8px 0 0" }}>{data.nguoiKy_thongTin}</p>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GiayDeNghiDangKyThayDoiConfirmation;
