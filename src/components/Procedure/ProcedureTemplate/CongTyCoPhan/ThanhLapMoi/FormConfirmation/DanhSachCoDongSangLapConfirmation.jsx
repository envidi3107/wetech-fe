import React from "react";
import { formatDate } from "@/utils/dateTimeUtils";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/DanhSachCSHHuongLoiConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

function DanhSachCoDongSangLapConfirmation({ dataJson }) {
    const rows = dataJson?.coDongList || [];
    const loaiCoPhanKhacList = dataJson?.loaiCoPhanKhacList?.length
        ? dataJson.loaiCoPhanKhacList
        : [dataJson?.loaiCoPhanKhac_ten || "........"];

    return (
        <div className={styles.wrapper}>
            <p
                style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    fontWeight: "bold",
                    fontSize: "var(--procedure-confirmation-font-size)",
                }}
            >
                DANH SÁCH CỔ ĐÔNG SÁNG LẬP CÔNG TY CỔ PHẦN
            </p>
            <p style={{ marginBottom: "10px", fontWeight: "bold" }}>I. Cổ đông sáng lập là cá nhân</p>
            <div className={styles.tableScrollWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th rowSpan={4} className={styles.th}>
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
                            <th rowSpan={4} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tên cổ đông sáng lập
                                </p>
                            </th>
                            <th rowSpan={4} className={styles.th}>
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
                            <th rowSpan={4} className={styles.th}>
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
                            <th rowSpan={4} className={styles.th}>
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
                            <th rowSpan={4} className={styles.th}>
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
                            <th rowSpan={4} className={styles.th}>
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
                            <th rowSpan={4} className={styles.th}>
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
                            <th colSpan={8 + (loaiCoPhanKhacList.length - 1) * 2} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Vốn góp²
                                </p>
                            </th>
                            <th rowSpan={4} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thời hạn góp vốn⁴
                                </p>
                            </th>
                            <th rowSpan={4} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Chữ ký của cổ đông sáng lập⁵
                                </p>
                            </th>
                            <th rowSpan={4} className={styles.th}>
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
                            <th colSpan={2} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tổng số cổ phần
                                </p>
                            </th>
                            <th rowSpan={3} className={styles.th}>
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
                            <th colSpan={2 + loaiCoPhanKhacList.length * 2} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Loại cổ phần
                                </p>
                            </th>
                            <th rowSpan={3} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Loại tài sản, số lượng, giá trị tài sản góp vốn³
                                </p>
                            </th>
                        </tr>
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
                                    Số lượng
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
                                    Giá trị
                                </p>
                            </th>
                            <th colSpan={2} className={styles.th}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Phổ thông
                                </p>
                            </th>
                            {loaiCoPhanKhacList.map((ten, idx) => (
                                <th key={idx} colSpan={2} className={styles.th}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        Khác (ghi rõ): {ten || "........"}
                                    </p>
                                </th>
                            ))}
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
                                    Số lượng
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
                                    Giá trị
                                </p>
                            </th>
                            {loaiCoPhanKhacList.map((_, idx) => (
                                <React.Fragment key={idx}>
                                    <th className={styles.th}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            Số lượng
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
                                            Giá trị
                                        </p>
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>
                        <tr className={styles.colNumberRow}>
                            {Array.from({ length: 17 + loaiCoPhanKhacList.length * 2 }).map((_, i) => (
                                <td key={i} className={styles.colNumber}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {i + 1}
                                    </p>
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={17 + loaiCoPhanKhacList.length * 2} className={styles.emptyCell}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        Chưa có dữ liệu cổ đông sáng lập.
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
                                    <td className={styles.td} style={{ minWidth: 120 }}>
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

                                    {/* Vốn góp */}
                                    <td className={styles.td} style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.tongSoCoPhan_soLuong}
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
                                            {row.tongSoCoPhan_giaTri}
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
                                            {row.tyLe ? row.tyLe + "%" : ""}
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
                                            {row.loaiCoPhan_phoThong_soLuong}
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
                                            {row.loaiCoPhan_phoThong_giaTri}
                                        </p>
                                    </td>
                                    {loaiCoPhanKhacList.map((_, idxKhac) => {
                                        const slKey =
                                            idxKhac === 0
                                                ? "loaiCoPhan_khac_soLuong"
                                                : `loaiCoPhan_khac_soLuong_${idxKhac}`;
                                        const gtKey =
                                            idxKhac === 0
                                                ? "loaiCoPhan_khac_giaTri"
                                                : `loaiCoPhan_khac_giaTri_${idxKhac}`;
                                        return (
                                            <React.Fragment key={idxKhac}>
                                                <td className={styles.td} style={{ textAlign: "center" }}>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            lineHeight: "inherit",
                                                            textAlign: "inherit",
                                                            font: "inherit",
                                                        }}
                                                    >
                                                        {row[slKey]}
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
                                                        {row[gtKey]}
                                                    </p>
                                                </td>
                                            </React.Fragment>
                                        );
                                    })}
                                    <td className={styles.td} style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {row.loaiTaiSanGopVon}
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
                                            {row.thoiHanGopVon}
                                        </p>
                                    </td>
                                    <td className={styles.td} style={{ backgroundColor: "#fdfdfd" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {/* Physical Signature space */}
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
            <div style={{ marginTop: "20px", fontSize: "14px", lineHeight: "1.6" }}>
                <p>
                    ² Ghi giá trị vốn cổ phần của từng cổ đông sáng lập. Tài sản hình thành giá trị vốn cổ phần cần được
                    liệt kê cụ thể...
                </p>
                <p>³ Loại tài sản góp vốn bao gồm: Đồng Việt Nam; Ngoại tệ tự do chuyển đổi...</p>
                <p>
                    ⁴ Khi đăng ký thành lập doanh nghiệp, thời hạn góp vốn là thời hạn cổ đông dự kiến hoàn thành góp
                    vốn.
                </p>
            </div>
            <div className={styles.signatureBlock}>
                <p className={styles.signatureDate}>
                    <CurrentDate />
                </p>
                <p className={styles.signatureTitle}>
                    NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT
                    <br />
                    CỦA CÔNG TY
                </p>
                <p className={styles.signatureSubtitle}>
                    (<em>Ký và ghi họ tên</em>)
                </p>
            </div>
        </div>
    );
}

export default DanhSachCoDongSangLapConfirmation;
