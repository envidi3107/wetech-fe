import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
// Reuse styles from HoKinhDoanh
import styles from "@/components/Procedure/ProcedureTemplate/HoKinhDoanh/FormDeclaration/GiayUyQuyen.module.css";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import UploadCCCD from "@/components/UploadCCCD/UploadCCCD";
import { buildCCCDFormData, splitCCCDAddress } from "@/components/UploadCCCD/cccdFormMapper";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import {
    GioiTinhSelect,
    DanTocSelect,
    QuocTichSelect,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import DateInput from "@/components/DateInput/DateInput";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const GiayUyQuyenDeclaration = forwardRef(function GiayUyQuyenDeclaration(
    { formId, dataJson, onSubmit, formRef },
    componentRef,
) {
    const giayDeNghiData = useGetFormDataJsonFromName("Giấy đề nghị đăng ký doanh nghiệp");
    const companyNamePrefix = dataJson?.tenCongTyPrefix || getCompanyNamePrefix(giayDeNghiData, DEFAULT_TNHH_COMPANY_NAME_PREFIX);

    const [provCode_uyQuyen, setProvCode_uyQuyen] = useState("");
    const [provCode_nhanUyQuyen_thuongTru, setProvCode_nhanUyQuyen_thuongTru] = useState("");
    const [provCode_nhanUyQuyen_lienLac, setProvCode_nhanUyQuyen_lienLac] = useState("");

    // Helper: tách prefix và tên từ chuỗi kinhGui đã lưu
    const parseKinhGui = (kg = "") => {
        const knownPrefixes = [
            "Phòng Kinh tế xã ",
            "Phòng Kinh tế, Hạ tầng và Đô thị phường ",
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
    const [kinhGuiPrefix, setKinhGuiPrefix] = useState(() => _initParsed.prefix || "Phòng Đăng ký kinh doanh");
    const [kinhGuiName, setKinhGuiName] = useState(() => _initParsed.name);

    // State for nhanUyQuyen contact address to sync from corporate form
    const [nhanUyQuyenLienLacAddressState, setNhanUyQuyenLienLacAddressState] = useState({
        tinh: dataJson?.nhanUyQuyen_lienLac_tinh || giayDeNghiData?.lienLac_tinh || "",
        xa: dataJson?.nhanUyQuyen_lienLac_xa || giayDeNghiData?.lienLac_xa || "",
        soNha: dataJson?.nhanUyQuyen_lienLac_soNha || giayDeNghiData?.lienLac_soNha || "",
    });
    const [nhanUyQuyenLienLacKey, setNhanUyQuyenLienLacKey] = useState(0);

    // useFetchAddress: provinces cache toàn cục
    const { provinces, communes: communes_uyQuyen, loadingCommunes: loadingCommunes_uyQuyen } = useFetchAddress(provCode_uyQuyen);
    const { communes: communes_nhanUyQuyen_thuongTru, loadingCommunes: loadingCommunes_nhanUyQuyen_thuongTru } = useFetchAddress(provCode_nhanUyQuyen_thuongTru);
    const { communes: communes_nhanUyQuyen_lienLac, loadingCommunes: loadingCommunes_nhanUyQuyen_lienLac } = useFetchAddress(provCode_nhanUyQuyen_lienLac);

    // Sync nhanUyQuyen contact address when corporate form or saved data changes
    useEffect(() => {
        setNhanUyQuyenLienLacAddressState({
            tinh: dataJson?.nhanUyQuyen_lienLac_tinh || giayDeNghiData?.lienLac_tinh || "",
            xa: dataJson?.nhanUyQuyen_lienLac_xa || giayDeNghiData?.lienLac_xa || "",
            soNha: dataJson?.nhanUyQuyen_lienLac_soNha || giayDeNghiData?.lienLac_soNha || "",
        });
        setNhanUyQuyenLienLacKey((prev) => prev + 1);
    }, [giayDeNghiData, dataJson]);

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
            setKinhGuiPrefix(parsed.prefix || "Phòng Đăng ký kinh doanh");
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
        if (typeof setNhanUyQuyenLienLacAddressState === 'function') {
            setNhanUyQuyenLienLacAddressState({
                tinh: card.currentAddress?.province || "",
                xa: card.currentAddress?.ward || "",
                soNha: card.currentAddress?.street || ""
            });
            if (typeof setNhanUyQuyenLienLacKey === 'function') setNhanUyQuyenLienLacKey(prev => prev + 1);
        }
        setNhanUyQuyenKey((prev) => prev + 1);
    };

    const handleFillNhanUyQuyenCCCD = (customer) => {
        const cccdData = buildCCCDFormData(customer, {
            personPrefix: "nhanUyQuyen",
            contactPrefix: "nhanUyQuyen_lienLac",
            permanentPrefix: "nhanUyQuyen_thuongTru",
            provinces,
        });
        const address = splitCCCDAddress(customer?.address, provinces);

        setLocalNhanUyQuyen(prev => ({
            ...prev,
            ...cccdData,
        }));
        setNhanUyQuyenLienLacAddressState({
            tinh: address.province,
            xa: address.ward,
            soNha: address.street,
        });
        setNhanUyQuyenLienLacKey((prev) => prev + 1);
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
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson || giayDeNghiData ? "loaded" : "empty"}>
            <input type="hidden" name="kinhGuiPrefix" value={kinhGuiPrefix} />
            <input type="hidden" name="tenCongTyPrefix" value={companyNamePrefix} />
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
                                defaultValue={
                                    dataJson?.uyQuyen_hoTen || giayDeNghiData?.nguoiDaiDien_hoTen?.toUpperCase() || ""
                                }
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

                        <GioiTinhSelect
                            name="uyQuyen_gioiTinh"
                            defaultValue={localUyQuyen.uyQuyen_gioiTinh ?? (dataJson?.uyQuyen_gioiTinh || giayDeNghiData?.nguoiDaiDien_gioiTinh)}
                        />
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

                        <DanTocSelect
                            name="uyQuyen_danToc"
                            defaultValue={dataJson?.uyQuyen_danToc || giayDeNghiData?.nguoiDaiDien_danToc || "Kinh"}
                            required={false}
                        />
                        <QuocTichSelect
                            name="uyQuyen_quocTich"
                            defaultValue={
                                dataJson?.uyQuyen_quocTich || giayDeNghiData?.nguoiDaiDien_quocTich || "Việt Nam"
                            }
                            required={false}
                        />

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Điện thoại liên hệ <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="tel"
                                className={styles.input}
                                name="uyQuyen_phone"
                                defaultValue={localUyQuyen.uyQuyen_phone ?? (dataJson?.uyQuyen_phone || giayDeNghiData?.giamDoc_phone || "")}
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
                        Địa chỉ liên lạc:
                    </h3>
                    <AddressSelect
                        provinces={provinces}
                        communes={communes_uyQuyen}
                        onProvinceChange={setProvCode_uyQuyen}
                        provinceName="uyQuyen_tinh"
                        wardName="uyQuyen_xa"
                        houseNumberName="uyQuyen_soNha"
                        provinceDefault={
                            dataJson?.uyQuyen_tinh ||
                            giayDeNghiData?.nguoiDaiDien_tinh ||
                            giayDeNghiData?.nguoiDaiDien_thuongTru_tinh ||
                            ""
                        }
                        wardDefault={
                            dataJson?.uyQuyen_xa ||
                            giayDeNghiData?.nguoiDaiDien_xa ||
                            giayDeNghiData?.nguoiDaiDien_thuongTru_xa ||
                            ""
                        }
                        houseNumberDefault={
                            dataJson?.uyQuyen_soNha ||
                            giayDeNghiData?.nguoiDaiDien_soNha ||
                            giayDeNghiData?.nguoiDaiDien_thuongTru_soNha ||
                            ""
                        }
                        isLoadingCommunes={loadingCommunes_uyQuyen}
                    />

                    </div><div key={`nhanUyQuyen-${nhanUyQuyenKey}`}><h3 className={styles.sectionTitle} style={{ marginTop: "24px" }}>Bên nhận uỷ quyền (Bên B): <UserCardDropdown onSelect={handleFillNhanUyQuyenCard} /></h3>

                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Họ và tên <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                name="nhanUyQuyen_hoTen"
                                defaultValue={
                                    localNhanUyQuyen.nhanUyQuyen_hoTen ??
                                    (dataJson?.nhanUyQuyen_hoTen || giayDeNghiData?.nguoiNop_hoTen?.toUpperCase() || "")
                                }
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
                                defaultValue={localNhanUyQuyen.nhanUyQuyen_ngaySinh ?? (dataJson?.nhanUyQuyen_ngaySinh || giayDeNghiData?.nguoiNop_ngaySinh || "")}
                                required
                            />
                        </div>
                        <GioiTinhSelect
                            name="nhanUyQuyen_gioiTinh"
                            defaultValue={localNhanUyQuyen.nhanUyQuyen_gioiTinh ?? (dataJson?.nhanUyQuyen_gioiTinh || giayDeNghiData?.nguoiNop_gioiTinh || "")}
                        />
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Số định danh cá nhân <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                name="nhanUyQuyen_cccd"
                                defaultValue={localNhanUyQuyen.nhanUyQuyen_cccd ?? (dataJson?.nhanUyQuyen_cccd || giayDeNghiData?.nguoiNop_cccd || "")}
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
                                defaultValue={localNhanUyQuyen.nhanUyQuyen_phone ?? (dataJson?.nhanUyQuyen_phone || giayDeNghiData?.nguoiNop_phone || "")}
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
                                defaultValue={localNhanUyQuyen.nhanUyQuyen_email ?? (dataJson?.nhanUyQuyen_email || giayDeNghiData?.nguoiNop_email || "")}
                            />
                        </div>
                        <DanTocSelect
                            name="nhanUyQuyen_danToc"
                            defaultValue={localNhanUyQuyen.nhanUyQuyen_danToc ?? (dataJson?.nhanUyQuyen_danToc || giayDeNghiData?.nguoiNop_danToc || "Kinh")}
                            required={false}
                        />
                        <QuocTichSelect
                            name="nhanUyQuyen_quocTich"
                            defaultValue={
                                localNhanUyQuyen.nhanUyQuyen_quocTich ??
                                (dataJson?.nhanUyQuyen_quocTich || giayDeNghiData?.nguoiNop_quocTich || "Việt Nam")
                            }
                            required={false}
                        />
                    </div>

                    <h3 className={styles.sectionTitle} style={{ marginTop: "16px" }}>
                        Địa chỉ thường trú:
                    </h3>
                    <AddressSelect
                        provinces={provinces}
                        communes={communes_nhanUyQuyen_thuongTru}
                        onProvinceChange={setProvCode_nhanUyQuyen_thuongTru}
                        provinceName="nhanUyQuyen_thuongTru_tinh"
                        wardName="nhanUyQuyen_thuongTru_xa"
                        houseNumberName="nhanUyQuyen_thuongTru_soNha"
                        provinceDefault={
                            localNhanUyQuyen.nhanUyQuyen_thuongTru_tinh ??
                            (dataJson?.nhanUyQuyen_thuongTru_tinh || giayDeNghiData?.nguoiNop_thuongTru_tinh || "")
                        }
                        wardDefault={localNhanUyQuyen.nhanUyQuyen_thuongTru_xa ?? (dataJson?.nhanUyQuyen_thuongTru_xa || giayDeNghiData?.nguoiNop_thuongTru_xa || "")}
                        houseNumberDefault={
                            localNhanUyQuyen.nhanUyQuyen_thuongTru_soNha ??
                            (dataJson?.nhanUyQuyen_thuongTru_soNha || giayDeNghiData?.nguoiNop_thuongTru_soNha || "")
                        }
                        isRequired={false}
                        isLoadingCommunes={loadingCommunes_nhanUyQuyen_thuongTru}
                    />

                    <h3 className={styles.sectionTitle} style={{ marginTop: "16px" }}>
                        Địa chỉ liên lạc:
                    </h3>
                    <div key={`nhanUyQuyen-lienLac-group-${nhanUyQuyenLienLacKey}`}>
                        <AddressSelect
                            provinces={provinces}
                            communes={communes_nhanUyQuyen_lienLac}
                            onProvinceChange={setProvCode_nhanUyQuyen_lienLac}
                            provinceName="nhanUyQuyen_lienLac_tinh"
                            wardName="nhanUyQuyen_lienLac_xa"
                            houseNumberName="nhanUyQuyen_lienLac_soNha"
                            provinceDefault={nhanUyQuyenLienLacAddressState.tinh}
                            wardDefault={nhanUyQuyenLienLacAddressState.xa}
                            houseNumberDefault={nhanUyQuyenLienLacAddressState.soNha}
                            isLoadingCommunes={loadingCommunes_nhanUyQuyen_lienLac}
                        />
                    </div>

                    {/* The grey text box */}
                    </div><div className={styles.greyBox}>
                        <div className={styles.greyBoxContent}>
                            <span className={styles.greyText}>
                                Là người đại diện đăng ký thành lập <b>{companyNamePrefix}</b>
                            </span>
                            <input
                                className={styles.spacer}
                                type="text"
                                name="chuHo_ten"
                                defaultValue={dataJson?.chuHo_ten || giayDeNghiData?.tenCongTyVN?.toUpperCase()}
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
                    <UploadCCCD onComplete={handleFillNhanUyQuyenCCCD} />
                </div>
            </div>
        </form>
    );
});

export default GiayUyQuyenDeclaration;
