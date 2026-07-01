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
        thuongTru: [
            dataJson.nhanUyQuyen_thuongTru_soNha,
            dataJson.nhanUyQuyen_thuongTru_xa,
            dataJson.nhanUyQuyen_thuongTru_tinh,
        ]
            .filter(Boolean)
            .join(", "),
        lienLac: [
            dataJson.nhanUyQuyen_lienLac_soNha,
            dataJson.nhanUyQuyen_lienLac_xa,
            dataJson.nhanUyQuyen_lienLac_tinh,
        ]
            .filter(Boolean)
            .join(", "),
        phone: dataJson.nhanUyQuyen_phone || "",
        email: dataJson.nhanUyQuyen_email || "",
    };

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
            <p className={styles.infoLine} style={{ marginTop: "10px", lineHeight: "1.8" }}>
                <>Là chủ hộ kinh doanh đăng ký thành lập HỘ KINH DOANH </>
                <>{chuHo_ten}</>
                <>tại {kinhGuiPrefix.trim()} </>
                <>{chuHo_xa_phuong}</>
            </p>
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
                        {benB.hoTen}
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
                        {benB.gioiTinh}
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
                        {benB.ngaySinh}
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
                        {benB.danToc}
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
                        {benB.quocTich}
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
                    {benB.cccd}
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
                    {benB.thuongTru}
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
                    {benB.lienLac}
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
                        {benB.phone}
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
                        {benB.email}
                    </b>
                </p>
            </div>
            <p
                className={styles.sectionTitle}
                style={{ textDecoration: "underline", fontSize: "15px", marginTop: "20px" }}
            >
                NỘI DUNG ỦY QUYỀN:
            </p>
            <p className={styles.infoLine} style={{ marginBottom: "10px" }}>
                Bên A ủy quyền cho bên B thực hiện các công việc sau đây:
            </p>
            <p className={styles.infoLine} style={{ lineHeight: "1.8" }}>
                Nộp hồ sơ và nhận kết quả thủ tục đăng ký thành lập HỘ KINH DOANH <>{chuHo_ten}</> tại{" "}
                {kinhGuiPrefix.trim()} <>{chuHo_xa_phuong}</>
            </p>
            <p
                className={styles.sectionTitle}
                style={{ textDecoration: "underline", fontSize: "15px", marginTop: "20px" }}
            >
                THỜI HẠN UỶ QUYỀN:
            </p>
            <p className={styles.infoLine}>Từ ngày ký đến khi hoàn tất công việc.</p>
            <p className={styles.infoLine}>Thù lao ủy quyền: ủy quyền này không có thù lao</p>
            <p className={styles.infoLine}>
                Chúng tôi cam kết chịu trách nhiệm trước pháp luật về nội dung ủy quyền này.
            </p>
            <p className={styles.infoLine}>Giấy ủy quyền này được lập thành 02 bản chính, mỗi bên giữ 01 bản.</p>
            <p className={styles.dateLocation}>
                <CurrentDate prefix={chuHo_xa_phuong} />
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", padding: "0 40px" }}>
                <div>
                    <p style={{ textAlign: "center", marginBottom: "10px", textDecoration: "underline", fontWeight: "bold" }}>
                        BÊN NHẬN ỦY QUYỀN
                    </p>
                </div>
                <div>
                    <p style={{ textAlign: "center", marginBottom: "10px", textDecoration: "underline", fontWeight: "bold" }}>
                        BÊN ỦY QUYỀN
                    </p>
                </div>
            </div>
        </div>
    );
}
