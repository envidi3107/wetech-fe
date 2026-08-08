import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

export const CURRENT_YEAR = new Date().getFullYear();

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

const buildPartyAddress = (data, prefix, addressType) => {
    const addressPrefix = addressType === "thuongTru" ? `${prefix}_thuongTru` : prefix;
    return joinAddress(
        data[`${addressPrefix}_soNha`],
        data[`${addressPrefix}_xa`],
        data[`${addressPrefix}_tinh`],
        data[`${addressPrefix}_quocGia`],
    );
};

export const buildContractPrefillData = (rawData) => {
    const data = normalizeDataJson(rawData);
    const originalRegistrationData = normalizeDataJson(data.duLieuDangKyBanDau);
    const originalOwner = Object.keys(originalRegistrationData).length ? originalRegistrationData : {};

    return {
        ...data,
        hopDong_so: savedOr(data, "hopDong_so", `01/${CURRENT_YEAR}/HĐ-CN`),
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
        benA_hoTen: savedOr(data, "benA_hoTen", originalOwner.chuSoHuu_hoTen),
        benA_ngaySinh: savedOr(data, "benA_ngaySinh", originalOwner.chuSoHuu_ngaySinh),
        benA_danToc: savedOr(data, "benA_danToc", originalOwner.chuSoHuu_danToc),
        benA_quocTich: savedOr(data, "benA_quocTich", originalOwner.chuSoHuu_quocTich, "Việt Nam"),
        benA_cccd: savedOr(data, "benA_cccd", originalOwner.chuSoHuu_cccd),
        benA_diaChiThuongTru: savedOr(
            data,
            "benA_diaChiThuongTru",
            buildPartyAddress(originalOwner, "chuSoHuu", "thuongTru"),
        ),
        benA_diaChiLienLac: savedOr(
            data,
            "benA_diaChiLienLac",
            buildPartyAddress(originalOwner, "chuSoHuu", "lienLac"),
        ),
        benB_hoTen: savedOr(data, "benB_hoTen", data.chuSoHuu_hoTen),
        benB_ngaySinh: savedOr(data, "benB_ngaySinh", data.chuSoHuu_ngaySinh),
        benB_danToc: savedOr(data, "benB_danToc", data.chuSoHuu_danToc),
        benB_quocTich: savedOr(data, "benB_quocTich", data.chuSoHuu_quocTich, "Việt Nam"),
        benB_cccd: savedOr(data, "benB_cccd", data.chuSoHuu_cccd),
        benB_diaChiThuongTru: savedOr(data, "benB_diaChiThuongTru", buildPartyAddress(data, "chuSoHuu", "thuongTru")),
        benB_diaChiLienLac: savedOr(data, "benB_diaChiLienLac", buildPartyAddress(data, "chuSoHuu", "lienLac")),
        chuyenNhuong_tyLe: savedOr(data, "chuyenNhuong_tyLe", "100"),
        chuyenNhuong_giaTri: savedOr(data, "chuyenNhuong_giaTri", data.vonDieuLe, data.vonDieuLeSauThayDoi),
        chuyenNhuong_giaTriBangChu: savedOr(
            data,
            "chuyenNhuong_giaTriBangChu",
            data.vonDieuLe_bangChu,
            data.vonDieuLeSauThayDoi_bangChu,
        ),
    };
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
