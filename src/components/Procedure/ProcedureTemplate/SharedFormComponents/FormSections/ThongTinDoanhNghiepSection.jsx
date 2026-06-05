import { useEffect, useState } from "react";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

export default function ThongTinDoanhNghiepSection({
    dataJson,
    styles,
    includeChairPersonalId = false,
    companyNamePrefixOptions = TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    defaultCompanyNamePrefix = DEFAULT_TNHH_COMPANY_NAME_PREFIX,
}) {
    const fieldClassName = styles.formGroup;
    const labelClassName = styles.label;
    const inputClassName = styles.input;
    const requiredClassName = styles.required;

    const renderField = ({ label, name, required = false }) => {
        const shouldUppercase = label?.toLocaleLowerCase("vi-VN").includes("ghi bằng chữ in hoa");

        return (
            <div className={fieldClassName}>
                <label className={labelClassName}>
                    {label} {required && <span className={requiredClassName}>*</span>}
                </label>
                <input
                    type="text"
                    className={inputClassName}
                    name={name}
                    defaultValue={shouldUppercase ? toUppercaseValue(dataJson?.[name]) : dataJson?.[name] || ""}
                    style={shouldUppercase ? { textTransform: "uppercase" } : undefined}
                    onInput={shouldUppercase ? handleUppercaseInput : undefined}
                    required={required}
                />
            </div>
        );
    };

    const [selectedCompanyNamePrefix, setSelectedCompanyNamePrefix] = useState(
        getCompanyNamePrefix(dataJson, defaultCompanyNamePrefix, companyNamePrefixOptions),
    );

    useEffect(() => {
        setSelectedCompanyNamePrefix(
            getCompanyNamePrefix(dataJson, defaultCompanyNamePrefix, companyNamePrefixOptions),
        );
    }, [dataJson, defaultCompanyNamePrefix, companyNamePrefixOptions]);

    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>Thông tin doanh nghiệp:</h3>
            <div className={styles.grid2}>
                <div className={fieldClassName}>
                    <label className={labelClassName}>
                        Tên doanh nghiệp (ghi bằng chữ in hoa) <span className={requiredClassName}>*</span>
                    </label>
                    <div className={styles.inputPrefixWrapper}>
                        <select
                            className={styles.prefixSelect}
                            name="tenCongTyPrefix"
                            value={selectedCompanyNamePrefix}
                            onChange={(event) => setSelectedCompanyNamePrefix(event.target.value)}
                            aria-label="Chọn prefix tên doanh nghiệp"
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
                            name="tenDoanhNghiep"
                            defaultValue={toUppercaseValue(dataJson?.tenDoanhNghiep)}
                            style={{ textTransform: "uppercase" }}
                            onInput={handleUppercaseInput}
                            required
                        />
                    </div>
                </div>
                {renderField({
                    label: "Mã số doanh nghiệp/Mã số thuế",
                    name: "maSoDoanhNghiep",
                    required: true,
                })}
            </div>
            {includeChairPersonalId &&
                renderField({
                    label:
                        "Số định danh cá nhân của Chủ tịch hội đồng thành viên/Chủ tịch công ty/Chủ tịch hội đồng quản trị (chỉ kê khai trong trường hợp ủy quyền thực hiện thủ tục đăng ký doanh nghiệp)",
                    name: "soDinhDanhChuTich",
                })}
        </div>
    );
}
