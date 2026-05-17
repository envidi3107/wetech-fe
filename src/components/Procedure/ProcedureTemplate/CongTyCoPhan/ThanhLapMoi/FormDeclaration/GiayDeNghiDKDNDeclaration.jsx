import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
// Reusing styles from 1TV/2TV as they are identical
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import NganhNgheTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable";

import KinhGuiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/KinhGuiSection";
import ThongTinNguoiNopSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinNguoiNopSection";
import TinhTrangThanhLapSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/TinhTrangThanhLapSection";
import ThongTinChuyenDoiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinChuyenDoiSection";
import TenCongTySection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/TenCongTySection";
import DiaChiTruSoSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/DiaChiTruSoSection";
import VonDieuLeSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/VonDieuLeSection";
import NguonVonDieuLeSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/NguonVonDieuLeSection";
import NguoiDaiDienPhapLuatSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/NguoiDaiDienPhapLuatSection";
import ThongTinDangKyThueSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinDangKyThueSection";
import BaoHiemXaHoiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/BaoHiemXaHoiSection";
import ChuSoHuuHuongLoiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ChuSoHuuHuongLoiSection";
import ThongTinCoPhanSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/ThongTinCoPhanSection";
import CoDongNhaDauTuNuocNgoaiSection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/CoDongNhaDauTuNuocNgoaiSection";
import { CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

import { buildKinhGui } from "@/consts/provinceRoomMap";

const GiayDeNghiDKDNDeclaration = forwardRef(function GiayDeNghiDKDNDeclaration(
    { formId, dataJson, onSubmit, formRef },
    componentRef,
) {
    const [nganhNgheRows, setNganhNgheRows] = useState([]);
    const [kinhGuiValue, setKinhGuiValue] = useState("");

    // Sync state from dataJson
    useEffect(() => {
        if (dataJson) {
            setNganhNgheRows(dataJson.nganhNgheList || []);
            // Restore kinhGui from saved data if no province auto-fill yet
            setKinhGuiValue(dataJson.kinhGui || "");
        } else {
            setNganhNgheRows([]);
            setKinhGuiValue("");
        }
    }, [dataJson]);

    const handleProvinceNameChange = (provinceName) => {
        setKinhGuiValue(buildKinhGui(provinceName));
    };

    // Expose API
    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.nganhNgheList = nganhNgheRows;
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
            return data;
        },
        importData: (importedData) => {
            if (!importedData) return;
            setNganhNgheRows(importedData.nganhNgheList || []);
        },
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.nganhNgheList = nganhNgheRows;
        if (onSubmit) onSubmit(data);
    };

    const baoHiemNote = (
        <>
            Lưu ý:<br />
            - Doanh nghiệp đăng ký ngành, nghề kinh doanh chính là nông nghiệp, lâm nghiệp, ngư nghiệp, diêm nghiệp và trả lương theo sản phẩm, theo khoán: có thể lựa chọn 1 trong 3 phương thức đóng bảo hiểm xã hội: hàng tháng, 03 tháng một lần, 06 tháng một lần.<br />
            - Doanh nghiệp đăng ký ngành, nghề kinh doanh chính khác: đánh dấu vào phương thức đóng bảo hiểm xã hội hàng tháng.
        </>
    );

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson ? "loaded" : "empty"}>
            {/* NGƯỜI NỘP HỒ SƠ */}
            <div className={styles.sectionGroup}>
                <ThongTinNguoiNopSection dataJson={dataJson} styles={styles} isNote={true} />
            </div>

            <TinhTrangThanhLapSection dataJson={dataJson} styles={styles} isNote={true} />
            <ThongTinChuyenDoiSection dataJson={dataJson} styles={styles} />
            <TenCongTySection dataJson={dataJson} styles={styles} prefix={CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS} />

            {/* ĐỊA CHỈ TRỤ SỞ */}
            <DiaChiTruSoSection
                dataJson={dataJson}
                styles={styles}
                onProvinceNameChange={handleProvinceNameChange}
            />

            {/* KÍNH GỬI – tự động cập nhật theo tỉnh/thành phố trụ sở */}
            <KinhGuiSection dataJson={dataJson} styles={styles} autoKinhGui={kinhGuiValue} />

            <div className={styles.sectionGroup}>
                <NganhNgheTable rows={nganhNgheRows} onChangeRows={setNganhNgheRows} />
            </div>

            <div className={styles.sectionGroup}>
                <VonDieuLeSection dataJson={dataJson} styles={styles} />
            </div>

            <NguonVonDieuLeSection dataJson={dataJson} styles={styles} isNote={true} />

            <ThongTinCoPhanSection dataJson={dataJson} styles={styles} />

            <CoDongNhaDauTuNuocNgoaiSection dataJson={dataJson} styles={styles} />

            <NguoiDaiDienPhapLuatSection dataJson={dataJson} styles={styles} isNote={true} />
            <ThongTinDangKyThueSection dataJson={dataJson} styles={styles} isNote={true} />
            <BaoHiemXaHoiSection dataJson={dataJson} styles={styles} note={baoHiemNote} />
            <ChuSoHuuHuongLoiSection dataJson={dataJson} styles={styles} isNote={true} />
        </form>
    );
});

export default GiayDeNghiDKDNDeclaration;
