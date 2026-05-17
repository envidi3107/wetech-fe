import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { formatDate } from "@/utils/dateTimeUtils";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

function Line({ label, value }) {
    return (
        <p>
            {label}: {value || ""}
        </p>
    );
}

function addressToString(...parts) {
    return parts.filter(Boolean).join(", ");
}

function GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatConfirmation({ dataJson }) {
    const data = normalizeDataJson(dataJson);

    if (!Object.keys(data).length) {
        return <div className={styles.emptyMessage}>Đang tải dữ liệu...</div>;
    }

    const diaChiLienLac = addressToString(
        data.nguoiDaiDien_soNha,
        data.nguoiDaiDien_xa,
        data.nguoiDaiDien_tinh,
        data.nguoiDaiDien_lienLac_quocGia,
    );
    const noiThuongTru = addressToString(
        data.nguoiDaiDien_thuongTru_soNha,
        data.nguoiDaiDien_thuongTru_xa,
        data.nguoiDaiDien_thuongTru_tinh,
        data.nguoiDaiDien_thuongTru_quocGia,
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.nationTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
                <p className={styles.dateRight} style={{ fontStyle: "italic" }}>
                    <CurrentDate prefix={data.kinhGuiProvince} />
                </p>
            </div>

            <h2 className={styles.docTitle}>GIẤY ĐỀ NGHỊ</h2>
            <h3 className={styles.docTitle}>Đăng ký thay đổi người đại diện theo pháp luật</h3>

            <div className={styles.content}>
                <p>Kính gửi: {data.kinhGui}</p>
                <Line label="Tên doanh nghiệp (ghi bằng chữ in hoa)" value={data.tenDoanhNghiep} />
                <Line label="Mã số doanh nghiệp/Mã số thuế" value={data.maSoDoanhNghiep} />
                <Line
                    label="Số định danh cá nhân của Chủ tịch hội đồng thành viên/Chủ tịch công ty/Chủ tịch hội đồng quản trị (chỉ kê khai trong trường hợp ủy quyền thực hiện thủ tục đăng ký doanh nghiệp)"
                    value={data.soDinhDanhChuTich}
                />

                <p style={{ marginTop: 16 }}>
                    <strong>Đăng ký thay đổi người đại diện theo pháp luật với các nội dung sau:</strong>
                </p>
                <p>
                    <strong>Người đại diện theo pháp luật sau khi thay đổi:</strong>
                </p>
                <Line label="Họ, chữ đệm và tên" value={data.nguoiDaiDien_hoTen} />
                <Line label="Ngày, tháng, năm sinh" value={formatDate(data.nguoiDaiDien_ngaySinh)} />
                <Line label="Giới tính" value={data.nguoiDaiDien_gioiTinh} />
                <Line label="Số định danh cá nhân" value={data.nguoiDaiDien_cccd} />
                <Line label="Chức danh" value={data.nguoiDaiDien_chucDanh} />
                <Line label="Địa chỉ liên lạc" value={diaChiLienLac} />
                <p>
                    Điện thoại: {data.nguoiDaiDien_phone || ""}
                    &nbsp;&nbsp; Thư điện tử: {data.nguoiDaiDien_email || ""}
                </p>

                <p style={{ marginTop: 16, fontStyle: "italic" }}>
                    Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký
                    doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì kê khai các thông tin cá nhân
                    dưới đây:
                </p>
                <p>
                    Dân tộc: {data.nguoiDaiDien_danToc || ""}
                    &nbsp;&nbsp; Quốc tịch: {data.nguoiDaiDien_quocTich || ""}
                </p>
                <Line
                    label="Số Hộ chiếu/Số Hộ chiếu nước ngoài hoặc giấy tờ có giá trị thay thế"
                    value={data.nguoiDaiDien_soHoChieu}
                />
                <p>
                    Ngày cấp: {formatDate(data.nguoiDaiDien_ngayCapHoChieu)}
                    &nbsp;&nbsp; Nơi cấp: {data.nguoiDaiDien_noiCapHoChieu || ""}
                </p>
                <Line label="Nơi thường trú" value={noiThuongTru} />

                <p style={{ marginTop: 16 }}>
                    Trường hợp hồ sơ đăng ký doanh nghiệp hợp lệ, đề nghị Quý Cơ quan đăng công bố nội dung đăng ký
                    doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.
                </p>
                <p>
                    Doanh nghiệp cam kết hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung
                    thực của nội dung Giấy đề nghị này.
                </p>

                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: 30, marginBottom: 50 }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "50%" }}></td>
                            <td className={styles.textCenter} style={{ verticalAlign: "top" }}>
                                <p>
                                    <strong>
                                        CHỦ TỊCH CÔNG TY/CHỦ TỊCH HỘI ĐỒNG THÀNH VIÊN/CHỦ TỊCH HỘI ĐỒNG QUẢN TRỊ/NGƯỜI
                                        ĐƯỢC ỦY QUYỀN/NGƯỜI ĐẠI DIỆN
                                    </strong>
                                    <br />(<em>Ký và ghi họ tên</em>)
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatConfirmation;
