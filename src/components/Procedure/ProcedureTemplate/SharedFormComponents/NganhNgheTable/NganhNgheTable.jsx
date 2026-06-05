import { useState } from "react";
import styles from "./NganhNgheTable.module.css";
import deleteIcon from "@/assets/delete-icon.png";
import NganhNgheModal from "./NganhNgheModal";

const EMPTY_NGANH_NGHE = { tenNganh: "", chiTiet: "", maNganh: "", laNganhChinh: false };

export default function NganhNgheTable({ rows, data, onChangeRows, disabled = false, readOnly = false, options }) {
    const activeRows = rows || data || [];
    const [selectingRowIdx, setSelectingRowIdx] = useState(null);

    const updateRow = (idx, field, value) => {
        const newRows = [...activeRows];
        newRows[idx] = { ...newRows[idx], [field]: value };
        if (field === "laNganhChinh" && value === true) {
            newRows.forEach((r, i) => {
                if (i !== idx) r.laNganhChinh = false;
            });
        }
        onChangeRows(newRows);
    };

    const handleAdd = () => {
        onChangeRows([...activeRows, { ...EMPTY_NGANH_NGHE }]);
    };

    const handleSelectNganh = (item) => {
        if (selectingRowIdx !== null) {
            const newRows = [...activeRows];
            newRows[selectingRowIdx] = {
                ...newRows[selectingRowIdx],
                tenNganh: item.title,
                maNganh: item.maNganh,
            };
            onChangeRows(newRows);
        }
        setSelectingRowIdx(null);
    };

    const handleDelete = (idx) => {
        if (disabled || readOnly) return;
        onChangeRows(activeRows.filter((_, i) => i !== idx));
    };



    return (
        <div className={styles.sectionGroup}>
            {!readOnly && <h3 className={styles.sectionTitle}>Chọn ngành nghề kinh doanh:</h3>}
            {!readOnly && (
                <div className={styles.actionRow}>
                    <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={handleAdd}
                        disabled={disabled}
                    >
                        Thêm dòng
                    </button>
                </div>
            )}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <colgroup>
                        <col style={{ width: "48px", minWidth: "48px" }} />
                        <col style={{ width: "200px", minWidth: "200px" }} />
                        <col style={{ width: "200px", minWidth: "200px" }} />
                        <col style={{ width: "110px", minWidth: "110px" }} />
                        <col style={{ width: "130px", minWidth: "130px" }} />
                        <col style={{ width: "80px", minWidth: "80px" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên ngành</th>
                            <th>Chi tiết</th>
                            <th>Mã ngành</th>
                            <th>
                                Ngành, nghề
                                <br />
                                kinh doanh chính
                            </th>
                            {!readOnly && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {activeRows.length === 0 && (
                            <tr>
                                <td colSpan={6} className={styles.emptyRow}>
                                    Chưa có ngành nghề nào. {!readOnly && "Nhấn \"Thêm dòng\" để thêm."}
                                </td>
                            </tr>
                        )}
                        {activeRows.map((row, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                    <input
                                        className={`${styles.input} ${styles.input}`}
                                        title={row.tenNganh || ""}
                                        value={row.tenNganh || ""}
                                        placeholder="Click để chọn mã ngành"
                                        readOnly
                                        onClick={() => {
                                            if (!disabled && !readOnly) {
                                                setSelectingRowIdx(idx);
                                            }
                                        }}
                                        style={{ cursor: (disabled || readOnly) ? "default" : "pointer" }}
                                    />
                                </td>
                                <td>
                                    <textarea
                                        className={`${styles.input}`}
                                        value={row.chiTiet || ""}
                                        onChange={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = `${e.target.scrollHeight}px`;
                                            updateRow(idx, "chiTiet", e.target.value);
                                        }}
                                        ref={(el) => {
                                            if (el) {
                                                el.style.height = "auto";
                                                el.style.height = `${el.scrollHeight}px`;
                                            }
                                        }}
                                        style={{
                                            minHeight: "16px",
                                            maxHeight: "200px",
                                            resize: "none",
                                            overflow: "hidden",
                                            fontFamily: "Roboto"
                                        }}
                                        readOnly={disabled || readOnly}
                                    />
                                </td>
                                <td>
                                    <input
                                        className={`${styles.input} ${styles.input}`}
                                        value={row.maNganh || ""}
                                        readOnly
                                        style={{ backgroundColor: "#e9ecef" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={!!row.laNganhChinh}
                                        onChange={(e) => updateRow(idx, "laNganhChinh", e.target.checked)}
                                        disabled={disabled || readOnly}
                                    />
                                </td>
                                {!readOnly && (
                                    <td>
                                        {!disabled && (
                                            <div className={styles.tdActions}>
                                                <img
                                                    src={deleteIcon}
                                                    alt="xóa"
                                                    onClick={() => handleDelete(idx)}
                                                    width="18"
                                                    height="18"
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <NganhNgheModal
                isOpen={selectingRowIdx !== null}
                onClose={() => setSelectingRowIdx(null)}
                onSelect={(item) => handleSelectNganh(item)}
                options={options}
            />
        </div>
    );
}
