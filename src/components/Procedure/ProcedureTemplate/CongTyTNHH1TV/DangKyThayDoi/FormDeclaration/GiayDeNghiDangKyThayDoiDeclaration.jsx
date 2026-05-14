import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import localStyles from "./GiayDeNghiDangKyThayDoiDeclaration.module.css";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import DateInput from "@/components/DateInput/DateInput";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { buildKinhGui } from "@/consts/provinceRoomMap";
import KinhGuiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/KinhGuiSection";
import NganhNgheTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable";
import CapitalInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CapitalInput/CapitalInput";
import NguonVonDieuLeSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/NguonVonDieuLeSection";
import TaiSanGopVonSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/TaiSanGopVonSection";
import ThongTinDangKyThueSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDangKyThueSection";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import {
    A_CHANGE_OPTIONS,
    FOOTNOTES,
    MAIN_CHANGE_OPTIONS,
    emptyAOptionState,
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

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

function Field({ label, name, dataJson, required = false, type = "text", children }) {
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
                    defaultValue={dataJson?.[name] || ""}
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
                style={{ minHeight: rows * 28, resize: "vertical" }}
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
                <button
                    type="button"
                    onClick={addRow}
                    className={styles.input}
                    style={{ width: "auto", cursor: "pointer" }}
                >
                    Thêm dòng
                </button>
            </div>
            <div style={{ overflowX: "auto", marginTop: 12 }}>
                <table className={styles.table}>
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
                            <th>
                                Chữ ký
                                <InfoTooltip content={FOOTNOTES.chuKyUyQuyen} />
                            </th>
                            <th>Ghi chú</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={15} style={{ textAlign: "center" }}>
                                    Chưa có dòng nào.
                                </td>
                            </tr>
                        )}
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
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
                                    ["chuKy", "Người ký"],
                                    ["ghiChu", "Ghi chú"],
                                ].map(([field, placeholder]) => (
                                    <td key={field}>
                                        <input
                                            type="text"
                                            className={styles.tableInput}
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

const GiayDeNghiDangKyThayDoiDeclaration = forwardRef(function GiayDeNghiDangKyThayDoiDeclaration(
    { dataJson, onSubmit, formRef },
    componentRef,
) {
    const normalizedData = normalizeDataJson(dataJson);
    const { provinces } = useFetchAddress();
    const [kinhGuiProvince, setKinhGuiProvince] = useState("");
    const [kinhGuiValue, setKinhGuiValue] = useState("");
    const [mainOption, setMainOption] = useState("A");
    const [aOptions, setAOptions] = useState(emptyAOptionState());
    const [nganhBoSungRows, setNganhBoSungRows] = useState([]);
    const [nganhBoRows, setNganhBoRows] = useState([]);
    const [nganhSuaRows, setNganhSuaRows] = useState([]);
    const [authorizedRepRows, setAuthorizedRepRows] = useState([]);

    useEffect(() => {
        const parsed = normalizeDataJson(dataJson);
        const matchedProvince =
            parsed.kinhGuiProvince ||
            provinces.find(
                (province) =>
                    buildKinhGui(province.name) === parsed.kinhGui ||
                    parsed.kinhGui?.trim().endsWith(province.name),
            )?.name ||
            "";

        setKinhGuiProvince(matchedProvince);
        setKinhGuiValue(matchedProvince ? buildKinhGui(matchedProvince) : parsed.kinhGui || "");
        setMainOption(parsed.noiDungThayDoi || "A");
        setAOptions(
            A_CHANGE_OPTIONS.reduce((acc, option) => {
                acc[option.name] = isTruthy(parsed[option.name]);
                return acc;
            }, {}),
        );
        setNganhBoSungRows(parsed.nganhNgheBoSungList || []);
        setNganhBoRows(parsed.nganhNgheBoList || []);
        setNganhSuaRows(parsed.nganhNgheSuaList || []);
        setAuthorizedRepRows(parsed.nguoiDaiDienUyQuyenList || []);
    }, [dataJson, provinces]);

    const handleKinhGuiProvinceChange = (provinceName) => {
        setKinhGuiProvince(provinceName);
        setKinhGuiValue(provinceName ? buildKinhGui(provinceName) : "");
    };

    const toggleAOption = (name) => {
        setAOptions((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const validateSelection = () => {
        if (!kinhGuiValue) {
            window.alert("Vui lòng chọn tỉnh/thành phố cho mục Kính gửi.");
            return false;
        }

        if (mainOption === "A" && !Object.values(aOptions).some(Boolean)) {
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
        data.kinhGui = kinhGuiValue;
        data.kinhGuiProvince = kinhGuiProvince;
        data.noiDungThayDoi = mainOption;
        A_CHANGE_OPTIONS.forEach((option) => {
            data[option.name] = aOptions[option.name] ? "true" : "false";
        });
        data.nganhNgheBoSungList = nganhBoSungRows;
        data.nganhNgheBoList = nganhBoRows;
        data.nganhNgheSuaList = nganhSuaRows;
        data.nguoiDaiDienUyQuyenList = authorizedRepRows;
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
                            <div className={localStyles.optionList}>
                                {A_CHANGE_OPTIONS.map((option) => (
                                    <label key={option.name} className={localStyles.optionItem}>
                                        <input
                                            type="checkbox"
                                            name={option.name}
                                            value="true"
                                            checked={!!aOptions[option.name]}
                                            onChange={() => toggleAOption(option.name)}
                                        />
                                        {option.label}
                                    </label>
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

            <div className={styles.sectionGroup}>
                <div className={styles.grid2}>
                    <Field
                        label="Tên doanh nghiệp (ghi bằng chữ in hoa)"
                        name="tenDoanhNghiep"
                        dataJson={normalizedData}
                        required
                    />
                    <Field
                        label="Mã số doanh nghiệp/Mã số thuế"
                        name="maSoDoanhNghiep"
                        dataJson={normalizedData}
                        required
                    />
                </div>
            </div>

            {mainOption === "A" && (
                <>
                    <div className={styles.sectionGroup}>
                        <h3 className={styles.sectionTitle}>Doanh nghiệp đăng ký thay đổi trên cơ sở</h3>
                        <p className={styles.note}>
                            Chỉ kê khai khi đăng ký thay đổi trên cơ sở tách hoặc sáp nhập doanh nghiệp.
                        </p>
                        <div className={styles.radioGroup} style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
                            {[
                                ["khong_ap_dung", "Không áp dụng"],
                                ["tach", "Tách doanh nghiệp"],
                                ["sap_nhap", "Sáp nhập doanh nghiệp"],
                            ].map(([value, label]) => (
                                <label key={value} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="coSoThayDoi"
                                        value={value}
                                        className={styles.radioInput}
                                        defaultChecked={(normalizedData.coSoThayDoi || "khong_ap_dung") === value}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
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
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo, xã/phường biên giới, ven biển
                                hoặc khu vực ảnh hưởng quốc phòng, an ninh
                            </label>
                            <YesNoRadio name="anNinhQuocPhong" dataJson={normalizedData} />
                        </div>
                    </div>

                    {isASelected("a_doiTen") && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>Đăng ký thay đổi tên doanh nghiệp</h3>
                            <Field
                                label="Tên doanh nghiệp viết bằng tiếng Việt sau khi thay đổi (ghi bằng chữ in hoa)"
                                name="tenSauThayDoiVN"
                                dataJson={normalizedData}
                                required
                            />
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
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>Đăng ký thay đổi địa chỉ trụ sở chính</h3>
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
                                <Field label="Website (nếu có)" name="truSo_website" dataJson={normalizedData} />
                            </div>
                            <label className={styles.radioLabel}>
                                <input
                                    type="checkbox"
                                    name="doiDiaChiNhanThongBaoThue"
                                    value="true"
                                    className={styles.radioInput}
                                    defaultChecked={isTruthy(normalizedData.doiDiaChiNhanThongBaoThue)}
                                />
                                Đồng thời thay đổi địa chỉ nhận thông báo thuế tương ứng với địa chỉ trụ sở chính
                            </label>
                            <div className={styles.formGroup} style={{ marginTop: 12 }}>
                                <label className={styles.label}>Doanh nghiệp nằm trong</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {["Khu công nghiệp", "Khu chế xuất", "Khu kinh tế", "Khu công nghệ cao"].map(
                                        (item) => (
                                            <label key={item} className={styles.radioLabel}>
                                                <input
                                                    type="checkbox"
                                                    name={`truSo_loaiKhu_${item.replace(/\s+/g, "_")}`}
                                                    value="true"
                                                    className={styles.radioInput}
                                                    defaultChecked={isTruthy(
                                                        normalizedData[`truSo_loaiKhu_${item.replace(/\s+/g, "_")}`],
                                                    )}
                                                />
                                                {item}
                                            </label>
                                        ),
                                    )}
                                </div>
                            </div>
                            <AttachmentNote>
                                Doanh nghiệp cam kết trụ sở doanh nghiệp thuộc quyền sử dụng hợp pháp và được sử dụng
                                đúng mục đích theo quy định của pháp luật.
                            </AttachmentNote>
                        </div>
                    )}

                    {isASelected("a_doiThanhVien") && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Đăng ký thay đổi thành viên công ty TNHH/thành viên hợp danh
                            </h3>
                            <label className={styles.radioLabel}>
                                <input
                                    type="checkbox"
                                    name="doiThanhVien_guiKem"
                                    value="true"
                                    className={styles.radioInput}
                                    defaultChecked={normalizedData.doiThanhVien_guiKem !== "false"}
                                />
                                Gửi kèm danh sách thành viên theo mẫu tương ứng.
                            </label>
                            <TextAreaField
                                label="Ghi chú về hồ sơ thành viên gửi kèm"
                                name="doiThanhVien_ghiChu"
                                dataJson={normalizedData}
                            />
                        </div>
                    )}

                    {isASelected("a_doiVonDieuLe") && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Đăng ký thay đổi vốn điều lệ, phần vốn góp, tỷ lệ phần vốn góp
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
                                    label="Giá trị tương đương theo đơn vị tiền nước ngoài (nếu có)"
                                    name="vonDieuLe_ngoaiTe"
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
                            <TaiSanGopVonSection dataJson={normalizedData} styles={styles} />
                            <label className={styles.radioLabel}>
                                <input
                                    type="checkbox"
                                    name="doiVonGop_guiKem"
                                    value="true"
                                    className={styles.radioInput}
                                    defaultChecked={isTruthy(normalizedData.doiVonGop_guiKem)}
                                />
                                Gửi kèm phần vốn góp, tỷ lệ phần vốn góp mới của thành viên công ty TNHH/công ty hợp
                                danh.
                            </label>
                            <TextAreaField
                                label="Cam kết sau khi giảm vốn (nếu đăng ký giảm vốn điều lệ)"
                                name="camKetSauGiamVon"
                                dataJson={normalizedData}
                                rows={3}
                            />
                        </div>
                    )}

                    {isASelected("a_doiNganhNghe") && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Thông báo thay đổi ngành, nghề kinh doanh
                                <InfoTooltip content={FOOTNOTES.nganhNghe} />
                            </h3>
                            <h4 className={styles.sectionTitle}>1. Bổ sung ngành, nghề kinh doanh</h4>
                            <NganhNgheTable rows={nganhBoSungRows} onChangeRows={setNganhBoSungRows} />
                            <h4 className={styles.sectionTitle}>2. Bỏ ngành, nghề kinh doanh</h4>
                            <NganhNgheTable rows={nganhBoRows} onChangeRows={setNganhBoRows} />
                            <h4 className={styles.sectionTitle}>3. Sửa đổi chi tiết ngành, nghề kinh doanh</h4>
                            <NganhNgheTable rows={nganhSuaRows} onChangeRows={setNganhSuaRows} />
                            <AttachmentNote>
                                Trường hợp thay đổi ngành, nghề kinh doanh từ ngành này sang ngành khác, kê khai đồng
                                thời ngành mới tại mục 1 và ngành cũ tại mục 2.
                            </AttachmentNote>
                        </div>
                    )}

                    {isASelected("a_doiVonDauTuDNTN") && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Đăng ký thay đổi vốn đầu tư của chủ doanh nghiệp tư nhân
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
                                    label="Giá trị tương đương theo đơn vị tiền nước ngoài (nếu có)"
                                    name="vonDauTu_ngoaiTe"
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
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Thông báo thay đổi người đại diện theo ủy quyền
                                <InfoTooltip content={FOOTNOTES.nguoiDaiDienUyQuyen} />
                            </h3>
                            <AuthorizedRepTable rows={authorizedRepRows} onChangeRows={setAuthorizedRepRows} />
                        </div>
                    )}

                    {isASelected("a_doiCoDong") && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Thông báo thay đổi cổ đông sáng lập/cổ đông là nhà đầu tư nước ngoài
                            </h3>
                            <label className={styles.radioLabel}>
                                <input
                                    type="checkbox"
                                    name="doiCoDongSangLap_guiKem"
                                    value="true"
                                    className={styles.radioInput}
                                    defaultChecked={isTruthy(normalizedData.doiCoDongSangLap_guiKem)}
                                />
                                Gửi kèm danh sách cổ đông sáng lập theo Mẫu số 7.
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="checkbox"
                                    name="doiCoDongNuocNgoai_guiKem"
                                    value="true"
                                    className={styles.radioInput}
                                    defaultChecked={isTruthy(normalizedData.doiCoDongNuocNgoai_guiKem)}
                                />
                                Gửi kèm danh sách cổ đông là nhà đầu tư nước ngoài theo Mẫu số 8.
                            </label>
                            <TextAreaField
                                label="Ghi chú về thay đổi cổ đông"
                                name="doiCoDong_ghiChu"
                                dataJson={normalizedData}
                            />
                        </div>
                    )}

                    {isASelected("a_doiThongTinThue") && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Thông báo thay đổi thông tin đăng ký thuế
                                <InfoTooltip content={FOOTNOTES.thueKeToan} />
                            </h3>
                            <ThongTinDangKyThueSection dataJson={normalizedData} styles={styles} isNote />
                        </div>
                    )}

                    {isASelected("a_doiChuSoHuuHuongLoi") && (
                        <div className={styles.sectionGroup}>
                            <h3 className={styles.sectionTitle}>
                                Thông báo thay đổi thông tin về chủ sở hữu hưởng lợi
                            </h3>
                            <label className={styles.radioLabel}>
                                <input
                                    type="checkbox"
                                    name="cshhl_mau10_guiKem"
                                    value="true"
                                    className={styles.radioInput}
                                    defaultChecked={isTruthy(normalizedData.cshhl_mau10_guiKem)}
                                />
                                Gửi kèm Mẫu số 10 về chủ sở hữu hưởng lợi của doanh nghiệp.
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="checkbox"
                                    name="cshhl_mau11_guiKem"
                                    value="true"
                                    className={styles.radioInput}
                                    defaultChecked={isTruthy(normalizedData.cshhl_mau11_guiKem)}
                                />
                                Gửi kèm Mẫu số 11 về thông tin để xác định chủ sở hữu hưởng lợi.
                            </label>
                            <TextAreaField
                                label="Ghi chú về chủ sở hữu hưởng lợi"
                                name="cshhl_ghiChu"
                                dataJson={normalizedData}
                            />
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
                    Đề nghị cấp Giấy xác nhận thay đổi nội dung đăng ký doanh nghiệp cho các thông tin thay đổi nêu
                    trên.
                </label>
            </div>
                </div>
            </div>
        </form>
    );
});

export default GiayDeNghiDangKyThayDoiDeclaration;
