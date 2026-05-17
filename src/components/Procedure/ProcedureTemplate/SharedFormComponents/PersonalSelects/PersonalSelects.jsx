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
