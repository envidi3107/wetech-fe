import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import nganhNgheStyles from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable.module.css";
import DateInput from "@/components/DateInput/DateInput";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import {
    A_CHANGE_OPTIONS,
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
    CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";
import { formatDate } from "@/utils/dateTimeUtils";
import { GioiTinhSelect, ChucDanhSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import NguonVonDieuLeSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/NguonVonDieuLeSection";
import TaiSanGopVonSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/TaiSanGopVonSection";
import numberToVietnameseText from "@/utils/numberToVietnameseText";
import { useAuth } from "@/context/AuthContext";
import { toUppercaseValue } from "../../../SharedFormComponents/uppercaseInput";

const SOURCE_FORM_NAME = "Giấy đề nghị đăng ký thay đổi nội dung giấy chứng nhận đăng ký doanh nghiệp";

const emptyContributionRow = {
    danhXung: "Ông",
    hoTen: "",
    giaTriTangGiam: "",
    phanVonSauThayDoi: "",
    soCoPhanSauThayDoi: "",
    tyLeSauThayDoi: "",
};

const defaultShareTypes = [
    { tenLoai: "Cổ phần phổ thông", soLuong: "", giaTri: "", tyLe: "" },
    { tenLoai: "Cổ phần ưu đãi biểu quyết", soLuong: "", giaTri: "", tyLe: "" },
    { tenLoai: "Cổ phần ưu đãi cổ tức", soLuong: "", giaTri: "", tyLe: "" },
    { tenLoai: "Cổ phần ưu đãi hoàn lại", soLuong: "", giaTri: "", tyLe: "" },
    { tenLoai: "Các cổ phần ưu đãi khác", soLuong: "", giaTri: "", tyLe: "" },
];

const emptyUnpaidShareholderRow = {
    danhXung: "Ông",
    hoTen: "",
    soTienChuaThanhToan: "",
    soCoPhanTuongDuong: "",
};

function getTodayInputValue() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${today.getFullYear()}-${month}-${day}`;
}

function parseNumber(value) {
    if (value === null || value === undefined || value === "") return null;

    const normalized = String(value)
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}

function formatNumber(value) {
    if (value === null || value === undefined || value === "") return "";
    const parsed = typeof value === "number" ? value : parseNumber(value);
    return parsed === null ? String(value) : parsed.toLocaleString("vi-VN");
}

function formatSignedNumber(value) {
    const parsed = parseNumber(value);
    if (parsed === null) return "";
    return formatNumber(Math.abs(parsed));
}

function getCapitalDifference(data) {
    const before = parseNumber(data.vonDieuLeDaDangKy);
    const after = parseNumber(data.vonDieuLeSauThayDoi);
    return before === null || after === null ? null : after - before;
}

function getFullCompanyName(value, prefix = DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX) {
    if (!value) return "";

    const displayValue = String(value).trim();
    const upperDisplayValue = displayValue.toLocaleUpperCase("vi-VN");
    const alreadyHasPrefix = CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS.some((knownPrefix) =>
        upperDisplayValue.startsWith(knownPrefix.toLocaleUpperCase("vi-VN")),
    );

    return alreadyHasPrefix ? displayValue : `${prefix} ${displayValue}`;
}

function getDecisionCompanyName(data) {
    return getFullCompanyName(
        data.tenDoanhNghiep || data.tenSauThayDoiVN,
        data.tenCongTyPrefix || data.tenSauThayDoiPrefix || DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
    );
}

function getChangedCompanyName(data) {
    return getFullCompanyName(
        data.tenSauThayDoiVN || data.tenDoanhNghiep,
        data.tenSauThayDoiPrefix || data.tenCongTyPrefix || DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
    );
}

function genderToDanhXung(gioiTinh) {
    return (gioiTinh || "").toLocaleLowerCase("vi-VN") === "nữ" ? "Bà" : "Ông";
}

function getSourceDefaultContributionRows(data) {
    if (data.doiCoDongSangLapList && data.doiCoDongSangLapList.length > 0) {
        return data.doiCoDongSangLapList.map((sourceRow, index) => {
            const qdRow = data.qdThanhVienGopVonList?.[index] || {};
            return {
                danhXung: qdRow.danhXung || sourceRow.danhXung || genderToDanhXung(sourceRow.gioiTinh),
                hoTen: sourceRow.hoTen || sourceRow.chuSoHuu || qdRow.hoTen || "",
                giaTriTangGiam: qdRow.giaTriTangGiam || sourceRow.giaTriTangGiam || "",
                phanVonSauThayDoi: sourceRow.phanVonSauThayDoi || sourceRow.tongSoCoPhan_giaTri || sourceRow.phanVonGop || qdRow.phanVonSauThayDoi || "",
                soCoPhanSauThayDoi: qdRow.soCoPhanSauThayDoi || sourceRow.tongSoCoPhan_soLuong || sourceRow.soCoPhan || "",
                tyLeSauThayDoi: sourceRow.tyLeSauThayDoi || sourceRow.tyLe || qdRow.tyLeSauThayDoi || "",
            };
        });
    }

    if (data.doiThanhVienList && data.doiThanhVienList.length > 0) {
        return data.doiThanhVienList.map((sourceRow, index) => {
            const qdRow = data.qdThanhVienGopVonList?.[index] || {};
            return {
                danhXung: qdRow.danhXung || sourceRow.danhXung || genderToDanhXung(sourceRow.gioiTinh),
                hoTen: sourceRow.hoTen || sourceRow.chuSoHuu || qdRow.hoTen || "",
                giaTriTangGiam: qdRow.giaTriTangGiam || sourceRow.giaTriTangGiam || "",
                phanVonSauThayDoi: sourceRow.phanVonSauThayDoi || sourceRow.phanVonGop || qdRow.phanVonSauThayDoi || "",
                tyLeSauThayDoi: sourceRow.tyLeSauThayDoi || sourceRow.tyLe || qdRow.tyLeSauThayDoi || "",
            };
        });
    }

    const sourceRows = data.qdThanhVienGopVonList || data.thanhVienList || data.coDongList || [];
    if (sourceRows.length) {
        return sourceRows.map((row) => ({
            danhXung: row.danhXung || genderToDanhXung(row.gioiTinh),
            hoTen: row.hoTen || row.chuSoHuu || "",
            giaTriTangGiam: row.giaTriTangGiam || "",
            phanVonSauThayDoi: row.phanVonSauThayDoi || row.phanVonGop || "",
            soCoPhanSauThayDoi: row.soCoPhanSauThayDoi || row.soCoPhan || "",
            tyLeSauThayDoi: row.tyLeSauThayDoi || row.tyLe || "",
        }));
    }

    const ownerName = data.chuSoHuu_hoTen || data.nguoiDaiDien_hoTen || data.qdChuTichDaiHoiDongCoDong || "";
    const diff = getCapitalDifference(data);
    const gioiTinh = data.chuSoHuu_gioiTinh || data.nguoiDaiDien_gioiTinh || "";
    return [
        {
            danhXung: genderToDanhXung(gioiTinh),
            hoTen: ownerName,
            giaTriTangGiam: diff === null ? "" : formatNumber(Math.abs(diff)),
            phanVonSauThayDoi: data.vonDieuLeSauThayDoi || "",
            soCoPhanSauThayDoi: "",
            tyLeSauThayDoi: data.vonDieuLeSauThayDoi ? "100" : "",
        },
    ];
}

function getSourceDefaultUnpaidRows(data) {
    if (data.qdUnpaidShareholdersList && data.qdUnpaidShareholdersList.length > 0) {
        return data.qdUnpaidShareholdersList;
    }
    const coDongList = data.doiCoDongSangLapList || data.coDongList || [];
    if (coDongList.length > 0) {
        return coDongList.map((row) => ({
            danhXung: row.danhXung || genderToDanhXung(row.gioiTinh),
            hoTen: row.hoTen || "",
            soTienChuaThanhToan: "",
            soCoPhanTuongDuong: "",
        }));
    }
    return [];
}

function getSourceDefaultShareTypesRows(data) {
    if (data.qdShareTypesList && data.qdShareTypesList.length > 0) {
        return data.qdShareTypesList;
    }

    return [
        { tenLoai: "Cổ phần phổ thông", soLuong: data.cp_cptt_soLuong || "", giaTri: data.cp_cptt_giaTri || "", tyLe: data.cp_cptt_tiLe || "" },
        { tenLoai: "Cổ phần ưu đãi biểu quyết", soLuong: data.cp_cpudbq_soLuong || "", giaTri: data.cp_cpudbq_giaTri || "", tyLe: data.cp_cpudbq_tiLe || "" },
        { tenLoai: "Cổ phần ưu đãi cổ tức", soLuong: data.cp_cpudct_soLuong || "", giaTri: data.cp_cpudct_giaTri || "", tyLe: data.cp_cpudct_tiLe || "" },
        { tenLoai: "Cổ phần ưu đãi hoàn lại", soLuong: data.cp_cpudhl_soLuong || "", giaTri: data.cp_cpudhl_giaTri || "", tyLe: data.cp_cpudhl_tiLe || "" },
        { tenLoai: "Các cổ phần ưu đãi khác", soLuong: data.cp_cpudk_soLuong || "", giaTri: data.cp_cpudk_giaTri || "", tyLe: data.cp_cpudk_tiLe || "" },
    ];
}

function applyDecisionDefaults(data, contributionRows) {
    const nextData = { ...data };
    const diff = getCapitalDifference(nextData);
    const afterCapital = nextData.vonDieuLeSauThayDoi || nextData.nguonVon_tongCong_soTien || "";

    if (!nextData.qdDiaDiemLap) {
        nextData.qdDiaDiemLap = nextData.kinhGuiProvince || nextData.truSo_tinh || "";
    }

    if (diff !== null) {
        nextData.qdVonChenhLech = formatNumber(Math.abs(diff));
        nextData.qdVonChenhLechRaw = String(diff);
    }

    if (nextData.hinhThucTangGiamVon) {
        nextData.qdHinhThucTangGiamVon = nextData.hinhThucTangGiamVon;
    } else if (!nextData.qdHinhThucTangGiamVon) {
        if (diff > 0) nextData.qdHinhThucTangGiamVon = "Tăng vốn";
        if (diff < 0) nextData.qdHinhThucTangGiamVon = "Giảm vốn";
    }

    if (afterCapital) {
        if (!nextData.nguonVon_tuNhan_soTien) nextData.nguonVon_tuNhan_soTien = afterCapital;
        if (!nextData.nguonVon_tuNhan_tyLe) nextData.nguonVon_tuNhan_tyLe = "100";
        if (!nextData.nguonVon_tongCong_soTien) nextData.nguonVon_tongCong_soTien = afterCapital;
        if (!nextData.nguonVon_tongCong_tyLe) nextData.nguonVon_tongCong_tyLe = "100";
        if (!nextData.taiSan_dongVN_giaTri) nextData.taiSan_dongVN_giaTri = afterCapital;
        if (!nextData.taiSan_dongVN_tyLe) nextData.taiSan_dongVN_tyLe = "100";
        if (!nextData.taiSan_tongSo_giaTri) nextData.taiSan_tongSo_giaTri = afterCapital;
        if (!nextData.taiSan_tongSo_tyLe) nextData.taiSan_tongSo_tyLe = "100";
    }

    if (!nextData.qdNguoiDaiDien_hoTen) nextData.qdNguoiDaiDien_hoTen = nextData.nguoiDaiDien_hoTen || "";
    if (!nextData.qdNguoiDaiDien_gioiTinh) nextData.qdNguoiDaiDien_gioiTinh = nextData.nguoiDaiDien_gioiTinh || "";
    if (!nextData.qdNguoiDaiDien_ngaySinh) nextData.qdNguoiDaiDien_ngaySinh = nextData.nguoiDaiDien_ngaySinh || "";
    if (!nextData.qdNguoiDaiDien_cccd) nextData.qdNguoiDaiDien_cccd = nextData.nguoiDaiDien_cccd || "";
    if (!nextData.qdNguoiDaiDien_chucDanh) nextData.qdNguoiDaiDien_chucDanh = nextData.nguoiDaiDien_chucDanh || "";
    if (!nextData.qdNguoiDaiDien_phone) nextData.qdNguoiDaiDien_phone = nextData.nguoiDaiDien_phone || "";
    if (!nextData.qdNguoiDaiDien_email) nextData.qdNguoiDaiDien_email = nextData.nguoiDaiDien_email || "";
    if (!nextData.qdNguoiDaiDien_diaChi) {
        nextData.qdNguoiDaiDien_diaChi = [
            nextData.qdNguoiDaiDien_soNha || nextData.nguoiDaiDien_soNha,
            nextData.qdNguoiDaiDien_xa || nextData.nguoiDaiDien_xa,
            nextData.qdNguoiDaiDien_tinh || nextData.nguoiDaiDien_tinh,
        ]
            .filter(Boolean)
            .join(", ");
    }

    nextData.qdThanhVienGopVonList = contributionRows;

    if (!nextData.qdShareTypesList) {
        nextData.qdShareTypesList = defaultShareTypes;
    }
    if (!nextData.qdUnpaidShareholdersList) {
        nextData.qdUnpaidShareholdersList = [];
    }

    return nextData;
}

function Field({ label, name, data, required = false, children }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>
            {children || (
                <input className={styles.input} name={name} defaultValue={data?.[name] || ""} required={required} />
            )}
        </div>
    );
}

function ReadOnlyField({ label, value }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>{label}</label>
            <input className={styles.input} value={value || ""} readOnly />
        </div>
    );
}

function BusinessRowsPreview({ title, rows, removed = false }) {
    if (!rows?.length) return null;

    return (
        <div className={styles.formGroup}>
            <h4 className={styles.label}>{title}</h4>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ width: 60 }}>STT</th>
                        <th>{removed ? "Tên ngành, nghề kinh doanh được bỏ" : "Tên ngành, nghề kinh doanh"}</th>
                        <th style={{ width: 140 }}>Mã ngành</th>
                        {!removed && <th style={{ width: 160 }}>Ngành chính</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td>
                                <div>{row.tenNganh}</div>
                                {row.chiTiet && <div style={{ fontStyle: "italic" }}>{row.chiTiet}</div>}
                            </td>
                            <td style={{ textAlign: "center" }}>{row.maNganh}</td>
                            {!removed && <td style={{ textAlign: "center" }}>{row.laNganhChinh ? "X" : ""}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ContributionRowsTable({ rows, onChangeRows, totalCapital }) {
    const updateRow = (index, field, value) => {
        const nextRows = [...rows];
        const updatedRow = { ...nextRows[index], [field]: value };

        if (field === "phanVonSauThayDoi") {
            const pVal = parseNumber(value);
            const tVal = parseNumber(totalCapital);
            if (pVal !== null && tVal !== null && tVal > 0) {
                const percent = (pVal / tVal) * 100;
                updatedRow.tyLeSauThayDoi = Number.isInteger(percent) ? percent.toString() : percent.toFixed(4).replace(/\.?0+$/, "");
            } else if (value === "") {
                updatedRow.tyLeSauThayDoi = "";
            }
        }

        nextRows[index] = updatedRow;
        onChangeRows(nextRows);
    };

    const handleNumberChange = (index, field, value) => {
        const raw = String(value).replace(/[^\d]/g, "");
        updateRow(index, field, raw ? formatNumber(raw) : "");
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th style={{ width: 60 }}>STT</th>
                    <th>Tên Ông/Bà/Cổ đông</th>
                    <th>Số cổ phần sở hữu</th>
                    <th>Giá trị vốn góp sau thay đổi</th>
                    <th style={{ width: 120 }}>Tỷ lệ (%)</th>
                    <th style={{ width: 90 }}></th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td>
                            <div className={styles.inputPrefixWrapper}>
                                <select
                                    className={styles.prefixSelect}
                                    value={row.danhXung || "Ông"}
                                    onChange={(e) => updateRow(index, "danhXung", e.target.value)}
                                >
                                    <option value="Ông">Ông</option>
                                    <option value="Bà">Bà</option>
                                    <option value="Tổ chức">Tổ chức</option>
                                </select>
                                <input
                                    className={styles.inputNoBorder}
                                    value={row.hoTen || ""}
                                    onChange={(event) => updateRow(index, "hoTen", event.target.value)}
                                    required
                                />
                            </div>
                        </td>
                        <td>
                            <input
                                className={styles.input}
                                value={row.soCoPhanSauThayDoi || ""}
                                onChange={(event) => handleNumberChange(index, "soCoPhanSauThayDoi", event.target.value)}
                                required
                            />
                        </td>
                        <td>
                            <input
                                className={styles.input}
                                value={row.phanVonSauThayDoi || ""}
                                onChange={(event) => handleNumberChange(index, "phanVonSauThayDoi", event.target.value)}
                                required
                            />
                        </td>
                        <td>
                            <input
                                className={styles.input}
                                value={row.tyLeSauThayDoi || ""}
                                onChange={(event) => updateRow(index, "tyLeSauThayDoi", event.target.value)}
                                required
                            />
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => onChangeRows(rows.filter((_, rowIndex) => rowIndex !== index))}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    color: "#c0392b",
                                    cursor: "pointer",
                                }}
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ShareTypesTable({ rows, onChangeRows }) {
    const updateRow = (index, field, value) => {
        const nextRows = [...rows];
        nextRows[index] = { ...nextRows[index], [field]: value };
        onChangeRows(nextRows);
    };

    const handleNumberChange = (index, field, value) => {
        const raw = String(value).replace(/[^\d]/g, "");
        updateRow(index, field, raw ? formatNumber(raw) : "");
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th style={{ width: 60 }}>STT</th>
                    <th>Loại cổ phần</th>
                    <th>Số lượng</th>
                    <th>Giá trị (bằng số, VNĐ)</th>
                    <th>Tỉ lệ so với vốn điều lệ (%)</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td>{row.tenLoai}</td>
                        <td>
                            <input
                                className={styles.input}
                                value={row.soLuong || ""}
                                onChange={(e) => handleNumberChange(index, "soLuong", e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className={styles.input}
                                value={row.giaTri || ""}
                                onChange={(e) => handleNumberChange(index, "giaTri", e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className={styles.input}
                                value={row.tyLe || ""}
                                onChange={(e) => updateRow(index, "tyLe", e.target.value)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function UnpaidShareholdersTable({ rows, onChangeRows, menhGiaCoPhan }) {
    const updateRow = (index, field, value) => {
        const nextRows = [...rows];
        nextRows[index] = { ...nextRows[index], [field]: value };
        onChangeRows(nextRows);
    };

    const handleNumberChange = (index, field, value) => {
        const raw = String(value).replace(/[^\d]/g, "");
        const formatted = raw ? formatNumber(raw) : "";

        if (field === "soTienChuaThanhToan") {
            const nextRows = [...rows];
            nextRows[index] = { ...nextRows[index], [field]: formatted };

            const menhGia = parseInt(String(menhGiaCoPhan || "10000").replace(/[^\d]/g, ""), 10);
            if (raw && menhGia) {
                const coPhan = parseInt(raw, 10) / menhGia;
                nextRows[index].soCoPhanTuongDuong = formatNumber(coPhan);
            } else {
                nextRows[index].soCoPhanTuongDuong = "";
            }
            onChangeRows(nextRows);
        } else {
            updateRow(index, field, formatted);
        }
    };

    if (!rows || rows.length === 0) return null;

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th style={{ width: 60 }}>STT</th>
                    <th>Tên Ông/Bà/Cổ đông</th>
                    <th>Số tiền chưa thanh toán (VNĐ)</th>
                    <th>Số cổ phần tương đương</th>
                    <th style={{ width: 90 }}></th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td>
                            <div className={styles.inputPrefixWrapper}>
                                <select
                                    className={styles.prefixSelect}
                                    value={row.danhXung || "Ông"}
                                    onChange={(e) => updateRow(index, "danhXung", e.target.value)}
                                >
                                    <option value="Ông">Ông</option>
                                    <option value="Bà">Bà</option>
                                    <option value="Tổ chức">Tổ chức</option>
                                </select>
                                <input
                                    className={styles.inputNoBorder}
                                    value={row.hoTen || ""}
                                    onChange={(event) => updateRow(index, "hoTen", event.target.value)}
                                    required
                                />
                            </div>
                        </td>
                        <td>
                            <input
                                className={styles.input}
                                value={row.soTienChuaThanhToan || ""}
                                onChange={(event) => handleNumberChange(index, "soTienChuaThanhToan", event.target.value)}
                                required
                            />
                        </td>
                        <td>
                            <input
                                className={styles.input}
                                value={row.soCoPhanTuongDuong || ""}
                                onChange={(event) => handleNumberChange(index, "soCoPhanTuongDuong", event.target.value)}
                                required
                            />
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => onChangeRows(rows.filter((_, rowIndex) => rowIndex !== index))}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    color: "#c0392b",
                                    cursor: "pointer",
                                }}
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const QuyetDinhDaiHoiDongCoDongDeclaration = forwardRef(function QuyetDinhDaiHoiDongCoDongDeclaration(
    { dataJson, onSubmit, formRef },
    componentRef,
) {
    const { user } = useAuth()
    const sourceFormData = useGetFormDataJsonFromName(SOURCE_FORM_NAME);
    const currentData = useMemo(() => normalizeDataJson(dataJson), [dataJson]);
    const sourceData = useMemo(() => normalizeDataJson(sourceFormData), [sourceFormData]);
    const mergedData = useMemo(() => {
        const merged = { ...currentData };
        for (const [key, value] of Object.entries(sourceData)) {
            if (value !== undefined && value !== null) {
                merged[key] = value;
            }
        }
        return merged;
    }, [currentData, sourceData]);
    const [contributionRows, setContributionRows] = useState([emptyContributionRow]);
    const [shareTypesRows, setShareTypesRows] = useState(defaultShareTypes);
    const [unpaidRows, setUnpaidRows] = useState([]);
    const [showRepresentative, setShowRepresentative] = useState(false);

    const [qdNguoiDaiDienProv, setQdNguoiDaiDienProv] = useState("");
    const { provinces: nddProvinces, communes: nddCommunes, loadingCommunes: nddLoadingCommunes } = useFetchAddress(qdNguoiDaiDienProv);

    const [localRepCard, setLocalRepCard] = useState({});
    const [repKey, setRepKey] = useState(0);

    const handleFillRepCard = (card) => {
        const nextRepCard = {
            qdNguoiDaiDien_hoTen: card.fullName || "",
            qdNguoiDaiDien_gioiTinh: card.gender || "",
            qdNguoiDaiDien_ngaySinh: card.dob || "",
            qdNguoiDaiDien_cccd: card.cccd || "",
            qdNguoiDaiDien_chucDanh: card.position || card.chucVu || "",
            qdNguoiDaiDien_tinh: card.currentAddress?.province || "",
            qdNguoiDaiDien_xa: card.currentAddress?.ward || "",
            qdNguoiDaiDien_soNha: card.currentAddress?.street || "",
            qdNguoiDaiDien_phone: card.phone || "",
            qdNguoiDaiDien_email: card.email || "",
        };
        setLocalRepCard(nextRepCard);
        if (card.currentAddress?.province) {
            setQdNguoiDaiDienProv(card.currentAddress.province);
        }
        setRepKey((prev) => prev + 1);
    };

    useEffect(() => {
        setContributionRows(getSourceDefaultContributionRows(mergedData));
        setShareTypesRows(getSourceDefaultShareTypesRows(mergedData));
        if (mergedData.qdUnpaidShareholdersList && mergedData.qdUnpaidShareholdersList.length > 0) {
            setUnpaidRows(mergedData.qdUnpaidShareholdersList);
        } else {
            setUnpaidRows(getSourceDefaultUnpaidRows(mergedData));
        }
    }, [mergedData]);

    useEffect(() => {
        setShowRepresentative(isTruthy(mergedData.qdDoiNguoiDaiDienPhapLuat));
    }, [mergedData.qdDoiNguoiDaiDienPhapLuat]);

    const baseDecisionData = applyDecisionDefaults(mergedData, contributionRows);
    const decisionData = useMemo(() => {
        return {
            ...baseDecisionData,
            ...localRepCard
        };
    }, [baseDecisionData, localRepCard]);
    const capitalDiff = getCapitalDifference(decisionData);
    const selectedChangeOptions = A_CHANGE_OPTIONS.filter((option) => isTruthy(decisionData[option.name]));
    const hasSourceData = Object.keys(sourceData).length > 0;
    const formKey = `${hasSourceData ? "source" : "no-source"}-${dataJson ? "saved" : "new"}`;

    const collectData = () => {
        if (!formRef?.current) return null;
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return null;
        }

        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());
        formValues.qdSuaDoiDieuLe = formData.get("qdSuaDoiDieuLe") ? "true" : "false";
        formValues.qdDoiNguoiDaiDienPhapLuat = formData.get("qdDoiNguoiDaiDienPhapLuat") ? "true" : "false";

        return applyDecisionDefaults({
            ...decisionData,
            ...formValues,
            qdShareTypesList: shareTypesRows,
            qdUnpaidShareholdersList: unpaidRows
        }, contributionRows);
    };

    useImperativeHandle(componentRef, () => ({
        getDraftData: collectData,
        getExportData: collectData,
        importData: () => { },
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = collectData();
        if (data && onSubmit) onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={formKey}>
            {!hasSourceData && (
                <p className={styles.note}>
                    Chưa tìm thấy dữ liệu từ form Giấy đề nghị đăng ký thay đổi. Bạn có thể quay lại lưu form đó trước,
                    hoặc nhập các trường riêng của quyết định tại đây.
                </p>
            )}

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Thông tin quyết định</h3>
                <div className={styles.grid2}>
                    <Field label="Địa điểm lập quyết định" name="qdDiaDiemLap" data={decisionData} required />
                    <Field label="Ngày quyết định" name="qdNgayQuyetDinh" data={decisionData} required>
                        <DateInput
                            name="qdNgayQuyetDinh"
                            className={styles.input}
                            defaultValue={decisionData.qdNgayQuyetDinh || getTodayInputValue()}
                            required
                        />
                    </Field>
                    <Field label="Ngày biên bản họp ĐHĐCĐ" name="qdNgayBienBanHop" data={decisionData} required>
                        <DateInput
                            name="qdNgayBienBanHop"
                            className={styles.input}
                            defaultValue={
                                decisionData.qdNgayBienBanHop || decisionData.qdNgayQuyetDinh || getTodayInputValue()
                            }
                            required
                        />
                    </Field>
                    <Field label="Người được giao tiến hành các thủ tục cần thiết" required>
                        <div className={styles.inputPrefixWrapper}>
                            <select
                                name="qdNguoiThucHienThuTuc_danhXung"
                                className={styles.prefixSelect}
                                defaultValue={
                                    decisionData.qdNguoiThucHienThuTuc_danhXung ||
                                    ((decisionData.nguoiDaiDien_gioiTinh || "").toLocaleLowerCase("vi-VN") === "nữ"
                                        ? "Bà"
                                        : "Ông")
                                }
                            >
                                <option value="Ông">Ông</option>
                                <option value="Bà">Bà</option>
                            </select>
                            <input
                                className={styles.inputNoBorder}
                                name="qdNguoiThucHienThuTuc"
                                defaultValue={
                                    toUppercaseValue(
                                        user?.fullname ||
                                        decisionData.qdNguoiThucHienThuTuc ||
                                        decisionData.nguoiDaiDien_hoTen ||
                                        decisionData.chuSoHuu_hoTen ||
                                        ""
                                    )
                                }
                                required
                            />
                        </div>
                    </Field>
                </div>
            </div>

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Thông tin thay đổi</h3>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nội dung thay đổi đã chọn</label>
                    <div
                        className={styles.radioGroup}
                        style={{ alignItems: "flex-start", flexDirection: "column", gap: 4 }}
                    >
                        {selectedChangeOptions.length ? (
                            selectedChangeOptions.map((option) => (
                                <label key={option.name} className={styles.radioLabel}>
                                    <input type="checkbox" checked readOnly className={styles.radioInput} />
                                    {option.label}
                                </label>
                            ))
                        ) : (
                            <span className={styles.note}>Chưa có nội dung thay đổi tại Mục A.</span>
                        )}
                    </div>
                </div>
                <div className={styles.grid2}>
                    <ReadOnlyField label="Tên doanh nghiệp" value={getDecisionCompanyName(decisionData)} />
                    <ReadOnlyField label="Mã số doanh nghiệp/Mã số thuế" value={decisionData.maSoDoanhNghiep} />
                </div>
            </div>

            {isTruthy(decisionData.a_doiVonDieuLe) && (
                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>Nội dung thay đổi vốn điều lệ</h3>
                    <div className={styles.grid2}>
                        <ReadOnlyField label="Vốn điều lệ đã đăng ký" value={decisionData.vonDieuLeDaDangKy} />
                        <ReadOnlyField label="Vốn điều lệ sau khi thay đổi" value={decisionData.vonDieuLeSauThayDoi} />
                        <ReadOnlyField
                            label="Hình thức tăng/giảm vốn điều lệ"
                            value={decisionData.qdHinhThucTangGiamVon}
                        />
                        <ReadOnlyField label="Thời điểm tăng/giảm vốn" value={formatDate(decisionData.thoiDiemThayDoiVon)} />
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <div style={{ marginBottom: 12, color: "#505050", fontSize: "14px", fontWeight: 500, lineHeight: "34px" }}>
                            Tổng số vốn các cổ đông chưa thanh toán đầy đủ và đúng hạn là{" "}
                            <input
                                className={styles.input}
                                style={{ display: "inline-block", width: "150px", padding: "0 8px", minHeight: "32px", height: "32px", margin: "0 4px" }}
                                name="qdTongVonChuaThanhToan"
                                defaultValue={decisionData.qdTongVonChuaThanhToan || ""}
                                onChange={(e) => {
                                    const raw = String(e.target.value).replace(/[^\d]/g, "");
                                    e.target.value = raw ? formatNumber(raw) : "";

                                    const inputBangChu = document.querySelector('input[name="qdTongVonChuaThanhToanBangChu"]');
                                    if (inputBangChu) {
                                        inputBangChu.value = raw ? numberToVietnameseText(raw) : "";
                                    }

                                    const menhGia = parseNumber(decisionData.qdMenhGiaCoPhan || "10000");
                                    const inputCoPhan = document.querySelector('input[name="qdTongCoPhanChuaThanhToan"]');
                                    if (inputCoPhan && raw && menhGia) {
                                        const coPhan = parseInt(raw) / menhGia;
                                        inputCoPhan.value = formatNumber(coPhan);
                                    } else if (inputCoPhan) {
                                        inputCoPhan.value = "";
                                    }
                                }}
                            />
                            VNĐ (
                            <input
                                className={styles.input}
                                style={{ display: "inline-block", width: "220px", padding: "0 8px", minHeight: "32px", height: "32px", margin: "0 4px" }}
                                name="qdTongVonChuaThanhToanBangChu"
                                defaultValue={decisionData.qdTongVonChuaThanhToanBangChu || (decisionData.qdTongVonChuaThanhToan ? numberToVietnameseText(String(decisionData.qdTongVonChuaThanhToan).replace(/[^\d]/g, "")) : "")}
                            />
                            ) tương đương{" "}
                            <input
                                className={styles.input}
                                style={{ display: "inline-block", width: "100px", padding: "0 8px", background: "#f5f5f5", minHeight: "32px", height: "32px", margin: "0 4px" }}
                                name="qdTongCoPhanChuaThanhToan"
                                defaultValue={decisionData.qdTongCoPhanChuaThanhToan || ""}
                                readOnly
                            />
                            cổ phần, trong đó:
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                            <h3 className={styles.sectionTitle}>Danh sách cổ đông chưa thanh toán:</h3>
                            <button
                                type="button"
                                onClick={() => setUnpaidRows([...unpaidRows, { ...emptyUnpaidShareholderRow }])}
                                className={nganhNgheStyles.btnPrimary}
                            >
                                Thêm cổ đông
                            </button>
                        </div>
                        <UnpaidShareholdersTable rows={unpaidRows} onChangeRows={setUnpaidRows} menhGiaCoPhan={decisionData.qdMenhGiaCoPhan} />

                        <div style={{ marginTop: 24, pointerEvents: "none", opacity: 0.9 }}>
                            <NguonVonDieuLeSection title="Nguồn vốn điều lệ sau khi thay đổi vốn điều lệ" dataJson={decisionData} styles={styles} isNote />
                            <TaiSanGopVonSection title="Tài sản góp vốn sau khi thay đổi vốn điều lệ" dataJson={decisionData} styles={styles} fieldPrefix="taiSan" />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 className={styles.sectionTitle}>Thông tin về cổ phần:</h4>
                    </div>
                    <div>
                        <Field label="Mệnh giá cổ phần (đồng/1 cổ phần)" name="qdMenhGiaCoPhan" data={{ qdMenhGiaCoPhan: decisionData.qdMenhGiaCoPhan || "10.000" }} required />
                        <ShareTypesTable rows={shareTypesRows} onChangeRows={setShareTypesRows} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center", marginTop: 20 }}>
                        <h3 className={styles.sectionTitle}>Trong đó cơ cấu góp vốn (danh sách cổ đông) sau thay đổi vốn điều lệ:</h3>
                        <button
                            type="button"
                            onClick={() => setContributionRows([...contributionRows, { ...emptyContributionRow }])}
                            className={nganhNgheStyles.btnPrimary}
                        >
                            Thêm dòng góp vốn
                        </button>
                    </div>
                    <ContributionRowsTable rows={contributionRows} onChangeRows={setContributionRows} totalCapital={decisionData.vonDieuLeSauThayDoi} />
                </div>
            )}

            {isTruthy(decisionData.a_doiNganhNghe) && (
                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>Thay đổi ngành, nghề kinh doanh</h3>
                    <BusinessRowsPreview
                        title="Bổ sung ngành, nghề kinh doanh sau"
                        rows={decisionData.nganhNgheBoSungList}
                    />
                    <BusinessRowsPreview
                        title="Bỏ ngành, nghề kinh doanh sau"
                        rows={decisionData.nganhNgheBoList}
                        removed
                    />
                    <BusinessRowsPreview
                        title="Sửa đổi chi tiết ngành, nghề kinh doanh"
                        rows={decisionData.nganhNgheSuaList}
                    />
                </div>
            )}

            {isTruthy(decisionData.a_doiTen) && (
                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>Tên doanh nghiệp sau khi thay đổi</h3>
                    <div className={styles.grid2}>
                        <ReadOnlyField label="Tên tiếng Việt" value={getChangedCompanyName(decisionData)} />
                        <ReadOnlyField label="Tên tiếng nước ngoài" value={decisionData.tenSauThayDoiEN} />
                        <ReadOnlyField label="Tên viết tắt" value={decisionData.tenSauThayDoiVietTat} />
                    </div>
                </div>
            )}

            {isTruthy(decisionData.a_doiDiaChi) && (
                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>Địa chỉ trụ sở chính sau khi thay đổi</h3>
                    <div className={styles.grid2}>
                        <ReadOnlyField label="Số nhà, đường" value={decisionData.truSo_soNha} />
                        <ReadOnlyField label="Xã/Phường/Đặc khu" value={decisionData.truSo_xa} />
                        <ReadOnlyField label="Tỉnh/Thành phố" value={decisionData.truSo_tinh} />
                        <ReadOnlyField label="Điện thoại" value={decisionData.truSo_phone} />
                        <ReadOnlyField label="Fax" value={decisionData.truSo_fax} />
                        <ReadOnlyField label="Email" value={decisionData.truSo_email} />
                        <ReadOnlyField label="Website" value={decisionData.truSo_website} />
                    </div>
                </div>
            )}

            <div className={styles.sectionGroup}>
                <label className={styles.radioLabel}>
                    <input
                        type="checkbox"
                        name="qdDoiNguoiDaiDienPhapLuat"
                        value="true"
                        className={styles.radioInput}
                        checked={showRepresentative}
                        onChange={(e) => setShowRepresentative(e.target.checked)}
                    />
                    Bổ sung mục thay đổi người đại diện theo pháp luật trong quyết định.
                </label>
                {showRepresentative && (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                                Thông tin người đại diện theo pháp luật sau khi thay đổi:
                            </h3>
                            <UserCardDropdown onSelect={handleFillRepCard} />
                        </div>
                        <div key={`rep-${repKey}`}>
                            <div className={styles.grid2}>
                                <Field label="Họ, chữ đệm và tên (ghi bằng chữ in hoa)" name="qdNguoiDaiDien_hoTen" data={decisionData} required>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name="qdNguoiDaiDien_hoTen"
                                        defaultValue={(decisionData.qdNguoiDaiDien_hoTen || "").toUpperCase()}
                                        style={{ textTransform: "uppercase" }}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                        required
                                    />
                                </Field>
                                <Field label="Ngày sinh" name="qdNguoiDaiDien_ngaySinh" data={decisionData} required>
                                    <DateInput
                                        name="qdNguoiDaiDien_ngaySinh"
                                        className={styles.input}
                                        defaultValue={
                                            decisionData.qdNguoiDaiDien_ngaySinh || decisionData.nguoiDaiDien_ngaySinh || ""
                                        }
                                        required
                                    />
                                </Field>
                                <GioiTinhSelect name="qdNguoiDaiDien_gioiTinh" defaultValue={decisionData.qdNguoiDaiDien_gioiTinh} required />
                                <Field label="Số định danh cá nhân" name="qdNguoiDaiDien_cccd" data={decisionData} required />
                                <ChucDanhSelect name="qdNguoiDaiDien_chucDanh" defaultValue={decisionData.qdNguoiDaiDien_chucDanh} required />
                            </div>
                            <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>Địa chỉ liên lạc:</h3>
                            <AddressSelect
                                provinces={nddProvinces}
                                communes={nddCommunes}
                                onProvinceChange={setQdNguoiDaiDienProv}
                                provinceName="qdNguoiDaiDien_tinh"
                                wardName="qdNguoiDaiDien_xa"
                                houseNumberName="qdNguoiDaiDien_soNha"
                                provinceDefault={decisionData.qdNguoiDaiDien_tinh || decisionData.nguoiDaiDien_tinh || ""}
                                wardDefault={decisionData.qdNguoiDaiDien_xa || decisionData.nguoiDaiDien_xa || ""}
                                houseNumberDefault={decisionData.qdNguoiDaiDien_soNha || decisionData.nguoiDaiDien_soNha || ""}
                                isLoadingCommunes={nddLoadingCommunes}
                            />
                            <div className={styles.grid2} style={{ marginTop: "8px" }}>
                                <Field label="Điện thoại (nếu có)" name="qdNguoiDaiDien_phone" data={decisionData} />
                                <Field label="Thư điện tử (nếu có)" name="qdNguoiDaiDien_email" data={decisionData} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </form>
    );
});

export default QuyetDinhDaiHoiDongCoDongDeclaration;
