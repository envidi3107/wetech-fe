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

const VOTE_FIELDS = [
    { name: "hopLe", label: "Tổng số phiếu biểu quyết hợp lệ", defaultType: "total" },
    { name: "khongHopLe", label: "Tổng số phiếu biểu quyết không hợp lệ", defaultType: "zero" },
    { name: "tanThanh", label: "Tổng số phiếu tán thành", defaultType: "total" },
    { name: "khongTanThanh", label: "Tổng số phiếu không tán thành", defaultType: "zero" },
    { name: "khongYKien", label: "Tổng số phiếu không có ý kiến", defaultType: "zero" },
];
const MEMBER_POSITION_OPTIONS = ["Chủ tịch hội đồng thành viên", "Thành viên"];

function getDefaultMemberPosition(index) {
    return index === 0 ? MEMBER_POSITION_OPTIONS[0] : MEMBER_POSITION_OPTIONS[1];
}

function parseNumber(value) {
    if (value === null || value === undefined || value === "") return null;

    const normalized = String(value)
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}

function formatNumber(value) {
    if (value === null || value === undefined || value === "") return "";
    const parsed = typeof value === "number" ? value : parseNumber(value);
    return parsed === null ? String(value) : parsed.toLocaleString("vi-VN");
}

function getCapitalDifference(data) {
    const before = parseNumber(data.vonDieuLeDaDangKy);
    const after = parseNumber(data.vonDieuLeSauThayDoi);
    return before === null || after === null ? null : after - before;
}

function isCapitalIncrease(data) {
    const diff = getCapitalDifference(data);
    if (diff !== null) return diff > 0;

    const text = data.hinhThucTangGiamVon || data.qdHinhThucTangGiamVon || "";
    return text.toLocaleLowerCase("vi-VN").includes("tăng");
}

function isEmptyValue(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function isZeroValue(value) {
    if (isEmptyValue(value)) return false;

    const normalizedValue = String(value)
        .trim()
        .replace(/(VNĐ|VND|đồng|%)/gi, "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    return normalizedValue !== "" && !Number.isNaN(Number(normalizedValue)) && Number(normalizedValue) === 0;
}

function formatUnitValue(value, unit) {
    if (isEmptyValue(value)) return "";

    const displayValue = String(value).trim();
    const lowerDisplay = displayValue.toLocaleLowerCase("vi-VN");
    const lowerUnit = String(unit).toLocaleLowerCase("vi-VN");
    const alreadyHasUnit =
        unit === "%"
            ? displayValue.includes("%")
            : lowerDisplay.includes(lowerUnit) || /(VNĐ|VND|đồng)/i.test(displayValue);

    if (alreadyHasUnit || isZeroValue(displayValue)) {
        return displayValue;
    }

    return `${displayValue} ${unit}`;
}

function splitDate(value) {
    if (!value) return { day: "…", month: "…", year: "…" };

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        const parts = String(value).split(/[/-]/);
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                return { day: parts[2], month: parts[1], year: parts[0] };
            }
            return { day: parts[0], month: parts[1], year: parts[2] };
        }
        return { day: "…", month: "…", year: "…" };
    }

    return {
        day: String(date.getDate()).padStart(2, "0"),
        month: String(date.getMonth() + 1).padStart(2, "0"),
        year: String(date.getFullYear()),
    };
}

function formatMeetingDate(place, value) {
    const { day, month, year } = splitDate(value);
    const displayPlace = place ? String(place).replace("Tỉnh", "").replace("Thành phố", "").trim() : "…";
    return `${displayPlace}, ngày ${day} tháng ${month} năm ${year}`;
}

