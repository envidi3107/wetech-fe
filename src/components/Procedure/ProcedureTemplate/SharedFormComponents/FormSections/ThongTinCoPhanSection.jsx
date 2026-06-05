import React, { useRef, useEffect, useCallback } from "react";
import FormattedNumberInput, {
    formatNumber,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormattedNumberInput/FormattedNumberInput";

const COMPACT_TABLE_WRAPPER_STYLE = { overflowX: "hidden" };
const COMPACT_TABLE_STYLE = { minWidth: "0", tableLayout: "fixed" };
const RATIO_COLUMN_STYLE = {
    width: "112px",
    whiteSpace: "normal",
    lineHeight: 1.25,
};
const CENTERED_TABLE_INPUT_STYLE = {
    textAlign: "center",
};
const RATIO_INPUT_STYLE = {
    width: "100%",
    ...CENTERED_TABLE_INPUT_STYLE,
};

const SHARE_CAPITAL_ROWS = [
    { label: "Cổ phần phổ thông", key: "cptt" },
    { label: "Cổ phần ưu đãi biểu quyết", key: "cpudbq" },
    { label: "Cổ phần ưu đãi cổ tức", key: "cpudct" },
    { label: "Cổ phần ưu đãi hoàn lại", key: "cpudhl" },
    { label: "Các cổ phần ưu đãi khác", key: "cpudk" },
];

const SHARE_OFFER_ROWS = [
    { label: "Cổ phần phổ thông", key: "cb_cptt" },
    { label: "Cổ phần ưu đãi biểu quyết", key: "cb_cpudbq" },
    { label: "Cổ phần ưu đãi cổ tức", key: "cb_cpudct" },
    { label: "Cổ phần ưu đãi hoàn lại", key: "cb_cpudhl" },
    { label: "Cổ phần ưu đãi khác", key: "cb_cpudk" },
];

const parseNumberValue = (value) => parseFloat(String(value || "").replace(/[^0-9]/g, "")) || 0;

const parseRatioValue = (value) => parseFloat(String(value || "").replace(",", ".")) || 0;

const formatRatio = (value) => {
    if (!value) return "";
    const rounded = Math.round(value * 10000) / 10000;
    return String(rounded).replace(".", ",");
};

const setInputValue = (input, value) => {
    if (input && input.value !== value) {
        input.value = value;
    }
};

const findInput = (root, name) => root?.querySelector(`input[name="${name}"]`);

export default function ThongTinCoPhanSection({ dataJson, styles, hideCoPhanChaoBan = false }) {
    const sectionRef = useRef(null);

    const recalculateShareTables = useCallback(() => {
        if (!sectionRef.current) return;
        const section = sectionRef.current;
        const form = section.closest("form") || section;
        const menhGia = parseNumberValue(findInput(section, "menhGiaCoPhan")?.value);
        const vonDieuLe =
            parseNumberValue(findInput(form, "vonDieuLeSauThayDoi")?.value) ||
            parseNumberValue(findInput(form, "vonDieuLe")?.value);

        let t1_tongSoLuong = 0;
        let t1_tongGiaTri = 0;
        let t1_tongTiLe = 0;

        SHARE_CAPITAL_ROWS.forEach((row) => {
            const slInput = findInput(section, `cp_${row.key}_soLuong`);
            const gtInput = findInput(section, `cp_${row.key}_giaTri`);
            const tlInput = findInput(section, `cp_${row.key}_tiLe`);

            const soLuong = parseNumberValue(slInput?.value);
            const hasSoLuong = Boolean(String(slInput?.value || "").trim());
            const giaTri = hasSoLuong && menhGia ? soLuong * menhGia : parseNumberValue(gtInput?.value);
            const tiLe = hasSoLuong && giaTri && vonDieuLe ? (giaTri / vonDieuLe) * 100 : parseRatioValue(tlInput?.value);

            if (!hasSoLuong) {
                setInputValue(gtInput, "");
                setInputValue(tlInput, "");
            } else if (menhGia) {
                setInputValue(gtInput, formatNumber(giaTri));
            }

            if (hasSoLuong && giaTri && vonDieuLe) {
                setInputValue(tlInput, formatRatio(tiLe));
            } else if (hasSoLuong && !vonDieuLe) {
                setInputValue(tlInput, "");
            }

            t1_tongSoLuong += soLuong;
            t1_tongGiaTri += hasSoLuong ? giaTri : 0;
            t1_tongTiLe += hasSoLuong && vonDieuLe ? tiLe : 0;
        });

        const slTotalInput = findInput(section, "cp_tongSoLuong");
        const gtTotalInput = findInput(section, "cp_tongGiaTri");
        const tlTotalInput = findInput(section, "cp_tongTiLe");

        setInputValue(slTotalInput, t1_tongSoLuong ? formatNumber(t1_tongSoLuong) : "");
        setInputValue(gtTotalInput, t1_tongGiaTri ? formatNumber(t1_tongGiaTri) : "");
        setInputValue(tlTotalInput, t1_tongTiLe ? formatRatio(t1_tongTiLe) : "");

        let t2_tongSoLuong = 0;
        SHARE_OFFER_ROWS.forEach((row) => {
            const slInput = findInput(section, `cp_${row.key}_soLuong`);
            t2_tongSoLuong += parseNumberValue(slInput?.value);
        });

        const t2SlTotalInput = findInput(section, "cp_cb_tongSoLuong");
        setInputValue(t2SlTotalInput, t2_tongSoLuong ? formatNumber(t2_tongSoLuong) : "");
    }, []);

    const handleChange = () => {
        window.requestAnimationFrame(recalculateShareTables);
    };

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return undefined;

        const form = section.closest("form");
        const handleInput = (event) => {
            const name = event.target?.name || "";
            if (
                name === "vonDieuLe" ||
                name === "vonDieuLeSauThayDoi" ||
                name === "menhGiaCoPhan" ||
                name.startsWith("cp_")
            ) {
                window.requestAnimationFrame(recalculateShareTables);
            }
        };

        recalculateShareTables();
        form?.addEventListener("input", handleInput);

        return () => form?.removeEventListener("input", handleInput);
    }, [recalculateShareTables, dataJson]);

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

            <div className={styles.tableScrollWrapper} style={{ ...COMPACT_TABLE_WRAPPER_STYLE, marginBottom: "20px" }}>
                <table className={styles.table} style={COMPACT_TABLE_STYLE}>
                    <colgroup>
                        <col style={{ width: "52px" }} />
                        <col style={{ width: "28%" }} />
                        <col style={{ width: "19%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "112px" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Loại cổ phần</th>
                            <th>Số lượng</th>
                            <th>Giá trị (bằng số, VNĐ)</th>
                            <th style={RATIO_COLUMN_STYLE}>Tỉ lệ so với vốn điều lệ (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SHARE_CAPITAL_ROWS.map((row, idx) => (
                            <tr key={idx}>
                                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                <td>{row.label}</td>
                                <td>
                                    <FormattedNumberInput
                                        className={styles.input}
                                        name={`cp_${row.key}_soLuong`}
                                        defaultValue={dataJson?.[`cp_${row.key}_soLuong`] || ""}
                                        style={CENTERED_TABLE_INPUT_STYLE}
                                    />
                                </td>
                                <td>
                                    <FormattedNumberInput
                                        className={styles.input}
                                        name={`cp_${row.key}_giaTri`}
                                        defaultValue={dataJson?.[`cp_${row.key}_giaTri`] || ""}
                                        style={CENTERED_TABLE_INPUT_STYLE}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name={`cp_${row.key}_tiLe`}
                                        defaultValue={dataJson?.[`cp_${row.key}_tiLe`] || ""}
                                        style={RATIO_INPUT_STYLE}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center", fontWeight: "bold" }}>
                                Tổng số
                            </td>
                            <td>
                                <FormattedNumberInput
                                    className={styles.input}
                                    name="cp_tongSoLuong"
                                    defaultValue={dataJson?.cp_tongSoLuong || ""}
                                    style={{ ...CENTERED_TABLE_INPUT_STYLE, fontWeight: "bold", background: "#f5f5f5" }}
                                    readOnly={true}
                                />
                            </td>
                            <td>
                                <FormattedNumberInput
                                    className={styles.input}
                                    name="cp_tongGiaTri"
                                    defaultValue={dataJson?.cp_tongGiaTri || ""}
                                    style={{ ...CENTERED_TABLE_INPUT_STYLE, fontWeight: "bold", background: "#f5f5f5" }}
                                    readOnly={true}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className={styles.input}
                                    name="cp_tongTiLe"
                                    defaultValue={dataJson?.cp_tongTiLe || ""}
                                    style={{ ...RATIO_INPUT_STYLE, fontWeight: "bold", background: "#f5f5f5" }}
                                    readOnly={true}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {!hideCoPhanChaoBan && (
                <>
                    <p className={styles.sectionTitle} style={{ fontWeight: "500", marginBottom: "8px" }}>
                        Thông tin về cổ phần được quyền chào bán:
                    </p>
                    <div className={styles.tableScrollWrapper} style={COMPACT_TABLE_WRAPPER_STYLE}>
                        <table className={styles.table} style={COMPACT_TABLE_STYLE}>
                            <colgroup>
                                <col style={{ width: "52px" }} />
                                <col />
                                <col style={{ width: "190px" }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th style={{ width: "60px" }}>STT</th>
                                    <th>Loại cổ phần được quyền chào bán</th>
                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SHARE_OFFER_ROWS.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                        <td>{row.label}</td>
                                        <td>
                                            <FormattedNumberInput
                                                className={styles.input}
                                                name={`cp_${row.key}_soLuong`}
                                                defaultValue={dataJson?.[`cp_${row.key}_soLuong`] || ""}
                                                style={CENTERED_TABLE_INPUT_STYLE}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={2} style={{ textAlign: "center", fontWeight: "bold" }}>
                                        Tổng số
                                    </td>
                                    <td>
                                        <FormattedNumberInput
                                            className={styles.input}
                                            name="cp_cb_tongSoLuong"
                                            defaultValue={dataJson?.cp_cb_tongSoLuong || ""}
                                            style={{ ...CENTERED_TABLE_INPUT_STYLE, fontWeight: "bold", background: "#f5f5f5" }}
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
