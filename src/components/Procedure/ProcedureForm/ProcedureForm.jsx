import React, { useState, useEffect } from "react";
import styles from "./ProcedureForm.module.css";
import { authAxios } from "@/services/axios-instance";
import { useNotification } from "@/hooks/useNotification";
import { useNavigate } from "react-router-dom";
import typeCompanyOptions from "@/consts/typeCompany";

const ProcedureForm = ({ procedureId }) => {
    const { showSuccess, showError } = useNotification();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        realPrice: null,
        salePrice: null,
        typeCompany: typeCompanyOptions[0].value,
        typeCompanyTitle: typeCompanyOptions[0].title,
        serviceType: "",
        serviceTypeTitle: "",
        linkImage: "",
        imageFile: null,
    });

    const [forms, setForms] = useState([]);
    const [selectedProcedureType, setSelectedProcedureType] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const allFormTypes = [];

    // ============ Derived options from typeCompany ============

    // Danh sách services theo typeCompany đang chọn
    const currentTypeCompanyObj = typeCompanyOptions.find((tc) => tc.value === formData.typeCompany);
    const serviceOptions = currentTypeCompanyObj?.services || [];

    // Danh sách procedures theo service đang chọn
    const currentServiceObj = serviceOptions.find((s) => s.value === formData.serviceType);
    const procedureOptions = currentServiceObj?.procedures || [];
    const selectedProcedureValue = selectedProcedureType || forms[0]?.type || "";

    // ============================================================

    // Fetch existing data if in Edit Mode
    useEffect(() => {
        if (procedureId) {
            const fetchProcedureById = async () => {
                try {
                    const res = await authAxios.get(`/api/procedurer/find-by-id-and-check-status?id=${procedureId}`);
                    const procedure = res.data.result;
                    if (procedure) {
                        setFormData({
                            title: procedure.title || "",
                            description: procedure.description || "",
                            realPrice: procedure.realPrice || 0,
                            salePrice: procedure.salePrice || 0,
                            typeCompany: procedure.typeCompany || typeCompanyOptions[0].value,
                            typeCompanyTitle: procedure.typeCompanyTitle || typeCompanyOptions[0].title,
                            serviceType: procedure.serviceType || "",
                            serviceTypeTitle: procedure.serviceTypeTitle || "",
                            linkImage: procedure.linkImage || "",
                            imageFile: null,
                        });
                        if (procedure.linkImage) setPreviewImage(procedure.linkImage);
                        if (procedure.forms && Array.isArray(procedure.forms)) {
                            setForms(procedure.forms);
                            setSelectedProcedureType(procedure.forms[0]?.type || "");
                        }
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu thủ tục:", error);
                    showError("Không thể tải thông tin thủ tục.");
                }
            };
            fetchProcedureById();
        }
    }, [procedureId, showError]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        if (name === "typeCompany") {
            // Khi đổi loại công ty: reset serviceType, serviceTypeTitle và các forms
            const selectedTc = typeCompanyOptions.find((tc) => tc.value === value);
            setFormData({
                ...formData,
                typeCompany: value,
                typeCompanyTitle: selectedTc?.title || "",
                serviceType: "",
                serviceTypeTitle: "",
            });
            setForms([]);
            setSelectedProcedureType("");
            return;
        }

        if (name === "serviceType") {
            const selectedSvc = serviceOptions.find((s) => s.value === value);
            setFormData({
                ...formData,
                serviceType: value,
                serviceTypeTitle: selectedSvc?.title || "",
            });
            setForms([]);
            setSelectedProcedureType("");
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imageFile: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // --- Dynamic Forms Handlers ---
    const handleAddDynamicForm = () => {
        setForms([
            ...forms,
            {
                name: "", // The name of the form, e.g. "Giấy đề nghị đăng ký hộ kinh doanh"
                type: "", // The procedure value, e.g. "thanh_lap_moi"
            },
        ]);
    };

    const handleRemoveDynamicForm = (index) => {
        const updatedForms = [...forms];
        updatedForms.splice(index, 1);
        setForms(updatedForms);
    };

    // Khi chọn loại biểu mẫu (procedure), cập nhật type + reset name
    const handleProcedureChange = (index, selectedValue) => {
        const updatedForms = [...forms];
        updatedForms[index] = {
            ...updatedForms[index],
            type: selectedValue, // backend expects procedure value here (e.g. 'thanh_lap_moi')
            name: "", // reset Tên biểu mẫu
        };
        setForms(updatedForms);
    };

    const handleProcedureSelectionChange = (selectedValue) => {
        setSelectedProcedureType(selectedValue);
        const selectedProc = procedureOptions.find((p) => (p.value || p.title) === selectedValue);
        const nextForms =
            selectedProc?.formsType?.map((ft) => ({
                name: ft.title,
                type: selectedValue,
            })) || [];

        setForms(nextForms);
    };

    // --- Submit Handler ---
    const handleSave = async () => {
        try {
            const { imageFile, linkImage, typeCompany, typeCompanyTitle, serviceType, serviceTypeTitle, ...rest } =
                formData;

            // Chỉ gửi name và type cho mỗi form
            const parsedForms = forms.map((f) => ({
                name: f.name,
                type: f.type,
            }));

            const payload = {
                salePrice: Number(rest.salePrice),
                typeCompany,
                typeCompanyTitle,
                serviceType,
                serviceTypeTitle,
                realPrice: Number(rest.realPrice),
                forms: parsedForms,
                title: rest.title,
                description: rest.description,
            };

            if (procedureId && linkImage) {
                payload.linkImage = linkImage;
            }
            console.log("payload: ", payload);
            const formDataToSend = new FormData();
            formDataToSend.append("procedure", new Blob([JSON.stringify(payload)], { type: "application/json" }));

            if (imageFile) {
                formDataToSend.append("image", imageFile);
            }

            let res;
            if (procedureId) {
                res = await authAxios.post(`/api/procedurer/update?procedureId=${procedureId}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                showSuccess("Cập nhật thủ tục thành công!");
            } else {
                res = await authAxios.post("/api/procedurer/create", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                showSuccess("Tạo mới thủ tục thành công!");
                if (res.data && res.data.procedureId) {
                    navigate(`/manage-procedure/${res.data.procedureId}`);
                } else {
                    navigate("/list-procedure");
                }
            }
        } catch (error) {
            console.error("Lỗi khi lưu thủ tục:", error);
            showError("Có lỗi xảy ra khi lưu thủ tục!");
        }
    };

    return (
        <div className={styles["procedure-form-container"]}>
            <div className={styles["procedure-form"]}>
                {procedureId && (
                    <div className={styles["form-row"]}>
                        <div className={styles["form-group-procedure-info"]}>
                            <label>ID Thủ tục</label>
                            <input type="text" value={procedureId} readOnly />
                        </div>
                    </div>
                )}

                {/* Hàng 1: Tiêu đề */}
                <div className={styles["form-row"]}>
                    <div className={styles["form-group-procedure-info"]}>
                        <label>
                            Tên thủ tục <span style={{ color: "red" }}>*</span>
                        </label>
                        <input type="text" name="title" value={formData.title} onChange={handleFormChange} required />
                    </div>
                </div>

                {/* Hàng 2: Loại Công Ty + Loại Dịch Vụ */}
                <div className={styles["form-row"]}>
                    <div className={styles["form-group-procedure-info"]}>
                        <label>
                            Loại Công Ty <span style={{ color: "red" }}>*</span>
                        </label>
                        <select name="typeCompany" value={formData.typeCompany} onChange={handleFormChange}>
                            {typeCompanyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles["form-group-procedure-info"]}>
                        <label>
                            Loại Dịch Vụ <span style={{ color: "red" }}>*</span>
                        </label>
                        <select name="serviceType" value={formData.serviceType} onChange={handleFormChange}>
                            <option value="" disabled>
                                -- Chọn dịch vụ --
                            </option>
                            {serviceOptions.map((svc) => (
                                <option key={svc.value} value={svc.value}>
                                    {svc.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Hàng 3: Giá */}
                <div className={styles["form-row"]}>
                    <div className={styles["form-group-procedure-info"]}>
                        <label>Giá gốc</label>
                        <input type="number" name="realPrice" value={formData.realPrice} onChange={handleFormChange} />
                    </div>
                    <div className={styles["form-group-procedure-info"]}>
                        <label>Giá bán (Sale)</label>
                        <input type="number" name="salePrice" value={formData.salePrice} onChange={handleFormChange} />
                    </div>
                </div>

                {/* Hàng 4: Mô tả */}
                <div
                    className={`${styles["form-group-procedure-info"]} ${styles["full-width"]} ${styles["procedure-description"]}`}
                >
                    <label>Mô tả chi tiết</label>
                    <textarea name="description" value={formData.description} onChange={handleFormChange} />
                </div>

                {/* Hàng 5: Ảnh thủ tục */}
                <div className={`${styles["form-group-procedure-info"]} ${styles["full-width"]}`}>
                    <label>Ảnh hiển thị thủ tục (linkImage)</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {previewImage && (
                        <div className={styles["image-preview"]}>
                            <img src={previewImage} alt="preview" />
                        </div>
                    )}
                </div>

                {/* --- BIỂU MẪU ĐỘNG --- */}
                <div className={styles["dynamic-forms-section"]}>
                    <div className={styles["forms-header"]}>
                        <h3>Danh sách Biểu mẫu (Forms)</h3>
                        <button type="button" className={styles["add-form-btn"]} onClick={handleAddDynamicForm}>
                            <i className="fa-solid fa-plus"></i> Thêm biểu mẫu
                        </button>
                    </div>

                    <div className={styles["form-block"]}>
                        <div className={styles["form-group-procedure-info"]} style={{ marginBottom: "16px" }}>
                            <label>
                                {"Lo\u1ea1i bi\u1ec3u m\u1eabu"} <span style={{ color: "red" }}>*</span>
                            </label>
                            {procedureOptions.length > 0 ? (
                                <select
                                    value={selectedProcedureValue}
                                    onChange={(e) => handleProcedureSelectionChange(e.target.value)}
                                >
                                    <option value="" disabled>
                                        {"-- Ch\u1ecdn lo\u1ea1i bi\u1ec3u m\u1eabu --"}
                                    </option>
                                    {procedureOptions.map((proc) => {
                                        const val = proc.value || proc.title;
                                        return (
                                            <option key={val} value={val}>
                                                {proc.title}
                                            </option>
                                        );
                                    })}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value=""
                                    readOnly
                                    placeholder={"Ch\u01b0a c\u00f3 lo\u1ea1i bi\u1ec3u m\u1eabu"}
                                />
                            )}
                        </div>

                        {selectedProcedureValue && (
                            <div className={styles["generated-forms-list"]}>
                                <h4>{"T\u00ean bi\u1ec3u m\u1eabu"}</h4>
                                {forms.length > 0 ? (
                                    forms.map((form, index) => (
                                        <div
                                            key={`${form.type}-${form.name}-${index}`}
                                            className={styles["generated-form-item"]}
                                        >
                                            <span>#{index + 1}</span>
                                            <input type="text" value={form.name || ""} readOnly />
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: "#6c757d", fontSize: "14px", fontStyle: "italic" }}>
                                        {"Lo\u1ea1i bi\u1ec3u m\u1eabu n\u00e0y ch\u01b0a c\u00f3 t\u00ean bi\u1ec3u m\u1eabu."}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {false && forms.map((form, index) => {
                        // Lấy formsType của procedure đang chọn cho biểu mẫu này
                        const selectedProc = procedureOptions.find((p) => (p.value || p.title) === form.type);
                        const formTypeOptions = selectedProc?.formsType || [];

                        return (
                            <div key={index} className={styles["form-block"]}>
                                <div className={styles["form-block-header"]}>
                                    <h4>Biểu mẫu #{index + 1}</h4>
                                    <button
                                        type="button"
                                        className={styles["remove-form-btn"]}
                                        onClick={() => handleRemoveDynamicForm(index)}
                                    >
                                        <i className="fa-solid fa-trash"></i> Xóa biểu mẫu
                                    </button>
                                </div>

                                {/* Loại biểu mẫu - select từ procedures */}
                                <div className={styles["form-group-procedure-info"]} style={{ marginBottom: "16px" }}>
                                    <label>
                                        Loại biểu mẫu <span style={{ color: "red" }}>*</span>
                                    </label>
                                    {procedureOptions.length > 0 ? (
                                        <select
                                            value={form.type || ""}
                                            onChange={(e) => handleProcedureChange(index, e.target.value)}
                                        >
                                            <option value="" disabled>
                                                -- Chọn loại biểu mẫu --
                                            </option>
                                            {procedureOptions.map((proc) => {
                                                const val = proc.value || proc.title;
                                                return (
                                                    <option key={val} value={val}>
                                                        {proc.title}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={form.type || ""}
                                            onChange={(e) => {
                                                const updatedForms = [...forms];
                                                updatedForms[index].type = e.target.value;
                                                setForms(updatedForms);
                                            }}
                                            placeholder="Nhập loại biểu mẫu (nếu không có trong danh sách)"
                                        />
                                    )}
                                </div>

                                {/* Tên biểu mẫu - select từ formsType */}
                                <div className={styles["form-group-procedure-info"]} style={{ marginBottom: "16px" }}>
                                    <label>
                                        Tên biểu mẫu <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select
                                        value={form.name || ""}
                                        onChange={(e) => {
                                            const updatedForms = [...forms];
                                            updatedForms[index].name = e.target.value;
                                            setForms(updatedForms);
                                        }}
                                    >
                                        <option value="" disabled>
                                            -- Chọn tên biểu mẫu --
                                        </option>
                                        {(formTypeOptions.length > 0 ? formTypeOptions : allFormTypes)
                                            .filter((ft) => {
                                                const ftVal = ft.title;
                                                // Loại bỏ tên biểu mẫu đã được chọn ở form khác trong cùng một Loại biểu mẫu
                                                return !forms.some(
                                                    (f, idx) =>
                                                        idx !== index && f.type === form.type && f.name === ftVal,
                                                );
                                            })
                                            .map((ft, i) => (
                                                <option key={i} value={ft.title}>
                                                    {ft.title}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        );
                    })}

                    {false && forms.length === 0 && (
                        <p style={{ color: "#6c757d", fontSize: "14px", fontStyle: "italic" }}>
                            Chưa có biểu mẫu nào. Nhấn "Thêm biểu mẫu" để tạo.
                        </p>
                    )}
                </div>

                <button type="button" className={styles["submit-btn"]} onClick={handleSave}>
                    {procedureId ? "Lưu cập nhật Thủ tục" : "Tạo mới Thủ tục"}
                </button>
            </div>
        </div>
    );
};

export default ProcedureForm;
