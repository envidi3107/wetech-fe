import { useState, useEffect } from "react";
import Select from "react-select";
import localStyles from "./KinhGuiSection.module.css";

export default function KinhGuiSection({
    dataJson,
    styles,
    autoKinhGui,
    prefixText,
    provinceOptions,
    selectedProvinceName,
    onProvinceNameChange,
}) {
    const [manualValue, setManualValue] = useState(dataJson?.kinhGui || "");

    useEffect(() => {
        setManualValue(dataJson?.kinhGui || "");
    }, [dataJson]);

    const displayValue = autoKinhGui !== undefined && autoKinhGui !== null ? autoKinhGui : manualValue;
    const hasProvinceSelect = Array.isArray(provinceOptions) && typeof onProvinceNameChange === "function";
    const selectOptions = hasProvinceSelect
        ? provinceOptions.map((province) => ({ value: province.name, label: province.name, code: province.code }))
        : [];
    const selectedProvince = selectOptions.find((option) => option.value === selectedProvinceName) || null;

    return (
        <div className={styles.formGroup}>
            <h3 className={styles.sectionTitle}>Kính gửi:</h3>
            <div className={localStyles.inputWithSuffixKinhGui}>
                {hasProvinceSelect ? (
                    <div className={localStyles.provinceKinhGui}>
                        <span className={localStyles.prefixText}>
                            {prefixText || "Cơ quan đăng ký kinh doanh cấp tỉnh"}
                        </span>
                        <Select
                            className={localStyles.provinceSelect}
                            value={selectedProvince}
                            options={selectOptions}
                            placeholder="Chọn tỉnh/thành phố"
                            isClearable
                            onChange={(option) => onProvinceNameChange(option?.value || "")}
                            noOptionsMessage={() => "Không tìm thấy"}
                        />
                    </div>
                ) : autoKinhGui !== undefined && autoKinhGui !== null ? (
                    <p className={localStyles.autoKinhGuiText}>
                        {autoKinhGui || (
                            <span style={{ color: "#999" }}>
                                Chọn tỉnh/thành phố trụ sở để tự động điền
                            </span>
                        )}
                    </p>
                ) : (
                    <input
                        type="text"
                        className={localStyles.inputKinhGui}
                        value={manualValue}
                        onChange={(event) => setManualValue(event.target.value)}
                        placeholder="Nhập kính gửi"
                        required
                    />
                )}
            </div>
            {hasProvinceSelect && (
                <>
                    <p className={localStyles.previewText}>
                        {displayValue || "Chọn tỉnh/thành phố để tự động điền Cơ quan đăng ký kinh doanh."}
                    </p>
                    <input type="hidden" name="kinhGuiProvince" value={selectedProvinceName || ""} />
                </>
            )}
            <input type="hidden" name="kinhGui" value={displayValue} />
        </div>
    );
}
