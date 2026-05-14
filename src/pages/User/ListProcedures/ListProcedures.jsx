import React, { useState, useEffect } from "react";
import styles from "./ListProcedures.module.css";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/NavBar/NavBar";
import { publicAxios } from "@/services/axios-instance";
import Banner from "@/components/Banner/Banner";
import typeCompanyOptions from "@/consts/typeCompany";
import serviceType from "@/consts/serviceType";
import { useNavigate, useParams } from "react-router-dom";
import ProcedureCard from "@/components/Procedure/ProcedureCard/ProcedureCard";

// Tabs chính = từng item trong typeCompanyOptions
const tabs = typeCompanyOptions;

const ListProcedures = () => {
    const navigate = useNavigate();
    const { typeCompany } = useParams();

    const [activeTab, setActiveTab] = useState(() => {
        const index = tabs.findIndex((tab) => tab.value === typeCompany);
        return index !== -1 ? index : 0;
    });
    const [allProcedures, setAllProcedures] = useState([]); // grouped array
    const [selectedServiceType, setSelectedServiceType] = useState("all");
    const [loading, setLoading] = useState(false);

    // Modal state
    const [selectedProcedure, setSelectedProcedure] = useState(null);

    // Fetch khi đổi tab
    useEffect(() => {
        const selectedTypeCompany = tabs[activeTab]?.value;
        if (!selectedTypeCompany) return;
        setLoading(true);
        const fetchProcedures = async () => {
            try {
                const res = await publicAxios.get(
                    "/api/procedurer/find-by-type-company?typeCompany=" + selectedTypeCompany,
                );
                setAllProcedures(res.data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách thủ tục:", error);
                setAllProcedures([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProcedures();
    }, [activeTab]);

    const handleTabChange = (index) => {
        setActiveTab(index);
        setSelectedServiceType("all");
    };

    const filteredProcedures =
        selectedServiceType === "all"
            ? allProcedures
            : allProcedures.filter((group) => group.serviceType === selectedServiceType);

    const openModal = (procedure) => {
        setSelectedProcedure(procedure);
    };

    const closeModal = () => {
        setSelectedProcedure(null);
    };

    const handleRegister = () => {
        if (selectedProcedure?.procedureId) {
            navigate(`/process-procedure/${selectedProcedure.procedureId}`);
            window.scrollTo(0, 0);
        }
        closeModal();
    };

    return (
        <div>
            <Navbar />
            <div className={styles["list-procedures-main"]}>
                <Banner />
                <div className={styles["company-services"]}>
                    {/* Tabs = các loại công ty */}
                    <div className={styles["tabs"]}>
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                className={activeTab === index ? styles["active"] : ""}
                                onClick={() => handleTabChange(index)}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    {/* Nội dung: hiển thị theo từng group serviceType */}
                    <select
                        className={styles.select}
                        value={selectedServiceType}
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        {serviceType.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    {loading ? (
                        <p className={styles["empty-text"]}>Đang tải...</p>
                    ) : filteredProcedures.length === 0 ? (
                        <p className={styles["empty-text"]}>Chưa có thủ tục nào cho loại công ty này.</p>
                    ) : (
                        filteredProcedures.map((group, gIndex) => (
                            <div key={gIndex} className={styles["service-group"]}>
                                <h2 className={styles["service-group-title"]}>
                                    {group.serviceTypeTitle?.toUpperCase()}
                                </h2>
                                <div className={styles["procedures-list"]}>
                                    {(group.procedures || []).map((proc, pIndex) => (
                                        <ProcedureCard key={pIndex} procedure={proc} onOpenModal={openModal} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal popup */}
            {selectedProcedure && (
                <div className={styles["modal-overlay"]} onClick={closeModal}>
                    <div className={styles["modal-box"]} onClick={(e) => e.stopPropagation()}>
                        <div className={styles["modal-header"]}>
                            <h3>Thông tin các hồ sơ cần chuẩn bị trước khi nộp hồ sơ</h3>
                            <button className={styles["modal-close"]} onClick={closeModal}>
                                ✕
                            </button>
                        </div>
                        <div className={styles["modal-body"]}>
                            <p>{selectedProcedure.description} cần chuẩn bị 1 trong các hồ sơ đính kèm sau:</p>
                            {selectedProcedure.forms && selectedProcedure.forms.length > 0 && (
                                <ol className={styles["modal-list"]}>
                                    {selectedProcedure.forms.map((form, i) => (
                                        <li key={i}>{form.name}</li>
                                    ))}
                                </ol>
                            )}
                            <p>Quý khách nhận được kết quả sau 5-7 ngày làm việc bao gồm:</p>
                            <ol className={styles["modal-list"]}>
                                <li>Giấy phép kinh doanh</li>
                                <li>Dấu (mộc) công ty hàng cao cấp</li>
                                <li>Chữ ký số cao cấp</li>
                                <li>Tài khoản ngân hàng chọn số của TechcomBank</li>
                                <li>Thông báo phát hành hoá đơn điện tử</li>
                                <li>Cập nhật chính sách thuế liên tục</li>
                            </ol>
                        </div>
                        <div className={styles["modal-footer"]}>
                            <button className={styles["btn-cancel"]} onClick={closeModal}>
                                <span className={styles["icon-cancel"]}>✕</span> Huỷ
                            </button>
                            <button className={styles["btn-confirm"]} onClick={handleRegister}>
                                <span className={styles["icon-confirm"]}>✓</span> Thực hiện
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ListProcedures;
