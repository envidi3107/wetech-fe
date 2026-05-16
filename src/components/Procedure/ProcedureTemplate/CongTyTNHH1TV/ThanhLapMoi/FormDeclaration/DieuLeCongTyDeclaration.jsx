import React, { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import styles from "./SharedDeclaration.module.css";
import NganhNgheTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable";
import { GioiTinhSelect, DanTocSelect, QuocTichSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import DateInput from "@/components/DateInput/DateInput";
import CapitalInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CapitalInput/CapitalInput";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

const DieuLeCongTyDeclaration = forwardRef(function DieuLeCongTyDeclaration({ formId, dataJson, onSubmit, formRef }, componentRef) {
    const giayDeNghiData = useGetFormDataJsonFromName("Giấy đề nghị đăng ký doanh nghiệp");


    const [localChuSoHuu, setLocalChuSoHuu] = useState({});
    const [chuSoHuuKey, setChuSoHuuKey] = useState(0);

    const handleFillChuSoHuuCard = (card) => {
        setLocalChuSoHuu({
            chuSoHuu_hoTen: card.fullName || "",
            chuSoHuu_gioiTinh: card.gender || "",
            chuSoHuu_ngaySinh: card.dob || "",
            chuSoHuu_cccd: card.cccd || "",
            chuSoHuu_danToc: card.ethnicity || "Kinh",
            chuSoHuu_quocTich: card.nationality || "Việt Nam",
            chuSoHuu_tinh: card.currentAddress?.province || "",
            chuSoHuu_xa: card.currentAddress?.ward || "",
            chuSoHuu_soNha: card.currentAddress?.street || "",
        });
        setChuSoHuuKey((prev) => prev + 1);
    };

    const [localNguoiDaiDien, setLocalNguoiDaiDien] = useState({});
    const [nguoiDaiDienKey, setNguoiDaiDienKey] = useState(0);

    const handleFillNguoiDaiDienCard = (card) => {
        setLocalNguoiDaiDien({
            nguoiDaiDien_hoTen: card.fullName || "",
            nguoiDaiDien_gioiTinh: card.gender || "",
            nguoiDaiDien_ngaySinh: card.dob || "",
            nguoiDaiDien_cccd: card.cccd || "",
            nguoiDaiDien_danToc: card.ethnicity || "Kinh",
            nguoiDaiDien_quocTich: card.nationality || "Việt Nam",
            nguoiDaiDien_tinh: card.currentAddress?.province || "",
            nguoiDaiDien_xa: card.currentAddress?.ward || "",
            nguoiDaiDien_soNha: card.currentAddress?.street || "",
        });
        setNguoiDaiDienKey((prev) => prev + 1);
    };


    const [nganhNgheRows, setNganhNgheRows] = useState(dataJson?.nganhNgheList || []);
    // Province codes
    const [provCode_chuSoHuu, setProvCode_chuSoHuu] = useState("");
    const [provCode_nguoiDaiDien, setProvCode_nguoiDaiDien] = useState("");

    const { provinces, communes: communes_chuSoHuu, loadingCommunes: loadingCommunes_chuSoHuu } = useFetchAddress(provCode_chuSoHuu);
    const { communes: communes_nguoiDaiDien, loadingCommunes: loadingCommunes_nguoiDaiDien } = useFetchAddress(provCode_nguoiDaiDien);

    useEffect(() => {
        if (dataJson) {
            setNganhNgheRows(dataJson.nganhNgheList || []);
        } else if (giayDeNghiData) {
            setNganhNgheRows(giayDeNghiData.nganhNgheList || []);
        } else {
            setNganhNgheRows([]);
        }
    }, [dataJson, giayDeNghiData]);

    const defaultTenCongTyVN = dataJson?.tenCongTyVN || giayDeNghiData?.tenCongTyVN || "";
    const defaultTenCongTyEN = dataJson?.tenCongTyEN || giayDeNghiData?.tenCongTyEN || "";
    const defaultTenCongTyVietTat = dataJson?.tenCongTyVietTat || giayDeNghiData?.tenCongTyVietTat || "";

    let defaultDiaChiTruSo = "";
    if (giayDeNghiData) {
        defaultDiaChiTruSo = [giayDeNghiData.truSo_soNha, giayDeNghiData.truSo_xa, giayDeNghiData.truSo_tinh].filter(Boolean).join(", ");
    }

    const defaultDienThoai = dataJson?.dienThoai || giayDeNghiData?.truSo_phone || "";
    const defaultFax = dataJson?.fax || giayDeNghiData?.truSo_fax || "";
    const defaultEmail = dataJson?.email || giayDeNghiData?.truSo_email || "";
    const defaultWebsite = dataJson?.website || giayDeNghiData?.truSo_website || "";

    const defaultChuSoHuu_hoTen = localChuSoHuu.chuSoHuu_hoTen ?? (dataJson?.chuSoHuu_hoTen || giayDeNghiData?.chuSoHuu_hoTen || "");
    const defaultChuSoHuu_gioiTinh = localChuSoHuu.chuSoHuu_gioiTinh ?? (dataJson?.chuSoHuu_gioiTinh || giayDeNghiData?.chuSoHuu_gioiTinh);
    const defaultChuSoHuu_ngaySinh = localChuSoHuu.chuSoHuu_ngaySinh ?? (dataJson?.chuSoHuu_ngaySinh || giayDeNghiData?.chuSoHuu_ngaySinh || "");
    const defaultChuSoHuu_cccd = localChuSoHuu.chuSoHuu_cccd ?? (dataJson?.chuSoHuu_cccd || giayDeNghiData?.chuSoHuu_cccd || "");
    const defaultChuSoHuu_danToc = localChuSoHuu.chuSoHuu_danToc ?? (dataJson?.chuSoHuu_danToc || giayDeNghiData?.chuSoHuu_danToc || "Kinh");
    const defaultChuSoHuu_quocTich = localChuSoHuu.chuSoHuu_quocTich ?? (dataJson?.chuSoHuu_quocTich || giayDeNghiData?.chuSoHuu_quocTich || "Việt Nam");
    const defaultChuSoHuu_tinh = localChuSoHuu.chuSoHuu_tinh ?? (dataJson?.chuSoHuu_tinh || giayDeNghiData?.chuSoHuu_tinh || "");
    const defaultChuSoHuu_xa = localChuSoHuu.chuSoHuu_xa ?? (dataJson?.chuSoHuu_xa || giayDeNghiData?.chuSoHuu_xa || "");
    const defaultChuSoHuu_soNha = localChuSoHuu.chuSoHuu_soNha ?? (dataJson?.chuSoHuu_soNha || giayDeNghiData?.chuSoHuu_soNha || "");

    const defaultVonTienMat = dataJson?.vonTienMat || giayDeNghiData?.vonDieuLe || "";
    const defaultVonTienMat_bangChu = dataJson?.vonTienMat_bangChu || giayDeNghiData?.vonDieuLe_bangChu || "";

    const defaultNguoiDaiDien_hoTen = localNguoiDaiDien.nguoiDaiDien_hoTen ?? (dataJson?.nguoiDaiDien_hoTen || giayDeNghiData?.nguoiDaiDien_hoTen || "");
    const defaultNguoiDaiDien_gioiTinh = localNguoiDaiDien.nguoiDaiDien_gioiTinh ?? (dataJson?.nguoiDaiDien_gioiTinh || giayDeNghiData?.nguoiDaiDien_gioiTinh);
    const defaultNguoiDaiDien_ngaySinh = localNguoiDaiDien.nguoiDaiDien_ngaySinh ?? (dataJson?.nguoiDaiDien_ngaySinh || giayDeNghiData?.nguoiDaiDien_ngaySinh || "");
    const defaultNguoiDaiDien_cccd = localNguoiDaiDien.nguoiDaiDien_cccd ?? (dataJson?.nguoiDaiDien_cccd || giayDeNghiData?.nguoiDaiDien_cccd || "");
    const defaultNguoiDaiDien_danToc = localNguoiDaiDien.nguoiDaiDien_danToc ?? (dataJson?.nguoiDaiDien_danToc || giayDeNghiData?.nguoiDaiDien_danToc || "Kinh");
    const defaultNguoiDaiDien_quocTich = localNguoiDaiDien.nguoiDaiDien_quocTich ?? (dataJson?.nguoiDaiDien_quocTich || giayDeNghiData?.nguoiDaiDien_quocTich || "Việt Nam");
    const defaultNguoiDaiDien_tinh = localNguoiDaiDien.nguoiDaiDien_tinh ?? (dataJson?.nguoiDaiDien_tinh || giayDeNghiData?.nguoiDaiDien_tinh || "");
    const defaultNguoiDaiDien_xa = localNguoiDaiDien.nguoiDaiDien_xa ?? (dataJson?.nguoiDaiDien_xa || giayDeNghiData?.nguoiDaiDien_xa || "");
    const defaultNguoiDaiDien_soNha = localNguoiDaiDien.nguoiDaiDien_soNha ?? (dataJson?.nguoiDaiDien_soNha || giayDeNghiData?.nguoiDaiDien_soNha || "");
    const defaultNguoiDaiDien_chucDanh = dataJson?.nguoiDaiDien_chucDanh || giayDeNghiData?.nguoiDaiDien_chucDanh || "Giám đốc";

    const isPredefined = ["Giám đốc", "Tổng giám đốc"].includes(defaultNguoiDaiDien_chucDanh);
    const initialChucDanhType = defaultNguoiDaiDien_chucDanh ? (isPredefined ? defaultNguoiDaiDien_chucDanh : "Khác") : "";
    const [chucDanhType, setChucDanhType] = useState(initialChucDanhType);

    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.nganhNgheList = nganhNgheRows;
            return data;
        },
        getExportData: () => {
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.nganhNgheList = nganhNgheRows;
            return data;
        },
        importData: (importedData) => {
            if (!importedData) return;
            setNganhNgheRows(importedData.nganhNgheList || []);
        },
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.nganhNgheList = nganhNgheRows;
        if (onSubmit) onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={(dataJson && Object.keys(dataJson).length > 0) ? "loaded" : "empty"}>
            {/* THÔNG TIN CÔNG TY */}
            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Thông tin công ty</h3>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Tên công ty viết bằng tiếng Việt (ghi bằng chữ in hoa) <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputPrefixWrapper}>
                        <p>CÔNG TY TNHH</p>
                        <input type="text" name="tenCongTyVN" className={styles.inputNoBorder} defaultValue={toUppercaseValue(defaultTenCongTyVN)} style={{ textTransform: "uppercase" }} onInput={handleUppercaseInput} required />
                    </div>
                </div>
                <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tên công ty viết bằng tiếng nước ngoài (nếu có)</label>
                        <input type="text" name="tenCongTyEN" className={styles.input} defaultValue={defaultTenCongTyEN} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tên công ty viết tắt (nếu có)</label>
                        <input type="text" name="tenCongTyVietTat" className={styles.input} defaultValue={defaultTenCongTyVietTat} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <div className={styles.sectionTitle} style={{ marginBottom: "10px" }}>
                        Địa chỉ trụ sở chính <span className={styles.required}>*</span>
                    </div>
                    <input type="text" name="diaChiTruSo" className={styles.input} defaultValue={defaultDiaChiTruSo} required />
                </div>
                <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Điện thoại <span className={styles.required}>*</span></label>
                        <input type="text" name="dienThoai" className={styles.input} defaultValue={defaultDienThoai} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Số fax (nếu có)</label>
                        <input type="text" name="fax" className={styles.input} defaultValue={defaultFax} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Thư điện tử (nếu có)</label>
                        <input type="email" name="email" className={styles.input} defaultValue={defaultEmail} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Website (nếu có)</label>
                        <input type="text" name="website" className={styles.input} defaultValue={defaultWebsite} />
                    </div>
                </div>
            </div>

            {/* NGÀNH NGHỀ KINH DOANH */}
            <div className={styles.sectionGroup}>
                <div className={styles.tableWrapper}>
                    <NganhNgheTable rows={nganhNgheRows} onChangeRows={setNganhNgheRows} />
                </div>
            </div>

            {/* CHỦ SỞ HỮU CÔNG TY */}
            <div className={styles.sectionGroup} key={`chuSoHuu-${chuSoHuuKey}`}>
                <h3 className={styles.sectionTitle}>Chủ sở hữu công ty <UserCardDropdown onSelect={handleFillChuSoHuuCard} /></h3>
                <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Họ và tên <span className={styles.required}>*</span></label>
                        <input type="text" name="chuSoHuu_hoTen" className={styles.input} defaultValue={defaultChuSoHuu_hoTen} required />
                    </div>
                    <GioiTinhSelect name="chuSoHuu_gioiTinh" defaultValue={defaultChuSoHuu_gioiTinh} />
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Sinh ngày <span className={styles.required}>*</span></label>
                        <DateInput name="chuSoHuu_ngaySinh" className={styles.input} defaultValue={defaultChuSoHuu_ngaySinh} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Số định danh cá nhân <span className={styles.required}>*</span></label>
                        <input type="text" name="chuSoHuu_cccd" className={styles.input} defaultValue={defaultChuSoHuu_cccd} required />
                    </div>
                    <DanTocSelect name="chuSoHuu_danToc" defaultValue={defaultChuSoHuu_danToc} />
                    <QuocTichSelect name="chuSoHuu_quocTich" defaultValue={defaultChuSoHuu_quocTich} />
                </div>
                <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>Địa chỉ liên lạc của chủ sở hữu:</h3>
                <AddressSelect
                    provinces={provinces}
                    communes={communes_chuSoHuu}
                    onProvinceChange={setProvCode_chuSoHuu}
                    provinceName="chuSoHuu_tinh"
                    wardName="chuSoHuu_xa"
                    houseNumberName="chuSoHuu_soNha"
                    provinceDefault={defaultChuSoHuu_tinh}
                    wardDefault={defaultChuSoHuu_xa}
                    houseNumberDefault={defaultChuSoHuu_soNha}
                    isLoadingCommunes={loadingCommunes_chuSoHuu}
                />
            </div>

            {/* VỐN ĐIỀU LỆ */}
            <CapitalInput
                title="Vốn điều lệ"
                labelNumber="Vốn bằng tiền mặt (VNĐ)"
                labelText="Vốn bằng chữ (VNĐ)"
                nameNumber="vonTienMat"
                nameText="vonTienMat_bangChu"
                defaultNumber={defaultVonTienMat}
                defaultText={defaultVonTienMat_bangChu}
                required={true}
            />

            {/* NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT */}
            <div className={styles.sectionGroup} key={`nguoiDaiDien-${nguoiDaiDienKey}`}>
                <h3 className={styles.sectionTitle}>Người đại diện theo pháp luật của công ty <UserCardDropdown onSelect={handleFillNguoiDaiDienCard} /></h3>
                <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Họ và tên <span className={styles.required}>*</span></label>
                        <input type="text" name="nguoiDaiDien_hoTen" className={styles.input} defaultValue={defaultNguoiDaiDien_hoTen} required />
                    </div>
                    <GioiTinhSelect name="nguoiDaiDien_gioiTinh" defaultValue={defaultNguoiDaiDien_gioiTinh} />
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Sinh ngày <span className={styles.required}>*</span></label>
                        <DateInput name="nguoiDaiDien_ngaySinh" className={styles.input} defaultValue={defaultNguoiDaiDien_ngaySinh} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Số định danh cá nhân <span className={styles.required}>*</span></label>
                        <input type="text" name="nguoiDaiDien_cccd" className={styles.input} defaultValue={defaultNguoiDaiDien_cccd} required />
                    </div>
                    <DanTocSelect name="nguoiDaiDien_danToc" defaultValue={defaultNguoiDaiDien_danToc} />
                    <QuocTichSelect name="nguoiDaiDien_quocTich" defaultValue={defaultNguoiDaiDien_quocTich} />
                </div>
                <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>Địa chỉ liên lạc của người đại diện:</h3>
                <AddressSelect
                    provinces={provinces}
                    communes={communes_nguoiDaiDien}
                    onProvinceChange={setProvCode_nguoiDaiDien}
                    provinceName="nguoiDaiDien_tinh"
                    wardName="nguoiDaiDien_xa"
                    houseNumberName="nguoiDaiDien_soNha"
                    provinceDefault={defaultNguoiDaiDien_tinh}
                    wardDefault={defaultNguoiDaiDien_xa}
                    houseNumberDefault={defaultNguoiDaiDien_soNha}
                    isLoadingCommunes={loadingCommunes_nguoiDaiDien}
                />
                <div className={styles.formGroup} style={{ marginTop: "16px" }}>
                    <label className={styles.label}>Chức danh <span className={styles.required}>*</span></label>
                    <select
                        className={styles.input}
                        value={chucDanhType}
                        onChange={(e) => setChucDanhType(e.target.value)}
                        name={chucDanhType === "Khác" ? undefined : "nguoiDaiDien_chucDanh"}
                        required={chucDanhType !== "Khác"}
                    >
                        <option value="" disabled>-- Chọn chức danh --</option>
                        <option value="Giám đốc">Giám đốc</option>
                        <option value="Tổng giám đốc">Tổng giám đốc</option>
                        <option value="Khác">Khác</option>
                    </select>
                    {chucDanhType === "Khác" && (
                        <input
                            type="text"
                            className={styles.input}
                            style={{ marginTop: "8px" }}
                            name="nguoiDaiDien_chucDanh"
                            defaultValue={!isPredefined ? defaultNguoiDaiDien_chucDanh : ""}
                            placeholder="Nhập chức danh khác"
                            required
                        />
                    )}
                </div>
            </div>

            {/* HIỆU LỰC */}
            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Tổ chức thực hiện (Hiệu lực)</h3>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày thông qua điều lệ <span className={styles.required}>*</span></label>
                    <DateInput name="ngayThongQua" className={styles.input} defaultValue={dataJson?.ngayThongQua || ""} required />
                </div>
            </div>

        </form>
    );
});

export default DieuLeCongTyDeclaration;
