import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/HoKinhDoanh/FormDeclaration/GiayUyQuyen.module.css";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import UploadCCCD from "@/components/UploadCCCD/UploadCCCD";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import {
    GioiTinhSelect,
    DanTocSelect,
    QuocTichSelect,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import { useGetFormDataJsonFromName, useProcessProcedure } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import DateInput from "@/components/DateInput/DateInput";
import {
    DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const GiayUyQuyenDeclaration = forwardRef(function GiayUyQuyenDeclaration(
    { formId, dataJson, onSubmit, formRef },
    componentRef,
) {
    const giayDeNghiData = useGetFormDataJsonFromName("Giấy đề nghị đăng ký doanh nghiệp");
    const { procedure } = useProcessProcedure();

    const defaultCompanyNamePrefix = procedure?.typeCompany === "cong_ty_co_phan"
        ? DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX
        : DEFAULT_TNHH_COMPANY_NAME_PREFIX;
    const typeCompanyPrefix = getCompanyNamePrefix(giayDeNghiData, defaultCompanyNamePrefix);

    const companyName = giayDeNghiData?.tenCongTyVN
        ? `${typeCompanyPrefix} ${giayDeNghiData.tenCongTyVN.toUpperCase()}`
        : "doanh nghiệp";

    const [provCode_uyQuyen, setProvCode_uyQuyen] = useState("");
    const [provCode_nhanUyQuyen_thuongTru, setProvCode_nhanUyQuyen_thuongTru] = useState("");
    const [provCode_nhanUyQuyen_lienLac, setProvCode_nhanUyQuyen_lienLac] = useState("");

    // State for nhanUyQuyen contact address to sync from corporate form
    const [nhanUyQuyenLienLacAddressState, setNhanUyQuyenLienLacAddressState] = useState({
        tinh:
            dataJson?.nhanUyQuyen_lienLac_tinh ||
            giayDeNghiData?.lienLac_tinh ||
            giayDeNghiData?.nguoiNop_thuongTru_tinh ||
            "",
        xa:
            dataJson?.nhanUyQuyen_lienLac_xa ||
            giayDeNghiData?.lienLac_xa ||
            giayDeNghiData?.nguoiNop_thuongTru_xa ||
            "",
        soNha:
            dataJson?.nhanUyQuyen_lienLac_soNha ||
            giayDeNghiData?.lienLac_soNha ||
            giayDeNghiData?.nguoiNop_thuongTru_soNha ||
            "",
    });
    const [nhanUyQuyenLienLacKey, setNhanUyQuyenLienLacKey] = useState(0);

    const { provinces, communes: communes_uyQuyen, loadingCommunes: loadingCommunes_uyQuyen } = useFetchAddress(provCode_uyQuyen);
    const { communes: communes_nhanUyQuyen_thuongTru, loadingCommunes: loadingCommunes_nhanUyQuyen_thuongTru } = useFetchAddress(provCode_nhanUyQuyen_thuongTru);
    const { communes: communes_nhanUyQuyen_lienLac, loadingCommunes: loadingCommunes_nhanUyQuyen_lienLac } = useFetchAddress(provCode_nhanUyQuyen_lienLac);

    // Sync nhanUyQuyen contact address when corporate form or saved data changes
    useEffect(() => {
        setNhanUyQuyenLienLacAddressState({
            tinh:
                dataJson?.nhanUyQuyen_lienLac_tinh ||
                giayDeNghiData?.lienLac_tinh ||
                giayDeNghiData?.nguoiNop_thuongTru_tinh ||
                "",
            xa:
                dataJson?.nhanUyQuyen_lienLac_xa ||
                giayDeNghiData?.lienLac_xa ||
                giayDeNghiData?.nguoiNop_thuongTru_xa ||
                "",
            soNha:
                dataJson?.nhanUyQuyen_lienLac_soNha ||
                giayDeNghiData?.lienLac_soNha ||
                giayDeNghiData?.nguoiNop_thuongTru_soNha ||
                "",
        });
        setNhanUyQuyenLienLacKey((prev) => prev + 1);
    }, [giayDeNghiData, dataJson]);

    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.companyName = companyName;
            data.phongThucHien = phongThucHienDefault;
            return data;
        },
        getExportData: () => {
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.companyName = companyName;
            data.phongThucHien = phongThucHienDefault;
            return data;
        },
        importData: (importedData) => {
            if (!importedData) return;
            // Cập nhật province code để AddressSelect load commune đúng
            // Province sẽ được truyền qua defaultValue khi form re-render với key mới
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

    const normalizeAddressPart = (value) =>
        String(value || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/^(tinh|thanh pho|tp\.?|xa|phuong|thi tran)\s+/i, "")
            .trim();

    const splitCCCDAddress = (address) => {
        const parts = String(address || "")
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean);

        if (parts.length === 0) {
            return { province: "", ward: "", street: "" };
        }

        const provincePart =
            parts.find((part) =>
                provinces.some((province) => normalizeAddressPart(province.name) === normalizeAddressPart(part)),
            ) || parts[parts.length - 1];

        const provinceIndex = parts.indexOf(provincePart);
        const wardPart =
            parts.find((part, index) => index !== provinceIndex && /^(xã|xa|phường|phuong|thị trấn|thi tran)\s+/i.test(part)) ||
            "";

        const wardIndex = wardPart ? parts.indexOf(wardPart) : -1;
        const street = parts
            .filter((_, index) => index !== provinceIndex && index !== wardIndex)
            .join(", ");

        return {
            province: provincePart || "",
            ward: wardPart || "",
            street,
        };
    };

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

    const handleFillNhanUyQuyenFromCCCD = (customer) => {
        const permanentAddress = splitCCCDAddress(customer?.address);
        const nextNhanUyQuyen = {
            nhanUyQuyen_hoTen: customer?.fullName?.toUpperCase() || "",
            nhanUyQuyen_gioiTinh: customer?.gender || "",
            nhanUyQuyen_ngaySinh: customer?.dob || "",
            nhanUyQuyen_cccd: customer?.cccd || "",
            nhanUyQuyen_danToc: "Kinh",
            nhanUyQuyen_quocTich: "Việt Nam",
            nhanUyQuyen_thuongTru_tinh: permanentAddress.province,
            nhanUyQuyen_thuongTru_xa: permanentAddress.ward,
            nhanUyQuyen_thuongTru_soNha: permanentAddress.street,
            nhanUyQuyen_lienLac_tinh: permanentAddress.province,
            nhanUyQuyen_lienLac_xa: permanentAddress.ward,
            nhanUyQuyen_lienLac_soNha: permanentAddress.street,
        };

        setLocalNhanUyQuyen((prev) => ({
            ...prev,
            ...nextNhanUyQuyen,
        }));
        setNhanUyQuyenLienLacAddressState({
            tinh: permanentAddress.province,
            xa: permanentAddress.ward,
            soNha: permanentAddress.street,
        });
        setNhanUyQuyenLienLacKey((prev) => prev + 1);
        setNhanUyQuyenKey((prev) => prev + 1);
    };

    function buildPhongThucHienDefault() {
        let phongThucHienDefault = dataJson?.phongThucHien || giayDeNghiData?.kinhGui || "";
        if (phongThucHienDefault.startsWith("Kính gửi")) {
            phongThucHienDefault = phongThucHienDefault.substring(9).trim();
        }
        return phongThucHienDefault;
    }

    const phongThucHienDefault = buildPhongThucHienDefault();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.companyName = companyName;
        data.phongThucHien = phongThucHienDefault;
        if (onSubmit) {
            onSubmit(data);
        }
    };


    return (
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson ? "loaded" : "empty"}>
            <div className={styles.row}>
                <div className={styles.colLeft}>
                    <div key={`uyQuyen-${uyQuyenKey}`}>
                        <h3 className={styles.sectionTitle}>Bên uỷ quyền (Bên A): <UserCardDropdown onSelect={handleFillUyQuyenCard} /></h3>

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
                                        dataJson?.uyQuyen_hoTen || giayDeNghiData?.giamDoc_hoTen?.toUpperCase() || ""
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
                                    defaultValue={localUyQuyen.uyQuyen_ngaySinh ?? (dataJson?.uyQuyen_ngaySinh || giayDeNghiData?.giamDoc_ngaySinh || "")}
                                    required
                                />
                            </div>

                            <GioiTinhSelect
                                name="uyQuyen_gioiTinh"
                                defaultValue={localUyQuyen.uyQuyen_gioiTinh ?? (dataJson?.uyQuyen_gioiTinh || giayDeNghiData?.giamDoc_gioiTinh)}
                            />
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Số định danh cá nhân <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    name="uyQuyen_cccd"
                                    defaultValue={localUyQuyen.uyQuyen_cccd ?? (dataJson?.uyQuyen_cccd || giayDeNghiData?.giamDoc_cccd || "")}
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
                                    defaultValue={localUyQuyen.uyQuyen_email ?? (dataJson?.uyQuyen_email || giayDeNghiData?.giamDoc_email || "")}
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

                    </div>
                    <div key={`nhanUyQuyen-${nhanUyQuyenKey}`}>
                        <h3 className={styles.sectionTitle} style={{ marginTop: "24px" }}>
                            Bên nhận uỷ quyền (Bên B): <UserCardDropdown onSelect={handleFillNhanUyQuyenCard} />
                        </h3>

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
                                defaultValue={localNhanUyQuyen.nhanUyQuyen_gioiTinh ?? (dataJson?.nhanUyQuyen_gioiTinh || giayDeNghiData?.nguoiNop_gioiTinh)}
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
                                defaultValue={localNhanUyQuyen.nhanUyQuyen_danToc ?? (dataJson?.nhanUyQuyen_danToc || giayDeNghiData?.nguoiNop_danToc)}
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

                        {/* The grey text box - updated for CongTyCoPhan */}
                    </div><div className={styles.greyBox}>
                        <div className={styles.greyBoxContent} style={{ display: "block", lineHeight: "1.6" }}>
                            <span className={styles.greyText}>
                                Bên A ủy quyền cho bên B thực hiện các công việc sau đây:
                                <br />- {`Nộp hồ sơ và nhận kết quả thủ tục đăng ký mới ${companyName} tại ${phongThucHienDefault}`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right side: Upload CCCD */}
                <div className={styles.colRight}>
                    <UploadCCCD onComplete={handleFillNhanUyQuyenFromCCCD} />
                </div>
            </div>
        </form>
    );
});

export default GiayUyQuyenDeclaration;
