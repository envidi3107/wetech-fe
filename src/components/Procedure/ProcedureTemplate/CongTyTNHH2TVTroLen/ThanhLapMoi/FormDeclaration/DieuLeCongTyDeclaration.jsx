import React, { forwardRef, useState, useEffect, useImperativeHandle } from "react";
// Reuse styles from the Shared component
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import NganhNgheTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable";
import Signature from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/Signature/Signature";
import deleteIcon from "@/assets/delete-icon.png";

// Import Shared Sections
import TenCongTySection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/TenCongTySection";
import DiaChiTruSoSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/DiaChiTruSoSection";
import NguoiDaiDienPhapLuatSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/NguoiDaiDienPhapLuatSection";
import VonDieuLeSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/VonDieuLeSection";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import FormattedNumberInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormattedNumberInput/FormattedNumberInput";
import { TNHH_COMPANY_NAME_PREFIX_OPTIONS } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const EMPTY_MEMBER_ROW = {
    hoTen: "",
    phanVonGop: "",
    tyLe: "",
    loaiTaiSan: "",
    thoiHan: "",
    ghiChu: "",
};

// Các trường chia sẻ với Form 1 (GiayDeNghiDKDN) – luôn lấy từ Form 1
const FORM1_SHARED_KEYS = [
    "tenCongTyPrefix", "tenCongTyVN", "tenCongTyEN", "tenCongTyVietTat",
    "truSo_tinh", "truSo_xa", "truSo_soNha", "truSo_phone", "truSo_fax",
    "truSo_email", "truSo_website", "truSo_loaiKhu", "truSo_anNinhQuocPhong",
    "nguoiDaiDien_hoTen", "nguoiDaiDien_ngaySinh", "nguoiDaiDien_gioiTinh",
    "nguoiDaiDien_cccd", "nguoiDaiDien_chucDanh", "nguoiDaiDien_danToc",
    "nguoiDaiDien_quocTich", "nguoiDaiDien_soHoChieu", "nguoiDaiDien_ngayCapHoChieu",
    "nguoiDaiDien_noiCapHoChieu", "nguoiDaiDien_tinh", "nguoiDaiDien_xa",
    "nguoiDaiDien_soNha", "nguoiDaiDien_thuongTru_tinh", "nguoiDaiDien_thuongTru_xa",
    "nguoiDaiDien_thuongTru_soNha", "nguoiDaiDien_thuongTru_quocGia",
    "vonDieuLe", "vonDieuLe_bangChu", "vonDieuLe_ngoaiTeBangSo", "vonDieuLe_ngoaiTeDonVi",
    "hienThiNgoaiTe",
];

