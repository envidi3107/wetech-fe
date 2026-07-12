import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import CurrentDate from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CurrentDate/CurrentDate";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import { formatDate } from "@/utils/dateTimeUtils";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS,
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const Checkbox = ({ checked }) => (
    <span
        className={`${styles.checkbox} checkbox-symbol`}
        style={{
            display: "inline-block",
            fontWeight: "inherit",
            fontStyle: "normal",
            fontSize: "var(--procedure-confirmation-checkbox-font-size, 18pt)",
            lineHeight: 1,
            margin: "0 6pt",
            minWidth: "18pt",
            textAlign: "center",
            verticalAlign: "middle",
        }}
    >
        {"\u00A0"}
        {checked ? "\u2612" : "\u2610"}
        {"\u00A0"}
    </span>
);

const TOOLTIP = {
    giayToPhapLy: "Nếu kê khai số định danh cá nhân thì không phải kê khai quốc tịch, dân tộc.",
    vonDuocUyQuyen:
        "Tổng giá trị vốn được đại diện ghi bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài, nếu có.",
    tyLe: "Tỷ lệ phần vốn được ủy quyền đại diện trên tổng số vốn điều lệ của công ty.",
    chuKy: "Người đại diện theo pháp luật/người đại diện theo ủy quyền ký tại cột này trên bản hồ sơ.",
};

