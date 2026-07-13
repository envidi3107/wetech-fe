import React from "react";
import { formatDate } from "@/utils/dateTimeUtils";
// Import styles from CongTyTNHH1TV
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/DanhSachCSHHuongLoiConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

const MEMBER_COLUMN_WIDTHS = ["4%", "10%", "9%", "5%", "12%", "6%", "5%", "13%", "10%", "5%", "8%", "6%", "5%", "5%"];

const getColumnStyle = (columnIndex, style = {}) => ({
    width: MEMBER_COLUMN_WIDTHS[columnIndex],
    ...style,
});

function DanhSachThanhVienConfirmation({ dataJson }) {
    const rows = dataJson?.thanhVienList || [];
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.tableTitle} style={{ textAlign: "center", marginTop: "12px", marginBottom: "6px" }}>
                DANH SÁCH THÀNH VIÊN CÔNG TY TRÁCH NHIỆM HỮU HẠN HAI THÀNH VIÊN TRỞ LÊN
            </h2>
            <div className={styles.tableScrollWrapper}>
                <table
                    className={`${styles.table} bordered-table docx-contained-table`}
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                    }}
                >
                    <thead>
                        <tr>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(0)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    STT
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(1)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tên thành viên
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(2)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ngày, tháng, năm sinh đối với thành viên là cá nhân
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(3)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Giới tính
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(4)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Loại giấy tờ, số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(5)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Quốc tịch
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(6)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Dân tộc
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(7)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Địa chỉ liên lạc
                                </p>
                            </th>
                            <th colSpan={3} className={styles.th} style={{ width: "21%" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Vốn góp
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
                                    Thời hạn góp vốn
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(12)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Chữ ký của thành viên
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th} style={getColumnStyle(13)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ghi chú (nếu có)
                                </p>
                            </th>
                        </tr>
                        <tr>
                            <th className={styles.th} style={getColumnStyle(8)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Phần vốn góp (bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài: bằng
                                    số, loại ngoại tệ, nếu có)
                                </p>
                            </th>
                            <th className={styles.th} style={getColumnStyle(9)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tỷ lệ (%)
                                </p>
                            </th>
                            <th className={styles.th} style={getColumnStyle(10)}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Loại tài sản, số lượng, giá trị tài sản góp vốn
                                </p>
                            </th>
                        </tr>
                        <tr className={styles.colNumberRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => (
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
                                {MEMBER_COLUMN_WIDTHS.map((_, index) => (
                                    <td
                                        key={`empty-${index}`}
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
                                            {index === 0 ? "Chưa có dữ liệu thành viên." : ""}
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
                                    <td
                                        className={styles.td}
                                        style={getColumnStyle(2, { textAlign: "center", whiteSpace: "nowrap" })}
                                    >
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
                                    <td className={styles.td} style={getColumnStyle(7)}>
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
                                            {row.phanVonGop ? `${row.phanVonGop} VNĐ` : ""}
                                            {row.phanVonGopNgoaiTe_GiaTri ? (
                                                <>
                                                    <br />({row.phanVonGopNgoaiTe_GiaTri} {row.phanVonGopNgoaiTe_Loai})
                                                </>
                                            ) : (
                                                ""
                                            )}
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
                                            {row.tyLe ? row.tyLe + "%" : ""}
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
                                            {row.loaiTaiSan}
                                        </p>
                                    </td>

                                    <td className={styles.td} style={getColumnStyle(11, { textAlign: "center" })}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.thoiHan}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(12)}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.chuKy}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={getColumnStyle(13)}>
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
                                textAlign: "left",
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
                            <p className={styles.signatureDate} style={{ textAlign: "center" }}>
                                <CurrentDate />
                            </p>
                            <p className={styles.signatureTitle} style={{ textAlign: "center" }}>
                                NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT
                                <br />
                                CỦA CÔNG TY
                            </p>
                            <p className={styles.signatureSubtitle} style={{ textAlign: "center" }}>
                                (<em>Ký và ghi họ tên</em>)
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DanhSachThanhVienConfirmation;
