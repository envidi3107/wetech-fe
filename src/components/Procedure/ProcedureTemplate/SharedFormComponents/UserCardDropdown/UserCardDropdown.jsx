import React, { useState, useMemo } from "react";
import styles from "./UserCardDropdown.module.css";
import sharedStyles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import { useProcessProcedure } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import { formatDate } from "@/utils/dateTimeUtils";
import { authAxios } from "@/services/axios-instance";
import { useNotification } from "@/hooks/useNotification";
import { GioiTinhSelect, DanTocSelect, QuocTichSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";

const getCardCountry = (card) => card?.nationality || card?.country || "";

export default function UserCardDropdown({ onSelect }) {
    const { userCards, refreshUserCards } = useProcessProcedure();
    const { showNotification } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Edit state
    const [editingCard, setEditingCard] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Address province codes for fetching communes
    const [permanentProvinceCode, setPermanentProvinceCode] = useState("");
    const [currentProvinceCode, setCurrentProvinceCode] = useState("");

    const { provinces, communes: permanentCommunes, loadingCommunes: loadingPermanentCommunes } = useFetchAddress(permanentProvinceCode);
    const { communes: currentCommunes, loadingCommunes: loadingCurrentCommunes } = useFetchAddress(currentProvinceCode);

    const handleSelectCard = (card) => {
        const country = getCardCountry(card);
        if (onSelect) {
            onSelect({
                ...card,
                country,
                nationality: country,
            });
        }
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Bạn có chắc chắn muốn xóa thông tin này?")) return;
        try {
            await authAxios.delete(`/api/users/my-card/delete/${id}`);
            showNotification("Xóa thông tin thành công", "success");
            refreshUserCards();
        } catch (error) {
            console.error(error);
            showNotification("Lỗi khi xóa thẻ", "error");
        }
    };

    const handleEditClick = (e, card) => {
        e.stopPropagation();
        const permProvinceName = card.permanentAddress?.province || "";
        const currProvinceName = card.currentAddress?.province || "";

        setEditFormData({
            id: card.id,
            fullName: card.fullName || "",
            cccd: card.cccd || "",
            gender: card.gender || "",
            dob: card.dob || "",
            email: card.email || "",
            phone: card.phone || "",
            nationality: getCardCountry(card),
            ethnicity: card.ethnicity || "",
            permanentStreet: card.permanentAddress?.street || "",
            permanentWard: card.permanentAddress?.ward || "",
            permanentProvince: permProvinceName,
            currentStreet: card.currentAddress?.street || "",
            currentWard: card.currentAddress?.ward || "",
            currentProvince: currProvinceName,
        });

        // Tra mã tỉnh để fetch communes ngay khi mở form sửa
        if (permProvinceName && provinces.length > 0) {
            const perm = provinces.find(p =>
                p.name.trim().toLowerCase() === permProvinceName.trim().toLowerCase()
            );
            if (perm) setPermanentProvinceCode(perm.code);
        }
        if (currProvinceName && provinces.length > 0) {
            const curr = provinces.find(p =>
                p.name.trim().toLowerCase() === currProvinceName.trim().toLowerCase()
            );
            if (curr) setCurrentProvinceCode(curr.code);
        }

        setEditingCard(card);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        if (!editFormData.fullName || !editFormData.cccd || !editFormData.dob || !editFormData.gender) {
            showNotification("Vui lòng điền đầy đủ các trường bắt buộc", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            await authAxios.post("/api/users/my-card/update", editFormData);
            showNotification("Cập nhật thẻ thành công", "success");
            setEditingCard(null);
            refreshUserCards();
        } catch (error) {
            console.error(error);
            showNotification("Lỗi khi cập nhật", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCards = useMemo(() => {
        const cardsList = userCards || [];
        if (!searchTerm) return cardsList;
        const lowerTerm = searchTerm.toLowerCase();
        return cardsList.filter((card) =>
            (card.fullName || "").toLowerCase().includes(lowerTerm) ||
            (card.cccd || "").includes(lowerTerm) ||
            getCardCountry(card).toLowerCase().includes(lowerTerm)
        );
    }, [searchTerm, userCards]);

    return (
        <div className={styles.dropdownContainer}>
            <button
                type="button"
                className={styles.iconButton}
                onClick={() => setIsOpen(true)}
                title="Lịch sử khai báo thông tin cá nhân"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#1b154b" strokeWidth="2" />
                    <path d="M8 12h8m-8-4h8m-8 8h5" stroke="#1b154b" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {isOpen && (
                <div className={styles.overlay} onClick={() => { setIsOpen(false); setEditingCard(null); }}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.header}>
                            <h3 className={styles.title}>
                                {editingCard ? "Sửa thông tin cá nhân" : "Lịch sử khai báo thông tin cá nhân"}
                            </h3>
                            <button type="button" className={styles.closeBtn} onClick={() => { setIsOpen(false); setEditingCard(null); }}>&times;</button>
                        </div>

                        <div className={styles.body}>
                            {editingCard ? (
                                <div className={styles.editForm}>
                                    <div className={sharedStyles.grid2}>
                                        <div className={sharedStyles.formGroup}>
                                            <label className={sharedStyles.label}>Họ và tên <span className={sharedStyles.required}>*</span></label>
                                            <input className={sharedStyles.input} name="fullName" value={editFormData.fullName} onChange={handleEditChange} />
                                        </div>
                                        <div className={sharedStyles.formGroup}>
                                            <label className={sharedStyles.label}>CCCD/CMND <span className={sharedStyles.required}>*</span></label>
                                            <input className={sharedStyles.input} name="cccd" value={editFormData.cccd} onChange={handleEditChange} />
                                        </div>
                                        <div className={sharedStyles.formGroup}>
                                            <label className={sharedStyles.label}>Ngày sinh <span className={sharedStyles.required}>*</span></label>
                                            <input className={sharedStyles.input} type="date" name="dob" value={editFormData.dob} onChange={handleEditChange} />
                                        </div>
                                        <GioiTinhSelect
                                            key={`gender-${editFormData.gender}`}
                                            name="gender"
                                            defaultValue={editFormData.gender}
                                            required={true}
                                            onChange={(val) => handleSelectChange("gender", val)}
                                        />
                                        <QuocTichSelect
                                            key={`nationality-${editFormData.nationality}`}
                                            name="nationality"
                                            defaultValue={editFormData.nationality || ""}
                                            required={false}
                                            onChange={(val) => handleSelectChange("nationality", val)}
                                        />
                                        {editFormData.nationality === "Việt Nam" && (
                                            <DanTocSelect
                                                key={`ethnicity-${editFormData.ethnicity}`}
                                                name="ethnicity"
                                                defaultValue={editFormData.ethnicity}
                                                required={false}
                                                onChange={(val) => handleSelectChange("ethnicity", val)}
                                            />
                                        )}
                                        <div className={sharedStyles.formGroup}>
                                            <label className={sharedStyles.label}>Email</label>
                                            <input className={sharedStyles.input} name="email" value={editFormData.email} onChange={handleEditChange} />
                                        </div>
                                        <div className={sharedStyles.formGroup}>
                                            <label className={sharedStyles.label}>Số điện thoại</label>
                                            <input className={sharedStyles.input} type="tel" name="phone" value={editFormData.phone} onChange={handleEditChange} />
                                        </div>
                                    </div>

                                    <h4 className={styles.sectionTitle}>Nơi thường trú</h4>
                                    <AddressSelect
                                        isRequired={false}
                                        hasHouseNumber={false}
                                        provinceDefault={editFormData.permanentProvince}
                                        wardDefault={editFormData.permanentWard}
                                        provinces={provinces}
                                        communes={permanentCommunes}
                                        isLoadingCommunes={loadingPermanentCommunes}
                                        onProvinceChange={(code) => {
                                            setPermanentProvinceCode(code);
                                            const prov = provinces.find(p => String(p.code) === String(code));
                                            handleSelectChange("permanentProvince", prov ? prov.name : "");
                                        }}
                                        onWardChange={(val) => handleSelectChange("permanentWard", val)}
                                    />
                                    <div className={sharedStyles.formGroup}>
                                        <label className={sharedStyles.label}>Số nhà, đường phố</label>
                                        <input className={sharedStyles.input} name="permanentStreet" value={editFormData.permanentStreet} onChange={handleEditChange} />
                                    </div>

                                    <h4 className={styles.sectionTitle}>Nơi ở hiện tại</h4>
                                    <AddressSelect
                                        isRequired={false}
                                        hasHouseNumber={false}
                                        provinceDefault={editFormData.currentProvince}
                                        wardDefault={editFormData.currentWard}
                                        provinces={provinces}
                                        communes={currentCommunes}
                                        isLoadingCommunes={loadingCurrentCommunes}
                                        onProvinceChange={(code) => {
                                            setCurrentProvinceCode(code);
                                            const prov = provinces.find(p => String(p.code) === String(code));
                                            handleSelectChange("currentProvince", prov ? prov.name : "");
                                        }}
                                        onWardChange={(val) => handleSelectChange("currentWard", val)}
                                    />
                                    <div className={sharedStyles.formGroup}>
                                        <label className={sharedStyles.label}>Số nhà, đường phố</label>
                                        <input className={sharedStyles.input} name="currentStreet" value={editFormData.currentStreet} onChange={handleEditChange} />
                                    </div>

                                    <div className={styles.formActions}>
                                        <button type="button" className={styles.btnCancel} onClick={() => setEditingCard(null)}>Hủy</button>
                                        <button type="button" className={styles.btnSubmit} disabled={isSubmitting} onClick={handleEditSubmit}>
                                            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="search"
                                        className={styles.searchInput}
                                        placeholder="Nhập họ tên hoặc số CCCD để tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>Họ và tên</th>
                                                    <th>Ngày sinh</th>
                                                    <th>Giới tính</th>
                                                    <th>CCCD</th>
                                                    <th>Quốc gia</th>
                                                    <th>Email</th>
                                                    <th>Số điện thoại</th>
                                                    <th>Thường trú</th>
                                                    <th>Nơi ở hiện tại</th>
                                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCards && filteredCards.length > 0 ? (
                                                    filteredCards.map((card, idx) => (
                                                        <tr key={card.id || `card-${idx}`} onClick={() => handleSelectCard(card)} className={styles.row}>
                                                            <td style={{ fontWeight: 600 }}>{card.fullName}</td>
                                                            <td>{formatDate(card.dob)}</td>
                                                            <td>{card.gender}</td>
                                                            <td style={{ fontWeight: 500, color: "#1b154b" }}>{card.cccd}</td>
                                                            <td style={{ fontSize: "0.85rem", color: "#555" }}>{getCardCountry(card) || "Chưa cập nhật"}</td>
                                                            <td style={{ fontSize: "0.85rem", color: "#555" }}>{card.email || "Chưa cập nhật"}</td>
                                                            <td style={{ fontSize: "0.85rem", color: "#555" }}>{card.phone || "Chưa cập nhật"}</td>
                                                            <td style={{ fontSize: "0.85rem", color: "#555" }}>
                                                                {[card.permanentAddress?.street, card.permanentAddress?.ward, card.permanentAddress?.province]
                                                                    .filter(Boolean)
                                                                    .join(", ") || "Chưa cập nhật"}
                                                            </td>
                                                            <td style={{ fontSize: "0.85rem", color: "#555" }}>
                                                                {[card.currentAddress?.street, card.currentAddress?.ward, card.currentAddress?.province]
                                                                    .filter(Boolean)
                                                                    .join(", ") || "Chưa cập nhật"}
                                                            </td>
                                                            <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                                                                <div className={styles.actionFlex}>
                                                                    <button type="button" className={styles.editBtn} onClick={(e) => handleEditClick(e, card)} title="Sửa">
                                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button type="button" className={styles.deleteBtn} onClick={(e) => handleDelete(e, card.id)} title="Xóa">
                                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <polyline points="3 6 5 6 21 6" />
                                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                            <line x1="10" y1="11" x2="10" y2="17" />
                                                                            <line x1="14" y1="11" x2="14" y2="17" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={10} className={styles.empty}>
                                                            {!userCards || userCards.length === 0
                                                                ? "Chưa có dữ liệu đã lưu. Dữ liệu của bạn sẽ tự động lưu lại khi nộp hồ sơ."
                                                                : "Không tìm thấy kết quả phù hợp."}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