function Line({ label, value }) {
    return (
        <p>
            {label}: {value || ""}
        </p>
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

function IndividualOwner({ data }) {
    return (
        <>
            <p>
                <strong>1. Đối với chủ sở hữu là cá nhân</strong>
            </p>
            <Line label="Họ, chữ đệm và tên chủ sở hữu" value={data.chuSoHuu_hoTen} />
            <Line label="Ngày, tháng, năm sinh" value={formatDate(data.chuSoHuu_ngaySinh)} />
            <Line label="Giới tính" value={data.chuSoHuu_gioiTinh} />
            <Line label="Số định danh cá nhân" value={data.chuSoHuu_cccd} />
            <p>Địa chỉ liên lạc:</p>
            <AddressFields soNha={data.chuSoHuu_soNha} xa={data.chuSoHuu_xa} tinh={data.chuSoHuu_tinh} />
            <p>
                Điện thoại: {data.chuSoHuu_phone || ""}
                &nbsp;&nbsp; Thư điện tử: {data.chuSoHuu_email || ""}
            </p>
            <p style={{ fontStyle: "italic" }}>
                Trường hợp không có số định danh cá nhân hoặc việc kết nối dữ liệu bị gián đoạn thì kê khai các thông
                tin cá nhân dưới đây:
            </p>
            <p>
                Dân tộc: {data.chuSoHuu_danToc || ""}
                &nbsp;&nbsp; Quốc tịch: {data.chuSoHuu_quocTich || ""}
            </p>
            <Line
                label="Số Hộ chiếu/Số Hộ chiếu nước ngoài hoặc giấy tờ có giá trị thay thế"
                value={data.chuSoHuu_soHoChieu}
            />
            <p>
                Ngày cấp: {formatDate(data.chuSoHuu_ngayCapHoChieu)}
                &nbsp;&nbsp; Nơi cấp: {data.chuSoHuu_noiCapHoChieu || ""}
            </p>
            <p>Nơi thường trú:</p>
            <AddressFields
                soNha={data.chuSoHuu_thuongTru_soNha}
                xa={data.chuSoHuu_thuongTru_xa}
                tinh={data.chuSoHuu_thuongTru_tinh}
            />
            <p>
                <strong>
                    Thông tin về Giấy chứng nhận đăng ký đầu tư (chỉ kê khai nếu chủ sở hữu là nhà đầu tư nước ngoài):
                </strong>
            </p>
            <Line label="Mã số dự án" value={data.chuSoHuu_maSoDuAn} />
            <p>
                Ngày cấp: {formatDate(data.chuSoHuu_ngayCapDuAn)}
                &nbsp;&nbsp; Cơ quan cấp: {data.chuSoHuu_coQuanCapDuAn || ""}
            </p>
        </>
    );
}

function OrganizationOwner({ data }) {
    const rows = data.daiDienChuSoHuuList || [];

    return (
        <>
            <p>
                <strong>2. Đối với chủ sở hữu là tổ chức</strong>
            </p>
            <p>
                <strong>Thông tin về tổ chức:</strong>
            </p>
            <Line label="Tên chủ sở hữu" value={data.chuSoHuuToChuc_ten} />
            <Line label="Mã số doanh nghiệp/Số Quyết định thành lập" value={data.chuSoHuuToChuc_maSo} />
            <p>
                Ngày cấp: {formatDate(data.chuSoHuuToChuc_ngayCap)}
                &nbsp;&nbsp; Nơi cấp: {data.chuSoHuuToChuc_noiCap || ""}
            </p>
            <p>Địa chỉ trụ sở chính:</p>
            <AddressFields
                soNha={data.chuSoHuuToChuc_soNha}
                xa={data.chuSoHuuToChuc_xa}
                tinh={data.chuSoHuuToChuc_tinh}
            />
            <p>
                Điện thoại: {data.chuSoHuuToChuc_phone || ""}
                &nbsp;&nbsp; Số fax: {data.chuSoHuuToChuc_fax || ""}
            </p>
            <p>
                Thư điện tử: {data.chuSoHuuToChuc_email || ""}
                &nbsp;&nbsp; Website: {data.chuSoHuuToChuc_website || ""}
            </p>
            <p>
                <strong>Mô hình tổ chức công ty:</strong>
            </p>
            <p>
                Hội đồng thành viên, Giám đốc hoặc Tổng Giám đốc{" "}
                <Checkbox checked={data.moHinhToChuc !== "chu_tich_cong_ty"} />
            </p>
            <p>
                Chủ tịch công ty, Giám đốc hoặc Tổng Giám đốc{" "}
                <Checkbox checked={data.moHinhToChuc === "chu_tich_cong_ty"} />
            </p>
            <p>
                <strong>Thông tin về người đại diện theo pháp luật/người đại diện theo ủy quyền của chủ sở hữu:</strong>
            </p>
            <table className={styles.borderTable}>
                <thead>
                    <tr>
                        <th>
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
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Tên người đại diện theo pháp luật/người đại diện theo ủy quyền
                            </p>
                        </th>
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Ngày, tháng, năm sinh
                            </p>
                        </th>
                        <th>
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
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                                <InfoTooltip content={TOOLTIP.giayToPhapLy} />
                            </p>
                        </th>
                        <th>
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
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Dân tộc
                            </p>
                        </th>
                        <th>
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
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Vốn được ủy quyền
                                <InfoTooltip content={TOOLTIP.vonDuocUyQuyen} />
                            </p>
                        </th>
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Tỷ lệ (%)
                                <InfoTooltip content={TOOLTIP.tyLe} />
                            </p>
                        </th>
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Thời điểm đại diện phần vốn
                            </p>
                        </th>
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Chữ ký
                                <InfoTooltip content={TOOLTIP.chuKy} />
                            </p>
                        </th>
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Ghi chú (nếu có)
                            </p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length ? (
                        rows.map((row, index) => (
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
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {row.hoTen}
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
                                        {formatDate(row.ngaySinh)}
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
                                        {row.gioiTinh}
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
                                        {row.giayToPhapLy}
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
                                        {row.quocTich}
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
                                        {row.danToc}
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
                                        {row.diaChiLienLac}
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
                                        {row.vonDuocUyQuyen}
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
                                        {row.tyLe}
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
                                        {row.thoiDiemDaiDien}
                                    </p>
                                </td>
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
                                        {row.ghiChu}
                                    </p>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={13} style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Không có dữ liệu
                                </p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

function GiayDeNghiDangKyThayDoiChuSoHuuConfirmation({
    dataJson,
    defaultCompanyNamePrefix = DEFAULT_TNHH_COMPANY_NAME_PREFIX,
}) {
    const data = normalizeDataJson(dataJson);
    const companyNamePrefix = getCompanyNamePrefix(data, defaultCompanyNamePrefix, TNHH_COMPANY_NAME_PREFIX_OPTIONS);
    const companyName = withCompanyNamePrefix(data.tenDoanhNghiep || data.tenCongTyVN, companyNamePrefix);
    const ownerType = data.loaiChuSoHuu || (data.chuSoHuuToChuc_ten ? "to_chuc" : "ca_nhan");

    if (!Object.keys(data).length) {
        return <p className={styles.emptyMessage}>Đang tải dữ liệu...</p>;
    }

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
            <h3 className={styles.docTitle}>Đăng ký thay đổi chủ sở hữu công ty TNHH một thành viên</h3>

            <div className={styles.content}>
                <p>Kính gửi: {data.kinhGui}</p>
                <Line label="Tên doanh nghiệp (ghi bằng chữ in hoa)" value={companyName} />
                <Line label="Mã số doanh nghiệp/Mã số thuế" value={data.maSoDoanhNghiep} />
                <p>
                    Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo, xã/phường biên giới, xã/phường ven biển
                    hoặc khu vực khác có ảnh hưởng đến quốc phòng, an ninh: &nbsp; Có{" "}
                    <Checkbox checked={data.anNinhQuocPhong === "Có"} />
                    &nbsp; Không <Checkbox checked={data.anNinhQuocPhong !== "Có"} />
                </p>

                <p style={{ marginTop: 16 }}>
                    <strong>
                        Đăng ký thay đổi chủ sở hữu công ty TNHH một thành viên với thông tin sau khi thay đổi như sau:
                    </strong>
                </p>
                {ownerType === "to_chuc" ? <OrganizationOwner data={data} /> : <IndividualOwner data={data} />}

                <p style={{ marginTop: 16 }}>
                    Trường hợp hồ sơ đăng ký doanh nghiệp hợp lệ, đề nghị Quý Cơ quan đăng công bố nội dung đăng ký
                    doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.
                </p>
                <p>
                    Doanh nghiệp cam kết hoàn toàn chịu trách nhiệm trước pháp luật về tính hợp pháp, chính xác và trung
                    thực của nội dung Giấy đề nghị này.
                </p>
                <p>
                    Người ký tại Giấy đề nghị này cam kết là người có quyền và nghĩa vụ thực hiện thủ tục đăng ký doanh
                    nghiệp theo quy định của pháp luật và Điều lệ công ty.
                </p>

                <table
                    className={`${styles.noBorderTable} signature-even-table no-border`}
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
                            <td
                                className={`${styles.textCenter} signature-cell`}
                                style={{ border: "none", width: "50%", textAlign: "center", verticalAlign: "top" }}
                            >
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    <strong>CHỦ SỞ HỮU MỚI</strong>
                                </p>
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    <em>(Ký và ghi họ tên)</em>
                                </p>
                            </td>
                            <td
                                className={`${styles.textCenter} signature-cell`}
                                style={{ border: "none", width: "50%", textAlign: "center", verticalAlign: "top" }}
                            >
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    <strong>CHỦ SỞ HỮU CŨ</strong>
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

export default GiayDeNghiDangKyThayDoiChuSoHuuConfirmation;
