import { useEffect, useRef, useState } from "react";
import DateInput from "@/components/DateInput/DateInput";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import FormattedNumberInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormattedNumberInput/FormattedNumberInput";
import { DanTocSelect, QuocTichSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import UploadCCCD from "@/components/UploadCCCD/UploadCCCD";
import { splitCCCDAddress } from "@/components/UploadCCCD/cccdFormMapper";
import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import numberToVietnameseText from "@/utils/numberToVietnameseText";

// Suy ra xưng hô (Ông/Bà) từ giới tính lấy được khi quét CCCD hoặc chọn từ lịch
// sử khai báo - các nguồn dữ liệu đó lưu giới tính, không lưu xưng hô.
const genderToXungHo = (gender) => {
    if (gender === "Nữ") return "Bà";
    if (gender === "Nam") return "Ông";
    return undefined;
};

// Xưng hô của các bên trong hợp đồng/biên bản - dùng để in đúng "Ông ..."/"Bà ..."
// trong văn bản xác nhận thay vì cố định "Ông/Bà".
export function XungHoSelect({ name, data, styles, required = false }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                Xưng hô {required && <span className={styles.required}>*</span>}
            </label>
            <select className={styles.select} name={name} defaultValue={data?.[name] || "Ông"} required={required}>
                <option value="Ông">Ông</option>
                <option value="Bà">Bà</option>
            </select>
        </div>
    );
}

// Gộp "Xưng hô" và "Họ và tên" vào chung một ô nhập (select + input) thay vì
// tách thành hai trường riêng biệt, giống mẫu inputPrefixWrapper/prefixSelect
// dùng cho tên công ty.
export function XungHoHoTenField({ prefix, data, styles, required = false }) {
    const xungHoName = `${prefix}_xungHo`;
    const hoTenName = `${prefix}_hoTen`;

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                Họ và tên {required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.inputPrefixWrapper}>
                <select
                    className={styles.prefixSelect}
                    name={xungHoName}
                    defaultValue={data?.[xungHoName] || "Ông"}
                    aria-label="Chọn xưng hô"
                    required={required}
                >
                    <option value="Ông">Ông</option>
                    <option value="Bà">Bà</option>
                </select>
                <input
                    type="text"
                    name={hoTenName}
                    className={styles.inputNoBorder}
                    defaultValue={data?.[hoTenName] || ""}
                    required={required}
                />
            </div>
        </div>
    );
}

export function Field({ label, name, data, styles, type = "text", required = false, placeholder = "", ...rest }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>
            {type === "date" ? (
                <DateInput className={styles.input} name={name} defaultValue={data?.[name] || ""} required={required} />
            ) : (
                <input
                    type={type}
                    className={styles.input}
                    name={name}
                    defaultValue={data?.[name] || ""}
                    placeholder={placeholder}
                    required={required}
                    {...rest}
                />
            )}
        </div>
    );
}

// Cặp trường "số tiền" + "bằng chữ": khi người dùng nhập/sửa số tiền, ô "bằng chữ"
// tự động đọc số thành chữ, trừ khi người dùng đã tự gõ tay vào ô đó.
export function AmountWithWordsField({
    amountLabel,
    amountName,
    wordsLabel,
    wordsName,
    data,
    styles,
    required = false,
}) {
    const savedAmount = data?.[amountName] ?? "";
    const savedWords = data?.[wordsName] ?? "";
    const autoWords = numberToVietnameseText(savedAmount);
    const wordsRef = useRef(null);
    const isAutoRef = useRef(!savedWords || savedWords === autoWords);

    const handleAmountInput = (event) => {
        if (!isAutoRef.current || !wordsRef.current) return;
        // FormattedNumberInput đã tự format lại event.target.value (thêm dấu chấm
        // phân cách hàng nghìn) trước khi gọi onInput, nên đọc thẳng giá trị đó.
        wordsRef.current.value = numberToVietnameseText(event.target.value);
    };

    const handleWordsInput = () => {
        isAutoRef.current = false;
    };

    return (
        <>
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    {amountLabel} {required && <span className={styles.required}>*</span>}
                </label>
                <FormattedNumberInput
                    className={styles.input}
                    name={amountName}
                    defaultValue={savedAmount}
                    onInput={handleAmountInput}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>{wordsLabel}</label>
                <input
                    ref={wordsRef}
                    type="text"
                    className={styles.input}
                    name={wordsName}
                    defaultValue={savedWords || autoWords}
                    onInput={handleWordsInput}
                />
            </div>
        </>
    );
}

export function TextAreaField({ label, name, data, styles, required = false, rows = 2, readOnly = false }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>
            <textarea
                className={styles.input}
                name={name}
                defaultValue={data?.[name] || ""}
                required={required}
                rows={rows}
                readOnly={readOnly}
            />
        </div>
    );
}

