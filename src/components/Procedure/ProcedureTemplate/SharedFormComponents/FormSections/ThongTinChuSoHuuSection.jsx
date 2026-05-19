import { useState } from "react";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { GioiTinhSelect, DanTocSelect, QuocTichSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import UploadCCCD from "@/components/UploadCCCD/UploadCCCD";
import { buildCCCDFormData } from "@/components/UploadCCCD/cccdFormMapper";
import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import QuocGiaInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/QuocGiaInput/QuocGiaInput";
import { useEffect } from "react";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

export default function ThongTinChuSoHuuSection({ dataJson, styles }) {
    const [provCode_chuSoHuu, setProvCode_chuSoHuu] = useState("");
    const [provCode_thuongTru, setProvCode_thuongTru] = useState("");
    const { provinces, communes: communes_chuSoHuu, loadingCommunes: loadingCommunes_chuSoHuu } = useFetchAddress(provCode_chuSoHuu);
    const { communes: communes_thuongTru, loadingCommunes: loadingCommunes_thuongTru } = useFetchAddress(provCode_thuongTru);

    const [localData, setLocalData] = useState(dataJson || {});
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        setLocalData(dataJson || {});
        setFormKey(k => k + 1);
    }, [dataJson]);

    const handleFillCard = (card) => {
        setLocalData(prev => ({
            ...prev,
            chuSoHuu_hoTen: toUppercaseValue(card.fullName),
            chuSoHuu_ngaySinh: card.dob,
            chuSoHuu_gioiTinh: card.gender,
            chuSoHuu_cccd: card.cccd,
            chuSoHuu_tinh: card.currentAddress?.province,
            chuSoHuu_xa: card.currentAddress?.ward,
            chuSoHuu_soNha: card.currentAddress?.street,
            chuSoHuu_danToc: card.ethnicity,
            chuSoHuu_email: card.email,
            chuSoHuu_quocTich: card.nationality,
            chuSoHuu_thuongTru_tinh: card.permanentAddress?.province,
            chuSoHuu_thuongTru_xa: card.permanentAddress?.ward,
            chuSoHuu_thuongTru_soNha: card.permanentAddress?.street,
        }));
        setFormKey(k => k + 1);
    };

    const handleFillCCCD = (customer) => {
        const cccdData = buildCCCDFormData(customer, {
            personPrefix: "chuSoHuu",
            contactPrefix: "chuSoHuu",
            permanentPrefix: "chuSoHuu_thuongTru",
            provinces,
        });

        setLocalData(prev => ({
            ...prev,
            ...cccdData,
        }));
        setFormKey(k => k + 1);
    };

    return (
        <div className={styles.sectionGroup} key={formKey}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Thông tin về chủ sở hữu:</h3>
                <UserCardDropdown onSelect={handleFillCard} />
            </div>
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Họ, chữ đệm và tên (ghi bằng chữ in hoa): <span className={styles.required}>*</span>
                            </label>
                            <input type="text" className={styles.input} name="chuSoHuu_hoTen" defaultValue={toUppercaseValue(localData?.chuSoHuu_hoTen)} style={{ textTransform: "uppercase" }} onInput={handleUppercaseInput} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Ngày, tháng, năm sinh: <span className={styles.required}>*</span>
                            </label>
                            <DateInput className={styles.input} name="chuSoHuu_ngaySinh" defaultValue={localData?.chuSoHuu_ngaySinh || ""} required />
                        </div>
                        <GioiTinhSelect name="chuSoHuu_gioiTinh" defaultValue={localData?.chuSoHuu_gioiTinh} required />
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Số định danh cá nhân: <span className={styles.required}>*</span>
                            </label>
                            <input type="text" className={styles.input} name="chuSoHuu_cccd" defaultValue={localData?.chuSoHuu_cccd || ""} required pattern="[0-9]{9,12}" />
                        </div>
                    </div>

                    <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>Địa chỉ liên lạc của chủ sở hữu:</h3>
                    <AddressSelect
                        provinces={provinces}
                        communes={communes_chuSoHuu}
                        onProvinceChange={setProvCode_chuSoHuu}
                        provinceName="chuSoHuu_tinh"
                        wardName="chuSoHuu_xa"
                        houseNumberName="chuSoHuu_soNha"
                        provinceDefault={localData?.chuSoHuu_tinh || ""}
                        wardDefault={localData?.chuSoHuu_xa || ""}
                        houseNumberDefault={localData?.chuSoHuu_soNha || ""}
                        isLoadingCommunes={loadingCommunes_chuSoHuu}
                    />
                    <QuocGiaInput
                        name="chuSoHuu_lienLac_quocGia"
                        defaultValue={localData?.chuSoHuu_lienLac_quocGia}
                        styles={styles}
                    />
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Điện thoại (nếu có):</label>
                            <input type="tel" className={styles.input} name="chuSoHuu_phone" defaultValue={localData?.chuSoHuu_phone || ""} pattern="(0|\+84)[0-9]{9,10}" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Thư điện tử (nếu có):</label>
                            <input type="email" className={styles.input} name="chuSoHuu_email" defaultValue={localData?.chuSoHuu_email || ""} />
                        </div>
                    </div>

                    <h3 className={styles.sectionTitle}>Thông tin cá nhân khác của chủ sở hữu:</h3>
                    <p className={styles.subLabel} style={{ marginTop: "16px", fontStyle: "italic", fontSize: "14px" }}>Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá nhân dưới đây:</p>
                    <div className={styles.grid2} style={{ marginTop: "8px" }}>
                        <DanTocSelect name="chuSoHuu_danToc" defaultValue={localData?.chuSoHuu_danToc} required={false} />
                        <QuocTichSelect name="chuSoHuu_quocTich" defaultValue={localData?.chuSoHuu_quocTich} required={false} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Số hộ chiếu (đối với cá nhân Việt Năm không có định danh cá nhân) / Số hộ chiếu nước ngoài hoặc giấy tờ có giá trị thay thế (đối với người nước ngoài):</label>
                        <input type="text" className={styles.input} name="chuSoHuu_soHoChieu" defaultValue={localData?.chuSoHuu_soHoChieu || ""} />
                    </div>
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ngày cấp:</label>
                            <DateInput name="chuSoHuu_ngayCapHoChieu" className={styles.input} defaultValue={localData?.chuSoHuu_ngayCapHoChieu || ""} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nơi cấp:</label>
                            <input type="text" className={styles.input} name="chuSoHuu_noiCapHoChieu" defaultValue={localData?.chuSoHuu_noiCapHoChieu || ""} />
                        </div>
                    </div>
                    <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>Nơi thường trú:</h3>
                    <AddressSelect
                        isRequired={false}
                        provinces={provinces}
                        communes={communes_thuongTru}
                        onProvinceChange={setProvCode_thuongTru}
                        provinceName="chuSoHuu_thuongTru_tinh"
                        wardName="chuSoHuu_thuongTru_xa"
                        houseNumberName="chuSoHuu_thuongTru_soNha"
                        provinceDefault={localData?.chuSoHuu_thuongTru_tinh || ""}
                        wardDefault={localData?.chuSoHuu_thuongTru_xa || ""}
                        houseNumberDefault={localData?.chuSoHuu_thuongTru_soNha || ""}
                        isLoadingCommunes={loadingCommunes_thuongTru}
                    />
                    <QuocGiaInput
                        name="chuSoHuu_thuongTru_quocGia"
                        defaultValue={localData?.chuSoHuu_thuongTru_quocGia ?? ""}
                        styles={styles}
                    />

                    <h3 className={styles.sectionTitle} style={{ marginTop: "25px" }}>Thông tin về Giấy chứng nhận đăng ký đầu tư <span style={{ fontWeight: "normal", fontStyle: "italic" }}>(chỉ kê khai nếu chủ sở hữu là nhà đầu tư nước ngoài)</span>:</h3>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Mã số dự án:</label>
                        <input type="text" className={styles.input} name="chuSoHuu_maSoDuAn" defaultValue={localData?.chuSoHuu_maSoDuAn || ""} />
                    </div>
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ngày cấp:</label>
                            <DateInput name="chuSoHuu_ngayCapDuAn" className={styles.input} defaultValue={localData?.chuSoHuu_ngayCapDuAn || ""} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Cơ quan cấp:</label>
                            <input type="text" className={styles.input} name="chuSoHuu_coQuanCapDuAn" defaultValue={localData?.chuSoHuu_coQuanCapDuAn || ""} />
                        </div>
                    </div>
                </div>
                <div style={{ width: "320px", flexShrink: 0, marginTop: "22px" }}>
                    <UploadCCCD onComplete={handleFillCCCD} />
                </div>
            </div>
        </div>
    );
}
