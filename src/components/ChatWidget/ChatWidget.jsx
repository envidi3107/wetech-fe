import React, { useEffect, useState } from "react";
import styles from "./ChatWidget.module.css";
import iconLogoZalo from "@/assets/icon-zalo.png";
import logoWeTech from "@/assets/logo.png";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const location = window.location.href;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (location.includes("process-procedure")) return;

            setIsOpen(true);
        }, 30000);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <div className={styles["chat-widget-container"]}>
            {/* Khung chat */}
            {isOpen && (
                <div className={styles["chat-box"]}>
                    <div className={styles["chat-header"]}>
                        <div className={styles["chat-header-info"]}>
                            <img src={logoWeTech} alt="Logo" className={styles["logo-wetech"]} />
                            <div className={styles["chat-header-info-text"]}>
                                <h3>WeTech</h3>
                                <p>Giải pháp phần mềm kế toán</p>
                            </div>
                        </div>
                        <button className={styles["chat-close-btn"]} onClick={() => setIsOpen(false)}>
                            ✕
                        </button>
                    </div>

                    <div className={styles["chat-greeting"]}>
                        <p className={styles["greeting-title"]}>Xin chào!</p>
                        <p className={styles["greeting-text"]}>Rất vui khi được hỗ trợ bạn</p>
                    </div>

                    <div className={styles["chat-start"]}>Bắt đầu trò chuyện với WeTech</div>

                    <div className={styles["chat-buttons"]}>
                        <button
                            className={`${styles.btn} ${styles["btn-zalo"]}`}
                            onClick={() => window.open("https://zalo.me/0989466992", "_blank")}
                        >
                            <img src={iconLogoZalo} alt="Zalo" />
                            Chat bằng Zalo
                        </button>

                        <button
                            className={`${styles.btn} ${styles["btn-facebook"]}`}
                            onClick={() => window.open("https://web.facebook.com/ketoanthuemoclan", "_blank")}
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png"
                                alt="Facebook"
                            />
                            Chat bằng Facebook
                        </button>

                        <button className={`${styles.btn} ${styles["btn-contact"]}`}>Liên hệ ngay</button>
                    </div>
                </div>
            )}

            {/* Nút tròn nổi */}
            <button className={styles["chat-float-btn"]} onClick={() => setIsOpen(!isOpen)} aria-label="Mở chat">
                <i className="fa-solid fa-comments"></i>
            </button>
        </div>
    );
}
