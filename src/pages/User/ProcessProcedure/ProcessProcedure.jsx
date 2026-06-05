import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";
import "./ProcessProcedure.css";
import DeclarationForms from "@/components/Procedure/ParentForm/DeclarationForms";
import FormsConfirmation from "@/components/Procedure/ParentForm/FormsConfirmation";
import ProgressStepper from "@/components/ProgressStepper/ProgressStepper";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { authAxios } from "@/services/axios-instance";
import Overlay from "@/components/Loading/Overlay/Overlay";
import typeCompanyOptions from "@/consts/typeCompany";
import ProcedurePayment from "@/components/ProcedurePayment/ProcedurePayment";
import SubmitProcedure from "@/components/SubmitProcedure/SubmitProcedure";
import { downloadFile } from "@/utils/downloadFile";
import iconCheck from "@/assets/Check_perspective_matte.png";
import iconCancel from "@/assets/Error_perspective_matte.png";
import plusIcon from "@/assets/Plus_perspective_matte.png";
import { useNotification } from "@/hooks/useNotification";
import {
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

const tabs = [
    { id: 0, title: "Kê khai Hồ Sơ" },
    { id: 1, title: "Thông tin kê khai" },
    { id: 2, title: "Thanh Toán" },
    { id: 3, title: "Nộp hồ sơ" },
];

const DANG_KY_THAY_DOI_NOI_DUNG_TYPE =
    "giay_de_nghi_dang_ky_thay_doi_noi_dung_giay_chung_nhan_dang_ky_doanh_nghiep";
const TNHH_2TV_TYPE_COMPANY = "cong_ty_tnhh_hai_thanh_vien_tro_len";

const REGISTRATION_DYNAMIC_FORM = {
    name: "Giấy đề nghị đăng ký doanh nghiệp",
    type: DANG_KY_THAY_DOI_NOI_DUNG_TYPE,
};

const BENEFICIAL_OWNER_LIST_DYNAMIC_FORM = {
    name: "Danh sách CSH hưởng lợi",
    type: DANG_KY_THAY_DOI_NOI_DUNG_TYPE,
};

const MEMBER_MEETING_MINUTES_DYNAMIC_FORM = {
    name: "Mẫu biên bản họp Hội đồng thành viên",
    type: DANG_KY_THAY_DOI_NOI_DUNG_TYPE,
};

const SHAREHOLDER_LIST_DYNAMIC_FORM = {
    name: "Danh sách cổ đông sáng lập",
    type: DANG_KY_THAY_DOI_NOI_DUNG_TYPE,
};

const DANG_KY_THAY_DOI_DYNAMIC_FORMS = [
    REGISTRATION_DYNAMIC_FORM,
    MEMBER_MEETING_MINUTES_DYNAMIC_FORM,
    BENEFICIAL_OWNER_LIST_DYNAMIC_FORM,
    SHAREHOLDER_LIST_DYNAMIC_FORM,
];

const EMPTY_DYNAMIC_FORM_STATE = {
    showMemberMeetingMinutesForm: false,
    showBeneficialOwnerForms: false,
    showShareholderForms: false,
};

const normalizeProcedureText = (value = "") =>
    String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\u0111/g, "d")
        .replace(/\u0110/g, "D")
        .toLowerCase()
        .trim();

const DANG_KY_THAY_DOI_DYNAMIC_FORM_KEYS = new Set(
    DANG_KY_THAY_DOI_DYNAMIC_FORMS.map((form) => normalizeProcedureText(form.name)),
);

const getDynamicFormKey = (form) => normalizeProcedureText(form?.name);

const isDangKyThayDoiDynamicForm = (form) =>
    form?.type === DANG_KY_THAY_DOI_NOI_DUNG_TYPE &&
    DANG_KY_THAY_DOI_DYNAMIC_FORM_KEYS.has(getDynamicFormKey(form));

const isDangKyThayDoiNoiDungForm = (form) => {
    const normalizedName = normalizeProcedureText(form?.name);
    return (
        form?.type === DANG_KY_THAY_DOI_NOI_DUNG_TYPE &&
        normalizedName.includes("dang ky thay doi") &&
        normalizedName.includes("giay chung nhan dang ky doanh nghiep")
    );
};

