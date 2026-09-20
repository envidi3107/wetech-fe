import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import DateInput from "@/components/DateInput/DateInput";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { buildKinhGui } from "@/consts/provinceRoomMap";
import { GioiTinhSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import KinhGuiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/KinhGuiSection";
import ThongTinDoanhNghiepSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDoanhNghiepSection";
import UserCardDropdown from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/UserCardDropdown/UserCardDropdown";
import {
    A_CHANGE_OPTIONS,
    isTruthy,
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

function YesNoRadio({ name, value, onChange }) {
    return (
        <div className={styles.radioGroup}>
            {["Có", "Không"].map((option) => (
                <label key={option} className={styles.radioLabel}>
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        className={styles.radioInput}
                        checked={value === option}
                        onChange={() => onChange(option)}
                    />
                    {option}
                </label>
            ))}
        </div>
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
        const [coSoThayDoi, setCoSoThayDoi] = useState(
            () => normalizeDataJson(dataJson).coSoThayDoi || "",
        );
        const [anNinhQuocPhong, setAnNinhQuocPhong] = useState(
            () => normalizeDataJson(dataJson).anNinhQuocPhong || "Không",
        );

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
            setCoSoThayDoi(parsed.coSoThayDoi || "");
            setAnNinhQuocPhong(parsed.anNinhQuocPhong || "Không");
            setFormVersion((version) => version + 1);
        }, [dataJson, provinces]);

        const handleKinhGuiProvinceChange = (provinceName) => {
            setKinhGuiProvince(provinceName);
            setKinhGuiValue(provinceName ? buildKinhGui(provinceName) : "");
        };

        // Đổ dữ liệu từ "Lịch sử khai báo thông tin cá nhân" vào nhóm trường tương ứng.
        // Các input trong PersonFields là uncontrolled (defaultValue) nên phải gom giá trị
        // đang gõ dở trong form lại rồi bump formVersion để remount - nếu không, những ô
        // người dùng vừa nhập ở phần khác sẽ bị xoá khi form dựng lại.
        const handleFillCard = (prefix) => (card) => {
            const currentValues = formRef?.current
                ? Object.fromEntries(new FormData(formRef.current).entries())
                : {};

            setNormalizedData((prev) => ({
                ...prev,
                ...currentValues,
                [`${prefix}_hoTen`]: toUppercaseValue(card.fullName) || "",
                [`${prefix}_ngaySinh`]: card.dob || "",
                [`${prefix}_gioiTinh`]: card.gender || "",
                [`${prefix}_cccd`]: card.cccd || "",
                [`${prefix}_phone`]: card.phone || "",
            }));
            setFormVersion((version) => version + 1);
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
            data.coSoThayDoi = coSoThayDoi;
            data.anNinhQuocPhong = anNinhQuocPhong;
            if (coSoThayDoi !== "sap_nhap") {
                data.sapNhap_tenDoanhNghiep = "";
                data.sapNhap_maSoDoanhNghiep = "";
            }
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
                const parsed = normalizeDataJson(importedData);
                setNormalizedData(parsed);
                setCoSoThayDoi(parsed.coSoThayDoi || "");
                setAnNinhQuocPhong(parsed.anNinhQuocPhong || "Không");
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
                    <h3 className={styles.sectionTitle}>Doanh nghiệp đăng ký thay đổi trên cơ sở:</h3>
                    <p className={styles.note}>
                        (Chỉ kê khai trong trường hợp doanh nghiệp đăng ký thay đổi trên cơ sở tách doanh nghiệp hoặc
                        sáp nhập doanh nghiệp, đánh dấu X vào ô thích hợp)
                    </p>
                    <div className={styles.radioGroup} style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
                        {[
                            ["tach", "Đăng ký thay đổi trên cơ sở tách doanh nghiệp"],
                            ["sap_nhap", "Đăng ký thay đổi trên cơ sở sáp nhập doanh nghiệp"],
                        ].map(([value, label]) => (
                            <label key={value} className={styles.radioLabel}>
                                <input
                                    type="checkbox"
                                    value={value}
                                    className={styles.radioInput}
                                    checked={coSoThayDoi === value}
                                    onChange={(event) => setCoSoThayDoi(event.target.checked ? value : "")}
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    {coSoThayDoi === "sap_nhap" && (
                        <div>
                            <h3 className={styles.sectionTitle}>
                                Thông tin về doanh nghiệp bị sáp nhập (chỉ kê khai trong trường hợp doanh nghiệp đăng ký
                                thay đổi trên cơ sở sáp nhập doanh nghiệp):
                            </h3>
                            <div className={styles.grid2}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tên doanh nghiệp (ghi bằng chữ in hoa)</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name="sapNhap_tenDoanhNghiep"
                                        defaultValue={toUppercaseValue(normalizedData.sapNhap_tenDoanhNghiep)}
                                        style={{ textTransform: "uppercase" }}
                                        onInput={handleUppercaseInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Mã số doanh nghiệp/Mã số thuế</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name="sapNhap_maSoDoanhNghiep"
                                        defaultValue={normalizedData.sapNhap_maSoDoanhNghiep || ""}
                                    />
                                </div>
                            </div>
                            <p className={styles.note}>
                                Đề nghị Quý Cơ quan thực hiện chấm dứt tồn tại đối với doanh nghiệp bị sáp nhập và các
                                chi nhánh/văn phòng đại diện/địa điểm kinh doanh của doanh nghiệp bị sáp nhập.
                            </p>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo và xã, phường biên giới; xã,
                            phường ven biển; khu vực khác có ảnh hưởng đến quốc phòng, an ninh:
                        </label>
                        <YesNoRadio
                            name="anNinhQuocPhong"
                            value={anNinhQuocPhong}
                            onChange={setAnNinhQuocPhong}
                        />
                    </div>
                </div>

                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>A. ĐĂNG KÝ THAY ĐỔI NỘI DUNG ĐĂNG KÝ DOANH NGHIỆP</h3>
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
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                        <p className={styles.sectionTitle} style={{ margin: 0 }}>
                                            Thông tin về Giám đốc/Tổng giám đốc sau khi thay đổi:
                                        </p>
                                        <UserCardDropdown onSelect={handleFillCard("giamDoc")} />
                                    </div>
                                    <PersonFields data={normalizedData} prefix="giamDoc" required />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>2</td>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                        <p className={styles.sectionTitle} style={{ margin: 0 }}>
                                            Thông tin về Kế toán trưởng/Phụ trách kế toán (nếu có):
                                        </p>
                                        <UserCardDropdown onSelect={handleFillCard("keToan")} />
                                    </div>
                                    <PersonFields data={normalizedData} prefix="keToan" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.sectionGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="checkbox"
                            name="deNghiCapGiayXacNhan"
                            value="true"
                            className={styles.radioInput}
                            defaultChecked={isTruthy(normalizedData.deNghiCapGiayXacNhan)}
                        />
                        Đề nghị cấp Giấy xác nhận thay đổi nội dung đăng ký doanh nghiệp cho các thông tin thay đổi
                        nêu trên.
                    </label>
                </div>
            </form>
        );
    },
);

export default GiayDeNghiDangKyThayDoiThongTinGiamDocDeclaration;
