import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

export default function TenCongTySection({ dataJson, styles, prefix }) {
    const prefixOptions = Array.isArray(prefix) ? prefix : prefix ? [prefix] : [];
    const selectedPrefix = dataJson?.tenCongTyPrefix || prefixOptions[0] || "";

    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>Tên công ty:</h3>
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Tên công ty viết bằng tiếng Việt (ghi bằng chữ in hoa): <span className={styles.required}>*</span>
                </label>
                {prefix ? (
                    <div className={styles.inputPrefixWrapper}>
                        {prefixOptions.length > 1 ? (
                            <select
                                className={styles.prefixSelect}
                                name="tenCongTyPrefix"
                                defaultValue={selectedPrefix}
                                aria-label="Chọn prefix tên công ty"
                            >
                                {prefixOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <>
                                <p>{selectedPrefix}</p>
                                <input type="hidden" name="tenCongTyPrefix" value={selectedPrefix} />
                            </>
                        )}
                        <input
                            type="text"
                            className={styles.inputNoBorder}
                            name="tenCongTyVN"
                            defaultValue={toUppercaseValue(dataJson?.tenCongTyVN)}
                            style={{ textTransform: "uppercase" }}
                            onInput={handleUppercaseInput}
                            required
                        />
                    </div>
                ) : (
                    <input
                        type="text"
                        className={styles.input}
                        name="tenCongTyVN"
                        defaultValue={toUppercaseValue(dataJson?.tenCongTyVN)}
                        style={{ textTransform: "uppercase" }}
                        onInput={handleUppercaseInput}
                        required
                    />
                )}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Tên công ty viết bằng tiếng nước ngoài (nếu có):</label>
                <input
                    type="text"
                    className={styles.input}
                    name="tenCongTyEN"
                    defaultValue={dataJson?.tenCongTyEN || ""}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Tên công ty viết tắt (nếu có):</label>
                <input
                    type="text"
                    className={styles.input}
                    name="tenCongTyVietTat"
                    defaultValue={dataJson?.tenCongTyVietTat || ""}
                />
            </div>
        </div>
    );
}
