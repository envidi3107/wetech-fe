import { useRef, useState } from "react";
import DateInput from "@/components/DateInput/DateInput";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import FormattedNumberInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormattedNumberInput/FormattedNumberInput";
import { QuocTichSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import numberToVietnameseText from "@/utils/numberToVietnameseText";

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

export function TextAreaField({ label, name, data, styles, required = false, rows = 2 }) {
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
            />
        </div>
    );
}

// Khối chọn địa chỉ (Tỉnh/Xã/Số nhà) dùng lại component AddressSelect chung của hệ
// thống, thay cho ô nhập tự do trước đây. `addressType` là "thuongTru" hoặc "lienLac".
function PartyAddressBlock({ prefix, addressType, label, data, styles }) {
    const fieldPrefix = `${prefix}_${addressType}`;
    const [provinceCode, setProvinceCode] = useState("");
    const { provinces, communes, loadingCommunes } = useFetchAddress(provinceCode);

    return (
        <>
            <h3 className={styles.sectionTitle} style={{ marginTop: "12px" }}>
                {label}
            </h3>
            <AddressSelect
                isRequired={false}
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

export function PartySection({ title, prefix, data, styles }) {
    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <div className={styles.grid2}>
                <XungHoHoTenField prefix={prefix} data={data} styles={styles} />
                <Field label="Ngày sinh" name={`${prefix}_ngaySinh`} data={data} styles={styles} type="date" />
                <Field label="Dân tộc" name={`${prefix}_danToc`} data={data} styles={styles} />
                <QuocTichSelect
                    name={`${prefix}_quocTich`}
                    defaultValue={data?.[`${prefix}_quocTich`] || "Việt Nam"}
                    required={false}
                />
                <Field label="Số định danh cá nhân" name={`${prefix}_cccd`} data={data} styles={styles} />
            </div>
            <PartyAddressBlock
                prefix={prefix}
                addressType="thuongTru"
                label="Địa chỉ thường trú"
                data={data}
                styles={styles}
            />
            <PartyAddressBlock
                prefix={prefix}
                addressType="lienLac"
                label="Địa chỉ liên lạc"
                data={data}
                styles={styles}
            />
        </div>
    );
}
