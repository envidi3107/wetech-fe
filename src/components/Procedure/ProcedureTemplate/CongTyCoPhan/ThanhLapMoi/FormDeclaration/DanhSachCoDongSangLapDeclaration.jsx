import React, { forwardRef, useState, useEffect, useImperativeHandle, useMemo } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/DanhSachCSHHuongLoiDeclaration.module.css";
import {
    GioiTinhSelect,
    DanTocSelect,
    QuocTichSelect,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import deleteIcon from "@/assets/delete-icon.png";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

const CHANGE_REGISTRATION_FORM_NAME =
    "Giấy đề nghị đăng ký thay đổi nội dung giấy chứng nhận đăng ký doanh nghiệp";
const NEW_REGISTRATION_FORM_NAME = "Giấy đề nghị đăng ký doanh nghiệp";

const SHARE_QUANTITY_TO_VALUE_FIELD = {
    tongSoCoPhan_soLuong: "tongSoCoPhan_giaTri",
    loaiCoPhan_phoThong_soLuong: "loaiCoPhan_phoThong_giaTri",
    loaiCoPhan_khac_soLuong: "loaiCoPhan_khac_giaTri",
};

const EMPTY_ROW = {
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    giaTo: "",
    quocTich: "Việt Nam",
    danToc: "",
    diaChiLienLac: "",
    tongSoCoPhan_soLuong: "",
    tongSoCoPhan_giaTri: "",
    tyLe: "",
    loaiCoPhan_phoThong_soLuong: "",
    loaiCoPhan_phoThong_giaTri: "",
    loaiCoPhan_khac_soLuong: "",
    loaiCoPhan_khac_giaTri: "",
    loaiTaiSanGopVon: "",
    thoiHanGopVon: "",
    ghiChu: "",
};

const parseNumberValue = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    return Number(String(value).replace(/[^\d]/g, "")) || 0;
};

const formatNumberValue = (value) => {
    const parsed = typeof value === "number" ? value : parseNumberValue(value);
    return parsed ? parsed.toLocaleString("vi-VN") : "";
};

const formatRatioValue = (value) => {
    if (!value) return "";
    const rounded = Math.round(value * 10000) / 10000;
    return String(rounded).replace(".", ",");
};

const getOtherShareValueField = (fieldName) => {
    const match = fieldName.match(/^loaiCoPhan_khac_soLuong(_\d+)?$/);
    if (!match) return "";
    return `loaiCoPhan_khac_giaTri${match[1] || ""}`;
};

const getShareValueField = (fieldName) => SHARE_QUANTITY_TO_VALUE_FIELD[fieldName] || getOtherShareValueField(fieldName);

const isShareQuantityField = (fieldName) => Boolean(getShareValueField(fieldName));

const isShareValueField = (fieldName) =>
    fieldName === "tongSoCoPhan_giaTri" ||
    fieldName === "loaiCoPhan_phoThong_giaTri" ||
    /^loaiCoPhan_khac_giaTri(_\d+)?$/.test(fieldName);

const resolveShareSourceData = (changeRegistrationData, newRegistrationData) => {
    if (changeRegistrationData.vonDieuLeSauThayDoi || changeRegistrationData.menhGiaCoPhan) {
        return changeRegistrationData;
    }
    return newRegistrationData;
};

const buildShareCalculationContext = (sourceData) => ({
    capital: parseNumberValue(sourceData.vonDieuLeSauThayDoi || sourceData.vonDieuLe || sourceData.nguonVon_tongCong_soTien),
    parValue: parseNumberValue(sourceData.menhGiaCoPhan),
});

const applyShareCalculation = (row, changedField, changedValue, { capital, parValue }) => {
    const nextRow = { ...row };
    const shouldFormatNumber = isShareQuantityField(changedField) || isShareValueField(changedField);
    nextRow[changedField] = shouldFormatNumber ? formatNumberValue(changedValue) : changedValue;

    if (isShareQuantityField(changedField)) {
        const quantity = parseNumberValue(changedValue);
        const valueField = getShareValueField(changedField);
        const calculatedValue = quantity && parValue ? quantity * parValue : 0;
        nextRow[valueField] = calculatedValue ? formatNumberValue(calculatedValue) : "";

        if (changedField === "tongSoCoPhan_soLuong") {
            nextRow.tyLe = calculatedValue && capital ? formatRatioValue((calculatedValue / capital) * 100) : "";
        }
    }

    if (changedField === "tongSoCoPhan_giaTri") {
        const totalValue = parseNumberValue(changedValue);
        nextRow.tyLe = totalValue && capital ? formatRatioValue((totalValue / capital) * 100) : "";
    }

    return nextRow;
};

