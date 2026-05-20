import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
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

const SOURCE_FORM_NAME = "Giấy đề nghị đăng ký thay đổi nội dung giấy chứng nhận đăng ký doanh nghiệp";

const emptyContributionRow = {
    hoTen: "",
    giaTriTangGiam: "",
    phanVonSauThayDoi: "",
    tyLeSauThayDoi: "",
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

function getCapitalChangeVerb(data) {
    const text = data.hinhThucTangGiamVon || data.qdHinhThucTangGiamVon || "";
    const lowered = text.toLocaleLowerCase("vi-VN");
    if (lowered.includes("giảm")) return "giảm";
    if (lowered.includes("tăng")) return "tăng";

    const diff = getCapitalDifference(data);
    if (diff === null) return "tăng/giảm";
    if (diff < 0) return "giảm";
    if (diff > 0) return "tăng";
    return "tăng/giảm";
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
    const sourceRows = data.qdThanhVienGopVonList || data.doiThanhVienList || data.thanhVienList || [];
    if (sourceRows.length) {
        return sourceRows.map((row) => ({
            hoTen: row.hoTen || row.chuSoHuu || "",
            giaTriTangGiam: row.giaTriTangGiam || "",
            phanVonSauThayDoi: row.phanVonSauThayDoi || row.phanVonGop || data.vonDieuLeSauThayDoi || "",
            tyLeSauThayDoi: row.tyLeSauThayDoi || row.tyLe || "",
        }));
    }

    const ownerName = data.chuSoHuu_hoTen || data.nguoiDaiDien_hoTen || data.qdChuTichHoiDongThanhVien || "";
    const diff = getCapitalDifference(data);
    return [
        {
            hoTen: ownerName,
            giaTriTangGiam: diff === null ? "" : formatNumber(Math.abs(diff)),
            phanVonSauThayDoi: data.vonDieuLeSauThayDoi || "",
            tyLeSauThayDoi: data.vonDieuLeSauThayDoi ? "100" : "",
        },
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

    if (!nextData.qdHinhThucTangGiamVon) {
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
            nextData.nguoiDaiDien_soNha,
            nextData.nguoiDaiDien_xa,
            nextData.nguoiDaiDien_tinh,
        ]
            .filter(Boolean)
            .join(", ");
    }

    nextData.qdThanhVienGopVonList = contributionRows;
    return nextData;
}

function Field({ label, name, data, required = false, children }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>
            {children || <input className={styles.input} name={name} defaultValue={data?.[name] || ""} required={required} />}
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

function ContributionRowsTable({ rows, onChangeRows }) {
    const updateRow = (index, field, value) => {
        const nextRows = [...rows];
        nextRows[index] = { ...nextRows[index], [field]: value };
        onChangeRows(nextRows);
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th style={{ width: 60 }}>STT</th>
                    <th>Ông/Bà/Thành viên</th>
                    <th>Giá trị tăng/giảm vốn</th>
                    <th>Phần vốn góp sau thay đổi</th>
                    <th style={{ width: 120 }}>Tỷ lệ (%)</th>
                    <th style={{ width: 90 }}></th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td>
                            <input
                                className={styles.tableInput}
                                value={row.hoTen || ""}
                                onChange={(event) => updateRow(index, "hoTen", event.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className={styles.tableInput}
                                value={row.giaTriTangGiam || ""}
                                onChange={(event) => updateRow(index, "giaTriTangGiam", event.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className={styles.tableInput}
                                value={row.phanVonSauThayDoi || ""}
                                onChange={(event) => updateRow(index, "phanVonSauThayDoi", event.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className={styles.tableInput}
                                value={row.tyLeSauThayDoi || ""}
                                onChange={(event) => updateRow(index, "tyLeSauThayDoi", event.target.value)}
                            />
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => onChangeRows(rows.filter((_, rowIndex) => rowIndex !== index))}
                                style={{ border: "none", background: "transparent", color: "#c0392b", cursor: "pointer" }}
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

const QuyetDinhHoiDongThanhVienDeclaration = forwardRef(function QuyetDinhHoiDongThanhVienDeclaration(
    { dataJson, onSubmit, formRef },
    componentRef,
) {
    const sourceFormData = useGetFormDataJsonFromName(SOURCE_FORM_NAME);
    const currentData = useMemo(() => normalizeDataJson(dataJson), [dataJson]);
    const sourceData = useMemo(() => normalizeDataJson(sourceFormData), [sourceFormData]);
    const mergedData = useMemo(() => ({ ...sourceData, ...currentData }), [currentData, sourceData]);
    const [contributionRows, setContributionRows] = useState([emptyContributionRow]);

    useEffect(() => {
        setContributionRows(getSourceDefaultContributionRows(mergedData));
    }, [mergedData]);

    const decisionData = applyDecisionDefaults(mergedData, contributionRows);
    const capitalDiff = getCapitalDifference(decisionData);
    const changeVerb = getCapitalChangeVerb(decisionData);
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
                    <Field
                        label="Số quyết định"
                        name="qdSoQuyetDinh"
                        data={{ qdSoQuyetDinh: decisionData.qdSoQuyetDinh || `01/${new Date().getFullYear()}/QĐ` }}
                        required
                    />
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
                    />
                    <Field label="Ngày biên bản họp HĐTV" name="qdNgayBienBanHop" data={decisionData}>
                        <DateInput
                            name="qdNgayBienBanHop"
                            className={styles.input}
                            defaultValue={decisionData.qdNgayBienBanHop || decisionData.qdNgayQuyetDinh || getTodayInputValue()}
                        />
                    </Field>
                    <Field
                        label="Người được giao thực hiện thủ tục"
                        name="qdNguoiThucHienThuTuc"
                        data={{
                            qdNguoiThucHienThuTuc:
                                decisionData.qdNguoiThucHienThuTuc ||
                                decisionData.nguoiDaiDien_hoTen ||
                                decisionData.chuSoHuu_hoTen ||
                                "",
                        }}
                    />
                    <Field
                        label="Chủ tịch Hội đồng thành viên ký quyết định"
                        name="qdChuTichHoiDongThanhVien"
                        data={{
                            qdChuTichHoiDongThanhVien:
                                decisionData.qdChuTichHoiDongThanhVien ||
                                decisionData.nguoiDaiDien_hoTen ||
                                decisionData.chuSoHuu_hoTen ||
                                "",
                        }}
                    />
                </div>
                <label className={styles.radioLabel}>
                    <input
                        type="checkbox"
                        name="qdSuaDoiDieuLe"
                        value="true"
                        className={styles.radioInput}
                        defaultChecked={decisionData.qdSuaDoiDieuLe !== "false"}
                    />
                    Tự động đưa nội dung sửa đổi điều lệ công ty tương ứng với Điều 1 vào quyết định.
                </label>
            </div>

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Thông tin lấy từ Giấy đề nghị đăng ký thay đổi</h3>
                <div className={styles.grid2}>
                    <ReadOnlyField label="Tên doanh nghiệp" value={getDecisionCompanyName(decisionData)} />
                    <ReadOnlyField label="Mã số doanh nghiệp/Mã số thuế" value={decisionData.maSoDoanhNghiep} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nội dung thay đổi đã chọn</label>
                    <div className={styles.radioGroup} style={{ alignItems: "flex-start", flexDirection: "column", gap: 4 }}>
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
            </div>

            {isTruthy(decisionData.a_doiVonDieuLe) && (
                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>Tự động tính nội dung thay đổi vốn điều lệ</h3>
                    <div className={styles.grid2}>
                        <ReadOnlyField label="Vốn điều lệ đã đăng ký" value={decisionData.vonDieuLeDaDangKy} />
                        <ReadOnlyField label="Vốn điều lệ sau khi thay đổi" value={decisionData.vonDieuLeSauThayDoi} />
                        <ReadOnlyField label="Chênh lệch vốn tự động tính" value={formatSignedNumber(capitalDiff)} />
                        <ReadOnlyField label="Hình thức tăng/giảm tự động xác định" value={decisionData.qdHinhThucTangGiamVon} />
                        <ReadOnlyField label="Thời điểm tăng/giảm vốn" value={decisionData.thoiDiemThayDoiVon} />
                        <ReadOnlyField label="Diễn đạt trong quyết định" value={changeVerb} />
                    </div>
                    <h4 className={styles.sectionTitle}>Trong đó và cơ cấu góp vốn sau thay đổi</h4>
                    <ContributionRowsTable
                        rows={contributionRows}
                        onChangeRows={setContributionRows}
                    />
                    <button
                        type="button"
                        onClick={() => setContributionRows([...contributionRows, { ...emptyContributionRow }])}
                        style={{
                            marginTop: 10,
                            border: "1px solid #1b154b",
                            background: "#fff",
                            color: "#1b154b",
                            borderRadius: 4,
                            padding: "8px 12px",
                            cursor: "pointer",
                        }}
                    >
                        Thêm dòng góp vốn
                    </button>
                </div>
            )}

            {isTruthy(decisionData.a_doiNganhNghe) && (
                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>Ngành, nghề kinh doanh lấy từ Giấy đề nghị</h3>
                    <BusinessRowsPreview title="Bổ sung ngành, nghề kinh doanh sau" rows={decisionData.nganhNgheBoSungList} />
                    <BusinessRowsPreview title="Bỏ ngành, nghề kinh doanh sau" rows={decisionData.nganhNgheBoList} removed />
                    <BusinessRowsPreview title="Sửa đổi chi tiết ngành, nghề kinh doanh" rows={decisionData.nganhNgheSuaList} />
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
                        defaultChecked={isTruthy(decisionData.qdDoiNguoiDaiDienPhapLuat)}
                    />
                    Bổ sung mục thay đổi người đại diện theo pháp luật trong quyết định.
                </label>
                <div className={styles.grid2}>
                    <Field label="Họ, chữ đệm và tên" name="qdNguoiDaiDien_hoTen" data={decisionData} />
                    <Field label="Ngày sinh" name="qdNguoiDaiDien_ngaySinh" data={decisionData}>
                        <DateInput
                            name="qdNguoiDaiDien_ngaySinh"
                            className={styles.input}
                            defaultValue={decisionData.qdNguoiDaiDien_ngaySinh || decisionData.nguoiDaiDien_ngaySinh || ""}
                        />
                    </Field>
                    <Field label="Giới tính" name="qdNguoiDaiDien_gioiTinh" data={decisionData} />
                    <Field label="Số định danh cá nhân" name="qdNguoiDaiDien_cccd" data={decisionData} />
                    <Field label="Chức danh" name="qdNguoiDaiDien_chucDanh" data={decisionData} />
                    <Field label="Địa chỉ liên lạc" name="qdNguoiDaiDien_diaChi" data={decisionData} />
                    <Field label="Điện thoại" name="qdNguoiDaiDien_phone" data={decisionData} />
                    <Field label="Thư điện tử" name="qdNguoiDaiDien_email" data={decisionData} />
                </div>
            </div>
        </form>
    );
});

export default QuyetDinhHoiDongThanhVienDeclaration;
