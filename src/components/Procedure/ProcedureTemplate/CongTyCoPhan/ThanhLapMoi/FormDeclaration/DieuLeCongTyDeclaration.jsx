import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import numberToVietnameseText from "@/utils/numberToVietnameseText";
import NganhNgheTable from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/NganhNgheTable/NganhNgheTable";
import Signature from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/Signature/Signature";
import deleteIcon from "@/assets/delete-icon.png";
import TenCongTySection from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/TenCongTySection";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { GioiTinhSelect, DanTocSelect, QuocTichSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

const EMPTY_CO_DONG_ROW = {
    hoTen: "",
    tongSoCoPhan_soLuong: "",
    tongSoCoPhan_giaTri: "",
    tyLe: "",
    loaiCoPhan_phoThong_soLuong: "",
    loaiCoPhan_phoThong_giaTri: "",
    loaiCoPhan_khac_soLuong: "",
    loaiCoPhan_khac_giaTri: "",
    loaiTaiSan: "",
    thoiHan: "",
};

const DieuLeCongTyDeclaration = forwardRef(function DieuLeCongTyDeclaration(
    { formId, dataJson, onSubmit, formRef },
    componentRef,
) {
    const [nganhNgheRows, setNganhNgheRows] = useState([]);
    const [coDongRows, setCoDongRows] = useState([]);
    const [loaiCoPhanKhacList, setLoaiCoPhanKhacList] = useState([""]);

    // States for auto format Mệnh giá
    const [menhGiaSo, setMenhGiaSo] = useState("");
    const [menhGiaChu, setMenhGiaChu] = useState("");
    const [cursor, setCursor] = useState(null);
    const menhGiaRef = useRef(null);

    // States for auto format Vốn điều lệ
    const [vonDieuLeSo, setVonDieuLeSo] = useState("");
    const [vonDieuLeChu, setVonDieuLeChu] = useState("");
    const [cursorVonDieuLe, setCursorVonDieuLe] = useState(null);
    const vonDieuLeRef = useRef(null);

    // States for Address
    const [provCodeTruSo, setProvCodeTruSo] = useState("");
    const { provinces: provincesTruSo, communes: communesTruSo, loadingCommunes: loadingCommunesTruSo } = useFetchAddress(provCodeTruSo);

    const [provCodeThuongTru, setProvCodeThuongTru] = useState("");
    const { provinces: provincesThuongTru, communes: communesThuongTru, loadingCommunes: loadingCommunesThuongTru } = useFetchAddress(provCodeThuongTru);

    const [provCodeLienLac, setProvCodeLienLac] = useState("");
    const { provinces: provincesLienLac, communes: communesLienLac, loadingCommunes: loadingCommunesLienLac } = useFetchAddress(provCodeLienLac);

    function formatNumber(val) {
        const raw = String(val).replace(/[^0-9]/g, "");
        if (!raw) return "";
        return Number(raw).toLocaleString("vi-VN");
    }

    const giayDeNghiData = useGetFormDataJsonFromName("Giấy đề nghị đăng ký doanh nghiệp");
    const danhSachCoDongData = useGetFormDataJsonFromName("Danh sách cổ đông sáng lập");

    const mergedData = { ...giayDeNghiData, ...dataJson };

    useEffect(() => {
        if (dataJson || giayDeNghiData || danhSachCoDongData) {
            setNganhNgheRows(dataJson?.nganhNgheList || giayDeNghiData?.nganhNgheList || []);

            let initialCoDongRows = [];
            if (dataJson?.coDongRows && dataJson.coDongRows.length > 0) {
                initialCoDongRows = dataJson.coDongRows;
            } else if (danhSachCoDongData?.coDongList && danhSachCoDongData.coDongList.length > 0) {
                initialCoDongRows = danhSachCoDongData.coDongList.map(item => ({
                    hoTen: item.hoTen || "",
                    tongSoCoPhan_soLuong: item.tongSoCoPhan_soLuong || "",
                    tongSoCoPhan_giaTri: item.tongSoCoPhan_giaTri || "",
                    tyLe: item.tyLe || "",
                    loaiCoPhan_phoThong_soLuong: item.loaiCoPhan_phoThong_soLuong || "",
                    loaiCoPhan_phoThong_giaTri: item.loaiCoPhan_phoThong_giaTri || "",
                    loaiCoPhan_khac_soLuong: item.loaiCoPhan_khac_soLuong || "",
                    loaiCoPhan_khac_giaTri: item.loaiCoPhan_khac_giaTri || "",
                    loaiTaiSan: item.loaiTaiSanGopVon || "",
                    thoiHan: item.thoiHanGopVon || "",
                }));
            }
            setCoDongRows(initialCoDongRows);

            let initialLoaiCoPhanKhacList = [""];
            if (dataJson?.loaiCoPhanKhacList && Array.isArray(dataJson.loaiCoPhanKhacList)) {
                initialLoaiCoPhanKhacList = dataJson.loaiCoPhanKhacList;
            } else if (giayDeNghiData?.loaiCoPhanKhacList && Array.isArray(giayDeNghiData.loaiCoPhanKhacList)) {
                initialLoaiCoPhanKhacList = giayDeNghiData.loaiCoPhanKhacList;
            } else if (danhSachCoDongData?.loaiCoPhanKhacList && Array.isArray(danhSachCoDongData.loaiCoPhanKhacList)) {
                initialLoaiCoPhanKhacList = danhSachCoDongData.loaiCoPhanKhacList;
            } else if (dataJson?.loaiCoPhanKhacTen || danhSachCoDongData?.loaiCoPhanKhac_ten || giayDeNghiData?.loaiCoPhanKhac_ten) {
                initialLoaiCoPhanKhacList = [dataJson?.loaiCoPhanKhacTen || danhSachCoDongData?.loaiCoPhanKhac_ten || giayDeNghiData?.loaiCoPhanKhac_ten];
            }
            setLoaiCoPhanKhacList(initialLoaiCoPhanKhacList);

            const menhGiaVal = dataJson?.menhGiaCoPhan_bangSo || giayDeNghiData?.menhGiaCoPhan || "";
            const parsed = formatNumber(String(menhGiaVal));
            setMenhGiaSo(parsed);

            if (dataJson?.menhGiaCoPhan_bangChu) {
                setMenhGiaChu(dataJson.menhGiaCoPhan_bangChu);
            } else if (parsed) {
                setMenhGiaChu(numberToVietnameseText(parsed));
            } else {
                setMenhGiaChu("");
            }

            const vonDieuLeVal = dataJson?.vonDieuLe || giayDeNghiData?.vonDieuLe || "";
            const parsedVonDieuLe = formatNumber(String(vonDieuLeVal));
            setVonDieuLeSo(parsedVonDieuLe);

            if (dataJson?.vonDieuLe_bangChu) {
                setVonDieuLeChu(dataJson.vonDieuLe_bangChu);
            } else if (parsedVonDieuLe) {
                setVonDieuLeChu(numberToVietnameseText(parsedVonDieuLe));
            } else {
                setVonDieuLeChu("");
            }
        } else {
            setNganhNgheRows([]);
            setCoDongRows([]);
            setLoaiCoPhanKhacList([""]);
            setMenhGiaSo("");
            setMenhGiaChu("");
            setVonDieuLeSo("");
            setVonDieuLeChu("");
        }
    }, [dataJson, giayDeNghiData, danhSachCoDongData]);

    useEffect(() => {
        if (cursorVonDieuLe !== null && vonDieuLeRef.current) {
            vonDieuLeRef.current.setSelectionRange(cursorVonDieuLe, cursorVonDieuLe);
            setCursorVonDieuLe(null);
        }
    }, [vonDieuLeSo, cursorVonDieuLe]);

    useEffect(() => {
        if (cursor !== null && menhGiaRef.current) {
            menhGiaRef.current.setSelectionRange(cursor, cursor);
            setCursor(null);
        }
    }, [menhGiaSo, cursor]);

    const handleChangeMenhGia = (e) => {
        const input = e.target;
        const val = input.value;
        const pos = input.selectionStart;
        const oldLen = val.length;

        const formatted = formatNumber(val);
        setMenhGiaSo(formatted);

        if (formatted) {
            setMenhGiaChu(numberToVietnameseText(formatted));
        } else {
            setMenhGiaChu("");
        }

        const diff = formatted.length - oldLen;
        setCursor(pos + diff);
    };

    const handleChangeVonDieuLe = (e) => {
        const input = e.target;
        const val = input.value;
        const pos = input.selectionStart;
        const oldLen = val.length;

        const formatted = formatNumber(val);
        setVonDieuLeSo(formatted);

        if (formatted) {
            setVonDieuLeChu(numberToVietnameseText(formatted));
        } else {
            setVonDieuLeChu("");
        }

        const diff = formatted.length - oldLen;
        setCursorVonDieuLe(pos + diff);
    };

    useImperativeHandle(componentRef, () => ({
        getDraftData: () => {
            if (!formRef?.current) return null;
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            data.nganhNgheList = nganhNgheRows;
            data.coDongRows = coDongRows;
            data.loaiCoPhanKhacList = loaiCoPhanKhacList;
            data.loaiCoPhanKhacTen = loaiCoPhanKhacList[0] || "";
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
            data.coDongRows = coDongRows;
            data.loaiCoPhanKhacList = loaiCoPhanKhacList;
            data.loaiCoPhanKhacTen = loaiCoPhanKhacList[0] || "";
            return data;
        },
        importData: (importedData) => {
            if (!importedData) return;
            setNganhNgheRows(importedData.nganhNgheList || []);
            setCoDongRows(importedData.coDongRows || []);

            if (importedData.loaiCoPhanKhacList && Array.isArray(importedData.loaiCoPhanKhacList)) {
                setLoaiCoPhanKhacList(importedData.loaiCoPhanKhacList);
            } else if (importedData.loaiCoPhanKhacTen) {
                setLoaiCoPhanKhacList([importedData.loaiCoPhanKhacTen]);
            } else {
                setLoaiCoPhanKhacList([""]);
            }

            if (importedData.menhGiaCoPhan_bangSo !== undefined) {
                const parsed = formatNumber(String(importedData.menhGiaCoPhan_bangSo));
                setMenhGiaSo(parsed);

                if (importedData.menhGiaCoPhan_bangChu) {
                    setMenhGiaChu(importedData.menhGiaCoPhan_bangChu);
                } else if (parsed) {
                    setMenhGiaChu(numberToVietnameseText(parsed));
                } else {
                    setMenhGiaChu("");
                }
            }

            if (importedData.vonDieuLe !== undefined) {
                const parsed = formatNumber(String(importedData.vonDieuLe));
                setVonDieuLeSo(parsed);

                if (importedData.vonDieuLe_bangChu) {
                    setVonDieuLeChu(importedData.vonDieuLe_bangChu);
                } else if (parsed) {
                    setVonDieuLeChu(numberToVietnameseText(parsed));
                } else {
                    setVonDieuLeChu("");
                }
            }
        },
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.nganhNgheList = nganhNgheRows;
        data.coDongRows = coDongRows;
        data.loaiCoPhanKhacList = loaiCoPhanKhacList;
        data.loaiCoPhanKhacTen = loaiCoPhanKhacList[0] || "";
        if (onSubmit) onSubmit(data);
    };

    const handleAddRow = () => {
        setCoDongRows([...coDongRows, { ...EMPTY_CO_DONG_ROW }]);
    };

    const handleDeleteRow = (idx) => {
        setCoDongRows(coDongRows.filter((_, i) => i !== idx));
    };

    const handleRowChange = (idx, e) => {
        const { name, value } = e.target;
        const newRows = [...coDongRows];
        newRows[idx] = { ...newRows[idx], [name]: value };
        setCoDongRows(newRows);
    };

    const handleAddKhac = () => {
        setLoaiCoPhanKhacList([...loaiCoPhanKhacList, ""]);
    };

    const handleRemoveKhac = (idx) => {
        setLoaiCoPhanKhacList(loaiCoPhanKhacList.filter((_, i) => i !== idx));
    };

    const handleKhacNameChange = (idx, val) => {
        const newList = [...loaiCoPhanKhacList];
        newList[idx] = val;
        setLoaiCoPhanKhacList(newList);
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={dataJson ? "loaded" : "empty"}>
            <TenCongTySection dataJson={mergedData} styles={styles} prefix="CÔNG TY CỔ PHẦN" />

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Thông tin địa chỉ trụ sở chính:</h3>
                
                <label className={styles.label} style={{ display: 'block', marginBottom: '8px' }}>Địa chỉ trụ sở chính:</label>
                <AddressSelect
                    provinces={provincesTruSo}
                    communes={communesTruSo}
                    onProvinceChange={(code) => setProvCodeTruSo(code)}
                    provinceName="truSo_tinh"
                    wardName="truSo_xa"
                    houseNumberName="truSo_soNha"
                    provinceDefault={mergedData?.truSo_tinh || ""}
                    wardDefault={mergedData?.truSo_xa || ""}
                    houseNumberDefault={mergedData?.truSo_soNha || ""}
                    isLoadingCommunes={loadingCommunesTruSo}
                />
                <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Điện thoại:</label>
                        <input type="tel" className={styles.input} name="truSo_phone" defaultValue={mergedData?.truSo_phone || ""} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Thư điện tử:</label>
                        <input type="email" className={styles.input} name="truSo_email" defaultValue={mergedData?.truSo_email || ""} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Website:</label>
                        <input type="text" className={styles.input} name="truSo_website" defaultValue={mergedData?.truSo_website || ""} />
                    </div>
                </div>
            </div>

            <div className={styles.sectionGroup}>
                <NganhNgheTable rows={nganhNgheRows} onChangeRows={setNganhNgheRows} />
            </div>

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Người đại diện theo pháp luật của công ty</h3>
                <input type="hidden" name="nguoiDaiDien_chucDanh" value="Giám đốc" />

                <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Họ và tên người đại diện theo pháp luật: <span style={{ color: "red" }}>*</span></label>
                        <input type="text" className={styles.input} name="nguoiDaiDien_hoTen" defaultValue={toUppercaseValue(mergedData?.nguoiDaiDien_hoTen)} required style={{ textTransform: "uppercase" }} onInput={handleUppercaseInput} />
                    </div>
                    <GioiTinhSelect name="nguoiDaiDien_gioiTinh" defaultValue={mergedData?.nguoiDaiDien_gioiTinh} required />
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Sinh ngày: <span style={{ color: "red" }}>*</span></label>
                        <DateInput className={styles.input} name="nguoiDaiDien_ngaySinh" defaultValue={mergedData?.nguoiDaiDien_ngaySinh || ""} required />
                    </div>
                    <DanTocSelect name="nguoiDaiDien_danToc" defaultValue={mergedData?.nguoiDaiDien_danToc || "Kinh"} required />
                    <QuocTichSelect name="nguoiDaiDien_quocTich" defaultValue={mergedData?.nguoiDaiDien_quocTich || "Việt Nam"} required />
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Số định danh cá nhân: <span style={{ color: "red" }}>*</span></label>
                        <input type="text" className={styles.input} name="nguoiDaiDien_cccd" defaultValue={mergedData?.nguoiDaiDien_cccd || ""} required />
                    </div>
                </div>

                <label className={styles.label} style={{ display: 'block', marginTop: '16px', marginBottom: '8px' }}>Địa chỉ thường trú:</label>
                <AddressSelect
                    provinces={provincesThuongTru}
                    communes={communesThuongTru}
                    onProvinceChange={(code) => setProvCodeThuongTru(code)}
                    provinceName="nguoiDaiDien_thuongTru_tinh"
                    wardName="nguoiDaiDien_thuongTru_xa"
                    houseNumberName="nguoiDaiDien_thuongTru_soNha"
                    provinceDefault={mergedData?.nguoiDaiDien_thuongTru_tinh || ""}
                    wardDefault={mergedData?.nguoiDaiDien_thuongTru_xa || ""}
                    houseNumberDefault={mergedData?.nguoiDaiDien_thuongTru_soNha || ""}
                    isLoadingCommunes={loadingCommunesThuongTru}
                />

                <label className={styles.label} style={{ display: 'block', marginTop: '16px', marginBottom: '8px' }}>Địa chỉ liên lạc:</label>
                <AddressSelect
                    provinces={provincesLienLac}
                    communes={communesLienLac}
                    onProvinceChange={(code) => setProvCodeLienLac(code)}
                    provinceName="nguoiDaiDien_tinh"
                    wardName="nguoiDaiDien_xa"
                    houseNumberName="nguoiDaiDien_soNha"
                    provinceDefault={mergedData?.nguoiDaiDien_tinh || ""}
                    wardDefault={mergedData?.nguoiDaiDien_xa || ""}
                    houseNumberDefault={mergedData?.nguoiDaiDien_soNha || ""}
                    isLoadingCommunes={loadingCommunesLienLac}
                />
            </div>

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>Vốn điều lệ:</h3>
                <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Vốn điều lệ của công ty là (bằng số): <span style={{ color: "red" }}>*</span></label>
                        <input type="text" className={styles.input} ref={vonDieuLeRef} name="vonDieuLe" value={vonDieuLeSo} onChange={handleChangeVonDieuLe} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Vốn điều lệ của công ty là (bằng chữ):</label>
                        <input type="text" className={styles.input} name="vonDieuLe_bangChu" value={vonDieuLeChu} readOnly />
                    </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: "16px" }}>
                    <label className={styles.label}>Tổng số cổ phần cổ đông sáng lập đăng ký mua: <span style={{ color: "red" }}>*</span></label>
                    <input type="text" className={styles.input} name="soCoPhanCoDongSangLap" defaultValue={mergedData?.soCoPhanCoDongSangLap || giayDeNghiData?.tongSoCoPhanDangKyMua || ""} required />
                </div>

                <div className={styles.grid2} style={{ marginTop: "16px" }}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Mệnh giá cổ phần (bằng số):</label>
                        <input type="text" className={styles.input} ref={menhGiaRef} name="menhGiaCoPhan_bangSo" value={menhGiaSo} onChange={handleChangeMenhGia} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Mệnh giá cổ phần (bằng chữ):</label>
                        <input type="text" className={styles.input} name="menhGiaCoPhan_bangChu" value={menhGiaChu} readOnly />
                    </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: "16px" }}>
                    <label className={styles.label}>Loại cổ phần: <span style={{ color: "red" }}>*</span></label>
                    <select className={styles.select} name="loaiCoPhan" defaultValue={mergedData?.loaiCoPhan || giayDeNghiData?.loaiCoPhan || "Phổ thông"}>
                        <option value="Phổ thông">Phổ thông</option>
                        <option value="Ưu đãi cổ tức">Ưu đãi cổ tức</option>
                        <option value="Ưu đãi hoàn lại">Ưu đãi hoàn lại</option>
                        <option value="Ưu đãi biểu quyết">Ưu đãi biểu quyết</option>
                    </select>
                </div>
            </div>

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>
                    Cổ đông sáng lập, số cổ phần, giá trị cổ phần của từng cổ đông sáng lập, thời hạn góp vốn:
                </h3>

                <div style={{ marginBottom: "10px" }}>
                    <button type="button" className={styles.btnPrimary} style={{ padding: "6px 16px", background: "#1b154b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={handleAddRow}>
                        Thêm dòng
                    </button>
                </div>

                <div className={styles.tableWrapper} style={{ overflowX: "auto" }}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th rowSpan={3} className={styles.th} style={{ minWidth: 40 }}>STT</th>
                                <th rowSpan={3} className={styles.th} style={{ minWidth: 150 }}>Tên cổ đông sáng lập</th>
                                <th colSpan={8 + (loaiCoPhanKhacList.length - 1) * 2} className={styles.th}>Vốn góp</th>
                                <th rowSpan={3} className={styles.th} style={{ minWidth: 120 }}>Thời hạn góp vốn</th>
                                <th rowSpan={3} className={styles.th} style={{ minWidth: 60 }}>Thao tác</th>
                            </tr>
                            <tr>
                                <th colSpan={2} className={styles.th}>Tổng số cổ phần</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 60 }}>Tỷ lệ (%)</th>
                                <th colSpan={2 + loaiCoPhanKhacList.length * 2} className={styles.th}>Loại cổ phần</th>
                                <th rowSpan={2} className={styles.th} style={{ minWidth: 160 }}>Loại tài sản, số lượng, giá trị tài sản góp vốn</th>
                            </tr>
                            <tr>
                                <th className={styles.th} style={{ minWidth: 80 }}>Số lượng</th>
                                <th className={styles.th} style={{ minWidth: 100 }}>Giá trị</th>
                                <th colSpan={2} className={styles.th}>Phổ thông</th>
                                {loaiCoPhanKhacList.map((ten, i) => (
                                    <th colSpan={2} key={i} className={styles.th} style={{ padding: "4px", position: "relative" }}>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Nhập loại cổ phần khác..."
                                            value={ten}
                                            onChange={(e) => handleKhacNameChange(i, e.target.value)}
                                            style={{
                                                outline: "none",
                                                border: "none",
                                                color: "#fff",
                                                textAlign: "center",
                                                backgroundColor: "transparent",
                                                fontWeight: "bold",
                                                width: "calc(100% - 40px)",
                                                margin: "0 auto",
                                                display: "block"
                                            }}
                                        />
                                        {i === loaiCoPhanKhacList.length - 1 && (
                                            <button type="button" onClick={handleAddKhac} style={{ position: "absolute", right: 2, top: "50%", transform: "translateY(-50%)", background: "#28a745", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", lineHeight: 1 }}>+</button>
                                        )}
                                        {i > 0 && (
                                            <button type="button" onClick={() => handleRemoveKhac(i)} style={{ position: "absolute", left: 2, top: "50%", transform: "translateY(-50%)", background: "#dc3545", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", lineHeight: 1 }}>-</button>
                                        )}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                {/* Dummy row for Sub-Sub-headers */}
                                <th colSpan={5} className={styles.th}></th>
                                <th className={styles.th} style={{ minWidth: 80 }}>Số lượng</th>
                                <th className={styles.th} style={{ minWidth: 100 }}>Giá trị</th>
                                {loaiCoPhanKhacList.map((_, i) => (
                                    <React.Fragment key={i}>
                                        <th className={styles.th} style={{ minWidth: 80 }}>Số lượng</th>
                                        <th className={styles.th} style={{ minWidth: 100 }}>Giá trị</th>
                                    </React.Fragment>
                                ))}
                                <th colSpan={3} className={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {coDongRows.length === 0 ? (
                                <tr>
                                    <td colSpan={12 + (loaiCoPhanKhacList.length - 1) * 2} className={styles.td} style={{ textAlign: "center", padding: "20px" }}>
                                        Chưa có cổ đông. Nhấn "Thêm dòng" để bắt đầu.
                                    </td>
                                </tr>
                            ) : (
                                coDongRows.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className={styles.td} style={{ textAlign: "center" }}>{idx + 1}</td>
                                        <td className={styles.td}>
                                            <input type="text" className={styles.input} name="hoTen" value={row.hoTen} onChange={(e) => handleRowChange(idx, e)} />
                                        </td>
                                        <td className={styles.td}>
                                            <input type="text" className={styles.input} name="tongSoCoPhan_soLuong" value={row.tongSoCoPhan_soLuong} onChange={(e) => handleRowChange(idx, e)} />
                                        </td>
                                        <td className={styles.td}>
                                            <input type="text" className={styles.input} name="tongSoCoPhan_giaTri" value={row.tongSoCoPhan_giaTri} onChange={(e) => handleRowChange(idx, e)} />
                                        </td>
                                        <td className={styles.td}>
                                            <input type="text" className={styles.input} name="tyLe" value={row.tyLe} onChange={(e) => handleRowChange(idx, e)} />
                                        </td>
                                        <td className={styles.td}>
                                            <input type="text" className={styles.input} name="loaiCoPhan_phoThong_soLuong" value={row.loaiCoPhan_phoThong_soLuong} onChange={(e) => handleRowChange(idx, e)} />
                                        </td>
                                        <td className={styles.td}>
                                            <input type="text" className={styles.input} name="loaiCoPhan_phoThong_giaTri" value={row.loaiCoPhan_phoThong_giaTri} onChange={(e) => handleRowChange(idx, e)} />
                                        </td>
                                        {loaiCoPhanKhacList.map((_, i) => {
                                            const slKey = i === 0 ? "loaiCoPhan_khac_soLuong" : `loaiCoPhan_khac_soLuong_${i}`;
                                            const gtKey = i === 0 ? "loaiCoPhan_khac_giaTri" : `loaiCoPhan_khac_giaTri_${i}`;
                                            return (
                                                <React.Fragment key={i}>
                                                    <td className={styles.td}>
                                                        <input type="text" className={styles.input} name={slKey} value={row[slKey] || ""} onChange={(e) => handleRowChange(idx, e)} />
                                                    </td>
                                                    <td className={styles.td}>
                                                        <input type="text" className={styles.input} name={gtKey} value={row[gtKey] || ""} onChange={(e) => handleRowChange(idx, e)} />
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                        <td className={styles.td}>
                                            <input type="text" className={styles.input} name="loaiTaiSan" value={row.loaiTaiSan} onChange={(e) => handleRowChange(idx, e)} />
                                        </td>
                                        <td className={styles.td}>
                                            <input type="text" className={styles.input} name="thoiHan" value={row.thoiHan} onChange={(e) => handleRowChange(idx, e)} />
                                        </td>
                                        <td className={styles.tdAction}>
                                            <img
                                                src={deleteIcon}
                                                alt="Xóa"
                                                onClick={() => handleDeleteRow(idx)}
                                                width="18"
                                                height="18"
                                                style={{ cursor: "pointer", display: "block", margin: "0 auto" }}
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
