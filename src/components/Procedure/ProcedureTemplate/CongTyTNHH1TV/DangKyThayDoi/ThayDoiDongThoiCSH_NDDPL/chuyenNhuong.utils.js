import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

export const CURRENT_YEAR = new Date().getFullYear();

// Ngày hiện tại theo định dạng yyyy-MM-dd (định dạng input[type=date]) - dùng làm
// giá trị mặc định cho ngày ký hợp đồng khi chưa có dữ liệu đã lưu.
export const getTodayISO = () => new Date().toISOString().slice(0, 10);

export const firstValue = (...values) =>
    values.find((value) => value !== undefined && value !== null && String(value).trim() !== "") || "";

const hasOwn = (data, key) => Object.prototype.hasOwnProperty.call(data || {}, key);

const savedOr = (data, key, ...fallbackValues) => (hasOwn(data, key) ? data[key] : firstValue(...fallbackValues));

export const joinAddress = (...values) => values.filter((value) => String(value || "").trim()).join(", ");

export const getCompanyName = (rawData) => {
    const data = normalizeDataJson(rawData);
    const companyName = firstValue(data.tenDoanhNghiep, data.tenCongTyVN);
    if (!companyName) return "";

    const normalizedName = companyName.toLocaleUpperCase("vi-VN");
    if (TNHH_COMPANY_NAME_PREFIX_OPTIONS.some((prefix) => normalizedName.startsWith(prefix))) {
        return companyName;
    }

    const prefix = getCompanyNamePrefix(data, DEFAULT_TNHH_COMPANY_NAME_PREFIX, TNHH_COMPANY_NAME_PREFIX_OPTIONS);
    return `${prefix} ${companyName}`;
};

// Địa chỉ của Bên A/Bên B trong hợp đồng được lưu dưới dạng cấu trúc
// (tỉnh/xã/số nhà) theo prefix riêng, ví dụ benA_thuongTru_tinh, benB_lienLac_xa...
const buildPartyAddress = (data, prefix, addressType) => {
    const addressPrefix = `${prefix}_${addressType}`;
    return joinAddress(data[`${addressPrefix}_soNha`], data[`${addressPrefix}_xa`], data[`${addressPrefix}_tinh`]);
};

// Địa chỉ nguồn (từ "Giấy đề nghị đăng ký thay đổi chủ sở hữu công ty") dùng để
// đọc dữ liệu chủ sở hữu: thường trú nằm ở chuSoHuu_thuongTru_*, còn liên lạc
// nằm ngay ở chuSoHuu_* (không có hậu tố _lienLac).
const buildOwnerSourceAddress = (data, addressType) => {
    const sourcePrefix = addressType === "thuongTru" ? "chuSoHuu_thuongTru" : "chuSoHuu";
    return {
        tinh: data[`${sourcePrefix}_tinh`],
        xa: data[`${sourcePrefix}_xa`],
        soNha: data[`${sourcePrefix}_soNha`],
    };
};