const isBeneficialOwnerChangeEnabled = (data) => {
    const parsed = normalizeDataJson(data);
    const selectedMainOptions = Array.isArray(parsed.noiDungThayDoi)
        ? parsed.noiDungThayDoi
        : parsed.noiDungThayDoi
            ? [parsed.noiDungThayDoi]
            : [];
    const hasMainA = !selectedMainOptions.length || selectedMainOptions.includes("A");
    return hasMainA && isTruthy(parsed.a_doiChuSoHuuHuongLoi);
};

const isShareholderChangeEnabled = (data) => {
    const parsed = normalizeDataJson(data);
    const selectedMainOptions = Array.isArray(parsed.noiDungThayDoi)
        ? parsed.noiDungThayDoi
        : parsed.noiDungThayDoi
            ? [parsed.noiDungThayDoi]
            : [];
    const hasMainA = !selectedMainOptions.length || selectedMainOptions.includes("A");
    return hasMainA && isTruthy(parsed.a_doiCoDong);
};

const parseDynamicCapitalNumber = (value) => {
    if (value === null || value === undefined || value === "") return null;

    const parsed = Number(
        String(value)
            .replace(/[^\d,.-]/g, "")
            .replace(/\./g, "")
            .replace(",", "."),
    );
    return Number.isNaN(parsed) ? null : parsed;
};

const isMemberMeetingMinutesEnabled = (data, typeCompany) => {
    if (typeCompany !== TNHH_2TV_TYPE_COMPANY) return false;

    const parsed = normalizeDataJson(data);
    const selectedMainOptions = Array.isArray(parsed.noiDungThayDoi)
        ? parsed.noiDungThayDoi
        : parsed.noiDungThayDoi
            ? [parsed.noiDungThayDoi]
            : [];
    const hasMainA = !selectedMainOptions.length || selectedMainOptions.includes("A");
    if (!hasMainA || !isTruthy(parsed.a_doiVonDieuLe)) return false;

    const changeType = normalizeProcedureText(parsed.hinhThucTangGiamVon || parsed.qdHinhThucTangGiamVon || "");
    if (changeType.includes("tang")) return true;
    if (changeType.includes("giam")) return false;

    const beforeCapital = parseDynamicCapitalNumber(parsed.vonDieuLeDaDangKy);
    const afterCapital = parseDynamicCapitalNumber(parsed.vonDieuLeSauThayDoi);
    return beforeCapital !== null && afterCapital !== null && afterCapital > beforeCapital;
};

const getDangKyThayDoiDynamicState = (data, typeCompany) => ({
    showMemberMeetingMinutesForm: isMemberMeetingMinutesEnabled(data, typeCompany),
    showBeneficialOwnerForms: isBeneficialOwnerChangeEnabled(data),
    showShareholderForms: isShareholderChangeEnabled(data),
});

const hasEnabledDynamicForms = (state) =>
    !!state?.showMemberMeetingMinutesForm || !!state?.showBeneficialOwnerForms || !!state?.showShareholderForms;

const getRequiredDynamicForms = (state) => {
    const forms = [];

    if (state?.showMemberMeetingMinutesForm) {
        forms.push(MEMBER_MEETING_MINUTES_DYNAMIC_FORM);
    }
    if (state?.showBeneficialOwnerForms) {
        forms.push(BENEFICIAL_OWNER_LIST_DYNAMIC_FORM);
    }
    if (state?.showShareholderForms) {
        forms.push(SHAREHOLDER_LIST_DYNAMIC_FORM);
    }

    return forms;
};

const getProcedureFormTypes = ({ typeCompany, serviceType, formType }) =>
    typeCompanyOptions
        .find((item) => item.value === typeCompany)
        ?.services?.find((item) => item.value === serviceType)
        ?.procedures?.find((p) => (p.value || p.title) === formType)
        ?.formsType || [];

const getMatchedFormTypeIndex = (formTypes, formName) =>
    formTypes.findIndex(
        (item) => item.title === formName || normalizeProcedureText(item.title) === normalizeProcedureText(formName),
    );

