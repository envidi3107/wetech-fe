import React, { useState } from "react";
import styles from "./CourseCardMini.module.css";
import { useNavigate } from "react-router-dom";
import ImageLightbox, { getImageOrigin } from "@/components/ImageLightbox/ImageLightbox";

const CourseCardMini = ({ index, course }) => {
    const navigate = useNavigate();
    const [imageOrigin, setImageOrigin] = useState(null);
    const handleClick = async () => {
        window.scrollTo(0, 0);
        navigate("/detail-course/" + course.courseId);
    };

    const discountPercentage = Math.round(((course?.realPrice - course?.salePrice) / course?.realPrice) * 100);
    // Hàm định dạng giá
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    // Hàm lấy chữ cái đầu
    const getInitials = (name) => {
        if (!name) return "U";
        const names = name.split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <>
            <div className={styles.courseCard} key={index} onClick={handleClick}>
                <div className={styles.courseImage}>
                    <button
                        type="button"
                        className={styles.imageTrigger}
                        onClick={(event) => {
                            event.stopPropagation();
                            setImageOrigin(getImageOrigin(event.currentTarget.querySelector("img")));
                        }}
                        aria-label={`Xem toàn màn hình ảnh ${course?.title}`}
                    >
                        <img src={course?.linkImage} alt={course?.title} />
                    </button>
                    <div className={styles.badgeContainer}>
                        <div className={`${styles.badge} ${styles.secondBadge}`}>Best Seller</div>
                        {discountPercentage > 0 && <div className={styles.badge}>{discountPercentage}% OFF</div>}
                    </div>
                </div>
                <div className={styles.courseInfo}>
                    <h4 className={styles.courseCardTitle}>{course?.title}</h4>

                    <div className={styles.courseAuthorRow}>
                        <div className={styles.authorAvatarInitials}>{getInitials(course?.author || "Hữu Hoàn")}</div>
                        <span className={styles.authorName}>{course?.author || "Hữu Hoàn"}</span>
                    </div>

                    <div className={styles.coursePriceRow}>
                        <span className={styles.currentPrice}>{formatPrice(course?.salePrice || 0)}đ</span>
                        {course?.realPrice > course?.salePrice && (
                            <span className={styles.originalPrice}>{formatPrice(course?.realPrice)}đ</span>
                        )}
                    </div>
                </div>
            </div>

            {imageOrigin && (
                <ImageLightbox
                    src={course?.linkImage}
                    alt={course?.title}
                    origin={imageOrigin}
                    onClose={() => setImageOrigin(null)}
                />
            )}
        </>
    );
};

export default CourseCardMini;
