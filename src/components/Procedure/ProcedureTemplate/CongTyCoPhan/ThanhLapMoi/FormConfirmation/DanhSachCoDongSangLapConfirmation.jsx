import React from "react";
import { formatDate } from "@/utils/dateTimeUtils";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/DanhSachCSHHuongLoiConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

function DanhSachCoDongSangLapConfirmation({ dataJson }) {
    const rows = dataJson?.coDongList || [];
    const loaiCoPhanKhacList = dataJson?.loaiCoPhanKhacList?.length ? dataJson.loaiCoPhanKhacList : [dataJson?.loaiCoPhanKhac_ten || "........"];

    return (
        <div className={styles.wrapper}>
            <div style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold", fontSize: "var(--procedure-confirmation-font-size)" }}>
                DANH SÁCH CỔ ĐÔNG SÁNG LẬP CÔNG TY CỔ PHẦN
            </div>

            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                I. Cổ đông sáng lập là cá nhân
            </div>

            <div className={styles.tableScrollWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th rowSpan={4} className={styles.th}>STT</th>
                            <th rowSpan={4} className={styles.th}>Tên cổ đông sáng lập</th>
                            <th rowSpan={4} className={styles.th}>Ngày, tháng, năm sinh</th>
                            <th rowSpan={4} className={styles.th}>Giới tính</th>
                            <th rowSpan={4} className={styles.th}>
                                Loại giấy tờ, số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                            </th>
                            <th rowSpan={4} className={styles.th}>Quốc tịch</th>
                            <th rowSpan={4} className={styles.th}>Dân tộc</th>
                            <th rowSpan={4} className={styles.th}>Địa chỉ liên lạc</th>
                            <th colSpan={8 + (loaiCoPhanKhacList.length - 1) * 2} className={styles.th}>Vốn góp²</th>
                            <th rowSpan={4} className={styles.th}>Thời hạn góp vốn⁴</th>
                            <th rowSpan={4} className={styles.th}>Chữ ký của cổ đông sáng lập⁵</th>
                            <th rowSpan={4} className={styles.th}>Ghi chú (nếu có)</th>
                        </tr>
                        <tr>
                            <th colSpan={2} className={styles.th}>Tổng số cổ phần</th>
                            <th rowSpan={3} className={styles.th}>Tỷ lệ (%)</th>
                            <th colSpan={2 + loaiCoPhanKhacList.length * 2} className={styles.th}>Loại cổ phần</th>
                            <th rowSpan={3} className={styles.th}>Loại tài sản, số lượng, giá trị tài sản góp vốn³</th>
                        </tr>
                        <tr>
                            <th rowSpan={2} className={styles.th}>Số lượng</th>
                            <th rowSpan={2} className={styles.th}>Giá trị</th>
                            <th colSpan={2} className={styles.th}>Phổ thông</th>
                            {loaiCoPhanKhacList.map((ten, idx) => (
                                <th key={idx} colSpan={2} className={styles.th}>Khác (ghi rõ): {ten || "........"}</th>
                            ))}
                        </tr>
                        <tr>
                            <th className={styles.th}>Số lượng</th>
                            <th className={styles.th}>Giá trị</th>
                            {loaiCoPhanKhacList.map((_, idx) => (
                                <React.Fragment key={idx}>
                                    <th className={styles.th}>Số lượng</th>
                                    <th className={styles.th}>Giá trị</th>
                                </React.Fragment>
                            ))}
                        </tr>
                        <tr className={styles.colNumberRow}>
                            {Array.from({ length: 17 + loaiCoPhanKhacList.length * 2 }).map((_, i) => (
                                <td key={i} className={styles.colNumber}>{i + 1}</td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={17 + loaiCoPhanKhacList.length * 2} className={styles.emptyCell}>
                                    Chưa có dữ liệu cổ đông sáng lập.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => (
                                <tr key={idx}>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{idx + 1}</td>
                                    <td className={styles.td}>{row.hoTen}</td>
                                    <td className={styles.td} style={{ textAlign: "center", whiteSpace: "nowrap" }}>{formatDate(row.ngaySinh)}</td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.gioiTinh}</td>
                                    <td className={styles.td}>{row.giaTo}</td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.quocTich}</td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.danToc}</td>
                                    <td className={styles.td} style={{ minWidth: 120 }}>{row.diaChiLienLac}</td>

                                    {/* Vốn góp */}
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.tongSoCoPhan_soLuong}</td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.tongSoCoPhan_giaTri}</td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.tyLe ? row.tyLe + '%' : ''}</td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.loaiCoPhan_phoThong_soLuong}</td>
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.loaiCoPhan_phoThong_giaTri}</td>
                                    {loaiCoPhanKhacList.map((_, idxKhac) => {
                                        const slKey = idxKhac === 0 ? "loaiCoPhan_khac_soLuong" : `loaiCoPhan_khac_soLuong_${idxKhac}`;
                                        const gtKey = idxKhac === 0 ? "loaiCoPhan_khac_giaTri" : `loaiCoPhan_khac_giaTri_${idxKhac}`;
                                        return (
                                            <React.Fragment key={idxKhac}>
                                                <td className={styles.td} style={{ textAlign: "center" }}>{row[slKey]}</td>
                                                <td className={styles.td} style={{ textAlign: "center" }}>{row[gtKey]}</td>
                                            </React.Fragment>
                                        );
                                    })}
                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.loaiTaiSanGopVon}</td>

                                    <td className={styles.td} style={{ textAlign: "center" }}>{row.thoiHanGopVon}</td>
                                    <td className={styles.td} style={{ backgroundColor: "#fdfdfd" }}>
                                        {/* Physical Signature space */}
                                    </td>
                                    <td className={styles.td}>{row.ghiChu}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: "20px", fontSize: "14px", lineHeight: "1.6" }}>
                <p>² Ghi giá trị vốn cổ phần của từng cổ đông sáng lập. Tài sản hình thành giá trị vốn cổ phần cần được liệt kê cụ thể...</p>
                <p>³ Loại tài sản góp vốn bao gồm: Đồng Việt Nam; Ngoại tệ tự do chuyển đổi...</p>
                <p>⁴ Khi đăng ký thành lập doanh nghiệp, thời hạn góp vốn là thời hạn cổ đông dự kiến hoàn thành góp vốn.</p>
            </div>

            <div className={styles.signatureBlock}>
                <p className={styles.signatureDate}><CurrentDate /></p>
                <p className={styles.signatureTitle}>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT<br />CỦA CÔNG TY</p>
                <p className={styles.signatureSubtitle}>(<em>Ký và ghi họ tên</em>)</p>
            </div>
        </div>
    );
}

export default DanhSachCoDongSangLapConfirmation;
