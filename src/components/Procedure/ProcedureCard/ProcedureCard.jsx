import React, { useState } from "react";
import styles from "./ProcedureCard.module.css";
import demoProcedure from "@/assets/demo-procedure.jpg";
import ImageLightbox, { getImageOrigin } from "@/components/ImageLightbox/ImageLightbox";

const ProcedureCard = ({ procedure, onOpenModal, viewMode = "list" }) => {
    const [imageOrigin, setImageOrigin] = useState(null);
    const cardClassName = `${styles["procedure-card"]} ${viewMode === "grid" ? styles["procedure-card-grid"] : ""}`;
    const imageSrc = procedure.linkImage || demoProcedure;
    const openDetails = () => onOpenModal?.(procedure);

    return (
        <>
            <div className={cardClassName}>
                <button
                    type="button"
                    className={styles["image-trigger"]}
                    onClick={(event) => setImageOrigin(getImageOrigin(event.currentTarget.querySelector("img")))}
                    aria-label={`Xem toàn màn hình ảnh ${procedure.title}`}
                >
                    <img src={imageSrc} alt={procedure.title} className={styles["procedure-image"]} />
                </button>
                <div className={styles["procedure-info"]}>
                    <h3 className={styles["procedure-title"]}>
                        <button type="button" className={styles["title-button"]} onClick={openDetails}>
                            {procedure.title}
                        </button>
                    </h3>
                    <p className={styles["procedure-desc"]}>{procedure.description}</p>
                    <div className={styles["procedure-price-block"]}>
                        {procedure.salePrice && procedure.salePrice > 0 && procedure.salePrice < procedure.realPrice ? (
                            <>
                                <span className={styles["price-sale"]}>
                                    {Number(procedure.salePrice).toLocaleString("vi-VN")}đ
                                </span>
                                <span className={styles["price-original"]}>
                                    {Number(procedure.realPrice).toLocaleString("vi-VN")}đ
                                </span>
                            </>
                        ) : (
                            <span className={styles["price-sale"]}>
                                {Number(procedure.realPrice).toLocaleString("vi-VN")}đ
                            </span>
                        )}
                    </div>
                    <button type="button" className={styles["detail-btn"]} onClick={openDetails}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path
                                d="M5.39062 0.34375L9.98062 5.17383L5.39062 10.2539"
                                stroke="#0C0C0C"
                                strokeMiterlimit="10"
                            />
                            <path d="M0 5.80469H9" stroke="#0C0C0C" strokeMiterlimit="10" />
                        </svg>
                        <span>Chi tiết</span>
                    </button>
                </div>
            </div>

            {imageOrigin && (
                <ImageLightbox
                    src={imageSrc}
                    alt={procedure.title}
                    origin={imageOrigin}
                    onClose={() => setImageOrigin(null)}
                />
            )}
        </>
    );
};

export default ProcedureCard;
