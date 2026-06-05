import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { generateHtmlString } from "@/utils/generateHtmlFile";
import htmlDocx from "html-docx-js/dist/html-docx";
import { authAxios } from "@/services/axios-instance";
import styles from "./DeclarationForms.module.css";
import { useNotification } from "@/hooks/useNotification";

const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const DOCX_MARGINS = {
    top: 850,
    right: 850,
    bottom: 1134,
    left: 850,
    header: 0,
    footer: 0,
    gutter: 0,
};

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
    const pdfContentRef = useRef(null);

    const currentForm = forms?.[currentFormStep];
    const CurrentFormComponent = currentForm?.confirmation;
    const { showNotification } = useNotification();

    useEffect(() => {
        async function fetchFormSubmission() {
            if (!currentForm?.formId) return;
            setDataJson(null);
            try {
                const response = await authAxios.get(`/api/form-submission/get/data-json`, {
                    params: { formId: currentForm.formId },
                });
                setDataJson(response.data);
            } catch (error) {
                setDataJson(null);
                console.error("Error fetching form submission for confirmation:", error);
            }
        }
        fetchFormSubmission();
    }, [currentForm?.formId]);

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
                    margins: DOCX_MARGINS,
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
