import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import ThongTinDoanhNghiepSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDoanhNghiepSection";
import NguoiDaiDienPhapLuatSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/NguoiDaiDienPhapLuatSection";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

function Field({ label, name, data, type = "text" }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>{label}</label>
            <input type={type} className={styles.input} name={name} defaultValue={data?.[name] ?? ""} />
        </div>
    );
}

const QuyetDinhChuSoHuuThayDoiNguoiDaiDienDeclaration = forwardRef(
    function QuyetDinhChuSoHuuThayDoiNguoiDaiDienDeclaration({ dataJson, onSubmit, formRef }, componentRef) {
        const [normalizedData, setNormalizedData] = useState(() => normalizeDataJson(dataJson));
        const [formVersion, setFormVersion] = useState(0);

        useEffect(() => {
            setNormalizedData(normalizeDataJson(dataJson));
            setFormVersion((version) => version + 1);
        }, [dataJson]);

        const collectData = () => {
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }

            return {
                ...normalizedData,
                ...Object.fromEntries(new FormData(formRef.current).entries()),
            };
        };

        useImperativeHandle(componentRef, () => ({
            getDraftData: collectData,
            getExportData: collectData,
            importData: (importedData) => {
                setNormalizedData(normalizeDataJson(importedData));
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
                <ThongTinDoanhNghiepSection
                    dataJson={normalizedData}
                    styles={styles}
                    companyNamePrefixOptions={TNHH_COMPANY_NAME_PREFIX_OPTIONS}
                    defaultCompanyNamePrefix={DEFAULT_TNHH_COMPANY_NAME_PREFIX}
                />

                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>Người đại diện theo pháp luật sau khi thay đổi:</h3>
                    <NguoiDaiDienPhapLuatSection
                        dataJson={normalizedData}
                        styles={styles}
                        hideAdditionalPersonalInfo
                        hidePermanentAddress
                    />
                    <div className={styles.grid2}>
                        <Field label="Điện thoại (nếu có)" name="nguoiDaiDien_phone" data={normalizedData} type="tel" />
                        <Field
                            label="Thư điện tử (nếu có)"
                            name="nguoiDaiDien_email"
                            data={normalizedData}
                            type="email"
                        />
                    </div>
                </div>
            </form>
        );
    },
);

export default QuyetDinhChuSoHuuThayDoiNguoiDaiDienDeclaration;
