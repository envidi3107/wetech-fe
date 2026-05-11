import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { generateHtmlString } from "@/utils/generateHtmlFile";
import htmlDocx from "html-docx-js/dist/html-docx";
import { authAxios } from "@/services/axios-instance";
import styles from "./DeclarationForms.module.css";
import { useNotification } from "@/hooks/useNotification";

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

            try {
                const element = pdfContentRef.current;
                const filename = `${currentForm.code || "form"}.html`;

                // Chuyển toàn bộ nội dung form đã render thành file HTML chuẩn.
                const htmlString = generateHtmlString(element, {
                    title: currentForm.code || "Biểu mẫu",
                    landscape,
                });

                const htmlBlob = new Blob([htmlString], { type: "text/html; charset=utf-8" });
                const htmlFile = new File([htmlBlob], filename, { type: "text/html" });

                // Tạo DOCX từ HTML hiển thị tốt hơn trên Word
                const docxBlob = htmlDocx.asBlob(htmlString);
                const docxFilename = `${currentForm.code || "form"}.docx`;
                const docxFile = new File([docxBlob], docxFilename, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

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
                showNotification(err?.response?.data?.message || "Xác nhận biểu mẫu thất bại! Vui lòng thử lại", "error");
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
