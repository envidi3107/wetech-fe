import React, { useState, useRef } from "react";
import styles from "./UploadCCCD.module.css";
import imageIcon from "@/assets/image-icon.png";
import plusIcon from "@/assets/Plus_perspective_matte.png";

const GO_QUICK_BASE_URL = (
    process.env.REACT_APP_GO_QUICK_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    "http://localhost:5000"
).replace(/\/$/, "");
const GO_QUICK_PREFIX = "/api/go-quick";
const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 200;

const buildGoQuickUrl = (path) => {
    if (GO_QUICK_BASE_URL.endsWith(GO_QUICK_PREFIX)) {
        return `${GO_QUICK_BASE_URL}${path}`;
    }
    return `${GO_QUICK_BASE_URL}${GO_QUICK_PREFIX}${path}`;
};

const parseApiError = async (response) => {
    try {
        const data = await response.json();
        return data?.message || data?.error || response.statusText;
    } catch (error) {
        return response.statusText;
    }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeDate = (value) => {
    if (!value) return "";
    const cleaned = String(value).trim().replace(/[.-]/g, "/");
    const ymdMatch = cleaned.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
    if (ymdMatch) {
        const [, year, month, day] = ymdMatch;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const dmyMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!dmyMatch) return value;

    const [, day, month, year] = dmyMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const normalizeGender = (value) => {
    const gender = String(value || "")
        .trim()
        .toLowerCase();
    if (!gender) return "";
    if (gender.includes("nam")) return "Nam";
    if (gender.includes("nữ") || gender.includes("nu")) return "Nữ";
    return value;
};

const normalizeExtractedCustomer = (result) => {
    const customers = Array.isArray(result?.customer) ? result.customer : [];
    const customer = customers[0] || result?.customer || result || {};

    return {
        fullName: customer.name || "",
        gender: normalizeGender(customer.gender),
        dob: normalizeDate(customer.birth_date),
        cccd: String(customer.id_card || "").replace(/\D/g, ""),
        issueDate: normalizeDate(customer.created_date || customer.issue_date),
        issuePlace: customer.place_created || customer.issue_place || "",
        expiryDate: normalizeDate(customer.expiry_date),
        hometown: customer.hometown || "",
        address: customer.address || "",
        raw: customer,
    };
};

export default function UploadCCCD({ onComplete }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1); // 1: Front, 2: Back, 3: Review
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractMessage, setExtractMessage] = useState("");
    const [extractError, setExtractError] = useState("");

    const [frontFile, setFrontFile] = useState(null);
    const [backFile, setBackFile] = useState(null);
    const [frontPreview, setFrontPreview] = useState(null);
    const [backPreview, setBackPreview] = useState(null);

    const [tempFrontFile, setTempFrontFile] = useState(null);
    const [tempBackFile, setTempBackFile] = useState(null);
    const [tempFrontPreview, setTempFrontPreview] = useState(null);
    const [tempBackPreview, setTempBackPreview] = useState(null);

    const fileInputRef = useRef(null);

    const isCompleted = frontFile && backFile;

    const handleOpen = () => {
        setIsOpen(true);
        // Bắt đầu lại từ đầu
        setStep(1);
        setTempFrontFile(null);
        setTempBackFile(null);
        setTempFrontPreview(null);
        setTempBackPreview(null);
        setExtractMessage("");
        setExtractError("");
    };

    const handleClose = () => setIsOpen(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        if (step === 1) {
            setTempFrontFile(file);
            setTempFrontPreview(previewUrl);
        } else if (step === 2) {
            setTempBackFile(file);
            setTempBackPreview(previewUrl);
        }

        // Reset the value so we can select the same file again if needed
        e.target.value = null;
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleConfirmStep = () => {
        setExtractError("");
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const pollJobResult = async (jobId) => {
        for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
            const response = await fetch(buildGoQuickUrl(`/job-progress/${jobId}`));
            if (!response.ok) {
                throw new Error(await parseApiError(response));
            }

            const payload = await response.json();
            const job = payload?.data;
            if (!job) {
                throw new Error(payload?.message || "Không nhận được trạng thái xử lý CCCD");
            }

            if (job.message || typeof job.progress === "number") {
                setExtractMessage(job.message || `Đang xử lý ${job.progress}%`);
            }

            if (job.status === "completed") {
                return job.result;
            }

            if (job.status === "failed" || job.status === "cancelled") {
                throw new Error(job.error || job.message || "Không thể trích xuất thông tin CCCD");
            }

            await sleep(POLL_INTERVAL_MS);
        }

        throw new Error("Quá thời gian xử lý CCCD, vui lòng thử lại");
    };

    const extractCCCD = async (front, back) => {
        const formData = new FormData();
        formData.append("mt", front);
        formData.append("ms", back);

        const response = await fetch(buildGoQuickUrl("/read-quick"), {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(await parseApiError(response));
        }

        const payload = await response.json();
        if (payload?.job_id) {
            setExtractMessage("Đã gửi ảnh CCCD, đang chờ xử lý...");
            return pollJobResult(payload.job_id);
        }

        return payload;
    };

    const handleExtract = async () => {
        if (!tempFrontFile || !tempBackFile || isExtracting) return;

        setIsExtracting(true);
        setExtractError("");
        setExtractMessage("Đang tải ảnh CCCD...");

        try {
            const result = await extractCCCD(tempFrontFile, tempBackFile);
            const extractedCustomer = normalizeExtractedCustomer(result);

            if (!extractedCustomer.fullName && !extractedCustomer.cccd) {
                throw new Error(result?.message || "Không tìm thấy thông tin CCCD trong ảnh đã tải lên");
            }

            setFrontFile(tempFrontFile);
            setBackFile(tempBackFile);
            setFrontPreview(tempFrontPreview);
            setBackPreview(tempBackPreview);

            if (onComplete) {
                onComplete(extractedCustomer, {
                    frontFile: tempFrontFile,
                    backFile: tempBackFile,
                    rawResult: result,
                });
            }
            handleClose();
        } catch (error) {
            setExtractError(error?.message || "Không thể trích xuất thông tin CCCD");
        } finally {
            setIsExtracting(false);
            setExtractMessage("");
        }
    };

    const currentPreview = step === 1 ? tempFrontPreview : tempBackPreview;

    return (
        <div className={styles.uploadCCCDContainer}>
            {/* Main Trigger UI */}
            <div className={styles.imageUploadColumn}>
                <div className={styles.uploadBox}>
                    {frontPreview ? (
                        <img src={frontPreview} alt="Mặt trước CCCD" className={styles.previewImg} />
                    ) : (
                        <span>
                            <img src={imageIcon} alt="Upload" className={styles.uploadIcon} />
                            Mặt trước
                        </span>
                    )}
                </div>
                <div className={styles.uploadBox}>
                    {backPreview ? (
                        <img src={backPreview} alt="Mặt sau CCCD" className={styles.previewImg} />
                    ) : (
                        <span>
                            <img src={imageIcon} alt="Upload" className={styles.uploadIcon} />
                            Mặt sau
                        </span>
                    )}
                </div>
                {isCompleted ? (
                    <button type="button" className={styles.uploadButton} onClick={handleOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M8.0625 7.68647L12 3.75L15.9375 7.68647"
                                stroke="#1B154B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 14.2492V3.75195"
                                stroke="#1B154B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M20.25 14.25V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25"
                                stroke="#1B154B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>{" "}
                        Cập nhật ảnh
                    </button>
                ) : (
                    <button type="button" className={styles.uploadButton} onClick={handleOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M8.0625 7.68647L12 3.75L15.9375 7.68647"
                                stroke="#1B154B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 14.2492V3.75195"
                                stroke="#1B154B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M20.25 14.25V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25"
                                stroke="#1B154B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>{" "}
                        Photo CCCD
                    </button>
                )}
            </div>

            {/* Popup Modal */}
            {isOpen && (
                <div className={styles.modalOverlay} onClick={handleClose}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Trích xuất thông tin từ CCCD</h2>
                            <button type="button" className={styles.closeButton} onClick={handleClose}>
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path
                                        fill="currentColor"
                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {step < 3 ? (
                                <>
                                    <div className={styles.dottedBox}>
                                        {currentPreview ? (
                                            <img
                                                src={currentPreview}
                                                alt="Preview"
                                                className={styles.popupPreviewImg}
                                                style={{
                                                    width: "100%",
                                                    maxHeight: "200px",
                                                    objectFit: "contain",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <img
                                                    src={imageIcon}
                                                    alt=""
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        objectFit: "contain",
                                                        marginBottom: "8px",
                                                    }}
                                                />
                                                <span className={styles.boxText}>
                                                    {step === 1 ? "Mặt trước" : "Mặt sau"}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {!currentPreview ? (
                                        <>
                                            <h3 className={styles.blueHeading}>Tải lên ảnh CCCD (Vneid) ở đây!</h3>
                                            <p className={styles.mutedText}>Vui lòng tải ảnh rõ nét từ Vneid</p>
                                            <p className={styles.mutedTextSmall}>
                                                Kích thước tối đa của một tập tin là{" "}
                                                <span className={styles.boldText}>5 MB</span>
                                            </p>
                                            <button
                                                type="button"
                                                className={styles.actionButton}
                                                onClick={triggerFileInput}
                                                disabled={isExtracting}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M8.0625 7.68647L12 3.75L15.9375 7.68647"
                                                        stroke="#1B154B"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M12 14.2492V3.75195"
                                                        stroke="#1B154B"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M20.25 14.25V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25"
                                                        stroke="#1B154B"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>{" "}
                                                Photo CCCD
                                            </button>
                                        </>
                                    ) : (
                                        <div
                                            className={styles.actionRow}
                                            style={{
                                                marginTop: "20px",
                                                width: "320px",
                                                display: "flex",
                                                gap: "10px",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className={styles.actionButton}
                                                onClick={triggerFileInput}
                                                disabled={isExtracting}
                                            >
                                                Thử lại
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.actionButtonPrimary}
                                                onClick={handleConfirmStep}
                                                disabled={isExtracting}
                                            >
                                                Xác nhận
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.reviewContainer}>
                                    <div className={styles.reviewImages}>
                                        <div>
                                            <p>Mặt trước</p>
                                            <img src={tempFrontPreview} alt="Mặt trước" className={styles.reviewImg} />
                                        </div>
                                        <div>
                                            <p>Mặt sau</p>
                                            <img src={tempBackPreview} alt="Mặt sau" className={styles.reviewImg} />
                                        </div>
                                    </div>
                                    {extractMessage && <p className={styles.statusText}>{extractMessage}</p>}
                                    {extractError && <p className={styles.errorText}>{extractError}</p>}
                                    <button
                                        type="button"
                                        className={styles.actionButton}
                                        onClick={handleExtract}
                                        disabled={isExtracting}
                                    >
                                        <img src={plusIcon} alt="" />
                                        Nhập thông tin
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                key={step} // reset input for each step
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
