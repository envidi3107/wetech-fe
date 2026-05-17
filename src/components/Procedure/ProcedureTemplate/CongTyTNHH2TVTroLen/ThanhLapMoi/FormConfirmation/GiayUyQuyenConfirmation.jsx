import React from "react";
import { formatDate, getToday } from "@/utils/dateTimeUtils";
// Reuse styles
import styles from "@/components/Procedure/ProcedureTemplate/HoKinhDoanh/FormConfirmation/confirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import SignatureBlock from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/SignatureBlock/SignatureBlock";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

export default function GiayUyQuyenConfirmation({ dataJson }) {
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
        tenCongTyPrefix = DEFAULT_TNHH_COMPANY_NAME_PREFIX,
        chuHo_xa_phuong = "",

        nhanUyQuyen_hoTen = "",
        nhanUyQuyen_ngaySinh = "",
        nhanUyQuyen_gioiTinh = "",
        nhanUyQuyen_cccd = "",
        nhanUyQuyen_phone = "",
        nhanUyQuyen_email = "",
        nhanUyQuyen_danToc = "",
        nhanUyQuyen_quocTich = "",
        nhanUyQuyen_thuongTru_soNha = "",
        nhanUyQuyen_thuongTru_xa = "",
        nhanUyQuyen_thuongTru_tinh = "",
        nhanUyQuyen_lienLac_soNha = "",
        nhanUyQuyen_lienLac_xa = "",
        nhanUyQuyen_lienLac_tinh = "",
    } = dataJson;
    const companyNamePrefix = getCompanyNamePrefix({ tenCongTyPrefix }, DEFAULT_TNHH_COMPANY_NAME_PREFIX);

    const benB = {
        hoTen: nhanUyQuyen_hoTen || "",
        gioiTinh: nhanUyQuyen_gioiTinh || "",
        ngaySinh: nhanUyQuyen_ngaySinh || "",
        danToc: nhanUyQuyen_danToc || "",
        quocTich: nhanUyQuyen_quocTich || "",
        cccd: nhanUyQuyen_cccd || "",
        thuongTru: [nhanUyQuyen_thuongTru_soNha, nhanUyQuyen_thuongTru_xa, nhanUyQuyen_thuongTru_tinh].filter(Boolean).join(", "),
        lienLac: [nhanUyQuyen_lienLac_soNha, nhanUyQuyen_lienLac_xa, nhanUyQuyen_lienLac_tinh].filter(Boolean).join(", "),
        phone: nhanUyQuyen_phone || "",
        email: nhanUyQuyen_email || "",
    };

    // Determine the prefix to display
    let prefix = "Phòng Đăng ký kinh doanh";

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
                <span>Là người đại diện đăng ký thành lập {companyNamePrefix} </span>
                <span>{chuHo_ten}</span>
                <span> tại {prefix} </span>
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
                    <span className={styles.infoValue}>{formatDate(benB.ngaySinh)}</span>
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
                Nộp hồ sơ và nhận kết quả thủ tục đăng ký thành lập {companyNamePrefix} <span>{chuHo_ten}</span> tại {prefix} <span>{chuHo_xa_phuong}</span>
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
                <CurrentDate />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", padding: "0 40px" }}>
                <div>
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", textDecoration: "underline" }}>BÊN NHẬN ỦY QUYỀN</span>
                    </div>
                </div>
                <div>
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", textDecoration: "underline" }}>BÊN ỦY QUYỀN</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
