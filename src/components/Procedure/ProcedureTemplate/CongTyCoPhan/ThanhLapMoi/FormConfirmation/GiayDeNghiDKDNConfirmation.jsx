import React, { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateTimeUtils";
// Reuse styles
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { useGetFormDataJsonFromName, useProcessProcedure } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import { authAxios } from "@/services/axios-instance";
import {
    DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const Checkbox = ({ checked }) => (
    <span className={styles.checkbox}>
        {checked ? "x" : ""}
    </span>
);

function GiayDeNghiDKDNConfirmation({ dataJson }) {
    // get from "Danh sách cổ đông sáng lập" form if available
    const coDongList = useGetFormDataJsonFromName("Danh sách cổ đông sáng lập")?.coDongList || [];

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
        tenCongTyPrefix = DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
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
        vonDieuLe_ngoaiTeBangSo = "",
        vonDieuLe_ngoaiTeDonVi = "",
        hienThiNgoaiTe = "khong",
        menhGiaCoPhan = "10.000",
        cp_cptt_soLuong = "",
        cp_cptt_giaTri = "",
        cp_cptt_tiLe = "",
        cp_cpudbq_soLuong = "",
        cp_cpudbq_giaTri = "",
        cp_cpudbq_tiLe = "",
        cp_cpudct_soLuong = "",
        cp_cpudct_giaTri = "",
        cp_cpudct_tiLe = "",
        cp_cpudhl_soLuong = "",
        cp_cpudhl_giaTri = "",
        cp_cpudhl_tiLe = "",
        cp_cpudk_soLuong = "",
        cp_cpudk_giaTri = "",
        cp_cpudk_tiLe = "",
        cp_tongSoLuong = "",
        cp_tongGiaTri = "",
        cp_tongTiLe = "",

        cp_cb_cptt_soLuong = "",
        cp_cb_cpudbq_soLuong = "",
        cp_cb_cpudct_soLuong = "",
        cp_cb_cpudhl_soLuong = "",
        cp_cb_cpudk_soLuong = "",
        cp_cb_tongSoLuong = "",

        maSoDuAn = "",
        ngayCapDuAn = "",
        coQuanCapDuAn = "",

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

        lyDoChuyenDoi = "",
        dnChuyenDoi_ten = "",
        dnChuyenDoi_maSo = "",
        hkdChuyenDoi_ten = "",
        hkdChuyenDoi_soGiayChungNhan = "",
        hkdChuyenDoi_ngayCap = "",
        hkdChuyenDoi_noiCap = "",
        hkdChuyenDoi_maSoThue = "",
        hkdChuyenDoi_diaChi = "",
        hkdChuyenDoi_tenChuHo = "",
        hkdChuyenDoi_loaiGiayTo = "",
        hkdChuyenDoi_loaiGiayToKhac = "",
        hkdChuyenDoi_soGiayTo = "",
        hkdChuyenDoi_ngayCapGiayTo = "",
        hkdChuyenDoi_noiCapGiayTo = "",
        hkdChuyenDoi_ngayHetHanGiayTo = "",
        csqChuyenDoi_ten = "",
        csqChuyenDoi_soGiayChungNhan = "",
        csqChuyenDoi_ngayCap = "",
        csqChuyenDoi_noiCap = "",
        csqChuyenDoi_maSoThue = "",
        csqChuyenDoi_diaChi = "",
        csqChuyenDoi_tenNguoiDaiDien = "",
        csqChuyenDoi_loaiGiayTo = "",
        csqChuyenDoi_loaiGiayToKhac = "",
        csqChuyenDoi_soGiayTo = "",
        csqChuyenDoi_ngayCapGiayTo = "",
        csqChuyenDoi_noiCapGiayTo = "",
        csqChuyenDoi_ngayHetHanGiayTo = "",

        duAnDauTuDacBiet = "",
        doanhNghiepXaHoi = "",
        congTyChungKhoan = "",
        congTyChungKhoan_soGiayPhep = "",
        congTyChungKhoan_ngayCap = ""
    } = dataJson;
    const companyNamePrefix = getCompanyNamePrefix({ tenCongTyPrefix }, DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX);


    const addressToString = (soNha, xa, tinh) => {
        return [soNha, xa, tinh].filter(Boolean).join(", ");
    };

    const formatVND = (value) => {
        if (!value || value === "0" || value === 0) return "0";
        return `${value} VNĐ`;
    };

    const formatPercent = (value) => {
        if (!value || value === "0" || value === 0) return "0";
        return `${value}%`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.nationTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
                <p style={{ fontStyle: "italic", textAlign: "right" }}>
                    <CurrentDate prefix={lienLac_tinh} />
                </p>
            </div>

            <h2 className={styles.docTitle}>
                GIẤY ĐỀ NGHỊ ĐĂNG KÝ DOANH NGHIỆP
            </h2>
            <h3 className={styles.docTitle}>
                CÔNG TY CỔ PHẦN
            </h3>

            <div className={styles.content}>
                <p>Kính gửi: {kinhGui}</p>

                <p>Tôi là (<em>ghi họ tên bằng chữ in hoa</em>): <span style={{ textTransform: "uppercase" }}>{nguoiNop_hoTen}</span></p>
                <p>Ngày, tháng, năm sinh: {formatDate(nguoiNop_ngaySinh)}</p>
                <p>Giới tính: {nguoiNop_gioiTinh}</p>
                <p>Số định danh cá nhân: {nguoiNop_cccd}</p>
                <p>Địa chỉ liên lạc:</p>
                <p>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {lienLac_soNha}</p>
                <p>Xã/Phường/Đặc khu: {lienLac_xa}</p>
                <p>Tỉnh/Thành phố trực thuộc trung ương: {lienLac_tinh}</p>
                <p>Điện thoại<em> (nếu có)</em>: {nguoiNop_phone} &nbsp; &nbsp; Thư điện tử<em> (nếu có)</em>: {nguoiNop_email}</p>

                <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                    Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá nhân dưới đây:
                </p>
                <table className={styles.noBorderTable} style={{ marginLeft: "20px", width: "calc(100% - 20px)" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p>Dân tộc: {nguoiNop_danToc} &nbsp; &nbsp; Quốc tịch: {nguoiNop_quocTich}</p>
                                <p>Số Hộ chiếu (<em>đối với cá nhân Việt Nam không có số định danh cá nhân</em>)/Số Hộ chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (<em>đối với cá nhân là người nước ngoài</em>): {nguoiNop_soHoChieu}</p>
                                <p>Ngày cấp: {formatDate(nguoiNop_ngayCapHoChieu)} &nbsp; &nbsp; Nơi cấp: {nguoiNop_noiCapHoChieu}</p>
                                <p>Nơi thường trú:</p>
                                <p>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {nguoiNop_thuongTru_soNha}</p>
                                <p>Xã/Phường/Đặc khu: {nguoiNop_thuongTru_xa}</p>
                                <p>Tỉnh/Thành phố trực thuộc trung ương: {nguoiNop_thuongTru_tinh}</p>
                                <p>Quốc gia: {nguoiNop_thuongTru_quocGia}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>Đăng ký công ty cổ phần do tôi là người đại diện theo pháp luật với các nội dung sau:</strong>
                </p>

                <p><strong>1. Tình trạng thành lập </strong>(<em>đánh dấu X vào ô thích hợp</em>):</p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>Thành lập mới</td>
                            <td style={{ textAlign: "center", width: "40px" }}><Checkbox checked={tinhTrangThanhLap === "moi"} /></td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở tách doanh nghiệp</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={tinhTrangThanhLap === "tach"} /></td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở chia doanh nghiệp</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={tinhTrangThanhLap === "chia"} /></td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở hợp nhất doanh nghiệp</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={tinhTrangThanhLap === "hop_nhat"} /></td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở chuyển đổi loại hình doanh nghiệp</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={tinhTrangThanhLap === "chuyen_doi_loai_hinh"} /></td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở chuyển đổi từ hộ kinh doanh</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={tinhTrangThanhLap === "chuyen_doi_hkd"} /></td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở chuyển đổi từ cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={tinhTrangThanhLap === "chuyen_doi_quy"} /></td>
                        </tr>
                    </tbody>
                </table>

                {tinhTrangThanhLap !== "moi" && (
                    <div style={{ marginLeft: "20px", marginTop: "8px" }}>
                        <p>- Lý do chuyển đổi loại hình doanh nghiệp: {lyDoChuyenDoi}</p>

                        <p style={{ marginTop: "8px" }}><strong>- Thông tin về các doanh nghiệp bị chia, bị tách, bị hợp nhất, được chuyển đổi:</strong></p>
                        <p>Tên doanh nghiệp (ghi bằng chữ in hoa): <span style={{ textTransform: "uppercase" }}>{dnChuyenDoi_ten}</span></p>
                        <p>Mã số doanh nghiệp/Mã số thuế: {dnChuyenDoi_maSo}</p>

                        <p style={{ marginTop: "8px" }}><strong>- Thông tin về hộ kinh doanh được chuyển đổi:</strong></p>
                        <p>Tên hộ kinh doanh (ghi bằng chữ in hoa): <span style={{ textTransform: "uppercase" }}>{hkdChuyenDoi_ten}</span></p>
                        <p>Số Giấy chứng nhận đăng ký hộ kinh doanh (nếu có): {hkdChuyenDoi_soGiayChungNhan}</p>
                        <p>Ngày cấp: {formatDate(hkdChuyenDoi_ngayCap)} &nbsp;&nbsp; Nơi cấp: {hkdChuyenDoi_noiCap}</p>
                        <p>Mã số thuế của hộ kinh doanh: {hkdChuyenDoi_maSoThue}</p>
                        <p>Địa chỉ trụ sở hộ kinh doanh: {hkdChuyenDoi_diaChi}</p>
                        <p>Tên chủ hộ kinh doanh: {hkdChuyenDoi_tenChuHo}</p>
                        <p>Loại giấy tờ pháp lý của cá nhân: {hkdChuyenDoi_loaiGiayTo === "khac" ? hkdChuyenDoi_loaiGiayToKhac : (hkdChuyenDoi_loaiGiayTo === "cmnd" ? "Chứng minh nhân dân" : (hkdChuyenDoi_loaiGiayTo === "cccd" ? "Căn cước công dân" : (hkdChuyenDoi_loaiGiayTo === "ho_chieu" ? "Hộ chiếu" : "")))}</p>
                        <p>Số giấy tờ pháp lý của cá nhân: {hkdChuyenDoi_soGiayTo}</p>
                        <p>Ngày cấp: {formatDate(hkdChuyenDoi_ngayCapGiayTo)} &nbsp;&nbsp; Nơi cấp: {hkdChuyenDoi_noiCapGiayTo} &nbsp;&nbsp; Ngày hết hạn: {formatDate(hkdChuyenDoi_ngayHetHanGiayTo)}</p>

                        <p style={{ marginTop: "8px" }}><strong>- Thông tin về cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện được chuyển đổi:</strong></p>
                        <p>Tên cơ sở (ghi bằng chữ in hoa): <span style={{ textTransform: "uppercase" }}>{csqChuyenDoi_ten}</span></p>
                        <p>Số Giấy chứng nhận: {csqChuyenDoi_soGiayChungNhan}</p>
                        <p>Ngày cấp: {formatDate(csqChuyenDoi_ngayCap)} &nbsp;&nbsp; Nơi cấp: {csqChuyenDoi_noiCap}</p>
                        <p>Mã số thuế: {csqChuyenDoi_maSoThue}</p>
                        <p>Địa chỉ trụ sở chính: {csqChuyenDoi_diaChi}</p>
                        <p>Tên người đại diện: {csqChuyenDoi_tenNguoiDaiDien}</p>
                        <p>Loại giấy tờ pháp lý: {csqChuyenDoi_loaiGiayTo === "khac" ? csqChuyenDoi_loaiGiayToKhac : (csqChuyenDoi_loaiGiayTo === "cmnd" ? "Chứng minh nhân dân" : (csqChuyenDoi_loaiGiayTo === "cccd" ? "Căn cước công dân" : (csqChuyenDoi_loaiGiayTo === "ho_chieu" ? "Hộ chiếu" : "")))}</p>
                        <p>Số giấy tờ pháp lý: {csqChuyenDoi_soGiayTo}</p>
                        <p>Ngày cấp: {formatDate(csqChuyenDoi_ngayCapGiayTo)} &nbsp;&nbsp; Nơi cấp: {csqChuyenDoi_noiCapGiayTo} &nbsp;&nbsp; Ngày hết hạn: {formatDate(csqChuyenDoi_ngayHetHanGiayTo)}</p>
                    </div>
                )}

                <p style={{ marginTop: "8px" }}>
                    - Doanh nghiệp thực hiện dự án đầu tư được đăng ký đầu tư theo thủ tục đầu tư đặc biệt: <Checkbox checked={duAnDauTuDacBiet === "co"} />
                </p>
                <p style={{ marginTop: "4px" }}>
                    - Doanh nghiệp xã hội: <Checkbox checked={doanhNghiepXaHoi === "co"} />
                </p>
                <p style={{ marginTop: "4px" }}>
                    - Công ty chứng khoán/Công ty quản lý quỹ đầu tư chứng khoán/Công ty đầu tư chứng khoán: <Checkbox checked={congTyChungKhoan === "co"} />
                </p>
                {congTyChungKhoan === "co" && (
                    <p style={{ marginLeft: "20px" }}>
                        Giấy phép thành lập và hoạt động số: {congTyChungKhoan_soGiayPhep} do Uỷ ban Chứng khoán Nhà nước cấp ngày: {formatDate(congTyChungKhoan_ngayCap)}
                    </p>
                )}

                <p style={{ marginTop: "16px" }}><strong>2. Tên công ty:</strong></p>
                <p>Tên công ty viết bằng tiếng Việt (<em>ghi bằng chữ in hoa</em>): {companyNamePrefix} <span style={{ textTransform: "uppercase" }}>{tenCongTyVN}</span></p>
                <p>Tên công ty viết bằng tiếng nước ngoài (<em>nếu có</em>): {tenCongTyEN}</p>
                <p>Tên công ty viết tắt (<em>nếu có</em>): {tenCongTyVietTat}</p>

                <p style={{ marginTop: "16px" }}><strong>3. Địa chỉ trụ sở chính:</strong></p>
                <p>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {truSo_soNha}</p>
                <p>Xã/Phường/Đặc khu: {truSo_xa}</p>
                <p>Tỉnh/Thành phố trực thuộc trung ương: {truSo_tinh}</p>
                <p>Điện thoại: {truSo_phone} &nbsp; &nbsp; Số fax (<em>nếu có</em>): {truSo_fax}</p>
                <p>Thư điện tử (<em>nếu có</em>): {truSo_email} &nbsp; &nbsp; Website (<em>nếu có</em>): {truSo_website}</p>

                <p style={{ marginTop: "8px" }}>- Doanh nghiệp nằm trong (<em>Doanh nghiệp phải đánh dấu X vào ô vuông tương ứng với khu công nghệ cao nếu nộp hồ sơ tới Ban quản lý khu công nghệ cao</em>):</p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>Khu công nghiệp</td>
                            <td style={{ textAlign: "center", width: "40px" }}><Checkbox checked={truSo_loaiKhu === "Khu công nghiệp"} /></td>
                        </tr>
                        <tr>
                            <td>Khu chế xuất</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={truSo_loaiKhu === "Khu chế xuất"} /></td>
                        </tr>
                        <tr>
                            <td>Khu kinh tế</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={truSo_loaiKhu === "Khu kinh tế"} /></td>
                        </tr>
                        <tr>
                            <td>Khu công nghệ cao</td>
                            <td style={{ textAlign: "center" }}><Checkbox checked={truSo_loaiKhu === "Khu công nghệ cao"} /></td>
                        </tr>
                    </tbody>
                </table>
                <p style={{ marginTop: "8px" }}>
                    - Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo và xã, phường biên giới; xã, phường ven biển; khu vực khác có ảnh hưởng đến quốc phòng, an ninh: Có
                    <Checkbox checked={truSo_anNinhQuocPhong === "Có"} />
                    <span style={{ marginLeft: "20px" }}></span>
                    Không <Checkbox checked={truSo_anNinhQuocPhong === "Không"} />
                </p>

                <p style={{ marginTop: "16px" }}><strong>4. Ngành, nghề kinh doanh </strong>(<em>ghi tên và mã theo ngành cấp 4 trong Hệ thống ngành kinh tế của Việt Nam</em>):</p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}><strong>STT</strong></th>
                            <th style={{ textAlign: "center" }}><strong>Tên ngành</strong></th>
                            <th style={{ width: "100px", textAlign: "center" }}><strong>Mã ngành</strong></th>
                            <th style={{ width: "150px", textAlign: "center" }}><strong>Ngành, nghề kinh doanh chính (<em>đánh dấu X để chọn một trong các ngành, nghề đã kê khai</em>)</strong></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(nganhNgheList || []).length > 0 ? (
                            nganhNgheList.map((nganh, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                    <td>
                                        <div>{nganh.tenNganh}</div>
                                        {nganh.chiTiet && <pre
                                            style={{
                                                margin: 0,
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                                fontFamily: "inherit",
                                                fontSize: "inherit"
                                            }}>{nganh.chiTiet}</pre>}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{nganh.maNganh}</td>
                                    <td style={{ textAlign: "center" }}>{nganh.laNganhChinh ? 'x' : ''}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}><i>Không có</i></td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}><strong>5. Vốn điều lệ:</strong></p>
                <p>Vốn điều lệ (<em>bằng số; VNĐ</em>): {vonDieuLe} VNĐ</p>
                <p>Vốn điều lệ (<em>bằng chữ; VNĐ</em>): <span style={{ fontStyle: "italic" }}>{vonDieuLe_bangChu}</span></p>
                <p>Giá trị tương đương theo đơn vị tiền nước ngoài (<em>nếu có, bằng số, loại ngoại tệ</em>): {vonDieuLe_ngoaiTeBangSo ? `${vonDieuLe_ngoaiTeBangSo} ${vonDieuLe_ngoaiTeDonVi}` : ""}</p>
                <p>Có hiển thị thông tin về giá trị tương đương theo đơn vị tiền tệ nước ngoài trên Giấy chứng nhận đăng ký doanh nghiệp hay không? Có <Checkbox checked={hienThiNgoaiTe === "co"} /> Không <Checkbox checked={hienThiNgoaiTe === "khong"} /></p>

                <p style={{ marginTop: "16px" }}><strong>6. Nguồn vốn điều lệ:</strong></p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}><strong>Loại nguồn vốn</strong></th>
                            <th style={{ textAlign: "center" }}><strong>Số tiền (<em>bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài, nếu có</em>)</strong></th>
                            <th style={{ textAlign: "center" }}><strong>Tỷ lệ (<em>%</em>)</strong></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Vốn ngân sách nhà nước</td>
                            <td style={{ textAlign: "center" }}>{formatVND(nguonVon_nganSach_soTien)}</td>
                            <td style={{ textAlign: "center" }}>{formatPercent(nguonVon_nganSach_tyLe)}</td>
                        </tr>
                        <tr>
                            <td>Vốn tư nhân</td>
                            <td style={{ textAlign: "center" }}>{formatVND(nguonVon_tuNhan_soTien)}</td>
                            <td style={{ textAlign: "center" }}>{formatPercent(nguonVon_tuNhan_tyLe)}</td>
                        </tr>
                        <tr>
                            <td>Vốn nước ngoài</td>
                            <td style={{ textAlign: "center" }}>{formatVND(nguonVon_nuocNgoai_soTien)}</td>
                            <td style={{ textAlign: "center" }}>{formatPercent(nguonVon_nuocNgoai_tyLe)}</td>
                        </tr>
                        <tr>
                            <td>Vốn khác</td>
                            <td style={{ textAlign: "center" }}>{formatVND(nguonVon_khac_soTien)}</td>
                            <td style={{ textAlign: "center" }}>{formatPercent(nguonVon_khac_tyLe)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>Tổng cộng</td>
                            <td style={{ textAlign: "center" }}>{formatVND(nguonVon_tongCong_soTien)}</td>
                            <td style={{ textAlign: "center" }}>{formatPercent(nguonVon_tongCong_tyLe)}</td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}><strong>7. Thông tin về cổ phần:</strong></p>
                <p>Mệnh giá cổ phần (VNĐ): {menhGiaCoPhan} VNĐ</p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>STT</th>
                            <th style={{ textAlign: "center" }}>Loại cổ phần</th>
                            <th style={{ textAlign: "center" }}>Số lượng</th>
                            <th style={{ textAlign: "center" }}>Giá trị (bằng số, VNĐ)</th>
                            <th style={{ textAlign: "center" }}>Tỉ lệ so với vốn điều lệ (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "center" }}>1</td>
                            <td>Cổ phần phổ thông</td>
                            <td style={{ textAlign: "center" }}>{cp_cptt_soLuong || '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cptt_giaTri ? `${cp_cptt_giaTri} VNĐ` : '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cptt_tiLe ? cp_cptt_tiLe + '%' : '0'}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>2</td>
                            <td>Cổ phần ưu đãi biểu quyết</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudbq_soLuong || '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudbq_giaTri ? `${cp_cpudbq_giaTri} VNĐ` : '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudbq_tiLe ? cp_cpudbq_tiLe + '%' : '0'}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>3</td>
                            <td>Cổ phần ưu đãi cổ tức</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudct_soLuong || '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudct_giaTri ? `${cp_cpudct_giaTri} VNĐ` : '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudct_tiLe ? cp_cpudct_tiLe + '%' : '0'}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>4</td>
                            <td>Cổ phần ưu đãi hoàn lại</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudhl_soLuong || '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudhl_giaTri ? `${cp_cpudhl_giaTri} VNĐ` : '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudhl_tiLe ? cp_cpudhl_tiLe + '%' : '0'}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>5</td>
                            <td>Các cổ phần ưu đãi khác</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudk_soLuong || '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudk_giaTri ? `${cp_cpudk_giaTri} VNĐ` : '0'}</td>
                            <td style={{ textAlign: "center" }}>{cp_cpudk_tiLe ? cp_cpudk_tiLe + '%' : '0'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center", fontWeight: "bold" }}>Tổng số</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>{cp_tongSoLuong || '0'}</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>{cp_tongGiaTri ? `${cp_tongGiaTri} VNĐ` : '0'}</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>{cp_tongTiLe ? cp_tongTiLe + '%' : '0'}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <p><strong>Thông tin về cổ phần được quyền chào bán:</strong></p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>STT</th>
                            <th style={{ textAlign: "center" }}>Loại cổ phần được quyền chào bán</th>
                            <th style={{ textAlign: "center" }}>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "center" }}>1</td>
                            <td>Cổ phần phổ thông</td>
                            <td style={{ textAlign: "center" }}>{cp_cb_cptt_soLuong || '0'}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>2</td>
                            <td>Cổ phần ưu đãi biểu quyết</td>
                            <td style={{ textAlign: "center" }}>{cp_cb_cpudbq_soLuong || '0'}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>3</td>
                            <td>Cổ phần ưu đãi cổ tức</td>
                            <td style={{ textAlign: "center" }}>{cp_cb_cpudct_soLuong || '0'}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>4</td>
                            <td>Cổ phần ưu đãi hoàn lại</td>
                            <td style={{ textAlign: "center" }}>{cp_cb_cpudhl_soLuong || '0'}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>5</td>
                            <td>Cổ phần ưu đãi khác</td>
                            <td style={{ textAlign: "center" }}>{cp_cb_cpudk_soLuong || '0'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center", fontWeight: "bold" }}>Tổng số</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>{cp_cb_tongSoLuong || '0'}</td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}><strong>8. Danh sách cổ đông sáng lập:</strong></p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px", fontSize: "13px" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center", width: "40px" }}>STT</th>
                            <th style={{ textAlign: "center" }}>Tên cổ đông</th>
                            <th style={{ textAlign: "center", width: "110px" }}>Ngày sinh</th>
                            <th style={{ textAlign: "center", width: "70px" }}>Giới tính</th>
                            <th style={{ textAlign: "center" }}>Giấy tờ pháp lý</th>
                            <th style={{ textAlign: "center", width: "90px" }}>Quốc tịch</th>
                            <th style={{ textAlign: "center" }}>Địa chỉ liên lạc</th>
                            <th style={{ textAlign: "center", width: "110px" }}>Số lượng cổ phần</th>
                            <th style={{ textAlign: "center", width: "60px" }}>Tỷ lệ (%)</th>
                            <th style={{ textAlign: "center", width: "100px" }}>Thời hạn góp vốn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coDongList.length > 0 ? (
                            coDongList.map((tv, idx) => (
                                <tr key={idx}>
                                    <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                    <td>{tv.hoTen}</td>
                                    <td style={{ textAlign: "center" }}>{formatDate(tv.ngaySinh)}</td>
                                    <td style={{ textAlign: "center" }}>{tv.gioiTinh}</td>
                                    <td>{tv.giaTo}</td>
                                    <td style={{ textAlign: "center" }}>{tv.quocTich}</td>
                                    <td>{tv.diaChiLienLac}</td>
                                    <td style={{ textAlign: "center" }}>{tv.phanVonGop}</td>
                                    <td style={{ textAlign: "center" }}>{tv.tyLe ? tv.tyLe + '%' : ''}</td>
                                    <td style={{ textAlign: "center" }}>{tv.thoiHan}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center" }}><i>Chưa có dữ liệu cổ đông sáng lập, gửi kèm danh sách cổ đông sáng lập</i></td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}><strong>9. Cổ đông là nhà đầu tư nước ngoài:</strong></p>
                <div style={{ marginLeft: "10px" }}>
                    <p style={{ marginTop: "8px" }}>- Thông tin về Giấy chứng nhận đăng ký đầu tư (<em>kê khai trong trường hợp cổ đông là nhà đầu tư nước ngoài được cấp Giấy chứng nhận đăng ký đầu tư theo quy định của Luật Đầu tư</em>):</p>
                    <p>Mã số dự án: {maSoDuAn}</p>
                    <p>Ngày cấp: {formatDate(ngayCapDuAn)} &nbsp; &nbsp; Cơ quan cấp: {coQuanCapDuAn}</p>
                </div>

                <p style={{ marginTop: "16px" }}><strong>10. Người đại diện theo pháp luật:</strong></p>
                <p>Họ, chữ đệm và tên (<em>ghi bằng chữ in hoa</em>): <span style={{ textTransform: "uppercase" }}>{nguoiDaiDien_hoTen}</span></p>
                <p>Ngày, tháng, năm sinh: {formatDate(nguoiDaiDien_ngaySinh)}</p>
                <p>Giới tính: {nguoiDaiDien_gioiTinh}</p>
                <p>Số định danh cá nhân: {nguoiDaiDien_cccd}</p>
                <p>Chức danh: {nguoiDaiDien_chucDanh}</p>
                <p>Địa chỉ liên lạc: {addressToString(nguoiDaiDien_soNha, nguoiDaiDien_xa, nguoiDaiDien_tinh)}</p>

                <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                    Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá nhân dưới đây:
                </p>
                <table className={styles.noBorderTable} style={{ marginLeft: "20px", width: "calc(100% - 20px)" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p>Dân tộc: {nguoiDaiDien_danToc} &nbsp; &nbsp; Quốc tịch: {nguoiDaiDien_quocTich}</p>
                                <p>Số Hộ chiếu (<em>đối với cá nhân Việt Nam không có số định danh cá nhân</em>)/Số Hộ chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (<em>đối với cá nhân là người nước ngoài</em>): {nguoiDaiDien_soHoChieu}</p>
                                <p>Ngày cấp: {formatDate(nguoiDaiDien_ngayCapHoChieu)} &nbsp; &nbsp; Nơi cấp: {nguoiDaiDien_noiCapHoChieu}</p>
                                <p>Nơi thường trú:</p>
                                <p>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {nguoiDaiDien_thuongTru_soNha}</p>
                                <p>Xã/Phường/Đặc khu: {nguoiDaiDien_thuongTru_xa}</p>
                                <p>Tỉnh/Thành phố trực thuộc trung ương: {nguoiDaiDien_thuongTru_tinh}</p>
                                <p>Quốc gia: {nguoiDaiDien_thuongTru_quocGia}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}><strong>11. Thông tin đăng ký thuế:</strong></p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>STT</th>
                            <th colSpan="2" style={{ textAlign: "center" }}>Các chỉ tiêu thông tin đăng ký thuế</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.1</td>
                            <td colSpan="2">
                                <p>Thông tin về Giám đốc/Tổng giám đốc <em>(nếu có)</em>:</p>
                                <p>Họ, chữ đệm và tên Giám đốc/Tổng giám đốc: <span style={{ textTransform: "uppercase" }}>{giamDoc_hoTen}</span></p>
                                <p>Ngày, tháng, năm sinh: {formatDate(giamDoc_ngaySinh)}</p>
                                <p>Giới tính: {giamDoc_gioiTinh}</p>
                                <p>Số định danh cá nhân: {giamDoc_cccd}</p>
                                <p>Điện thoại: {giamDoc_phone}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.2</td>
                            <td colSpan="2">
                                <p>Thông tin về Kế toán trưởng/Phụ trách kế toán <em>(nếu có)</em>:</p>
                                <p>Họ, chữ đệm và tên Kế toán trưởng/Phụ trách kế toán: <span style={{ textTransform: "uppercase" }}>{keToan_hoTen}</span></p>
                                <p>Ngày, tháng, năm sinh: {formatDate(keToan_ngaySinh)}</p>
                                <p>Giới tính: {keToan_gioiTinh}</p>
                                <p>Số định danh cá nhân: {keToan_cccd}</p>
                                <p>Điện thoại: {keToan_phone}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.3</td>
                            <td colSpan="2">
                                <p>Địa chỉ nhận thông báo thuế (<em>chỉ kê khai nếu địa chỉ nhận thông báo thuế khác địa chỉ trụ sở chính</em>):</p>
                                <p>Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn: {thongBaoThue_soNha}</p>
                                <p>Xã/Phường/Đặc khu: {thongBaoThue_xa}</p>
                                <p>Tỉnh/Thành phố trực thuộc trung ương: {thongBaoThue_tinh}</p>
                                <p>Điện thoại (<em>nếu có</em>): {thongBaoThue_phone} &nbsp; &nbsp; Số fax (<em>nếu có</em>): {thongBaoThue_fax}</p>
                                <p>Thư điện tử (<em>nếu có</em>): {thongBaoThue_email}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.4</td>
                            <td colSpan="2">
                                <p>Ngày bắt đầu hoạt động (<em>trường hợp doanh nghiệp dự kiến bắt đầu hoạt động kể từ ngày được cấp Giấy chứng nhận đăng ký doanh nghiệp thì không cần kê khai nội dung này</em>): {formatDate(ngayBatDauHoatDong)}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.5</td>
                            <td colSpan="2">
                                <p>Hình thức hạch toán (<em>Đánh dấu X vào một trong hai ô “Hạch toán độc lập” hoặc “Hạch toán phụ thuộc”. Trường hợp chọn ô “Hạch toán độc lập” mà thuộc đối tượng phải lập và gửi báo cáo tài chính hợp nhất cho cơ quan có thẩm quyền theo quy định thì chọn thêm ô “Có báo cáo tài chính hợp nhất”</em>): </p>
                                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "4px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>Hạch toán độc lập</td>
                                            <td style={{ width: "40px", textAlign: "center" }}><Checkbox checked={hinhThucHachToan === "doc_lap"} /></td>
                                            <td style={{ width: "30px" }}></td>
                                            <td>Có báo cáo tài chính hợp nhất <Checkbox checked={baoCaoTaiChinhHopNhat === "co"} /></td>
                                        </tr>
                                        <tr>
                                            <td>Hạch toán phụ thuộc</td>
                                            <td style={{ textAlign: "center" }}><Checkbox checked={hinhThucHachToan === "phu_thuoc"} /></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.6</td>
                            <td colSpan="2">
                                <p>Năm tài chính:</p>
                                <p>Áp dụng từ ngày {namTaiChinh_tuNgay} đến ngày {namTaiChinh_denNgay}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.7</td>
                            <td colSpan="2">
                                <p>Tổng số lao động (<em>dự kiến</em>): {tongSoLaoDong}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.8</td>
                            <td colSpan="2">
                                <p>Hoạt động theo dự án BOT/BTO/BT/BOO, BLT, BTL, O&M:</p>
                                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "4px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "100px" }}>Có <Checkbox checked={hoatDongDuAn === "co"} /></td>
                                            <td>Không <Checkbox checked={hoatDongDuAn === "khong"} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>11.9</td>
                            <td colSpan="2">
                                <p>Phương pháp tính thuế GTGT (<em>chọn 1 trong 4 phương pháp</em>):</p>
                                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "4px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "30px" }}></td>
                                            <td style={{ width: "250px" }}>Khấu trừ</td>
                                            <td><Checkbox checked={phuongPhapTinhThueGTGT === "khau_tru"} /></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Trực tiếp trên GTGT</td>
                                            <td><Checkbox checked={phuongPhapTinhThueGTGT === "truc_tiep_gtgt"} /></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Trực tiếp trên doanh số</td>
                                            <td><Checkbox checked={phuongPhapTinhThueGTGT === "truc_tiep_doanh_so"} /></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Không phải nộp thuế GTGT</td>
                                            <td><Checkbox checked={phuongPhapTinhThueGTGT === "khong_nop"} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}><strong>12. Thông tin về việc đóng bảo hiểm xã hội:</strong></p>
                <div style={{ marginLeft: "10px", fontStyle: "italic", fontSize: "14px" }}>
                    Lưu ý:<br />
                    - Doanh nghiệp đăng ký ngành, nghề kinh doanh chính là nông nghiệp, lâm nghiệp, ngư nghiệp, diêm nghiệp và trả lương theo sản phẩm, theo khoán: có thể lựa chọn 1 trong 3 phương thức đóng bảo hiểm xã hội: hàng tháng, 03 tháng một lần, 06 tháng một lần.<br />
                    - Doanh nghiệp đăng ký ngành, nghề kinh doanh chính khác: đánh dấu vào phương thức đóng bảo hiểm xã hội hàng tháng.
                </div>
                <p>Phương thức đóng bảo hiểm xã hội (<em>chọn 1 trong 3 phương thức</em>):</p>
                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td><Checkbox checked={phuongThucDongBHXH === "hang_thang"} /> Hàng tháng</td>
                            <td><Checkbox checked={phuongThucDongBHXH === "3_thang"} /> 03 tháng một lần</td>
                            <td><Checkbox checked={phuongThucDongBHXH === "6_thang"} /> 06 tháng một lần</td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}><strong>13. Thông tin về chủ sở hữu hưởng lợi của doanh nghiệp:</strong></p>
                <p>Doanh nghiệp có chủ sở hữu hưởng lợi không?</p>
                <table className={styles.noBorderTable} style={{ width: "100%", maxWidth: "300px", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td><Checkbox checked={doanhNghiepCoCSHHuongLoi === "co"} /> Có</td>
                            <td><Checkbox checked={doanhNghiepCoCSHHuongLoi === "khong"} /> Không</td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>Trường hợp hồ sơ đăng ký doanh nghiệp hợp lệ, đề nghị Quý Cơ quan đăng công bố nội dung đăng ký doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.</p>

                <p style={{ marginTop: "16px" }}>Tôi cam kết:</p>
                <p style={{ marginLeft: "10px" }}>- Là người có đầy đủ quyền và nghĩa vụ thực hiện thủ tục đăng ký doanh nghiệp theo quy định của pháp luật và Điều lệ công ty;</p>
                <p style={{ marginLeft: "10px" }}>- Trụ sở chính thuộc quyền sử dụng hợp pháp của công ty và được sử dụng đúng mục đích theo quy định của pháp luật;</p>
                <p style={{ marginLeft: "10px" }}>- Chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung thực của nội dung đăng ký doanh nghiệp trên.</p>

                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "30px", marginBottom: "50px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "50%" }}></td>
                            <td className={styles.textCenter} style={{ verticalAlign: "top" }}>
                                <p><strong>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT CỦA CÔNG TY</strong><br />
                                    (<em>Ký và ghi họ tên</em>)</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    );
}

export default GiayDeNghiDKDNConfirmation;
