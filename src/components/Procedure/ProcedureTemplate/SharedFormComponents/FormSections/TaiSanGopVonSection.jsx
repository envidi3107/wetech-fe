import { useRef } from "react";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";

export default function TaiSanGopVonSection({
    title = 'Tài sản góp vốn',
    dataJson,
    styles,
    fieldPrefix = "taiSan",
    readOnly = false,
}) {
    const tableRef = useRef(null);
    const readOnlyStyle = readOnly ? { background: "#f5f5f5", fontWeight: 600 } : {};

    const handleChange = () => {
        if (!tableRef.current) return;
        const table = tableRef.current;
        const prefixes = ["dongVN", "ngoaiTe", "vang", "qsdDat", "shtt", "khac"].map(
            (suffix) => `${fieldPrefix}_${suffix}`,
        );
        let totalGiaTri = 0;
        let totalTyLe = 0;
        prefixes.forEach(p => {
            const gtInput = table.querySelector(`[name="${p}_giaTri"]`);
            const tlInput = table.querySelector(`[name="${p}_tyLe"]`);
            const gt = parseFloat(gtInput?.value.replace(/\./g, '').replace(/,/g, '.')) || 0;
            const tl = parseFloat(tlInput?.value.replace(/,/g, '.')) || 0;
            totalGiaTri += gt;
            totalTyLe += tl;
        });
        const tongGiaTriInput = table.querySelector(`[name="${fieldPrefix}_tongSo_giaTri"]`);
        const tongTyLeInput = table.querySelector(`[name="${fieldPrefix}_tongSo_tyLe"]`);
        if (tongGiaTriInput) tongGiaTriInput.value = totalGiaTri ? totalGiaTri.toLocaleString('vi-VN') : "0";
        if (tongTyLeInput) tongTyLeInput.value = totalTyLe ? totalTyLe : "0";
    };

    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>{title}:</h3>
            <table ref={tableRef} className={styles.table} onChange={handleChange}>
                <thead>
                    <tr>
                        <th style={{ width: "50px" }}>STT</th>
                        <th>Tài sản góp vốn</th>
                        <th>Giá trị vốn của từng tài sản trong vốn điều lệ (bằng số, VNĐ)</th>
                        <th style={{ width: "100px" }}>Tỷ lệ (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { stt: 1, label: "Đồng Việt Nam", namePrefix: `${fieldPrefix}_dongVN` },
                        { stt: 2, label: "Ngoại tệ tự do chuyển đổi (ghi rõ loại ngoại tệ, số tiền được góp bằng mỗi loại ngoại tệ)", namePrefix: `${fieldPrefix}_ngoaiTe` },
                        { stt: 3, label: "Vàng", namePrefix: `${fieldPrefix}_vang` },
                        { stt: 4, label: "Quyền sử dụng đất", namePrefix: `${fieldPrefix}_qsdDat` },
                        { stt: 5, label: "Quyền sở hữu trí tuệ", namePrefix: `${fieldPrefix}_shtt` },
                        { stt: 6, label: "Các tài sản khác (ghi rõ loại tài sản, số lượng và giá trị còn lại của mỗi loại tài sản, có thể lập thành danh mục riêng kèm theo hồ sơ đăng ký doanh nghiệp)", namePrefix: `${fieldPrefix}_khac` },
                    ].map(({ stt, label, namePrefix }) => (
                        <tr key={namePrefix}>
                            <td style={{ textAlign: "center", verticalAlign: "top", paddingTop: "10px" }}>{stt}</td>
                            <td>{label}</td>
                            <td>
                                {namePrefix === `${fieldPrefix}_khac` ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ whiteSpace: "nowrap", width: "90px", fontSize: "0.9em" }}>Loại tài sản:</span>
                                            <input type="text" className={styles.input} name={`${namePrefix}_loaiTaiSan`} defaultValue={dataJson?.[`${namePrefix}_loaiTaiSan`] || ""} readOnly={readOnly} style={{ flex: 1, ...readOnlyStyle }} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ whiteSpace: "nowrap", width: "90px", fontSize: "0.9em" }}>Số lượng:</span>
                                            <input type="text" className={styles.input} name={`${namePrefix}_soLuong`} defaultValue={dataJson?.[`${namePrefix}_soLuong`] || ""} readOnly={readOnly} style={{ flex: 1, ...readOnlyStyle }} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ whiteSpace: "nowrap", width: "90px", fontSize: "0.9em" }}>Giá trị còn lại:</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                                                <FormattedNumberInput
                                                    name={`${namePrefix}_giaTri`}
                                                    defaultValue={dataJson?.[`${namePrefix}_giaTri`] || "0"}
                                                    onChange={handleChange}
                                                    className={styles.input}
                                                    readOnly={readOnly}
                                                    style={{ flex: 1, ...readOnlyStyle }}
                                                />
                                                <span style={{ whiteSpace: "nowrap", fontSize: "0.85em", color: "#555" }}>VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <FormattedNumberInput
                                            name={`${namePrefix}_giaTri`}
                                            defaultValue={dataJson?.[`${namePrefix}_giaTri`] || "0"}
                                            onChange={handleChange}
                                            className={styles.input}
                                            readOnly={readOnly}
                                            style={readOnlyStyle}
                                        />
                                        <span style={{ whiteSpace: "nowrap", fontSize: "0.85em", color: "#555" }}>VNĐ</span>
                                    </div>
                                )}
                            </td>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <input type="number" className={styles.input} name={`${namePrefix}_tyLe`} defaultValue={dataJson?.[`${namePrefix}_tyLe`] || "0"} readOnly={readOnly} style={readOnlyStyle} />
                                    <span style={{ whiteSpace: "nowrap", fontSize: "0.85em", color: "#555" }}>%</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2} style={{ textAlign: "center", fontWeight: 600 }}>Tổng số</td>
                        <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <input type="text" className={styles.input} name={`${fieldPrefix}_tongSo_giaTri`} defaultValue={dataJson?.[`${fieldPrefix}_tongSo_giaTri`] || "0"} style={{ background: "#f5f5f5" }} readOnly />
                                <span style={{ whiteSpace: "nowrap", fontSize: "0.85em", color: "#555" }}>VNĐ</span>
                            </div>
                        </td>
                        <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <input type="text" className={styles.input} name={`${fieldPrefix}_tongSo_tyLe`} defaultValue={dataJson?.[`${fieldPrefix}_tongSo_tyLe`] || "0"} style={{ background: "#f5f5f5" }} readOnly />
                                <span style={{ whiteSpace: "nowrap", fontSize: "0.85em", color: "#555" }}>%</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
