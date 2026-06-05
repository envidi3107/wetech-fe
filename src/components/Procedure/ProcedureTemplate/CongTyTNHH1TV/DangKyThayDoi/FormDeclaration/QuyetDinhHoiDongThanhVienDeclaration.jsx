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
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";
import { formatDate } from "@/utils/dateTimeUtils";
import {
    GioiTinhSelect,
    ChucDanhSelect,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import { toUppercaseValue } from "../../../SharedFormComponents/uppercaseInput";
import { useAuth } from "@/context/AuthContext";

const SOURCE_FORM_NAME = "Giấy đề nghị đăng ký thay đổi nội dung giấy chứng nhận đăng ký doanh nghiệp";
const MEMBER_POSITION_OPTIONS = ["Chủ tịch hội đồng thành viên", "Thành viên"];

function getDefaultMemberPosition(index) {
    return index === 0 ? MEMBER_POSITION_OPTIONS[0] : MEMBER_POSITION_OPTIONS[1];
}

const emptyContributionRow = {
    danhXung: "Ông",
    hoTen: "",
    chucVu: getDefaultMemberPosition(0),
    giaTriTangGiam: "",
    phanVonSauThayDoi: "",
    tyLeSauThayDoi: "",
    ngayCapGiayChungNhan: "",
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

function getFullCompanyName(value, prefix = DEFAULT_TNHH_COMPANY_NAME_PREFIX) {
    if (!value) return "";

    const displayValue = String(value).trim();
    const upperDisplayValue = displayValue.toLocaleUpperCase("vi-VN");
    const alreadyHasPrefix = TNHH_COMPANY_NAME_PREFIX_OPTIONS.some((knownPrefix) =>
        upperDisplayValue.startsWith(knownPrefix.toLocaleUpperCase("vi-VN")),
    );

    return alreadyHasPrefix ? displayValue : `${prefix} ${displayValue}`;
}

function getDecisionCompanyName(data) {
    return getFullCompanyName(
        data.tenDoanhNghiep || data.tenSauThayDoiVN,
        data.tenCongTyPrefix || data.tenSauThayDoiPrefix || DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    );
}

function getChangedCompanyName(data) {
    return getFullCompanyName(
        data.tenSauThayDoiVN || data.tenDoanhNghiep,
        data.tenSauThayDoiPrefix || data.tenCongTyPrefix || DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    );
}

function getSourceDefaultContributionRows(data) {
    if (data.doiThanhVienList && data.doiThanhVienList.length > 0) {
        return data.doiThanhVienList.map((sourceRow, index) => {
            const qdRow = data.qdThanhVienGopVonList?.[index] || {};
            return {
                danhXung:
                    qdRow.danhXung ||
                    sourceRow.danhXung ||
                    ((sourceRow.gioiTinh || "").toLocaleLowerCase("vi-VN") === "nữ" ? "Bà" : "Ông"),
                hoTen: sourceRow.hoTen || sourceRow.chuSoHuu || qdRow.hoTen || "",
                chucVu: qdRow.chucVu || sourceRow.chucVu || getDefaultMemberPosition(index),
                giaTriTangGiam: qdRow.giaTriTangGiam || sourceRow.giaTriTangGiam || "",
                phanVonSauThayDoi: sourceRow.phanVonSauThayDoi || sourceRow.phanVonGop || qdRow.phanVonSauThayDoi || "",
                tyLeSauThayDoi: sourceRow.tyLeSauThayDoi || sourceRow.tyLe || qdRow.tyLeSauThayDoi || "",
                ngayCapGiayChungNhan: qdRow.ngayCapGiayChungNhan || sourceRow.ngayCapGiayChungNhan || "",
            };
        });
    }

    const sourceRows = data.qdThanhVienGopVonList || data.thanhVienList || [];
    if (sourceRows.length) {
        return sourceRows.map((row, index) => ({
            danhXung: row.danhXung || ((row.gioiTinh || "").toLocaleLowerCase("vi-VN") === "nữ" ? "Bà" : "Ông"),
            hoTen: row.hoTen || row.chuSoHuu || "",
            chucVu: row.chucVu || getDefaultMemberPosition(index),
            giaTriTangGiam: row.giaTriTangGiam || "",
            phanVonSauThayDoi: row.phanVonSauThayDoi || row.phanVonGop || "",
            tyLeSauThayDoi: row.tyLeSauThayDoi || row.tyLe || "",
            ngayCapGiayChungNhan: row.ngayCapGiayChungNhan || "",
        }));
    }

    const ownerName = data.chuSoHuu_hoTen || data.nguoiDaiDien_hoTen || data.qdChuTichHoiDongThanhVien || "";
    const diff = getCapitalDifference(data);
    const gioiTinh = data.chuSoHuu_gioiTinh || data.nguoiDaiDien_gioiTinh || "";
    return [
        {
            danhXung: gioiTinh.toLocaleLowerCase("vi-VN") === "nữ" ? "Bà" : "Ông",
            hoTen: ownerName,
            giaTriTangGiam: diff === null ? "" : formatNumber(Math.abs(diff)),
            phanVonSauThayDoi: data.vonDieuLeSauThayDoi || "",
            tyLeSauThayDoi: data.vonDieuLeSauThayDoi ? "100" : "",
            chucVu: getDefaultMemberPosition(0),
            ngayCapGiayChungNhan: "",
        },
    ];
}

function normalizeContributionRows(rows = []) {
    return rows.map((row, index) => ({
        ...row,
        chucVu: row.chucVu || getDefaultMemberPosition(index),
        ngayCapGiayChungNhan: row.ngayCapGiayChungNhan || "",
    }));
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

    nextData.qdThanhVienGopVonList = normalizeContributionRows(contributionRows);
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
            <h4 className={styles.sectionTitle}>{title}</h4>
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

function ContributionRowsTable({ rows, onChangeRows, totalCapital, showCertificateIssuedDate }) {
    const updateRow = (index, field, value) => {
        const nextRows = [...rows];
        const updatedRow = { ...nextRows[index], [field]: value };

        if (field === "phanVonSauThayDoi") {
            const pVal = parseNumber(value);
            const tVal = parseNumber(totalCapital);
            if (pVal !== null && tVal !== null && tVal > 0) {
                const percent = (pVal / tVal) * 100;
                updatedRow.tyLeSauThayDoi = Number.isInteger(percent)
                    ? percent.toString()
                    : percent.toFixed(4).replace(/\.?0+$/, "");
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
        <div className={styles.tableScrollWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ width: 60 }}>STT</th>
                        <th>Tên Ông/Bà/Thành viên</th>
                        <th style={{ width: 200 }}>Chức vụ</th>
                        <th style={{ width: 150 }}>Giá trị tăng/giảm vốn</th>
                        <th style={{ width: 150 }}>Giá trị vốn góp sau thay đổi</th>
                        <th style={{ width: 120 }}>Tỷ lệ (%)</th>
                        {showCertificateIssuedDate && (
                            <th style={{ width: 180 }}>Ngày cấp Giấy chứng nhận phần vốn góp</th>
                        )}
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
                                <select
                                    className={styles.input}
                                    value={row.chucVu || getDefaultMemberPosition(index)}
                                    onChange={(event) => updateRow(index, "chucVu", event.target.value)}
                                >
                                    {MEMBER_POSITION_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    className={styles.input}
                                    value={row.giaTriTangGiam || ""}
                                    onChange={(event) =>
                                        handleNumberChange(index, "giaTriTangGiam", event.target.value)
                                    }
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    className={styles.input}
                                    value={row.phanVonSauThayDoi || ""}
                                    onChange={(event) =>
                                        handleNumberChange(index, "phanVonSauThayDoi", event.target.value)
                                    }
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
                            {showCertificateIssuedDate && (
                                <td>
                                    <DateInput
                                        className={styles.input}
                                        value={row.ngayCapGiayChungNhan || ""}
                                        onChange={(event) =>
                                            updateRow(index, "ngayCapGiayChungNhan", event.target.value)
                                        }
                                        required={true}
                                    />
                                </td>
                            )}
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
        </div>
    );
}

const QuyetDinhHoiDongThanhVienDeclaration = forwardRef(function QuyetDinhHoiDongThanhVienDeclaration(
    { dataJson, onSubmit, formRef },
    componentRef,
) {
    const { user } = useAuth();
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
    const [showRepresentative, setShowRepresentative] = useState(false);

    const [qdNguoiDaiDienProv, setQdNguoiDaiDienProv] = useState("");
    const {
        provinces: nddProvinces,
        communes: nddCommunes,
        loadingCommunes: nddLoadingCommunes,
    } = useFetchAddress(qdNguoiDaiDienProv);

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
    }, [mergedData]);

    useEffect(() => {
        setShowRepresentative(isTruthy(mergedData.qdDoiNguoiDaiDienPhapLuat));
    }, [mergedData.qdDoiNguoiDaiDienPhapLuat]);

    const baseDecisionData = applyDecisionDefaults(mergedData, contributionRows);
    const decisionData = useMemo(() => {
        return {
            ...baseDecisionData,
            ...localRepCard,
        };
    }, [baseDecisionData, localRepCard]);
    const capitalDiff = getCapitalDifference(decisionData);
    const isCapitalIncrease = capitalDiff > 0;
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

        return applyDecisionDefaults({ ...decisionData, ...formValues }, contributionRows);
    };

    useImperativeHandle(componentRef, () => ({
        getDraftData: collectData,
        getExportData: collectData,
        importData: () => {},
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
                    <Field
                        label="Số biên bản họp HĐTV"
                        name="qdSoBienBanHop"
                        data={{ qdSoBienBanHop: decisionData.qdSoBienBanHop || `01/${new Date().getFullYear()}/BBH` }}
                        required
                    />
                    <Field label="Ngày biên bản họp HĐTV" name="qdNgayBienBanHop" data={decisionData} required>
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
                                defaultValue={toUppercaseValue(
                                    user?.fullname ||
                                        decisionData.qdNguoiThucHienThuTuc ||
                                        decisionData.nguoiDaiDien_hoTen ||
                                        decisionData.chuSoHuu_hoTen ||
                                        "",
                                )}
                                required
                            />
                        </div>
                    </Field>
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
                        <ReadOnlyField
                            label="Thời điểm tăng/giảm vốn"
                            value={formatDate(decisionData.thoiDiemThayDoiVon)}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            alignItems: "center",
                        }}
                    >
                        <h4 className={styles.sectionTitle}>Trong đó cơ cấu góp vốn sau thay đổi vốn điều lệ:</h4>
                        <button
                            type="button"
                            onClick={() =>
                                setContributionRows([
                                    ...contributionRows,
                                    {
                                        ...emptyContributionRow,
                                        chucVu: getDefaultMemberPosition(contributionRows.length),
                                    },
                                ])
                            }
                            className={nganhNgheStyles.btnPrimary}
                        >
                            Thêm dòng góp vốn
                        </button>
                    </div>
                    <ContributionRowsTable
                        rows={contributionRows}
                        onChangeRows={setContributionRows}
                        totalCapital={decisionData.vonDieuLeSauThayDoi}
                        showCertificateIssuedDate={isCapitalIncrease}
                    />
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
                                <Field
                                    label="Họ, chữ đệm và tên (ghi bằng chữ in hoa)"
                                    name="qdNguoiDaiDien_hoTen"
                                    data={decisionData}
                                    required
                                >
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
                                            decisionData.qdNguoiDaiDien_ngaySinh ||
                                            decisionData.nguoiDaiDien_ngaySinh ||
                                            ""
                                        }
                                        required
                                    />
                                </Field>
                                <GioiTinhSelect
                                    name="qdNguoiDaiDien_gioiTinh"
                                    defaultValue={decisionData.qdNguoiDaiDien_gioiTinh}
                                    required
                                />
                                <Field
                                    label="Số định danh cá nhân"
                                    name="qdNguoiDaiDien_cccd"
                                    data={decisionData}
                                    required
                                />
                                <ChucDanhSelect
                                    name="qdNguoiDaiDien_chucDanh"
                                    defaultValue={decisionData.qdNguoiDaiDien_chucDanh}
                                    required
                                />
                            </div>
                            <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>
                                Địa chỉ liên lạc:
                            </h3>
                            <AddressSelect
                                provinces={nddProvinces}
                                communes={nddCommunes}
                                onProvinceChange={setQdNguoiDaiDienProv}
                                provinceName="qdNguoiDaiDien_tinh"
                                wardName="qdNguoiDaiDien_xa"
                                houseNumberName="qdNguoiDaiDien_soNha"
                                provinceDefault={
                                    decisionData.qdNguoiDaiDien_tinh || decisionData.nguoiDaiDien_tinh || ""
                                }
                                wardDefault={decisionData.qdNguoiDaiDien_xa || decisionData.nguoiDaiDien_xa || ""}
                                houseNumberDefault={
                                    decisionData.qdNguoiDaiDien_soNha || decisionData.nguoiDaiDien_soNha || ""
                                }
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

export default QuyetDinhHoiDongThanhVienDeclaration;
