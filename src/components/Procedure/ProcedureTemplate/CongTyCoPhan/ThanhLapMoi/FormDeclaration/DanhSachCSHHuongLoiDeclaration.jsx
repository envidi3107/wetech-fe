import React, { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/DanhSachCSHHuongLoiDeclaration.module.css";
import {
    GioiTinhSelect,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import deleteIcon from "@/assets/delete-icon.png";
import Select from "react-select";

const quyenChiPhoiOptions = [
    { value: "", label: "Chọn quyền chi phối..." },
    { value: "Bổ nhiệm, miễn nhiệm hoặc bãi nhiệm đa số hoặc tất cả thành viên hội đồng quản trị, chủ tịch hội đồng quản trị, chủ tịch hội đồng thành viên; người đại diện theo pháp luật, giám đốc hoặc tổng giám đốc của doanh nghiệp;", label: "Bổ nhiệm, miễn nhiệm hoặc bãi nhiệm đa số hoặc tất cả thành viên hội đồng quản trị, chủ tịch hội đồng quản trị, chủ tịch hội đồng thành viên; người đại diện theo pháp luật, giám đốc hoặc tổng giám đốc của doanh nghiệp;" },
    { value: "Sửa đổi, bổ sung điều lệ của doanh nghiệp;", label: "Sửa đổi, bổ sung điều lệ của doanh nghiệp;" },
    { value: "Thay đổi cơ cấu tổ chức quản lý công ty;", label: "Thay đổi cơ cấu tổ chức quản lý công ty;" },
    { value: "Tổ chức lại, giải thể công ty.", label: "Tổ chức lại, giải thể công ty." }
];

const selectStyles = {
    control: (base) => ({
        ...base,
        border: "none",
        borderBottom: "1px solid transparent",
        boxShadow: "none",
        backgroundColor: "transparent",
        minHeight: "40px",
        fontSize: "14px",
        "&:hover": { borderColor: "transparent" }
    }),
    valueContainer: (base) => ({
        ...base,
        padding: "0 8px",
        justifyContent: "center"
    }),
    singleValue: (base) => ({
        ...base,
        textAlign: "center"
    }),
    placeholder: (base) => ({
        ...base,
        textAlign: "center",
        color: "#505050"
    }),
    menu: (base) => ({
        ...base,
        width: "max-content",
        maxWidth: "400px",
        left: "50%",
        transform: "translateX(-50%)"
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: "14px",
        backgroundColor: state.isSelected ? "#1d126eff" : state.isFocused ? "#f0f0ff" : "#fff",
        color: state.isSelected ? "#fff" : "#333",
        cursor: "pointer",
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 })
};

const EMPTY_ROW = {
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    giaTo: "",
    diaChiLienLac: "",
    tyLeSoHuuVon: "",
    tyLeSoHuuBieuQuyet: "",
    quyenChiPhoi: "",
    ghiChu: "",
};

const DanhSachCSHHuongLoiDeclaration = forwardRef(function DanhSachCSHHuongLoiDeclaration(
    { formId, dataJson, onSubmit, formRef },
    componentRef,
) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (dataJson?.cshHuongLoiList?.length) {
            setRows(dataJson.cshHuongLoiList);
        } else {
            setRows([]);
        }
    }, [dataJson]);

    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            return {
                cshHuongLoiList: rows,
                chuKy_ten: formData.get("chuKy_ten") || "",
                chuKy_hoTen: formData.get("chuKy_hoTen") || ""
            };
        },
        getExportData: () => {
            if (rows.length === 0) {
                alert("Vui lòng nhập ít nhất một chủ sở hữu hưởng lợi.");
                return null;
            }
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }
            const formData = new FormData(formRef.current);
            return {
                cshHuongLoiList: rows,
                chuKy_ten: formData.get("chuKy_ten") || "",
                chuKy_hoTen: formData.get("chuKy_hoTen") || ""
            };
        },
        importData: (imported) => {
            if (imported?.cshHuongLoiList?.length) setRows(imported.cshHuongLoiList);
        },
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (onSubmit) onSubmit({
            cshHuongLoiList: rows,
            chuKy_ten: formData.get("chuKy_ten") || "",
            chuKy_hoTen: formData.get("chuKy_hoTen") || ""
        });
    };

    const handleAdd = () => {
        setRows([...rows, { ...EMPTY_ROW }]);
    };

    const handleDelete = (idx) => {
        setRows(rows.filter((_, i) => i !== idx));
    };

    const handleRowChange = (idx, e) => {
        const { name, value } = e.target;
        const newRows = [...rows];
        newRows[idx] = { ...newRows[idx], [name]: value };
        setRows(newRows);
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson ? "loaded" : "empty"}>
            <div className={styles.wrapper}>
                <div className={styles.actionRow}>
                    <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={handleAdd}
                    >
                        Thêm dòng
                    </button>
                </div>

                <div className={styles.tableScrollWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th rowSpan={2} className={styles.th}>STT</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 180 }}>Họ và tên</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 150 }}>Ngày, tháng, năm sinh</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 60 }}>Giới tính</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 200 }}>
                                    Số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                                </th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 150 }}>Địa chỉ liên lạc</th>
                                <th colSpan={3} className={styles.th}>Chủ sở hữu hưởng lợi của doanh nghiệp</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 150 }}>Ghi chú</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 150 }}>Thao tác</th>
                            </tr>
                            <tr>
                                <th className={styles.th} style={{ minWidth: 50 }}>
                                    Tỷ lệ sở hữu vốn điều lệ (%)
                                    <InfoTooltip color="#fff" content={`Trường hợp thông qua sở hữu vốn điều lệ/cổ phần:\n- Cá nhân là cổ đông sở hữu từ 25% tổng số cổ phần có quyền biểu quyết trở lên;\n- Cá nhân là thành viên sở hữu từ 25% vốn điều lệ trở lên đối với công ty TNHH 2TV trở lên;\n- Cá nhân là chủ sở hữu công ty TNHH 1TV;\n- Cá nhân là thành viên hợp danh.`} />
                                </th>
                                <th className={styles.th} style={{ minWidth: 50 }}>
                                    Tỷ lệ sở hữu cổ phần có quyền biểu quyết (%)
                                    <InfoTooltip color="#fff" content="(= Số cổ phần có quyền biểu quyết của chủ sở hữu hưởng lợi / tổng số cổ phần có quyền biểu quyết của công ty)" />
                                </th>
                                <th className={styles.th} style={{ minWidth: 100 }}>
                                    Quyền chi phối
                                    <InfoTooltip color="#fff" content="Ghi rõ một trong các quyền chi phối sau: bổ nhiệm, miễn nhiệm/bãi nhiệm đa số/tất cả thành viên HĐQT, Chủ tịch HĐQT, Chủ tịch HĐTV; Người ĐDPL, GĐ/TGĐ; sửa đổi, bổ sung điều lệ; thay đổi cơ cấu tổ chức quản lý; tổ chức lại, giải thể công ty." />
                                </th>
                            </tr>
                            <tr className={styles.colNumberRow}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ""].map((n, i) => (
                                    <td key={i} className={styles.colNumber}>{n}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={11} className={styles.emptyRow}>
                                        Chưa có chủ sở hữu hưởng lợi. Nhấn "Thêm dòng" để bắt đầu.
                                    </td>
                                </tr>
                            )}
                            {rows.map((row, idx) => (
                                <tr key={idx} className={styles.trEdit}>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{idx + 1}</td>
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
                                        <input
                                            className={styles.input}
                                            name="tyLeSoHuuVon"
                                            value={row.tyLeSoHuuVon}
                                            onChange={(e) => handleRowChange(idx, e)}
                                        />
                                    </td>
                                    <td className={styles.td}>
                                        <input
                                            className={styles.input}
                                            name="tyLeSoHuuBieuQuyet"
                                            value={row.tyLeSoHuuBieuQuyet}
                                            onChange={(e) => handleRowChange(idx, e)}
                                        />
                                    </td>
                                    <td className={styles.tdWrapper}>
                                        <Select
                                            options={quyenChiPhoiOptions}
                                            styles={selectStyles}
                                            value={quyenChiPhoiOptions.find(opt => opt.value === row.quyenChiPhoi) || quyenChiPhoiOptions[0]}
                                            onChange={(selectedOption) => {
                                                handleRowChange(idx, {
                                                    target: { name: "quyenChiPhoi", value: selectedOption ? selectedOption.value : "" }
                                                });
                                            }}
                                            placeholder="Chọn quyền chi phối..."
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
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
        </form>
    );
});

export default DanhSachCSHHuongLoiDeclaration;
