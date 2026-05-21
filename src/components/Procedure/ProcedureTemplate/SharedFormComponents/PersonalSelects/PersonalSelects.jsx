import React from "react";
import styles from "./PersonalSelects.module.css";

export const GioiTinhSelect = ({ name, defaultValue, required = true, onChange, hideLabel = false }) => {
    return (
        <div className={styles.formGroup}>
            {!hideLabel && <label className={styles.label}>
                Giới tính {required && <span className={styles.required}>*</span>}
            </label>}
            <select
                key={defaultValue || "empty_gioitinh"}
                className={styles.select}
                name={name}
                defaultValue={defaultValue || ""}
                required={required}
                aria-label={hideLabel ? name : undefined}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            >
                <option value="" disabled>--Chọn giới tính--</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </select>
        </div>
    );
};

export const DanTocSelect = ({ name, defaultValue, required = true, onChange, hideLabel = false }) => {
    return (
        <div className={styles.formGroup}>
            {!hideLabel && <label className={styles.label}>
                Dân tộc {required && <span className={styles.required}>*</span>}
            </label>}
            <select
                key={defaultValue || "empty_dantoc"}
                className={styles.select}
                name={name}
                defaultValue={defaultValue || ""}
                required={required}
                aria-label={hideLabel ? name : undefined}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            >
                <option value="" disabled>--Chọn dân tộc--</option>
                <option value="Kinh">Kinh</option>
                <option value="Tày">Tày</option>
                <option value="Thái">Thái</option>
                <option value="Mường">Mường</option>
                <option value="Khmer">Khmer</option>
                <option value="Hoa">Hoa</option>
                <option value="Nùng">Nùng</option>
                <option value="H'Mông">H'Mông</option>
            </select>
        </div>
    );
};

export const QuocTichSelect = ({ name, defaultValue, required = true, onChange, hideLabel = false }) => {
    return (
        <div className={styles.formGroup}>
            {!hideLabel && <label className={styles.label}>
                Quốc tịch {required && <span className={styles.required}>*</span>}
            </label>}
            <select
                key={defaultValue || "empty_quoctich"}
                className={styles.select}
                name={name}
                defaultValue={defaultValue || ""}
                required={required}
                aria-label={hideLabel ? name : undefined}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            >
                <option value="" disabled>--Chọn quốc tịch--</option>
                <option value="Việt Nam">Việt Nam</option>
            </select>
        </div>
    );
};

export const ChucDanhSelect = ({ name, defaultValue, required = true, hideLabel = false, onChange }) => {
    const predefinedChucDanh = ["Giám đốc", "Tổng giám đốc"];
    const isPredefined = predefinedChucDanh.includes(defaultValue || "");
    const initialChucDanhType = defaultValue ? (isPredefined ? defaultValue : "Khác") : "";
    const initialChucDanhOther = isPredefined ? "" : (defaultValue || "");

    const [chucDanhType, setChucDanhType] = React.useState(initialChucDanhType);
    const [chucDanhOther, setChucDanhOther] = React.useState(initialChucDanhOther);
    const [hasEdited, setHasEdited] = React.useState(false);

    React.useEffect(() => {
        if (hasEdited) return;
        const nextIsPredefined = predefinedChucDanh.includes(defaultValue || "");
        setChucDanhType(defaultValue ? (nextIsPredefined ? defaultValue : "Khác") : "");
        setChucDanhOther(nextIsPredefined ? "" : (defaultValue || ""));
    }, [defaultValue, hasEdited]);

    return (
        <div className={styles.formGroup}>
            {!hideLabel && <label className={styles.label}>Chức danh {required && <span className={styles.required}>*</span>}</label>}
            <select
                className={styles.select}
                value={chucDanhType}
                onChange={(e) => {
                    setHasEdited(true);
                    const nextType = e.target.value;
                    setChucDanhType(nextType);
                    if (nextType !== "Khác") setChucDanhOther("");
                    if (onChange && nextType !== "Khác") onChange(nextType);
                }}
                name={chucDanhType === "Khác" ? undefined : name}
                required={chucDanhType !== "Khác" ? required : false}
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
                    name={name}
                    value={chucDanhOther}
                    onChange={(e) => {
                        setHasEdited(true);
                        setChucDanhOther(e.target.value);
                        if (onChange) onChange(e.target.value);
                    }}
                    placeholder="Nhập chức danh khác"
                    required={required}
                />
            )}
        </div>
    );
};
