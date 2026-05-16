import React, { useState, useEffect } from "react";
import DateInput from "@/components/DateInput/DateInput";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

const LY_DO_OPTIONS = [
    "Quyết định của Đại hội đồng cổ đông",
    "Quyết định của Hội đồng thành viên",
    "Quyết định của Chủ sở hữu công ty",
    "Thành viên không thực hiện cam kết góp vốn",
    "Tiếp nhận thành viên mới/cổ đông mới"
];

export default function ThongTinChuyenDoiSection({ dataJson, styles }) {
    const [lyDoSelect, setLyDoSelect] = useState(() => {
        const val = dataJson?.lyDoChuyenDoi || "";
        if (!val) return "";
        if (LY_DO_OPTIONS.includes(val)) return val;
        return "khác";
    });

    useEffect(() => {
        const val = dataJson?.lyDoChuyenDoi || "";
        if (!val) setLyDoSelect("");
        else if (LY_DO_OPTIONS.includes(val)) setLyDoSelect(val);
        else setLyDoSelect("khác");
    }, [dataJson?.lyDoChuyenDoi]);
    return (
        <div className={styles.sectionGroup}>
            <div className={styles.formGroup} style={{ marginTop: "16px" }}>
                <label className={styles.label}>- Lý do chuyển đổi loại hình doanh nghiệp:</label>
                <select
                    className={styles.input}
                    value={lyDoSelect}
                    onChange={(e) => setLyDoSelect(e.target.value)}
                    name={lyDoSelect !== "khác" ? "lyDoChuyenDoi" : undefined}
                >
                    <option value="">-- Chọn lý do --</option>
                    {LY_DO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    <option value="khác">Khác</option>
                </select>
                {lyDoSelect === "khác" && (
                    <input
                        type="text"
                        className={styles.input}
                        name="lyDoChuyenDoi"
                        defaultValue={(!LY_DO_OPTIONS.includes(dataJson?.lyDoChuyenDoi) && dataJson?.lyDoChuyenDoi) ? dataJson.lyDoChuyenDoi : ""}
                        placeholder="Nhập lý do chuyển đổi..."
                        style={{ marginTop: "8px" }}
                    />
                )}
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: "16px", textTransform: "none", fontSize: "14px", fontWeight: "bold" }}>
                - Thông tin về các doanh nghiệp bị chia, bị tách, bị hợp nhất, được chuyển đổi <span style={{ fontStyle: "italic", fontWeight: "normal" }}>(phải kê khai trong trường hợp thành lập công ty trên cơ sở chia, tách, hợp nhất, chuyển đổi loại hình doanh nghiệp)</span>:
            </h3>
            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tên doanh nghiệp (ghi bằng chữ in hoa):</label>
                    <input type="text" className={styles.input} name="dnChuyenDoi_ten" defaultValue={toUppercaseValue(dataJson?.dnChuyenDoi_ten)} style={{ textTransform: "uppercase" }} onInput={handleUppercaseInput} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Mã số doanh nghiệp/Mã số thuế:</label>
                    <input type="text" className={styles.input} name="dnChuyenDoi_maSo" defaultValue={dataJson?.dnChuyenDoi_maSo || ""} />
                </div>
            </div>
            <p style={{ marginTop: "8px", fontSize: "14px", lineHeight: "1.5" }}>
                Đề nghị Quý Cơ quan thực hiện chấm dứt tồn tại đối với doanh nghiệp bị chia, bị hợp nhất và các chi nhánh/văn phòng đại diện/địa điểm kinh doanh của doanh nghiệp bị chia, bị hợp nhất.
            </p>

            <h3 className={styles.sectionTitle} style={{ marginTop: "16px", textTransform: "none", fontSize: "14px", fontWeight: "bold" }}>
                - Thông tin về hộ kinh doanh được chuyển đổi <span style={{ fontStyle: "italic", fontWeight: "normal" }}>(phải kê khai trong trường hợp thành lập công ty trên cơ sở chuyển đổi từ hộ kinh doanh)</span>:
            </h3>
            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tên hộ kinh doanh (ghi bằng chữ in hoa):</label>
                    <input type="text" className={styles.input} name="hkdChuyenDoi_ten" defaultValue={toUppercaseValue(dataJson?.hkdChuyenDoi_ten)} style={{ textTransform: "uppercase" }} onInput={handleUppercaseInput} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Số Giấy chứng nhận đăng ký hộ kinh doanh (nếu có):</label>
                    <input type="text" className={styles.input} name="hkdChuyenDoi_soGiayChungNhan" defaultValue={dataJson?.hkdChuyenDoi_soGiayChungNhan || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày cấp:</label>
                    <DateInput name="hkdChuyenDoi_ngayCap" className={styles.input} defaultValue={dataJson?.hkdChuyenDoi_ngayCap || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nơi cấp:</label>
                    <input type="text" className={styles.input} name="hkdChuyenDoi_noiCap" defaultValue={dataJson?.hkdChuyenDoi_noiCap || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Mã số thuế của hộ kinh doanh:</label>
                    <input type="text" className={styles.input} name="hkdChuyenDoi_maSoThue" defaultValue={dataJson?.hkdChuyenDoi_maSoThue || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Địa chỉ trụ sở hộ kinh doanh:</label>
                    <input type="text" className={styles.input} name="hkdChuyenDoi_diaChi" defaultValue={dataJson?.hkdChuyenDoi_diaChi || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tên chủ hộ kinh doanh:</label>
                    <input type="text" className={styles.input} name="hkdChuyenDoi_tenChuHo" defaultValue={dataJson?.hkdChuyenDoi_tenChuHo || ""} />
                </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: "8px" }}>
                <label className={styles.label}>Loại giấy tờ pháp lý của cá nhân (kê khai theo giấy tờ pháp lý của cá nhân được ghi trên Giấy chứng nhận đăng ký thuế của hộ kinh doanh):</label>
                <div className={styles.radioGroup} style={{ flexWrap: "wrap", gap: "16px", marginTop: "4px" }}>
                    {[
                        { label: "Chứng minh nhân dân", value: "cmnd" },
                        { label: "Căn cước công dân", value: "cccd" },
                        { label: "Hộ chiếu", value: "ho_chieu" }
                    ].map(option => (
                        <label className={styles.radioLabel} key={option.value} style={{ fontSize: "14px" }}>
                            <input type="radio" name="hkdChuyenDoi_loaiGiayTo" value={option.value} defaultChecked={dataJson?.hkdChuyenDoi_loaiGiayTo === option.value} className={styles.radioInput} /> {option.label}
                        </label>
                    ))}
                    <label className={styles.radioLabel} style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <input type="radio" name="hkdChuyenDoi_loaiGiayTo" value="khac" defaultChecked={dataJson?.hkdChuyenDoi_loaiGiayTo === "khac"} className={styles.radioInput} />
                        Loại khác (ghi rõ):
                        <input type="text" className={styles.input} name="hkdChuyenDoi_loaiGiayToKhac" defaultValue={dataJson?.hkdChuyenDoi_loaiGiayToKhac || ""} style={{ minHeight: "28px", padding: "4px 8px", width: "150px" }} />
                    </label>
                </div>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Số giấy tờ pháp lý của cá nhân (kê khai theo giấy tờ pháp lý của cá nhân được ghi trên Giấy chứng nhận đăng ký thuế của hộ kinh doanh):</label>
                <input type="text" className={styles.input} name="hkdChuyenDoi_soGiayTo" defaultValue={dataJson?.hkdChuyenDoi_soGiayTo || ""} />
            </div>
            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày cấp:</label>
                    <DateInput name="hkdChuyenDoi_ngayCapGiayTo" className={styles.input} defaultValue={dataJson?.hkdChuyenDoi_ngayCapGiayTo || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nơi cấp:</label>
                    <input type="text" className={styles.input} name="hkdChuyenDoi_noiCapGiayTo" defaultValue={dataJson?.hkdChuyenDoi_noiCapGiayTo || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày hết hạn (nếu có):</label>
                    <DateInput name="hkdChuyenDoi_ngayHetHanGiayTo" className={styles.input} defaultValue={dataJson?.hkdChuyenDoi_ngayHetHanGiayTo || ""} />
                </div>
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: "16px", textTransform: "none", fontSize: "14px", fontWeight: "bold" }}>
                - Thông tin về cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện được chuyển đổi <span style={{ fontStyle: "italic", fontWeight: "normal" }}>(phải kê khai trong trường hợp thành lập doanh nghiệp xã hội trên cơ sở chuyển đổi từ cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện)</span>:
            </h3>
            <div className={styles.formGroup}>
                <label className={styles.label}>Tên cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện (ghi bằng chữ in hoa):</label>
                <input type="text" className={styles.input} name="csqChuyenDoi_ten" defaultValue={toUppercaseValue(dataJson?.csqChuyenDoi_ten)} style={{ textTransform: "uppercase" }} onInput={handleUppercaseInput} />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Số Giấy chứng nhận đăng ký thành lập (Đối với cơ sở bảo trợ xã hội)/Số Giấy phép thành lập và công nhận điều lệ quỹ (Đối với quỹ xã hội/quỹ từ thiện):</label>
                <input type="text" className={styles.input} name="csqChuyenDoi_soGiayChungNhan" defaultValue={dataJson?.csqChuyenDoi_soGiayChungNhan || ""} />
            </div>
            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày cấp:</label>
                    <DateInput name="csqChuyenDoi_ngayCap" className={styles.input} defaultValue={dataJson?.csqChuyenDoi_ngayCap || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nơi cấp:</label>
                    <input type="text" className={styles.input} name="csqChuyenDoi_noiCap" defaultValue={dataJson?.csqChuyenDoi_noiCap || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Mã số thuế của cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện (chỉ kê khai mã số thuế 10 số):</label>
                    <input type="text" className={styles.input} name="csqChuyenDoi_maSoThue" defaultValue={dataJson?.csqChuyenDoi_maSoThue || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Địa chỉ trụ sở chính:</label>
                    <input type="text" className={styles.input} name="csqChuyenDoi_diaChi" defaultValue={dataJson?.csqChuyenDoi_diaChi || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tên người đại diện cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện:</label>
                    <input type="text" className={styles.input} name="csqChuyenDoi_tenNguoiDaiDien" defaultValue={dataJson?.csqChuyenDoi_tenNguoiDaiDien || ""} />
                </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: "8px" }}>
                <label className={styles.label}>Loại giấy tờ pháp lý của cá nhân (kê khai theo giấy tờ pháp lý của cá nhân được ghi trên Giấy chứng nhận đăng ký thuế của cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện):</label>
                <div className={styles.radioGroup} style={{ flexWrap: "wrap", gap: "16px", marginTop: "4px" }}>
                    {[
                        { label: "Chứng minh nhân dân", value: "cmnd" },
                        { label: "Căn cước công dân", value: "cccd" },
                        { label: "Hộ chiếu", value: "ho_chieu" }
                    ].map(option => (
                        <label className={styles.radioLabel} key={option.value} style={{ fontSize: "14px" }}>
                            <input type="radio" name="csqChuyenDoi_loaiGiayTo" value={option.value} defaultChecked={dataJson?.csqChuyenDoi_loaiGiayTo === option.value} className={styles.radioInput} /> {option.label}
                        </label>
                    ))}
                    <label className={styles.radioLabel} style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <input type="radio" name="csqChuyenDoi_loaiGiayTo" value="khac" defaultChecked={dataJson?.csqChuyenDoi_loaiGiayTo === "khac"} className={styles.radioInput} />
                        Loại khác (ghi rõ):
                        <input type="text" className={styles.input} name="csqChuyenDoi_loaiGiayToKhac" defaultValue={dataJson?.csqChuyenDoi_loaiGiayToKhac || ""} style={{ minHeight: "28px", padding: "4px 8px", width: "150px" }} />
                    </label>
                </div>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Số giấy tờ pháp lý của cá nhân (kê khai theo giấy tờ pháp lý của cá nhân được ghi trên Giấy chứng nhận đăng ký thuế của cơ sở bảo trợ xã hội/quỹ xã hội/quỹ từ thiện):</label>
                <input type="text" className={styles.input} name="csqChuyenDoi_soGiayTo" defaultValue={dataJson?.csqChuyenDoi_soGiayTo || ""} />
            </div>
            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày cấp:</label>
                    <DateInput name="csqChuyenDoi_ngayCapGiayTo" className={styles.input} defaultValue={dataJson?.csqChuyenDoi_ngayCapGiayTo || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nơi cấp:</label>
                    <input type="text" className={styles.input} name="csqChuyenDoi_noiCapGiayTo" defaultValue={dataJson?.csqChuyenDoi_noiCapGiayTo || ""} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày hết hạn (nếu có):</label>
                    <DateInput name="csqChuyenDoi_ngayHetHanGiayTo" className={styles.input} defaultValue={dataJson?.csqChuyenDoi_ngayHetHanGiayTo || ""} />
                </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: "16px" }}>
                <label className={styles.radioLabel} style={{ fontSize: "14px", fontWeight: "bold", alignItems: "center", marginBottom: "8px" }}>
                    <input type="checkbox" name="duAnDauTuDacBiet" value="co" defaultChecked={dataJson?.duAnDauTuDacBiet === "co"} className={styles.radioInput} />
                    Doanh nghiệp thực hiện dự án đầu tư được đăng ký đầu tư theo thủ tục đầu tư đặc biệt
                </label>
                <label className={styles.radioLabel} style={{ fontSize: "14px", fontWeight: "bold", alignItems: "center", marginBottom: "8px" }}>
                    <input type="checkbox" name="doanhNghiepXaHoi" value="co" defaultChecked={dataJson?.doanhNghiepXaHoi === "co"} className={styles.radioInput} />
                    <span style={{ fontWeight: "normal" }}>
                        <strong>Doanh nghiệp xã hội</strong> <span style={{ fontStyle: "italic" }}>(Đánh dấu X vào ô vuông nếu là doanh nghiệp xã hội và kèm theo hồ sơ phải có Cam kết thực hiện mục tiêu xã hội, môi trường)</span>
                    </span>
                </label>
                <label className={styles.radioLabel} style={{ fontSize: "14px", fontWeight: "bold", alignItems: "center", marginBottom: "8px" }}>
                    <input type="checkbox" name="congTyChungKhoan" value="co" defaultChecked={dataJson?.congTyChungKhoan === "co"} className={styles.radioInput} />
                    <span style={{ fontWeight: "normal" }}>
                        <strong>Công ty chứng khoán/Công ty quản lý quỹ đầu tư chứng khoán/Công ty đầu tư chứng khoán:</strong> <span style={{ fontStyle: "italic" }}>(Đánh dấu X nếu là Công ty chứng khoán/Công ty quản lý quỹ đầu tư chứng khoán/Công ty đầu tư chứng khoán và kê khai thêm các thông tin sau đây)</span>
                    </span>
                </label>
                <div style={{ marginLeft: "24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--secondary-content)" }}>
                    Giấy phép thành lập và hoạt động số:
                    <input type="text" className={styles.input} name="congTyChungKhoan_soGiayPhep" defaultValue={dataJson?.congTyChungKhoan_soGiayPhep || ""} style={{ width: "150px", padding: "4px" }} />
                    do Uỷ ban Chứng khoán Nhà nước cấp ngày:
                    <div style={{ width: "150px" }}>
                        <DateInput name="congTyChungKhoan_ngayCap" className={styles.input} defaultValue={dataJson?.congTyChungKhoan_ngayCap || ""} />
                    </div>
                    (nếu có)
                </div>
            </div>
        </div>
    );
}
