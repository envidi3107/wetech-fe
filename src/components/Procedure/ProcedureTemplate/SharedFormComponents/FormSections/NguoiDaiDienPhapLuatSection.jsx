import { useEffect, useState } from "react";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { GioiTinhSelect, DanTocSelect, QuocTichSelect, ChucDanhSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import UploadCCCD from "@/components/UploadCCCD/UploadCCCD";
import { buildCCCDFormData } from "@/components/UploadCCCD/cccdFormMapper";
import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import QuocGiaInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/QuocGiaInput/QuocGiaInput";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

export default function NguoiDaiDienPhapLuatSection({ dataJson, styles, isNote = false }) {
    const [provCode_lienLac, setProvCode_lienLac] = useState("");
    const [provCode_thuongTru, setProvCode_thuongTru] = useState("");
    const { provinces, communes: communes_lienLac, loadingCommunes: loadingCommunes_lienLac } = useFetchAddress(provCode_lienLac);
    const { communes: communes_thuongTru, loadingCommunes: loadingCommunes_thuongTru } = useFetchAddress(provCode_thuongTru);

    const [localData, setLocalData] = useState(dataJson || {});
    const [formKey, setFormKey] = useState(0);

    // Sync if parent dataJson changes completely (e.g. excel import)
    useEffect(() => {
        setLocalData(dataJson || {});
        setFormKey(k => k + 1);
    }, [dataJson]);

    const handleFillCard = (card) => {
        setLocalData(prev => ({
            ...prev,
            nguoiDaiDien_hoTen: toUppercaseValue(card.fullName),
            nguoiDaiDien_ngaySinh: card.dob,
            nguoiDaiDien_gioiTinh: card.gender,
            nguoiDaiDien_cccd: card.cccd,
            nguoiDaiDien_tinh: card.currentAddress?.province,
            nguoiDaiDien_xa: card.currentAddress?.ward,
            nguoiDaiDien_soNha: card.currentAddress?.street,
            nguoiDaiDien_danToc: card.ethnicity,
            nguoiDaiDien_quocTich: card.nationality,
            nguoiDaiDien_thuongTru_tinh: card.permanentAddress?.province,
            nguoiDaiDien_thuongTru_xa: card.permanentAddress?.ward,
            nguoiDaiDien_thuongTru_soNha: card.permanentAddress?.street,
        }));
        setFormKey(k => k + 1);

        setTimeout(() => {
            const hoTenInput = document.querySelector('input[name="nguoiDaiDien_hoTen"]');
            const form = hoTenInput?.closest("form");
            if (form) {
                // Kích hoạt sự kiện để ThongTinDangKyThueSection tự đồng bộ
                ["nguoiDaiDien_hoTen", "nguoiDaiDien_gioiTinh", "nguoiDaiDien_cccd"].forEach(key => {
                    const el = form.querySelector(`[name="${key}"]`);
                    if (el) {
                        el.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                });

                // Kích hoạt sự kiện cho ngày sinh
                const nddNgaySinhHidden = form.querySelector('input[type="hidden"][name="nguoiDaiDien_ngaySinh"]');
                if (nddNgaySinhHidden) {
                    const displayInput = nddNgaySinhHidden.closest("div")?.querySelector('input[type="text"]');
                    if (displayInput) {
                        displayInput.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                }

                // Cập nhật trường phone của Giám đốc (do phần Người đại diện không có input phone)
                const giamDocPhone = form.querySelector(`input[name="giamDoc_phone"]`);
                if (giamDocPhone) {
                    giamDocPhone.value = card.phone || "";
                    giamDocPhone.dispatchEvent(new Event("input", { bubbles: true }));
                }
            }
        }, 100);
    };

    const handleFillCCCD = (customer) => {
        const cccdData = buildCCCDFormData(customer, {
            personPrefix: "nguoiDaiDien",
            contactPrefix: "nguoiDaiDien",
            permanentPrefix: "nguoiDaiDien_thuongTru",
            provinces,
        });

        setLocalData(prev => ({
            ...prev,
            ...cccdData,
        }));
        setFormKey(k => k + 1);

        setTimeout(() => {
            const hoTenInput = document.querySelector('input[name="nguoiDaiDien_hoTen"]');
            const form = hoTenInput?.closest("form");
            if (form) {
                ["nguoiDaiDien_hoTen", "nguoiDaiDien_gioiTinh", "nguoiDaiDien_cccd"].forEach(key => {
                    const el = form.querySelector(`[name="${key}"]`);
                    if (el) {
                        el.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                });

                const nddNgaySinhHidden = form.querySelector('input[type="hidden"][name="nguoiDaiDien_ngaySinh"]');
                if (nddNgaySinhHidden) {
                    const displayInput = nddNgaySinhHidden.closest("div")?.querySelector('input[type="text"]');
                    if (displayInput) {
                        displayInput.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                }
            }
        }, 100);
    };

    const tooltipNguoiDaiDien = "Ghi thông tin của tất cả người đại diện theo pháp luật trong trường hợp công ty có nhiều hơn 01 người đại diện theo pháp luật.";

    return (
        <div className={styles.sectionGroup} key={formKey}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                    Người đại diện theo pháp luật:
                    {isNote && <InfoTooltip content={tooltipNguoiDaiDien} />}
                </h3>
                <UserCardDropdown onSelect={handleFillCard} />
            </div>
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Họ, chữ đệm và tên (ghi bằng chữ in hoa): <span className={styles.required}>*</span></label>
                            <input type="text" className={styles.input} name="nguoiDaiDien_hoTen" defaultValue={toUppercaseValue(localData?.nguoiDaiDien_hoTen)} style={{ textTransform: "uppercase" }} onInput={handleUppercaseInput} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ngày, tháng, năm sinh: <span className={styles.required}>*</span></label>
                            <DateInput className={styles.input} name="nguoiDaiDien_ngaySinh" defaultValue={localData?.nguoiDaiDien_ngaySinh || ""} required />
                        </div>
                        <GioiTinhSelect name="nguoiDaiDien_gioiTinh" defaultValue={localData?.nguoiDaiDien_gioiTinh} required />
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Số định danh cá nhân: <span className={styles.required}>*</span></label>
                            <input type="text" className={styles.input} name="nguoiDaiDien_cccd" defaultValue={localData?.nguoiDaiDien_cccd || ""} required pattern="[0-9]{9,12}" />
                        </div>
                        <ChucDanhSelect name="nguoiDaiDien_chucDanh" defaultValue={localData?.nguoiDaiDien_chucDanh} required />
                    </div>
                    <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>Địa chỉ liên lạc của người đại diện:</h3>
                    <AddressSelect
                        provinces={provinces}
                        communes={communes_lienLac}
                        onProvinceChange={setProvCode_lienLac}
                        provinceName="nguoiDaiDien_tinh"
                        wardName="nguoiDaiDien_xa"
                        houseNumberName="nguoiDaiDien_soNha"
                        provinceDefault={localData?.nguoiDaiDien_tinh || ""}
                        wardDefault={localData?.nguoiDaiDien_xa || ""}
                        houseNumberDefault={localData?.nguoiDaiDien_soNha || ""}
                        isLoadingCommunes={loadingCommunes_lienLac}
                    />
                    <QuocGiaInput
                        name="nguoiDaiDien_lienLac_quocGia"
                        defaultValue={localData?.nguoiDaiDien_lienLac_quocGia}
                        styles={styles}
                    />

                    <h3 className={styles.sectionTitle} style={{ marginTop: "25px" }}>Thông tin cá nhân khác của người đại diện theo pháp luật:</h3>
                    <p className={styles.subLabel} style={{ marginTop: "16px", fontStyle: "italic", fontSize: "14px" }}>Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá nhân dưới đây:</p>
                    <div className={styles.grid2} style={{ marginTop: "8px" }}>
                        <DanTocSelect name="nguoiDaiDien_danToc" defaultValue={localData?.nguoiDaiDien_danToc} required={false} />
                        <QuocTichSelect name="nguoiDaiDien_quocTich" defaultValue={localData?.nguoiDaiDien_quocTich} required={false} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Số hộ chiếu (đối với cá nhân VN không có định danh cá nhân) / Số hộ chiếu nước ngoài hoặc giấy tờ có giá trị thay thế (đối với người nước ngoài):</label>
                        <input type="text" className={styles.input} name="nguoiDaiDien_soHoChieu" defaultValue={localData?.nguoiDaiDien_soHoChieu || ""} />
                    </div>
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ngày cấp:</label>
                            <DateInput name="nguoiDaiDien_ngayCapHoChieu" className={styles.input} defaultValue={localData?.nguoiDaiDien_ngayCapHoChieu || ""} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nơi cấp:</label>
                            <input type="text" className={styles.input} name="nguoiDaiDien_noiCapHoChieu" defaultValue={localData?.nguoiDaiDien_noiCapHoChieu || ""} />
                        </div>
                    </div>
                    <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>Nơi thường trú:</h3>
                    <AddressSelect
                        isRequired={false}
                        provinces={provinces}
                        communes={communes_thuongTru}
                        onProvinceChange={setProvCode_thuongTru}
                        provinceName="nguoiDaiDien_thuongTru_tinh"
                        wardName="nguoiDaiDien_thuongTru_xa"
                        houseNumberName="nguoiDaiDien_thuongTru_soNha"
                        provinceDefault={localData?.nguoiDaiDien_thuongTru_tinh || ""}
                        wardDefault={localData?.nguoiDaiDien_thuongTru_xa || ""}
                        houseNumberDefault={localData?.nguoiDaiDien_thuongTru_soNha || ""}
                        isLoadingCommunes={loadingCommunes_thuongTru}
                    />
                    <QuocGiaInput
                        name="nguoiDaiDien_thuongTru_quocGia"
                        defaultValue={localData?.nguoiDaiDien_thuongTru_quocGia ?? ""}
                        styles={styles}
                    />
                </div>
                <div style={{ width: "320px", flexShrink: 0, marginTop: "22px" }}>
                    <UploadCCCD onComplete={handleFillCCCD} />
                </div>
            </div>
        </div>
    );
}