export const buildContractPrefillData = (rawData) => {
    const data = normalizeDataJson(rawData);
    const originalRegistrationData = normalizeDataJson(data.duLieuDangKyBanDau);
    const benBThuongTruSource = buildOwnerSourceAddress(data, "thuongTru");
    const benBLienLacSource = buildOwnerSourceAddress(data, "lienLac");

    const result = {
        ...data,
        // Ô "Tên doanh nghiệp" hiển thị trên form khai báo cần có đủ prefix loại hình
        // (CÔNG TY TNHH...), giống tên công ty được in trong văn bản hợp đồng/biên bản.
        tenDoanhNghiep: getCompanyName(data) || data.tenDoanhNghiep || "",
        hopDong_so: savedOr(data, "hopDong_so", `01/${CURRENT_YEAR}/HĐ-CN`),
        hopDong_ngayKy: savedOr(data, "hopDong_ngayKy", getTodayISO()),
        hopDong_diaDiemKy: savedOr(data, "hopDong_diaDiemKy", data.kinhGuiProvince),
        hopDong_diaChiCongTy: savedOr(
            data,
            "hopDong_diaChiCongTy",
            joinAddress(data.truSo_soNha, data.truSo_xa, data.truSo_tinh),
            joinAddress(
                originalRegistrationData.truSo_soNha,
                originalRegistrationData.truSo_xa,
                originalRegistrationData.truSo_tinh,
            ),
        ),
        // Bên A (bên chuyển nhượng - chủ sở hữu cũ): thủ tục không có chỗ khai
        // thông tin chủ sở hữu cũ nên để trống, chỉ giữ lại nếu người dùng đã tự nhập.
        benA_hoTen: savedOr(data, "benA_hoTen"),
        benA_ngaySinh: savedOr(data, "benA_ngaySinh"),
        benA_danToc: savedOr(data, "benA_danToc"),
        benA_quocTich: savedOr(data, "benA_quocTich", "Việt Nam"),
        benA_cccd: savedOr(data, "benA_cccd"),
        benA_thuongTru_tinh: savedOr(data, "benA_thuongTru_tinh"),
        benA_thuongTru_xa: savedOr(data, "benA_thuongTru_xa"),
        benA_thuongTru_soNha: savedOr(data, "benA_thuongTru_soNha"),
        benA_lienLac_tinh: savedOr(data, "benA_lienLac_tinh"),
        benA_lienLac_xa: savedOr(data, "benA_lienLac_xa"),
        benA_lienLac_soNha: savedOr(data, "benA_lienLac_soNha"),
        // Bên B (bên nhận chuyển nhượng - chủ sở hữu mới): lấy từ thông tin chủ sở hữu
        // đã khai trong "Giấy đề nghị đăng ký thay đổi chủ sở hữu công ty".
        benB_hoTen: savedOr(data, "benB_hoTen", data.chuSoHuu_hoTen),
        benB_ngaySinh: savedOr(data, "benB_ngaySinh", data.chuSoHuu_ngaySinh),
        benB_danToc: savedOr(data, "benB_danToc", data.chuSoHuu_danToc),
        benB_quocTich: savedOr(data, "benB_quocTich", data.chuSoHuu_quocTich, "Việt Nam"),
        benB_cccd: savedOr(data, "benB_cccd", data.chuSoHuu_cccd),
        benB_thuongTru_tinh: savedOr(data, "benB_thuongTru_tinh", benBThuongTruSource.tinh),
        benB_thuongTru_xa: savedOr(data, "benB_thuongTru_xa", benBThuongTruSource.xa),
        benB_thuongTru_soNha: savedOr(data, "benB_thuongTru_soNha", benBThuongTruSource.soNha),
        benB_lienLac_tinh: savedOr(data, "benB_lienLac_tinh", benBLienLacSource.tinh),
        benB_lienLac_xa: savedOr(data, "benB_lienLac_xa", benBLienLacSource.xa),
        benB_lienLac_soNha: savedOr(data, "benB_lienLac_soNha", benBLienLacSource.soNha),
        chuyenNhuong_tyLe: savedOr(data, "chuyenNhuong_tyLe", "100"),
        chuyenNhuong_giaTri: savedOr(data, "chuyenNhuong_giaTri", data.vonDieuLe, data.vonDieuLeSauThayDoi),
        chuyenNhuong_giaTriBangChu: savedOr(
            data,
            "chuyenNhuong_giaTriBangChu",
            data.vonDieuLe_bangChu,
            data.vonDieuLeSauThayDoi_bangChu,
        ),
    };

    // Chuỗi địa chỉ đầy đủ dùng để in trong văn bản hợp đồng/biên bản. Ưu tiên dựng
    // từ các trường cấu trúc ở trên; nếu chưa có (hồ sơ cũ trước khi đổi sang
    // AddressSelect) thì rơi về chuỗi địa chỉ dạng text đã lưu trước đó.
    result.benA_diaChiThuongTru = buildPartyAddress(result, "benA", "thuongTru") || data.benA_diaChiThuongTru || "";
    result.benA_diaChiLienLac = buildPartyAddress(result, "benA", "lienLac") || data.benA_diaChiLienLac || "";
    result.benB_diaChiThuongTru = buildPartyAddress(result, "benB", "thuongTru") || data.benB_diaChiThuongTru || "";
    result.benB_diaChiLienLac = buildPartyAddress(result, "benB", "lienLac") || data.benB_diaChiLienLac || "";

    return result;
};

export const buildLiquidationPrefillData = (rawData) => {
    const data = buildContractPrefillData(rawData);
    return {
        ...data,
        thanhLy_so: savedOr(data, "thanhLy_so", `01/${CURRENT_YEAR}/BBTL`),
        thanhLy_diaDiem: savedOr(data, "thanhLy_diaDiem", data.hopDong_diaDiemKy, data.kinhGuiProvince),
        thanhLy_hopDongSo: savedOr(data, "thanhLy_hopDongSo", data.hopDong_so),
        thanhLy_hopDongNgay: savedOr(data, "thanhLy_hopDongNgay", data.hopDong_ngayKy),
        thanhLy_soTien: savedOr(data, "thanhLy_soTien", data.chuyenNhuong_gia, data.chuyenNhuong_giaTri),
        thanhLy_soTienBangChu: savedOr(
            data,
            "thanhLy_soTienBangChu",
            data.chuyenNhuong_giaBangChu,
            data.chuyenNhuong_giaTriBangChu,
        ),
        thanhLy_tyLe: savedOr(data, "thanhLy_tyLe", data.chuyenNhuong_tyLe),
    };
};

export const formatDateValue = (value) => {
    if (!value) return "";
    const parts = String(value).split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
};

export const formatLongDate = (value, fallbackYear = CURRENT_YEAR) => {
    if (!value) return `ngày …… tháng …… năm ${fallbackYear}`;

    const parts = String(value).split("-");
    if (parts.length !== 3) return `ngày ${value}`;
    return `ngày ${parts[2]} tháng ${parts[1]} năm ${parts[0]}`;
};

export const formatLongDocumentDate = (value, place, fallbackYear = CURRENT_YEAR) =>
    `${place || "……"}, ${formatLongDate(value, fallbackYear)}`;

export const formatMoney = (value) => {
    if (value === undefined || value === null || value === "") return "";
    const rawValue = String(value).trim();
    if (!/^\d+$/.test(rawValue)) return rawValue;
    return new Intl.NumberFormat("vi-VN").format(Number(rawValue));
};
