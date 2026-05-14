import React, { useEffect, useState } from "react";
import styles from "./ProcedureFilter.module.css";
import Navbar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import CourseSkeleton from "@/components/Loading/Skeleton/CourseSkeleton";
import ProcedureCard from "@/components/Procedure/ProcedureCard/ProcedureCard";
import { publicAxios } from "@/services/axios-instance";
import { useNavigate, useSearchParams } from "react-router-dom";
import serviceType from "@/consts/serviceType";

const WindowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.75 3.75V13.75H13.75V3.75H3.75ZM3.75 16.25V26.25H13.75V16.25H3.75ZM16.25 3.75V13.75H26.25V3.75H16.25ZM16.25 16.25V26.25H26.25V16.25H16.25Z"
            fill="#443F6B"
        />
    </svg>
);

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clipPath="url(#clip0_833_12029)">
            <path
                d="M13.825 7.1582L10 10.9749L6.175 7.1582L5 8.3332L10 13.3332L15 8.3332L13.825 7.1582Z"
                fill="#0C0C0C"
            />
        </g>
        <defs>
            <clipPath id="clip0_833_12029">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const ProcedureFilter = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get("query") || "";

    const [allProcedures, setAllProcedures] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPriceFilters, setSelectedPriceFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState(queryParam);
    const [loading, setLoading] = useState(true);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [viewMode, setViewMode] = useState("list");

    const pageTitle = "Tất cả thủ tục";

    useEffect(() => {
        const fetchProcedures = async () => {
            setLoading(true);
            try {
                const res = await publicAxios.get("/api/procedurer/get-all");
                setAllProcedures(res.data || []);
            } catch (err) {
                console.error("Lỗi lấy danh sách thủ tục:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProcedures();
    }, []);

    useEffect(() => {
        let result = allProcedures;

        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title?.toLowerCase().includes(lowerSearchTerm) ||
                    p.description?.toLowerCase().includes(lowerSearchTerm),
            );
        }

        if (selectedCategories.length > 0) {
            result = result.filter((p) => selectedCategories.includes(p.serviceType));
        }

        if (selectedPriceFilters.length > 0) {
            result = result.filter((p) => {
                if (selectedPriceFilters.includes("free") && selectedPriceFilters.includes("paid")) return true;
                if (selectedPriceFilters.includes("free")) return p.salePrice === 0;
                if (selectedPriceFilters.includes("paid")) return p.salePrice > 0;
                return true;
            });
        }

        setFiltered(result);
    }, [allProcedures, searchTerm, selectedCategories, selectedPriceFilters]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleCategory = (value) => {
        setSelectedCategories((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
    };

    const togglePriceFilter = (value) => {
        setSelectedPriceFilters((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
    };

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

    const toggleViewMode = () => {
        setViewMode((prev) => (prev === "list" ? "grid" : "list"));
    };

    const countFor = (value) => allProcedures.filter((p) => p.serviceType === value).length;
    const countFree = allProcedures.filter((p) => p.salePrice === 0).length;
    const countPaid = allProcedures.filter((p) => p.salePrice > 0).length;
    const nextViewLabel = viewMode === "grid" ? "Hiển thị danh sách" : "Hiển thị dạng lưới";

    return (
        <div className={styles.procedureFilter}>
            <Navbar />
            <div className={styles["procedures-filter-main"]}>
                <Breadcrumb items={[{ label: "Trang chủ", link: "/" }, { label: "Thủ tục pháp lý" }]} />

                <div className={styles["procedures-page-layout"]}>
                    <div className={styles["filter-column"]}>
                        <h2 className={styles["procedure-title-sidebar"]}>{pageTitle}</h2>
                        <div className={styles["filter-container"]}>
                            <div className={styles["filter-section"]}>
                                <div className={styles["section-header"]}>
                                    <span>Danh mục pháp lý</span>
                                </div>
                                <div className={styles["section-content"]}>
                                    {serviceType.map((cat) => (
                                        <label key={cat.value} className={styles["filter-option"]}>
                                            <div className={styles["option-left"]}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat.value)}
                                                    onChange={() => toggleCategory(cat.value)}
                                                />
                                                <span className={styles["custom-checkbox"]}></span>
                                                <span className={styles["option-text"]}>{cat.label}</span>
                                            </div>
                                            <span className={styles["option-count"]}>{countFor(cat.value)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles["filter-section"]}>
                                <div className={styles["section-header"]}>
                                    <span>Giá</span>
                                </div>
                                <div className={styles["section-content"]}>
                                    <label className={styles["filter-option"]}>
                                        <div className={styles["option-left"]}>
                                            <input
                                                type="checkbox"
                                                checked={selectedPriceFilters.includes("free")}
                                                onChange={() => togglePriceFilter("free")}
                                            />
                                            <span className={styles["custom-checkbox"]}></span>
                                            <span className={styles["option-text"]}>Miễn phí</span>
                                        </div>
                                        <span className={styles["option-count"]}>{countFree}</span>
                                    </label>
                                    <label className={styles["filter-option"]}>
                                        <div className={styles["option-left"]}>
                                            <input
                                                type="checkbox"
                                                checked={selectedPriceFilters.includes("paid")}
                                                onChange={() => togglePriceFilter("paid")}
                                            />
                                            <span className={styles["custom-checkbox"]}></span>
                                            <span className={styles["option-text"]}>Trả phí</span>
                                        </div>
                                        <span className={styles["option-count"]}>{countPaid}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles["main-content"]}>
                        <div className={styles["procedure-header"]}>
                            <div className={styles["header-controls"]}>
                                <div className={styles["search-box-custom"]}>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                                <div className={styles["sort-dropdown"]}>
                                    <span className={styles["sort-text"]}>Phổ biến nhất</span>
                                    <ArrowIcon />
                                </div>
                                <button
                                    type="button"
                                    className={`${styles["view-mode-icon"]} ${
                                        viewMode === "grid" ? styles["view-mode-icon-active"] : ""
                                    }`}
                                    onClick={toggleViewMode}
                                    title={nextViewLabel}
                                    aria-label={nextViewLabel}
                                >
                                    <WindowIcon />
                                </button>
                            </div>
                        </div>

                        <div className={styles["procedures-list-container"]}>
                            {loading ? (
                                <div className={styles["procedures-list"]}>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <CourseSkeleton key={index} />
                                    ))}
                                </div>
                            ) : filtered.length > 0 ? (
                                <div
                                    className={`${styles["procedures-list"]} ${
                                        viewMode === "grid" ? styles["procedures-grid"] : ""
                                    }`}
                                >
                                    {filtered.map((procedure) => (
                                        <ProcedureCard
                                            key={procedure.procedureId}
                                            procedure={procedure}
                                            onOpenModal={openModal}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className={styles["empty"]}>Không tìm thấy thủ tục nào phù hợp.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedProcedure && (
                <div className={styles["modal-overlay"]} onClick={closeModal}>
                    <div className={styles["modal-box"]} onClick={(e) => e.stopPropagation()}>
                        <div className={styles["modal-header"]}>
                            <h3>Thông tin các hồ sơ cần chuẩn bị trước khi nộp hồ sơ</h3>
                            <button type="button" className={styles["modal-close"]} onClick={closeModal}>
                                ×
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
                            <button type="button" className={styles["btn-cancel"]} onClick={closeModal}>
                                <span className={styles["icon-cancel"]}>×</span> Hủy
                            </button>
                            <button type="button" className={styles["btn-confirm"]} onClick={handleRegister}>
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

export default ProcedureFilter;
