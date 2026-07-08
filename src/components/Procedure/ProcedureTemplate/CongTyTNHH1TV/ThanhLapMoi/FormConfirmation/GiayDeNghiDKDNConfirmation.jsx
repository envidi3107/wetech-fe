import React from "react";
import styles from "./GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { formatDate } from "@/utils/dateTimeUtils";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const Checkbox = ({ checked }) => (
    <span
        className={styles.checkbox}
        style={{
            fontWeight: "inherit",
            fontStyle: "normal",
            fontSize: "var(--procedure-confirmation-checkbox-font-size, 18pt)",
            lineHeight: 1,
            margin: "0 3px",
            verticalAlign: "middle",
        }}
    >
        {"\u00A0"}
        {checked ? "\u2612" : "\u2610"}
        {"\u00A0"}
    </span>
);
const InlineField = ({ children }) => (
    <b
        className={styles.inlineField}
        style={{
            display: "inline-block",
            marginLeft: "36pt",
            fontWeight: "inherit",
            fontStyle: "normal",
        }}
    >
        {children}
    </b>
);

function GiayDeNghiDKDNConfirmation({ dataJson }) {
    if (!dataJson) {
        return <p className={styles.emptyMessage}>Đang tải dữ liệu...</p>;
    }

    const {
        kinhGui = "",
        nguoiNop_hoTen = "",
        nguoiNop_ngaySinh = "",
        nguoiNop_gioiTinh = "",
        nguoiNop_cccd = "",
        lienLac_soNha = "",
        lienLac_xa = "",
        lienLac_tinh = "",
        nguoiNop_phone = "",
        nguoiNop_email = "",

        nguoiNop_danToc = "",
        nguoiNop_quocTich = "",
        nguoiNop_soHoChieu = "",
        nguoiNop_ngayCapHoChieu = "",
        nguoiNop_noiCapHoChieu = "",
        nguoiNop_thuongTru_soNha = "",
        nguoiNop_thuongTru_xa = "",
        nguoiNop_thuongTru_tinh = "",
        nguoiNop_thuongTru_quocGia = "Việt Nam",

        tenCongTyVN = "",
        tenCongTyPrefix = DEFAULT_TNHH_COMPANY_NAME_PREFIX,
        tenCongTyEN = "",
        tenCongTyVietTat = "",

        truSo_soNha = "",
        truSo_xa = "",
        truSo_tinh = "",
        truSo_phone = "",
        truSo_fax = "",
        truSo_email = "",
        truSo_website = "",
        truSo_loaiKhu = "",
        truSo_anNinhQuocPhong = "Không",

        nganhNgheList = [],

        chuSoHuu_hoTen = "",
        chuSoHuu_ngaySinh = "",
        chuSoHuu_gioiTinh = "",
        chuSoHuu_cccd = "",
        chuSoHuu_soNha = "",
        chuSoHuu_xa = "",
        chuSoHuu_tinh = "",
        chuSoHuu_phone = "",
        chuSoHuu_email = "",

        chuSoHuu_danToc = "",
        chuSoHuu_quocTich = "",
        chuSoHuu_soHoChieu = "",
        chuSoHuu_ngayCapHoChieu = "",
        chuSoHuu_noiCapHoChieu = "",
        chuSoHuu_thuongTru_soNha = "",
        chuSoHuu_thuongTru_xa = "",
        chuSoHuu_thuongTru_tinh = "",
        chuSoHuu_thuongTru_quocGia = "Việt Nam",
        chuSoHuu_maSoDuAn = "",
        chuSoHuu_ngayCapDuAn = "",
        chuSoHuu_coQuanCapDuAn = "",

        vonDieuLe = "",
        vonDieuLe_bangChu = "",
        vonDieuLe_ngoaiTe = "",

        nguonVon_nganSach_soTien = "",
        nguonVon_nganSach_tyLe = "",
        nguonVon_tuNhan_soTien = "",
        nguonVon_tuNhan_tyLe = "",
        nguonVon_nuocNgoai_soTien = "",
        nguonVon_nuocNgoai_tyLe = "",
        nguonVon_khac_soTien = "",
        nguonVon_khac_tyLe = "",
        nguonVon_tongCong_soTien = "",
        nguonVon_tongCong_tyLe = "",

        taiSan_dongVN_giaTri = "",
        taiSan_dongVN_tyLe = "",
        taiSan_ngoaiTe_giaTri = "",
        taiSan_ngoaiTe_tyLe = "",
        taiSan_vang_giaTri = "",
        taiSan_vang_tyLe = "",
        taiSan_qsdDat_giaTri = "",
        taiSan_qsdDat_tyLe = "",
        taiSan_shtt_giaTri = "",
        taiSan_shtt_tyLe = "",
        taiSan_khac_loaiTaiSan = "",
        taiSan_khac_soLuong = "",
        taiSan_khac_giaTri = "",
        taiSan_khac_tyLe = "",
        taiSan_tongSo_giaTri = "",
        taiSan_tongSo_tyLe = "",

        nguoiDaiDien_hoTen = "",
        nguoiDaiDien_ngaySinh = "",
        nguoiDaiDien_gioiTinh = "",
        nguoiDaiDien_cccd = "",
        nguoiDaiDien_chucDanh = "",
        nguoiDaiDien_soNha = "",
        nguoiDaiDien_xa = "",
        nguoiDaiDien_tinh = "",

        nguoiDaiDien_danToc = "",
        nguoiDaiDien_quocTich = "",
        nguoiDaiDien_soHoChieu = "",
        nguoiDaiDien_ngayCapHoChieu = "",
        nguoiDaiDien_noiCapHoChieu = "",
        nguoiDaiDien_thuongTru_soNha = "",
        nguoiDaiDien_thuongTru_xa = "",
        nguoiDaiDien_thuongTru_tinh = "",
        nguoiDaiDien_thuongTru_quocGia = "Việt Nam",

        giamDoc_hoTen = "",
        giamDoc_ngaySinh = "",
        giamDoc_gioiTinh = "",
        giamDoc_cccd = "",
        giamDoc_phone = "",

        keToan_hoTen = "",
        keToan_ngaySinh = "",
        keToan_gioiTinh = "",
        keToan_cccd = "",
        keToan_phone = "",

        thongBaoThue_soNha = "",
        thongBaoThue_xa = "",
        thongBaoThue_tinh = "",
        thongBaoThue_phone = "",
        thongBaoThue_fax = "",
        thongBaoThue_email = "",
        ngayBatDauHoatDong = "",
        hinhThucHachToan = "doc_lap",
        baoCaoTaiChinhHopNhat = "",
        namTaiChinh_tuNgay = "01/01",
        namTaiChinh_denNgay = "31/12",
        tongSoLaoDong = "01",
        hoatDongDuAn = "khong",
        phuongPhapTinhThueGTGT = "khau_tru",
        phuongThucDongBHXH = "hang_thang",
        doanhNghiepCoCSHHuongLoi = "co",
        tinhTrangThanhLap = "moi",
    } = dataJson;
    const companyNamePrefix = getCompanyNamePrefix({ tenCongTyPrefix }, DEFAULT_TNHH_COMPANY_NAME_PREFIX);

    const addressToString = (soNha, xa, tinh) => {
        return [soNha, xa, tinh].filter(Boolean).join(", ");
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === "") return "";
        const str = value.toString().trim();
        const numStr = str.replace(/\./g, "").replace(/,/g, "");
        if (!isNaN(numStr) && numStr !== "") {
            return Number(numStr).toLocaleString("vi-VN");
        }
        return str;
    };

    const formatVND = (value) => {
        const formatted = formatCurrency(value);
        if (!formatted || formatted === "0") return formatted || "";
        return `${formatted} VNĐ`;
    };

    const formatPercent = (value) => {
        if (!value || value === "0" || value === 0) return value || "";
        return `${value}%`;
    };

    const isBlank = (value) =>
        value === null || value === undefined || (typeof value === "string" && value.trim() === "");

    const displayValue = (value) => (isBlank(value) ? "........" : value);

    const displayDate = (value) => displayValue(formatDate(value));

    const displayAddress = (...parts) => displayValue(addressToString(...parts));

    return (
        <div className={styles.container}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <p style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px", margin: 0 }}>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </p>
                <p style={{ fontWeight: "bold", textAlign: "center", fontSize: "18px", textDecoration: "underline", margin: "4px 0 18px" }}>
                    Độc lập - Tự do - Hạnh phúc
                </p>
                <p style={{ fontStyle: "italic", textAlign: "right", margin: "10px 0 0" }}>
                    <CurrentDate style={{ fontStyle: "italic" }} />
                </p>
            </div>
            <p style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px", margin: "0" }}>
                GIẤY ĐỀ NGHỊ ĐĂNG KÝ DOANH NGHIỆP
            </p>
            <p style={{ fontWeight: "bold", textAlign: "center", fontSize: "20px", margin: "8px 0 30px" }}>
                CÔNG TY TRÁCH NHIỆM HỮU HẠN MỘT THÀNH VIÊN
            </p>
            <div className={styles.content}>
                <p>Kính gửi: {displayValue(kinhGui)}</p>

                <p>
                    Tôi là (<em>ghi họ tên bằng chữ in hoa</em>):{" "}
                    {displayValue(nguoiNop_hoTen)}
                </p>
                <p>Ngày, tháng, năm sinh: {displayDate(nguoiNop_ngaySinh)}</p>
                <p>Giới tính: {displayValue(nguoiNop_gioiTinh)}</p>
                <p>Số định danh cá nhân: {displayValue(nguoiNop_cccd)}</p>
                <p>Địa chỉ liên lạc: {displayAddress(lienLac_soNha, lienLac_xa, lienLac_tinh)}</p>
                <p>
                    Điện thoại<em> (nếu có)</em>: {displayValue(nguoiNop_phone)}
                    {"    "}
                    <InlineField>
                        Thư điện tử<em> (nếu có)</em>: {displayValue(nguoiNop_email)}
                    </InlineField>
                </p>

                <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                    <em>
                        Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký
                        doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá
                        nhân dưới đây:
                    </em>
                </p>
                <table
                    className="single-border-table"
                    style={{ width: "100%", border: "1px solid #000" }}
                >
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    Dân tộc: {nguoiNop_danToc}
                                    <InlineField>Quốc tịch: {nguoiNop_quocTich}</InlineField>
                                </p>
                                <p>
                                    Số Hộ chiếu (<em>đối với cá nhân Việt Nam không có số định danh cá nhân</em>)/Số Hộ
                                    chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (
                                    <em>đối với cá nhân là người nước ngoài</em>): {nguoiNop_soHoChieu}
                                </p>
                                <p>
                                    Ngày cấp: {formatDate(nguoiNop_ngayCapHoChieu)}
                                    <InlineField>Nơi cấp: {nguoiNop_noiCapHoChieu}</InlineField>
                                </p>
                                <p>Nơi thường trú:</p>
                                <p>
                                    Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn:{" "}
                                    {nguoiNop_thuongTru_soNha}
                                </p>
                                <p>Xã/Phường/Đặc khu: {nguoiNop_thuongTru_xa}</p>
                                <p>Tỉnh/Thành phố trực thuộc trung ương: {nguoiNop_thuongTru_tinh}</p>
                                <p>Quốc gia: {nguoiNop_thuongTru_quocGia}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>
                        Đăng ký công ty trách nhiệm hữu hạn một thành viên do tôi là người đại diện theo pháp luật với
                        các nội dung sau:
                    </strong>
                </p>

                <p>
                    <strong>1. Tình trạng thành lập </strong>(<em>đánh dấu X vào ô thích hợp</em>):
                </p>
                <table className="single-border-table" style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thành lập mới
                                </p>
                            </td>
                            <td style={{ textAlign: "center", width: "40px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={tinhTrangThanhLap === "moi"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thành lập trên cơ sở tách doanh nghiệp
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={tinhTrangThanhLap === "tach"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thành lập trên cơ sở chia doanh nghiệp
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={tinhTrangThanhLap === "chia"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thành lập trên cơ sở hợp nhất doanh nghiệp
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={tinhTrangThanhLap === "hop_nhat"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thành lập trên cơ sở chuyển đổi loại hình doanh nghiệp
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={tinhTrangThanhLap === "chuyen_doi_loai_hinh"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thành lập trên cơ sở chuyển đổi từ hộ kinh doanh
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={tinhTrangThanhLap === "chuyen_doi_hkd"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thành lập trên cơ sở chuyển đổi từ cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={tinhTrangThanhLap === "chuyen_doi_quy"} />
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>2. Tên công ty:</strong>
                </p>
                <p>
                    Tên công ty viết bằng tiếng Việt (<em>ghi bằng chữ in hoa</em>): {companyNamePrefix}{" "}
                    <b
                        style={{
                            textTransform: "uppercase",
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {displayValue(tenCongTyVN)}
                    </b>
                </p>
                <p>
                    Tên công ty viết bằng tiếng nước ngoài (<em>nếu có</em>): {displayValue(tenCongTyEN)}
                </p>
                <p>
                    Tên công ty viết tắt (<em>nếu có</em>): {displayValue(tenCongTyVietTat)}
                </p>

                <p style={{ marginTop: "16px" }}>
                    <strong>3. Địa chỉ trụ sở chính:</strong>
                </p>
                <p>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {displayValue(truSo_soNha)}</p>
                <p>Xã/Phường/Đặc khu: {displayValue(truSo_xa)}</p>
                <p>Tỉnh/Thành phố trực thuộc trung ương: {displayValue(truSo_tinh)}</p>
                <p>
                    Điện thoại: {displayValue(truSo_phone)}
                    {"    "}
                    <InlineField>
                        Số fax (<em>nếu có</em>): {displayValue(truSo_fax)}
                    </InlineField>
                </p>
                <p>
                    Thư điện tử (<em>nếu có</em>): {displayValue(truSo_email)}
                    {"    "}
                    <InlineField>
                        Website (<em>nếu có</em>): {displayValue(truSo_website)}
                    </InlineField>
                </p>

                <p style={{ marginTop: "8px" }}>
                    - Doanh nghiệp nằm trong (
                    <em>
                        Doanh nghiệp phải đánh dấu X vào ô vuông tương ứng với khu công nghệ cao nếu nộp hồ sơ tới Ban
                        quản lý khu công nghệ cao
                    </em>
                    ):
                </p>
                <table className="single-border-table" style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Khu công nghiệp
                                </p>
                            </td>
                            <td style={{ textAlign: "center", width: "40px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={truSo_loaiKhu === "Khu công nghiệp"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Khu chế xuất
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={truSo_loaiKhu === "Khu chế xuất"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Khu kinh tế
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={truSo_loaiKhu === "Khu kinh tế"} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Khu công nghệ cao
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={truSo_loaiKhu === "Khu công nghệ cao"} />
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p style={{ marginTop: "8px" }}>
                    - Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo và xã, phường biên giới; xã, phường ven
                    biển; khu vực khác có ảnh hưởng đến quốc phòng, an ninh: Có
                    <Checkbox checked={truSo_anNinhQuocPhong === "Có"} />
                    <b
                        style={{
                            marginLeft: "20px",
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    ></b>
                    Không <Checkbox checked={truSo_anNinhQuocPhong === "Không" || !truSo_anNinhQuocPhong} />
                </p>

                <p style={{ marginTop: "16px" }}>
                    <strong>4. Ngành, nghề kinh doanh </strong>(
                    <em>ghi tên và mã theo ngành cấp 4 trong Hệ thống ngành kinh tế của Việt Nam</em>):
                </p>
                <table className="single-border-table" style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>STT</strong>
                                </p>
                            </th>
                            <th style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>Tên ngành</strong>
                                </p>
                            </th>
                            <th style={{ width: "100px", textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>Mã ngành</strong>
                                </p>
                            </th>
                            <th style={{ width: "150px", textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>
                                        Ngành, nghề kinh doanh chính (
                                        <em>đánh dấu X để chọn một trong các ngành, nghề đã kê khai</em>)
                                    </strong>
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(nganhNgheList || []).length > 0 ? (
                            nganhNgheList.map((nganh, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {index + 1}
                                        </p>
                                    </td>
                                    <td>
                                        <p style={{ margin: 0 }}>{nganh.tenNganh}</p>
                                        {nganh.chiTiet && (
                                            <p
                                                style={{
                                                    margin: 0,
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                    fontFamily: "inherit",
                                                    fontSize: "inherit",
                                                }}
                                            >
                                                {nganh.chiTiet}
                                            </p>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {nganh.maNganh}
                                        </p>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {nganh.laNganhChinh ? "x" : ""}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td style={{ textAlign: "center" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        1
                                    </p>
                                </td>
                                <td>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        ................................................
                                    </p>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>5. Chủ sở hữu:</strong>
                </p>
                <p style={{ fontStyle: "italic" }}>
                    <strong>a) Đối với chủ sở hữu là cá nhân:</strong>
                </p>
                <p>- Thông tin về chủ sở hữu:</p>
                <p>
                    Họ, chữ đệm và tên (<em>ghi bằng chữ in hoa</em>):{" "}
                    <b
                        style={{
                            textTransform: "uppercase",
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {displayValue(chuSoHuu_hoTen)}
                    </b>
                </p>
                <p>Ngày, tháng, năm sinh: {displayDate(chuSoHuu_ngaySinh)}</p>
                <p>Giới tính: {displayValue(chuSoHuu_gioiTinh)}</p>
                <p>Số định danh cá nhân: {displayValue(chuSoHuu_cccd)}</p>
                <p>Địa chỉ liên lạc: {displayAddress(chuSoHuu_soNha, chuSoHuu_xa, chuSoHuu_tinh)}</p>
                <p>
                    Điện thoại<em> (nếu có)</em>: {displayValue(chuSoHuu_phone)}
                    {"    "}
                    <InlineField>
                        Thư điện tử<em> (nếu có)</em>: {displayValue(chuSoHuu_email)}
                    </InlineField>
                </p>

                <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                    <em>
                        Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký
                        doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá
                        nhân dưới đây:
                    </em>
                </p>
                <table className="single-border-table" style={{ width: "100%" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    Dân tộc: {chuSoHuu_danToc}
                                    <InlineField>Quốc tịch: {chuSoHuu_quocTich}</InlineField>
                                </p>
                                <p>
                                    Số Hộ chiếu (<em>đối với cá nhân Việt Nam không có số định danh cá nhân</em>)/Số Hộ
                                    chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (
                                    <em>đối với cá nhân là người nước ngoài</em>): {chuSoHuu_soHoChieu}
                                </p>
                                <p>
                                    Ngày cấp: {formatDate(chuSoHuu_ngayCapHoChieu)}
                                    {"    "}
                                    <InlineField>Nơi cấp: {chuSoHuu_noiCapHoChieu}</InlineField>
                                </p>
                                <p>Nơi thường trú:</p>
                                <p>
                                    Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn:{" "}
                                    {chuSoHuu_thuongTru_soNha}
                                </p>
                                <p>Xã/Phường/Đặc khu: {chuSoHuu_thuongTru_xa}</p>
                                <p>Tỉnh/Thành phố trực thuộc trung ương: {chuSoHuu_thuongTru_tinh}</p>
                                <p>Quốc gia: {chuSoHuu_thuongTru_quocGia}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    - Thông tin về Giấy chứng nhận đăng ký đầu tư (
                    <em>chỉ kê khai nếu chủ sở hữu là nhà đầu tư nước ngoài</em>):
                </p>
                <p>Mã số dự án: {displayValue(chuSoHuu_maSoDuAn)}</p>
                <p>
                    Ngày cấp: {displayDate(chuSoHuu_ngayCapDuAn)}
                    <InlineField>Cơ quan cấp: {displayValue(chuSoHuu_coQuanCapDuAn)}</InlineField>
                </p>

                <p style={{ marginTop: "16px" }}>
                    <strong>6. Vốn điều lệ:</strong>
                </p>
                <p>
                    Vốn điều lệ (<em>bằng số; VNĐ</em>): {displayValue(vonDieuLe)} VNĐ
                </p>
                <p>
                    Vốn điều lệ (<em>bằng chữ; VNĐ</em>):{" "}
                    <b
                        style={{
                            fontStyle: "italic",
                            fontWeight: "inherit",
                        }}
                    >
                        {displayValue(vonDieuLe_bangChu)}
                    </b>
                </p>
                <p>
                    Giá trị tương đương theo đơn vị tiền nước ngoài (<em>nếu có, bằng số, loại ngoại tệ</em>):{" "}
                    {displayValue(vonDieuLe_ngoaiTe)}
                </p>
                <p style={{ marginBottom: 0 }}>
                    Có hiển thị thông tin về giá trị tương đương theo đơn vị tiền tệ nước ngoài trên Giấy chứng nhận
                    đăng ký doanh nghiệp hay không?
                </p>
                <table
                    className="no-border docx-contained-table docx-choice-table"
                    style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginTop: "2px" }}
                >
                    <tbody>
                        <tr>
                            <td style={{ border: "none", width: "20%" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Có <Checkbox checked={false} />
                                </p>
                            </td>
                            <td style={{ border: "none", width: "80%" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Không <Checkbox checked={true} />
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>7. Nguồn vốn điều lệ:</strong>
                </p>
                <table className="single-border-table" style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>Loại nguồn vốn</strong>
                                </p>
                            </th>
                            <th style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>
                                        Số tiền (
                                        <em>bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài, nếu có</em>
                                        )
                                    </strong>
                                </p>
                            </th>
                            <th style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>
                                        Tỷ lệ (<em>%</em>)
                                    </strong>
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Vốn ngân sách nhà nước
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(nguonVon_nganSach_soTien)}
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(nguonVon_nganSach_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Vốn tư nhân
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(nguonVon_tuNhan_soTien)}
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(nguonVon_tuNhan_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Vốn nước ngoài
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(nguonVon_nuocNgoai_soTien)}
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(nguonVon_nuocNgoai_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Vốn khác
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(nguonVon_khac_soTien)}
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(nguonVon_khac_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tổng cộng
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(nguonVon_tongCong_soTien)}
                                </p>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(nguonVon_tongCong_tyLe)}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>8. Tài sản góp vốn:</strong>
                </p>
                <table className="single-border-table" style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th className={styles.textCenter} style={{ width: "50px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>STT</strong>
                                </p>
                            </th>
                            <th className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>Tài sản góp vốn</strong>
                                </p>
                            </th>
                            <th className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>
                                        Giá trị vốn của từng tài sản trong vốn điều lệ (<em>bằng số, VNĐ</em>)
                                    </strong>
                                </p>
                            </th>
                            <th className={styles.textCenter} style={{ width: "100px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <strong>
                                        Tỷ lệ (<em>%</em>)
                                    </strong>
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    1
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Đồng Việt Nam
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(taiSan_dongVN_giaTri)}
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(taiSan_dongVN_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    2
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ngoại tệ tự do chuyển đổi (
                                    <em>ghi rõ loại ngoại tệ, số tiền được góp bằng mỗi loại ngoại tệ</em>)
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(taiSan_ngoaiTe_giaTri)}
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(taiSan_ngoaiTe_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    3
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Vàng
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(taiSan_vang_giaTri)}
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(taiSan_vang_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    4
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Quyền sử dụng đất
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(taiSan_qsdDat_giaTri)}
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(taiSan_qsdDat_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    5
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Quyền sở hữu trí tuệ
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(taiSan_shtt_giaTri)}
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(taiSan_shtt_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    6
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Các tài sản khác (
                                    <em>
                                        ghi rõ loại tài sản, số lượng và giá trị còn lại của mỗi loại tài sản, có thể
                                        lập thành danh mục riêng kèm theo hồ sơ đăng ký doanh nghiệp
                                    </em>
                                    )
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {taiSan_khac_loaiTaiSan && (
                                        <p style={{ fontSize: "0.9em" }}>Loại tài sản: {taiSan_khac_loaiTaiSan}</p>
                                    )}
                                    {taiSan_khac_soLuong && (
                                        <p style={{ fontSize: "0.9em" }}>Số lượng: {taiSan_khac_soLuong}</p>
                                    )}
                                    {formatVND(taiSan_khac_giaTri)}
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(taiSan_khac_tyLe)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Tổng số
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatVND(taiSan_tongSo_giaTri)}
                                </p>
                            </td>
                            <td className={styles.textCenter}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    {formatPercent(taiSan_tongSo_tyLe)}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>9. Người đại diện theo pháp luật:</strong>
                </p>
                <p>
                    Họ, chữ đệm và tên (<em>ghi bằng chữ in hoa</em>):{" "}
                    <b
                        style={{
                            textTransform: "uppercase",
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {displayValue(nguoiDaiDien_hoTen)}
                    </b>
                </p>
                <p>Ngày, tháng, năm sinh: {displayDate(nguoiDaiDien_ngaySinh)}</p>
                <p>Giới tính: {displayValue(nguoiDaiDien_gioiTinh)}</p>
                <p>Số định danh cá nhân: {displayValue(nguoiDaiDien_cccd)}</p>
                <p>Chức danh: {displayValue(nguoiDaiDien_chucDanh)}</p>
                <p>Địa chỉ liên lạc: {displayAddress(nguoiDaiDien_soNha, nguoiDaiDien_xa, nguoiDaiDien_tinh)}</p>

                <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                    <em>
                        Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký
                        doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá
                        nhân dưới đây:
                    </em>
                </p>
                <table className="single-border-table" style={{ width: "100%" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    Dân tộc: {nguoiDaiDien_danToc}
                                    {"    "}
                                    <InlineField>Quốc tịch: {nguoiDaiDien_quocTich}</InlineField>
                                </p>
                                <p>
                                    Số Hộ chiếu (<em>đối với cá nhân Việt Nam không có số định danh cá nhân</em>)/Số Hộ
                                    chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (
                                    <em>đối với cá nhân là người nước ngoài</em>): {nguoiDaiDien_soHoChieu}
                                </p>
                                <p>
                                    Ngày cấp: {nguoiDaiDien_ngayCapHoChieu}
                                    {"    "}
                                    <InlineField>Nơi cấp: {nguoiDaiDien_noiCapHoChieu}</InlineField>
                                </p>
                                <p>Nơi thường trú:</p>
                                <p>
                                    Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn:{" "}
                                    {nguoiDaiDien_thuongTru_soNha}
                                </p>
                                <p>Xã/Phường/Đặc khu: {nguoiDaiDien_thuongTru_xa}</p>
                                <p>Tỉnh/Thành phố trực thuộc trung ương: {nguoiDaiDien_thuongTru_tinh}</p>
                                <p>Quốc gia: {nguoiDaiDien_thuongTru_quocGia}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>10. Thông tin đăng ký thuế:</strong>
                </p>
                <table className="single-border-table" style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>
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
                            <th style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Các chỉ tiêu thông tin đăng ký thuế
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.1
                                </p>
                            </td>
                            <td>
                                <p>
                                    Thông tin về Giám đốc/Tổng giám đốc <em>(nếu có)</em>:
                                </p>
                                <p>Họ, chữ đệm và tên Giám đốc/Tổng giám đốc: {giamDoc_hoTen}</p>
                                <p>Ngày, tháng, năm sinh: {formatDate(giamDoc_ngaySinh)}</p>
                                <p>Giới tính: {giamDoc_gioiTinh}</p>
                                <p>Số định danh cá nhân: {giamDoc_cccd}</p>
                                <p>Điện thoại: {giamDoc_phone}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.2
                                </p>
                            </td>
                            <td>
                                <p>
                                    Thông tin về Kế toán trưởng/Phụ trách kế toán <em>(nếu có)</em>:
                                </p>
                                <p>Họ, chữ đệm và tên Kế toán trưởng/Phụ trách kế toán: {keToan_hoTen}</p>
                                <p>Ngày, tháng, năm sinh: {formatDate(keToan_ngaySinh)}</p>
                                <p>Giới tính: {keToan_gioiTinh}</p>
                                <p>Số định danh cá nhân: {keToan_cccd}</p>
                                <p>Điện thoại: {keToan_phone}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.3
                                </p>
                            </td>
                            <td>
                                <p>
                                    Địa chỉ nhận thông báo thuế (
                                    <em>chỉ kê khai nếu địa chỉ nhận thông báo thuế khác địa chỉ trụ sở chính</em>):
                                </p>
                                <p>
                                    Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn:{" "}
                                    {thongBaoThue_soNha}
                                </p>
                                <p>Xã/Phường/Đặc khu: {thongBaoThue_xa}</p>
                                <p>Tỉnh/Thành phố trực thuộc trung ương: {thongBaoThue_tinh}</p>
                                <p>
                                    Điện thoại (<em>nếu có</em>): {thongBaoThue_phone}
                                    {"    "}
                                    <InlineField>
                                        Số fax (<em>nếu có</em>): {thongBaoThue_fax}
                                    </InlineField>
                                </p>
                                <p>
                                    Thư điện tử (<em>nếu có</em>): {thongBaoThue_email}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.4
                                </p>
                            </td>
                            <td>
                                <p>
                                    Ngày bắt đầu hoạt động (
                                    <em>
                                        trường hợp doanh nghiệp dự kiến bắt đầu hoạt động kể từ ngày được cấp Giấy chứng
                                        nhận đăng ký doanh nghiệp thì không cần kê khai nội dung này
                                    </em>
                                    ): {formatDate(ngayBatDauHoatDong)}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.5
                                </p>
                            </td>
                            <td>
                                <p>
                                    Hình thức hạch toán (
                                    <em>
                                        Đánh dấu X vào một trong hai ô “Hạch toán độc lập” hoặc “Hạch toán phụ thuộc”.
                                        Trường hợp chọn ô “Hạch toán độc lập” mà thuộc đối tượng phải lập và gửi báo cáo
                                        tài chính hợp nhất cho cơ quan có thẩm quyền theo quy định thì chọn thêm ô “Có
                                        báo cáo tài chính hợp nhất”
                                    </em>
                                    ):{" "}
                                </p>
                                <table
                                    className="no-border docx-contained-table docx-choice-table"
                                    style={{ width: "100%", marginTop: "4px", tableLayout: "fixed", borderCollapse: "collapse" }}
                                >
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "50%", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Hạch toán độc lập{" "}
                                                    <Checkbox checked={hinhThucHachToan === "doc_lap"} />
                                                </p>
                                            </td>
                                            <td style={{ width: "50%", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Có báo cáo tài chính hợp nhất{" "}
                                                    <Checkbox checked={baoCaoTaiChinhHopNhat === "co"} />
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Hạch toán phụ thuộc{" "}
                                                    <Checkbox checked={hinhThucHachToan === "phu_thuoc"} />
                                                </p>
                                            </td>
                                            <td style={{ border: "none" }}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.6
                                </p>
                            </td>
                            <td>
                                <p>Năm tài chính:</p>
                                <p>
                                    Áp dụng từ ngày {namTaiChinh_tuNgay} đến ngày {namTaiChinh_denNgay}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.7
                                </p>
                            </td>
                            <td>
                                <p>
                                    Tổng số lao động (<em>dự kiến</em>): {tongSoLaoDong}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.8
                                </p>
                            </td>
                            <td>
                                <p>Hoạt động theo dự án BOT/BTO/BT/BOO, BLT, BTL, O&M:</p>
                                <table
                                    className="no-border docx-contained-table docx-choice-table"
                                    style={{ width: "100%", marginTop: "4px", tableLayout: "fixed", borderCollapse: "collapse" }}
                                >
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "50%", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Có <Checkbox checked={hoatDongDuAn === "co"} />
                                                </p>
                                            </td>
                                            <td style={{ width: "50%", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Không <Checkbox checked={hoatDongDuAn === "khong"} />
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    10.9
                                </p>
                            </td>
                            <td>
                                <p>
                                    Phương pháp tính thuế GTGT (<em>chọn 1 trong 4 phương pháp</em>):
                                </p>
                                <table
                                    className="no-border docx-contained-table docx-choice-table"
                                    style={{ width: "100%", marginTop: "4px", tableLayout: "fixed", borderCollapse: "collapse" }}
                                >
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "80%", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Khấu trừ
                                                </p>
                                            </td>
                                            <td style={{ width: "20%", textAlign: "center", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    <Checkbox checked={phuongPhapTinhThueGTGT === "khau_tru"} />
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Trực tiếp trên GTGT
                                                </p>
                                            </td>
                                            <td style={{ textAlign: "center", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    <Checkbox checked={phuongPhapTinhThueGTGT === "truc_tiep_gtgt"} />
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Trực tiếp trên doanh số
                                                </p>
                                            </td>
                                            <td style={{ textAlign: "center", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={phuongPhapTinhThueGTGT === "truc_tiep_doanh_so"}
                                                    />
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Không phải nộp thuế GTGT
                                                </p>
                                            </td>
                                            <td style={{ textAlign: "center", border: "none" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    <Checkbox checked={phuongPhapTinhThueGTGT === "khong_nop"} />
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>11. Thông tin về việc đóng bảo hiểm xã hội:</strong>
                </p>
                <p>
                    Phương thức đóng bảo hiểm xã hội (<em>chọn 1 trong 3 phương thức</em>):
                </p>
                <table className="no-border" style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={phuongThucDongBHXH === "hang_thang"} />
                                    Hàng tháng
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={phuongThucDongBHXH === "3_thang"} />
                                    03 tháng một lần
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Checkbox checked={phuongThucDongBHXH === "6_thang"} />
                                    06 tháng một lần
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>12. Thông tin về chủ sở hữu hưởng lợi của doanh nghiệp:</strong>
                </p>
                <p>Doanh nghiệp có chủ sở hữu hưởng lợi không?</p>
                <table className="no-border" style={{ width: "100%", maxWidth: "360px", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "50%" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Có
                                    <Checkbox checked={doanhNghiepCoCSHHuongLoi === "co"} />
                                </p>
                            </td>
                            <td style={{ width: "50%" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Không
                                    <Checkbox checked={doanhNghiepCoCSHHuongLoi === "khong"} />
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    Trường hợp hồ sơ đăng ký doanh nghiệp hợp lệ, đề nghị Quý Cơ quan đăng công bố nội dung đăng ký
                    doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.
                </p>

                <p style={{ marginTop: "16px" }}>Tôi cam kết:</p>
                <p style={{ marginLeft: "10px" }}>
                    - Là người có đầy đủ quyền và nghĩa vụ thực hiện thủ tục đăng ký doanh nghiệp theo quy định của pháp
                    luật và Điều lệ công ty;
                </p>
                <p style={{ marginLeft: "10px" }}>
                    - Trụ sở chính thuộc quyền sử dụng hợp pháp của công ty và được sử dụng đúng mục đích theo quy định
                    của pháp luật;
                </p>
                <p style={{ marginLeft: "10px" }}>
                    - Chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung thực của nội dung đăng ký
                    doanh nghiệp trên.
                </p>

                <table
                    className="signature-table no-border"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "none",
                        marginTop: "30px",
                        marginBottom: "50px",
                    }}
                >
                    <tbody>
                        <tr>
                            <td
                                className="signature-spacer"
                                style={{
                                    border: "none",
                                    width: "40%",
                                    textAlign: "center",
                                    verticalAlign: "top",
                                }}
                            ></td>
                            <td
                                className="signature-cell"
                                style={{
                                    border: "none",
                                    textAlign: "center",
                                    verticalAlign: "top",
                                    width: "120mm",
                                }}
                            >
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    <strong>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT CỦA CÔNG TY</strong>
                                </p>
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    <em>(Ký và ghi họ tên)</em>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GiayDeNghiDKDNConfirmation;
