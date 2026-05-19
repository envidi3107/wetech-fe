// ──────────────────────────────────────────────────────────────────────────────
// Column headers cho 2 bảng (dùng cho cả export và import) của Giấy Đề Nghị
// ──────────────────────────────────────────────────────────────────────────────
export const NGANH_NGHE_HEADERS = ["STT", "Tên ngành (*)", "Chi tiết", "Mã ngành (*)", "Là ngành chính (Có/Để trống)"];
export const THANH_VIEN_HEADERS = [
    "STT",
    "Họ tên (*)",
    "Ngày sinh (dd/mm/yyyy)",
    "Số CCCD",
    "Giới tính (Nam/Nữ)",
    "Quốc tịch",
    "Dân tộc",
    "Nơi thường trú",
    "Nơi ở hiện tại",
    "Chữ ký",
];

export const SENTINEL_NGANH = "##DANH_SACH_NGANH_NGHE##";
export const SENTINEL_TV = "##DANH_SACH_THANH_VIEN##";

// ──────────────────────────────────────────────────────────────────────────────
// Map label → field key cho Giấy Đề Nghị
// ──────────────────────────────────────────────────────────────────────────────
export const FIELD_LABEL_MAP_DENGHI = {
    "Họ và tên (*)": "nguoiDaiDien_hoTen",
    "Ngày sinh (*) (dd/mm/yyyy)": "nguoiDaiDien_ngaySinh",
    "Giới tính (*) (Nam/Nữ)": "nguoiDaiDien_gioiTinh",
    "Số định danh cá nhân (*)": "nguoiDaiDien_cccd",
    "Dân tộc (*)": "nguoiDaiDien_danToc",
    "Quốc tịch (*)": "nguoiDaiDien_quocTich",
    "Điện thoại liên hệ (*)": "nguoiDaiDien_phone",
    Email: "nguoiDaiDien_email",
    "Tên tiếng Việt (*)": "hkd_tenVN",
    "Tên tiếng nước ngoài": "hkd_tenEN",
    "Tên viết tắt": "hkd_tenVietTat",
    "Điện thoại trụ sở (*)": "truSo_phone",
    "Email trụ sở": "truSo_email",
    "Vốn kinh doanh (số, VNĐ) (*)": "vonKinhDoanh",
    "Vốn kinh doanh (bằng chữ)": "vonKinhDoanh_bangChu",
    "Kính gửi": "kinhGui",
    "Ngày bắt đầu hoạt động (yyyy-mm-dd)": "ngayBatDau",
    "Tổng số lao động (dự kiến)": "soLaoDong",
    "Phương pháp thuế GTGT (ke_khai/khoan)": "vatMethod",
    "Chủ thể thành lập (ca_nhan/thanh_vien_gd)": "subject",
    "Tên (*)": "chuHo_ten",
    "Họ và Tên (*)": "chuHo_hoTen",
    "Địa chỉ thuế - Tỉnh/Thành phố": "thue_tinh",
    "Địa chỉ thuế - Xã/Phường": "thue_xa",
    "Địa chỉ thuế - Số nhà, đường": "thue_soNha",
    "Điện thoại thuế": "thue_phone",
    "Email thuế": "thue_email",
};

// Map section header → { label → fieldKey }
export const SECTION_FIELD_MAP_DENGHI = {
    "NƠI THƯỜNG TRÚ": {
        "Tỉnh/Thành phố": "thuongTru_tinh",
        "Xã/Phường": "thuongTru_xa",
        "Số nhà, đường": "thuongTru_soNha",
    },
    "NƠI Ở HIỆN TẠI": { "Tỉnh/Thành phố": "hienTai_tinh", "Xã/Phường": "hienTai_xa", "Số nhà, đường": "hienTai_soNha" },
    "TRỤ SỞ": { "Tỉnh/Thành phố": "truSo_tinh", "Xã/Phường": "truSo_xa", "Số nhà, đường": "truSo_soNha" },
};

