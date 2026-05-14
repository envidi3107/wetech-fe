import React from "react";
import styles from "./ProgressStepper.module.css";

const ProgressStepper = ({ currentStep = 3, isSuccess = false, steps = [] }) => {
    if (steps.length <= 1) return null;

    return (
        <div className={styles["header-payment"]}>
            <div className={styles.steps}>
                {steps.map((step, index) => {
                    let status = "";
                    if (currentStep > step.id) status = "done";
                    else if (currentStep === step.id) {
                        status = "active";
                        if (step.id === 3 && isSuccess) status = "success";
                        if (step.id === 3 && isSuccess === false) status = "failed";
                    }

                    return (
                        <div key={step.id} className={`${styles["step-item"]} ${status ? styles[status] : ""}`}>
                            <div className={styles["step-circle"]}>
                                {status === "done" || status === "success" ? (
                                    <i className="fa-solid fa-check"></i>
                                ) : (
                                    <span>{step.id + 1}</span>
                                )}
                            </div>
                            <div className={styles["step-label"]}>{step.label}</div>
                            {index < steps.length - 1 && <div className={styles["step-line"]}></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressStepper;
