import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import { buildContractPrefillData } from "../chuyenNhuong.utils";
import { AmountWithWordsField, Field, PartySection, TextAreaField } from "./ChuyenNhuongDeclarationFields";

const HopDongChuyenNhuongVonGopDeclaration = forwardRef(function HopDongChuyenNhuongVonGopDeclaration(
    { dataJson, onSubmit, formRef },
    componentRef,
) {
    const internalFormRef = useRef(null);
    const resolvedFormRef = formRef || internalFormRef;
    const [normalizedData, setNormalizedData] = useState(() => buildContractPrefillData(dataJson));
    const [formVersion, setFormVersion] = useState(0);

    useEffect(() => {
        setNormalizedData(buildContractPrefillData(dataJson));
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
            setNormalizedData(buildContractPrefillData(importedData));
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
                <h3 className={styles.sectionTitle}>Thông tin hợp đồng chuyển nhượng phần vốn góp</h3>
                <div className={styles.grid2}>
                    <Field
                        label="Tên doanh nghiệp"
                        name="tenDoanhNghiep"
                        data={normalizedData}
                        styles={styles}
                        readOnly
                    />
                    <Field
                        label="Mã số doanh nghiệp"
                        name="maSoDoanhNghiep"
                        data={normalizedData}
                        styles={styles}
                        readOnly
                    />
                </div>
                <TextAreaField
                    label="Địa chỉ trụ sở công ty"
                    name="hopDong_diaChiCongTy"
                    data={normalizedData}
                    styles={styles}
                    readOnly
                />
                <div className={styles.grid2} style={{ marginTop: "12px" }}>
                    <Field label="Số hợp đồng" name="hopDong_so" data={normalizedData} styles={styles} />
                    <Field
                        label="Ngày ký hợp đồng"
                        name="hopDong_ngayKy"
                        data={normalizedData}
                        styles={styles}
                        type="date"
                    />
                    <Field label="Địa điểm ký" name="hopDong_diaDiemKy" data={normalizedData} styles={styles} />
                    <Field
                        label="Cơ quan đăng ký kinh doanh cấp giấy"
                        name="hopDong_coQuanDangKy"
                        data={normalizedData}
                        styles={styles}
                    />
                    <Field
                        label="Ngày cấp lần đầu"
                        name="hopDong_ngayCapLanDau"
                        data={normalizedData}
                        styles={styles}
                        type="date"
                    />
                    <Field
                        label="Đăng ký thay đổi lần thứ"
                        name="hopDong_lanThayDoi"
                        data={normalizedData}
                        styles={styles}
                        type="number"
                        min="1"
                        step="1"
                    />
                    <Field
                        label="Ngày đăng ký thay đổi gần nhất"
                        name="hopDong_ngayThayDoi"
                        data={normalizedData}
                        styles={styles}
                        type="date"
                    />
                </div>
            </div>

            <PartySection title="Bên A - Bên chuyển nhượng" prefix="benA" data={normalizedData} styles={styles} />
            <PartySection title="Bên B - Bên nhận chuyển nhượng" prefix="benB" data={normalizedData} styles={styles} />

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Thông tin phần vốn góp chuyển nhượng</h3>
                <div className={styles.grid2}>
                    <Field
                        label="Tỷ lệ phần vốn góp chuyển nhượng (%)"
                        name="chuyenNhuong_tyLe"
                        data={normalizedData}
                        styles={styles}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                    />
                    <AmountWithWordsField
                        amountLabel="Giá trị phần vốn góp (đồng)"
                        amountName="chuyenNhuong_giaTri"
                        wordsLabel="Giá trị phần vốn góp bằng chữ"
                        wordsName="chuyenNhuong_giaTriBangChu"
                        data={normalizedData}
                        styles={styles}
                    />
                    <AmountWithWordsField
                        amountLabel="Giá chuyển nhượng (đồng)"
                        amountName="chuyenNhuong_gia"
                        wordsLabel="Giá chuyển nhượng bằng chữ"
                        wordsName="chuyenNhuong_giaBangChu"
                        data={normalizedData}
                        styles={styles}
                    />
                </div>
            </div>
        </form>
    );
});

export default HopDongChuyenNhuongVonGopDeclaration;
