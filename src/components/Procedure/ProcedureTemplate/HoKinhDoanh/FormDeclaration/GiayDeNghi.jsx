import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import styles from "./GiayDeNghi.module.css";
import UploadCCCD from "@/components/UploadCCCD/UploadCCCD";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import NganhNgheTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable";
import ThanhVienTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/ThanhVienTable/ThanhVienTable";
import {
    GioiTinhSelect,
    DanTocSelect,
    QuocTichSelect,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import CapitalInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CapitalInput/CapitalInput";

import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

/**
 * Map fields from corporate form (Giấy đề nghị đăng ký doanh nghiệp)
 * to household business form (Giấy đề nghị đăng ký hộ kinh doanh)
 */
const mapCorporateDataToHousehold = (giayDeNghiData) => {
    if (!giayDeNghiData) return {};

    return {
        // Map person submitting form (người nộp) to representative (người đại diện)
        nguoiDaiDien_hoTen: giayDeNghiData.nguoiNop_hoTen || "",
        nguoiDaiDien_ngaySinh: giayDeNghiData.nguoiNop_ngaySinh || "",
        nguoiDaiDien_gioiTinh: giayDeNghiData.nguoiNop_gioiTinh || "",
        nguoiDaiDien_cccd: giayDeNghiData.nguoiNop_cccd || "",
        nguoiDaiDien_danToc: giayDeNghiData.nguoiNop_danToc || "",
        nguoiDaiDien_quocTich: giayDeNghiData.nguoiNop_quocTich || "",
        nguoiDaiDien_phone: giayDeNghiData.nguoiNop_phone || "",
        nguoiDaiDien_email: giayDeNghiData.nguoiNop_email || "",

        // Map contact address (địa chỉ liên lạc) to current residence (nơi ở hiện tại)
        hienTai_tinh: giayDeNghiData.lienLac_tinh || "",
        hienTai_xa: giayDeNghiData.lienLac_xa || "",
        hienTai_soNha: giayDeNghiData.lienLac_soNha || "",

        // Map company name to business name (tên hộ kinh doanh)
        hkd_tenVN: giayDeNghiData.tenCongTy_tenVN || "",
        hkd_tenEN: giayDeNghiData.tenCongTy_tenEN || "",
        hkd_tenVietTat: giayDeNghiData.tenCongTy_tenVietTat || "",

        // Map headquarters address to business headquarters (trụ sở hộ kinh doanh)
        truSo_tinh: giayDeNghiData.truSo_tinh || "",
        truSo_xa: giayDeNghiData.truSo_xa || "",
        truSo_soNha: giayDeNghiData.truSo_soNha || "",
        truSo_phone: giayDeNghiData.truSo_phone || "",
        truSo_email: giayDeNghiData.truSo_email || "",

        // Map capital and other business info
        vonKinhDoanh: giayDeNghiData.vonDieuLe || "",
        vonKinhDoanh_bangChu: giayDeNghiData.vonDieuLe_bangChu || "",
        ngayBatDau: giayDeNghiData.ngayBatDau || "",
        soLaoDong: giayDeNghiData.soLaoDong || "",
        vatMethod: giayDeNghiData.vatMethod || "",
    };
};

const GiayDeNghi = forwardRef(function GiayDeNghi({ formId, dataJson, onSubmit, formRef }, componentRef) {
    const giayDeNghiData = useGetFormDataJsonFromName("Giấy đề nghị đăng ký doanh nghiệp");
    // ── State ────────────────────────────────────────────────────────────────

    const [localNguoiDaiDien, setLocalNguoiDaiDien] = useState({});
    const [nguoiDaiDienKey, setNguoiDaiDienKey] = useState(0);

    const handleFillNguoiDaiDienCard = (card) => {
        const newCardData = {
            nguoiDaiDien_hoTen: card.fullName || "",
            nguoiDaiDien_gioiTinh: card.gender || "",
            nguoiDaiDien_ngaySinh: card.dob || "",
            nguoiDaiDien_cccd: card.cccd || "",
            nguoiDaiDien_phone: card.phone || "",
            nguoiDaiDien_email: card.email || "",
            nguoiDaiDien_danToc: card.ethnicity || "Kinh",
            nguoiDaiDien_quocTich: card.nationality || "Việt Nam",
            thuongTru_tinh: card.permanentAddress?.province || "",
            thuongTru_xa: card.permanentAddress?.ward || "",
            thuongTru_soNha: card.permanentAddress?.street || "",
            hienTai_tinh: card.currentAddress?.province || "",
            hienTai_xa: card.currentAddress?.ward || "",
            hienTai_soNha: card.currentAddress?.street || "",
        };
        setProvCode_thuongTru(newCardData.thuongTru_tinh);
        setProvCode_hienTai(newCardData.hienTai_tinh);

        setLocalNguoiDaiDien(prev => ({ ...prev, ...newCardData }));
        setNguoiDaiDienKey((prev) => prev + 1);
    };

    const [nganhNgheRows, setNganhNgheRows] = useState([]);
    const [thanhVienRows, setThanhVienRows] = useState([]);
    const [mappedData, setMappedData] = useState({});

    // Province codes cho từng ô địa chỉ (dùng để trigger fetch communes)
    const [provCode_thuongTru, setProvCode_thuongTru] = useState("");
    const [provCode_hienTai, setProvCode_hienTai] = useState("");
    const [provCode_truSo, setProvCode_truSo] = useState("");
    const [provCode_thue, setProvCode_thue] = useState("");
    const [truSoXaValue, setTruSoXaValue] = useState("");
    const [kinhGuiInputValue, setKinhGuiInputValue] = useState("");

    const [thueAddressState, setThueAddressState] = useState({
        tinh: dataJson?.thue_tinh || "",
        xa: dataJson?.thue_xa || "",
        soNha: dataJson?.thue_soNha || "",
        phone: dataJson?.thue_phone || "",
        email: dataJson?.thue_email || "",
    });
    const [thueKey, setThueKey] = useState(0);



    // ── useFetchAddress: provinces cache toàn cục → 1 lần fetch ─────────────
    const { provinces, communes: communes_thuongTru, loadingCommunes: loadingCommunes_thuongTru } = useFetchAddress(provCode_thuongTru);
    const { communes: communes_hienTai, loadingCommunes: loadingCommunes_hienTai } = useFetchAddress(provCode_hienTai);
    const { communes: communes_truSo, loadingCommunes: loadingCommunes_truSo } = useFetchAddress(provCode_truSo);
    const { communes: communes_thue, loadingCommunes: loadingCommunes_thue } = useFetchAddress(provCode_thue);

    // Helper để lấy giá trị mặc định - ưu tiên dataJson, nếu không có thì lấy mapped
    const getDefaultValue = (fieldName, fallbackValue = "") => {
        if (localNguoiDaiDien && localNguoiDaiDien[fieldName] !== undefined) {
            return localNguoiDaiDien[fieldName];
        }
        if (dataJson && dataJson[fieldName]) {
            return dataJson[fieldName];
        }
        return mappedData[fieldName] || fallbackValue;
    };

    // ── Sync từ giayDeNghiData ──────────────────────────────────────────────
    useEffect(() => {
        if (giayDeNghiData) {
            const mapped = mapCorporateDataToHousehold(giayDeNghiData);
            setMappedData(mapped);
            // Sync ngành nghề from corporate form if available
            if (giayDeNghiData.nganhNgheList && giayDeNghiData.nganhNgheList.length > 0) {
                setNganhNgheRows(giayDeNghiData.nganhNgheList);
            } // Sync trụ sở info to update kính gửi field
            if (giayDeNghiData.truSo_xa) {
                setTruSoXaValue(giayDeNghiData.truSo_xa);
            }
            if (giayDeNghiData.truSo_tinh) {
                setProvCode_truSo(giayDeNghiData.truSo_tinh);
            }
        }
    }, [giayDeNghiData]);

    // ── Sync từ dataJson ─────────────────────────────────────────────────────
    useEffect(() => {
        if (dataJson) {
            setNganhNgheRows(dataJson.nganhNgheList || []);
            setThanhVienRows(dataJson.thanhVienList || []);
            setTruSoXaValue(dataJson.truSo_xa || "");
            // Khởi tạo kinhGuiInputValue từ kinhGui đã lưu (bỏ prefix)
            const kg = dataJson.kinhGui || "";
            const phonePrefixes = [
                "Ph\u00f2ng Kinh t\u1ebf x\u00e3 ",
                "Ph\u00f2ng Kinh t\u1ebf, H\u1ea1 t\u1ea7ng v\u00e0 \u0110\u00f4 th\u1ecb ph\u01b0\u1eddng ",
                "Ph\u00f2ng Kinh t\u1ebf, H\u1ea1 t\u1ea7ng v\u00e0 \u0110\u00f4 th\u1ecb th\u1ecb tr\u1ea5n ",
            ];
            let stripped = kg;
            for (const p of phonePrefixes) {
                if (kg.toLowerCase().startsWith(p.toLowerCase())) {
                    stripped = kg.substring(p.length).trim();
                    break;
                }
            }
            setKinhGuiInputValue(stripped);
            setThueAddressState({
                tinh: dataJson.thue_tinh || "",
                xa: dataJson.thue_xa || "",
                soNha: dataJson.thue_soNha || "",
                phone: dataJson.thue_phone || "",
                email: dataJson.thue_email || "",
            });
            setThueKey((prev) => prev + 1);
        } else {
            setNganhNgheRows([]);
            setThanhVienRows([]);
            setTruSoXaValue("");
            setKinhGuiInputValue("");
            setThueAddressState({
                tinh: "",
                xa: "",
                soNha: "",
                phone: "",
                email: "",
            });
            setThueKey((prev) => prev + 1);
        }
    }, [dataJson]);

    // Khi chọn xã/phường mới ở trụ sở → tự động lấy tên (bỏ loại) vào ô kính gửi
    useEffect(() => {
        if (!truSoXaValue) return;
        const wardTypes = ["X\u00e3 ", "Ph\u01b0\u1eddng ", "Th\u1ecb tr\u1ea5n "];
        let name = truSoXaValue;
        for (const t of wardTypes) {
            if (truSoXaValue.startsWith(t)) {
                name = truSoXaValue.substring(t.length).trim();
                break;
            }
        }
        setKinhGuiInputValue(name);
    }, [truSoXaValue]);

    // ── Expose API cho DeclarationForms ─────────────────────────────────────
    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.nganhNgheList = nganhNgheRows;
            data.thanhVienList = thanhVienRows;
            data.kinhGui = currentKinhGuiPrefix + kinhGuiInputValue;
            localStorage.setItem("giayDeNghi_kinhGui", data.kinhGui);
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
            data.nganhNgheList = nganhNgheRows;
            data.thanhVienList = thanhVienRows;
            data.kinhGui = currentKinhGuiPrefix + kinhGuiInputValue;
            localStorage.setItem("giayDeNghi_kinhGui", data.kinhGui);
            return data;
        },
        importData: (importedData) => {
            if (!importedData) return;
            setNganhNgheRows(importedData.nganhNgheList || []);
            setThanhVienRows(importedData.thanhVienList || []);
            setTruSoXaValue(importedData.truSo_xa || "");
        },
    }));

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.nganhNgheList = nganhNgheRows;
        data.thanhVienList = thanhVienRows;
        data.kinhGui = currentKinhGuiPrefix + kinhGuiInputValue;
        localStorage.setItem("giayDeNghi_kinhGui", data.kinhGui);
        if (onSubmit) onSubmit(data);
    };

    // Helpers extracted to SharedFormComponents
    const getKinhGuiPrefix = (ward) => {
        if (!ward) return "Phòng Kinh tế, Hạ tầng và Đô thị Phường ";
        const w = ward.toLowerCase();
        if (w.startsWith("xã")) return "Phòng Kinh tế xã ";
        if (w.startsWith("thị trấn")) return "Phòng Kinh tế, Hạ tầng và Đô thị thị trấn ";
        return "Phòng Kinh tế, Hạ tầng và Đô thị Phường ";
    };
    const currentKinhGuiPrefix = getKinhGuiPrefix(truSoXaValue);

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson ? "loaded" : "empty"}>
            {/* ── Người đại diện & CCCD ── */}
            <div className={styles.row} key={`nguoi-dai-dien-${nguoiDaiDienKey}`}>
                <div className={styles.colLeft}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                        <h3 className={styles.sectionTitle} style={{ margin: 0, marginRight: "8px" }}>Tên người đại diện:</h3>
                        <UserCardDropdown onSelect={handleFillNguoiDaiDienCard} />
                    </div>
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Họ và tên <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                name="nguoiDaiDien_hoTen"
                                defaultValue={toUppercaseValue(getDefaultValue("nguoiDaiDien_hoTen"))}
                                style={{ textTransform: "uppercase" }}
                                onInput={handleUppercaseInput}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Ngày sinh <span className={styles.required}>*</span>
                            </label>
                            <DateInput
                                className={styles.input}
                                name="nguoiDaiDien_ngaySinh"
                                defaultValue={getDefaultValue("nguoiDaiDien_ngaySinh")}
                                required
                            />
                        </div>
                        <GioiTinhSelect
                            name="nguoiDaiDien_gioiTinh"
                            defaultValue={getDefaultValue("nguoiDaiDien_gioiTinh")}
                        />
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Số định danh cá nhân <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                name="nguoiDaiDien_cccd"
                                defaultValue={getDefaultValue("nguoiDaiDien_cccd")}
                                required
                                pattern="[0-9]{12}"
                                title="Số CCCD phải có 12 chữ số"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Điện thoại <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="tel"
                                className={styles.input}
                                name="nguoiDaiDien_phone"
                                defaultValue={getDefaultValue("nguoiDaiDien_phone")}
                                required
                                pattern="(0|\+84)[0-9]{9,10}"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email:</label>
                            <input
                                type="email"
                                className={styles.input}
                                name="nguoiDaiDien_email"
                                defaultValue={getDefaultValue("nguoiDaiDien_email")}
                            />
                        </div>
                    </div>
                    <div className={styles.grid2}>
                        <DanTocSelect
                            name="nguoiDaiDien_danToc"
                            defaultValue={getDefaultValue("nguoiDaiDien_danToc")}
                            required={false}
                        />
                        <QuocTichSelect
                            name="nguoiDaiDien_quocTich"
                            defaultValue={getDefaultValue("nguoiDaiDien_quocTich")}
                            required={false}
                        />
                    </div>

                    <h3 className={styles.sectionTitle}>Nơi thường trú:</h3>
                    <AddressSelect
                        isRequired={false}
                        provinces={provinces}
                        communes={communes_thuongTru}
                        onProvinceChange={setProvCode_thuongTru}
                        provinceName="thuongTru_tinh"
                        wardName="thuongTru_xa"
                        houseNumberName="thuongTru_soNha"
                        provinceDefault={getDefaultValue("thuongTru_tinh")}
                        wardDefault={getDefaultValue("thuongTru_xa")}
                        houseNumberDefault={getDefaultValue("thuongTru_soNha")}
                        isLoadingCommunes={loadingCommunes_thuongTru}
                    />

                    <h3 className={styles.sectionTitle}>Nơi ở hiện tại:</h3>
                    <AddressSelect
                        isRequired={false}
                        provinces={provinces}
                        communes={communes_hienTai}
                        onProvinceChange={setProvCode_hienTai}
                        provinceName="hienTai_tinh"
                        wardName="hienTai_xa"
                        houseNumberName="hienTai_soNha"
                        provinceDefault={getDefaultValue("hienTai_tinh")}
                        wardDefault={getDefaultValue("hienTai_xa")}
                        houseNumberDefault={getDefaultValue("hienTai_soNha")}
                        isLoadingCommunes={loadingCommunes_hienTai}
                    />
                </div>
                <div className={styles.colRight}>
                    <UploadCCCD onComplete={(front, back) => console.log("Extracted", front, back)} />
                </div>
            </div>

            {/* ── Tên HKD & Trụ sở ── */}
            <div className={styles.row}>
                <div className={styles.colHalf}>
                    <h3 className={styles.sectionTitle}>Tên hộ kinh doanh:</h3>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Tên tiếng Việt <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputPrefixWrapper}>
                            <p>HỘ KINH DOANH</p>
                            <input
                                type="text"
                                className={styles.inputNoBorder}
                                name="hkd_tenVN"
                                defaultValue={toUppercaseValue(getDefaultValue("hkd_tenVN"))}
                                style={{ textTransform: "uppercase" }}
                                onInput={handleUppercaseInput}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tên tiếng nước ngoài:</label>
                        <input
                            type="text"
                            className={styles.input}
                            name="hkd_tenEN"
                            defaultValue={getDefaultValue("hkd_tenEN")}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tên viết tắt:</label>
                        <input
                            type="text"
                            className={styles.input}
                            name="hkd_tenVietTat"
                            defaultValue={getDefaultValue("hkd_tenVietTat")}
                        />
                    </div>
                </div>
                <div className={styles.colHalf}>
                    <h3 className={styles.sectionTitle}>Trụ sở của hộ kinh doanh:</h3>
                    <AddressSelect
                        isRequired={false}
                        provinces={provinces}
                        communes={communes_truSo}
                        onProvinceChange={setProvCode_truSo}
                        onWardChange={setTruSoXaValue}
                        provinceName="truSo_tinh"
                        wardName="truSo_xa"
                        houseNumberName="truSo_soNha"
                        provinceDefault={getDefaultValue("truSo_tinh")}
                        wardDefault={getDefaultValue("truSo_xa")}
                        houseNumberDefault={getDefaultValue("truSo_soNha")}
                        isLoadingCommunes={loadingCommunes_truSo}
                    />
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Điện thoại <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="tel"
                                className={styles.input}
                                name="truSo_phone"
                                defaultValue={getDefaultValue("truSo_phone")}
                                required
                                pattern="(0|\+84)[0-9]{9,10}"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email:</label>
                            <input
                                type="email"
                                className={styles.input}
                                name="truSo_email"
                                defaultValue={getDefaultValue("truSo_email")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Ngành nghề ── */}
            <NganhNgheTable rows={nganhNgheRows} onChangeRows={setNganhNgheRows} disabled={false} />

            {/* ── Vốn kinh doanh ── */}
            <CapitalInput
                title="Vốn kinh doanh"
                labelNumber="Tổng số (VNĐ)"
                labelText="Tổng số bằng chữ"
                nameNumber="vonKinhDoanh"
                nameText="vonKinhDoanh_bangChu"
                defaultNumber={getDefaultValue("vonKinhDoanh")}
                defaultText={getDefaultValue("vonKinhDoanh_bangChu")}
                required={true}
            />

            <div className={styles.formGroup}>
                <h3 className={styles.sectionTitle}>Kính gửi:</h3>
                <div className={styles.inputWithSuffixKinhGui}>
                    <p className={styles.inputSuffixKinhGui}>{currentKinhGuiPrefix}</p>
                    <input
                        type="text"
                        className={styles.inputKinhGui}
                        name="kinhGui"
                        value={kinhGuiInputValue}
                        onChange={(e) => setKinhGuiInputValue(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Địa chỉ thuế ── */}
            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>
                    Địa chỉ nhận thông báo thuế (chỉ kê khai nếu khác địa chỉ trụ sở):
                </h3>

                <div key={`thue-group-${thueKey}`}>
                    <AddressSelect
                        isRequired={false}
                        provinces={provinces}
                        communes={communes_thue}
                        onProvinceChange={setProvCode_thue}
                        provinceName="thue_tinh"
                        wardName="thue_xa"
                        houseNumberName="thue_soNha"
                        provinceDefault={thueAddressState.tinh}
                        wardDefault={thueAddressState.xa}
                        houseNumberDefault={thueAddressState.soNha}
                        isLoadingCommunes={loadingCommunes_thue}
                    />
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Điện thoại</label>
                            <input
                                type="tel"
                                className={styles.input}
                                name="thue_phone"
                                defaultValue={getDefaultValue("thue_phone") || thueAddressState.phone}
                                pattern="(0|\+84)[0-9]{9,10}"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email:</label>
                            <input
                                type="email"
                                className={styles.input}
                                name="thue_email"
                                defaultValue={getDefaultValue("thue_email") || thueAddressState.email}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày bắt đầu hoạt động:</label>
                    <DateInput
                        className={styles.input}
                        name="ngayBatDau"
                        defaultValue={getDefaultValue("ngayBatDau")}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tổng số lao động (dự kiến):</label>
                    <input
                        type="number"
                        className={styles.input}
                        name="soLaoDong"
                        min="0"
                        defaultValue={getDefaultValue("soLaoDong")}
                    />
                </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: "20px" }}>
                <h3 className={styles.sectionTitle}>Phương pháp tính thuế GTGT:</h3>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="vatMethod"
                            value="ke_khai"
                            className={styles.radioInput}
                            defaultChecked={getDefaultValue("vatMethod") === "ke_khai"}
                        />{" "}
                        Phương pháp kê khai
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="vatMethod"
                            value="khoan"
                            className={styles.radioInput}
                            defaultChecked={!getDefaultValue("vatMethod") || getDefaultValue("vatMethod") === "khoan"}
                        />{" "}
                        Phương pháp khoán
                    </label>
                </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: "20px" }}>
                <h3 className={styles.sectionTitle}>Chủ thể thành lập hộ kinh doanh:</h3>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="subject"
                            value="ca_nhan"
                            className={styles.radioInput}
                            defaultChecked={!getDefaultValue("subject") || getDefaultValue("subject") === "ca_nhan"}
                        />{" "}
                        Cá nhân
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="subject"
                            value="thanh_vien_gd"
                            className={styles.radioInput}
                            defaultChecked={getDefaultValue("subject") === "thanh_vien_gd"}
                        />{" "}
                        Các thành viên hộ gia đình
                    </label>
                </div>
            </div>

            {/* ── Bảng thành viên ── */}
            <ThanhVienTable rows={thanhVienRows} onChangeRows={setThanhVienRows} disabled={false} />
        </form>
    );
});

export default GiayDeNghi;