function formatMeetingTime(value) {
    if (!value) return "… giờ … phút";

    const match = String(value).match(/^(\d{1,2}):(\d{2})/);
    if (!match) return String(value);

    return `${match[1].padStart(2, "0")} giờ ${match[2]} phút`;
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

function addressToString(soNha, xa, tinh) {
    return [soNha, xa, tinh].filter(Boolean).join(", ");
}

function getHeadOfficeAddress(data) {
    return addressToString(data.truSo_soNha, data.truSo_xa, data.truSo_tinh);
}

function getMeetingMembers(data) {
    const sourceRows = data.qdThanhVienGopVonList || data.doiThanhVienList || data.thanhVienList || [];
    if (sourceRows.length) {
        return sourceRows.map((row, index) => ({
            danhXung: row.danhXung || ((row.gioiTinh || "").toLocaleLowerCase("vi-VN") === "nữ" ? "Bà" : "Ông"),
            hoTen: row.hoTen || row.chuSoHuu || "",
            chucVu: row.chucVu || getDefaultMemberPosition(index),
            phanVonGop: row.phanVonSauThayDoi || row.phanVonGop || "",
            tyLe: row.tyLeSauThayDoi || row.tyLe || "",
            giayChungNhan: row.giayChungNhan || "",
            ngayCap: row.ngayCapGiayChungNhan || "",
        }));
    }

    return [
        {
            danhXung: (data.nguoiDaiDien_gioiTinh || "").toLocaleLowerCase("vi-VN") === "nữ" ? "Bà" : "Ông",
            hoTen: data.nguoiDaiDien_hoTen || data.chuSoHuu_hoTen || "",
            chucVu: getDefaultMemberPosition(0),
            phanVonGop: data.vonDieuLeSauThayDoi || "",
            tyLe: data.vonDieuLeSauThayDoi ? "100" : "",
            giayChungNhan: "",
            ngayCap: "",
        },
    ];
}

function getContributionCertificateText(member, shouldShowCertificate) {
    if (!shouldShowCertificate || (!member.giayChungNhan && !member.ngayCap)) return "";

    const certificateNumber = member.giayChungNhan ? ` số ${member.giayChungNhan}` : "";
    const issuedDate = member.ngayCap ? ` cấp ngày ${formatDate(member.ngayCap)}` : "";

    return ` Giấy chứng nhận phần vốn góp${certificateNumber}${issuedDate}`;
}

function getDefaultVoteTotal(data) {
    if (data.bbTongSoPhieuBieuQuyet) return data.bbTongSoPhieuBieuQuyet;

    const capital = parseNumber(data.vonDieuLeSauThayDoi || data.nguonVon_tongCong_soTien);
    const voteUnit = parseNumber(data.bbMenhGiaPhieuBieuQuyet || "10.000");
    if (!capital || !voteUnit) return "";

    return formatNumber(Math.floor(capital / voteUnit));
}

function getVoteItems(data) {
    const items = [];
    if (isTruthy(data.a_doiVonDieuLe)) items.push({ key: "doiVonDieuLe", label: "thay đổi vốn điều lệ" });
    if (isTruthy(data.a_doiNganhNghe)) items.push({ key: "doiNganhNghe", label: "thay đổi ngành, nghề kinh doanh" });
    if (isTruthy(data.a_doiTen)) items.push({ key: "doiTen", label: "thay đổi tên doanh nghiệp" });
    if (isTruthy(data.a_doiDiaChi)) items.push({ key: "doiDiaChi", label: "thay đổi địa chỉ trụ sở chính" });
    if (isTruthy(data.qdDoiNguoiDaiDienPhapLuat)) {
        items.push({ key: "doiNguoiDaiDienPhapLuat", label: "thay đổi Người đại diện pháp luật" });
    }

    return items.length
        ? items
        : [{ key: "noiDungDangKyDoanhNghiep", label: "thay đổi nội dung đăng ký doanh nghiệp" }];
}

function getVoteFieldName(itemKey, fieldName) {
    return `bbBieuQuyet_${itemKey}_${fieldName}`;
}

function getDefaultVoteValue(totalVotes, defaultType) {
    return defaultType === "total" ? totalVotes || "…" : "0";
}

function getVoteValue(data, itemKey, fieldName, totalVotes) {
    const field = VOTE_FIELDS.find((item) => item.name === fieldName);
    return data[getVoteFieldName(itemKey, fieldName)] || getDefaultVoteValue(totalVotes, field?.defaultType);
}

function getApprovalText(data, item, totalVotes) {
    const approvedVotes = getVoteValue(data, item.key, "tanThanh", totalVotes);
    const validVotes = getVoteValue(data, item.key, "hopLe", totalVotes);

    return parseNumber(approvedVotes) !== null &&
        parseNumber(validVotes) !== null &&
        parseNumber(approvedVotes) !== parseNumber(validVotes)
        ? `với ${approvedVotes} phiếu biểu quyết tán thành`
        : "với 100% tổng số phiếu biểu quyết tán thành";
}

function SubHeadingDoc({ children }) {
    return <h3 style={{ fontSize: "18px", margin: 0 }}>{children}</h3>;
}

function SectionTitle({ children }) {
    return (
        <p style={{ fontWeight: 700, marginTop: 12, textAlign: "center" }}>
            <strong>{children}</strong>
        </p>
    );
}

function BulletList({ children, compact = false }) {
    return (
        <ul style={{ margin: compact ? "4px 0 8px" : "8px 0", paddingLeft: 24, listStyleType: '"- "' }}>{children}</ul>
    );
}

function BulletItem({ children }) {
    return <li style={{ margin: "4px 0", lineHeight: 1.5 }}>{children}</li>;
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
                    <th>
                        <p
                            style={{
                                margin: 0,
                                lineHeight: "inherit",
                                textAlign: "inherit",
                                font: "inherit",
                            }}
                        >
                            Loại nguồn vốn
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
                            Số tiền
                        </p>
                    </th>
                    <th style={{ width: 90 }}>
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
                </tr>
            </thead>
            <tbody>
                {rows.map(([label, prefix]) => (
                    <tr key={prefix}>
                        <td>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                {label}
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
                                {formatUnitValue(data[`${prefix}_soTien`], "VNĐ")}
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
                                {formatUnitValue(data[`${prefix}_tyLe`], "%")}
                            </p>
                        </td>
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
                    <th style={{ width: 45 }}>
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
                            Tài sản góp vốn
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
                            Giá trị vốn
                        </p>
                    </th>
                    <th style={{ width: 90 }}>
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
                </tr>
            </thead>
            <tbody>
                {rows.map(([stt, label, prefix]) => (
                    <tr key={prefix}>
                        <td style={{ textAlign: "center" }}>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                {stt}
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
                                {label}
                                {prefix === "taiSan_khac" && data.taiSan_khac_loaiTaiSan
                                    ? `: ${data.taiSan_khac_loaiTaiSan}`
                                    : ""}
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
                                {formatUnitValue(data[`${prefix}_giaTri`], "VNĐ")}
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
                                {formatUnitValue(data[`${prefix}_tyLe`], "%")}
                            </p>
                        </td>
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
                        <th style={{ width: 45 }}>
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
                                {removed ? "Tên ngành, nghề kinh doanh được bỏ" : "Tên ngành, nghề kinh doanh"}
                            </p>
                        </th>
                        <th style={{ width: 100 }}>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Mã ngành
                            </p>
                        </th>
                        {!removed && (
                            <th style={{ width: 125 }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ngành nghề chính
                                </p>
                            </th>
                        )}
                        {removed && (
                            <th style={{ width: 100 }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    Ghi chú
                                </p>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
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
                                <p style={{ margin: 0 }}>{row.tenNganh}</p>
                                {row.chiTiet && <p style={{ fontStyle: "italic" }}>{row.chiTiet}</p>}
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
                                    {row.maNganh}
                                </p>
                            </td>
                            {!removed && (
                                <td style={{ textAlign: "center" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {row.laNganhChinh ? "X" : ""}
                                    </p>
                                </td>
                            )}
                            {removed && (
                                <td>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {row.ghiChu || ""}
                                    </p>
                                </td>
                            )}
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
            <SectionTitle>ĐĂNG KÝ THAY ĐỔI VỐN ĐIỀU LỆ</SectionTitle>
            <p style={{ textAlign: "center", fontStyle: "italic" }}>(trong trường hợp tăng vốn điều lệ)</p>
            <p>Thay đổi vốn điều lệ của công ty như sau:</p>
            <p>
                Vốn điều lệ đã đăng ký:{" "}
                {`${data.vonDieuLeDaDangKy || ""} ${
                    data.vonDieuLeDaDangKy_bangChu ? `(${data.vonDieuLeDaDangKy_bangChu})` : ""
                }`.trim()}
            </p>
            <p>
                Vốn điều lệ sau khi thay đổi:{" "}
                {`${data.vonDieuLeSauThayDoi || ""} ${
                    data.vonDieuLeSauThayDoi_bangChu ? `(${data.vonDieuLeSauThayDoi_bangChu})` : ""
                }`.trim()}
            </p>
            <p>Hình thức tăng vốn: {data.qdHinhThucTangGiamVon || data.hinhThucTangGiamVon || "…"}</p>
            <p>Thời điểm tăng/giảm vốn: {formatDate(data.thoiDiemThayDoiVon) || "…/…/…"}</p>

            {contributionRows.length > 0 && (
                <>
                    <p>Trong đó:</p>
                    {contributionRows.map((row, index) => (
                        <p key={index}>
                            {row.danhXung || "Ông/Bà"} {row.hoTen || "…"} {verb}{" "}
                            {formatUnitValue(row.giaTriTangGiam || data.qdVonChenhLech, "đồng")}
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
                            {row.danhXung || "Ông/Bà"} {row.hoTen || "…"} góp{" "}
                            {formatUnitValue(row.phanVonSauThayDoi, "đồng")}, chiếm{" "}
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
            <SectionTitle>THAY ĐỔI NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT</SectionTitle>
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

function VoteBlocks({ data }) {
    const totalVotes = getDefaultVoteTotal(data) || "…";
    const voteItems = getVoteItems(data);

    return (
        <>
            <SubHeadingDoc>C. Biểu quyết:</SubHeadingDoc>
            <p>Phương thức biểu quyết: {data.bbPhuongThucBieuQuyet || "Bỏ phiếu kín"}</p>
            <p>
                Với {formatUnitValue(data.bbMenhGiaPhieuBieuQuyet || "10.000", "đồng")} góp vốn tương ứng với 1 phiếu
                biểu quyết. Như vậy tổng số phiếu biểu quyết là {totalVotes} phiếu.
            </p>
            {voteItems.map((item, index) => (
                <div key={item.key}>
                    <p>
                        <strong>
                            {index + 1}. Bỏ phiếu thông qua việc {item.label}
                        </strong>
                    </p>
                    <BulletList compact>
                        <BulletItem>
                            Tổng số phiếu biểu quyết hợp lệ: {getVoteValue(data, item.key, "hopLe", totalVotes)} phiếu
                        </BulletItem>
                        <BulletItem>
                            Tổng số phiếu biểu quyết không hợp lệ:{" "}
                            {getVoteValue(data, item.key, "khongHopLe", totalVotes)} phiếu
                        </BulletItem>
                        <BulletItem>
                            Tổng số phiếu tán thành: {getVoteValue(data, item.key, "tanThanh", totalVotes)} phiếu
                        </BulletItem>
                        <BulletItem>
                            Tổng số phiếu không tán thành: {getVoteValue(data, item.key, "khongTanThanh", totalVotes)}{" "}
                            phiếu
                        </BulletItem>
                        <BulletItem>
                            Tổng số phiếu không có ý kiến: {getVoteValue(data, item.key, "khongYKien", totalVotes)}{" "}
                            phiếu
                        </BulletItem>
                    </BulletList>
                </div>
            ))}
        </>
    );
}

function DecisionBlocks({ data }) {
    const totalVotes = getDefaultVoteTotal(data) || "…";
    const voteItems = getVoteItems(data);

    return (
        <>
            <SubHeadingDoc>D. Hội đồng thành viên quyết định:</SubHeadingDoc>
            <BulletList>
                {voteItems.map((item) => (
                    <BulletItem key={item.key}>
                        Thông qua việc {item.label} tại mục A nêu trên {getApprovalText(data, item, totalVotes)}.
                    </BulletItem>
                ))}
                <BulletItem>
                    Giao cho {data.qdNguoiThucHienThuTuc_danhXung || "Ông/Bà"} {data.qdNguoiThucHienThuTuc || "…"} tiến
                    hành các thủ tục cần thiết theo quy định của pháp luật.
                </BulletItem>
            </BulletList>
        </>
    );
}

function BienBanHopHoiDongThanhVienConfirmation({ dataJson }) {
    const data = normalizeDataJson(dataJson);

    if (!Object.keys(data).length) {
        return <p className={styles.emptyMessage}>Đang tải dữ liệu...</p>;
    }

    const companyName = getDecisionCompanyName(data);
    const changedCompanyName = getChangedCompanyName(data);
    const upperCompanyName = companyName.toLocaleUpperCase("vi-VN");
    const headOfficeAddress = getHeadOfficeAddress(data);
    const members = getMeetingMembers(data);
    const shouldShowContributionCertificate = isCapitalIncrease(data);

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
                            <p>Số: {data.qdSoBienBanHop || "01/2026/BBH"}</p>
                        </td>
                        <td className={styles.textCenter} style={{ verticalAlign: "bottom" }}>
                            <p style={{ fontStyle: "italic" }}>
                                {formatMeetingDate(
                                    data.qdDiaDiemLap || data.kinhGuiProvince || data.truSo_tinh,
                                    data.qdNgayBienBanHop,
                                )}
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2 className={styles.docTitle}>BIÊN BẢN HỌP HỘI ĐỒNG THÀNH VIÊN</h2>
            <h2 className={styles.docTitle}>{upperCompanyName || "CÔNG TY TNHH …"}</h2>
            <p className={styles.textCenter} style={{ fontStyle: "italic", marginBottom: 2 }}>
                (Về việc thay đổi nội dung đăng ký doanh nghiệp)
            </p>
            <hr style={{ border: "none", borderTop: "1px solid #000", margin: "2px auto", width: "15%" }} />

            <div className={styles.content}>
                <p>
                    {upperCompanyName || "CÔNG TY TNHH …"}, Mã số doanh nghiệp: {data.maSoDoanhNghiep || "…"}, địa chỉ
                    trụ sở chính: {headOfficeAddress || "…"}, tiến hành họp Hội đồng thành viên về việc thay đổi nội
                    dung đăng ký doanh nghiệp theo chương trình như sau:
                </p>
                <BulletList>
                    <BulletItem>
                        Thời gian bắt đầu: vào lúc {formatMeetingTime(data.bbGioBatDau)}, ngày{" "}
                        {formatDate(data.qdNgayBienBanHop) || "…/…/…"}
                    </BulletItem>
                    <BulletItem>Địa điểm họp: {data.bbDiaDiemHop || "Tại địa chỉ trụ sở chính"}</BulletItem>
                    <BulletItem>Thành phần tham dự:</BulletItem>
                </BulletList>
                {members.map((member, index) => (
                    <div key={index}>
                        <p>
                            {index + 1}. {member.danhXung || "Ông/Bà"} {member.hoTen || "…"} -{" "}
                            {member.chucVu || getDefaultMemberPosition(index)}
                        </p>
                        <p>
                            Sở hữu phần vốn góp {formatUnitValue(member.phanVonGop, "đồng") || "…"}, chiếm tỷ lệ{" "}
                            {formatUnitValue(member.tyLe, "%") || "…"} vốn điều lệ
                            {getContributionCertificateText(member, shouldShowContributionCertificate)}
                        </p>
                    </div>
                ))}
                <p>Vắng mặt: 0</p>
                <p>
                    Chủ tọa cuộc họp: {data.bbChuToa_danhXung || "Ông/Bà"} {data.bbChuToa || "…"}
                </p>
                <p>
                    Thư ký cuộc họp: {data.bbThuKy_danhXung || "Ông/Bà"} {data.bbThuKy || "…"}
                </p>
                <p>
                    {data.bbChuToa_danhXung || "Ông/Bà"} {data.bbChuToa || "…"} tuyên bố việc triệu tập họp Hội đồng
                    thành viên, điều kiện và thể thức tiến hành họp Hội đồng thành viên phù hợp theo quy định của Luật
                    Doanh nghiệp và Điều lệ công ty; số thành viên dự họp đạt 100% vốn điều lệ đủ điều kiện tiến hành
                    họp Hội đồng thành viên.
                </p>

                <SubHeadingDoc>A. Nội dung cuộc họp:</SubHeadingDoc>
                <p>Hội đồng thành viên lấy ý kiến của các thành viên dự họp về việc:</p>

                {isTruthy(data.a_doiVonDieuLe) && <CapitalChangeSection data={data} />}

                {isTruthy(data.a_doiNganhNghe) && (
                    <>
                        <SectionTitle>THAY ĐỔI NGÀNH, NGHỀ KINH DOANH</SectionTitle>
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
                        <SectionTitle>THAY ĐỔI TÊN DOANH NGHIỆP</SectionTitle>
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
                        <SectionTitle>THAY ĐỔI ĐỊA CHỈ TRỤ SỞ CHÍNH</SectionTitle>
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

                <SubHeadingDoc>B. Ý kiến phát biểu của các thành viên dự họp:</SubHeadingDoc>
                <p>
                    {data.bbYKienThanhVien ||
                        "Hoàn toàn đồng ý với việc thay đổi nội dung đăng ký doanh nghiệp tại mục A nêu trên."}
                </p>

                <VoteBlocks data={data} />
                <DecisionBlocks data={data} />

                <p>Cuộc họp kết thúc vào lúc {formatMeetingTime(data.bbGioKetThuc)} cùng ngày.</p>

                <table className={styles.noBorderTable} style={{ width: "100%", marginTop: 28 }}>
                    <tbody>
                        <tr>
                            <td className={styles.textCenter} style={{ width: "48%", verticalAlign: "top" }}>
                                <p>
                                    <strong>CHỦ TỌA CUỘC HỌP</strong>
                                </p>
                            </td>
                            <td className={styles.textCenter} style={{ verticalAlign: "top" }}>
                                <p>
                                    <strong>THƯ KÝ CUỘC HỌP</strong>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BienBanHopHoiDongThanhVienConfirmation;
