import React from "react";
import styles from "./GiayDeNghiDKDNConfirmation.module.css";
import NganhNgheTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { formatDate } from "@/utils/dateTimeUtils";

const Checkbox = ({ checked }) => <div className={styles.checkbox}>{checked ? "x" : ""}</div>;

function GiayDeNghiDKDNConfirmation({ dataJson }) {
    if (!dataJson) {
        return <div className={styles.emptyMessage}>Đang tải dữ liệu...</div>;
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
            <h3 className={styles.docTitle}>CÔNG TY TRÁCH NHIỆM HỮU HẠN MỘT THÀNH VIÊN</h3>

            <div className={styles.content}>
                <p>Kính gửi: {kinhGui}</p>

                <p>
                    Tôi là (<em>ghi họ tên bằng chữ in hoa</em>):{" "}
                    <span style={{ textTransform: "uppercase" }}>{nguoiNop_hoTen?.toUpperCase()}</span>
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
                <table className={styles.noBorderTable} style={{ marginLeft: "20px", width: "calc(100% - 20px)" }}>
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
                        Đăng ký công ty trách nhiệm hữu hạn một thành viên do tôi là người đại diện theo pháp luật với
                        các nội dung sau:
                    </strong>
                </p>

                <p>
                    <strong>1. Tình trạng thành lập </strong>(<em>đánh dấu X vào ô thích hợp</em>):
                </p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>Thành lập mới</td>
                            <td style={{ textAlign: "center", width: "40px" }}>
                                <Checkbox checked={tinhTrangThanhLap === "moi"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở tách doanh nghiệp</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={tinhTrangThanhLap === "tach"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở chia doanh nghiệp</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={tinhTrangThanhLap === "chia"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở hợp nhất doanh nghiệp</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={tinhTrangThanhLap === "hop_nhat"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở chuyển đổi loại hình doanh nghiệp</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={tinhTrangThanhLap === "chuyen_doi_loai_hinh"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở chuyển đổi từ hộ kinh doanh</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={tinhTrangThanhLap === "chuyen_doi_hkd"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Thành lập trên cơ sở chuyển đổi từ cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={tinhTrangThanhLap === "chuyen_doi_quy"} />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>2. Tên công ty:</strong>
                </p>
                <p>
                    Tên công ty viết bằng tiếng Việt (<em>ghi bằng chữ in hoa</em>): CÔNG TY TNHH{" "}
                    <span style={{ textTransform: "uppercase" }}>{tenCongTyVN}</span>
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
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>Khu công nghiệp</td>
                            <td style={{ textAlign: "center", width: "40px" }}>
                                <Checkbox checked={truSo_loaiKhu === "Khu công nghiệp"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Khu chế xuất</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={truSo_loaiKhu === "Khu chế xuất"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Khu kinh tế</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={truSo_loaiKhu === "Khu kinh tế"} />
                            </td>
                        </tr>
                        <tr>
                            <td>Khu công nghệ cao</td>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox checked={truSo_loaiKhu === "Khu công nghệ cao"} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ marginTop: "8px" }}>
                    - Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo và xã, phường biên giới; xã, phường ven
                    biển; khu vực khác có ảnh hưởng đến quốc phòng, an ninh: Có
                    <Checkbox checked={truSo_anNinhQuocPhong === "Có"} />
                    <span style={{ marginLeft: "20px" }}></span>
                    Không <Checkbox checked={truSo_anNinhQuocPhong === "Không" || !truSo_anNinhQuocPhong} />
                </div>

                <p style={{ marginTop: "16px" }}>
                    <strong>4. Ngành, nghề kinh doanh </strong>(
                    <em>ghi tên và mã theo ngành cấp 4 trong Hệ thống ngành kinh tế của Việt Nam</em>):
                </p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>
                                <strong>STT</strong>
                            </th>
                            <th style={{ textAlign: "center" }}>
                                <strong>Tên ngành</strong>
                            </th>
                            <th style={{ width: "100px", textAlign: "center" }}>
                                <strong>Mã ngành</strong>
                            </th>
                            <th style={{ width: "150px", textAlign: "center" }}>
                                <strong>
                                    Ngành, nghề kinh doanh chính (
                                    <em>đánh dấu X để chọn một trong các ngành, nghề đã kê khai</em>)
                                </strong>
                            </th>
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
                                    <td style={{ textAlign: "center" }}>{nganh.laNganhChinh ? "x" : ""}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td style={{ textAlign: "center" }}>1</td>
                                <td>................................................</td>
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
                    <span style={{ textTransform: "uppercase" }}>{chuSoHuu_hoTen?.toUpperCase()}</span>
                </p>
                <p>Ngày, tháng, năm sinh: {formatDate(chuSoHuu_ngaySinh)}</p>
                <p>Giới tính: {chuSoHuu_gioiTinh}</p>
                <p>Số định danh cá nhân: {chuSoHuu_cccd}</p>
                <p>Địa chỉ liên lạc: {addressToString(chuSoHuu_soNha, chuSoHuu_xa, chuSoHuu_tinh)}</p>
                <p>
                    Điện thoại<em> (nếu có)</em>: {chuSoHuu_phone} &nbsp; &nbsp; Thư điện tử<em> (nếu có)</em>:{" "}
                    {chuSoHuu_email}
                </p>

                <p style={{ marginTop: "16px", fontStyle: "italic" }}>
                    Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký
                    doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì đề nghị kê khai các thông tin cá
                    nhân dưới đây:
                </p>
                <table className={styles.noBorderTable} style={{ marginLeft: "20px", width: "calc(100% - 20px)" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    Dân tộc: {chuSoHuu_danToc} &nbsp; &nbsp; Quốc tịch: {chuSoHuu_quocTich}
                                </p>
                                <p>
                                    Số Hộ chiếu (<em>đối với cá nhân Việt Nam không có số định danh cá nhân</em>)/Số Hộ
                                    chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (
                                    <em>đối với cá nhân là người nước ngoài</em>): {chuSoHuu_soHoChieu}
                                </p>
                                <p>
                                    Ngày cấp: {formatDate(chuSoHuu_ngayCapHoChieu)} &nbsp; &nbsp; Nơi cấp:{" "}
                                    {chuSoHuu_noiCapHoChieu}
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
                <p>Mã số dự án: {chuSoHuu_maSoDuAn}</p>
                <p>
                    Ngày cấp: {formatDate(chuSoHuu_ngayCapDuAn)} &nbsp; &nbsp; Cơ quan cấp: {chuSoHuu_coQuanCapDuAn}
                </p>

                <p style={{ marginTop: "16px" }}>
                    <strong>6. Vốn điều lệ:</strong>
                </p>
                <p>
                    Vốn điều lệ (<em>bằng số; VNĐ</em>): {vonDieuLe} VNĐ
                </p>
                <p>
                    Vốn điều lệ (<em>bằng chữ; VNĐ</em>): <span style={{ fontStyle: "italic" }}>{vonDieuLe_bangChu}</span>
                </p>
                <p>
                    Giá trị tương đương theo đơn vị tiền nước ngoài (<em>nếu có, bằng số, loại ngoại tệ</em>):{" "}
                    {vonDieuLe_ngoaiTe}
                </p>
                <div>
                    Có hiển thị thông tin về giá trị tương đương theo đơn vị tiền tệ nước ngoài trên Giấy chứng nhận
                    đăng ký doanh nghiệp hay không? Có <Checkbox checked={false} /> Không <Checkbox checked={true} />
                </div>

                <p style={{ marginTop: "16px" }}>
                    <strong>7. Nguồn vốn điều lệ:</strong>
                </p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>
                                <strong>Loại nguồn vốn</strong>
                            </th>
                            <th style={{ textAlign: "center" }}>
                                <strong>
                                    Số tiền (
                                    <em>bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài, nếu có</em>)
                                </strong>
                            </th>
                            <th style={{ textAlign: "center" }}>
                                <strong>
                                    Tỷ lệ (<em>%</em>)
                                </strong>
                            </th>
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

                <p style={{ marginTop: "16px" }}>
                    <strong>8. Tài sản góp vốn:</strong>
                </p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th className={styles.textCenter} style={{ width: "50px" }}>
                                <strong>STT</strong>
                            </th>
                            <th className={styles.textCenter}>
                                <strong>Tài sản góp vốn</strong>
                            </th>
                            <th className={styles.textCenter}>
                                <strong>
                                    Giá trị vốn của từng tài sản trong vốn điều lệ (<em>bằng số, VNĐ</em>)
                                </strong>
                            </th>
                            <th className={styles.textCenter} style={{ width: "100px" }}>
                                <strong>
                                    Tỷ lệ (<em>%</em>)
                                </strong>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.textCenter}>1</td>
                            <td>Đồng Việt Nam</td>
                            <td className={styles.textCenter}>{formatVND(taiSan_dongVN_giaTri)}</td>
                            <td className={styles.textCenter}>{formatPercent(taiSan_dongVN_tyLe)}</td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>2</td>
                            <td>
                                Ngoại tệ tự do chuyển đổi (
                                <em>ghi rõ loại ngoại tệ, số tiền được góp bằng mỗi loại ngoại tệ</em>)
                            </td>
                            <td className={styles.textCenter}>{formatVND(taiSan_ngoaiTe_giaTri)}</td>
                            <td className={styles.textCenter}>{formatPercent(taiSan_ngoaiTe_tyLe)}</td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>3</td>
                            <td>Vàng</td>
                            <td className={styles.textCenter}>{formatVND(taiSan_vang_giaTri)}</td>
                            <td className={styles.textCenter}>{formatPercent(taiSan_vang_tyLe)}</td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>4</td>
                            <td>Quyền sử dụng đất</td>
                            <td className={styles.textCenter}>{formatVND(taiSan_qsdDat_giaTri)}</td>
                            <td className={styles.textCenter}>{formatPercent(taiSan_qsdDat_tyLe)}</td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>5</td>
                            <td>Quyền sở hữu trí tuệ</td>
                            <td className={styles.textCenter}>{formatVND(taiSan_shtt_giaTri)}</td>
                            <td className={styles.textCenter}>{formatPercent(taiSan_shtt_tyLe)}</td>
                        </tr>
                        <tr>
                            <td className={styles.textCenter}>6</td>
                            <td>
                                Các tài sản khác (
                                <em>
                                    ghi rõ loại tài sản, số lượng và giá trị còn lại của mỗi loại tài sản, có thể lập
                                    thành danh mục riêng kèm theo hồ sơ đăng ký doanh nghiệp
                                </em>
                                )
                            </td>
                            <td className={styles.textCenter}>
                                {taiSan_khac_loaiTaiSan && (
                                    <div style={{ fontSize: "0.9em" }}>Loại tài sản: {taiSan_khac_loaiTaiSan}</div>
                                )}
                                {taiSan_khac_soLuong && (
                                    <div style={{ fontSize: "0.9em" }}>Số lượng: {taiSan_khac_soLuong}</div>
                                )}
                                {formatVND(taiSan_khac_giaTri)}
                            </td>
                            <td className={styles.textCenter}>{formatPercent(taiSan_khac_tyLe)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className={styles.textCenter}>
                                Tổng số
                            </td>
                            <td className={styles.textCenter}>{formatVND(taiSan_tongSo_giaTri)}</td>
                            <td className={styles.textCenter}>{formatPercent(taiSan_tongSo_tyLe)}</td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>9. Người đại diện theo pháp luật:</strong>
                </p>
                <p>
                    Họ, chữ đệm và tên (<em>ghi bằng chữ in hoa</em>):{" "}
                    <span style={{ textTransform: "uppercase" }}>{nguoiDaiDien_hoTen?.toUpperCase()}</span>
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
                <table className={styles.noBorderTable} style={{ marginLeft: "20px", width: "calc(100% - 20px)" }}>
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
                                    Ngày cấp: {nguoiDaiDien_ngayCapHoChieu} &nbsp; &nbsp; Nơi cấp:{" "}
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
                    <strong>10. Thông tin đăng ký thuế:</strong>
                </p>
                <table className={styles.borderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>STT</th>
                            <th colSpan="2" style={{ textAlign: "center" }}>
                                Các chỉ tiêu thông tin đăng ký thuế
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.1</td>
                            <td colSpan="2">
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
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.2</td>
                            <td colSpan="2">
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
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.3</td>
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
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.4</td>
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
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.5</td>
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
                                            <td style={{ width: "200px" }}>Hạch toán độc lập</td>
                                            <td style={{ width: "40px", textAlign: "center" }}>
                                                <Checkbox checked={hinhThucHachToan === "doc_lap"} />
                                            </td>
                                            <td style={{ width: "30px" }}></td>
                                            <td>
                                                Có báo cáo tài chính hợp nhất{" "}
                                                <Checkbox checked={baoCaoTaiChinhHopNhat === "co"} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Hạch toán phụ thuộc</td>
                                            <td style={{ textAlign: "center" }}>
                                                <Checkbox checked={hinhThucHachToan === "phu_thuoc"} />
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.6</td>
                            <td colSpan="2">
                                <p>Năm tài chính:</p>
                                <p>
                                    Áp dụng từ ngày {namTaiChinh_tuNgay} đến ngày {namTaiChinh_denNgay}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.7</td>
                            <td colSpan="2">
                                <p>
                                    Tổng số lao động (<em>dự kiến</em>): {tongSoLaoDong}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.8</td>
                            <td colSpan="2">
                                <p>Hoạt động theo dự án BOT/BTO/BT/BOO, BLT, BTL, O&M:</p>
                                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "4px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "100px" }}>
                                                Có <Checkbox checked={hoatDongDuAn === "co"} />
                                            </td>
                                            <td>
                                                Không <Checkbox checked={hoatDongDuAn === "khong"} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>10.9</td>
                            <td colSpan="2">
                                <p>
                                    Phương pháp tính thuế GTGT (<em>chọn 1 trong 4 phương pháp</em>):
                                </p>
                                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "4px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "30px" }}></td>
                                            <td style={{ width: "250px" }}>Khấu trừ</td>
                                            <td>
                                                <Checkbox checked={phuongPhapTinhThueGTGT === "khau_tru"} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Trực tiếp trên GTGT</td>
                                            <td>
                                                <Checkbox checked={phuongPhapTinhThueGTGT === "truc_tiep_gtgt"} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Trực tiếp trên doanh số</td>
                                            <td>
                                                <Checkbox checked={phuongPhapTinhThueGTGT === "truc_tiep_doanh_so"} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Không phải nộp thuế GTGT</td>
                                            <td>
                                                <Checkbox checked={phuongPhapTinhThueGTGT === "khong_nop"} />
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
                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>
                                <Checkbox checked={phuongThucDongBHXH === "hang_thang"} /> Hàng tháng
                            </td>
                            <td>
                                <Checkbox checked={phuongThucDongBHXH === "3_thang"} /> 03 tháng một lần
                            </td>
                            <td>
                                <Checkbox checked={phuongThucDongBHXH === "6_thang"} /> 06 tháng một lần
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ marginTop: "16px" }}>
                    <strong>12. Thông tin về chủ sở hữu hưởng lợi của doanh nghiệp:</strong>
                </p>
                <p>Doanh nghiệp có chủ sở hữu hưởng lợi không?</p>
                <table className={styles.noBorderTable} style={{ width: "100%", maxWidth: "300px", marginTop: "8px" }}>
                    <tbody>
                        <tr>
                            <td>
                                <Checkbox checked={doanhNghiepCoCSHHuongLoi === "co"} /> Có
                            </td>
                            <td>
                                <Checkbox checked={doanhNghiepCoCSHHuongLoi === "khong"} /> Không
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
                    className={styles.noBorderTable}
                    style={{ width: "100%", marginTop: "30px", marginBottom: "50px" }}
                >
                    <tbody>
                        <tr>
                            <td style={{ width: "50%" }}></td>
                            <td className={styles.textCenter} style={{ verticalAlign: "top" }}>
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
