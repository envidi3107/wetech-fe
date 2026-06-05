export const MAIN_CHANGE_OPTIONS = [
    {
        value: "A",
        label:
            "A. ĐĂNG KÝ THAY ĐỔI NỘI DUNG ĐĂNG KÝ DOANH NGHIỆP/THÔNG BÁO THAY ĐỔI NỘI DUNG ĐĂNG KÝ DOANH NGHIỆP",
    },
    {
        value: "B",
        label: "B. BỔ SUNG, CẬP NHẬT THÔNG TIN ĐĂNG KÝ DOANH NGHIỆP",
    },
    {
        value: "C",
        label: "C. ĐỀ NGHỊ HIỆU ĐÍNH THÔNG TIN ĐĂNG KÝ DOANH NGHIỆP",
    },
];

export const A_CHANGE_OPTIONS = [
    { name: "a_doiTen", label: "ĐĂNG KÝ THAY ĐỔI TÊN DOANH NGHIỆP" },
    { name: "a_doiDiaChi", label: "ĐĂNG KÝ THAY ĐỔI ĐỊA CHỈ TRỤ SỞ CHÍNH" },
    {
        name: "a_doiThanhVien",
        label: "ĐĂNG KÝ THAY ĐỔI THÀNH VIÊN CÔNG TY TNHH",
    },
    {
        name: "a_doiVonDieuLe",
        label: "ĐĂNG KÝ THAY ĐỔI VỐN ĐIỀU LỆ, PHẦN VỐN GÓP, TỶ LỆ PHẦN VỐN GÓP",
    },
    { name: "a_doiNganhNghe", label: "THÔNG BÁO THAY ĐỔI NGÀNH, NGHỀ KINH DOANH" },
    { name: "a_doiVonDauTuDNTN", label: "ĐĂNG KÝ THAY ĐỔI VỐN ĐẦU TƯ CỦA CHỦ DOANH NGHIỆP TƯ NHÂN" },
    {
        name: "a_doiNguoiDaiDienUyQuyen",
        label:
            "THÔNG BÁO THAY ĐỔI NGƯỜI ĐẠI DIỆN THEO ỦY QUYỀN CỦA CHỦ SỞ HỮU/THÀNH VIÊN CÔNG TY TNHH LÀ TỔ CHỨC/CỔ ĐÔNG LÀ TỔ CHỨC NƯỚC NGOÀI",
    },
    {
        name: "a_doiCoDong",
        label: "THÔNG BÁO THAY ĐỔI CỔ ĐÔNG SÁNG LẬP/THÔNG BÁO THAY ĐỔI CỔ ĐÔNG LÀ NHÀ ĐẦU TƯ NƯỚC NGOÀI CÔNG TY CỔ PHẦN",
    },
    { name: "a_doiThongTinThue", label: "THÔNG BÁO THAY ĐỔI THÔNG TIN ĐĂNG KÝ THUẾ" },
    {
        name: "a_doiChuSoHuuHuongLoi",
        label:
            "THÔNG BÁO THAY ĐỔI THÔNG TIN VỀ CHỦ SỞ HỮU HƯỞNG LỢI CỦA DOANH NGHIỆP/THÔNG BÁO THAY ĐỔI THÔNG TIN ĐỂ XÁC ĐỊNH CHỦ SỞ HỮU HƯỞNG LỢI",
    },
];

export const BENEFICIAL_OWNER_CHANGE_OPTIONS = [
    {
        name: "cshHuongLoi_truongHopA",
        marker: "a)",
        label:
            "Trường hợp doanh nghiệp có sự thay đổi chủ sở hữu hưởng lợi của doanh nghiệp, tỷ lệ sở hữu đã kê khai với Cơ quan đăng ký kinh doanh cấp tỉnh theo quy định tại khoản 1 Điều 52 Nghị định số 168/2025/NĐ-CP (kê khai theo Mẫu số 10 Phụ lục I ban hành kèm theo Thông tư này): Gửi kèm.",
    },
    {
        name: "cshHuongLoi_truongHopB",
        marker: "b)",
        label:
            "Trường hợp công ty cổ phần có sự thay đổi cổ đông là tổ chức sở hữu từ 25% tổng số cổ phần có quyền biểu quyết trở lên hoặc thay đổi tỷ lệ sở hữu tổng số cổ phần có quyền biểu quyết theo quy định tại khoản 2 Điều 52 Nghị định số 168/2025/NĐ-CP (kê khai theo Mẫu số 11 Phụ lục I ban hành kèm theo Thông tư này): Gửi kèm.",
    },
    {
        name: "cshHuongLoi_truongHopC",
        marker: "c)",
        label:
            "Đối với doanh nghiệp được thành lập trước ngày 01/7/2025, trường hợp doanh nghiệp có thông tin về chủ sở hữu hưởng lợi của doanh nghiệp theo quy định tại khoản 1, khoản 2 Điều 18 Nghị định số 168/2025/NĐ-CP, doanh nghiệp bổ sung thông tin về chủ sở hữu hưởng lợi của doanh nghiệp theo quy định tại khoản 1 Điều 3 Luật số 76/2025/QH15 ngày 17/6/2025 sửa đổi, bổ sung một số điều của Luật Doanh nghiệp (kê khai theo Mẫu số 10 Phụ lục I ban hành kèm theo Thông tư này): Gửi kèm.",
    },
    {
        name: "cshHuongLoi_truongHopD",
        marker: "d)",
        label:
            "Đối với công ty cổ phần được đăng ký thành lập trước ngày 01/7/2025, trường hợp công ty cổ phần có thông tin để xác định chủ sở hữu hưởng lợi của doanh nghiệp theo quy định tại khoản 3 Điều 18 Nghị định số 168/2025/NĐ-CP, công ty cổ phần bổ sung thông tin để xác định chủ sở hữu hưởng lợi của doanh nghiệp theo quy định tại khoản 1 Điều 3 Luật số 76/2025/QH15 ngày 17/6/2025 sửa đổi, bổ sung một số điều của Luật Doanh nghiệp (kê khai theo Mẫu số 11 Phụ lục I ban hành kèm theo Thông tư này): Gửi kèm.",
    },
];

