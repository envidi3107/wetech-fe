import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { formatDate } from "@/utils/dateTimeUtils";
import {
    A_CHANGE_OPTIONS,
    MAIN_CHANGE_OPTIONS,
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

const Checkbox = ({ checked }) => <div className={styles.checkbox}>{checked ? "x" : ""}</div>;
const DEFAULT_EXCLUDED_A_OPTION_NAMES = ["a_doiThanhVien", "a_doiCoDong", "a_doiVonDauTuDNTN"];

function Line({ label, value }) {
    return (
        <p>
            {label}: <strong>{value || ""}</strong>
        </p>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginTop: 16 }}>
            <p>
                <strong>{title}</strong>
            </p>
            {children}
        </div>
    );
}

function addressToString(soNha, xa, tinh) {
    return [soNha, xa, tinh].filter(Boolean).join(", ");
}

function renderBusinessRows(rows, emptyText = "Không có dữ liệu") {
    if (!rows?.length) {
        return (
            <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                    {emptyText}
                </td>
            </tr>
        );
    }

    return rows.map((row, index) => (
        <tr key={index}>
            <td style={{ textAlign: "center" }}>{index + 1}</td>
            <td>
                <div>{row.tenNganh}</div>
                {row.chiTiet && <div><em>{row.chiTiet}</em></div>}
            </td>
            <td style={{ textAlign: "center" }}>{row.maNganh}</td>
            <td style={{ textAlign: "center" }}>
                <Checkbox checked={!!row.laNganhChinh} />
            </td>
        </tr>
    ));
}

