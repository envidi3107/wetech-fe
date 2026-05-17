import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { buildKinhGui } from "@/consts/provinceRoomMap";
import KinhGuiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/KinhGuiSection";
import ThongTinDoanhNghiepSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDoanhNghiepSection";
import NguoiDaiDienPhapLuatSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/NguoiDaiDienPhapLuatSection";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

function Field({ label, name, dataJson, required = false, type = "text" }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>
            <input
                type={type}
                className={styles.input}
                name={name}
                defaultValue={dataJson?.[name] || ""}
                required={required}
            />
        </div>
    );
}

const GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclaration = forwardRef(
    function GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclaration(
        { dataJson, onSubmit, formRef },
        componentRef,
    ) {
        const { provinces } = useFetchAddress();
        const [normalizedData, setNormalizedData] = useState(() => normalizeDataJson(dataJson));
        const [formVersion, setFormVersion] = useState(0);
        const [kinhGuiProvince, setKinhGuiProvince] = useState("");
        const [kinhGuiValue, setKinhGuiValue] = useState("");

        useEffect(() => {
            setNormalizedData(normalizeDataJson(dataJson));
            setFormVersion((version) => version + 1);
        }, [dataJson]);

        useEffect(() => {
            const matchedProvince =
                normalizedData.kinhGuiProvince ||
                provinces.find(
                    (province) =>
                        buildKinhGui(province.name) === normalizedData.kinhGui ||
                        normalizedData.kinhGui?.trim().endsWith(province.name),
                )?.name ||
                "";

            setKinhGuiProvince(matchedProvince);
            setKinhGuiValue(matchedProvince ? buildKinhGui(matchedProvince) : normalizedData.kinhGui || "");
        }, [normalizedData, provinces]);

        const handleKinhGuiProvinceChange = (provinceName) => {
            setKinhGuiProvince(provinceName);
            setKinhGuiValue(provinceName ? buildKinhGui(provinceName) : "");
        };

        const collectData = () => {
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }

            if (!kinhGuiValue) {
                window.alert("Vui lòng chọn tỉnh/thành phố cho mục Kính gửi.");
                return null;
            }

            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.kinhGui = kinhGuiValue;
            data.kinhGuiProvince = kinhGuiProvince;
            return data;
        };

        useImperativeHandle(componentRef, () => ({
            getDraftData: collectData,
            getExportData: collectData,
            importData: (importedData) => {
                const parsed = normalizeDataJson(importedData);
                setNormalizedData(parsed);
                setFormVersion((version) => version + 1);
            },
        }));

        const handleSubmit = (event) => {
            event.preventDefault();
            const data = collectData();
            if (data && onSubmit) onSubmit(data);
        };

        return (
            <form onSubmit={handleSubmit} ref={formRef} key={formVersion}>
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
                    includeChairPersonalId
                />

                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>
                        Đăng ký thay đổi người đại diện theo pháp luật với các nội dung sau:
                    </h3>
                    <NguoiDaiDienPhapLuatSection dataJson={normalizedData} styles={styles} />
                    <div className={styles.grid2}>
                        <Field
                            label="Điện thoại của người đại diện theo pháp luật (nếu có)"
                            name="nguoiDaiDien_phone"
                            dataJson={normalizedData}
                        />
                        <Field
                            label="Thư điện tử của người đại diện theo pháp luật (nếu có)"
                            name="nguoiDaiDien_email"
                            dataJson={normalizedData}
                            type="email"
                        />
                    </div>
                </div>
            </form>
        );
    },
);

export default GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclaration;