// ──────────────────────────────────────────────────────────────────────────────
// Map label → field key cho Giấy Uỷ Quyền
// ──────────────────────────────────────────────────────────────────────────────
export const FIELD_LABEL_MAP_UYQUYEN = {
    "Tên chủ hộ": "chuHo_ten",
    "Phường/Xã chủ hộ": "chuHo_xa_phuong",
    "Kính gửi - Tiền tố": "kinhGuiPrefix",
    "Phòng thực hiện": "phongThucHien",
};

export const SECTION_FIELD_MAP_UYQUYEN = {
    "BÊN UỶ QUYỀN": {
        "Họ và tên (*)": "uyQuyen_hoTen",
        "Ngày sinh (*) (dd/mm/yyyy)": "uyQuyen_ngaySinh",
        "Giới tính (*) (Nam/Nữ)": "uyQuyen_gioiTinh",
        "Số định danh cá nhân (*)": "uyQuyen_cccd",
        "Điện thoại liên hệ (*)": "uyQuyen_phone",
        Email: "uyQuyen_email",
    },
    "ĐỊA CHỈ LIÊN LẠC": {
        "Tỉnh/Thành phố": "uyQuyen_tinh",
        "Xã/Phường": "uyQuyen_xa",
        "Số nhà, đường": "uyQuyen_soNha",
    },
    "ĐỊA CHỈ LIÊN LẠC BÊN UỶ QUYỀN": {
        "Tỉnh/Thành phố": "uyQuyen_tinh",
        "Xã/Phường": "uyQuyen_xa",
        "Số nhà, đường": "uyQuyen_soNha",
    },
    "BÊN NHẬN UỶ QUYỀN": {
        "Họ và tên (*)": "nhanUyQuyen_hoTen",
        "Ngày sinh (*) (dd/mm/yyyy)": "nhanUyQuyen_ngaySinh",
        "Giới tính (*) (Nam/Nữ)": "nhanUyQuyen_gioiTinh",
        "Số định danh cá nhân (*)": "nhanUyQuyen_cccd",
        "Dân tộc": "nhanUyQuyen_danToc",
        "Quốc tịch": "nhanUyQuyen_quocTich",
        "Điện thoại liên hệ (*)": "nhanUyQuyen_phone",
        Email: "nhanUyQuyen_email",
    },
    "ĐỊA CHỈ THƯỜNG TRÚ BÊN NHẬN UỶ QUYỀN": {
        "Tỉnh/Thành phố": "nhanUyQuyen_thuongTru_tinh",
        "Xã/Phường": "nhanUyQuyen_thuongTru_xa",
        "Số nhà, đường": "nhanUyQuyen_thuongTru_soNha",
    },
    "ĐỊA CHỈ LIÊN LẠC BÊN NHẬN UỶ QUYỀN": {
        "Tỉnh/Thành phố": "nhanUyQuyen_lienLac_tinh",
        "Xã/Phường": "nhanUyQuyen_lienLac_xa",
        "Số nhà, đường": "nhanUyQuyen_lienLac_soNha",
    },
    "THÔNG TIN HỘ KINH DOANH": {
        "Tên chủ hộ": "chuHo_ten",
        "Phường/Xã chủ hộ": "chuHo_xa_phuong",
        "Kính gửi - Tiền tố": "kinhGuiPrefix",
        "Phòng thực hiện": "phongThucHien",
    },
};

export const formatDateExcel = (dateStr) => {
    if (!dateStr) return "";
    if (typeof dateStr === "string" && dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }
    return dateStr;
};

export const parseDateExcel = (dateStr) => {
    if (!dateStr) return "";
    let temp = String(dateStr).trim();

    // Handle Excel Serial Date Number (vd: "45000")
    if (!isNaN(temp) && Number(temp) > 10000) {
        // Excel tính số ngày từ 30/12/1899
        const serial = Number(temp);
        const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const d = String(date.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    if (temp.includes("/")) {
        const parts = temp.split("/");
        if (parts.length === 3) {
            const y = parts[2].split(" ")[0];
            const m = String(parts[1]).padStart(2, "0");
            const d = String(parts[0]).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }
    }
    return temp;
};
