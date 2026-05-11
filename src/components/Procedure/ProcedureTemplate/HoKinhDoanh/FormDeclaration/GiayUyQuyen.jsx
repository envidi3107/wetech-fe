import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import styles from "./GiayUyQuyen.module.css";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import UploadCCCD from "@/components/UploadCCCD/UploadCCCD";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { GioiTinhSelect, DanTocSelect, QuocTichSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import { useAuth } from "@/context/AuthContext";

const GiayUyQuyen = forwardRef(function GiayUyQuyen({ formId, dataJson, onSubmit, formRef }, componentRef) {
    const { user } = useAuth();
    const [provCode_uyQuyen, setProvCode_uyQuyen] = useState("");
    const giayDeNghiData = useGetFormDataJsonFromName("Giấy đề nghị đăng ký hộ kinh doanh");
    const hkd_tenVN = giayDeNghiData?.hkd_tenVN?.toUpperCase();
    const [provCode_nhanUyQuyen_thuongTru, setProvCode_nhanUyQuyen_thuongTru] = useState("");
    const [provCode_nhanUyQuyen_lienLac, setProvCode_nhanUyQuyen_lienLac] = useState("");
    // Helper: tách prefix và tên từ chuỗi kinhGui đã lưu
    const parseKinhGui = (kg = "") => {
        const knownPrefixes = [
            "Phòng Kinh tế xã ",
            "Phòng Kinh tế, Hạ tầng và Đô thị Phường ",
            "Phòng Kinh tế, Hạ tầng và Đô thị thị trấn ",
        ];
        for (const p of knownPrefixes) {
            if (kg.toLowerCase().startsWith(p.toLowerCase())) {
                return { prefix: p.trimEnd(), name: kg.substring(p.length).trim() };
            }
        }
        return { prefix: kg, name: "" };
    };

    const _initParsed = parseKinhGui(localStorage.getItem("giayDeNghi_kinhGui") || "");
    const [kinhGuiPrefix, setKinhGuiPrefix] = useState(
        () => _initParsed.prefix || "Phòng Kinh tế, Hạ tầng và Đô thị Phường"
    );
    const [kinhGuiName, setKinhGuiName] = useState(() => _initParsed.name);

    // useFetchAddress: provinces cache toàn cục
    const { provinces, communes: communes_uyQuyen, loadingCommunes: loadingCommunes_uyQuyen } = useFetchAddress(provCode_uyQuyen);
    const { communes: communes_nhanUyQuyen_thuongTru, loadingCommunes: loadingCommunes_nhanUyQuyen_thuongTru } = useFetchAddress(provCode_nhanUyQuyen_thuongTru);
    const { communes: communes_nhanUyQuyen_lienLac, loadingCommunes: loadingCommunes_nhanUyQuyen_lienLac } = useFetchAddress(provCode_nhanUyQuyen_lienLac);

    // Expose API cho DeclarationForms
    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            return Object.fromEntries(formData.entries());
        },
        getExportData: () => {
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }
            const formData = new FormData(formRef.current);
            return Object.fromEntries(formData.entries());
        },
        importData: (importedData) => {
            // Re-read kinhGui from localStorage in case GiayDeNghi just saved it
            const saved = localStorage.getItem("giayDeNghi_kinhGui") || "";
            const parsed = parseKinhGui(saved);
            setKinhGuiPrefix(parsed.prefix || "Ph\u00f2ng Kinh t\u1ebf, H\u1ea1 t\u1ea7ng v\u00e0 \u0110\u00f4 th\u1ecb ph\u01b0\u1eddng");
            setKinhGuiName(parsed.name);
        },
    }));


    const [localUyQuyen, setLocalUyQuyen] = useState({});
    const [uyQuyenKey, setUyQuyenKey] = useState(0);

    const handleFillUyQuyenCard = (card) => {
        setLocalUyQuyen({
            uyQuyen_hoTen: card.fullName || "",
            uyQuyen_gioiTinh: card.gender || "",
            uyQuyen_ngaySinh: card.dob || "",
            uyQuyen_cccd: card.cccd || "",
            uyQuyen_phone: card.phone || "",
            uyQuyen_email: card.email || "",
            uyQuyen_tinh: card.currentAddress?.province || "",
            uyQuyen_xa: card.currentAddress?.ward || "",
            uyQuyen_soNha: card.currentAddress?.street || "",
        });
        setUyQuyenKey((prev) => prev + 1);
    };

    const [localNhanUyQuyen, setLocalNhanUyQuyen] = useState({});
    const [nhanUyQuyenKey, setNhanUyQuyenKey] = useState(0);

    const handleFillNhanUyQuyenCard = (card) => {
        setLocalNhanUyQuyen({
            nhanUyQuyen_hoTen: card.fullName || "",
            nhanUyQuyen_gioiTinh: card.gender || "",
            nhanUyQuyen_ngaySinh: card.dob || "",
            nhanUyQuyen_cccd: card.cccd || "",
            nhanUyQuyen_phone: card.phone || "",
            nhanUyQuyen_email: card.email || "",
            nhanUyQuyen_danToc: card.ethnicity || "Kinh",
            nhanUyQuyen_quocTich: card.nationality || "Việt Nam",
            nhanUyQuyen_thuongTru_tinh: card.permanentAddress?.province || "",
            nhanUyQuyen_thuongTru_xa: card.permanentAddress?.ward || "",
            nhanUyQuyen_thuongTru_soNha: card.permanentAddress?.street || "",
            nhanUyQuyen_lienLac_tinh: card.currentAddress?.province || "",
            nhanUyQuyen_lienLac_xa: card.currentAddress?.ward || "",
            nhanUyQuyen_lienLac_soNha: card.currentAddress?.street || "",
        });
        setNhanUyQuyenKey((prev) => prev + 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        if (onSubmit) {
            onSubmit(data);
        }
    };


    return (
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson ? "loaded" : "empty"}>
            <input type="hidden" name="kinhGuiPrefix" value={kinhGuiPrefix} />
            <div className={styles.row}>
                {/* Left side: Form fields */}
                <div className={styles.colLeft}>
                    <div key={`uyQuyen-${uyQuyenKey}`}><h3 className={styles.sectionTitle}>Bên uỷ quyền (Bên A): <UserCardDropdown onSelect={handleFillUyQuyenCard} /></h3>

                        <div className={styles.grid2}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Họ và tên <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    name="uyQuyen_hoTen"
                                    defaultValue={localUyQuyen.uyQuyen_hoTen ?? (dataJson?.uyQuyen_hoTen || giayDeNghiData?.nguoiDaiDien_hoTen?.toUpperCase() || "")}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Ngày sinh <span className={styles.required}>*</span>
                                </label>
                                <DateInput
                                    className={styles.input}
                                    name="uyQuyen_ngaySinh"
                                    defaultValue={localUyQuyen.uyQuyen_ngaySinh ?? (dataJson?.uyQuyen_ngaySinh || giayDeNghiData?.nguoiDaiDien_ngaySinh || "")}
                                    required
                                />
                            </div>

                            <GioiTinhSelect name="uyQuyen_gioiTinh" defaultValue={localUyQuyen.uyQuyen_gioiTinh ?? (dataJson?.uyQuyen_gioiTinh || giayDeNghiData?.nguoiDaiDien_gioiTinh)} />
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Số định danh cá nhân <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    name="uyQuyen_cccd"
                                    defaultValue={localUyQuyen.uyQuyen_cccd ?? (dataJson?.uyQuyen_cccd || giayDeNghiData?.nguoiDaiDien_cccd || "")}
                                    required
                                    pattern="[0-9]{9,12}"
                                    title="Số CCCD phải có 9–12 chữ số"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Điện thoại liên hệ <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    className={styles.input}
                                    name="uyQuyen_phone"
                                    defaultValue={localUyQuyen.uyQuyen_phone ?? (dataJson?.uyQuyen_phone || giayDeNghiData?.nguoiDaiDien_phone || "")}
                                    required
                                    pattern="(0|\+84)[0-9]{9,10}"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email:</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    name="uyQuyen_email"
                                    defaultValue={localUyQuyen.uyQuyen_email ?? (dataJson?.uyQuyen_email || giayDeNghiData?.nguoiDaiDien_email || "")}
                                />
                            </div>
                        </div>

                        <h3 className={styles.sectionTitle} style={{ marginTop: "16px" }}>
                            Địa chỉ liên lạc của bên uỷ quyền:
                        </h3>
                        <AddressSelect
                            provinces={provinces}
                            communes={communes_uyQuyen}
                            onProvinceChange={setProvCode_uyQuyen}
                            provinceName="uyQuyen_tinh"
                            wardName="uyQuyen_xa"
                            houseNumberName="uyQuyen_soNha"
                            provinceDefault={localUyQuyen.uyQuyen_tinh ?? (dataJson?.uyQuyen_tinh || giayDeNghiData?.hienTai_tinh || giayDeNghiData?.thuongTru_tinh || "")}
                            wardDefault={localUyQuyen.uyQuyen_xa ?? (dataJson?.uyQuyen_xa || giayDeNghiData?.hienTai_xa || giayDeNghiData?.thuongTru_xa || "")}
                            houseNumberDefault={localUyQuyen.uyQuyen_soNha ?? (dataJson?.uyQuyen_soNha || giayDeNghiData?.hienTai_soNha || giayDeNghiData?.thuongTru_soNha || "")}
                            isLoadingCommunes={loadingCommunes_uyQuyen}
                        />

                    </div><div key={`nhanUyQuyen-${nhanUyQuyenKey}`}><h3 className={styles.sectionTitle} style={{ marginTop: "40px" }}>Bên nhận uỷ quyền (Bên B): <UserCardDropdown onSelect={handleFillNhanUyQuyenCard} /></h3>

                        <div className={styles.grid2}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Họ và tên <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    name="nhanUyQuyen_hoTen"
                                    defaultValue={localNhanUyQuyen.nhanUyQuyen_hoTen || user?.fullname || (dataJson?.nhanUyQuyen_hoTen || "")}
                                    onChange={e => {
                                        e.target.value = e.target.value?.trim().toUpperCase()
                                    }}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Ngày sinh <span className={styles.required}>*</span>
                                </label>
                                <DateInput
                                    className={styles.input}
                                    name="nhanUyQuyen_ngaySinh"
                                    defaultValue={localNhanUyQuyen.nhanUyQuyen_ngaySinh ?? (dataJson?.nhanUyQuyen_ngaySinh || "")}
                                    required
                                />
                            </div>
                            <GioiTinhSelect name="nhanUyQuyen_gioiTinh" defaultValue={localNhanUyQuyen.nhanUyQuyen_gioiTinh ?? (dataJson?.nhanUyQuyen_gioiTinh)} />
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Số định danh cá nhân <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    name="nhanUyQuyen_cccd"
                                    defaultValue={localNhanUyQuyen.nhanUyQuyen_cccd ?? (dataJson?.nhanUyQuyen_cccd || "")}
                                    required
                                    pattern="[0-9]{9,12}"
                                    title="Số CCCD phải có 9–12 chữ số"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Điện thoại liên hệ <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    className={styles.input}
                                    name="nhanUyQuyen_phone"
                                    defaultValue={localNhanUyQuyen.nhanUyQuyen_phone || user?.phone || (dataJson?.nhanUyQuyen_phone || "")}
                                    required
                                    pattern="(0|\+84)[0-9]{9,10}"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email:</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    name="nhanUyQuyen_email"
                                    defaultValue={localNhanUyQuyen.nhanUyQuyen_email || user?.email || (dataJson?.nhanUyQuyen_email || "")}
                                />
                            </div>
                            <DanTocSelect name="nhanUyQuyen_danToc" defaultValue={localNhanUyQuyen.nhanUyQuyen_danToc ?? (dataJson?.nhanUyQuyen_danToc)} required={false} />
                            <QuocTichSelect name="nhanUyQuyen_quocTich" defaultValue={localNhanUyQuyen.nhanUyQuyen_quocTich ?? (dataJson?.nhanUyQuyen_quocTich || "Việt Nam")} required={false} />
                        </div>

                        <h3 className={styles.sectionTitle} style={{ marginTop: "16px" }}>Địa chỉ thường trú của bên nhận uỷ quyền:</h3>
                        <AddressSelect
                            provinces={provinces}
                            communes={communes_nhanUyQuyen_thuongTru}
                            onProvinceChange={setProvCode_nhanUyQuyen_thuongTru}
                            provinceName="nhanUyQuyen_thuongTru_tinh"
                            wardName="nhanUyQuyen_thuongTru_xa"
                            houseNumberName="nhanUyQuyen_thuongTru_soNha"
                            provinceDefault={localNhanUyQuyen.nhanUyQuyen_thuongTru_tinh ?? (dataJson?.nhanUyQuyen_thuongTru_tinh || "")}
                            wardDefault={localNhanUyQuyen.nhanUyQuyen_thuongTru_xa ?? (dataJson?.nhanUyQuyen_thuongTru_xa || "")}
                            houseNumberDefault={localNhanUyQuyen.nhanUyQuyen_thuongTru_soNha ?? (dataJson?.nhanUyQuyen_thuongTru_soNha || "")}
                            isLoadingCommunes={loadingCommunes_nhanUyQuyen_thuongTru}
                        />

                        <h3 className={styles.sectionTitle} style={{ marginTop: "16px" }}>Địa chỉ liên lạc của bên nhận uỷ quyền:</h3>
                        <AddressSelect
                            provinces={provinces}
                            communes={communes_nhanUyQuyen_lienLac}
                            onProvinceChange={setProvCode_nhanUyQuyen_lienLac}
                            provinceName="nhanUyQuyen_lienLac_tinh"
                            wardName="nhanUyQuyen_lienLac_xa"
                            houseNumberName="nhanUyQuyen_lienLac_soNha"
                            provinceDefault={localNhanUyQuyen.nhanUyQuyen_lienLac_tinh ?? (dataJson?.nhanUyQuyen_lienLac_tinh || "")}
                            wardDefault={localNhanUyQuyen.nhanUyQuyen_lienLac_xa ?? (dataJson?.nhanUyQuyen_lienLac_xa || "")}
                            houseNumberDefault={localNhanUyQuyen.nhanUyQuyen_lienLac_soNha ?? (dataJson?.nhanUyQuyen_lienLac_soNha || "")}
                            isLoadingCommunes={loadingCommunes_nhanUyQuyen_lienLac}
                        />

                        {/* The grey text box */}
                    </div><div className={styles.greyBox}>
                        <div className={styles.greyBoxContent}>
                            <span className={styles.greyText}>
                                Là chủ hộ kinh doanh đăng ký thành lập <b>HỘ KINH DOANH</b>
                            </span>
                            <input
                                className={styles.spacer}
                                type="text"
                                name="chuHo_ten"
                                defaultValue={dataJson?.chuHo_ten || hkd_tenVN}
                            />
                            <span className={styles.greyText}>tại {kinhGuiPrefix}</span>
                            <input
                                className={styles.spacer}
                                type="text"
                                name="chuHo_xa_phuong"
                                value={kinhGuiName}
                                onChange={(e) => setKinhGuiName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Right side: Upload CCCD */}
                <div className={styles.colRight}>
                    <UploadCCCD onComplete={(front, back) => console.log("Extracted", front, back)} />
                </div>
            </div>
        </form>
    );
});

export default GiayUyQuyen;