const DieuLeCongTyDeclaration = forwardRef(function DieuLeCongTyDeclaration(
    { formId, dataJson, onSubmit, formRef },
    componentRef,
) {
    const [nganhNgheRows, setNganhNgheRows] = useState([]);
    const [thanhVienRows, setThanhVienRows] = useState([]);

    // Lấy dữ liệu từ Form 1 và Form 3 để reuse
    const giayDeNghiData = useGetFormDataJsonFromName("Giấy đề nghị đăng ký doanh nghiệp");
    const thanhVienData = useGetFormDataJsonFromName("Danh sách thành viên");

    // Tạo mergedData: luôn ưu tiên Form 1 cho các trường chia sẻ
    const mergedData = {
        ...dataJson,
        ...(giayDeNghiData
            ? Object.fromEntries(FORM1_SHARED_KEYS.map((k) => [k, giayDeNghiData[k]]))
            : {}),
    };

    // Ngành nghề: luôn lấy từ Form 1
    useEffect(() => {
        if (giayDeNghiData?.nganhNgheList?.length) {
            setNganhNgheRows(giayDeNghiData.nganhNgheList);
        } else if (dataJson?.nganhNgheList?.length) {
            setNganhNgheRows(dataJson.nganhNgheList);
        } else {
            setNganhNgheRows([]);
        }
    }, [giayDeNghiData, dataJson]);

    // Thành viên: luôn lấy từ Form 3
    useEffect(() => {
        if (thanhVienData?.thanhVienList?.length) {
            setThanhVienRows(thanhVienData.thanhVienList);
        } else if (dataJson?.thanhVienList?.length) {
            setThanhVienRows(dataJson.thanhVienList);
        } else {
            setThanhVienRows([]);
        }
    }, [thanhVienData, dataJson]);

    // Expose API
    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.nganhNgheList = nganhNgheRows;
            data.thanhVienList = thanhVienRows;
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
            return data;
        },
        importData: (importedData) => {
            if (!importedData) return;
            setNganhNgheRows(importedData.nganhNgheList || []);
            setThanhVienRows(importedData.thanhVienList || []);
        },
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.nganhNgheList = nganhNgheRows;
        data.thanhVienList = thanhVienRows;
        if (onSubmit) onSubmit(data);
    };

    const handleAddMember = () => {
        setThanhVienRows([...thanhVienRows, { ...EMPTY_MEMBER_ROW }]);
    };

    const handleDeleteMember = (idx) => {
        setThanhVienRows(thanhVienRows.filter((_, i) => i !== idx));
    };

    const handleMemberRowChange = (idx, e) => {
        const { name, value } = e.target;
        const newRows = [...thanhVienRows];
        newRows[idx] = { ...newRows[idx], [name]: value };
        setThanhVienRows(newRows);
    };

    // Key form: re-render khi cả Form 1 và Form 3 load xong
    const formKey = `${giayDeNghiData ? "dn-loaded" : "dn-loading"}-${thanhVienData ? "tv-loaded" : "tv-loading"}`;

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={formKey}>
            {/* 1. TÊN CÔNG TY – lấy từ Form 1 */}
            <TenCongTySection dataJson={mergedData} styles={styles} prefix={TNHH_COMPANY_NAME_PREFIX_OPTIONS} />

            {/* 2. ĐỊA CHỈ TRỤ SỞ – lấy từ Form 1 */}
            <DiaChiTruSoSection dataJson={mergedData} styles={styles} />

            {/* 3. NGÀNH NGHỀ KINH DOANH – lấy từ Form 1 */}
            <div className={styles.sectionGroup}>
                <NganhNgheTable rows={nganhNgheRows} onChangeRows={setNganhNgheRows} />
            </div>

            {/* 4. NGƯỜI ĐẠI DIỆN PHÁP LUẬT – lấy từ Form 1 */}
            <NguoiDaiDienPhapLuatSection dataJson={mergedData} styles={styles} />

            {/* 5. VỐN ĐIỀU LỆ – lấy từ Form 1 */}
            <VonDieuLeSection dataJson={mergedData} styles={styles} />

            {/* 6. PHẦN GÓP VỐN CỦA CÁC THÀNH VIÊN – lấy từ Form 3 */}
            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>
                    Phần vốn góp, giá trị phần vốn góp của các thành viên, thời hạn góp vốn:
                </h3>

                <div style={{ marginBottom: "10px" }}>
                    <button type="button" className={styles.btnPrimary} style={{ padding: "6px 16px", background: "#1b154b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={handleAddMember}>
                        Thêm dòng
                    </button>
                </div>

                <div className={styles.tableWrapper} style={{ overflowX: "auto" }}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 50 }}>Stt</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 200 }}>Tên thành viên</th>
                                <th colSpan={3} className={styles.th}>Vốn góp</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 150 }}>Thời hạn góp vốn</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 150 }}>Ghi chú</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 80 }}>Thao tác</th>
                            </tr>
                            <tr>
                                <th className={styles.th} style={{ minWidth: 320 }}>
                                    Phần vốn góp (bằng số; VNĐ và giá trị tương đương theo đơn vị tiền nước ngoài: bằng số, loại ngoại tệ, nếu có)
                                </th>
                                <th className={styles.th} style={{ minWidth: 80 }}>Tỷ lệ (%)</th>
                                <th className={styles.th} style={{ minWidth: 180 }}>Loại tài sản, số lượng, giá trị tài sản góp vốn</th>
                            </tr>
                            <tr className={styles.colNumberRow}>
                                <td className={styles.colNumber}>1</td>
                                <td className={styles.colNumber}></td>
                                <td className={styles.colNumber}></td>
                                <td className={styles.colNumber}></td>
                                <td className={styles.colNumber}></td>
                                <td className={styles.colNumber}></td>
                                <td className={styles.colNumber}></td>
                                <td className={styles.colNumber}></td>
                            </tr>
                        </thead>
                        <tbody>
                            {thanhVienRows.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className={styles.td} style={{ textAlign: "center", padding: "20px" }}>
                                        Chưa có thông tin thành viên. Dữ liệu sẽ được tự động lấy từ "Danh sách thành viên".
                                    </td>
                                </tr>
                            ) : (
                                thanhVienRows.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className={styles.td} style={{ textAlign: "center" }}>{idx + 1}</td>
                                        <td className={styles.td}>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                name="hoTen"
                                                value={row.hoTen}
                                                onChange={(e) => handleMemberRowChange(idx, e)}
                                            />
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <FormattedNumberInput
                                                        className={styles.input}
                                                        name="phanVonGop"
                                                        value={row.phanVonGop || ""}
                                                        onChange={(e) => handleMemberRowChange(idx, e)}
                                                        placeholder="0"
                                                        style={{ textAlign: 'right', paddingRight: '46px', width: '100%' }}
                                                    />
                                                    <span style={{ position: 'absolute', right: '12px', color: '#444', fontSize: '14px', pointerEvents: 'none', fontWeight: 500 }}>VNĐ</span>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#555', textAlign: 'left', marginTop: '4px' }}>
                                                    Giá trị tương đương theo đơn vị tiền nước ngoài (nếu có; bằng số, loại ngoại tệ):
                                                </div>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <FormattedNumberInput
                                                        className={styles.input}
                                                        name="phanVonGopNgoaiTe_GiaTri"
                                                        value={row.phanVonGopNgoaiTe_GiaTri || ""}
                                                        onChange={(e) => handleMemberRowChange(idx, e)}
                                                        placeholder="Tiền bằng số"
                                                        style={{ width: '65%' }}
                                                    />
                                                    <input
                                                        className={styles.input}
                                                        name="phanVonGopNgoaiTe_Loai"
                                                        value={row.phanVonGopNgoaiTe_Loai || ""}
                                                        onChange={(e) => handleMemberRowChange(idx, e)}
                                                        placeholder="Loại ngoại tệ"
                                                        style={{ width: '35%' }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                name="tyLe"
                                                value={row.tyLe}
                                                onChange={(e) => handleMemberRowChange(idx, e)}
                                            />
                                        </td>
                                        <td className={styles.td}>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                name="loaiTaiSan"
                                                value={row.loaiTaiSan}
                                                onChange={(e) => handleMemberRowChange(idx, e)}
                                            />
                                        </td>
                                        <td className={styles.td}>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                name="thoiHan"
                                                value={row.thoiHan}
                                                onChange={(e) => handleMemberRowChange(idx, e)}
                                            />
                                        </td>
                                        <td className={styles.td}>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                name="ghiChu"
                                                value={row.ghiChu}
                                                onChange={(e) => handleMemberRowChange(idx, e)}
                                            />
                                        </td>
                                        <td className={styles.td} style={{ textAlign: "center" }}>
                                            <img
                                                src={deleteIcon}
                                                alt="Xóa"
                                                onClick={() => handleDeleteMember(idx)}
                                                width="18"
                                                height="18"
                                                style={{ cursor: "pointer", display: "inline-block" }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    );
});

export default DieuLeCongTyDeclaration;