// Khối chọn địa chỉ (Tỉnh/Xã/Số nhà) dùng lại component AddressSelect chung của hệ
// thống, thay cho ô nhập tự do trước đây. `addressType` là "thuongTru" hoặc "lienLac".
function PartyAddressBlock({ prefix, addressType, label, data, styles, required = false }) {
    const fieldPrefix = `${prefix}_${addressType}`;
    const [provinceCode, setProvinceCode] = useState("");
    const { provinces, communes, loadingCommunes } = useFetchAddress(provinceCode);

    return (
        <>
            <h3 className={styles.sectionTitle} style={{ marginTop: "12px" }}>
                {label}
            </h3>
            <AddressSelect
                isRequired={required}
                provinces={provinces}
                communes={communes}
                onProvinceChange={setProvinceCode}
                provinceName={`${fieldPrefix}_tinh`}
                wardName={`${fieldPrefix}_xa`}
                houseNumberName={`${fieldPrefix}_soNha`}
                provinceDefault={data?.[`${fieldPrefix}_tinh`] || ""}
                wardDefault={data?.[`${fieldPrefix}_xa`] || ""}
                houseNumberDefault={data?.[`${fieldPrefix}_soNha`] || ""}
                isLoadingCommunes={loadingCommunes}
            />
        </>
    );
}

// Bên A/Bên B trong hợp đồng đều là cá nhân nên cho phép tự động điền thông tin
// từ "Lịch sử khai báo thông tin cá nhân" (UserCardDropdown) hoặc từ ảnh CCCD
// (UploadCCCD), thay vì bắt gõ tay toàn bộ. Vì các trường bên dưới là input
// uncontrolled (defaultValue), cần giữ localData + formKey để remount lại form
// mỗi khi có dữ liệu điền tự động, giống cách ThongTinChuSoHuuSection đang làm.
export function PartySection({ title, prefix, data, styles, required = true }) {
    const [localData, setLocalData] = useState(data || {});
    const [formKey, setFormKey] = useState(0);
    const { provinces } = useFetchAddress();

    useEffect(() => {
        setLocalData(data || {});
        setFormKey((key) => key + 1);
    }, [data]);

    const applyPersonInfo = (info) => {
        setLocalData((prev) => ({ ...prev, ...info }));
        setFormKey((key) => key + 1);
    };

    const handleFillCard = (card) => {
        const xungHo = genderToXungHo(card.gender);
        applyPersonInfo({
            ...(xungHo && { [`${prefix}_xungHo`]: xungHo }),
            [`${prefix}_hoTen`]: card.fullName || "",
            [`${prefix}_ngaySinh`]: card.dob || "",
            [`${prefix}_cccd`]: card.cccd || "",
            [`${prefix}_danToc`]: card.ethnicity || "",
            [`${prefix}_quocTich`]: card.nationality || card.country || "Việt Nam",
            [`${prefix}_thuongTru_tinh`]: card.permanentAddress?.province || "",
            [`${prefix}_thuongTru_xa`]: card.permanentAddress?.ward || "",
            [`${prefix}_thuongTru_soNha`]: card.permanentAddress?.street || "",
            [`${prefix}_lienLac_tinh`]: card.currentAddress?.province || "",
            [`${prefix}_lienLac_xa`]: card.currentAddress?.ward || "",
            [`${prefix}_lienLac_soNha`]: card.currentAddress?.street || "",
        });
    };

    const handleFillCCCD = (customer) => {
        const address = splitCCCDAddress(customer?.address, provinces);
        const xungHo = genderToXungHo(customer.gender);
        applyPersonInfo({
            ...(xungHo && { [`${prefix}_xungHo`]: xungHo }),
            [`${prefix}_hoTen`]: customer.fullName || "",
            [`${prefix}_ngaySinh`]: customer.dob || "",
            [`${prefix}_cccd`]: customer.cccd || "",
            [`${prefix}_thuongTru_tinh`]: address.province,
            [`${prefix}_thuongTru_xa`]: address.ward,
            [`${prefix}_thuongTru_soNha`]: address.street,
            [`${prefix}_lienLac_tinh`]: address.province,
            [`${prefix}_lienLac_xa`]: address.ward,
            [`${prefix}_lienLac_soNha`]: address.street,
        });
    };

    return (
        <div className={styles.sectionGroup} key={formKey}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                    {title}
                </h3>
                <UserCardDropdown onSelect={handleFillCard} />
            </div>
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <div className={styles.grid2}>
                        <XungHoHoTenField prefix={prefix} data={localData} styles={styles} required={required} />
                        <Field
                            label="Ngày sinh"
                            name={`${prefix}_ngaySinh`}
                            data={localData}
                            styles={styles}
                            type="date"
                            required={required}
                        />
                        <DanTocSelect
                            name={`${prefix}_danToc`}
                            defaultValue={localData?.[`${prefix}_danToc`]}
                            required={required}
                        />
                        <QuocTichSelect
                            name={`${prefix}_quocTich`}
                            defaultValue={localData?.[`${prefix}_quocTich`] || "Việt Nam"}
                            required={required}
                        />
                        <Field
                            label="Số định danh cá nhân"
                            name={`${prefix}_cccd`}
                            data={localData}
                            styles={styles}
                            required={required}
                        />
                    </div>
                    <PartyAddressBlock
                        prefix={prefix}
                        addressType="thuongTru"
                        label="Địa chỉ thường trú"
                        data={localData}
                        styles={styles}
                        required={required}
                    />
                    <PartyAddressBlock
                        prefix={prefix}
                        addressType="lienLac"
                        label="Địa chỉ liên lạc"
                        data={localData}
                        styles={styles}
                        required={required}
                    />
                </div>
                <div style={{ width: "320px", flexShrink: 0, marginTop: "22px" }}>
                    <UploadCCCD onComplete={handleFillCCCD} />
                </div>
            </div>
        </div>
    );
}
