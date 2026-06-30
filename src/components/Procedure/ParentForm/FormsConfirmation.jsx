import React, { useCallback, useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { generateHtmlString, getDocExportPageMarginsTwips } from "@/utils/generateHtmlFile";
import htmlDocx from "html-docx-js/dist/html-docx";
import { authAxios } from "@/services/axios-instance";
import styles from "./DeclarationForms.module.css";
import Tooltip from "@/components/Tooltip/Tooltip";
import { useNotification } from "@/hooks/useNotification";

const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const DATA_RELOAD_COOLDOWN_SECONDS = 5;

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
        return `Xác nhận biểu mẫu thất bại ở bước ${submitStage} (HTTP ${error.response.status})`;
    }

    if (error?.message) {
        return `Xác nhận biểu mẫu thất bại ở bước ${submitStage}: ${error.message}`;
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
                const docxHtmlString = generateHtmlString(element, {
                    title: currentForm.code || "Biểu mẫu",
                    landscape,
                    normalizeForWord: true,
                });

                const htmlBlob = new Blob([htmlString], { type: "text/html; charset=utf-8" });
                const htmlFile = new File([htmlBlob], filename, { type: "text/html" });

                submitStage = "tạo DOCX";

                // Tạo DOCX từ HTML hiển thị tốt hơn trên Word
                const orientation = landscape ? "landscape" : "portrait";
                const docxBlob = htmlDocx.asBlob(docxHtmlString, {
                    orientation,
                    margins: getDocExportPageMarginsTwips(landscape),
                });
                const docxFilename = `${currentForm.code || "form"}.docx`;
                const docxFile = new File([docxBlob], docxFilename, {
                    type: DOCX_MIME_TYPE,
                });

                submitStage = "gửi API xác nhận";

                // Gửi FormData lên server
                const formData = new FormData();
                formData.append("formId", currentForm.formId);
                formData.append("htmlFile", htmlFile);
                formData.append("docxFile", docxFile);
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
