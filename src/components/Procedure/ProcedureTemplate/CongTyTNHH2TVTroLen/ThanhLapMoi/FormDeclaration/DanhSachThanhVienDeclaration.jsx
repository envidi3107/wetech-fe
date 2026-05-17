import React, { forwardRef, useState, useEffect, useImperativeHandle } from "react";
// Import styles from CongTyTNHH1TV
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/DanhSachCSHHuongLoiDeclaration.module.css";
import {
    GioiTinhSelect,
    DanTocSelect,
    QuocTichSelect,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import FormattedNumberInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormattedNumberInput/FormattedNumberInput";
import deleteIcon from "@/assets/delete-icon.png";

const EMPTY_ROW = {
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    giaTo: "",
    quocTich: "Việt Nam",
    danToc: "",
    diaChiLienLac: "",
    phanVonGop: "",
    phanVonGopNgoaiTe_GiaTri: "",
    phanVonGopNgoaiTe_Loai: "",
    tyLe: "",
    loaiTaiSan: "",
    thoiHan: "",
    chuKy: "",
    ghiChu: "",
};

const DanhSachThanhVienDeclaration = forwardRef(function DanhSachThanhVienDeclaration(
    { formId, dataJson, onSubmit, formRef, contentOnly = false, hideTitle = false, rows: controlledRows, onChangeRows },
    componentRef,
) {
    const [rows, setRows] = useState([]);
    const tableRows = Array.isArray(controlledRows) ? controlledRows : rows;
    const setTableRows = onChangeRows || setRows;

    useEffect(() => {
        if (Array.isArray(controlledRows)) return;
        if (dataJson?.thanhVienList?.length) {
            setRows(dataJson.thanhVienList);
        } else {
            setRows([]);
        }
    }, [controlledRows, dataJson]);

    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            return {
                thanhVienList: tableRows,
            };
        },
        getExportData: () => {
            if (tableRows.length === 0) {
                alert("Vui lòng nhập ít nhất một thành viên.");
                return null;
            }
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }
            return {
                thanhVienList: tableRows,
            };
        },
        importData: (imported) => {
            if (imported?.thanhVienList?.length) setTableRows(imported.thanhVienList);
        },
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit)
            onSubmit({
                thanhVienList: tableRows,
            });
    };

    const handleAdd = () => {
        setTableRows([...tableRows, { ...EMPTY_ROW }]);
    };

    const handleDelete = (idx) => {
        setTableRows(tableRows.filter((_, i) => i !== idx));
    };

    const handleRowChange = (idx, e) => {
        const { name, value } = e.target;
        const newRows = [...tableRows];
        newRows[idx] = { ...newRows[idx], [name]: value };
        setTableRows(newRows);
    };

    const content = (
        <div className={styles.wrapper}>
            {!hideTitle && (
                <div style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold", fontSize: "16px" }}>
                    DANH SÁCH THÀNH VIÊN CÔNG TY TRÁCH NHIỆM HỮU HẠN HAI THÀNH VIÊN TRỞ LÊN
                </div>
            )}

            <div className={styles.actionRow}>
                <button type="button" className={styles.btnPrimary} onClick={handleAdd}>
                    Thêm dòng
                </button>
            </div>

            <div className={styles.tableScrollWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 40 }}>
                                STT
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 150 }}>
                                Tên thành viên
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 120 }}>
                                Ngày, tháng, năm sinh đối với thành viên là cá nhân
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 80 }}>
                                Giới tính
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 180 }}>
                                Loại giấy tờ, số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 100 }}>
                                Quốc tịch
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 100 }}>
                                Dân tộc
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 150 }}>
                                Địa chỉ liên lạc
                            </th>
                            <th colSpan={3} className={styles.th}>
                                Vốn góp
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 120 }}>
                                Thời hạn góp vốn
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 120 }}>
                                Ghi chú (nếu có)
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 100 }}>
                                Thao tác
                            </th>
                        </tr>
                        <tr>
                            <th className={styles.th} style={{ minWidth: 350 }}>
                                Phần vốn góp (bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài: bằng số,
                                loại ngoại tệ, nếu có)
                            </th>
                            <th className={styles.th} style={{ minWidth: 80 }}>
                                Tỷ lệ (%)
                            </th>
                            <th className={styles.th} style={{ minWidth: 160 }}>
                                Loại tài sản, số lượng, giá trị tài sản góp vốn
                            </th>
                        </tr>
                        <tr className={styles.colNumberRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, ""].map((n, i) => (
                                <td key={i} className={styles.colNumber}>
                                    {n}
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.length === 0 && (
                            <tr>
                                <td colSpan={15} className={styles.emptyRow}>
                                    Chưa có thành viên nào. Nhấn "Thêm dòng" để bắt đầu.
                                </td>
                            </tr>
                        )}
                        {tableRows.map((row, idx) => (
                            <tr key={idx} className={styles.trEdit}>
                                <td className={styles.td} style={{ textAlign: "center" }}>
                                    {idx + 1}
                                </td>
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="hoTen"
                                        value={row.hoTen}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <DateInput
                                        className={styles.input}
                                        name="ngaySinh"
                                        value={row.ngaySinh}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.tdWrapper} onChange={(e) => handleRowChange(idx, e)}>
                                    <GioiTinhSelect name="gioiTinh" defaultValue={row.gioiTinh} />
                                </td>
                                <td className={styles.td}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name="giaTo"
                                        value={row.giaTo}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.tdWrapper} onChange={(e) => handleRowChange(idx, e)}>
                                    <QuocTichSelect name="quocTich" defaultValue={row.quocTich} required={false} />
                                </td>
                                <td className={styles.tdWrapper} onChange={(e) => handleRowChange(idx, e)}>
                                    <DanTocSelect name="danToc" defaultValue={row.danToc} required={false} />
                                </td>
                                <td className={styles.td}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name="diaChiLienLac"
                                        value={row.diaChiLienLac}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <FormattedNumberInput
                                                className={styles.input}
                                                name="phanVonGop"
                                                value={row.phanVonGop}
                                                onChange={(e) => handleRowChange(idx, e)}
                                                placeholder="0"
                                                style={{ textAlign: "right", paddingRight: "46px", width: "100%" }}
                                            />
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    right: "12px",
                                                    color: "#444",
                                                    fontSize: "14px",
                                                    pointerEvents: "none",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                VNĐ
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "#555",
                                                textAlign: "left",
                                                marginTop: "4px",
                                            }}
                                        >
                                            Giá trị tương đương theo đơn vị tiền nước ngoài (nếu có; bằng số, loại ngoại
                                            tệ):
                                        </div>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            <FormattedNumberInput
                                                className={styles.input}
                                                name="phanVonGopNgoaiTe_GiaTri"
                                                value={row.phanVonGopNgoaiTe_GiaTri || ""}
                                                onChange={(e) => handleRowChange(idx, e)}
                                                placeholder="Tiền bằng số"
                                                style={{ width: "65%" }}
                                            />
                                            <input
                                                className={styles.input}
                                                name="phanVonGopNgoaiTe_Loai"
                                                value={row.phanVonGopNgoaiTe_Loai || ""}
                                                onChange={(e) => handleRowChange(idx, e)}
                                                placeholder="Loại ngoại tệ"
                                                style={{ width: "35%" }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="tyLe"
                                        value={row.tyLe}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="loaiTaiSan"
                                        value={row.loaiTaiSan}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="thoiHan"
                                        value={row.thoiHan}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="ghiChu"
                                        value={row.ghiChu}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.tdAction}>
                                    <img
                                        src={deleteIcon}
                                        alt="xóa"
                                        onClick={() => handleDelete(idx)}
                                        width="18"
                                        height="18"
                                        style={{ cursor: "pointer", display: "block", margin: "0 auto" }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (contentOnly) return content;

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson ? "loaded" : "empty"}>
            {content}
        </form>
    );
});

export default DanhSachThanhVienDeclaration;
