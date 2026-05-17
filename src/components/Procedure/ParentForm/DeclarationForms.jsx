import React, { useCallback, useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import * as XLSX from "xlsx";
import styles from "./DeclarationForms.module.css";
import { authAxios } from "@/services/axios-instance";
import { useProcessProcedure } from "@/pages/User/ProcessProcedure/ProcessProcedure";

import {
    NGANH_NGHE_HEADERS,
    THANH_VIEN_HEADERS,
    SENTINEL_NGANH,
    SENTINEL_TV,
    FIELD_LABEL_MAP_DENGHI,
    SECTION_FIELD_MAP_DENGHI,
    FIELD_LABEL_MAP_UYQUYEN,
    SECTION_FIELD_MAP_UYQUYEN,
    formatDateExcel,
    parseDateExcel,
} from "./FormExcelConstants";
import {
    FIELD_LABEL_MAP_GIAY_DKDN,
    SECTION_FIELD_MAP_GIAY_DKDN,
    buildExportRowsGiayDKDN,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ExcelConstants/GiayDeNghiDKDN.excelConstants";
import {
    buildExportRowsCSHHuongLoi,
    parseImportRowsCSHHuongLoi,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ExcelConstants/DanhSachCSHHuongLoi.excelConstants";
import {
    buildExportRowsDieuLeCongTy,
    parseImportRowsDieuLeCongTy,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ExcelConstants/DieuLeCongTy.excelConstants";
import {
    buildExportRowsDanhSachThanhVien,
    parseImportRowsDanhSachThanhVien,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH2TVTroLen/ExcelConstants/DanhSachThanhVien.excelConstants";
import {
    buildExportRowsDanhSachCoDongSangLap,
    parseImportRowsDanhSachCoDongSangLap,
} from "@/components/Procedure/ProcedureTemplate/CongTyCoPhan/ExcelConstants/DanhSachCoDongSangLap.excelConstants";

const TNHH_1TV_TYPE_COMPANY = "cong_ty_tnhh_mot_thanh_vien";
const THANH_LAP_CONG_TY_SERVICE = "thanh_lap_cong_ty";

const parseFormDataJson = (rawData) => {
    if (!rawData) return null;

    let parsed = rawData;
    if (typeof parsed === "string") {
        try { parsed = JSON.parse(parsed); } catch (e) { }
    }
    if (parsed && typeof parsed.dataJson === "string") {
        try { parsed = JSON.parse(parsed.dataJson); } catch (e) { }
    } else if (parsed && typeof parsed.dataJson === "object") {
        parsed = parsed.dataJson;
    }

    if (parsed?.nganhNgheList && typeof parsed.nganhNgheList === "string") {
        try { parsed.nganhNgheList = JSON.parse(parsed.nganhNgheList); } catch (e) { }
    }
    if (parsed?.thanhVienList && typeof parsed.thanhVienList === "string") {
        try { parsed.thanhVienList = JSON.parse(parsed.thanhVienList); } catch (e) { }
    }
    if (parsed?.cshHuongLoiList && typeof parsed.cshHuongLoiList === "string") {
        try { parsed.cshHuongLoiList = JSON.parse(parsed.cshHuongLoiList); } catch (e) { }
    }

    return parsed && typeof parsed === "object" ? parsed : null;
};

const normalizeFormName = (value = "") =>
    String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();

const isRegistrationForm = (form) => {
    const normalizedName = normalizeFormName(form?.name);
    return normalizedName.includes("dang ky doanh nghiep") || normalizedName.includes("dkdn");
};

const isBeneficialOwnerForm = (form) => {
    const normalizedName = normalizeFormName(form?.name);
    return (
        normalizedName.includes("csh") ||
        (normalizedName.includes("chu so huu") && normalizedName.includes("huong loi"))
    );
};

const buildDangKyThayDoiPrefillData = (registrationData, beneficialOwnerData) => {
    const prefillData = { ...(registrationData || {}) };
    const cshHuongLoiList = beneficialOwnerData?.cshHuongLoiList || registrationData?.cshHuongLoiList;

    if (registrationData?.tenCongTyVN && !prefillData.tenDoanhNghiep) {
        prefillData.tenDoanhNghiep = registrationData.tenCongTyVN;
    }
    if (registrationData?.maSoDoanhNghiep && !prefillData.maSoDoanhNghiep) {
        prefillData.maSoDoanhNghiep = registrationData.maSoDoanhNghiep;
    }
    if (registrationData?.maSoThue && !prefillData.maSoDoanhNghiep) {
        prefillData.maSoDoanhNghiep = registrationData.maSoThue;
    }
    if (registrationData?.vonDieuLe && !prefillData.vonDieuLeDaDangKy) {
        prefillData.vonDieuLeDaDangKy = registrationData.vonDieuLe;
    }
    if (registrationData?.vonDieuLe_bangChu && !prefillData.vonDieuLeDaDangKy_bangChu) {
        prefillData.vonDieuLeDaDangKy_bangChu = registrationData.vonDieuLe_bangChu;
    }
    if (cshHuongLoiList?.length) {
        prefillData.cshHuongLoiList = cshHuongLoiList;
    }

    return prefillData;
};

const mergePrefillData = (prefillData, currentData) => {
    const mergedData = { ...(prefillData || {}) };

    Object.entries(currentData || {}).forEach(([key, value]) => {
        const hasValue = Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== "";
        if (hasValue) {
            mergedData[key] = value;
        }
    });

    return mergedData;
};


const DeclarationForms = forwardRef(({ forms, currentFormStep = 0, onStepSubmitSuccess, setIsSubmittingForm }, ref) => {
    const [dataJson, setDataJson] = useState(null);
    const [hasServerData, setHasServerData] = useState(false);
    const [importKey, setImportKey] = useState(0);
    const formRef = useRef(null);
    const componentRef = useRef(null);
    const importInputRef = useRef(null);
    const { procedure, userCards, refreshUserCards } = useProcessProcedure();

    const currentForm = forms?.[currentFormStep];
    const CurrentFormComponent = currentForm?.declaration;

    const isUyQuyen =
        currentForm?.name?.toLowerCase().includes("uỷ quyền") || currentForm?.name?.toLowerCase().includes("ủy quyền");

    // Detect form type by component name or title
    const formComponentName = CurrentFormComponent?.displayName || CurrentFormComponent?.name || CurrentFormComponent?.render?.name || "";
    const isGiayDKDN = formComponentName === "GiayDeNghiDKDNDeclaration" ||
        currentForm?.name?.toLowerCase().includes("đăng ký doanh nghiệp");

    const isCSHHuongLoi = formComponentName === "DanhSachCSHHuongLoiDeclaration" ||
        currentForm?.name?.toLowerCase().includes("csh hưởng lợi");

    const isDieuLeCongTy = formComponentName === "DieuLeCongTyDeclaration" ||
        currentForm?.name?.toLowerCase().includes("điều lệ công ty") || currentForm?.name?.toLowerCase().includes("charter");

    const isDanhSachThanhVien = formComponentName === "DanhSachThanhVienDeclaration" ||
        currentForm?.name?.toLowerCase().includes("danh sách thành viên");

    const isDanhSachCoDongSangLap = formComponentName === "DanhSachCoDongSangLapDeclaration" ||
        currentForm?.name?.toLowerCase().includes("cổ đông sáng lập");

    const isDangKyThayDoiDoanhNghiep = formComponentName === "GiayDeNghiDangKyThayDoiDeclaration";
    const isDangKyThayDoiPrefillForm = [
        "GiayDeNghiDangKyThayDoiDeclaration",
        "GiayDeNghiDangKyThayDoiChuSoHuuDeclaration",
        "GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclaration",
    ].includes(formComponentName);

    const fetchInitialDangKyThayDoiData = useCallback(async () => {
        if (procedure?.typeCompany !== TNHH_1TV_TYPE_COMPANY || !isDangKyThayDoiPrefillForm) return null;

        const draftResponse = await authAxios.get("/api/procedurer/search-drafts", {
            params: {
                typeCompany: TNHH_1TV_TYPE_COMPANY,
                serviceType: THANH_LAP_CONG_TY_SERVICE,
            },
        });

        const sourceProcedures = (draftResponse.data || [])
            .filter((item) => item.procedureId && item.procedureId !== procedure?.procedureId);

        let fallbackSource = null;
        for (const sourceProcedure of sourceProcedures) {
            const response = await authAxios.get(`/api/procedurer/find-by-id-and-check-status`, {
                params: { id: sourceProcedure.procedureId },
            });
            const sourceForms = response.data?.result?.forms || [];
            const registrationForm = sourceForms.find(isRegistrationForm);
            if (!registrationForm?.formId) continue;

            const candidate = {
                registrationForm,
                beneficialOwnerForm: sourceForms.find(isBeneficialOwnerForm),
            };
            if (candidate.beneficialOwnerForm?.formId) return candidate;
            if (!fallbackSource) fallbackSource = candidate;
        }

        return fallbackSource;
    }, [isDangKyThayDoiPrefillForm, procedure?.procedureId, procedure?.typeCompany]);

    const fetchDangKyThayDoiPrefillData = useCallback(async () => {
        const sourceForms = await fetchInitialDangKyThayDoiData();
        if (!sourceForms?.registrationForm?.formId) return null;

        const registrationResponse = await authAxios.get(`/api/form-submission/get/data-json`, {
            params: { formId: sourceForms.registrationForm.formId },
        });
        const registrationData = parseFormDataJson(registrationResponse.data);
        let beneficialOwnerData = null;

        if (sourceForms.beneficialOwnerForm?.formId) {
            const beneficialOwnerResponse = await authAxios.get(`/api/form-submission/get/data-json`, {
                params: { formId: sourceForms.beneficialOwnerForm.formId },
            });
            beneficialOwnerData = parseFormDataJson(beneficialOwnerResponse.data);
        }

        return registrationData ? buildDangKyThayDoiPrefillData(registrationData, beneficialOwnerData) : null;
    }, [fetchInitialDangKyThayDoiData]);

    useEffect(() => {
        async function fetchFormSubmission() {
            if (!currentForm?.formId) return;
            setDataJson(null);
            setHasServerData(false);
            try {
                const response = await authAxios.get(`/api/form-submission/get/data-json`, {
                    params: { formId: currentForm.formId },
                });
                const parsed = parseFormDataJson(response.data);
                if (parsed) {
                    const prefillData = await fetchDangKyThayDoiPrefillData();
                    setDataJson(prefillData ? mergePrefillData(prefillData, parsed) : parsed);
                    setHasServerData(true);
                    return;
                }

                const prefillData = await fetchDangKyThayDoiPrefillData();
                if (!prefillData) {
                    setDataJson(null);
                    setHasServerData(false);
                    return;
                }

                setDataJson(prefillData);
                setHasServerData(false);
            } catch (error) {
                setDataJson(null);
                setHasServerData(false);
                console.error("Error fetching form submission:", error);
            }
        }
        fetchFormSubmission();
    }, [currentForm?.formId, fetchDangKyThayDoiPrefillData]);

    const saveMissingUserCards = async (data) => {
        const prefixes = ["nguoiDaiDien", "chuSoHuu", "nguoiNop", "uyQuyen", "nhanUyQuyen"];
        const newCardsData = [];
        const seenCccds = new Set(userCards?.map(c => c.cccd) || []);

        for (const prefix of prefixes) {
            const docCccd = data[`${prefix}_cccd`];
            if (docCccd && !seenCccds.has(docCccd)) {
                seenCccds.add(docCccd); // Prevent duplicates in the same form
                const payload = {
                    fullName: data[`${prefix}_hoTen`] || "",
                    cccd: docCccd,
                    email: data[`${prefix}_email`] || "",
                    phone: data[`${prefix}_phone`] || "",
                    gender: data[`${prefix}_gioiTinh`] || "",
                    dob: data[`${prefix}_ngaySinh`] || "",
                    nationality: data[`${prefix}_quocTich`] || "",
                    ethnicity: data[`${prefix}_danToc`] || "",
                    permanentStreet: data[`${prefix}_thuongTru_soNha`] || data[`thuongTru_soNha`] || "",
                    permanentWard: data[`${prefix}_thuongTru_xa`] || data[`thuongTru_xa`] || "",
                    permanentProvince: data[`${prefix}_thuongTru_tinh`] || data[`thuongTru_tinh`] || "",
                    currentStreet: prefix === "nguoiNop" ? (data[`lienLac_soNha`] || "") : (data[`${prefix}_hienTai_soNha`] || data[`hienTai_soNha`] || data[`${prefix}_soNha`] || ""),
                    currentWard: prefix === "nguoiNop" ? (data[`lienLac_xa`] || "") : (data[`${prefix}_hienTai_xa`] || data[`hienTai_xa`] || data[`${prefix}_xa`] || ""),
                    currentProvince: prefix === "nguoiNop" ? (data[`lienLac_tinh`] || "") : (data[`${prefix}_hienTai_tinh`] || data[`hienTai_tinh`] || data[`${prefix}_tinh`] || ""),
                };
                newCardsData.push(payload);
            }
        }

        if (newCardsData.length > 0) {
            try {
                await Promise.all(
                    newCardsData.map(payload =>
                        authAxios.post("/api/users/my-card/create", payload).catch(err => console.error("Failed to save card:", err))
                    )
                );
                if (refreshUserCards) refreshUserCards();
            } catch (err) {
                console.error("Error saving user cards:", err);
            }
        }
    };

    async function handleFormSubmission(data) {
        if (setIsSubmittingForm) setIsSubmittingForm(true);
        try {
            // Check and save user cards parallelly
            await saveMissingUserCards(data);

            if (hasServerData) {
                await authAxios.post("/api/form-submission/update", { formId: currentForm.formId, dataJson: data });
            } else {
                await authAxios.post("/api/form-submission/create", { formId: currentForm.formId, dataJson: data });
                setHasServerData(true);
            }
            setDataJson(data);
            if (onStepSubmitSuccess) onStepSubmitSuccess();
        } catch (err) {
            console.error("Error submitting form:", err);
        } finally {
            if (setIsSubmittingForm) setIsSubmittingForm(false);
        }
    }

    // ── EXPORT ──────────────────────────────────────────────────────────────
    const handleExportExcel = () => {
        let liveData = null;
        if (componentRef.current?.getExportData) {
            liveData = componentRef.current.getExportData();
            if (!liveData) return; // Validation failed (native HTML5 block)
        }

        const src = { ...(dataJson || {}), ...(liveData || {}) };
        let rows = [];

        if (isCSHHuongLoi) {
            rows = buildExportRowsCSHHuongLoi(src);
        } else if (isDanhSachThanhVien) {
            rows = buildExportRowsDanhSachThanhVien(src);
        } else if (isDanhSachCoDongSangLap) {
            rows = buildExportRowsDanhSachCoDongSangLap(src);
        } else if (isDieuLeCongTy) {
            rows = buildExportRowsDieuLeCongTy(src);
        } else if (isGiayDKDN) {
            rows = buildExportRowsGiayDKDN(src, SENTINEL_NGANH, NGANH_NGHE_HEADERS);
        } else if (isUyQuyen) {
            rows.push(["[BÊN UỶ QUYỀN]", ""]);
            rows.push(["Họ và tên (*)", src.uyQuyen_hoTen || ""]);
            rows.push(["Ngày sinh (*) (dd/mm/yyyy)", formatDateExcel(src.uyQuyen_ngaySinh)]);
            rows.push(["Giới tính (*) (Nam/Nữ)", src.uyQuyen_gioiTinh || ""]);
            rows.push(["Số định danh cá nhân (*)", src.uyQuyen_cccd || ""]);
            rows.push(["Điện thoại liên hệ (*)", src.uyQuyen_phone || ""]);
            rows.push(["Email", src.uyQuyen_email || ""]);

            rows.push(["[ĐỊA CHỈ LIÊN LẠC]", ""]);
            rows.push(["Tỉnh/Thành phố", src.uyQuyen_tinh || ""]);
            rows.push(["Xã/Phường", src.uyQuyen_xa || ""]);
            rows.push(["Số nhà, đường", src.uyQuyen_soNha || ""]);

            rows.push(["[THÔNG TIN KHÁC]", ""]);
            rows.push(["Tên chủ hộ", src.chuHo_ten || ""]);
            rows.push(["Phường/Xã chủ hộ", src.chuHo_xa_phuong || ""]);
            rows.push(["Phòng thực hiện", src.phongThucHien || ""]);
        } else {
            rows.push(["[THÔNG TIN NGƯỜI ĐẠI DIỆN]", ""]);
            rows.push(["Họ và tên (*)", src.nguoiDaiDien_hoTen || ""]);
            rows.push(["Ngày sinh (*) (dd/mm/yyyy)", formatDateExcel(src.nguoiDaiDien_ngaySinh)]);
            rows.push(["Giới tính (*) (Nam/Nữ)", src.nguoiDaiDien_gioiTinh || ""]);
            rows.push(["Số định danh cá nhân (*)", src.nguoiDaiDien_cccd || ""]);
            rows.push(["Dân tộc (*)", src.nguoiDaiDien_danToc || ""]);
            rows.push(["Quốc tịch (*)", src.nguoiDaiDien_quocTich || ""]);
            rows.push(["Điện thoại liên hệ (*)", src.nguoiDaiDien_phone || ""]);
            rows.push(["Email", src.nguoiDaiDien_email || ""]);

            rows.push(["[NƠI THƯỜNG TRÚ]", ""]);
            rows.push(["Tỉnh/Thành phố", src.thuongTru_tinh || ""]);
            rows.push(["Xã/Phường", src.thuongTru_xa || ""]);
            rows.push(["Số nhà, đường", src.thuongTru_soNha || ""]);

            rows.push(["[NƠI Ở HIỆN TẠI]", ""]);
            rows.push(["Tỉnh/Thành phố", src.hienTai_tinh || ""]);
            rows.push(["Xã/Phường", src.hienTai_xa || ""]);
            rows.push(["Số nhà, đường", src.hienTai_soNha || ""]);

            rows.push(["[TÊN HỘ KINH DOANH]", ""]);
            rows.push(["Tên tiếng Việt (*)", src.hkd_tenVN || ""]);
            rows.push(["Tên tiếng nước ngoài", src.hkd_tenEN || ""]);
            rows.push(["Tên viết tắt", src.hkd_tenVietTat || ""]);

            rows.push(["[TRỤ SỞ]", ""]);
            rows.push(["Tỉnh/Thành phố", src.truSo_tinh || ""]);
            rows.push(["Xã/Phường", src.truSo_xa || ""]);
            rows.push(["Số nhà, đường", src.truSo_soNha || ""]);
            rows.push(["Điện thoại trụ sở (*)", src.truSo_phone || ""]);
            rows.push(["Email trụ sở", src.truSo_email || ""]);

            rows.push(["[VỐN KINH DOANH]", ""]);
            rows.push(["Vốn kinh doanh (số, VNĐ) (*)", src.vonKinhDoanh || ""]);
            rows.push(["Vốn kinh doanh (bằng chữ)", src.vonKinhDoanh_bangChu || ""]);

            rows.push(["[THÔNG TIN KHÁC]", ""]);
            rows.push(["Kính gửi", `Phòng Kinh tế, Hạ tầng và Đô thị phường ${src.kinhGui}` || ""]);
            rows.push(["Địa chỉ thuế - Tỉnh/Thành phố", src.thue_tinh || ""]);
            rows.push(["Địa chỉ thuế - Xã/Phường", src.thue_xa || ""]);
            rows.push(["Địa chỉ thuế - Số nhà, đường", src.thue_soNha || ""]);
            rows.push(["Điện thoại thuế", src.thue_phone || ""]);
            rows.push(["Email thuế", src.thue_email || ""]);
            rows.push(["Ngày bắt đầu hoạt động (yyyy-mm-dd)", src.ngayBatDau || ""]);
            rows.push(["Tổng số lao động (dự kiến)", src.soLaoDong || ""]);
            rows.push(["Phương pháp thuế GTGT (ke_khai/khoan)", src.vatMethod || "khoan"]);
            rows.push(["Chủ thể thành lập (ca_nhan/thanh_vien_gd)", src.subject || "ca_nhan"]);

            rows.push(["[CHỦ HỘ KINH DOANH]", ""]);
            rows.push(["Tên (*)", src.chuHo_ten || ""]);
            rows.push(["Họ và Tên (*)", src.chuHo_hoTen || ""]);

            rows.push(["", ""]);
            rows.push([SENTINEL_NGANH, ""]);
            rows.push(NGANH_NGHE_HEADERS);
            const nganhList = src.nganhNgheList || [];
            nganhList.forEach((r, i) =>
                rows.push([i + 1, r.tenNganh || "", r.chiTiet || "", r.maNganh || "", r.laNganhChinh ? "Có" : ""]),
            );

            rows.push(["", ""]);
            rows.push([SENTINEL_TV, ""]);
            rows.push(THANH_VIEN_HEADERS);
            const tvList = src.thanhVienList || [];
            tvList.forEach((r, i) =>
                rows.push([
                    i + 1,
                    r.hoTen || "",
                    formatDateExcel(r.ngaySinh),
                    r.cccd || "",
                    r.gioiTinh || "",
                    r.quocTich || "",
                    r.danToc || "",
                    r.thuongTru || "",
                    r.hienTai || "",
                    r.chuKy || "",
                ]),
            );
        }

        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws["!cols"] = [
            { wch: 50 },
            { wch: 35 },
            { wch: 30 },
            { wch: 12 },
            { wch: 25 },
            { wch: 12 },
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 12 },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "HoSo");

        const formName = currentForm?.name || "form";
        XLSX.writeFile(wb, `mẫu_${formName.toLowerCase().replace(/\s+/g, "_")}.xlsx`);
    };

    // ── IMPORT ──────────────────────────────────────────────────────────────
    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const wb = XLSX.read(evt.target.result, { type: "array" });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const allRows = XLSX.utils.sheet_to_json(ws, { header: 1 });

            let importedData = {};

            if (isCSHHuongLoi) {
                importedData = parseImportRowsCSHHuongLoi(allRows) || {};
            } else if (isDanhSachThanhVien) {
                importedData = parseImportRowsDanhSachThanhVien(allRows) || {};
            } else if (isDanhSachCoDongSangLap) {
                importedData = parseImportRowsDanhSachCoDongSangLap(allRows) || {};
            } else if (isDieuLeCongTy) {
                importedData = parseImportRowsDieuLeCongTy(allRows) || {};
            } else {
                let currentSection = "";
                let mode = "kv"; // 'kv' | 'nganh' | 'tv'

                const LABEL_MAP = isGiayDKDN
                    ? FIELD_LABEL_MAP_GIAY_DKDN
                    : isUyQuyen ? FIELD_LABEL_MAP_UYQUYEN : FIELD_LABEL_MAP_DENGHI;
                const SECTION_MAP = isGiayDKDN
                    ? SECTION_FIELD_MAP_GIAY_DKDN
                    : isUyQuyen ? SECTION_FIELD_MAP_UYQUYEN : SECTION_FIELD_MAP_DENGHI;

                for (const row of allRows) {
                    const col0 = row[0] !== undefined ? String(row[0]).trim() : "";

                    if (!isUyQuyen && !isGiayDKDN) {
                        if (col0 === SENTINEL_NGANH) {
                            mode = "nganh";
                            importedData.nganhNgheList = [];
                            continue;
                        }
                        if (col0 === SENTINEL_TV) {
                            mode = "tv";
                            importedData.thanhVienList = [];
                            continue;
                        }

                        if (mode === "nganh") {
                            if (col0 === "STT") continue;
                            if (!row[1]) continue;
                            importedData.nganhNgheList.push({
                                tenNganh: String(row[1] || ""),
                                chiTiet: String(row[2] || ""),
                                maNganh: String(row[3] || ""),
                                laNganhChinh: String(row[4] || "").trim().toLowerCase() === "có",
                            });
                            continue;
                        }

                        if (mode === "tv") {
                            if (col0 === "STT") continue;
                            if (!row[1]) continue;
                            importedData.thanhVienList.push({
                                hoTen: String(row[1] || ""),
                                ngaySinh: parseDateExcel(String(row[2] || "")),
                                cccd: String(row[3] || ""),
                                gioiTinh: String(row[4] || ""),
                                quocTich: String(row[5] || ""),
                                danToc: String(row[6] || ""),
                                thuongTru: String(row[7] || ""),
                                hienTai: String(row[8] || ""),
                                chuKy: String(row[9] || ""),
                            });
                            continue;
                        }
                    }

                    // GiayDKDN also has ngành nghề table
                    if (isGiayDKDN) {
                        if (col0 === SENTINEL_NGANH) {
                            mode = "nganh";
                            importedData.nganhNgheList = [];
                            continue;
                        }
                        if (mode === "nganh") {
                            if (col0 === "STT") continue;
                            if (!row[1]) continue;
                            importedData.nganhNgheList.push({
                                tenNganh: String(row[1] || ""),
                                chiTiet: String(row[2] || ""),
                                maNganh: String(row[3] || ""),
                                laNganhChinh: String(row[4] || "").trim().toLowerCase() === "có",
                            });
                            continue;
                        }
                    }

                    if (!col0) continue;

                    // Detect exact section headers like [NƠI THƯỜNG TRÚ]
                    const sectionMatch = col0.match(/^\[(.+)\]$/);
                    if (sectionMatch) {
                        currentSection = sectionMatch[1].trim();
                        continue;
                    }

                    const value = row[1] !== undefined && row[1] !== null ? String(row[1]) : "";

                    const sMap = SECTION_MAP[currentSection] || {};
                    if (sMap && sMap[col0]) {
                        importedData[sMap[col0]] = value;
                        continue;
                    }

                    const key = LABEL_MAP[col0];
                    if (key) {
                        let finalValue = value;
                        if (
                            key.toLowerCase().includes("ngaysinh") ||
                            key.toLowerCase().includes("ngaycap") ||
                            key === "ngayBatDau" ||
                            key === "ngayBatDauHoatDong"
                        ) {
                            finalValue = parseDateExcel(finalValue);
                        }
                        importedData[key] = finalValue;
                    }
                }
            }

            if (componentRef.current?.importData) {
                componentRef.current.importData(importedData);
            }
            setDataJson((prev) => ({ ...(prev || {}), ...importedData }));
            setImportKey((k) => k + 1);
        };
        reader.readAsArrayBuffer(file);
        e.target.value = "";
    };

    useImperativeHandle(ref, () => ({
        submitCurrentForm: () => {
            if (formRef.current) {
                formRef.current.requestSubmit();
            }
        },
        exportExcel: () => handleExportExcel(),
        importExcel: () => importInputRef.current?.click(),
    }));

    if (!currentForm) {
        return <div style={{ padding: "40px", textAlign: "center" }}>Đang tải biểu mẫu...</div>;
    }

    return (
        <div className={`${styles.container} ${isDangKyThayDoiDoanhNghiep ? styles.wideContainer : ""}`}>
            <input
                ref={importInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleImportExcel}
            />
            <h2 className={styles.mainTitle}>THÔNG TIN CHI TIẾT {currentForm?.name?.toUpperCase()}</h2>
            {CurrentFormComponent ? (
                <CurrentFormComponent
                    key={`form_${currentForm.formId}_${importKey}`}
                    ref={componentRef}
                    formRef={formRef}
                    formId={currentForm.formId}
                    dataJson={dataJson}
                    onSubmit={handleFormSubmission}
                />
            ) : (
                <div style={{ padding: "40px", textAlign: "center" }}>Đang tải biểu mẫu...</div>
            )}
        </div>
    );
});

DeclarationForms.displayName = "DeclarationForms";
export default DeclarationForms;
