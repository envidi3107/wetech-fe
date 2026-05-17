import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

export default function ThongTinDoanhNghiepSection({
    dataJson,
    styles,
    includeChairPersonalId = false,
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

    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>Thông tin doanh nghiệp:</h3>
            <div className={styles.grid2}>
                {renderField({
                    label: "Tên doanh nghiệp (ghi bằng chữ in hoa)",
                    name: "tenDoanhNghiep",
                    required: true,
                })}
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
