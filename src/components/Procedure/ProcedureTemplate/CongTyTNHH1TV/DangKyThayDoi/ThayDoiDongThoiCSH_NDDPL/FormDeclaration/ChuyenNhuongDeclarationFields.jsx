import DateInput from "@/components/DateInput/DateInput";

export function Field({ label, name, data, styles, type = "text", required = false, placeholder = "" }) {
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
                />
            )}
        </div>
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

export function PartySection({ title, prefix, data, styles }) {
    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <div className={styles.grid2}>
                <Field label="Ông/Bà" name={`${prefix}_hoTen`} data={data} styles={styles} />
                <Field label="Ngày sinh" name={`${prefix}_ngaySinh`} data={data} styles={styles} type="date" />
                <Field label="Dân tộc" name={`${prefix}_danToc`} data={data} styles={styles} />
                <Field label="Quốc tịch" name={`${prefix}_quocTich`} data={data} styles={styles} />
                <Field label="Số định danh cá nhân" name={`${prefix}_cccd`} data={data} styles={styles} />
            </div>
            <TextAreaField label="Địa chỉ thường trú" name={`${prefix}_diaChiThuongTru`} data={data} styles={styles} />
            <TextAreaField label="Địa chỉ liên lạc" name={`${prefix}_diaChiLienLac`} data={data} styles={styles} />
        </div>
    );
}