function MoneySourceTable({ data }) {
    const rows = [
        ["Vốn ngân sách nhà nước", "nguonVon_nganSach"],
        ["Vốn tư nhân", "nguonVon_tuNhan"],
        ["Vốn nước ngoài", "nguonVon_nuocNgoai"],
        ["Vốn khác", "nguonVon_khac"],
        ["Tổng cộng", "nguonVon_tongCong"],
    ];

    return (
        <table className={styles.borderTable} style={{ marginTop: 8 }}>
            <thead>
                <tr>
                    <th>Loại nguồn vốn</th>
                    <th>Số tiền</th>
                    <th>Tỷ lệ (%)</th>
                </tr>
            </thead>
            <tbody>
                {rows.map(([label, prefix]) => (
                    <tr key={prefix}>
                        <td>{label}</td>
                        <td>{data[`${prefix}_soTien`] || ""}</td>
                        <td style={{ textAlign: "center" }}>{data[`${prefix}_tyLe`] || ""}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function AssetTable({ data }) {
    const rows = [
        ["1", "Đồng Việt Nam", "taiSan_dongVN"],
        ["2", "Ngoại tệ tự do chuyển đổi", "taiSan_ngoaiTe"],
        ["3", "Vàng", "taiSan_vang"],
        ["4", "Quyền sử dụng đất", "taiSan_qsdDat"],
        ["5", "Quyền sở hữu trí tuệ", "taiSan_shtt"],
        ["6", `Các tài sản khác: ${data.taiSan_khac_loaiTaiSan || ""} ${data.taiSan_khac_soLuong ? `- ${data.taiSan_khac_soLuong}` : ""}`, "taiSan_khac"],
        ["", "Tổng số", "taiSan_tongSo"],
    ];

    return (
        <table className={styles.borderTable} style={{ marginTop: 8 }}>
            <thead>
                <tr>
                    <th style={{ width: 50 }}>STT</th>
                    <th>Tài sản góp vốn</th>
                    <th>Giá trị vốn</th>
                    <th>Tỷ lệ (%)</th>
                </tr>
            </thead>
            <tbody>
                {rows.map(([stt, label, prefix]) => (
                    <tr key={prefix}>
                        <td style={{ textAlign: "center" }}>{stt}</td>
                        <td>{label}</td>
                        <td>{data[`${prefix}_giaTri`] || ""}</td>
                        <td style={{ textAlign: "center" }}>{data[`${prefix}_tyLe`] || ""}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ShareInfoTable({ data }) {
    const rows = [
        ["Cổ phần phổ thông", "cp_cptt_soLuong", "cp_cptt_giaTri", "cp_cptt_tiLe"],
        ["Cổ phần ưu đãi biểu quyết", "cp_cpudbq_soLuong", "cp_cpudbq_giaTri", "cp_cpudbq_tiLe"],
        ["Cổ phần ưu đãi cổ tức", "cp_cpudct_soLuong", "cp_cpudct_giaTri", "cp_cpudct_tiLe"],
        ["Cổ phần ưu đãi hoàn lại", "cp_cpudhl_soLuong", "cp_cpudhl_giaTri", "cp_cpudhl_tiLe"],
        ["Các cổ phần ưu đãi khác", "cp_cpudk_soLuong", "cp_cpudk_giaTri", "cp_cpudk_tiLe"],
        ["Tổng số", "cp_tongSoLuong", "cp_tongGiaTri", "cp_tongTiLe"],
    ];
    const offerRows = [
        ["Cổ phần phổ thông", "cp_cb_cptt_soLuong"],
        ["Cổ phần ưu đãi biểu quyết", "cp_cb_cpudbq_soLuong"],
        ["Cổ phần ưu đãi cổ tức", "cp_cb_cpudct_soLuong"],
        ["Cổ phần ưu đãi hoàn lại", "cp_cb_cpudhl_soLuong"],
        ["Cổ phần ưu đãi khác", "cp_cb_cpudk_soLuong"],
        ["Tổng số", "cp_cb_tongSoLuong"],
    ];

    return (
        <>
            <p><strong>Thông tin về cổ phần sau khi thay đổi:</strong></p>
            <Line label="Mệnh giá cổ phần" value={data.menhGiaCoPhan} />
            <table className={styles.borderTable} style={{ marginTop: 8 }}>
                <thead>
                    <tr>
                        <th>Loại cổ phần</th>
                        <th>Số lượng</th>
                        <th>Giá trị</th>
                        <th>Tỷ lệ so với vốn điều lệ (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(([label, soLuongKey, giaTriKey, tiLeKey]) => (
                        <tr key={soLuongKey}>
                            <td>{label}</td>
                            <td>{data[soLuongKey] || ""}</td>
                            <td>{data[giaTriKey] || ""}</td>
                            <td style={{ textAlign: "center" }}>{data[tiLeKey] || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p><strong>Thông tin về cổ phần được quyền chào bán:</strong></p>
            <table className={styles.borderTable} style={{ marginTop: 8 }}>
                <thead>
                    <tr>
                        <th>Loại cổ phần được quyền chào bán</th>
                        <th>Số lượng</th>
                    </tr>
                </thead>
                <tbody>
                    {offerRows.map(([label, soLuongKey]) => (
                        <tr key={soLuongKey}>
                            <td>{label}</td>
                            <td>{data[soLuongKey] || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

function GiayDeNghiDangKyThayDoiConfirmation({
    dataJson,
    excludedAOptionNames = DEFAULT_EXCLUDED_A_OPTION_NAMES,
    includeCoPhanFields = false,
}) {
    const data = normalizeDataJson(dataJson);

    if (!Object.keys(data).length) {
        return <div className={styles.emptyMessage}>Đang tải dữ liệu...</div>;
    }

    const mainOption = data.noiDungThayDoi || "A";
    const selectedMainLabel = MAIN_CHANGE_OPTIONS.find((option) => option.value === mainOption)?.label || "";
    const excludedAOptionNamesSet = new Set(excludedAOptionNames);
    const availableAChangeOptions = A_CHANGE_OPTIONS.filter((option) => !excludedAOptionNamesSet.has(option.name));
    const selectedAOptions = availableAChangeOptions.filter((option) => isTruthy(data[option.name]));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.nationTitle}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
                <p className={styles.dateRight} style={{ fontStyle: "italic" }}>
                    <CurrentDate />
                </p>
            </div>

            <h2 className={styles.docTitle}>GIẤY ĐỀ NGHỊ</h2>
            <h3 className={styles.docTitle}>
                Đăng ký thay đổi nội dung Giấy chứng nhận đăng ký doanh nghiệp/Thông báo thay đổi nội dung đăng ký doanh nghiệp
            </h3>

            <div className={styles.content}>
                <p>Kính gửi: <strong>{data.kinhGui}</strong></p>
                <Line label="Tên doanh nghiệp (ghi bằng chữ in hoa)" value={data.tenDoanhNghiep} />
                <Line label="Mã số doanh nghiệp/Mã số thuế" value={data.maSoDoanhNghiep} />

                <Section title="Nội dung doanh nghiệp kê khai">
                    <table className={styles.borderTable}>
                        <tbody>
                            {MAIN_CHANGE_OPTIONS.map((option) => (
                                <tr key={option.value}>
                                    <td>{option.label}</td>
                                    <td style={{ textAlign: "center", width: 48 }}>
                                        <Checkbox checked={mainOption === option.value} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>

                {mainOption === "A" && (
                    <>
                        <Section title={selectedMainLabel}>
                            <p>Doanh nghiệp chọn và kê khai các nội dung sau:</p>
                            <table className={styles.borderTable}>
                                <tbody>
                                    {availableAChangeOptions.map((option) => (
                                        <tr key={option.name}>
                                            <td>{option.label}</td>
                                            <td style={{ textAlign: "center", width: 48 }}>
                                                <Checkbox checked={isTruthy(data[option.name])} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>

                        <Section title="Doanh nghiệp đăng ký thay đổi trên cơ sở">
                            <p>
                                Tách doanh nghiệp <Checkbox checked={data.coSoThayDoi === "tach"} />
                                &nbsp;&nbsp; Sáp nhập doanh nghiệp <Checkbox checked={data.coSoThayDoi === "sap_nhap"} />
                            </p>
                            {data.coSoThayDoi === "sap_nhap" && (
                                <>
                                    <Line label="Tên doanh nghiệp bị sáp nhập" value={data.sapNhap_tenDoanhNghiep} />
                                    <Line label="Mã số doanh nghiệp/Mã số thuế của doanh nghiệp bị sáp nhập" value={data.sapNhap_maSoDoanhNghiep} />
                                    <p>
                                        Đề nghị Quý Cơ quan thực hiện chấm dứt tồn tại đối với doanh nghiệp bị sáp nhập và các chi nhánh/văn phòng đại diện/địa điểm kinh doanh của doanh nghiệp bị sáp nhập.
                                    </p>
                                </>
                            )}
                            <p>
                                Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo, xã/phường biên giới, xã/phường ven biển hoặc khu vực ảnh hưởng quốc phòng, an ninh:
                                &nbsp; Có <Checkbox checked={data.anNinhQuocPhong === "Có"} />
                                &nbsp; Không <Checkbox checked={data.anNinhQuocPhong !== "Có"} />
                            </p>
                        </Section>

                        {selectedAOptions.some((option) => option.name === "a_doiTen") && (
                            <Section title="ĐĂNG KÝ THAY ĐỔI TÊN DOANH NGHIỆP">
                                <Line label="Tên doanh nghiệp viết bằng tiếng Việt sau khi thay đổi" value={data.tenSauThayDoiVN} />
                                <Line label="Tên doanh nghiệp viết bằng tiếng nước ngoài sau khi thay đổi" value={data.tenSauThayDoiEN} />
                                <Line label="Tên doanh nghiệp viết tắt sau khi thay đổi" value={data.tenSauThayDoiVietTat} />
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiDiaChi") && (
                            <Section title="ĐĂNG KÝ THAY ĐỔI ĐỊA CHỈ TRỤ SỞ CHÍNH">
                                <Line label="Địa chỉ trụ sở chính sau khi thay đổi" value={addressToString(data.truSo_soNha, data.truSo_xa, data.truSo_tinh)} />
                                <p>
                                    Điện thoại: {data.truSo_phone} &nbsp;&nbsp; Số fax: {data.truSo_fax}
                                </p>
                                <p>
                                    Thư điện tử: {data.truSo_email} &nbsp;&nbsp; Website: {data.truSo_website}
                                </p>
                                <p>
                                    Đồng thời thay đổi địa chỉ nhận thông báo thuế:
                                    <Checkbox checked={isTruthy(data.doiDiaChiNhanThongBaoThue)} />
                                </p>
                                <p>
                                    Doanh nghiệp nằm trong:
                                    &nbsp; Khu công nghiệp <Checkbox checked={isTruthy(data.truSo_loaiKhu_Khu_công_nghiệp)} />
                                    &nbsp; Khu chế xuất <Checkbox checked={isTruthy(data.truSo_loaiKhu_Khu_chế_xuất)} />
                                    &nbsp; Khu kinh tế <Checkbox checked={isTruthy(data.truSo_loaiKhu_Khu_kinh_tế)} />
                                    &nbsp; Khu công nghệ cao <Checkbox checked={isTruthy(data.truSo_loaiKhu_Khu_công_nghệ_cao)} />
                                </p>
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiThanhVien") && (
                            <Section title="ĐĂNG KÝ THAY ĐỔI THÀNH VIÊN CÔNG TY TNHH/THÀNH VIÊN HỢP DANH">
                                <p>Gửi kèm danh sách thành viên theo mẫu tương ứng: <Checkbox checked={isTruthy(data.doiThanhVien_guiKem)} /></p>
                                <Line label="Ghi chú" value={data.doiThanhVien_ghiChu} />
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiVonDieuLe") && (
                            <Section title="ĐĂNG KÝ THAY ĐỔI VỐN ĐIỀU LỆ, PHẦN VỐN GÓP, TỶ LỆ PHẦN VỐN GÓP">
                                <Line label="Vốn điều lệ đã đăng ký" value={`${data.vonDieuLeDaDangKy || ""} ${data.vonDieuLeDaDangKy_bangChu ? `(${data.vonDieuLeDaDangKy_bangChu})` : ""}`} />
                                <Line label="Vốn điều lệ sau khi thay đổi" value={`${data.vonDieuLeSauThayDoi || ""} ${data.vonDieuLeSauThayDoi_bangChu ? `(${data.vonDieuLeSauThayDoi_bangChu})` : ""}`} />
                                <Line label="Giá trị tương đương theo đơn vị tiền nước ngoài" value={data.vonDieuLe_ngoaiTe} />
                                <p>
                                    Hiển thị thông tin ngoại tệ: Có <Checkbox checked={data.hienThiNgoaiTe === "Có"} />
                                    &nbsp; Không <Checkbox checked={data.hienThiNgoaiTe !== "Có"} />
                                </p>
                                <Line label="Thời điểm thay đổi vốn" value={formatDate(data.thoiDiemThayDoiVon)} />
                                <Line label="Hình thức tăng, giảm vốn" value={data.hinhThucTangGiamVon} />
                                <p><strong>Nguồn vốn điều lệ sau khi thay đổi:</strong></p>
                                <MoneySourceTable data={data} />
                                {includeCoPhanFields && <ShareInfoTable data={data} />}
                                <p><strong>Tài sản góp vốn sau khi thay đổi vốn điều lệ:</strong></p>
                                <AssetTable data={data} />
                                <p>Gửi kèm phần vốn góp, tỷ lệ phần vốn góp mới: <Checkbox checked={isTruthy(data.doiVonGop_guiKem)} /></p>
                                <Line label="Cam kết sau khi giảm vốn" value={data.camKetSauGiamVon} />
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiNganhNghe") && (
                            <Section title="THÔNG BÁO THAY ĐỔI NGÀNH, NGHỀ KINH DOANH">
                                <p><strong>1. Bổ sung ngành, nghề kinh doanh sau:</strong></p>
                                <table className={styles.borderTable}>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên ngành, nghề kinh doanh được bổ sung</th>
                                            <th>Mã ngành</th>
                                            <th>Ngành, nghề kinh doanh chính</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderBusinessRows(data.nganhNgheBoSungList)}</tbody>
                                </table>
                                <p><strong>2. Bỏ ngành, nghề kinh doanh sau:</strong></p>
                                <table className={styles.borderTable}>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên ngành, nghề kinh doanh được bỏ</th>
                                            <th>Mã ngành</th>
                                            <th>Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderBusinessRows(data.nganhNgheBoList)}</tbody>
                                </table>
                                <p><strong>3. Sửa đổi chi tiết ngành, nghề kinh doanh sau:</strong></p>
                                <table className={styles.borderTable}>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên ngành, nghề kinh doanh được sửa đổi chi tiết</th>
                                            <th>Mã ngành</th>
                                            <th>Ngành, nghề kinh doanh chính</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderBusinessRows(data.nganhNgheSuaList)}</tbody>
                                </table>
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiVonDauTuDNTN") && (
                            <Section title="ĐĂNG KÝ THAY ĐỔI VỐN ĐẦU TƯ CỦA CHỦ DOANH NGHIỆP TƯ NHÂN">
                                <Line label="Vốn đầu tư đã đăng ký" value={`${data.vonDauTuDaDangKy || ""} ${data.vonDauTuDaDangKy_bangChu ? `(${data.vonDauTuDaDangKy_bangChu})` : ""}`} />
                                <Line label="Vốn đầu tư sau khi thay đổi" value={`${data.vonDauTuSauThayDoi || ""} ${data.vonDauTuSauThayDoi_bangChu ? `(${data.vonDauTuSauThayDoi_bangChu})` : ""}`} />
                                <Line label="Giá trị tương đương theo đơn vị tiền nước ngoài" value={data.vonDauTu_ngoaiTe} />
                                <p>
                                    Hiển thị thông tin ngoại tệ: Có <Checkbox checked={data.vonDauTu_hienThiNgoaiTe === "Có"} />
                                    &nbsp; Không <Checkbox checked={data.vonDauTu_hienThiNgoaiTe !== "Có"} />
                                </p>
                                <Line label="Thời điểm thay đổi vốn" value={formatDate(data.vonDauTu_thoiDiemThayDoi)} />
                                <Line label="Hình thức tăng, giảm vốn" value={data.vonDauTu_hinhThucTangGiam} />
                                <Line label="Tài sản góp vốn sau khi thay đổi vốn đầu tư" value={data.vonDauTu_taiSanGopVon} />
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiNguoiDaiDienUyQuyen") && (
                            <Section title="THÔNG BÁO THAY ĐỔI NGƯỜI ĐẠI DIỆN THEO ỦY QUYỀN">
                                <table className={styles.borderTable}>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Chủ sở hữu/Thành viên/Cổ đông là tổ chức</th>
                                            <th>Tên người đại diện</th>
                                            <th>Ngày sinh</th>
                                            <th>Giới tính</th>
                                            <th>Giấy tờ pháp lý</th>
                                            <th>Quốc tịch</th>
                                            <th>Dân tộc</th>
                                            <th>Địa chỉ liên lạc</th>
                                            <th>Vốn được ủy quyền</th>
                                            <th>Tỷ lệ (%)</th>
                                            <th>Thời điểm đại diện phần vốn</th>
                                            <th>Chữ ký</th>
                                            <th>Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.nguoiDaiDienUyQuyenList?.length ? (
                                            data.nguoiDaiDienUyQuyenList.map((row, index) => (
                                                <tr key={index}>
                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                    <td>{row.chuSoHuu}</td>
                                                    <td>{row.hoTen}</td>
                                                    <td>{row.ngaySinh}</td>
                                                    <td>{row.gioiTinh}</td>
                                                    <td>{row.giayTo}</td>
                                                    <td>{row.quocTich}</td>
                                                    <td>{row.danToc}</td>
                                                    <td>{row.diaChiLienLac}</td>
                                                    <td>{row.tongVonDaiDien}</td>
                                                    <td>{row.tyLe}</td>
                                                    <td>{row.thoiDiemDaiDien}</td>
                                                    <td>{row.chuKy}</td>
                                                    <td>{row.ghiChu}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={14} style={{ textAlign: "center" }}>Không có dữ liệu</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiCoDong") && (
                            <Section title="THÔNG BÁO THAY ĐỔI CỔ ĐÔNG SÁNG LẬP/CỔ ĐÔNG LÀ NHÀ ĐẦU TƯ NƯỚC NGOÀI">
                                <p>Gửi kèm danh sách cổ đông sáng lập theo Mẫu số 7: <Checkbox checked={isTruthy(data.doiCoDongSangLap_guiKem)} /></p>
                                <p>Gửi kèm danh sách cổ đông là nhà đầu tư nước ngoài theo Mẫu số 8: <Checkbox checked={isTruthy(data.doiCoDongNuocNgoai_guiKem)} /></p>
                                <Line label="Ghi chú" value={data.doiCoDong_ghiChu} />
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiThongTinThue") && (
                            <Section title="THÔNG BÁO THAY ĐỔI THÔNG TIN ĐĂNG KÝ THUẾ">
                                <table className={styles.borderTable}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: 50, textAlign: "center" }}>1</td>
                                            <td>
                                                <p>Thông tin về Giám đốc/Tổng giám đốc:</p>
                                                <Line label="Họ, chữ đệm và tên" value={data.giamDoc_hoTen} />
                                                <Line label="Ngày sinh" value={formatDate(data.giamDoc_ngaySinh)} />
                                                <Line label="Giới tính" value={data.giamDoc_gioiTinh} />
                                                <Line label="Số định danh cá nhân" value={data.giamDoc_cccd} />
                                                <Line label="Điện thoại" value={data.giamDoc_phone} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>2</td>
                                            <td>
                                                <p>Thông tin về Kế toán trưởng/Phụ trách kế toán:</p>
                                                <Line label="Họ, chữ đệm và tên" value={data.keToan_hoTen} />
                                                <Line label="Ngày sinh" value={formatDate(data.keToan_ngaySinh)} />
                                                <Line label="Giới tính" value={data.keToan_gioiTinh} />
                                                <Line label="Số định danh cá nhân" value={data.keToan_cccd} />
                                                <Line label="Điện thoại" value={data.keToan_phone} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>3</td>
                                            <td>
                                                <Line label="Địa chỉ nhận thông báo thuế" value={addressToString(data.thongBaoThue_soNha, data.thongBaoThue_xa, data.thongBaoThue_tinh)} />
                                                <p>Điện thoại: {data.thongBaoThue_phone} &nbsp;&nbsp; Fax: {data.thongBaoThue_fax}</p>
                                                <Line label="Thư điện tử" value={data.thongBaoThue_email} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>4</td>
                                            <td><Line label="Ngày bắt đầu hoạt động" value={formatDate(data.ngayBatDauHoatDong)} /></td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>5</td>
                                            <td>
                                                Hạch toán độc lập <Checkbox checked={data.hinhThucHachToan !== "phu_thuoc"} />
                                                &nbsp; Có báo cáo tài chính hợp nhất <Checkbox checked={data.baoCaoTaiChinhHopNhat === "co"} />
                                                &nbsp; Hạch toán phụ thuộc <Checkbox checked={data.hinhThucHachToan === "phu_thuoc"} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>6</td>
                                            <td>Năm tài chính: áp dụng từ ngày {data.namTaiChinh_tuNgay || "01/01"} đến ngày {data.namTaiChinh_denNgay || "31/12"}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>7</td>
                                            <td>Tổng số lao động: {data.tongSoLaoDong}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>8</td>
                                            <td>
                                                Có hoạt động theo dự án BOT/BTO/BT/BOO, BLT, BTL, O&M không?
                                                &nbsp; Có <Checkbox checked={data.hoatDongDuAn === "co"} />
                                                &nbsp; Không <Checkbox checked={data.hoatDongDuAn !== "co"} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>9</td>
                                            <td>
                                                Phương pháp tính thuế GTGT:
                                                &nbsp; Khấu trừ <Checkbox checked={!data.phuongPhapTinhThueGTGT || data.phuongPhapTinhThueGTGT === "khau_tru"} />
                                                &nbsp; Trực tiếp trên GTGT <Checkbox checked={data.phuongPhapTinhThueGTGT === "truc_tiep_gtgt"} />
                                                &nbsp; Trực tiếp trên doanh số <Checkbox checked={data.phuongPhapTinhThueGTGT === "truc_tiep_doanh_so"} />
                                                &nbsp; Không phải nộp thuế GTGT <Checkbox checked={data.phuongPhapTinhThueGTGT === "khong_nop"} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Section>
                        )}

                        {selectedAOptions.some((option) => option.name === "a_doiChuSoHuuHuongLoi") && (
                            <Section title="THÔNG BÁO THAY ĐỔI THÔNG TIN VỀ CHỦ SỞ HỮU HƯỞNG LỢI">
                                <p>Gửi kèm Mẫu số 10: <Checkbox checked={isTruthy(data.cshhl_mau10_guiKem)} /></p>
                                <p>Gửi kèm Mẫu số 11: <Checkbox checked={isTruthy(data.cshhl_mau11_guiKem)} /></p>
                                <Line label="Ghi chú" value={data.cshhl_ghiChu} />
                            </Section>
                        )}
                    </>
                )}

                {mainOption === "B" && (
                    <Section title={selectedMainLabel}>
                        <Line label="Nội dung bổ sung, cập nhật thông tin đăng ký doanh nghiệp" value={data.boSungCapNhat_noiDung} />
                    </Section>
                )}

                {mainOption === "C" && (
                    <Section title={selectedMainLabel}>
                        <Line label="Thông tin trên Giấy chứng nhận/Giấy xác nhận cấp ngày" value={formatDate(data.hieuDinh_ngayCapGiay)} />
                        <Line label="Là" value={data.hieuDinh_thongTinTrenGiay} />
                        <Line label="Thông tin đã đăng ký trong hồ sơ nộp ngày" value={formatDate(data.hieuDinh_ngayNopHoSo)} />
                        <Line label="Là" value={data.hieuDinh_thongTinHoSo} />
                        <p>
                            Do vậy, đề nghị Quý Cơ quan hiệu đính thông tin trên Giấy chứng nhận đăng ký doanh nghiệp, Giấy xác nhận về việc thay đổi nội dung đăng ký doanh nghiệp theo đúng thông tin trong hồ sơ đăng ký doanh nghiệp mà doanh nghiệp đã đăng ký.
                        </p>
                    </Section>
                )}

                <p style={{ marginTop: 16 }}>
                    Đề nghị Quý Cơ quan cấp Giấy xác nhận thay đổi nội dung đăng ký doanh nghiệp cho doanh nghiệp đối với các thông tin thay đổi nêu trên.
                    <Checkbox checked={isTruthy(data.deNghiCapGiayXacNhan)} />
                </p>
                <p>
                    Trường hợp hồ sơ đăng ký doanh nghiệp hợp lệ, đề nghị Quý Cơ quan đăng công bố nội dung đăng ký doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.
                </p>
                <p>Doanh nghiệp cam kết hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung thực của nội dung Thông báo này.</p>
                <p>Người ký tại Thông báo này cam kết là người có quyền và nghĩa vụ thực hiện thủ tục đăng ký doanh nghiệp theo quy định của pháp luật và Điều lệ công ty.</p>

                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: 30, marginBottom: 50 }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "50%" }}></td>
                            <td className={styles.textCenter} style={{ verticalAlign: "top" }}>
                                <p>
                                    <strong>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT/CHỦ TỊCH CÔNG TY/NGƯỜI ĐƯỢC ỦY QUYỀN/NGƯỜI ĐẠI DIỆN</strong>
                                    <br />
                                    (<em>Ký và ghi họ tên</em>)
                                </p>
                                {data.nguoiKy_thongTin && <p>{data.nguoiKy_thongTin}</p>}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GiayDeNghiDangKyThayDoiConfirmation;
