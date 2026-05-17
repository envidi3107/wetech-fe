import React from "react";
import styles from "./confirmation.module.css";
import { getToday, formatDate } from "@/utils/dateTimeUtils";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";

function formatNumber(val) {
    if (!val) return "";
    const raw = String(val).replace(/[^0-9]/g, "");
    if (!raw) return "";
    return Number(raw).toLocaleString("vi-VN");
}

export default function GiayDeNghi({ dataJson }) {
    if (!dataJson) return null;

    const {
        chuKy_ten = "",
        chuKy_hoTen = "",
        nguoiDaiDien_hoTen = "",
        nguoiDaiDien_ngaySinh = "",
        nguoiDaiDien_gioiTinh = "",
        nguoiDaiDien_cccd = "",
        nguoiDaiDien_phone = "",
        nguoiDaiDien_email = "",
        nguoiDaiDien_danToc = "",
        nguoiDaiDien_quocTich = "",

        thuongTru_soNha = "",
        thuongTru_xa = "",
        thuongTru_tinh = "",

        hienTai_soNha = "",
        hienTai_xa = "",
        hienTai_tinh = "",

        hkd_tenVN = "",
        hkd_tenEN = "",
        hkd_tenVietTat = "",

        truSo_soNha = "",
        truSo_xa = "",
        truSo_tinh = "",
        truSo_phone = "",
        truSo_email = "",

        nganhNgheList = [],
        vonKinhDoanh = "",
        vonKinhDoanh_bangChu = "",

        thue_soNha = "",
        thue_xa = "",
        thue_tinh = "",
        thue_phone = "",
        thue_email = "",

        ngayBatDau = "",
        soLaoDong = "",
        vatMethod = "khoan",
        subject = "ca_nhan",

        thanhVienList = [],
        kinhGui = "",
    } = dataJson;

    const isPPKeKhai = vatMethod === "ke_khai";
    const isPPKhoan = vatMethod === "khoan";
    const isCaNhan = subject === "ca_nhan";
    const isGiaDinh = subject === "thanh_vien_gd";

    let kinhGuiTemp = kinhGui;
    if (kinhGuiTemp.includes("xã")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.indexOf("xã") + 3).trim();
    } else if (kinhGuiTemp.includes("Phường") || kinhGuiTemp.includes("phường")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.indexOf("Phường") + 6).trim();
    } else if (kinhGuiTemp.includes("thị trấn")) {
        kinhGuiTemp = kinhGuiTemp.substring(kinhGuiTemp.indexOf("thị trấn") + 7).trim();
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
            </div>

            <div className={styles.dateLocation}>
                <span>
                    <CurrentDate prefix={kinhGuiTemp} />
                </span>
            </div>

            <div className={styles.docTitle}>GIẤY ĐỀ NGHỊ ĐĂNG KÝ HỘ KINH DOANH</div>

            <div style={{ textAlign: "center", margin: "15px 0", fontSize: "var(--procedure-confirmation-font-size)" }}>
                Kính gửi: {kinhGui}
            </div>

            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Tôi là (ghi họ tên bằng chữ in hoa): </span>
                <span className={styles.infoValue} style={{ textTransform: "uppercase" }}>
                    {nguoiDaiDien_hoTen}
                </span>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Sinh ngày: </span>
                <span className={styles.infoValue}>{formatDate(nguoiDaiDien_ngaySinh)}</span>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Giới tính: </span>
                <span className={styles.infoValue}>{nguoiDaiDien_gioiTinh}</span>
            </div>
            <div className={styles.infoLine}>
                <span className={styles.infoLabel}>Số định danh cá nhân: </span>
                <span className={styles.infoValue}>{nguoiDaiDien_cccd}</span>
            </div>
            <div className={styles.infoRow}>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Điện thoại (nếu có): </span>
                    <span className={styles.infoValue}>{nguoiDaiDien_phone}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Thư điện tử (nếu có): </span>
                    <span className={styles.infoValue}>{nguoiDaiDien_email}</span>
                </div>
            </div>

            <p style={{ fontStyle: "italic", fontSize: "var(--procedure-confirmation-font-size)", margin: "4px 0 10px 16px" }}>
                Trường hợp việc kết nối giữa Cơ sở dữ liệu về đăng ký hộ kinh doanh với Cơ sở dữ liệu quốc gia về dân cư
                bị gián đoạn thì đề nghị kê khai thêm các thông tin cá nhân dưới đây:
            </p>

            <div className={styles.infoRow}>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Dân tộc: </span>
                    <span className={styles.infoValue}>{nguoiDaiDien_danToc || "Kinh"}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span className={styles.infoLabel}>Quốc tịch: </span>
                    <span className={styles.infoValue}>{nguoiDaiDien_quocTich || "Việt Nam"}</span>
                </div>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "10px" }}>
                <span className={styles.infoLabel}>Nơi thường trú:</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: </span>
                <span className={styles.infoValue}>{thuongTru_soNha}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Xã/Phường/Đặc khu: </span>
                <span className={styles.infoValue}>{thuongTru_xa}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Tỉnh/Thành phố trực thuộc trung ương: </span>
                <span className={styles.infoValue}>{thuongTru_tinh}</span>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "10px" }}>
                <span className={styles.infoLabel}>Nơi ở hiện tại:</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: </span>
                <span className={styles.infoValue}>{hienTai_soNha}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Xã/Phường/Đặc khu: </span>
                <span className={styles.infoValue}>{hienTai_xa}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Tỉnh/Thành phố trực thuộc trung ương: </span>
                <span className={styles.infoValue}>{hienTai_tinh}</span>
            </div>

            <div style={{ textAlign: "center", fontWeight: "bold", margin: "20px 0 10px" }}>
                Đăng ký hộ kinh doanh do tôi là chủ hộ với các nội dung sau:
            </div>

            <div className={styles.infoLine}>
                <span className={`${styles.infoLabel} ${styles.heading1}`}>1. Tên hộ kinh doanh:</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Tên hộ kinh doanh viết bằng tiếng Việt (ghi bằng chữ in hoa): HỘ KINH DOANH </span>
                <span className={styles.infoValue}>{hkd_tenVN?.toUpperCase()}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Tên hộ kinh doanh viết bằng tiếng nước ngoài (nếu có): </span>
                <span className={styles.infoValue}>{hkd_tenEN}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Tên hộ kinh doanh viết tắt (nếu có): </span>
                <span className={styles.infoValue}>{hkd_tenVietTat}</span>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "10px" }}>
                <span className={`${styles.infoLabel} ${styles.heading1}`}>2. Trụ sở của hộ kinh doanh:</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: </span>
                <span className={styles.infoValue}>{truSo_soNha}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Xã/Phường/Đặc khu: </span>
                <span className={styles.infoValue}>{truSo_xa}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Tỉnh/Thành phố trực thuộc trung ương: </span>
                <span className={styles.infoValue}>{truSo_tinh}</span>
            </div>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span>Điện thoại: </span>
                    <span className={styles.infoValue}>{truSo_phone}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span>Fax (nếu có): ..........</span>
                </div>
            </div>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span>Thư điện tử (nếu có): </span>
                    <span className={styles.infoValue}>{truSo_email}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span>Website (nếu có): ..........</span>
                </div>
            </div>
            <div className={styles.checkRow} style={{ marginLeft: "16px", marginTop: "6px" }}>
                <span className={!truSo_soNha && !truSo_xa && !truSo_tinh ? styles.checkedBox : styles.uncheckedBox}>
                    {!truSo_soNha && !truSo_xa && !truSo_tinh ? "X" : ""}
                </span>
                <span>
                    Không kinh doanh tại trụ sở (đánh dấu X vào ô này nếu hộ kinh doanh không có địa điểm kinh doanh cố
                    định)
                </span>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "14px" }}>
                <span className={`${styles.infoLabel} ${styles.heading1}`}>3. Ngành, nghề kinh doanh:</span>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: "40px" }}>STT</th>
                            <th>Tên ngành</th>
                            <th style={{ width: "100px" }}>Mã ngành</th>
                            <th style={{ width: "120px" }}>Ngành, nghề kinh doanh chính</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nganhNgheList.length > 0 &&
                            nganhNgheList.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <div>{row.tenNganh}</div>
                                        {row.chiTiet && <pre
                                            style={{
                                                margin: 0,
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                                fontFamily: "'Times New Roman', serif",
                                                fontSize: "var(--procedure-confirmation-font-size)"
                                            }}>{row.chiTiet}</pre>}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{row.maNganh}</td>
                                    <td style={{ textAlign: "center" }}>{row.laNganhChinh ? "X" : ""}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "14px" }}>
                <span className={`${styles.infoLabel} ${styles.heading1}`}>4. Vốn kinh doanh:</span>
            </div>
            <div className={styles.infoLine}>
                <span>Tổng số (bằng số): </span>
                <span className={styles.infoValue}>{formatNumber(vonKinhDoanh)} VNĐ </span>
                <span className={styles.infoValue} style={{ fontStyle: "italic" }}>
                    ({vonKinhDoanh_bangChu})
                </span>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "10px" }}>
                <span className={`${styles.infoLabel} ${styles.heading1}`}>5. Thông tin đăng ký thuế:</span>
            </div>
            <div className={styles.infoLine}>
                <span>
                    5.1. Địa chỉ nhận thông báo thuế (chỉ kê khai nếu địa chỉ nhận thông báo thuế khác địa chỉ trụ sở):
                </span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: </span>
                <span className={styles.infoValue}>{thue_soNha}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Xã/Phường/Đặc khu: </span>
                <span className={styles.infoValue}>{thue_xa}</span>
            </div>
            <div className={styles.infoLine} style={{ marginLeft: "16px" }}>
                <span>Tỉnh/Thành phố trực thuộc trung ương: </span>
                <span className={styles.infoValue}>{thue_tinh}</span>
            </div>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span>Điện thoại (nếu có): </span>
                    <span className={styles.infoValue}>{thue_phone}</span>
                </div>
                <div className={styles.infoItem} style={{ flex: 1 }}>
                    <span>Thư điện tử (nếu có): </span>
                    <span className={styles.infoValue}>{thue_email}</span>
                </div>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "6px" }}>
                <span>5.2. Ngày bắt đầu hoạt động: </span>
                <span className={styles.infoValue}>{formatDate(ngayBatDau)}</span>
            </div>
            <div className={styles.infoLine}>
                <span>5.3. Tổng số lao động (dự kiến): </span>
                <span className={styles.infoValue}>{soLaoDong}</span>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "6px" }}>
                <span>5.4. Phương pháp tính thuế GTGT (chọn 1 trong 2 phương pháp):</span>
            </div>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <div className={styles.checkRow} style={{ marginRight: "40px" }}>
                    <span className={isPPKeKhai ? styles.checkedBox : styles.uncheckedBox}>
                        {isPPKeKhai ? "X" : ""}
                    </span>
                    <span>Phương pháp kê khai</span>
                </div>
                <div className={styles.checkRow}>
                    <span className={isPPKhoan ? styles.checkedBox : styles.uncheckedBox}>{isPPKhoan ? "X" : ""}</span>
                    <span>Phương pháp khoán</span>
                </div>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "14px" }}>
                <span className={`${styles.infoLabel} ${styles.heading1}`}>6. Chủ thể thành lập hộ kinh doanh: </span>
                <span>(đánh dấu X vào ô thích hợp)</span>
            </div>
            <div className={styles.infoRow} style={{ marginLeft: "16px" }}>
                <div className={styles.checkRow} style={{ marginRight: "40px" }}>
                    <span className={isCaNhan ? styles.checkedBox : styles.uncheckedBox}>{isCaNhan ? "X" : ""}</span>
                    <span>Cá nhân</span>
                </div>
                <div className={styles.checkRow}>
                    <span className={isGiaDinh ? styles.checkedBox : styles.uncheckedBox}>{isGiaDinh ? "X" : ""}</span>
                    <span>Các thành viên hộ gia đình</span>
                </div>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "14px" }}>
                <span className={`${styles.infoLabel} ${styles.heading1}`}>
                    7. Thông tin về các thành viên hộ gia đình đăng ký hộ kinh doanh:
                </span>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table} style={{ fontSize: "12px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "30px" }}>STT</th>
                            <th>Họ tên</th>
                            <th style={{ width: "60px" }}>Ngày, tháng, năm sinh</th>
                            <th>Số định danh cá nhân</th>
                            <th style={{ width: "40px" }}>Giới tính</th>
                            <th style={{ width: "50px" }}>Quốc tịch</th>
                            <th style={{ width: "40px" }}>Dân tộc</th>
                            <th>Nơi thường trú</th>
                            <th>Nơi ở hiện tại</th>
                            <th>Chữ ký</th>
                        </tr>
                        <tr style={{ backgroundColor: "#fff", color: "#000" }}>
                            <td style={{ textAlign: "center" }}>1</td>
                            <td style={{ textAlign: "center" }}>2</td>
                            <td style={{ textAlign: "center" }}>3</td>
                            <td style={{ textAlign: "center" }}>4</td>
                            <td style={{ textAlign: "center" }}>5</td>
                            <td style={{ textAlign: "center" }}>6</td>
                            <td style={{ textAlign: "center" }}>7</td>
                            <td style={{ textAlign: "center" }}>8</td>
                            <td style={{ textAlign: "center" }}>9</td>
                            <td style={{ textAlign: "center" }}>10</td>
                        </tr>
                    </thead>
                    <tbody>
                        {thanhVienList.length > 0 ? (
                            thanhVienList.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{row.hoTen}</td>
                                    <td>{formatDate(row.ngaySinh)}</td>
                                    <td>{row.cccd}</td>
                                    <td>{row.gioiTinh}</td>
                                    <td>{row.quocTich}</td>
                                    <td>{row.danToc}</td>
                                    <td>{row.thuongTru || ""}</td>
                                    <td>{row.hienTai || ""}</td>
                                    <td>{row.chuKy || ""}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" style={{ height: "30px" }}></td>
                            </tr>
                        )}
                        {/* Empty rows to match paper style if no list or short list */}
                        {Array.from({ length: Math.max(0, 3 - thanhVienList.length) }).map((_, i) => (
                            <tr key={`empty-${i}`}>
                                <td>{(thanhVienList.length || 0) + i + 1}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.infoLine} style={{ marginTop: "14px" }}>
                <span className={styles.infoLabel}>Tôi xin cam kết:</span>
            </div>
            <div className={styles.closingText}>
                <p>
                    - Bản thân đồng ý chia sẻ thông tin cá nhân được lưu giữ tại Cơ sở dữ liệu quốc gia về dân cư cho Cơ
                    quan đăng ký kinh doanh cấp xã, Cơ quan quản lý nhà nước về đăng ký kinh doanh để phục vụ công tác
                    quản lý nhà nước về đăng ký hộ kinh doanh theo quy định;
                </p>
                <p>
                    - Bản thân không thuộc diện pháp luật cấm kinh doanh; không đồng thời là chủ hộ kinh doanh, thành
                    viên hộ gia đình đăng ký hộ kinh doanh khác; không là chủ doanh nghiệp tư nhân;
                </p>
                <p>
                    - Trụ sở thuộc quyền sử dụng hợp pháp của hộ kinh doanh và được sử dụng đúng mục đích theo quy định
                    của pháp luật (hộ kinh doanh chỉ cam kết trong trường hợp kinh doanh tại trụ sở);
                </p>
                <p>
                    - Hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung thực của nội dung
                    đăng ký trên.
                </p>
            </div>

            <div className={styles.signatureRow}>
                <div className={styles.signatureBlock}>
                    <div className={styles.signatureTitle}>CHỦ HỘ KINH DOANH</div>
                    <div className={styles.signatureNote}>(Ký và ghi họ tên)</div>
                    <div className={styles.signatureName}>{chuKy_ten}</div>
                    <div className={styles.signatureName}>{chuKy_hoTen}</div>
                </div>
            </div>
        </div>
    );
}