const recalculateShareRow = (row, shareCalculationContext) => {
    let nextRow = { ...row };
    Object.keys(SHARE_QUANTITY_TO_VALUE_FIELD).forEach((fieldName) => {
        if (nextRow[fieldName]) {
            nextRow = applyShareCalculation(nextRow, fieldName, nextRow[fieldName], shareCalculationContext);
        }
    });

    Object.keys(nextRow)
        .filter((fieldName) => /^loaiCoPhan_khac_soLuong(_\d+)?$/.test(fieldName) && nextRow[fieldName])
        .forEach((fieldName) => {
            nextRow = applyShareCalculation(nextRow, fieldName, nextRow[fieldName], shareCalculationContext);
        });

    return nextRow;
};

const DanhSachCoDongSangLapDeclaration = forwardRef(function DanhSachCoDongSangLapDeclaration(
    {
        formId,
        dataJson,
        onSubmit,
        formRef,
        contentOnly = false,
        hideTitle = false,
        rows: controlledRows,
        onChangeRows,
        loaiCoPhanKhacList: controlledLoaiCoPhanKhacList,
        onChangeLoaiCoPhanKhacList,
    },
    componentRef,
) {
    const changeRegistrationFormData = useGetFormDataJsonFromName(CHANGE_REGISTRATION_FORM_NAME);
    const newRegistrationFormData = useGetFormDataJsonFromName(NEW_REGISTRATION_FORM_NAME);
    const changeRegistrationData = useMemo(
        () => normalizeDataJson(changeRegistrationFormData),
        [changeRegistrationFormData],
    );
    const newRegistrationData = useMemo(() => normalizeDataJson(newRegistrationFormData), [newRegistrationFormData]);
    const shareCalculationContext = useMemo(
        () => buildShareCalculationContext(resolveShareSourceData(changeRegistrationData, newRegistrationData)),
        [changeRegistrationData, newRegistrationData],
    );
    const [rows, setRows] = useState([]);
    const [loaiCoPhanKhacList, setLoaiCoPhanKhacList] = useState([""]);
    const tableRows = Array.isArray(controlledRows) ? controlledRows : rows;
    const setTableRows = onChangeRows || setRows;
    const tableLoaiCoPhanKhacList = Array.isArray(controlledLoaiCoPhanKhacList)
        ? controlledLoaiCoPhanKhacList
        : loaiCoPhanKhacList;
    const setTableLoaiCoPhanKhacList = onChangeLoaiCoPhanKhacList || setLoaiCoPhanKhacList;

    useEffect(() => {
        if (Array.isArray(controlledRows) || Array.isArray(controlledLoaiCoPhanKhacList)) return;
        if (dataJson?.coDongList?.length) {
            setRows(dataJson.coDongList);
        } else {
            setRows([]);
        }

        let initialLoaiCoPhanKhacList = [""];
        if (dataJson?.loaiCoPhanKhacList && Array.isArray(dataJson.loaiCoPhanKhacList)) {
            initialLoaiCoPhanKhacList = dataJson.loaiCoPhanKhacList;
        } else if (dataJson?.loaiCoPhanKhac_ten) {
            initialLoaiCoPhanKhacList = [dataJson.loaiCoPhanKhac_ten];
        }
        setLoaiCoPhanKhacList(initialLoaiCoPhanKhacList);
    }, [controlledLoaiCoPhanKhacList, controlledRows, dataJson]);

    useEffect(() => {
        if (Array.isArray(controlledRows)) return;
        if (!shareCalculationContext.capital && !shareCalculationContext.parValue) return;

        setRows((prevRows) => prevRows.map((row) => recalculateShareRow(row, shareCalculationContext)));
    }, [controlledRows, shareCalculationContext]);

    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            return {
                coDongList: tableRows,
                loaiCoPhanKhacList: tableLoaiCoPhanKhacList,
                loaiCoPhanKhac_ten: tableLoaiCoPhanKhacList[0] || "",
                chuKy_ten: formData.get("chuKy_ten") || "",
                chuKy_hoTen: formData.get("chuKy_hoTen") || "",
            };
        },
        getExportData: () => {
            if (tableRows.length === 0) {
                alert("Vui lòng nhập ít nhất một cổ đông sáng lập.");
                return null;
            }
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }
            const formData = new FormData(formRef.current);
            return {
                coDongList: tableRows,
                loaiCoPhanKhacList: tableLoaiCoPhanKhacList,
                loaiCoPhanKhac_ten: tableLoaiCoPhanKhacList[0] || "",
                chuKy_ten: formData.get("chuKy_ten") || "",
                chuKy_hoTen: formData.get("chuKy_hoTen") || "",
            };
        },
        importData: (imported) => {
            if (imported?.coDongList?.length) {
                setTableRows(imported.coDongList.map((row) => recalculateShareRow(row, shareCalculationContext)));
            }
            if (imported?.loaiCoPhanKhacList && Array.isArray(imported.loaiCoPhanKhacList)) {
                setTableLoaiCoPhanKhacList(imported.loaiCoPhanKhacList);
            } else if (imported?.loaiCoPhanKhac_ten) {
                setTableLoaiCoPhanKhacList([imported.loaiCoPhanKhac_ten]);
            } else {
                setTableLoaiCoPhanKhacList([""]);
            }
        },
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (onSubmit)
            onSubmit({
                coDongList: tableRows,
                loaiCoPhanKhacList: tableLoaiCoPhanKhacList,
                loaiCoPhanKhac_ten: tableLoaiCoPhanKhacList[0] || "",
                chuKy_ten: formData.get("chuKy_ten") || "",
                chuKy_hoTen: formData.get("chuKy_hoTen") || "",
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
        newRows[idx] = applyShareCalculation(newRows[idx], name, value, shareCalculationContext);
        setTableRows(newRows);
    };

    const handleAddKhac = () => {
        setTableLoaiCoPhanKhacList([...tableLoaiCoPhanKhacList, ""]);
    };

    const handleRemoveKhac = (idx) => {
        setTableLoaiCoPhanKhacList(tableLoaiCoPhanKhacList.filter((_, i) => i !== idx));
    };

    const handleKhacNameChange = (idx, val) => {
        const newList = [...tableLoaiCoPhanKhacList];
        newList[idx] = val;
        setTableLoaiCoPhanKhacList(newList);
    };

    const content = (
        <div className={styles.wrapper}>
            {!hideTitle && (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "10px",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textTransform: "uppercase",
                    }}
                >
                    DANH SÁCH CỔ ĐÔNG SÁNG LẬP CÔNG TY CỔ PHẦN
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
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 40 }}>
                                STT
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 150 }}>
                                Tên cổ đông sáng lập
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 120 }}>
                                Ngày, tháng, năm sinh
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 80 }}>
                                Giới tính
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 180 }}>
                                Loại giấy tờ, số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 100 }}>
                                Quốc tịch
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 100 }}>
                                Dân tộc
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 150 }}>
                                Địa chỉ liên lạc
                            </th>
                            <th colSpan={8 + (tableLoaiCoPhanKhacList.length - 1) * 2} className={styles.th}>
                                Vốn góp
                                <InfoTooltip
                                    color="#fff"
                                    content="Ghi giá trị vốn cổ phần của từng cổ đông sáng lập. Tài sản hình thành giá trị vốn cổ phần cần được liệt kê cụ thể"
                                />
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 120 }}>
                                Thời hạn góp vốn
                                <InfoTooltip
                                    color="#fff"
                                    content="Khi đăng ký thành lập doanh nghiệp, thời hạn góp vốn là thời hạn cổ đông dự kiến hoàn thành góp vốn"
                                />
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 120 }}>
                                Ghi chú (nếu có)
                            </th>
                            <th rowSpan={4} className={styles.th} style={{ minWidth: 60 }}>
                                Thao tác
                            </th>
                        </tr>
                        <tr>
                            <th colSpan={2} className={styles.th}>
                                Tổng số cổ phần
                            </th>
                            <th rowSpan={3} className={styles.th} style={{ minWidth: 60 }}>
                                Tỷ lệ (%)
                            </th>
                            <th colSpan={2 + tableLoaiCoPhanKhacList.length * 2} className={styles.th}>
                                Loại cổ phần
                            </th>
                            <th rowSpan={3} className={styles.th} style={{ minWidth: 160 }}>
                                Loại tài sản, số lượng, giá trị tài sản góp vốn
                                <InfoTooltip
                                    color="#fff"
                                    content="Loại tài sản góp vốn bao gồm: Đồng Việt Nam; Ngoại tệ tự do chuyển đổi; Vàng; Quyền sử dụng đất; Quyền sở hữu trí tuệ; Công nghệ; Bí quyết kỹ thuật; Tài sản khác"
                                />
                            </th>
                        </tr>
                        <tr>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 100 }}>
                                Số lượng
                            </th>
                            <th rowSpan={2} className={styles.th} style={{ minWidth: 100 }}>
                                Giá trị
                            </th>
                            <th colSpan={2} className={styles.th}>
                                Phổ thông
                            </th>
                            {tableLoaiCoPhanKhacList.map((ten, i) => (
                                <th
                                    colSpan={2}
                                    key={i}
                                    className={styles.th}
                                    style={{ padding: "4px", position: "relative" }}
                                >
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Nhập loại cổ phần khác..."
                                        value={ten}
                                        onChange={(e) => handleKhacNameChange(i, e.target.value)}
                                        style={{
                                            color: "#fff",
                                            textAlign: "center",
                                            backgroundColor: "transparent",
                                            border: "none",
                                            outline: "none",
                                            width: "calc(100% - 40px)",
                                            margin: "0 auto",
                                            display: "block",
                                            fontWeight: "bold",
                                        }}
                                    />
                                    {i === tableLoaiCoPhanKhacList.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={handleAddKhac}
                                            style={{
                                                position: "absolute",
                                                right: 2,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                background: "#28a745",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "14px",
                                                lineHeight: 1,
                                            }}
                                        >
                                            +
                                        </button>
                                    )}
                                    {i > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveKhac(i)}
                                            style={{
                                                position: "absolute",
                                                left: 2,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                background: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "14px",
                                                lineHeight: 1,
                                            }}
                                        >
                                            -
                                        </button>
                                    )}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className={styles.th} style={{ minWidth: 100 }}>
                                Số lượng
                            </th>
                            <th className={styles.th} style={{ minWidth: 100 }}>
                                Giá trị
                            </th>
                            {tableLoaiCoPhanKhacList.map((_, i) => (
                                <React.Fragment key={i}>
                                    <th className={styles.th} style={{ minWidth: 100 }}>
                                        Số lượng
                                    </th>
                                    <th className={styles.th} style={{ minWidth: 100 }}>
                                        Giá trị
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>
                        <tr className={styles.colNumberRow}>
                            {Array.from({ length: 16 + tableLoaiCoPhanKhacList.length * 2 }).map((_, i) => (
                                <td key={i} className={styles.colNumber}>
                                    {i + 1}
                                </td>
                            ))}
                            <td className={styles.colNumber}></td>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.length === 0 && (
                            <tr>
                                <td colSpan={17 + tableLoaiCoPhanKhacList.length * 2} className={styles.emptyRow}>
                                    Chưa có cổ đông sáng lập. Nhấn "Thêm dòng" để bắt đầu.
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
                                    <QuocTichSelect name="quocTich" defaultValue={row.quocTich} />
                                </td>
                                <td className={styles.tdWrapper} onChange={(e) => handleRowChange(idx, e)}>
                                    <DanTocSelect name="danToc" defaultValue={row.danToc} />
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

                                {/* 9 - 16: Vốn góp */}
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="tongSoCoPhan_soLuong"
                                        value={row.tongSoCoPhan_soLuong}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="tongSoCoPhan_giaTri"
                                        value={row.tongSoCoPhan_giaTri}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
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
                                        name="loaiCoPhan_phoThong_soLuong"
                                        value={row.loaiCoPhan_phoThong_soLuong}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="loaiCoPhan_phoThong_giaTri"
                                        value={row.loaiCoPhan_phoThong_giaTri}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>
                                {tableLoaiCoPhanKhacList.map((_, i) => {
                                    const slKey = i === 0 ? "loaiCoPhan_khac_soLuong" : `loaiCoPhan_khac_soLuong_${i}`;
                                    const gtKey = i === 0 ? "loaiCoPhan_khac_giaTri" : `loaiCoPhan_khac_giaTri_${i}`;
                                    return (
                                        <React.Fragment key={i}>
                                            <td className={styles.td}>
                                                <input
                                                    className={styles.input}
                                                    name={slKey}
                                                    value={row[slKey] || ""}
                                                    onChange={(e) => handleRowChange(idx, e)}
                                                />
                                            </td>
                                            <td className={styles.td}>
                                                <input
                                                    className={styles.input}
                                                    name={gtKey}
                                                    value={row[gtKey] || ""}
                                                    onChange={(e) => handleRowChange(idx, e)}
                                                />
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="loaiTaiSanGopVon"
                                        value={row.loaiTaiSanGopVon}
                                        onChange={(e) => handleRowChange(idx, e)}
                                    />
                                </td>

                                {/* 17 - 19 */}
                                <td className={styles.td}>
                                    <input
                                        className={styles.input}
                                        name="thoiHanGopVon"
                                        value={row.thoiHanGopVon}
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

                                {/* Actions */}
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

export default DanhSachCoDongSangLapDeclaration;
