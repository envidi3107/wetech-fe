import React, { useRef, useEffect } from "react";
import FormattedNumberInput, { formatNumber } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormattedNumberInput/FormattedNumberInput";

export default function ThongTinCoPhanSection({ dataJson, styles, hideCoPhanChaoBan = false }) {
    const sectionRef = useRef(null);

    const table1Rows = [
        { label: "Cổ phần phổ thông", key: "cptt" },
        { label: "Cổ phần ưu đãi biểu quyết", key: "cpudbq" },
        { label: "Cổ phần ưu đãi cổ tức", key: "cpudct" },
        { label: "Cổ phần ưu đãi hoàn lại", key: "cpudhl" },
        { label: "Các cổ phần ưu đãi khác", key: "cpudk" },
    ];

    const table2Rows = [
        { label: "Cổ phần phổ thông", key: "cb_cptt" },
        { label: "Cổ phần ưu đãi biểu quyết", key: "cb_cpudbq" },
        { label: "Cổ phần ưu đãi cổ tức", key: "cb_cpudct" },
        { label: "Cổ phần ưu đãi hoàn lại", key: "cb_cpudhl" },
        { label: "Cổ phần ưu đãi khác", key: "cb_cpudk" },
    ];

    const handleChange = (e) => {
        if (!sectionRef.current) return;
        const section = sectionRef.current;

        // Calculate table 1 totals
        let t1_tongSoLuong = 0;
        let t1_tongGiaTri = 0;
        let t1_tongTiLe = 0;

        table1Rows.forEach(row => {
            const slInput = section.querySelector(`[name="cp_${row.key}_soLuong"]`);
            const gtInput = section.querySelector(`[name="cp_${row.key}_giaTri"]`);
            const tlInput = section.querySelector(`[name="cp_${row.key}_tiLe"]`);

            const sl = parseFloat(slInput?.value.replace(/\./g, '')) || 0;
            const gt = parseFloat(gtInput?.value.replace(/\./g, '')) || 0;
            const tl = parseFloat(tlInput?.value.replace(/,/g, '.')) || 0;

            t1_tongSoLuong += sl;
            t1_tongGiaTri += gt;
            t1_tongTiLe += tl;
        });

        const slTotalInput = section.querySelector('[name="cp_tongSoLuong"]');
        const gtTotalInput = section.querySelector('[name="cp_tongGiaTri"]');
        const tlTotalInput = section.querySelector('[name="cp_tongTiLe"]');

        if (slTotalInput) slTotalInput.value = t1_tongSoLuong ? formatNumber(t1_tongSoLuong) : "";
        if (gtTotalInput) gtTotalInput.value = t1_tongGiaTri ? formatNumber(t1_tongGiaTri) : "";
        if (tlTotalInput) tlTotalInput.value = t1_tongTiLe ? t1_tongTiLe.toFixed(1).replace('.0', '').replace('.', ',') : "";

        // Calculate table 2 totals
        let t2_tongSoLuong = 0;
        table2Rows.forEach(row => {
            const slInput = section.querySelector(`[name="cp_${row.key}_soLuong"]`);
            const sl = parseFloat(slInput?.value.replace(/\./g, '')) || 0;
            t2_tongSoLuong += sl;
        });

        const t2SlTotalInput = section.querySelector('[name="cp_cb_tongSoLuong"]');
        if (t2SlTotalInput) t2SlTotalInput.value = t2_tongSoLuong ? formatNumber(t2_tongSoLuong) : "";
    };

    // Calculate on initial render if data exists
    useEffect(() => {
        handleChange({ target: {} });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.sectionGroup} ref={sectionRef} onChange={handleChange}>
            <h3 className={styles.sectionTitle}>Thông tin về cổ phần:</h3>

            <div className={styles.formGroup} style={{ marginBottom: "16px" }}>
                <label className={styles.label}>Mệnh giá cổ phần (VNĐ):</label>
                <FormattedNumberInput
                    className={styles.input}
                    name="menhGiaCoPhan"
                    defaultValue={dataJson?.menhGiaCoPhan || ""}
                    style={{ maxWidth: "300px" }}
                />
            </div>

            <div className={styles.tableScrollWrapper} style={{ marginBottom: "20px" }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Loại cổ phần</th>
                            <th>Số lượng</th>
                            <th>Giá trị (bằng số, VNĐ)</th>
                            <th>Tỉ lệ so với vốn điều lệ (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table1Rows.map((row, idx) => (
                            <tr key={idx}>
                                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                <td>{row.label}</td>
                                <td>
                                    <FormattedNumberInput
                                        className={styles.input}
                                        name={`cp_${row.key}_soLuong`}
                                        defaultValue={dataJson?.[`cp_${row.key}_soLuong`] || ""}
                                    />
                                </td>
                                <td>
                                    <FormattedNumberInput
                                        className={styles.input}
                                        name={`cp_${row.key}_giaTri`}
                                        defaultValue={dataJson?.[`cp_${row.key}_giaTri`] || ""}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name={`cp_${row.key}_tiLe`}
                                        defaultValue={dataJson?.[`cp_${row.key}_tiLe`] || ""}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center", fontWeight: "bold" }}>Tổng số</td>
                            <td>
                                <FormattedNumberInput
                                    className={styles.input}
                                    name="cp_tongSoLuong"
                                    defaultValue={dataJson?.cp_tongSoLuong || ""}
                                    style={{ fontWeight: "bold", background: "#f5f5f5" }}
                                    readOnly={true}
                                />
                            </td>
                            <td>
                                <FormattedNumberInput
                                    className={styles.input}
                                    name="cp_tongGiaTri"
                                    defaultValue={dataJson?.cp_tongGiaTri || ""}
                                    style={{ fontWeight: "bold", background: "#f5f5f5" }}
                                    readOnly={true}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className={styles.input}
                                    name="cp_tongTiLe"
                                    defaultValue={dataJson?.cp_tongTiLe || ""}
                                    style={{ fontWeight: "bold", background: "#f5f5f5" }}
                                    readOnly={true}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {!hideCoPhanChaoBan && (
                <>
                    <p className={styles.sectionTitle} style={{ fontWeight: "500", marginBottom: "8px" }}>Thông tin về cổ phần được quyền chào bán:</p>
                    <div className={styles.tableScrollWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: "60px" }}>STT</th>
                                    <th>Loại cổ phần được quyền chào bán</th>
                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table2Rows.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                        <td>{row.label}</td>
                                        <td>
                                            <FormattedNumberInput
                                                className={styles.input}
                                                name={`cp_${row.key}_soLuong`}
                                                defaultValue={dataJson?.[`cp_${row.key}_soLuong`] || ""}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={2} style={{ textAlign: "center", fontWeight: "bold" }}>Tổng số</td>
                                    <td>
                                        <FormattedNumberInput
                                            className={styles.input}
                                            name="cp_cb_tongSoLuong"
                                            defaultValue={dataJson?.cp_cb_tongSoLuong || ""}
                                            style={{ fontWeight: "bold", background: "#f5f5f5" }}
                                            readOnly={true}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