export const SHAREHOLDER_CHANGE_OPTIONS = [
    {
        name: "coDong_truongHopCoDongSangLap",
        label:
            "Trường hợp thay đổi cổ đông sáng lập (kê khai theo Mẫu số 7 Phụ lục I ban hành kèm theo Thông tư này): Gửi kèm (Đối với cổ đông sáng lập có phần vốn góp không thay đổi, trong danh sách cổ đông sáng lập không bắt buộc phải có chữ ký của cổ đông sáng lập đó).",
    },
    {
        name: "coDong_truongHopNhaDauTuNuocNgoai",
        label:
            "Trường hợp thay đổi cổ đông là nhà đầu tư nước ngoài (kê khai theo Mẫu số 8 Phụ lục I ban hành kèm theo Thông tư này): Gửi kèm (Đối với cổ đông có phần vốn góp không thay đổi, trong danh sách cổ đông là nhà đầu tư nước ngoài không bắt buộc phải có chữ ký của cổ đông đó).",
    },
];

export const FOOTNOTES = {
    nganhNghe:
        "Doanh nghiệp có quyền tự do kinh doanh trong những ngành, nghề mà luật không cấm. Đối với ngành, nghề đầu tư kinh doanh có điều kiện, doanh nghiệp chỉ được kinh doanh khi có đủ điều kiện theo quy định.",
    nguoiDaiDienUyQuyen:
        "Dùng trong trường hợp thay đổi từ người đại diện theo uỷ quyền này sang người đại diện theo uỷ quyền khác. Nếu chỉ thay đổi thông tin của người đại diện theo uỷ quyền hiện có thì thực hiện bổ sung, cập nhật tại Mục B.",
    giayToNguoiDaiDienUyQuyen:
        "Nếu kê khai số định danh cá nhân thì không phải kê khai quốc tịch, dân tộc.",
    tyLeUyQuyen:
        "Tỷ lệ phần vốn góp được ủy quyền đại diện trên tổng số vốn góp của thành viên đó tại doanh nghiệp.",
    chuKyUyQuyen:
        "Người được kê khai thông tin ký vào phần này. Người đại diện theo uỷ quyền không thay đổi không bắt buộc phải ký.",
    thueKeToan:
        "Trường hợp doanh nghiệp kê khai hình thức hạch toán là Hạch toán độc lập tại chỉ tiêu 5 thì bắt buộc kê khai thông tin về Kế toán trưởng/phụ trách kế toán.",
    boSungCapNhat:
        "Trường hợp cập nhật, bổ sung thông tin đăng ký hoạt động chi nhánh/văn phòng đại diện/địa điểm kinh doanh sử dụng Mẫu số 19 Phụ lục I, không sử dụng mẫu này.",
    nguoiKy:
        "Trường hợp đăng ký thay đổi người đại diện theo pháp luật đồng thời đăng ký, thông báo thay đổi nội dung đăng ký doanh nghiệp thì người có thẩm quyền theo quy định ký trực tiếp vào phần này.",
};

export const emptyAOptionState = () =>
    A_CHANGE_OPTIONS.reduce((acc, option) => {
        acc[option.name] = false;
        return acc;
    }, {});

export const emptyBeneficialOwnerChangeOptionState = () =>
    BENEFICIAL_OWNER_CHANGE_OPTIONS.reduce((acc, option) => {
        acc[option.name] = false;
        return acc;
    }, {});

export const emptyShareholderChangeOptionState = () =>
    SHAREHOLDER_CHANGE_OPTIONS.reduce((acc, option) => {
        acc[option.name] = false;
        return acc;
    }, {});

export const isTruthy = (value) => value === true || value === "true" || value === "co" || value === "Có";

export const normalizeDataJson = (rawData) => {
    if (!rawData) return {};

    let parsed = rawData;
    if (typeof parsed === "string") {
        try {
            parsed = JSON.parse(parsed);
        } catch (error) {
            return {};
        }
    }

    if (parsed?.dataJson) {
        if (typeof parsed.dataJson === "string") {
            try {
                parsed = JSON.parse(parsed.dataJson);
            } catch (error) {
                parsed = {};
            }
        } else if (typeof parsed.dataJson === "object") {
            parsed = parsed.dataJson;
        }
    }

    return parsed && typeof parsed === "object" ? parsed : {};
};
