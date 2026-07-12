import React from "react";
import { formatDate } from "@/utils/dateTimeUtils";
import styles from "./DanhSachCSHHuongLoiConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

const BENEFICIAL_OWNER_COLUMN_WIDTHS = ["4%", "10%", "9%", "5%", "16%", "7%", "6%", "15%", "6%", "6%", "7%", "10%"];
const BENEFICIAL_OWNER_GROUP_WIDTH = "19%";

const getColumnStyle = (columnIndex, style = {}) => ({
    width: BENEFICIAL_OWNER_COLUMN_WIDTHS[columnIndex],
    ...style,
});

const BENEFICIAL_OWNER_HEADERS = [
    "STT",
    "Họ và tên",
    "Ngày, tháng, năm sinh",
    "Giới tính",
    "Số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân",
    "Quốc tịch",
    "Dân tộc",
    "Địa chỉ liên lạc",
    "CSH hưởng lợi: Tỷ lệ sở hữu cổ phần vốn điều lệ",
    "CSH hưởng lợi: Tỷ lệ sở hữu cổ phần có quyền biểu quyết",
    "CSH hưởng lợi: Quyền chi phối",
    "Ghi chú (nếu có)",
];

const BENEFICIAL_OWNER_GROUP_HEADERS = [
    "Tỷ lệ sở hữu cổ phần vốn điều lệ",
    "Tỷ lệ sở hữu cổ phần có quyền biểu quyết",
    "Quyền chi phối",
];

function DanhSachCSHHuongLoiConfirmation({ dataJson }) {
    const rows = dataJson?.cshHuongLoiList || [];
    const datePrefix = dataJson?.kinhGuiProvince || dataJson?.truSo_tinh;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.tableTitle}>DANH SÁCH CHỦ SỞ HỮU HƯỞNG LỢI CỦA DOANH NGHIỆP</h2>
            <div className={styles.tableScrollWrapper}>
                <table
                    className={`${styles.table} ${styles.htmlWideTable} bordered-table docx-contained-table export-table-font-10`}
                    style={{
                        width: "100%",
                        minWidth: "1500px",
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                    }}
                >
                    <thead>
                        <tr>
                            {BENEFICIAL_OWNER_HEADERS.slice(0, 8).map((label, index) => (
                                <th key={label} rowSpan={2} className={styles.th} style={getColumnStyle(index)}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {label}
                                    </p>
                                </th>
                            ))}
                            <th colSpan={3} className={styles.th} style={{ width: BENEFICIAL_OWNER_GROUP_WIDTH }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Chủ sở hữu hưởng lợi của doanh nghiệp
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(11)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {BENEFICIAL_OWNER_HEADERS[11]}
                                </p>
                            </th>
                        </tr>
                        <tr>
                            {BENEFICIAL_OWNER_GROUP_HEADERS.map((label, headerIndex) => {
                                const columnIndex = headerIndex + 8;

                                return (
                                    <th key={label} className={styles.th} style={getColumnStyle(columnIndex)}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {label}
                                        </p>
                                    </th>
                                );
                            })}
                        </tr>
                        <tr className={styles.colNumberRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                                <td key={n} className={styles.colNumber} style={getColumnStyle(n - 1)}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {n}
                                    </p>
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                {BENEFICIAL_OWNER_HEADERS.map((label, index) => (
                                    <td
                                        key={`empty-${label}`}
                                        className={index === 0 ? styles.emptyCell : styles.td}
                                        style={getColumnStyle(index, { textAlign: index === 0 ? "left" : "center" })}
                                    >
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {index === 0 ? "Chưa có dữ liệu chủ sở hữu hưởng lợi." : ""}
                                        </p>
                                    </td>
                                ))}
                            </tr>
                        ) : (
                            rows.map((row, idx) => (
                                <tr key={idx}>
                                    <td className={styles.td} style={getColumnStyle(0, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {idx + 1}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(1)}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.hoTen}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(2, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {formatDate(row.ngaySinh)}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(3, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.gioiTinh}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(4)}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.giaTo}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(5, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.quocTich}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(6, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.danToc}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(7, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.diaChiLienLac}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(8, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.tyLeSoHuuVon ? `${row.tyLeSoHuuVon}%` : ""}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(9, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.tyLeSoHuuBieuQuyet ? `${row.tyLeSoHuuBieuQuyet}%` : ""}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(10, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.quyenChiPhoi}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(11)}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.ghiChu}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <table
                className="signature-table no-border"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "none",
                    marginTop: "30px",
                    marginBottom: "50px",
                }}
            >
                <tbody>
                    <tr>
                        <td
                            className="signature-spacer"
                            style={{
                                border: "none",
                                width: "auto",
                                textAlign: "center",
                                verticalAlign: "top",
                            }}
                        ></td>
                        <td
                            className="signature-cell"
                            style={{
                                border: "none",
                                textAlign: "center",
                                verticalAlign: "top",
                                width: "105mm",
                            }}
                        >
                            <p style={{ textAlign: "center", fontStyle: "italic" }}>
                                <CurrentDate prefix={datePrefix} style={{ fontStyle: "italic" }} />
                            </p>
                            <p style={{ textAlign: "center", fontWeight: "bold" }}>
                                NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT CỦA CÔNG TY
                            </p>
                            <p style={{ textAlign: "center" }}>
                                (<em>Ký và ghi rõ họ tên</em>)
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DanhSachCSHHuongLoiConfirmation;
