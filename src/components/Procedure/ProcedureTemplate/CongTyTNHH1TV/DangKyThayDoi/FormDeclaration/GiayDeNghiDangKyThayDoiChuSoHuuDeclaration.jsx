import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { buildKinhGui } from "@/consts/provinceRoomMap";
import KinhGuiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/KinhGuiSection";
import ThongTinDoanhNghiepSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDoanhNghiepSection";
import ThongTinChuSoHuuSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinChuSoHuuSection";
import ThongTinChuSoHuuToChucSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinChuSoHuuToChucSection";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

const EMPTY_REPRESENTATIVE = {
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    giayToPhapLy: "",
    quocTich: "",
    danToc: "",
    diaChiLienLac: "",
    vonDuocUyQuyen: "",
    tyLe: "",
    thoiDiemDaiDien: "",
    ghiChu: "",
};

const TOOLTIP = {
    giayToPhapLy:
        "Nếu kê khai số định danh cá nhân thì không phải kê khai quốc tịch, dân tộc.",
    vonDuocUyQuyen:
        "Tổng giá trị vốn được đại diện ghi bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài, nếu có.",
    tyLe: "Tỷ lệ phần vốn được ủy quyền đại diện trên tổng số vốn điều lệ của công ty.",
    chuKy:
        "Chữ ký chỉ thể hiện ở bản xác nhận/in hồ sơ; form khai báo không yêu cầu nhập cột chữ ký.",
};

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

function OwnerModelRadio({ dataJson }) {
    const currentValue = dataJson?.moHinhToChuc || "hoi_dong_thanh_vien";

    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>Mô hình tổ chức công ty:</h3>
            <label className={styles.radioLabel}>
                <input
                    type="radio"
                    name="moHinhToChuc"
                    value="hoi_dong_thanh_vien"
                    className={styles.radioInput}
                    defaultChecked={currentValue !== "chu_tich_cong_ty"}
                />
                Hội đồng thành viên, Giám đốc hoặc Tổng Giám đốc
            </label>
            <label className={styles.radioLabel}>
                <input
                    type="radio"
                    name="moHinhToChuc"
                    value="chu_tich_cong_ty"
                    className={styles.radioInput}
                    defaultChecked={currentValue === "chu_tich_cong_ty"}
                />
                Chủ tịch công ty, Giám đốc hoặc Tổng Giám đốc
            </label>
        </div>
    );
}

