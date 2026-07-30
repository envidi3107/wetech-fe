import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import DateInput from "@/components/DateInput/DateInput";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { buildKinhGui } from "@/consts/provinceRoomMap";
import { GioiTinhSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import KinhGuiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/KinhGuiSection";
import ThongTinDoanhNghiepSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDoanhNghiepSection";
import {
    A_CHANGE_OPTIONS,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    TNHH_COMPANY_NAME_PREFIX_OPTIONS,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

function PersonFields({ data, prefix, required = false }) {
    const sourcePrefix = prefix === "giamDoc" ? "nguoiDaiDien" : "";
    const getValue = (field) =>
        data?.[`${prefix}_${field}`] || (sourcePrefix ? data?.[`${sourcePrefix}_${field}`] : "") || "";

    return (
        <>
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Họ, chữ đệm và tên {required && <span className={styles.required}>*</span>}
                </label>
                <input
                    type="text"
                    className={styles.input}
                    name={`${prefix}_hoTen`}
                    defaultValue={toUppercaseValue(getValue("hoTen"))}
                    style={{ textTransform: "uppercase" }}
                    onInput={handleUppercaseInput}
                    required={required}
                />
            </div>
            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Ngày, tháng, năm sinh {required && <span className={styles.required}>*</span>}
                    </label>
                    <DateInput
                        className={styles.input}
                        name={`${prefix}_ngaySinh`}
                        defaultValue={getValue("ngaySinh")}
                        required={required}
                    />
                </div>
                <GioiTinhSelect name={`${prefix}_gioiTinh`} defaultValue={getValue("gioiTinh")} required={required} />
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Số định danh cá nhân {required && <span className={styles.required}>*</span>}
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        name={`${prefix}_cccd`}
                        defaultValue={getValue("cccd")}
                        pattern="[0-9]{9,12}"
                        required={required}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Điện thoại {required && <span className={styles.required}>*</span>}
                    </label>
                    <input
                        type="tel"
                        className={styles.input}
                        name={`${prefix}_phone`}
                        defaultValue={getValue("phone")}
                        pattern="(0|\+84)[0-9]{9,10}"
                        required={required}
                    />
                </div>
            </div>
        </>
    );
}

const REPRESENTATIVE_FIELDS_TO_CLEAR = [
    "nguoiDaiDien_email",
    "nguoiDaiDien_tinh",
    "nguoiDaiDien_xa",
    "nguoiDaiDien_soNha",
    "nguoiDaiDien_lienLac_quocGia",
    "nguoiDaiDien_danToc",
    "nguoiDaiDien_quocTich",
    "nguoiDaiDien_soHoChieu",
    "nguoiDaiDien_ngayCapHoChieu",
    "nguoiDaiDien_noiCapHoChieu",
    "nguoiDaiDien_thuongTru_tinh",
    "nguoiDaiDien_thuongTru_xa",
    "nguoiDaiDien_thuongTru_soNha",
    "nguoiDaiDien_thuongTru_quocGia",
];

const GiayDeNghiDangKyThayDoiThongTinGiamDocDeclaration = forwardRef(
    function GiayDeNghiDangKyThayDoiThongTinGiamDocDeclaration({ dataJson, onSubmit, formRef }, componentRef) {
        const { provinces } = useFetchAddress();
        const [normalizedData, setNormalizedData] = useState(() => normalizeDataJson(dataJson));
        const [formVersion, setFormVersion] = useState(0);
        const [kinhGuiProvince, setKinhGuiProvince] = useState("");
        const [kinhGuiValue, setKinhGuiValue] = useState("");

        useEffect(() => {
            const parsed = normalizeDataJson(dataJson);
            const matchedProvince =
                parsed.kinhGuiProvince ||
                provinces.find(
                    (province) =>
                        buildKinhGui(province.name) === parsed.kinhGui ||
                        parsed.kinhGui?.trim().endsWith(province.name),
                )?.name ||
                "";

            setNormalizedData(parsed);
            setKinhGuiProvince(matchedProvince);
            setKinhGuiValue(matchedProvince ? buildKinhGui(matchedProvince) : parsed.kinhGui || "");
            setFormVersion((version) => version + 1);
        }, [dataJson, provinces]);

        const handleKinhGuiProvinceChange = (provinceName) => {
            setKinhGuiProvince(provinceName);
            setKinhGuiValue(provinceName ? buildKinhGui(provinceName) : "");
        };

        const collectData = () => {
            if (!formRef?.current) return null;
            if (!formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return null;
            }
            if (!kinhGuiValue) {
                window.alert("Vui lòng chọn tỉnh/thành phố cho mục Kính gửi.");
                return null;
            }

            const data = Object.fromEntries(new FormData(formRef.current).entries());
            data.kinhGui = kinhGuiValue;
            data.kinhGuiProvince = kinhGuiProvince;
            data.noiDungThayDoi = ["A"];
            A_CHANGE_OPTIONS.forEach((option) => {
                data[option.name] = option.name === "a_doiThongTinThue" ? "true" : "false";
            });

            data.nguoiDaiDien_hoTen = data.giamDoc_hoTen || "";
            data.nguoiDaiDien_ngaySinh = data.giamDoc_ngaySinh || "";
            data.nguoiDaiDien_gioiTinh = data.giamDoc_gioiTinh || "";
            data.nguoiDaiDien_cccd = data.giamDoc_cccd || "";
            data.nguoiDaiDien_phone = data.giamDoc_phone || "";
            data.nguoiDaiDien_chucDanh = "Giám đốc";
            REPRESENTATIVE_FIELDS_TO_CLEAR.forEach((fieldName) => {
                data[fieldName] = "";
            });

            return data;
        };

        useImperativeHandle(componentRef, () => ({
            getDraftData: collectData,
            getExportData: collectData,
            importData: (importedData) => {
                setNormalizedData(normalizeDataJson(importedData));
                setFormVersion((version) => version + 1);
            },
        }));

        const handleSubmit = (event) => {
            event.preventDefault();
            const data = collectData();
            if (data && onSubmit) onSubmit(data);
        };

        return (
            <form onSubmit={handleSubmit} ref={formRef} key={formVersion}>
                <KinhGuiSection
                    dataJson={{ ...normalizedData, kinhGui: kinhGuiValue, kinhGuiProvince }}
                    styles={styles}
                    autoKinhGui={kinhGuiValue}
                    prefixText="Cơ quan đăng ký kinh doanh cấp tỉnh"
                    provinceOptions={provinces}
                    selectedProvinceName={kinhGuiProvince}
                    onProvinceNameChange={handleKinhGuiProvinceChange}
                />

                <ThongTinDoanhNghiepSection
                    dataJson={normalizedData}
                    styles={styles}
                    companyNamePrefixOptions={TNHH_COMPANY_NAME_PREFIX_OPTIONS}
                    defaultCompanyNamePrefix={DEFAULT_TNHH_COMPANY_NAME_PREFIX}
                />

                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>MỤC A: KÊ KHAI THAY ĐỔI THÔNG TIN ĐĂNG KÝ THUẾ</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: "70px" }}>STT</th>
                                <th>Các chỉ tiêu thông tin đăng ký thuế thay đổi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: "center" }}>1</td>
                                <td>
                                    <p className={styles.sectionTitle}>
                                        Thông tin về Giám đốc/Tổng giám đốc sau khi thay đổi:
                                    </p>
                                    <PersonFields data={normalizedData} prefix="giamDoc" required />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>2</td>
                                <td>
                                    <p className={styles.sectionTitle}>
                                        Thông tin về Kế toán trưởng/Phụ trách kế toán (nếu có):
                                    </p>
                                    <PersonFields data={normalizedData} prefix="keToan" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>
        );
    },
);

export default GiayDeNghiDangKyThayDoiThongTinGiamDocDeclaration;
