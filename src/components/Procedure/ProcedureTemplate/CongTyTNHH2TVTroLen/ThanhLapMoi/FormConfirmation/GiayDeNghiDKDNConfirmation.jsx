import React, { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateTimeUtils";
// Reuse styles
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { useGetFormDataJsonFromName, useProcessProcedure } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import { authAxios } from "@/services/axios-instance";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const Checkbox = ({ checked }) => (
    <i
        className={styles.checkbox}
        style={{
            fontWeight: "inherit",
            fontStyle: "normal",
        }}
    >
        {checked ? "x" : ""}
    </i>
);

function GiayDeNghiDKDNConfirmation({ dataJson }) {
    const thanhVienList = useGetFormDataJsonFromName("Danh sách thành viên")?.thanhVienList || [];

    if (!dataJson) return null;

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

        vonDieuLe = "",
        vonDieuLe_bangChu = "",
        vonDieuLe_ngoaiTe = "",

        nguonVon_nganSach_soTien = "",
        nguonVon_nganSach_ngoaiTe = "",
        nguonVon_nganSach_tyLe = "",
        nguonVon_tuNhan_soTien = "",
        nguonVon_tuNhan_ngoaiTe = "",
        nguonVon_tuNhan_tyLe = "",
        nguonVon_nuocNgoai_soTien = "",
        nguonVon_nuocNgoai_ngoaiTe = "",
        nguonVon_nuocNgoai_tyLe = "",
        nguonVon_khac_soTien = "",
        nguonVon_khac_ngoaiTe = "",
        nguonVon_khac_tyLe = "",
        nguonVon_tongCong_soTien = "",
        nguonVon_tongCong_tyLe = "",

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

    const formatVNDWithForeign = (vnd, foreign) => {
        let result = formatVND(vnd);
        if (foreign && foreign !== "0") {
            result += ` (Tương đương: ${foreign})`;
        }
        return result;
    };

    const formatPercent = (value) => {
        if (!value || value === "0" || value === 0) return value || "";
        return `${value}%`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.nationTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
                <p className={styles.dateRight} style={{ fontStyle: "italic" }}>
                    <CurrentDate />
                </p>
            </div>
            <h2 className={styles.docTitle}>GIẤY ĐỀ NGHỊ ĐĂNG KÝ DOANH NGHIỆP</h2>
            <h3 className={styles.docTitle}>CÔNG TY TRÁCH NHIỆM HỮU HẠN HAI THÀNH VIÊN TRỞ LÊN</h3>
            <div className={styles.content}>
                <p>Kính gửi: {kinhGui}</p>

                <p>
                    Tôi là (<em>ghi họ tên bằng chữ in hoa</em>):{" "}
                    <b
                        style={{
                            textTransform: "uppercase",
                            fontWeight: "inherit",
                            fontStyle: "normal",
                        }}
                    >
                        {nguoiNop_hoTen}
                    </b>
                </p>
                <p>Ngày, tháng, năm sinh: {formatDate(nguoiNop_ngaySinh)}</p>
                <p>Giới tính: {nguoiNop_gioiTinh}</p>
                <p>Số định danh cá nhân: {nguoiNop_cccd}</p>
                <p>Địa chỉ liên lạc: {addressToString(lienLac_soNha, lienLac_xa, lienLac_tinh)}</p>
                <p>
                    Điện thoại<em> (nếu có)</em>: {nguoiNop_phone} &nbsp; &nbsp; Thư điện tử<em> (nếu có)</em>:{" "}
                    {nguoiNop_email}
                </p>

                <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                    Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký
                    doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá
                    nhân dưới đây:
                </p>
                <table className={styles.borderTable} style={{ width: "calc(100% - 20px)" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    Dân tộc: {nguoiNop_danToc} &nbsp; &nbsp; Quốc tịch: {nguoiNop_quocTich}
                                </p>
                                <p>
                                    Số Hộ chiếu (<em>đối với cá nhân Việt Nam không có số định danh cá nhân</em>)/Số Hộ
                                    chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (
                                    <em>đối với cá nhân là người nước ngoài</em>): {nguoiNop_soHoChieu}
                                </p>
                                <p>
                                    Ngày cấp: {formatDate(nguoiNop_ngayCapHoChieu)} &nbsp; &nbsp; Nơi cấp:{" "}
                                    {nguoiNop_noiCapHoChieu}
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
                        Đăng ký công ty trách nhiệm hữu hạn hai thành viên trở lên do tôi là người đại diện theo pháp
                        luật với các nội dung sau:
                    </strong>
                </p>

                <p>
                    <strong>1. Tình trạng thành lập </strong>(<em>đánh dấu X vào ô thích hợp</em>):
                </p>
                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "8px" }}>
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
                        {tenCongTyVN}
                    </b>
                </p>
                <p>
                    Tên công ty viết bằng tiếng nước ngoài (<em>nếu có</em>): {tenCongTyEN}
                </p>
                <p>
                    Tên công ty viết tắt (<em>nếu có</em>): {tenCongTyVietTat}
                </p>

                <p style={{ marginTop: "16px" }}>
                    <strong>3. Địa chỉ trụ sở chính:</strong>
                </p>
                <p>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {truSo_soNha}</p>
                <p>Xã/Phường/Đặc khu: {truSo_xa}</p>
                <p>Tỉnh/Thành phố trực thuộc trung ương: {truSo_tinh}</p>
                <p>
                    Điện thoại: {truSo_phone} &nbsp; &nbsp; Số fax (<em>nếu có</em>): {truSo_fax}
                </p>
                <p>
                    Thư điện tử (<em>nếu có</em>): {truSo_email} &nbsp; &nbsp; Website (<em>nếu có</em>):{" "}
                    {truSo_website}
                </p>

                <p style={{ marginTop: "8px" }}>
                    - Doanh nghiệp nằm trong (
                    <em>
                        Doanh nghiệp phải đánh dấu X vào ô vuông tương ứng với khu công nghệ cao nếu nộp hồ sơ tới Ban
                        quản lý khu công nghệ cao
                    </em>
                    ):
                </p>
                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "8px" }}>
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
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
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
                                <td colSpan="4" style={{ textAlign: "center" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        <i>Không có</i>
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>5. Vốn điều lệ:</strong>
                </p>
                <p>
                    Vốn điều lệ (<em>bằng số; VNĐ</em>): {vonDieuLe} VNĐ
                </p>
                <p>
                    Vốn điều lệ (<em>bằng chữ; VNĐ</em>):{" "}
                    <b
                        style={{
                            fontStyle: "italic",
                            fontWeight: "inherit",
                        }}
                    >
                        {vonDieuLe_bangChu}
                    </b>
                </p>
                <p>
                    Giá trị tương đương theo đơn vị tiền nước ngoài (<em>nếu có, bằng số, loại ngoại tệ</em>):{" "}
                    {vonDieuLe_ngoaiTe}
                </p>
                <p>
                    Có hiển thị thông tin về giá trị tương đương theo đơn vị tiền tệ nước ngoài trên Giấy chứng nhận
                    đăng ký doanh nghiệp hay không? Có <Checkbox checked={false} /> Không <Checkbox checked={true} />
                </p>

                <p style={{ marginTop: "16px" }}>
                    <strong>6. Nguồn vốn điều lệ:</strong>
                </p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
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
                                    {formatVNDWithForeign(nguonVon_nganSach_soTien, nguonVon_nganSach_ngoaiTe)}
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
                                    {formatVNDWithForeign(nguonVon_tuNhan_soTien, nguonVon_tuNhan_ngoaiTe)}
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
                                    {formatVNDWithForeign(nguonVon_nuocNgoai_soTien, nguonVon_nuocNgoai_ngoaiTe)}
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
                                    {formatVNDWithForeign(nguonVon_khac_soTien, nguonVon_khac_ngoaiTe)}
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
                    <strong>7. Danh sách thành viên:</strong>
                </p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px", fontSize: "13px" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center", width: "40px" }}>
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
                                    Tên thành viên
                                </p>
                            </th>
                            <th style={{ textAlign: "center", width: "110px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ngày sinh
                                </p>
                            </th>
                            <th style={{ textAlign: "center", width: "70px" }}>
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
                            <th style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Giấy tờ pháp lý
                                </p>
                            </th>
                            <th style={{ textAlign: "center", width: "90px" }}>
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
                            <th style={{ textAlign: "center" }}>
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
                            <th style={{ textAlign: "center", width: "110px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Phần vốn góp
                                </p>
                            </th>
                            <th style={{ textAlign: "center", width: "60px" }}>
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
                            <th style={{ textAlign: "center", width: "100px" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Thời hạn góp vốn
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {thanhVienList.length > 0 ? (
                            thanhVienList.map((tv, idx) => (
                                <tr key={idx}>
                                    <td style={{ textAlign: "center" }}>
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
                                    <td>
                                        <p
                                            style={{
                                                margin: 0,
                                                lineHeight: "inherit",
                                                textAlign: "inherit",
                                                font: "inherit",
                                            }}
                                        >
                                            {tv.hoTen}
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
                                            {formatDate(tv.ngaySinh)}
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
                                            {tv.gioiTinh}
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
                                            {tv.giaTo}
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
                                            {tv.quocTich}
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
                                            {tv.diaChiLienLac}
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
                                            {tv.phanVonGop ? formatVND(tv.phanVonGop) : ""}
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
                                            {tv.tyLe ? tv.tyLe + "%" : ""}
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
                                            {tv.thoiHan}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        <i>Chưa có dữ liệu thành viên</i>
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>8. Người đại diện theo pháp luật:</strong>
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
                        {nguoiDaiDien_hoTen}
                    </b>
                </p>
                <p>Ngày, tháng, năm sinh: {formatDate(nguoiDaiDien_ngaySinh)}</p>
                <p>Giới tính: {nguoiDaiDien_gioiTinh}</p>
                <p>Số định danh cá nhân: {nguoiDaiDien_cccd}</p>
                <p>Chức danh: {nguoiDaiDien_chucDanh}</p>
                <p>Địa chỉ liên lạc: {addressToString(nguoiDaiDien_soNha, nguoiDaiDien_xa, nguoiDaiDien_tinh)}</p>

                <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                    Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký
                    doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá
                    nhân dưới đây:
                </p>
                <table className={styles.borderTable} style={{ width: "calc(100% - 20px)" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    Dân tộc: {nguoiDaiDien_danToc} &nbsp; &nbsp; Quốc tịch: {nguoiDaiDien_quocTich}
                                </p>
                                <p>
                                    Số Hộ chiếu (<em>đối với cá nhân Việt Nam không có số định danh cá nhân</em>)/Số Hộ
                                    chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (
                                    <em>đối với cá nhân là người nước ngoài</em>): {nguoiDaiDien_soHoChieu}
                                </p>
                                <p>
                                    Ngày cấp: {formatDate(nguoiDaiDien_ngayCapHoChieu)} &nbsp; &nbsp; Nơi cấp:{" "}
                                    {nguoiDaiDien_noiCapHoChieu}
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
                    <strong>9. Thông tin đăng ký thuế:</strong>
                </p>
                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "8px" }}>
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
                            <th colSpan="2" style={{ textAlign: "center" }}>
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
                                    9.1
                                </p>
                            </td>
                            <td colSpan="2">
                                <p>
                                    Thông tin về Giám đốc/Tổng giám đốc <em>(nếu có)</em>:
                                </p>
                                <p>Họ, chữ đệm và tên Giám đốc/Tổng giám đốc: {giamDoc_hoTen?.toUpperCase()}</p>
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
                                    9.2
                                </p>
                            </td>
                            <td colSpan="2">
                                <p>
                                    Thông tin về Kế toán trưởng/Phụ trách kế toán <em>(nếu có)</em>:
                                </p>
                                <p>
                                    Họ, chữ đệm và tên Kế toán trưởng/Phụ trách kế toán: {keToan_hoTen?.toUpperCase()}
                                </p>
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
                                    9.3
                                </p>
                            </td>
                            <td colSpan="2">
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
                                    Điện thoại (<em>nếu có</em>): {thongBaoThue_phone} &nbsp; &nbsp; Số fax (
                                    <em>nếu có</em>): {thongBaoThue_fax}
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
                                    9.4
                                </p>
                            </td>
                            <td colSpan="2">
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
                                    9.5
                                </p>
                            </td>
                            <td colSpan="2">
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
                                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "4px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Hạch toán độc lập
                                                </p>
                                            </td>
                                            <td style={{ width: "40px", textAlign: "center" }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    <Checkbox checked={hinhThucHachToan === "doc_lap"} />
                                                </p>
                                            </td>
                                            <td style={{ width: "30px" }}></td>
                                            <td>
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
                                            <td>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        lineHeight: "inherit",
                                                        textAlign: "inherit",
                                                        font: "inherit",
                                                    }}
                                                >
                                                    Hạch toán phụ thuộc
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
                                                    <Checkbox checked={hinhThucHachToan === "phu_thuoc"} />
                                                </p>
                                            </td>
                                            <td></td>
                                            <td></td>
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
                                    9.6
                                </p>
                            </td>
                            <td colSpan="2">
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
                                    9.7
                                </p>
                            </td>
                            <td colSpan="2">
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
                                    9.8
                                </p>
                            </td>
                            <td colSpan="2">
                                <p>Hoạt động theo dự án BOT/BTO/BT/BOO, BLT, BTL, O&M:</p>
                                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "4px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "100px" }}>
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
                                            <td>
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
                                    9.9
                                </p>
                            </td>
                            <td colSpan="2">
                                <p>
                                    Phương pháp tính thuế GTGT (<em>chọn 1 trong 4 phương pháp</em>):
                                </p>
                                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "4px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "30px" }}></td>
                                            <td style={{ width: "250px" }}>
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
                                            <td>
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
                                            <td></td>
                                            <td>
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
                                            <td>
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
                                            <td></td>
                                            <td>
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
                                            <td>
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
                                            <td></td>
                                            <td>
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
                                            <td>
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
                    <strong>10. Thông tin về việc đóng bảo hiểm xã hội:</strong>
                </p>
                <p style={{ marginLeft: "10px", fontStyle: "italic", fontSize: "14px" }}>
                    Lưu ý:
                    <br />
                    - Doanh nghiệp đăng ký ngành, nghề kinh doanh chính là nông nghiệp, lâm nghiệp, ngư nghiệp, diêm
                    nghiệp và trả lương theo sản phẩm, theo khoán: có thể lựa chọn 1 trong 3 phương thức đóng bảo hiểm
                    xã hội: hàng tháng, 03 tháng một lần, 06 tháng một lần.
                    <br />- Doanh nghiệp đăng ký ngành, nghề kinh doanh chính khác: đánh dấu vào phương thức đóng bảo
                    hiểm xã hội hàng tháng.
                </p>
                <p>
                    Phương thức đóng bảo hiểm xã hội (<em>chọn 1 trong 3 phương thức</em>):
                </p>
                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "8px" }}>
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
                    <strong>11. Thông tin về chủ sở hữu hưởng lợi của doanh nghiệp:</strong>
                </p>
                <p>Doanh nghiệp có chủ sở hữu hưởng lợi không?</p>
                <table className={styles.noBorderTable} style={{ width: "100%", maxWidth: "300px", marginTop: "8px" }}>
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
                                    <Checkbox checked={doanhNghiepCoCSHHuongLoi === "co"} />
                                    Có
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
                                    <Checkbox checked={doanhNghiepCoCSHHuongLoi === "khong"} />
                                    Không
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p style={{ width: "100%", marginTop: "16px" }}>
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
                    className={styles.noBorderTable}
                    style={{ width: "100%", marginTop: "30px", marginBottom: "50px" }}
                >
                    <tbody>
                        <tr>
                            <td style={{ width: "50%" }}></td>
                            <td className={styles.textCenter} style={{ verticalAlign: "top", whiteSpace: "nowrap" }}>
                                <p>
                                    <strong>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT CỦA CÔNG TY</strong>
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

export default GiayDeNghiDKDNConfirmation;