const mapProcedureForms = (rawForms, typeCompany, serviceType) =>
    (rawForms || [])
        .map((form, originalIndex) => {
            const formTypes = getProcedureFormTypes({ typeCompany, serviceType, formType: form.type });
            const matchedFormTypeIndex = getMatchedFormTypeIndex(formTypes, form.name);
            const matchedFormType = matchedFormTypeIndex >= 0 ? formTypes[matchedFormTypeIndex] : undefined;

            return {
                ...form,
                declaration: matchedFormType?.declaration,
                confirmation: matchedFormType?.confirmation,
                formTypeOrder: matchedFormTypeIndex >= 0 ? matchedFormTypeIndex : Number.MAX_SAFE_INTEGER,
                originalIndex,
            };
        })
        .sort((a, b) => a.formTypeOrder - b.formTypeOrder || a.originalIndex - b.originalIndex)
        .map(({ formTypeOrder, originalIndex, ...form }) => form);

const orderVisibleForms = (mappedForms, dynamicState) => {
    const requiredDynamicForms = getRequiredDynamicForms(dynamicState);
    const requiredDynamicFormKeys = new Set(requiredDynamicForms.map((form) => normalizeProcedureText(form.name)));
    return mappedForms.filter(
        (form) => !isDangKyThayDoiDynamicForm(form) || requiredDynamicFormKeys.has(getDynamicFormKey(form)),
    );
};

const buildFormDeclarationSteps = (visibleForms) =>
    visibleForms.map((form, idx) => ({
        id: idx,
        label: form.name,
    }));

const ProcessProcedureContext = createContext(null);

