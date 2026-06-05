import React, { useState, useEffect } from "react";
import styles from "./SubmitProcedure.module.css";
import { authAxios, publicAxios } from "@/services/axios-instance";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import successIcon from "@/assets/success-icon.png";
import failureIcon from "@/assets/failure-icon.png";
import loadIcon from "@/assets/Exchange_perspective_matte.png";
import saveIcon from "@/assets/Save_perspective_matte.png";
import checkIcon from "@/assets/Check_perspective_matte.png";
import pdfIcon from "@/assets/pdf-image.png";
import docxIcon from "@/assets/word-image.png";
import checkboxIcon from "@/assets/checkbox_icon.png";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { useDownloadProcedureFiles } from "@/hooks/useDownloadProcedureFiles";

export default function SubmitProcedure({ procedure, setActiveTab }) {
    const { id_procedure } = useParams();
    const [submitStep, setSubmitStep] = useState(1);
    const navigate = useNavigate();
    // Step 1 states
    const [downloadFormat, setDownloadFormat] = useState("pdf"); // "pdf" | "docx"
    const [fetchedDocx, setFetchedDocx] = useState(false);
    const [downloadingFileUrl, setDownloadingFileUrl] = useState(null);

    const baseZipFileName = procedure?.title ? procedure.title : "ho_so";

    const pdfHook = useDownloadProcedureFiles(submitStep === 1 ? id_procedure : null, {
        format: "pdf",
        zipFileName: `${baseZipFileName}_pdf.zip`,
    });

    const docxHook = useDownloadProcedureFiles(submitStep === 1 ? id_procedure : null, {
        format: "docx",
        autoFetch: false,
        zipFileName: `${baseZipFileName}_docx.zip`,
    });

    const activeHook = downloadFormat === "pdf" ? pdfHook : docxHook;
    const {
        fileUrls: pdfUrls,
        loadingFiles: loadingPdfs,
        downloadingAll,
        downloadFile,
        downloadAllAsZip: handleDownloadAll,
    } = activeHook;

    const handleDownload = async (url, name) => {
        if (downloadingFileUrl || !url) return;

        setDownloadingFileUrl(url);
        try {
            await downloadFile(url, name);
        } finally {
            setDownloadingFileUrl(null);
        }
    };

    const handleFormatChange = (format) => {
        if (format !== downloadFormat) {
            setDownloadFormat(format);
            if (format === "docx" && !fetchedDocx) {
                docxHook.fetchFileUrls();
                setFetchedDocx(true);
            }
        }
    };

    // Step 2 states
    const [agencyType, setAgencyType] = useState("tinh_thanh"); // tinh_thanh, bo_nganh
    const [showFeePopup, setShowFeePopup] = useState(false);
    const [boNganhValue, setBoNganhValue] = useState("");
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error' | null

    // Provinces data
    const [provValue, setProvValue] = useState("");
    const [provCode, setProvCode] = useState("");
    const [wardValue, setWardValue] = useState("");

    const { provinces, communes } = useFetchAddress(provCode);

    const handleProvChange = (selectedOption) => {
        setProvValue(selectedOption ? selectedOption.value : "");
        setProvCode(selectedOption ? selectedOption.code : "");
        setWardValue("");
    };
    const handleWardChange = (selectedOption) => {
        setWardValue(selectedOption ? selectedOption.value : "");
    };

    const handleFinalSubmit = async () => {
        try {
            if (agencyType === "tinh_thanh" && provValue === "Hà Nội") {
                window.open(
                    "https://hokinhdoanh.dkkd.gov.vn/auth/Public/HkdLogOn.aspx?ReturnUrl=%2fauth%2fdefault.aspx",
                    "_blank",
                );
            } else {
                window.open(
                    "https://xacthuc.dichvucong.gov.vn/authenticationendpoint/login.do?client_id=0vFpdFtniMwmiWOUnWfOFYZcNdAa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fdichvucong.gov.vn%2Fp%2Fhome%2Fdvc-trang-chu.html&response_type=code&scope=openid&tenantDomain=carbon.super&sessionDataKey=6c56fcab-f71c-48b1-b4ec-3ba62fc7b816&relyingParty=0vFpdFtniMwmiWOUnWfOFYZcNdAa&type=oidc&sp=VneIDDoanhNghiep&isSaaSApp=false&authenticators=OpenIDConnectAuthenticator%3AVnconnect+DVC%3AIDP+BCA%3AVNeID_TC_DN",
                    "_blank",
                );
            }
            const taxAuth = agencyType === "tinh_thanh" ? `UBND ${wardValue}` : boNganhValue;
            await authAxios.post("/api/procedurer/update-my-procedure", null, {
                params: {
                    procedureId: id_procedure,
                    status: "PENDING",
                    taxAuthority: taxAuth || "Cơ quan nhà nước",
                },
            });

            setSubmissionStatus("success");
        } catch (error) {
            console.error(error);
            setSubmissionStatus("error");
        }
    };

    const renderFeePopup = () =>
        showFeePopup && (
            <div className={styles.modalOverlay} onClick={() => setShowFeePopup(false)}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Thông tin phí, lệ phí:</h3>
                    </div>
                    <div className={styles.modalBody}>
                        <table className={styles.feeTable}>
                            <thead>
                                <tr>
                                    <th>Phí, lệ phí</th>
                                    <th>Đơn vị tính</th>
                                    <th>Văn bản</th>
                                    <th>Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>• Lệ phí: 100.000</td>
                                    <td>Việt Nam Đồng</td>
                                    <td>
                                        <a
                                            title="Tải xuống"
                                            href="https://csdl.dichvucong.gov.vn/web/jsp/download_file.jsp?ma=3fc41612393c279c"
                                            target="_blank"
                                            style={{ textDecoration: "underline", color: "#4b4b8a" }}
                                            rel="noreferrer"
                                        >
                                            NQ 69 HĐND BRVT.pdf
                                        </a>
                                    </td>
                                    <td>Nghị quyết số 02/2017/NQ-HĐND ngày 03/7/2017 của HĐND thành phố Hà Nội.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.modalFooter}>
                        <button className={styles.btnCloseModal} onClick={() => setShowFeePopup(false)}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );

    const renderStep1 = () => (
        <div>
            <div className={styles.feeInfo}>
                <div className={styles.feeTitle}>1. Lệ phí đăng ký doanh nghiệp:</div>
                <div className={styles.feeItem}>
                    - Đối với hồ sơ nộp trực tiếp tại Phòng Đăng ký kinh doanh: 50.000 đồng/hồ sơ.
                </div>
                <div className={styles.feeItem}>
                    - Đối với hồ sơ đăng ký doanh nghiệp qua mạng thông tin điện tử: Miễn lệ phí đăng ký hộ kinh doanh.
                </div>
                <div className={styles.feeTitle}>
                    2. Phí công bố nội dung đăng ký hộ kinh doanh: 100.000 đồng/hồ sơ.
                </div>
                <div className={styles.feeItem}>• 03 ngày làm việc kể từ ngày nhận được hồ sơ.</div>
                <div className={styles.feeItem}>• Nếu hồ sơ hợp lệ: Giấy chứng nhận đăng ký hộ kinh doanh.</div>
                <div className={styles.feeItem}>
                    • Nếu hồ sơ chưa hợp lệ: Thông báo về việc sửa đổi, bổ sung đăng ký hộ kinh doanh.
                </div>
            </div>

            <div className={styles.greyBox}>
                <div className={styles.greyBoxTitle}>Tải xuống File PDF hoặc DOCX</div>

                {/* Format selector */}
                <div className={styles.formatToggle}>
                    <button
                        className={`${styles.formatBtn} ${downloadFormat === "pdf" ? styles.formatBtnActive : ""}`}
                        onClick={() => handleFormatChange("pdf")}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5h1v-3h-1v3z" />
                        </svg>
                        PDF
                    </button>
                    <button
                        className={`${styles.formatBtn} ${downloadFormat === "docx" ? styles.formatBtnActive : ""}`}
                        onClick={() => handleFormatChange("docx")}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-4 8l-2-7h1.5l1.25 4.5L11 10h1.5l1.25 4.5L15 10h1.5l-2 7h-1.5l-1.25-4.5L10.5 17H9z" />
                        </svg>
                        DOCX
                    </button>
                </div>

                {loadingPdfs ? (
                    <div className={styles.loadingOverlay}>Đang tải file...</div>
                ) : (
                    <div className={styles.pdfList}>
                        {pdfUrls.length > 0 ? (
                            pdfUrls.map((item, index) => {
                                const fileUrl = item.url || item;
                                const isDownloadingFile = downloadingFileUrl === fileUrl;

                                return (
                                    <div key={index} className={styles.pdfItem}>
                                        <div
                                            className={`${styles.pdfIconBox} ${isDownloadingFile ? styles.downloadDisabled : ""}`}
                                            onClick={() => handleDownload(fileUrl, item.name)}
                                        >
                                            <img src={downloadFormat === "docx" ? docxIcon : pdfIcon} alt="" />
                                        </div>
                                        <div
                                            className={`${styles.downloadBtn} ${isDownloadingFile ? styles.downloadBtnLoading : ""}`}
                                            onClick={() => handleDownload(fileUrl, item.name)}
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
                                            </svg>
                                            <span className={styles.downloadText}>
                                                {isDownloadingFile ? "Đang tải..." : item.name || "Tải file"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "var(--secondary-content)",
                                    fontSize: "16px",
                                    gridColumn: "1 / -1",
                                }}
                            >
                                Không có file {downloadFormat.toUpperCase()} nào
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.step1Actions}>
                <div>
                    <button
                        className={styles.btnAction}
                        onClick={() => handleDownloadAll()}
                        disabled={downloadingAll}
                        style={{ width: "calc(33.333% - 80px)" }}
                    >
                        <img src={checkboxIcon} alt="" />
                        {downloadingAll ? "ĐANG TẢI..." : `TẢI XUỐNG TẤT CẢ DẠNG ${downloadFormat.toUpperCase()}`}
                    </button>
                </div>
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                        margin: "10px 100px",
                    }}
                >
                    <button
                        className={styles.btnAction}
                        onClick={() => navigate(`/list-procedures/${procedure?.typeCompany}`)}
                        style={{ flex: 1 }}
                    >
                        <img src={saveIcon} alt="" />
                        Lưu và Thoát
                    </button>
                    <button className={styles.btnAction} onClick={() => setActiveTab(0)} style={{ flex: 1 }}>
                        <img src={loadIcon} alt="" />
                        LẤY LẠI DỮ LIỆU
                    </button>
                    <button className={styles.btnAction} onClick={() => setSubmitStep(2)} style={{ flex: 1 }}>
                        <img src={checkIcon} alt="" />
                        Nộp hồ sơ trực tuyến
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => {
        const provinceOptions = provinces.map((p) => ({ value: p.name, label: p.name, code: p.code }));
        const communeOptions = communes.map((c) => ({ value: c.name, label: c.name, type: c.type || "" }));
        const boNganhOptions = [
            { value: "bocongthuong", label: "Bộ Công Thương" },
            { value: "bokhdt", label: "Bộ Kế hoạch và Đầu tư" },
            { value: "botaichinh", label: "Bộ Tài chính" },
            { value: "botuphap", label: "Bộ Tư pháp" },
        ]; // Mocked

        return (
            <div className={styles.step2Layout}>
                <div className={styles.leftCol}>
                    <div className={styles.sectionTitle}>Trình tự thực hiện:</div>
                    <div className={styles.infoContent}>
                        <p>
                            - Cá nhân hoặc nhóm cá nhân hoặc người đại diện hộ gia đình gửi Giấy đề nghị đăng ký hộ kinh
                            doanh đến cơ quan đăng ký kinh doanh cấp huyện nơi đặt địa điểm kinh doanh.
                        </p>
                        <p>
                            - Trường hợp hồ sơ không hợp lệ, cơ quan đăng ký kinh doanh cấp huyện phải thông báo rõ nội
                            dung cần sửa đổi, bổ sung bằng văn bản cho người thành lập hộ kinh doanh.
                        </p>
                        <p>
                            - Khi tiếp nhận hồ sơ, cơ quan đăng ký kinh doanh cấp huyện trao Giấy biên nhận và cấp Giấy
                            chứng nhận đăng ký hộ kinh doanh cho hộ kinh doanh.
                        </p>
                    </div>

                    <div className={styles.sectionTitle}>Cách thức thực hiện:</div>
                    <table className={styles.infoTable}>
                        <thead>
                            <tr>
                                <th>Hình thức nộp</th>
                                <th>Thời hạn giải quyết</th>
                                <th>Phí, lệ phí</th>
                                <th>Mô tả</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Trực tiếp</td>
                                <td>3 Ngày làm việc</td>
                                <td>
                                    • Lệ phí: <span>100.000 Đồng</span>
                                    <br />
                                    <span
                                        style={{ color: "#FF3B30", fontSize: "14px", cursor: "pointer" }}
                                        onClick={() => setShowFeePopup(true)}
                                    >
                                        Xem chi tiết
                                    </span>
                                </td>
                                <td>Trong thời hạn 03 (ba) ngày làm việc, kể từ khi nhận đủ hồ sơ hợp lệ.</td>
                            </tr>
                            <tr>
                                <td>Trực tuyến</td>
                                <td>3 Ngày làm việc</td>
                                <td>
                                    • Lệ phí: <span>100.000 Đồng</span>
                                    <br />
                                    <span
                                        style={{ color: "#FF3B30", fontSize: "14px", cursor: "pointer" }}
                                        onClick={() => setShowFeePopup(true)}
                                    >
                                        Xem chi tiết
                                    </span>
                                </td>
                                <td>Trong thời hạn 03 (ba) ngày làm việc, kể từ khi nhận đủ hồ sơ hợp lệ.</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className={styles.sectionTitle}>Thành phần hồ sơ:</div>
                    <div className={styles.infoContent}>
                        <p>- Giấy đề nghị đăng ký hộ kinh doanh;</p>
                        <p>
                            - Bản sao văn bản ủy quyền của thành viên hộ gia đình cho một thành viên làm chủ hộ kinh
                            doanh đối với trường hợp hộ kinh doanh do các thành viên hộ gia đình đăng ký thành lập. Văn
                            bản ủy quyền này phải được công chứng hoặc chứng thực theo quy định của pháp luật.
                        </p>
                    </div>

                    <div className={styles.sectionTitle}>Yêu cầu, điều kiện thực hiện:</div>
                    <div className={styles.infoContent}>
                        <p>
                            (i) Hộ kinh doanh được cấp Giấy chứng nhận đăng ký hộ kinh doanh khi có đủ các điều kiện sau
                            đây:
                        </p>
                        <p>- Ngành, nghề đăng ký kinh doanh không bị cấm đầu tư kinh doanh;</p>
                        <p>
                            - Tên của hộ kinh doanh được đặt theo đúng quy định tại Điều 88 Nghị định số 01/2021/NĐ-CP;
                        </p>
                        <p>- Có hồ sơ đăng ký hộ kinh doanh hợp lệ;</p>
                        <p>- Nộp đủ lệ phí đăng ký hộ kinh doanh theo quy định.</p>
                        <p>
                            (ii) Hồ sơ đăng ký hộ kinh doanh qua mạng thông tin điện tử được chấp thuận khi có đầy đủ
                            các yêu cầu sau:
                        </p>
                        <p>
                            - Có đầy đủ các giấy tờ và nội dung các giấy tờ đó được kê khai đầy đủ theo quy định như hồ
                            sơ đăng ký hộ kinh doanh bằng bản giấy và được thể hiện dưới dạng văn bản điện tử. Tên văn
                            bản điện tử phải được đặt tương ứng với tên loại giấy tờ trong hồ sơ đăng ký hộ kinh doanh
                            bằng bản giấy. Chủ hộ kinh doanh, các thành viên hộ gia đình hoặc cá nhân khác ký tên trong
                            hồ sơ đăng ký hộ kinh doanh có thể sử dụng chữ ký số để ký trực tiếp trên văn bản điện tử
                            hoặc ký trực tiếp trên văn bản giấy và quét (scan) văn bản giấy theo các định dạng quy định
                            tại khoản 2 Điều 5g (bổ sung tại Khoản 2 Điều 1 Thông tư số 02/2023/TT-BKHĐT ngày 18/4/2023
                            của Bộ Kế hoạch và Đầu tư sửa đổi, bổ sung một số điều của Thông tư số 01/2021/TT-BKHĐT);
                        </p>
                        <p>
                            - Các thông tin đăng ký hộ kinh doanh được kê khai trên hệ thống thông tin về đăng ký hộ
                            kinh doanh phải được nhập đầy đủ và chính xác theo các thông tin trong hồ sơ đăng ký hộ kinh
                            doanh bằng bản giấy; trong đó có thông tin về số điện thoại, thư điện tử của người nộp hồ
                            sơ;
                        </p>
                        <p>
                            - Hồ sơ đăng ký hộ kinh doanh qua mạng thông tin điện tử phải được xác thực bằng chữ ký số
                            của chủ hộ kinh doanh hoặc người được chủ hộ kinh doanh ủy quyền thực hiện thủ tục đăng ký
                            hộ kinh doanh. Trường hợp ủy quyền thực hiện thủ tục đăng ký hộ kinh doanh, hồ sơ đăng ký hộ
                            kinh doanh qua mạng thông tin điện tử phải kèm theo các giấy tờ, tài liệu quy định tại khoản
                            4 Điều 84 Nghị định số 01/2021/NĐ-CP.
                        </p>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.sectionTitle}>Cơ quan thực hiện:</div>

                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="agencyType"
                                value="tinh_thanh"
                                checked={agencyType === "tinh_thanh"}
                                onChange={(e) => setAgencyType(e.target.value)}
                            />
                            Tỉnh/Thành phố
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="agencyType"
                                value="bo_nganh"
                                checked={agencyType === "bo_nganh"}
                                onChange={(e) => setAgencyType(e.target.value)}
                            />
                            Bộ ngành
                        </label>
                    </div>

                    {agencyType === "tinh_thanh" ? (
                        <div className={styles.selectRow}>
                            <div className={styles.selectGroup}>
                                <label className={styles.selectLabel}>Tỉnh/Thành phố:</label>
                                <Select
                                    value={provinceOptions.find((o) => o.value === provValue)}
                                    onChange={handleProvChange}
                                    options={provinceOptions}
                                    placeholder="Chọn Tỉnh/Thành phố"
                                    isClearable
                                />
                            </div>
                            <div className={styles.selectGroup}>
                                <label className={styles.selectLabel}>Xã/Phường/Đặc khu:</label>
                                <Select
                                    value={communeOptions.find((o) => o.value === wardValue)}
                                    onChange={handleWardChange}
                                    options={communeOptions}
                                    placeholder="Chọn Xã/Phường"
                                    isClearable
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.selectRow}>
                            <div className={styles.selectGroup}>
                                <label className={styles.selectLabel}>Cơ quan Bộ ngành:</label>
                                <Select
                                    value={boNganhOptions.find((o) => o.value === boNganhValue)}
                                    onChange={(option) => setBoNganhValue(option ? option.value : "")}
                                    options={boNganhOptions}
                                    placeholder="Chọn Bộ ngành"
                                    isClearable
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
                        <button className={styles.btnAgree} onClick={() => setSubmitStep(1)}>
                            Quay lại
                        </button>
                        <button
                            className={styles.btnAgree}
                            onClick={() => {
                                if (agencyType === "tinh_thanh" && (!provValue || !wardValue)) {
                                    alert("Vui lòng chọn đầy đủ Tỉnh/Thành phố và Xã/Phường.");
                                    return;
                                }
                                if (agencyType === "bo_nganh" && !boNganhValue) {
                                    alert("Vui lòng chọn cơ quan Bộ ngành.");
                                    return;
                                }
                                setSubmitStep(3);
                            }}
                        >
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep3 = () => {
        const provinceOptions = provinces.map((p) => ({ value: p.name, label: p.name, code: p.code }));
        const communeOptions = communes.map((c) => ({ value: c.name, label: c.name, type: c.type || "" }));
        const boNganhOptions = [
            { value: "bocongthuong", label: "Bộ Công Thương" },
            { value: "bokhdt", label: "Bộ Kế hoạch và Đầu tư" },
            { value: "botaichinh", label: "Bộ Tài chính" },
            { value: "botuphap", label: "Bộ Tư pháp" },
        ]; // Mocked

        return (
            <div className={styles.step2Layout}>
                <div className={styles.leftCol}>
                    {agencyType === "bo_nganh" ? (
                        <>
                            <div className={styles.sectionTitle} style={{ textAlign: "center", marginBottom: "24px" }}>
                                Danh sách dịch vụ công:
                            </div>
                            <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.6" }}>
                                {boNganhValue || "Cơ quan"} đang trong quá trình thực hiện chuẩn hóa dịch vụ công để
                                tích hợp với Cổng Dịch vụ công Quốc gia.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={styles.sectionTitle} style={{ textAlign: "center", marginBottom: "24px" }}>
                                Danh sách dịch vụ công:
                            </div>

                            <div className={styles.serviceList}>
                                <div className={styles.serviceCard}>
                                    <div className={styles.serviceCardBody}>
                                        <div className={styles.serviceCardTitle}>{procedure?.title}</div>
                                        <div className={styles.serviceDetails}>
                                            <div className={styles.detailItem}>
                                                <p>DVCTT toàn trình</p>
                                                <span
                                                    className={styles.feeHighlight}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setShowFeePopup(true)}
                                                >
                                                    Xem Phí/ Lệ phí
                                                </span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <p>Cơ quan thực hiện: UBND {wardValue}</p>
                                                <p>Đối tượng: Công dân Việt Nam</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={styles.btnSubmitOnline} onClick={handleFinalSubmit}>
                                        Nộp trực tuyến
                                    </button>
                                </div>

                                {provValue === "Hà Nội" && (
                                    <div className={styles.serviceCard}>
                                        <div className={styles.serviceCardBody}>
                                            <div className={styles.serviceCardTitle}>{procedure?.title}</div>
                                            <div className={styles.serviceDetails}>
                                                <div className={styles.detailItem}>
                                                    <div
                                                        className={styles.feeHighlight}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setShowFeePopup(true)}
                                                    >
                                                        Xem Phí/ Lệ phí
                                                    </div>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <p>Cơ quan thực hiện: Sở Tư pháp</p>
                                                    <p>Đối tượng: Công dân Việt Nam</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className={styles.btnSubmitOnline} onClick={handleFinalSubmit}>
                                            Nộp trực tuyến
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.sectionTitle}>Cơ quan thực hiện:</div>

                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="agencyType3"
                                value="tinh_thanh"
                                checked={agencyType === "tinh_thanh"}
                                onChange={(e) => setAgencyType(e.target.value)}
                            />
                            Tỉnh/Thành phố
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="agencyType3"
                                value="bo_nganh"
                                checked={agencyType === "bo_nganh"}
                                onChange={(e) => setAgencyType(e.target.value)}
                            />
                            Bộ ngành
                        </label>
                    </div>

                    {agencyType === "tinh_thanh" ? (
                        <div className={styles.selectRow}>
                            <div className={styles.selectGroup}>
                                <label className={styles.selectLabel}>Tỉnh/Thành phố:</label>
                                <Select
                                    value={provinceOptions.find((o) => o.value === provValue)}
                                    onChange={handleProvChange}
                                    options={provinceOptions}
                                    placeholder="Chọn Tỉnh/Thành phố"
                                    isClearable
                                />
                            </div>
                            <div className={styles.selectGroup}>
                                <label className={styles.selectLabel}>Xã/Phường/Đặc khu:</label>
                                <Select
                                    value={communeOptions.find((o) => o.value === wardValue)}
                                    onChange={handleWardChange}
                                    options={communeOptions}
                                    placeholder="Chọn Xã/Phường"
                                    isClearable
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.selectRow}>
                            <div className={styles.selectGroup}>
                                <label className={styles.selectLabel}>Cơ quan Bộ ngành:</label>
                                <Select
                                    value={boNganhOptions.find((o) => o.value === boNganhValue)}
                                    onChange={(option) => setBoNganhValue(option ? option.value : "")}
                                    options={boNganhOptions}
                                    placeholder="Chọn Bộ ngành"
                                    isClearable
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
                        <button className={styles.btnAgree} onClick={() => setSubmitStep(2)}>
                            Quay lại
                        </button>
                        <button className={styles.btnAgree} onClick={() => {}}>
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (submissionStatus === "success") {
        return (
            <div className={styles.container}>
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px 0",
                        backgroundColor: "#f8f9fa",
                        minHeight: "400px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <div style={{ marginBottom: "24px" }}>
                        <img src={successIcon} alt="Success" style={{ width: "120px" }} />
                    </div>
                    <h2 style={{ color: "#28a745", fontWeight: "bold", fontSize: "24px", marginBottom: "24px" }}>
                        THÀNH CÔNG
                    </h2>
                    <div style={{ borderTop: "2px solid #2F5597", width: "80%", margin: "0 auto 24px" }}></div>
                    <p style={{ fontWeight: "600", marginBottom: "24px" }}>
                        Đăng ký thành công, vui lòng tra cứu và đợi kết quả gửi mail!
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <span style={{ fontWeight: "600" }}>Mã hồ sơ</span>
                        <span style={{ color: "#505050" }}>{procedure?.code}</span>
                    </div>
                    <div style={{ marginTop: "40px" }}>
                        <button
                            className={styles.btnAction}
                            style={{ margin: "0 auto" }}
                            onClick={() => navigate(`/list-procedures/${procedure?.typeCompany}`)}
                        >
                            <img src={checkIcon} alt="" />
                            Hoàn tất
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (submissionStatus === "error") {
        return (
            <div className={styles.container}>
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px 0",
                        backgroundColor: "#f8f9fa",
                        minHeight: "400px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <div style={{ marginBottom: "24px" }}>
                        <img src={failureIcon} alt="Failure" style={{ width: "120px" }} />
                    </div>
                    <h2 style={{ color: "#dc3545", fontWeight: "bold", fontSize: "24px", marginBottom: "24px" }}>
                        THẤT BẠI
                    </h2>
                    <div style={{ borderTop: "2px solid #2F5597", width: "80%", margin: "0 auto 24px" }}></div>
                    <p style={{ fontWeight: "600", marginBottom: "40px" }}>
                        Rất tiếc, chúng tôi gặp sự cố nộp hồ sơ của bạn, vui lòng thử lại.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "30%", padding: "0 20%" }}>
                        <button
                            className={styles.btnAction}
                            onClick={() => navigate(`/list-procedures/${procedure?.typeCompany}`)}
                        >
                            <img src={saveIcon} alt="" />
                            Lưu và Thoát
                        </button>
                        <button
                            className={styles.btnAction}
                            style={{ borderColor: "#52c41a", color: "#52c41a" }}
                            onClick={() => setSubmissionStatus(null)}
                        >
                            <img src={checkIcon} alt="" />
                            Nộp lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {submitStep === 1 && renderStep1()}
            {submitStep === 2 && renderStep2()}
            {submitStep === 3 && renderStep3()}
            {renderFeePopup()}
        </div>
    );
}
