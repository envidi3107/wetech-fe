import React from "react";
import styles from "./confirmation.module.css";
import { formatDate } from "@/utils/dateTimeUtils";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

export default function GiayUyQuyen({ dataJson }) {
    if (!dataJson) return null;

    const {
        uyQuyen_hoTen = "",
        uyQuyen_ngaySinh = "",
        uyQuyen_gioiTinh = "",
        uyQuyen_cccd = "",
        uyQuyen_phone = "",
        uyQuyen_email = "",
        uyQuyen_soNha = "",
        uyQuyen_xa = "",
        uyQuyen_tinh = "",

        chuHo_ten = "",
        chuHo_xa_phuong = "",
        kinhGuiPrefix = "Phòng Kinh tế, Hạ tầng và Đô thị Phường ",
    } = dataJson;

    const benB = {
        hoTen: dataJson.nhanUyQuyen_hoTen || "",
        gioiTinh: dataJson.nhanUyQuyen_gioiTinh || "",
        ngaySinh: formatDate(dataJson.nhanUyQuyen_ngaySinh || ""),
        danToc: dataJson.nhanUyQuyen_danToc || "",
        quocTich: dataJson.nhanUyQuyen_quocTich || "",
        cccd: dataJson.nhanUyQuyen_cccd || "",
        thuongTru: [dataJson.nhanUyQuyen_thuongTru_soNha, dataJson.nhanUyQuyen_thuongTru_xa, dataJson.nhanUyQuyen_thuongTru_tinh].filter(Boolean).join(", "),
        lienLac: [dataJson.nhanUyQuyen_lienLac_soNha, dataJson.nhanUyQuyen_lienLac_xa, dataJson.nhanUyQuyen_lienLac_tinh].filter(Boolean).join(", "),
        phone: dataJson.nhanUyQuyen_phone || "",
        email: dataJson.nhanUyQuyen_email || "",
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
            </div>

            <div className={styles.docTitle} style={{ margin: "30px 0" }}>
                GIẤY UỶ QUYỀN
            </div>

            <div className={styles.sectionTitle} style={{ textDecoration: "underline", fontSize: "15px" }}>
                BÊN ỦY QUYỀN (BÊN A):
            </div>
            <div className={styles.infoRow}>
                <div className={styles.infoItem} style={{ flex: 1.5 }}>
                    <span className={styles.infoLabel}>Họ và tên: </span>
                    <span className={styles.infoValue}>{uyQuyen_hoTen}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Giới tính: </span>
                    <span className={styles.infoValue}>{uyQuyen_gioiTinh}</span>
                </div>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Sinh ngày: </span>
                <span className={styles.infoValue}>{formatDate(uyQuyen_ngaySinh)}</span>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Số định danh cá nhân: </span>
                <span className={styles.infoValue}>{uyQuyen_cccd}</span>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Địa chỉ liên lạc: </span>
                <span className={styles.infoValue}>
                    {[uyQuyen_soNha, uyQuyen_xa, uyQuyen_tinh].filter(Boolean).join(", ")}
                </span>
            </div>
            <div className={styles.infoRow}>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Số điện thoại: </span>
                    <span className={styles.infoValue}>{uyQuyen_phone}</span>
                </div>
                {uyQuyen_email && (
                    <div className={styles.infoItem} style={{ flex: 1 }}>
                        <span className={styles.infoLabel}>Email: </span>
                        <span className={styles.infoValue}>{uyQuyen_email}</span>
                    </div>
                )}
            </div>

            <div className={styles.infoLine} style={{ marginTop: "10px", lineHeight: "1.8" }}>
                <span>Là chủ hộ kinh doanh đăng ký thành lập HỘ KINH DOANH </span>
                <span>{chuHo_ten}</span>
                <span> tại {kinhGuiPrefix.trim()} </span>
                <span>{chuHo_xa_phuong}</span>
            </div>

            <div
                className={styles.sectionTitle}
                style={{ textDecoration: "underline", fontSize: "15px", marginTop: "20px" }}
            >
                BÊN NHẬN UỶ QUYỀN (BÊN B):
            </div>
            <div className={styles.infoRow}>
                <div className={styles.infoItem} style={{ flex: 1.5 }}>
                    <span className={styles.infoLabel}>Họ và tên: </span>
                    <span className={styles.infoValue} style={{ textTransform: "uppercase" }}>
                        {benB.hoTen}
                    </span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Giới tính: </span>
                    <span className={styles.infoValue}>{benB.gioiTinh}</span>
                </div>
            </div>
            <div className={styles.infoRow}>
                <div className={styles.infoItem} style={{ flex: 1.5 }}>
                    <span className={styles.infoLabel}>Sinh ngày: </span>
                    <span className={styles.infoValue}>{benB.ngaySinh}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Dân tộc: </span>
                    <span className={styles.infoValue}>{benB.danToc}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Quốc tịch: </span>
                    <span className={styles.infoValue}>{benB.quocTich}</span>
                </div>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Số định danh cá nhân: </span>
                <span className={styles.infoValue}>{benB.cccd}</span>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Địa chỉ thường trú: </span>
                <span className={styles.infoValue}>{benB.thuongTru}</span>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Địa chỉ liên lạc: </span>
                <span className={styles.infoValue}>{benB.lienLac}</span>
            </div>
            <div className={styles.infoRow}>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Số điện thoại: </span>
                    <span className={styles.infoValue}>{benB.phone}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Email: </span>
                    <span className={styles.infoValue}>{benB.email}</span>
                </div>
            </div>

            <div
                className={styles.sectionTitle}
                style={{ textDecoration: "underline", fontSize: "15px", marginTop: "20px" }}
            >
                NỘI DUNG ỦY QUYỀN:
            </div>
            <div className={styles.infoLine} style={{ marginBottom: "10px" }}>
                Bên A ủy quyền cho bên B thực hiện các công việc sau đây:
            </div>
            <div className={styles.infoLine} style={{ lineHeight: "1.8" }}>
                Nộp hồ sơ và nhận kết quả thủ tục đăng ký thành lập HỘ KINH DOANH <span>{chuHo_ten}</span> tại {kinhGuiPrefix.trim()}{" "}
                <span>{chuHo_xa_phuong}</span>
            </div>

            <div
                className={styles.sectionTitle}
                style={{ textDecoration: "underline", fontSize: "15px", marginTop: "20px" }}
            >
                THỜI HẠN UỶ QUYỀN:
            </div>
            <div className={styles.infoLine}>Từ ngày ký đến khi hoàn tất công việc.</div>
            <div className={styles.infoLine}>Thù lao ủy quyền: ủy quyền này không có thù lao</div>
            <div className={styles.infoLine}>
                Chúng tôi cam kết chịu trách nhiệm trước pháp luật về nội dung ủy quyền này.
            </div>
            <div className={styles.infoLine}>Giấy ủy quyền này được lập thành 02 bản chính, mỗi bên giữ 01 bản.</div>

            <div className={styles.dateLocation}>
                <CurrentDate prefix={chuHo_xa_phuong} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", padding: "0 40px" }}>
                <div>
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                            BÊN NHẬN ỦY QUYỀN
                        </span>
                    </div>
                </div>
                <div>
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                            BÊN ỦY QUYỀN
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
