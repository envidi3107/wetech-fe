import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import localStyles from "./GiayDeNghiDangKyThayDoiDeclaration.module.css";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import DateInput from "@/components/DateInput/DateInput";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { buildKinhGui } from "@/consts/provinceRoomMap";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import {
    DanTocSelect,
    GioiTinhSelect,
    QuocTichSelect,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DanhSachThanhVienDeclaration from "@/components/Procedure/ProcedureTemplate/CongTyTNHH2TVTroLen/ThanhLapMoi/FormDeclaration/DanhSachThanhVienDeclaration";
import DanhSachCoDongSangLapDeclaration from "@/components/Procedure/ProcedureTemplate/CongTyCoPhan/ThanhLapMoi/FormDeclaration/DanhSachCoDongSangLapDeclaration";
import nganhNgheStyles from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable.module.css";
import KinhGuiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/KinhGuiSection";
import ThongTinDoanhNghiepSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDoanhNghiepSection";
import NganhNgheTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable";
import CapitalInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CapitalInput/CapitalInput";
import NguonVonDieuLeSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/NguonVonDieuLeSection";
import TaiSanGopVonSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/TaiSanGopVonSection";
import ThongTinDangKyThueSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDangKyThueSection";
import ThongTinCoPhanSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinCoPhanSection";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";
import {
    CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS,
    DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";
import {
    A_CHANGE_OPTIONS,
    FOOTNOTES,
    MAIN_CHANGE_OPTIONS,
    emptyAOptionState,
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import cshStyles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/DanhSachCSHHuongLoiDeclaration.module.css";
import deleteIcon from "@/assets/delete-icon.png";
import Select from "react-select";

const EMPTY_AUTHORIZED_REP = {
    chuSoHuu: "",
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    giayTo: "",
    quocTich: "",
    danToc: "",
    diaChiLienLac: "",
    tongVonDaiDien: "",
    tyLe: "",
    thoiDiemDaiDien: "",
    chuKy: "",
    ghiChu: "",
};

const EMPTY_CSH_HUONG_LOI_ROW = {
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    giaTo: "",
    diaChiLienLac: "",
    tyLeSoHuuVon: "",
    tyLeSoHuuBieuQuyet: "",
    quyenChiPhoi: "",
    ghiChu: "",
};

const quyenChiPhoiOptions = [
    { value: "", label: "Chọn quyền chi phối..." },
    {
        value: "Bổ nhiệm, miễn nhiệm hoặc bãi nhiệm đa số hoặc tất cả thành viên hội đồng quản trị, chủ tịch hội đồng quản trị, chủ tịch hội đồng thành viên; người đại diện theo pháp luật, giám đốc hoặc tổng giám đốc của doanh nghiệp;",
        label: "Bổ nhiệm, miễn nhiệm hoặc bãi nhiệm đa số hoặc tất cả thành viên hội đồng quản trị, chủ tịch hội đồng quản trị, chủ tịch hội đồng thành viên; người đại diện theo pháp luật, giám đốc hoặc tổng giám đốc của doanh nghiệp;",
    },
    { value: "Sửa đổi, bổ sung điều lệ của doanh nghiệp;", label: "Sửa đổi, bổ sung điều lệ của doanh nghiệp;" },
    { value: "Thay đổi cơ cấu tổ chức quản lý công ty;", label: "Thay đổi cơ cấu tổ chức quản lý công ty;" },
    { value: "Tổ chức lại, giải thể công ty.", label: "Tổ chức lại, giải thể công ty." },
];

const cshSelectStyles = {
    control: (base) => ({
        ...base,
        border: "none",
        borderBottom: "1px solid transparent",
        boxShadow: "none",
        backgroundColor: "transparent",
        minHeight: "40px",
        fontSize: "14px",
        "&:hover": { borderColor: "transparent" },
    }),
    valueContainer: (base) => ({
        ...base,
        padding: "0 8px",
        justifyContent: "center",
    }),
    singleValue: (base) => ({
        ...base,
        textAlign: "center",
    }),
    placeholder: (base) => ({
        ...base,
        textAlign: "center",
        color: "#505050",
    }),
    menu: (base) => ({
        ...base,
        width: "max-content",
        maxWidth: "400px",
        left: "50%",
        transform: "translateX(-50%)",
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: "14px",
        backgroundColor: state.isSelected ? "#1d126eff" : state.isFocused ? "#f0f0ff" : "#fff",
        color: state.isSelected ? "#fff" : "#333",
        cursor: "pointer",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const DEFAULT_EXCLUDED_A_OPTION_NAMES = ["a_doiThanhVien", "a_doiCoDong", "a_doiVonDauTuDNTN"];
const EMBEDDED_LIST_FIELD_NAMES = new Set([
    "hoTen",
    "ngaySinh",
    "gioiTinh",
    "giaTo",
    "quocTich",
    "danToc",
    "diaChiLienLac",
    "phanVonGop",
    "phanVonGopNgoaiTe_GiaTri",
    "phanVonGopNgoaiTe_Loai",
    "tyLe",
    "loaiTaiSan",
    "thoiHan",
    "tongSoCoPhan_soLuong",
    "tongSoCoPhan_giaTri",
    "loaiCoPhan_phoThong_soLuong",
    "loaiCoPhan_phoThong_giaTri",
    "loaiCoPhan_khac_soLuong",
    "loaiCoPhan_khac_giaTri",
    "loaiTaiSanGopVon",
    "thoiHanGopVon",
    "ghiChu",
]);

function Field({ label, name, dataJson, required = false, type = "text", children }) {
    const shouldUppercase = label?.toLocaleLowerCase("vi-VN").includes("ghi bằng chữ in hoa");

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>
            {children || (
                <input
                    type={type}
                    className={styles.input}
                    name={name}
                    defaultValue={shouldUppercase ? toUppercaseValue(dataJson?.[name]) : dataJson?.[name] || ""}
                    style={shouldUppercase ? { textTransform: "uppercase" } : undefined}
                    onInput={shouldUppercase ? handleUppercaseInput : undefined}
                    required={required}
                />
            )}
        </div>
    );
}

function TextAreaField({ label, name, dataJson, required = false, rows = 4 }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>
            <textarea
                className={styles.input}
                name={name}
                defaultValue={dataJson?.[name] || ""}
                required={required}
                rows={rows}
                style={{ minHeight: rows * 28, resize: "vertical", fontFamily: "inherit" }}
            />
        </div>
    );
}

function AddressBlock({ dataJson, prefix, required = true }) {
    const [provinceCode, setProvinceCode] = useState("");
    const { provinces, communes, loadingCommunes } = useFetchAddress(provinceCode);

    return (
        <AddressSelect
            provinces={provinces}
            communes={communes}
            onProvinceChange={setProvinceCode}
            provinceName={`${prefix}_tinh`}
            wardName={`${prefix}_xa`}
            houseNumberName={`${prefix}_soNha`}
            provinceDefault={dataJson?.[`${prefix}_tinh`] || ""}
            wardDefault={dataJson?.[`${prefix}_xa`] || ""}
            houseNumberDefault={dataJson?.[`${prefix}_soNha`] || ""}
            isLoadingCommunes={loadingCommunes}
            isRequired={required}
        />
    );
}

function YesNoRadio({ name, dataJson, defaultValue = "Không" }) {
    const currentValue = dataJson?.[name] || defaultValue;

    return (
        <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
                <input
                    type="radio"
                    name={name}
                    value="Có"
                    className={styles.radioInput}
                    defaultChecked={currentValue === "Có"}
                />
                Có
            </label>
            <label className={styles.radioLabel}>
                <input
                    type="radio"
                    name={name}
                    value="Không"
                    className={styles.radioInput}
                    defaultChecked={currentValue !== "Có"}
                />
                Không
            </label>
        </div>
    );
}

function AttachmentNote({ children }) {
    return (
        <p className={styles.note} style={{ marginTop: 8 }}>
            {children}
        </p>
    );
}

function AuthorizedRepTable({ rows, onChangeRows }) {
    const updateRow = (index, field, value) => {
        const nextRows = [...rows];
        nextRows[index] = { ...nextRows[index], [field]: value };
        onChangeRows(nextRows);
    };

    const addRow = () => onChangeRows([...rows, { ...EMPTY_AUTHORIZED_REP }]);
    const removeRow = (index) => onChangeRows(rows.filter((_, rowIndex) => rowIndex !== index));

    return (
        <div className={styles.sectionGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h4 className={styles.sectionTitle} style={{ margin: 0 }}>
                    Thông tin người đại diện theo ủy quyền sau khi thay đổi
                </h4>
                <button type="button" onClick={addRow} className={nganhNgheStyles.btnPrimary}>
                    Thêm dòng
                </button>
            </div>
            <div className={localStyles.authorizedRepTableWrapper}>
                <table className={`${styles.table} ${localStyles.authorizedRepTable}`}>
                    <colgroup>
                        <col className={localStyles.colIndex} />
                        <col className={localStyles.colOrganization} />
                        <col className={localStyles.colName} />
                        <col className={localStyles.colDate} />
                        <col className={localStyles.colGender} />
                        <col className={localStyles.colLegalPaper} />
                        <col className={localStyles.colNationality} />
                        <col className={localStyles.colEthnicity} />
                        <col className={localStyles.colAddress} />
                        <col className={localStyles.colCapital} />
                        <col className={localStyles.colRatio} />
                        <col className={localStyles.colRepresentedAt} />
                        <col className={localStyles.colNote} />
                        <col className={localStyles.colAction} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Chủ sở hữu/Thành viên/Cổ đông là tổ chức</th>
                            <th>Tên người đại diện theo ủy quyền</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>
                                Số, ngày cấp, cơ quan cấp giấy tờ pháp lý
                                <InfoTooltip content={FOOTNOTES.giayToNguoiDaiDienUyQuyen} />
                            </th>
                            <th>Quốc tịch</th>
                            <th>Dân tộc</th>
                            <th>Địa chỉ liên lạc</th>
                            <th>
                                Tổng giá trị vốn được đại diện
                                <InfoTooltip content={FOOTNOTES.tyLeUyQuyen} />
                            </th>
                            <th>Tỷ lệ (%)</th>
                            <th>Thời điểm đại diện phần vốn</th>
                            <th>Ghi chú</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={14} style={{ textAlign: "left" }}>
                                    Chưa có dòng nào.
                                </td>
                            </tr>
                        )}
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={row.chuSoHuu || ""}
                                        onChange={(e) => updateRow(index, "chuSoHuu", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={row.hoTen || ""}
                                        placeholder="Họ tên"
                                        onChange={(e) => updateRow(index, "hoTen", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <DateInput
                                        className={styles.input}
                                        name={`nguoiDaiDienUyQuyen_${index}_ngaySinh`}
                                        value={row.ngaySinh || ""}
                                        onChange={(e) => updateRow(index, "ngaySinh", e.target.value)}
                                    />
                                </td>
                                <td className={localStyles.authorizedRepSelectCell}>
                                    <div>
                                        <GioiTinhSelect
                                            name={`nguoiDaiDienUyQuyen_${index}_gioiTinh`}
                                            defaultValue={row.gioiTinh || ""}
                                            required={false}
                                            hideLabel
                                            onChange={(value) => updateRow(index, "gioiTinh", value)}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={row.giayTo || ""}
                                        placeholder="Số, ngày cấp, cơ quan cấp"
                                        onChange={(e) => updateRow(index, "giayTo", e.target.value)}
                                    />
                                </td>
                                <td className={localStyles.authorizedRepSelectCell}>
                                    <div>
                                        <QuocTichSelect
                                            name={`nguoiDaiDienUyQuyen_${index}_quocTich`}
                                            defaultValue={row.quocTich || ""}
                                            required={false}
                                            hideLabel
                                            onChange={(value) => updateRow(index, "quocTich", value)}
                                        />
                                    </div>
                                </td>
                                <td className={localStyles.authorizedRepSelectCell}>
                                    <div>
                                        <DanTocSelect
                                            name={`nguoiDaiDienUyQuyen_${index}_danToc`}
                                            defaultValue={row.danToc || ""}
                                            required={false}
                                            hideLabel
                                            onChange={(value) => updateRow(index, "danToc", value)}
                                        />
                                    </div>
                                </td>
                                {[
                                    ["chuSoHuu", "Tên tổ chức"],
                                    ["hoTen", "Họ tên"],
                                    ["ngaySinh", "dd/mm/yyyy"],
                                    ["gioiTinh", "Giới tính"],
                                    ["giayTo", "Số, ngày cấp, cơ quan cấp"],
                                    ["quocTich", "Quốc tịch"],
                                    ["danToc", "Dân tộc"],
                                    ["diaChiLienLac", "Địa chỉ"],
                                    ["tongVonDaiDien", "VNĐ/ngoại tệ"],
                                    ["tyLe", "%"],
                                    ["thoiDiemDaiDien", "Thời điểm"],
                                    ["ghiChu", "Ghi chú"],
                                ]
                                    .filter(
                                        ([field]) =>
                                            ![
                                                "chuSoHuu",
                                                "hoTen",
                                                "ngaySinh",
                                                "gioiTinh",
                                                "giayTo",
                                                "quocTich",
                                                "danToc",
                                            ].includes(field),
                                    )
                                    .map(([field, placeholder]) => (
                                        <td key={field}>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={row[field] || ""}
                                                placeholder={placeholder}
                                                onChange={(e) => updateRow(index, field, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                <td style={{ textAlign: "center" }}>
                                    <button type="button" onClick={() => removeRow(index)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function BeneficialOwnerTable({ rows, onChangeRows }) {
    const updateRow = (index, field, value) => {
        const nextRows = [...rows];
        nextRows[index] = { ...nextRows[index], [field]: value };
        onChangeRows(nextRows);
    };

    const addRow = () => onChangeRows([...rows, { ...EMPTY_CSH_HUONG_LOI_ROW }]);
    const removeRow = (index) => onChangeRows(rows.filter((_, rowIndex) => rowIndex !== index));

    return (
        <div className={cshStyles.wrapper}>
            <div className={cshStyles.actionRow}>
                <button type="button" className={cshStyles.btnPrimary} onClick={addRow}>
                    Thêm dòng
                </button>
            </div>

            <div className={cshStyles.tableScrollWrapper}>
                <table className={cshStyles.table}>
                    <thead>
                        <tr>
                            <th rowSpan={2} className={cshStyles.th}>
                                STT
                            </th>
                            <th rowSpan={2} className={cshStyles.th} style={{ minWidth: 180 }}>
                                Họ và tên
                            </th>
                            <th rowSpan={2} className={cshStyles.th} style={{ minWidth: 150 }}>
                                Ngày, tháng, năm sinh
                            </th>
                            <th rowSpan={2} className={cshStyles.th} style={{ minWidth: 60 }}>
                                Giới tính
                            </th>
                            <th rowSpan={2} className={cshStyles.th} style={{ minWidth: 200 }}>
                                Số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                            </th>
                            <th rowSpan={2} className={cshStyles.th} style={{ minWidth: 150 }}>
                                Địa chỉ liên lạc
                            </th>
                            <th colSpan={3} className={cshStyles.th}>
                                Chủ sở hữu hưởng lợi của doanh nghiệp
                            </th>
                            <th rowSpan={2} className={cshStyles.th} style={{ minWidth: 150 }}>
                                Ghi chú
                            </th>
                            <th rowSpan={2} className={cshStyles.th} style={{ minWidth: 90 }}>
                                Thao tác
                            </th>
                        </tr>
                        <tr>
                            <th className={cshStyles.th} style={{ minWidth: 50 }}>
                                Tỷ lệ sở hữu vốn điều lệ (%)
                            </th>
                            <th className={cshStyles.th} style={{ minWidth: 50 }}>
                                Tỷ lệ sở hữu cổ phần có quyền biểu quyết (%)
                            </th>
                            <th className={cshStyles.th} style={{ minWidth: 100 }}>
                                Quyền chi phối
                            </th>
                        </tr>
                        <tr className={cshStyles.colNumberRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ""].map((number, index) => (
                                <td key={index} className={cshStyles.colNumber}>
                                    {number}
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={11} className={cshStyles.emptyRow}>
                                    Chưa có chủ sở hữu hưởng lợi. Nhấn "Thêm dòng" để bắt đầu.
                                </td>
                            </tr>
                        )}
                        {rows.map((row, index) => (
                            <tr key={index} className={cshStyles.trEdit}>
                                <td className={cshStyles.td} style={{ textAlign: "center" }}>
                                    {index + 1}
                                </td>
                                <td className={cshStyles.td}>
                                    <input
                                        className={cshStyles.input}
                                        value={row.hoTen || ""}
                                        onChange={(event) => updateRow(index, "hoTen", event.target.value)}
                                    />
                                </td>
                                <td className={cshStyles.td}>
                                    <DateInput
                                        className={cshStyles.input}
                                        name={`cshHuongLoi_${index}_ngaySinh`}
                                        value={row.ngaySinh || ""}
                                        onChange={(event) => updateRow(index, "ngaySinh", event.target.value)}
                                    />
                                </td>
                                <td
                                    className={cshStyles.tdWrapper}
                                    onChange={(event) => updateRow(index, "gioiTinh", event.target.value)}
                                >
                                    <GioiTinhSelect
                                        name={`cshHuongLoi_${index}_gioiTinh`}
                                        defaultValue={row.gioiTinh || ""}
                                        required={false}
                                        onChange={(value) => updateRow(index, "gioiTinh", value)}
                                    />
                                </td>
                                <td className={cshStyles.td}>
                                    <input
                                        type="text"
                                        className={cshStyles.input}
                                        value={row.giaTo || ""}
                                        onChange={(event) => updateRow(index, "giaTo", event.target.value)}
                                    />
                                </td>
                                <td className={cshStyles.td}>
                                    <input
                                        type="text"
                                        className={cshStyles.input}
                                        value={row.diaChiLienLac || ""}
                                        onChange={(event) => updateRow(index, "diaChiLienLac", event.target.value)}
                                    />
                                </td>
                                <td className={cshStyles.td}>
                                    <input
                                        className={cshStyles.input}
                                        value={row.tyLeSoHuuVon || ""}
                                        onChange={(event) => updateRow(index, "tyLeSoHuuVon", event.target.value)}
                                    />
                                </td>
                                <td className={cshStyles.td}>
                                    <input
                                        className={cshStyles.input}
                                        value={row.tyLeSoHuuBieuQuyet || ""}
                                        onChange={(event) => updateRow(index, "tyLeSoHuuBieuQuyet", event.target.value)}
                                    />
                                </td>
                                <td className={cshStyles.tdWrapper}>
                                    <Select
                                        options={quyenChiPhoiOptions}
                                        styles={cshSelectStyles}
                                        value={
                                            quyenChiPhoiOptions.find((option) => option.value === row.quyenChiPhoi) ||
                                            quyenChiPhoiOptions[0]
                                        }
                                        onChange={(selectedOption) => {
                                            updateRow(
                                                index,
                                                "quyenChiPhoi",
                                                selectedOption ? selectedOption.value : "",
                                            );
                                        }}
                                        placeholder="Chọn quyền chi phối..."
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                                        menuPosition="fixed"
                                    />
                                </td>
                                <td className={cshStyles.td}>
                                    <input
                                        className={cshStyles.input}
                                        value={row.ghiChu || ""}
                                        onChange={(event) => updateRow(index, "ghiChu", event.target.value)}
                                    />
                                </td>
                                <td className={cshStyles.tdAction}>
                                    <img
                                        src={deleteIcon}
                                        alt="xóa"
                                        onClick={() => removeRow(index)}
                                        width="18"
                                        height="18"
                                        style={{ cursor: "pointer", display: "block", margin: "0 auto" }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const GiayDeNghiDangKyThayDoiDeclaration = forwardRef(function GiayDeNghiDangKyThayDoiDeclaration(
    {
        dataJson,
        onSubmit,
        formRef,
        excludedAOptionNames = DEFAULT_EXCLUDED_A_OPTION_NAMES,
        includeCoPhanFields = false,
    },
    componentRef,
) {
    const normalizedData = normalizeDataJson(dataJson);
    const companyNamePrefixOptions = includeCoPhanFields
        ? CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS
        : TNHH_COMPANY_NAME_PREFIX_OPTIONS;
    const defaultCompanyNamePrefix = includeCoPhanFields
        ? DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX
        : DEFAULT_TNHH_COMPANY_NAME_PREFIX;
    const excludedAOptionNamesSet = useMemo(() => new Set(excludedAOptionNames), [excludedAOptionNames]);
    const availableAChangeOptions = useMemo(
        () => A_CHANGE_OPTIONS.filter((option) => !excludedAOptionNamesSet.has(option.name)),
        [excludedAOptionNamesSet],
    );
    const { provinces } = useFetchAddress();
    const [kinhGuiProvince, setKinhGuiProvince] = useState("");
    const [kinhGuiValue, setKinhGuiValue] = useState("");
    const [mainOption, setMainOption] = useState("A");
    const [aOptions, setAOptions] = useState(emptyAOptionState());
    const [nganhBoSungRows, setNganhBoSungRows] = useState([]);
    const [nganhBoRows, setNganhBoRows] = useState([]);
    const [nganhSuaRows, setNganhSuaRows] = useState([]);
    const [authorizedRepRows, setAuthorizedRepRows] = useState([]);
    const [cshHuongLoiRows, setCshHuongLoiRows] = useState([]);
    const [doiThanhVienRows, setDoiThanhVienRows] = useState([]);
    const [doiCoDongSangLapRows, setDoiCoDongSangLapRows] = useState([]);
    const [doiCoDongLoaiCoPhanKhacList, setDoiCoDongLoaiCoPhanKhacList] = useState([""]);
    const [coSoThayDoi, setCoSoThayDoi] = useState("");
    const [pendingScrollTarget, setPendingScrollTarget] = useState("");
    const danhSachThanhVienData = useGetFormDataJsonFromName("Danh sách thành viên");
    const danhSachCoDongSangLapData = useGetFormDataJsonFromName("Danh sách cổ đông sáng lập");

    useEffect(() => {
        const parsed = normalizeDataJson(dataJson);
        const matchedProvince =
            parsed.kinhGuiProvince ||
            provinces.find(
                (province) =>
                    buildKinhGui(province.name) === parsed.kinhGui || parsed.kinhGui?.trim().endsWith(province.name),
            )?.name ||
            "";

        setKinhGuiProvince(matchedProvince);
        setKinhGuiValue(matchedProvince ? buildKinhGui(matchedProvince) : parsed.kinhGui || "");
        setMainOption(parsed.noiDungThayDoi || "A");
        setAOptions(
            availableAChangeOptions.reduce((acc, option) => {
                acc[option.name] = isTruthy(parsed[option.name]);
                return acc;
            }, {}),
        );
        setNganhBoSungRows(parsed.nganhNgheBoSungList || []);
        setNganhBoRows(parsed.nganhNgheBoList || []);
        setNganhSuaRows(parsed.nganhNgheSuaList || []);
        setAuthorizedRepRows(parsed.nguoiDaiDienUyQuyenList || []);
        setCshHuongLoiRows(parsed.cshHuongLoiList || []);
        setDoiThanhVienRows(
            parsed.doiThanhVienList || parsed.thanhVienList || danhSachThanhVienData?.thanhVienList || [],
        );
        setDoiCoDongSangLapRows(
            parsed.doiCoDongSangLapList || parsed.coDongList || danhSachCoDongSangLapData?.coDongList || [],
        );
        setDoiCoDongLoaiCoPhanKhacList(
            parsed.doiCoDongLoaiCoPhanKhacList ||
                parsed.loaiCoPhanKhacList ||
                danhSachCoDongSangLapData?.loaiCoPhanKhacList ||
                (parsed.loaiCoPhanKhac_ten || danhSachCoDongSangLapData?.loaiCoPhanKhac_ten
                    ? [parsed.loaiCoPhanKhac_ten || danhSachCoDongSangLapData?.loaiCoPhanKhac_ten]
                    : [""]),
        );
        setCoSoThayDoi(parsed.coSoThayDoi || "");
    }, [availableAChangeOptions, danhSachCoDongSangLapData, danhSachThanhVienData, dataJson, provinces]);

    useEffect(() => {
        if (!pendingScrollTarget || mainOption !== "A" || !aOptions[pendingScrollTarget]) return;

        window.requestAnimationFrame(() => {
            const targetSection = document.getElementById(`a-section-${pendingScrollTarget}`);
            targetSection?.scrollIntoView({ behavior: "smooth", block: "start" });
            setPendingScrollTarget("");
        });
    }, [aOptions, mainOption, pendingScrollTarget]);

    const handleKinhGuiProvinceChange = (provinceName) => {
        setKinhGuiProvince(provinceName);
        setKinhGuiValue(provinceName ? buildKinhGui(provinceName) : "");
    };

    const toggleAOption = (name) => {
        setAOptions((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const scrollToAOption = (name) => {
        setAOptions((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
        setPendingScrollTarget(name);
    };

    const areAllAOptionsSelected =
        availableAChangeOptions.length > 0 && availableAChangeOptions.every((option) => !!aOptions[option.name]);

    const toggleAllAOptions = () => {
        setAOptions(
            availableAChangeOptions.reduce((acc, option) => {
                acc[option.name] = !areAllAOptionsSelected;
                return acc;
            }, {}),
        );
    };

    const validateSelection = () => {
        if (!kinhGuiValue) {
            window.alert("Vui lòng chọn tỉnh/thành phố cho mục Kính gửi.");
            return false;
        }

        if (mainOption === "A" && !availableAChangeOptions.some((option) => !!aOptions[option.name])) {
            window.alert("Vui lòng chọn ít nhất một nội dung thay đổi trong Mục A.");
            return false;
        }
        return true;
    };

    const collectData = () => {
        if (!formRef?.current) return null;
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return null;
        }
        if (!validateSelection()) return null;

        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());
        Object.keys(data).forEach((key) => {
            if (
                key.startsWith("cshHuongLoi_") ||
                key.startsWith("nguoiDaiDienUyQuyen_") ||
                key.startsWith("doiThanhVienList_") ||
                key.startsWith("doiCoDongSangLapList_") ||
                EMBEDDED_LIST_FIELD_NAMES.has(key)
            ) {
                delete data[key];
            }
        });
        data.kinhGui = kinhGuiValue;
        data.kinhGuiProvince = kinhGuiProvince;
        data.noiDungThayDoi = mainOption;
        data.coSoThayDoi = coSoThayDoi;
        if (coSoThayDoi !== "sap_nhap") {
            data.sapNhap_tenDoanhNghiep = "";
            data.sapNhap_maSoDoanhNghiep = "";
        }
        A_CHANGE_OPTIONS.forEach((option) => {
            data[option.name] = !excludedAOptionNamesSet.has(option.name) && aOptions[option.name] ? "true" : "false";
        });
        data.nganhNgheBoSungList = nganhBoSungRows;
        data.nganhNgheBoList = nganhBoRows;
        data.nganhNgheSuaList = nganhSuaRows;
        data.nguoiDaiDienUyQuyenList = authorizedRepRows;
        data.cshHuongLoiList = cshHuongLoiRows;
        data.doiThanhVienList = doiThanhVienRows;
        data.doiCoDongSangLapList = doiCoDongSangLapRows;
        data.doiCoDongLoaiCoPhanKhacList = doiCoDongLoaiCoPhanKhacList;
        data.loaiCoPhanKhacList = doiCoDongLoaiCoPhanKhacList;
        data.loaiCoPhanKhac_ten = doiCoDongLoaiCoPhanKhacList[0] || "";
        return data;
    };

    useImperativeHandle(componentRef, () => ({
        getDraftData: collectData,
        getExportData: collectData,
        importData: (importedData) => {
            const parsed = normalizeDataJson(importedData);
            setNganhBoSungRows(parsed.nganhNgheBoSungList || []);
            setNganhBoRows(parsed.nganhNgheBoList || []);
            setNganhSuaRows(parsed.nganhNgheSuaList || []);
            setAuthorizedRepRows(parsed.nguoiDaiDienUyQuyenList || []);
            setCshHuongLoiRows(parsed.cshHuongLoiList || []);
            setDoiThanhVienRows(parsed.doiThanhVienList || parsed.thanhVienList || []);
            setDoiCoDongSangLapRows(parsed.doiCoDongSangLapList || parsed.coDongList || []);
            setDoiCoDongLoaiCoPhanKhacList(
                parsed.doiCoDongLoaiCoPhanKhacList ||
                    parsed.loaiCoPhanKhacList ||
                    (parsed.loaiCoPhanKhac_ten ? [parsed.loaiCoPhanKhac_ten] : [""]),
            );
            setCoSoThayDoi(parsed.coSoThayDoi || "");
        },
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = collectData();
        if (data && onSubmit) onSubmit(data);
    };

    const isASelected = (name) => mainOption === "A" && !!aOptions[name];

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson ? "loaded" : "empty"}>
            <div className={localStyles.formLayout}>
                <aside className={localStyles.stickyPanel}>
                    <div className={localStyles.stickySection}>
                        <h3 className={localStyles.stickyTitle}>Chọn nội dung kê khai</h3>
                        <div className={localStyles.optionList}>
                            {MAIN_CHANGE_OPTIONS.map((option) => (
                                <label key={option.value} className={localStyles.optionItem}>
                                    <input
                                        type="radio"
                                        name="noiDungThayDoi"
                                        value={option.value}
                                        checked={mainOption === option.value}
                                        onChange={() => setMainOption(option.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {mainOption === "A" && (
                        <div className={localStyles.stickySection}>
                            <h3 className={localStyles.stickyTitle}>Mục A</h3>
                            <p className={localStyles.stickyNote}>
                                Chọn một hoặc nhiều nội dung thay đổi, phần kê khai tương ứng hiển thị ở cột bên phải.
                            </p>
                            <button type="button" className={localStyles.selectAllButton} onClick={toggleAllAOptions}>
                                {areAllAOptionsSelected ? "Bỏ chọn tất cả" : "Tích chọn tất cả"}
                            </button>
                            <div className={localStyles.optionList}>
                                {availableAChangeOptions.map((option) => (
                                    <div key={option.name} className={localStyles.optionRow}>
                                        <label className={localStyles.optionItem}>
                                            <input
                                                type="checkbox"
                                                name={option.name}
                                                value="true"
                                                checked={!!aOptions[option.name]}
                                                onChange={() => toggleAOption(option.name)}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                        <button
                                            type="button"
                                            className={localStyles.scrollButton}
                                            onClick={() => scrollToAOption(option.name)}
                                            aria-label={`Di chuyển đến ${option.label}`}
                                            title="Di chuyển đến phần kê khai"
                                        >
                                            ↓
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <div className={localStyles.formContent}>
                    <KinhGuiSection
                        dataJson={{ ...normalizedData, kinhGui: kinhGuiValue, kinhGuiProvince }}
                        styles={styles}
                        autoKinhGui={kinhGuiValue}
                        prefixText="Cơ quan đăng ký kinh doanh cấp tỉnh"
                        provinceOptions={provinces}
                        selectedProvinceName={kinhGuiProvince}
                        onProvinceNameChange={handleKinhGuiProvinceChange}
                    />

                    <ThongTinDoanhNghiepSection
                        dataJson={normalizedData}
                        styles={styles}
                        companyNamePrefixOptions={companyNamePrefixOptions}
                        defaultCompanyNamePrefix={defaultCompanyNamePrefix}
                    />

                    {mainOption === "A" && (
                        <>
                            <div className={styles.sectionGroup}>
                                <h3 className={styles.sectionTitle}>Doanh nghiệp đăng ký thay đổi trên cơ sở:</h3>
                                <p className={styles.note}>
                                    Chỉ kê khai trong trường hợp doanh nghiệp đăng ký thay đổi trên cơ sở tách doanh
                                    nghiệp hoặc sáp nhập doanh nghiệp.
                                </p>
                                <div
                                    className={styles.radioGroup}
                                    style={{ alignItems: "flex-start", flexWrap: "wrap" }}
                                >
                                    {[
                                        ["tach", "Tách doanh nghiệp"],
                                        ["sap_nhap", "Sáp nhập doanh nghiệp"],
                                    ].map(([value, label]) => (
                                        <label key={value} className={styles.radioLabel}>
                                            <input
                                                type="checkbox"
                                                value={value}
                                                className={styles.radioInput}
                                                checked={coSoThayDoi === value}
                                                onChange={(event) => setCoSoThayDoi(event.target.checked ? value : "")}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                                {coSoThayDoi === "sap_nhap" && (
                                    <div>
                                        <h3 className={styles.sectionTitle}>Thông tin doanh nghiệp bị sáp nhập:</h3>
                                        <div className={styles.grid2}>
                                            <Field
                                                label="Tên doanh nghiệp bị sáp nhập (nếu có)"
                                                name="sapNhap_tenDoanhNghiep"
                                                dataJson={normalizedData}
                                            />
                                            <Field
                                                label="Mã số doanh nghiệp/Mã số thuế của doanh nghiệp bị sáp nhập"
                                                name="sapNhap_maSoDoanhNghiep"
                                                dataJson={normalizedData}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo, xã/phường biên giới,
                                        ven biển hoặc khu vực ảnh hưởng quốc phòng, an ninh
                                    </label>
                                    <YesNoRadio name="anNinhQuocPhong" dataJson={normalizedData} />
                                </div>
                            </div>

                            {isASelected("a_doiTen") && (
                                <div id="a-section-a_doiTen" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>ĐĂNG KÝ THAY ĐỔI TÊN DOANH NGHIỆP</h3>
                                    <Field
                                        label="Tên doanh nghiệp viết bằng tiếng Việt sau khi thay đổi (ghi bằng chữ in hoa)"
                                        name="tenSauThayDoiVN"
                                        dataJson={normalizedData}
                                        required
                                    >
                                        <div className={styles.inputPrefixWrapper}>
                                            <select
                                                className={styles.prefixSelect}
                                                name="tenSauThayDoiPrefix"
                                                defaultValue={
                                                    normalizedData.tenSauThayDoiPrefix ||
                                                    normalizedData.tenCongTyPrefix ||
                                                    defaultCompanyNamePrefix
                                                }
                                                aria-label="Chọn prefix tên doanh nghiệp sau khi thay đổi"
                                            >
                                                {companyNamePrefixOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                className={styles.inputNoBorder}
                                                name="tenSauThayDoiVN"
                                                defaultValue={toUppercaseValue(normalizedData?.tenSauThayDoiVN)}
                                                style={{ textTransform: "uppercase" }}
                                                onInput={handleUppercaseInput}
                                                required
                                            />
                                        </div>
                                    </Field>
                                    <div className={styles.grid2}>
                                        <Field
                                            label="Tên doanh nghiệp viết bằng tiếng nước ngoài sau khi thay đổi"
                                            name="tenSauThayDoiEN"
                                            dataJson={normalizedData}
                                        />
                                        <Field
                                            label="Tên doanh nghiệp viết tắt sau khi thay đổi"
                                            name="tenSauThayDoiVietTat"
                                            dataJson={normalizedData}
                                        />
                                    </div>
                                </div>
                            )}

                            {isASelected("a_doiDiaChi") && (
                                <div id="a-section-a_doiDiaChi" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>ĐĂNG KÝ THAY ĐỔI ĐỊA CHỈ TRỤ SỞ CHÍNH</h3>
                                    <h3 className={styles.sectionTitle}>Trụ sở chính sau khi thay đổi:</h3>
                                    <AddressBlock dataJson={normalizedData} prefix="truSo" />
                                    <div className={styles.grid2}>
                                        <Field
                                            label="Điện thoại"
                                            name="truSo_phone"
                                            dataJson={normalizedData}
                                            type="tel"
                                            required
                                        />
                                        <Field label="Số fax (nếu có)" name="truSo_fax" dataJson={normalizedData} />
                                        <Field
                                            label="Thư điện tử (nếu có)"
                                            name="truSo_email"
                                            dataJson={normalizedData}
                                            type="email"
                                        />
                                        <Field
                                            label="Website (nếu có)"
                                            name="truSo_website"
                                            dataJson={normalizedData}
                                        />
                                    </div>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="checkbox"
                                            name="doiDiaChiNhanThongBaoThue"
                                            value="true"
                                            className={styles.radioInput}
                                            defaultChecked={isTruthy(normalizedData.doiDiaChiNhanThongBaoThue)}
                                        />
                                        Đồng thời thay đổi địa chỉ nhận thông báo thuế tương ứng với địa chỉ trụ sở
                                        chính
                                    </label>
                                    <div className={styles.formGroup} style={{ marginTop: 12 }}>
                                        <h3 className={styles.sectionTitle}>Doanh nghiệp nằm trong</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {[
                                                "Khu công nghiệp",
                                                "Khu chế xuất",
                                                "Khu kinh tế",
                                                "Khu công nghệ cao",
                                            ].map((item) => (
                                                <label key={item} className={styles.radioLabel}>
                                                    <input
                                                        type="checkbox"
                                                        name={`truSo_loaiKhu_${item.replace(/\s+/g, "_")}`}
                                                        value="true"
                                                        className={styles.radioInput}
                                                        defaultChecked={isTruthy(
                                                            normalizedData[
                                                                `truSo_loaiKhu_${item.replace(/\s+/g, "_")}`
                                                            ],
                                                        )}
                                                    />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <AttachmentNote>
                                        Doanh nghiệp cam kết trụ sở doanh nghiệp thuộc quyền sử dụng hợp pháp và được sử
                                        dụng đúng mục đích theo quy định của pháp luật.
                                    </AttachmentNote>
                                </div>
                            )}

                            {isASelected("a_doiThanhVien") && (
                                <div id="a-section-a_doiThanhVien" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>ĐĂNG KÝ THAY ĐỔI THÀNH VIÊN CÔNG TY TNHH</h3>
                                    <DanhSachThanhVienDeclaration
                                        contentOnly
                                        hideTitle
                                        rows={doiThanhVienRows}
                                        onChangeRows={setDoiThanhVienRows}
                                    />
                                </div>
                            )}

                            {isASelected("a_doiVonDieuLe") && (
                                <div id="a-section-a_doiVonDieuLe" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>
                                        ĐĂNG KÝ THAY ĐỔI VỐN ĐIỀU LỆ, PHẦN VỐN GÓP, TỶ LỆ PHẦN VỐN GÓP
                                    </h3>
                                    <CapitalInput
                                        title="Vốn điều lệ đã đăng ký"
                                        labelNumber="Vốn điều lệ đã đăng ký (bằng số; VNĐ)"
                                        labelText="Vốn điều lệ đã đăng ký (bằng chữ; VNĐ)"
                                        nameNumber="vonDieuLeDaDangKy"
                                        nameText="vonDieuLeDaDangKy_bangChu"
                                        defaultNumber={normalizedData.vonDieuLeDaDangKy || ""}
                                        defaultText={normalizedData.vonDieuLeDaDangKy_bangChu || ""}
                                    />
                                    <CapitalInput
                                        title="Vốn điều lệ sau khi thay đổi"
                                        labelNumber="Vốn điều lệ sau khi thay đổi (bằng số; VNĐ)"
                                        labelText="Vốn điều lệ sau khi thay đổi (bằng chữ; VNĐ)"
                                        nameNumber="vonDieuLeSauThayDoi"
                                        nameText="vonDieuLeSauThayDoi_bangChu"
                                        defaultNumber={normalizedData.vonDieuLeSauThayDoi || ""}
                                        defaultText={normalizedData.vonDieuLeSauThayDoi_bangChu || ""}
                                    />
                                    <div className={styles.grid2}>
                                        <Field
                                            label="Giá trị tương đương theo đơn vị tiền nước ngoài (nếu có, bằng số)"
                                            name="vonDieuLe_ngoaiTeBangSo"
                                            dataJson={normalizedData}
                                        >
                                            <input
                                                type="text"
                                                className={styles.input}
                                                name="vonDieuLe_ngoaiTeBangSo"
                                                defaultValue={
                                                    normalizedData.vonDieuLe_ngoaiTeBangSo ||
                                                    normalizedData.vonDieuLe_ngoaiTe ||
                                                    ""
                                                }
                                            />
                                        </Field>
                                        <Field
                                            label="Loại ngoại tệ"
                                            name="vonDieuLe_ngoaiTeDonVi"
                                            dataJson={normalizedData}
                                        />
                                        <Field
                                            label="Hình thức tăng, giảm vốn"
                                            name="hinhThucTangGiamVon"
                                            dataJson={normalizedData}
                                            required
                                        />
                                        <Field
                                            label="Thời điểm thay đổi vốn"
                                            name="thoiDiemThayDoiVon"
                                            dataJson={normalizedData}
                                            required
                                        >
                                            <DateInput
                                                name="thoiDiemThayDoiVon"
                                                className={styles.input}
                                                defaultValue={normalizedData.thoiDiemThayDoiVon || ""}
                                                required
                                            />
                                        </Field>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>
                                                Hiển thị thông tin ngoại tệ trên Giấy chứng nhận đăng ký doanh nghiệp?
                                            </label>
                                            <YesNoRadio name="hienThiNgoaiTe" dataJson={normalizedData} />
                                        </div>
                                    </div>
                                    <NguonVonDieuLeSection dataJson={normalizedData} styles={styles} isNote />
                                    {includeCoPhanFields && (
                                        <ThongTinCoPhanSection dataJson={normalizedData} styles={styles} />
                                    )}
                                    <TaiSanGopVonSection dataJson={normalizedData} styles={styles} />
                                    <TextAreaField
                                        label="Cam kết sau khi giảm vốn (chỉ ghi cam kết trong trường hợp đăng ký giảm vốn điều lệ)"
                                        name="camKetSauGiamVon"
                                        dataJson={normalizedData}
                                        rows={3}
                                    />
                                </div>
                            )}

                            {isASelected("a_doiNganhNghe") && (
                                <div id="a-section-a_doiNganhNghe" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>
                                        THÔNG BÁO THAY ĐỔI NGÀNH, NGHỀ KINH DOANH
                                        <InfoTooltip content={FOOTNOTES.nganhNghe} />
                                    </h3>
                                    <h4 className={styles.sectionTitle}>1. BỔ SUNG NGÀNH, NGHỀ KINH DOANH</h4>
                                    <NganhNgheTable rows={nganhBoSungRows} onChangeRows={setNganhBoSungRows} />
                                    <h4 className={styles.sectionTitle}>2. BỎ NGÀNH, NGHỀ KINH DOANH</h4>
                                    <NganhNgheTable rows={nganhBoRows} onChangeRows={setNganhBoRows} />
                                    <h4 className={styles.sectionTitle}>3. SỬA ĐỔI CHI TIẾT NGÀNH, NGHỀ KINH DOANH</h4>
                                    <NganhNgheTable rows={nganhSuaRows} onChangeRows={setNganhSuaRows} />
                                    <AttachmentNote>
                                        Trường hợp thay đổi ngành, nghề kinh doanh từ ngành này sang ngành khác, kê khai
                                        đồng thời ngành mới tại mục 1 và ngành cũ tại mục 2.
                                    </AttachmentNote>
                                </div>
                            )}

                            {isASelected("a_doiVonDauTuDNTN") && (
                                <div id="a-section-a_doiVonDauTuDNTN" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>
                                        ĐĂNG KÝ THAY ĐỔI VỐN ĐẦU TƯ CỦA CHỦ DOANH NGHIỆP TƯ NHÂN
                                    </h3>
                                    <CapitalInput
                                        title="Vốn đầu tư đã đăng ký"
                                        labelNumber="Vốn đầu tư đã đăng ký (bằng số; VNĐ)"
                                        labelText="Vốn đầu tư đã đăng ký (bằng chữ; VNĐ)"
                                        nameNumber="vonDauTuDaDangKy"
                                        nameText="vonDauTuDaDangKy_bangChu"
                                        defaultNumber={normalizedData.vonDauTuDaDangKy || ""}
                                        defaultText={normalizedData.vonDauTuDaDangKy_bangChu || ""}
                                    />
                                    <CapitalInput
                                        title="Vốn đầu tư sau khi thay đổi"
                                        labelNumber="Vốn đầu tư sau khi thay đổi (bằng số; VNĐ)"
                                        labelText="Vốn đầu tư sau khi thay đổi (bằng chữ; VNĐ)"
                                        nameNumber="vonDauTuSauThayDoi"
                                        nameText="vonDauTuSauThayDoi_bangChu"
                                        defaultNumber={normalizedData.vonDauTuSauThayDoi || ""}
                                        defaultText={normalizedData.vonDauTuSauThayDoi_bangChu || ""}
                                    />
                                    <div className={styles.grid2}>
                                        <Field
                                            label="Giá trị tương đương theo đơn vị tiền nước ngoài (nếu có, bằng số)"
                                            name="vonDauTu_ngoaiTeBangSo"
                                            dataJson={normalizedData}
                                        >
                                            <input
                                                type="text"
                                                className={styles.input}
                                                name="vonDauTu_ngoaiTeBangSo"
                                                defaultValue={
                                                    normalizedData.vonDauTu_ngoaiTeBangSo ||
                                                    normalizedData.vonDauTu_ngoaiTe ||
                                                    ""
                                                }
                                            />
                                        </Field>
                                        <Field
                                            label="Loại ngoại tệ"
                                            name="vonDauTu_ngoaiTeDonVi"
                                            dataJson={normalizedData}
                                        />
                                        <Field
                                            label="Hình thức tăng, giảm vốn"
                                            name="vonDauTu_hinhThucTangGiam"
                                            dataJson={normalizedData}
                                        />
                                        <Field
                                            label="Thời điểm thay đổi vốn"
                                            name="vonDauTu_thoiDiemThayDoi"
                                            dataJson={normalizedData}
                                        >
                                            <DateInput
                                                name="vonDauTu_thoiDiemThayDoi"
                                                className={styles.input}
                                                defaultValue={normalizedData.vonDauTu_thoiDiemThayDoi || ""}
                                            />
                                        </Field>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>
                                                Hiển thị thông tin ngoại tệ trên Giấy chứng nhận đăng ký doanh nghiệp?
                                            </label>
                                            <YesNoRadio name="vonDauTu_hienThiNgoaiTe" dataJson={normalizedData} />
                                        </div>
                                    </div>
                                    <TextAreaField
                                        label="Tài sản góp vốn sau khi thay đổi vốn đầu tư"
                                        name="vonDauTu_taiSanGopVon"
                                        dataJson={normalizedData}
                                        rows={5}
                                    />
                                </div>
                            )}

                            {isASelected("a_doiNguoiDaiDienUyQuyen") && (
                                <div id="a-section-a_doiNguoiDaiDienUyQuyen" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>
                                        THÔNG BÁO THAY ĐỔI NGƯỜI ĐẠI DIỆN THEO ỦY QUYỀN
                                        <InfoTooltip content={FOOTNOTES.nguoiDaiDienUyQuyen} />
                                    </h3>
                                    <AuthorizedRepTable rows={authorizedRepRows} onChangeRows={setAuthorizedRepRows} />
                                </div>
                            )}

                            {isASelected("a_doiCoDong") && (
                                <div id="a-section-a_doiCoDong" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>
                                        THÔNG BÁO THAY ĐỔI CỔ ĐÔNG SÁNG LẬP/CỔ ĐÔNG LÀ NHÀ ĐẦU TƯ NƯỚC NGOÀI
                                    </h3>
                                    <DanhSachCoDongSangLapDeclaration
                                        contentOnly
                                        hideTitle
                                        rows={doiCoDongSangLapRows}
                                        onChangeRows={setDoiCoDongSangLapRows}
                                        loaiCoPhanKhacList={doiCoDongLoaiCoPhanKhacList}
                                        onChangeLoaiCoPhanKhacList={setDoiCoDongLoaiCoPhanKhacList}
                                    />
                                </div>
                            )}

                            {isASelected("a_doiThongTinThue") && (
                                <div id="a-section-a_doiThongTinThue" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>
                                        THÔNG BÁO THAY ĐỔI THÔNG TIN ĐĂNG KÝ THUẾ
                                        <InfoTooltip content={FOOTNOTES.thueKeToan} />
                                    </h3>
                                    <ThongTinDangKyThueSection
                                        dataJson={normalizedData}
                                        styles={styles}
                                        isNote
                                        hideKeToanCopyCheckbox
                                    />
                                </div>
                            )}

                            {isASelected("a_doiChuSoHuuHuongLoi") && (
                                <div id="a-section-a_doiChuSoHuuHuongLoi" className={styles.sectionGroup}>
                                    <h3 className={styles.sectionTitle}>
                                        THÔNG BÁO THAY ĐỔI THÔNG TIN VỀ CHỦ SỞ HỮU HƯỞNG LỢI CỦA DOANH NGHIỆP/THÔNG BÁO
                                        THAY ĐỔI THÔNG TIN ĐỂ XÁC ĐỊNH CHỦ SỞ HỮU HƯỞNG LỢI
                                    </h3>
                                    <BeneficialOwnerTable rows={cshHuongLoiRows} onChangeRows={setCshHuongLoiRows} />
                                </div>
                            )}
                        </>
                    )}

                    {mainOption === "B" && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Bổ sung, cập nhật thông tin đăng ký doanh nghiệp
                                <InfoTooltip content={FOOTNOTES.boSungCapNhat} />
                            </h3>
                            <TextAreaField
                                label="Nội dung bổ sung, cập nhật thông tin đăng ký doanh nghiệp"
                                name="boSungCapNhat_noiDung"
                                dataJson={normalizedData}
                                required
                                rows={8}
                            />
                        </div>
                    )}

                    {mainOption === "C" && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>Đề nghị hiệu đính thông tin đăng ký doanh nghiệp</h3>
                            <div className={styles.grid2}>
                                <Field
                                    label="Ngày cấp Giấy chứng nhận/Giấy xác nhận"
                                    name="hieuDinh_ngayCapGiay"
                                    dataJson={normalizedData}
                                    required
                                >
                                    <DateInput
                                        name="hieuDinh_ngayCapGiay"
                                        className={styles.input}
                                        defaultValue={normalizedData.hieuDinh_ngayCapGiay || ""}
                                        required
                                    />
                                </Field>
                                <Field
                                    label="Ngày nộp hồ sơ đăng ký doanh nghiệp"
                                    name="hieuDinh_ngayNopHoSo"
                                    dataJson={normalizedData}
                                    required
                                >
                                    <DateInput
                                        name="hieuDinh_ngayNopHoSo"
                                        className={styles.input}
                                        defaultValue={normalizedData.hieuDinh_ngayNopHoSo || ""}
                                        required
                                    />
                                </Field>
                            </div>
                            <TextAreaField
                                label="Thông tin trên Giấy chứng nhận/Giấy xác nhận là"
                                name="hieuDinh_thongTinTrenGiay"
                                dataJson={normalizedData}
                                required
                            />
                            <TextAreaField
                                label="Thông tin đã đăng ký trong hồ sơ đăng ký doanh nghiệp là"
                                name="hieuDinh_thongTinHoSo"
                                dataJson={normalizedData}
                                required
                            />
                        </div>
                    )}

                    <div className={styles.sectionGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="checkbox"
                                name="deNghiCapGiayXacNhan"
                                value="true"
                                className={styles.radioInput}
                                defaultChecked={isTruthy(normalizedData.deNghiCapGiayXacNhan)}
                            />
                            Đề nghị cấp Giấy xác nhận thay đổi nội dung đăng ký doanh nghiệp cho các thông tin thay đổi
                            nêu trên.
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
});

export default GiayDeNghiDangKyThayDoiDeclaration;
