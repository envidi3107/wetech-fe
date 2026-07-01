import React from "react";
import { formatDate } from "@/utils/dateTimeUtils";
import styles from "./DanhSachCSHHuongLoiConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

function DanhSachCSHHuongLoiConfirmation({ dataJson }) {
    const rows = dataJson?.cshHuongLoiList || [];
    const datePrefix = dataJson?.kinhGuiProvince || dataJson?.truSo_tinh;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.tableTitle}>DANH SÁCH CHỦ SỞ HỮU HƯỞNG LỢI CỦA DOANH NGHIỆP</h2>
            <div className={styles.tableScrollWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th rowSpan={2} className={styles.th}>
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
                            <th rowSpan={2} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Họ và tên
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ngày, tháng, năm sinh
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th}>
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
                            <th rowSpan={2} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                                </p>
                            </th>
                            <th rowSpan={2} className={styles.th}>
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
                            <th rowSpan={2} className={styles.th}>
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
                            <th rowSpan={2} className={styles.th}>
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
                            <th colSpan={3} className={styles.th}>
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
                            <th rowSpan={2} className={styles.th}>
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
                            <th className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tỷ lệ sở hữu cổ phần vốn điều lệ
                                </p>
                            </th>
                            <th className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tỷ lệ sở hữu cổ phần có quyền biểu quyết
                                </p>
                            </th>
                            <th className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Quyền chi phối
                                </p>
                            </th>
                        </tr>
                        <tr className={styles.colNumberRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                                <td key={n} className={styles.colNumber}>
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
                                <td colSpan={12} className={styles.emptyCell}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        Chưa có dữ liệu chủ sở hữu hưởng lợi.
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => (
                                <tr key={idx}>
                                    <td className={styles.td} style={{ textAlign: "center" }}>
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
                                    <td className={styles.td}>
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
                                    <td className={styles.td} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
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
                                    <td className={styles.td} style={{ textAlign: "center" }}>
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
                                    <td className={styles.td}>
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
                                    <td className={styles.td} style={{ textAlign: "center" }}>
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
                                    <td className={styles.td} style={{ textAlign: "center" }}>
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
                                    <td className={styles.td} style={{ textAlign: "center", minWidth: 120 }}>
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
                                    <td className={styles.td} style={{ textAlign: "center" }}>
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
                                    <td className={styles.td} style={{ textAlign: "center" }}>
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
                                    <td className={styles.td} style={{ textAlign: "center", width: 100 }}>
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
                                    <td className={styles.td}>
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
            <div style={{ textAlign: "right", width: "100%", marginTop: "30px", marginBottom: "50px" }}>
                <div style={{ display: "inline-block", textAlign: "center", whiteSpace: "nowrap" }}>
                    <p className={styles.signatureDate}>
                        <CurrentDate prefix={datePrefix} />
                    </p>
                    <p className={styles.signatureTitle}>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT CỦA CÔNG TY</p>
                    <p className={styles.signatureSubtitle}>
                        (<em>Ký và ghi rõ họ tên</em>)
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DanhSachCSHHuongLoiConfirmation;
