import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useCart } from "@/context/CartContext";
import logoImage from "@/assets/logo.png";
import avatarImage from "@/assets/avatar_user.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SearchInput from "@/components/SearchInput/SearchInput";

const Navbar = () => {
    const { cartCount } = useCart();
    const { user, logout, isAuthenticated } = useAuth();

    // Fallback values if user is null (though isAuthenticated should handle showing/hiding)
    const fullname = user?.fullname || "Người dùng";
    const email = user?.email || "Chưa có email";
    const linkImage = user?.linkImage || avatarImage;
    const isAdmin = String(user?.role || "").toUpperCase().includes("ADMIN");

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const [isProcedureDropdownOpen, setIsProcedureDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const userDropdownRef = useRef(null);
    const servicesDropdownRef = useRef(null);
    const procedureDropdownRef = useRef(null);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
        setIsServicesDropdownOpen(false);
    };

    const toggleServicesDropdown = () => {
        setIsServicesDropdownOpen(!isServicesDropdownOpen);
        setIsUserDropdownOpen(false);
    };

    const toggleProcedureDropdown = () => {
        setIsProcedureDropdownOpen(!isProcedureDropdownOpen);
        setIsUserDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsUserDropdownOpen(false);
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        if (isUserDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isUserDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
                setIsServicesDropdownOpen(false);
            }
        };
        if (isServicesDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isServicesDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (procedureDropdownRef.current && !procedureDropdownRef.current.contains(event.target)) {
                setIsProcedureDropdownOpen(false);
            }
        };
        if (isProcedureDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProcedureDropdownOpen]);

    return (
        <div className={styles["navbar"]}>
            <div className={styles["navbar-top-bar"]}></div>
            <div className={styles["navbar-container-main"]}>
                <div className={styles["navbar-container"]}>
                    <div className={`${styles["navbar-brand"]} ${styles["navbar-menu"]}`}>
                        <img src={logoImage} alt="WE-TECH Logo" className={styles.logo} />

                        <div className={styles["nav-item"]}>
                            <Link to="/">TRANG CHỦ</Link>
                        </div>
                        <div className={styles["nav-item"]}>
                            <Link to="/">GIỚI THIỆU</Link>
                        </div>

                        {/* <div
                            className={`${styles["nav-item"]} ${styles["menu-item-dropdown"]}`}
                            ref={servicesDropdownRef}
                        >
                            <div className={styles["dropdown-toggle"]} onClick={toggleServicesDropdown}>
                                LOẠI KHÓA HỌC <i className="fas fa-caret-down"></i>
                            </div>
                            {isServicesDropdownOpen && (
                                <div className={`${styles["dropdown-menu"]} ${styles["dropdown-service-menu"]}`}>
                                    <ul>
                                        <li>
                                            <Link to="/course-filter/thanh-lap-cong-ty">Thành lập công ty</Link>
                                        </li>
                                        <li>
                                            <Link to="/course-filter/thanh-lap-ho-kinh-doanh">
                                                Thành lập Hộ kinh doanh
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/course-filter/giai-the-cong-ty">Giải thể Công ty</Link>
                                        </li>
                                        <li>
                                            <Link to="/course-filter/giai-the-ho-kinh-doanh">
                                                Giải thể Hộ kinh doanh
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/course-filter/dang-ky-thay-doi">Đăng kí thay đổi</Link>
                                        </li>
                                        <li>
                                            <Link to="/course-filter/sap-nhap-tinh">Sáp nhập Tỉnh</Link>
                                        </li>
                                        <li>
                                            <Link to="/course-filter/cap-nhat-len-cccd">Cập nhật lên CCCD</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div> */}

                        <div
                            className={`${styles["nav-item"]} ${styles["menu-item-dropdown"]}`}
                            ref={procedureDropdownRef}
                        >
                            <div className={styles["dropdown-toggle"]} onClick={toggleProcedureDropdown}>
                                DỊCH VỤ PHÁP LÝ <i className="fas fa-caret-down"></i>
                            </div>
                            {isProcedureDropdownOpen && (
                                <div className={`${styles["dropdown-menu"]} ${styles["dropdown-service-menu"]}`}>
                                    <ul>
                                        <li className={styles["submenu-item"]}>
                                            <div className={styles["submenu-toggle"]}>
                                                Xem tất cả <i className="fas fa-caret-right"></i>
                                            </div>
                                            <div className={styles["submenu"]}>
                                                <ul>
                                                    <li>
                                                        <Link to="/list-procedures/cong_ty_tnhh_mot_thanh_vien">
                                                            Công ty TNHH 1 thành viên
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/list-procedures/cong_ty_tnhh_hai_thanh_vien_tro_len">
                                                            Công ty TNHH 2 thành viên trở lên
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/list-procedures/cong_ty_co_phan">
                                                            Công ty cổ phần
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/list-procedures/doanh_nghiep_tu_nhan">
                                                            Doanh nghiệp tư nhân
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/list-procedures/ho_kinh_doanh">Hộ kinh doanh</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to="/procedure-filter">Tìm kiếm dịch vụ pháp lý</Link>
                                        </li>
                                        <li>
                                            <Link to="/procedure/search">Tra cứu hồ sơ của tôi</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className={styles["nav-item"]}>
                            <Link to="/list-courses">KHÓA HỌC</Link>
                        </div>
                        <div className={styles["nav-item"]}>
                            <Link to="/contact-us">LIÊN HỆ</Link>
                        </div>
                    </div>

                    <SearchInput />

                    <div className={styles["navbar-right"]}>
                        <Link to="/cart" className={styles["cart-link"]} title="Giỏ hàng">
                            <i className={`fas fa-shopping-cart ${styles["cart-icon"]}`}></i>
                            {cartCount > 0 && <span className={styles["cart-badge"]}>{cartCount}</span>}
                        </Link>

                        {!isAuthenticated ? (
                            <div className={styles["navbar-right-btn"]}>
                                <button className={styles["btn-outline"]}>
                                    <Link to="/register">Đăng Ký</Link>
                                </button>
                                <button className={styles["btn-filled"]}>
                                    <Link to="/login">Đăng Nhập</Link>
                                </button>
                            </div>
                        ) : (
                            <div className={styles["user-profile"]} ref={userDropdownRef}>
                                <div className={styles["avatar-container"]} onClick={toggleUserDropdown}>
                                    <img src={linkImage} alt="User Avatar" className={styles["user-avatar-img"]} />
                                    <i className={`fas fa-caret-down ${styles["dropdown-arrow"]}`}></i>
                                </div>
                                {isUserDropdownOpen && (
                                    <div className={`${styles["dropdown-menu"]} ${styles["dropdown-user-menu"]}`}>
                                        <div className={styles["dropdown-user-info"]}>
                                            <h4>{fullname || "Người dùng"}</h4>
                                            <p>{email || "Chưa có email"}</p>
                                        </div>
                                        <hr className={styles["dropdown-divider"]} />
                                        <ul>
                                            {isAdmin && (
                                                <li>
                                                    <Link to="/dashboard">Trang quản trị</Link>
                                                </li>
                                            )}
                                            <li>
                                                <Link to="/my-courses">Khóa học của tôi</Link>
                                            </li>
                                            <li>
                                                <Link to="/procedure-filter">Thủ tục pháp lý</Link>
                                            </li>
                                            <li>
                                                <Link>Lịch sử</Link>
                                            </li>
                                        </ul>
                                        <hr className={styles["dropdown-divider"]} />
                                        <ul>
                                            <li>
                                                <Link to="/change-password">Đổi mật khẩu</Link>
                                            </li>
                                            <li>
                                                <Link to="/profile">Thiết lập tài khoản</Link>
                                            </li>
                                        </ul>
                                        <hr className={styles["dropdown-divider"]} />
                                        <ul>
                                            <li onClick={handleLogout} className={styles["logout-item"]}>
                                                Đăng xuất
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
