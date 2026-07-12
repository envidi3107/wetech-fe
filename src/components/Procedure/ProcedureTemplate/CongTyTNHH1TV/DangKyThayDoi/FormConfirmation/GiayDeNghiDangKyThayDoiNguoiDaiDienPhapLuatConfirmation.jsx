import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import { formatDate } from "@/utils/dateTimeUtils";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS,
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

function Line({ label, value }) {
    return (
        <p>
            {label}: {value || ""}
        </p>
    );
}

function InlineField({ children, marginLeft = "36pt" }) {
    return (
        <span
            className={`${styles.inlineField} inlineField`}
            style={{
                display: "inline-block",
                marginLeft,
                fontWeight: "inherit",
                fontStyle: "normal",
            }}
        >
            {children}
        </span>
    );
}

function isEmptyValue(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function withCompanyNamePrefix(value, prefix) {
    if (isEmptyValue(value)) return "";

    const displayValue = String(value).trim();
    const upperDisplayValue = displayValue.toLocaleUpperCase("vi-VN");
    const knownPrefixes = [...TNHH_COMPANY_NAME_PREFIX_OPTIONS, ...CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS];
    const alreadyHasPrefix = knownPrefixes.some((knownPrefix) =>
        upperDisplayValue.startsWith(knownPrefix.toLocaleUpperCase("vi-VN")),
    );

    return alreadyHasPrefix ? displayValue : `${prefix} ${displayValue}`;
}

function AddressFields({ soNha, xa, tinh }) {
    return (
        <>
            <Line label="Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn" value={soNha} />
            <Line label="Xã/Phường/Đặc khu" value={xa} />
            <Line label="Tỉnh/Thành phố trực thuộc trung ương" value={tinh} />
        </>
    );
}

function GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatConfirmation({
    dataJson,
    companyNamePrefixOptions = TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    defaultCompanyNamePrefix = DEFAULT_TNHH_COMPANY_NAME_PREFIX,
}) {
    const data = normalizeDataJson(dataJson);

    if (!Object.keys(data).length) {
        return <p className={styles.emptyMessage}>Đang tải dữ liệu...</p>;
    }

    const companyNamePrefix = getCompanyNamePrefix(data, defaultCompanyNamePrefix, companyNamePrefixOptions);
    const companyName = withCompanyNamePrefix(data.tenDoanhNghiep || data.tenCongTyVN, companyNamePrefix);

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
                <Line label="Tên doanh nghiệp (ghi bằng chữ in hoa)" value={companyName} />
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
                <p>Địa chỉ liên lạc:</p>
                <AddressFields
                    soNha={data.nguoiDaiDien_soNha}
                    xa={data.nguoiDaiDien_xa}
                    tinh={data.nguoiDaiDien_tinh}
                />
                <p>
                    Điện thoại: {data.nguoiDaiDien_phone || ""}
                    <InlineField>Thư điện tử: {data.nguoiDaiDien_email || ""}</InlineField>
                </p>

                <p style={{ marginTop: 16, fontStyle: "italic" }}>
                    Trường hợp không có số định danh cá nhân hoặc việc kết nối giữa Cơ sở dữ liệu quốc gia về đăng ký
                    doanh nghiệp với Cơ sở dữ liệu quốc gia về dân cư bị gián đoạn thì kê khai các thông tin cá nhân
                    dưới đây:
                </p>

                <table className={styles.borderTable} style={{ width: "calc(100% - 20px)" }}>
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    Dân tộc: {data.nguoiDaiDien_danToc || ""}
                                    <InlineField>Quốc tịch: {data.nguoiDaiDien_quocTich || ""}</InlineField>
                                </p>
                                <Line
                                    label="Số Hộ chiếu (đối với cá nhân Việt Nam không có số định danh cá nhân)/Số Hộ chiếu nước ngoài hoặc giấy tờ có giá trị thay thế hộ chiếu nước ngoài (đối với cá nhân là người nước ngoài)"
                                    value={data.nguoiDaiDien_soHoChieu}
                                />
                                <p>
                                    Ngày cấp: {formatDate(data.nguoiDaiDien_ngayCapHoChieu)}
                                    <InlineField>Nơi cấp: {data.nguoiDaiDien_noiCapHoChieu || ""}</InlineField>
                                </p>
                                <p>Nơi thường trú:</p>
                                <AddressFields
                                    soNha={data.nguoiDaiDien_thuongTru_soNha}
                                    xa={data.nguoiDaiDien_thuongTru_xa}
                                    tinh={data.nguoiDaiDien_thuongTru_tinh}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ width: "100%", marginTop: 16 }}>
                    Trường hợp hồ sơ đăng ký doanh nghiệp hợp lệ, đề nghị Quý Cơ quan đăng công bố nội dung đăng ký
                    doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.
                </p>
                <p>
                    Doanh nghiệp cam kết hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung
                    thực của nội dung Giấy đề nghị này.
                </p>

                <table
                    className={`${styles.noBorderTable} signature-table no-border`}
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "none",
                        marginTop: 30,
                        marginBottom: 50,
                    }}
                >
                    <tbody>
                        <tr>
                            <td className="signature-spacer" style={{ border: "none", width: "50%" }}></td>
                            <td
                                className={`${styles.textCenter} signature-cell`}
                                style={{ border: "none", textAlign: "center", verticalAlign: "top" }}
                            >
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    <strong>
                                        CHỦ TỊCH CÔNG TY/CHỦ TỊCH HỘI ĐỒNG THÀNH VIÊN/CHỦ TỊCH HỘI ĐỒNG QUẢN TRỊ/NGƯỜI
                                        ĐƯỢC ỦY QUYỀN/NGƯỜI ĐẠI DIỆN
                                    </strong>
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

export default GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatConfirmation;
