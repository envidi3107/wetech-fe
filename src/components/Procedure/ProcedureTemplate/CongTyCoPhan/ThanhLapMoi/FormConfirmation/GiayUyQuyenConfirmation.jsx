import React from "react";
import { formatDate } from "@/utils/dateTimeUtils";
import styles from "@/components/Procedure/ProcedureTemplate/HoKinhDoanh/FormConfirmation/confirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

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
        companyName = "doanh nghiệp",
        phongThucHien = "……………………………………………………………",
    } = dataJson;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
            </div>
            <p className={styles.docTitle} style={{ margin: "30px 0" }}>
                GIẤY UỶ QUYỀN
            </p>
            <p className={styles.sectionTitle} style={{ textDecoration: "underline", fontSize: "15px" }}>
                BÊN ỦY QUYỀN (BÊN A):
            </p>
            <div className={styles.infoRow}>
                <p className={styles.infoItem} style={{ flex: 1.5 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Họ và tên:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            textTransform: "uppercase",
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {uyQuyen_hoTen}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Giới tính:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {uyQuyen_gioiTinh}
                    </b>
                </p>
            </div>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Sinh ngày:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {formatDate(uyQuyen_ngaySinh)}
                </b>
            </p>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Số định danh cá nhân:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {uyQuyen_cccd}
                </b>
            </p>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Địa chỉ liên lạc:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {[uyQuyen_soNha, uyQuyen_xa, uyQuyen_tinh].filter(Boolean).join(", ")}
                </b>
            </p>
            <div className={styles.infoRow}>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Số điện thoại:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {uyQuyen_phone}
                    </b>
                </p>
                {uyQuyen_email && (
                    <p className={styles.infoItem} style={{ flex: 1 }}>
                        <b
                            className={styles.infoLabel}
                            style={{
                                fontWeight: "inherit",
                                fontStyle: "normal",
                            }}
                        >
                            Email:{" "}
                        </b>
                        <b
                            className={styles.infoValue}
                            style={{
                                fontWeight: "inherit",
                                fontStyle: "normal",
                            }}
                        >
                            {uyQuyen_email}
                        </b>
                    </p>
                )}
            </div>
            <p
                className={styles.sectionTitle}
                style={{ textDecoration: "underline", fontSize: "15px", marginTop: "20px" }}
            >
                BÊN NHẬN UỶ QUYỀN (BÊN B):
            </p>
            <div className={styles.infoRow}>
                <p className={styles.infoItem} style={{ flex: 1.5 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Họ và tên:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            textTransform: "uppercase",
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nhanUyQuyen_hoTen}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Giới tính:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nhanUyQuyen_gioiTinh}
                    </b>
                </p>
            </div>
            <div className={styles.infoRow}>
                <p className={styles.infoItem} style={{ flex: 1.5 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Sinh ngày:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {formatDate(nhanUyQuyen_ngaySinh)}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Dân tộc:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nhanUyQuyen_danToc}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Quốc tịch:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nhanUyQuyen_quocTich}
                    </b>
                </p>
            </div>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Số định danh cá nhân:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {nhanUyQuyen_cccd}
                </b>
            </p>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Địa chỉ thường trú:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {[nhanUyQuyen_thuongTru_soNha, nhanUyQuyen_thuongTru_xa, nhanUyQuyen_thuongTru_tinh]
                        .filter(Boolean)
                        .join(", ")}
                </b>
            </p>
            <p className={styles.infoLine}>
                <b
                    className={styles.infoLabel}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Địa chỉ liên lạc:{" "}
                </b>
                <b
                    className={styles.infoValue}
                    style={{
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    {[nhanUyQuyen_lienLac_soNha, nhanUyQuyen_lienLac_xa, nhanUyQuyen_lienLac_tinh]
                        .filter(Boolean)
                        .join(", ")}
                </b>
            </p>
            <div className={styles.infoRow}>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Số điện thoại:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nhanUyQuyen_phone}
                    </b>
                </p>
                <p className={styles.infoItem} style={{ flex: 1 }}>
                    <b
                        className={styles.infoLabel}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        Email:{" "}
                    </b>
                    <b
                        className={styles.infoValue}
                        style={{
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nhanUyQuyen_email}
                    </b>
                </p>
            </div>
            <p
                className={styles.sectionTitle}
                style={{ textDecoration: "underline", fontSize: "15px", marginTop: "20px", textAlign: "left" }}
            >
                NỘI DUNG ỦY QUYỀN:
            </p>
            <p className={styles.infoLine} style={{ marginBottom: "10px", textAlign: "left" }}>
                Bên A ủy quyền cho bên B thực hiện các công việc sau đây:
            </p>
            <p className={styles.infoLine} style={{ lineHeight: "1.8", textAlign: "left" }}>
                <>
                    Nộp hồ sơ và nhận kết quả thủ tục đăng ký mới {companyName} tại {phongThucHien}
                </>
            </p>
            <p
                className={styles.sectionTitle}
                style={{ textDecoration: "underline", fontSize: "15px", marginTop: "20px", textAlign: "left" }}
            >
                THỜI HẠN UỶ QUYỀN:
            </p>
            <p className={styles.infoLine} style={{ textAlign: "left" }}>
                Từ ngày ký đến khi hoàn tất công việc.
            </p>
            <p className={styles.infoLine} style={{ textAlign: "left" }}>
                Thù lao ủy quyền: ủy quyền này không có thù lao
            </p>
            <p className={styles.infoLine} style={{ textAlign: "left" }}>
                Chúng tôi cam kết chịu trách nhiệm trước pháp luật về nội dung ủy quyền này.
            </p>
            <p className={styles.infoLine} style={{ textAlign: "left" }}>
                Giấy ủy quyền này được lập thành 02 bản chính, mỗi bên giữ 01 bản.
            </p>
            <p className={styles.dateLocation}>
                <CurrentDate />
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", padding: "0 40px" }}>
                <div>
                    <p style={{ textAlign: "center", marginBottom: "10px" }}>
                        <b
                            style={{
                                fontWeight: "bold",
                                textDecoration: "underline",
                                fontStyle: "normal",
                            }}
                        >
                            BÊN NHẬN ỦY QUYỀN
                        </b>
                    </p>
                </div>
                <div>
                    <p style={{ textAlign: "center", marginBottom: "10px" }}>
                        <b
                            style={{
                                fontWeight: "bold",
                                textDecoration: "underline",
                                fontStyle: "normal",
                            }}
                        >
                            BÊN ỦY QUYỀN
                        </b>
                    </p>
                </div>
            </div>
        </div>
    );
}
