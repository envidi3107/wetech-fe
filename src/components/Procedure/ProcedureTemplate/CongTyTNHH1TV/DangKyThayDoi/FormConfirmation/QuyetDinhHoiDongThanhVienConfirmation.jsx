import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import { formatDate } from "@/utils/dateTimeUtils";
import {
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

function isEmptyValue(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function parseNumber(value) {
    if (isEmptyValue(value)) return null;

    const normalized = String(value)
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}

function formatNumber(value) {
    if (isEmptyValue(value)) return "";

    const parsed = typeof value === "number" ? value : parseNumber(value);
    return parsed === null ? String(value).trim() : parsed.toLocaleString("vi-VN");
}

function formatUnitValue(value, unit) {
    if (isEmptyValue(value)) return "";

    const displayValue = formatNumber(value);
    if (unit === "%" && String(displayValue).includes("%")) return displayValue;
    if (unit !== "%" && /(VNĐ|VND)/i.test(String(displayValue))) return displayValue;
    return `${displayValue} ${unit}`;
}

function getFullCompanyName(value, prefix = DEFAULT_TNHH_COMPANY_NAME_PREFIX) {
    if (!value) return "";

    const displayValue = String(value).trim();
    const upperDisplayValue = displayValue.toLocaleUpperCase("vi-VN");
    const alreadyHasPrefix = TNHH_COMPANY_NAME_PREFIX_OPTIONS.some((knownPrefix) =>
        upperDisplayValue.startsWith(knownPrefix.toLocaleUpperCase("vi-VN")),
    );

    return alreadyHasPrefix ? displayValue : `${prefix} ${displayValue}`;
}

function getDecisionCompanyName(data) {
    return getFullCompanyName(
        data.tenDoanhNghiep || data.tenSauThayDoiVN,
        data.tenCongTyPrefix || data.tenSauThayDoiPrefix || DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    );
}

function getChangedCompanyName(data) {
    return getFullCompanyName(
        data.tenSauThayDoiVN || data.tenDoanhNghiep,
        data.tenSauThayDoiPrefix || data.tenCongTyPrefix || DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    );
}

function splitDate(value) {
    if (!value) return { day: "…", month: "…", year: "…" };
    const normalized = formatDate(value);
    const [day, month, year] = normalized.split("/");
    return {
        day: day || "…",
        month: month || "…",
        year: year || "…",
    };
}

function formatDecisionDate(place, value) {
    const { day, month, year } = splitDate(value);
    place = place.replace("Tỉnh", "");
    place = place.replace("Thành phố", "");
    return `${place || "…"}, ngày ${day} tháng ${month} năm ${year}`;
}

function getCapitalChangeVerb(data) {
    const text = data.hinhThucTangGiamVon || data.qdHinhThucTangGiamVon || "";
    const lowered = text.toLocaleLowerCase("vi-VN");
    if (lowered.includes("giảm")) return "giảm";
    if (lowered.includes("tăng")) return "tăng";

    const diff = parseNumber(data.qdVonChenhLechRaw);
    if (diff < 0) return "giảm";
    if (diff > 0) return "tăng";
    return "tăng/giảm";
}

function SectionTitle({ children }) {
    return (
        <p style={{ fontWeight: 700, marginTop: 12 }}>
            <strong>{children}</strong>
        </p>
    );
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
        <table className={styles.borderTable}>
            <thead>
                <tr>
                    <th>Loại nguồn vốn</th>
                    <th>Số tiền</th>
                    <th style={{ width: 90 }}>Tỷ lệ (%)</th>
                </tr>
            </thead>
            <tbody>
                {rows.map(([label, prefix]) => (
                    <tr key={prefix}>
                        <td>{label}</td>
                        <td>{formatUnitValue(data[`${prefix}_soTien`], "VNĐ")}</td>
                        <td style={{ textAlign: "center" }}>{formatUnitValue(data[`${prefix}_tyLe`], "%")}</td>
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
        ["6", "Các tài sản khác", "taiSan_khac"],
        ["", "Tổng số", "taiSan_tongSo"],
    ];

    return (
        <table className={styles.borderTable}>
            <thead>
                <tr>
                    <th style={{ width: 45 }}>STT</th>
                    <th>Tài sản góp vốn</th>
                    <th>Giá trị vốn</th>
                    <th style={{ width: 90 }}>Tỷ lệ (%)</th>
                </tr>
            </thead>
            <tbody>
                {rows.map(([stt, label, prefix]) => (
                    <tr key={prefix}>
                        <td style={{ textAlign: "center" }}>{stt}</td>
                        <td>
                            {label}
                            {prefix === "taiSan_khac" && data.taiSan_khac_loaiTaiSan
                                ? `: ${data.taiSan_khac_loaiTaiSan}`
                                : ""}
                        </td>
                        <td>{formatUnitValue(data[`${prefix}_giaTri`], "VNĐ")}</td>
                        <td style={{ textAlign: "center" }}>{formatUnitValue(data[`${prefix}_tyLe`], "%")}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function BusinessTable({ title, rows, removed = false }) {
    if (!rows?.length) return null;

    return (
        <>
            <p>
                <strong>{title}</strong>
            </p>
            <table className={styles.borderTable}>
                <thead>
                    <tr>
                        <th style={{ width: 45 }}>STT</th>
                        <th>
                            {removed
                                ? "Tên ngành, nghề kinh doanh được bỏ khỏi danh sách đã đăng ký"
                                : "Tên ngành, nghề kinh doanh"}
                        </th>
                        <th style={{ width: 100 }}>Mã ngành</th>
                        {!removed && <th style={{ width: 125 }}>Ngành nghề chính</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td>
                                <div>{row.tenNganh}</div>
                                {row.chiTiet && <div style={{ fontStyle: "italic" }}>{row.chiTiet}</div>}
                            </td>
                            <td style={{ textAlign: "center" }}>{row.maNganh}</td>
                            {!removed && <td style={{ textAlign: "center" }}>{row.laNganhChinh ? "X" : ""}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

function CapitalChangeSection({ data }) {
    const verb = getCapitalChangeVerb(data);
    const contributionRows = data.qdThanhVienGopVonList || [];

    return (
        <>
            <SectionTitle>Thay đổi vốn điều lệ</SectionTitle>
            <p>Vốn điều lệ đã đăng ký: {formatUnitValue(data.vonDieuLeDaDangKy, "VNĐ")}</p>
            <p>Vốn điều lệ sau khi thay đổi: {formatUnitValue(data.vonDieuLeSauThayDoi, "VNĐ")}</p>
            <p>Hình thức tăng/giảm vốn: {data.qdHinhThucTangGiamVon || data.hinhThucTangGiamVon || "…"}</p>
            <p>Thời điểm tăng/giảm vốn: {formatDate(data.thoiDiemThayDoiVon) || "…/…/…"}</p>

            {contributionRows.length > 0 && (
                <>
                    <p>Trong đó:</p>
                    {contributionRows.map((row, index) => (
                        <p key={index}>
                            {row.danhXung || "Ông/Bà"} {row.hoTen || "…"} {verb}{" "}
                            {formatUnitValue(row.giaTriTangGiam || data.qdVonChenhLech, "VNĐ")}
                        </p>
                    ))}
                </>
            )}

            <p>Nguồn vốn điều lệ sau khi thay đổi vốn điều lệ:</p>
            <MoneySourceTable data={data} />

            <p>Tài sản góp vốn sau khi thay đổi vốn điều lệ:</p>
            <AssetTable data={data} />

            {contributionRows.length > 0 && (
                <>
                    <p>Cơ cấu góp vốn khi thay đổi vốn điều lệ:</p>
                    {contributionRows.map((row, index) => (
                        <p key={index}>
                            {row.danhXung || "Ông/Bà"} {row.hoTen || "…"} góp {formatUnitValue(row.phanVonSauThayDoi, "VNĐ")}, chiếm{" "}
                            {formatUnitValue(row.tyLeSauThayDoi, "%")} vốn điều lệ.
                        </p>
                    ))}
                </>
            )}
        </>
    );
}

function RepresentativeChangeSection({ data }) {
    if (!isTruthy(data.qdDoiNguoiDaiDienPhapLuat)) return null;

    return (
        <>
            <SectionTitle>Thay đổi Người đại diện pháp luật</SectionTitle>
            <p>Người đại diện theo pháp luật sau khi thay đổi:</p>
            <p>Họ, chữ đệm và tên: {(data.qdNguoiDaiDien_hoTen || "").toLocaleUpperCase("vi-VN") || "…"}</p>
            <p>Ngày, tháng, năm sinh: {formatDate(data.qdNguoiDaiDien_ngaySinh) || "…"}</p>
            <p>Giới tính: {data.qdNguoiDaiDien_gioiTinh || "…"}</p>
            <p>Số định danh cá nhân: {data.qdNguoiDaiDien_cccd || "…"}</p>
            <p>Chức danh: {data.qdNguoiDaiDien_chucDanh || "…"}</p>
            <p>Địa chỉ liên lạc: {data.qdNguoiDaiDien_diaChi || "…"}</p>
            <p>
                Điện thoại: {data.qdNguoiDaiDien_phone || "…"} &nbsp;&nbsp; Thư điện tử:{" "}
                {data.qdNguoiDaiDien_email || "…"}
            </p>
        </>
    );
}

function QuyetDinhHoiDongThanhVienConfirmation({ dataJson }) {
    const data = normalizeDataJson(dataJson);

    if (!Object.keys(data).length) {
        return <div className={styles.emptyMessage}>Đang tải dữ liệu...</div>;
    }

    const companyName = getDecisionCompanyName(data);
    const changedCompanyName = getChangedCompanyName(data);
    const upperCompanyName = companyName.toLocaleUpperCase("vi-VN");

    return (
        <div className={styles.container}>
            <table className={styles.noBorderTable} style={{ width: "100%", marginBottom: 16 }}>
                <tbody>
                    <tr>
                        <td className={styles.textCenter} style={{ width: "42%", verticalAlign: "top" }}>
                            <p>
                                <strong>{upperCompanyName || "CÔNG TY TNHH …"}</strong>
                            </p>
                            <p style={{ margin: 0, lineHeight: 0.5, marginTop: "-10px" }}>-------</p>
                        </td>
                        <td className={styles.textCenter} style={{ verticalAlign: "top" }}>
                            <p>
                                <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong> <br />
                                <strong>Độc lập - Tự do - Hạnh phúc</strong>
                            </p>
                            <p style={{ margin: 0, lineHeight: 0.5, marginTop: "-10px" }}>---------------</p>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.textCenter} style={{ verticalAlign: "bottom" }}>
                            <p>Số: 01/2026/QĐ</p>
                        </td>
                        <td className={styles.textCenter} style={{ verticalAlign: "bottom" }}>
                            <p style={{ fontStyle: "italic" }}>
                                {formatDecisionDate(data.qdDiaDiemLap, data.qdNgayQuyetDinh)}
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2 className={styles.docTitle}>QUYẾT ĐỊNH HỘI ĐỒNG THÀNH VIÊN</h2>
            <h2 className={styles.docTitle}>{upperCompanyName || "CÔNG TY TNHH …"}</h2>
            <p className={styles.textCenter} style={{ fontStyle: "italic", marginBottom: 2 }}>
                (Về việc thay đổi nội dung đăng ký doanh nghiệp)
            </p>
            <hr style={{ border: "none", borderTop: "1px solid #000", margin: "2px auto", width: "15%" }} />

            <div className={styles.content}>
                <p>
                    - Căn cứ Luật Doanh nghiệp số 59/2020/QH14 được Quốc hội thông qua ngày 17 tháng 06 năm 2020 được
                    sửa đổi, bổ sung một số điều theo luật số 03/2022/QH15 và luật số 76/2025/QH15;
                </p>
                <p>- Căn cứ Nghị định 168/2025/NĐ-CP về đăng ký doanh nghiệp ban hành ngày 30/06/2025;</p>
                <p>
                    - Căn cứ Biên bản họp số: {data.qdSoBienBanHop || "…"} của Hội đồng thành viên{" "}
                    {upperCompanyName || "…"} ngày {formatDate(data.qdNgayBienBanHop) || "…/…/…"} về việc thay đổi nội
                    dung đăng ký doanh nghiệp;
                </p>
                <p>- Căn cứ Điều lệ {upperCompanyName || "…"}.</p>

                <p className={styles.textCenter}>
                    <strong>QUYẾT ĐỊNH:</strong>
                </p>

                <p>
                    <strong>Điều 1: Thay đổi nội dung đăng ký doanh nghiệp</strong>
                </p>

                {isTruthy(data.a_doiVonDieuLe) && <CapitalChangeSection data={data} />}

                {isTruthy(data.a_doiNganhNghe) && (
                    <>
                        <SectionTitle>Thay đổi ngành, nghề kinh doanh</SectionTitle>
                        <BusinessTable title="Bổ sung ngành, nghề kinh doanh sau:" rows={data.nganhNgheBoSungList} />
                        <BusinessTable title="Bỏ ngành, nghề kinh doanh sau:" rows={data.nganhNgheBoList} removed />
                        <BusinessTable
                            title="Sửa đổi chi tiết ngành, nghề kinh doanh sau:"
                            rows={data.nganhNgheSuaList}
                        />
                    </>
                )}

                {isTruthy(data.a_doiTen) && (
                    <>
                        <SectionTitle>Thay đổi tên doanh nghiệp</SectionTitle>
                        <p>Tên doanh nghiệp sau khi thay đổi</p>
                        <p>
                            Tên doanh nghiệp viết bằng tiếng Việt sau khi thay đổi:{" "}
                            {changedCompanyName.toLocaleUpperCase("vi-VN") || "…"}
                        </p>
                        <p>
                            Tên doanh nghiệp viết bằng tiếng nước ngoài sau khi thay đổi: {data.tenSauThayDoiEN || "…"}
                        </p>
                        <p>Tên doanh nghiệp viết tắt sau khi thay đổi: {data.tenSauThayDoiVietTat || "…"}</p>
                    </>
                )}

                {isTruthy(data.a_doiDiaChi) && (
                    <>
                        <SectionTitle>Thay đổi địa chỉ trụ sở chính</SectionTitle>
                        <p>Địa chỉ trụ sở chính sau khi thay đổi:</p>
                        <p>
                            Số nhà/phòng, ngách/hẻm, ngõ/kiệt, đường/phố/đại lộ, tổ/xóm/ấp/thôn:{" "}
                            {data.truSo_soNha || "…"}
                        </p>
                        <p>Xã/Phường/Đặc khu: {data.truSo_xa || "…"}</p>
                        <p>Tỉnh/Thành phố trực thuộc trung ương: {data.truSo_tinh || "…"}</p>
                        <p>
                            Điện thoại: {data.truSo_phone || "…"} &nbsp;&nbsp; Số fax: {data.truSo_fax || "…"}
                        </p>
                        <p>
                            Thư điện tử: {data.truSo_email || "…"} &nbsp;&nbsp; Website: {data.truSo_website || "…"}
                        </p>
                    </>
                )}

                <RepresentativeChangeSection data={data} />

                <p>
                    <strong>Điều 2: </strong>Sửa đổi điều lệ công ty tương ứng với các mục đã nêu tại điều 1.
                </p>
                <p>
                    <strong>Điều 3: </strong>Giao cho {data.qdNguoiThucHienThuTuc_danhXung || "Ông/Bà"}{" "}
                    {data.qdNguoiThucHienThuTuc || "…"} tiến hành các thủ tục
                    cần thiết theo quy định của pháp luật.
                </p>
                <p>
                    <strong>Điều 4: </strong>Người đại diện theo pháp luật của công ty, các thành viên công ty có trách
                    nhiệm thi hành Quyết định này.
                </p>
                <p>
                    <strong>Điều 5: </strong>Quyết định này có hiệu lực kể từ ngày ký.
                </p>

                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: 24 }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "48%", verticalAlign: "top" }}>
                                <p>
                                    <strong>Nơi nhận:</strong>
                                </p>
                                <p>- Như Điều 3 (để thực hiện);</p>
                                <p>- Phòng ĐKKD - Sở TC (để đăng ký);</p>
                                <p>- Lưu.</p>
                            </td>
                            <td className={styles.textCenter} style={{ verticalAlign: "top" }}>
                                <p>
                                    <strong>TM. HỘI ĐỒNG THÀNH VIÊN</strong>
                                </p>
                                <p>
                                    <strong>CHỦ TỊCH HỘI ĐỒNG THÀNH VIÊN</strong>
                                </p>
                                <p>
                                    <em>(ký, ghi rõ họ tên)</em>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuyetDinhHoiDongThanhVienConfirmation;
