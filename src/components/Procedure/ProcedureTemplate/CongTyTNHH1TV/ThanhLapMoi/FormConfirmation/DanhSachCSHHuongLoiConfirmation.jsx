import React from "react";
import { formatDate } from "@/utils/dateTimeUtils";
import styles from "./DanhSachCSHHuongLoiConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

function DanhSachCSHHuongLoiConfirmation({ dataJson }) {
    const rows = dataJson?.cshHuongLoiList || [];
    const { chuKy_ten = "", chuKy_hoTen = "" } = dataJson || {};

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.tableTitle}>DANH SÁCH CHỦ SỞ HỮU HƯỞNG LỢI CỦA DOANH NGHIỆP</h2>

            <div className={styles.tableScrollWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th rowSpan={2} className={styles.th}>
                                STT
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                Họ và tên
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                Ngày, tháng, năm sinh
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                Giới tính
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                Số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                Quốc tịch
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                Dân tộc
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                Địa chỉ liên lạc
                            </th>
                            <th colSpan={3} className={styles.th}>
                                Chủ sở hữu hưởng lợi của doanh nghiệp
                            </th>
                            <th rowSpan={2} className={styles.th}>
                                Ghi chú (nếu có)
                            </th>
                        </tr>
                        <tr>
                            <th className={styles.th}>Tỷ lệ sở hữu cổ phần vốn điều lệ</th>
                            <th className={styles.th}>Tỷ lệ sở hữu cổ phần có quyền biểu quyết</th>
                            <th className={styles.th}>Quyền chi phối</th>
                        </tr>
                        <tr className={styles.colNumberRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                                <td key={n} className={styles.colNumber}>
                                    {n}
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={12} className={styles.emptyCell}>
                                    Chưa có dữ liệu chủ sở hữu hưởng lợi.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => (
                                <tr key={idx}>
                                    <td className={styles.td} style={{ textAlign: "center" }}>
                                        {idx + 1}
                                    </td>
                                    <td className={styles.td}>{row.hoTen}</td>
                                    <td className={styles.td} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                        {formatDate(row.ngaySinh)}
                                    </td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>
                                        {row.gioiTinh}
                                    </td>
                                    <td className={styles.td}>{row.giaTo}</td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>
                                        {row.quocTich}
                                    </td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>
                                        {row.danToc}
                                    </td>
                                    <td className={styles.td} style={{ textAlign: "center", minWidth: 120 }}>
                                        {row.diaChiLienLac}
                                    </td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>
                                        {row.tyLeSoHuuVon ? `${row.tyLeSoHuuVon}%` : ""}
                                    </td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>
                                        {row.tyLeSoHuuBieuQuyet ? `${row.tyLeSoHuuBieuQuyet}%` : ""}
                                    </td>
                                    <td className={styles.td} style={{ textAlign: "center", width: 100 }}>
                                        {row.quyenChiPhoi}
                                    </td>
                                    <td className={styles.td}>{row.ghiChu}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles.signatureBlock}>
                <p className={styles.signatureDate}>
                    <CurrentDate />
                </p>
                <p className={styles.signatureTitle}>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT CỦA CÔNG TY</p>
                <p className={styles.signatureSubtitle}>
                    (<em>Ký và ghi rõ họ tên</em>)
                </p>
            </div>
        </div>
    );
}

export default DanhSachCSHHuongLoiConfirmation;
