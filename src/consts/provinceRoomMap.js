/**
 * Map tỉnh/thành phố → tên phòng đăng ký kinh doanh (Sở KH&ĐT)
 * Dùng để tự động điền "Kính gửi" dựa trên địa chỉ trụ sở.
 */
export const PROVINCE_ROOM_MAP = {
    "Thành phố Cần Thơ": "Phòng Đăng ký kinh doanh",
    "Thành phố Đà Nẵng": "Phòng Doanh nghiệp và Đăng ký kinh doanh",
    "Thành phố Hà Nội": "Phòng Đăng ký kinh doanh và Tài chính doanh nghiệp",
    "Thành phố Hải Phòng": "Phòng Đăng ký kinh doanh và Quản lý doanh nghiệp",
    "Thành phố Hồ Chí Minh": "Phòng Đăng ký kinh doanh",
    "Tỉnh An Giang": "Phòng Doanh nghiệp – Hợp tác đầu tư",
    "Tỉnh Bắc Ninh": "Phòng Đăng ký kinh doanh và Quản lý doanh nghiệp",
    "Tỉnh Cà Mau": "Phòng Đăng ký kinh doanh",
    "Tỉnh Cao Bằng": "Phòng Quản lý doanh nghiệp – Đăng ký kinh doanh",
    "Tỉnh Đắk Lắk": "Phòng Quản lý doanh nghiệp",
    "Tỉnh Điện Biên": "Phòng Đăng ký kinh doanh",
    "Thành phố Đồng Nai": "Phòng Đăng ký kinh doanh",
    "Tỉnh Đồng Tháp": "Phòng Đăng ký kinh doanh",
    "Tỉnh Gia Lai": "Phòng Doanh nghiệp và Kinh tế tập thể",
    "Tỉnh Hà Tĩnh": "Phòng Đăng ký kinh doanh",
    "Tỉnh Hưng Yên": "Phòng Đăng ký kinh doanh",
    "Tỉnh Khánh Hoà": "Phòng Quản lý doanh nghiệp",
    "Tỉnh Lai Châu": "Phòng Quản lý doanh nghiệp và Đăng ký kinh doanh",
    "Tỉnh Lạng Sơn": "Phòng Đăng ký kinh doanh",
    "Tỉnh Lào Cai": "Phòng Doanh nghiệp",
    "Tỉnh Lâm Đồng": "Phòng Đăng ký kinh doanh",
    "Tỉnh Nghệ An": "Phòng Đăng ký kinh doanh",
    "Tỉnh Ninh Bình": "Phòng Doanh nghiệp",
    "Tỉnh Phú Thọ": "Phòng Đăng ký kinh doanh",
    "Tỉnh Quảng Ngãi": "Phòng Đăng ký kinh doanh",
    "Tỉnh Quảng Ninh": "Phòng Quản lý doanh nghiệp",
    "Tỉnh Quảng Trị": "Phòng Đăng ký Kinh doanh",
    "Tỉnh Sơn La": "Phòng Quản lý doanh nghiệp và Đăng ký kinh doanh",
    "Tỉnh Tây Ninh": "Phòng Đăng ký kinh doanh",
    "Tỉnh Thái Nguyên": "Phòng Đăng ký kinh doanh",
    "Tỉnh Thanh Hoá": "Phòng Đăng ký kinh doanh",
    "Thành phố Huế": "Phòng Đăng ký kinh doanh",
    "Tỉnh Tuyên Quang": "Phòng Doanh nghiệp và Đăng ký kinh doanh",
    "Tỉnh Vĩnh Long": "Phòng Phát triển doanh nghiệp và Kinh tế tập thể",
};

export function buildKinhGui(provinceName) {
    if (!provinceName) return "";
    const room = PROVINCE_ROOM_MAP[provinceName];
    if (!room) return `${provinceName}`;
    return `${room} ${provinceName}`;
}
