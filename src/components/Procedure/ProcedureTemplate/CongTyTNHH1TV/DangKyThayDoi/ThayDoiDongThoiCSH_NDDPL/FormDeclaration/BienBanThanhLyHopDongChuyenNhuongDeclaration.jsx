import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import { buildLiquidationPrefillData } from "../chuyenNhuong.utils";
import { AmountWithWordsField, Field, PartySection, TextAreaField } from "./ChuyenNhuongDeclarationFields";

const BienBanThanhLyHopDongChuyenNhuongDeclaration = forwardRef(function BienBanThanhLyHopDongChuyenNhuongDeclaration(
    { dataJson, onSubmit, formRef },
    componentRef,
) {
    const internalFormRef = useRef(null);
    const resolvedFormRef = formRef || internalFormRef;
    const [normalizedData, setNormalizedData] = useState(() => buildLiquidationPrefillData(dataJson));
    const [formVersion, setFormVersion] = useState(0);

    useEffect(() => {
        setNormalizedData(buildLiquidationPrefillData(dataJson));
        setFormVersion((version) => version + 1);
    }, [dataJson]);

    const collectData = () => {
        if (!resolvedFormRef.current) return null;
        if (!resolvedFormRef.current.checkValidity()) {
            resolvedFormRef.current.reportValidity();
            return null;
        }

        return {
            ...normalizedData,
            ...Object.fromEntries(new FormData(resolvedFormRef.current).entries()),
        };
    };

    useImperativeHandle(componentRef, () => ({
        getDraftData: collectData,
        getExportData: collectData,
        importData: (importedData) => {
            setNormalizedData(buildLiquidationPrefillData(importedData));
            setFormVersion((version) => version + 1);
        },
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = collectData();
        if (data && onSubmit) onSubmit(data);
    };

    return (
        <form ref={resolvedFormRef} key={formVersion} onSubmit={handleSubmit}>
            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Thông tin biên bản thanh lý</h3>
                <div className={styles.grid2}>
                    <Field label="Số biên bản" name="thanhLy_so" data={normalizedData} styles={styles} />
                    <Field
                        label="Ngày lập biên bản"
                        name="thanhLy_ngay"
                        data={normalizedData}
                        styles={styles}
                        type="date"
                    />
                    <Field label="Thời gian lập (giờ)" name="thanhLy_gio" data={normalizedData} styles={styles} />
                    <Field label="Địa điểm lập" name="thanhLy_diaDiem" data={normalizedData} styles={styles} />
                    <Field label="Tên doanh nghiệp" name="tenDoanhNghiep" data={normalizedData} styles={styles} />
                </div>
                <TextAreaField
                    label="Địa chỉ trụ sở công ty"
                    name="hopDong_diaChiCongTy"
                    data={normalizedData}
                    styles={styles}
                />
            </div>

            <PartySection title="Bên A - Bên chuyển nhượng" prefix="benA" data={normalizedData} styles={styles} />
            <PartySection title="Bên B - Bên nhận chuyển nhượng" prefix="benB" data={normalizedData} styles={styles} />

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Thông tin thanh lý hợp đồng</h3>
                <div className={styles.grid2}>
                    <Field
                        label="Số hợp đồng chuyển nhượng"
                        name="thanhLy_hopDongSo"
                        data={normalizedData}
                        styles={styles}
                    />
                    <Field
                        label="Ngày ký hợp đồng chuyển nhượng"
                        name="thanhLy_hopDongNgay"
                        data={normalizedData}
                        styles={styles}
                        type="date"
                    />
                    <AmountWithWordsField
                        amountLabel="Số tiền đã thanh toán (đồng)"
                        amountName="thanhLy_soTien"
                        wordsLabel="Số tiền bằng chữ"
                        wordsName="thanhLy_soTienBangChu"
                        data={normalizedData}
                        styles={styles}
                    />
                    <Field
                        label="Tỷ lệ vốn điều lệ chuyển nhượng (%)"
                        name="thanhLy_tyLe"
                        data={normalizedData}
                        styles={styles}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                    />
                    <Field
                        label="Ngày hoàn thành hợp đồng"
                        name="thanhLy_ngayHoanThanh"
                        data={normalizedData}
                        styles={styles}
                        type="date"
                    />
                </div>
            </div>
        </form>
    );
});

export default BienBanThanhLyHopDongChuyenNhuongDeclaration;
