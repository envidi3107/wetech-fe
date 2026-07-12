import React, { useCallback, useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { generateHtmlString, getDocExportPageMarginsTwips, getDocExportPageSizeTwips } from "@/utils/generateHtmlFile";
import { authAxios } from "@/services/axios-instance";
import styles from "./DeclarationForms.module.css";
import Tooltip from "@/components/Tooltip/Tooltip";
import { useNotification } from "@/hooks/useNotification";

const DATA_RELOAD_COOLDOWN_SECONDS = 5;

// Cỡ chữ chuẩn cho văn bản hành chính là 14pt. 
// Engine xuất Word (html-to-docx) yêu cầu truyền vào đơn vị half-points (1/2 pt).
// Do đó fontSize truyền vào sẽ là 14 * 2 = 28.
const DOCX_EXPORT_FONT_SIZE_PT = 13;
const DOCX_EXPORT_FONT_SIZE_HALF_PT = DOCX_EXPORT_FONT_SIZE_PT * 2;

function getServerErrorMessage(error) {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    return responseData?.message;
}

function getConfirmErrorMessage(error, submitStage) {
    const serverMessage = getServerErrorMessage(error);
    if (serverMessage) {
        return serverMessage;
    }

    if (error?.response?.status) {
        return `Xác nhận biểu mẫu thất bại ở bước ${submitStage} (HTTP ${error.response.status}). Vui lòng thử lại`;
    }

    if (error?.message) {
        return `Xác nhận biểu mẫu thất bại ở bước ${submitStage}: ${error.message}. Vui lòng thử lại`;
    }

    return "Xác nhận biểu mẫu thất bại! Vui lòng thử lại";
}

const FormsConfirmation = forwardRef(({ forms, currentFormStep = 0, onStepSubmitSuccess }, ref) => {
    const [dataJson, setDataJson] = useState(null);
    const [isDataJsonLoading, setIsDataJsonLoading] = useState(false);
    const [reloadCooldown, setReloadCooldown] = useState(0);
    const pdfContentRef = useRef(null);

    const currentForm = forms?.[currentFormStep];
    const CurrentFormComponent = currentForm?.confirmation;
    const { showNotification } = useNotification();

    const fetchFormSubmission = useCallback(async () => {
        if (!currentForm?.formId) return;

        setIsDataJsonLoading(true);
        setDataJson(null);
        try {
            const response = await authAxios.get(`/api/form-submission/get/data-json`, {
                params: { formId: currentForm.formId },
            });
            setDataJson(response.data);
        } catch (error) {
            setDataJson(null);
            console.error("Error fetching form submission for confirmation:", error);
        } finally {
            setIsDataJsonLoading(false);
        }
    }, [currentForm?.formId]);

    useEffect(() => {
        fetchFormSubmission();
    }, [fetchFormSubmission]);

    useEffect(() => {
        if (reloadCooldown <= 0) return undefined;

        const timerId = setInterval(() => {
            setReloadCooldown((seconds) => Math.max(seconds - 1, 0));
        }, 1000);

        return () => clearInterval(timerId);
    }, [reloadCooldown]);

    const handleReloadDataJson = useCallback(() => {
        if (isDataJsonLoading || reloadCooldown > 0) return;

        setReloadCooldown(DATA_RELOAD_COOLDOWN_SECONDS);
        fetchFormSubmission();
    }, [fetchFormSubmission, isDataJsonLoading, reloadCooldown]);

    // Expose submitCurrentForm
    useImperativeHandle(ref, () => ({
        submitCurrentForm: async (landscape = false) => {
            if (!pdfContentRef.current) return;

            let submitStage = "khởi tạo";

            try {
                const element = pdfContentRef.current;
                const filename = `${currentForm.code || "form"}.html`;

                submitStage = "tạo HTML";

                // Chuyển toàn bộ nội dung form đã render thành file HTML chuẩn.
                const htmlString = generateHtmlString(element, {
                    title: currentForm.code || "Biểu mẫu",
                    landscape,
                });

                const htmlBlob = new Blob([htmlString], { type: "text/html; charset=utf-8" });
                const htmlFile = new File([htmlBlob], filename, { type: "text/html" });

                submitStage = "tạo DOCX HTML";

                const docxHtmlString = generateHtmlString(element, {
                    title: currentForm.code || "Biểu mẫu",
                    landscape,
                    normalizeForWord: true,
                });

                const docxHtmlBlob = new Blob([docxHtmlString], { type: "text/html; charset=utf-8" });
                const docxHtmlFile = new File([docxHtmlBlob], `docx_${filename}`, { type: "text/html" });

                const docxDocumentOptions = {
                    orientation: landscape ? "landscape" : "portrait",
                    pageSize: getDocExportPageSizeTwips(landscape),
                    margins: getDocExportPageMarginsTwips(landscape),
                    title: currentForm.code || "Bieu mau",
                    creator: "Wetech",
                    lang: "vi-VN",
                    font: "Times New Roman",
                    fontSize: DOCX_EXPORT_FONT_SIZE_HALF_PT,
                    complexScriptFontSize: DOCX_EXPORT_FONT_SIZE_HALF_PT,
                    table: {
                        row: {
                            cantSplit: false,
                        },
                        addSpacingAfter: false,
                    },
                    preprocessing: {
                        skipHTMLMinify: true,
                    },
                    imageProcessing: {
                        svgHandling: "native",
                        suppressSharpWarning: true,
                    },
                };

                submitStage = "gửi API xác nhận";

                // Gửi FormData lên server
                const formData = new FormData();
                formData.append("formId", currentForm.formId);
                formData.append("htmlFile", htmlFile);
                formData.append("docxHtmlFile", docxHtmlFile);
                formData.append("docxOptions", JSON.stringify(docxDocumentOptions));
                formData.append("landscape", landscape);

                await authAxios.post("/api/form-submission/confirm", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (onStepSubmitSuccess) {
                    onStepSubmitSuccess();
                }
            } catch (err) {
                console.error("[FormsConfirmation] submitCurrentForm failed", {
                    submitStage,
                    message: err?.message,
                    status: err?.response?.status,
                    response: err?.response?.data,
                    error: err,
                });
                showNotification(getConfirmErrorMessage(err, submitStage), "error");
            }
        },
    }));

    if (!currentForm) {
        return <div style={{ padding: "40px", textAlign: "center" }}>Đang tải biểu mẫu...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.dataJsonToolbar}>
                {isDataJsonLoading && (
                    <div className={styles.dataJsonLoading} role="status" aria-live="polite">
                        <span className={styles.dataJsonSpinner} aria-hidden="true" />
                        <span className={styles.dataJsonTyping}>Đang tải dữ liệu....</span>
                    </div>
                )}
                <Tooltip text="Tải lại dữ liệu">
                    <button
                        type="button"
                        className={styles.reloadDataButton}
                        onClick={handleReloadDataJson}
                        disabled={isDataJsonLoading || reloadCooldown > 0}
                        aria-label={
                            reloadCooldown > 0 ? `Có thể tải lại dữ liệu sau ${reloadCooldown} giây` : "Tải lại dữ liệu"
                        }
                    >
                        {reloadCooldown > 0 ? `${reloadCooldown}s` : "↻"}
                    </button>
                </Tooltip>
            </div>
            {CurrentFormComponent ? (
                // Wrapper ref để generateHtmlFile đọc nội dung đã render
                <div ref={pdfContentRef}>
                    <CurrentFormComponent dataJson={dataJson} />
                </div>
            ) : (
                <div style={{ padding: "40px", textAlign: "center" }}>Không tìm thấy mẫu xác nhận...</div>
            )}
        </div>
    );
});

FormsConfirmation.displayName = "FormsConfirmation";
export default FormsConfirmation;
