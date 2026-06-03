import { useRef, useEffect } from "react";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import FormattedNumberInput, { formatNumber } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormattedNumberInput/FormattedNumberInput";

export default function NguonVonDieuLeSection({ title = 'Nguồn vốn điều lệ', dataJson, styles, isNote = false }) {
    const tableRef = useRef(null);
    const tooltipVonNuocNgoai = "Kê khai trong trường hợp có nhà đầu tư nước ngoài góp vốn, mua cổ phần, phần vốn góp vào doanh nghiệp dẫn đến thay đổi nội dung đăng ký doanh nghiệp.";

    const handleChange = (e) => {
        if (!tableRef.current) return;
        const table = tableRef.current;

        const prefixes = ["nguonVon_nganSach", "nguonVon_tuNhan", "nguonVon_nuocNgoai", "nguonVon_khac"];
        let totalSoTien = 0;
        let totalTyLe = 0;
        prefixes.forEach(p => {
            const stInput = table.querySelector(`[name="${p}_soTien"]`);
            const tlInput = table.querySelector(`[name="${p}_tyLe"]`);
            const st = parseFloat(stInput?.value.replace(/\./g, '')) || 0;
            const tl = parseFloat(tlInput?.value.replace(/,/g, '.')) || 0;
            totalSoTien += st;
            totalTyLe += tl;
        });
        const tongSoTienInput = table.querySelector('[name="nguonVon_tongCong_soTien"]');
        const tongTyLeInput = table.querySelector('[name="nguonVon_tongCong_tyLe"]');
        if (tongSoTienInput) tongSoTienInput.value = formatNumber(totalSoTien) || "0";
        if (tongTyLeInput) tongTyLeInput.value = totalTyLe ? totalTyLe.toFixed(1).replace('.0', '').replace('.', ',') : "0";
    };

    // Calculate on initial render if data exists
    useEffect(() => {
        handleChange({ target: {} }); // Dummy event to trigger calculation
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle} style={{ marginTop: "12px" }}>{title}:</h3>
            <table ref={tableRef} className={styles.table} onChange={handleChange}>
                <thead>
                    <tr>
                        <th>Loại nguồn vốn</th>
                        <th>Số tiền (bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài, nếu có)</th>
                        <th style={{ width: "100px" }}>Tỷ lệ (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { label: "Vốn ngân sách nhà nước", namePrefix: "nguonVon_nganSach" },
                        { label: "Vốn tư nhân", namePrefix: "nguonVon_tuNhan" },
                        { label: "Vốn nước ngoài", namePrefix: "nguonVon_nuocNgoai" },
                        { label: "Vốn khác", namePrefix: "nguonVon_khac" },
                        { label: "Tổng cộng", namePrefix: "nguonVon_tongCong", readOnly: true },
                    ].map(({ label, namePrefix, readOnly }) => (
                        <tr key={namePrefix}>
                            <td>
                                {label}
                                {namePrefix === "nguonVon_nuocNgoai" && isNote && <InfoTooltip content={tooltipVonNuocNgoai} />}
                            </td>
                            <td>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div>
                                        <label style={{ fontSize: "12px", color: "#555", marginBottom: "4px", display: "block" }}>Giá trị VNĐ:</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <FormattedNumberInput
                                                className={styles.input}
                                                name={`${namePrefix}_soTien`}
                                                defaultValue={dataJson?.[`${namePrefix}_soTien`] || "0"}
                                                readOnly={readOnly}
                                                style={readOnly ? { background: "#f5f5f5", fontWeight: 600 } : {}}
                                            />
                                            <span style={{ whiteSpace: "nowrap", fontSize: "0.85em", color: "#555" }}>VNĐ</span>
                                        </div>
                                    </div>
                                    {namePrefix !== "nguonVon_tongCong" && (
                                        <div>
                                            <label style={{ fontSize: "12px", color: "#555", marginBottom: "4px", display: "block" }}>Ngoại tệ (nếu có):</label>
                                            <FormattedNumberInput
                                                className={styles.input}
                                                name={`${namePrefix}_ngoaiTe`}
                                                defaultValue={dataJson?.[`${namePrefix}_ngoaiTe`] || "0"}
                                            />
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        name={`${namePrefix}_tyLe`}
                                        defaultValue={dataJson?.[`${namePrefix}_tyLe`] || "0"}
                                        readOnly={readOnly}
                                        style={readOnly ? { background: "#f5f5f5", fontWeight: 600 } : {}}
                                    />
                                    <span style={{ whiteSpace: "nowrap", fontSize: "0.85em", color: "#555" }}>%</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