function RepresentativeTable({ rows, onChangeRows }) {
    const updateRow = (index, field, value) => {
        const nextRows = [...rows];
        nextRows[index] = { ...nextRows[index], [field]: value };
        onChangeRows(nextRows);
    };

    const addRow = () => onChangeRows([...rows, { ...EMPTY_REPRESENTATIVE }]);
    const removeRow = (index) => onChangeRows(rows.filter((_, rowIndex) => rowIndex !== index));

    const columns = [
        ["hoTen", "Họ tên"],
        ["ngaySinh", "dd/mm/yyyy"],
        ["gioiTinh", "Giới tính"],
        ["giayToPhapLy", "Số, ngày cấp, cơ quan cấp"],
        ["quocTich", "Quốc tịch"],
        ["danToc", "Dân tộc"],
        ["diaChiLienLac", "Địa chỉ liên lạc"],
        ["vonDuocUyQuyen", "VNĐ/ngoại tệ"],
        ["tyLe", "%"],
        ["thoiDiemDaiDien", "Thời điểm"],
        ["ghiChu", "Ghi chú"],
    ];

    return (
        <div className={styles.sectionGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                    Thông tin về người đại diện theo pháp luật/người đại diện theo ủy quyền của chủ sở hữu:
                </h3>
                <button type="button" onClick={addRow} className={styles.input} style={{ width: "auto" }}>
                    Thêm dòng
                </button>
            </div>
            <p className={styles.note}>
                Cột chữ ký chỉ hiển thị ở form xác nhận, không nhập tại bước khai báo.
            </p>
            <div style={{ overflowX: "auto" }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên người đại diện theo pháp luật/người đại diện theo ủy quyền</th>
                            <th>Ngày, tháng, năm sinh</th>
                            <th>Giới tính</th>
                            <th>
                                Số, ngày cấp, cơ quan cấp Giấy tờ pháp lý của cá nhân
                                <InfoTooltip content={TOOLTIP.giayToPhapLy} />
                            </th>
                            <th>Quốc tịch</th>
                            <th>Dân tộc</th>
                            <th>Địa chỉ liên lạc</th>
                            <th>
                                Vốn được ủy quyền
                                <InfoTooltip content={TOOLTIP.vonDuocUyQuyen} />
                            </th>
                            <th>
                                Tỷ lệ (%)
                                <InfoTooltip content={TOOLTIP.tyLe} />
                            </th>
                            <th>Thời điểm đại diện phần vốn</th>
                            <th>Ghi chú (nếu có)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={13} style={{ textAlign: "center" }}>
                                    Chưa có dòng nào.
                                </td>
                            </tr>
                        )}
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                {columns.map(([field, placeholder]) => (
                                    <td key={field}>
                                        <input
                                            type="text"
                                            className={styles.tableInput}
                                            value={row[field] || ""}
                                            placeholder={placeholder}
                                            onChange={(event) => updateRow(index, field, event.target.value)}
                                        />
                                    </td>
                                ))}
                                <td style={{ textAlign: "center" }}>
                                    <button type="button" onClick={() => removeRow(index)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const GiayDeNghiDangKyThayDoiChuSoHuuDeclaration = forwardRef(
    function GiayDeNghiDangKyThayDoiChuSoHuuDeclaration({ dataJson, onSubmit, formRef }, componentRef) {
        const { provinces } = useFetchAddress();
        const [normalizedData, setNormalizedData] = useState(() => normalizeDataJson(dataJson));
        const [formVersion, setFormVersion] = useState(0);
        const [kinhGuiProvince, setKinhGuiProvince] = useState("");
        const [kinhGuiValue, setKinhGuiValue] = useState("");
        const [anNinhQuocPhong, setAnNinhQuocPhong] = useState("Không");
        const [loaiChuSoHuu, setLoaiChuSoHuu] = useState("ca_nhan");
        const [representativeRows, setRepresentativeRows] = useState([]);

        useEffect(() => {
            const parsed = normalizeDataJson(dataJson);
            setNormalizedData(parsed);
            setAnNinhQuocPhong(parsed.anNinhQuocPhong || "Không");
            setLoaiChuSoHuu(parsed.loaiChuSoHuu || (parsed.chuSoHuuToChuc_ten ? "to_chuc" : "ca_nhan"));
            setRepresentativeRows(parsed.daiDienChuSoHuuList || []);
            setFormVersion((version) => version + 1);
        }, [dataJson]);

        useEffect(() => {
            const matchedProvince =
                normalizedData.kinhGuiProvince ||
                provinces.find(
                    (province) =>
                        buildKinhGui(province.name) === normalizedData.kinhGui ||
                        normalizedData.kinhGui?.trim().endsWith(province.name),
                )?.name ||
                "";

            setKinhGuiProvince(matchedProvince);
            setKinhGuiValue(matchedProvince ? buildKinhGui(matchedProvince) : normalizedData.kinhGui || "");
        }, [normalizedData, provinces]);

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

            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.kinhGui = kinhGuiValue;
            data.kinhGuiProvince = kinhGuiProvince;
            data.anNinhQuocPhong = anNinhQuocPhong;
            data.loaiChuSoHuu = loaiChuSoHuu;
            data.daiDienChuSoHuuList = loaiChuSoHuu === "to_chuc" ? representativeRows : [];
            return data;
        };

        useImperativeHandle(componentRef, () => ({
            getDraftData: collectData,
            getExportData: collectData,
            importData: (importedData) => {
                const parsed = normalizeDataJson(importedData);
                setNormalizedData(parsed);
                setAnNinhQuocPhong(parsed.anNinhQuocPhong || "Không");
                setLoaiChuSoHuu(parsed.loaiChuSoHuu || (parsed.chuSoHuuToChuc_ten ? "to_chuc" : "ca_nhan"));
                setRepresentativeRows(parsed.daiDienChuSoHuuList || []);
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

                <ThongTinDoanhNghiepSection dataJson={normalizedData} styles={styles} />

                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>
                        Doanh nghiệp có Giấy chứng nhận quyền sử dụng đất tại đảo, xã/phường biên giới, xã/phường ven
                        biển hoặc khu vực khác có ảnh hưởng đến quốc phòng, an ninh:
                    </h3>
                    <YesNoRadio
                        name="anNinhQuocPhong"
                        value={anNinhQuocPhong}
                        onChange={setAnNinhQuocPhong}
                    />
                </div>

                <div className={styles.sectionGroup}>
                    <h3 className={styles.sectionTitle}>
                        Đăng ký thay đổi chủ sở hữu công ty TNHH một thành viên với thông tin sau khi thay đổi:
                    </h3>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="loaiChuSoHuu"
                                value="ca_nhan"
                                className={styles.radioInput}
                                checked={loaiChuSoHuu === "ca_nhan"}
                                onChange={() => setLoaiChuSoHuu("ca_nhan")}
                            />
                            Chủ sở hữu là cá nhân
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="loaiChuSoHuu"
                                value="to_chuc"
                                className={styles.radioInput}
                                checked={loaiChuSoHuu === "to_chuc"}
                                onChange={() => setLoaiChuSoHuu("to_chuc")}
                            />
                            Chủ sở hữu là tổ chức
                        </label>
                    </div>
                </div>

                {loaiChuSoHuu === "ca_nhan" ? (
                    <ThongTinChuSoHuuSection dataJson={normalizedData} styles={styles} />
                ) : (
                    <>
                        <ThongTinChuSoHuuToChucSection dataJson={normalizedData} styles={styles} />
                        <OwnerModelRadio dataJson={normalizedData} />
                        <RepresentativeTable rows={representativeRows} onChangeRows={setRepresentativeRows} />
                    </>
                )}
            </form>
        );
    },
);

export default GiayDeNghiDangKyThayDoiChuSoHuuDeclaration;
