import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import imageAdmin from "@/assets/avatar_user.png";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hàm kiểm tra active
    const isActive = (path) => location.pathname === path;

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        sessionStorage.clear(); // hoặc sessionStorage.removeItem("tên_key");
        navigate("/login");
    };

    return (
        <div className={styles.sidebar}>
            {/* User Info */}
            <div className={styles["sidebar-header"]}>
                <img src={imageAdmin} alt="avatar" className={styles["sidebar-avatar"]} />
                <div>
                    <h3 className={styles["sidebar-title"]}>Admin Panel</h3>
                    <p className={styles["sidebar-username"]}>
                        admin1 <i className="fa-solid fa-caret-down"></i>
                    </p>
                </div>
            </div>

            {/* Menu */}
            <div className={styles["sidebar-menu"]}>
                <Link to="/" className={styles["menu-item"]}>
                    <i className={`fa-solid fa-house ${styles["menu-icon"]}`}></i>
                    <span>Trang chủ</span>
                </Link>

                <Link
                    to="/dashboard"
                    className={`${styles["menu-item"]} ${isActive("/dashboard") ? styles.active : ""}`}
                >
                    <i className={`fa-solid fa-table-cells-large ${styles["menu-icon"]}`}></i>
                    <span>Dashboard</span>
                </Link>

                <Link
                    to="/list-course"
                    className={`${styles["menu-item"]} ${isActive("/list-course") ? styles.active : ""}`}
                >
                    <i className={`fa-solid fa-graduation-cap ${styles["menu-icon"]}`}></i>
                    <span>Khóa học</span>
                </Link>

                <Link
                    to="/list-procedure"
                    className={`${styles["menu-item"]} ${isActive("/list-procedure") ? styles.active : ""}`}
                >
                    <i className={`fa-solid fa-calendar-days ${styles["menu-icon"]}`}></i>
                    <span>Thủ tục pháp lý</span>
                </Link>

                <Link
                    to="/list-customer"
                    className={`${styles["menu-item"]} ${isActive("/list-customer") ? styles.active : ""}`}
                >
                    <i className={`fa-solid fa-user ${styles["menu-icon"]}`}></i>
                    <span>Khách hàng</span>
                </Link>

                <Link to="/sales" className={`${styles["menu-item"]} ${isActive("/sales") ? styles.active : ""}`}>
                    <i className={`fa-solid fa-clipboard-list ${styles["menu-icon"]}`}></i>
                    <span>Giao dịch</span>
                </Link>

                <Link to="/sales" className={`${styles["menu-item"]} ${isActive("/consult") ? styles.active : ""}`}>
                    <i className={`fa-solid fa-comments ${styles["menu-icon"]}`}></i>
                    <span>Tư vấn</span>
                </Link>

                <Link to="/sales" className={`${styles["menu-item"]} ${isActive("/questions") ? styles.active : ""}`}>
                    <i className={`fa-solid fa-circle-question ${styles["menu-icon"]}`}></i>
                    <span>Câu hỏi</span>
                </Link>

                {/* Đăng xuất */}
                <div
                    className={`${styles["menu-item"]} ${isActive("/questions") ? styles.active : ""}`}
                    onClick={handleLogout}
                >
                    <i className={`fa-solid fa-right-from-bracket ${styles["menu-icon"]}`}></i>
                    <span>Đăng xuất</span>
                </div>
            </div>

            {/* Footer */}
            <div className={styles["sidebar-footer"]}>
                <h4>WETECH</h4>
                <p>Version: 1.0.0</p>
            </div>
        </div>
    );
};

export default Sidebar;