const ProcessProcedure = () => {
    const { id_procedure } = useParams();
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab");
    const viewMode = searchParams.get("viewMode");
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [procedure, setProcedure] = useState(null);
    const [allForms, setAllForms] = useState([]);
    const [forms, setForms] = useState([]);
    const [formDeclarationSteps, setFormDeclarationSteps] = useState([]);
    const [activeTab, setActiveTab] = useState(tab || 0);
    const [currentFormStep, setCurrentFormStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [fileType, setFileType] = useState("pdf");
    const [editingFromConfirmation, setEditingFromConfirmation] = useState(null);
    const [userCards, setUserCards] = useState([]);
    const declarationFormsRef = useRef(null);
    const confirmationFormsRef = useRef(null);

    const refreshUserCards = async () => {
        try {
            const response = await authAxios.get('/api/users/my-card/get');
            if (response?.data) {
                // Determine structure based on format mapping
                const cards = Array.isArray(response.data) ? response.data : (response.data.result || []);
                setUserCards(cards);
            }
        } catch (error) {
            console.error("Error fetching user cards:", error);
        }
    };

    useEffect(() => {
        refreshUserCards();
    }, []);

    const applyVisibleFormsState = useCallback((mappedForms, dynamicState) => {
        const visibleForms = orderVisibleForms(mappedForms, dynamicState);
        setForms(visibleForms);
        setFormDeclarationSteps(buildFormDeclarationSteps(visibleForms));
        setCurrentFormStep((prev) => (visibleForms.length ? Math.min(prev, visibleForms.length - 1) : 0));
        return visibleForms;
    }, []);

    const fetchProcedureResponse = useCallback(async () => {
        const response = await authAxios.get(`/api/procedurer/find-by-id-and-check-status`, {
            params: {
                id: id_procedure,
            },
        });
        return response.data.result;
    }, [id_procedure]);

    const ensureDangKyThayDoiDynamicForms = useCallback(async (mappedForms, currentProcedure, dynamicState) => {
        const missingForms = getRequiredDynamicForms(dynamicState).filter(
            (dynamicForm) =>
                !mappedForms.some(
                    (form) => normalizeProcedureText(form.name) === normalizeProcedureText(dynamicForm.name),
                ),
        );

        if (!missingForms.length) {
            return { procedureResponse: currentProcedure, mappedForms };
        }

        await Promise.all(
            missingForms.map((form) =>
                authAxios.post(
                    "/api/procedurer/add-form",
                    { name: form.name, type: form.type },
                    { params: { procedureId: id_procedure } },
                ),
            ),
        );

        const nextProcedureResponse = await fetchProcedureResponse();
        return {
            procedureResponse: nextProcedureResponse,
            mappedForms: mapProcedureForms(
                nextProcedureResponse.forms,
                nextProcedureResponse.typeCompany,
                nextProcedureResponse.serviceType,
            ),
        };
    }, [fetchProcedureResponse, id_procedure]);

    const getSavedDangKyThayDoiDynamicState = useCallback(async (mappedForms, typeCompany) => {
        const changeForm = mappedForms.find(isDangKyThayDoiNoiDungForm);
        if (!changeForm?.formId) return EMPTY_DYNAMIC_FORM_STATE;

        try {
            const response = await authAxios.get(`/api/form-submission/get/data-json`, {
                params: { formId: changeForm.formId },
            });
            return getDangKyThayDoiDynamicState(response.data, typeCompany);
        } catch (error) {
            return EMPTY_DYNAMIC_FORM_STATE;
        }
    }, []);

    useEffect(() => {
        const fetchFormDeclarationSteps = async () => {
            try {
                setLoading(true);
                let procedureResponse = await fetchProcedureResponse();
                let mappedForms = mapProcedureForms(
                    procedureResponse.forms,
                    procedureResponse.typeCompany,
                    procedureResponse.serviceType,
                );
                const dynamicFormState = await getSavedDangKyThayDoiDynamicState(
                    mappedForms,
                    procedureResponse.typeCompany,
                );

                if (hasEnabledDynamicForms(dynamicFormState)) {
                    const ensured = await ensureDangKyThayDoiDynamicForms(
                        mappedForms,
                        procedureResponse,
                        dynamicFormState,
                    );
                    procedureResponse = ensured.procedureResponse;
                    mappedForms = ensured.mappedForms;
                }

                if (["PENDING", "SUCCESS", "FAILED"].includes(procedureResponse.status)) {
                    if (viewMode !== "see_again") {
                        navigate(`/process-procedure/${id_procedure}?tab=1&viewMode=see_again`, { replace: true });
                    }
                }

                setAllForms(mappedForms);
                applyVisibleFormsState(mappedForms, dynamicFormState);
                setProcedure(procedureResponse);
            } catch (error) {
                console.error("Error fetching form declaration steps:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFormDeclarationSteps();
    }, [
        applyVisibleFormsState,
        ensureDangKyThayDoiDynamicForms,
        fetchProcedureResponse,
        getSavedDangKyThayDoiDynamicState,
        id_procedure,
        navigate,
        viewMode,
    ]);

    // Được gọi sau khi form submit thành công
    const handleStepSubmitSuccess = async (submittedData, submittedForm) => {
        let visibleForms = forms;

        if (isDangKyThayDoiNoiDungForm(submittedForm)) {
            const dynamicFormState = getDangKyThayDoiDynamicState(submittedData, procedure?.typeCompany);
            let nextProcedure = procedure;
            let nextAllForms = allForms.length ? allForms : forms;

            if (hasEnabledDynamicForms(dynamicFormState)) {
                try {
                    const ensured = await ensureDangKyThayDoiDynamicForms(nextAllForms, procedure, dynamicFormState);
                    nextProcedure = ensured.procedureResponse;
                    nextAllForms = ensured.mappedForms;
                } catch (error) {
                    console.error("Error ensuring dynamic registration supplement forms:", error);
                }
            }

            setAllForms(nextAllForms);
            visibleForms = applyVisibleFormsState(nextAllForms, dynamicFormState);
            if (nextProcedure) setProcedure(nextProcedure);
        }

        if (editingFromConfirmation !== null) {
            setActiveTab(1);
            setCurrentFormStep(Math.min(editingFromConfirmation, Math.max(visibleForms.length - 1, 0)));
            setEditingFromConfirmation(null);
            window.scrollTo(0, 0);
            return;
        }

        if (currentFormStep < visibleForms.length - 1) {
            setCurrentFormStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        } else {
            if (viewMode === "see_again") {
                navigate(`/list-procedures/${procedure?.typeCompany}`);
            } else {
                setActiveTab((prev) => Math.min(prev + 1, tabs.length - 1));
                setCurrentFormStep(0);
                window.scrollTo(0, 0);
            }
        }
    };

    // Hàm để chuyển tới tab (hoặc form) tiếp theo
    const handleNext = () => {
        if (activeTab === 0) {
            // Tab 0: kích hoạt submit form, bước tiếp theo xử lý qua onStepSubmitSuccess
            if (declarationFormsRef.current) {
                declarationFormsRef.current.submitCurrentForm();
            }
        } else if (activeTab === 1) {
            if (viewMode === "see_again") {
                if (currentFormStep < formDeclarationSteps.length - 1) {
                    setCurrentFormStep((prev) => prev + 1);
                    window.scrollTo(0, 0);
                } else {
                    navigate(`/list-procedures/${procedure?.typeCompany}`);
                }
            } else {
                // Tab 1: Mở form xác nhận, khi submit sẽ tạo file pdf lưu lên server
                const processConfirmation = async () => {
                    setIsConfirming(true);
                    try {
                        if (confirmationFormsRef.current) {
                            const currentForm = forms?.[currentFormStep];
                            const isLandscape = currentForm?.name?.toLowerCase().startsWith("danh sách") || false;
                            await confirmationFormsRef.current.submitCurrentForm(isLandscape);
                        }
                    } finally {
                        setIsConfirming(false);
                    }
                };
                processConfirmation();
            }
        } else {
            // Các hoạt động view_again hoặc tab khác
            setActiveTab((prev) => Math.min(prev + 1, tabs.length - 1));
            setCurrentFormStep(0);
            window.scrollTo(0, 0);
        }
    };

    // Hàm để quay lại tab trước đó
    const handlePrev = () => {
        setActiveTab((prev) => Math.max(prev - 1, 0));
    };

    // Hàm render nội dung dựa trên tab đang hoạt động
    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <DeclarationForms
                        ref={declarationFormsRef}
                        forms={forms}
                        currentFormStep={currentFormStep}
                        onStepSubmitSuccess={handleStepSubmitSuccess}
                        setIsSubmittingForm={setIsSubmittingForm}
                    />
                );
            case 1:
                return (
                    <FormsConfirmation
                        ref={confirmationFormsRef}
                        forms={forms}
                        currentFormStep={currentFormStep}
                        onStepSubmitSuccess={handleStepSubmitSuccess}
                    />
                );
            case 2:
                return (
                    <ProcedurePayment
                        procedure={procedure}
                        onPaymentSuccess={() => {
                            setActiveTab(3);
                            setCurrentFormStep(0);
                            window.scrollTo(0, 0);
                        }}
                    />
                );
            case 3:
                return <SubmitProcedure procedure={procedure} setActiveTab={setActiveTab} />;
            default:
                return null;
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setIsDownloading(true);
            const currentForm = forms?.[currentFormStep];
            if (!currentForm?.code) {
                showNotification("Không tìm thấy mã form để tải file", "error");
                return;
            }

            const response = await authAxios.get(`/api/form-submission/get/file-url`, {
                params: { code: currentForm.code, fileType },
            });
            console.log("File Response (Cloud URL):", response.data);

            if (response.data) {
                const url = response.data;
                const ext = fileType === "docx" ? ".docx" : ".pdf";
                const fileName = currentForm?.name ? `${currentForm.name}${ext}` : `document${ext}`;
                await downloadFile(url, fileName);
            }
        } catch (err) {
            console.error("Lỗi khi tải file:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        if (tab && tab !== 0 && tab <= 3) {
            setActiveTab(Number(tab));
            setCurrentFormStep(0);
        }
    }, [tab]);

    return (
        <ProcessProcedureContext.Provider value={{ procedure, forms, setProcedure, setForms, userCards, refreshUserCards }}>
            <div className="stepper-container">
                {loading && <Overlay />}
                <div className="stepper-header-main">
                    <h1 className="main-title">{procedure?.title}</h1>
                    {viewMode !== "see_again" && (
                        <div className="stepper-header">
                            {tabs.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`step ${activeTab === tab.id ? "active" : ""} ${activeTab > tab.id ? "completed" : ""}`}
                                >
                                    <span className="step-number">{index + 1}</span>
                                    <span className="step-title">{tab.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={viewMode !== "see_again" ? "stepper-body-main1" : "stepper-body-main2"}>
                    {(activeTab === 0 || activeTab === 1) && (
                        <ProgressStepper currentStep={currentFormStep} isSuccess={true} steps={formDeclarationSteps} />
                    )}

                    <div className="stepper-body">{renderTabContent()}</div>
                </div>

                {activeTab <= 1 && (
                    <div className="stepper-footer custom-footer">
                        {activeTab !== 2 && (
                            <button
                                className="btn-cancel"
                                onClick={() => {
                                    if (editingFromConfirmation !== null) {
                                        setActiveTab(1);
                                        setCurrentFormStep(editingFromConfirmation);
                                        setEditingFromConfirmation(null);
                                        window.scrollTo(0, 0);
                                        return;
                                    }
                                    if (viewMode === "see_again" && currentFormStep === 0) {
                                        navigate(-1); // Quay lại trang trước đó
                                    } else if (activeTab === 0 && currentFormStep > 0) {
                                        setCurrentFormStep((prev) => prev - 1);
                                    } else if (activeTab === 0 && currentFormStep === 0) {
                                        navigate(-1);
                                    } else if (activeTab === 1 && currentFormStep > 0) {
                                        setCurrentFormStep((prev) => prev - 1);
                                    } else {
                                        setActiveTab(0);
                                        setCurrentFormStep(formDeclarationSteps.length - 1); // Trở về form khai báo cuối cùng
                                    }
                                }}
                            >
                                <img src={iconCancel} alt="" />
                                Huỷ
                            </button>
                        )}
                        {activeTab !== 2 && (
                            <div className="footer-right-actions">
                                {activeTab === 1 ? (
                                    viewMode === "see_again" ? (
                                        <>
                                            <select
                                                className="file-type-select"
                                                value={fileType}
                                                onChange={(e) => setFileType(e.target.value)}
                                                disabled={isDownloading}
                                            >
                                                <option value="pdf">PDF</option>
                                                <option value="docx">DOCX</option>
                                            </select>
                                            <button
                                                className="btn-action import"
                                                onClick={handleDownloadPdf}
                                                disabled={isDownloading}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="15"
                                                    height="18"
                                                    viewBox="0 0 15 18"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M15 6.35156H10.7156V0H4.28437V6.35156H0L7.5 13.7625L15 6.35156ZM0 15.8812V18H15V15.8812H0Z"
                                                        fill="#1B154B"
                                                    />
                                                </svg>{" "}
                                                {isDownloading ? "Đang tải..." : "Tải file"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn-action"
                                            onClick={() => {
                                                setEditingFromConfirmation(currentFormStep);
                                                setActiveTab(0);
                                            }}
                                        >
                                            <img src={plusIcon} alt="" /> Sửa thông tin
                                        </button>
                                    )
                                ) : (
                                    <>
                                        <button
                                            className="btn-action export"
                                            onClick={() => declarationFormsRef.current?.exportExcel()}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="15"
                                                height="18"
                                                viewBox="0 0 15 18"
                                                fill="none"
                                            >
                                                <path
                                                    d="M15 6.35156H10.7156V0H4.28437V6.35156H0L7.5 13.7625L15 6.35156ZM0 15.8812V18H15V15.8812H0Z"
                                                    fill="#1B154B"
                                                />
                                            </svg>{" "}
                                            Xuất File Excel
                                        </button>
                                        <button
                                            className="btn-action import"
                                            onClick={() => declarationFormsRef.current?.importExcel()}
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
                                            Import File Excel
                                        </button>
                                    </>
                                )}
                                <button
                                    className="btn-next"
                                    onClick={handleNext}
                                    disabled={
                                        activeTab === tabs.length - 1 ||
                                        activeTab === 2 ||
                                        isConfirming ||
                                        isSubmittingForm ||
                                        loading
                                    }
                                >
                                    <img src={iconCheck} alt="" />
                                    {viewMode === "see_again" &&
                                        activeTab === 1 &&
                                        currentFormStep === formDeclarationSteps.length - 1
                                        ? "Tạo mới"
                                        : "Tiếp theo"}

                                    {(isConfirming || isSubmittingForm) && (
                                        <div className="overlay-loading" title="Đang xử lý...">
                                            <div className="spinner-border spinner-border-sm" role="status"></div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProcessProcedureContext.Provider>
    );
};

export const useProcessProcedure = () => {
    const context = useContext(ProcessProcedureContext);
    if (!context) {
        throw new Error("useProcessProcedure must be used within ProcessProcedure");
    }
    return context;
};

export const useGetFormDataJsonFromName = (formName) => {
    const { forms } = useProcessProcedure();
    const [formDataJson, setFormDataJson] = useState();

    useEffect(() => {
        if (!forms) return;
        const fetchFormDataJson = async () => {
            const formId = forms.find((form) => form.name === formName)?.formId;
            if (!formId) return;
            try {
                const response = await authAxios.get(`/api/form-submission/get/data-json`, {
                    params: { formId: formId },
                });
                if (response?.data) {
                    setFormDataJson(response.data);
                }
            } catch (error) {
                console.error("Error fetching form data JSON:", error);
            }
        };
        fetchFormDataJson();
    }, [forms]);

    return formDataJson;
};

export default ProcessProcedure;
