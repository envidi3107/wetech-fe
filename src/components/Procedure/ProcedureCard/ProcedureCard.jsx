import React from "react";
import styles from "./ProcedureCard.module.css";
import demoProcedure from "@/assets/demo-procedure.jpg";

const ProcedureCard = ({ procedure, onOpenModal, viewMode = "list" }) => {
    const cardClassName = `${styles["procedure-card"]} ${viewMode === "grid" ? styles["procedure-card-grid"] : ""}`;

    return (
        <div className={cardClassName}>
            <img
                src={procedure.linkImage || demoProcedure}
                alt={procedure.title}
                className={styles["procedure-image"]}
            />
            <div className={styles["procedure-info"]}>
                <h3 className={styles["procedure-title"]}>{procedure.title}</h3>
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
                <button type="button" className={styles["detail-btn"]} onClick={() => onOpenModal && onOpenModal(procedure)}>
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
    );
};

export default ProcedureCard;
